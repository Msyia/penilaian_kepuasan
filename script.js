const ratingButtonsContainer = document.getElementById("ratingButtons");
const ratingInput = document.getElementById("rating");
const form = document.getElementById("feedbackForm");
const chartPie = document.getElementById("chartCanvasPie");
const chartBar = document.getElementById("chartCanvasBar");

let currentData = JSON.parse(localStorage.getItem("feedbackData")) || [];

function renderRatingButtons() {
  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.type = "button";
    btn.className = "btn rating-btn";
    btn.dataset.value = i;
    btn.addEventListener("click", () => {
      ratingInput.value = i;
      updateSelectedButton(i);
    });
    ratingButtonsContainer.appendChild(btn);
  }
}

function updateSelectedButton(value) {
  const buttons = ratingButtonsContainer.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.classList.toggle("selected", parseInt(btn.dataset.value) === parseInt(value));
  });
}

function renderCharts(data) {
  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  data.forEach(item => {
    const rating = item.rating;
    if (ratingCounts[rating] !== undefined) {
      ratingCounts[rating]++;
    }
  });

  const labels = Object.keys(ratingCounts);
  const counts = Object.values(ratingCounts);
  const chartColors = ["#fef08a", "#fde047", "#facc15", "#eab308", "#ca8a04"];

  new Chart(chartPie, {
    type: "pie",
    data: {
      labels: labels.map(r => `Rating ${r}`),
      datasets: [{
        data: counts,
        backgroundColor: chartColors
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });

  new Chart(chartBar, {
    type: "bar",
    data: {
      labels: labels.map(r => `Rating ${r}`),
      datasets: [{
        label: "Jumlah Rating",
        data: counts,
        backgroundColor: chartColors
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true, precision: 0 }
      }
    }
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const rating = parseInt(ratingInput.value);
  const saran = document.getElementById("saran").value.trim();
  if (!rating || !saran) return;

  currentData.push({ rating, saran });
  localStorage.setItem("feedbackData", JSON.stringify(currentData));
  alert("Terima kasih atas penilaiannya!");
  form.reset();
  updateSelectedButton(null);
  location.reload();
});

renderRatingButtons();
renderCharts(currentData);
