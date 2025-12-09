pub mod github;
pub mod jules;

use tauri::{plugin::{Builder, TauriPlugin}, Runtime};
use self::github::{Repo, RepoDetails};
use self::jules::AgentResponse;
use keyring::Entry;

// Service Name for Keyring
const SERVICE_NAME: &str = "focus-hub-app";

#[tauri::command]
async fn search_repos(query: String) -> Result<Vec<Repo>, String> {
    let entry = Entry::new(SERVICE_NAME, "github_token").map_err(|e| e.to_string())?;
    let token = entry.get_password().map_err(|_| "GitHub API Key not found. Please set it in Settings.".to_string())?;

    github::search(&query, &token).await
}

#[tauri::command]
async fn get_repo_details(owner: String, repo: String) -> Result<RepoDetails, String> {
    let entry = Entry::new(SERVICE_NAME, "github_token").map_err(|e| e.to_string())?;
    let token = entry.get_password().map_err(|_| "GitHub API Key not found. Please set it in Settings.".to_string())?;

    github::get_details(&owner, &repo, &token).await
}

#[tauri::command]
async fn dispatch_agent(task_id: String, prompt: String) -> Result<AgentResponse, String> {
    let entry = Entry::new(SERVICE_NAME, "jules_token").map_err(|e| e.to_string())?;
    let token = entry.get_password().map_err(|_| "Jules API Key not found. Please set it in Settings.".to_string())?;

    jules::start_session(&task_id, &prompt, &token).await
}

#[tauri::command]
async fn save_api_keys(github: String, jules: String) -> Result<(), String> {
    let gh_entry = Entry::new(SERVICE_NAME, "github_token").map_err(|e| e.to_string())?;
    gh_entry.set_password(&github).map_err(|e| e.to_string())?;

    let jules_entry = Entry::new(SERVICE_NAME, "jules_token").map_err(|e| e.to_string())?;
    jules_entry.set_password(&jules).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn get_api_keys_status() -> Result<bool, String> {
    let gh_entry = Entry::new(SERVICE_NAME, "github_token");
    let jules_entry = Entry::new(SERVICE_NAME, "jules_token");

    if let (Ok(gh), Ok(jules)) = (gh_entry, jules_entry) {
        if gh.get_password().is_ok() && jules.get_password().is_ok() {
            return Ok(true);
        }
    }
    Ok(false)
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("focus-core")
        .invoke_handler(tauri::generate_handler![
            search_repos,
            get_repo_details,
            dispatch_agent,
            save_api_keys,
            get_api_keys_status
        ])
        .build()
}
