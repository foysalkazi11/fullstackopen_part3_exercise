if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const axios = require("axios");
const express = require("express");
const cors = require("cors");
const unknownEndpoint = require("./middleware/unknownEndpoint");
const mongoDB = require("./config/mongoConnect");
const Person = require("./models/parsonModel");
const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");
const PORT = process.env.PORT || 3001;

// connect mongo DB
mongoDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("build"));
app.use(requestLogger);

// get info
app.get("/info", (req, res) => {
  axios.get(process.env.API_URL + "/api/persons").then((result) => {
    let personsLength = result?.data?.length;
    res.send(`<div>
    <p>Phonebook has info for ${personsLength} people
    <p>${new Date()} </p>
    </div>`);
  });
});

// get all persons
app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

// get a single person
app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      next(err);
    });
});

// edit a single person
app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  Person.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((err) => next(err));
});

// delete a single person
app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        res.status(204).json({ success: "Delete successfully" });
      }
      res.status(404).end();
    })
    .catch((err) => next(err));
});

// create a new person
app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };
  const newPerson = new Person(person);
  newPerson
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((err) => next(err));
});

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(PORT);
console.log(`Server running on port ${PORT}`);
