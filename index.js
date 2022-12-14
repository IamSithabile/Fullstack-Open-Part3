require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const static = require("static");

const mongoose = require("mongoose");
const Person = require("./mongo.cjs");

app.use(cors());
app.use(express.static("build"));

morgan.token("mBody", function getBody(req) {
  return JSON.stringify(req.body);
});

app.use(morgan(":method :url :res[content-length] - :response-time ms :mBody"));

app.use(express.json());

// app.use(morgan("tiny")); --> displayed a prefomated log

//// Create the timestamp

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

///// HTTP GET\\\\\\\\\

app.get("/api/persons", (request, response) => {
  Person.find({}).then((entries) => {
    console.log("Recieved entries", entries);

    response.json(entries);
    // mongoose.connection.close();
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const entry = entries.find((e) => e.id === id);

  if (!entry) {
    response.status(404).end();
  }

  response.json(entry);
});

app.get("/info", (request, response) => {
  const dateString = getCurrentTimestamp();

  const responseText = `Phonebook has info for ${entries.length} people  ${dateString}`;
  response.send(responseText);
});

///// HTTP DELETE\\\\\\\\\

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  entries = entries.filter((e) => e.id !== id);
  console.log(entries);

  response.status(204).end();
});

/////HTTP POST\\\\\\\\\

app.post("/api/persons", (request, response) => {
  const entry = request.body;
  // const exists = entries.find((e) => e.name === entry.name);

  // if (entry && !entry.name) {
  //   response
  //     .status(404)
  //     .json({ error: "The phonebook entry must have a name" });
  //   return;
  // }
  // if (entry && !entry.number) {
  //   response
  //     .status(404)
  //     .json({ error: "The phonebook entry must have a number" });
  //   return;
  // }

  // if (exists) {
  //   response.status(404).json({ error: "The phonebook entry must be unique" });
  //   return;
  // }

  const databaseEntry = new Person({
    name: entry.name,
    number: entry.number,
  });

  databaseEntry
    .save()
    .then((response) => {
      console.log("Saved phonebook entry");
    })
    .catch((e) =>
      console.log("Unable to save entry into the database", e.message)
    );

  response.json(databaseEntry);
});

///// Handle requests that do not have a path defined
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

/// Listen to post\\\\\\

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log("Listening to port:", PORT);
