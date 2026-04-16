/**
 * Gestor de Persistencia Local
 */
export class StorageManager {
    static KEYS = {
        USERS: 'qa_users',
        PROJECTS: 'qa_projects',
        REPORTS: 'qa_reports',
        SESSION: 'qa_session'
    };

    static init() {
        if (!localStorage.getItem(this.KEYS.USERS)) {
            localStorage.setItem(this.KEYS.USERS, JSON.stringify([
                { id: 'u1', username: 'admin', password: 'admin123', name: 'Super Admin' }
            ]));
        }

        if (!localStorage.getItem(this.KEYS.PROJECTS)) {
            const defaultProjects = [
                { id: 'p1', name: 'Banca web Personas', description: 'Sistema transaccional para usuarios finales', config: {}, cooperatives: [] },
                { id: 'p2', name: 'Banca web empresa', description: 'Portal corporativo y flujos de aprobación', config: {}, cooperatives: [] },
                { id: 'p3', name: 'Portal administrativo de banca', description: 'Consola interna de gestión', config: {}, cooperatives: [] },
                { id: 'p4', name: 'Super administrador de cooperativas', description: 'Gestión global de entidades', config: {}, cooperatives: [] }
            ];
            localStorage.setItem(this.KEYS.PROJECTS, JSON.stringify(defaultProjects));
        }

        if (!localStorage.getItem(this.KEYS.REPORTS)) {
            localStorage.setItem(this.KEYS.REPORTS, JSON.stringify([]));
        }
    }

    static getData(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    static setData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    static exportAll() {
        const data = {
            users: this.getData(this.KEYS.USERS),
            projects: this.getData(this.KEYS.PROJECTS),
            reports: this.getData(this.KEYS.REPORTS)
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qa_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    }

    static importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.users) this.setData(this.KEYS.USERS, data.users);
            if (data.projects) this.setData(this.KEYS.PROJECTS, data.projects);
            if (data.reports) this.setData(this.KEYS.REPORTS, data.reports);
            return true;
        } catch (e) {
            return false;
        }
    }
}
