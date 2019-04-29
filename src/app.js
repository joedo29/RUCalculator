const CosmosClient = require('@azure/cosmos').CosmosClient;

const config = require('./config');

const endpoint = config.endpoint;
const masterKey = config.primaryKey;

const databaseId = config.database.id;
const containerId = config.container.id;

const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });

const HttpStatusCodes = { NOTFOUND: 404 };

/**
* Read the database definition
*/
async function readDatabase() {
  const { body: databaseDefinition } = await client.database(databaseId).read();
 console.log(`Reading database:\n${databaseDefinition.id}\n`);
}

/**
* Create family item if it does not exist
*/
async function createItem(itemBody, print) {
  try {
      let request = await client.database(databaseId).container(containerId).items.create(itemBody);
      if(print)
        console.log(`Created family item with id:\n${request.item.id} with RU of: ` + request.headers['x-ms-request-charge'] + '. \n');
      return request.item.id;
  } catch(error) {
      console.log(error);
      throw error;
  }
};

/**
* Query the container using SQL
 */
async function readItem(id) {
  try {
    let request = await client.database(databaseId).container(containerId).item(id).read();
    console.log(`Read item:\n${id} with RU of: ` + request.headers['x-ms-request-charge'] + '. \n');
    return id;
  } catch(error) {
    console.log(error);
    throw error;
  }
};

// ADD THIS PART TO YOUR CODE
/**
* Replace the item by ID.
*/
async function updateItem(id, newItemBody) {
  try {
    console.log(`Replacing item:\n${id}\n`);
    
    //New JSON document to replace old one must have id in there 

    //We create a new ID each time that has the same autogererated format 
    //as if you created a new document with no id on CosmosDB. 
    if(!('id' in newItemBody))
      newItemBody["id"] = generateGuidId();
    
    let request = await client.database(databaseId).container(containerId).item(id).replace(newItemBody);
    console.log(`Replaced item. The new id is:${newItemBody["id"]} with RU of: ` + request.headers['x-ms-request-charge'] + '. \n');
    return newItemBody["id"];
  } catch(error) {
    console.log(error);
    throw error;
  }
};

/**
* Delete the item by ID.
*/
async function deleteItem(id, print) {
  try {
    let request = await client.database(databaseId).container(containerId).item(id).delete();
    if(print)
      console.log(`Deleted item:\n${id} with RU of: ` + request.headers['x-ms-request-charge'] + '. \n');
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
}

/**
 * getHexaDigit() was copied from the helper TypeScript file from the Azure 
 * CosmosDB repo. 
 */
function getHexaDigit() {
  return Math.floor(Math.random() * 16).toString(16);
}

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
}

//TESTS: 
console.log("Test1: Anderson family (with id)");
console.log("-----------------------------------");
createItem(config.items.Andersen, true)
.then((id) => readItem(id))
.then((id) => deleteItem(id, true))
.then(() => createItem(config.items.Andersen, false))
.then((id) => updateItem(id, config.items.Wakefield))
.then((id) => deleteItem(id, true))
.then(() => { exit(`Completed tests successfully`); })	
.catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });
console.log("--------------------------------------------------------");

/*
console.log("Test2: Wakefield family (no id)");
console.log("-----------------------------------")
createItem(config.items.Wakefield, true)
.then((id) => readItem(id))
.then((id) => deleteItem(id, true))
.then(() => createItem(config.items.Wakefield, false))
.then((id) => updateItem(id, config.items.Andersen))
.then((id) => deleteItem(id, true))
.then(() => { exit(`Completed tests successfully`); })	
.catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });
*/