// --- CONFIGURACIÓN ---
const apiUrl = 'https://crossborderxpressmx--dev.sandbox.my.site.com/apipublica/services/apexrest/PreguntasFAQ';

let faqData = {};

const categorySelect = document.getElementById('category-select');
const questionSelect = document.getElementById('question-select');
const recommendationBox = document.getElementById('recommendation-box');


// --- LÓGICA PRINCIPAL ---
document.addEventListener('DOMContentLoaded', fetchFaqData);
categorySelect.addEventListener('change', handleCategoryChange);


// --- FUNCIONES ---
async function fetchFaqData() {
    try {
        console.log("1. Intentando llamar a la API...");
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);
        faqData = await response.json();
        
        // ¡LÍNEA DE DIAGNÓSTICO 1!
        console.log("2. ¡Éxito! Datos recibidos y guardados:", faqData);
        
        populateCategories('es');
    } catch (error) {
        console.error("ERROR CRÍTICO en fetchFaqData:", error);
        categorySelect.innerHTML = '<option value="">Error al cargar categorías</option>';
    }
}

function populateCategories(lang) {
    // ¡LÍNEA DE DIAGNÓSTICO 2!
    console.log("3. Entrando a la función para poblar categorías...");
    
    categorySelect.innerHTML = `<option value="">-- Selecciona una categoría --</option>`;
    const categories = faqData[lang];

    // ¡LÍNEA DE DIAGNÓSTICO 3!
    console.log("4. Las categorías a procesar son:", categories);

    for (const categoryName in categories) {
        const option = document.createElement('option');
        option.value = categoryName;
        option.textContent = categoryName;
        categorySelect.appendChild(option);
        
        // ¡LÍNEA DE DIAGNÓSTICO 4!
        console.log(`5. Agregando opción: ${categoryName}`);
    }
}

function handleCategoryChange() {
    const selectedCategory = categorySelect.value;
    const lang = 'es';

    if (selectedCategory && faqData[lang] && faqData[lang][selectedCategory]) {
        const categoryData = faqData[lang][selectedCategory];
        displayRecommendation(categoryData.recommendation);
        populateQuestions(categoryData.questions);
    } else {
        displayRecommendation('');
        populateQuestions([]);
    }
}

function displayRecommendation(text) {
    recommendationBox.textContent = text || '';
}

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