// =============================
// config.js
// Configuración para EmailJS y GitHub API
// =============================

// Configuración de EmailJS
const EMAIL_CONFIG = {
    SERVICE_ID: 'YOUR_EMAILJS_SERVICE_ID', // Reemplazar con tu Service ID de EmailJS
    TEMPLATE_ID: 'YOUR_EMAILJS_TEMPLATE_ID', // Reemplazar con tu Template ID de EmailJS
    PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY', // Reemplazar con tu Public Key de EmailJS
    
    // Emails de destino
    CONTRACTOR_EMAIL: 'santiago.palacios@email.com', // Email del contratante
    DEVELOPER_EMAIL: 'marco.zubieta@symbiosisresearch.com', // Email del desarrollador
};

// Configuración de GitHub
const GITHUB_CONFIG = {
    OWNER: 'marcozubieta', // Tu usuario de GitHub
    REPO: 'Briefing-Legal', // Nombre del repositorio
    TOKEN: 'YOUR_GITHUB_TOKEN', // Token de acceso personal de GitHub
    BRANCH: 'main', // Rama donde hacer el commit
    FOLDER: 'briefings' // Carpeta donde guardar los briefings
};

// Configuración de la aplicación
const APP_CONFIG = {
    CLIENT_NAME: 'SANTIAGO PALACIOS',
    DEVELOPER_NAME: 'Marco Zubieta',
    COMPANY_NAME: 'Symbiosis Research'
};
