const mongoose = require("mongoose");

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  // eslint-disable-next-line no-unused-vars
  .then((response) => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("Connection to database failed", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function (value) {
        const hyphenIndex = value.indexOf("-");
        if (hyphenIndex === 2 || hyphenIndex === 3) {
          return true;
        }
        return false;
      },
    },
  },
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
