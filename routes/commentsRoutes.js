var express = require("express");
var router = express.Router();
var {
  addComment,
  updateComment,
  deleteComment,
} = require("../controller/commentsController");
const isCommentId = require("../mddleware/isCommentId");
const isPostId = require("../mddleware/isPostId");

router.post("/comments/:postId", isPostId, addComment);
router.patch("/comments/:commentId", isCommentId, updateComment);
router.delete("/comments/:commentId", isCommentId, deleteComment);

module.exports = router;
