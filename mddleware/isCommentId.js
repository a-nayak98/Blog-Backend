var fileSystem = require("fs");
var path = require("path");

// path to posts.json
var pathComment = path.join(__dirname, "../", "data/comments.json");

function isCommentId(req, res, next) {
  const requiredId = req.params.commentId;
  if (requiredId) {
    fileSystem.readFile(
      pathComment,
      { encoding: "utf-8" },
      function (err, comments) {
        if (err) {
          console.log(err.message);
          res.status(500).send("Server Error");
        }
        // make posts.json array to javascript array
        var postsJavascript = JSON.parse(comments);
        var singleComment = postsJavascript.find((comment) => {
          return comment.id === requiredId;
        });
        // checking the id is correct or not
        if (!singleComment) {
          return res
            .status(404)
            .json({ message: `Id:-${requiredId} is not related to any Post.` });
        } else {
          req.params.commentId = singleComment.id;
          next();
        }
      }
    );
  } else {
    res.status(400).send("Please Provide a corresponding comment ID");
  }
}

module.exports = isCommentId;
