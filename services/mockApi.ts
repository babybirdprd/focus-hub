import { Repo, RepoDetails, AgentResponse } from '../types';

// 1. Repository Watchlist Logic
const allUserRepos: Repo[] = [
  { id: 101, name: "legacy-project-1", private: true },
  { id: 102, name: "focus-hub", private: true, description: "Command Center" },
  { id: 103, name: "auth-service", private: false },
  { id: 104, name: "design-system", private: false, description: "Shared UI Lib" },
  { id: 105, name: "analytics-worker", private: true },
  { id: 106, name: "mobile-ios", private: true },
];

export const searchGithubRepos = async (query: string): Promise<Repo[]> => {
  await new Promise(r => setTimeout(r, 400)); // Simulate network
  if (!query) return [];
  return allUserRepos.filter(r => r.name.toLowerCase().includes(query.toLowerCase()));
};

// 2. Deep Data Fetch (Only for watched repos)
export const fetchRepoDetails = async (repoId: number): Promise<RepoDetails> => {
  await new Promise(r => setTimeout(r, 300)); // Simulate latency
  
  // Return slightly different mock data based on ID for realism
  if (repoId === 103) {
      return {
        issues: [
            { id: 201, title: "JWT token expiration bug", status: "open", body: "Tokens are not refreshing correctly on 401." },
            { id: 202, title: "Add 2FA endpoints", status: "open", body: "Need to implement TOTP verification." }
        ],
        prs: [
            { id: 55, title: "Jules: Refactor Middleware", author: "jules-ai", status: "open" }
        ],
        files: {
            "README.md": "# Auth Service\n\nHandles user authentication and session management.",
            "API.md": "# Endpoints\n\n- POST /login\n- POST /refresh"
        }
      };
  }

  return {
    issues: [{ id: 1, title: "Fix login bug", status: "open", body: "Login fails on iOS..." }],
    prs: [{ id: 50, title: "Jules: Refactored Auth", author: "jules-ai", status: "open" }],
    // Knowledge Hub mock data
    files: {
        "README.md": "# Focus Hub\n\nThe ultimate developer dashboard. Only syncs what matters.",
        "AGENTS.md": "# AI Configuration\n\nJules is enabled for this repo.\n\n## Capabilities\n- PR Reviews\n- Code Generation"
    }
  };
};

// 3. Jules Agent Dispatch
export const dispatchJulesAgent = async (issueId: number, instructions: string): Promise<AgentResponse> => {
  await new Promise(r => setTimeout(r, 1500)); // Simulate "thinking"
  return {
    session_id: `sess_${Date.now()}`,
    status: "RUNNING",
    plan: ["Analyze Issue Context", "Read Related Files", "Generate Implementation Plan", "Draft Pull Request"]
  };
};

// Helper to get Repo info by ID (synchronous for UI convenience)
export const getRepoById = (id: number): Repo | undefined => {
    return allUserRepos.find(r => r.id === id);
}