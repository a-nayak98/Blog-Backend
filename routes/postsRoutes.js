var express = require("express");
var router = express.Router();
var {
  createPost,
  getSinglePost,
  updatePost,
  deletePost,
} = require("../controller/postsController");
const isPostId = require("../mddleware/isPostId");
// var isPostId = require("../mddleware/isPostId")

router.post("/posts", createPost);
router
  .route("/posts/:postId")
  .get(isPostId, getSinglePost)
  .patch(isPostId, updatePost)
  .delete(isPostId, deletePost);

module.exports = router;
