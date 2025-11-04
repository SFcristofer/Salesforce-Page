// --- CONFIGURACIÓN ---
const apiUrl = 'https://crossborderxpressmx.my.site.com/apipublica/services/apexrest/PreguntasFAQ';
 
// Variable para guardar los datos de Salesforce
let faqData = {}; 
 
// Referencias a los elementos del formulario
const categorySelect = document.getElementById('category-select');
const questionSelect = document.getElementById('question-select');
const recommendationBox = document.getElementById('recommendation-box');
 
// --- LÓGICA PRINCIPAL ---
// Cuando la página se carga, trae los datos de la API
document.addEventListener('DOMContentLoaded', fetchFaqData);
// Cuando el usuario cambia de categoría, actualizar recomendaciones y preguntas
categorySelect.addEventListener('change', handleCategoryChange);
 
// --- FUNCIONES ---
async function fetchFaqData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);
        faqData = await response.json();
        populateCategories('es'); // // Idioma Español o puedes usar “en” para ingles
    } catch (error) {
        console.error("Error al cargar datos de Salesforce:", error);
        categorySelect.innerHTML = '<option value="">Error al cargar categorías</option>';
    }
}
 
// Llena el menú de categorías
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
 
// Actualiza recomendaciones y preguntas según la categoría seleccionada
function handleCategoryChange() {
    const selectedCategory = categorySelect.value;
    const lang = 'es'; // Idioma Español o puedes usar “en” para ingles
 
    if (selectedCategory && faqData[lang] && faqData[lang][selectedCategory]) {
        const categoryData = faqData[lang][selectedCategory];
        displayRecommendation(categoryData.recommendation);
        populateQuestions(categoryData.questions);
    } else {
        displayRecommendation('');
        populateQuestions([]);
    }
}
 
// Muestra la recomendación en el formulario
function displayRecommendation(text) {
    recommendationBox.textContent = text || '';
}
 
// Llena el menú de preguntas específicas
function populateQuestions(questions) {
    questionSelect.innerHTML = `<option value="">-- Selecciona una pregunta --</option>`;
    if (questions && questions.length > 0) {
        questions.forEach(q => {
            const option = document.createElement('option');
            option.value = q.question;
            option.textContent = q.question;
            questionSelect.appendChild(option);
        });
    }
}
