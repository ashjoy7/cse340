// public/js/inventory-validation.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addInventoryForm');

    form.addEventListener('submit', function(event) {
        const make = document.getElementById('inv_make');
        const model = document.getElementById('inv_model');
        const year = document.getElementById('inv_year');
        const price = document.getElementById('inv_price');
        const classification = document.getElementById('classificationList');
        const imagePath = document.getElementById('inv_image_path');
        const thumbnailPath = document.getElementById('inv_thumbnail_path');

        let isValid = true;

        // Clear previous error messages
        clearErrorMessages();

        // Validate make
        if (!make.value.trim()) {
            showError(make, 'Make is required.');
            isValid = false;
        }

        // Validate model
        if (!model.value.trim()) {
            showError(model, 'Model is required.');
            isValid = false;
        }

        // Validate year
        if (!year.value.trim() || !isNumeric(year.value) || year.value.length !== 4) {
            showError(year, 'Year must be a valid 4-digit number.');
            isValid = false;
        }

        // Validate price
        if (!price.value.trim() || !isNumeric(price.value)) {
            showError(price, 'Price must be a valid number.');
            isValid = false;
        }

        // Validate classification
        if (!classification.value.trim()) {
            showError(classification, 'Classification is required.');
            isValid = false;
        }

        // Validate image path
        if (!imagePath.value.trim()) {
            showError(imagePath, 'Image path is required.');
            isValid = false;
        }

        // Validate thumbnail path
        if (!thumbnailPath.value.trim()) {
            showError(thumbnailPath, 'Thumbnail path is required.');
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault();
        }
    });

    function isNumeric(value) {
        return /^-?\d+$/.test(value);
    }

    function showError(input, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerText = message;
        input.parentNode.appendChild(errorElement);
        input.classList.add('error');
    }

    function clearErrorMessages() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(function(errorMessage) {
            errorMessage.remove();
        });

        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(function(errorInput) {
            errorInput.classList.remove('error');
        });
    }
});
