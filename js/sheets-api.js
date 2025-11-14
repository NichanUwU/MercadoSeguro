// Configuración JSONBin.io - CREDENCIALES COMPLETAS
const JSONBIN_BIN_ID = '69064896ae596e708f3d107c';
const JSONBIN_MASTER_KEY = '$2a$10$sSJtWMrOWB0ji.mahbccs.yEsl7ZMu9Iun/D.fTR29gUyDgfNYomq';

class JSONBinAPI {
    // Guardar trabajador
    static async saveWorker(workerData) {
        try {
            console.log('Guardando trabajador en JSONBin...', workerData);
            
            // Primero obtener los trabajadores existentes
            const workers = await this.getWorkers();
            
            // Agregar el nuevo trabajador
            workerData.id = workerData.id || Date.now().toString();
            workerData.fechaRegistro = new Date().toISOString();
            workers.push(workerData);
            
            // Actualizar el bin completo
            const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_MASTER_KEY,
                    'X-Bin-Versioning': 'false'
                },
                body: JSON.stringify(workers)
            });
            
            const result = await response.json();
            console.log('Respuesta de JSONBin:', result);
            
            if (response.ok) {
                // Actualizar localStorage
                localStorage.setItem('manoseguras_workers', JSON.stringify(workers));
                return { success: true, message: 'Trabajador guardado exitosamente' };
            } else {
                throw new Error(result.message || 'Error guardando en JSONBin');
            }
            
        } catch (error) {
            console.error('Error guardando trabajador:', error);
            // Fallback a localStorage
            return this.saveToLocalStorage(workerData);
        }
    }

    // Obtener todos los trabajadores
    static async getWorkers() {
        try {
            console.log('Obteniendo trabajadores de JSONBin...');
            
            const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
                headers: {
                    'X-Master-Key': JSONBIN_MASTER_KEY
                }
            });
            
            const result = await response.json();
            console.log('Respuesta de JSONBin:', result);
            
            if (response.ok && result.record) {
                const workers = Array.isArray(result.record) ? result.record : [];
                localStorage.setItem('manoseguras_workers', JSON.stringify(workers));
                localStorage.setItem('manoseguras_last_update', Date.now().toString());
                return workers;
            } else {
                throw new Error(result.message || 'Error obteniendo trabajadores');
            }
            
        } catch (error) {
            console.error('Error obteniendo trabajadores:', error);
            // Fallback a localStorage
            return this.getFromLocalStorage();
        }
    }

    // Métodos de fallback a localStorage
    static saveToLocalStorage(workerData) {
        try {
            let workers = JSON.parse(localStorage.getItem('manoseguras_workers') || '[]');
            workerData.id = workerData.id || Date.now().toString();
            workerData.fechaRegistro = new Date().toISOString();
            workers.push(workerData);
            localStorage.setItem('manoseguras_workers', JSON.stringify(workers));
            return { success: true, message: 'Guardado localmente (modo offline)' };
        } catch (error) {
            console.error('Error guardando localmente:', error);
            return { success: false, message: 'Error guardando los datos' };
        }
    }

    static getFromLocalStorage() {
        try {
            const workers = JSON.parse(localStorage.getItem('manoseguras_workers') || '[]');
            console.log('Datos obtenidos de localStorage:', workers.length, 'trabajadores');
            return workers;
        } catch (error) {
            console.error('Error obteniendo datos locales:', error);
            return [];
        }
    }

    // Probar la conexión
    static async testConnection() {
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                headers: {
                    'X-Master-Key': JSONBIN_MASTER_KEY
                }
            });
            const result = await response.json();
            return { success: response.ok, message: response.ok ? 'Conectado a JSONBin' : 'Error de conexión' };
        } catch (error) {
            console.error('Error probando conexión:', error);
            return { success: false, message: 'Sin conexión' };
        }
    }
}

// Trabajadores de demostración para la expo
const trabajadoresExpo = [
    {
        id: "expo1",
        nombre: "Daniel de Jesús Hernández Vázquez",
        telefono: "9656597890",
        servicios: ["Pasajes", "Mandados", "Envíos"],
        descripcion: "Servicios de pasajes, mandados y envíos. De lunes a domingo, radio de servicio en todo km.",
        valoracion: 4.5,
        experiencia: "0 trabajos realizados",
        horario: "De Lunes a Domingo",
        radio: "Radio de todo km",
        precio: 50,
        tipo: "delivery"
    },
    {
        id: "expo2",
        nombre: "Manuel Albores Chirinos",
        telefono: "9651432166", 
        servicios: ["Electricidad", "Instalaciones Eléctricas", "Reparaciones"],
        descripcion: "TÉCNICO ELECTRICISTA CON MÁS DE 5 AÑOS DE EXPERIENCIA. Especialista en reparaciones urgentes.",
        valoracion: 4.8,
        experiencia: "5+ años de experiencia",
        horario: "Horario flexible",
        radio: "Radio de 10 km",
        precio: 200,
        tipo: "electricista"
    }
];
// Para compatibilidad con tu código existente
const SheetsAPI = JSONBinAPI;