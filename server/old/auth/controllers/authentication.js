var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.login = function (req, res) {
  if (!req.body.username || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  const income = req.body.password;

  let password = "";

  income.forEach((e, i) => {
    password += String.fromCharCode((e-86574)/(i+2)-123);
  })

  req.body.password = password;

  passport.authenticate('local', function (err, user, info) {
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if (user) {
      token = user.generateJWT();
      res.status(200);
      res.json({
        "token": token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};

// module.exports.reg = function (req, res) {
//   if (!req.body.username || !req.body.password) {
//     sendJSONresponse(res, 400, {
//       "message": "All fields required"
//     });
//     return;
//   }

//   let newUser = new User({
//     username: req.body.username
//   });
//   newUser.setPassword(req.body.password);

//   newUser.save()
//     .then(function (doc) {
//       console.log("Сохранен объект", doc);
//     })
//     .catch(function (err) {
//       console.log(err);
//     });

//   res.status(401).json(newUser);

// };