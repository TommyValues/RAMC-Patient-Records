const VALID_USERNAME = "RAMCMedical";
const VALID_PASSWORD = "RAMCMedical01";
const SESSION_KEY = "ramc_logged_in";
const STORAGE_KEY = "ramc_patient_records_v1";

let records = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let selectedId = null;

const $ = (id) => document.getElementById(id);
const fields = [
  "name", "rank", "serviceNumber", "unit", "dob", "bloodGroup", "allergies",
  "currentMedication", "emergencyContact", "priority", "complaint", "observations",
  "history", "diagnosis", "treatmentGiven", "followUp", "notes", "recommendedTreatment"
];

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  $("savedStatus").textContent = "Saved locally";
}

function showApp() {
  $("loginPage").classList.add("hidden");
  $("appPage").classList.remove("hidden");
  renderRecords();
}

function showLogin() {
  $("appPage").classList.add("hidden");
  $("loginPage").classList.remove("hidden");
}

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

function clearForm() {
  selectedId = null;
  fields.forEach((field) => $(field).value = "");
  $("priority").value = "Routine";
  $("formTitle").textContent = "Add Patient Record";
  $("savedStatus").textContent = "Not saved";
  renderRecords();
}

function getFormData() {
  const data = {};
  fields.forEach((field) => data[field] = $(field).value.trim());
  data.updatedAt = new Date().toISOString();
  return data;
}

function setFormData(record) {
  fields.forEach((field) => $(field).value = record[field] || "");
  selectedId = record.id;
  $("formTitle").textContent = `Editing: ${record.name || "Unnamed patient"}`;
  $("savedStatus").textContent = `Last updated ${new Date(record.updatedAt).toLocaleString()}`;
  renderRecords();
}

function renderRecords() {
  const search = $("searchInput").value.toLowerCase();
  const list = $("recordList");
  list.innerHTML = "";

  const filtered = records.filter((record) =>
    JSON.stringify(record).toLowerCase().includes(search)
  ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  if (filtered.length === 0) {
    list.innerHTML = '<p class="status">No matching records.</p>';
    return;
  }

  filtered.forEach((record) => {
    const card = document.createElement("article");
    card.className = `record-card ${record.id === selectedId ? "active" : ""}`;
    card.innerHTML = `
      <strong>${escapeHtml(record.name || "Unnamed patient")}</strong>
      <span>${escapeHtml(record.rank || "No rank")} · ${escapeHtml(record.serviceNumber || "No service number")}</span><br>
      <span>${escapeHtml(record.unit || "No unit")} · ${escapeHtml(record.priority || "Routine")}</span>
    `;
    card.addEventListener("click", () => setFormData(record));
    list.appendChild(card);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[char]));
}

function generateRecommendation() {
  const data = getFormData();
  const redFlags = [];
  const text = `${data.complaint} ${data.observations} ${data.history} ${data.diagnosis}`.toLowerCase();

  if (/chest pain|shortness of breath|sob|collapse|unconscious|stroke|seizure|anaphylaxis|severe bleeding|suicidal|overdose/.test(text)) {
    redFlags.push("Possible red-flag presentation: urgent senior clinical review / emergency pathway required.");
  }
  if (/fever|temp|pyrexia|infection/.test(text)) redFlags.push("Check full observations, sepsis risk, hydration status, and infection source.");
  if (/head injury|concussion|loss of consciousness/.test(text)) redFlags.push("Use head-injury protocol and consider evacuation/escalation if symptoms worsen.");
  if (/pain|sprain|strain|fracture|wound|laceration/.test(text)) redFlags.push("Assess pain, neurovascular status, wound contamination, tetanus status, and imaging need.");
  if (/allerg/.test(data.allergies.toLowerCase()) && !/nkda|none/.test(data.allergies.toLowerCase())) {
    redFlags.push(`Allergy warning: confirm allergy details before any medication is considered. Recorded allergies: ${data.allergies}.`);
  }

  const recommendation = [
    "CLINICAL DECISION-SUPPORT DRAFT — REVIEW REQUIRED",
    "",
    `Patient: ${data.name || "Not entered"} | Rank: ${data.rank || "Not entered"} | Priority: ${data.priority || "Routine"}`,
    "",
    "Immediate actions:",
    "• Confirm identity, consent, allergies, current medication, and relevant medical history.",
    "• Record full observations and repeat if condition changes.",
    "• Escalate to an authorised clinician for diagnosis, prescription, and fitness-for-duty decisions.",
    "",
    "Suggested plan to consider:",
    "• Provide appropriate first aid/supportive care within local protocol and scope of practice.",
    "• Consider rest, hydration, wound care, immobilisation, monitoring, or referral depending on assessment.",
    "• Do not issue prescription-only medication unless authorised by a qualified prescriber and local policy.",
    "• Arrange follow-up, safety-net advice, and clear return precautions.",
    "",
    "Risk prompts:",
    ...(redFlags.length ? redFlags.map((item) => `• ${item}`) : ["• No specific red-flag keywords detected from the entered text; clinical judgement still required."]),
    "",
    "Prescription note:",
    "• Medication choice, dose, contraindications, and interactions must be confirmed by an authorised prescriber. This system intentionally does not generate automatic prescriptions."
  ].join("\n");

  $("recommendedTreatment").value = recommendation;
}

$("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const username = $("username").value;
  const password = $("password").value;
  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "true");
    $("loginError").textContent = "";
    showApp();
  } else {
    $("loginError").textContent = "Incorrect username or password.";
  }
});

$("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  showLogin();
});

$("recordForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = getFormData();
  if (!data.name) return alert("Name is required.");

  if (selectedId) {
    records = records.map((record) => record.id === selectedId ? { ...record, ...data } : record);
  } else {
    selectedId = crypto.randomUUID();
    records.push({ id: selectedId, createdAt: new Date().toISOString(), ...data });
  }
  saveRecords();
  renderRecords();
  const saved = records.find((record) => record.id === selectedId);
  if (saved) setFormData(saved);
});

$("deleteBtn").addEventListener("click", () => {
  if (!selectedId) return alert("Select a record to delete.");
  if (!confirm("Delete this record? This cannot be undone.")) return;
  records = records.filter((record) => record.id !== selectedId);
  saveRecords();
  clearForm();
});

$("clearBtn").addEventListener("click", clearForm);
$("newRecordBtn").addEventListener("click", clearForm);
$("searchInput").addEventListener("input", renderRecords);
$("recommendBtn").addEventListener("click", generateRecommendation);

$("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ramc-records-${new Date().toISOString().slice(0,10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
});

$("importFile").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const imported = JSON.parse(await file.text());
  if (!Array.isArray(imported)) return alert("Invalid records file.");
  records = imported;
  saveRecords();
  clearForm();
});

if (isLoggedIn()) showApp(); else showLogin();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
