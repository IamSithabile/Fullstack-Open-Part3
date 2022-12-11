const express = require("express");

const app = express();

const notes = [
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

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});
app.get("/info", (request, response) => {
  const dateString = getCurrentTimestamp();

  const responseText = `Phonebook has info for ${notes.length} people  ${dateString}`;
  response.send(responseText);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const note = notes.find((n) => n.id === id);

  if (!note) {
    response.status(404).end();
  }

  response.json(note);
});

app.get("/api/persons", (request, response) => {
  response.json(notes);
});

const PORT = 3001;
app.listen(PORT);
console.log("Listening to port:", PORT);
