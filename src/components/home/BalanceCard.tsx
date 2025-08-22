import React from "react";
import { Eye, EyeOff } from "lucide-react";

const currency = (n: number) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

export default function BalanceCard({ balance, hidden, onToggle }: { balance: number; hidden: boolean; onToggle: () => void; }) {
  return (
    <div className="home-card" role="region" aria-label="Disponible">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="font-semibold">Disponible</div>
          <span className="home-chip">Crece 7.1% anual</span>
        </div>
        <button onClick={onToggle} className="flex items-center gap-1 text-sm text-blue-900" aria-label={hidden ? 'Mostrar saldo' : 'Ocultar saldo'} aria-pressed={hidden}>
          {hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
      </div>
      <div className="mt-2 text-4xl font-extrabold TAVI-mono">
        {hidden ? "••••" : currency(balance)}
      </div>
    </div>
  );
}
