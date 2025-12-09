import { invoke } from '@tauri-apps/api/core';
import { load } from '@tauri-apps/plugin-store';
import { Repo, RepoDetails, AgentResponse } from '../types';

const isTauri = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

// API Keys Management
export const saveApiKeys = async (github: string, jules: string): Promise<void> => {
  if (!isTauri()) { console.log("Mock: Saving keys", { github, jules }); return; }
  return await invoke('plugin:focus-core|save_api_keys', { github, jules });
};

export const getApiKeysStatus = async (): Promise<boolean> => {
  if (!isTauri()) { console.log("Mock: Checking keys status (returning false)"); return false; }
  return await invoke('plugin:focus-core|get_api_keys_status');
};

// GitHub Logic
export const searchGithubRepos = async (query: string): Promise<Repo[]> => {
  if (!query) return [];
  if (!isTauri()) {
      console.log("Mock: Search Repos", query);
      return [];
  }
  try {
    return await invoke('plugin:focus-core|search_repos', { query });
  } catch (error) {
    console.error("Failed to search repos:", error);
    throw error;
  }
};

export const fetchRepoDetails = async (repoId: number, owner: string, name: string): Promise<RepoDetails> => {
  if (!isTauri()) {
      console.log("Mock: Fetch Details", name);
      return { issues: [], prs: [], files: {} };
  }
  try {
    return await invoke('plugin:focus-core|get_repo_details', { owner, repo: name });
  } catch (error) {
    console.error("Failed to fetch repo details:", error);
    throw error;
  }
};

// Jules Agent Logic
export const dispatchJulesAgent = async (taskId: string, prompt: string): Promise<AgentResponse> => {
  if (!isTauri()) {
      return { session_id: "mock", status: "mock-running", plan: [] };
  }
  try {
    return await invoke('plugin:focus-core|dispatch_agent', { taskId, prompt });
  } catch (error) {
    console.error("Failed to dispatch agent:", error);
    throw error;
  }
};

// Watchlist Persistence (using tauri-plugin-store)
// We need to initialize the store. A LazyStore pattern is useful.
const STORE_PATH = 'watchlist.json';

export class WatchlistStore {
  private static store: any = null;

  static async init() {
    if (!this.store) {
      if (isTauri()) {
          this.store = await load(STORE_PATH);
      } else {
          // Mock store
          this.store = {
              get: async () => [],
              set: async () => {},
              save: async () => {}
          };
      }
    }
    return this.store;
  }

  static async getWatchedRepoIds(): Promise<number[]> {
    const store = await this.init();
    const val = await store.get('watched_ids');
    return (val as number[]) || [];
  }

  static async setWatchedRepoIds(ids: number[]) {
    const store = await this.init();
    await store.set('watched_ids', ids);
    await store.save(); // Ensure it's written to disk
  }
}
