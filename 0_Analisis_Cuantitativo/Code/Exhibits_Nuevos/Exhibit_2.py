# Exhibit 2 (alternativa) — “Brecha de órdenes de magnitud” (versión mejorada)
# Diseño: Barras horizontales a la misma escala (0–280 M), números grandes, ratio 23× en el centro.
# Reglas: matplotlib puro, 1 gráfico por figura, sin seaborn. No se insertan pies de fuente en la imagen.

import matplotlib.pyplot as plt
import numpy as np
import os
from math import floor

# ---------------------------
# Datos (millones de transacciones)
# ---------------------------
codi_total_m = 11.9     # CoDi acumuladas (2019–1T 2024)
pix_day_m    = 276.7    # Pix en un día (6 jun 2025)

labels = ["CoDi — acumulado (2019–1T 2024)", "Pix — en 1 día (6 jun 2025)"]
values = [codi_total_m, pix_day_m]

ratio = pix_day_m / codi_total_m

# ---------------------------
# Gráfico
# ---------------------------
fig, ax = plt.subplots(figsize=(11, 6))

y = np.arange(len(labels))
bars = ax.barh(y, values)

# Título narrativo y ejes
ax.set_title("Brecha de órdenes de magnitud — Pix en 1 día vs CoDi histórico (México)", fontsize=18, pad=16)
ax.set_xlabel("Transacciones (millones)", fontsize=14, labelpad=10)
ax.set_yticks(y, labels, fontsize=13)
ax.tick_params(axis='x', labelsize=13)

# Rango común 0–~280 M
ax.set_xlim(0, max(values)*1.05)

# Grid sutil y limpieza
ax.grid(True, axis='x', linestyle='--', alpha=0.35)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

# Etiquetas grandes al final de cada barra
for rect, v in zip(bars, values):
    ax.text(v + max(values)*0.02, rect.get_y() + rect.get_height()/2, f"{v:,.1f} M",
            va="center", fontsize=16)

# Callout central de la brecha (anclado a fracción de ejes)
ax.text(0.5, 0.15, f"≈ {ratio:.0f}×", transform=ax.transAxes,
        ha="center", va="center", fontsize=28, weight="bold",
        bbox=dict(boxstyle="round,pad=0.4", fc="white", ec="gray", lw=1))

fig.tight_layout()

# ---------------------------
# Exportación (patrón de tu proyecto + copias en /mnt/data)
# ---------------------------
try:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, '..', '..', '..'))
except NameError:
    project_root = "/mnt/data"

results_dir = os.path.join(project_root, "0_Analisis_Cuantitativo", "Results", "Nuevos")
os.makedirs(results_dir, exist_ok=True)

png_path = os.path.join(results_dir, "Exhibit2_alt_Brecha_Ordenes_Magnitud_v2.png")
svg_path = os.path.join(results_dir, "Exhibit2_alt_Brecha_Ordenes_Magnitud_v2.svg")
fig.savefig(png_path, dpi=300, bbox_inches="tight")
fig.savefig(svg_path, bbox_inches="tight")

# Copias para descarga inmediata
png_dl = "/mnt/data/Exhibit2_alt_Brecha_Ordenes_Magnitud_v2.png"
svg_dl = "/mnt/data/Exhibit2_alt_Brecha_Ordenes_Magnitud_v2.svg"
fig.savefig(png_dl, dpi=300, bbox_inches="tight")
fig.savefig(svg_dl, bbox_inches="tight")

png_dl, svg_dl, ratio
