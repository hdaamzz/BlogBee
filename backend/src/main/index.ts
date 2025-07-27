import http from "http";
import * as process from 'process';
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "../infrastructure/config/database.connect";

connectDB();

const PORT = process.env.PORT || 5000;

if (!PORT) {
    throw new Error('PORT is not defined in environment variables');
}

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});