var fileSystem = require("fs");
var path = require("path");

// path to posts.json
var pathPost = path.join(__dirname, "../", "data/posts.json");

function isLikeId(req, res, next) {
  const requiredId = req.params.likeId;
  if (requiredId) {
    fileSystem.readFile(pathPost, { encoding: "utf-8" }, function (err, likes) {
      if (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
      }
      // make posts.json array to javascript array
      var likesJavascript = JSON.parse(likes);
      var singleLike = likesJavascript.find((like) => {
        return like.id === requiredId;
      });
      // checking the id is correct or not
      if (!singleLike) {
        return res
          .status(404)
          .json({ message: `Id:-${requiredId} is not related to any like.` });
      } else {
        req.params.likeId = singleLike.id;
        next();
      }
    });
  } else {
    res.status(400).send("Please Provide a corresponding like ID");
  }
}

module.exports = isLikeId;
