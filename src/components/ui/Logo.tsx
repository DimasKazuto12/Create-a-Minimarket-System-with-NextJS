import { STORE } from "@/lib/store-info";

type Props = { className?: string; tone?: "dark" | "light" };

export function Logo({ className = "", tone = "dark" }: Props) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-900/20">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 7h12l-1 12H7L6 7Z" />
          <path d="M9 7a3 3 0 0 1 6 0" />
        </svg>
      </span>
      <span className={`font-display text-xl font-bold tracking-tight ${tone === "light" ? "text-white" : "text-stone-900"}`}>
        {STORE.name}
      </span>
    </div>
  );
}