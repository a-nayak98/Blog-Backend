var fileSystem = require("fs");
var { v4: uuidv4 } = require("uuid");
var path = require("path");

// path to posts.json
var pathPost = path.join(__dirname, "../", "data/posts.json");
var pathComment = path.join(__dirname, "../", "data/comments.json");
var pathLike = path.join(__dirname, "../", "data/likes.json");

//Create a post
function createPost(req, res) {
  const postId = uuidv4();
  const postTitle = req.body.title;
  const postBody = req.body.body;
  console.log(postId, postTitle, postBody);
  // require data from posts.json
  fileSystem.readFile(pathPost, { encoding: "utf-8" }, function (err, posts) {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
    // make post.json array to javascript array
    var postsJavascript = JSON.parse(posts);

    // push the post object to the postsJavascript array
    // so create the postObj
    var postObj = {
      id: postId,
      title: postTitle,
      body: postBody,
      createdAt: new Date(),
    };

    //  if(typeof(postsJavascript) === "string"){
    //     return JSON.parse(postsJavascript)
    //  }else {}

    //? push the object into the array
    postsJavascript.push(postObj);
    //? to store the JS array in posts.json we have to stringify the js
    var postsToSave = JSON.stringify(postsJavascript);
    // save post in posts.json
    fileSystem.writeFile(pathPost, postsToSave, function (err) {
      if (err) {
        console.log(err.message);
        res.sendStatus(500).send("Server Error. data galani database ku");
      }
      res
        .status(201)
        .json({ data: postObj, message: "Post ta databas re save hela" });
    });
  });
}

//Get single product
function getSinglePost(req, res) {
  const postId = req.params.postId;
  fileSystem.readFile(pathPost, { encoding: "utf-8" }, function (err, posts) {
    if (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    } else {
      // make post.json array to javascript array
      var postsJavascript = JSON.parse(posts);
      var singlePost = postsJavascript.find((post) => {
        return post.id === postId;
      });
      console.log(singlePost);
      res.status(200).json({
        post: singlePost,
        message: `You Got the post of id:-${singlePost.postId}`,
      });
    }
  });
}

//Edit Single post
function updatePost(req, res) {
  const postId = req.params.postId;
  const mybody = req.body;
  fileSystem.readFile(pathPost, { encoding: "utf-8" }, function (err, posts) {
    if (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
    var postsJavascript = JSON.parse(posts);
    //get a single product
    var UpdatedPosts = postsJavascript.map((post, index, arr) => {
      //check if the sent id is matching with the post id
      if (post.id === postId) {
        let newObj = {
          ...post, // { id, title, body, createdAt }
          // ...mybody, //{ title, body }
          title: mybody.title,
          body: mybody.body,
        };
        return newObj;
      } else {
        return post;
      }
    });
    // stringfy the arry to json array
    var arrJSON = JSON.stringify(UpdatedPosts);
    fileSystem.writeFile(pathPost, arrJSON, function (err) {
      if (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
      } else {
        res
          .status(202)
          .json({ message: "New data Updated", data: UpdatedPosts });
      }
    });

    // console.log(postsJavascript);
  });
}

// deletePost
function deletePost(req, res) {
  var postId = req.params.postId;
  fileSystem.readFile(pathPost, { encoding: "utf-8" }, function (err, posts) {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
    // converting JavaScript
    var postsJavascript = JSON.parse(posts);
    var requiredPost = postsJavascript.find((post) => {
      return post.id === postId;
    });
    var requiredIndex = postsJavascript.indexOf(requiredPost);
    // console.log(requiredPostWithIndex)
    postsJavascript.splice(requiredIndex, 1);

    var arrJSON = JSON.stringify(postsJavascript);
    // console.log(postsJavascript)
    fileSystem.writeFile(pathPost, arrJSON, function (err) {
      if (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
      } else {
        res.status(202).json({
          message: "Post Deleted Successfully",
          "data-deleted": requiredPost,
          fromIndex: requiredIndex,
        });
      }
    });

    // //? this is for adding functionality for deleting all the comments related to a single post
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
        // searching the comments related to posId and removing them
        // const CommentsJSCopy = [...commentsJavascript];
        const indexes = commentsJavascript.filter((comment, i) => {
          if (comment.postId === postId) {
            return i;
          }
        });
        console.log(indexes);

        // looping the commentsJSCopy to remove element
        if (indexes) {
          for (let index = indexes.length - 1; index >= 0; index--) {
            if (index) {
              const element = indexes[index];
              commentsJavascript.splice(element, 1);
            }
          }
        }
        console.log(commentsJavascript);

        // converting commentsJavaScript to string
        var commentsJSON = JSON.stringify(commentsJavascript);
        fileSystem.writeFile(pathComment, commentsJSON, function (err) {
          if (err) {
            console.log(err.message);
            res.status(500).send("Server Error");
          }
        });
      }
    );
    // //? this is for adding functionality for deleting all the "comments" related to a single post

    // //? this is for adding functionality for deleting all the "likes" related to a single post
    // fileSystem.readFile(pathLike, { encoding: "utf-8" }, function (err, likes) {
    //   if (err) {
    //     console.log(err);
    //     res.status(500).send("Server Error");
    //   }
    //   // converting likes.json to JavaScript
    //   var likesJavascript = JSON.parse(likes);
    //   var goingToLoopArr = [...likesJavascript];
    //   var newLikesArr = goingToLoopArr.filter((like, index) => {
    //     if (like.postId === postId) {
    //       likesJavascript.splice(index, 1);
    //     }
    //   });
    //   // converting to json string for storing the data in likesdb
    //   var dataJSON = JSON.stringify(newLikesArr);
    //   fileSystem.writeFile(pathLike, dataJSON, (err) => {
    //     if (err) {
    //       console.log(err);
    //       res.status(500).send("Server Error");
    //     }
    //   });
    // });

    //? this is for adding functionality for deleting all the "likes" related to a single post
  });
}

module.exports = { createPost, getSinglePost, updatePost, deletePost };
