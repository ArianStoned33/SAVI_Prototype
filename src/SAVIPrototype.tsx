import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QRCodeSVG } from "qrcode.react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Fingerprint,
  LoaderCircle,
  Lock,
  QrCode,
  Search,
  Send,
  Share2,
  Smartphone,
  User,
  X,
  Plus,
  ScanFace,
} from "lucide-react";

/**
 * SAVI® — Prototipo interactivo de UI conversacional para integrar dentro de una app bancaria.
 *
 * Incluye:
 * - Autenticación por NIP (campo enmascarado, intentos, feedback) y Biometría (Huella/Face ID con animación y verificación).
 * - Selección rápida de montos, pantalla verde de éxito con sonido, y decremento de saldo.
 * - Alta de "Nuevo contacto" inline.
 * - Panel de **Autopruebas** para validar funciones clave (no modifica la UI principal).
 * - NUEVO: selector de monto basado en un componente con estado local (soluciona que no se pudiera escribir/seleccionar),
 *          flujo de **Cobro (QR)** con monto y concepto, y botones de **Transferir/Cobrar** funcionales.
 *
 * Nota: Front-end demo; no hay conexión real a SPEI.
 */

// =====================
// Design Tokens (muestra)
// =====================
const DesignTokens = () => (
  <style>{`
  :root {
    /* Colores base */
    --color-brand-primary: #0D47A1; /* color.brand.primary */
    --color-text-primary: #1A1A1A;  /* color.text.primary */
    --color-surface: #FFFFFF;       /* color.background.surface */
    --color-success: #16A34A;       /* green-600 */
    --color-warning: #B45309;       /* amber-700 */
    --color-border: #E5E7EB;

    /* Tipografía */
    --font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
    --font-size-body: 16px;         /* font.size.body.md */
    --font-weight-bold: 700;        /* font.weight.bold */

    /* Espaciado y bordes */
    --spacing-inset-md: 16px;       /* spacing.inset.md */
    --spacing-stack-sm: 8px;        /* spacing.stack.sm */
    --radius-interactive: 12px;     /* border.radius.interactive */
    --shadow-1: 0 2px 4px rgba(0,0,0,0.08); /* shadow.elevation.1 */
  }

  .savi-surface { background: var(--color-surface); color: var(--color-text-primary); }
  .savi-brand { color: var(--color-brand-primary); }
  .savi-button-primary { background: var(--color-brand-primary); color: white; }
  .savi-button-primary:focus-visible { outline: 2px solid #104E8B; outline-offset: 2px; }
  .savi-chip { border: 1px solid var(--color-border); border-radius: 999px; padding: 6px 10px; }
  .savi-chat-bubble-savi { background: #F3F7FF; border: 1px solid #DFE9FF; }
  .savi-chat-bubble-user { background: #F9FAFB; border: 1px solid #E5E7EB; }
  .savi-success { color: var(--color-success); }
  .savi-warning { color: var(--color-warning); }
  .savi-mono { font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1; }
  .savi-text-strong { color: #101010; }

  /* Animaciones */
  @keyframes spinSlow { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
  .savi-spin { animation: spinSlow 1.2s linear infinite; }
  @keyframes pulseRing { 0%{ box-shadow: 0 0 0 0 rgba(13,71,161,.3);} 70%{ box-shadow: 0 0 0 12px rgba(13,71,161,0);} 100%{ box-shadow: 0 0 0 0 rgba(13,71,161,0);} }
  .pulse { animation: pulseRing 1.2s ease-out infinite; }

  /* Accesibilidad */
  .quick-reply:focus-visible { outline: 2px solid var(--color-brand-primary); outline-offset: 2px; }

  /* Pantalla de confirmación */
  .savi-confirm-header { display:flex; align-items:center; gap:12px; }
  .savi-confirm-amount { font-size: 28px; font-weight: 800; }
  .savi-kv { display:grid; grid-template-columns: 160px 1fr; row-gap: 6px; column-gap: 12px; }

  /* Overlay de éxito (pantalla verde) */
  @keyframes overlayIn { from { opacity: 0; transform: scale(.98);} to { opacity: 1; transform: scale(1);} }
  .success-overlay { position: fixed; inset: 0; background: rgba(22,163,74,.96); color: #fff; display:flex; align-items:center; justify-content:center; z-index: 50; animation: overlayIn .2s ease-out; }
  .success-wrap { text-align:center; padding: 24px; }
  .success-title { font-size: 28px; font-weight: 800; }
  .success-sub { opacity: .95; margin-top: 6px; }

  /* Layout base del demo */
  .demo-wrapper { max-width: 1200px; margin: 0 auto; padding: 24px; }
  .app-shell { display:grid; grid-template-columns: 340px 1fr; gap: 24px; }
  .chat-shell { height: 640px; display:flex; flex-direction: column; }
  .chat-scroll { flex:1; border: 1px solid var(--color-border); border-radius: 16px; padding: 12px; }
  .chat-input { display:flex; gap: 8px; margin-top: 12px; }

  @media (max-width: 980px) { .app-shell { grid-template-columns: 1fr; } }
  `}</style>
);

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
const INITIAL_BALANCE = 3500.0; // saldo de ejemplo para error de "fondos insuficientes"
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
function AppTopBar({ onOpenSAVI }: { onOpenSAVI: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-2xl bg-white shadow-sm" role="banner">
      <div className="flex items-center gap-3">
        <Smartphone className="h-5 w-5 savi-brand" aria-hidden />
        <div className="text-sm leading-tight">
          <div className="font-semibold">{BANK_NAME}</div>
          <div className="text-xs text-muted-foreground">App bancaria — demo</div>
        </div>
      </div>
      <Button className="savi-button-primary" onClick={onOpenSAVI} aria-label="Abrir SAVI, asistente de pagos">
        <Send className="mr-2 h-4 w-4" /> Abrir SAVI
      </Button>
    </div>
  );
}

