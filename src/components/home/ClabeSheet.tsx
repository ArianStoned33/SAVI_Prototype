import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

export default function ClabeSheet(props: {
  open: boolean;
  onClose: () => void;
  clabe: string;
  name: string;
  phone: string;
}) {
  const { open, onClose, clabe, name, phone } = props;
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const firstBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstBtnRef.current?.focus(), 10);
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [open, onClose]);

  if (!open) return null;

  const deeplink = `bankapp://account?clabe=${encodeURIComponent(clabe)}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(clabe); setCopied(true); setTimeout(()=>setCopied(false), 1200); } catch {}
  };

  return (
    <>
      <div className="modal-backdrop" role="button" tabIndex={0} aria-label="Cerrar" onClick={onClose} onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); onClose(); } }} />
      <div className="modal-window sheet-window" role="dialog" aria-modal="true" aria-labelledby="clabe-title">
        <div className="flex items-center justify-between">
          <h3 id="clabe-title" className="text-lg font-semibold">Tu CLABE</h3>
          <Button variant="ghost" onClick={onClose} aria-label="Cerrar">Cerrar</Button>
        </div>
        <div className="mt-2 text-sm">
          <div className="grid grid-cols-3 gap-x-3 gap-y-1">
            <div className="text-muted-foreground">CLABE:</div>
            <div className="col-span-2 font-mono break-all">{clabe}</div>
            <div className="text-muted-foreground">Beneficiario:</div>
            <div className="col-span-2">{name}</div>
            <div className="text-muted-foreground">Celular:</div>
            <div className="col-span-2">{phone}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button ref={firstBtnRef} variant="outline" onClick={copy} aria-label="Copiar CLABE">Copiar</Button>
          <Button variant="outline" onClick={() => setShowQR((s)=>!s)} aria-label="Mostrar QR">{showQR ? 'Ocultar QR' : 'Mostrar QR'}</Button>
          <a className="underline text-sm" href={deeplink} target="_blank" rel="noreferrer">Abrir en app</a>
          {copied && <span className="text-xs text-green-700">Copiado</span>}
        </div>
        {showQR && (
          <div className="mt-3 flex justify-center">
            <QRCodeSVG value={deeplink} size={180} />
          </div>
        )}
      </div>
    </>
  );
}
