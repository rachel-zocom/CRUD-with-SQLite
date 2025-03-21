//Öppnar anslutningen till en SQLite-databas (database.db)
//Skapar tabellerna 'users och 'posts', om de inte redan finns
//Exporterar db så vi kan använda den i andra filer

//Importera better-sqlite3 för att hantera SQLite-databasen
const Database = require("better-sqlite3");

//Skapar databasanslutning till "database.db"
//'verbose: console.log' gör att alla SQL-frågor loggas i konsolen (bra för debugging)
const db = new Database("./database.db", { verbose: console.log });

//Skapar tabellen 'users' om den inte redan finns
db.exec(`
	CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	email TEXT UNIQUE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)
	`);

//Skapar tabellen 'posts' med en koppling 'users'
db.exec(`
	CREATE TABLE IF NOT EXISTS posts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL,
	title TEXT NOT NULL, 
	content TEXT NOT NULL, 
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	)
	`);

	//Exporterar databasinstansen så att den kan användas i andra filer
	module.exports = db;