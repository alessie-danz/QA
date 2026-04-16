/**
 * Vista de Dashboard
 */
import { StorageManager } from '../storage.js';

export function renderDashboard(container, app) {
    const projects = StorageManager.getData(StorageManager.KEYS.PROJECTS);
    const reports = StorageManager.getData(StorageManager.KEYS.REPORTS);
    const coopsCount = projects.reduce((total, p) => total + (p.cooperatives?.length || 0), 0);

    container.innerHTML = `
        <div class="fade-in">
            <div class="view-header">
                <div>
                    <h2 style="font-size: 28px; font-weight: 800; margin-bottom: 5px;">Dashboard</h2>
                    <p style="color: var(--text-muted)">Resumen operacional del sistema QA</p>
                </div>
            </div>

            <div class="grid-3" style="margin-bottom: 30px;">
                <div class="card">
                    <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;">Proyectos</div>
                    <div style="font-size: 36px; font-weight: 800; color: var(--primary)">${projects.length}</div>
                </div>
                <div class="card">
                    <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;">Cooperativas</div>
                    <div style="font-size: 36px; font-weight: 800; color: var(--secondary)">${coopsCount}</div>
                </div>
                <div class="card">
                    <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;">Reportes</div>
                    <div style="font-size: 36px; font-weight: 800; color: var(--accent)">${reports.length}</div>
                </div>
            </div>

            <div class="grid-3" style="grid-template-columns: 2fr 1fr">
                <div class="card">
                    <h3 style="margin-bottom: 25px;">Configuración de Perfil</h3>
                    <div class="form-group">
                        <label>Nombre de Usuario</label>
                        <input type="text" value="${app.currentUser.name}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Estado de la Cuenta</label>
                        <div style="display: flex; gap: 10px;">
                            <span class="badge badge-success">Sincronizado</span>
                            <span class="badge badge-success">Premium</span>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <h3 style="margin-bottom: 20px;">Backup de Datos</h3>
                    <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 25px; line-height: 1.5;">
                        Descarga toda tu configuración local en un archivo JSON para respaldo.
                    </p>
                    <button class="btn btn-primary" id="dash-export" style="width: 100%; margin-bottom: 12px;">Exportar .JSON</button>
                    <button class="btn btn-ghost" id="dash-import" style="width: 100%">Importar .JSON</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('dash-export').addEventListener('click', () => StorageManager.exportAll());
    document.getElementById('dash-import').addEventListener('click', () => app.triggerImport());
}
