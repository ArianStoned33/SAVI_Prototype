# Exhibit 7 — Scorecard Estratégica (anclada en BIS/World Bank), con círculos de estado
# Requisitos: matplotlib; un gráfico por figura; se usan colores explícitos porque el usuario lo pidió.

import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from matplotlib.lines import Line2D
import numpy as np

# Pilares (según marco BIS: user focus, infrastructure, rules, governance) adaptados a 5 filas operativas
pillars = [
    "1) Mandato regulatorio\n(participación obligatoria)",
    "2) UX estandarizada y\nmarca única",
    "3) Modelo de costo pro-escala\n(P2P gratis / comercios bajo costo)",
    "4) Gobernanza centralizada\n(operador de ecosistema)",
    "5) Interoperabilidad y\napertura del ecosistema"
]

countries = ["Brasil (Pix)", "México (CoDi/DiMo)"]

# Codificación de estado por país/pilar: 'green' = cumplido, 'yellow' = parcial, 'red' = no cumplido
status_brazil = ["green", "green", "green", "green", "green"]
status_mexico = ["red", "yellow", "green", "green", "yellow"]  # ver justificación en nota de pie

# Render del scorecard como tabla con círculos
rows = len(pillars)
cols = 3  # Pilar | Brasil | México
fig, ax = plt.subplots(figsize=(10, 6))

# Layout de celdas
cell_h = 1.0
cell_w = 1.0
table_height = rows * cell_h
table_width = 3 * cell_w

# Dibujar fondo y celdas
ax.add_patch(Rectangle((0, 0), table_width, table_height, fill=False, edgecolor="black", linewidth=1.2))

# Líneas horizontales
for r in range(1, rows):
    ax.add_line(Line2D([0, table_width], [r*cell_h, r*cell_h], color="black", linewidth=0.6))

# Líneas verticales
ax.add_line(Line2D([cell_w, cell_w], [0, table_height], color="black", linewidth=0.6))
ax.add_line(Line2D([2*cell_w, 2*cell_w], [0, table_height], color="black", linewidth=0.6))

# Encabezados
ax.text(0.5*cell_w, table_height + 0.2, "Pilar estratégico", ha="center", va="bottom", fontsize=12, weight="bold")
ax.text(1.5*cell_w, table_height + 0.2, countries[0], ha="center", va="bottom", fontsize=12, weight="bold")
ax.text(2.5*cell_w, table_height + 0.2, countries[1], ha="center", va="bottom", fontsize=12, weight="bold")

# Pilares y círculos de estado
for i, p in enumerate(pillars):
    y = table_height - (i + 0.5) * cell_h
    # Pilar
    ax.text(0.05, y, p, ha="left", va="center", fontsize=11)
    # Brasil
    ax.scatter(1.5*cell_w, y, s=500, c=status_brazil[i], edgecolors="black", linewidth=0.6)
    # México
    ax.scatter(2.5*cell_w, y, s=500, c=status_mexico[i], edgecolors="black", linewidth=0.6)

# Título
ax.set_title("Exhibit 7 — Scorecard de los Pilares Estratégicos para la Adopción Masiva", pad=16, fontsize=14)

# Leyenda manual con círculos
legend_y = -0.45
ax.scatter(0.0, legend_y, s=300, c="green", edgecolors="black", linewidth=0.6, transform=ax.transAxes, clip_on=False)
ax.text(0.03, legend_y, "Cumplido", transform=ax.transAxes, va="center", fontsize=10)
ax.scatter(0.22, legend_y, s=300, c="yellow", edgecolors="black", linewidth=0.6, transform=ax.transAxes, clip_on=False)
ax.text(0.25, legend_y, "Parcial", transform=ax.transAxes, va="center", fontsize=10)
ax.scatter(0.41, legend_y, s=300, c="red", edgecolors="black", linewidth=0.6, transform=ax.transAxes, clip_on=False)
ax.text(0.44, legend_y, "No cumplido", transform=ax.transAxes, va="center", fontsize=10)

# Notas de pie (citas y justificación breve)
footnote = (
    "Marco de referencia: BIS Quarterly Review (Mar-2024) 'Fast payments: design and adoption' — "
    "cuatro grupos de diseño (user focus, infrastructure, rules, governance) y evidencia de mayor adopción "
    "con propiedad del banco central, más casos de uso y participación de no-bancos.\n"
    "Validación Pix: mandato de grandes bancos y rol dual del BCB; costos a comercios ~0.22% (BIS Bulletin 52, 2022; BIS QR 2024).\n"
    "CoDi/DiMo: 'sin comisiones' (Banxico/CoDi); gobernanza centralizada (Banxico); interoperabilidad a nivel de infraestructura (SPEI) — "
    "apertura competitiva parcial."
)
plt.figtext(0.01, -0.12, footnote, ha="left", fontsize=9)

# Estilo general
ax.set_xlim(0, table_width)
ax.set_ylim(-0.6, table_height + 0.6)
ax.axis("off")

plt.tight_layout()
png_path = "0_Analisis_Cuantitativo/Results/Nuevos/Exhibit7_Scorecard_Estrategica.png"
svg_path = "0_Analisis_Cuantitativo/Results/Nuevos/Exhibit7_Scorecard_Estrategica.svg"
plt.savefig(png_path, dpi=300, bbox_inches="tight")
plt.savefig(svg_path, bbox_inches="tight")
