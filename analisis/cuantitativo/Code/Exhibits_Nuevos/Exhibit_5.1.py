# Exhibit 5 — Del Ahorro al Crecimiento: Proyección del Impacto Acumulativo en el PIB de México
# Requisitos: matplotlib (sin seaborn). Un solo gráfico, un solo eje Y, barras + anotaciones.

import matplotlib.pyplot as plt

# Datos (tabla de proyección a 5 años)
years = [1, 2, 3, 4, 5]
contrib_pct = [0.10, 0.20, 0.35, 0.45, 0.50]  # en % del PIB

fig, ax = plt.subplots(figsize=(10, 6))

# Barras (sin especificar colores para mantener estilo por defecto)
bars = ax.bar([str(y) for y in years], contrib_pct)

# Títulos y ejes
ax.set_title("Exhibit 5: Del Ahorro al Crecimiento — Proyección del Impacto Acumulativo en el PIB de México")
ax.set_xlabel("Año desde el lanzamiento")
ax.set_ylabel("Contribución adicional al PIB (%)")

# Etiquetas de valor sobre cada barra
for bar, val in zip(bars, contrib_pct):
    ax.text(
        bar.get_x() + bar.get_width()/2,
        val + 0.015,
        f"{val:.2f}%",
        ha='center',
        va='bottom',
        fontsize=11
    )

# Anotación de validación externa (benchmarks Brasil/ACI–Cebr)
annotation_text = (
    "Validación externa:\n"
    "Brasil (Pix) — ACI/Cebr:\n"
    "• Hasta 2.08% del PIB (2026)\n"
    "• R$ 280.7 bn al PIB (2028)"
)
ax.annotate(
    annotation_text,
    xy=(4, contrib_pct[-1]),            # punto de referencia (borde sup. de la barra año 5)
    xytext=(4.6, 0.35),                 # posición del recuadro de texto
    arrowprops=dict(arrowstyle="->", lw=1),
    bbox=dict(boxstyle="round,pad=0.4", fc="white", ec="gray", lw=1)
)

# Rejilla sutil
ax.set_ylim(0, 0.6)
ax.yaxis.grid(True, linestyle='--', alpha=0.3)

# Pie de fuente
footnote = "Fuente: Proyección a 5 años (tabla interna); validación con ACI Worldwide & Cebr (2024) y BIS (2024)."
plt.figtext(0.01, -0.02, footnote, ha="left", fontsize=9)

plt.tight_layout()
plt.savefig("0_Analisis_Cuantitativo/Results/Nuevos/Exhibit_5_Impacto_PIB_Mexico.png", dpi=300, bbox_inches="tight")
plt.savefig("0_Analisis_Cuantitativo/Results/Nuevos/Exhibit_5_Impacto_PIB_Mexico.svg", bbox_inches="tight")  # opcional vectorial
# plt.show()
