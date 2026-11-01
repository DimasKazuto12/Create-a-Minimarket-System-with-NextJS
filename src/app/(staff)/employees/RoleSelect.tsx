"use client";

import { useState, useTransition } from "react";
import { changeRoleAction } from "@/actions/employee.actions";
import { Select, type SelectOption } from "@/components/ui/Select";
import { ROLE_HINT, ROLE_LABEL } from "@/lib/rbac";
import type { Role } from "@/lib/session";

const OPTIONS: SelectOption[] = (Object.keys(ROLE_LABEL) as Role[]).map((r) => ({
  value: r,
  label: ROLE_LABEL[r],
  hint: ROLE_HINT[r],
}));

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
    <div className="w-48">
      <Select
        size="sm"
        value={value}
        onChange={onChange}
        options={OPTIONS}
        disabled={disabled || pending}
        aria-label="Ubah role"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}