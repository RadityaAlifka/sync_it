// PERBAIKAN: Tambahkan 'Manager' di sini ↓
use tauri::{command, Window, Emitter, Manager}; 
use oauth2::{
    basic::BasicClient, AuthUrl, ClientId, ClientSecret, RedirectUrl, Scope, TokenUrl,
    AuthorizationCode, TokenResponse
};
use std::env;
use std::thread;
use std::time::{SystemTime, UNIX_EPOCH};
use tiny_http::{Server, Response, Header};
use crate::models::auth_token::SpotifyTokenStore;
use crate::services::storage::{save_token, delete_token, get_token}; 

#[command]
pub async fn login_spotify(window: Window) -> Result<String, String> {
    #[cfg(debug_assertions)]
    println!("🦀 Memulai proses login Spotify...");

    let client_id = env::var("SPOTIFY_CLIENT_ID").map_err(|_| "Cek .env SPOTIFY_CLIENT_ID")?;
    let client_secret = env::var("SPOTIFY_CLIENT_SECRET").map_err(|_| "Cek .env SPOTIFY_CLIENT_SECRET")?;
    let redirect_uri = env::var("REDIRECT_URI").map_err(|_| "Cek .env REDIRECT_URI")?;

    let client = BasicClient::new(
        ClientId::new(client_id),
        Some(ClientSecret::new(client_secret)),
        AuthUrl::new("https://accounts.spotify.com/authorize".to_string()).map_err(|e| e.to_string())?,
        Some(TokenUrl::new("https://accounts.spotify.com/api/token".to_string()).map_err(|e| e.to_string())?),
    )
    .set_redirect_uri(RedirectUrl::new(redirect_uri).map_err(|e| e.to_string())?);

    // Minta dialog agar user selalu ditanya (tidak auto-login hantu)
    let (auth_url, _csrf_token) = client
        .authorize_url(oauth2::CsrfToken::new_random)
        .add_scope(Scope::new("playlist-read-private".to_string()))
        .add_scope(Scope::new("playlist-modify-public".to_string()))
        .add_extra_param("show_dialog", "true") 
        .url();

    let client_clone = client.clone();
    
    // .app_handle() butuh trait Manager yang sudah kita import di atas
    let app_handle = window.app_handle().clone(); 

    thread::spawn(move || {
        #[cfg(debug_assertions)]
        println!("👂 Server auth standby di port 8888...");
        
        let server = match Server::http("0.0.0.0:8888") {
            Ok(s) => s,
            Err(e) => {
                #[cfg(debug_assertions)]
                println!("❌ Gagal bind port 8888: {}", e);
                return;
            }
        };

        for request in server.incoming_requests() {
            let url = request.url().to_string();
            
            if let Some(code_start) = url.find("?code=") {
                let code_str = &url[code_start + 6..];
                let clean_code = code_str.split('&').next().unwrap_or("");
                
                #[cfg(debug_assertions)]
                println!("🔑 Auth Code diterima.");

                match client_clone.exchange_code(AuthorizationCode::new(clean_code.to_string()))
                    .request(oauth2::reqwest::http_client) 
                {
                    Ok(token) => {
                        let access_token = token.access_token().secret().clone();
                        let refresh_token = token.refresh_token().map(|t| t.secret().clone());
                        
                        let token_data = SpotifyTokenStore {
                            access_token: access_token.clone(),
                            refresh_token: refresh_token,
                            created_at: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs(),
                        };

                        if let Err(e) = save_token(token_data) {
                            #[cfg(debug_assertions)]
                            println!("❌ Gagal menyimpan token: {}", e);
                        } else {
                            #[cfg(debug_assertions)]
                            println!("💾 Token berhasil diamankan.");
                        }

                        let _ = app_handle.emit("spotify-connected", "Login Berhasil");
                    },
                    Err(e) => {
                        #[cfg(debug_assertions)]
                        println!("❌ Gagal menukar token: {:?}", e)
                    },
                }

                // HTML Cantik
                let html_content = r#"
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Login Berhasil</title>
                    <style>
                        body { background-color: #121212; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                        .card { background: #181818; padding: 40px; border-radius: 12px; text-align: center; box-shadow: 0 4px 60px rgba(0,0,0,0.5); border: 1px solid #282828; }
                        h1 { color: #1DB954; margin-bottom: 10px; }
                        p { color: #b3b3b3; margin-bottom: 30px; line-height: 1.5; }
                        .highlight { color: white; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h1>✅ Login Berhasil!</h1>
                        <p>Token Spotify sudah diamankan.<br>Silakan <span class="highlight">tutup tab ini secara manual</span><br>dan kembali ke aplikasi Sync It.</p>
                        
                        <script>
                            // Coba tutup pelan-pelan, kalau gagal ya biarkan user tutup sendiri
                            setTimeout(() => {
                                window.opener = self;
                                window.close();
                            }, 1000);
                        </script>
                    </div>
                </body>
                </html>
                "#;

                let response = Response::from_string(html_content)
                    .with_header(Header::from_bytes(&b"Content-Type"[..], &b"text/html"[..]).unwrap());
                
                let _ = request.respond(response);
                break; 
            }
        }
    });

    Ok(auth_url.to_string())
}

#[command]
pub async fn logout_spotify(window: Window) -> Result<(), String> {
    if let Err(e) = delete_token() {
        return Err(e);
    }
    let _ = window.emit("spotify-logged-out", "User Logout");
    #[cfg(debug_assertions)]
    println!("👋 User berhasil logout.");
    Ok(())
}

#[command]
pub fn check_auth_status() -> bool {
    get_token().is_some()
}