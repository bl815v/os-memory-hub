/**
 * Módulo 5: Gestión de Memoria en Lenguajes
 */
const langData = {
	cpp: {
		title: 'C++ (Gestión Manual de Memoria)',
		details: `
• <strong>Estructuras:</strong> Stack (pila de llamadas, variables locales) y Heap (memoria dinámica).
• <strong>Asignación y Liberación:</strong> Uso explícito de <code>malloc()</code>/<code>free()</code> o <code>new</code>/<code>delete</code>.
• <strong>Punteros y Riesgos:</strong> Fugas de memoria (Memory Leaks), Punteros colgantes (Dangling Pointers) y Desbordamiento de búfer.
• <strong>Modern C++:</strong> Punteros inteligentes (<code>std::unique_ptr</code>, <code>std::shared_ptr</code>) con RAII.
    `
	},
	python: {
		title: 'Python (Gestión Automática & Conteo de Referencias)',
		details: `
• <strong>Mecanismo Principal:</strong> Conteo de referencias (Reference Counting) en CPython.
• <strong>Garbage Collector (GC):</strong> Recolector de basura por ciclos para detectar referencias circulares.
• <strong>Privilegios y Control:</strong> Módulo explícito <code>sys.getrefcount()</code> y módulo <code>gc</code> para forzar recolección.
• <strong>GIL:</strong> Global Interpreter Lock afecta la concurrencia pero simplifica la seguridad de memoria.
    `
	},
	java: {
		title: 'Java (JVM Memory Model & Recolectores)',
		details: `
• <strong>Modelo de Memoria JVM:</strong> Heap (Young Generation: Eden/Survivor, Tenured/Old Generation) y Metaspace.
• <strong>Garbage Collection (GC):</strong> Algoritmos automáticos como G1GC, ZGC y Parallel GC sin intervención manual.
• <strong>Stack vs Heap:</strong> Primitivos viven en Stack, Objetos/Instancias siempre residen en el Heap.
    `
	}
};

function renderLangDetails(langKey) {
	const container = document.getElementById('langDetails');
	const info = langData[langKey];
	if (!info) return;

	container.innerHTML = `
    <div class="card">
      <h3>${info.title}</h3>
      <div class="lang-info-content">${info.details}</div>
    </div>
  `;
}