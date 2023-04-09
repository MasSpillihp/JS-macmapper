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
        mac_address VARCHAR(17) NOT NULL,
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
    console.log(process.env.MYSQL_PASSWORD);
    console.error(err);
  }
};

createTable();

const saveLocation = async (
  macAddress,
  latitude,
  longitude,
  accuracy,
  details,
  ref
) => {
  try {
    const connection = await pool.getConnection();
    const query = `
      INSERT INTO locations (mac_address, latitude, longitude, accuracy, details, ref)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [macAddress, latitude, longitude, accuracy, details, ref];
    const [result, fields] = await connection.execute(query, values);
    connection.release();
    console.log(`Location saved successfully with ID ${result.insertId}`);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  saveLocation,
};
