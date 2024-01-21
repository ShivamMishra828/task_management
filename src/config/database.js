import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);

    console.log(
      `MongoDB Connection Established at:- ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`Error Occured while connecting to DB:- ${error}`);
    process.exit(1);
  }
};

export default connectToDB;
