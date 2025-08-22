# Exhibit 4 — Scorecard Estratégica (anclada en BIS/World Bank), con círculos de estado
# VERSIÓN MEJORADA Y PULIDA

import matplotlib.pyplot as plt
import numpy as np

# --- DATOS Y CONFIGURACIÓN ---
pillars = [
    "1) Mandato regulatorio\n(Participación y UX obligatoria)", # Texto ajustado para precisión
    "2) UX estandarizada y\nmarca única",
    "3) Modelo de costo pro-escala\n(P2P gratis / comercios bajo costo)",
    "4) Gobernanza centralizada\n(Operador de ecosistema)",
    "5) Interoperabilidad y\napertura del ecosistema"
]

countries = ["Brasil (Pix)", "México (CoDi/DiMo)"]

# Estado actualizado para mayor precisión (Mandato en MX es Parcial)
status_brazil = ["green", "green", "green", "green", "green"]
status_mexico = ["yellow", "yellow", "green", "green", "yellow"] 

# Colores para los círculos
colors = {'green': '#28A745', 'yellow': '#FFD700', 'red': '#DC3545'}

# --- CREACIÓN DEL GRÁFICO ---
fig, ax = plt.subplots(figsize=(12, 7))
ax.axis('off')

# Título del Exhibit
ax.set_title("Exhibit 4 — Scorecard de los Pilares Estratégicos para la Adopción Masiva", 
             pad=20, fontsize=16, weight='bold')

# --- CREACIÓN DE LA TABLA ---
table_data = []
for i, pillar in enumerate(pillars):
    # Añadimos placeholders que reemplazaremos con círculos
    table_data.append([pillar, f'circle_{status_brazil[i]}', f'circle_{status_mexico[i]}'])

# Encabezados de la tabla
column_labels = ["Pilar Estratégico", countries[0], countries[1]]

# Crear la tabla
table = ax.table(cellText=table_data,
                 colLabels=column_labels,
                 cellLoc='center',
                 loc='center')

# --- ESTILO DE LA TABLA (EL TOQUE PROFESIONAL) ---
table.auto_set_font_size(False)
table.set_fontsize(11)
table.scale(1, 2.5) # Ajusta la altura de las celdas

# Estilo de las celdas y reemplazo de placeholders con círculos
for (i, j), cell in table.get_celld().items():
    cell.set_edgecolor('lightgray')
    cell.set_linewidth(0.8)
    
    # Encabezados
    if i == 0:
        cell.set_text_props(weight='bold', color='black')
        cell.set_facecolor('#F0F0F0') # Fondo gris claro para encabezados
    # Celdas de pilares
    elif j == 0:
        cell.set_text_props(ha='left')
        cell.PAD = 0.1
    # Celdas de estado (círculos)
    else:
        text = cell.get_text().get_text()
        if 'circle' in text:
            color_key = text.split('_')[1]
            cell.set_text_props(text='') # Borramos el texto placeholder
            # Dibujamos el círculo en el centro de la celda
            center_x, center_y = cell.get_x() + cell.get_width()/2, cell.get_y() + cell.get_height()/2
            circle = plt.Circle((center_x, center_y), radius=0.08, 
                                color=colors[color_key], 
                                transform=fig.transFigure.inverted().transform_bbox(cell.get_bbox()),
                                ec='black', lw=0.6)
            ax.add_patch(circle)

# --- LEYENDA (INTEGRADA Y LIMPIA) ---
legend_elements = [plt.scatter([], [], s=150, color=colors['green'], ec='black', lw=0.6, label='Cumplido'),
                   plt.scatter([], [], s=150, color=colors['yellow'], ec='black', lw=0.6, label='Parcial'),
                   plt.scatter([], [], s=150, color=colors['red'], ec='black', lw=0.6, label='No cumplido')]

ax.legend(handles=legend_elements, 
          loc='lower center', 
          bbox_to_anchor=(0.5, -0.15), # Posición debajo de la tabla
          ncol=3, frameon=False, fontsize=11)

plt.tight_layout()
# (Deja tus rutas de guardado originales aquí)
# plt.savefig("Exhibit4_Scorecard_Estrategica_Mejorada.png", dpi=300, bbox_inches="tight")
# plt.savefig("Exhibit4_Scorecard_Estrategica_Mejorada.svg", bbox_inches="tight")