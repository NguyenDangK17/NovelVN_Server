import app from "./app";
import dotenv from "dotenv";
import { AddressInfo } from "net";

// ❌ Not needed on Vercel (serverless):
// import http from 'http';
// import { Server as SocketIOServer } from 'socket.io';
// import jwt from 'jsonwebtoken';

dotenv.config();

// Local development entry (vercel will not call this file)
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  const address = server.address() as AddressInfo;
  console.log(`🚀 Server listening on http://localhost:${address.port}`);
});