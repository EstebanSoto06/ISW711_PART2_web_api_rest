const User = require("../models/usersModel");

/**
 * Creates a user
 *
 * @param {*} req
 * @param {*} res
 */

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const userPost = async (req, res) => {
  let user = new User(req.body);

  console.log(user);
  

  if (user.username) {
    try {
      const savedUser = await user.save();

      // Enviar el correo de verificación
      const msg = {
        to: user.email,
        from: 'joanestebansr@gmail.com',
        subject: 'Verification Email',
        text: 'verification email',
        html: `<strong>Hello, your verification code is: ${user.verificationCode}</strong>`,
      };

      await sgMail.send(msg);

      res.status(201); // CREATED
      res.header({
        'location': `/api/users/?_id=${savedUser.id}`
      });
      res.json(savedUser);
    } catch (err) {
      res.status(422);
      console.log('Error while saving the user', err);
      res.json({
        error: 'There was an error saving the user'
      });
    }
} else {
  res.status(422);
  console.log('error while saving the user')
  res.json({
    error: 'No valid data provided for user'
  });
};
};

/**
 * Get all users
 *
 * @param {*} req
 * @param {*} res
 */
const userGet = (req, res) => {
    // Get specific user by id
    if (req.query && req.query.id) {
      User.findById(req.query.id)
        .then( (user) => {
          res.json(user);
        })
        .catch(err => {
          res.status(404);
          console.log('error while queryting the user', err)
          res.json({ error: "user doesnt exist" })
        });
      } else {
      // Get all users
      User.find()
        .then( users=> {
          res.json(users);
        })
        .catch(err => {
          res.status(422);
          res.json({ "error": err });
        });
    }
  };

  const userLogin = (req, res) => {
      if (req.query && req.query.email && req.query.password){
        // Get specific user by email and password
       const email = req.query.email;
       const password = req.query.password;

       User.findOne({ email, password })
       .then((user) => {
       if (!user) {
         res.status(404);
         console.log("User not found");
         res.json({ error: "User doesn't exist" });
         return;
       }
       res.json(user);
     })
     .catch((err) => {
       res.status(500);
       console.log("Error while querying the user", err);
       res.json({ error: "Internal server error" });
     });
   }
  };

/**
 * Updates a user
 *
 * @param {*} req
 * @param {*} res
 */
const userPatch = (req, res) => {
  // Get user by id
  if (req.query && req.query.id) {
    User.findById(req.query.id)
      .then(user => {
        if (!user) {
          res.status(404);
          console.log('User not found');
          res.json({ error: "User doesn't exist" });
          return;
        }

        // Update user object
        user.username = req.body.username ? req.body.username : user.username;
        user.email = req.body.email ? req.body.email : user.email;
        user.password = req.body.password ? req.body.password : user.password;
        user.cellphone = req.body.cellphone ? req.body.cellphone : user.cellphone;
        user.verified = req.body.verified ? req.body.verified : user.verified;
        user.verified = !req.body.verified ? req.body.verified : user.verified;
        user.twoFA = req.body.twoFA ? req.body.twoFA : user.twoFA;
        user.twoFA = !req.body.twoFA ? req.body.twoFA : user.twoFA;

        user.save()
          .then(updatedUser => {
            res.status(200); // OK
            res.json(updatedUser);
          })
          .catch(err => {
            res.status(422);
            console.log('Error while saving the user', err);
            res.json({
              error: 'There was an error saving the user'
            });
          });
      })
      .catch(err => {
        res.status(500);
        console.log('Error while querying the user', err);
        res.json({ error: "Internal server error" });
      });
  } else {
    res.status(404);
    res.json({ error: "User doesn't exist" });
  }
};

/**
 * Deletes a user
 *
 * @param {*} req
 * @param {*} res
 */
const userDelete = (req, res) => {
    // Get user by id
    if (req.query && req.query.id) {
      User.findById(req.query.id)
        .then(user => {
          if (!user) {
            res.status(404);
            console.log('User not found');
            res.json({ error: "User doesn't exist" });
            return;
          }
  
          User.deleteOne({ _id: user._id })
            .then(() => {
              res.status(204).json({});
            })
            .catch(err => {
              res.status(422);
              console.log('Error while deleting the user', err);
              res.json({ error: 'There was an error deleting the user' });
            });
        })
        .catch(err => {
          res.status(500);
          console.log('Error while querying the user', err);
          res.json({ error: "Internal server error" });
        });
    } else {
      res.status(404);
      res.json({ error: "User doesn't exist" });
    }
  };
module.exports = {
  userGet,
  userPost,
  userPatch,
  userDelete,
  userLogin
}