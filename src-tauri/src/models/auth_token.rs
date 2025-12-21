use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SpotifyTokenStore {
    pub access_token: String,
    pub refresh_token: Option<String>,
    pub created_at: u64, 
}