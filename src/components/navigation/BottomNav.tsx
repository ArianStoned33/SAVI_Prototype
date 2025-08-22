import React from "react";
import { cn } from "@/lib/utils";

export type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

export default function BottomNav(props: {
  items: NavItem[];
  activeId: string;
  onChange: (id: string) => void;
  hasFab?: boolean;
  fabIcon?: React.ReactNode;
  fabId?: string;
  fabLabel?: string;
  hidden?: boolean;
}) {
  const { items, activeId, onChange, hasFab, fabIcon, fabId, fabLabel, hidden } = props;

  const left = items.slice(0, 2);
  const right = items.slice(2, 4);

  const renderIcon = (icon: React.ReactNode, active: boolean) => {
    if (React.isValidElement(icon)) {
      const type = (icon as any).type;
      const isDom = typeof type === "string"; // e.g. 'img'
      const baseClass = "bn-icon";
      if (isDom) {
        return React.cloneElement(icon as any, { className: cn(baseClass, (icon as any).props?.className), "aria-hidden": true });
      }
      return React.cloneElement(icon as any, { className: cn(baseClass, (icon as any).props?.className), strokeWidth: active ? 3 : 2, "aria-hidden": true });
    }
    return icon;
  };

  const Item = ({ id, label, icon }: NavItem) => {
    const active = id === activeId;
    return (
      <button
        type="button"
        onClick={() => onChange(id)}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        className={cn("bn-item")}
        data-active={active ? "true" : undefined}
      >
        {renderIcon(icon, active)}
        <span>{label}</span>
      </button>
    );
  };

  const Fab = () => (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => { if (fabId) onChange(fabId); }}
        aria-label={fabLabel || "Acción principal"}
        aria-current={activeId === fabId ? "page" : undefined}
        className={cn("bn-fab", activeId === fabId && "bn-fab-active")}
      >
        {renderIcon(fabIcon || null, activeId === fabId)}
      </button>
      {fabLabel ? <span className="text-[11px] text-slate-600">{fabLabel}</span> : null}
    </div>
  );

  return (
    <nav role="navigation" aria-label="Navegación principal" className={cn("bn", hidden && "bn-hidden")}> 
      {left.map((it) => (
        <Item key={it.id} {...it} />
      ))}
      {hasFab ? <Fab /> : <div />}
      {right.map((it) => (
        <Item key={it.id} {...it} />
      ))}
    </nav>
  );
}
