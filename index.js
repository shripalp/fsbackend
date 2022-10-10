require("dotenv").config();
const Phonebook = require("./models/phonebook");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const phonebook = require("./models/phonebook");
const app = express();

app.use(express.json());

//app.use(morgan("tiny"));

app.use(
  morgan(":method :status :res[content-length] - :response-time ms :post")
);

morgan.token("post", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(cors());

app.use(express.static("build"));

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Phonebook.find({}).then((persons) => response.json(persons));
});

app.get("/info", (request, response) => {
  const currentDate = new Date();
  const timeStamp = currentDate.toString();
  Phonebook.find({}).then((persons) => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p><p>${timeStamp}</p>`
    );
  });
});

app.get("/api/persons/:id", (request, response) => {
  Phonebook.findById(request.param.id).then((person) => {
    if (person) {
      response.json(person);
    } else {
      response.statusMessage = "This api doesnot exist";
      response.status(404).end();
    }
  });
});

// app.delete("/api/persons/:id", (request, response) => {
//   const id = Number(request.params.id);
//   persons = persons.filter((person) => person.id !== id);

//   response.status(204).end();
// });

// const generateId = () => {
//   let maxId;
//   do {
//     maxId = Math.floor(Math.random() * 10000000);
//   } while (persons.find((person) => person.id === maxId));

//   return maxId;
// };

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const person = new Phonebook({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

//console.log(person);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
