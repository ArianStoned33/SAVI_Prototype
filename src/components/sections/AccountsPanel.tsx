import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ClabeSheet from "@/components/home/ClabeSheet";
import { Eye, EyeOff, FileDown, Receipt, Send, ArrowDownToLine, List } from "lucide-react";

const peso = (n: number) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

type Movement = { id: string; date: string; desc: string; amount: number };

function MovementsModal({ open, onClose, data }: { open: boolean; onClose: () => void; data: Movement[] }) {
  if (!open) return null;
  return (
    <>
      <div className="modal-backdrop" role="button" tabIndex={0} aria-label="Cerrar" onClick={onClose} onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); onClose(); } }} />
      <div className="modal-window" role="dialog" aria-modal="true" aria-labelledby="mov-title">
        <h3 id="mov-title" className="text-lg font-semibold flex items-center gap-2"><List className="h-4 w-4"/> Movimientos</h3>
        <div className="mt-2 text-sm max-h-[60vh] overflow-auto">
          <ul className="space-y-2">
            {data.map(m => (
              <li key={m.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{m.desc}</div>
                  <div className="text-xs text-muted-foreground">{m.date}</div>
                </div>
                <div className={`TAVI-mono ${m.amount < 0 ? 'text-red-600' : 'text-green-700'}`}>{peso(m.amount)}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </>
  );
}

export default function AccountsPanel({ balance, onTransfer, onDownloadStatement }: { balance: number; onTransfer: () => void; onDownloadStatement: () => void; }) {
  const [hidden, setHidden] = useState(false);
  const [movOpen, setMovOpen] = useState(false);
  const [clabeOpen, setClabeOpen] = useState(false);

  const movements = useMemo<Movement[]>(() => ([
    { id: 'm1', date: '2025-08-01 12:40', desc: 'Cobro QR - Café', amount: +85.00 },
    { id: 'm2', date: '2025-08-01 10:22', desc: 'Transferencia a Ana', amount: -250.00 },
    { id: 'm3', date: '2025-07-31 19:05', desc: 'Depósito', amount: +1500.00 },
  ]), []);

  return (
    <Card className="h-fit" role="region" aria-label="Cuentas">
      <CardHeader>
        <CardTitle>Cuentas — Banco Ejemplo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">Saldo disponible</div>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-extrabold TAVI-mono">{hidden ? '••••' : peso(balance)}</div>
          <button className="text-blue-900 text-sm flex items-center gap-1" onClick={()=>setHidden(h => !h)} aria-label={hidden?'Mostrar saldo':'Ocultar saldo'}>
            {hidden ? <Eye className="h-4 w-4"/> : <EyeOff className="h-4 w-4"/>}
            {hidden ? 'Mostrar' : 'Ocultar'}
          </button>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={()=>setMovOpen(true)} aria-label="Ver movimientos"><List className="h-4 w-4 mr-2"/> Movimientos</Button>
          <Button variant="outline" onClick={()=>setClabeOpen(true)} aria-label="Ver CLABE"><Receipt className="h-4 w-4 mr-2"/> Ver CLABE</Button>
          <Button className="TAVI-button-primary" onClick={onTransfer} aria-label="Transferir"><Send className="h-4 w-4 mr-2"/> Transferir</Button>
          <Button variant="outline" onClick={onDownloadStatement} aria-label="Descargar estado"><FileDown className="h-4 w-4 mr-2"/> Estado de cuenta</Button>
        </div>
        <div className="home-banner flex items-center justify-between">
          <div>Ahorra con redondeo automático en compras.</div>
          <Button size="sm" variant="outline"><ArrowDownToLine className="h-4 w-4 mr-1"/> Activar</Button>
        </div>
      </CardContent>

      <MovementsModal open={movOpen} onClose={()=>setMovOpen(false)} data={movements} />
      <ClabeSheet open={clabeOpen} onClose={()=>setClabeOpen(false)} clabe="646180000000000000" name="JUAN PEREZ" phone="1234567890" />
    </Card>
  );
}
