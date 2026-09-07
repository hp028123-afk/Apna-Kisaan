document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission if validation fails
    if (this.checkValidity() === false) {
      event.stopPropagation(); // Stop the event from propagating further
    }
    this.classList.add("was-validated"); // Add 'was-validated' class to enable Bootstrap's styling
  }, false);