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
    );
  `);

  // KIỂM TRA BẢNG TRỐNG
  const row = await db.getFirstAsync<{ cnt: number }>(
    `SELECT COUNT(*) AS cnt FROM grocery_items`
  );

  if (row?.cnt === 0) {
    const now = Date.now();

    await db.runAsync(
      `INSERT INTO grocery_items (name, quantity, category, bought, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      ["Sữa", 1, "Đồ uống", 0, now]
    );

    await db.runAsync(
      `INSERT INTO grocery_items (name, quantity, category, bought, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      ["Trứng", 12, "Thực phẩm", 0, now]
    );

    await db.runAsync(
      `INSERT INTO grocery_items (name, quantity, category, bought, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      ["Bánh mì", 1, "Bakery", 0, now]
    );
  }
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

export const toggleBoughtGrocery = async (db: SQLiteDatabase, id: number) => {
  await db.runAsync(
    `
      UPDATE grocery_items
      SET bought = CASE WHEN bought = 0 THEN 1 ELSE 0 END
      WHERE id = ?
    `,
    [id]
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
