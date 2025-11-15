import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { Grocery } from "types/Grocery";

export const createTable = async (db: SQLiteDatabase) => {
  await db.execAsync(`
        CREATE TABLE IF NOT EXISTS grocery_items(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            quantity INTEGER DEFAULT 1,
            category TEXT,
            bought INTEGER DEFAULT 0,
            created_at INTEGER
        )
        `);
};

//CRUD

export const createGrocery = async (db: SQLiteDatabase, data: Grocery) => {
  await db.runAsync(
    `
        INSERT INTO grocery_items(name, quantity, category) VALUES (?,?,?)
        `,
    [data.name, data.quantity, data.category]
  );
};

export const readAllGroceries = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<Grocery>(
    `
        SELECT * FROM grocery_items
        `,
    []
  );
};

export const readGroceryById = async (db: SQLiteDatabase, id: number) => {
  return await db.getFirstAsync<Grocery>(
    `
        SELECT * FROM grocery_items WHERE id = ?
        `,
    [id]
  );
};

export const updateGrocery = async (db: SQLiteDatabase, data: Grocery) => {
  await db.runAsync(
    `
        UPDATE grocery_items SET name = ?, quantity = ?, category = ? WHERE id = ?
        `,

    [data.name, data.quantity, data.category, data.id]
  );
};

export const deleteGrocery = async (db: SQLiteDatabase, id: number) => {
  await db.runAsync(
    `
        DELETE FROM grocery_items WHERE id = ?
        `,

    [id]
  );
};
