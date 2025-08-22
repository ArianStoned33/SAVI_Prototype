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

# ----------------------
# Exhibit 5: PIB – % y valor (dos ejes, puntos/columna)
# ----------------------
years = [2026, 2028]
pib_pct = [2.08, None]  # % del PIB (proyección ACI) en 2026
pib_val_brl = [None, 280.7]  # BRL bn 2028

fig5, ax5 = plt.subplots(figsize=(10, 6))
ax5.set_title("Exhibit 5: Del Ahorro al Crecimiento – Contribución Proyectada al PIB de Brasil")
ax5.set_xlabel("Año")

# Plot % PIB as scatter
ax5b = ax5.twinx()
ax5.set_xlim(2025.5, 2028.5)
ax5.set_xticks([2026, 2028])
# Bars for BRL value (only 2028)
ax5.bar([2028], [280.7], width=0.6)
ax5.set_ylabel("Aporte al PIB (R$ miles de millones)")
# Points for % of GDP (only 2026)
ax5b.plot([2026], [2.08], marker="o")
ax5b.set_ylabel("Contribución (% del PIB)")

# Annotate points
ax5b.annotate("2.08% del PIB (ACI, 2026)", xy=(2026, 2.08), xytext=(2026.1, 2.2),
              arrowprops=dict(arrowstyle="->"))
ax5.annotate("R$280.7 bn (ACI, 2028)", xy=(2028, 280.7), xytext=(2027.6, 310),
             arrowprops=dict(arrowstyle="->"))

foot5 = ("Fuente: ACI Worldwide/Cebr (proyección %PIB 2026 y R$280.7 bn en 2028); "
         "compilado en tus documentos.")
ax5.text(0.01, -0.18, foot5, ha="left", va="top", fontsize=9, transform=ax5.transAxes)

png5 = "0_Analisis_Cuantitativo/Results/Nuevos/Exhibit5_PIB_Contribucion.png"
svg5 = "0_Analisis_Cuantitativo/Results/Nuevos/Exhibit5_PIB_Contribucion.svg"
fig5.tight_layout()
fig5.savefig(png5, dpi=300, bbox_inches="tight")
fig5.savefig(svg5, bbox_inches="tight")
outputs.append((png5, svg5))

# ----------------------
# Exhibit 6: Inclusión (nuevos usuarios) + Reducción de informalidad
# ----------------------
years6 = np.array([1, 2, 3, 4, 5])
new_users_m = np.array([5, 10, 14, 17, 18])
informality_delta = np.array([-0.5, -1.0, -1.8, -2.5, -3.0])

fig6, ax6 = plt.subplots(figsize=(10, 6))
width = 0.6
ax6.bar(years6, new_users_m, width=width)
ax6.set_xlabel("Año desde el lanzamiento")
ax6.set_ylabel("Nuevos individuos en el sistema financiero (millones)")
ax6.set_title("Exhibit 6: Inclusión y Formalización – Trayectoria a 5 Años (México)")

# Secondary axis for informality reduction
ax6b = ax6.twinx()
ax6b.plot(years6, informality_delta, marker="o")
ax6b.set_ylabel("Reducción de la economía informal (% del PIB)")

# Label balloons for new users
for x, y in zip(years6, new_users_m):
    ax6.annotate(f"{y} M", xy=(x, y), xytext=(x, y + 0.8), ha="center",
                 arrowprops=dict(arrowstyle="-"))

foot6 = ("Fuente: Tabla de proyección a 5 años para México (Ahorros, usuarios e informalidad) – "
         "compilada en tus documentos.")
ax6.text(0.01, -0.18, foot6, ha="left", va="top", fontsize=9, transform=ax6.transAxes)

png6 = "0_Analisis_Cuantitativo/Results/Nuevos/Exhibit6_Inclusion_Formalizacion.png"
svg6 = "0_Analisis_Cuantitativo/Results/Nuevos/Exhibit6_Inclusion_Formalizacion.svg"
fig6.tight_layout()
fig6.savefig(png6, dpi=300, bbox_inches="tight")
fig6.savefig(svg6, bbox_inches="tight")
outputs.append((png6, svg6))

