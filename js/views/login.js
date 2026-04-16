/**
 * Vista de Login
 */
export function renderLogin(container, app) {
    container.innerHTML = `
        <div class="login-container">
            <div class="login-card fade-in">
                <div style="width: 60px; height: 60px; background: var(--primary); border-radius: 16px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h1 style="text-align: center; margin-bottom: 10px; font-weight: 800;">QA Auditor</h1>
                <p style="text-align: center; color: var(--text-muted); font-size: 14px; margin-bottom: 30px;">Gestión avanzada de pruebas bancarias</p>
                
                <form id="login-form">
                    <div class="form-group">
                        <label>Usuario</label>
                        <input type="text" id="username" placeholder="admin" required autofocus>
                    </div>
                    <div class="form-group">
                        <label>Contraseña</label>
                        <input type="password" id="password" placeholder="••••••••" required>
                    </div>
                    <div id="login-error" class="hidden" style="color: var(--danger); font-size: 13px; margin-bottom: 15px; text-align: center;">
                        Credenciales incorrectas
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%">Iniciar Sesión</button>
                </form>
                <div style="margin-top: 30px; text-align: center; font-size: 12px; color: var(--text-muted); border-top: 1px solid var(--surface-border); padding-top: 20px;">
                    Acceso inicial: admin / admin123
                </div>
            </div>
        </div>
    `;

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('username').value;
        const p = document.getElementById('password').value;
        if (!app.login(u, p)) {
            document.getElementById('login-error').classList.remove('hidden');
        }
    });
}
