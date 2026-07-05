"use strict";

/* Remove old ?username=&password= from URL */
if (window.location.search) {
  window.history.replaceState({}, document.title, window.location.pathname);
}

/* Login */
const VALID_USERNAME = "RAMCMedical";
const VALID_PASSWORD = "RAMCMedical01";

const RECORDS_STORAGE_KEY = "ramcMedicalRecords";
const SESSION_STORAGE_KEY = "ramcMedicalLoggedIn";

/* Pages */
const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("appPage");

/* Login elements */
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("loginError");
const loggedInUser = document.getElementById("loggedInUser");
const logoutBtn = document.getElementById("logoutBtn");

/* Main elements */
const searchInput = document.getElementById("searchInput");
const newRecordBtn = document.getElementById("newRecordBtn");
const recordsList = document.getElementById("recordsList");
const emptyState = document.getElementById("emptyState");
const totalRecords = document.getElementById("totalRecords");
const displayedRecords = document.getElementById("displayedRecords");

/* Modal */
const recordModal = document.getElementById("recordModal");
const modalTitle = document.getElementById("modalTitle");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const recordForm = document.getElementById("recordForm");

/* Form fields */
const recordId = document.getElementById("recordId");
const patientName = document.getElementById("patientName");
const rank = document.getElementById("rank");
const serviceNumber = document.getElementById("serviceNumber");
const unit = document.getElementById("unit");
const dateOfBirth = document.getElementById("dateOfBirth");
const bloodGroup = document.getElementById("bloodGroup");
const encounterDate = document.getElementById("encounterDate");
const medicalCategory = document.getElementById("medicalCategory");
const presentingComplaint = document.getElementById("presentingComplaint");
const symptoms = document.getElementById("symptoms");
const medicalHistory = document.getElementById("medicalHistory");
const allergies = document.getElementById("allergies");
const currentMedications = document.getElementById("currentMedications");
const temperature = document.getElementById("temperature");
const heartRate = document.getElementById("heartRate");
const bloodPressure = document.getElementById("bloodPressure");
const respiratoryRate = document.getElementById("respiratoryRate");
const oxygenSaturation = document.getElementById("oxygenSaturation");
const painScore = document.getElementById("painScore");
const clinicalAssessment = document.getElementById("clinicalAssessment");
const clinicalNotes = document.getElementById("clinicalNotes");
const recommendedTreatment = document.getElementById("recommendedTreatment");
const generateTreatmentBtn = document.getElementById("generateTreatmentBtn");

let records = loadRecords();

/* Start */
document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem(SESSION_STORAGE_KEY) === "true") {
    showApplication();
  } else {
    showLogin();
  }

  setDefaultEncounterDate();
  renderRecords();
});

/* Login */
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const enteredUsername = usernameInput.value.trim();
  const enteredPassword = passwordInput.value;

  if (
    enteredUsername === VALID_USERNAME &&
    enteredPassword === VALID_PASSWORD
  ) {
    sessionStorage.setItem(SESSION_STORAGE_KEY, "true");

    loginError.textContent = "";
    passwordInput.value = "";

    window.history.replaceState({}, document.title, window.location.pathname);

    showApplication();
    renderRecords();
  } else {
    loginError.textContent = "Invalid username or password.";
    passwordInput.value = "";
    passwordInput.focus();
  }
});

function showLogin() {
  loginPage.classList.remove("hidden");
  appPage.classList.add("hidden");
}

function showApplication() {
  loginPage.classList.add("hidden");
  appPage.classList.remove("hidden");
  loggedInUser.textContent = VALID_USERNAME;
}

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  showLogin();
});

