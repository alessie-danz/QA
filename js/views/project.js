/**
 * Vista de Detalle de Proyecto y Cooperativas
 */
import { StorageManager } from '../storage.js';

export function renderProjectDetail(container, app) {
    if (!app.activeProject) return app.navigate('projects');

    container.innerHTML = `
        <div class="fade-in">
            <div class="view-header">
                <div>
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                        <button class="btn btn-ghost" data-link="projects" style="padding: 6px 12px; font-size: 12px;">← Proyectos</button>
                        <span class="badge badge-success">ID: ${app.activeProject.id}</span>
                    </div>
                    <h2 style="font-size: 28px; font-weight: 800; margin-bottom: 5px;">${app.activeProject.name}</h2>
                    <p style="color: var(--text-muted)">${app.activeProject.description}</p>
                </div>
                <div>
                    <button class="btn btn-primary" id="sim-report-btn">Simular Auditoría</button>
                </div>
            </div>

            <div class="grid-3" style="grid-template-columns: 1.6fr 1.2fr">
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                        <h3 style="margin: 0">Configuración Global</h3>
                        <button class="btn btn-ghost" style="padding: 6px 12px; font-size: 12px;" id="add-global-config">+ Parámetro</button>
                    </div>
                    <div id="global-configs">
                        ${renderConfigItems(app.activeProject.config || {}, (key) => app.deleteConfig(key))}
                    </div>
                </div>
                
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                        <h3 style="margin: 0">Cooperativas</h3>
                        <button class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;" id="add-coop-btn">+ Nueva</button>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        ${app.activeProject.cooperatives.length ? 
                            app.activeProject.cooperatives.map(c => `
                                <div class="coop-item" data-id="${c.id}" style="padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--surface-border); border-radius: 12px; cursor: pointer; transition: 0.2s;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                        <span style="font-weight: 700; font-size: 14px;">${c.name}</span>
                                        <span style="font-size: 11px; opacity: 0.5;">#${c.id}</span>
                                    </div>
                                    <div style="font-size: 12px; color: var(--text-muted);">Params: ${Object.keys(c.configs || {}).length}</div>
                                </div>
                            `).join('') : 
                            '<div style="padding: 40px; text-align: center; border: 1px dashed var(--surface-border); border-radius: 12px; color: var(--text-muted); font-size: 13px;">Sin cooperativas registradas.</div>'
                        }
                    </div>
                </div>
            </div>

            <div class="card">
                <h3 style="margin-bottom: 20px;">Historial de Reportes</h3>
                <div id="project-reports-table">
                    ${renderReportsTable(app.activeProject.id)}
                </div>
            </div>
        </div>
    `;

    attachProjectListeners(app);
}

function attachProjectListeners(app) {
    document.getElementById('add-coop-btn').addEventListener('click', () => {
        const name = prompt('Nombre de la Cooperativa:');
        if (name) {
            app.activeProject.cooperatives.push({ id: 'c' + Date.now(), name, configs: {} });
            app.saveProjects();
            app.renderView();
        }
    });

    document.getElementById('add-config-btn').addEventListener('click', () => {
        const key = prompt('Nombre del parámetro global (ej. Entorno, Version):');
        if (key) {
            const val = prompt('Valor:');
            if (!app.activeProject.config) app.activeProject.config = {};
            app.activeProject.config[key] = val || '';
            app.saveProjects();
            app.renderView();
        }
    });

    document.getElementById('sim-report-btn').addEventListener('click', () => {
        if (!app.activeProject.cooperatives.length) return alert('Agrega una cooperativa primero.');
        app.simulateReport();
    });

    // Listen for delete buttons
    document.querySelectorAll('[id^="del-"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const key = btn.id.replace('del-', '');
            app.deleteConfig(key);
        });
    });

    document.querySelectorAll('.coop-item').forEach(el => {
        el.addEventListener('click', () => {
            const id = el.getAttribute('data-id');
            const coop = app.activeProject.cooperatives.find(c => c.id === id);
            
            const currentConfigs = Object.entries(coop.configs || {}).map(([k,v]) => `${k}: ${v}`).join('\n');
            const k = prompt(`Configurar ${coop.name}.\nActuales:\n${currentConfigs || 'Ninguno'}\n\nNueva clave:`);
            
            if (k) {
                const v = prompt(`Valor para ${k}:`);
                if (!coop.configs) coop.configs = {};
                coop.configs[k] = v;
                app.saveProjects();
                app.renderView();
            }
        });
    });
}

function renderConfigItems(configs) {
    const keys = Object.keys(configs);
    if (!keys.length) return '<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 13px;">Sin configuración global definida.</div>';
    
    return keys.map(k => `
        <div style="padding: 14px; background: rgba(255,255,255,0.02); border: 1px solid var(--surface-border); border-radius: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <span style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 2px;">${k}</span>
                <span style="font-weight: 600; font-size: 14px;">${configs[k]}</span>
            </div>
            <button class="btn btn-ghost" style="padding: 5px 10px; font-size: 11px;" id="del-${k}">Eliminar</button>
        </div>
    `).join('');
}

function renderReportsTable(projectId) {
    const reports = StorageManager.getData(StorageManager.KEYS.REPORTS).filter(r => r.projectId === projectId);
    if (!reports.length) return '<p style="color: var(--text-muted); font-size: 13px;">Aún no se han generado reportes para este proyecto.</p>';

    return `
        <table>
            <thead>
                <tr>
                    <th>Cooperativa</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Puntuación</th>
                </tr>
            </thead>
            <tbody>
                ${reports.map(r => `
                    <tr>
                        <td style="font-weight: 600;">${r.coopName}</td>
                        <td>${r.date}</td>
                        <td><span class="badge ${r.status === 'PASS' ? 'badge-success' : 'badge-danger'}">${r.status}</span></td>
                        <td>${r.score}%</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}
