"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type ToastType = "success" | "error";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

type TemplateToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const TemplateToastContext =
  createContext<TemplateToastContextValue | null>(null);

export function TemplateToastProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  function showToast(
    message: string,
    type: ToastType = "success"
  ) {
    const id = Date.now() + Math.floor(Math.random() * 1000);

    setToasts((current) => [
      ...current,
      { id, message, type },
    ]);

    window.setTimeout(() => {
      setToasts((current) =>
        current.filter((toast) => toast.id !== id)
      );
    }, 3000);
  }

  return (
    <TemplateToastContext.Provider value={{ showToast }}>
      {children}

      <div className="pointer-events-none fixed right-6 bottom-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={
              toast.type === "success"
                ? "rounded-lg border border-emerald-700/50 bg-emerald-950 px-4 py-3 text-sm text-emerald-200 shadow-lg"
                : "rounded-lg border border-red-700/50 bg-red-950 px-4 py-3 text-sm text-red-200 shadow-lg"
            }
          >
            {toast.message}
          </div>
        ))}
      </div>
    </TemplateToastContext.Provider>
  );
}

export function useTemplateToast() {
  const context = useContext(TemplateToastContext);

  if (!context) {
    throw new Error(
      "useTemplateToast must be used within TemplateToastProvider"
    );
  }

  return context;
}
