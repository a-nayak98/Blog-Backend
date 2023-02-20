var fileSystem = require("fs");
var path = require("path");
var { v4: uuid } = require("uuid");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
// const { createToken } = require("../helpers/createToken");

// path to usres.json
var pathUser = path.join(__dirname, "../", "data/users.json");
// secretKey for token
var secretKey = "bloggingWebsite@BabuNayak1997";

function registerUser(req, res) {
  var userDetails = req.body;
  var goingToHash = userDetails.password;
  bcrypt
    .hash(goingToHash, 10)
    .then((passwordHashed) => {
      var hashedPassword = passwordHashed;
      var id = uuid();
      jwt.sign(
        { payloadId: id },
        secretKey,
        { expiresIn: 60 * 5 },
        (err, token) => {
          if (err) {
            console.log(err);
            return res
              .status(400)
              .json({ error: err.message, message: "Server Error" });
          } else {
            fileSystem.readFile(
              pathUser,
              { encoding: "utf-8" },
              (err, users) => {
                if (err) {
                  console.log(err);
                  return res
                    .status(500)
                    .send("Server Error :-users can not get.");
                }
                // converting usersArr to store userdetails in it.
                var usersJS = JSON.parse(users);
                var newObj = {
                  Id: id,
                  Name: userDetails.name,
                  Posts: [],
                  Comments: [],
                  Email: userDetails.email,
                  Password: hashedPassword,
                  isAdmin: false,
                  token: token,
                };
                // push nweObj
                usersJS.push(newObj);
                // convert the js to JSON for storing
                var dataJSON = JSON.stringify(usersJS);
                fileSystem.writeFile(pathUser, dataJSON, (err) => {
                  if (err) {
                    console.log(err);
                    return res
                      .status(401)
                      .send("Server Error :-users data can not be stored.");
                  }
                  res.status(201).json({ message: "User Saved", data: newObj });
                });
              }
            );
          }
        }
      );
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "Bad Request", error: err.message });
    });
}

function userLogin(req, res) {
  var loggingDetails = req.body;
  // data ana datbase ru
  fileSystem.readFile(pathUser, { encoding: "utf-8" }, (err, users) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Server Error :-users can not get.");
    }
    // user ku khojiba pain js ku convert kara
    var usersJS = JSON.parse(users);
    // khoja user ku
    var myUser = usersJS.find((user) => {
      return user.Email === loggingDetails.email;
    });
    // jadi user nai ni
    if (!myUser) {
      return res.status(400).send("You are not registred , kindly register.");
    }
    // ta password ta thik achi ta
    bcrypt
      .compare(loggingDetails.password, myUser.Password)
      .then((mattched) => {
        // res === true
        if (mattched) {
          // tahele token ta create new kara
          jwt.sign(
            { payloadId: myUser.Id },
            secretKey,
            { expiresIn: 60 * 5 },
            (err, token) => {
              if (err) {
                return res
                  .status(500)
                  .send("Server Error :- Auth token not Generated.");
              } else {
                var newToken = token;
                // assign token to myUser
                myUser["token"] = newToken;
                // convert the usersJS
                var dataJSON = JSON.stringify(usersJS);
                // store data
                fileSystem.writeFile(pathUser, dataJSON, (err) => {
                  if (err) {
                    return res
                      .status(500)
                      .send("Server Error :- Data don't save in db");
                  } else {
                    // send response
                    return res
                      .status(201)
                      .json({ message: "Loggin Successfully", data: myUser });
                  }
                });
              }
            }
          );
        } else {
          return res
            .status(500)
            .json({ message: "Invalid Credentials password bhul" });
        }
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ message: "Invalid Credentials ", Error: err.messsage });
      });
  });
}

function userLogout(req, res) {
  var usingToken = req.header("Authorization");
  // get the data from database
  fileSystem.readFile(pathUser, { encoding: "utf-8" }, (err, users) => {
    if (err) {
      return res.status(500).send("Server Error");
    } else {
      // converting usersArr to store userdetails in it.
      var usersJS = JSON.parse(users);
      // khoja user ku token through ru
      //! console.log(usersJS);
      var myUser = usersJS.find((user) => {
        return user.token === usingToken;
      });
      // verifye a token
      jwt.verify(myUser.token, secretKey, function (err, decoded) {
        if (err) {
          return res.status(500).json({
            message: "Server Error",
            Error: err,
          });
        } else {
          //! console.log(decoded);
          if (myUser.Id === decoded.payloadId) {
            // then i have to use
            myUser.token = null;
            //write bake in database
            var dataJSON = JSON.stringify(usersJS);
            fileSystem.writeFile(pathUser, dataJSON, (err) => {
              if (err) {
                return res.status(500).send("Server Error : - data not saved");
              }
            });
            return res.status(201).send("Logged out successfully.");
          } else {
            return res.status(401).send("Invalid Token.");
          }
        }
      });
    }
  });
}

function removeUser(req, res) {
  var usingToken = req.header("Authorization");
  // get the data from database
  fileSystem.readFile(pathUser, { encoding: "utf-8" }, (err, users) => {
    if (err) {
      return res.status(500).send("Server Error");
    } else {
      // converting usersArr to store userdetails in it.
      var usersJS = JSON.parse(users);
      // khoja user ku token through ru
      var myUser = usersJS.find((user) => {
        return user.token === usingToken;
      });
      // verifye a token
      jwt.verify(myUser.token, secretKey, function (err, decoded) {
        if (err) {
          return res.status(500).json({
            message: "Server Error",
            Error: err,
          });
        } else {
          if (myUser.Id === decoded.payloadId) {
            var index = usersJS[myUser];
            var newArr = usersJS;
            newArr.splice(index, 1);
            // convert the js to JSON for storing
            var dataJSON = JSON.stringify(newArr);
            fileSystem.writeFile(pathUser, dataJSON, (err) => {
              if (err) {
                console.log(err);
                return res
                  .status(401)
                  .send("Server Error :-users data can not be stored.");
              }
            });
          }
          return res
            .status(202)
            .json({ message: "user deactivate!!!!!!", data: myUser });
        }
      });
    }
  });
  // res.status(202).send("user deactivate route clicked");
}

module.exports = {
  registerUser,
  userLogin,
  userLogout,
  removeUser,
};
