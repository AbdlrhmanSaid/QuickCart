// components/SignInButton.tsx
"use client";
import React from "react";
import { useClerk } from "@clerk/nextjs";
import { assets } from "@/assets/assets";
import Image from "next/image";

const SignInButton = () => {
  const { openSignIn } = useClerk();

  return (
    <button
      onClick={openSignIn}
      className="flex items-center gap-2 hover:text-gray-900 transition"
    >
      <Image src={assets.user_icon} alt="user icon" />
      Sign In
    </button>
  );
};

export default SignInButton;
