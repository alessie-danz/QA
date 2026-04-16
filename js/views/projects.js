/**
 * Vista de Listado de Proyectos
 */
import { StorageManager } from '../storage.js';

export function renderProjects(container, app) {
    const projects = StorageManager.getData(StorageManager.KEYS.PROJECTS);

    container.innerHTML = `
        <div class="fade-in">
            <div class="view-header">
                <div>
                    <h2 style="font-size: 28px; font-weight: 800; margin-bottom: 5px;">Proyectos de Banca</h2>
                    <p style="color: var(--text-muted)">Selecciona una línea de negocio para iniciar la auditoría</p>
                </div>
            </div>

            <div class="grid-3">
                ${projects.map(p => `
                    <div class="card project-card" data-project-id="${p.id}">
                        <div style="width: 48px; height: 48px; background: rgba(59, 130, 246, 0.1); border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; color: var(--primary)">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                        </div>
                        <h3 style="margin-bottom: 10px;">${p.name}</h3>
                        <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6; min-height: 40px;">${p.description}</p>
                        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid var(--surface-border); display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 5px;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                ${p.cooperatives?.length || 0} Coops
                            </span>
                            <span class="badge badge-success">Explorar</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    container.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-project-id');
            app.navigate('project-detail', { projectId: id });
        });
    });
}
