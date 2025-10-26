"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type Toast = { id: string; message: string; type?: "success" | "error" | "info" };

type ToastContextValue = {
  show: (message: string, type?: Toast["type"]) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-3 top-3 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded px-3 py-2 text-sm shadow border bg-white ${
              t.type === "success" ? "border-green-300 text-green-800" : t.type === "error" ? "border-red-300 text-red-800" : "border-slate-300 text-slate-800"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
