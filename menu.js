const { db } = require('./database');
const { getInventoryItemQuantity, updateInventoryItemQuantity } = require('./inventory');

// Function to get item ingredients
function getMenuIngredients(itemName) {
  return new Promise((resolve, reject) => {
    db.get('SELECT ingredient1, quantity1, ingredient2, quantity2 FROM menu WHERE item = ?', [itemName], (err, row) => {
      if (err) {
        reject(err.message);
      } else if (!row) {
        // Handle the case where the item does not exist in the menu
        reject('Item not found in the menu');
      } else {
        resolve({
          ingredient1: row.ingredient1,
          quantity1: row.quantity1,
          ingredient2: row.ingredient2,
          quantity2: row.quantity2,
        });
      }
    });
  });
}


// Function to check if an item can be sold
async function canSellItem(itemName) {
  const itemIngredients = await getMenuIngredients(itemName);

  if (!itemIngredients.ingredient1) {
    return false;
  }

  let shortage = false;

  const availableQuantity1 = await getInventoryItemQuantity(itemIngredients.ingredient1);
  if (availableQuantity1 < itemIngredients.quantity1) {
    console.log(`Insufficient ${itemIngredients.ingredient1} for ${itemName}`);
    shortage = true;
  }

  if (itemIngredients.ingredient2) {
    const availableQuantity2 = await getInventoryItemQuantity(itemIngredients.ingredient2);
    if (availableQuantity2 < itemIngredients.quantity2) {
      console.log(`Insufficient ${itemIngredients.ingredient2} for ${itemName}`);
      shortage = true;
    }
  }

  return !shortage;
}

// Function to sell an item
async function sellItem(productName) {
  const productIngredients = await getMenuIngredients(productName);
  if (!productIngredients) {
    throw new Error(`Product "${productName}" not found.`);
  }

  // Check if there are enough ingredients to sell the product
  const canSell = await canSellItem(productName);
  if (!canSell) {
    throw new Error(`Not enough ingredients to sell ${productName}`);
  }

  // Update the ingredient quantities in the inventory
  const updatePromises = [];
  if (productIngredients.ingredient1) {
    updatePromises.push(updateInventoryItemQuantity(productIngredients.ingredient1, -productIngredients.quantity1));
  }
  if (productIngredients.ingredient2) {
    updatePromises.push(updateInventoryItemQuantity(productIngredients.ingredient2, -productIngredients.quantity2));
  }
  if (productIngredients.ingredient3) {
    updatePromises.push(updateInventoryItemQuantity(productIngredients.ingredient3, -productIngredients.quantity3));
  }
  
  // Reduce the cup quantity by 1 for each product sold
  updatePromises.push(updateInventoryItemQuantity("cup", -1));

  // Wait for all updates to complete
  await Promise.all(updatePromises);

  return true;
}


module.exports = { getMenuIngredients, canSellItem, sellItem };
