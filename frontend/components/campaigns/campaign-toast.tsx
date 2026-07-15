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

type CampaignToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const CampaignToastContext =
  createContext<CampaignToastContextValue | null>(null);

export function CampaignToastProvider({
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
    <CampaignToastContext.Provider value={{ showToast }}>
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
    </CampaignToastContext.Provider>
  );
}

export function useCampaignToast() {
  const context = useContext(CampaignToastContext);

  if (!context) {
    throw new Error(
      "useCampaignToast must be used within CampaignToastProvider"
    );
  }

  return context;
}
