use tauri::{command, Window, Emitter, Manager}; 
use oauth2::{
    basic::BasicClient, AuthUrl, ClientId, ClientSecret, RedirectUrl, Scope, TokenUrl,
    AuthorizationCode, TokenResponse
};
use std::env; // Kita pakai ini lagi untuk baca .env
use std::thread;
use std::time::{SystemTime, UNIX_EPOCH};
use tiny_http::{Server, Response, Header};
use crate::models::auth_token::SpotifyTokenStore;
use crate::services::storage::{save_token, delete_token, get_token}; 

// URL Endpoint Spotify (Konstanta agar rapi, tapi ID tetap dari .env)
const AUTH_URL: &str = "https://accounts.spotify.com/authorize";
const TOKEN_URL: &str = "https://accounts.spotify.com/api/token";

#[command]
pub async fn login_spotify(window: Window) -> Result<String, String> {
    // 1. Ambil ID & Secret dari file .env (Runtime)
    // Pastikan nama variabel di .env kamu SAMA PERSIS dengan string di bawah
    let client_id = env::var("SPOTIFY_CLIENT_ID")
        .map_err(|_| "Gagal baca SPOTIFY_CLIENT_ID dari .env")?;
    
    let client_secret = env::var("SPOTIFY_CLIENT_SECRET")
        .map_err(|_| "Gagal baca SPOTIFY_CLIENT_SECRET dari .env")?;
        
    let redirect_uri = env::var("REDIRECT_URI")
        .map_err(|_| "Gagal baca REDIRECT_URI dari .env")?;

    // Setup Client
    let client = BasicClient::new(
        ClientId::new(client_id),
        Some(ClientSecret::new(client_secret)),
        AuthUrl::new(AUTH_URL.to_string()).map_err(|e| e.to_string())?,
        Some(TokenUrl::new(TOKEN_URL.to_string()).map_err(|e| e.to_string())?),
    )
    .set_redirect_uri(RedirectUrl::new(redirect_uri).map_err(|e| e.to_string())?);

    // Generate URL Auth
    let (auth_url, _csrf_token) = client
        .authorize_url(oauth2::CsrfToken::new_random)
        .add_scope(Scope::new("playlist-read-private".to_string()))
        .add_scope(Scope::new("playlist-modify-public".to_string()))
        .add_extra_param("show_dialog", "true") 
        .url();

    open::that(auth_url.as_str())
        .map_err(|e| format!("Gagal membuka browser: {}", e))?;

    let client_clone = client.clone();
    let app_handle = window.app_handle().clone(); 

    // Server Background
    thread::spawn(move || {
        let server = match Server::http("0.0.0.0:8888") {
            Ok(s) => s,
            Err(e) => {
                let _ = app_handle.emit("spotify-error", format!("Port 8888 sibuk: {}", e));
                return;
            }
        };

        for request in server.incoming_requests() {
            let url = request.url().to_string();
            
            if let Some(code_start) = url.find("?code=") {
                let code_str = &url[code_start + 6..];
                let clean_code = code_str.split('&').next().unwrap_or("");
                
                // Tukar Code jadi Token
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
                            let _ = app_handle.emit("spotify-error", format!("Gagal simpan: {}", e));
                        } else {
                            let _ = app_handle.emit("spotify-connected", "Login Berhasil");
                        }
                    },
                    Err(e) => {
                        let _ = app_handle.emit("spotify-error", format!("Gagal tukar token: {:?}", e));
                    },
                }

                // Response HTML Cantik
                let html_content = r#"<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Sukses</title><style>body{background:#121212;color:white;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh}h1{color:#1DB954}</style></head><body><div style="text-align:center"><h1>✅ Login Sukses</h1><p>Kembali ke aplikasi Sync It.</p><script>window.close()</script></div></body></html>"#;

                let response = Response::from_string(html_content)
                    .with_header(Header::from_bytes(&b"Content-Type"[..], &b"text/html; charset=UTF-8"[..]).unwrap());
                
                let _ = request.respond(response);
                break; // Matikan server
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