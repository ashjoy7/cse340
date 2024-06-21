document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addClassificationForm');
    const classificationNameInput = document.getElementById('classification_name');
    const classificationNameError = document.getElementById('classificationNameError');

    form.addEventListener('submit', function(event) {
        if (!isValidClassificationName(classificationNameInput.value)) {
            classificationNameError.textContent = 'Classification name cannot contain spaces or special characters.';
            event.preventDefault();
        } else {
            classificationNameError.textContent = '';
        }
    });

    function isValidClassificationName(name) {
        return /^[a-zA-Z0-9\-_]+$/.test(name);
    }
});
