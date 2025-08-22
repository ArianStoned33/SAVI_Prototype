Manual de Estándares de Experiencia de
Usuario e Interfaz (UX/UI) para SAVI®
Preámbulo: Declaración de Principios y
Obligatoriedad
Propósito y Ámbito de Aplicación
El presente documento, el "Manual de Estándares de UX/UI para SAVI®"
, establece las
especificaciones técnicas, de diseño y de experiencia de usuario de cumplimiento obligatorio
para la integración del agente conversacional de pagos, SAVI®
, en todas las aplicaciones y
plataformas digitales de las instituciones financieras que operan en los Estados Unidos
Mexicanos. El propósito fundamental de este manual es garantizar una experiencia de usuario
unificada, segura, accesible y eficiente a nivel nacional. La estandarización rigurosa aquí
prescrita tiene como objetivo primordial fomentar la confianza del público, acelerar la
adopción de los pagos digitales y eliminar la fragmentación de la experiencia que ha limitado
el potencial de iniciativas anteriores.
Fundamento Regulatorio
La creación, emisión y obligatoriedad de este manual se fundamentan en las facultades del
Banco de México para regular el buen funcionamiento de los sistemas de pago y promover el
sano desarrollo del sistema financiero, en estricto apego a la Ley para la Transparencia y
Ordenamiento de los Servicios Financieros y la Ley para Regular las Instituciones de
Tecnología Financiera (Ley Fintech).
1 Este documento constituye una norma interna del
sistema de pagos en los términos de la regulación aplicable.
2
Inspiración y Mandato de Estandarización Radical
Inspirado en los principios de estandarización radical detallados en el Anexo IV del
Reglamento de Pix del Banco Central de Brasil —cuyo éxito sin precedentes se atribuye en
gran medida a la uniformidad de la experiencia del usuario—
, este manual adopta un enfoque
inequívocamente prescriptivo.
3 Se ha identificado que la fragmentación de la experiencia del
usuario y la inconsistencia entre las implementaciones de las distintas instituciones
financieras fueron barreras significativas para la adopción masiva de sistemas previos como
CoDi en México.
7 Por lo tanto, la consistencia en la implementación de SAVI® no es una
recomendación, sino un requisito fundamental e innegociable para el éxito del ecosistema. La
estandarización es el mecanismo central para construir una marca de experiencia unificada
que genere confianza y previsibilidad en el usuario final.
Entrada en Vigor y Sanciones
Las especificaciones contenidas en este manual entrarán en vigor en la fecha estipulada en la
Circular correspondiente que emitirá el Banco de México. El incumplimiento de cualquiera de
las normas, flujos, especificaciones visuales o técnicas aquí establecidas será considerado
una violación a la normativa de sistemas de pago y será sujeto a las revisiones, auditorías y, en
su caso, sanciones previstas en la legislación y regulación aplicables.
10 Todas las instituciones
participantes están obligadas a garantizar la implementación fiel y exacta de estos
estándares.
Sección I: El Paradigma Conversacional Agéntico para
la Inclusión Financiera
1.1. Justificación del Paradigma
La elección de un paradigma conversacional agéntico sobre una interfaz gráfica de usuario
(GUI) tradicional es una decisión estratégica para abordar las barreras de inclusión financiera
en México. En un mercado con alta dependencia del efectivo, desconfianza histórica hacia la
banca digital y niveles variables de alfabetización digital, las interfaces conversacionales (CUI)
ofrecen una ruta de menor fricción para la adopción.
12 Un CUI transforma tareas financieras
complejas, como una transferencia interbancaria, en un diálogo guiado, paso a paso. Este
enfoque reduce drásticamente la carga cognitiva del usuario al no requerir que este aprenda
a navegar menús, submenús y formularios complejos.
15 La interacción se alinea con un
modelo mental universalmente comprendido: la conversación. Este principio de "revelación
progresiva" (progressive disclosure), donde la información y las opciones se presentan solo
cuando son necesarias, es fundamental para no abrumar a los usuarios novatos y construir su
confianza gradualmente.
17
El fracaso relativo de iniciativas anteriores como CoDi no se debió a una falta de
infraestructura tecnológica —el SPEI es robusto y eficiente— sino, en parte, a una
subestimación de la "última milla": la experiencia del usuario.
18 Cada institución financiera
implementó CoDi con flujos, diseños y terminología distintos, creando un ecosistema
fragmentado que requería que los usuarios aprendieran múltiples interfaces para una sola
función.
20 Esto generó confusión y erosionó la confianza. En contraste, el éxito de Pix en Brasil
demuestra que una estandarización radical y obligatoria de la UX/UI crea una utilidad pública
predecible y confiable.
3 Los usuarios aprenden a usar Pix una vez, y esa experiencia es
idéntica en cualquier aplicación. Este manual aplica esa lección fundamental al paradigma
conversacional. La estandarización conversacional de SAVI® es, por tanto, un antídoto
regulatorio directo contra la fragmentación que limitó el potencial de CoDi, asegurando que
SAVI® sea percibido no como una función de un banco específico, sino como un servicio
nacional unificado y fiable.
1.2. SAVI® como Agente, no como Chatbot
Es imperativo establecer una distinción conceptual y técnica: SAVI® no es un "chatbot"
, es un
"agente"
. Un chatbot se limita a responder preguntas y mantener diálogos informativos. Un
agente, en cambio, es un sistema diseñado para ejecutar tareas complejas y alcanzar
objetivos específicos en nombre del usuario mediante el uso de "herramientas"
.
22 SAVI® no
solo
habla sobre transferencias, sino que las ejecuta. Su arquitectura está diseñada para
orquestar flujos de trabajo financieros seguros, interactuando con los sistemas del banco (ej.
consulta de saldo, validación de cuenta) y la infraestructura de pagos nacional (ej. SPEI) para
completar una transacción de principio a fin. Esta concepción de SAVI® como un agente
ejecutor de tareas es fundamental para su propuesta de valor y para el diseño de sus
interacciones.
1.3. Principios Fundamentales de Diseño Conversacional para
Finanzas
Toda implementación de SAVI® deberá adherirse a los siguientes principios no negociables,
derivados de la investigación en Interacción Humano-Computadora (HCI) y adaptados al
contexto de alta sensibilidad de los servicios financieros.
●
●
●
●
Confianza sobre Conveniencia: En cada punto de decisión del diseño, la confianza
debe prevalecer sobre la velocidad o la conveniencia. Cada interacción, desde la
autenticación hasta la confirmación, debe estar diseñada para ser transparente, explícita
y reaseguradora. La claridad en la comunicación y la solicitud de confirmación explícita
para acciones críticas son obligatorias.
25
Guía Proactiva, no Reactiva: SAVI® no debe ser un sistema pasivo que espera
comandos. Debe guiar activamente al usuario a través de los flujos, anticipando sus
necesidades, ofreciendo las opciones más probables y previniendo errores antes de que
ocurran. Esto se alinea directamente con la Heurística de Usabilidad #5 de Nielsen:
Prevención de errores.
28 Por ejemplo, en lugar de esperar que el usuario escriba un
monto, SAVI® debe preguntar: "¿Qué monto desea enviar?"
.
Recuperación Elegante de Errores: En el contexto financiero, un error no gestionado
adecuadamente es un "destructor de confianza"
.
17 Se prohíben categóricamente las
respuestas genéricas e inútiles como "No entendí" o "Error"
. Siguiendo la Heurística #9
de Nielsen, SAVI® debe reconocer el error, diagnosticarlo en lenguaje claro para el
usuario (ej.
"Fondos insuficientes") y ofrecer rutas de recuperación constructivas e
inmediatas (ej.
"¿Desea intentar con un monto menor?").
28
Consistencia Absoluta: La personalidad, el tono de voz, la terminología, la estructura de
las frases y los flujos conversacionales de SAVI® deben ser idénticos en todas las
instituciones financieras. Esto es una aplicación directa de la Heurística #4 de Nielsen
(Consistencia y estándares) y la Ley de Jakob, que postula que los usuarios prefieren que
su sitio funcione de la misma manera que todos los otros sitios que ya conocen.
30 Al
estandarizar SAVI®
, se reduce la carga cognitiva y se acelera la curva de aprendizaje a
nivel nacional.
Sección II: Identidad y Personalidad de SAVI®
La identidad de SAVI® debe ser consistente en todos los puntos de contacto para construir
una marca nacional reconocible y confiable. Todas las instituciones financieras deberán
implementar los siguientes elementos sin modificación alguna.
2.1. Identidad Visual (Logotipo y Componentes Gráficos)
La identidad visual de SAVI® es propiedad del Banco de México y su uso está estrictamente
regulado por este manual.
●
Logotipo: Se define el logotipo oficial de SAVI®
. Su uso es obligatorio y debe ser el único
elemento gráfico que identifique el punto de entrada a la experiencia conversacional
dentro de la aplicación del participante. No podrá ser alterado, distorsionado,
re-coloreado ni modificado de ninguna manera. El archivo vectorial oficial será provisto
por el Banco de México.
●
Paleta de Colores Primaria y Secundaria: Se especifica una paleta de colores
obligatoria, definida a través de design tokens (ver Apéndice A). El uso de estos colores
es mandatorio para todos los elementos de la interfaz de SAVI®
, incluyendo burbujas de
chat, botones, enlaces y fondos. Todos los textos y componentes interactivos deben
cumplir con un ratio de contraste mínimo de 4.5:1 para texto de tamaño normal y 3:1 para
texto grande, conforme al nivel AA de las Pautas de Accesibilidad para el Contenido Web
(WCAG) 2.1.
33
●
Tipografía: Se define una única familia tipográfica, con sus pesos y tamaños
obligatorios, para todos los textos dentro de la interfaz de SAVI®
. La jerarquía visual debe
ser clara y consistente, utilizando los tokens tipográficos especificados para diferenciar
entre mensajes del sistema, respuestas del usuario y elementos interactivos.
●
Iconografía: Se proporciona un set de iconos de sistema estandarizado y de uso
exclusivo para la interfaz de SAVI®
. Esto incluye, pero no se limita a, iconos de
confirmación (check), error (cruz/alerta), advertencia, calendario y carga. El uso de
cualquier otro set de iconos está prohibido.
2.2. Personalidad y Tono de Voz
La personalidad de SAVI® es un pilar fundamental para generar confianza. Debe ser
implementada de manera consistente en cada línea de diálogo.
●
Arquetipo de Personalidad: SAVI® se define bajo el arquetipo de "El Asistente
Confiable"
. Sus atributos principales son:
○
Preciso: Comunica información de manera exacta y sin ambigüedades.
○
Servicial: Es proactivo, guía al usuario y facilita la finalización de tareas.
○
Seguro: Su lenguaje inspira confianza y tranquilidad, enfatizando la seguridad en
cada paso.
○
Respetuoso: Se dirige al usuario con formalidad ("usted") y cortesía en todo
momento.
●
Tono de Voz: El tono es consistentemente formal, pero accesible y humano. Se prohíbe
el uso de jerga bancaria, acrónimos no explicados, coloquialismos, emojis, o un lenguaje
excesivamente técnico o robótico. El objetivo es la máxima claridad y la generación de un
entorno de confianza.
25
●
Guía de Estilo de Escritura (UX Writing):
○
Claridad ante todo: Las frases deben ser cortas y directas. Se debe evitar la voz
pasiva. Por ejemplo,
"Usted está enviando $500.00" es correcto; "Un envío de
$500.00 está siendo procesado" es incorrecto.
27
○
Microcopy para la Confianza: Se prescriben textos específicos para elementos
críticos. Los botones de acción principal (Call to Action) para autorizar una
transacción deben usar verbos de acción claros como "Confirmar y Enviar"
. Los
mensajes de confirmación deben ser explícitos: "Transferencia exitosa"
. Las alertas
de seguridad deben ser directas: "Para su seguridad, autorice la operación con su
NIP"
.
Tabla 1: Matriz de Personalidad y Tono de Voz de SAVI®
Situación del
Usuario
Atributo a
Proyectar
Tono Requerido Fraseología de
Cumplimiento
Obligatorio
(Mockup Textual)
Inicio de Sesión /
Autenticación
Seguro, Preciso Formal, Directo SAVI: Para su
seguridad, por
favor autorice la
operación con su
NIP o método
biométrico.
Consulta de Saldo Preciso, Servicial Informativo, Claro SAVI: Su saldo
actual en la cuenta
[terminación de
cuenta] es de
Confirmación
Previa a
Transferencia
Error: Fondos
Insuficientes
Tiempo de Espera
/ Procesamiento
Transferencia
Exitosa
Error del Sistema /
Desconexión
Seguro, Preciso Servicial,
Respetuoso
Servicial, Seguro Preciso, Servicial Respetuoso,
Seguro
Reasegurador,
Explícito
Empático,
Resolutivo
Informativo,
Tranquilizador
Reasegurador,
Concluyente
De Alerta, Claro $[monto] MXN.
SAVI: Por favor,
confirme los datos
de la transferencia:
Destinatario:
[Nombre], Monto:
$[monto] MXN.
Total a enviar:
$[monto] MXN.
SAVI: No fue
posible realizar la
transferencia. Su
saldo actual es de
$[saldo] MXN.
¿Desea intentar con
un monto menor?
SAVI: Un momento,
por favor. Estoy
procesando la
transferencia de
forma segura.
SAVI: Transferencia
exitosa. Se han
enviado $[monto]
MXN a [Nombre].
Puede compartir el
comprobante
oficial.
SAVI: Ocurrió un
problema de
comunicación. Por
su seguridad, la
operación no fue
completada. Por
favor, intente de
nuevo en unos
minutos.
Sección III: Principios y Flujos Conversacionales de
Cumplimiento Obligatorio
Todos los flujos conversacionales de SAVI® deben ser diseñados e implementados siguiendo
estrictamente los principios de Interacción Humano-Computadora (HCI) y los flujos
prescriptivos detallados a continuación. Cualquier desviación de estos patrones está
prohibida.
3.1. Principios de Interacción (Basados en HCI)
●
●
●
●
Reducción de la Carga Cognitiva (Ley de Miller): La información debe presentarse en
fragmentos ("chunks") visual y conceptualmente distintos, con un máximo de 7 (±2)
elementos por vez. Por ejemplo, el resumen de una transacción no debe ser un párrafo
de texto, sino una lista con viñetas o ítems claramente etiquetados: Monto, Destinatario,
Concepto, Comisión, Total.
36 Esto facilita el procesamiento y la memorización de la
información crítica.
Simplificación de Decisiones (Ley de Hick): El tiempo para tomar una decisión
aumenta con el número y la complejidad de las opciones. Por lo tanto, se prohíbe
presentar al usuario menús con más de 3 o 4 opciones simultáneas. SAVI® debe guiar al
usuario a través de un camino lineal, haciendo preguntas de desambiguación para
reducir las opciones en cada paso, en lugar de presentar todas las posibilidades a la
39
vez.
Visibilidad del Estado del Sistema (Heurística de Nielsen #1): El usuario nunca debe
tener dudas sobre lo que está sucediendo. SAVI® debe comunicar de forma explícita y en
tiempo real su estado. Esto incluye mensajes como "Verificando su saldo...
"
,
"Procesando
la transferencia de forma segura...
"
,
"Un momento, por favor...
"
. La retroalimentación
constante es fundamental para mitigar la ansiedad y construir confianza en un proceso
que es inherentemente intangible.
28
Reconocimiento sobre Recuerdo (Heurística de Nielsen #6): Se debe minimizar la
carga de memoria del usuario. En lugar de exigir que el usuario recuerde y escriba el
número de cuenta o el nombre de un contacto frecuente, SAVI® debe presentar
proactivamente una lista de destinatarios recientes o frecuentes como botones de
●
respuesta rápida. El sistema debe recordar por el usuario, permitiéndole simplemente
reconocer y seleccionar.
28
Prevención de Errores (Heurística de Nielsen #5): Es mejor prevenir errores que
gestionarlos. Antes de cualquier acción con consecuencias financieras (ej. una
transferencia), SAVI® debe presentar una pantalla de confirmación clara y requerir una
acción explícita del usuario. Este principio de "fricción positiva" es una salvaguarda
deliberada para evitar acciones accidentales y costosas.
25
3.2. Flujo de Primera Interacción y Autenticación
Este flujo establece el tono de seguridad y simplicidad desde el primer contacto.
●
Mockup Textual:
SAVI: Bienvenido a SAVI, su asistente de pagos seguro. Para comenzar, necesito verificar
su identidad.
(Usuario presiona el botón)
SAVI: Por favor, ingrese el NIP o utilice su huella/rostro para continuar.
(Usuario se autentica exitosamente a través del mecanismo de la app anfitriona)
SAVI: Gracias. Su identidad ha sido verificada. ¿Cómo puedo ayudarle hoy?
●
Justificación: El flujo prioriza la seguridad desde el primer mensaje, estableciendo
confianza. Limita las opciones iniciales a las tres tareas más comunes para cumplir con la
Ley de Hick y reducir la parálisis por análisis.
40
3.3. Flujo de Transferencia Monetaria (P2P)
Este es el flujo central y su estandarización es crítica.
●
Fases Obligatorias y Secuenciales:
1.
2.
Intención: El usuario selecciona "Enviar Dinero"
.
Destinatario: SAVI: ¿A quién desea enviar dinero? SAVI® debe presentar una lista de
●
3-5 contactos frecuentes/recientes como botones de respuesta rápida, seguida de
una opción para "Buscar otro contacto"
.
3.
Monto: SAVI: ¿Qué monto desea enviar a? El usuario ingresa el monto.
4. Concepto (Opcional): SAVI: ¿Desea agregar un concepto de pago? (Opcional)
5. Confirmación: SAVI® presenta un resumen claro y desglosado ("chunked") de la
operación.
6.
Autorización: El usuario autoriza la transacción con su factor de autenticación (NIP,
biometría).
7.
Feedback Final: SAVI® muestra la pantalla de confirmación de transacción (ver
Sección IV).
Mockup Textual (Fase 5 y 6):
SAVI: Por favor, confirme los datos de la transferencia:
- Destinatario: Ana López
- Monto: $500.00 MXN
- Concepto: Comida
- Comisión: $0.00 MXN
-
**Total a enviar: $500.00 MXN**
●
(Usuario presiona "Confirmar y Enviar")
SAVI: Para su seguridad, autorice la operación con su NIP.
Justificación: El flujo es lineal y guiado. La pantalla de confirmación aplica la Ley de
Miller al desglosar la información, y el paso de autorización explícita aplica la prevención
de errores.
28
3.4. Flujo de Manejo de Errores (Fondos Insuficientes)
Este flujo es un ejemplo mandatorio de recuperación elegante de errores.
●
Mockup Textual:
(Contexto: El usuario intentó enviar $500.00 MXN pero solo tiene $350.00 MXN)
SAVI: No fue posible realizar la transferencia. Su saldo actual es de $350.00 MXN y es
insuficiente para cubrir el monto de $500.00 MXN.
SAVI: ¿Qué desea hacer?
●
Justificación: Este flujo cumple con la Heurística de Usabilidad #9 de Nielsen.
28 No solo
informa el problema en lenguaje claro ("saldo... insuficiente"), sino que diagnostica la
causa (muestra el saldo actual) y ofrece soluciones constructivas e inmediatas ("Enviar
$350.00"
,
"Intentar con otro monto"). Esto mantiene al usuario en control y reduce la
frustración, evitando que abandone el proceso.
Sección IV: La Pantalla de Confirmación de
Transacciones
Tras una autorización exitosa, SAVI® debe presentar una pantalla de confirmación final. Esta
pantalla no es conversacional; es una interfaz gráfica de usuario (GUI) estandarizada para
garantizar la máxima claridad, valor legal y consistencia a través de todo el ecosistema. Su
diseño es prescriptivo y no admite variaciones.
4.1. Estructura y Jerarquía Visual Obligatoria
El diseño de esta pantalla está optimizado para la rápida comprensión y la generación de
confianza.
●
Layout Prescriptivo (orden de lectura de arriba hacia abajo):
1.
Header: Debe contener el icono de "Éxito" (un círculo verde con una marca de
verificación blanca, provisto en el set de iconografía oficial) y el texto "Transferencia
Exitosa" en la tipografía y color de encabezado definidos en los design tokens.
2.
Monto: El monto transferido (ej.
"$500.00 MXN") debe ser el elemento con mayor
peso visual en la pantalla. Se utilizará el token de tipografía más grande y
prominente.
3.
Resumen de la Operación: Una lista de datos clave, presentada en un formato de
Etiqueta: Valor para facilitar el escaneo y aplicar el principio de "chunking" de la Ley
de Miller.
37 El orden y la nomenclatura son obligatorios:
■
■
■
■
Para:
Fecha y Hora:
■ Clave de Rastreo (CEP): [Número de Folio Alfanumérico]
Institución Emisora:
Institución Receptora:
4.
Footer de Acciones: Un área fija en la parte inferior de la pantalla que contiene tres
acciones obligatorias, presentadas en un orden y estilo visual jerárquico fijo.
4.2. Acciones Post-Confirmación
La jerarquía y el texto de los botones de acción son mandatorios.
●
Botón Primario: [Compartir Comprobante] - Este debe ser el botón más prominente
visualmente (ej. fondo de color sólido). Al presionarlo, se debe invocar la función nativa
de "compartir" del sistema operativo del dispositivo, con el comprobante oficial de la
transacción (CEP) en formato PDF o de imagen.
●
Botón Secundario: ``
- Visualmente menos prominente que el primario (ej. borde de
color, fondo transparente). Al presionarlo, el usuario regresa a la pantalla de bienvenida
de SAVI® para iniciar un nuevo flujo.
●
Botón Terciario/Texto: [Finalizar] - Presentado como un enlace de texto. Al presionarlo,
se cierra la interfaz de SAVI® y el usuario regresa a la pantalla principal de la aplicación
bancaria anfitriona.
●
Justificación: Esta jerarquía se basa en la investigación de usabilidad de flujos de
finalización de compra del Baymard Institute, que demuestra que priorizar la acción más
útil y común para el usuario post-transacción (en este caso, obtener y compartir la
prueba del pago) mejora la experiencia y la percepción de control.
44 Ofrecer "Realizar
otra operación" es un acelerador que mejora la eficiencia para usuarios expertos, en
línea con la Heurística #7 de Nielsen.
28
La estandarización de esta pantalla cumple una función crucial más allá de la usabilidad. En
un entorno digital, la falta de un "recibo" físico es una fuente de ansiedad para muchos
usuarios, especialmente aquellos que transitan desde el uso exclusivo de efectivo.
13 El
Comprobante Electrónico de Pago (CEP) del SPEI es la prueba legal y técnica de una
transacción, pero su acceso en las aplicaciones bancarias actuales suele ser poco intuitivo.
46
Al hacer de "Compartir Comprobante" la acción principal y más visible, se transforma una
simple notificación de éxito en un acto proactivo de empoderamiento. El sistema entrega al
usuario, de forma inmediata y sencilla, la prueba irrefutable de su operación. Este diseño
ataca directamente la percepción de inseguridad y la falta de tangibilidad de los pagos
digitales, construyendo confianza a nivel sistémico y proporcionando una herramienta de no
repudio al alcance de un toque.
Sección V: Accesibilidad y Cumplimiento Normativo
La inclusión financiera es un objetivo central de SAVI®
. Por lo tanto, el cumplimiento de los
más altos estándares de accesibilidad no es opcional, sino un requisito fundamental del
sistema.
5.1. Estándares WCAG 2.1 Nivel AA
Toda la interfaz de SAVI®
, tanto en sus componentes conversacionales como gráficos, debe
cumplir, como mínimo, con el nivel de conformidad AA de las Pautas de Accesibilidad para el
Contenido Web (WCAG) 2.1.
●
●
●
●
Contraste de Color (Criterio 1.4.3 y 1.4.11): Todos los componentes de texto deben
tener un ratio de contraste de al menos 4.5:1 contra su fondo. El texto grande (18pt
normal o 14pt negrita) y los componentes de la interfaz (como bordes de botones y
gráficos) deben tener un ratio de al menos 3:1.
33
Texto Alternativo (Criterio 1.1.1): Toda iconografía que transmita información y no sea
puramente decorativa debe tener una etiqueta de texto alternativo concisa y descriptiva
para ser interpretada correctamente por lectores de pantalla.
Navegación por Teclado (Criterio 2.1.1): Todas las funcionalidades interactivas,
incluyendo botones, enlaces y campos de entrada, deben ser completamente accesibles
y operables utilizando únicamente un teclado. El foco del teclado debe ser visible y
seguir un orden lógico.
Lenguaje Claro (Criterio 3.1.5): El lenguaje utilizado debe ser simple, directo y evitar la
jerga, en línea con un nivel de lectura de educación secundaria. Esto no solo beneficia a
usuarios con discapacidades cognitivas, sino a toda la base de usuarios, mejorando la
claridad y reduciendo la posibilidad de errores.
Tabla 2: Mapeo de Componentes SAVI® a Criterios WCAG 2.1 AA
Componente de la UI de
SAVI®
Criterio WCAG 2.1 Aplicable Requisito de
Implementación Obligatorio
Burbuja de Chat (SAVI®) 1.4.3 Contraste (Mínimo) El color del texto
#color.text.primary debe
tener un ratio de 4.5:1
sobre el color de fondo
#color.background.neutral.
Botón de Respuesta
Rápida
1.4.11 Contraste no textual El borde del botón debe
tener un ratio de contraste
de 3:1 con el fondo
adyacente.
Botón de Respuesta
Rápida
2.1.1 Teclado El componente debe ser
enfocable y activable
mediante las teclas Enter o
Espacio.
Icono de Éxito
(Confirmación)
1.1.1 Contenido no textual Debe incluir una etiqueta
de texto alternativo
programática, como
aria-label=
"Operación
exitosa"
.
Campo de Entrada de
Monto
3.3.2 Etiquetas o
Instrucciones
Debe tener una etiqueta
<label> asociada
programáticamente que
indique claramente su
propósito ("Monto a
enviar").
5.2. Privacidad y Manejo de Datos (Ley Fintech)
La operación de SAVI® debe cumplir rigurosamente con la Ley para Regular las Instituciones
de Tecnología Financiera, especialmente en lo que respecta al intercambio de información y la
protección de datos personales.
●
Consentimiento Explícito (Artículo 76): SAVI® debe obtener el consentimiento previo y
explícito del usuario antes de acceder o compartir cualquier dato transaccional. Este
consentimiento debe ser solicitado de forma clara y separada de otros términos y
condiciones, especificando el propósito para el cual se utilizarán los datos.
1
●
Minimización de Datos: En cada transacción, SAVI® solo solicitará y procesará los datos
que sean estrictamente necesarios para completar la operación solicitada por el usuario.
●
No se recopilarán datos para fines secundarios sin un consentimiento explícito adicional.
Transparencia: Todas las aplicaciones que integren SAVI® deben proporcionar un
acceso fácil y permanente, desde la interfaz del agente, a los avisos de privacidad
simplificado e integral que rigen el tratamiento de los datos del usuario dentro del
ecosistema SAVI®
.
Apéndice A: Catálogo de Design Tokens de SAVI®
Propósito
Este apéndice proporciona a los equipos de diseño y desarrollo una referencia técnica única,
centralizada y prescriptiva para la implementación de la identidad visual de SAVI®
. El uso de
estos design tokens garantiza una consistencia perfecta a nivel de código en todas las
implementaciones, eliminando cualquier ambigüedad. Los tokens deben ser consumidos
directamente por los sistemas de diseño y las bases de código de las instituciones.
Formato
Los tokens se presentan en un formato compatible con JSON para facilitar su integración
automatizada.
Contenido
El catálogo incluye, pero no se limita a, tokens para colores, tipografía, espaciado, radios de
borde y sombras.
Tabla 3: Catálogo de Design Tokens de SAVI® (Muestra)
Categoría Color Color Color Color Tipografía Tipografía Nombre del Token
(Sintaxis)
color.brand.primary color.background.s
urface
color.text.primary color.feedback.suc
cess
font.family.main font.size.body.md Valor #0D47A1 #FFFFFF #1A1A1A #2E7D32 '[Nombre de la
Fuente]'
, sans-serif
16px Descripción de Uso
Obligatorio
Color principal de
la marca, usado
para botones
primarios y
elementos de
énfasis.
Color de fondo
para la superficie
principal de la
interfaz de chat.
Color para todo el
texto principal del
cuerpo y
encabezados.
Cumple ratio > 4.5:1
sobre surface.
Color para indicar
estados de éxito,
como en el icono y
texto de la pantalla
de confirmación.
Familia tipográfica
obligatoria para
toda la interfaz.
Tamaño de fuente
para el cuerpo de
texto principal en
los mensajes de
SAVI®
.
Tipografía font.weight.bold 700 Peso de fuente
para texto
enfatizado, como
montos en
resúmenes y
títulos.
Espaciado spacing.inset.md 16px Padding interno
estándar para
contenedores y
burbujas de chat.
Espaciado spacing.stack.sm 8px Espacio vertical
entre elementos
apilados, como dos
mensajes
consecutivos.
Bordes border.radius.intera
ctive
8px Radio de borde
para todos los
elementos
interactivos, como
botones.
Bordes border.width.defaul
t
1px Grosor de borde
para elementos
como campos de
texto o botones
secundarios.
Sombras shadow.elevation.1 0px 2px 4px
rgba(0,0,0,0.1)
Sombra sutil para
elementos
ligeramente
elevados, como
tarjetas de
resumen.
Works cited
1. LAW TO REGULATE FINANCIAL TECHNOLOGY ...
August 14, 2025,
- Banco de México, accessed