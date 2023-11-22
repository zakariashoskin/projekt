const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('storage.db');

// Function to initialize the database
function initializeDatabase() {
  // Create and populate the inventory table
  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY, item TEXT UNIQUE, quantity INTEGER)');
    const items = [
      { item: "coffee beans", quantity: 1000 },
      { item: "whole milk", quantity: 100 },
      { item: "oat milk", quantity: 100 },
      { item: "water", quantity: 100 },
      { item: "oranges", quantity: 100 },
      { item: "apples", quantity: 100 },
      { item: "strawberries", quantity: 100 },
      { item: "blueberries", quantity: 100 },
      { item: "watermelon", quantity: 100 },
      { item: "pineapples", quantity: 100 },
      { item: "lemons", quantity: 100 },
      { item: "caramel", quantity: 100 },
      { item: "chocolate syrup", quantity: 100 },
      { item: "ice", quantity: 100 },
      { item: "vanilla ice cream", quantity: 100 },
      { item: "cup", quantity: 100 }
    ];

    const stmt = db.prepare('INSERT OR IGNORE INTO inventory (item, quantity) VALUES (?, ?)');
    items.forEach(item => stmt.run(item.item, item.quantity));
    stmt.finalize();
  });

  // Create and populate the menu table
  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY, item TEXT UNIQUE, ingredient1 TEXT, quantity1 INTEGER, ingredient2 TEXT, quantity2 INTEGER, ingredient3 TEXT, quantity3 INTEGER)');
    const menu = [
      // Coffee Options
      { item: "Caffe Latte", ingredient1: "coffee beans", quantity1: 10, ingredient2: "whole milk", quantity2: 3, ingredient3: "cup", quantity3: 1 },
      { item: "Espresso", ingredient1: "coffee beans", quantity1: 7, ingredient2: "water", quantity2: 1, ingredient3: "cup", quantity3: 1 },
      { item: "Cappuccino", ingredient1: "coffee beans", quantity1: 8, ingredient2: "whole milk", quantity2: 3, ingredient3: "cup", quantity3: 1 },
      { item: "Mocha", ingredient1: "coffee beans", quantity1: 9, ingredient2: "chocolate syrup", quantity2: 2, ingredient3: "cup", quantity3: 1 },
      { item: "Americano", ingredient1: "coffee beans", quantity1: 6, ingredient2: "water", quantity2: 4, ingredient3: "cup", quantity3: 1 },
      { item: "Macchiato", ingredient1: "coffee beans", quantity1: 8, ingredient2: "caramel", quantity2: 2, ingredient3: "cup", quantity3: 1 },
      { item: "Affogato", ingredient1: "coffee beans", quantity1: 7, ingredient2: "vanilla ice cream", quantity2: 1, ingredient3: "cup", quantity3: 1 },
      { item: "Iced Coffee", ingredient1: "coffee beans", quantity1: 12, ingredient2: "ice", quantity2: 6, ingredient3: "cup", quantity3: 1 },

      // Juice Options
      { item: "Orange Juice", ingredient1: "oranges", quantity1: 3, ingredient2: "water", quantity2: 1, ingredient3: "cup", quantity3: 1 },
      { item: "Apple Juice", ingredient1: "apples", quantity1: 2, ingredient2: "water", quantity2: 1, ingredient3: "cup", quantity3: 1 },
      { item: "Strawberry Smoothie", ingredient1: "strawberries", quantity1: 5, ingredient2: "whole milk", quantity2: 2, ingredient3: "cup", quantity3: 1 },
      { item: "Blueberry Smoothie", ingredient1: "blueberries", quantity1: 4, ingredient2: "whole milk", quantity2: 2, ingredient3: "cup", quantity3: 1 },
      { item: "Mixed Berry Juice", ingredient1: "blueberries", quantity1: 2, ingredient2: "water", quantity2: 2, ingredient3: "cup", quantity3: 1 },
      { item: "Pineapple Juice", ingredient1: "pineapples", quantity1: 3, ingredient2: "water", quantity2: 1, ingredient3: "cup", quantity3: 1 },
      { item: "Watermelon Juice", ingredient1: "watermelons", quantity1: 4, ingredient2: "water", quantity2: 2, ingredient3: "cup", quantity3: 1 },
      { item: "Lemonade", ingredient1: "lemons", quantity1: 4, ingredient2: "water", quantity2: 2, ingredient3: "cup", quantity3: 1 }
    ];

    const stmt = db.prepare('INSERT OR IGNORE INTO menu (item, ingredient1, quantity1, ingredient2, quantity2, ingredient3, quantity3) VALUES (?, ?, ?, ?, ?, ?, ?)');
    menu.forEach(item => stmt.run(item.item, item.ingredient1, item.quantity1, item.ingredient2, item.quantity2, item.ingredient3, item.quantity3));
    stmt.finalize();
  });
}

// Function to get products from the database
function getProducts() {
  return new Promise((resolve, reject) => {
    db.all('SELECT item FROM inventory', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const products = rows.map((row) => row.item);
        resolve(products);
      }
    });
  });
}

// Function to get inventory data from the database
function getInventory() {
  return new Promise((resolve, reject) => {
    db.all('SELECT item, quantity FROM inventory', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const inventory = rows.map((row) => ({ name: row.item, quantity: row.quantity }));
        resolve(inventory);
      }
    });
  });
}

// Function to get menu data from the database
function getMenu() {
  return new Promise((resolve, reject) => {
    db.all('SELECT item, quantity1, quantity2, quantity3 FROM menu', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const menu = rows.map((row) => ({
          item: row.item,
          quantity: row.quantity1 + row.quantity2 + row.quantity3,
        }));
        resolve(menu);
      }
    });
  });
}

module.exports = { db, initializeDatabase, getProducts, getInventory, getMenu };