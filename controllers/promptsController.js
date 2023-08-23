// requestController.js
const PromptRequest = require("../models/promptsModel");

/**
 * Creates a promptRequest
 *
 * @param {*} req
 * @param {*} res
 */
const promptRequestPost = async (req, res) => {
  let request = new PromptRequest(req.body);

  if (request.type && request.userID) {
    await request
      .save()
      .then((data) => {
        res.status(201); // CREATED
        res.header({
          location: `/api/promptRequests/?_id=${data.id}`,
        });
        res.json(data);
      })
      .catch((err) => {
        res.status(422);
        console.log("Error while saving the promptRequest", err);
        res.json({
          error: "There was an error saving the promptRequest",
        });
      });
  } else {
    res.status(422);
    console.log("No valid data provided for promptRequest");
    res.json({
      error: "No valid data provided for promptRequest",
    });
  }
};

/**
 * Get all promptRequests or a specific promptRequest by id
 *
 * @param {*} req
 * @param {*} res
 */
const promptRequestGet = (req, res) => {
  // Get specific promptRequest by id
  if (req.query && req.query.id) {
    PromptRequest.findById(req.query.id)
      .then((request) => {
        if (!request) {
          res.status(404);
          console.log("promptRequest not found");
          res.json({ error: "promptRequest doesn't exist" });
          return;
        }
        res.json(request);
      })
      .catch((err) => {
        res.status(404);
        console.log("Error while querying the promptRequest", err);
        res.json({ error: "promptRequest doesn't exist" });
      });
  } else {
    // Get all promptRequests
    PromptRequest.find()
      .then((requests) => {
        res.json(requests);
      })
      .catch((err) => {
        res.status(422);
        console.log("Error while querying promptRequests", err);
        res.json({ error: "There was an error querying promptRequests" });
      });
  }
};

const promptRequestGetbyUser = (req, res) => {
  if (req.query && req.query.userID) {
    // Get prompts by user
   const userID = req.query.userID;

   PromptRequest.find({ userID })
   .then((promptRequest) => {
   if (!promptRequest) {
     res.status(404);
     console.log("Not found");
     res.json({ error: "User doesn't exist" });
     return;
   }
   res.json(promptRequest);
 })
 .catch((err) => {
   res.status(500);
   console.log("Error while querying the user", err);
   res.json({ error: "Internal server error" });
 });
}
};

/**
 * Updates a promptRequest
 *
 * @param {*} req
 * @param {*} res
 */
const promptRequestPatch = (req, res) => {
  // Get promptRequest by id
  if (req.query && req.query.id) {
    PromptRequest.findById(req.query.id)
      .then((request) => {
        if (!request) {
          res.status(404);
          console.log("promptRequest not found");
          res.json({ error: "promptRequest doesn't exist" });
          return;
        }

        // Update promptRequest object
        request.type = req.body.type ? req.body.type : request.type;
        request.tag = req.body.tag ? req.body.tag : request.tag;
        request.data = req.body.data ? req.body.data : request.data;

        request
          .save()
          .then((updatedRequest) => {
            res.status(200); // OK
            res.json(updatedRequest);
          })
          .catch((err) => {
            res.status(422);
            console.log("Error while saving the promptRequest", err);
            res.json({
              error: "There was an error saving the promptRequest",
            });
          });
      })
      .catch((err) => {
        res.status(500);
        console.log("Error while querying the promptRequest", err);
        res.json({ error: "Internal server error" });
      });
  } else {
    res.status(404);
    res.json({ error: "promptRequest doesn't exist" });
  }
};

/**
 * Deletes a promptRequest
 *
 * @param {*} req
 * @param {*} res
 */
const promptRequestDelete = (req, res) => {
  // Get promptRequest by id
  if (req.query && req.query.id) {
    PromptRequest.findById(req.query.id)
      .then((request) => {
        if (!request) {
          res.status(404);
          console.log("promptRequest not found");
          res.json({ error: "promptRequest doesn't exist" });
          return;
        }

        PromptRequest.deleteOne({ _id: request._id })
          .then(() => {
            res.status(204).json({});
          })
          .catch((err) => {
            res.status(422);
            console.log("Error while deleting the promptRequest", err);
            res.json({ error: "There was an error deleting the promptRequest" });
          });
      })
      .catch((err) => {
        res.status(500);
        console.log("Error while querying the promptRequest", err);
        res.json({ error: "Internal server error" });
      });
  } else {
    res.status(404);
    res.json({ error: "promptRequest doesn't exist" });
  }
};

module.exports = {
  promptRequestGet,
  promptRequestPost,
  promptRequestPatch,
  promptRequestDelete,
  promptRequestGetbyUser
};
