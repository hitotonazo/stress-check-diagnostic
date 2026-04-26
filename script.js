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
    removeAbnormalStyling();
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
  
  // 異質結果の場合、特殊なスタイリングを適用
  if (result.type === "unit7") {
    applyAbnormalStyling();
  }
  
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

function applyAbnormalStyling() {
  const resultSection = document.getElementById("result-section");
  const resultContent = document.querySelector(".result-content");
  const resultWrapper = document.querySelector(".result-wrapper");
  const resultTitle = document.getElementById("result-title");
  const resultCode = document.getElementById("result-code");
  const resultDescription = document.querySelector(".result-description");
  const featuresList = document.querySelector(".result-features");
  const resultChart = document.querySelector(".result-chart");
  const resultExtra = document.getElementById("result-extra");

  // 背景をグレー化
  resultSection.style.background = "linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%)";
  resultContent.style.background = "#f5f5f5";
  resultContent.style.borderRadius = "0px";
  resultContent.style.boxShadow = "0 0 20px rgba(0,0,0,0.15)";
  resultContent.style.border = "1px solid #999";

  // グリッドパターン背景
  resultContent.style.backgroundImage = "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(100,100,100,0.03) 1px, rgba(100,100,100,0.03) 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(100,100,100,0.03) 1px, rgba(100,100,100,0.03) 2px)";
  resultContent.style.backgroundSize = "10px 10px";

  // タイトルを機械的に
  resultTitle.style.color = "#333";
  resultTitle.style.fontFamily = "monospace, 'Courier New'";
  resultTitle.style.letterSpacing = "0.2em";
  resultTitle.style.fontWeight = "normal";
  resultTitle.style.fontSize = "1.4rem";

  // コードを目立たせる
  resultCode.style.color = "#666";
  resultCode.style.fontFamily = "monospace";
  resultCode.style.fontSize = "0.75rem";
  resultCode.style.fontWeight = "normal";
  resultCode.style.letterSpacing = "0.3em";
  resultCode.style.marginBottom = "1.5rem";

  // 説明文を冷たく
  resultDescription.style.background = "#efefef";
  resultDescription.style.color = "#555";
  resultDescription.style.fontFamily = "monospace";
  resultDescription.style.lineHeight = "1.9";
  resultDescription.style.borderLeft = "3px solid #999";
  resultDescription.style.borderRadius = "0px";

  // 特徴リスト
  featuresList.style.borderTop = "1px solid #ccc";
  featuresList.style.paddingTop = "1rem";
  const featureItems = featuresList.querySelectorAll("li");
  featureItems.forEach(li => {
    li.style.color = "#444";
    li.style.fontFamily = "monospace";
    li.style.fontSize = "0.85rem";
  });

  // チャートを無機質に
  resultChart.style.background = "#efefef";
  resultChart.style.borderRadius = "0px";
  resultChart.style.border = "1px solid #ccc";

  // キャラクター画像の加工（セピア + コントラスト）
  const charImg = document.getElementById("result-char");
  if (charImg) {
    charImg.style.filter = "grayscale(1) contrast(1.2) brightness(0.95)";
    charImg.style.borderRadius = "0px";
  }

  // 結果の説明部分を強調
  if (resultExtra) {
    resultExtra.style.background = "#d8d8d8";
    resultExtra.style.color = "#333";
    resultExtra.style.fontFamily = "monospace";
    resultExtra.style.borderRadius = "0px";
    resultExtra.style.fontSize = "0.8rem";
    resultExtra.style.border = "1px dashed #999";
  }

  // ページ全体を微かに異質に
  document.body.style.background = "#eaeaea";

  // スクロールバーの色も変更（CSS）
  const style = document.createElement("style");
  style.textContent = `
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #ddd;
    }
    ::-webkit-scrollbar-thumb {
      background: #999;
      border-radius: 0px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #777;
    }
  `;
  document.head.appendChild(style);
}

function removeAbnormalStyling() {
  const resultSection = document.getElementById("result-section");
  resultSection.style.background = "";
  document.body.style.background = "#f8f9fa";
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

  // 異質結果の場合、キャラクター画像と説明文も特殊スタイリング
  if (result.type === "unit7") {
    const resultInfo = document.querySelector(".result-info");
    if (resultInfo) {
      resultInfo.style.fontFamily = "monospace";
    }
    
    // 異質結果の場合は、メトリクス部分をさらに機械的に
    if (result.keyMetrics) {
      const metricsDiv = extraDiv.querySelector("div");
      if (metricsDiv) {
        metricsDiv.style.fontFamily = "monospace";
        metricsDiv.style.color = "#555";
      }
    }
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

  // 異質結果かどうかで色を変更
  const isAbnormal = Object.values(scales).every(v => v >= 90);
  
  ctx.fillStyle = isAbnormal ? "rgba(100, 100, 100, 0.15)" : "rgba(26, 60, 114, 0.1)";
  ctx.strokeStyle = isAbnormal ? "#666" : "#1e3c72";
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

  ctx.strokeStyle = isAbnormal ? "#bbb" : "#ddd";
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

  ctx.fillStyle = isAbnormal ? "#666" : "#333";
  ctx.font = isAbnormal ? "11px monospace" : "11px sans-serif";
  ctx.textAlign = "center";
  labels.forEach((label, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const labelRadius = maxRadius + 20;
    const x = centerX + labelRadius * Math.cos(angle);
    const y = centerY + labelRadius * Math.sin(angle) + 5;
    ctx.fillText(label, x, y);
  });
}
