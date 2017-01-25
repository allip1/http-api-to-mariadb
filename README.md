# http-api-to-mariadb
Simple http get/post/put/delete api to mariadb on top on node and express
Tool for prototyping rest api. Lacking error checking, input sanitation etc..

#To run
add database configurations to dbconfig.js file
run: npm install
     npm start

Api should be running at post 8080

#Usage
get localhost:8080/api/:object
selects all rows from table :object

get localhost:8080/api/:object/:id
selects row from table :object with id = :id

post localhost:8080/api/:object
inserts into table :object object comming in body.

patch localhost:8080/api/:object/:id
expects body to contain field and value properties
updates row in table :object

delete localhost:8080/api/:object/:id
deletes row from table :object

