const express = require("express");

const app = express();

app.use(express.json());

let entries = [
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

const getCurrentTimestamp = () => {
  const date = new Date();
  const day = date.getDate();
  const time = date.toLocaleTimeString();
  const timezone = date.getTimezoneOffset();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const month = months[date.getMonth()];
  const dayOfWeek = days[date.getDay()];
  const year = date.getFullYear();

  const timezoneString = `UTC${timezone >= 0 ? "+" : ""}${timezone / 60}`;

  const dateString = `${dayOfWeek}, ${month} ${day}, ${year} - ${time} ${timezoneString}`;

  return dateString;
};

const generateId = () => {
  const generatedId = Math.floor(Math.random() * 100000);
  return generatedId;
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/info", (request, response) => {
  const dateString = getCurrentTimestamp();

  const responseText = `Phonebook has info for ${entries.length} people  ${dateString}`;
  response.send(responseText);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const entry = entries.find((e) => e.id === id);

  if (!entry) {
    response.status(404).end();
  }

  response.json(entry);
});

app.get("/api/persons", (request, response) => {
  response.json(entries);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  entries = entries.filter((e) => e.id !== id);
  console.log(entries);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const entry = request.body;
  const exists = entries.find((e) => e.name === entry.name);

  if (entry && !entry.name) {
    response
      .status(404)
      .json({ error: "The phonebook entry must have a name" });
    return;
  }
  if (entry && !entry.number) {
    response
      .status(404)
      .json({ error: "The phonebook entry must have a number" });
    return;
  }

  if (exists) {
    response.status(404).json({ error: "The phonebook entry must be unique" });
    return;
  }

  const serverEntry = {
    id: generateId(),
    name: entry.name,
    number: entry.number,
  };

  entries = entries.concat(serverEntry);

  response.json(serverEntry);
});

const PORT = 3001;
app.listen(PORT);
console.log("Listening to port:", PORT);
