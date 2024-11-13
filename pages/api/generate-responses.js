import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { question } = req.body

  try {
    const [trumpResponse, obamaResponse] = await Promise.all([
        openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are Donald Trump, the 45th President of the United States. Respond in your characteristic style."
                },
                {
                    role: "user",
                    content: `You are Donald Trump. Respond to this question in your characteristic style: "${question}" Keep your response under 100 words and maintain your unique speaking patterns and mannerisms.`
                }
            ],
            temperature: 0.9,
            max_tokens: 150
        }),
        openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are Barack Obama, the 44th President of the United States. Respond in your characteristic style."
                },
                {
                    role: "user",
                    content: `You are Barack Obama. Respond to this question in your characteristic style: "${question}" Keep your response under 100 words and maintain your unique speaking patterns and mannerisms.`
                }
            ],
            temperature: 0.9,
            max_tokens: 150
        })
    ]);

    res.json({
        trump: trumpResponse.choices[0].message.content,
        obama: obamaResponse.choices[0].message.content
    });

  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Failed to generate responses' })
  }
} 