# Cambios de TAVI (shell + CoDI/Dimo)

Este archivo documenta los cambios aplicados:

- Nuevo componente: `src/TAVIApp.tsx`
  - Integra shell bancario con tabs inferiores (Inicio, Cuentas, Pagos, TAVI).
  - Dentro de TAVI: botones con chips de marca para CoDI® y Dimo®.
  - Flujo de vinculación Dimo® (no persistente) y envío a contactos mock.
  - Micro‑hints efímeros “Sin comisión” y “Transfiere sin comisión via Dimo®”.
  - Disclaimer legal en el pie.
- `src/App.tsx` ahora monta `TAVIApp`.
- `src/lib/nlu.ts` reconoce sinónimos de CoDI y un intent `link_dimo` para “vincular dimo”.
- `src/index.css` agrega animación y estilos para `.micro-hint*`.
- `src/App.test.tsx` actualizado para validar presencia de la UI.

Para ejecutar:
- npm ci
- npm start

Pruebas (opcional):
- npm test -- src/App.test.tsx
