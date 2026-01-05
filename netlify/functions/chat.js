// netlify/functions/chat.js
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message } = JSON.parse(event.body);

    // 1. Check if API Key exists
    if (!process.env.GROQ_API_KEY) {
      console.error("CRITICAL: GROQ_API_KEY is missing in Netlify Env Vars!");
      throw new Error("Missing Server API Key");
    }

    // 2. Call Groq API with the NEW MODEL
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // UPDATED MODEL HERE:
        model: "llama-3.1-8b-instant", 
        messages: [
          {
            role: "system",
            content: "You are PEPPERai, a CLI-based AI assistant for tejreddym.cv portfolio website and for now you don't have info about Tej Reddy M and say i under training. Keep answers brief, 'hacker-style', and technical. Do not use markdown formatting like **bold** or # headers, just plain text."
          },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    const data = await response.json();

    // 3. Error Handling
    if (!response.ok) {
      console.error("Groq API Error:", JSON.stringify(data, null, 2));
      throw new Error(`Groq Error: ${data.error?.message || 'Unknown error'}`);
    }

    if (!data.choices || !data.choices[0]) {
      console.error("Unexpected Structure:", JSON.stringify(data, null, 2));
      throw new Error('No choices in response');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices[0].message.content })
    };

  } catch (error) {
    console.error("Function Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: `System Error: ${error.message}` })
    };
  }
};