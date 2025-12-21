use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Playlist {
    pub id: String,
    pub name: String,
    pub images: Vec<Image>,
    pub tracks: TracksInfo,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Image {
    pub url: String,
    pub height: Option<u32>,
    pub width: Option<u32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TracksInfo {
    pub total: u32,
    pub href: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PlaylistsResponse {
    pub items: Vec<Playlist>,
}