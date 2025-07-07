// components/ChatComponent.tsx
"use client";
import useAuthStore from '@/store/auth';
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaPen } from 'react-icons/fa'; // Import the pen icon
import getBackendUrl from '@/utils/get_be';

interface ChatComponentProps {
  conversationId: number;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ conversationId }) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState(''); // API key for the selected model
  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState<{ id: number; name: string; description: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [title, setTitle] = useState(''); // Chat title
  const [isEditingTitle, setIsEditingTitle] = useState(false); // Editing title state
  const { token } = useAuthStore();
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch models from the backend
    const fetchModels = async () => {
      try {
        const response = await fetch(`${getBackendUrl()}/api/models`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setModels(data);
          setSelectedModel(data[0]?.name || '');
        } else {
          console.error('Error fetching models:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };

    fetchModels();
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
  }, [selectedModel, models, token]);

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
          setMessages(data.messages.map((msg: any) => ({ role: msg.role, content: msg.content })));
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
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: newMessages,
        }),
      });

      if (response.ok) {
        const data = await response.json();
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

  function keyDownHandler(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  }

  return (
    <div className="container flex-grow-1 mt-1" style={{ display: 'flex', flexDirection: 'column', maxHeight: '70vh', overflowY: 'scroll' }}>
      <div className="d-flex align-items-center mb-3">
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
          <>
            <h2>{title}</h2>
            <FaPen className="ms-2" onClick={handleEditTitle} style={{ cursor: 'pointer' }} />
          </>
        )}
      </div>
      <div className="mb-3">
        <label className="form-label">Select Model</label>
        <select
          className="form-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          {models.map((model) => (
            <option key={model.name} value={model.name}>
              {model.name}
            </option>
          ))}
        </select>
        <small className="form-content content-muted">
          {models.find((model) => model.name === selectedModel)?.description}
        </small>
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
        <input
          type="text"
          className="form-control"
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={keyDownHandler}
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