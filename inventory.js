const { db } = require('./database');

// Function to get the quantity of a specific item from the database
function getInventoryItemQuantity(itemName) {
  return new Promise((resolve, reject) => {
    db.get('SELECT quantity FROM inventory WHERE item = ?', [itemName], (err, row) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(row ? row.quantity : 0);
      }
    });
  });
}

// Function to update the quantity of an inventory item
async function updateInventoryItemQuantity(itemName, quantityChange) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE inventory SET quantity = quantity + ? WHERE item = ?',
      [quantityChange, itemName],
      (err) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(true);
        }
      }
    );
  });
}

module.exports = { getInventoryItemQuantity, updateInventoryItemQuantity };
