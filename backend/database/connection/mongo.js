import * as mongoose from "mongoose";
import { MONGO_CONNECT_URL } from "../../utils/constants.js";

mongoose
    .connect(MONGO_CONNECT_URL)
    .then(() => console.log("mongoose connected\n"))
    .catch((error) => console.error("\nerror: ", error?.message || error))

export default mongoose;
