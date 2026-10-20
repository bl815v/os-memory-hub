/**
 * App Controller & Main Router
 */
document.addEventListener('DOMContentLoaded', () => {

	// Toggle Sidebar
	const btnToggleSidebar = document.getElementById('btnToggleSidebar');
	const sidebar = document.getElementById('sidebar');

	btnToggleSidebar.addEventListener('click', () => {
		sidebar.classList.toggle('collapsed');
	});

	// Lógica de Cambio de Tema (Claro / Oscuro)
	const btnThemeToggle = document.getElementById('btnThemeToggle');
	const themeIcon = document.getElementById('themeIcon');

	btnThemeToggle.addEventListener('click', () => {
		document.body.classList.toggle('light-theme');

		if (document.body.classList.contains('light-theme')) {
			themeIcon.classList.remove('fa-sun');
			themeIcon.classList.add('fa-moon');
		} else {
			themeIcon.classList.remove('fa-moon');
			themeIcon.classList.add('fa-sun');
		}
	});

	// Navigation Tabs
	const navItems = document.querySelectorAll('.nav-item');
	const panels = document.querySelectorAll('.module-panel');

	navItems.forEach(item => {
		item.addEventListener('click', () => {
			const target = item.getAttribute('data-target');

			navItems.forEach(i => i.classList.remove('active'));
			panels.forEach(p => p.classList.remove('active'));

			item.classList.add('active');
			document.getElementById(target).classList.add('active');
		});
	});

	// Eventos Módulo 1: Paginación
	document.getElementById('btnRunPaging').addEventListener('click', () => {
		const numFrames = parseInt(document.getElementById('numFrames').value, 10);
		const refs = document.getElementById('pageSequence').value.trim().split(/\s+/);
		const times = document.getElementById('timeSequence').value.trim().split(/\s+/);
		const results = runPagingSimulation(numFrames, refs, times);
		renderPagingResults(results, refs, times);
	});

	document.getElementById('btnLoadAct1').addEventListener('click', () => {
		document.getElementById('numFrames').value = 3;
		document.getElementById('pageSequence').value = 'WhatsApp Instagram Maps WhatsApp Spotify WhatsApp Instagram WhatsApp Maps WhatsApp';
		document.getElementById('timeSequence').value = '7:00 7:20 7:40 8:00 9:30 11:00 12:30 14:00 17:00 18:00';
		document.getElementById('btnRunPaging').click();
	});

	// Eventos Módulo 2: Jerarquía
	const rangeHit = document.getElementById('rangeHitRate');
	rangeHit.addEventListener('input', (e) => {
		document.getElementById('valHitRate').innerText = `${e.target.value}%`;
	});

	document.getElementById('btnCalcKitchen').addEventListener('click', () => {
		const hitVal = parseInt(rangeHit.value, 10);
		const tMesa = parseFloat(document.getElementById('timeMesa').value);
		const tNevera = parseFloat(document.getElementById('timeNevera').value);
		const tTienda = parseFloat(document.getElementById('timeTienda').value);

		const res = calculateEAT(hitVal, tMesa, tNevera, tTienda);
		document.getElementById('kitchenResults').innerHTML = `
      <div class="card">
        <h3>Resultado EAT: ${res.eat} segundos por ingrediente</h3>
        <p>Aciertos Nevera/RAM: ${res.hitRatePercent}% (${tNevera}s) | Visitas Tienda/Disco: ${res.missPercent}% (${tTienda}s)</p>
      </div>
    `;
		renderKitchenAnswers();
	});

	// Eventos Módulo 3: Asignación RAM Dinámica
	globalAllocator.renderVisualizer('allocMemoryVisualizer');

	document.getElementById('btnInitMemory').addEventListener('click', () => {
		const totalSize = parseInt(document.getElementById('totalMemSize').value, 10);
		globalAllocator.reset(totalSize);
		globalAllocator.renderVisualizer('allocMemoryVisualizer');
		document.getElementById('allocLogs').innerText = `Memoria reiniciada con ${totalSize} KB libres.`;
	});

	document.getElementById('btnLoadPresetHoles').addEventListener('click', () => {
		globalAllocator.loadPresetHoles();
		globalAllocator.renderVisualizer('allocMemoryVisualizer');
		document.getElementById('allocLogs').innerText = `Cargados huecos base del taller (100, 500, 200, 300, 600 KB).`;
	});

	document.getElementById('btnAllocateProc').addEventListener('click', () => {
		const procName = document.getElementById('procName').value.trim();
		const size = parseInt(document.getElementById('procSize').value, 10);
		const strategy = document.getElementById('fitStrategy').value;

		if (!procName || isNaN(size) || size <= 0) {
			alert('Ingresa un nombre y tamaño válido');
			return;
		}

		const success = globalAllocator.allocate(procName, size, strategy);
		globalAllocator.renderVisualizer('allocMemoryVisualizer');
		document.getElementById('allocLogs').innerText = success
			? `Proceso '${procName}' (${size} KB) asignado exitosamente usando ${strategy}.`
			: `FALLO: No hay suficiente espacio contiguo para asignar '${procName}' (${size} KB).`;
	});

	document.getElementById('btnFreeProc').addEventListener('click', () => {
		const procName = document.getElementById('procName').value.trim();
		const freed = globalAllocator.free(procName);
		globalAllocator.renderVisualizer('allocMemoryVisualizer');
		document.getElementById('allocLogs').innerText = freed
			? `Proceso '${procName}' liberado.`
			: `No se encontró ningún proceso ocupado llamado '${procName}'.`;
	});

	document.getElementById('btnCompactMem').addEventListener('click', () => {
		globalAllocator.compact();
		globalAllocator.renderVisualizer('allocMemoryVisualizer');
		document.getElementById('allocLogs').innerText = `Memoria compactada con éxito.`;
	});

	// Eventos Módulo 4: Debugger Paso a Paso
	document.getElementById('btnInitDebug').addEventListener('click', () => {
		const code = document.getElementById('scriptCode').value;
		if (!code.trim()) {
			alert('Ingresa o carga un script .txt primero');
			return;
		}
		initScriptDebugger(code);
	});

	document.getElementById('btnNextStep').addEventListener('click', () => {
		nextDebugStep();
	});

	document.getElementById('btnPrevStep').addEventListener('click', () => {
		prevDebugStep();
	});

	document.getElementById('btnResetDebug').addEventListener('click', () => {
		resetDebugStep();
	});

	document.getElementById('fileInput').addEventListener('change', (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (evt) => {
				document.getElementById('scriptCode').value = evt.target.result;
				initScriptDebugger(evt.target.result);
			};
			reader.readAsText(file);
		}
	});

	// Eventos Módulo 5: Lenguajes
	document.getElementById('langSelect').addEventListener('change', (e) => {
		renderLangDetails(e.target.value);
	});

	renderLangDetails('cpp');
	renderKitchenAnswers();
});