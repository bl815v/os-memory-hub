/**
 * StateManager: Maneja el patron Undo / Redo mediante snapshots
 */
class StateManager {
	constructor() {
		this.history = [];
		this.currentIndex = -1;
		this.maxHistory = 30;
	}

	saveState(state) {
		// Si estamos en medio del historial y hacemos un cambio, eliminamos el futuro
		if (this.currentIndex < this.history.length - 1) {
			this.history = this.history.slice(0, this.currentIndex + 1);
		}

		this.history.push(JSON.parse(JSON.stringify(state)));
		if (this.history.length > this.maxHistory) {
			this.history.shift();
		} else {
			this.currentIndex++;
		}

		this.updateButtonsState();
	}

	undo() {
		if (this.canUndo()) {
			this.currentIndex--;
			this.updateButtonsState();
			return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
		}
		return null;
	}

	redo() {
		if (this.canRedo()) {
			this.currentIndex++;
			this.updateButtonsState();
			return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
		}
		return null;
	}

	canUndo() {
		return this.currentIndex > 0;
	}

	canRedo() {
		return this.currentIndex < this.history.length - 1;
	}

	updateButtonsState() {
		const btnUndo = document.getElementById('btnUndo');
		const btnRedo = document.getElementById('btnRedo');

		if (btnUndo) btnUndo.disabled = !this.canUndo();
		if (btnRedo) btnRedo.disabled = !this.canRedo();
	}
}

const globalStateManager = new StateManager();