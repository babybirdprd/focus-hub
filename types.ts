export interface Repo {
  id: number;
  name: string;
  private: boolean;
  description?: string;
}

export interface Issue {
  id: number;
  title: string;
  status: 'open' | 'closed';
  body: string;
}

export interface PR {
  id: number;
  title: string;
  author: string;
  status: 'open' | 'merged' | 'closed';
}

export interface RepoDetails {
  issues: Issue[];
  prs: PR[];
  files: Record<string, string>;
}

export interface AgentResponse {
  session_id: string;
  status: string;
  plan: string[];
}

export type ViewState = 'dashboard' | 'projects' | 'knowledge' | 'agent' | 'settings';
