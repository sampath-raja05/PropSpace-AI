"use client";

import { create } from "zustand";

import {
  getCurrentSession,
  loginWithPassword,
  logoutSession,
  registerWithPassword,
  requestOtp,
  verifyOtp,
} from "@/lib/auth-client";
import type { AuthUser } from "@/types";

interface OTPState {
  maskedDestination: string;
  expiresInSeconds: number;
  resendInSeconds: number;
  previewCode?: string | null;
}

interface AuthStore {
  user: AuthUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  otpState: OTPState | null;
  initialize: () => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<AuthUser>;
  register: (payload: { name: string; email: string; password: string; role?: "investor" | "advisor" }) => Promise<AuthUser>;
  requestPhoneOtp: (payload: { name?: string; phoneNumber: string }) => Promise<OTPState>;
  verifyPhoneOtp: (payload: { name?: string; phoneNumber: string; otp: string }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  clearOtpState: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  status: "loading",
  otpState: null,
  initialize: async () => {
    if (get().status === "authenticated") {
      return;
    }

    set({ status: "loading" });
    const user = await getCurrentSession();
    set({
      user,
      status: user ? "authenticated" : "unauthenticated",
    });
  },
  login: async (payload) => {
    const user = await loginWithPassword(payload);
    set({ user, status: "authenticated", otpState: null });
    return user;
  },
  register: async (payload) => {
    const user = await registerWithPassword(payload);
    set({ user, status: "authenticated", otpState: null });
    return user;
  },
  requestPhoneOtp: async (payload) => {
    const otpState = await requestOtp(payload);
    set({ otpState });
    return otpState;
  },
  verifyPhoneOtp: async (payload) => {
    const user = await verifyOtp(payload);
    set({ user, status: "authenticated", otpState: null });
    return user;
  },
  logout: async () => {
    await logoutSession();
    set({ user: null, status: "unauthenticated", otpState: null });
  },
  clearOtpState: () => set({ otpState: null }),
}));
