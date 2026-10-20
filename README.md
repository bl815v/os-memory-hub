# OS Memory Hub

**OS Memory Hub** es una aplicación web interactiva y modular diseñada para simular, visualizar y comprender los conceptos fundamentales de la **Gestión de Memoria en Sistemas Operativos**.

---

## Guía de Módulos

### 1. Reemplazo de Páginas (Paginación)

Simula cómo el sistema operativo administra los marcos de memoria RAM frente a ráfagas de referencias de aplicaciones o páginas.

* **Uso:** Ingresa el número de marcos disponibles y las secuencias de referencias (apps) con sus correspondientes horarios.
* **Algoritmos evaluados:**
  * **FIFO (First-In, First-Out):** Reemplaza la página que ingresó primero a la memoria.
  * **LRU (Least Recently Used):** Reemplaza la página que lleva más tiempo sin ser consultada.
  * **OPT (Óptimo):** Reemplaza la página que tardará más tiempo en volver a ser consultada en el futuro.
* **Métrica:** Genera una tabla paso a paso resaltando cada *Recarga / Fallo de Página* (*Page Fault*).

---

### 2. Jerarquía de Memoria & Calculadora EAT

Calcula el **Tiempo Promedio de Acceso Efectivo (Effective Access Time - EAT)** utilizando la analogía de la cocina (hacer arepas: Mesa, Nevera, Tienda) o componentes reales de hardware (Caché, RAM, Disco).

* **Uso:** Modifica la tasa de aciertos (*Hit Rate*) en la Nevera/RAM y personaliza los tiempos de acceso de cada nivel en segundos.
* **Fórmula aplicada:**
  $$\text{EAT} = (h \times t_{\text{RAM}}) + ((1 - h) \times t_{\text{Disco}})$$
  *(donde $h$ es el porcentaje de aciertos expresado en decimal)*.

---

### 3. Asignación Contigua de Memoria

Permite experimentar con la asignación y liberación dinámica de bloques de memoria contigua en RAM.

* **Estrategias disponibles:**
  * **First-Fit:** Asigna el proceso en el primer hueco con espacio suficiente.
  * **Best-Fit:** Busca y asigna en el hueco que mejor se ajuste (deja el sobrante más pequeño).
  * **Worst-Fit:** Asigna en el hueco más grande disponible (deja el sobrante más grande).
* **Operaciones:** Puedes agregar procesos por tamaño (KB), liberarlos por nombre o **Compactar** para eliminar la fragmentación externa agrupando el espacio libre al final.

---

### 4. Intérprete & Debugger Paso a Paso (.txt)

Permite cargar o redactar scripts en un lenguaje de comandos sencillo (DSL) y ejecutarlos en un depurador gráfico línea por línea.

* **Controles del Debugger:**
  * **Cargar en Debugger:** Procesa el script e inicializa el trazado.
  * **Siguiente / Anterior:** Avanza o retrocede instrucción por instrucción en el tiempo.
  * **Reiniciar:** Vuelve al estado inicial antes de ejecutar cualquier comando.

---

### 5. Gestión de Memoria en Lenguajes de Programación

Panel conceptual e interactivo para comparar cómo administran la memoria los entornos de ejecución modernos:

* **C++:** Gestión manual mediante punteros, asignación en Stack vs Heap (`malloc`/`free`, `new`/`delete`) y riesgos como *Memory Leaks*.
* **Python:** Gestión automática basada en *Conteo de Referencias* y *Garbage Collector (GC)* por ciclos en CPython.
* **Java:** Modelo de memoria de la JVM (Generación Young/Old en Heap, Metaspace) y algoritmos automáticos de recolección de basura (*G1GC*, *ZGC*).

---

## Diccionario de Comandos DSL (Scripts .txt)

El módulo de scripts reconoce las siguientes palabras clave para simular la asignación de memoria:

| Comando | Sintaxis / Ejemplo | Descripción |
| :--- | :--- | :--- |
| `MEMORIA` | `MEMORIA 2100` | Define el tamaño total de la memoria RAM en Kilobytes (KB) y limpia el estado anterior. |
| `ESTRATEGIA` | `ESTRATEGIA FIRST`<br>`ESTRATEGIA BEST`<br>`ESTRATEGIA WORST` | Establece el criterio de búsqueda de huecos para las asignaciones posteriores. |
| `ASIGNAR` | `ASIGNAR P1 212` | Intenta ubicar un proceso nombrado (ej: `P1`) de un tamaño específico en KB según la estrategia activa. |
| `LIBERAR` | `LIBERAR P1` | Marca las particiones ocupadas por el proceso indicado como bloques libres. |
| `COMPACTAR` | `COMPACTAR` | Desfragmenta la memoria desplazando todos los procesos ocupados hacia el inicio y unificando el espacio libre al final. |
| `#` | `# Esto es un comentario` | Las líneas que inician con el símbolo numeral son ignoradas por el intérprete. |

---

## Estructura del Proyecto

```text
os-memory-hub/
│
├── index.html           # Estructura principal y paneles
├── styles.css           # Estilos visuales y gráficos
├── README.md            # Manual de usuario e instructivo
│
└── js/
    ├── interpreter.js   # Parser y trazador del DSL de scripts
    ├── app.js           # Controlador principal de interfaz y eventos
    └── modules/
        ├── paginacion.js # Módulo 1
        ├── jerarquia.js  # Módulo 2
        ├── asignacion.js # Módulo 3
        ├── scripts.js    # Módulo 4
        └── lenguajes.js  # Módulo 5
