use tauri::command;
use reqwest::header::AUTHORIZATION;
use crate::services::storage::get_token;
use crate::models::spotify::{Playlist, PlaylistsResponse};

#[command]
pub async fn get_current_user_playlists() -> Result<Vec<Playlist>, String> {
    let token_store = get_token().ok_or("Token tidak ditemukan. Silakan login ulang.")?;
    let access_token = token_store.access_token;

    let client = reqwest::Client::new();
    let response = client
        .get("https://api.spotify.com/v1/me/playlists")
        .header(AUTHORIZATION, format!("Bearer {}", access_token))
        .send()
        .await
        .map_err(|e| format!("Gagal request API: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("Error dari Spotify: Status {}", response.status()));
    }

    let data: PlaylistsResponse = response.json()
        .await
        .map_err(|e| format!("Gagal parsing data: {}", e))?;

    Ok(data.items)
}