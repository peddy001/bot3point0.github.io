const USERNAME = "admin";
const PASSWORD = "1234";
const history = [];
let chart = null;
let multipliers = [];

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const error = document.getElementById("login-error");

  if (user === USERNAME && pass === PASSWORD) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("predictor-section").style.display = "block";
    error.textContent = "";
  } else {
    error.textContent = "Invalid credentials.";
  }
}

function collectMultipliers() {
  multipliers = [];
  let count = prompt("How many multipliers do you want to enter? (5–10)");
  count = parseInt(count);

  if (isNaN(count) || count < 5 || count > 10) {
    alert("Please enter a number between 5 and 10.");
    return;
  }

  for (let i = 1; i <= count; i++) {
    let value = parseFloat(prompt(`Enter multiplier #${i}:`));
    if (isNaN(value)) {
      alert("Invalid number. Try again.");
      i--;
    } else {
      multipliers.push(value);
    }
  }

  document.getElementById("entered-values").textContent =
    "Entered multipliers: " + multipliers.join(", ");
}

function predict() {
  const predictionText = document.getElementById("prediction");

  if (multipliers.length < 5 || multipliers.length > 10) {
    predictionText.textContent = "Please enter 5 to 10 valid multipliers.";
    return;
  }

  const avg = multipliers.reduce((a, b) => a + b, 0) / multipliers.length;
  const aboveThreshold = multipliers.filter(m => m > 1.3).length;
  const result = (avg > 1.5 && aboveThreshold >= Math.ceil(multipliers.length / 2))
    ? "Safe"
    : "Risky";

  const time = new Date().toLocaleString();
  history.unshift({ multipliers: [...multipliers], avg: avg.toFixed(2), result, time });

  predictionText.textContent = `Prediction: ${result} (Avg: ${avg.toFixed(2)})`;

  updateHistory();
  renderChart(multipliers);
}

function updateHistory() {
  const list = document.getElementById("history");
  list.innerHTML = "";
  history.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.time} – Avg: ${entry.avg} → ${entry.result}`;
    list.appendChild(li);
  });
}

function renderChart(data) {
  const ctx = document.getElementById('lineChart').getContext('2d');

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, i) => `#${i + 1}`),
      datasets: [{
        label: 'Multiplier History',
        data: data,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 5,
        fill: true,
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Multiplier'
          }
        }
      }
    }
  });
}

function logout() {
  document.getElementById("login-section").style.display = "block";
  document.getElementById("predictor-section").style.display = "none";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("entered-values").textContent = "";
  document.getElementById("prediction").textContent = "";
  document.getElementById("history").innerHTML = "";
  if (chart) chart.destroy();
  history.length = 0;
  multipliers = [];
}
