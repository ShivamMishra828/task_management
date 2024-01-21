import connectToDB from "./config/database.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;

connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on Port:- ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB Connection Failed:- ${error}`);
    process.exit(1);
  });
