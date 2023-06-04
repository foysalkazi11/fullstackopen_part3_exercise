const mongoose = require("mongoose");

// Replace '<password>' with your MongoDB Atlas password
const password = encodeURIComponent(process.argv[2]);
console.log(password);

// Replace '<database-name>' with the name of your MongoDB Atlas database
const dbName = "fullStackOpen";

const url = `mongodb+srv://kazi:${password}@cluster0.7zy5v.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  // Fetch all entries from the phonebook
  Person.find({}).then((persons) => {
    console.log("phonebook:");
    persons.forEach((person) => {
      console.log(`${person.name} ${person.phone}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  // Add a new entry to the phonebook
  const name = process.argv[3];
  const phone = process.argv[4];

  const person = new Person({
    name,
    phone,
  });

  person.save().then(() => {
    console.log(`added ${name} number ${phone} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log("Invalid number of arguments.");
  mongoose.connection.close();
}
