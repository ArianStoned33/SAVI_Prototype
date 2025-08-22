import React, { useRef, useState, useEffect } from "react";

// UI primitives
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QRCodeSVG } from "qrcode.react";

// Home components
import BalanceCard from "@/components/home/BalanceCard";
import ActionGrid from "@/components/home/ActionGrid";
import CardsCarousel from "@/components/home/CardsCarousel";
import PendingList from "@/components/home/PendingList";
import AmountModal from "@/components/home/AmountModal";
import ClabeSheet from "@/components/home/ClabeSheet";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Fingerprint,
  LoaderCircle,
  Lock,
  QrCode,
  Send,
  Share2,
  X,
  ScanFace,
  Home,
  CreditCard,
  Percent,
  Menu,
} from "lucide-react";
import { interpret, NLUResult, generateReply } from "@/lib/nlu";

/**
 * TAVI® — Prototipo interactivo y shell bancario con CoDI® y Dimo® (demo).
 *
 * Esta vista integra:
 * - Pantalla inicial del banco con tab bar inferior (Inicio, Cuentas, Pagos, TAVI).
 * - Dentro de TAVI: chat guiado, Cobrar con QR (CoDI®), Vincular Dimo® y "Enviar a contactos".
 * - Micro‑hints efímeros para comunicar "sin comisión" sin saturar la UI.
 * - Estado de Dimo® NO persistente (se reinicia al refrescar para screenshots).
 */

// =====================
// Utilidades
// =====================
const currency = (n: number) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

// Generador CEP (mock) alfanumérico
const genCEP = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map((b) => (b % 36).toString(36).toUpperCase())
    .join("");

// Crea el payload del QR de cobro (emulación)
function buildPaymentPayload({ amount, concept, account = "123456789012345678", name = "Cliente Banco" }: { amount: number; concept?: string; account?: string; name?: string; }) {
  const payload = {
    type: "SPEI_COLLECT",
    bank: BANK_NAME,
    account,
    name,
    currency: "MXN",
    amount: Number(Number(amount || 0).toFixed(2)),
    concept: concept || "",
    ts: new Date().toISOString(),
    deeplink: `bankapp://collect?amount=${encodeURIComponent(String(amount))}&concept=${encodeURIComponent(concept || "")}`,
  };
  return JSON.stringify(payload);
}

// Sonido simple con Web Audio (bip corto)
function playSuccessTone(){
  try {
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if(!AudioCtx) return;
    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = 880;
    o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    o.start();
    o.stop(ctx.currentTime + 0.18);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
  } catch { /* noop */ }
}

// =====================
// Datos simulados
// =====================
const INITIAL_BALANCE = 3500.0; // saldo de ejemplo
const BANK_NAME = "Banco Ejemplo";

const initialContacts = [
  { id: "ana", name: "Ana López", alias: "ANA123", bank: "BBVA" },
  { id: "carlos", name: "Carlos Pérez", alias: "CPZ890", bank: "Santander" },
  { id: "maria", name: "María García", alias: "MGA221", bank: "Banorte" },
  { id: "juan", name: "Juan Torres", alias: "JTR009", bank: "Citibanamex" },
  { id: "sofia", name: "Sofía Díaz", alias: "SDI777", bank: "HSBC" },
];

// =====================
// Componentes auxiliares reutilizables
// =====================
function AppTopBar({ onOpenTAVI }: { onOpenTAVI: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-2xl bg-white shadow-sm" role="banner">
      <div className="flex items-center gap-3">
        <img src="/logo192.png" alt="TAVI" className="h-6 w-6" />
        <div className="text-sm leading-tight">
          <div className="font-semibold">{BANK_NAME}</div>
          <div className="text-xs text-muted-foreground">App bancaria — demo</div>
        </div>
      </div>
      <Button className="TAVI-button-primary" onClick={onOpenTAVI} aria-label="Abrir TAVI®, asistente de pagos">
        <img src="/favicon.svg" alt="" className="mr-2 h-4 w-4" /> Abrir TAVI®
      </Button>
    </div>
  );
}

function ChatBubble({ from, children }: { from: "TAVI" | "user"; children: React.ReactNode }) {
  const isTAVI = from === "TAVI";
  return (
    <div className={`w-full flex ${isTAVI ? "justify-start" : "justify-end"} mb-2`}>
      <div
        className={`max-w-[85%] px-3 py-2 rounded-2xl text-[15px] leading-6 shadow-sm ${isTAVI ? "TAVI-chat-bubble-TAVI" : "TAVI-chat-bubble-user"}`}
        role="group"
        aria-label={isTAVI ? "Mensaje de TAVI" : "Mensaje del usuario"}
      >
        {children}
      </div>
    </div>
  );
}

