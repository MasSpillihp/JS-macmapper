const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const createTable = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mac1 VARCHAR(17) NOT NULL,
        mac2 VARCHAR(17) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        accuracy FLOAT NOT NULL,
        details VARCHAR(255),
        ref VARCHAR(255)
      );
    `);
    connection.release();
    console.log("Table created successfully");
  } catch (err) {
    console.error(err);
  }
};

createTable();

const saveLocation = async (
  mac1,
  mac2,
  latitude,
  longitude,
  accuracy,
  details,
  ref
) => {
  try {
    const connection = await pool.getConnection();
    const query = `
      INSERT INTO locations (mac1, mac2, latitude, longitude, accuracy, details, ref)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [mac1, mac2, latitude, longitude, accuracy, details, ref];
    const [result, fields] = await connection.execute(query, values);
    connection.release();
    console.log(`Location saved successfully with ID ${result.insertId}`);
  } catch (err) {
    console.error(err);
  }
};

const lastSearch = async () => {
  try {
    const connection = await pool.getConnection();
    const query =
      "SELECT latitude, longitude, ref FROM locations ORDER BY id DESC LIMIT 1";
    const [rows, fields] = await connection.execute(query);
    connection.release();
    return rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  saveLocation,
  lastSearch,
};
