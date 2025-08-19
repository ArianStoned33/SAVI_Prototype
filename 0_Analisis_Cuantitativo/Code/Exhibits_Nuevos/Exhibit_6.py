# Exhibit 6.1 — Inclusión financiera (acumulado en millones)
# Requisitos: matplotlib; un gráfico por figura; sin colores específicos.

import matplotlib.pyplot as plt

years = [1, 2, 3, 4, 5]
new_users_m = [5, 10, 14, 17, 18]

fig1, ax1 = plt.subplots(figsize=(8, 6))
bars1 = ax1.bar(years, new_users_m)

ax1.set_title("Exhibit 6.1 — Nuevos Individuos Incorporados al Sistema Financiero\n(Acumulado en Millones)", pad=12)
ax1.set_xlabel("Año desde el lanzamiento")
ax1.set_ylabel("Millones de personas")
ax1.set_xticks(years)
ax1.set_ylim(0, 20)
ax1.yaxis.grid(True, linestyle='--', alpha=0.3)

for b, v in zip(bars1, new_users_m):
    ax1.text(b.get_x() + b.get_width()/2, v + 0.3, f"{v} M",
             ha="center", va="bottom", fontsize=11)

plt.figtext(0.01, 0.01, "Fuente: Proyección a 5 años para México (tabla interna), compilada en tus documentos.", ha="left", fontsize=9)

plt.tight_layout(rect=(0, 0.03, 1, 1))
plt.savefig("0_Analisis_Cuantitativo/Results/Nuevos/Exhibit6_1_Inclusion_Financiera_v2.png", dpi=300, bbox_inches="tight")
plt.savefig("0_Analisis_Cuantitativo/Results/Nuevos/Exhibit6_1_Inclusion_Financiera_v2.svg", bbox_inches="tight")
# plt.show()
