import { useState } from 'react';
import './App.css';

function App() {
  const [idea, setIdea] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlan('');

    try {
      const response = await fetch('https://your-backend-url.onrender.comgenerate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea }),
      });

      const data = await response.json();
      setPlan(data.plan || 'No plan received.');
    } catch (err) {
      console.error(err);
      setPlan('Error generating plan. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>AI Business Idea Planner</h1>
      <form onSubmit={handleGeneratePlan}>
        <input
          type="text"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe your business idea"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </form>
      {plan && (
        <div className="result">
          <h2>Business Plan</h2>
          <pre>{plan}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
