/**
 * Módulo 1: Reemplazo de Páginas con Horas (FIFO, LRU, OPT)
 */
function runPagingSimulation(numFrames, references, times) {
	const algos = ['FIFO', 'LRU', 'OPT'];
	const results = {};

	algos.forEach(algo => {
		results[algo] = simulatePagingAlgo(algo, numFrames, references);
	});

	return results;
}

function simulatePagingAlgo(algo, numFrames, refs) {
	let frames = Array(numFrames).fill(null);
	let pageFaults = 0;
	let matrix = [];
	let faultsHistory = [];
	let usageHistory = [];

	refs.forEach((page, index) => {
		let isFault = false;

		if (!frames.includes(page)) {
			isFault = true;
			pageFaults++;

			if (frames.includes(null)) {
				const emptyIdx = frames.indexOf(null);
				frames[emptyIdx] = page;
			} else {
				if (algo === 'FIFO') {
					frames.shift();
					frames.push(page);
				} else if (algo === 'LRU') {
					let minIdx = Infinity;
					let victimPage = null;

					frames.forEach(f => {
						const lastUsed = usageHistory.lastIndexOf(f);
						if (lastUsed < minIdx) {
							minIdx = lastUsed;
							victimPage = f;
						}
					});
					const replaceIdx = frames.indexOf(victimPage);
					frames[replaceIdx] = page;
				} else if (algo === 'OPT') {
					let maxFuture = -1;
					let victimIdx = 0;

					frames.forEach((f, fIdx) => {
						const nextUse = refs.slice(index + 1).indexOf(f);
						if (nextUse === -1) {
							victimIdx = fIdx;
							maxFuture = Infinity;
						} else if (nextUse > maxFuture && maxFuture !== Infinity) {
							maxFuture = nextUse;
							victimIdx = fIdx;
						}
					});
					frames[victimIdx] = page;
				}
			}
		}

		usageHistory.push(page);
		matrix.push({ frames: [...frames], isFault });
		faultsHistory.push(isFault);
	});

	return { matrix, pageFaults, faultsHistory };
}

function renderPagingResults(results, refs, times) {
	const container = document.getElementById('pagingResults');
	container.innerHTML = '';

	Object.keys(results).forEach(algo => {
		const data = results[algo];
		let html = `<h3>Algoritmo: ${algo} (Recargas/Fallos Totales: ${data.pageFaults})</h3>`;
		html += `<table class="table-paging"><thead>`;

		// Fila de Hora
		html += `<tr><th>Hora</th>`;
		refs.forEach((_, i) => {
			html += `<th>${times[i] || '-'}</th>`;
		});
		html += `</tr>`;

		// Fila de App Referenciada
		html += `<tr><th>App</th>`;
		refs.forEach(r => html += `<th>${r}</th>`);
		html += `</tr></thead><tbody>`;

		// Filas de Marcos
		const numFrames = data.matrix[0].frames.length;
		for (let f = 0; f < numFrames; f++) {
			html += `<tr><td>Marco ${f + 1}</td>`;
			data.matrix.forEach(step => {
				html += `<td>${step.frames[f] || '-'}</td>`;
			});
			html += `</tr>`;
		}

		// Fila de Recarga
		html += `<tr><td>¿Recarga?</td>`;
		data.faultsHistory.forEach(isFault => {
			html += `<td class="${isFault ? 'page-fault-yes' : 'page-fault-no'}">${isFault ? 'SÍ' : 'NO'}</td>`;
		});
		html += `</tr></tbody></table>`;

		container.innerHTML += html;
	});
}