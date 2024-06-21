document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
  
    loginForm.addEventListener("submit", function(event) {
      event.preventDefault(); // Prevent the form from submitting
  
      // Clear any previous error messages
      clearErrors();
  
      // Validate email and password
      const accountEmail = document.getElementById("account_email").value.trim();
      const accountPassword = document.getElementById("account_password").value;
  
      let isValid = true;
  
      // Validate email
      if (!isValidEmail(accountEmail)) {
        isValid = false;
        displayError("emailError", "Please enter a valid email.");
      }
  
      // Validate password
      if (!isValidPassword(accountPassword)) {
        isValid = false;
        displayError("passwordError", "Please enter a valid password.");
      }
  
      // If all inputs are valid, submit the form
      if (isValid) {
        loginForm.submit();
      }
    });
  
    function isValidEmail(email) {
      // Basic email validation (you can expand this as needed)
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  
    function isValidPassword(password) {
      // Basic password validation (you can expand this as needed)
      return password.length >= 6; // Example: Password must be at least 6 characters
    }
  
    function displayError(elementId, errorMessage) {
      const errorElement = document.getElementById(elementId);
      if (errorElement) {
        errorElement.textContent = errorMessage;
      }
    }
  
    function clearErrors() {
      const errorElements = document.querySelectorAll(".error-message");
      errorElements.forEach(function(element) {
        element.textContent = "";
      });
    }
  });
