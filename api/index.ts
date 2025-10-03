import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import serverless from "serverless-http";

// Wrap the Express app for Vercel serverless
const handler = serverless(app);

export default async function (req: VercelRequest, res: VercelResponse) {
  return handler(req as any, res as any);
}
