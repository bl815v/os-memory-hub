/**
 * Módulo 3: Asignación Contigua Dinámica
 */
class MemoryAllocator {
	constructor(totalSize = 2100) {
		this.totalSize = totalSize;
		this.blocks = [{ name: 'Libre', size: totalSize, free: true }];
	}

	reset(totalSize) {
		this.totalSize = totalSize;
		this.blocks = [{ name: 'Libre', size: totalSize, free: true }];
	}

	loadPresetHoles() {
		this.totalSize = 2100;
		this.blocks = [
			{ name: 'Libre (A)', size: 100, free: true },
			{ name: 'X1', size: 100, free: false },
			{ name: 'Libre (B)', size: 500, free: true },
			{ name: 'X2', size: 100, free: false },
			{ name: 'Libre (C)', size: 200, free: true },
			{ name: 'X3', size: 100, free: false },
			{ name: 'Libre (D)', size: 300, free: true },
			{ name: 'X4', size: 100, free: false },
			{ name: 'Libre (E)', size: 600, free: true }
		];
	}

	allocate(procName, size, strategy) {
		let candidateIdx = -1;
		let candidates = [];

		this.blocks.forEach((b, idx) => {
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

		const hole = this.blocks[candidateIdx];
		const diff = hole.size - size;

		if (diff > 0) {
			this.blocks.splice(candidateIdx, 1,
				{ name: procName, size, free: false },
				{ name: 'Libre', size: diff, free: true }
			);
		} else {
			this.blocks[candidateIdx] = { name: procName, size, free: false };
		}

		return true;
	}

	free(procName) {
		let found = false;
		this.blocks.forEach(b => {
			if (b.name.toUpperCase() === procName.toUpperCase() && !b.free) {
				b.free = true;
				b.name = 'Libre';
				found = true;
			}
		});
		return found;
	}

	compact() {
		let totalFree = 0;
		const occupied = [];

		this.blocks.forEach(b => {
			if (b.free) totalFree += b.size;
			else occupied.push(b);
		});

		this.blocks = [...occupied];
		if (totalFree > 0) {
			this.blocks.push({ name: 'Libre Compactado', size: totalFree, free: true });
		}
	}

	renderVisualizer(containerId) {
		renderBlocksInContainer(containerId, this.blocks, this.totalSize);
	}
}

function renderBlocksInContainer(containerId, blocks, totalSize) {
	const container = document.getElementById(containerId);
	container.innerHTML = '';

	const bar = document.createElement('div');
	bar.className = 'ram-bar';

	blocks.forEach(b => {
		const pct = Math.max((b.size / totalSize) * 100, 3);
		const blockDiv = document.createElement('div');
		blockDiv.className = `ram-block ${b.free ? 'free' : 'occupied'}`;
		blockDiv.style.width = `${pct}%`;
		blockDiv.innerHTML = `<span>${b.name}</span><span>${b.size} KB</span>`;
		bar.appendChild(blockDiv);
	});

	container.appendChild(bar);
}

const globalAllocator = new MemoryAllocator();