import { invoke } from "@tauri-apps/api/core";

export const authService = {
  login: async (): Promise<string> => {
    return await invoke("login_spotify");
  },

  logout: async (): Promise<void> => {
    return await invoke("logout_spotify");
  },

  checkStatus: async (): Promise<boolean> => {
    return await invoke("check_auth_status");
  }
};