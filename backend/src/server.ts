import express from "express";
import cors from "cors";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY in .env");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/api/chat", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  const prompt = (req.query.prompt as string)?.trim();

  if (!prompt) {
    res.write(
      `data: ${JSON.stringify({
        success: false,
        error: "No prompt provided",
      })}\n\n`
    );
    res.end();
    return;
  }

  let clientDisconnected = false;
  req.on("close", () => {
    clientDisconnected = true;
    res.end();
  });

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      if (clientDisconnected) break;

      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        try {
          res.write(
            `data: ${JSON.stringify({ success: true, data: content })}\n\n`
          );
        } catch (err) {
          break;
        }
      }
    }

    if (!clientDisconnected) {
      res.write(`data: ${JSON.stringify({ success: true, done: true })}\n\n`);
      res.end();
    }
  } catch (error) {
    if (!clientDisconnected) {
      res.write(
        `data: ${JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : String(error),
        })}\n\n`
      );
      res.end();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
