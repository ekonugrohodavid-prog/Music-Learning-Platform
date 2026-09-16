"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

interface RecoverySessionProps {
  children: React.ReactNode;
}

export function RecoverySession({
  children,
}: RecoverySessionProps) {
  const supabase = useMemo(() => createClient(), []);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initializeRecoverySession() {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (sessionError || !session) {
        setError(true);
        return;
      }

      setReady(true);
    }

    void initializeRecoverySession();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
      >
        Recovery session sudah tidak valid. Silakan minta link
        recovery baru.
      </div>
    );
  }

  if (!ready) {
    return (
      <p className="text-sm text-gray-600">
        Memverifikasi recovery session...
      </p>
    );
  }

  return <>{children}</>;
}
