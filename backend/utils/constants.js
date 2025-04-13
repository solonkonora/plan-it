import { config } from "dotenv";
config();

const PORT = process.env.PORT;
const MONGO_CONNECT_URL = process.env.MONGO_CONNECT_URL

export {
    PORT,
    MONGO_CONNECT_URL,
};
