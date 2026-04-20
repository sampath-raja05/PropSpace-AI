"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, MessageSquareText, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuthStore } from "@/store/auth-store";

interface PasswordFormValues {
  name: string;
  email: string;
  password: string;
  role: "investor" | "advisor";
}

interface OTPFormValues {
  name: string;
  phoneNumber: string;
  otp: string;
}

const authMethods = [
  { id: "password", label: "Password" },
  { id: "otp", label: "Mobile OTP" },
] as const;

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [method, setMethod] = useState<(typeof authMethods)[number]["id"]>("password");
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const requestPhoneOtp = useAuthStore((state) => state.requestPhoneOtp);
  const verifyPhoneOtp = useAuthStore((state) => state.verifyPhoneOtp);
  const otpState = useAuthStore((state) => state.otpState);
  const clearOtpState = useAuthStore((state) => state.clearOtpState);

  const {
    register: registerPasswordField,
    handleSubmit: handlePasswordSubmit,
  } = useForm<PasswordFormValues>({
    defaultValues: {
      name: "",
      email: mode === "login" ? "aarav@propspace.ai" : "",
      password: mode === "login" ? "demo-password" : "",
      role: "investor",
    },
  });
  const {
    register: registerOtpField,
    handleSubmit: handleOtpSubmit,
    getValues,
  } = useForm<OTPFormValues>({
    defaultValues: {
      name: "",
      phoneNumber: "",
      otp: "",
    },
  });

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  async function finalizeAuth(task: () => Promise<void>) {
    setIsBusy(true);
    setError(null);
    setSuccess(null);

    try {
      await task();
      startTransition(() => {
        router.replace("/");
        router.refresh();
      });
    } catch (taskError) {
      setError(taskError instanceof Error ? taskError.message : "Authentication failed");
    } finally {
      setIsBusy(false);
    }
  }

  const onPasswordSubmit = handlePasswordSubmit(async (values) => {
    await finalizeAuth(async () => {
      if (mode === "login") {
        await login({
          email: values.email,
          password: values.password,
        });
        return;
      }

      await register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });
    });
  });

  const onRequestOtp = async () => {
    setIsBusy(true);
    setError(null);
    setSuccess(null);

    try {
      const values = getValues();
      const otpDetails = await requestPhoneOtp({
        name: values.name,
        phoneNumber: values.phoneNumber,
      });
      setSuccess(
        otpDetails.previewCode
          ? `OTP sent to ${otpDetails.maskedDestination}. Dev code: ${otpDetails.previewCode}`
          : `OTP sent to ${otpDetails.maskedDestination}`
      );
    } catch (taskError) {
      setError(taskError instanceof Error ? taskError.message : "Unable to send OTP");
    } finally {
      setIsBusy(false);
    }
  };

  const onVerifyOtp = handleOtpSubmit(async (values) => {
    await finalizeAuth(async () => {
      await verifyPhoneOtp({
        name: values.name,
        phoneNumber: values.phoneNumber,
        otp: values.otp,
      });
    });
  });

  return (
    <GlassCard className="mx-auto max-w-xl p-6 sm:p-8">
      <p className="hero-chip">{mode === "login" ? "Secure sign-in" : "Protected account setup"}</p>
      <h1 className="mt-4 text-4xl">{mode === "login" ? "Access your PropSpace workspace" : "Create a verified PropSpace account"}</h1>
      <p className="mt-3 text-muted-foreground">Passwords are verified by the API, and mobile login uses short-lived OTP codes.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {authMethods.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setMethod(item.id);
              setError(null);
              setSuccess(null);
              if (item.id !== "otp") {
                clearOtpState();
              }
            }}
            className={`rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
              method === item.id
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-background/55 text-muted-foreground hover:border-primary/30"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {method === "password" ? (
        <form onSubmit={onPasswordSubmit} className="mt-6 space-y-4">
          {mode === "register" ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Full name</span>
              <input
                {...registerPasswordField("name")}
                className="h-11 w-full rounded-2xl border border-border bg-background/70 px-4 text-sm outline-none transition-colors focus:border-primary"
                placeholder="Aarav Mehta"
              />
            </label>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Email</span>
            <input
              type="email"
              {...registerPasswordField("email")}
              className="h-11 w-full rounded-2xl border border-border bg-background/70 px-4 text-sm outline-none transition-colors focus:border-primary"
              placeholder="name@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Password</span>
            <input
              type="password"
              {...registerPasswordField("password")}
              className="h-11 w-full rounded-2xl border border-border bg-background/70 px-4 text-sm outline-none transition-colors focus:border-primary"
              placeholder="Use 8+ characters with uppercase, lowercase, number, and symbol"
            />
          </label>

          {mode === "register" ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Account type</span>
              <select
                {...registerPasswordField("role")}
                className="h-11 w-full rounded-2xl border border-border bg-background/70 px-4 text-sm outline-none transition-colors focus:border-primary"
              >
                <option value="investor">Investor</option>
                <option value="advisor">Advisor</option>
              </select>
            </label>
          ) : null}

          <Button className="mt-2 w-full" type="submit" disabled={isBusy}>
            {isBusy ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
            {mode === "login" ? "Sign in securely" : "Create protected account"}
          </Button>
        </form>
      ) : (
        <form onSubmit={onVerifyOtp} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Full name</span>
            <input
              {...registerOtpField("name")}
              className="h-11 w-full rounded-2xl border border-border bg-background/70 px-4 text-sm outline-none transition-colors focus:border-primary"
              placeholder="Required on first mobile sign-in"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Mobile number</span>
            <input
              {...registerOtpField("phoneNumber")}
              className="h-11 w-full rounded-2xl border border-border bg-background/70 px-4 text-sm outline-none transition-colors focus:border-primary"
              placeholder="+91 98765 43210"
            />
          </label>

          {otpState ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium">OTP</span>
              <input
                {...registerOtpField("otp")}
                className="h-11 w-full rounded-2xl border border-border bg-background/70 px-4 text-sm outline-none transition-colors focus:border-primary"
                placeholder="Enter the 6-digit code"
              />
            </label>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              disabled={isBusy}
              onClick={() => {
                void onRequestOtp();
              }}
            >
              {isBusy ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquareText className="mr-2 h-4 w-4" />}
              Request OTP
            </Button>
            <Button className="w-full" type="submit" disabled={isBusy || !otpState}>
              {isBusy ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
              Verify and continue
            </Button>
          </div>
        </form>
      )}

      {success ? (
        <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-200">
          {success}
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
          {error}
        </div>
      ) : null}
    </GlassCard>
  );
}
