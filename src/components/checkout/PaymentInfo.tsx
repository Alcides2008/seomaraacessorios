"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { siteConfig } from "@/config/site";

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard indisponível */
    }
  };
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border-2 border-ink bg-white bg-cream px-4 py-3">
      <div>
        <span className="text-xs font-bold text-ink/60">
          {label}
        </span>
        <p className="font-medium text-ink">{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copiar ${label}`}
        className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-gold"
      >
        {copied ? (
          <Check className="h-4 w-4 text-gold" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        {copied ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}

/** Mostra os dados de pagamento conforme o método escolhido. */
export function PaymentInfo({
  method,
  showNote = true,
}: {
  method: string;
  showNote?: boolean;
}) {
  const { expressNumber, reference } = siteConfig.payment;

  if (method === "entrega") {
    return (
      <p className="rounded-[1.6rem] border-2 border-ink bg-white shadow-[5px_5px_0_var(--color-ink)] p-4 text-sm text-muted">
        Pague em numerário no momento da entrega. Combinamos os detalhes
        consigo por WhatsApp.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {method === "multicaixa-express" && (
        <CopyRow label="Multicaixa Express" value={expressNumber} />
      )}
      {method === "referencia" && (
        <>
          <CopyRow label="Entidade" value={reference.entity} />
          <CopyRow label="Referência" value={reference.reference} />
        </>
      )}
      {showNote && (
        <p className="text-xs text-muted">
          Depois de pagar, envie o comprovativo por WhatsApp para confirmarmos
          o pedido.
        </p>
      )}
    </div>
  );
}
