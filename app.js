// --- CONFIGURACIÓN ---
// Pega aquí la URL de la API que te dio el administrador de Salesforce
const apiUrl = 'https://tu-empresa-dev-ed.my.site.com/apipublica/services/apexrest/PreguntasFAQ'; 

// Variable para guardar los datos que vienen de Salesforce
let faqData = {};

// --- OBTENER ELEMENTOS DEL HTML ---
const categorySelect = document.getElementById('category-select');
const questionSelect = document.getElementById('question-select');
const recommendationBox = document.getElementById('recommendation-box');

// --- LÓGICA PRINCIPAL ---

// 1. Cuando la página carga, llamamos a la API de Salesforce
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(apiUrl);
        faqData = await response.json();
        
        // 2. Una vez que tenemos los datos, poblamos el primer menú
        populateCategories('es'); // Por defecto, usamos español
    } catch (error) {
        console.error("Error al cargar datos de Salesforce:", error);
        categorySelect.innerHTML = '<option value="">Error al cargar categorías</option>';
    }
});

// 3. Función para llenar el menú de categorías
function populateCategories(lang) {
    categorySelect.innerHTML = `<option value="">-- Selecciona una categoría --</option>`;
    
    const categories = faqData[lang];
    for (const categoryName in categories) {
        const option = document.createElement('option');
        option.value = categoryName;
        option.textContent = categoryName;
        categorySelect.appendChild(option);
    }
}

// 4. "Escuchamos" cuando el usuario elige una categoría
categorySelect.addEventListener('change', () => {
    const selectedCategory = categorySelect.value;
    const lang = 'es'; // Asumimos español

    if (selectedCategory) {
        // 5. Mostramos la recomendación y poblamos las preguntas
        const categoryData = faqData[lang][selectedCategory];
        recommendationBox.textContent = categoryData.recommendation || '';
        populateQuestions(categoryData.questions);
    } else {
        // Si el usuario deselecciona, limpiamos todo
        recommendationBox.textContent = '';
        questionSelect.innerHTML = '<option value="">Selecciona una categoría primero</option>';
    }
});

// 6. Función para llenar el menú de preguntas
function populateQuestions(questions) {
    questionSelect.innerHTML = `<option value="">-- Selecciona una pregunta --</option>`;
    
    questions.forEach(q => {
        const option = document.createElement('option');
        option.value = q.question;
        option.textContent = q.question;
        questionSelect.appendChild(option);
    });
}