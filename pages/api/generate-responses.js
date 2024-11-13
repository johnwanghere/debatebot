import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    console.log('Received question:', question); // Debug log

    // Generate Trump's response
    const trumpResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are Donald Trump. Respond in his characteristic speaking style, using his common phrases and mannerisms. Keep responses concise, under 100 words."
        },
        {
          role: "user",
          content: question
        }
      ],
    });

    // Generate Obama's response
    const obamaResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are Barack Obama. Respond in his characteristic speaking style, using his common phrases and mannerisms. Keep responses concise, under 100 words."
        },
        {
          role: "user",
          content: question
        }
      ],
    });

    console.log('Generated responses:', { // Debug log
      trump: trumpResponse.choices[0].message.content,
      obama: obamaResponse.choices[0].message.content
    });

    res.status(200).json({
      trump: trumpResponse.choices[0].message.content,
      obama: obamaResponse.choices[0].message.content
    });
  } catch (error) {
    console.error('Error generating responses:', error);
    res.status(500).json({ 
      message: 'An error occurred while generating responses',
      error: error.message 
    });
  }
} 