var fileSystem = require("fs");
var path = require("path");

// path to posts.json
var pathPost = path.join(__dirname, "../", "data/posts.json");

function isPostId(req, res, next) {
  const requiredId = req.params.postId;
  if (requiredId) {
    fileSystem.readFile(pathPost, { encoding: "utf-8" }, function (err, posts) {
      if (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
      }
      // make posts.json array to javascript array
      var postsJavascript = JSON.parse(posts);
      var singlePost = postsJavascript.find((post) => {
        return post.id === requiredId;
      });
      // checking the id is correct or not
      if (!singlePost) {
        return res
          .status(404)
          .json({ message: `Id:-${requiredId} is not related to any Post.` });
      } else {
        req.params.postId = singlePost.id;
        next();
      }
    });
  } else {
    res.status(400).send("Please Provide a corresponding post ID");
  }
}

module.exports = isPostId;
