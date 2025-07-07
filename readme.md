# Introduction 

This project is a full-stack chat application designed to facilitate conversations with AI assistants. It provides a user-friendly interface for managing and viewing chat conversations, supporting both development and production environments. The application is built to be extensible, allowing integration with multiple AI providers, such as Mistral AI and OpenAI, and can be scaled from a pay-by-month model to a pay-by-use model.


# Project Setup

This project uses Docker and Docker Compose to manage the development and production environments for both the frontend and backend.

## Prerequisites

- Docker
- Docker Compose

## Environment Variables

Create a `.env` file in the root of the project with the following content:

```env
# PostgreSQL Configuration
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_postgres_db

# Database URL
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}

# pgAdmin Configuration
PGADMIN_DEFAULT_EMAIL=your_email@example.com
PGADMIN_DEFAULT_PASSWORD=your_pgadmin_password

# User and Group IDs for pgAdmin
UID=5050
GID=5050
```

## Building and Running the Project

### Development Mode

To run the project in development mode, use the following command:

```sh
docker-compose up frontend-dev backend
```

This will start the frontend in development mode and the backend.

### Production Mode

To run the project in production mode, use the following command:

```sh
docker-compose up frontend-prod backend
```

This will start the frontend in production mode and the backend.

### Accessing Services

- **Frontend (Development)**: [http://localhost:3000](http://localhost:3000)
- **Frontend (Production)**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:8000](http://localhost:8000)
- **pgAdmin**: [http://localhost:8888](http://localhost:8888)

## Stopping the Project

To stop the project, use the following command:

```sh
docker-compose down
```

## Cleaning Up

To remove all containers, networks, and volumes, use the following command:

```sh
docker-compose down -v
```

## Notes

- Ensure that the `.env` file is properly configured with the correct environment variables.
- The `UID` and `GID` in the `.env` file should match the user and group IDs of the host machine for pgAdmin to work correctly.