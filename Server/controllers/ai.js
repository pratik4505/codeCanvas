const { OpenAI } = require('openai'); // Import OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your environment variables
});

// Define the function to handle prompt generation
const generateContent = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Send a request to OpenAI's Chat Completion endpoint
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use "gpt-4" or "gpt-3.5-turbo" based on your availability
      messages: [
        {
          role: "user",
          content: prompt, // Send the prompt directly from the request
        },
      ],
    });

    // Extract and send the generated content back as a response
    const generatedText = response.choices[0].message.content;
    res.json({ text: generatedText });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
};

module.exports = { generateContent };