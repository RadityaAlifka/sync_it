use tauri::{command, Window, Emitter, Manager}; 
use oauth2::{
    basic::BasicClient, AuthUrl, ClientId, ClientSecret, RedirectUrl, Scope, TokenUrl,
    AuthorizationCode, TokenResponse
};
use std::thread;
use std::time::{SystemTime, UNIX_EPOCH};
use tiny_http::{Server, Response, Header};
use crate::models::auth_token::SpotifyTokenStore;
use crate::services::storage::{save_token, delete_token, get_token}; 

// --- KONSTANTA (Jangan lupa isi punya kamu) ---
const CLIENT_ID: &str = "ISI_CLIENT_ID_KAMU"; 
const CLIENT_SECRET: &str = "ISI_CLIENT_SECRET_KAMU";
const REDIRECT_URI: &str = "http://localhost:8888/callback";
const AUTH_URL: &str = "https://accounts.spotify.com/authorize";
const TOKEN_URL: &str = "https://accounts.spotify.com/api/token";

#[command]
pub async fn login_spotify(window: Window) -> Result<String, String> {
    // Setup Client
    let client = BasicClient::new(
        ClientId::new(CLIENT_ID.to_string()),
        Some(ClientSecret::new(CLIENT_SECRET.to_string())),
        AuthUrl::new(AUTH_URL.to_string()).map_err(|e| e.to_string())?,
        Some(TokenUrl::new(TOKEN_URL.to_string()).map_err(|e| e.to_string())?),
    )
    .set_redirect_uri(RedirectUrl::new(REDIRECT_URI.to_string()).map_err(|e| e.to_string())?);

    let (auth_url, _csrf_token) = client
        .authorize_url(oauth2::CsrfToken::new_random)
        .add_scope(Scope::new("playlist-read-private".to_string()))
        .add_scope(Scope::new("playlist-modify-public".to_string()))
        .add_extra_param("show_dialog", "true") 
        .url();

    let client_clone = client.clone();
    let app_handle = window.app_handle().clone(); 

    // --- LOGIKA SERVER BACKGROUND ---
    thread::spawn(move || {
        // Coba jalankan server
        let server = match Server::http("0.0.0.0:8888") {
            Ok(s) => s,
            Err(e) => {
                // GANTI LOGGER DENGAN EMIT ERROR
                // Beritahu UI bahwa port sibuk/gagal
                let _ = app_handle.emit("spotify-error", format!("Gagal membuka port 8888: {}", e));
                return;
            }
        };

        for request in server.incoming_requests() {
            let url = request.url().to_string();
            
            if let Some(code_start) = url.find("?code=") {
                let code_str = &url[code_start + 6..];
                let clean_code = code_str.split('&').next().unwrap_or("");
                
                // Proses Tukar Token
                match client_clone.exchange_code(AuthorizationCode::new(clean_code.to_string()))
                    .request(oauth2::reqwest::http_client) 
                {
                    Ok(token) => {
                        let access_token = token.access_token().secret().clone();
                        let refresh_token = token.refresh_token().map(|t| t.secret().clone());
                        
                        let token_data = SpotifyTokenStore {
                            access_token,
                            refresh_token,
                            created_at: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs(),
                        };

                        if let Err(e) = save_token(token_data) {
                            // GANTI LOGGER: Lapor error simpan ke UI
                            let _ = app_handle.emit("spotify-error", format!("Gagal simpan token: {}", e));
                        } else {
                            // SUCCESS: Lapor sukses ke UI
                            let _ = app_handle.emit("spotify-connected", "Login Berhasil");
                        }
                    },
                    Err(e) => {
                        // GANTI LOGGER: Lapor error token ke UI
                        let _ = app_handle.emit("spotify-error", format!("Gagal tukar token: {:?}", e));
                    },
                }

                // Response HTML (Tetap diperlukan untuk browser)
                let html_content = r#"<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Success</title><style>body{background:#121212;color:white;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;}</style></head><body><div style="text-align:center"><h1>✅ Login Sukses</h1><p>Silakan tutup tab ini.</p><script>window.close()</script></div></body></html>"#;

                let response = Response::from_string(html_content)
                    .with_header(Header::from_bytes(&b"Content-Type"[..], &b"text/html; charset=UTF-8"[..]).unwrap());
                
                let _ = request.respond(response);
                break; 
            }
        }
    });

    Ok(auth_url.to_string())
}

#[command]
pub async fn logout_spotify(window: Window) -> Result<(), String> {
    delete_token()?;
    let _ = window.emit("spotify-logged-out", "User Logout");
    Ok(())
}

#[command]
pub fn check_auth_status() -> bool {
    get_token().is_some()
}