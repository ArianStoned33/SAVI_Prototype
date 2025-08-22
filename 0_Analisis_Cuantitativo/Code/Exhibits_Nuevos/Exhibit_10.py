import numpy as np
import matplotlib.pyplot as plt

# === Toolkit de estilo “board-ready” ===
import matplotlib.pyplot as plt

PALETTE = {
    "pix": "#FFC107",     # amarillo (Pix)
    "mx": "#005B9A",      # azul (México: CoDi/DiMo)
    "grid": "#D1D5DB",    # gris claro
    "text": "#374151"     # gris texto
}

def apply_board_style(ax, title, xlabel, ylabel):
    # Título y ejes
    ax.set_title(title, fontsize=16, color=PALETTE["text"], pad=14)
    ax.set_xlabel(xlabel, fontsize=14, color=PALETTE["text"], labelpad=8)
    ax.set_ylabel(ylabel, fontsize=14, color=PALETTE["text"], labelpad=8)
    ax.tick_params(axis='both', labelsize=12, colors=PALETTE["text"])
    # Grid sutil
    ax.grid(True, axis='both', linestyle='--', color=PALETTE["grid"], alpha=0.35)
    # Limpiar bordes
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

def annotate_box(ax, text, xy, xytext, color, fontsize=11):
    ax.annotate(
        text, xy=xy, xytext=xytext,
        arrowprops=dict(arrowstyle='->', color=color, lw=1.2),
        bbox=dict(boxstyle='round,pad=0.3', fc='white', ec=color, alpha=0.9),
        fontsize=fontsize, color=color
    )

def export_fig(fig, filename_base, output_dir="output"):
    """
    Guarda la figura en formatos PNG y SVG en el directorio especificado.
    """
    import os
    # Crear directorio de salida si no existe
    os.makedirs(output_dir, exist_ok=True)
    
    # Ruta completa del archivo
    base_path = os.path.join(output_dir, filename_base)
    
    # Guardar en ambos formatos
    fig.tight_layout()
    fig.savefig(f"{base_path}.png", dpi=300, bbox_inches="tight")
    fig.savefig(f"{base_path}.svg", bbox_inches="tight")
    print(f"Gráficos guardados en: {output_dir}/")


# Datos (meses desde lanzamiento → usuarios activos en millones)
pix_months  = np.array([0, 6, 12, 24, 48])
pix_users_m = np.array([0, 67, 107, 133, 160.5])

codi_months  = np.array([0, 6, 48])      # Sep-2019 → Mar-2020 (~6m) → Sep-2023 (~48m)
codi_users_m = np.array([0, 0.11, 1.6])  # “≥1 pago” (proxy de usuario activo alguna vez)

fig, ax = plt.subplots(figsize=(12, 7))

# Pix (línea protagonista)
ax.plot(pix_months, pix_users_m, color=PALETTE["pix"], linewidth=3.5, marker='o', label="Pix (Brasil)")

# México (serie secundaria)
ax.plot(codi_months, codi_users_m, color=PALETTE["mx"], linewidth=2.5, marker='o', label="CoDi (México, ≥1 pago)")

# Estilo y ejes
apply_board_style(
    ax,
    title="Trayectorias de adopción — Pix escala en meses; México no cruza 2 M en 4 años",
    xlabel="Meses desde el lanzamiento",
    ylabel="Usuarios activos (millones)"
)
ax.set_xlim(0, 48); ax.set_ylim(0, 170)
ax.set_xticks([0, 6, 12, 24, 36, 48])

# Anotaciones clave
annotate_box(ax, "~133 M en 24 meses", xy=(24, 133), xytext=(28, 120), color=PALETTE["pix"])
annotate_box(ax, "≈160.5 M en 48 meses", xy=(48, 160.5), xytext=(33, 150), color=PALETTE["pix"])
annotate_box(ax, "~0.11 M (6 meses)\nCoDi con ≥1 pago", xy=(6, 0.11), xytext=(10, 5), color=PALETTE["mx"])
annotate_box(ax, "≤1.6 M (48 meses)\nCoDi con ≥1 pago", xy=(48, 1.6), xytext=(30, 10), color=PALETTE["mx"])

ax.legend(loc="upper left", fontsize=12)

export_fig(fig, "Exhibit_Adopcion_Trayectorias")
