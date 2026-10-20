/**
 * Módulo 4: Runner & Debugger Paso a Paso de Scripts .txt
 */
let debugSteps = [];
let currentStepIdx = 0;

function initScriptDebugger(codeText) {
	debugSteps = globalInterpreter.parseAndTrace(codeText);
	currentStepIdx = 0;

	const btnNext = document.getElementById('btnNextStep');
	const btnPrev = document.getElementById('btnPrevStep');
	const btnReset = document.getElementById('btnResetDebug');

	if (debugSteps.length > 1) {
		btnNext.disabled = false;
		btnPrev.disabled = true;
		btnReset.disabled = false;
	} else {
		btnNext.disabled = true;
		btnPrev.disabled = true;
		btnReset.disabled = true;
	}

	renderCurrentStep();
}

function nextDebugStep() {
	if (currentStepIdx < debugSteps.length - 1) {
		currentStepIdx++;
		renderCurrentStep();
	}
}

function prevDebugStep() {
	if (currentStepIdx > 0) {
		currentStepIdx--;
		renderCurrentStep();
	}
}

function resetDebugStep() {
	currentStepIdx = 0;
	renderCurrentStep();
}

function renderCurrentStep() {
	if (debugSteps.length === 0) return;

	const step = debugSteps[currentStepIdx];

	// Actualizar botones
	document.getElementById('btnPrevStep').disabled = (currentStepIdx === 0);
	document.getElementById('btnNextStep').disabled = (currentStepIdx === debugSteps.length - 1);

	// Informador de la línea
	const stepInfo = document.getElementById('stepInfo');
	if (step.lineNum === 0) {
		stepInfo.innerText = `Paso 0 / ${debugSteps.length - 1}: Estado Inicial`;
	} else {
		stepInfo.innerText = `Paso ${currentStepIdx} / ${debugSteps.length - 1} | Línea ${step.lineNum}: ${step.command}`;
	}

	// Visualizador de la memoria RAM
	renderBlocksInContainer('scriptMemVisualizer', step.blocks, step.memorySize);

	// Registro acumulativo de logs hasta el paso actual
	const logsContainer = document.getElementById('scriptLogs');
	const accumulatedLogs = debugSteps
		.slice(0, currentStepIdx + 1)
		.filter(s => s.lineNum > 0)
		.map(s => `[Línea ${s.lineNum}] ${s.command} => ${s.log}`);

	logsContainer.innerText = accumulatedLogs.length > 0
		? accumulatedLogs.join('\n')
		: 'Presiona "Siguiente" para comenzar a ejecutar el script...';
}