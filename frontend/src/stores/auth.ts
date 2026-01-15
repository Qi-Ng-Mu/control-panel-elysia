import { defineStore } from "pinia";
import { ref } from "vue";
import * as authService from "../services/auth";

export type AuthProfile = {
  userId: number;
  tenantId: number;
  roleCodes: string[];
  permissionCodes: string[];
};

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref(localStorage.getItem("accessToken") || "");
  const refreshToken = ref(localStorage.getItem("refreshToken") || "");
  const profile = ref<AuthProfile | null>(null);

  const setSession = (payload: { accessToken: string; refreshToken: string }) => {
    accessToken.value = payload.accessToken;
    refreshToken.value = payload.refreshToken;
    localStorage.setItem("accessToken", payload.accessToken);
    localStorage.setItem("refreshToken", payload.refreshToken);
  };

  const clearSession = () => {
    accessToken.value = "";
    refreshToken.value = "";
    profile.value = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const login = async (payload: authService.LoginPayload) => {
    const response = await authService.login(payload);
    setSession(response.data);
    await fetchProfile();
  };

  const fetchProfile = async () => {
    if (!accessToken.value) return;
    const response = await authService.me();
    profile.value = response.data as AuthProfile;
  };

  const logout = async () => {
    if (refreshToken.value) {
      await authService.logout(refreshToken.value);
    }
    clearSession();
  };

  return {
    accessToken,
    refreshToken,
    profile,
    login,
    logout,
    fetchProfile,
    clearSession
  };
});
