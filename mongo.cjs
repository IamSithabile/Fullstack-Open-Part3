const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((response) => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("Connection to database failed", error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
  id: Number,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
