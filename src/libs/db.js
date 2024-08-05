/* import mysql from 'mysql2/promise';

// Configura la conexión a la base de datos
const pool = mysql.createPool({
  host: 'viaduct.proxy.rlwy.net',   
  port: 34447,   
  user: 'root',           
  password: 'gezvgeVigQtQJfkduPfRHQnCAkTHDVZY',    
  database: 'railway',  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}); 

export default pool  */  

import mysql from 'mysql2/promise';

// Configura la conexión a la base de datos
const connection  = mysql.createPool({
  host: 'localhost',   
  user: 'root',           
  password: 'root',  
  database: 'sistemaerp', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default connection   

