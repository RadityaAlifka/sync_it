use std::fs;
use crate::models::auth_token::SpotifyTokenStore;

// Tentukan lokasi file penyimpanan (di folder project sementara ini agar mudah dicek)
const TOKEN_FILE: &str = "auth_spotify.json";

pub fn save_token(token: SpotifyTokenStore) -> Result<(), String> {
    let json = serde_json::to_string_pretty(&token)
        .map_err(|e| format!("Gagal serialisasi token: {}", e))?;
    
    fs::write(TOKEN_FILE, json)
        .map_err(|e| format!("Gagal menulis file: {}", e))?;
        
    Ok(())
}

// Fungsi untuk membaca token (nanti dipakai buat cek status login)
pub fn get_token() -> Option<SpotifyTokenStore> {
    if let Ok(content) = fs::read_to_string(TOKEN_FILE) {
        if let Ok(token) = serde_json::from_str::<SpotifyTokenStore>(&content) {
            return Some(token);
        }
    }
    None
}

pub fn delete_token() -> Result<(), String> {
    // Cek dulu apakah file ada
    if std::path::Path::new(TOKEN_FILE).exists() {
        fs::remove_file(TOKEN_FILE)
            .map_err(|e| format!("Gagal menghapus token: {}", e))?;
    }
    Ok(())
}