type Props = React.InputHTMLAttributes<HTMLInputElement> & { label: string };

export function Field({ label, id, ...props }: Props) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-stone-700">
        {label}
      </label>
      <input
        id={inputId}
        {...props}
        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
      />
    </div>
  );
}