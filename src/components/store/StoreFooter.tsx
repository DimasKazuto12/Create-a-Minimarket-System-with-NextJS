import { Clock, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { STORE } from "@/lib/store-info";

export function StoreFooter() {
  return (
    <footer className="bg-emerald-950 text-emerald-100/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{STORE.description}</p>
        </div>
        <ul className="space-y-3 text-sm">
          <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-emerald-400" />{STORE.address}</li>
          <li className="flex gap-3"><Clock className="mt-0.5 size-4 shrink-0 text-emerald-400" />{STORE.hours}</li>
          <li className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-emerald-400" />{STORE.phone}</li>
        </ul>
        <a
          href={`https://wa.me/${STORE.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="h-fit w-fit rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-emerald-950 hover:bg-emerald-300"
        >
          Tanya via WhatsApp
        </a>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-xs text-emerald-200/50">© {STORE.name}</p>
    </footer>
  );
}