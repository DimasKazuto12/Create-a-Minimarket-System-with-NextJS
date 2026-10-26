type Props = { pending: boolean; children: React.ReactNode };

export function SubmitButton({ pending, children }: Props) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Memproses…" : children}
    </button>
  );
}