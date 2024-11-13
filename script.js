async function generateResponse(question, speaker) {
    try {
        const response = await fetch('http://localhost:3000/api/generate-response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question,
                speaker
            })
        });

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error:', error);
        return "Sorry, I couldn't generate a response right now.";
    }
}

async function askQuestion() {
    const question = document.getElementById('questionInput').value;
    
    if (question.trim() === '') {
        alert('Please enter a question!');
        return;
    }
    
    // Show loading state
    document.getElementById('trumpResponse').innerText = "Thinking...";
    document.getElementById('obamaResponse').innerText = "Thinking...";
    
    try {
        const [trumpResponse, obamaResponse] = await Promise.all([
            generateResponse(question, 'trump'),
            generateResponse(question, 'obama')
        ]);
        
        document.getElementById('trumpResponse').innerText = trumpResponse;
        document.getElementById('obamaResponse').innerText = obamaResponse;
    } catch (error) {
        console.error('Error:', error);
        alert('Sorry, something went wrong. Please try again.');
    }
} 