"use client";

import { useState, useTransition } from "react";
import { changeRoleAction } from "@/actions/employee.actions";
import { ROLE_LABEL } from "@/lib/rbac";

const OPTIONS = Object.entries(ROLE_LABEL);

type Props = { userId: string; role: string; disabled?: boolean };

export function RoleSelect({ userId, role, disabled }: Props) {
  const [value, setValue] = useState(role);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function onChange(next: string) {
    const previous = value;
    setValue(next);
    start(async () => {
      const res = await changeRoleAction(userId, next);
      if (res && "error" in res && res.error) {
        setValue(previous);
        setError(res.error);
      } else {
        setError("");
      }
    });
  }

  return (
    <div>
      <select
        value={value}
        disabled={disabled || pending}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500 disabled:opacity-50"
      >
        {OPTIONS.map(([v, label]) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}