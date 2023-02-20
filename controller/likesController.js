var fileSystem = require("fs");
var path = require("path");
var { v4: uuid } = require("uuid");

//path to comments.json
var pathLike = path.join(__dirname, "../", "data/likes.json");

//adding a like to an existing comment of an existing post
function addLike(req, res) {
  const myPostId = req.params.postId;
  const myCommentId = req.params.commentId;
  fileSystem.readFile(pathLike, { encoding: "utf-8" }, function (err, likes) {
    if (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
    //parse commentsJSON to js
    var likesJs = JSON.parse(likes);
    var likeId = uuid();
    var likeObj = {
      id: likeId,
      commentId: myCommentId,
      postId: myPostId,
      isLiked: true,
    };
    // send the Obj to javascript
    likesJs.push(likeObj);
    //making JSON
    var likesJSON = JSON.stringify(likesJs);
    fileSystem.writeFile(pathLike, likesJSON, function (err) {
      if (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
      }
      res.status(201).json({
        message: `Like Added for postId:-${myPostId} and commentId:-${myCommentId}`,
        data: likeObj,
      });
    });
  });
  // res.status(201).send(`Comment Added for post ${postId}`)
}

// Delete a comment
function deleteLikes(req, res) {
  var requiedLikeId = req.params.likeId;
  fileSystem.readFile(pathLike, { encoding: "utf-8" }, function (err, likes) {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
    // converting JavaScript
    var likesJS = JSON.parse(likes);
    var requiredLike = likesJS.find((like) => {
      return like.id === requiedLikeId;
    });
    var requiredIndex = likesJS.indexOf(requiredLike);
    // console.log(requiredPostWithIndex)
    likesJS.splice(requiredIndex, 1);
    var arrJSON = JSON.stringify(likesJS);
    // console.log(postsJavascript)
    fileSystem.writeFile(pathLike, arrJSON, function (err) {
      if (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
      } else {
        res.status(202).json({
          message: "Like Deleted Successfully",
          "data-deleted": requiredLike,
          fromIndex: requiredIndex,
        });
      }
    });
  });
}

module.exports = {
  addLike,
  deleteLikes,
};
