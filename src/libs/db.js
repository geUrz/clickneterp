import mysql from 'mysql2/promise';

// Configura la conexión a la base de datos
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'clickneterp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connectionClicknetControl = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'clicknetmxcontrol',
});

export { connection, connectionClicknetControl }
