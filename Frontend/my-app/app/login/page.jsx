"use client";
import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Apifetch } from "../../lib/apifetch";

function Page() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
 
  });
  const [errors, setErrors] = useState({});

  const router = useRouter();

  function HandleInput(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  console.log(errors, "errors hai");

  async function submitForm(event) {
    event.preventDefault();
    let newerrors = {};

    console.log(formData.email);

    if (!formData.email) {
      newerrors.email = "Email address cannot be empty";
    }

    if (!formData.password) {
      newerrors.password = "Password cannot be empty";
      setErrors(newerrors);
      return;
    }

    if (formData.password.length < 8) {
      newerrors.password = "Password should be a minimum length of 8 digits";
      return;
    }

    if (Object.keys(newerrors).length > 0) {
      setErrors(newerrors);
      return;
    }

    setErrors({});

    try {
      const response = await Apifetch("auth/login", {
        method: "POST",
        // headers: {
        //   "content-type": "application/json",
        // },
        // credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data,'itthe data aaoga',data)

      if (!response.ok) {
        console.log(data);
        toast.error(data.message);
        return;
      }

      toast.success(data.message || "Login succesfull");

      if (response.ok) router.push("/ChatSection");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <div className="flex min-h-screen items-center justify-center px-5 py-8">
        <div className="grid w-full max-w-6xl grid-cols-1 gap-7 lg:grid-cols-2 lg:items-center">
          {/* Left Premium Showcase */}
          <div className="hidden lg:block">
            <div className="relative min-h-[650px] overflow-hidden rounded-[34px] border border-white/10 bg-[#090b0f] p-10 shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
              <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-[#22c55e]/10 blur-[120px]" />
              <div className="absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-white/5 blur-[120px]" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-black">
                    C
                  </div>

                  <div>
                    <h1 className="text-sm font-bold text-white">Chat App</h1>
                    <p className="text-xs text-zinc-500">
                      Realtime messaging workspace
                    </p>
                  </div>
                </div>

                <div className="rounded-full border border-[#22c55e]/20 bg-[#22c55e]/10 px-3 py-1.5 text-xs font-semibold text-[#22c55e]">
                  Live
                </div>
              </div>

              <div className="relative mx-auto mt-16 flex h-44 w-44 rotate-45 items-center justify-center rounded-[28px] border-[10px] border-[#1c2430] bg-[#10151d] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <div className="-rotate-45 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <span className="text-2xl text-zinc-400">▰</span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-500">
                    synced
                  </p>
                </div>
              </div>

              <div className="relative mt-16">
                <h2 className="max-w-lg text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-white">
                  Welcome to your realtime chat space.
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400">
                  Connect with people, manage conversations, send messages
                  instantly and keep every chat organized in one clean
                  workspace.
                </p>

                <p className="mt-6 text-sm font-semibold text-zinc-200">
                  More than 17k people joined us, it&apos;s your turn.
                </p>
              </div>

              <div className="relative mt-8 rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-xl">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <h3 className="max-w-xs text-xl font-bold leading-snug text-white">
                      Build better conversations with instant delivery
                    </h3>

                    <p className="mt-3 max-w-sm text-xs leading-5 text-zinc-500">
                      Real-time messaging, online status and private chat flows
                      built for a clean user experience.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#22c55e] px-3 py-2 text-xs font-black text-[#07130c]">
                    99%
                  </div>
                </div>

                <div className="mt-7 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full border-2 border-[#151515] bg-[#22c55e]" />
                    <div className="h-8 w-8 rounded-full border-2 border-[#151515] bg-[#f59e0b]" />
                    <div className="h-8 w-8 rounded-full border-2 border-[#151515] bg-[#60a5fa]" />
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#151515] bg-[#1f2937] text-[10px] font-bold text-white">
                      +2k
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-zinc-500">
                    Active users online
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Login Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-md rounded-[34px] border border-white/10 bg-[#090b0f] px-7 py-8 shadow-[0_30px_120px_rgba(0,0,0,0.55)] sm:px-9 sm:py-10">
              <div className="mb-10">
                <div className="mb-10 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-black">
                    C
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">Chat App</p>
                    <p className="text-xs text-zinc-500">Secure login</p>
                  </div>
                </div>

                <h2 className="text-4xl font-bold tracking-[-0.04em] text-white">
                  Login
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Enter your details to access your private chat account.
                </p>
              </div>

              <form
                className="space-y-5"
                onSubmit={(event) => {
                  submitForm(event);
                }}
              >
                <div>
                  <label className="mb-2 block text-xs font-bold text-zinc-300">
                    Email Address
                  </label>

                  <input
                    type="text"
                    name="email"
                    className="w-full rounded-xl border border-white/10 bg-[#11151d] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-[#22c55e] focus:ring-4 focus:ring-[#22c55e]/10"
                    placeholder="johndoe@gmail.com"
                    onChange={HandleInput}
                  />

                  {errors && errors.email && (
                    <p className="mt-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-zinc-300">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    className="w-full rounded-xl border border-white/10 bg-[#11151d] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-[#22c55e] focus:ring-4 focus:ring-[#22c55e]/10"
                    placeholder="••••••••"
                    onChange={HandleInput}
                  />

                  {errors && (errors.password || errors.message) && (
                    <p className="mt-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300">
                      {errors.password} {errors.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex cursor-pointer items-center gap-2 text-zinc-500">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/10 bg-[#11151d] accent-[#22c55e]"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    className="font-semibold text-zinc-400 transition hover:text-white"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-white py-3.5 text-sm font-black text-black shadow-lg shadow-white/10 transition hover:-translate-y-0.5 hover:bg-[#22c55e] hover:text-[#07130c] active:translate-y-0 active:scale-[0.99]"
                >
                  Login
                </button>

                <p className="text-center text-sm text-zinc-500">
                  Don&apos;t have an account?{" "}
                  <Link
                    href={"/signup"}
                    className="font-bold text-white transition hover:text-[#22c55e]"
                  >
                    Sign up
                  </Link>
                </p>

                
              </form>
            </div>
          </div>

          {/* Mobile Card */}
          <div className="lg:hidden">
            <div className="rounded-[28px] border border-white/10 bg-[#090b0f] p-6 shadow-2xl">
              <h3 className="text-2xl font-bold text-white">
                Welcome to Chat App
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Realtime private messaging with clean conversations and secure
                access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;