function QuickReplies({ options, onPick }: { options: { id: string; label: string }[]; onPick: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2" role="group" aria-label="Opciones rápidas">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className="quick-reply TAVI-chip text-sm"
          onClick={() => onPick(opt.id)}
          aria-label={opt.label}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onPick(opt.id);
            }
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
              e.preventDefault();
              const container = e.currentTarget.parentElement;
              if (!container) return;
              const items = Array.from(container.querySelectorAll('button')) as HTMLElement[];
              const idx = items.indexOf(e.currentTarget);
              const nextIdx = (e.key === 'ArrowRight' || e.key === 'ArrowDown')
                ? (idx + 1) % items.length
                : (idx - 1 + items.length) % items.length;
              items[nextIdx]?.focus();
            }
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function BottomNav({ active, onChange }: { active: 'inicio'|'cuentas'|'beneficios'|'mas'|'tavi'; onChange: (t: 'inicio'|'cuentas'|'beneficios'|'mas'|'tavi') => void }) {
  const Item = ({ id, label, Icon }: { id: 'inicio'|'cuentas'|'beneficios'|'mas', label: string, Icon: any }) => (
    <button
      onClick={() => onChange(id)}
      aria-label={label}
      aria-current={active === id ? 'page' : undefined}
      className={`bn-item ${active === id ? 'bn-item-active' : ''}`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
  return (
    <nav role="navigation" aria-label="Secciones" className="bn">
      <Item id="inicio" label="Inicio" Icon={Home} />
      <Item id="cuentas" label="Cuentas" Icon={CreditCard} />
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => onChange('tavi')}
          aria-label="TAVI®"
          aria-current={active === 'tavi' ? 'page' : undefined}
          className={`bn-fab ${active === 'tavi' ? 'bn-fab-active' : ''}`}
        >
          <img src="/favicon.svg" alt="" className="h-8 w-8" />
        </button>
        <span className="text-[11px] text-slate-600">TAVI®</span>
      </div>
      <Item id="beneficios" label="Beneficios" Icon={Percent} />
      <Item id="mas" label="Más" Icon={Menu} />
    </nav>
  );
}

// Selector de monto con estado local
function AmountSelector({ recipientName, initialValue = 0, onConfirm }: { recipientName?: string; initialValue?: number; onConfirm: (value: number) => void; }) {
  const [local, setLocal] = useState(initialValue ? String(initialValue) : "");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chips = [100, 200, 500, 1000];

  const parseValue = () => Number(String(local).replace(/[^0-9.]/g, ""));
  const formatValue = (raw: string) => {
    const clean = String(raw).replace(/[^0-9.]/g, "");
    if (!clean) return "";
    const [intPart, decPart] = clean.split(".");
    const intNum = Number(intPart || "0");
    const grouped = intNum.toLocaleString("es-MX");
    if (decPart !== undefined) {
      return `${grouped}.${decPart.slice(0, 2)}`;
    }
    return grouped;
  };

  useEffect(() => {
    const val = Number(String(local).replace(/[^0-9.]/g, ""));
    if (touched) {
      if (!val || val <= 0) setError("Ingrese un monto mayor a $0.00 MXN.");
      else setError(null);
    }
  }, [local, touched]);

  return (
    <div>
      <p>
        ¿Qué monto desea enviar{recipientName ? <> a <strong>{recipientName}</strong></> : null}?
      </p>
      <div className="mt-2 flex items-center gap-2" role="group" aria-label="Ingresar monto a enviar">
        <Input
          inputMode="decimal"
          aria-label="Monto a enviar"
          placeholder="$0.00"
          className="max-w-[200px]"
          value={local}
          onChange={(e) => setLocal(formatValue(e.target.value))}
          onBlur={() => setTouched(true)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "amount-error" : undefined}
        />
        <Button className="TAVI-button-primary" onClick={() => { const v = parseValue(); setTouched(true); if (v > 0) onConfirm(v); }} aria-label="Continuar" disabled={!(parseValue() > 0)}>
          Continuar <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      {error && (
        <div id="amount-error" className="text-xs text-red-600 mt-1" role="status" aria-live="polite">{error}</div>
      )}
      <div className="flex flex-wrap gap-2 mt-2" role="list" aria-label="Montos rápidos">
        {chips.map((v) => (
          <button key={v} className="quick-reply TAVI-chip text-sm" onClick={() => { setLocal(v.toLocaleString("es-MX")); setTouched(true); setError(null); }} aria-label={`Seleccionar ${currency(v)}`}>
            {currency(v)}
          </button>
        ))}
      </div>
    </div>
  );
}

// Flujo de cobro con QR
function CollectQR({ onClose, initialAmount, initialConcept, autoGenerate }: { onClose?: () => void; initialAmount?: number; initialConcept?: string; autoGenerate?: boolean; }) {
  const [amt, setAmt] = useState(initialAmount != null ? String(initialAmount) : "");
  const [conc, setConc] = useState(initialConcept || "");
  const [payload, setPayload] = useState<string | null>(null);

  useEffect(() => {
    if (autoGenerate && initialAmount && initialAmount > 0) {
      const p = buildPaymentPayload({ amount: initialAmount, concept: initialConcept });
      setPayload(p);
    }
  }, [autoGenerate, initialAmount, initialConcept]);

  const onGenerate = () => {
    const value = Number(String(amt).replace(/[^0-9.]/g, ""));
    if (!value || value <= 0) return;
    const p = buildPaymentPayload({ amount: value, concept: conc });
    setPayload(p);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(payload || ""); } catch {}
  };

  const share = async () => {
    try {
      if (navigator.share && payload) {
        const data = JSON.parse(payload);
        await navigator.share({ title: "Cobro", text: `Cobro ${currency(data.amount)} — ${data.concept || ''}`, url: data.deeplink });
      }
    } catch {}
  };

  return (
    <div>
      <p>Genere un QR de cobro con monto y concepto (emulación).</p>
      <div className="mt-2 grid grid-cols-3 gap-2" role="group" aria-label="Datos de cobro">
        <Input placeholder="Monto" inputMode="decimal" value={amt} onChange={(e)=>setAmt(e.target.value)} aria-label="Monto a cobrar"/>
        <Input placeholder="Concepto (opcional)" value={conc} onChange={(e)=>setConc(e.target.value)} aria-label="Concepto"/>
        <Button className="TAVI-button-primary" onClick={onGenerate} aria-label="Generar QR">Generar QR</Button>
      </div>
      {payload && (
        <Card className="mt-3">
          <CardHeader className="py-3">
            <CardTitle className="text-base">QR listo para cobrar</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-2">
            <QRCodeSVG value={payload} size={180} />
            <div className="text-xs text-muted-foreground break-all w-full">
              {payload}
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" onClick={copy} aria-label="Copiar payload">Copiar</Button>
              <Button variant="outline" onClick={share} aria-label="Compartir" disabled={!navigator.share}>Compartir</Button>
              {onClose && <Button variant="ghost" onClick={onClose} aria-label="Cerrar">Cerrar</Button>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// =====================
// TAVI Agent (conversación + flujos) con shell
// =====================

type Step =
  | "welcome"
  | "auth"
  | "menu"
  | "transfer.pickRecipient"
  | "transfer.amount"
  | "transfer.concept"
  | "transfer.confirm"
  | "transfer.authorize"
  | "processing"
  | "success"
  | "error.insufficient";

export default function TAVIApp() {
  // shell tabs
  const [activeTab, setActiveTab] = useState<'inicio'|'cuentas'|'beneficios'|'mas'|'tavi'>('inicio');

  const [step, setStep] = useState<Step>("welcome");
  const [messages, setMessages] = useState<React.ReactNode[]>([]);

  // Estado de la operación
  const [authed, setAuthed] = useState(false);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [contacts] = useState(initialContacts);
  const [concept, setConcept] = useState<string>("");
  const [recipient, setRecipient] = useState<typeof contacts[number] | null>(null);
  const [processing, setProcessing] = useState(false);
  const [online, setOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Dimo® (no persistente)
  const [dimoLinked, setDimoLinked] = useState(false);
  const dimoPhoneContacts = [
    { id: "tel-ana", name: "Ana López", phone: "+52 55 1234 5678", bank: "BBVA" },
    { id: "tel-carlos", name: "Carlos Pérez", phone: "+52 55 8765 4321", bank: "Santander" },
    { id: "tel-maria", name: "María García", phone: "+52 33 2222 1111", bank: "Banorte" },
  ];

  // Auth
  const [pinInput, setPinInput] = useState("");
  const [pinAttempts, setPinAttempts] = useState(0);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const [chatText, setChatText] = useState("");
  const [pendingNLU, setPendingNLU] = useState<NLUResult | null>(null);

  const [showNoFeeHint, setShowNoFeeHint] = useState<null | 'qr' | 'dimo'>(null);
  const [showDimoSuccessHint, setShowDimoSuccessHint] = useState(false);

  // Home (Inicio) UI state
  const [hideBalance, setHideBalance] = useState<boolean>(() => {
    try { return JSON.parse(localStorage.getItem("tavi.hideBalance") || "false"); } catch { return false; }
  });
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [clabeOpen, setClabeOpen] = useState(false);
  const [payConfirmOpen, setPayConfirmOpen] = useState(false);
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);
  const [homeHint, setHomeHint] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const chatLogRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);


  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, processing]);

  useEffect(() => {
    if (step === 'transfer.confirm' || step === 'success') {
      chatLogRef.current?.focus();
    }
  }, [step]);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!initializedRef.current && messages.length === 0) {
      initializedRef.current = true;
      pushTAVI(
        <>
          <p className="TAVI-text-strong">Bienvenido a TAVI, su asistente de pagos seguro.</p>
          <p>Para comenzar, necesito verificar su identidad.</p>
          <QuickReplies
            options={[
              { id: "auth.pin", label: "Ingresar NIP" },
              { id: "auth.bio", label: "Usar biometría" },
            ]}
            onPick={(id) => {
              setStep("auth");
              if (id === "auth.pin") {
                pushUser("Ingresar NIP");
                startPinAuth();
              } else {
                pushUser("Usar biometría");
                startBiometricChoice();
              }
            }}
          />
        </>
      );
    }
  }, [messages.length]);

  const pushTAVI = (node: React.ReactNode) => setMessages((m) => [...m, <ChatBubble from="TAVI">{node}</ChatBubble>]);
  const pushUser = (text: string) => setMessages((m) => [...m, <ChatBubble from="user">{text}</ChatBubble>]);

  const completeAuth = (mode: "NIP" | "Biometría") => {
    pushTAVI(
      <>
        <p>
          <Lock className="inline-block mr-1 h-4 w-4" aria-hidden /> Para su seguridad, autenticando con {mode.toLowerCase()}...
        </p>
      </>
    );
    setTimeout(() => {
      setAuthed(true);
      pushTAVI(
        <>
          <p>Gracias. Su identidad ha sido verificada.</p>
          <p>¿Cómo puedo ayudarle hoy?</p>
          <QuickReplies
            options={[
              { id: "menu.send", label: "Enviar dinero" },
              { id: "menu.balance", label: "Consultar saldo" },
              { id: "menu.share", label: "Mi CLABE / QR" },
            ]}
            onPick={handleMenu}
          />
        </>
      );
      setStep("menu");
      if (pendingNLU) {
        const toRun = pendingNLU;
        setPendingNLU(null);
        setTimeout(() => dispatchNLU(toRun), 300);
      }
    }, 700);
  };

  // === Autenticación: NIP ===
  const startPinAuth = () => {
    pushTAVI(
      <>
        <p>Ingrese su NIP de 4 dígitos.</p>
        <div className="mt-2 flex items-center gap-2" role="group" aria-label="Ingresar NIP">
          <Input
            aria-label="NIP"
            placeholder="••••"
            maxLength={4}
            inputMode="numeric"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
            className="max-w-[120px] text-center tracking-[6px]"
            type="password"
          />
          <Button className="TAVI-button-primary" onClick={verifyPin} aria-label="Confirmar NIP">
            Confirmar
          </Button>
        </div>
      </>
    );
  };

  const verifyPin = () => {
    if (pinInput === "1234") {
      pushTAVI(<p><CheckCircle2 className="inline mr-1 h-4 w-4 TAVI-success" aria-hidden/> NIP verificado.</p>);
      setPinAttempts(0);
      setPinInput("");
      completeAuth("NIP");
    } else {
      setPinAttempts((n) => n + 1);
      pushTAVI(
        <Alert className="mt-2" role="alert">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>NIP incorrecto</AlertTitle>
          <AlertDescription>
            Inténtelo de nuevo. {pinAttempts + 1 >= 3 ? 'Por seguridad, use biometría o espere 30s.' : ''}
          </AlertDescription>
        </Alert>
      );
    }
  };

  // === Autenticación: Biometría ===
  const startBiometricChoice = () => {
    pushTAVI(
      <>
        <p>Seleccione el método biométrico:</p>
        <QuickReplies
          options={[
            { id: 'bio.finger', label: 'Huella digital' },
            { id: 'bio.face', label: 'Face ID' },
          ]}
          onPick={(opt) => {
            pushUser(opt === 'bio.finger' ? 'Huella digital' : 'Face ID');
            startBiometric(opt === 'bio.finger' ? 'finger' : 'face');
          }}
        />
      </>
    );
  };

  const startBiometric = (mode: 'finger' | 'face') => {
    pushTAVI(
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-full border pulse" aria-hidden>
          {mode === 'finger' ? <Fingerprint className="h-8 w-8 TAVI-brand"/> : <ScanFace className="h-8 w-8 TAVI-brand"/>}
        </div>
        <div>Coloque {mode === 'finger' ? 'su dedo en el lector' : 'su rostro frente a la cámara'}...</div>
      </div>
    );
    setTimeout(() => {
      pushTAVI(
        <p><CheckCircle2 className="inline mr-1 h-4 w-4 TAVI-success" aria-hidden/> {mode === 'finger' ? 'Huella verificada' : 'Face ID verificado'}.</p>
      );
      completeAuth("Biometría");
    }, 1000);
  };

  const openDimoLinkFlow = (autoOpenPicker?: boolean) => {
    pushUser("Vincular Dimo®");
    pushTAVI(
      <>
        <p>Vincule su número con <strong>Dimo®</strong> para enviar dinero a sus contactos telefónicos sin costo.</p>
        <QuickReplies
          options={[
            { id: "dimo.link", label: "Vincular ahora" },
            { id: "dimo.later", label: "Después" },
          ]}
          onPick={(id) => {
            if (id === "dimo.link") {
              pushUser("Vincular ahora");
              pushTAVI(
                <p>
                  <LoaderCircle className="inline-block TAVI-spin mr-2 h-4 w-4" aria-hidden /> Verificando con Dimo®...
                </p>
              );
              setTimeout(() => {
                setDimoLinked(true);
                setShowDimoSuccessHint(true);
                setTimeout(() => setShowDimoSuccessHint(false), 1900);
                pushTAVI(
                  <>
                    <p><CheckCircle2 className="inline mr-1 h-4 w-4 TAVI-success" aria-hidden/> Dimo® vinculado correctamente.</p>
                    <p>Ahora puede <strong>Transferir</strong> vía Dimo®.</p>
                  </>
                );
                if (autoOpenPicker) {
                  setTimeout(() => openDimoContactPicker(), 300);
                }
              }, 800);
            } else {
              pushUser("Después");
            }
          }}
        />
      </>
    );
  };

  const openDimoContactPicker = () => {
    if (!dimoLinked) { openDimoLinkFlow(true); return; }
    pushUser("Transferir (Dimo®)");
    pushTAVI(
      <>
        <p>Seleccione un contacto (mock):</p>
        <QuickReplies
          options={dimoPhoneContacts.map((c) => ({ id: c.id, label: `${c.name}` }))}
          onPick={(id) => {
            const dc = dimoPhoneContacts.find((c) => c.id === id);
            if (dc) {
              const r = { id: id, name: dc.name, alias: dc.phone.replace(/[^0-9]/g, "").slice(-10), bank: dc.bank } as any;
              setRecipient(r);
              pushUser(dc.name);
              askAmount(r);
            }
          }}
        />
      </>
    );
  };

  // Acción unificada de Transferir (Dimo®): si no está vinculado, inicia vinculación y abre el picker; si está, abre directamente
  const openTransfer = () => {
    setShowNoFeeHint('dimo');
    setTimeout(() => setShowNoFeeHint(null), 1900);
    if (!dimoLinked) {
      openDimoLinkFlow(true);
    } else {
      openDimoContactPicker();
    }
  };

  const handleMenu = (id: string) => {
    pushUser(
      id === "menu.send" ? "Enviar dinero" : id === "menu.balance" ? "Consultar saldo" : "Mi CLABE / QR"
    );

    if (id === "menu.balance") {
      pushTAVI(<p className="TAVI-mono">Su saldo actual es de <strong>{currency(balance)}</strong>.</p>);
      return;
    }

    if (id === "menu.share") {
      pushTAVI(
        <>
          <CollectQR />
        </>
      );
      return;
    }

    if (id === "menu.send") {
      openTransfer();
    }
  };

  const askAmount = (r: typeof contacts[number], initial?: number) => {
    setStep("transfer.amount");
    pushTAVI(
      <AmountSelector
        recipientName={r.name}
        initialValue={initial}
        onConfirm={(value) => {
          if (!recipient) setRecipient(r);
          if (!value || value <= 0) { pushTAVI(<p>Ingrese un monto válido mayor a $0.00 MXN.</p>); return; }
          askConcept(value);
        }}
      />
    );
  };

  const askConcept = (value: number) => {
    setStep("transfer.concept");
    const handleSubmit = (e?: React.FormEvent) => {
      e?.preventDefault();
      reviewAndConfirm(value);
    };

    pushTAVI(
      <>
        <p>¿Desea agregar un concepto de pago? (opcional)</p>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mt-2 flex items-center gap-2" role="group" aria-label="Agregar concepto de pago (opcional)">
            <Input
              placeholder="Ej. Comida"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              aria-label="Concepto de pago"
              className="flex-1"
            />
            <Button variant="secondary" type="button" onClick={() => {
              setConcept("");
              reviewAndConfirm(value);
            }} aria-label="Omitir">
              Omitir
            </Button>
            <Button 
              className="TAVI-button-primary" 
              type="submit"
              aria-label="Continuar"
            >
              Continuar <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </form>
      </>
    );
  };

  const reviewAndConfirm = (value: number) => {
    setStep("transfer.confirm");
    pushTAVI(
      <>
        <p className="mb-1">Por favor, confirme los datos de la transferencia:</p>
        <Card className="mt-2" aria-label="Resumen de la operación">
          <CardContent className="pt-4 text-sm TAVI-mono">
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-muted-foreground">Destinatario:</div>
              <div><strong>{recipient?.name}</strong></div>
              <div className="text-muted-foreground">Monto:</div>
              <div><strong>{currency(value)}</strong></div>
              <div className="text-muted-foreground">Concepto:</div>
              <div>{concept?.trim() ? concept : <span className="text-muted-foreground">(Sin concepto)</span>}</div>
              <div className="text-muted-foreground">Comisión:</div>
              <div>$0.00 MXN</div>
              <div className="text-muted-foreground">Total a enviar:</div>
              <div className="font-bold">{currency(value)}</div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-3 flex items-center gap-2" role="group" aria-label="Autorizar o cancelar la operación">
          <Button variant="outline" onClick={() => pushTAVI(<p>Operación cancelada.</p>)} aria-label="Cancelar">
            <X className="mr-1 h-4 w-4" /> Cancelar
          </Button>
          <Button className="TAVI-button-primary" onClick={() => authorize(value)} aria-label="Confirmar y Enviar">
            Confirmar y Enviar <Send className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </>
    );
  };

  const authorize = (value: number) => {
    if (balance < value) {
      setStep("error.insufficient");
      pushTAVI(
        <>
          <Alert className="mt-2" role="alert">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Fondos insuficientes</AlertTitle>
            <AlertDescription>
              Su saldo disponible es de <strong>{currency(balance)}</strong> y no es suficiente para enviar <strong>{currency(value)}</strong>.
            </AlertDescription>
          </Alert>
          <div className="mt-2 flex items-center gap-2" role="group" aria-label="Opciones ante fondos insuficientes">
            <Button
              className="TAVI-button-primary"
              onClick={() => {
                const available = Math.max(0, Number(balance.toFixed(2)));
                if (available <= 0) { pushTAVI(<p>No cuenta con saldo disponible para enviar.</p>); return; }
                pushUser("Enviar saldo disponible");
                reviewAndConfirm(available);
              }}
              aria-label="Enviar saldo disponible"
              disabled={balance <= 0}
            >
              Enviar saldo disponible
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                pushUser("Intentar con otro monto");
                if (recipient) { askAmount(recipient); } else if (contacts[0]) { askAmount(contacts[0]); }
              }}
              aria-label="Intentar con otro monto"
            >
              Intentar con otro monto
            </Button>
            <Button
              variant="ghost"
              onClick={() => { pushUser("Cancelar"); pushTAVI(<p>Operación cancelada.</p>); }}
              aria-label="Cancelar"
            >
              Cancelar
            </Button>
          </div>
        </>
      );
      return;
    }

    if (!online) {
      pushTAVI(
        <Alert className="mt-2" role="alert">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Sin conexión</AlertTitle>
          <AlertDescription>
            No es posible enviar mientras no haya conexión. Verifique su red e inténtelo de nuevo.
          </AlertDescription>
        </Alert>
      );
      return;
    }

    setStep("transfer.authorize");
    pushTAVI(
      <>
        <p>
          Para su seguridad, autorice la operación con su NIP.
        </p>
      </>
    );
    setTimeout(() => {
      const shouldFail = Math.random() < 0.25;
      if (shouldFail) {
        pushTAVI(
          <>
            <Alert variant="destructive" className="mt-2" role="alert">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error de red</AlertTitle>
              <AlertDescription>
                No pudimos completar la operación por un problema de conexión o tiempo de espera. Su saldo no fue afectado.
              </AlertDescription>
            </Alert>
            <div className="mt-2 flex items-center gap-2" role="group" aria-label="Opciones ante error de red">
              <Button className="TAVI-button-primary" onClick={() => authorize(value)} aria-label="Reintentar">Reintentar</Button>
              <Button variant="ghost" onClick={() => { pushUser("Cancelar"); pushTAVI(<p>Operación cancelada.</p>); }} aria-label="Cancelar">Cancelar</Button>
            </div>
          </>
        );
      } else {
        doProcess(value);
      }
    }, 700);
  };

  const doProcess = (value: number) => {
    setStep("processing");
    pushTAVI(
      <p>
        <LoaderCircle className="inline-block TAVI-spin mr-2 h-4 w-4" aria-hidden /> Procesando la transferencia de forma segura...
      </p>
    );
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setBalance((b) => Math.max(0, b - value));
      const newCEP = genCEP();
      setStep("success");
      playSuccessTone();
      setShowSuccessOverlay(true);
      setTimeout(() => setShowSuccessOverlay(false), 3000);
      pushConfirmScreen(value, newCEP);
    }, 1400);
  };

  const pushConfirmScreen = (value: number, cepVal: string) => {
    const now = new Date();
    const fecha = now.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });

    const shareReceipt = async () => {
      const text = [
        "TRANSFERENCIA EXITOSA",
        `Monto: ${currency(value)}`,
        `Para: ${recipient?.name}`,
        `Fecha y Hora: ${fecha}`,
        `Clave de Rastreo (CEP): ${cepVal}`,
        `Institución Emisora: ${BANK_NAME}`,
        `Institución Receptora: ${recipient?.bank}`,
      ].join("\n");

      try {
        const file = new File([text], `Comprobante_SPEI_${cepVal}.txt`, { type: "text/plain" });
        const navAny = navigator as any;
        if (navigator.share) {
          if (navAny.canShare?.({ files: [file] })) {
            await navigator.share({ title: "Comprobante SPEI", text: "Comprobante de transferencia", files: [file] });
            return;
          } else {
            await navigator.share({ title: "Comprobante SPEI", text });
            return;
          }
        }
      } catch {
        // noop
      }

      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Comprobante_SPEI_${cepVal}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    };

    pushTAVI(
      <div className="mt-2" role="region" aria-label="Confirmación de transferencia">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="TAVI-confirm-header">
              <div className="rounded-full bg-green-100 p-2" aria-hidden>
                <CheckCircle2 className="h-6 w-6 TAVI-success" />
              </div>
              <CardTitle className="text-xl">Transferencia exitosa</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="TAVI-confirm-amount TAVI-mono">{currency(value)} MXN</div>
            <div className="TAVI-kv text-sm TAVI-mono">
              <div className="text-muted-foreground">Para:</div>
              <div><strong>{recipient?.name}</strong></div>
              <div className="text-muted-foreground">Fecha y Hora:</div>
              <div>{fecha}</div>
              <div className="text-muted-foreground">Clave de Rastreo (CEP):</div>
              <div>{cepVal}</div>
              <div className="text-muted-foreground">Institución Emisora:</div>
              <div>{BANK_NAME}</div>
              <div className="text-muted-foreground">Institución Receptora:</div>
              <div>{recipient?.bank}</div>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              <Button className="TAVI-button-primary" onClick={shareReceipt} aria-label="Compartir comprobante">
                <Share2 className="mr-2 h-4 w-4" /> Compartir Comprobante
              </Button>
              <Button variant="outline" onClick={() => resetToWelcome()} aria-label="Realizar otra operación">
                Realizar otra operación
              </Button>
              <button className="underline text-sm" onClick={() => resetToWelcome()} aria-label="Finalizar y cerrar TAVI">
                Finalizar
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const openCollect = () => {
    pushUser("Cobrar");
    setShowNoFeeHint('qr');
    setTimeout(() => setShowNoFeeHint(null), 1900);
    pushTAVI(<CollectQR />);
  };

  const resetToWelcome = () => {
    setMessages([]);
    setRecipient(null);
    setConcept("");
    setStep("welcome");
    setAuthed(true);
    setTimeout(() => {
      pushTAVI(
        <>
          <p>¿Cómo puedo ayudarle hoy?</p>
          <QuickReplies
            options={[
              { id: "menu.send", label: "Enviar dinero" },
              { id: "menu.balance", label: "Consultar saldo" },
              { id: "menu.share", label: "Mi CLABE / QR" },
            ]}
            onPick={handleMenu}
          />
        </>
      );
      setStep("menu");
    }, 50);
  };

  const findContact = (name?: string | null) => {
    if (!name) return null;
    const n = name.toLowerCase().trim();
    return contacts.find((c) => c.name.toLowerCase().includes(n) || c.alias.toLowerCase().includes(n)) || null;
  };

  const dispatchNLU = async (res: NLUResult, userText?: string) => {
    switch (res.intent) {
      case "check_balance":
        {
          const ack = await generateReply({ userText, result: res, balance });
          pushTAVI(<p>{ack}</p>);
          pushTAVI(<p className="TAVI-mono">Su saldo actual es de <strong>{currency(balance)}</strong>.</p>);
        }
        return;
      case "collect":
        {
          const ack = await generateReply({ userText, result: res, balance });
          pushTAVI(<p>{ack}</p>);
          pushTAVI(
            <CollectQR
              initialAmount={res.amount ?? undefined}
              initialConcept={res.concept ?? undefined}
              autoGenerate={Boolean(res.amount && res.amount > 0)}
            />
          );
        }
        return;
      case "share_qr":
        {
          const ack = await generateReply({ userText, result: res, balance });
          pushTAVI(<p>{ack}</p>);
          pushTAVI(<CollectQR />);
        }
        return;
      case "send_money": {
        if (res.recipient) {
          const r = findContact(res.recipient);
          if (r) {
            setRecipient(r);
            const ack = await generateReply({ userText, result: res, balance });
            pushTAVI(<p>{ack}</p>);
            if (res.concept) setConcept(res.concept);
            askAmount(r, res.amount ?? undefined);
            return;
          }
        }
        const ack = await generateReply({ userText, result: res, balance });
        pushTAVI(<p>{ack}</p>);
        openTransfer();
        return;
      }
      case "add_contact":
        {
          const ack = await generateReply({ userText, result: res, balance });
          pushTAVI(<p>{ack}</p>);
        }
        openTransfer();
        return;
      case "help":
        {
          const ack = await generateReply({ userText, result: res, balance });
          pushTAVI(<p>{ack}</p>);
          pushTAVI(
            <div>
              <p>Puedo ayudarle con:</p>
              <ul className="list-disc ml-5">
                <li>Enviar dinero: "envía 200 a Ana por renta"</li>
                <li>Consultar saldo: "mi saldo"</li>
                <li>Cobrar con QR (CoDI®): "cobrar 300 tacos"</li>
              </ul>
            </div>
          );
        }
        return;
      case "link_dimo":
        {
          const ack = await generateReply({ userText, result: res, balance });
          pushTAVI(<p>{ack}</p>);
          openDimoLinkFlow();
        }
        return;
      default:
        const ack2 = await generateReply({ userText, result: res, balance });
        pushTAVI(<p>{ack2}</p>);
        return;
    }
  };

  const handleTextSubmit = async () => {
    const text = chatText.trim();
    if (!text) return;
    pushUser(text);
    setChatText("");
    const res = await interpret(text);
    if (!authed) {
      setPendingNLU(res);
      setStep("auth");
      pushTAVI(
        <>
          <p>Antes de continuar, autentíquese.</p>
          <QuickReplies
            options={[
              { id: "auth.pin", label: "Ingresar NIP" },
              { id: "auth.bio", label: "Usar biometría" },
            ]}
            onPick={(id) => {
              setStep("auth");
              if (id === "auth.pin") {
                pushUser("Ingresar NIP");
                startPinAuth();
              } else {
                pushUser("Usar biometría");
                startBiometricChoice();
              }
            }}
          />
        </>
      );
      return;
    }
    dispatchNLU(res, text);
  };

  // Render principal
  return (
    <div className="demo-wrapper TAVI-surface" aria-live="polite">
      <AppTopBar onOpenTAVI={() => setActiveTab('tavi')} />

      {/* Contenido según tab */}
      {activeTab !== 'tavi' ? (
        <div className="app-shell">
          {activeTab === 'inicio' ? (
            <div className="space-y-3" role="main" aria-label="Inicio">
              <BalanceCard
                balance={balance}
                hidden={hideBalance}
                onToggle={() => {
                  setHideBalance((h) => {
                    const v = !h; try { localStorage.setItem("tavi.hideBalance", JSON.stringify(v)); } catch {}
                    return v;
                  });
                }}
              />
              <div className="home-banner">
                Ingrese $1,600 más para aumentar tus ganancias al 14% anual. 🔥
              </div>
              <ActionGrid
                onDeposit={() => setDepositOpen(true)}
                onTransfer={() => { setActiveTab('tavi'); }}
                onWithdraw={() => setWithdrawOpen(true)}
                onOpenClabe={() => setClabeOpen(true)}
              />
              {showNoFeeHint && (
                <div className="flex justify-start"><div role="status" aria-live="polite" className="micro-hint micro-hint-neutral">Sin comisión</div></div>
              )}
              <CardsCarousel hidden={hideBalance} />
              <PendingList
                canPay={balance >= 4723.77}
                onPay={(amt) => { setPendingAmount(amt); setPayConfirmOpen(true); }}
              />

              {/* Modals */}
              <AmountModal
                open={depositOpen}
                mode="deposit"
                onClose={() => setDepositOpen(false)}
                onConfirm={(amt) => { setBalance((b)=> b + amt); setHomeHint("Depósito aplicado"); setTimeout(()=>setHomeHint(null), 1800); }}
              />
              <AmountModal
                open={withdrawOpen}
                mode="withdraw"
                max={balance}
                onClose={() => setWithdrawOpen(false)}
                onConfirm={(amt) => { setBalance((b)=> Math.max(0, b - amt)); setHomeHint("Retiro aplicado"); setTimeout(()=>setHomeHint(null), 1800); }}
              />
              <ClabeSheet
                open={clabeOpen}
                onClose={() => setClabeOpen(false)}
                clabe="646180000000000000"
                name="JUAN PEREZ"
                phone="1234567890"
              />

              {payConfirmOpen && (
                <>
                  <div className="modal-backdrop" role="button" tabIndex={0} aria-label="Cerrar" onClick={() => setPayConfirmOpen(false)} onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); setPayConfirmOpen(false); } }} />
                  <div className="modal-window" role="dialog" aria-modal="true" aria-labelledby="pay-title">
                    <h3 id="pay-title" className="text-lg font-semibold">Confirmar pago</h3>
                    <p className="text-sm text-muted-foreground mt-1">¿Desea pagar {pendingAmount != null ? pendingAmount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : ''}?</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Button className="TAVI-button-primary" onClick={() => {
                        const amt = pendingAmount || 0;
                        if (balance >= amt) { setBalance((b)=> b - amt); setHomeHint("Pago realizado"); setTimeout(()=>setHomeHint(null), 1800); }
                        setPayConfirmOpen(false);
                      }}>Pagar ahora</Button>
                      <Button variant="outline" onClick={() => setPayConfirmOpen(false)}>Cancelar</Button>
                    </div>
                  </div>
                </>
              )}

              {homeHint && (<div className="flex justify-center"><div className="micro-hint micro-hint-success mt-2">{homeHint}</div></div>)}
            </div>
          ) : (
            <Card className="h-fit" role="complementary" aria-label="Inicio del banco (mock)">
              <CardHeader>
                <CardTitle>{activeTab === 'cuentas' ? 'Cuentas — ' : activeTab === 'beneficios' ? 'Beneficios — ' : activeTab === 'mas' ? 'Más — ' : ''}Banco Ejemplo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">Accesos rápidos</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">Pix</Button>
                  <Button variant="outline">Transferencia</Button>
                  <Button variant="outline">Extractos</Button>
                  <Button variant="outline">Inversiones</Button>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2">
                  <Button className="TAVI-button-primary" onClick={() => setActiveTab('tavi')} aria-label="Abrir TAVI">
                    <Send className="mr-2 h-4 w-4" /> Abrir TAVI
                  </Button>
                  <Button variant="outline" onClick={() => { setShowNoFeeHint('qr'); setTimeout(()=>setShowNoFeeHint(null), 1900); }}>
                    <QrCode className="h-4 w-4 mr-2" /> Cobros <span className="brand-chip brand-codi ml-2">CoDI®</span>
                  </Button>
                </div>
                {showNoFeeHint === 'qr' && (
                  <div className="flex justify-start mt-2"><div role="status" aria-live="polite" className="micro-hint micro-hint-neutral">Sin comisión</div></div>
                )}
              </CardContent>
            </Card>
          )}
          <div />
        </div>
      ) : (
        <div className="app-shell">
          {/* Panel izquierdo: Resumen de cuenta */}
          <Card className="h-fit" role="complementary" aria-label="Resumen de cuenta">
            <CardHeader>
              <CardTitle>Cuenta de Depósito</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">Saldo disponible</div>
              <div className="text-3xl font-extrabold TAVI-mono">{currency(balance)}</div>
              <Separator />
              {/* Dimo® action */}
              <div>
                {!dimoLinked ? (
                  <Button variant="outline" onClick={() => openDimoLinkFlow(true)} aria-label="Vincular Dimo">
                    Vincular Dimo®
                  </Button>
                ) : null}
                {showDimoSuccessHint && (
                  <div className="mt-2"><div role="status" aria-live="polite" className="micro-hint micro-hint-success">Transfiere sin comisión via Dimo®</div></div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={openCollect} disabled={!online} aria-disabled={!online} title={!online ? "Sin conexión" : undefined}>
                  <QrCode className="h-4 w-4 mr-2" /> Cobrar <span className="brand-chip brand-codi ml-2">CoDI®</span>
                </Button>
                <Button variant="outline" onClick={openTransfer} disabled={!online} aria-disabled={!online} title={!online ? "Sin conexión" : undefined}>
                  <Send className="h-4 w-4 mr-2" /> Transferir <span className="brand-chip brand-dimo ml-2">via Dimo®</span>
                </Button>
              </div>
              {showNoFeeHint && (
                <div className="flex justify-start"><div role="status" aria-live="polite" className="micro-hint micro-hint-neutral">Sin comisión</div></div>
              )}
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertTitle>Seguridad</AlertTitle>
                <AlertDescription>
                  Sus operaciones con TAVI requieren autorización explícita (NIP o biometría).
                </AlertDescription>
              </Alert>
              <SelfTestPanel />
            </CardContent>
          </Card>

          {/* Panel derecho: Ventana de TAVI (chat + GUI) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img src="/logo192.png" alt="" aria-hidden className="h-5 w-5" />
                <div>
                  <div className="font-semibold">TAVI®</div>
                  <div className="text-xs text-muted-foreground">Asistente de pagos seguro</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Demo UI — v1.4</div>
            </div>

            <div className="chat-shell">
              <ScrollArea className="chat-scroll" ref={scrollRef}>
                <div className="chat-sticky-head" role="region" aria-label="Acciones rápidas">
                  <div className="flex items-center gap-2 justify-center">
                    <Button size="sm" variant="outline" onClick={openCollect} disabled={!online} aria-disabled={!online} title={!online ? "Sin conexión" : undefined}>
                      <QrCode className="h-4 w-4 mr-2" /> Cobrar con QR <span className="brand-chip brand-codi ml-2">CoDI®</span>
                    </Button>
                    <Button size="sm" variant="outline" onClick={openTransfer} disabled={!online} aria-disabled={!online} title={!online ? "Sin conexión" : undefined}>
                      <Send className="h-4 w-4 mr-2" /> Transferir <span className="brand-chip brand-dimo ml-2">via Dimo®</span>
                    </Button>
                  </div>
                  {showNoFeeHint && (
                    <div className="flex justify-center mt-2"><div role="status" aria-live="polite" className="micro-hint micro-hint-neutral">Sin comisión</div></div>
                  )}
                </div>
                <div id="main-content" ref={chatLogRef} className="pr-2" role="log" aria-live="polite" aria-relevant="additions" tabIndex={-1}>
                  {messages}
                  {processing && (
                    <ChatBubble from="TAVI">
                      <p>
                        <LoaderCircle className="inline-block TAVI-spin mr-2 h-4 w-4" aria-hidden /> Un momento, por favor...
                      </p>
                    </ChatBubble>
                  )}
                  <div ref={endRef} aria-hidden />
                </div>
              </ScrollArea>

              {/* Entrada de texto (demo) */}
              <div className="chat-input" role="group" aria-label="Entrada libre (demo)">
                <Input
                  className="flex-1"
                  placeholder="Escriba un mensaje (demo)"
                  aria-label="Mensaje"
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleTextSubmit(); }}
                />
                <Button className="TAVI-button-primary" onClick={handleTextSubmit} disabled={!chatText.trim()}>
                  Enviar
                </Button>
              </div>
            </div>

            {/* Notas de cumplimiento + disclaimer */}
            <div className="mt-3 text-xs text-muted-foreground leading-relaxed">
              <p>
                Este prototipo aplica: reducción de carga cognitiva (Ley de Miller), simplificación de decisiones (Ley de Hick), visibilidad de estado del sistema y prevención de errores.
              </p>
              <p className="mt-1">Todo el contenido está redactado en lenguaje claro y formal, con etiquetas de accesibilidad.</p>
              <p className="mt-2">
                <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="underline">Aviso de privacidad</a>
              </p>
              <p className="mt-1">Prototipo para hackatón: integra CoDI® y Dimo® sobre SPEI con fines demostrativos. No procesa operaciones reales. CoDI® y Dimo® son marcas de Banco de México.</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <BottomNav active={activeTab} onChange={(t) => setActiveTab(t)} />

      {showSuccessOverlay && (
        <div className="success-overlay" role="status" aria-live="assertive">
          <div className="success-wrap">
            <CheckCircle2 className="h-16 w-16" aria-hidden/>
            <div className="success-title mt-2">Pago exitoso</div>
            <div className="success-sub">Se ha enviado su transferencia</div>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================
// Autopruebas (básicas)
// =====================
type TestResult = { name: string; pass: boolean; details?: string };

function runSelfTests(): TestResult[] {
  const results: TestResult[] = [];

  const cep = genCEP();
  results.push({ name: "genCEP() genera 12 caracteres alfanuméricos", pass: /^[A-Z0-9]{12}$/.test(cep), details: cep });

  const formatted = currency(1000);
  results.push({ name: "currency() formatea a MXN", pass: typeof formatted === 'string' && formatted.includes('$'), details: formatted });

  const joined = ["A","B","C"].join("\n");
  results.push({ name: "join('\\n') produce saltos de línea", pass: joined.split("\n").length === 3, details: joined.replace(/\n/g, "\\n") });

  const p = buildPaymentPayload({ amount: 123.45, concept: "Tacos" });
  try {
    const pj = JSON.parse(p);
    results.push({ name: "buildPaymentPayload() estructura válida", pass: pj.amount === 123.45 && pj.currency === 'MXN' && pj.concept === 'Tacos' && typeof pj.deeplink === 'string', details: pj.deeplink });
  } catch {
    results.push({ name: "buildPaymentPayload() estructura válida", pass: false, details: "JSON inválido" });
  }

  const cep2 = genCEP();
  results.push({ name: "genCEP() produce valores distintos consecutivos", pass: cep !== cep2, details: `${cep} vs ${cep2}` });

  const p2 = buildPaymentPayload({ amount: 50, concept: "Taxi CDMX" });
  try {
    const pj2 = JSON.parse(p2);
    results.push({ name: "deeplink codifica concepto con espacios", pass: typeof pj2.deeplink === 'string' && pj2.deeplink.includes('concept=Taxi%20CDMX'), details: pj2.deeplink });
  } catch {
    results.push({ name: "deeplink codifica concepto con espacios", pass: false, details: "JSON inválido" });
  }

  const parsed = Number(String("1,000.50").replace(/[^0-9.]/g, ""));
  results.push({ name: "parser de monto ignora separadores", pass: parsed === 1000.5, details: String(parsed) });

  return results;
}

function SelfTestPanel() {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);

  useEffect(() => { if (open && !results) { setResults(runSelfTests()); } }, [open, results]);

  return (
    <Card className="mt-4" aria-label="Autopruebas del prototipo">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Autopruebas (demo)</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setOpen((o) => !o)} aria-label="Ejecutar/ocultar autopruebas">
            {open ? 'Ocultar' : 'Ejecutar'}
          </Button>
        </div>
      </CardHeader>
      {open && (
        <CardContent className="pt-0">
          <ul className="space-y-2 text-xs">
            {results?.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                {r.pass ? <CheckCircle2 className="h-4 w-4 TAVI-success" aria-hidden /> : <AlertTriangle className="h-4 w-4 TAVI-warning" aria-hidden />}
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-muted-foreground break-all">{r.details}</div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}
