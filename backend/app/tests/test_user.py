import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def test_user(client: TestClient):
    user_data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpassword",
    }
    response = client.post("/api/users/", json=user_data)
    assert response.status_code == 200
    return response.json()


def test_create_user(client: TestClient):
    user_data = {
        "username": "testuser2",
        "email": "testuser2@example.com",
        "password": "testpassword",
    }
    response = client.post("/api/users/", json=user_data)
    assert response.status_code == 200
    assert response.json()["email"] == user_data["email"]


def test_read_user(client: TestClient, test_user):
    user_id = test_user["id"]
    response = client.get(f"/api/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["email"] == test_user["email"]


def test_update_user(client: TestClient, test_user):
    user_id = test_user["id"]
    update_data = {
        "username": "updateduser",
        "email": "updateduser@example.com",
        "password": "newpassword",
    }
    response = client.put(f"/api/users/{user_id}", json=update_data)
    assert response.status_code == 200
    assert response.json()["email"] == update_data["email"]


def test_delete_user(client: TestClient, test_user):
    user_id = test_user["id"]
    response = client.delete(f"/api/users/{user_id}")
    assert response.status_code == 200
    # Verify the user is deleted
    response = client.get(f"/api/users/{user_id}")
    assert response.status_code == 404
