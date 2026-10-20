/**
 * Módulo 2: Jerarquía de Memoria (EAT Flexible)
 */
function calculateEAT(hitRatePercent, tMesa, tNevera, tTienda) {
	const h = hitRatePercent / 100;
	const miss = 1 - h;
	const eat = (h * tNevera) + (miss * tTienda);
	return { eat, hitRatePercent, missPercent: (miss * 100).toFixed(1) };
}

function renderKitchenAnswers() {
	const box = document.getElementById('kitchenAnswers');
	box.innerHTML = `
<strong>Respuestas Teóricas Actividad 2:</strong>
c)
• <strong>Ir a la tienda</strong> equivale a un <em>Fallo de página (Page Fault)</em> o acceso al almacenamiento secundario (Disco/SWAP).
• <strong>Hacer el mercado de la semana</strong> equivale a <em>Prefetching / Paging</em> (traer bloques completos a la RAM para evitar ir repetidamente al disco).

d)
• Si la nevera está llena y traes un ingrediente nuevo, sacas el producto más antiguo o menos usado.
• Acabas de usar un algoritmo de reemplazo de páginas: <strong>FIFO</strong> (si sacas lo primero que compraste) o <strong>LRU</strong> (si sacas lo que llevas más tiempo sin consumir).
  `;
}