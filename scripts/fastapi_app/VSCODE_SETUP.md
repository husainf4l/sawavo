# VS Code Configuration for FastAPI Project

This project is now configured with VS Code tasks, launch configurations, and proper environment setup.

## Available VS Code Tasks

Access these tasks via `Ctrl+Shift+P` → "Tasks: Run Task" or `Cmd+Shift+P` on macOS:

1. **Run FastAPI Development Server** (Default Build Task)

   - Starts the FastAPI server with hot reload
   - Accessible at `http://localhost:8000`
   - Press `Ctrl+Shift+P` → "Tasks: Run Build Task" or `Cmd+Shift+B`

2. **Run FastAPI Production Server**

   - Starts the FastAPI server in production mode with 4 workers
   - No hot reload for better performance

3. **Install Dependencies**

   - Installs all Python packages from requirements.txt

4. **Run Tests**
   - Executes pytest on the tests directory

## Debug Configuration

Launch configurations are available in the Debug panel (`F5` or `Ctrl+Shift+D`):

1. **Python: FastAPI** - Debug the FastAPI application
2. **Python: Current File** - Debug the currently open Python file

## Environment Configuration (.env)

The `.env` file is configured with:

- **DATABASE_URL**: PostgreSQL connection string
- **OPENAI_API_KEY**: OpenAI API key for AI-powered product suggestions
- **PRODUCTS_TABLE**: Database table name
- **SERPAPI_API_KEY**: Optional for enhanced search functionality
- **FastAPI settings**: Host, port, and reload configuration

## OpenAI Integration

The application uses OpenAI GPT-4o-mini for intelligent product metadata suggestions. The integration includes:

- Automatic generation of product titles, descriptions, and metadata
- Support for Arabic translations
- SEO-optimized content generation
- Skincare/cosmetic product expertise

## Quick Start

1. **Start Development Server**: `Cmd+Shift+B` (macOS) or `Ctrl+Shift+B` (Windows/Linux)
2. **Open Browser**: Navigate to `http://localhost:8000`
3. **API Documentation**: Available at `http://localhost:8000/docs`

## API Endpoints

- `GET /`: Home page
- `GET /docs`: Interactive API documentation
- `POST /products`: Create/update products with AI assistance
- Various product management endpoints

The server will automatically reload when you make changes to the code files.
