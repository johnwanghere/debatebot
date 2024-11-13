import { useState, useRef } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('')
  const [responses, setResponses] = useState({ trump: '', obama: '' })
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef(null);

  const askQuestion = async () => {
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate responses');
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      setResponses(data);
    } catch (error) {
      console.error('Error details:', error);
      alert('Error generating responses: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = () => {
    askQuestion();
    setQuestion('');
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.selectionStart = 0;
        textareaRef.current.selectionEnd = 0;
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-screen relative"
      style={{
        backgroundImage: "url('/debate-stage.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex flex-col h-screen">
        <div className="container mx-auto px-4 max-w-4xl pt-8">
          <div className="flex flex-col items-center m-8">
            <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#E81B23] to-[#0644B9]">
              Presidential Debate Simulator
            </h1>
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

            <div className="grid md:grid-cols-2 gap-8 mt-8 w-full">
              {/* Trump Column */}
              <div className="flex flex-col items-center bg-gray-950/60 p-6 rounded-lg">
                <div className="w-20 aspect-square mb-4 text-red-600">
                      <img 
                        src="/trump-pyramid.png"
                        alt="Trump"
                        className="w-full h-full object-cover opacity-100"
                      /> <h2 className="text-3xl font-bold text-red-600">Trump</h2>
                </div> 
                
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2 mt-12">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-center mt-4 text-red-600 opacity-100 mt-12">{responses.trump}</div>
                  </>
                )}
              </div>

              {/* Obama Column */}
              <div className="flex flex-col items-center bg-gray-950/60 p-6 rounded-lg">
                <div className="w-20 aspect-square mb-4">
                      <img 
                        src="/obama-pyramid.png"
                        alt="Obama"
                        className="w-full h-full object-cover opacity-100"
                      /> <h2 className="text-2xl font-bold text-blue-600">Obama</h2>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2 mt-12">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-center text-blue-500 mt-4 opacity-100 mt-12">{responses.obama}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 