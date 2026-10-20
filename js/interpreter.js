/**
 * Interpreter para scripts DSL (.txt) con trazabilidad paso a paso
 */
class ScriptInterpreter {
	constructor() {
		this.allowedCommands = [
			'MEMORIA', 'ASIGNAR', 'LIBERAR', 'ESTRATEGIA',
			'COMPACTAR', 'MOSTRAR', 'REFERENCIAS', 'MARCOS',
			'ALGORITMO', 'BELADY'
		];
	}

	parseAndTrace(codeText) {
		const lines = codeText.split('\n');
		let memorySize = 2100;
		let strategy = 'FIRST';
		let currentBlocks = [{ name: 'Libre', size: memorySize, free: true }];

		const steps = [];

		// Estado 0: Inicialización previa
		steps.push({
			lineNum: 0,
			command: 'INICIO',
			log: 'Estado inicial listo para comenzar depuración.',
			blocks: JSON.parse(JSON.stringify(currentBlocks)),
			memorySize
		});

		lines.forEach((lineRaw, idx) => {
			const lineNum = idx + 1;
			const line = lineRaw.trim();

			if (!line || line.startsWith('#')) return;

			const parts = line.split(/\s+/);
			const cmd = parts[0].toUpperCase();
			let logMsg = '';

			if (cmd === 'MEMORIA') {
				memorySize = parseInt(parts[1], 10) || 2100;
				currentBlocks = [{ name: 'Libre', size: memorySize, free: true }];
				logMsg = `Memoria configurada a ${memorySize} KB`;
			} else if (cmd === 'ESTRATEGIA') {
				strategy = parts[1]?.toUpperCase() || 'FIRST';
				logMsg = `Estrategia de ubicación cambiada a ${strategy}`;
			} else if (cmd === 'ASIGNAR') {
				const procName = parts[1];
				const size = parseInt(parts[2], 10);
				if (procName && !isNaN(size)) {
					const success = this.allocateBlock(currentBlocks, procName, size, strategy);
					logMsg = `ASIGNAR ${procName} (${size} KB) -> ${success ? 'EXITOSO' : 'FALLIDO (Sin espacio)'}`;
				}
			} else if (cmd === 'LIBERAR') {
				const procName = parts[1];
				this.freeBlock(currentBlocks, procName);
				logMsg = `LIBERAR proceso '${procName}'`;
			} else if (cmd === 'COMPACTAR') {
				currentBlocks = this.compactBlocks(currentBlocks, memorySize);
				logMsg = `COMPACTAR memoria ejecutado`;
			} else {
				logMsg = `Comando '${cmd}' procesado`;
			}

			steps.push({
				lineNum,
				command: line,
				log: logMsg,
				blocks: JSON.parse(JSON.stringify(currentBlocks)),
				memorySize
			});
		});

		return steps;
	}

	allocateBlock(blocks, procName, size, strategy) {
		let candidateIdx = -1;
		let candidates = [];

		blocks.forEach((b, idx) => {
			if (b.free && b.size >= size) {
				candidates.push({ idx, size: b.size });
			}
		});

		if (candidates.length === 0) return false;

		if (strategy === 'FIRST') candidateIdx = candidates[0].idx;
		else if (strategy === 'BEST') {
			candidates.sort((a, b) => a.size - b.size);
			candidateIdx = candidates[0].idx;
		} else if (strategy === 'WORST') {
			candidates.sort((a, b) => b.size - a.size);
			candidateIdx = candidates[0].idx;
		}

		const hole = blocks[candidateIdx];
		const diff = hole.size - size;

		if (diff > 0) {
			blocks.splice(candidateIdx, 1,
				{ name: procName, size, free: false },
				{ name: 'Libre', size: diff, free: true }
			);
		} else {
			blocks[candidateIdx] = { name: procName, size, free: false };
		}
		return true;
	}

	freeBlock(blocks, procName) {
		blocks.forEach(b => {
			if (b.name === procName) {
				b.free = true;
				b.name = 'Libre';
			}
		});
	}

	compactBlocks(blocks, totalSize) {
		let totalFree = 0;
		const occupied = [];

		blocks.forEach(b => {
			if (b.free) totalFree += b.size;
			else occupied.push(b);
		});

		if (totalFree > 0) {
			occupied.push({ name: 'Libre Compactado', size: totalFree, free: true });
		}
		return occupied;
	}
}

const globalInterpreter = new ScriptInterpreter();