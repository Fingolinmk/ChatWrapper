"use client";
import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/auth';
import getBackendUrl from '@/utils/get_be';

interface CreateAgentComponentProps {
  onClose: () => void;
}

const CreateAgentComponent: React.FC<CreateAgentComponentProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [temperature, setTemperature] = useState(0.3);
  const [topP, setTopP] = useState(0.95);
  const [model, setModel] = useState('mistral-medium-2505');
  const [tools, setTools] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState('');
  const { token } = useAuthStore();

  useEffect(() => {
    // Fetch API key from the backend
    const fetchApiKey = async () => {
        
        if (model) {
          try {
            const response = await fetch(`${getBackendUrl()}/api/api_keys/`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            if (response.ok) {
              const data = await response.json();
              setApiKey(data[0].key);
            } else {
              console.error('Error fetching API key:', response.statusText);
            }
          } catch (error) {
            console.error('Error fetching API key:', error);
          }
        }
      
    };
    fetchApiKey();
  }, [token]);

  const handleToolChange = (tool: string) => {
    setTools((prevTools) =>
      prevTools.includes(tool) ? prevTools.filter((t) => t !== tool) : [...prevTools, tool]
    );
  };

  const handleCreateAgent = async () => {
    try {
      console.log("Step 1: Create the agent in Mistral's API against https://api.mistral.ai/v1/agents with: ",apiKey)
      // Step 1: Create the agent in Mistral's API
      const mistralResponse = await fetch('https://api.mistral.ai/v1/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          name,
          description,
          instructions,
          tools: tools.map((tool) => ({ type: tool })),
          completion_args: {
            temperature,
            top_p: topP,
          },
        }),
      });

      if (mistralResponse.ok) {
        const mistralAgent = await mistralResponse.json();

        console.log("mistralAgent:", mistralAgent)
        
        // Step 2: Store the agent information in your backend
        const backendResponse = await fetch(`${getBackendUrl()}/api/agents/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            model: mistralAgent.model,
            id: mistralAgent.id,
            name: mistralAgent.name,
            description: mistralAgent.description,
            instructions: mistralAgent.instructions,
            tools: mistralAgent.tools,
            completion_args: mistralAgent.completion_args,
            version: mistralAgent.version,
            created_at: mistralAgent.created_at,
            updated_at: mistralAgent.updated_at,
            provider_id: 1, // Assuming a default provider ID for now
          }),
        });

        if (backendResponse.ok) {
          const newAgent = await backendResponse.json();
          console.log('Agent created:', newAgent);
          onClose(); // Close the component after successful creation
        } else {
          console.error('Error storing agent in backend:', backendResponse.statusText);
        }
      } else {
        console.error('Error creating agent in Mistral:', mistralResponse.statusText);
      }
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create New Agent</h2>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Instructions</label>
        <input
          type="text"
          className="form-control"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Model</label>
        <select
          className="form-control"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="mistral-medium-2505">Mistral Medium 2505</option>
          <option value="mistral-medium-latest">Mistral Medium Latest</option>
          {/* Add more models as needed */}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Tools</label>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={tools.includes('web_search')}
            onChange={() => handleToolChange('web_search')}
          />
          <label className="form-check-label">Web Search</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={tools.includes('web_search_premium')}
            onChange={() => handleToolChange('web_search_premium')}
          />
          <label className="form-check-label">Web Search Premium</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={tools.includes('code_interpreter')}
            onChange={() => handleToolChange('code_interpreter')}
          />
          <label className="form-check-label">Code Interpreter</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={tools.includes('image_generation')}
            onChange={() => handleToolChange('image_generation')}
          />
          <label className="form-check-label">Image Generation</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={tools.includes('document_library')}
            onChange={() => handleToolChange('document_library')}
          />
          <label className="form-check-label">Document Library</label>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Temperature</label>
        <input
          type="number"
          className="form-control"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Top P</label>
        <input
          type="number"
          className="form-control"
          value={topP}
          onChange={(e) => setTopP(parseFloat(e.target.value))}
        />
      </div>

      <div className="row justify-content-between">
        <div className="col-auto">
          <button className="btn btn-primary" onClick={handleCreateAgent}>
            Create Agent
          </button>
        </div>
        <div className="col-auto">
          <button className="btn btn-secondary ml-2" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAgentComponent;