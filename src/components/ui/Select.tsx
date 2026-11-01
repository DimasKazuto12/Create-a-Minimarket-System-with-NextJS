"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

export type SelectOption = { value: string; label: string; hint?: string };

type Props = {
  options: SelectOption[];
  value?: string; // terkontrol
  defaultValue?: string; // tak terkontrol
  onChange?: (value: string) => void;
  name?: string; // supaya ikut terkirim di <form>
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
  "aria-label"?: string;
};

type Pos = { left: number; width: number; top?: number; bottom?: number };

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  name,
  placeholder = "Pilih…",
  disabled,
  size = "md",
  className = "",
  ...rest
}: Props) {
  const uid = useId();
  const [inner, setInner] = useState(defaultValue ?? "");
  const current = value ?? inner;
  const selected = options.find((o) => o.value === current);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState<Pos | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const close = useCallback(() => setOpen(false), []);

  const openList = useCallback(() => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const flip = window.innerHeight - r.bottom < 280 && r.top > 280;
    setPos(
      flip
        ? { left: r.left, width: r.width, bottom: window.innerHeight - r.top + 6 }
        : { left: r.left, width: r.width, top: r.bottom + 6 }
    );
    setActive(Math.max(0, options.findIndex((o) => o.value === current)));
    setOpen(true);
  }, [options, current]);

  function choose(i: number) {
    const opt = options[i];
    if (!opt) return;
    setInner(opt.value);
    onChange?.(opt.value);
    setOpen(false);
    btnRef.current?.focus();
  }

  // Tutup saat klik di luar, scroll halaman, atau ukuran layar berubah
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || listRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onScroll = (e: Event) => {
      if (listRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", close);
    };
  }, [open, close]);

  // Jaga pilihan aktif tetap terlihat saat navigasi keyboard
  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => (a + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => (a - 1 + options.length) % options.length);
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  const sizeCls = size === "sm" ? "px-3 py-1.5" : "px-4 py-3";

  return (
    <>
      {name && <input type="hidden" name={name} value={current} />}

      <button
        ref={btnRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${uid}-list`}
        aria-activedescendant={open ? `${uid}-opt-${active}` : undefined}
        aria-label={rest["aria-label"]}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white text-left text-sm outline-none transition focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50 ${
          open ? "border-emerald-500 ring-4 ring-emerald-500/10" : "border-stone-200 hover:border-stone-300"
        } ${sizeCls} ${className}`}
      >
        <span className={`truncate ${selected ? "font-medium text-stone-900" : "text-stone-400"}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown className={`size-4 shrink-0 text-stone-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open &&
        pos &&
        createPortal(
          <ul
            ref={listRef}
            id={`${uid}-list`}
            role="listbox"
            style={{ position: "fixed", left: pos.left, minWidth: pos.width, top: pos.top, bottom: pos.bottom }}
            className="z-[100] max-h-72 overflow-auto rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl shadow-stone-900/10 animate-pop"
          >
            {options.map((o, i) => (
              <li
                key={o.value}
                id={`${uid}-opt-${i}`}
                role="option"
                aria-selected={o.value === current}
                onPointerEnter={() => setActive(i)}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-2 text-sm ${
                  i === active ? "bg-emerald-50" : ""
                }`}
              >
                <span>
                  <span className={`block ${o.value === current ? "font-semibold text-emerald-800" : "text-stone-800"}`}>
                    {o.label}
                  </span>
                  {o.hint && <span className="block text-xs text-stone-400">{o.hint}</span>}
                </span>
                {o.value === current && <Check className="size-4 shrink-0 text-emerald-600" />}
              </li>
            ))}
          </ul>,
          document.body
        )}
    </>
  );
}