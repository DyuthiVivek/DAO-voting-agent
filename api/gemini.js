import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

function createInstance(params) {
  let {
    modelName,
    apiKey,
  } = params || {};
  modelName = modelName || process.env.GEMINI_MODEL;
  apiKey = apiKey || process.env.GEMINI_API_KEY;

  console.log("Gemini createInstance", {
    modelName,
    apiKey: apiKey ? apiKey.substring(0, 12) + "..." : undefined,
  });

  return new ChatGoogleGenerativeAI({
    model: modelName,
    apiKey,
  });
}

export { createInstance };
