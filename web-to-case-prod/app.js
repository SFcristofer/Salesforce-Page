// --- CONFIGURACIÓN ---
const apiUrl = 'https://crossborderxpressmx.my.site.com/apipublica/services/apexrest/PreguntasFAQ';

let faqData = {}; // Variable para guardar los datos de Salesforce

const categorySelect = document.getElementById('category-select');
const questionSelect = document.getElementById('question-select');
const recommendationBox = document.getElementById('recommendation-box');


// --- LÓGICA PRINCIPAL ---
document.addEventListener('DOMContentLoaded', fetchFaqData);
categorySelect.addEventListener('change', handleCategoryChange);


// --- FUNCIONES ---
async function fetchFaqData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);
        faqData = await response.json();
        populateCategories('es'); // Por defecto, usamos español
    } catch (error) {
        console.error("Error al cargar datos de Salesforce:", error);
        categorySelect.innerHTML = '<option value="">Error al cargar categorías</option>';
    }
}

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