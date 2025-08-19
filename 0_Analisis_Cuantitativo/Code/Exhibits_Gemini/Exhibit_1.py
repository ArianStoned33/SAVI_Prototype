# Generate Exhibit 1 chart as specified by the user
import matplotlib.pyplot as plt

# Data (from ENIF 2024 per user's provided document)
labels = ["CoDi", "DiMo"]
conocimiento = [38.0, 18.5]
uso = [12.8, 6.8]
conversion = [33.7, 36.7]  # Uso / Conocimiento (%)

x = range(len(labels))
width = 0.36

fig, ax = plt.subplots(figsize=(10, 6))

# Bars
bars1 = ax.bar([i - width/2 for i in x], conocimiento, width, label="Conocimiento", color="#003366")
bars2 = ax.bar([i + width/2 for i in x], uso, width, label="Uso Activo (≥1 vez)", color="#ADD8E6", hatch='//', edgecolor="#003366")

# Annotate bar values
def annotate_bars(bars):
    for b in bars:
        height = b.get_height()
        ax.text(b.get_x() + b.get_width()/2, height + 1, f"{height:.1f}%", ha='center', va='bottom', fontsize=11)

annotate_bars(bars1)
annotate_bars(bars2)

# Conversion callouts above each group
for i, conv in enumerate(conversion):
    group_center = i
    ax.text(group_center, max(conocimiento[i], uso[i]) + 7,
            f"Tasa de Conversión: {conv:.1f}%",
            ha='center', va='bottom', fontsize=12,
            bbox=dict(facecolor='white', edgecolor='#003366', boxstyle='round,pad=0.3'))

# Axis formatting
ax.set_title("Exhibit 1: La Paradoja de la Adopción – Abismo entre Conocimiento y Uso (México, 2024)", fontsize=14, pad=12)
ax.set_ylabel("% de la población adulta", fontsize=12)
ax.set_xticks(list(x))
ax.set_xticklabels(labels, fontsize=12)
ax.set_ylim(0, 60)
ax.legend(loc="upper right", frameon=False)

# Footnote
footnote = ("Fuente: ENIF 2024 (INEGI–CNBV); cifras citadas del documento provisto por el usuario "
            "“Análisis Adopción CoDi y Dimo”, Tabla 1. Definición: Tasa de conversión = Uso / Conocimiento.")
plt.figtext(0.01, 0.01, footnote, ha="left", va="bottom", fontsize=9)

plt.tight_layout(rect=(0, 0.04, 1, 1))

png_path = "0_Analisis_Cuantitativo/Results/Originales/Exhibit1_Paradoja_Adopcion_CoDi_DiMo.png"
svg_path = "0_Analisis_Cuantitativo/Results/Originales/Exhibit1_Paradoja_Adopcion_CoDi_DiMo.svg"
plt.savefig(png_path, dpi=300, bbox_inches="tight")
plt.savefig(svg_path, bbox_inches="tight")

png_path, svg_path
