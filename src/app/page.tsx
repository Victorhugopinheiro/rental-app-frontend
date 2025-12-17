"use client";

import Navbar from "@/components/navbar";
import LandingPage from "./(nonDashboard)/landing/page";
import { useGetAuthUserQuery } from "@/state/api";
import { useAuthenticator } from "@aws-amplify/ui-react";
import React, { useEffect } from "react";

export default function Home() {
  const { user } = useAuthenticator((context) => [context.user]);
  
  const { data: authUser, isLoading, error, isError, isSuccess } = useGetAuthUserQuery();

  useEffect(() => {
    console.log("=== Home Page (Root) Auth Check ===");
    console.log("hasUser:", Boolean(user));
    console.log("isLoading:", isLoading);
    console.log("isError:", isError);
    console.log("isSuccess:", isSuccess);
    console.log("error:", error);
    console.log("data:", authUser);
    console.log("=================================");
  }, [user, isLoading, isError, isSuccess, error, authUser]);

  return (
    <div className="h-full w-full">
      <Navbar />
      <main className={`h-full flex w-full flex-col`}>
        <LandingPage />
      </main>
    </div>
  );
}
