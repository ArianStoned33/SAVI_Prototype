# Exhibit 9 — México (5 años): ahorros, ΔPIB y usuarios
# Reglas: matplotlib (sin seaborn), un gráfico por figura, sin especificar colores.
import matplotlib.pyplot as plt

# --------------------------- 
# Datos validados (Tabla 4)
# --------------------------- 
years = [1, 2, 3, 4, 5]
savings_usd_bn = [1.5, 3.0, 4.5, 5.5, 6.0]          # Ahorros anuales (USD bn)
delta_gdp_pct = [0.10, 0.20, 0.35, 0.45, 0.50]      # Δ PIB (%)
new_users_m = [5, 10, 14, 17, 18]                   # Nuevos individuos (millones)

foot_base = "Fuente: Tabla 4 – proyección México a 5 años (ahorros USD, ΔPIB, usuarios)."

# --------------------------- 
# Exhibit 9.1 — Ahorros anuales (USD bn) + callout acumulado
# --------------------------- 
fig1, ax1 = plt.subplots(figsize=(9, 6))
bars1 = ax1.bar(years, savings_usd_bn)

ax1.set_title("Exhibit 9.1 — Ahorros Anuales Estimados (USD miles de millones)", pad=12)
ax1.set_xlabel("Año desde el lanzamiento")
ax1.set_ylabel("Ahorro anual (USD bn)")
ax1.set_xticks(years)
ax1.set_ylim(0, max(savings_usd_bn) * 1.25)
ax1.yaxis.grid(True, linestyle="--", alpha=0.3)

for b, v in zip(bars1, savings_usd_bn):
    ax1.text(b.get_x() + b.get_width()/2, v + 0.08, f"{v:.1f}", ha="center", va="bottom", fontsize=11)

cum_savings = sum(savings_usd_bn)
ax1.annotate(f"Acumulado 5 años ≈ ${cum_savings:.1f} bn",
             xy=(5, savings_usd_bn[-1]), xytext=(3.6, max(savings_usd_bn)*0.95),
             arrowprops=dict(arrowstyle='->', lw=1),
             bbox=dict(boxstyle="round,pad=0.4", fc="white", ec="gray", lw=1), fontsize=11)

plt.figtext(0.01, 0.01, foot_base, ha="left", fontsize=9)

plt.tight_layout(rect=[0, 0.03, 1, 1])
png_91 = "/Users/arianstoned/Desktop/SAVI-Banxico/0_Analisis_Cuantitativo/Results/Nuevos/Exhibit9_1_Ahorros_Anuales_USD.png"
svg_91 = "/Users/arianstoned/Desktop/SAVI-Banxico/0_Analisis_Cuantitativo/Results/Nuevos/Exhibit9_1_Ahorros_Anuales_USD.svg"
plt.savefig(png_91, dpi=300, bbox_inches="tight")
plt.savefig(svg_91, bbox_inches="tight")


# --------------------------- 
# Exhibit 9.2 — Contribución adicional al PIB (%) + validación externa
# --------------------------- 
fig2, ax2 = plt.subplots(figsize=(9, 6))
bars2 = ax2.bar(years, delta_gdp_pct)

ax2.set_title("Exhibit 9.2 — Contribución Adicional al Crecimiento del PIB (%)", pad=12)
ax2.set_xlabel("Año desde el lanzamiento")
ax2.set_ylabel("Δ PIB (%)")
ax2.set_xticks(years)
ax2.set_ylim(0, max(delta_gdp_pct) * 1.25)
ax2.yaxis.grid(True, linestyle="--", alpha=0.3)

for b, v in zip(bars2, delta_gdp_pct):
    ax2.text(b.get_x() + b.get_width()/2, v + 0.015, f"{v:.2f}%", ha="center", va="bottom", fontsize=11)

# Validación externa (benchmark Brasil ACI/Cebr 2.08% 2026)
ax2.annotate("Benchmark Brasil (ACI/Cebr):\n≈ 2.08% del PIB (2026)",
             xy=(5, delta_gdp_pct[-1]), xytext=(3.6, max(delta_gdp_pct)*0.95),
             arrowprops=dict(arrowstyle='->', lw=1),
             bbox=dict(boxstyle="round,pad=0.4", fc="white", ec="gray", lw=1), fontsize=11)

plt.figtext(0.01, 0.01, foot_base + " Validación externa: ACI Worldwide & Cebr (2022).", ha="left", fontsize=9)

plt.tight_layout(rect=[0, 0.03, 1, 1])
png_92 = "/Users/arianstoned/Desktop/SAVI-Banxico/0_Analisis_Cuantitativo/Results/Nuevos/Exhibit9_2_Contribucion_PIB.png"
svg_92 = "/Users/arianstoned/Desktop/SAVI-Banxico/0_Analisis_Cuantitativo/Results/Nuevos/Exhibit9_2_Contribucion_PIB.svg"
plt.savefig(png_92, dpi=300, bbox_inches="tight")
plt.savefig(svg_92, bbox_inches="tight")


# --------------------------- 
# Exhibit 9.3 — Nuevos individuos (M)
# --------------------------- 
fig3, ax3 = plt.subplots(figsize=(9, 6))
bars3 = ax3.bar(years, new_users_m)

ax3.set_title("Exhibit 9.3 — Nuevos Individuos Incorporados al Sistema Financiero (Millones)", pad=12)
ax3.set_xlabel("Año desde el lanzamiento")
ax3.set_ylabel("Millones de personas")
ax3.set_xticks(years)
ax3.set_ylim(0, max(new_users_m) * 1.25)
ax3.yaxis.grid(True, linestyle="--", alpha=0.3)

for b, v in zip(bars3, new_users_m):
    ax3.text(b.get_x() + b.get_width()/2, v + 0.3, f"{v} M", ha="center", va="bottom", fontsize=11)

plt.figtext(0.01, 0.01, foot_base, ha="left", fontsize=9)

plt.tight_layout(rect=[0, 0.03, 1, 1])
png_93 = "/Users/arianstoned/Desktop/SAVI-Banxico/0_Analisis_Cuantitativo/Results/Nuevos/Exhibit9_3_Nuevos_Usuarios.png"
svg_93 = "/Users/arianstoned/Desktop/SAVI-Banxico/0_Analisis_Cuantitativo/Results/Nuevos/Exhibit9_3_Nuevos_Usuarios.svg"
plt.savefig(png_93, dpi=300, bbox_inches="tight")
plt.savefig(svg_93, bbox_inches="tight")

png_91, svg_91, png_92, svg_92, png_93, svg_93
