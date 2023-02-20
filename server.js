var express = require("express");
var allPostsRouter = require("./routes/postsRoutes");
var allCommentsRouter = require("./routes/commentsRoutes");
var allLikesRouter = require("./routes/likesRoutes");
var allUsersRouter = require("./routes/userRoutes");

var app = express();
require("dotenv").config();

// Global middleware
app.use(express.json());
app.use(allUsersRouter);
app.use(allPostsRouter);
app.use(allCommentsRouter);
app.use(allLikesRouter);

app.get("/", function (req, res) {
  res.status(200).send("Sending Response");
});

app.listen(6363, console.log("Server starts on 6363!!"));
