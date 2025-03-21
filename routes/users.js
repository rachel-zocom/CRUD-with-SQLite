//Hanterar alla användar-relaterade routes
//kommunicerar med SQLite-databasen via db.js

const express = require("express");
const router = express.Router();
const db = require("../db");

//Hämta alla användare
router.get("/", (req, res) => {
  try {
    const users = db.prepare("SELECT * FROM users").all();
    res.json({ users }); //Skickar tillbaka som JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Hämta en specifik användare
router.get("/:id", (req, res) => {
  try {
    const user = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(req.params.id);

    if (!user) return res.status(404).json({ error: "Användare hittas inte" });
    res.json({ user }); //Skickar tillbaka användaren som JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); //hanterar eventuella fel
  }
});

//Skapa ny användare
router.post("/", (req, res) => {
  const { name, email } = req.body;
  //Om något fält saknas, returnera 400 (bad request)

  if (!name || !email)
    return res.status(400).json({ error: "Namn och e-post krävs" });

  try {
    //infoga ny användare i databasen
    const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
    const result = stmt.run(name, email);

    //skicka tillbaka ett meddelande och id för den nya användaren
    res
      .status(201)
      .json({ message: "Användare skapad", userId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Ta bort en användare
router.delete("/:id", (req, res) => {
  try {
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    const result = stmt.run(req.params.id);

    //Om ingen tas bort, returnera 404
    if (result.changes === 0)
      return res.status(404).json({ error: "Användare hittades inte" });
    res.json({ message: "Användare borttagen", changes: result.changes }); //skickar en bekräftelse
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; //exporterar router för att användas i appen (server.js)