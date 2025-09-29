/**
 * app.js
 * Este script maneja la lógica para un formulario de Web-to-Case dinámico.
 * 1. Obtiene datos (categorías, preguntas, recomendaciones) de una API de Salesforce.
 * 2. Puebla un menú desplegable de categorías.
 * 3. Muestra una recomendación y puebla un segundo menú de preguntas basado en la categoría seleccionada.
 */

// --- CONFIGURACIÓN ---
// Pega aquí la URL de la API que probaste en el navegador.
const apiUrl = 'https://crossborderxpressmx--dev.sandbox.my.site.com/apipublica/services/apexrest/PreguntasFAQ'; // ¡IMPORTANTE! Reemplaza esto con tu URL real del sitio público.

// Variable global para almacenar los datos de Salesforce una vez que se cargan.
let faqData = {};

// --- REFERENCIAS A ELEMENTOS DEL HTML ---
// Obtenemos los elementos del formulario con los que vamos a interactuar.
const categorySelect = document.getElementById('category-select');
const questionSelect = document.getElementById('question-select');
const recommendationBox = document.getElementById('recommendation-box');

// --- LÓGICA PRINCIPAL ---

/**
 * Función que se ejecuta cuando el contenido de la página se ha cargado por completo.
 * Su único trabajo es iniciar la obtención de datos de Salesforce.
 */
document.addEventListener('DOMContentLoaded', fetchFaqData);

/**
 * "Escucha" cualquier cambio que el usuario haga en el menú de categorías.
 * Cuando el usuario elige una categoría, esta función se activa.
 */
categorySelect.addEventListener('change', handleCategoryChange);


// --- FUNCIONES ---

/**
 * 1. Llama a la API de Salesforce usando fetch.
 * 2. Convierte la respuesta a formato JSON.
 * 3. Guarda los datos en la variable global `faqData`.
 * 4. Llama a la función para poblar el menú de categorías por primera vez.
 */
async function fetchFaqData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error de red: ${response.statusText}`);
        }
        faqData = await response.json();
        
        // Una vez que tenemos los datos, poblamos el primer menú.
        // NOTA: 'es' está fijo por ahora, pero podría hacerse dinámico (ej. detectar el idioma del navegador).
        populateCategories('es'); 
    } catch (error) {
        console.error("Error crítico al cargar datos de Salesforce:", error);
        categorySelect.innerHTML = '<option value="">Error al cargar categorías</option>';
    }
}

/**
 * 2. Llena el menú desplegable de categorías.
 * @param {string} lang - El idioma a usar ('es' o 'en').
 */
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

/**
 * 3. Se activa cuando el usuario selecciona una categoría.
 * Orquesta la actualización de la recomendación y el menú de preguntas.
 */
function handleCategoryChange() {
    const selectedCategory = categorySelect.value;
    const lang = 'es'; // Idioma fijo por ahora.

    if (selectedCategory && faqData[lang] && faqData[lang][selectedCategory]) {
        const categoryData = faqData[lang][selectedCategory];
        
        // Muestra la recomendación asociada
        displayRecommendation(categoryData.recommendation);
        
        // Puebla el segundo menú con las preguntas correspondientes
        populateQuestions(categoryData.questions);
    } else {
        // Si el usuario deselecciona, limpiamos la recomendación y el menú de preguntas.
        displayRecommendation('');
        populateQuestions([]);
    }
}

/**
 * Muestra el texto de la recomendación en su contenedor.
 * @param {string} text - El texto de la recomendación.
 */
function displayRecommendation(text) {
    recommendationBox.textContent = text || '';
}

/**
 * Llena el menú desplegable de preguntas.
 * @param {Array} questions - Una lista de objetos de pregunta.
 */
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