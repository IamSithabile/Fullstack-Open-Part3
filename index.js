require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person.cjs");

const app = express();

app.use(cors());
app.use(express.static("build"));

morgan.token("mBody", function getBody(req) {
  return JSON.stringify(req.body);
});

app.use(morgan(":method :url :res[content-length] - :response-time ms :mBody"));

app.use(express.json());

const errorHandler = (error, request, response, next) => {
  console.log(error);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "Malformatted ID" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

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

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((entries) => {
      console.log("Recieved entries", entries);

      response.json(entries);
    })
    .catch((error) => {
      console.log("Error fetching entries:", error);
      next(error);
    });
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findById(id)
    .then((person) => {
      console.log("Here is the person:", person);
      response.json(person);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

app.get("/info", (request, response, next) => {
  const dateString = getCurrentTimestamp();

  Person.count({})
    .then((info) => {
      const responseText = `Phonebook has info for ${info} ${
        info === 1 ? "person" : "people"
      }  ${dateString}`;
      response.send(responseText);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

///// HTTP DELETE\\\\\\\\

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndRemove(id)
    .then((result) => {
      console.log("entry Deleted:", result);
      response.status(204).end();
    })
    .catch((error) => {
      console.log("Error deleting", error);
      next(error);
    });
});

/////HTTP PUT\\\\\\

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => {
      if (updatedNote) {
        console.log("Successfully updated the entry");
        response.json(updatedNote);
      }
      if (!updatedNote) {
        response.status(404).json({ error: "No person to update" });
      }
    })
    .catch((error) => {
      console.log("There has been an error updating the entry", error);
      next(error);
    });
});

/////HTTP POST\\\\\\\\

app.post("/api/persons", (request, response, next) => {
  const entry = request.body;

  if (entry && !entry.name) {
    response
      .status(400)
      .json({ error: "The phonebook entry must have a name" });
    return;
  }

  if (entry && !entry.number) {
    response
      .status(400)
      .json({ error: "The phonebook entry must have a number" });
    return;
  }

  Person.exists({ name: entry.name }, (error, exists) => {
    console.log("Does the entry exists? ", exists);
    if (exists) {
      return response
        .status(400)
        .json({ error: "This person is already in the phonebook" });
    }
  });

  const databaseEntry = new Person({
    name: entry.name,
    number: entry.number,
  });

  databaseEntry
    .save()
    .then((savedPerson) => {
      console.log("Saved phonebook entry", savedPerson);
      response.json(databaseEntry);
    })
    .catch((error) => {
      console.log("Unable to save entry into the database", error);
      next(error);
    });
});

///// Handle requests that do not have a path defined

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.use(errorHandler);

/// Listen to post\\\\\\

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log("Listening to port:", PORT);
