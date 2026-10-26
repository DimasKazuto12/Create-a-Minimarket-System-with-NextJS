"use client";

import { useActionState } from "react";
import { registerAction, type FormState } from "@/actions/auth.actions";
import { Field } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function RegisterForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(registerAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <Field
        label="Nama lengkap"
        name="name"
        autoComplete="name"
        placeholder="Nama kamu"
        defaultValue={state?.values?.name}
        required
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="nama@email.com"
        defaultValue={state?.values?.email}
        required
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="Minimal 8 karakter"
        minLength={8}
        required
      />

      {state?.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <SubmitButton pending={pending}>Buat akun</SubmitButton>
    </form>
  );
}