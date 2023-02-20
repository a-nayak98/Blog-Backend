var fileSystem = require("fs");
var path = require("path");
var { v4: uuid } = require("uuid");

//path to comments.json
var pathComment = path.join(__dirname, "../", "data/comments.json");
var pathLikes = path.join(__dirname, "../", "data/likes.json");

function addComment(req, res) {
  const postId = req.params.postId;
  const requiredComment = req.body.comment;
  fileSystem.readFile(
    pathComment,
    { encoding: "utf-8" },
    function (err, comments) {
      if (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
      }
      //parse commentsJSON to js
      var commentsJavascript = JSON.parse(comments);
      var commentid = uuid();
      var commentObj = {
        id: commentid,
        comment: requiredComment,
        postId: postId,
      };
      // send the cObj to javascript
      commentsJavascript.push(commentObj);
      //making JSON
      var commentsJSON = JSON.stringify(commentsJavascript);
      fileSystem.writeFile(pathComment, commentsJSON, function (err) {
        if (err) {
          console.log(err.message);
          res.status(500).send("Server Error");
        }
        res.status(201).json({ message: "Comment Added", data: commentObj });
      });
    }
  );
  // res.status(201).send(`Comment Added for post ${postId}`)
}

//update a comment
function updateComment(req, res) {
  const commentId = req.params.commentId;
  const mybody = req.body;
  fileSystem.readFile(
    pathComment,
    { encoding: "utf-8" },
    function (err, comments) {
      if (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
      }
      var commentsJS = JSON.parse(comments);
      //get a single product
      var updatedComments = commentsJS.map((comment, index, arr) => {
        //check if the sent id is matching with the post id
        if (comment.id === commentId) {
          let newObj = {
            ...comment, // { id, title, body, createdAt }
            ...mybody, //{ title, body }
          };
          return newObj;
        } else {
          return comment;
        }
      });
      // stringfy the arry to json array
      var arrJSON = JSON.stringify(updatedComments);
      fileSystem.writeFile(pathComment, arrJSON, function (err) {
        if (err) {
          console.log(err.message);
          res.status(500).send("Server Error");
        } else {
          res
            .status(202)
            .json({ message: "New data Updated", data: updatedComments });
        }
      });
      // console.log(postsJavascript);
    }
  );
}

// Delete a comment
function deleteComment(req, res) {
  var commentId = req.params.commentId;
  fileSystem.readFile(
    pathComment,
    { encoding: "utf-8" },
    function (err, comments) {
      if (err) {
        console.log(err);
        res.status(500).send("Server Error");
      }
      // converting JavaScript
      var commentsJavascript = JSON.parse(comments);
      var requiredComment = commentsJavascript.find((comment) => {
        return comment.id === commentId;
      });
      var requiredIndex = commentsJavascript.indexOf(requiredComment);
      // console.log(requiredPostWithIndex)
      commentsJavascript.splice(requiredIndex, 1);
      var arrJSON = JSON.stringify(commentsJavascript);
      // console.log(postsJavascript)
      fileSystem.writeFile(pathComment, arrJSON, function (err) {
        if (err) {
          console.log(err.message);
          res.status(500).send("Server Error");
        } else {
          res.status(202).json({
            message: "Comment Deleted Successfully",
            "data-deleted": requiredComment,
            fromIndex: requiredIndex,
          });
        }
      });

      //? this is for adding functionality for deleting all the comments related to a single post
      // fileSystem.readFile(
      //   pathLikes,
      //   { encoding: "utf-8" },
      //   function (err, likes) {
      //     if (err) {
      //       console.log(err);
      //       res.status(500).send("Server Error");
      //     }
      //     // converting JavaScript
      //     var likesJs = JSON.parse(likes);
      //     // searching the comments related to posId and removing them
      //     likesJs.map((like, i) => {
      //       if (commentId === like.comment) {
      //         likesJs.splice(i, 1);
      //       }
      //     });
      //     // converting commentsJavaScript to string
      //     var commentsJSON = JSON.stringify(likesJs);
      //     fileSystem.writeFile(pathLikes, commentsJSON, function (err) {
      //       if (err) {
      //         console.log(err.message);
      //         res.status(500).send("Server Error");
      //       }
      //     });
      //   }
      // );
      //? this is for adding functionality for deleting all the comments related to a single post
    }
  );
}

module.exports = {
  addComment,
  updateComment,
  deleteComment,
};
