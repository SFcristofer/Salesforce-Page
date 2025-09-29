const apiUrl = 'https://crossborderxpressmx--dev.sandbox.my.site.com/apipublica/services/apexrest/PreguntasFAQ';
let faqData = {};

const questionSelect = document.getElementById('question-select');
const recommendationBox = document.getElementById('recommendation-box');

document.addEventListener('DOMContentLoaded', () => {
    const categorySelectForListener = document.getElementById('category-select');
    if (categorySelectForListener) {
        categorySelectForListener.addEventListener('change', handleCategoryChange);
    }
    fetchFaqData();
});

async function fetchFaqData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) { throw new Error(`Error de red: ${response.statusText}`); }
        faqData = await response.json();
        populateCategories(); // No language passed, it will figure it out
    } catch (error) {
        console.error("Error crítico al cargar datos de Salesforce:", error);
        const categorySelect = document.getElementById('category-select');
        if (categorySelect) { categorySelect.innerHTML = '<option value="">Error al cargar categorías</option>'; }
    }
}

function populateCategories() {
    const categorySelect = document.getElementById('category-select');
    if (!categorySelect) { console.error("No se pudo encontrar 'category-select'."); return; }

    let categories = faqData['es'];
    let langToUse = 'es';

    if (!categories || Object.keys(categories).length === 0) {
        console.warn("Datos para 'es' no encontrados o vacíos. Intentando con 'en'.");
        categories = faqData['en'];
        langToUse = 'en';
    }

    if (!categories || Object.keys(categories).length === 0) {
        console.error("No se encontraron datos de categorías para 'es' ni para 'en'.");
        categorySelect.innerHTML = '<option value="">No hay categorías</option>';
        return;
    }

    categorySelect.innerHTML = `<option value="">-- Selecciona una categoría --</option>`;
    for (const categoryName in categories) {
        const option = document.createElement('option');
        option.value = categoryName;
        option.dataset.lang = langToUse; // Store which language we ended up using
        option.textContent = categoryName;
        categorySelect.appendChild(option);
    }
}

function handleCategoryChange() {
    const categorySelect = document.getElementById('category-select');
    if (!categorySelect || categorySelect.selectedIndex < 1) {
        displayRecommendation('');
        populateQuestions([]);
        return;
    }

    const selectedOption = categorySelect.options[categorySelect.selectedIndex];
    const selectedCategory = selectedOption.value;
    const lang = selectedOption.dataset.lang; // Get the language from the option

    if (selectedCategory && lang && faqData[lang] && faqData[lang][selectedCategory]) {
        const categoryData = faqData[lang][selectedCategory];
        displayRecommendation(categoryData.recommendation);
        populateQuestions(categoryData.questions);
    } else {
        displayRecommendation('');
        populateQuestions([]);
    }
}

function displayRecommendation(text) {
    if (recommendationBox) { recommendationBox.textContent = text || ''; }
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
