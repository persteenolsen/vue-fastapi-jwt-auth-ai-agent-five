
# 🤖 vue-fastapi-jwt-simply-mcp-ai-agent

Last updated: 28-10-2026

A Vue 3 single-page application (SPA) using Pinia and JWT authentication to interact with a FastAPI AI Agent powered by LangChain, Groq, and the Simply.com Public Model Context Protocol (MCP) server.

The application allows authenticated users to ask questions about domain availability and Simply.com services, receive AI-generated answers, and inspect the agent's tool calls, inputs, and observations.

**Architecture:**

Vue 3 → JWT Authentication → FastAPI → LangChain Agent → Groq LLM → Simply.com Public MCP → AI Response

---

## 🔗 FastAPI Backend

https://github.com/persteenolsen/fastapi-jwt-auth-ai-agent-five

The backend provides JWT authentication, protected API endpoints, LLM integration, and MCP tool execution.

The agent uses Groq's `openai/gpt-oss-20b` model and connects to Simply.com's public MCP server.

### Enabled MCP tools

- **check-domain-availability:** Checks whether a domain is available for registration.
- **search-docs:** Searches Simply.com documentation.

The MCP server also exposes `create-order-link` and `list-supported-tlds`, which can be enabled in the backend when needed.

---

# 🔐 Features

- Vue 3 SPA with Pinia state management
- JWT authentication and authenticated API requests
- FastAPI backend integration
- LangChain agent powered by Groq
- Simply.com Public MCP integration
- Domain availability checks
- Simply.com documentation search
- Display of agent actions, tool inputs, and observations
- Formatted JSON tool results
- Loading indicators and error handling
- Environment-based API configuration

---

# 🧱 Tech Stack

- Node.js 18.19.1
- Vue 3, Pinia, and Vite
- Python and FastAPI
- JWT authentication
- LangChain
- Groq LLM API
- Model Context Protocol (MCP)
- Simply.com Public MCP server

---

# 📁 Project Structure

```text
.
├── index.html
├── package.json
├── vite.config.js
├── src
│   ├── main.js
│   ├── App.vue
│   ├── components/
│   ├── views/
│   ├── stores/
│   ├── helpers/
│   └── router/
├── public/
└── .env
```

---

# ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/persteenolsen/vue-fastapi-jwt-auth-ai-agent-five.git
cd vue-fastapi-jwt-auth-ai-agent-four
npm install
```

Configure the frontend `.env` file:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

Open the URL displayed by Vite, log in, and start asking questions.

Ensure that the FastAPI backend is running and configured to access the Simply.com MCP server.

### Development commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

---

# 🔐 Security

The backend requires its own configuration for Groq API access, JWT authentication, CORS, and MCP connectivity.

Never commit API keys, JWT secrets, or other sensitive credentials to the repository. Variables prefixed with `VITE_` are exposed to the frontend and must not contain secrets.

---

# 🧪 Usage

1. Start the FastAPI backend.
2. Start the Vue frontend using `npm run dev`.
3. Log in to the application.
4. Enter a question and submit it.
5. Review the answer, tool actions, inputs, and observations.

### Example questions

- Is `testabc.com` available?
- Can I register `example-domain.com`?
- How can I check whether a domain can be transferred?
- Where can I find Simply.com's domain documentation?

The available operations depend on the MCP tools enabled in the backend.

---

# 📡 API Integration

## Authentication

**POST `/login-spa`**

Authenticates the user and returns the JWT information expected by the frontend.

## Chat

**POST `/chat`**

Example request:

```json
{
  "message": "Is testabc.com available?"
}
```

Example response:

```json
{
  "response": {
    "actions": [
      {
        "action": "check-domain-availability",
        "action_input": {
          "domain": "testabc.com"
        },
        "observation": "{\"domain\":\"testabc.com\",\"available\":false}"
      }
    ],
    "final_answer": "testabc.com is already registered."
  }
}
```

### Response fields

| Field | Description |
|---|---|
| `final_answer` | Final AI-generated answer |
| `actions` | Array of executed tool calls |
| `action` | Name of the tool |
| `action_input` | Input supplied to the tool |
| `observation` | Tool result, often encoded as a JSON string |

The Pinia agent store reads `response.actions`, formats the tool inputs and observations, and exposes them to the Vue interface. Multiple tool executions can be displayed.

---

# 🔌 Simply.com Public MCP

The backend connects to:

https://mcp.simply.com/public

The MCP server provides access to supported Simply.com functionality.

### `check-domain-availability`

Checks domain availability and may return registration status, eligibility information, links, and follow-up instructions.

### `search-docs`

Searches Simply.com documentation to help answer questions about its services.

The server also provides `create-order-link` and `list-supported-tlds`. Only configured and enabled tools are available to the agent.

A domain availability check does not complete a registration. Domain status can change, and registration must be completed through the relevant provider workflow.

---

# 🧠 Application Flow

```text
User Question
      |
      v
Vue 3 + Pinia
      |
      v
FastAPI /chat
      |
      v
LangChain Agent + Groq
      |
      v
Simply.com Public MCP
      |
      v
Tool Results + Final Answer
      |
      v
Vue Displays the Response
```

The agent selects appropriate tools, processes their results, and generates a final answer. The frontend displays the answer alongside the actions, inputs, and observations returned by FastAPI.

For backend implementation details, see the [FastAPI backend repository](https://github.com/persteenolsen/fastapi-jwt-auth-ai-agent-five).

---

# 🛠️ Troubleshooting

- **Missing actions or observations:** Check the `/chat` response in the browser's Network panel. The current response structure places these fields inside `response.actions[]`.
- **Connection errors:** Verify `VITE_API_URL`, backend availability, and CORS configuration.
- **Authentication errors:** Check JWT handling, token expiration, and backend authentication settings.
- **MCP errors:** Inspect backend logs and verify MCP connectivity and enabled tools.

---

# 💡 Use Cases

- 🌐 Domain availability assistants
- 🔎 Domain documentation search
- 🤖 AI assistants using external tools
- 🔌 MCP integrations
- 🛠️ Tool-using AI applications
- 🔐 Authenticated AI web applications

---

# 👨‍💻 Author

Built as a Vue 3 SPA demonstrating JWT authentication, Pinia state management, and integration with a FastAPI AI Agent using LangChain, Groq, and the Simply.com Public MCP server.
