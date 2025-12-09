use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AgentResponse {
    pub session_id: String,
    pub status: String,
    pub plan: Vec<String>,
}

pub async fn start_session(task_id: &str, prompt: &str, token: &str) -> Result<AgentResponse, String> {
    let client = reqwest::Client::new();
    // Assuming a hypothetical endpoint for Jules
    let res = client.post("https://api.jules.ai/v1/sessions")
        .header("Authorization", format!("Bearer {}", token))
        .json(&serde_json::json!({
            "task_id": task_id,
            "prompt": prompt
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !res.status().is_success() {
        return Err(format!("Jules API error: {}", res.status()));
    }

    let response: AgentResponse = res.json()
        .await
        .map_err(|e| e.to_string())?;

    Ok(response)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_agent_response_deserialization() {
        let json = r#"
        {
            "session_id": "sess_001",
            "status": "RUNNING",
            "plan": ["step 1", "step 2"]
        }
        "#;
        let response: AgentResponse = serde_json::from_str(json).unwrap();
        assert_eq!(response.session_id, "sess_001");
        assert_eq!(response.plan.len(), 2);
    }
}
