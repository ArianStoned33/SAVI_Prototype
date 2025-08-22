import React from "react";
import { ArrowDownCircle, ArrowUpCircle, KeySquare } from "lucide-react";

export default function ActionGrid({ onDeposit, onTransfer, onWithdraw, onOpenClabe }: { onDeposit: () => void; onTransfer: () => void; onWithdraw: () => void; onOpenClabe: () => void; }) {
  const Item = ({ label, icon, onClick, aria }: { label: string; icon: React.ReactNode; onClick: () => void; aria: string; }) => (
    <button className="action-pill" onClick={onClick} aria-label={aria}>
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
  return (
    <div className="action-grid">
      <Item label="Ingresar" icon={<ArrowDownCircle className="h-6 w-6" />} onClick={onDeposit} aria="Ingresar dinero" />
      <Item label="TAVI®" icon={<img src="/favicon.svg" alt="" className="h-7 w-7" />} onClick={onTransfer} aria="Abrir TAVI" />
      <Item label="Retirar" icon={<ArrowUpCircle className="h-6 w-6" />} onClick={onWithdraw} aria="Retirar dinero" />
      <Item label="Tu CLABE" icon={<KeySquare className="h-6 w-6" />} onClick={onOpenClabe} aria="Ver tu CLABE" />
    </div>
  );
}
