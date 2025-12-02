import express from 'express';
import openai from '../config/openai.js'; 

const router = express.Router();

router.post('/generate-invite-html', async (req, res) => {
  // You can send these fields from Postman: eventTitle, date, time, venue, host, rsvp, theme
  const { eventTitle, date, time, venue, host, rsvp, theme } = req.body;
  try {
    const prompt = `
      Generate a modern HTML invitation card for an event.
      Title: ${eventTitle}
      Date: ${date}
      Time: ${time}
      Venue: ${venue}
      Host: ${host}
      RSVP: ${rsvp}
      Theme: ${theme}
      The output should be a visually appealing, ready-to-render HTML string, with a background image and inline CSS.
    `;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert HTML designer." },
        { role: "user", content: prompt }
      ],
      max_tokens: 900,
      temperature: 0.7
    });
    const html = response.choices[0].message.content.trim();
    res.json({ success: true, html });
  } catch (error) {
    console.error("AI HTML generation failed:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
