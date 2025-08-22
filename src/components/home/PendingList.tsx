import React from "react";
import { Button } from "@/components/ui/button";

const currency = (n: number) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

export default function PendingList({ onPay, canPay }: { onPay: (amount: number) => void; canPay: boolean; }) {
  const amount = 4723.77;
  return (
    <div>
      <h4 className="mt-2 text-lg font-semibold">Tienes 1 pendiente</h4>
      <div className="pending-tile" role="region" aria-label="Pago pendiente">
        <div>
          <div className="text-sm text-slate-600">Vence el 01/09</div>
          <div className="text-base">Paga {currency(amount)} del estado de cuenta de agosto</div>
        </div>
        <Button onClick={() => onPay(amount)} disabled={!canPay} aria-label="Pagar pendiente">Pagar</Button>
      </div>
    </div>
  );
}
