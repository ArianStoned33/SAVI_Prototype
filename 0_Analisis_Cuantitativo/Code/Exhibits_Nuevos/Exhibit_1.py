# Ajuste menor del eje Y izquierdo para precisión de definición ENIF
import matplotlib.pyplot as plt
import numpy as np
import os

sistemas = ["CoDi", "DiMo"]
conocimiento = np.array([38.0, 18.5])
uso = np.array([12.8, 6.8])
activacion_millones = np.array([18.6, 5.28])
conv = np.round(uso / conocimiento * 100, 1)

x = np.arange(len(sistemas))
width = 0.22

fig, ax_left = plt.subplots(figsize=(12, 7), dpi=300)

bars_con = ax_left.bar(x - width, conocimiento, width, label="Conocimiento (%)")
bars_uso = ax_left.bar(x, uso, width, label="Uso activo (≥1 vez) entre quienes conocen (%)", hatch='//', edgecolor='black')

ax_left.set_ylabel("Porcentaje (ENIF 2024)", fontsize=13)
ax_left.set_xticks(x, sistemas, fontsize=12)
ax_left.set_ylim(0, max(conocimiento.max(), uso.max()) * 1.35)
ax_left.grid(True, axis='y', linestyle='--', alpha=0.35)
ax_left.spines['top'].set_visible(False); ax_left.spines['right'].set_visible(False)

ax_right = ax_left.twinx()
bars_act = ax_right.bar(x + width, activacion_millones, width, label="Activación (proxy, millones)")
ax_right.set_ylabel("Activación (millones de usuarios/cuentas)", fontsize=13)
ax_right.set_ylim(0, activacion_millones.max() * 1.5)
ax_right.spines['top'].set_visible(False)

plt.title("Embudo de adopción: Conocimiento, Activación y Uso (México, 2024)", fontsize=16, pad=12)

def label_bars(bars, fmt="{:.1f}%"):
    for b in bars:
        val = b.get_height()
        ax = b.axes
        ax.text(b.get_x() + b.get_width()/2, val + (ax.get_ylim()[1] * 0.02),
                fmt.format(val), ha='center', va='bottom', fontsize=12)

label_bars(bars_con, "{:.1f}%")
label_bars(bars_uso, "{:.1f}%")

for b in bars_act:
    ax_right.text(b.get_x() + b.get_width()/2, b.get_height() + (ax_right.get_ylim()[1] * 0.02),
                  f"{b.get_height():.2f} M", ha='center', va='bottom', fontsize=12)

for xi, c in zip(x, conv):
    ax_left.annotate(f"Tasa de conversión: {c:.1f}%",
                     xy=(xi, uso[list(x).index(xi)]), xycoords='data',
                     xytext=(xi, ax_left.get_ylim()[1]*0.80), textcoords='data',
                     ha='center', va='center', fontsize=12,
                     bbox=dict(boxstyle='round,pad=0.3', fc='white', ec='gray', lw=1),
                     arrowprops=dict(arrowstyle='->', lw=1, connectionstyle='angle3,angleA=0,angleB=90'))

handles1, labels1 = ax_left.get_legend_handles_labels()
handles2, labels2 = ax_right.get_legend_handles_labels()
plt.legend(handles1 + handles2, labels1 + labels2, loc='upper right', fontsize=11, frameon=False)

plt.tight_layout()

png_path = "0_Analisis_Cuantitativo/Results/Nuevos/Exhibit1_Embudo_Conocimiento_Activacion_Uso.png"
svg_path = "0_Analisis_Cuantitativo/Results/Nuevos/Exhibit1_Embudo_Conocimiento_Activacion_Uso.svg"
plt.savefig(png_path, dpi=300, bbox_inches='tight')
plt.savefig(svg_path, bbox_inches='tight')

print(f"PNG guardado en: {png_path}")
print(f"SVG guardado en: {svg_path}")
