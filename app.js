// --- REFERENCIAS A ELEMENTOS DEL HTML --
const categorySelect = document.getElementById('category-select');

/**
 * Función que se ejecuta cuando el contenido de la página se ha cargado.
 * Su único trabajo es llamar a la función de prueba.
 */
document.addEventListener('DOMContentLoaded', test_populateCategories);

/**
 * PRUEBA: Llena el menú de categorías con datos de prueba, ignorando la API.
 */
function test_populateCategories() {
    // Si ves esto, el script está funcionando.
    console.log("Ejecutando prueba con datos locales...");

    if (!categorySelect) {
        console.error("Error Crítico: No se encontró el elemento 'category-select'.");
        return;
    }

    categorySelect.innerHTML = `<option value="">-- Selecciona una categoría de prueba --</option>`;
    
    const testCategories = {
        "Prueba 1": {},
        "Prueba 2": {},
        "Prueba 3": {}
    };

    for (const categoryName in testCategories) {
        const option = document.createElement('option');
        option.value = categoryName;
        option.textContent = categoryName;
        categorySelect.appendChild(option);
    }

    console.log("Prueba finalizada. El menú debería tener 4 opciones.");
}
