import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    topic: 'Remote work is the future',
    rounds: 3,
    agents: [
      { name: 'GPT-4', stance: 'pro' },
      //{ name: 'Claude', stance: 'con' },
      { name: 'Gemini', stance: 'neutral' },
    ],
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgentChange = (index, field, value) => {
    const newAgents = [...formData.agents];
    newAgents[index][field] = value;
    setFormData((prev) => ({ ...prev, agents: newAgents }));
  };

  const addAgent = () => {
    setFormData((prev) => ({
      ...prev,
      agents: [...prev.agents, { name: '', stance: 'pro' }],
    }));
  };

  const removeAgent = (index) => {
    setFormData((prev) => ({
      ...prev,
      agents: prev.agents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.agents.some(agent => !agent.name)) {
      alert('Please provide a name for all agents!');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('https://kingmurdserver.onrender.com/api/debate', formData);
      setResponse(res.data);
    } catch (error) {
      console.error('Error:', error);
      setResponse({ error: 'Something went wrong!' });
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>AI Debate Simulator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Debate Topic:</label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="Enter debate topic"
          />
        </div>

        <div>
          <label>Rounds:</label>
          <input
            type="number"
            name="rounds"
            value={formData.rounds}
            onChange={handleChange}
            min="1"
            max="10"
          />
        </div>

        <div className="agents-section">
          <h3>Debating Agents</h3>
          {formData.agents.map((agent, index) => (
            <div key={index} className="agent-row">
              <label>Agent Name:</label>
              <input
                type="text"
                value={agent.name}
                onChange={(e) => handleAgentChange(index, 'name', e.target.value)}
                placeholder="e.g., GPT-4, Claude, Gemini"
                required
              />
              <label>Stance:</label>
              <select
                value={agent.stance}
                onChange={(e) => handleAgentChange(index, 'stance', e.target.value)}
              >
                <option value="pro">Pro</option>
                <option value="con">Con</option>
                <option value="neutral">Neutral</option>
              </select>
              <button
                type="button"
                onClick={() => removeAgent(index)}
                disabled={formData.agents.length <= 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addAgent}>Add Agent</button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Running...' : 'Start Debate'}
        </button>
      </form>

      {response && (
        <div className="results">
          <h2>Debate Results</h2>
          {response.error ? (
            <p>{response.error}</p>
          ) : (
            <pre>{response.debateLog}</pre>
          )}
        </div>
      )}
    </div>
  );
}

export default App;