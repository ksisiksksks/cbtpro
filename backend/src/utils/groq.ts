import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const parseQuestionsFromText = async (text: string) => {
  const prompt = `
Extract multiple choice questions from the following text and format them as a JSON object containing a 'questions' array.
Each object in the array must have the following exact structure:
{
  "text": "The question text",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "correctOption": "A" // The correct option letter, must be a string like "A", "B", "C", "D"
}

Ensure the root object is in this format: {"questions": [...]}
Here is the text to extract from:
${text}
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192", // Fast and efficient model
      response_format: { type: "json_object" }, // Wait, JSON object needs a root key. Let's ask for an array inside an object.
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || "{}";
    return JSON.parse(responseContent);
  } catch (error) {
    console.error("Groq Error:", error);
    throw new Error("Failed to parse questions from PDF text");
  }
};
