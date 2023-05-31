const express = require("express");
const cors = require("cors");
const randomNumber = require("./services/createRandomNumber");
const unknownEndpoint = require("./middleware/unknownEndpoint");
const morganMiddleware = require("./middleware/morganMiddleware");
const PORT = process.env.PORT || 3001;
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// person find by id

const personFindById = (id) => persons.find((per) => per.id === id);

const app = express();
app.use(express.static("build"));
app.use(cors());
app.use(express.json());
app.use(morganMiddleware());

// get info
app.get("/info", (req, res) => {
  res.send(`<div>
    <p>Phonebook has info for ${persons.length} people
    <p>${new Date()} </p>
    </div>`);
});

// get all persons
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// get a single person
app.get("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  const findPerson = personFindById(id);

  if (findPerson) {
    res.json(findPerson);
  } else {
    res.status(404).json({ error: `Person not found by this ${id}` });
  }
});

// delete a single person
app.delete("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  const findPerson = personFindById(id);
  if (findPerson) {
    persons = persons.filter((per) => per.id !== id);
    res.status(204).json({ success: "Delete successfully" });
  } else {
    res.status(404).json({ error: `Person not found by this ${id}` });
  }
});

// create a new person
app.post("/api/persons", (req, res) => {
  const body = req.body;
  const findPersonByName = persons.find((per) => per.name === body.name);
  if (!body.name || !body.number) {
    res.status(400).json({ error: "Name or number missing" });
  } else if (findPersonByName) {
    res.status(400).json({ error: "name must be unique" });
  } else {
    const person = {
      name: body.name,
      number: body.number,
      id: randomNumber(),
    };
    persons = persons.concat(person);
    res.json(person);
  }
});

app.use(unknownEndpoint);

app.listen(PORT);
console.log(`Server running on port ${PORT}`);
