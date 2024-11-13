import { useState, useRef } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('')
  const [responses, setResponses] = useState({ trump: '', obama: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [speakingFirst, setSpeakingFirst] = useState('trump')
  const [debateRounds, setDebateRounds] = useState([])
  const textareaRef = useRef(null);
  const [currentRound, setCurrentRound] = useState(0);

  const askQuestion = async () => {
    try {
      setDebateRounds([]); // Clear previous responses
      if (!question.trim()) {
        alert('Please enter a question');
        return;
      }

      setIsLoading(true);
      setCurrentRound(1); // Start with round 1

      // First response
      const response1 = await fetch('/api/generate-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question,
          speakingFirst,
          round: 1,
          previousResponses: []
        })
      });

      if (!response1.ok) throw new Error('Failed to generate first response');
      const data1 = await response1.json();
      setDebateRounds([
        { speaker: speakingFirst, text: data1.response }
      ]);
      
      setCurrentRound(2); // Move to round 2
      // Second response
      const response2 = await fetch('/api/generate-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question,
          speakingFirst,
          round: 2,
          previousResponses: [data1.response]
        })
      });

      if (!response2.ok) throw new Error('Failed to generate second response');
      const data2 = await response2.json();
      setDebateRounds(prev => [...prev, 
        { speaker: speakingFirst === 'trump' ? 'obama' : 'trump', text: data2.response }
      ]);

      setCurrentRound(3); // Move to round 3
      // Third response
      const response3 = await fetch('/api/generate-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question,
          speakingFirst,
          round: 3,
          previousResponses: [data1.response, data2.response]
        })
      });

      if (!response3.ok) throw new Error('Failed to generate third response');
      const data3 = await response3.json();
      setDebateRounds(prev => [...prev,
        { speaker: speakingFirst, text: data3.response }
      ]);

      setCurrentRound(4); // Move to round 4
      // Fourth response
      const response4 = await fetch('/api/generate-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question,
          speakingFirst,
          round: 4,
          previousResponses: [data1.response, data2.response, data3.response]
        })
      });

      if (!response4.ok) throw new Error('Failed to generate fourth response');
      const data4 = await response4.json();
      setDebateRounds(prev => [...prev,
        { speaker: speakingFirst === 'trump' ? 'obama' : 'trump', text: data4.response }
      ]);

    } catch (error) {
      console.error('Error details:', error);
      alert('Error generating responses: ' + error.message);
    } finally {
      setIsLoading(false);
      setCurrentRound(0);
    }
  }

  const handleSubmit = async () => {
    if (isLoading) return; // Prevent multiple submissions while loading
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    setIsLoading(true);
    await askQuestion();
    setQuestion(''); // Clear the question after submission
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black"
      style={{
        backgroundImage: "url('/debate-stage.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
      <div className="fixed inset-0 bg-black/40 z-0" />
      <div className="relative z-10 flex flex-col min-h-screen overflow-auto">
        <div className="container mx-auto px-4 max-w-4xl pt-8 pb-8">
          <div className="flex flex-col items-center m-8">
            <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#E81B23] to-[#0644B9]">
              Presidential Debate Simulator
            </h1>
            <div className="mb-4 flex items-center space-x-4">
              <span className="text-white">Speaking First:</span>
              <select 
                value={speakingFirst}
                onChange={(e) => setSpeakingFirst(e.target.value)}
                className="bg-gray-950 text-white border border-gray-500 rounded p-2"
              >
                <option value="trump">Trump</option>
                <option value="obama">Obama</option>
              </select>
            </div>
            <textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Type your question here..."
              className="w-full h-20 p-2 border opacity-80 border-gray-500 bg-gray-950 text-white rounded-lg mb-2"
            />
            <button
              onClick={askQuestion}
              disabled={isLoading}
              className={`w-full py-4 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Generating...' : 'Ask Question'}
            </button>

            <div className="w-full mt-8 space-y-4">
              {debateRounds.map((round, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg w-3/4 ${
                    round.speaker === 'trump' 
                      ? 'bg-gray-950/60 border-red-600 border text-red-600' 
                      : 'bg-gray-950/60 border-blue-600 border text-blue-500'
                  } ${
                    index % 2 === 0 ? 'ml-0' : 'ml-auto'
                  }`}
                >
                  <div className={`flex items-center space-x-2 mb-2 ${
                    index % 2 === 0 ? '' : 'flex-row-reverse space-x-reverse'
                  }`}>
                    <img 
                      src={`/${round.speaker}-pyramid.png`}
                      alt={round.speaker}
                      className="w-8 h-8 object-cover"
                    />
                    <span className="font-bold capitalize">{round.speaker}</span>
                  </div>
                  <div className={`${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                    {round.text}
                  </div>
                </div>
              ))}
              
              {isLoading && currentRound > 0 && (
                <div 
                  className={`p-4 rounded-lg w-3/4 ${
                    currentRound % 2 === 1 
                      ? (speakingFirst === 'trump' ? 'bg-gray-950/60 border-red-600' : 'bg-gray-950/60 border-blue-600')
                      : (speakingFirst === 'trump' ? 'bg-gray-950/60 border-blue-600' : 'bg-gray-950/60 border-red-600')
                  } ${
                    (currentRound - 1) % 2 === 0 ? 'ml-0' : 'ml-auto'
                  } border animate-pulse`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 