function ChatBubble({ from, children }: { from: "savi" | "user"; children: React.ReactNode }) {
  const isSAVI = from === "savi";
  return (
    <div className={`w-full flex ${isSAVI ? "justify-start" : "justify-end"} mb-2`}>
      <div
        className={`max-w-[85%] px-3 py-2 rounded-2xl text-[15px] leading-6 shadow-sm ${isSAVI ? "savi-chat-bubble-savi" : "savi-chat-bubble-user"}`}
        role="group"
        aria-label={isSAVI ? "Mensaje de SAVI" : "Mensaje del usuario"}
      >
        {children}
      </div>
    </div>
  );
}

function QuickReplies({ options, onPick }: { options: { id: string; label: string }[]; onPick: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2" role="list" aria-label="Opciones rápidas">
      {options.map((opt) => (
        <button
          key={opt.id}
          className="quick-reply savi-chip text-sm"
          onClick={() => onPick(opt.id)}
          aria-label={opt.label}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// Selector de monto con estado local para evitar el problema de inputs "congelados" en burbujas
function AmountSelector({ recipientName, initialValue = 0, onConfirm }: { recipientName?: string; initialValue?: number; onConfirm: (value: number) => void; }) {
  const [local, setLocal] = useState(initialValue ? String(initialValue) : "");
  const chips = [100, 200, 500, 1000];

  const parseValue = () => Number(String(local).replace(/[^0-9.]/g, ""));

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
          onChange={(e) => setLocal(e.target.value)}
        />
        <Button className="savi-button-primary" onClick={() => onConfirm(parseValue())} aria-label="Continuar" disabled={!(parseValue() > 0)}>
          Continuar <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2" role="list" aria-label="Montos rápidos">
        {chips.map((v) => (
          <button key={v} className="quick-reply savi-chip text-sm" onClick={() => setLocal(String(v))} aria-label={`Seleccionar ${currency(v)}`}>
            {currency(v)}
          </button>
        ))}
      </div>
    </div>
  );
}

// Flujo de cobro con QR
function CollectQR({ onClose }: { onClose?: () => void }) {
  const [amt, setAmt] = useState("");
  const [conc, setConc] = useState("");
  const [payload, setPayload] = useState<string | null>(null);

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
        <Button className="savi-button-primary" onClick={onGenerate} aria-label="Generar QR">Generar QR</Button>
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
// SAVI Agent (conversación + flujos)
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

export default function SAVIPrototype() {
  const [saviOpen, setSaviOpen] = useState(true);
  const [step, setStep] = useState<Step>("welcome");
  const [messages, setMessages] = useState<React.ReactNode[]>([]);

  // Estado de la operación
  const [authed, setAuthed] = useState(false);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [contacts, setContacts] = useState(initialContacts);
  const [recipient, setRecipient] = useState<typeof contacts[number] | null>(null);
  const [search, setSearch] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [concept, setConcept] = useState<string>("");
  const [cep, setCEP] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  // Autenticación
  const [pinInput, setPinInput] = useState("");
  const [pinAttempts, setPinAttempts] = useState(0);
  const [showNewContact, setShowNewContact] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAlias, setNewAlias] = useState("");
  const [newBank, setNewBank] = useState("");
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mensajes iniciales
    if (messages.length === 0) {
      pushSavi(
        <>
          <p className="savi-text-strong">Bienvenido a SAVI, su asistente de pagos seguro.</p>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // auto scroll
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const pushSavi = (node: React.ReactNode) => setMessages((m) => [...m, <ChatBubble from="savi">{node}</ChatBubble>]);
  const pushUser = (text: string) => setMessages((m) => [...m, <ChatBubble from="user">{text}</ChatBubble>]);

  const completeAuth = (mode: "NIP" | "Biometría") => {
    pushSavi(
      <>
        <p>
          <Lock className="inline-block mr-1 h-4 w-4" aria-hidden /> Para su seguridad, autenticando con {mode.toLowerCase()}...
        </p>
      </>
    );
    setTimeout(() => {
      setAuthed(true);
      pushSavi(
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
    }, 700);
  };

  // === Autenticación: NIP ===
  const startPinAuth = () => {
    pushSavi(
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
          <Button className="savi-button-primary" onClick={verifyPin} aria-label="Confirmar NIP">
            Confirmar
          </Button>
        </div>
      </>
    );
  };

  const verifyPin = () => {
    if (pinInput === "1234") {
      pushSavi(<p><CheckCircle2 className="inline mr-1 h-4 w-4 savi-success" aria-hidden/> NIP verificado.</p>);
      setPinAttempts(0);
      setPinInput("");
      completeAuth("NIP");
    } else {
      setPinAttempts((n) => n + 1);
      pushSavi(
        <Alert className="mt-2" role="alert">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>NIP incorrecto</AlertTitle>
          <AlertDescription>Inténtelo de nuevo. {pinAttempts + 1 >= 3 ? 'Por seguridad, use biometría o espere 30s.' : ''}</AlertDescription>
        </Alert>
      );
    }
  };

  // === Autenticación: Biometría ===
  const startBiometricChoice = () => {
    pushSavi(
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
    pushSavi(
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-full border pulse" aria-hidden>
          {mode === 'finger' ? <Fingerprint className="h-8 w-8 savi-brand"/> : <ScanFace className="h-8 w-8 savi-brand"/>}
        </div>
        <div>Coloque {mode === 'finger' ? 'su dedo en el lector' : 'su rostro frente a la cámara'}...</div>
      </div>
    );
    setTimeout(() => {
      pushSavi(
        <p><CheckCircle2 className="inline mr-1 h-4 w-4 savi-success" aria-hidden/> {mode === 'finger' ? 'Huella verificada' : 'Face ID verificado'}.</p>
      );
      completeAuth("Biometría");
    }, 1000);
  };

  const openTransfer = () => {
    setStep("transfer.pickRecipient");
    pushSavi(
      <>
        <p>¿A quién desea enviar dinero?</p>
        <QuickReplies
          options={contacts.slice(0, 5).map((c) => ({ id: c.id, label: c.name }))}
          onPick={(cid) => {
            const r = contacts.find((c) => c.id === cid) || null;
            if (r) {
              setRecipient(r);
              pushUser(r.name);
              askAmount(r);
            }
          }}
        />
        <div className="mt-3 flex items-center gap-2" role="group" aria-label="Buscar otro contacto">
          <Input
            placeholder="Buscar otro contacto (alias, nombre)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar contacto"
          />
          <Button variant="secondary" onClick={() => {
            const r = contacts.find((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.alias.toLowerCase().includes(search.toLowerCase()));
            if (r) {
              setRecipient(r);
              pushUser(r.name);
              askAmount(r);
            } else {
              pushSavi(<p>No encontré ese contacto. Intente con otro nombre o alias.</p>);
            }
          }} aria-label="Buscar">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setShowNewContact((s)=>!s)} aria-label="Nuevo contacto">
            <Plus className="h-4 w-4 mr-1"/> Nuevo contacto
          </Button>
        </div>
        {showNewContact && (
          <div className="mt-2 grid grid-cols-3 gap-2" role="group" aria-label="Agregar nuevo contacto">
            <Input placeholder="Nombre" value={newName} onChange={(e)=>setNewName(e.target.value)} aria-label="Nombre"/>
            <Input placeholder="Alias" value={newAlias} onChange={(e)=>setNewAlias(e.target.value)} aria-label="Alias"/>
            <Input placeholder="Banco" value={newBank} onChange={(e)=>setNewBank(e.target.value)} aria-label="Banco"/>
            <div className="col-span-3 flex gap-2">
              <Button className="savi-button-primary" onClick={() => {
                if(!newName.trim() || !newAlias.trim() || !newBank.trim()){ pushSavi(<p>Complete nombre, alias y banco.</p>); return;}
                const id = newName.toLowerCase().replace(/[^a-z0-9]+/g,'');
                const rec = { id, name: newName.trim(), alias: newAlias.trim(), bank: newBank.trim() } as any;
                setContacts((arr) => [...arr, rec]);
                setShowNewContact(false); setNewName(''); setNewAlias(''); setNewBank('');
                setRecipient(rec); pushUser(rec.name); askAmount(rec);
              }} aria-label="Guardar contacto">Guardar</Button>
              <Button variant="outline" onClick={() => { setShowNewContact(false); }} aria-label="Cancelar">Cancelar</Button>
            </div>
          </div>
        )}
      </>
    );
  };

  const handleMenu = (id: string) => {
    pushUser(
      id === "menu.send" ? "Enviar dinero" : id === "menu.balance" ? "Consultar saldo" : "Mi CLABE / QR"
    );

    if (id === "menu.balance") {
      pushSavi(<p className="savi-mono">Su saldo actual es de <strong>{currency(balance)}</strong>.</p>);
      return;
    }

    if (id === "menu.share") {
      pushSavi(
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

  const askAmount = (r: typeof contacts[number]) => {
    setStep("transfer.amount");
    pushSavi(
      <AmountSelector
        recipientName={r.name}
        onConfirm={(value) => {
          if (!recipient) setRecipient(r);
          if (!value || value <= 0) { pushSavi(<p>Ingrese un monto válido mayor a $0.00 MXN.</p>); return; }
          setAmount(String(value));
          askConcept(value);
        }}
      />
    );
  };

  const askConcept = (value: number) => {
    setStep("transfer.concept");
    pushSavi(
      <>
        <p>¿Desea agregar un concepto de pago? (opcional)</p>
        <div className="mt-2 flex items-center gap-2" role="group" aria-label="Agregar concepto de pago (opcional)">
          <Input
            placeholder="Ej. Comida"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            aria-label="Concepto de pago"
          />
          <Button variant="secondary" onClick={() => reviewAndConfirm(value)} aria-label="Omitir">
            Omitir
          </Button>
          <Button className="savi-button-primary" onClick={() => reviewAndConfirm(value)} aria-label="Continuar">
            Continuar <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </>
    );
  };

  const reviewAndConfirm = (value: number) => {
    setStep("transfer.confirm");
    pushSavi(
      <>
        <p className="mb-1">Por favor, confirme los datos de la transferencia:</p>
        <Card className="mt-2" aria-label="Resumen de la operación">
          <CardContent className="pt-4 text-sm savi-mono">
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
          <Button variant="outline" onClick={() => pushSavi(<p>Operación cancelada.</p>)} aria-label="Cancelar">
            <X className="mr-1 h-4 w-4" /> Cancelar
          </Button>
          <Button className="savi-button-primary" onClick={() => authorize(value)} aria-label="Confirmar y Enviar">
            Confirmar y Enviar <Send className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </>
    );
  };

  const authorize = (value: number) => {
    setStep("transfer.authorize");
    pushSavi(
      <>
        <p>
          Para su seguridad, autorice la operación con su NIP.
        </p>
      </>
    );
    // Simulación de autorización
    setTimeout(() => doProcess(value), 700);
  };

  const doProcess = (value: number) => {
    setStep("processing");
    pushSavi(
      <p>
        <LoaderCircle className="inline-block savi-spin mr-2 h-4 w-4" aria-hidden /> Procesando la transferencia de forma segura...
      </p>
    );
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setBalance((b) => Math.max(0, b - value));
      const newCEP = genCEP();
      setCEP(newCEP);
      setStep("success");
      // Sonido + overlay de éxito
      playSuccessTone();
      setShowSuccessOverlay(true);
      setTimeout(() => setShowSuccessOverlay(false), 1200);
      // Confirmación estandarizada
      pushConfirmScreen(value, newCEP);
    }, 1400);
  };

  const pushConfirmScreen = (value: number, cepVal: string) => {
    const now = new Date();
    const fecha = now.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });

    const shareReceipt = () => {
      // Genera un comprobante simple (texto) para descargar/compartir en demo
      const text = [
        "TRANSFERENCIA EXITOSA",
        `Monto: ${currency(value)}`,
        `Para: ${recipient?.name}`,
        `Fecha y Hora: ${fecha}`,
        `Clave de Rastreo (CEP): ${cepVal}`,
        `Institución Emisora: ${BANK_NAME}`,
        `Institución Receptora: ${recipient?.bank}`,
      ].join("\n");
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Comprobante_SPEI_${cepVal}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    };

    pushSavi(
      <div className="mt-2" role="region" aria-label="Confirmación de transferencia">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="savi-confirm-header">
              <div className="rounded-full bg-green-100 p-2" aria-hidden>
                <CheckCircle2 className="h-6 w-6 savi-success" />
              </div>
              <CardTitle className="text-xl">Transferencia exitosa</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="savi-confirm-amount savi-mono">{currency(value)} MXN</div>
            <div className="savi-kv text-sm savi-mono">
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
              {/* Botón Primario: Compartir Comprobante */}
              <Button className="savi-button-primary" onClick={shareReceipt} aria-label="Compartir comprobante">
                <Share2 className="mr-2 h-4 w-4" /> Compartir Comprobante
              </Button>
              {/* Botón Secundario: Realizar otra operación */}
              <Button variant="outline" onClick={() => resetToWelcome()} aria-label="Realizar otra operación">
                Realizar otra operación
              </Button>
              {/* Botón Terciario: Finalizar */}
              <button className="underline text-sm" onClick={() => setSaviOpen(false)} aria-label="Finalizar y cerrar SAVI">
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
    pushSavi(<CollectQR />);
  };

  const resetToWelcome = () => {
    // Reinicia flujo conservando saldo actual
    setMessages([]);
    setRecipient(null);
    setAmount("");
    setConcept("");
    setCEP("");
    setStep("welcome");
    setAuthed(true); // si ya se autenticó, mantenemos sesión
    // Re-hidratar conversación post-auth
    setTimeout(() => {
      pushSavi(
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

  // Render principal
  return (
    <div className="demo-wrapper savi-surface" aria-live="polite">
      <DesignTokens />

      {/* Encabezado de la app bancaria */}
      <AppTopBar onOpenSAVI={() => setSaviOpen(true)} />

      <div className="app-shell">
        {/* Panel izquierdo: Resumen de cuenta (contexto del host) */}
        <Card className="h-fit" role="complementary" aria-label="Resumen de cuenta">
          <CardHeader>
            <CardTitle>Cuenta de Depósito</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">Saldo disponible</div>
            <div className="text-3xl font-extrabold savi-mono">{currency(balance)}</div>
            <Separator />
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={openCollect}>
                <QrCode className="h-4 w-4 mr-2" /> Cobrar
              </Button>
              <Button variant="outline" onClick={openTransfer}>
                <Send className="h-4 w-4 mr-2" /> Transferir
              </Button>
            </div>
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertTitle>Seguridad</AlertTitle>
              <AlertDescription>
                Sus operaciones con SAVI requieren autorización explícita (NIP o biometría).
              </AlertDescription>
            </Alert>

            {/* Panel de autopruebas (no bloquea la UI) */}
            <SelfTestPanel />
          </CardContent>
        </Card>

        {/* Panel derecho: Ventana de SAVI (chat + GUI) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 savi-brand" aria-hidden />
              <div>
                <div className="font-semibold">SAVI®</div>
                <div className="text-xs text-muted-foreground">Asistente de pagos seguro</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">Demo UI — v1.3</div>
          </div>

          <div className="chat-shell">
            <ScrollArea className="chat-scroll" ref={scrollRef}>
              <div className="pr-2">
                {messages}
                {processing && (
                  <ChatBubble from="savi">
                    <p>
                      <LoaderCircle className="inline-block savi-spin mr-2 h-4 w-4" aria-hidden /> Un momento, por favor...
                    </p>
                  </ChatBubble>
                )}
              </div>
            </ScrollArea>

            {/* Entrada de texto (opcional para demo); en producción, SAVI guía proactivamente */}
            <div className="chat-input" role="group" aria-label="Entrada libre (demo)">
              <Input placeholder="Escriba un mensaje (demo)" aria-label="Mensaje" />
              <Button disabled>
                Enviar
              </Button>
            </div>
          </div>

          {/* Notas de cumplimiento */}
          <div className="mt-3 text-xs text-muted-foreground leading-relaxed">
            <p>
              Este prototipo aplica: reducción de carga cognitiva (Ley de Miller), simplificación de decisiones (Ley de Hick),
              visibilidad de estado del sistema y prevención de errores; además de la pantalla de confirmación prescriptiva con botón
              primario <em>Compartir Comprobante</em> y jerarquía de acciones.
            </p>
            <p className="mt-1">Todo el contenido está redactado en lenguaje claro y formal, con etiquetas de accesibilidad.</p>
          </div>
        </div>
      </div>

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

// Icono CLABE (simple) para la demo
function CreditCardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="3" y="8" width="18" height="3" fill="currentColor"/>
      <rect x="6" y="13" width="6" height="2" fill="currentColor"/>
    </svg>
  );
}

// =====================
// Autopruebas (básicas)
// =====================
type TestResult = { name: string; pass: boolean; details?: string };

function runSelfTests(): TestResult[] {
  const results: TestResult[] = [];

  // Test 1: genCEP genera 12 caracteres alfanuméricos mayúscula
  const cep = genCEP();
  results.push({
    name: "genCEP() genera 12 caracteres alfanuméricos",
    pass: /^[A-Z0-9]{12}$/.test(cep),
    details: cep,
  });

  // Test 2: currency formatea en MXN y con símbolo $
  const formatted = currency(1000);
  results.push({
    name: "currency() formatea a MXN",
    pass: typeof formatted === 'string' && formatted.includes('$'),
    details: formatted,
  });

  // Test 3: join con \n en comprobante no rompe cadenas (validación estática)
  const joined = ["A","B","C"].join("\n");
  results.push({
    name: "join('\\n') produce saltos de línea",
    pass: joined.split("\n").length === 3,
    details: joined.replace(/\n/g, "\\n"),
  });

  // Test 4: buildPaymentPayload incluye amount y concept correctos
  const p = buildPaymentPayload({ amount: 123.45, concept: "Tacos" });
  try {
    const pj = JSON.parse(p);
    results.push({
      name: "buildPaymentPayload() estructura válida",
      pass: pj.amount === 123.45 && pj.currency === 'MXN' && pj.concept === 'Tacos' && typeof pj.deeplink === 'string',
      details: pj.deeplink,
    });
  } catch {
    results.push({ name: "buildPaymentPayload() estructura válida", pass: false, details: "JSON inválido" });
  }

  // Test 5: genCEP produce valores distintos en llamadas consecutivas
  const cep2 = genCEP();
  results.push({
    name: "genCEP() produce valores distintos consecutivos",
    pass: cep !== cep2,
    details: `${cep} vs ${cep2}`,
  });

  // Test 6: deeplink codifica espacios en el concepto
  const p2 = buildPaymentPayload({ amount: 50, concept: "Taxi CDMX" });
  try {
    const pj2 = JSON.parse(p2);
    results.push({
      name: "deeplink codifica concepto con espacios",
      pass: typeof pj2.deeplink === 'string' && pj2.deeplink.includes('concept=Taxi%20CDMX'),
      details: pj2.deeplink,
    });
  } catch {
    results.push({ name: "deeplink codifica concepto con espacios", pass: false, details: "JSON inválido" });
  }

  // Test 7: parser de monto ignora separadores de miles
  const parsed = Number(String("1,000.50").replace(/[^0-9.]/g, ""));
  results.push({
    name: "parser de monto ignora separadores",
    pass: parsed === 1000.5,
    details: String(parsed),
  });

  return results;
}

function SelfTestPanel() {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);

  useEffect(() => {
    if (open && !results) {
      setResults(runSelfTests());
    }
  }, [open, results]);

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
                {r.pass ? <CheckCircle2 className="h-4 w-4 savi-success" aria-hidden /> : <AlertTriangle className="h-4 w-4 savi-warning" aria-hidden />}
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
