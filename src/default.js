/**
* Create family item if it does not exist
*/
async function createFamilyItem(itemBody) {
  try {
      // read the item to see if it exists
      const { item } = await client.database(databaseId).container(containerId).item(itemBody.id).read();
      console.log(`Item with family id ${itemBody.id} already exists\n`);
  }
  catch (error) {
     // create the family item if it does not exist
     if (error.code === HttpStatusCodes.NOTFOUND) {
         const { item } = await client.database(databaseId).container(containerId).items.create(itemBody);
         console.log(`Created family item with id:\n${itemBody.id}\n`);
     } else {
         throw error;
     }
  }
};
