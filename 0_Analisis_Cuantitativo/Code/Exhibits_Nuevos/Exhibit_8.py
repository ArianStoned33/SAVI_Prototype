# -----------------------------
# Exhibit 8.1 — Ahorros anuales (USD bn) con acumulado
# -----------------------------
import matplotlib.pyplot as plt

years8 = [1, 2, 3, 4, 5]
savings_usd_bn = [1.5, 3.0, 4.5, 5.5, 6.0]  # USD bn/año
cum_savings = sum(savings_usd_bn)

fig81, ax81 = plt.subplots(figsize=(9, 6))
bars81 = ax81.bar(years8, savings_usd_bn)

ax81.set_title("Exhibit 8.1 — Ahorros Anuales Estimados (USD miles de millones)", pad=12)
ax81.set_xlabel("Año desde el lanzamiento")
ax81.set_ylabel("Ahorro anual (USD bn)")
ax81.set_xticks(years8)
ax81.set_ylim(0, max(savings_usd_bn)*1.25)
ax81.yaxis.grid(True, linestyle="--", alpha=0.3)

for b, v in zip(bars81, savings_usd_bn):
    ax81.text(b.get_x()+b.get_width()/2, v+0.08, f"{v:.1f}", ha="center", va="bottom", fontsize=11)

ax81.annotate(f"Acumulado 5 años ≈ ${cum_savings:.1f} bn",
              xy=(5, savings_usd_bn[-1]), xytext=(3.6, max(savings_usd_bn)*0.95),
              arrowprops=dict(arrowstyle="->", lw=1),
              bbox=dict(boxstyle="round,pad=0.4", fc="white", ec="gray", lw=1), fontsize=11)

plt.figtext(0.01, 0.01, "Fuente: Tabla de proyección a 5 años (ahorros anuales en USD).", ha="left", fontsize=9)

plt.tight_layout(rect=(0, 0.03, 1, 1))
plt.savefig("0_Analisis_Cuantitativo/Results/Nuevos/Exhibit8_1_Ahorros_Anuales_USD.png", dpi=300, bbox_inches="tight")
plt.savefig("0_Analisis_Cuantitativo/Results/Nuevos/Exhibit8_1_Ahorros_Anuales_USD.svg", bbox_inches="tight")
# plt.show()
# -----------------------------
# Exhibit 8.2 — Contribución adicional al PIB (%) por año
# -----------------------------
import matplotlib.pyplot as plt

years8 = [1, 2, 3, 4, 5]
delta_gdp_pct = [0.10, 0.20, 0.35, 0.45, 0.50]  # %

fig82, ax82 = plt.subplots(figsize=(9, 6))
bars82 = ax82.bar(years8, delta_gdp_pct)

ax82.set_title("Exhibit 8.2 — Contribución Adicional al Crecimiento del PIB (%)", pad=12)
ax82.set_xlabel("Año desde el lanzamiento")
ax82.set_ylabel("Δ PIB (%)")
ax82.set_xticks(years8)
ax82.set_ylim(0, max(delta_gdp_pct)*1.25)
ax82.yaxis.grid(True, linestyle="--", alpha=0.3)

for b, v in zip(bars82, delta_gdp_pct):
    ax82.text(b.get_x()+b.get_width()/2, v+0.015, f"{v:.2f}%", ha="center", va="bottom", fontsize=11)

ax82.annotate("Benchmark Brasil (ACI/Cebr):\n≈ 2.08% del PIB (2026)",
              xy=(5, delta_gdp_pct[-1]), xytext=(3.6, max(delta_gdp_pct)*0.95),
              arrowprops=dict(arrowstyle="->", lw=1),
              bbox=dict(boxstyle="round,pad=0.4", fc="white", ec="gray", lw=1), fontsize=11)

plt.figtext(0.01, 0.01, "Fuente: Tabla de proyección a 5 años (Δ PIB %). Validación: ACI Worldwide & Cebr (2024).", ha="left", fontsize=9)

plt.tight_layout(rect=(0, 0.03, 1, 1))
plt.savefig("0_Analisis_Cuantitativo/Results/Nuevos/Exhibit8_2_Contribucion_PIB.png", dpi=300, bbox_inches="tight")
plt.savefig("0_Analisis_Cuantitativo/Results/Nuevos/Exhibit8_2_Contribucion_PIB.svg", bbox_inches="tight")
# plt.show()
