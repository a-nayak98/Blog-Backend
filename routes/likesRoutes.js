var express = require("express");
var router = express.Router();
var { addLike, deleteLikes } = require("../controller/likesController");
const isCommentId = require("../mddleware/isCommentId");
const isLikeId = require("../mddleware/islikeId");
const isPostId = require("../mddleware/isPostId");

router.post("/likes/:postId/:commentId", isPostId, isCommentId, addLike);
router.delete("/likes/:likeId", isLikeId, deleteLikes);

module.exports = router;
