
<template>
  <div class="welcome">
    Welcome, {{ username }}!
  </div>

  <main class="home">
    <h2>AI Agent for Simply.com Public MCP</h2>

    <form @submit.prevent="handleChat">
      <label for="prompt">Question</label>

      <textarea
        id="prompt"
        v-model="prompt"
        rows="4"
        placeholder="Ask something..."
        :disabled="agentStore.loading"
        @keydown.enter.exact.prevent="handleChat"
      />

      <small>
        Enter = Send &nbsp;&nbsp; Shift+Enter = New line
      </small>

      <div class="form-actions">
        <button
          type="submit"
          :disabled="agentStore.loading || !prompt.trim()"
        >
          {{ agentStore.loading ? "Thinking..." : "Ask" }}
        </button>

        <button
          type="button"
          class="secondary"
          :disabled="agentStore.loading"
          @click="clearChat"
        >
          Clear
        </button>
      </div>
    </form>

    <div v-if="agentStore.loading" class="loading">
      Processing your request...
    </div>

    <div v-if="agentStore.answer" class="section">
      <label for="answer">Answer</label>

      <textarea
        id="answer"
        readonly
        rows="8"
        :value="agentStore.answer"
      />
    </div>

    <div v-if="agentStore.action" class="section">
      <label for="action">Action</label>

      <textarea
        id="action"
        readonly
        rows="5"
        :value="agentStore.action"
      />
    </div>

    <div v-if="agentStore.observation" class="section">
      <label for="observation">Observation</label>

      <textarea
        id="observation"
        readonly
        rows="10"
        :value="agentStore.observation"
      />
    </div>

    <div
      v-if="agentStore.status !== 'unknown'"
      class="section"
    >
      <label>Status</label>

      <div
        class="status"
        :class="`status-${agentStore.status}`"
      >
        {{ agentStore.status }}
      </div>
    </div>

    <div
      v-if="agentStore.source.length"
      class="section"
    >
      <label>Sources</label>

      <ul class="sources">
        <li
          v-for="(item, index) in agentStore.source"
          :key="index"
        >
          <a
            v-if="
              typeof item === 'string' &&
              /^https?:\/\//i.test(item)
            "
            :href="item"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ item }}
          </a>

          <span v-else-if="typeof item === 'string'">
            {{ item }}
          </span>

          <pre v-else>{{ JSON.stringify(item, null, 2) }}</pre>
        </li>
      </ul>
    </div>

    <div v-if="agentStore.error" class="error">
      {{ agentStore.error }}
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores";
import { useAgentStore } from "@/stores/agent.store";

const authStore = useAuthStore();
const agentStore = useAgentStore();

const username = authStore.user?.username || "Guest";
const prompt = ref("");

async function handleChat() {
  const message = prompt.value.trim();

  if (!message || agentStore.loading) {
    return;
  }

  await agentStore.chat(message);
}

function clearChat() {
  prompt.value = "";
  agentStore.clear();
}
</script>

<style scoped>
.home {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px 32px;
}

.welcome {
  text-align: center;
  color: orange;
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

textarea {
  display: block;
  box-sizing: border-box;
  width: 100%;
  resize: vertical;
  padding: 10px;
  font: inherit;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 6px;
}

textarea:focus {
  outline: 2px solid #93c5fd;
  outline-offset: 1px;
}

small {
  display: block;
  margin-top: 8px;
  color: #666;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  cursor: pointer;
  font: inherit;
}

button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

button.secondary {
  background: #64748b;
}

.section {
  margin-top: 24px;
}

.loading {
  margin-top: 20px;
  color: #2563eb;
  font-weight: 600;
}

.error {
  margin-top: 20px;
  padding: 12px;
  color: #b91c1c;
  background: #fef2f2;
  border-radius: 6px;
  overflow-wrap: anywhere;
}

.status {
  margin-top: 8px;
  font-weight: bold;
  overflow-wrap: anywhere;
}

.status-sources_found {
  color: #15803d;
}

.status-unverified {
  color: #b45309;
}

.status-error {
  color: #dc2626;
}

.sources {
  margin-top: 8px;
  padding-left: 24px;
  overflow-wrap: anywhere;
}

.sources li {
  margin-bottom: 8px;
}

.sources a {
  color: #2563eb;
  text-decoration: underline;
}

pre {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
