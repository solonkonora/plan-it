import * as mongoose from "mongoose";
import { MONGO_CONNECT_URL } from "../../utils/constants.js";
import dotenv from "dotenv";

dotenv.config()

mongoose
    .connect(MONGO_CONNECT_URL)
    .then(() => console.log("mongoose connected\n"))
    .catch((error) => {
        console.error("\nConnection error: ", error);
        console.error("Full error details: ", error);
    });
export default mongoose;
