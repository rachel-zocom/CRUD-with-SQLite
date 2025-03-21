//Startar en Express-server
const express = require("express");
const { logger } = require("./middleware");
const usersRoutes = require("./routes/users");
const postsRoutes = require("./routes/posts");

const app = express();

app.use(express.json());

app.use(logger); //Använder logger för alla requests

//Delar up API:et i logiska enheter (t ex 'users' och 'posts')
app.use("/users", usersRoutes); //Alla rutter i usersRoutes kommer att ha '/users' som bas-URL
app.use("/posts", postsRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`);
});
