# Mathstral AI Assistant

Mathstral AI Assistant is a web application that provides an interactive chat interface for mathematical problem-solving and discussions. It uses Mathstral LLM  powered by Mistral  to generate responses to user queries.

## Features

- Interactive chat interface for mathematical discussions
- Real-time streaming of AI responses
- Adjustable AI parameters (temperature, max tokens, etc.)

## Tech Stack

- Backend:
  - FastAPI (Python)
  - Llama.cpp (for LLM serving and inference)
- Frontend:
  - React (TypeScript) - developed with the help of Claude -. 
  - Material-UI
- Deployment:
  - Docker
  - Docker Compose

## Prerequisites

- Docker and Docker Compose installed on your system
- A Hugging Face account and API token for downloading the model

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/AbdelghaniKbt/mathstral-ai-assistant.git
   cd mathstral-ai-assistant
   ```


2. Build and start the Docker containers:
   ```
   docker-compose up --build
   ```

3. Access the application at `http://localhost:3000`

## Usage

1. On the homepage, enter your Hugging Face token to initialize the model.
2. Once initialized, you'll be redirected to the chat interface.
3. Type your mathematical questions or problems in the chat input.
4. The AI will generate and stream its response in real-time.
5. Use the settings icon to adjust AI parameters like temperature and max tokens.
6. Toggle between light and dark modes using the mode switch button.

## Project Structure

- `backend/`: Contains the FastAPI server and LLM integration
- `frontend/`: React application for the user interface
- `docker-compose.yml`: Defines and configures the application services

## Development

To work on the project locally:

1. For backend development, navigate to the `backend/` directory and install dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   ```

2. For frontend development, navigate to the `frontend/` directory and install dependencies:
   ```
   cd frontend
   npm install
   ```

3. Run the backend and frontend separately in development mode.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.