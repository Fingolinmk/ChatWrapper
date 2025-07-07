// frontend/app/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import ChatComponent from '../components/ChatComponent';
import useAuthStore from '../store/auth';
import getBackendUrl from '@/utils/get_be';
import { FaCog } from 'react-icons/fa'; // Import the gear icon

const LandingPage = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [conversations, setConversations] = useState<{ id: number; title: string }[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    // Fetch conversations from the backend
    const fetchConversations = async () => {
      try {
        const response = await fetch(getBackendUrl() + '/api/conversations/',  {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        } else {
          console.error('Error fetching conversations:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, [token]);

  const handleStartNewChat = async () => {
    try {
      const response = await fetch(getBackendUrl() + '/api/conversations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: 'New Chat' }),
      });
      if (response.ok) {
        const newConversation = await response.json();
        setConversations([...conversations, newConversation]);
        setSelectedConversationId(newConversation.id);
      } else {
        console.error('Error creating new chat:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      <nav className={`bg-light p-3 ${collapsed ? 'collapsed' : ''}`} style={{ width: '250px', transition: 'width 0.3s' }}>

        {/* Display conversations in the sidebar */}
        <ul className="list-unstyled">
          {/* Button to start a new chat */}
          <li className="mb-3">
            <button className="btn btn-primary w-100" onClick={handleStartNewChat}>
              Start New Chat
            </button>
          </li>

          {conversations.map((conversation) => (
            <li key={conversation.id} className="mb-2">
              <button
                className="btn btn-outline-primary w-100 text-start"
                onClick={() => setSelectedConversationId(conversation.id)}
              >
                {conversation.title}
              </button>
            </li>
          ))}
        </ul>

        {/* Sticky buttons at the bottom of the sidebar */}
        <div className="sidebar-buttons">
          <a href="/settings" className="btn btn-outline-secondary w-100 mb-2">Settings</a>
          <button className="btn btn-outline-danger w-100" onClick={() => useAuthStore.getState().clearToken()}>Logout</button>
        </div>
      </nav>
<main className="flex-grow-1 p-3 overflow-auto" style={{ height: '100%' }}>        {selectedConversationId ? (
          <ChatComponent conversationId={selectedConversationId} />
        ) : (
          <div className="text-center mt-5">
            <h3>Select a chat or start a new one</h3>
          </div>
        )}
      </main>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaCog />
      </button>
    </div>
  );
};

export default LandingPage;