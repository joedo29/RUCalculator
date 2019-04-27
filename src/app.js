const CosmosClient = require('@azure/cosmos').CosmosClient;

const config = require('./config');

const endpoint = config.endpoint;
const masterKey = config.primaryKey;

const databaseId = config.database.id;
const containerId = config.container.id;

const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });

const HttpStatusCodes = { NOTFOUND: 404 };
const uuidv1 = require('uuid/v1');

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
    
    //If we update document, do we continue using old id or 
    //use a new id
    
    //JSON document must have id in there 

    //We can create a new ID each time but it has to be manual, 
    //or we can reuse the id 
    if(!('id' in newItemBody))
      newItemBody["id"] = uuidv1();
    
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

/*
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
*/
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
