const apiUrl = 'https://crossborderxpressmx--dev.sandbox.my.site.com/apipublica/services/apexrest/PreguntasFAQ';
let faqData = {};

// We get references to these elements once for efficiency
const questionSelect = document.getElementById('question-select');
const recommendationBox = document.getElementById('recommendation-box');

document.addEventListener('DOMContentLoaded', () => {
    // Add the event listener once the DOM is loaded
    const categorySelectForListener = document.getElementById('category-select');
    if (categorySelectForListener) {
        categorySelectForListener.addEventListener('change', handleCategoryChange);
    }
    // Fetch the data
    fetchFaqData();
});

async function fetchFaqData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error de red: ${response.statusText}`);
        }
        faqData = await response.json();
        populateCategories('es'); 
    } catch (error) {
        console.error("Error crítico al cargar datos de Salesforce:", error);
        const categorySelect = document.getElementById('category-select');
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">Error al cargar categorías</option>';
        }
    }
}

function populateCategories(lang) {
    // Get a fresh reference to the category select element RIGHT BEFORE using it.
    // This can solve subtle timing issues.
    const categorySelect = document.getElementById('category-select');
    if (!categorySelect) {
        console.error("No se pudo encontrar 'category-select' al momento de poblar.");
        return; 
    }

    categorySelect.innerHTML = `<option value="">-- Selecciona una categoría --</option>`;
    
    const categories = faqData[lang];
    if (!categories) {
        console.error(`No se encontraron categorías para el idioma: ${lang}`);
        return;
    }

    for (const categoryName in categories) {
        const option = document.createElement('option');
        option.value = categoryName;
        option.textContent = categoryName;
        categorySelect.appendChild(option);
    }
}

function handleCategoryChange() {
    const categorySelect = document.getElementById('category-select');
    if (!categorySelect) return;

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
    if (recommendationBox) {
        recommendationBox.textContent = text || '';
    }
}

function populateQuestions(questions) {
    if (!questionSelect) return;
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