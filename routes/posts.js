//Hanterar alla post-relaterade routes
//kommunicerar med SQLite-databasen via db.js

const express = require("express");
const db = require("../db");
const router = express.Router();

//Hämta alla posts med användarnamn
router.get("/", (req, res) => {
  const stmt = db.prepare(`
	SELECT posts.id, posts.content, users.name AS author, posts.created_at
	FROM posts
	JOIN users ON posts.user_id = users.id
	`);
  //kör frågan och hämtar alla poster som en array
  const posts = stmt.all();
  res.json(posts);
});

//Skapa nytt inlägg (post)
router.post("/", (req, res) => {
  const { user_id, title, content } = req.body; //Hämta user_id, title och content från req body

  //kontrollera att alla fält är ifyllda, annars returnerna fel
  if (!user_id || !title || !content) {
    return res.status(400).json({ error: "Alla fält måste vara ifyllda" });
  }
  const stmt = db.prepare(
    "INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)"
  );
  //kör frågan med värdena från req body
  const result = stmt.run(user_id, title, content);

  //skicka tillbaka det skapade inlägget
  res.status(201).json({ id: result.lastInsertRowid, user_id, title, content });
});

//Hämta specifikt inlägg
router.get("/:id", (req, res) => {
  const stmt = db.prepare(`
	SELECT posts.id, posts.title, posts.content, users.name AS author, posts.created_at
	FROM posts
	JOIN users ON posts.user_id = users.id
	WHERE posts.id = ?
	`); //förbereder SQL-fråga för att hämta ett specifikt inlägg baserat på id

  //Kör frågan och hämtar det enskilda inlägget
  const post = stmt.get(req.params.id);

  if (!post) {
    return res.status(404).json({ error: "Posten hittades inte" });
  }
  res.json(post);
});

//Ta bort inlägg
router.delete("/:id", (req, res) => {
  const stmt = db.prepare("DELETE FROM posts WHERE id = ?"); //Förbereder SQL-fråga för att ta bort ett inlägg
  const result = stmt.run(req.params.id); //kör frågan med det id som skickas i URL:en

  if (result.changes === 0) {
    return res.status(404).json({ error: "Posten hittades inte" }); //om inget inlägg tagits bort, returnera 404
  }
  res.json({ message: "Posten har raderats" }); //Bekräftar att inlägget har tagits bort
});

module.exports = router;