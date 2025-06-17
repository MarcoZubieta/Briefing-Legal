// =============================
// main.js
// Funciones para exportar a PDF y TXT
// =============================

// Esperar a que el DOM esté listo
window.addEventListener('DOMContentLoaded', function () {
    // Obtener referencias a los elementos del formulario y botones
    const form = document.getElementById('briefingForm');
    const exportPdfButton = document.getElementById('exportPdfButton');
    const exportTxtButton = document.getElementById('exportTxtButton');
    const txtModal = document.getElementById('txtModal');
    const txtPreview = document.getElementById('txtPreview');
    const closeTxtModal = document.getElementById('closeTxtModal');
    const downloadTxtButton = document.getElementById('downloadTxtButton');
    const statusMessage = document.getElementById('statusMessage');
    const confirmationTimestampInput = form.querySelector('input[name="confirmation_timestamp"]');

    // =============================
    // Función para obtener los datos del formulario
    // =============================
    function getFormData() {
        const data = {};
        // Radios seleccionados
        form.querySelectorAll('input[type="radio"]:checked').forEach(radio => { data[radio.name] = radio.value; });
        // Checkboxes seleccionados
        const checkboxGroups = {};
        form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            if (!checkboxGroups[cb.name]) checkboxGroups[cb.name] = [];
            if (cb.checked) checkboxGroups[cb.name].push(cb.value);
        });
        Object.keys(checkboxGroups).forEach(groupName => {
            data[groupName] = checkboxGroups[groupName].length > 0 ? checkboxGroups[groupName] : false;
        });
        // Textareas y campos de texto
        form.querySelectorAll('textarea, input[type="text"]').forEach(input => {
            if(!data.hasOwnProperty(input.name)) { data[input.name] = input.value; }
        });
        data.client_name = "SANTIAGO PALACIOS";
        return data;
    }

    // =============================
    // Función para validar campos requeridos
    // =============================
    function validateRequiredFields() {
        const requiredRadioGroups = [
            'confirm_fields', 'excel_export', 'data_migration',
            'user_roles', 'chain_of_custody', 'architecture_model', 
            'company_size', 'mvp_scope', 'collaboration_model', 
            'budget_range', 'visual_style'
        ];
        if (!form.querySelector('input[name="project_purpose"]:checked')) {
             statusMessage.style.color = '#ff6b6b';
             statusMessage.textContent = `Por favor, complete la sección: "🎯 1. Enfoque Estratégico del Proyecto"`;
             return false;
        }
        for (const groupName of requiredRadioGroups) {
            if (!form.querySelector(`input[name="${groupName}"]:checked`)) {
                const fieldset = form.querySelector(`input[name="${groupName}"]`).closest('fieldset');
                if (fieldset) {
                   const legend = fieldset.querySelector('legend').textContent;
                   const questionGroup = form.querySelector(`input[name="${groupName}"]`).closest('.question-group');
                   const questionTitle = questionGroup ? questionGroup.querySelector('.question-title').textContent : legend.trim();
                   statusMessage.style.color = '#ff6b6b';
                   statusMessage.textContent = `Por favor, responda la pregunta: "${questionTitle}"`;
                   return false;
                }
            }
        }
        statusMessage.textContent = '';
        return true;
    }

    // =============================
    // Función para formatear los datos como texto plano
    // =============================
    function formatDataAsText(data) {
        let txtContent = "Respuestas del Briefing - Gestor Legal\n=========================================\n\n";
        for (const key in data) {
            let formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            let formattedValue = Array.isArray(data[key]) ? data[key].join(', ') : (data[key] || 'No seleccionado');
            txtContent += `${formattedKey}: ${formattedValue}\n`;
        }
        return txtContent;
    }

    // =============================
    // Exportar a PDF usando jsPDF
    // =============================
    exportPdfButton.addEventListener('click', function() {
        if (!validateRequiredFields()) { return; }
        // Obtener los datos del formulario
        const data = getFormData();
        // Formatear los datos como texto
        const txtContent = formatDataAsText(data);
        // Crear un nuevo documento PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        // Dividir el texto en líneas para que quepa en la página
        const lines = doc.splitTextToSize(txtContent, 180); // 180mm de ancho
        doc.setFont('courier', 'normal');
        doc.setFontSize(11);
        doc.text(lines, 15, 20); // 15mm de margen izquierdo, 20mm de margen superior
        // Guardar el PDF
        doc.save('briefing-respuestas.pdf');
    });

    // =============================
    // Mostrar modal con vista previa TXT y permitir descarga
    // =============================
    exportTxtButton.addEventListener('click', function() {
        if (!validateRequiredFields()) { return; }
        // Obtener los datos y formatearlos como texto
        const data = getFormData();
        const txtContent = formatDataAsText(data);
        // Mostrar el modal y poner el texto en el textarea
        txtPreview.value = txtContent;
        txtModal.style.display = 'flex';
    });

    // Cerrar el modal al hacer clic en la X
    closeTxtModal.addEventListener('click', function() {
        txtModal.style.display = 'none';
    });

    // Descargar el archivo TXT desde el modal
    downloadTxtButton.addEventListener('click', function() {
        const content = txtPreview.value;
        const a = document.createElement('a');
        const file = new Blob([content], { type: 'text/plain' });
        a.href = URL.createObjectURL(file);
        a.download = 'briefing-respuestas.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    });
}); 