# ----------------------
# Exhibit 7: Scorecard – Mandato, UX, Marca, Pricing, G2P (BRA vs MEX)
# ----------------------
rows = ["Mandato regulatorio (participación obligatoria)", "UX estandarizada y marca única", 
        "Pricing (P2P gratis; comercios ~0.22%)", "Despliegue G2P masivo catalizador", 
        "Ecosistema interoperable y abierto"]
cols = ["Brasil (Pix)", "México (CoDi/DiMo)"]
status = [
    ["✔︎", "✖︎"],
    ["✔︎", "✖︎"],
    ["✔︎", "✖︎"],
    ["✔︎", "◼︎"],  # limitado / parcial
    ["✔︎", "✖︎"],
]

fig7, ax7 = plt.subplots(figsize=(10, 6))
ax7.axis("off")
ax7.set_title("Exhibit 7: Mandato vs. Voluntarismo – Los Pilares que Determinan la Escala", pad=20)

# Create table
table_data = [[rows[i]] + status[i] for i in range(len(rows))]
the_table = plt.table(cellText=table_data,
                      colLabels=["Pilar", cols[0], cols[1]],
                      loc="center",
                      cellLoc="left",
                      colLoc="left")
the_table.auto_set_font_size(False)
the_table.set_fontsize(11)
the_table.scale(1, 1.4)

foot7 = ("Fuente: Síntesis cualitativa basada en los documentos (mandato Pix; UX/branding unificados; "
         "costo medio Pix ~0.22%; adopción G2P/auxilios; interoperabilidad).")
ax7.text(0.02, 0.04, foot7, ha="left", va="bottom", fontsize=9, transform=ax7.transAxes)

png7 = "0_Analisis_Cuantitativo/Results/Nuevos/Exhibit7_Scorecard_Mandato_vs_Voluntarismo.png"
svg7 = "0_Analisis_Cuantitativo/Results/Nuevos/Exhibit7_Scorecard_Manduntarismo.svg"
fig7.savefig(png7, dpi=300, bbox_inches="tight")
fig7.savefig(svg7, bbox_inches="tight")
outputs.append((png7, svg7))

# ----------------------
# Exhibit 8: Caso de Negocio MX (5 años): Ahorro USD + ΔPIB + Etiquetas de usuarios
# ----------------------
years8 = np.array([1, 2, 3, 4, 5])
savings_usd_bn = np.array([1.5, 3.0, 4.5, 5.5, 6.0])
delta_gdp_pct = np.array([0.10, 0.20, 0.35, 0.45, 0.50])
new_users8_m = np.array([5, 10, 14, 17, 18])

fig8, ax8 = plt.subplots(figsize=(10, 6))
ax8.bar(years8, savings_usd_bn, width=0.6)
ax8.set_xlabel("Año desde el lanzamiento")
ax8.set_ylabel("Ahorro anual (USD miles de millones)")
ax8.set_title("Exhibit 8: Caso de Negocio en México – Ahorros, Crecimiento y Usuarios (5 años)")

ax8b = ax8.twinx()
ax8b.plot(years8, delta_gdp_pct, marker="o")
ax8b.set_ylabel("Contribución adicional al crecimiento del PIB (%)")

for x, y, u in zip(years8, savings_usd_bn, new_users8_m):
    ax8.annotate(f"{u} M", xy=(x, y), xytext=(x, y + 0.3), ha="center",
                 arrowprops=dict(arrowstyle="-"))

foot8 = ("Fuente: Tabla 4 (proyección México a 5 años) – ahorros anuales (USD), ΔPIB (%), "
         "nuevos usuarios acumulados.")
ax8.text(0.01, -0.18, foot8, ha="left", va="top", fontsize=9, transform=ax8.transAxes)

png8 = "0_Analisis_Cuantitativo/Results/Nuevos/Exhibit8_Caso_MX_5anios.png"
svg8 = "0_Analisis_Cuantitativo/Results/Nuevos/Exhibit8_Caso_MX_5anios.svg"
fig8.tight_layout()
fig8.savefig(png8, dpi=300, bbox_inches="tight")
fig8.savefig(svg8, bbox_inches="tight")
outputs.append((png8, svg8))

outputs
