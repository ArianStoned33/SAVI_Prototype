# Fix overlap in Exhibit 3 callout by anchoring the text to axes-fraction coordinates
# and moving it to the top-right; also increase spacing and clean spines.
import matplotlib.pyplot as plt
import numpy as np
import os

labels = ["Tarjeta (Agregador)", "Tarjeta (Banco)", "Pix/QR"]
values = [3.55, 2.50, 0.22]

ventas_mensuales = 200_000
tasa_alta = 0.025
tasa_baja = 0.0022
ahorro_mensual = ventas_mensuales * (tasa_alta - tasa_baja)
ahorro_anual = ahorro_mensual * 12

fig, ax = plt.subplots(figsize=(11, 6))

y_pos = np.arange(len(labels))
bars = ax.barh(y_pos, values)

# Title & axes
ax.set_title("El ‘impuesto invisible’ de la aceptación — MDR comparado por método", fontsize=16, pad=16)
ax.set_xlabel("Costo por transacción (%)", fontsize=14, labelpad=8)
ax.set_yticks(y_pos, labels=labels, fontsize=12)
ax.tick_params(axis='x', labelsize=12)

# Subtle grid & clean spines
ax.grid(True, axis='x', linestyle='--', alpha=0.35)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

# Value labels at bar end
for rect, v in zip(bars, values):
    ax.text(v + max(values)*0.02, rect.get_y() + rect.get_height()/2,
            f"{v:.2f}%", va="center", fontsize=12)

# Improved callout placement — anchor to axes fraction (top-right), arrow to Banco bar
callout_text = (f"PYME con $200,000 MXN/mes:\n"
                f"migrar de 2.5% → 0.22%\n"
                f"libera ≈ ${ahorro_mensual:,.0f} MXN/mes\n"
                f"(≈ ${ahorro_anual:,.0f} MXN/año)")

ax.annotate(
    callout_text,
    xy=(values[1], 1), xycoords='data',         # arrow target (Banco bar)
    xytext=(0.72, 0.88), textcoords='axes fraction',  # text box location (top-right, inside axes)
    ha='left', va='top', fontsize=12,
    arrowprops=dict(arrowstyle="->", lw=1.2, connectionstyle="arc3,rad=-0.2"),
    bbox=dict(boxstyle="round,pad=0.4", fc="white", ec="gray", lw=1)
)

# Limits & margins
ax.set_xlim(0, max(values)*1.28)
ax.set_ylim(-0.6, len(labels)-0.4)
plt.subplots_adjust(top=0.88)  # more room for title
fig.tight_layout()

# Export paths
try:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, '..', '..', '..'))
except NameError:
    project_root = "/mnt/data"

results_dir = os.path.join(project_root, "0_Analisis_Cuantitativo", "Results", "Nuevos")
os.makedirs(results_dir, exist_ok=True)

png_path = os.path.join(results_dir, "Exhibit3_Impuesto_Invisible_MDR_v2.png")
svg_path = os.path.join(results_dir, "Exhibit3_Impuesto_Invisible_MDR_v2.svg")
fig.savefig(png_path, dpi=300, bbox_inches="tight")
fig.savefig(svg_path, bbox_inches="tight")

# Quick download copies
png_dl = "/mnt/data/Exhibit3_Impuesto_Invisible_MDR_v2.png"
svg_dl = "/mnt/data/Exhibit3_Impuesto_Invisible_MDR_v2.svg"
fig.savefig(png_dl, dpi=300, bbox_inches="tight")
fig.savefig(svg_dl, bbox_inches="tight")

png_dl, svg_dl