/* Storage */
function loadRecords() {
  try {
    return JSON.parse(localStorage.getItem(RECORDS_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRecords() {
  localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records));
}

/* Search */
searchInput.addEventListener("input", renderRecords);

function getFilteredRecords() {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) return records;

  return records.filter((record) => {
    return [
      record.patientName,
      record.rank,
      record.serviceNumber,
      record.unit,
      record.presentingComplaint,
      record.symptoms,
      record.clinicalAssessment
    ]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

/* Render */
function renderRecords() {
  const filtered = getFilteredRecords();

  recordsList.innerHTML = "";
  totalRecords.textContent = records.length;
  displayedRecords.textContent = filtered.length;

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  filtered.forEach((record) => {
    const card = document.createElement("article");
    card.className = "record-card";

    card.innerHTML = `
      <div class="record-main">
        <div class="record-title-row">
          <div>
            <h3>${escapeHtml(record.patientName)}</h3>
            <p class="record-rank">${escapeHtml(record.rank)}</p>
          </div>
          <span class="record-status">Active Record</span>
        </div>

        <div class="record-meta">
          <div>
            <span>Service Number</span>
            <strong>${escapeHtml(record.serviceNumber || "Not recorded")}</strong>
          </div>
          <div>
            <span>Unit</span>
            <strong>${escapeHtml(record.unit || "Not recorded")}</strong>
          </div>
          <div>
            <span>Updated</span>
            <strong>${escapeHtml(formatDate(record.updatedAt))}</strong>
          </div>
        </div>

        <div class="record-summary">
          <span>Complaint</span>
          <p>${escapeHtml(record.presentingComplaint || "No complaint recorded.")}</p>
        </div>
      </div>

      <div class="record-actions">
        <button class="btn btn-secondary edit-record-btn" data-id="${record.id}">
          Edit
        </button>
        <button class="btn btn-danger delete-record-btn" data-id="${record.id}">
          Delete
        </button>
      </div>
    `;

    recordsList.appendChild(card);
  });
}

/* New record */
newRecordBtn.addEventListener("click", () => {
  recordForm.reset();
  recordId.value = "";
  modalTitle.textContent = "New Medical Record";
  setDefaultEncounterDate();
  openModal();
});

/* Edit/delete */
recordsList.addEventListener("click", (event) => {
  const editBtn = event.target.closest(".edit-record-btn");
  const deleteBtn = event.target.closest(".delete-record-btn");

  if (editBtn) openEditRecord(editBtn.dataset.id);
  if (deleteBtn) deleteRecord(deleteBtn.dataset.id);
});

function openEditRecord(id) {
  const record = records.find((r) => r.id === id);
  if (!record) return;

  modalTitle.textContent = "Edit Medical Record";

  recordId.value = record.id;
  patientName.value = record.patientName || "";
  rank.value = record.rank || "";
  serviceNumber.value = record.serviceNumber || "";
  unit.value = record.unit || "";
  dateOfBirth.value = record.dateOfBirth || "";
  bloodGroup.value = record.bloodGroup || "";
  encounterDate.value = record.encounterDate || "";
  medicalCategory.value = record.medicalCategory || "";
  presentingComplaint.value = record.presentingComplaint || "";
  symptoms.value = record.symptoms || "";
  medicalHistory.value = record.medicalHistory || "";
  allergies.value = record.allergies || "";
  currentMedications.value = record.currentMedications || "";
  temperature.value = record.temperature || "";
  heartRate.value = record.heartRate || "";
  bloodPressure.value = record.bloodPressure || "";
  respiratoryRate.value = record.respiratoryRate || "";
  oxygenSaturation.value = record.oxygenSaturation || "";
  painScore.value = record.painScore || "";
  clinicalAssessment.value = record.clinicalAssessment || "";
  clinicalNotes.value = record.clinicalNotes || "";
  recommendedTreatment.value = record.recommendedTreatment || "";

  openModal();
}

function deleteRecord(id) {
  if (!confirm("Delete this record?")) return;

  records = records.filter((record) => record.id !== id);
  saveRecords();
  renderRecords();
}

/* Save */
recordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const existingId = recordId.value;
  const now = new Date().toISOString();

  const record = {
    id: existingId || createId(),
    patientName: patientName.value.trim(),
    rank: rank.value.trim(),
    serviceNumber: serviceNumber.value.trim(),
    unit: unit.value.trim(),
    dateOfBirth: dateOfBirth.value,
    bloodGroup: bloodGroup.value,
    encounterDate: encounterDate.value,
    medicalCategory: medicalCategory.value.trim(),
    presentingComplaint: presentingComplaint.value.trim(),
    symptoms: symptoms.value.trim(),
    medicalHistory: medicalHistory.value.trim(),
    allergies: allergies.value.trim(),
    currentMedications: currentMedications.value.trim(),
    temperature: temperature.value.trim(),
    heartRate: heartRate.value.trim(),
    bloodPressure: bloodPressure.value.trim(),
    respiratoryRate: respiratoryRate.value.trim(),
    oxygenSaturation: oxygenSaturation.value.trim(),
    painScore: painScore.value.trim(),
    clinicalAssessment: clinicalAssessment.value.trim(),
    clinicalNotes: clinicalNotes.value.trim(),
    recommendedTreatment: recommendedTreatment.value.trim(),
    updatedAt: now
  };

  if (!record.patientName || !record.rank) {
    alert("Please enter at least Name and Rank.");
    return;
  }

  if (existingId) {
    records = records.map((r) => (r.id === existingId ? record : r));
  } else {
    records.push(record);
  }

  saveRecords();
  renderRecords();
  closeModal();
});

/* Roblox roleplay treatment advice */
generateTreatmentBtn.addEventListener("click", () => {
  recommendedTreatment.value = generateRoleplayTreatmentAdvice();
});

function generateRoleplayTreatmentAdvice() {
  const complaint = presentingComplaint.value.trim() || "Not recorded";
  const symptomText = symptoms.value.trim() || "Not recorded";
  const historyText = medicalHistory.value.trim() || "Not recorded";
  const allergyText = allergies.value.trim() || "Not recorded";
  const assessmentText = clinicalAssessment.value.trim() || "Not recorded";

  const lowerText = `${complaint} ${symptomText} ${assessmentText}`.toLowerCase();

  let advice = "RAMC ROBLOX ROLEPLAY TREATMENT ADVICE\n";
  advice += "=====================================\n\n";
  advice += "For Roblox roleplay use only. Not real medical advice.\n\n";

  advice += "PATIENT SUMMARY\n";
  advice += "---------------\n";
  advice += `Complaint: ${complaint}\n`;
  advice += `Symptoms: ${symptomText}\n`;
  advice += `Medical history: ${historyText}\n`;
  advice += `Allergies: ${allergyText}\n`;
  advice += `Assessment: ${assessmentText}\n\n`;

  advice += "SUGGESTED ROLEPLAY ACTIONS\n";
  advice += "--------------------------\n";

  if (
    lowerText.includes("gunshot") ||
    lowerText.includes("gsw") ||
    lowerText.includes("bleeding")
  ) {
    advice += "• Apply field dressing and direct pressure.\n";
    advice += "• Check airway, breathing and circulation.\n";
    advice += "• Prepare casualty for urgent evacuation.\n";
    advice += "• Record blood loss and treatment given.\n";
  } else if (
    lowerText.includes("fracture") ||
    lowerText.includes("broken") ||
    lowerText.includes("sprain")
  ) {
    advice += "• Immobilise the injured area.\n";
    advice += "• Apply splint for roleplay.\n";
    advice += "• Check circulation beyond injury.\n";
    advice += "• Send to medical post for review.\n";
  } else if (lowerText.includes("burn")) {
    advice += "• Cool the burn area in roleplay.\n";
    advice += "• Cover with sterile dressing.\n";
    advice += "• Do not remove stuck clothing.\n";
    advice += "• Escalate if severe.\n";
  } else if (
    lowerText.includes("head") ||
    lowerText.includes("concussion")
  ) {
    advice += "• Check consciousness level.\n";
    advice += "• Monitor for confusion or worsening symptoms.\n";
    advice += "• Keep under observation.\n";
    advice += "• Refer to senior medic.\n";
  } else if (
    lowerText.includes("heat") ||
    lowerText.includes("dehydration")
  ) {
    advice += "• Move patient to shade.\n";
    advice += "• Remove excess kit.\n";
    advice += "• Give fictional fluids if allowed by group rules.\n";
    advice += "• Monitor condition.\n";
  } else if (
    lowerText.includes("chest pain") ||
    lowerText.includes("breathing")
  ) {
    advice += "• Sit patient upright if comfortable.\n";
    advice += "• Keep patient calm and still.\n";
    advice += "• Request urgent senior medical support.\n";
  } else {
    advice += "• Complete primary survey: airway, breathing, circulation.\n";
    advice += "• Record observations.\n";
    advice += "• Treat visible injuries.\n";
    advice += "• Keep patient comfortable.\n";
    advice += "• Refer to medical officer if needed.\n";
  }

  advice += "\nROLEPLAY MEDICATION NOTE\n";
  advice += "------------------------\n";
  advice += "• Medication should only be roleplayed if your Roblox group allows it.\n";
  advice += "• Check recorded allergies before fictional treatment.\n";
  advice += "• Do not use real-world dosages.\n";
  advice += "• Document any fictional treatment given.\n\n";

  advice += "RECOMMENDED ROLEPLAY DISPOSITION\n";
  advice += "--------------------------------\n";
  advice += "• Minor: treat and return to duty.\n";
  advice += "• Moderate: hold at medical post.\n";
  advice += "• Severe: evacuate to field hospital or senior medic.\n";

  return advice;
}

/* Modal */
function openModal() {
  recordModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closeModal() {
  recordModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  recordForm.reset();
  recordId.value = "";
}

closeModalBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

recordModal.addEventListener("click", (event) => {
  if (event.target.dataset.closeModal === "true") {
    closeModal();
  }
});

/* Helpers */
function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function setDefaultEncounterDate() {
  if (encounterDate && !encounterDate.value) {
    encounterDate.value = new Date().toISOString().slice(0, 10);
  }
}

function formatDate(value) {
  if (!value) return "Not recorded";
  return new Date(value).toLocaleString();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
