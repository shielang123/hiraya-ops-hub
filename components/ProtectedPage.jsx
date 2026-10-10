"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { canAccess } from "@/lib/roles";
import Shell from "./Shell";

// Wrap every staff page in this. It sends signed-out visitors to /login
// and shows an access message when the role is not allowed.
export default function ProtectedPage({ roles, title, children }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-soft">
        Loading...
      </div>
    );
  }

  return (
    <Shell>
      {canAccess(role, roles) ? (
        <>
          {title && <h1 className="mb-6 font-display text-2xl font-bold text-brand-600">{title}</h1>}
          {children}
        </>
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
          Your role does not have access to this page.
        </div>
      )}
    </Shell>
  );
}
