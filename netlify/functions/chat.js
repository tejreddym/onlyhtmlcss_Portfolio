export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message } = JSON.parse(event.body);
    
    // Check if Key exists (Debugging Step 1)
    if (!process.env.GROQ_API_KEY) {
      console.error("CRITICAL: GROQ_API_KEY is missing in Netlify Env Vars!");
      throw new Error("Missing Server API Key");
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Standard Groq model
        messages: [
          { role: "system", content: "You are PEPPERai. Keep answers brief and technical." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    // LOG THE FULL RESPONSE (This is the Fix)
    // If Groq errors, this will show up in your Netlify Logs
    if (!response.ok) {
      console.error("Groq API Error:", JSON.stringify(data, null, 2));
      throw new Error(`Groq API Error: ${data.error?.message || 'Unknown error'}`);
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