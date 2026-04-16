/**
 * Punto de Entrada Principal
 */
import { StorageManager } from './storage.js';
import { Router } from './router.js';
import { renderLogin } from './views/login.js';
import { renderDashboard } from './views/dashboard.js';
import { renderProjects } from './views/projects.js';
import { renderProjectDetail } from './views/project.js';

class App {
    constructor() {
        StorageManager.init();
        this.currentUser = JSON.parse(localStorage.getItem(StorageManager.KEYS.SESSION));
        this.currentView = 'dashboard';
        this.activeProject = null;
        this.router = new Router(this);
        
        this.render();
    }

    navigate(view, params = null) {
        this.currentView = view;
        if (params && params.projectId) {
            const projects = StorageManager.getData(StorageManager.KEYS.PROJECTS);
            this.activeProject = projects.find(p => p.id === params.projectId);
        }
        this.render();
    }

    login(username, password) {
        const users = StorageManager.getData(StorageManager.KEYS.USERS);
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem(StorageManager.KEYS.SESSION, JSON.stringify(user));
            this.render();
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem(StorageManager.KEYS.SESSION);
        this.render();
    }

    triggerImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (StorageManager.importData(event.target.result)) {
                    alert('Datos importados. Se recargará la página.');
                    window.location.reload();
                } else {
                    alert('Error al importar JSON.');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    render() {
        const appContainer = document.getElementById('app');
        
        if (!this.currentUser) {
            renderLogin(appContainer, this);
            return;
        }

        this.renderShell(appContainer);
        const target = document.getElementById('view-target');
        
        switch (this.currentView) {
            case 'dashboard': renderDashboard(target, this); break;
            case 'projects': renderProjects(target, this); break;
            case 'project-detail': renderProjectDetail(target, this); break;
        }
    }

    renderShell(container) {
        container.innerHTML = `
            <div class="shell-container">
                <aside class="sidebar">
                    <div class="sidebar-logo">
                        <div style="width: 32px; height: 32px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        Suite QA
                    </div>
                    
                    <div class="nav-group">
                        <div class="nav-label">General</div>
                        <div class="nav-item ${this.currentView === 'dashboard' ? 'active' : ''}" data-link="dashboard">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                            Dashboard
                        </div>
                        <div class="nav-item ${this.currentView === 'projects' || this.currentView === 'project-detail' ? 'active' : ''}" data-link="projects">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                            Proyectos
                        </div>
                    </div>

                    <div class="nav-group">
                        <div class="nav-label">Archivo</div>
                        <div class="nav-item" id="import-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 10 12 5 7 10"/><line x1="12" y1="5" x2="12" y2="17"/></svg>
                            Importar
                        </div>
                        <div class="nav-item" id="export-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Exportar
                        </div>
                        <div class="nav-item" id="logout-btn" style="color: var(--danger)">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                            Salir
                        </div>
                    </div>

                    <div style="margin-top: auto; padding: 25px; border-top: 1px solid var(--surface-border);">
                        <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Sesión</div>
                        <div style="font-size: 14px; font-weight: 700;">${this.currentUser.name}</div>
                    </div>
                </aside>
                <main class="main-content" id="view-target"></main>
            </div>
        `;

        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
    }

    saveProjects() {
        const projects = StorageManager.getData(StorageManager.KEYS.PROJECTS);
        const idx = projects.findIndex(p => p.id === this.activeProject.id);
        if (idx !== -1) {
            projects[idx] = this.activeProject;
            StorageManager.setData(StorageManager.KEYS.PROJECTS, projects);
        }
    }

    deleteConfig(key) {
        if (!this.activeProject.config) return;
        delete this.activeProject.config[key];
        this.saveProjects();
        this.renderView();
    }

    simulateReport() {
        if (!this.activeProject.cooperatives.length) return;
        const coops = this.activeProject.cooperatives;
        const coop = coops[Math.floor(Math.random() * coops.length)];
        const reports = StorageManager.getData(StorageManager.KEYS.REPORTS);
        
        reports.unshift({
            id: 'r' + Date.now(),
            projectId: this.activeProject.id,
            cooperativeId: coop.id,
            coopName: coop.name,
            date: new Date().toLocaleString(),
            status: Math.random() > 0.2 ? 'PASS' : 'FAIL',
            score: Math.floor(Math.random() * 40) + 60
        });
        
        StorageManager.setData(StorageManager.KEYS.REPORTS, reports);
        this.renderView();
    }

    renderView() {
        const target = document.getElementById('view-target');
        if (!target) return;
        switch (this.currentView) {
            case 'dashboard': renderDashboard(target, this); break;
            case 'projects': renderProjects(target, this); break;
            case 'project-detail': renderProjectDetail(target, this); break;
        }
    }
}

window.app = new App();
