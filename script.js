document.addEventListener("DOMContentLoaded", function () {
  const loginLink = document.getElementById("loginLink");
  const cloudAnalysisLink = document.getElementById("cloudAnalysisLink");
  const historyGraphsLink = document.getElementById("historyGraphsLink");
  const clearHistoryButton = document.getElementById("clearHistoryButton");

  const loginPage = document.getElementById("loginPage");
  const cloudAnalysisPage = document.getElementById("cloudAnalysisPage");
  const historyGraphsPage = document.getElementById("historyGraphsPage");

  const graphsHistoryContainer = document.getElementById("graphsHistory");

  if (!graphsHistoryContainer) {
    console.error('Element with ID "graphsHistory" not found.');
    return; // Exit if the element is not found
  }

  let isAuthenticated = false;

  loginLink.addEventListener("click", () => showPage(loginPage));
  cloudAnalysisLink.addEventListener("click", () => {
    if (isAuthenticated) {
      showPage(cloudAnalysisPage);
    } else {
      alert("Please login first.");
      showPage(loginPage);
    }
  });
  historyGraphsLink.addEventListener("click", () => {
    if (isAuthenticated) {
      showPage(historyGraphsPage);
      displayGraphsHistory();
    } else {
      alert("Please login first.");
      showPage(loginPage);
    }
  });

  clearHistoryButton.addEventListener("click", () => {
    localStorage.removeItem("graphsHistory");
    displayGraphsHistory();
  });

  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    // Simple authentication check
    if (username === "GHOST" && password === "Discipline") {
      isAuthenticated = true;
      showPage(cloudAnalysisPage);
    } else {
      alert("Invalid credentials.");
    }
  });

  const analysisForm = document.getElementById("analysisForm");
  const generateFieldsButton = document.getElementById("generateFields");
  const cloudFieldsContainer = document.getElementById("cloudFields");
  const analyzeCloudsButton = document.getElementById("analyzeClouds");
  const resetButton = document.getElementById("resetButton");
  const cloudResult = document.getElementById("cloudResult");
  const cloudBarGraphCanvas = document.getElementById("cloudBarGraph");

  generateFieldsButton.addEventListener("click", function () {
    const numberOfClouds = document.getElementById("numberOfClouds").value;
    cloudFieldsContainer.innerHTML = "";
    for (let i = 0; i < numberOfClouds; i++) {
      const input = document.createElement("input");
      input.type = "number";
      input.placeholder = `Cloud ${i + 1} value`;
      input.className = "cloudValue";
      cloudFieldsContainer.appendChild(input);
    }
    analyzeCloudsButton.classList.remove("hidden");
  });

  analyzeCloudsButton.addEventListener("click", function (event) {
    event.preventDefault();
    const cloudValues = Array.from(
      document.getElementsByClassName("cloudValue")
    ).map((input) => parseFloat(input.value));
    const analysisType = document.getElementById("analysisType").value;
    const dateTime = new Date().toLocaleString();

    // Perform analysis and display result
    const resultText = performAnalysis(cloudValues, analysisType);
    cloudResult.innerText = resultText;

    // Generate and display bar graph
    generateBarGraph(cloudBarGraphCanvas, cloudValues);

    // Store graph data in localStorage
    storeGraphData(cloudValues, dateTime);

    // Show reset button and hide analyze button
    resetButton.classList.remove("hidden");
    analyzeCloudsButton.classList.add("hidden");
  });

  resetButton.addEventListener("click", function () {
    cloudFieldsContainer.innerHTML = "";
    cloudResult.innerHTML = "";

    // Clear the bar graph
    const ctx = cloudBarGraphCanvas.getContext("2d");
    ctx.clearRect(0, 0, cloudBarGraphCanvas.width, cloudBarGraphCanvas.height);

    // Remove the chart instance if it exists
    if (cloudBarGraphCanvas.chart) {
      cloudBarGraphCanvas.chart.destroy();
      delete cloudBarGraphCanvas.chart;
    }

    // Show the analyze button
    analyzeCloudsButton.classList.remove("hidden");
  });

  function showPage(page) {
    loginPage.classList.add("hidden");
    cloudAnalysisPage.classList.add("hidden");
    historyGraphsPage.classList.add("hidden");
    page.classList.remove("hidden");
  }

function performAnalysis(cloudValues, analysisType) {
  // Log cloud values to check what we're working with
  console.log("Cloud Values:", cloudValues);
  
  // Count how many values exceed the threshold
  const threshold = 1.4;
  const countAboveThreshold = cloudValues.filter((value) => value > threshold).length;

  // Log the count for debugging
  console.log(`Count above ${threshold}:`, countAboveThreshold);

  // Determine the weather condition based on the count
  let weatherCondition = "Weather condition not determined.";
  const minCountForGoodWeather = 5;

  if (countAboveThreshold >= minCountForGoodWeather) {
    weatherCondition = "Weather is Fine ☀️";
  } else {
    weatherCondition = "Weather is Bad 🌧️";
  }

  // Return the analysis result
  return `Performed ${analysisType} analysis on ${cloudValues.length} clouds. ${weatherCondition}`;
}

    // Add the analysis type and weather condition to the result
    return `Performed ${analysisType} analysis on ${cloudValues.length} clouds. ${weatherCondition}`;
  }

  function generateBarGraph(canvas, values) {
    if (canvas.chart) {
      canvas.chart.destroy();
    }

    const chart = new Chart(canvas, {
      type: "bar",
      data: {
        labels: values.map((_, index) => `Cloud ${index + 1}`),
        datasets: [
          {
            label: "Cloud Values",
            data: values,
            backgroundColor: values.map((value) => {
              if (value >= 1 && value < 2) return "blue";
              if (value >= 2 && value < 10) return "purple";
              if (value >= 10 && value <= 100) return "pink";
              return "grey"; // default color
            })
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    canvas.chart = chart;
  }

  function storeGraphData(values, dateTime) {
    const graphsHistory =
      JSON.parse(localStorage.getItem("graphsHistory")) || [];
    graphsHistory.push({ values, dateTime });
    localStorage.setItem("graphsHistory", JSON.stringify(graphsHistory));
  }

  function displayGraphsHistory() {
    graphsHistoryContainer.innerHTML = "";
    const graphsHistory =
      JSON.parse(localStorage.getItem("graphsHistory")) || [];

    if (!Array.isArray(graphsHistory)) {
      console.error("Invalid format in localStorage for graphsHistory.");
      return;
    }

    graphsHistory.forEach((graph, index) => {
      if (!graph.values || !Array.isArray(graph.values)) {
        console.error(`Invalid data format for graph ${index + 1}.`);
        return;
      }

      const graphContainer = document.createElement("div");
      graphContainer.className = "graph-container history-graph";

      const title = document.createElement("div");
      title.className = "graph-title";
      title.innerText = `Graph ${index + 1} - ${graph.dateTime}`;
      graphContainer.appendChild(title);

      const canvas = document.createElement("canvas");
      canvas.className = "history-graph-canvas";
      graphContainer.appendChild(canvas);

      graphsHistoryContainer.appendChild(graphContainer);

      // Render the graph
      new Chart(canvas, {
        type: "bar",
        data: {
          labels: graph.values.map((_, index) => `Cloud ${index + 1}`),
          datasets: [
            {
              label: "Cloud Values",
              data: graph.values,
              backgroundColor: graph.values.map((value) => {
                if (value >= 1 && value < 2) return "blue";
                if (value >= 2 && value < 10) return "purple";
                if (value >= 10 && value <= 100) return "pink";
                return "grey"; // default color
              })
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  }
});
