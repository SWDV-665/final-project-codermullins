// Set up
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var cors = require("cors");
const { name } = require("mustache");

// Configuration
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/reviews"
);

app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(methodOverride());
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, POST, PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Model
const Review = mongoose.model("Reviews", {
  name: String,
  thoughts: String,
  img: String,
  rating: Number,
});

const Users = mongoose.model("Users", {
  name: String,
  email: String,
  password: String,
});

// Get all review items
app.get("/api/reviews", function (req, res) {
  console.log("Listing reviews items...");

  //use mongoose to get all reviews in the database
  Review.find(function (err, reviews) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) {
      res.send(err);
    }

    res.json(reviews); // return all reviews in JSON format
  });
});

// Create a review Item
app.post("/api/reviews", function (req, res) {
  console.log("Creating review...");

  Review.create(
    {
      name: req.body.name,
      thoughts: req.body.thoughts,
      rating: req.body.rating,
      img: req.body.img,
      done: false,
    },
    function (err, review) {
      if (err) {
        res.send(err);
      }

      // create and return all the reviews
      Review.find(function (err, reviews) {
        if (err) res.send(err);
        res.json(reviews);
      });
    }
  );
});

// Update a review Item
app.put("/api/reviews/:id", function (req, res) {
  const review = {
    name: req.body.name,
    thoughts: req.body.thoughts,
    rating: req.body.rating,
    img: req.body.img,
  };
  console.log("Updating item - ", review);
  Review.updateOne({ name: req.body.name }, review, function (err, raw) {
    if (err) {
      res.send(err);
    }
    res.send(raw);
  });
});

// Delete a review Item
app.delete("/api/reviews/:id", function (req, res) {
  Review.remove(
    {
      _id: req.params.id,
    },
    function (err, review) {
      if (err) {
        console.error("Error deleting review ", err);
      } else {
        Review.find(function (err, reviews) {
          if (err) {
            res.send(err);
          } else {
            res.json(reviews);
          }
        });
      }
    }
  );
});

// Create a user
app.post("/api/users", function (req, res) {
  console.log("Creating user...");

  Users.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      done: false,
    },
    function (err, user) {
      if (err) {
        res.send(err);
      }

      // create and return all the reviews
      Users.find(function (err, users) {
        if (err) res.send(err);
        res.json(users);
      });
    }
  );
});

// Get all users
app.get("/api/users", function (req, res) {
  console.log("Listing reviews Users...");

  //use mongoose to get all reviews in the database
  Users.find(function (err, users) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) {
      res.send(err);
    }

    res.json(users); // return all reviews in JSON format
  });
});

// Start app and listen on port 8080
app.listen(process.env.PORT || 8080);
console.log("Review server listening on port  - ", process.env.PORT || 8080);
