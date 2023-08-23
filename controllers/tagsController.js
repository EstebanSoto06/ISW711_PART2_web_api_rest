const Tag = require("../models/tagsModel");

/**
 * Creates a tag
 *
 * @param {*} req
 * @param {*} res
 */
const tagPost = async (req, res) => {
  let tag = new Tag(req.body);

  if (tag.userID) {
    await tag.save()
    .then(data => {
      res.status(201); // CREATED
      res.header({
        'location': `/api/tags/?_id=${data.id}`
      });
      res.json(data);
    })
    .catch( err => {
      res.status(422);
      console.log('error while saving the tag', err);
      res.json({
        error: 'There was an error saving the tag'
      });
    });
} else {
  res.status(422);
  console.log('error while saving the tag')
  res.json({
    error: 'No valid data provided for tag'
  });
};
};

/**
 * Get all tags
 *
 * @param {*} req
 * @param {*} res
 */
const tagGet = (req, res) => {
    // Get specific tag by id
    if (req.query && req.query.id) {
      Tag.findById(req.query.id)
        .then( (tag) => {
          res.json(tag);
        })
        .catch(err => {
          res.status(404);
          console.log('error while queryting the tag', err)
          res.json({ error: "tag doesnt exist" })
        });
      } else {
      // Get all tags
      Tag.find()
        .then( tags=> {
          res.json(tags);
        })
        .catch(err => {
          res.status(422);
          res.json({ "error": err });
        });
    }
  };

  const tagByUser = (req, res) => {
      if (req.query && req.query.userID){
        // Get specific tag by email and password
       const userID = req.query.userID

       Tag.find({ userID })
       .then((tag) => {
       if (!tag) {
         res.status(404);
         console.log("tag not found");
         res.json({ error: "tag doesn't exist" });
         return;
       }
       res.json(tag);
     })
     .catch((err) => {
       res.status(500);
       console.log("Error while querying the tag", err);
       res.json({ error: "Internal server error" });
     });
   }
  };

/**
 * Updates a tag
 *
 * @param {*} req
 * @param {*} res
 */
const tagPatch = (req, res) => {
  // Get tag by id
  if (req.query && req.query.id) {
    Tag.findById(req.query.id)
      .then(tag => {
        if (!tag) {
          res.status(404);
          console.log('tag not found');
          res.json({ error: "tag doesn't exist" });
          return;
        }

        // Update tag object
        tag.name = req.body.name ? req.body.name : tag.name;

        tag.save()
          .then(updatedtag => {
            res.status(200); // OK
            res.json(updatedtag);
          })
          .catch(err => {
            res.status(422);
            console.log('Error while saving the tag', err);
            res.json({
              error: 'There was an error saving the tag'
            });
          });
      })
      .catch(err => {
        res.status(500);
        console.log('Error while querying the tag', err);
        res.json({ error: "Internal server error" });
      });
  } else {
    res.status(404);
    res.json({ error: "tag doesn't exist" });
  }
};

/**
 * Deletes a tag
 *
 * @param {*} req
 * @param {*} res
 */
const tagDelete = (req, res) => {
    // Get tag by id
    if (req.query && req.query.id) {
      Tag.findById(req.query.id)
        .then(tag => {
          if (!tag) {
            res.status(404);
            console.log('tag not found');
            res.json({ error: "tag doesn't exist" });
            return;
          }
  
          Tag.deleteOne({ _id: tag._id })
            .then(() => {
              res.status(204).json({});
            })
            .catch(err => {
              res.status(422);
              console.log('Error while deleting the tag', err);
              res.json({ error: 'There was an error deleting the tag' });
            });
        })
        .catch(err => {
          res.status(500);
          console.log('Error while querying the tag', err);
          res.json({ error: "Internal server error" });
        });
    } else {
      res.status(404);
      res.json({ error: "tag doesn't exist" });
    }
  };
module.exports = {
  tagGet,
  tagPost,
  tagPatch,
  tagDelete,
  tagByUser
}