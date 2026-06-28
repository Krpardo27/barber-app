"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface AdminSearchProps {
  initialQuery: string;
  placeholder: string;
}

export default function AdminSearch({
  initialQuery,
  placeholder,
}: AdminSearchProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, startTransition] = useTransition();

  function buildUrl(nextQuery: string) {
    const params = new URLSearchParams(searchParams.toString());
    const trimmedQuery = nextQuery.trim();

    params.delete("page");

    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    } else {
      params.delete("q");
    }

    const search = params.toString();
    return search ? `${pathname}?${search}` : pathname;
  }

  function replaceQuery(nextQuery: string) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    startTransition(() => {
      router.replace(buildUrl(nextQuery), { scroll: false });
    });
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextQuery = event.target.value;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      replaceQuery(nextQuery);
    }, 300);
  }

  function handleClear() {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }

    replaceQuery("");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        replaceQuery(String(formData.get("q") || ""));
      }}
      className="rounded-2xl border w-full sm:w-max border-white/10 bg-white/5 p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Buscar</span>
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            ref={inputRef}
            type="search"
            name="q"
            defaultValue={initialQuery}
            onChange={handleChange}
            placeholder={placeholder}
            className="h-11 w-full min-w-50 rounded-lg border border-white/10 bg-[#111111] pl-10 pr-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-[#C8A96E]/60"
          />
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/15 px-4 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <FiX className="h-4 w-4" />
            Limpiar
          </button>
        </div>
      </div>
    </form>
  );
}