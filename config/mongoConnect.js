const mongoose = require("mongoose");

// mongo atlas url
const mongoAtlasUrl = process.env.DB_URL;

mongoose.set("strictQuery", false);

const mongoDB = () => {
  mongoose
    .connect(mongoAtlasUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("connected");
    })
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
};

module.exports = mongoDB;
