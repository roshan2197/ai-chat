import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { messages, context } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: "Messages are required" });
  }

  try {
    // Build system message with knowledge base context
    const systemMessage = context 
      ? `You are a helpful assistant with access to a knowledge base. Use the provided information to answer questions accurately. If the user asks something not in the knowledge base, you can use your general knowledge.${context}`
      : "You are a helpful assistant.";

    // Build conversation for Groq
    const groqMessages = [
      { role: "system", content: systemMessage },
      ...messages // Include full conversation history
    ];

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: groqMessages,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return res.json({
      answer: response.data?.choices?.[0]?.message?.content ?? "No response",
    });
  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);

    return res.status(500).json({
      error: "AI request failed",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
