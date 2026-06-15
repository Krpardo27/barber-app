"use client";

import { Toaster } from "react-hot-toast";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1a1a1a",
          color: "#f5f5f5",
          borderRadius: "0.75rem",
          padding: "12px 16px",
          border: "1px solid rgba(200, 169, 110, 0.2)",
        },
        success: {
          style: {
            background: "rgba(74, 222, 128, 0.1)",
            borderColor: "rgba(74, 222, 128, 0.3)",
            color: "#4ade80",
          },
          iconTheme: {
            primary: "#4ade80",
            secondary: "#1a1a1a",
          },
        },
        error: {
          style: {
            background: "rgba(239, 68, 68, 0.1)",
            borderColor: "rgba(239, 68, 68, 0.3)",
            color: "#ef4444",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#1a1a1a",
          },
        },
      }}
    />
  );
}
