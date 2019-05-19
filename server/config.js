/**
 * All code here was provided by Microsoft's Azure CosmosDB NodeJS tutorial. 
 */
var config = {}

config.endpoint = "https://c04f690e-0ee0-4-231-b9ee.documents.azure.com:443/";
config.primaryKey = "CxNb7IDdHfec44MjV1ZkVsZO6bCEotf9moYxvi6Sbs2vXwthgqw66qgDWqfLiT6FEd42ZsPX3G3Z2Q7zFa4MYQ==";

config.database = {
   "id": "TestingDB"
};

config.container = {
  "id": "TestingCollection"
};

config.items = {
   "Andersen": {
       "id": "Anderson.1",
       "lastName": "Andersen",
       "parents": [{
         "firstName": "Thomas"
     }, {
             "firstName": "Mary Kay"
         }],
     "children": [{
         "firstName": "Henriette Thaulow",
         "gender": "female",
         "grade": 5,
         "pets": [{
             "givenName": "Fluffy"
         }]
     }],
     "address": {
         "state": "WA",
         "county": "King",
         "city": "Seattle"
     }
 },
 "Wakefield": {
     "parents": [{
         "familyName": "Wakefield",
         "firstName": "Robin"
     }, {
             "familyName": "Miller",
             "firstName": "Ben"
         }],
     "children": [{
         "familyName": "Merriam",
         "firstName": "Jesse",
         "gender": "female",
         "grade": 8,
         "pets": [{
             "givenName": "Goofy"
         }, {
                 "givenName": "Shadow"
             }]
     }, {
             "familyName": "Miller",
             "firstName": "Lisa",
             "gender": "female",
             "grade": 1
         }],
     "address": {
         "state": "NY",
         "county": "Manhattan",
         "city": "NY"
     },
     "isRegistered": false
   }
};

module.exports = config;
