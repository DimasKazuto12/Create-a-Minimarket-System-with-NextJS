"use client";

import { useState, useTransition } from "react";
import { toggleActiveAction } from "@/actions/employee.actions";

type Props = { userId: string; active: boolean; disabled?: boolean };

export function ActiveToggle({ userId, active, disabled }: Props) {
  const [on, setOn] = useState(active);
  const [pending, start] = useTransition();

  function toggle() {
    setOn(!on);
    start(async () => {
      const res = await toggleActiveAction(userId);
      if (res && "error" in res && res.error) setOn(on);
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled || pending}
      onClick={toggle}
      className={`relative h-6 w-11 rounded-full transition disabled:opacity-50 ${on ? "bg-emerald-500" : "bg-stone-300"}`}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`}
      />
    </button>
  );
}