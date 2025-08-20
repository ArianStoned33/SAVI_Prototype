# Re-run the plotting code to generate the exhibit and save as PNG and SVG
import matplotlib.pyplot as plt
import numpy as np
import os

# Data
pix_months = np.array([0, 6, 12, 24, 48])
pix_users_m = np.array([0, 67, 107, 133, 160.5])

codi_months = np.array([0, 6, 48])
codi_users_m = np.array([0, 0.11, 1.6])

plt.figure(figsize=(12, 7), dpi=150)

plt.plot(pix_months, pix_users_m, marker='o', linewidth=3, color='#28A745', label='Pix (Brasil)')
plt.plot(codi_months, codi_users_m, marker='o', linewidth=2.5, color='#005B9A', label='CoDi (México, ≥1 pago)')

plt.title('Exhibit 10: Trayectorias de Adopción Divergentes – Usuarios Activos (en Millones) desde el Lanzamiento', pad=14)
plt.xlabel('Meses desde el Lanzamiento')
plt.ylabel('Usuarios Activos (Millones)')
plt.xlim(0, 48)
plt.ylim(0, 170)
plt.xticks([0, 6, 12, 24, 36, 48])
plt.grid(True, which='both', axis='both', linewidth=0.5, alpha=0.25)

plt.annotate('~133 M en 24 meses', xy=(24, 133), xytext=(28, 120),
             arrowprops=dict(arrowstyle='->', color='#28A745'),
             fontsize=10, color='#28A745', bbox=dict(boxstyle='round,pad=0.2', fc='white', ec='#28A745', alpha=0.8))

plt.annotate('≈160.5 M en 48 meses', xy=(48, 160.5), xytext=(33, 150),
             arrowprops=dict(arrowstyle='->', color='#28A745'),
             fontsize=10, color='#28A745', bbox=dict(boxstyle='round,pad=0.2', fc='white', ec='#28A745', alpha=0.8))

plt.annotate('~0.11 M (6 meses)\nCoDi con ≥1 pago', xy=(6, 0.11), xytext=(10, 5),
             arrowprops=dict(arrowstyle='->', color='#005B9A'),
             fontsize=10, color='#005B9A', bbox=dict(boxstyle='round,pad=0.2', fc='white', ec='#005B9A', alpha=0.8))

plt.annotate('≤1.6 M (48 meses)\nCoDi con ≥1 pago', xy=(48, 1.6), xytext=(30, 10),
             arrowprops=dict(arrowstyle='->', color='#005B9A'),
             fontsize=10, color='#005B9A', bbox=dict(boxstyle='round,pad=0.2', fc='white', ec='#005B9A', alpha=0.8))

footer1 = ("Brecha: Pix alcanza decenas de millones en 6–12 meses; "
           "CoDi suma ≤1.6 M en 48 meses (usuarios con ≥1 pago).")
plt.gcf().text(0.01, -0.10, footer1, fontsize=10, ha='left')

footer2 = ("Fuente: BCB, Relatório de Gestão do Pix 2023 (Gráfico 3.3.1; texto pp.21–23); "
           "FEBRABAN (nov-2024) sobre 160.5 M personas; "
           "BBVA Research (ene-2024) con datos de Banxico sobre CoDi (18.6 M cuentas validadas; 1.6 M con ≥1 pago); "
           "Banxico IAMF 2024 (pub. 2025) sobre DiMo.")
plt.gcf().text(0.5, -0.16, footer2, fontsize=8, ha='center')

plt.legend(loc='upper left')
plt.tight_layout()

# Construct absolute paths to ensure files are saved in the correct location
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, '..', '..', '..'))
results_dir = os.path.join(project_root, "0_Analisis_Cuantitativo", "Results", "Nuevos")

# Create the directory if it doesn't exist
os.makedirs(results_dir, exist_ok=True)

png_path = os.path.join(results_dir, "Exhibit10_Trayectorias_Adopcion.png")
svg_path = os.path.join(results_dir, "Exhibit10_Trayectorias_Adopcion.svg")
plt.savefig(png_path, bbox_inches='tight')
plt.savefig(svg_path, bbox_inches='tight')
print(png_path)
print(svg_path)
