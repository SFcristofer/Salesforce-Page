// Espera a que el formulario exista en la página
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Identificar el formulario y el botón
    const supportForm = document.getElementById('support-form');
    const submitButton = document.getElementById('submit-button');
    const statusMessage = document.getElementById('status-message');

    // 2. Escuchar el evento 'submit' del formulario
    supportForm.addEventListener('submit', async (event) => {
        
        // Prevenir que la página se recargue (comportamiento por defecto)
        event.preventDefault();

        // Deshabilitar el botón y mostrar un mensaje de carga
        submitButton.disabled = true;
        statusMessage.textContent = 'Enviando, por favor espera...';

        // 3. Recolectar los datos del formulario
        const caseData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            description: 'Esta es una descripción de prueba.',
            // ... aquí se recolectarían los valores de todos los otros campos ...
            rfc: 'XAXX010101000',
            razonSocial: 'Mi Empresa S.A. de C.V.',
            // Campos de archivo se llenarán después
            fileName: null,
            fileBodyBase64: null
        };

        // 4. Procesar el archivo si el usuario seleccionó uno
        const fileInput = document.getElementById('file-attachment');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            caseData.fileName = file.name;
            
            // Usamos una función para convertir el archivo a Base64
            try {
                caseData.fileBodyBase64 = await toBase64(file);
            } catch (error) {
                statusMessage.textContent = 'Error al leer el archivo.';
                submitButton.disabled = false;
                return; // Detiene el proceso si hay un error
            }
        }
        
        // 5. Llamar a la API de Salesforce
        try {
            const response = await fetch('https://crossborderxpressmx--dev.sandbox.my.site.com/apipublica/services/apexrest/TechWebCase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(caseData)
            });

            // 6. Manejar la respuesta de la API
            const result = await response.json();

            if (response.ok && result.status === 'success') {
                statusMessage.textContent = `¡Caso creado con éxito! Número de caso: ${result.caseNumber}`;
                supportForm.reset(); // Limpia el formulario
            } else {
                // Si Salesforce devuelve un error, lo mostramos
                statusMessage.textContent = `Error: ${result.message}`;
            }

        } catch (error) {
            // Si hay un error de red (ej. sin internet)
            statusMessage.textContent = 'Error de conexión. Por favor, intenta de nuevo.';
            console.error('Error en la llamada a la API:', error);
        } finally {
            // Vuelve a habilitar el botón al finalizar
            submitButton.disabled = false;
        }
    });
});

// Función auxiliar para convertir un archivo a Base64
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        // El resultado incluye un prefijo como "data:image/jpeg;base64,"
        // Salesforce solo necesita la parte después de la coma.
        const encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
        resolve(encoded);
    };
    reader.onerror = error => reject(error);
});