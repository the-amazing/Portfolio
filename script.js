const form = document.getElementById("contact-form");
const statusMessage = document.getElementById("form-status");
const submitButton = document.getElementById("submit-btn");

// Listen for the form submission
form.addEventListener("submit", async function (event) {

  // Prevent the default page reload/redirect
  event.preventDefault();

  // Show a loading message
  statusMessage.textContent = "Sending your message...";
  statusMessage.className = "";

  // Prevent multiple submissions while sending
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  // Collect all the form input values
  const formData = new FormData(form);

  try {
    // Send the data to Formspree
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    // Check if Formspree accepted the submission
    if (response.ok) {

      statusMessage.textContent =
        "Thank you! Your message has been sent successfully.";

      statusMessage.className = "success";

      // Clear the form only after success
      form.reset();

    } else {

      // Try to read the error returned by Formspree
      const result = await response.json();

      if (result.errors) {
        statusMessage.textContent = result.errors
          .map(error => error.message)
          .join(", ");
      } else {
        statusMessage.textContent =
          "Something went wrong. Please try again.";
      }

      statusMessage.className = "error";
    }

  } catch (error) {

    // Handle network or connection errors
    statusMessage.textContent =
      "Unable to send your message. Check your internet connection and try again.";

    statusMessage.className = "error";

  } finally {

    // Re-enable the button regardless of the result
    submitButton.disabled = false;
    submitButton.textContent = "Send Message";

  }

});