#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod services;
mod models;

use dotenv::dotenv;
fn main() {
    dotenv().ok();
    tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
        commands::auth::login_spotify,
        commands::auth::logout_spotify,
        commands::auth::check_auth_status,
        commands::spotify::get_current_user_playlists,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
    sync_it_lib::run()
}
