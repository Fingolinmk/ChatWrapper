// frontend/components/ChatComponent.tsx
"use client";
import useAuthStore from '@/store/auth';
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaPen, FaRobot } from 'react-icons/fa'; // Import the pen, bars, info, and robot icons
import getBackendUrl from '@/utils/get_be';
import { Dropdown, DropdownButton } from 'react-bootstrap';

interface ChatComponentProps {
  conversationId: number;
}

interface Message {
  role: string;
  content: string;
}

interface Model {
  id: number;
  name: string;
  description: string;
}

interface Agent {
  id: string;
  name: string;
  description: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ conversationId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState(''); // API key for the selected model or agent
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [models, setModels] = useState<Model[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [title, setTitle] = useState(''); // Chat title
  const [isEditingTitle, setIsEditingTitle] = useState(false); // Editing title state
  const [isCollapsed, setIsCollapsed] = useState(true); // Collapse state
  const { token } = useAuthStore();
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch models and agents from the backend
    const fetchModelsAndAgents = async () => {
      try {
        const modelsResponse = await fetch(`${getBackendUrl()}/api/models/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (modelsResponse.ok) {
          const modelsData = await modelsResponse.json();
          setModels(modelsData);
        } else {
          console.error('Error fetching models:', modelsResponse.statusText);
        }

        const agentsResponse = await fetch(`${getBackendUrl()}/api/agents/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (agentsResponse.ok) {
          const agentsData = await agentsResponse.json();
          setAgents(agentsData);
        } else {
          console.error('Error fetching agents:', agentsResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching models and agents:', error);
      }
    };

    fetchModelsAndAgents();
  }, [token]);

  useEffect(() => {
    // Fetch API key for the selected model
    const fetchApiKey = async () => {
      if (selectedModel) {
        const model = models.find(m => m.name === selectedModel);
        if (model) {
          try {
            const response = await fetch(`${getBackendUrl()}/api/api_keys/model/${model.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            if (response.ok) {
              const data = await response.json();
              setApiKey(data.key);
            } else {
              console.error('Error fetching API key:', response.statusText);
            }
          } catch (error) {
            console.error('Error fetching API key:', error);
          }
        }
      }
    };

    fetchApiKey();
  }, [selectedModel, selectedAgent, token]);

  useEffect(() => {
    // Fetch conversation details
    const fetchConversation = async () => {
      try {
        const response = await fetch(`${getBackendUrl()}/api/conversations/${conversationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setMessages(data.messages.map((msg: Message) => ({ role: msg.role, content: msg.content })));
        } else {
          console.error('Error fetching conversation:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    };

    fetchConversation();
  }, [conversationId, token]);

  useEffect(() => {
    // Scroll to the bottom of the chat box when messages change
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // Update messages with user input
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setIsLoading(true); // Set loading state to true

    // Add "Loading..." message
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'assistant', content: 'Loading...' },
    ]);

    try {
      let bodyContent;
      let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      };

      if (selectedAgent !== '') {
        bodyContent = {
          inputs: newMessages.map(msg => ({ role: msg.role, content: msg.content })),
          stream: false,
          agent_id: selectedAgent,
          store: false, // Do not store on Mistral's cloud
        };
      } else {
        bodyContent = {
          model: selectedModel,
          messages: newMessages,
        };
      }

      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyContent),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("LLM response: ", data)
        const assistantMessage = data.choices[0].message.content;

        // Update messages with assistant response
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1), // Remove "Loading..." message
          { role: 'assistant', content: assistantMessage },
        ]);

        // Save the updated conversation to the backend
        await fetch(`${getBackendUrl()}/api/conversations/${conversationId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            messages: newMessages.concat({ role: 'assistant', content: assistantMessage }),
          }),
        });
      } else {
        console.error('Error fetching chat response:', response.status, response.statusText);
        // Remove "Loading..." message on error
        setMessages((prevMessages) => prevMessages.slice(0, -1));
      }
    } catch (error) {
      console.error('Error fetching chat response:', error);
      // Remove "Loading..." message on error
      setMessages((prevMessages) => prevMessages.slice(0, -1));
    } finally {
      setIsLoading(false); // Set loading state to false
    }

    // Clear the input field
    setInput('');
  };

  const handleEditTitle = async () => {
    if (isEditingTitle) {
      // Save the updated title to the backend
      await fetch(`${getBackendUrl()}/api/conversations/${conversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          messages,
        }),
      });
    }
    setIsEditingTitle(!isEditingTitle);
  };

  return (
    <div className="container flex-grow-1 mt-1" style={{ display: 'flex', flexDirection: 'column', height: '90vh', overflowY: 'hidden' }}>
      <div className="d-flex align-items-center mb-3 text-center">
        {isEditingTitle ? (
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleEditTitle}
            autoFocus
          />
        ) : (
          <div className="w-100" style={{ display: 'flex', flexDirection: 'row' }}>
            <h2 className="flex-grow-1">{title}</h2>
            <FaPen className="ms-2" onClick={handleEditTitle} style={{ cursor: 'pointer' }} />
          </div>
        )}
      </div>
      <div className="mb-3 d-flex align-items-center " style={{ display: 'flex', flexDirection: 'row' }}>

      </div>


      <div className="chat-box flex-grow-1 border p-3" ref={chatBoxRef} style={{ overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.role === 'user' ? 'user-message' : 'chatbot-message'}`}>
            <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong>
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}
      </div>



      <div className="input-group mt-3">
        <DropdownButton
          title={<FaRobot />}

          drop="up"
        >
          <Dropdown.Header>Select Model Or Agent</Dropdown.Header>
          {models.map((model) => (
            <Dropdown.Item key={model.name}>

              <li
                key={model.name}
                className={`list-group-item list-group-item-action flex-column align-items-start ${selectedModel === model.name ? 'active' : ''}`}
                onClick={() => {
                  setSelectedModel(model.name);
                  setSelectedAgent('');
                }}
                style={{ cursor: 'pointer' }}
              >
                <h5 className="mb-1">{model.name}</h5>
                <p className="mb-1 small">{model.description}</p>
              </li>
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          {agents.map((agent) => (
            <Dropdown.Item key={agent.id}>

              <li
                key={agent.id}
                className={`list-group-item list-group-item-action flex-column align-items-start ${selectedAgent === agent.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedAgent(agent.id);
                  setSelectedModel('');
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1"></h5>
                </div>
                <p className="mb-1">{agent.description}</p>
              </li>
            </Dropdown.Item>
          ))}

        </DropdownButton>
        <textarea
          className="form-control"
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading} // Disable input when loading
        />
        <button className="btn btn-primary" onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;