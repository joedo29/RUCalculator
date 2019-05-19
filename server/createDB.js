const CosmosClient = require('@azure/cosmos').CosmosClient;

const config = require('./config');

const endpoint = config.endpoint;
const masterKey = config.primaryKey;

const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });

const HttpStatusCodes = { NOTFOUND: 404 };

const databaseId = config.database.id;
const containerId = config.container.id;

/**
* Create the database if it does not exist
*/
async function createDatabase() {
  const { database } = await client.databases.createIfNotExists({ id: databaseId });
  console.log(`Created database:\n${database.id}\n`);
}

/**
* Read the database definition
*/
async function readDatabase() {
  const { body: databaseDefinition } = await client.database(databaseId).read();
  console.log(`Reading database:\n${databaseDefinition.id}\n`);
}

/**
* Create the container if it does not exist
*/
async function createContainer() {
  const { container } = await client.database(databaseId).containers.createIfNotExists({ id: containerId });
  console.log(`Created container:\n${config.container.id}\n`);
}

/**
* Read the container definition
*/
async function readContainer() {
  const { body: containerDefinition } = await client.database(databaseId).container(containerId).read();
  console.log(`Reading container:\n${containerDefinition.id}\n`);
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

createDatabase()
  .then(() => readDatabase())
  .then(() => createContainer())
  .then(() => readContainer())
  .then(() => { exit(`Completed successfully`); })
  .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });
