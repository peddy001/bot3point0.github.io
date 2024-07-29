document.addEventListener("DOMContentLoaded", function () {
  const analysisForm = document.getElementById("analysisForm");
  const generateFieldsButton = document.getElementById("generateFields");
  const cloudFieldsContainer = document.getElementById("cloudFields");
  const analyzeCloudsButton = document.getElementById("analyzeClouds");
  const resultContainer = document.getElementById("result");

  // Generate input fields based on the number of clouds
  generateFieldsButton.addEventListener("click", function () {
    const numberOfClouds = document.getElementById("numberOfClouds").value;
    cloudFieldsContainer.innerHTML = ""; // Clear existing fields
    for (let i = 0; i < numberOfClouds; i++) {
      const input = document.createElement("input");
      input.type = "number";
      input.placeholder = `Cloud ${i + 1} value`;
      input.className = "cloudValue";
      cloudFieldsContainer.appendChild(input);
    }
    analyzeCloudsButton.classList.remove("hidden"); // Show the analyze button
  });

  // Perform cloud analysis on form submission
  analysisForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    const cloudValues = Array.from(document.getElementsByClassName("cloudValue"))
                             .map((input) => parseFloat(input.value));
    const analysisType = "Simple"; // Example analysis type
    const { message } = performAnalysis(cloudValues, analysisType);
    resultContainer.innerText = message; // Display the result
  });

  // Function to perform the cloud analysis
  function performAnalysis(cloudValues, analysisType) {
    // Validate input values
    if (!Array.isArray(cloudValues) || cloudValues.length === 0) {
      return {
        message: "No valid cloud values provided.",
        condition: "Unknown"
      };
    }

    // Ensure all values are valid numbers
    const validCloudValues = cloudValues.filter((value) => !isNaN(value) && value !== null && value !== undefined);
    if (validCloudValues.length !== cloudValues.length) {
      console.warn("Some invalid cloud values were filtered out.");
    }

    // Log the valid cloud values for debugging
    console.log("Performing Analysis with cloud values:", validCloudValues);

    // Count how many values are less than 1.4
    const countBelowThreshold = validCloudValues.filter((value) => value < 1.4).length;

    // Determine the weather condition based on whether most values are below 1.4
    let weatherCondition;
    if (countBelowThreshold > validCloudValues.length / 2) {
      // More than half of the values are below 1.4
      weatherCondition = "Weather is Bad 🌧️";
    } else {
      // Less than or equal to half of the values are below 1.4
      weatherCondition = "Weather is Fine ☀️";
    }

    // Construct the result message
    const message = `Performed ${analysisType} analysis on ${validCloudValues.length} cloud values. ${weatherCondition}`;

    // Return the analysis result and weather condition
    return {
      message,
      condition: weatherCondition
    };
  }
});
