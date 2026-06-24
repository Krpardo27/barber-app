"use client";

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      richColors
      closeButton
      theme="dark"
      position="top-right"
      toastOptions={{
        className: "w-[calc(100vw-2rem)] sm:w-auto",
      }}
    />
  );
}
