# Generate Exhibits 3–8 as figures (PNG+SVG), using only matplotlib defaults (no custom colors).
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import FancyBboxPatch

outputs = []

# ----------------------
# Exhibit 3: Costo de Aceptación (rango con "whiskers") + mini-escenario PYME
# ----------------------
methods = ["Efectivo (costos operativos)", "Tarjeta (TPV) Débito", "Tarjeta (TPV) Crédito", "Tarjeta (Agregador)", "Modelo Pix (Comercio)"]
# Ranges as (mean, half_range) in percentage points
ranges = {
    "Efectivo (costos operativos)": ( (2+5)/2, (5-2)/2 ),
    "Tarjeta (TPV) Débito": ( (1.70+2.50)/2, (2.50-1.70)/2 ),
    "Tarjeta (TPV) Crédito": ( (1.80+2.75)/2, (2.75-1.80)/2 ),
    "Tarjeta (Agregador)": ( (3.5+3.6)/2, (3.6-3.5)/2 ),
    "Modelo Pix (Comercio)": (0.22, 0.0),
}
means = [ranges[m][0] for m in methods]
errs = [ranges[m][1] for m in methods]

fig3, ax3 = plt.subplots(figsize=(10, 6))
y_pos = np.arange(len(methods))
ax3.errorbar(means, y_pos, xerr=errs, fmt='o', capsize=6)
ax3.set_yticks(y_pos, labels=methods)
ax3.set_xlabel("Costo por transacción (%)")
ax3.set_title("Exhibit 3: El 'Impuesto Invisible' de la Aceptación de Pagos vs. Modelo de Bajo Costo")

# Mini-escenario PYME: ventas mensuales $200,000 MXN, pasar de 2.5% a 0.22%
ventas_mensuales = 200_000
tasa_alta = 0.025
tasa_pix = 0.0022
ahorro_mensual = ventas_mensuales * (tasa_alta - tasa_pix)
ahorro_anual = ahorro_mensual * 12
scenario_text = (
    f"Escenario PYME (ventas mensuales $200,000 MXN):\n"
    f"Ahorro al migrar de 2.5% a 0.22% ≈ ${ahorro_mensual:,.0f} MXN/mes\n"
    f"(≈ ${ahorro_anual:,.0f} MXN/año)"
)
ax3.text(0.98, -0.35, scenario_text, ha="right", va="top", fontsize=10, transform=ax3.transAxes,
         bbox=dict(boxstyle="round,pad=0.4", fc="white", ec="black", lw=1))

foot3 = ("Fuente: 'Impacto Económico de Pix en Brasil' (Tabla de costos comparativos y tasas promedio); "
         "Banxico (tasas de descuento), valores compilados en tus documentos.")
ax3.text(0.01, -0.18, foot3, ha="left", va="top", fontsize=9, transform=ax3.transAxes)

png3 = "0_Analisis_Cuantitativo/Results/Nuevos/Exhibit3_Costo_Aceptacion.png"
svg3 = "0_Analisis_Cuantitativo/Results/Nuevos/Exhibit3_Costo_Aceptacion.svg"
fig3.tight_layout()
fig3.savefig(png3, dpi=300, bbox_inches="tight")
fig3.savefig(svg3, bbox_inches="tight")
outputs.append((png3, svg3))

# ----------------------
# Exhibit 4: Dividendo Digital ya materializado (callout + proyección 2030)
# ----------------------
fig4, ax4 = plt.subplots(figsize=(10, 6))
ax4.axis("off")

# Big callout for USD 21 bn (2020–jun 2025)
ax4.text(0.5, 0.78, "Exhibit 4: Dividendo Digital Ya Materializado", ha="center", va="center", fontsize=18, weight="bold")
box1 = FancyBboxPatch((0.10, 0.48), 0.80, 0.20, boxstyle="round,pad=0.6,rounding_size=16", ec="black", fc="white", lw=1.2)
ax4.add_patch(box1)
ax4.text(0.5, 0.58, "$21 Mil Millones USD", ha="center", va="center", fontsize=28, weight="bold")
ax4.text(0.5, 0.50, "Ahorro acumulado 2020–jun 2025 (MBC)", ha="center", va="center", fontsize=12)

# Smaller callout for 2030 projection
box2 = FancyBboxPatch((0.15, 0.25), 0.70, 0.16, boxstyle="round,pad=0.5,rounding_size=12", ec="black", fc="white", lw=1.0)
ax4.add_patch(box2)
ax4.text(0.50, 0.32, "Proyección 2030: R$40.1 Mil Millones / año", ha="center", va="center", fontsize=14)
ax4.text(0.50, 0.27, "(Ahorro anual estimado por MBC)", ha="center", va="center", fontsize=11)

foot4 = ("Fuente: Movimento Brasil Competitivo (MBC), 2025; cifras compiladas en tus documentos.")
ax4.text(0.02, 0.08, foot4, ha="left", va="center", fontsize=10)

png4 = "0_Analisis_Cuantitativo/Results/Nuevos/Exhibit4_Dividendo_Digital.png"
svg4 = "0_Analisis_Cuantitativo/Results/Nuevos/Exhibit4_Dividendo_Digital.svg"
fig4.savefig(png4, dpi=300, bbox_inches="tight")
fig4.savefig(svg4, bbox_inches="tight")
outputs.append((png4, svg4))

