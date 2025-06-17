// =============================
// briefing-sender.js
// Funciones para envío por email y guardado en GitHub
// =============================

class BriefingSender {
    constructor() {
        this.emailjs = null;
        this.initEmailJS();
    }

    // Inicializar EmailJS
    async initEmailJS() {
        if (typeof emailjs !== 'undefined') {
            this.emailjs = emailjs;
            this.emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
        } else {
            console.error('EmailJS no está cargado');
        }
    }

    // Formatear datos del briefing
    formatBriefingData(data) {
        const timestamp = new Date().toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        let briefingContent = `BRIEFING LEGAL - GESTOR DE APUNTES LEGALES
========================================

Cliente: ${APP_CONFIG.CLIENT_NAME}
Fecha: ${timestamp}
Desarrollador: ${APP_CONFIG.DEVELOPER_NAME}
Empresa: ${APP_CONFIG.COMPANY_NAME}

========================================
RESPUESTAS DEL BRIEFING
========================================

`;

        // Procesar cada campo del formulario
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                let fieldName = this.formatFieldName(key);
                let fieldValue = this.formatFieldValue(data[key]);
                briefingContent += `${fieldName}: ${fieldValue}\n\n`;
            }
        }

        briefingContent += `========================================
PRÓXIMOS PASOS
========================================

1. Revisión del briefing por ambas partes
2. Elaboración de propuesta técnica detallada
3. Definición de cronograma y milestones
4. Inicio del desarrollo

Para cualquier consulta o aclaración, contactar a:
- Cliente: ${EMAIL_CONFIG.CONTRACTOR_EMAIL}
- Desarrollador: ${EMAIL_CONFIG.DEVELOPER_EMAIL}

Atentamente,
${APP_CONFIG.DEVELOPER_NAME}
${APP_CONFIG.COMPANY_NAME}`;

        return briefingContent;
    }

    // Formatear nombre de campo
    formatFieldName(key) {
        const fieldNames = {
            'project_purpose': '🎯 Propósito del Proyecto',
            'confirm_fields': '📊 Confirmación de Campos Base',
            'excel_export': '📤 Exportación a Excel',
            'data_migration': '🔄 Migración de Datos',
            'user_roles': '👥 Roles de Usuario',
            'chain_of_custody': '🔒 Cadena de Custodia',
            'architecture_model': '🏗️ Modelo de Arquitectura',
            'company_size': '🏢 Tamaño de Empresa',
            'mvp_scope': '🚀 Alcance del MVP',
            'collaboration_model': '🤝 Modelo de Colaboración',
            'budget_range': '💰 Rango de Presupuesto',
            'visual_style': '🎨 Estilo Visual',
            'additional_comments': '💬 Comentarios Adicionales',
            'confirmation_timestamp': '⏰ Timestamp de Confirmación'
        };
        
        return fieldNames[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Formatear valor de campo
    formatFieldValue(value) {
        if (Array.isArray(value)) {
            return value.length > 0 ? value.join(', ') : 'No seleccionado';
        }
        return value || 'No especificado';
    }

    // Enviar email usando EmailJS
    async sendEmail(briefingContent, recipientEmail, recipientName) {
        if (!this.emailjs) {
            throw new Error('EmailJS no está inicializado');
        }

        const templateParams = {
            to_email: recipientEmail,
            to_name: recipientName,
            from_name: APP_CONFIG.DEVELOPER_NAME,
            from_company: APP_CONFIG.COMPANY_NAME,
            client_name: APP_CONFIG.CLIENT_NAME,
            subject: `Briefing Legal - ${APP_CONFIG.CLIENT_NAME} - ${new Date().toLocaleDateString('es-ES')}`,
            message: briefingContent,
            timestamp: new Date().toLocaleString('es-ES')
        };

        try {
            const response = await this.emailjs.send(
                EMAIL_CONFIG.SERVICE_ID,
                EMAIL_CONFIG.TEMPLATE_ID,
                templateParams
            );
            return response;
        } catch (error) {
            console.error('Error enviando email:', error);
            throw error;
        }
    }

    // Guardar archivo en GitHub
    async saveToGitHub(briefingContent, filename) {
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${GITHUB_CONFIG.FOLDER}/${filename}`;
        
        const content = btoa(unescape(encodeURIComponent(briefingContent))); // Codificar en base64
        
        const commitData = {
            message: `Nuevo briefing: ${filename}`,
            content: content,
            branch: GITHUB_CONFIG.BRANCH
        };

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_CONFIG.TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commitData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error de GitHub: ${errorData.message || response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error guardando en GitHub:', error);
            throw error;
        }
    }

    // Función principal para enviar briefing
    async sendBriefing(formData) {
        const briefingContent = this.formatBriefingData(formData);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `briefing-${APP_CONFIG.CLIENT_NAME.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.txt`;

        const results = {
            emailsSent: [],
            githubSaved: false,
            errors: []
        };

        try {
            // Enviar email al contratante
            try {
                await this.sendEmail(briefingContent, EMAIL_CONFIG.CONTRACTOR_EMAIL, APP_CONFIG.CLIENT_NAME);
                results.emailsSent.push('contratante');
            } catch (error) {
                results.errors.push(`Error enviando email al contratante: ${error.message}`);
            }

            // Enviar email al desarrollador
            try {
                await this.sendEmail(briefingContent, EMAIL_CONFIG.DEVELOPER_EMAIL, APP_CONFIG.DEVELOPER_NAME);
                results.emailsSent.push('desarrollador');
            } catch (error) {
                results.errors.push(`Error enviando email al desarrollador: ${error.message}`);
            }

            // Guardar en GitHub
            try {
                await this.saveToGitHub(briefingContent, filename);
                results.githubSaved = true;
            } catch (error) {
                results.errors.push(`Error guardando en GitHub: ${error.message}`);
            }

        } catch (error) {
            results.errors.push(`Error general: ${error.message}`);
        }

        return results;
    }
}

// Crear instancia global
window.briefingSender = new BriefingSender();

