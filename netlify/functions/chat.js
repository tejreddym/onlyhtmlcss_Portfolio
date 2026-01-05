// netlify/functions/chat.js
export const handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message } = JSON.parse(event.body);

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, // Uses the secure variable
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Fast and efficient model
        messages: [
          {
            role: "system",
            content: "You are PEPPERai, an advanced AI assistant for Tej Reddy. You are embedded in a portfolio website terminal. Keep answers brief, technical, and 'hacker-like'. You know Tej is an AI/ML innovator interested in rocketry, IoT, and defense tech."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    // Check if Groq gave a valid answer
    if (!data.choices || !data.choices[0]) {
      throw new Error('No response from AI');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices[0].message.content })
    };

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Error: Connection interrupted. Signal lost." })
    };
  }
};