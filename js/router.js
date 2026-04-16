/**
 * Gestor de Navegación
 */
export class Router {
    constructor(app) {
        this.app = app;
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-link]');
            if (link) {
                const view = link.getAttribute('data-link');
                this.app.navigate(view);
            }
        });

        // Listen for export/import global events
        document.addEventListener('click', (e) => {
            if (e.target.id === 'export-btn' || e.target.closest('#export-btn')) {
                import('./storage.js').then(m => m.StorageManager.exportAll());
            }
            if (e.target.id === 'import-btn' || e.target.closest('#import-btn')) {
                this.app.triggerImport();
            }
        });
    }
}
