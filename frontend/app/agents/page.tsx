"use client";
import React, { useState, useEffect } from 'react';
import CreateAgentComponent from '../../components/CreateAgentComponent';
import useAuthStore from '../../store/auth';
import getBackendUrl from '@/utils/get_be';

const AgentsPage = () => {
  const [agents, setAgents] = useState<{ id: number; name: string; description: string }[]>([]);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    // Fetch agents from the backend
    const fetchAgents = async () => {
      try {
        const response = await fetch(getBackendUrl() + '/api/agents/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAgents(data);
        } else {
          console.error('Error fetching agents:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchAgents();
  }, [token]);

  return (
    <div className="container mt-5">
      <h2>Agents</h2>
      <button className="btn btn-primary mb-3" onClick={() => setShowCreateAgent(true)}>
        Create New Agent
      </button>
      {showCreateAgent && (
        <CreateAgentComponent onClose={() => setShowCreateAgent(false)} />
      )}
      <ul className="list-group">
        {agents.map((agent) => (
          <li key={agent.id} className="list-group-item">
            <h5>{agent.name}</h5>
            <p>{agent.description}</p>
            {/* Add edit and delete functionality here */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgentsPage;