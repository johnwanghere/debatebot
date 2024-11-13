'use client'
import { useState } from 'react'

export default function Home() {
  const [question, setQuestion] = useState('')
  const [responses, setResponses] = useState({ trump: '', obama: '' })

  const askQuestion = async () => {
    try {
      const response = await fetch('/api/generate-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      const data = await response.json()
      setResponses(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-8">
        Presidential Debate Simulator
      </h1>
      
      <div className="mb-8 flex gap-4 justify-center">
        <input 
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 max-w-xl p-3 border rounded"
        />
        <button 
          onClick={() => askQuestion()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Ask Question
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="text-center">
          <img 
            src="/trump-pyramid.png" 
            alt="Trump"
            className="w-48 h-48 mx-auto object-cover"
          />
          <h2 className="text-2xl font-bold mt-4">Donald Trump</h2>
          <div className="mt-4 p-4 bg-gray-100 rounded min-h-[100px]">
            {responses.trump}
          </div>
        </div>
        
        <div className="text-center">
          <img 
            src="/obama-pyramid.png" 
            alt="Obama"
            className="w-48 h-48 mx-auto object-cover"
          />
          <h2 className="text-2xl font-bold mt-4">Barack Obama</h2>
          <div className="mt-4 p-4 bg-gray-100 rounded min-h-[100px]">
            {responses.obama}
          </div>
        </div>
      </div>
    </div>
  )
} 