# ============================
# SET DE EXHIBITS DE PROYECCIÓN (texto enriquecido)
# ============================
# Reglas: matplotlib (sin seaborn), un gráfico por figura, sin especificar colores.
import matplotlib.pyplot as plt

# --------------------------- 
# Datos validados (Tabla 4)
# --------------------------- 
years = [1, 2, 3, 4, 5]
savings_usd_bn = [1.5, 3.0, 4.5, 5.5, 6.0]          # Ahorros anuales (USD bn)
delta_gdp_pct = [0.10, 0.20, 0.35, 0.45, 0.50]      # Δ PIB (p.p. del PIB)
new_users_m = [5, 10, 14, 17, 18]                   # Nuevos individuos (millones)

# ================
# Exhibit 5.1 — Ahorros sistémicos anuales
# ================
fig1, ax1 = plt.subplots(figsize=(9, 6))
bars1 = ax1.bar(years, savings_usd_bn)

ax1.set_title("Exhibit 5.1: Proyección de Ahorros Sistémicos Anuales para México (USD miles de millones)", pad=12)
ax1.set_xlabel("Año desde el lanzamiento")
ax1.set_ylabel("Ahorro anual (USD bn)")
ax1.set_xticks(years)
ax1.set_ylim(0, max(savings_usd_bn) * 1.25)
ax1.yaxis.grid(True, linestyle="--", alpha=0.3)

for b, v in zip(bars1, savings_usd_bn):
    ax1.text(b.get_x() + b.get_width()/2, v + 0.08, f"{v:.1f}", ha="center", va="bottom", fontsize=11)

cum_savings = sum(savings_usd_bn)
ax1.annotate(f"Acumulado a 5 años ≈ ${cum_savings:.1f} bn",
             xy=(5, savings_usd_bn[-1]), xytext=(3.5, max(savings_usd_bn)*0.92),
             arrowprops=dict(arrowstyle='->', lw=1),
             bbox=dict(boxstyle="round,pad=0.4", fc="white", ec="gray", lw=1), fontsize=11)

# Pie profesional y transparente (metodología + validación)
foot_51 = (
    "Fuente: Proyección propia (Tabla 4). Metodología: aplicación de benchmarks de eficiencia de pagos instantáneos "
    "a bases macro de México (INEGI, Banxico). Validación externa de orden de magnitud: ACI Worldwide & Cebr, "
    "'Real-Time Payments — Economic Impact' (Brasil)."
)
# plt.figtext(0.01, 0.01, foot_51, ha="left", fontsize=9)

plt.tight_layout(rect=[0, 0.05, 1, 1])
plt.savefig("0_Analisis_Cuantitativo/Results/Nuevos/Exhibit5_1.png", dpi=300, bbox_inches="tight")

# ================
# Exhibit 5.2 — Contribución adicional al PIB (p.p.) - VERSIÓN CORREGIDA
# ================
fig2, ax2 = plt.subplots(figsize=(9, 6))
bars2 = ax2.bar(years, delta_gdp_pct)

ax2.set_title("Exhibit 5.2: Proyección de Contribución Adicional al PIB (p.p.)", pad=12)
ax2.set_xlabel("Año desde el lanzamiento")
ax2.set_ylabel("Δ PIB (puntos porcentuales)")
ax2.set_xticks(years)
ax2.set_ylim(0, max(delta_gdp_pct) * 1.25)
ax2.yaxis.grid(True, linestyle="--", alpha=0.3)

for b, v in zip(bars2, delta_gdp_pct):
    ax2.text(b.get_x() + b.get_width()/2, v + 0.015, f"{v:.2f} p.p.", ha="center", va="bottom", fontsize=11)

# --- INICIO DE LA MODIFICACIÓN ---
# Se han ajustado las coordenadas de xytext para bajar la caja de texto.
ax2.annotate("Validación externa (Brasil):\nACI/Cebr proyecta hasta 2.08% del PIB en 2026",
             xy=(4, delta_gdp_pct[-2]), # La flecha ahora apunta a la barra del año 4 para más espacio
             xytext=(2.5, max(delta_gdp_pct)*0.85), # Posición de la caja de texto
             arrowprops=dict(arrowstyle='->', lw=1.5, connectionstyle="arc3,rad=.2"), # Flecha más visible y curvada
             bbox=dict(boxstyle="round,pad=0.4", fc="white", ec="gray", lw=1, alpha=0.9), fontsize=11)
# --- FIN DE LA MODIFICACIÓN ---

# Se elimina el pie de foto de la imagen
# plt.figtext(...) 

plt.tight_layout()
plt.savefig("0_Analisis_Cuantitativo/Results/Nuevos/Exhibit5_2_Corregido.png", dpi=300, bbox_inches="tight")
plt.savefig("0_Analisis_Cuantitativo/Results/Nuevos/Exhibit5_2_Corregido.svg", bbox_inches="tight")
# ================
# Exhibit 5.3 — Inclusión financiera (nuevos individuos) - VERSIÓN CORREGIDA
# ================
fig3, ax3 = plt.subplots(figsize=(9, 6))
bars3 = ax3.bar(years, new_users_m)

ax3.set_title("Exhibit 5.3: Proyección de Inclusión Financiera Acelerada — Nuevos individuos (millones)", pad=12)
ax3.set_xlabel("Año desde el lanzamiento")
ax3.set_ylabel("Millones de personas")
ax3.set_xticks(years)
ax3.set_ylim(0, max(new_users_m) * 1.25)
ax3.yaxis.grid(True, linestyle="--", alpha=0.3)

for b, v in zip(bars3, new_users_m):
    ax3.text(b.get_x() + b.get_width()/2, v + 0.3, f"{v} M", ha="center", va="bottom", fontsize=11)

# --- INICIO DE LA MODIFICACIÓN ---
# Se han ajustado las coordenadas de xytext para bajar la caja de texto.
ax3.annotate("Referencia Brasil (BCB/EPC):\n71.5 M realizaron su primera\ntransferencia electrónica con Pix (a dic-2022)",
             xy=(4, new_users_m[-2]), # La flecha ahora apunta a la barra del año 4 para más espacio
             xytext=(2, max(new_users_m)*0.8), # Posición de la caja de texto
             arrowprops=dict(arrowstyle='->', lw=1.5, connectionstyle="arc3,rad=.2"), # Flecha más visible y curvada
             bbox=dict(boxstyle="round,pad=0.4", fc="white", ec="gray", lw=1, alpha=0.9), fontsize=11)
# --- FIN DE LA MODIFICACIÓN ---

# Se elimina el pie de foto de la imagen
# plt.figtext(...)

plt.tight_layout()
plt.savefig("0_Analisis_Cuantitativo/Results/Nuevos/Exhibit5_3_Corregido.png", dpi=300, bbox_inches="tight")
plt.savefig("0_Analisis_Cuantitativo/Results/Nuevos/Exhibit5_3_Corregido.svg", bbox_inches="tight")