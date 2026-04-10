import sys
from pathlib import Path
from types import SimpleNamespace
from uuid import uuid4

from fastapi import FastAPI
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.db.db_connection import get_session
from src.router.users_router import user_router
from src.router import users_router
from src.service import auth_service


async def _override_get_session():
    yield object()


def _build_client() -> TestClient:
    app = FastAPI()
    app.include_router(user_router, prefix="/api")
    app.dependency_overrides[get_session] = _override_get_session
    return TestClient(app)


#  login user
def test_login_success_sets_session_cookie(monkeypatch):
    user = SimpleNamespace(
        user_id=uuid4(),
        password="hashed-pass",
    )

    async def fake_user_by_email(email, db):
        return user

    def fake_verify_password(raw_password, hashed_password):
        return raw_password == "Valid123" and hashed_password == user.password

    captured = {}

    async def fake_redis_set(key, value, ex):
        captured["key"] = key
        captured["value"] = value
        captured["ex"] = ex
        return True

    monkeypatch.setattr(auth_service, "user_by_email", fake_user_by_email)
    monkeypatch.setattr(auth_service, "verify_password", fake_verify_password)
    monkeypatch.setattr(auth_service.redis_client, "set", fake_redis_set)

    client = _build_client()
    response = client.post(
        "/api/users/login",
        json={"email": "user@example.com", "password": "Valid123"},
    )

    assert response.status_code == 200
    assert response.json() == {"detail": "Login successfully", "success": True}
    assert "session_id=" in response.headers["set-cookie"]
    assert captured["key"].startswith("session:")
    assert captured["value"] == str(user.user_id)
    assert captured["ex"] == auth_service.SESSION_TTL


def test_login_fails_for_unknown_email(monkeypatch):
    async def fake_user_by_email(email, db):
        return None

    monkeypatch.setattr(auth_service, "user_by_email", fake_user_by_email)

    client = _build_client()
    response = client.post(
        "/api/users/login",
        json={"email": "missing@example.com", "password": "Valid123"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_login_fails_for_wrong_password(monkeypatch):
    user = SimpleNamespace(
        user_id=uuid4(),
        password="hashed-pass",
    )

    async def fake_user_by_email(email, db):
        return user

    def fake_verify_password(raw_password, hashed_password):
        return False

    monkeypatch.setattr(auth_service, "user_by_email", fake_user_by_email)
    monkeypatch.setattr(auth_service, "verify_password", fake_verify_password)

    client = _build_client()
    response = client.post(
        "/api/users/login",
        json={"email": "user@example.com", "password": "Wrong123"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


# signup user
def test_signup_success(monkeypatch):
    async def fake_create_user(user_data, db):
        return {"detail": "account created!", "success": True}

    monkeypatch.setattr(users_router, "create_user", fake_create_user)

    client = _build_client()
    response = client.post(
        "/api/users/signup",
        json={
            "username": "test_user",
            "email": "signup@example.com",
            "password": "Valid123",
        },
    )

    assert response.status_code == 201
    assert response.json() == {"detail": "account created!", "success": True}


def test_signup_fails_for_invalid_payload():
    client = _build_client()
    response = client.post(
        "/api/users/signup",
        json={
            "username": "ab",
            "email": "not-an-email",
            "password": "1234",
        },
    )

    assert response.status_code == 422


# logout user
def test_logout_success(monkeypatch):
    captured = {}

    async def fake_redis_delete(key):
        captured["deleted_key"] = key
        return 1

    monkeypatch.setattr(auth_service.redis_client, "delete", fake_redis_delete)

    client = _build_client()
    response = client.post(
        "/api/users/logout",
        cookies={"session_id": "test-session-id"},
    )

    assert response.status_code == 200
    assert response.json() == {"detail": "Successfully logged out."}
    assert captured["deleted_key"] == "session:test-session-id"


def test_logout_fails_without_session_cookie():
    client = _build_client()
    response = client.post("/api/users/logout")

    assert response.status_code == 401
    assert response.json()["detail"] == "No active session found."
