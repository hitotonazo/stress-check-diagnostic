const R2_BASE = "/r2/";

function resolveAssetPath(path) {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  return R2_BASE + path.replace(/^\/+/, "");
}

function applyR2Images() {
  document.querySelectorAll("[data-r2-src]").forEach(el => {
    el.src = resolveAssetPath(el.dataset.r2Src);
  });
}

let currentAnswers = {};

document.addEventListener("DOMContentLoaded", () => {
  applyR2Images();
  renderQuestions();
  attachEventListeners();
});

function renderQuestions() {
  const container = document.getElementById("questions-container");
  container.innerHTML = "";

  QUESTIONS.forEach(q => {
    const block = document.createElement("div");
    block.className = "question-block";

    const label = document.createElement("label");
    label.className = "question-label";
    label.textContent = `${q.id}. ${q.text}`;

    const likert = document.createElement("div");
    likert.className = "likert-scale";

    const scale = [
      { value: 1, label: "全く当てはまらない" },
      { value: 2, label: "ほぼ当てはまらない" },
      { value: 3, label: "どちらともいえない" },
      { value: 4, label: "ほぼ当てはまる" },
      { value: 5, label: "非常に当てはまる" }
    ];

    scale.forEach(s => {
      const option = document.createElement("label");
      option.className = "likert-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${q.id}`;
      input.value = s.value;
      input.required = true;

      const labelText = document.createElement("label");
      labelText.style.margin = "0";
      labelText.style.minWidth = "auto";
      labelText.textContent = s.value;

      option.appendChild(input);
      option.appendChild(labelText);
      likert.appendChild(option);
    });

    block.appendChild(label);
    block.appendChild(likert);
    container.appendChild(block);
  });
}

function attachEventListeners() {
  document.getElementById("start-btn").addEventListener("click", () => {
    document.getElementById("intro-section").style.display = "none";
    document.getElementById("form-section").style.display = "block";
    currentAnswers = {};
  });

  document.getElementById("back-btn").addEventListener("click", () => {
    document.getElementById("form-section").style.display = "none";
    document.getElementById("intro-section").style.display = "block";
  });

  document.getElementById("diagnostic-form").addEventListener("submit", (e) => {
    e.preventDefault();
    handleSubmit();
  });

  document.getElementById("restart-btn").addEventListener("click", () => {
    document.getElementById("result-section").style.display = "none";
    document.getElementById("intro-section").style.display = "block";
  });
}

function handleSubmit() {
  const form = document.getElementById("diagnostic-form");
  const formData = new FormData(form);

  currentAnswers = {};
  for (let [key, value] of formData) {
    const qId = key.replace("q", "");
    currentAnswers[qId] = parseInt(value);
  }

  const result = determineResult();
  displayResult(result);

  document.getElementById("form-section").style.display = "none";
  document.getElementById("result-section").style.display = "block";
  document.querySelector(".result-section").scrollIntoView({ behavior: "smooth" });
}

function determineResult() {
  const isAbnormal = checkAbnormalCondition();
  return isAbnormal ? ABNORMAL_RESULT : determineNormalResult();
}

function checkAbnormalCondition() {
  const targetQuestions = [2, 3, 6, 7, 8];
  const highScoreCount = targetQuestions.filter(qId => currentAnswers[qId] >= 4).length;
  const additionalScore = (currentAnswers[1] || 0) + (currentAnswers[4] || 0);
  return highScoreCount >= 4 && additionalScore >= 7;
}

function determineNormalResult() {
  const total = Object.values(currentAnswers).reduce((a, b) => a + b, 0);
  const independenceScore = (currentAnswers[3] || 0) + (currentAnswers[7] || 0);
  const stabilityScore = (currentAnswers[6] || 0) + (currentAnswers[4] || 0);

  if (independenceScore >= 8 && total >= 30) {
    return NORMAL_RESULTS.stable;
  } else if (stabilityScore >= 8 || total >= 35) {
    return NORMAL_RESULTS.balance;
  } else {
    return NORMAL_RESULTS.sensitive;
  }
}

function displayResult(result) {
  const titleEl = document.getElementById("result-title");
  if (result.subtitle) {
    titleEl.textContent = result.subtitle + " - " + result.title;
  } else {
    titleEl.textContent = result.title;
  }

  document.getElementById("result-code").textContent = result.code;
  document.getElementById("result-description").innerHTML = `<p>${result.description}</p>`;

  const featuresList = document.getElementById("features-list");
  featuresList.innerHTML = "";
  (result.features || []).forEach(feature => {
    const li = document.createElement("li");
    li.textContent = feature;
    featuresList.appendChild(li);
  });

  const charImg = document.getElementById("result-char");
  charImg.dataset.r2Src = result.character;
  applyR2Images();

  const extraDiv = document.getElementById("result-extra");
  extraDiv.innerHTML = "";

  if (result.keyMetrics) {
    const metricsHtml = `<div style="margin-bottom: 1rem;"><h4 style="margin-bottom: 0.5rem; color: #1e3c72;">評価指標</h4><div style="font-size: 0.9rem; color: #666;">${result.keyMetrics.map(m => `<p>• ${m}</p>`).join("")}</div></div>`;
    extraDiv.innerHTML += metricsHtml;
  }

  if (result.conclusion) {
    const conclusionHtml = `<div style="margin: 1rem 0; padding: 1rem; background: #f5f5f5; border-left: 3px solid #999; border-radius: 4px;"><p style="font-size: 0.9rem; color: #555; margin: 0;"><strong>判定：</strong>${result.conclusion}</p></div>`;
    extraDiv.innerHTML += conclusionHtml;
  }

  if (result.extra) {
    extraDiv.innerHTML += result.extra;
  } else if (result.advice) {
    const adviceHtml = `<div style="margin-top: 1rem; padding: 1rem; background: #f9f9f9; border-radius: 6px;"><h4 style="color: #1e3c72; margin-bottom: 0.5rem;">ご提案</h4><p style="font-size: 0.9rem; color: #666; margin: 0; line-height: 1.6;">${result.advice}</p></div>`;
    extraDiv.innerHTML += adviceHtml;
  }

  drawRadarChart(result.scales);
}

function drawRadarChart(scales) {
  const ctx = document.getElementById("radar-chart").getContext("2d");
  const labels = Object.keys(scales).map(key => SCALE_LABELS[key] || key);
  const data = Object.values(scales);

  const canvas = document.getElementById("radar-chart");
  canvas.width = canvas.offsetWidth;
  canvas.height = 350;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = Math.min(centerX, centerY) - 40;
  const numAxes = labels.length;
  const angleSlice = (Math.PI * 2) / numAxes;

  ctx.fillStyle = "rgba(26, 60, 114, 0.1)";
  ctx.strokeStyle = "#1e3c72";
  ctx.lineWidth = 2;

  ctx.beginPath();
  data.forEach((value, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1;
  for (let j = 1; j <= 5; j++) {
    const radius = (maxRadius / 5) * j;
    ctx.beginPath();
    for (let i = 0; i < numAxes; i++) {
      const angle = angleSlice * i - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  ctx.fillStyle = "#333";
  ctx.font = "11px sans-serif";
  ctx.textAlign = "center";
  labels.forEach((label, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const labelRadius = maxRadius + 20;
    const x = centerX + labelRadius * Math.cos(angle);
    const y = centerY + labelRadius * Math.sin(angle) + 5;
    ctx.fillText(label, x, y);
  });
}