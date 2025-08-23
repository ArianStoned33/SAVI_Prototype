import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Percent, Gift, BadgeDollarSign, ShoppingCart, Sparkles } from "lucide-react";

function round2(n: number) { return Math.round(n * 100) / 100; }

function PointsModal({ open, onClose, points, onRedeem }: { open: boolean; onClose: () => void; points: number; onRedeem: (amt: number) => void; }) {
  const [amt, setAmt] = useState("0");
  if (!open) return null;
  return (
    <>
      <div className="modal-backdrop" role="button" tabIndex={0} aria-label="Cerrar" onClick={onClose} onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); onClose(); } }} />
      <div className="modal-window" role="dialog" aria-modal="true" aria-labelledby="points-title">
        <h3 id="points-title" className="text-lg font-semibold flex items-center gap-2"><Gift className="h-4 w-4"/> Canjear puntos</h3>
        <p className="text-sm text-muted-foreground mt-1">Disponibles: <strong>{points}</strong> puntos</p>
        <div className="mt-3 flex items-center gap-2">
          <input className="border rounded-md px-3 py-2 text-sm w-32" value={amt} onChange={e=>setAmt(e.target.value.replace(/[^0-9.]/g,''))} aria-label="Puntos a canjear" placeholder="0" />
          <Button onClick={()=>{ const n = Number(amt||'0'); if(n>0 && n<=points) { onRedeem(n); onClose(); } }}>Canjear</Button>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </>
  );
}

export default function BenefitsPanel() {
  const [apr] = useState(0.14); // 14% anual
  const [principal, setPrincipal] = useState("10000");
  const [points, setPoints] = useState(1200);
  const [roundUp, setRoundUp] = useState(false);
  const [openPoints, setOpenPoints] = useState(false);

  const monthly = useMemo(() => {
    const p = Number(principal || '0');
    return p > 0 ? round2((apr / 12) * p) : 0;
  }, [apr, principal]);

  return (
    <Card className="h-fit" role="region" aria-label="Beneficios">
      <CardHeader>
        <CardTitle>Beneficios — Banco Ejemplo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">Simulador de rendimiento</div>
        <div className="grid grid-cols-3 gap-2 items-end">
          <div className="col-span-2">
            <label className="text-xs text-muted-foreground" htmlFor="principal">Monto promedio en cuenta</label>
            <input id="principal" className="border rounded-md px-3 py-2 text-sm w-full" value={principal} onChange={e=>setPrincipal(e.target.value.replace(/[^0-9.]/g,''))} aria-label="Monto promedio" placeholder="$10,000" />
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Ganancia mensual estimada</div>
            <div className="text-xl font-bold TAVI-mono">${monthly.toLocaleString('es-MX')}</div>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={()=>setOpenPoints(true)} aria-label="Canjear puntos"><Gift className="h-4 w-4 mr-2"/> Canjear puntos</Button>
          <Button variant={roundUp? 'default':'outline'} onClick={()=>setRoundUp(v=>!v)} aria-label="Ahorro por redondeo"><BadgeDollarSign className="h-4 w-4 mr-2"/> Ahorro por redondeo {roundUp? 'Activo':'Desactivar'}</Button>
        </div>
        <div className="home-banner flex items-center gap-2"><Sparkles className="h-4 w-4"/> <span>Promos del mes</span></div>
        <div className="grid grid-cols-2 gap-2">
          <button className="action-pill" aria-label="10% en Supermercado"><ShoppingCart className="h-5 w-5"/><span className="text-sm">10% Supermercado</span></button>
          <button className="action-pill" aria-label="2x1 Cine"><Percent className="h-5 w-5"/><span className="text-sm">2x1 Cine</span></button>
        </div>
      </CardContent>

      <PointsModal open={openPoints} onClose={()=>setOpenPoints(false)} points={points} onRedeem={(n)=> setPoints(p=>Math.max(0,p-n))} />
    </Card>
  );
}
