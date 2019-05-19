const CosmosClient = require('@azure/cosmos').CosmosClient;

const config = require('./config');

const endpoint = config.endpoint;
const masterKey = config.primaryKey;

const databaseId = config.database.id;
const containerId = config.container.id;

const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });

const HttpStatusCodes = { NOTFOUND: 404 };

/**
* Create item 
*/
async function createItemAsync(itemBody, print, object) {
  try {
      let request = await client.database(databaseId).container(containerId).items.create(itemBody);
      object.create = request.headers['x-ms-request-charge'];
      if(print){
        console.log(`Created family item with id:\n${request.item.id} with RU of: ` + request.headers['x-ms-request-charge'] + '. \n');
      }
      return request.item.id;
  } catch(error) {
      console.log(error);
      throw error;
  }
};

/**
* Query the container using SQL
 */
async function readItemAsync(id, print, object) {
  try {
    let request = await client.database(databaseId).container(containerId).item(id).read();
    object.read = request.headers['x-ms-request-charge'];
    if(print){
      console.log(`Read item:\n${id} with RU of: ` + request.headers['x-ms-request-charge'] + '. \n');
    }
    return id;
  } catch(error) {
    console.log(error);
    throw error;
  }
};

/**
* Replace the item by ID.
*/
async function updateItemAsync(id, newItemBody, print, object) {
  try {
    if(print){
      console.log(`Replacing item:\n${id}\n`);
    }
    //New JSON document to replace old one must have id in there 

    //We create a new ID each time that has the same autogererated format 
    //as if you created a new document with no id on CosmosDB. 
    if(!('id' in newItemBody)){
      newItemBody["id"] = generateGuidId();
    }
    let request = await client.database(databaseId).container(containerId).item(id).replace(newItemBody);
    object.update = request.headers['x-ms-request-charge'];
    if(print){
      console.log(`Replaced item. The new id is:${newItemBody["id"]} with RU of: ` + request.headers['x-ms-request-charge'] + '. \n');
    }
    return newItemBody["id"];
  } catch(error) {
    console.log(error);
    throw error;
  }
};

/**
* Delete the item by ID.
*/
async function deleteItemAsync(id, print, change, object) {
  try {
    let request = await client.database(databaseId).container(containerId).item(id).delete();
    if(change){
      object.delete = request.headers['x-ms-request-charge'];
    }
    if(print){
      console.log(`Deleted item:\n${id} with RU of: ` + request.headers['x-ms-request-charge'] + '. \n');
    }
  } catch(error) {
    console.log(error);
    throw error;
  }
};

/**
 * generateGuidId() was copied from the helper TypeScript file from the Azure 
 * CosmosDB repo and reformatted for traditional JS syntax. 
 * 
 * This is used to continue making random ID's for replacement document bodies
 * regardless if it has an ID field or not. At the end of the day, it all 
 * depends on the user if he or she will add in the id and how he/she tracks 
 * the id with the respective file. 
 */
function generateGuidId() {
  var id = "";
        
    for (var i = 0; i < 8; i++) {
        id += getHexaDigit();
    }
    
    id += "-";
    
    for (var i = 0; i < 4; i++) {
        id += getHexaDigit();
    }
    
    id += "-";
    
    for (var i = 0; i < 4; i++) {
        id += getHexaDigit();
    }
    
    id += "-";
    
    for (var i = 0; i < 4; i++) {
        id += getHexaDigit();
    }
    
    id += "-";
    
    for (var i = 0; i < 12; i++) {
        id += getHexaDigit();
    }
        
    return id;
};

/**
 * getHexaDigit() was copied from the helper TypeScript file from the Azure 
 * CosmosDB repo. 
 */
function getHexaDigit() {
  return Math.floor(Math.random() * 16).toString(16);
};

/**
* Exit the app with a prompt
* @param {message} message - The message to display
*/
function exit(message) {
  console.log(message);
  console.log('Press any key to exit');
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', process.exit.bind(process, 0));
};


async function startDebugTest() {
  var object = {create:0.0, read:0.0, update:0.0, delete:0.0};
  return object;
};

//Inputs must be JSON, updateJSON can be null if there is no update comparison file. 
async function calculateAsync(sourceJSON, updateJSON) {
  var object = {create:0.0, read:0.0, update:0.0, delete:0.0};
  if(updateJSON !== null){
    createItemAsync(sourceJSON, false, object)
    .then((id) => readItemAsync(id, false, object))
    .then((id) => deleteItemAsync(id, false, true, object))
    .then(() => createItemAsync(sourceJSON, false, object))
    .then((id) => updateItemAsync(id, updateJSON, false, object))
    .then((id) => deleteItemAsync(id, false, false, object))
    .then(() => { 
      console.log(object.create);
      console.log(object.read);
      console.log(object.update);
      console.log(object.delete);
      return object;})	
    .catch((error) => { exit(`Completed with error ${error}`) });
  }else{
    createItemAsync(sourceJSON, false, object)
    .then((id) => readItemAsync(id, false, object))
    .then((id) => deleteItemAsync(id, false, true, object))
    .then(() => { 
      console.log(object.create);
      console.log(object.read);
      console.log(object.update);
      console.log(object.delete);
      return object;})	
    .catch((error) => { exit(`Completed with error ${error}`) });
  }
};

//TESTS: 


console.log("Test1: Anderson family (with id)");
console.log("-----------------------------------");
var object = startDebugTest()
.then(() => createItemAsync(config.items.Andersen, true, object))
.then((id) => readItemAsync(id, true, object))
.then((id) => deleteItemAsync(id, true, true, object))
.then(() => createItemAsync(config.items.Andersen, false, object))
.then((id) => updateItemAsync(id, config.items.Wakefield, true, object))
.then((id) => deleteItemAsync(id, true, false, object))
.then(() => { 
  console.log(object.create);
  console.log(object.read);
  console.log(object.update);
  console.log(object.delete); 
  exit(`Completed tests successfully`);
  console.log("--------------------------------------------------------");
})	
.catch((error) => {
   exit(`Completed with error ${error}`); 
   console.log("--------------------------------------------------------");
  });



/*
console.log("Custom async method test");
var output = calculateAsync(config.items.Andersen, config.items.Wakefield);
var output2 = calculateAsync(config.items.Wakefield, config.items.Andersen);
*/

/*
console.log("Test2: Wakefield family (no id)");
console.log("-----------------------------------")
var object = startDebugTest()
.then(() => createItemAsync(config.items.Wakefield, true, object))
.then((id) => readItemAsync(id, true, object))
.then((id) => deleteItemAsync(id, true, true, object))
.then(() => createItemAsync(config.items.Wakefield, false, object))
.then((id) => updateItemAsync(id, config.items.Andersen, true, object))
.then((id) => deleteItemAsync(id, false, false, object))
.then(() => { 
  console.log(object.create);
  console.log(object.read);
  console.log(object.update);
  console.log(object.delete);
  exit(`Completed tests successfully`); 
  console.log("--------------------------------------------------------");
})	
.catch((error) => { 
  exit(`Completed with error ${error}`) ;
  console.log("--------------------------------------------------------");
});
*/
