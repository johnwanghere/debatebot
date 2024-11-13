import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { question, speakingFirst, round, previousResponses } = req.body;
    
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    // Determine current speaker
    const currentSpeaker = round % 2 === 1 ? speakingFirst : (speakingFirst === 'trump' ? 'obama' : 'trump');
    
    // Build conversation history
    const messages = [
      {
        role: "system",
        content: currentSpeaker === 'trump' 
          ? "You are Donald Trump. Respond in his characteristic speaking style, using his common phrases and mannerisms. Keep responses concise, under 100 words. There's a 50% chance you should reference or address Barack Obama (calling him 'Obama', 'Barack', etc.) in your response."
          : "You are Barack Obama. Respond in his characteristic speaking style, using his common phrases and mannerisms. Keep responses concise, under 100 words. There's a 50% chance you should reference or address Donald Trump (calling him 'Trump', 'Donald', etc.) in your response."
      },
      {
        role: "user",
        content: question
      }
    ];

    // Add previous responses to the conversation
    previousResponses.forEach((response, index) => {
      const speaker = (index % 2 === 0) ? speakingFirst : (speakingFirst === 'trump' ? 'obama' : 'trump');
      messages.push({
        role: "assistant",
        content: response
      });
    });

    // Generate response
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
    });

    console.log(`Generated response for round ${round}:`, response.choices[0].message.content);

    res.status(200).json({
      response: response.choices[0].message.content
    });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ 
      message: 'An error occurred while generating response',
      error: error.message 
    });
  }
} 