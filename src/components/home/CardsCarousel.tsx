import React, { useState } from "react";

const currency = (n: number) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

type CardInfo = {
  type: "credit" | "debit";
  last4: string;
  label: string;
  bank: string;
  limit?: number;
  due?: string;
};

const mock: CardInfo[] = [
  { type: "credit", last4: "1234", label: "Tarjeta de crédito", bank: "WALLET", limit: 78, due: "01/sep" },
  { type: "debit", last4: "5678", label: "Tarjeta Débito", bank: "WALLET" },
];

export default function CardsCarousel({ hidden }: { hidden?: boolean }) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="cards-row" role="region" aria-label="Tus tarjetas">
      {mock.map((c, idx) => (
        <div key={idx} className="card-item">
          <div className="text-xs uppercase tracking-wide text-slate-500">{c.type === 'credit' ? 'credit' : 'debit'} • {c.bank}</div>
          <div className="mt-1 text-lg font-semibold">{c.label}</div>
          <div className="mt-1 text-sm text-slate-600">**** **** **** {c.last4}</div>
          {c.type === 'credit' && (
            <div className="mt-2">
              <div className="text-sm">Límite disponible</div>
              <div className="text-2xl font-bold TAVI-mono">{hidden ? '••••' : currency(c.limit || 0)}</div>
              {c.due && <div className="text-xs text-slate-500">Límite de pago {c.due}</div>}
            </div>
          )}
          {c.type === 'debit' && (
            <div className="mt-2 flex items-center gap-2">
              <button className="underline text-sm" onClick={() => setShowDetails((s)=>!s)} aria-label="Datos de tu tarjeta">
                Datos de tu tarjeta
              </button>
              {showDetails && <span className="text-xs text-slate-500">Nombre: Juan Pérez · Exp: 09/28</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
