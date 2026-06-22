"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import  { Apifetch } from "../../lib/apifetch.js" 


function SignupPage() {
  const [errors, setErrors] = useState();
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();

    let newerrors = {};

    if (formdata.name.trim() == "") {
      newerrors.name = "Name cannot be empty";
    }

    if (formdata.email.trim() == "") {
      newerrors.email = "Email cannot be empty";
    }

    if (formdata.password.trim() == "") {
      newerrors.password = "Password cannot be empty";
    }

    if (formdata.confirmpassword.trim() == "") {
      newerrors.confirmpassword = "Confirm password cannot be empty";
    }

    if (Object.keys(newerrors).length > 0) {
      setErrors(newerrors);
      console.log(newerrors, "new errors");
      console.log(errors, "errors hai");
      return;
    }

    if (formdata.password != formdata.confirmpassword) {
      newerrors.confirmpassword = "Password and Confirm Password are not same";
      setErrors(newerrors);
      return;
    }

    setErrors({});

    try {
      const response = await Apifetch("auth/register", {
        method: "POST",
   
        body: JSON.stringify(formdata),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      router.push("/ChatSection");
    } catch (err) {
      console.log("something went wrong");
    }
  }

  function trackvalues(event) {
    setFormdata({ ...formdata, [event.target.name]: event.target.value });
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <div className="flex min-h-screen items-center justify-center px-5 py-8">
        <div className="grid w-full max-w-6xl grid-cols-1 gap-7 lg:grid-cols-2 lg:items-center">
          {/* Left Showcase */}
          <div className="hidden lg:block">
            <div className="relative min-h-[690px] overflow-hidden rounded-[34px] border border-white/10 bg-[#090b0f] p-10 shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
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
                      Private messaging workspace
                    </p>
                  </div>
                </div>

                <div className="rounded-full border border-[#22c55e]/20 bg-[#22c55e]/10 px-3 py-1.5 text-xs font-semibold text-[#22c55e]">
                  New Account
                </div>
              </div>

              <div className="relative mx-auto mt-14 flex h-44 w-44 rotate-45 items-center justify-center rounded-[28px] border-[10px] border-[#1c2430] bg-[#10151d] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <div className="-rotate-45 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <span className="text-2xl text-zinc-400">▰</span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-500">
                    connect
                  </p>
                </div>
              </div>

              <div className="relative mt-14">
                <h2 className="max-w-lg text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-white">
                  Create your realtime chat identity.
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400">
                  Join a clean private messaging workspace where conversations,
                  active users and message delivery feel simple, fast and
                  focused.
                </p>

                <p className="mt-6 text-sm font-semibold text-zinc-200">
                  Start chatting in seconds with a secure account.
                </p>
              </div>

              <div className="relative mt-8 rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-xl">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <h3 className="max-w-xs text-xl font-bold leading-snug text-white">
                      Your private chat space starts here
                    </h3>

                    <p className="mt-3 max-w-sm text-xs leading-5 text-zinc-500">
                      Create an account, connect with users and manage your
                      conversations from one polished realtime interface.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#22c55e] px-3 py-2 text-xs font-black text-[#07130c]">
                    LIVE
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
                    Users already connected
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Signup Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-md rounded-[34px] border border-white/10 bg-[#090b0f] px-7 py-8 shadow-[0_30px_120px_rgba(0,0,0,0.55)] sm:px-9 sm:py-10">
              <div className="mb-8">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-black">
                    C
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">Chat App</p>
                    <p className="text-xs text-zinc-500">Create account</p>
                  </div>
                </div>

                <h2 className="text-4xl font-bold tracking-[-0.04em] text-white">
                  Sign up
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Enter your details to create your private chat account.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-xs font-bold text-zinc-300">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    className="w-full rounded-xl border border-white/10 bg-[#11151d] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-[#22c55e] focus:ring-4 focus:ring-[#22c55e]/10"
                    onChange={trackvalues}
                  />

                  {errors && errors.name && (
                    <p className="mt-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-zinc-300">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="johndoe@gmail.com"
                    className="w-full rounded-xl border border-white/10 bg-[#11151d] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-[#22c55e] focus:ring-4 focus:ring-[#22c55e]/10"
                    onChange={trackvalues}
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
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-[#11151d] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-[#22c55e] focus:ring-4 focus:ring-[#22c55e]/10"
                    onChange={trackvalues}
                  />

                  {errors && errors.password && (
                    <p className="mt-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-zinc-300">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmpassword"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-[#11151d] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-[#22c55e] focus:ring-4 focus:ring-[#22c55e]/10"
                    onChange={trackvalues}
                  />

                  {errors && errors.confirmpassword && (
                    <p className="mt-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300">
                      {errors.confirmpassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-white py-3.5 text-sm font-black text-black shadow-lg shadow-white/10 transition hover:-translate-y-0.5 hover:bg-[#22c55e] hover:text-[#07130c] active:translate-y-0 active:scale-[0.99]"
                >
                  Sign Up
                </button>

                <p className="text-center text-sm text-zinc-500">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-white transition hover:text-[#22c55e]"
                  >
                    Login
                  </Link>
                </p>

               
              </form>
            </div>
          </div>

          {/* Mobile Showcase */}
          <div className="lg:hidden">
            <div className="rounded-[28px] border border-white/10 bg-[#090b0f] p-6 shadow-2xl">
              <h3 className="text-2xl font-bold text-white">
                Welcome to Chat App
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Create your account and start private realtime conversations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;