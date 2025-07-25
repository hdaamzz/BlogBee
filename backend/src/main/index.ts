import http from "http";
import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import connectDB from "../infrastructure/config/database-connect";


connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);


if(!PORT) {
    throw new Error('PORT is not defined in env')
}
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
