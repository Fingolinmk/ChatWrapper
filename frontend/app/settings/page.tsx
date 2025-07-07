// frontend/app/settings/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/auth';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import getBackendUrl from '@/utils/get_be';

interface Provider {
  id: number;
  name: string;
  api_schema: string;
}

interface Model {
  id: number;
  name: string;
  description: string;
  provider: Provider;
}

interface APIKey {
  id: number;
  key: string;
  provider_id: number;
}



const SettingsPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [newModel, setNewModel] = useState({ name: '', description: '', provider_id: '' });
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [newApiKey, setNewApiKey] = useState({ key: '', provider_id: '' });
  const { token } = useAuthStore();

  const [showModelModal, setShowModelModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  useEffect(() => {
    // Fetch user data, providers, models, and API keys
    const fetchData = async () => {
      const userResponse = await fetch(`${getBackendUrl()}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const userData = await userResponse.json();
      setEmail(userData.email);

      const providersResponse = await fetch(`${getBackendUrl()}/api/providers/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const providersData = await providersResponse.json();
      setProviders(providersData);

      const modelsResponse = await fetch(`${getBackendUrl()}/api/models/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const modelsData = await modelsResponse.json();
      setModels(modelsData);

      const apiKeysResponse = await fetch(`${getBackendUrl()}/api/api_keys/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const apiKeysData = await apiKeysResponse.json();
      setApiKeys(apiKeysData);
    };

    fetchData();
  }, [token]);

  const handleChangeEmail = async () => {
    await fetch(`${getBackendUrl()}/api/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });
    alert('Email updated successfully');
  };

  const handleChangePassword = async () => {
    await fetch(`${getBackendUrl()}/api/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });
    alert('Password updated successfully');
  };

  const handleAddModel = async () => {
    await fetch(`${getBackendUrl()}/api/models/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newModel),
    });
    alert('Model added successfully');
    setNewModel({ name: '', description: '', provider_id: '' });
    setShowModelModal(false);
    // Refresh models list
    const modelsResponse = await fetch(`${getBackendUrl()}/api/models/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const modelsData = await modelsResponse.json();
    setModels(modelsData);
  };

  const handleAddApiKey = async () => {
    const response = await fetch(`${getBackendUrl()}/api/api_keys/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newApiKey),
    });
    console.log("add api key response", response)
    if (response.ok) {
      alert('API Key added successfully');
      setNewApiKey({ key: '', provider_id: '' });
      setShowApiKeyModal(false);
      // Refresh API keys list
      const apiKeysResponse = await fetch(`${getBackendUrl()}/api/api_keys/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const apiKeysData = await apiKeysResponse.json();
      setApiKeys(apiKeysData);
    } else {
      const errorData = await response.json();
      alert(`Failed to add API Key: ${errorData.detail}`);
    }
  };

  const handleDeleteApiKey = async (apiKeyId: number) => {
    await fetch(`${getBackendUrl()}/api/api_keys/${apiKeyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    alert('API Key deleted successfully');
    // Refresh API keys list
    const apiKeysResponse = await fetch(`${getBackendUrl()}/api/api_keys/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const apiKeysData = await apiKeysResponse.json();
    setApiKeys(apiKeysData);
  };

  return (
    <div className="container mt-5">
      <h2>Settings</h2>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleChangeEmail}>Change Email</button>
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleChangePassword}>Change Password</button>
      </div>
      <div className="mb-3">
        <h3>Providers</h3>
        <ul>
          {providers.length > 0 ? (
            providers.map((provider) => (
              <li key={provider.id}>{provider.name}</li>
            ))
          ) : (
            <li>No providers available</li>
          )}
        </ul>
        <Button variant="primary" onClick={() => setShowApiKeyModal(true)}>Add Provider API Key</Button>
      </div>
      <div className="mb-3">
        <h3>Models</h3>
        <ul>
          {models.length > 0 ? (
            models.map((model) => (
              <li key={model.id}>{model.name} - {model.provider?.name}</li>
            ))
          ) : (
            <li>No models available</li>
          )}
        </ul>
        <Button variant="primary" onClick={() => setShowModelModal(true)}>Add Model</Button>
      </div>
      <div className="mb-3">
        <h3>API Keys</h3>
        <ul>
          {apiKeys.length > 0 ? (
            apiKeys.map((apiKey) => (
              <li key={apiKey.id}>
                {apiKey.key} - Provider ID: {apiKey.provider_id}
                <Button variant="danger" onClick={() => handleDeleteApiKey(apiKey.id)}>Delete</Button>
              </li>
            ))
          ) : (
            <li>No API keys available</li>
          )}
        </ul>
      </div>

      {/* Model Modal */}
      <Modal show={showModelModal} onHide={() => setShowModelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Model</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="modelName">
              <Form.Label>Model Name</Form.Label>
              <Form.Control
                type="text"
                value={newModel.name}
                onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={newModel.description}
                onChange={(e) => setNewModel({ ...newModel, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="provider">
              <Form.Label>Provider</Form.Label>
              <Form.Control
                as="select"
                value={newModel.provider_id}
                onChange={(e) => setNewModel({ ...newModel, provider_id: e.target.value })}
              >
                <option value="">Select Provider</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>{provider.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModelModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddModel}>Add Model</Button>
        </Modal.Footer>
      </Modal>

      {/* API Key Modal */}
      <Modal show={showApiKeyModal} onHide={() => setShowApiKeyModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Provider API Key</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="apiKey">
              <Form.Label>API Key</Form.Label>
              <Form.Control
                type="text"
                value={newApiKey.key}
                onChange={(e) => setNewApiKey({ ...newApiKey, key: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="provider">
              <Form.Label>Provider</Form.Label>
              <Form.Control
                as="select"
                value={newApiKey.provider_id}
                onChange={(e) => setNewApiKey({ ...newApiKey, provider_id: e.target.value })}
              >
                <option value="">Select Provider</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>{provider.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApiKeyModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddApiKey}>Add API Key</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SettingsPage;