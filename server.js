'use strict'
let express    = require('express');
let bodyParser = require('body-parser');

let database   = require('./database.js');
let logger     = require('./logger.js');

let app        = express();

// to get data from POST body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 8080;

//helper function to avoid boilerplate in respoding
//to request in query callbacks
//res is http respond
function respondToRequestWith(res) {
    //err and rows are callback parameters from mariadb
    return function(err, rows) {
        if(err) {
            logger.log(err);
            res.status(500)
               .send(err);
        } else {
            res.json(rows);
        }
    }
}

let apiRouter = express.Router();

//logging every request for debugging.
apiRouter.use(function(req, res, next) {
    logger.log("body");
    logger.log(JSON.stringify(req.body));
    logger.log("params")
    logger.log(JSON.stringify(req.params));
    next(); // to next route
});

//route for get by id, update field by id and delete by id
//object is table's name and id is identifier
apiRouter.route('/:object/:id')

          //http get for 'select * from :object where :id=id'
         .get(function(req, res) {

             let obj = req.params.object;
             let id  = req.params.id;

             database.selectById(obj, id, respondToRequestWith(res));
         })

         //http patch for 'update :object set :field = :value where id=:id'
         //field is read from bodys field and value is bodys value-field
         //return info from affected rows
         .patch(function(req, res) {

             let obj = req.params.object;
             let id  = req.params.id;
             let field = req.body.field;
             let value = req.body.value;

             database.update(obj, field, value, id, respondToRequestWith(res));
         })

         //http delete for 'delete from :object where id=:id'
         //return info from affected rows
         .delete(function(req, res) {

             let obj = req.params.object;
             let id  = req.params.id;

             database.deleteById(obj, id, respondToRequestWith(res));
         });

//Generic selecting all records from table and insert to a table
//object is corresponding table's name
apiRouter.route('/:object')

          //http get for 'select * from :object where :id=id'
         .get(function(req, res) {

            let obj = req.params.object;

            database.selectAll(obj, respondToRequestWith(res));
         })

         //http post for 'insert into :object (body.key1, body.key2, .. ) values (body.key1, body.key2, ..)'
         //inserted values are read from body
         //bodys field keys are column names and corresponding value are inserted to the table
         .post(function(req, res) {

             let obj = req.params.object;
             let objToInsert = req.body;

             database.insertInto(obj, objToInsert, respondToRequestWith(res));
         });

// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

console.log("Listening at ", port);
// START THE SERVER
app.listen(port);
