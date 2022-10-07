const express = require("express");
const morgan = require("morgan");
const app = express();
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(express.json());
app.use(requestLogger);
//app.use(morgan("tiny"));

app.use(
  morgan(":method :status :res[content-length] - :response-time ms :post")
);

morgan.token("post", function (req, res) {
  return JSON.stringify(req.body);
});

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

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const currentDate = new Date();
  const timeStamp = currentDate.toString();
  const message = `<p>Phonebook has info for ${persons.length} people <br><br>${timeStamp} </p>`;
  response.send(message);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => {
    return person.id === id;
  });

  if (person) {
    response.json(person);
  } else {
    response.statusMessage = "This api doesnot exist";
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  let maxId;
  do {
    maxId = Math.floor(Math.random() * 10000000);
  } while (persons.find((person) => person.id === maxId));

  return maxId;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    //console.log(body.name);
    return response.status(400).json({
      error: "name missing",
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  } else if (
    persons.includes(persons.find((person) => person.name === body.name))
  ) {
    //console.log(typeof body.name);
    return response.status(400).json({
      error: "name must be unique",
    });
  } else {
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    };

    persons = persons.concat(person);

    response.json(person);
  }

  //console.log(person);
});
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
