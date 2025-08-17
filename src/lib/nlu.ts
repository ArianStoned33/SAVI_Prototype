/*
  NLU for Spanish banking commands using Gemini with regex fallback.
  Configure API key in .env as REACT_APP_GEMINI_API_KEY and optional REACT_APP_GEMINI_MODEL.
*/

export type Intent =
  | "send_money"
  | "check_balance"
  | "collect"
  | "share_qr"
  | "add_contact"
  | "help"
  | "unknown";

export type NLUResult = {
  intent: Intent;
  recipient?: string | null;
  amount?: number | null;
  concept?: string | null;
};

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_MODEL = process.env.REACT_APP_GEMINI_MODEL || "gemini-1.5-flash";

const systemPrompt = `Eres un analizador NLU para banca en español. Extrae intención y slots de un mensaje.
Responde SOLO con JSON válido sin texto adicional.
Campos del JSON:
{
  "intent": "send_money | check_balance | collect | share_qr | add_contact | help | unknown",
  "recipient": "string|null",
  "amount": number|null,  // monto en MXN (usa punto decimal). Si no hay monto, usa null.
  "concept": "string|null" // concepto opcional del pago/cobro
}
Ejemplos:
"envía 200 a Ana" -> {"intent":"send_money","recipient":"Ana","amount":200,"concept":null}
"quiero transferir a Juan 1,500 por renta" -> {"intent":"send_money","recipient":"Juan","amount":1500,"concept":"renta"}
"mi saldo" -> {"intent":"check_balance","recipient":null,"amount":null,"concept":null}
"cobrar 300 tacos" -> {"intent":"collect","recipient":null,"amount":300,"concept":"tacos"}
"mi QR" -> {"intent":"share_qr","recipient":null,"amount":null,"concept":null}
"agregar contacto María López" -> {"intent":"add_contact","recipient":"María López","amount":null,"concept":null}
`;

export async function interpret(text: string): Promise<NLUResult> {
  const cleaned = text.trim();
  if (!cleaned) return { intent: "unknown", recipient: null, amount: null, concept: null };

  // Prefer Gemini if API key is present
  if (GEMINI_API_KEY) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        GEMINI_MODEL
      )}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
      const body = {
        systemInstruction: { role: "system", parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: cleaned }] }],
        generationConfig: { temperature: 0.2, topP: 0.9, maxOutputTokens: 200 },
      } as const;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      const textOut: string =
        json?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") || "";
      const parsed = JSON.parse(textOut);
      return normalizeResult(parsed);
    } catch (e) {
      // fall back to regex if network or parsing fails
      return regexInterpret(cleaned);
    }
  }

  return regexInterpret(cleaned);
}

function normalizeResult(o: any): NLUResult {
  const intent: Intent =
    o?.intent === "send_money" ||
    o?.intent === "check_balance" ||
    o?.intent === "collect" ||
    o?.intent === "share_qr" ||
    o?.intent === "add_contact" ||
    o?.intent === "help"
      ? o.intent
      : "unknown";
  const amount = typeof o?.amount === "number" ? o.amount : null;
  const recipient = typeof o?.recipient === "string" && o.recipient.trim() ? o.recipient.trim() : null;
  const concept = typeof o?.concept === "string" && o.concept.trim() ? o.concept.trim() : null;
  return { intent, recipient, amount, concept };
}

function parseNumber(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const s = raw
    .replace(/\$/g, "")
    .replace(/\s/g, " ")
    .replace(/\./g, ".")
    .replace(/,/g, "")
    .toLowerCase();
  // handle "2 mil", "3k"
  const mil = s.match(/(\d+(?:\.\d+)?)\s*(mil|k)\b/);
  if (mil) {
    const n = Number(mil[1]);
    if (!isNaN(n)) return Math.round(n * 1000);
  }
  const m = s.match(/(\d+(?:[\.,]\d+)?)/);
  if (m) {
    const n = Number(m[1].replace(/,/g, "."));
    return isNaN(n) ? null : n;
  }
  return null;
}

function regexInterpret(text: string): NLUResult {
  const t = text.toLowerCase();

  // Balance
  if (/\b(saldo|balance|disponible|mi saldo|cuanto tengo)\b/.test(t)) {
    return { intent: "check_balance", recipient: null, amount: null, concept: null };
  }

  // Collect/QR
  if (/\b(cobrar|generar qr|mi qr|compartir qr)\b/.test(t)) {
    const amount = parseNumber(t);
    const conceptMatch = t.match(/por\s+([^\d]+)$/i) || t.match(/concepto\s+([^.]+)/i);
    const concept = conceptMatch ? conceptMatch[1].trim() : null;
    return { intent: "collect", recipient: null, amount, concept };
  }

  // Add contact
  if (/\b(agregar|añadir|nuevo)\s+contacto\b/.test(t)) {
    const nameMatch = t.match(/contacto\s+(?:a\s+)?(.+)/);
    const recipient = nameMatch ? capitalize(nameMatch[1].trim()) : null;
    return { intent: "add_contact", recipient, amount: null, concept: null };
  }

  // Send money
  if (/\b(enviar|envia|envíar|transferir|transferencia)\b/.test(t)) {
    const amount = parseNumber(t);
    // recipient after "a" or "para"
    const recMatch = t.match(/(?:a|para)\s+([a-záéíóúñ\s.\-']+)/i);
    const recipient = recMatch ? capitalize(recMatch[1].trim()) : null;
    // concept after "por"
    const conceptMatch = t.match(/\bpor\s+([^,.;]+)/i);
    const concept = conceptMatch ? conceptMatch[1].trim() : null;
    return { intent: "send_money", recipient, amount, concept };
  }

  if (/\b(ayuda|help|qué puedes hacer|como te uso)\b/.test(t)) {
    return { intent: "help", recipient: null, amount: null, concept: null };
  }

  return { intent: "unknown", recipient: null, amount: null, concept: null };
}

function capitalize(s: string): string {
  return s
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}
