const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@cluster0.xjegr4x.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
  id: Number,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 4) {
  console.log("phonebook: ");
  Person.find().then((result) => {
    console.log(result);
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name,
    number: Number(number),
    id: Math.floor(Math.random() * 100000),
  });

  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
