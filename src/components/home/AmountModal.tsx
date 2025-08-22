import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type AmountMode = "deposit" | "withdraw";

export default function AmountModal(props: {
  open: boolean;
  mode: AmountMode;
  max?: number;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}) {
  const { open, mode, max, onClose, onConfirm } = props;
  const [val, setVal] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setVal("");
      setErr(null);
      setTimeout(() => inputRef.current?.focus(), 10);
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [open, onClose]);

  if (!open) return null;

  const parse = () => Number(String(val).replace(/[^0-9.]/g, ""));

  const submit = () => {
    const n = parse();
    if (!n || n <= 0) { setErr("Ingrese un monto mayor a $0.00 MXN."); return; }
    if (typeof max === "number" && n > max) { setErr("El monto excede su saldo disponible."); return; }
    onConfirm(Number(n.toFixed(2)));
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop" role="button" tabIndex={0} aria-label="Cerrar" onClick={onClose} onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); onClose(); } }} />
      <div className="modal-window" role="dialog" aria-modal="true" aria-labelledby="amount-title">
        <h3 id="amount-title" className="text-lg font-semibold">
          {mode === "deposit" ? "Ingresar dinero" : "Retirar dinero"}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === "deposit" ? "Aumente su saldo disponible." : "Disminuya su saldo disponible."}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Input
            ref={inputRef}
            inputMode="decimal"
            placeholder="$0.00"
            aria-label="Monto"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="max-w-[200px]"
          />
          <Button onClick={submit} className="TAVI-button-primary">Confirmar</Button>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
        </div>
        {typeof max === "number" && (
          <div className="text-xs text-muted-foreground mt-1">Saldo disponible: {max.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}</div>
        )}
        {err && (
          <Alert className="mt-3">
            <AlertTitle>Verifique el monto</AlertTitle>
            <AlertDescription>{err}</AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
}
