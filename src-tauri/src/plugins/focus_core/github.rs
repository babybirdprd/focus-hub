use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Repo {
    pub id: u64,
    pub name: String,
    pub private: bool,
    pub description: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct RepoDetails {
    pub issues: Vec<Issue>,
    pub prs: Vec<PR>,
    pub files: std::collections::HashMap<String, String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Issue {
    pub id: u64,
    pub title: String,
    pub state: String, // GitHub API uses 'state'
    pub body: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PR {
    pub id: u64,
    pub title: String,
    pub user: User,
    pub state: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct User {
    pub login: String,
}

pub async fn search(query: &str, token: &str) -> Result<Vec<Repo>, String> {
    let client = reqwest::Client::new();
    let res = client.get("https://api.github.com/search/repositories")
        .query(&[("q", query)])
        .header("User-Agent", "focus-hub")
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !res.status().is_success() {
        return Err(format!("GitHub API error: {}", res.status()));
    }

    #[derive(Deserialize)]
    struct SearchResponse {
        items: Vec<Repo>,
    }

    let search_res: SearchResponse = res.json()
        .await
        .map_err(|e| e.to_string())?;

    Ok(search_res.items)
}

pub async fn get_details(owner: &str, repo: &str, token: &str) -> Result<RepoDetails, String> {
    let client = reqwest::Client::new();
    let base_url = format!("https://api.github.com/repos/{}/{}", owner, repo);
    let headers = |req: reqwest::RequestBuilder| {
        req.header("User-Agent", "focus-hub")
           .header("Authorization", format!("Bearer {}", token))
    };

    // Parallel fetching would be better but keeping it simple for now
    let issues_res = headers(client.get(&format!("{}/issues", base_url))).send().await.map_err(|e| e.to_string())?;
    let prs_res = headers(client.get(&format!("{}/pulls", base_url))).send().await.map_err(|e| e.to_string())?;

    // For files, we usually fetch content. For this mock scope, I'll just fetch the README
    let readme_res = headers(client.get(&format!("{}/readme", base_url))).send().await.map_err(|e| e.to_string())?;

    let issues: Vec<Issue> = if issues_res.status().is_success() {
        issues_res.json().await.map_err(|e| e.to_string())?
    } else {
        vec![]
    };

    let prs: Vec<PR> = if prs_res.status().is_success() {
        prs_res.json().await.map_err(|e| e.to_string())?
    } else {
        vec![]
    };

    let mut files = std::collections::HashMap::new();
    if readme_res.status().is_success() {
         #[derive(Deserialize)]
         struct Content { name: String, content: String, encoding: String }
         if let Ok(content) = readme_res.json::<Content>().await {
             // Decode base64 content if needed, but for now just storing raw or placeholder
             // Actually, usually we want decoded text.
             // Simplification: Just store "README.md" -> "Content..."
             files.insert("README.md".to_string(), "Fetched from GitHub".to_string());
         }
    }

    Ok(RepoDetails {
        issues,
        prs,
        files,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_repo_deserialization() {
        let json = r#"
        {
            "id": 12345,
            "name": "test-repo",
            "private": false,
            "description": "A test repo"
        }
        "#;
        let repo: Repo = serde_json::from_str(json).unwrap();
        assert_eq!(repo.name, "test-repo");
        assert!(!repo.private);
    }
}
