let Client     = require('mariasql');
let dbconfig   = require('./dbconfig.js')
let logger     = require('./logger.js')

//helper function to create where condition from object
// { id: 1, color: 'blue'} would turn into id=1 and color='blue'
function objectToWhere(obj) {
  return Object.keys(obj)
               .map(function(key) {
                   return key + '=:' + key
               })
               .join(" and ");
}

//helper function to create insert statements columnlistning
function objectToValueArray(obj) {
  return Object.keys(obj)
               .join(" , ");
}

//helper function to create insert statements value listning.
//created such that values are not passed but instead placeholders for them
function objectToParameterArray(obj) {
  return Object.keys(obj)
               .map(function(key) {
                   return ':' + key
                })
               .join(" , ");
}

function executeQuery(query, params, callback) {
  var dbClient = new Client(dbconfig);
  var prep = dbClient.prepare(query);
  var query_str = prep(params);
  logger.log(query_str);
  dbClient.query(query_str, callback);
}

module.exports = {

  selectAll : function(table, callback) {
      let rawquery = "SELECT * FROM " + table;
      executeQuery(rawquery, [table], callback);
  },

  selectById : function(table, id, callback) {
      let rawquery = "SELECT * FROM " + table + " WHERE id = :id";
      executeQuery(rawquery, {id : id}, callback);
  },

  //inserts into a table so that objects properties are translated as columns of table
  insertInto : function(table, obj, callback ) {
      let rawquery = "INSERT INTO " + table + " ( " + objectToValueArray(obj) + ") VALUES ( " + objectToParameterArray(obj) +  ");";
      executeQuery(rawquery, obj, callback);
  },

  //updates one field of a record in given table with corresponding id
  update : function(table, field, value, id, callback ) {
      let rawquery = "UPDATE " + table + " SET " + field + "=:value WHERE id=:id";
      executeQuery(rawquery, {value : value, id : id }, callback);
  },

  //deletes one record from table with given id
  deleteById  : function(table, id, callback) {
      let rawquery = "DELETE FROM " + table + " WHERE id=:id";
      executeQuery(rawquery, {id : id}, callback);
  }
};
