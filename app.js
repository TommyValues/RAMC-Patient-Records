"use strict";

/* =========================================================
   RAMC PATIENT RECORD SYSTEM
   Front-end prototype

   IMPORTANT:
   - Browser-side credentials are NOT secure.
   - localStorage is NOT suitable for real medical records.
   - This prototype must not hold real patient information.
========================================================= */


/* =========================================================
   LOGIN CREDENTIALS
========================================================= */

const VALID_USERNAME = "RAMCMedical";
const VALID_PASSWORD = "RAMCMedical01";


/* =========================================================
   STORAGE KEYS
========================================================= */

const RECORDS_STORAGE_KEY = "ramcMedicalRecords";
const SESSION_STORAGE_KEY = "ramcMedicalLoggedIn";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("appPage");

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("loginError");

const loggedInUser = document.getElementById("loggedInUser");
const logoutBtn = document.getElementById("logoutBtn");

const searchInput = document.getElementById("searchInput");
const newRecordBtn = document.getElementById("newRecordBtn");

const recordsList = document.getElementById("recordsList");
const emptyState = document.getElementById("emptyState");

const totalRecords = document.getElementById("totalRecords");
const displayedRecords = document.getElementById("displayedRecords");

const recordModal = document.getElementById("recordModal");
const modalTitle = document.getElementById("modalTitle");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");

const recordForm = document.getElementById("recordForm");

const generateTreatmentBtn =
  document.getElementById("generateTreatmentBtn");


/* =========================================================
   RECORD FORM ELEMENTS
========================================================= */

const recordId = document.getElementById("recordId");

const patientName = document.getElementById("patientName");
const rank = document.getElementById("rank");
const serviceNumber = document.getElementById("serviceNumber");
const unit = document.getElementById("unit");
const dateOfBirth = document.getElementById("dateOfBirth");
const bloodGroup = document.getElementById("bloodGroup");

const encounterDate = document.getElementById("encounterDate");
const medicalCategory = document.getElementById("medicalCategory");

const presentingComplaint =
  document.getElementById("presentingComplaint");

const symptoms = document.getElementById("symptoms");
const medicalHistory = document.getElementById("medicalHistory");
const allergies = document.getElementById("allergies");

const currentMedications =
  document.getElementById("currentMedications");

const temperature = document.getElementById("temperature");
const heartRate = document.getElementById("heartRate");
const bloodPressure = document.getElementById("bloodPressure");

const respiratoryRate =
  document.getElementById("respiratoryRate");

const oxygenSaturation =
  document.getElementById("oxygenSaturation");

const painScore = document.getElementById("painScore");

const clinicalAssessment =
  document.getElementById("clinicalAssessment");

const clinicalNotes =
  document.getElementById("clinicalNotes");

const recommendedTreatment =
  document.getElementById("recommendedTreatment");


/* =========================================================
   APPLICATION STATE
========================================================= */

let records = loadRecords();


/* =========================================================
   INITIAL STARTUP
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initialiseApplication();
});


function initialiseApplication() {
  const loggedIn =
    sessionStorage.getItem(SESSION_STORAGE_KEY) === "true";

  if (loggedIn) {
    showApplication();
  } else {
    showLogin();
  }

  setDefaultEncounterDate();
  renderRecords();
}


/* =========================================================
   LOGIN
========================================================= */

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const enteredUsername = usernameInput.value.trim();
  const enteredPassword = passwordInput.value;

  if (
    enteredUsername === VALID_USERNAME &&
    enteredPassword === VALID_PASSWORD
  ) {
    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      "true"
    );

    loginError.textContent = "";

    passwordInput.value = "";

    showApplication();
    renderRecords();

    return;
  }

  loginError.textContent =
    "Invalid username or password.";

  passwordInput.value = "";
  passwordInput.focus();
});


function showLogin() {
  loginPage.classList.remove("hidden");
  appPage.classList.add("hidden");

  setTimeout(() => {
    usernameInput.focus();
  }, 100);
}


function showApplication() {
  loginPage.classList.add("hidden");
  appPage.classList.remove("hidden");

  loggedInUser.textContent = VALID_USERNAME;
}


logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);

  closeModal();

  loginForm.reset();

  showLogin();
});


/* =========================================================
   RECORD STORAGE
========================================================= */

function loadRecords() {
  try {
    const storedRecords =
      localStorage.getItem(RECORDS_STORAGE_KEY);

    if (!storedRecords) {
      return [];
    }

    const parsed = JSON.parse(storedRecords);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Could not load records:", error);
    return [];
  }
}


function saveRecords() {
  try {
    localStorage.setItem(
      RECORDS_STORAGE_KEY,
      JSON.stringify(records)
    );
  } catch (error) {
    console.error("Could not save records:", error);

    alert(
      "The record could not be saved in browser storage."
    );
  }
}


/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener("input", () => {
  renderRecords();
});


function getFilteredRecords() {
  const query = searchInput.value
    .trim()
    .toLowerCase();

  if (!query) {
    return records;
  }

  return records.filter((record) => {
    const searchableText = [
      record.patientName,
      record.rank,
      record.serviceNumber,
      record.unit,
      record.presentingComplaint,
      record.symptoms,
      record.clinicalAssessment
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });
}


/* =========================================================
   RENDER RECORDS
========================================================= */

function renderRecords() {
  const filteredRecords = getFilteredRecords();

  recordsList.innerHTML = "";

  totalRecords.textContent = records.length;
  displayedRecords.textContent = filteredRecords.length;

  if (filteredRecords.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  const sortedRecords = [...filteredRecords].sort(
    (a, b) => {
      const aDate = new Date(
        a.updatedAt || a.createdAt || 0
      );

      const bDate = new Date(
        b.updatedAt || b.createdAt || 0
      );

      return bDate - aDate;
    }
  );

  sortedRecords.forEach((record) => {
    const card = createRecordCard(record);
    recordsList.appendChild(card);
  });
}


function createRecordCard(record) {
  const card = document.createElement("article");
  card.className = "record-card";

  const safeName = escapeHtml(
    record.patientName || "Unnamed Patient"
  );

  const safeRank = escapeHtml(
    record.rank || "Rank not recorded"
  );

  const safeServiceNumber = escapeHtml(
    record.serviceNumber || "Not recorded"
  );

  const safeUnit = escapeHtml(
    record.unit || "Not recorded"
  );

  const safeComplaint = escapeHtml(
    record.presentingComplaint ||
    "No presenting complaint recorded."
  );

  const updatedText = formatDateTime(
    record.updatedAt || record.createdAt
  );

  card.innerHTML = `
    <div class="record-main">

      <div class="record-title-row">
        <div>
          <h3>${safeName}</h3>
          <p class="record-rank">${safeRank}</p>
        </div>

        <span class="record-status">
          Active Record
        </span>
      </div>

      <div class="record-meta">

        <div>
          <span>Service Number</span>
          <strong>${safeServiceNumber}</strong>
        </div>

        <div>
          <span>Unit / Regiment</span>
          <strong>${safeUnit}</strong>
        </div>

        <div>
          <span>Last Updated</span>
          <strong>${escapeHtml(updatedText)}</strong>
        </div>

      </div>

      <div class="record-summary">
        <span>Presenting Complaint</span>
        <p>${safeComplaint}</p>
      </div>

    </div>

    <div class="record-actions">

      <button
        class="btn btn-secondary edit-record-btn"
        data-id="${escapeHtml(record.id)}"
        type="button"
      >
        Edit
      </button>

      <button
        class="btn btn-danger delete-record-btn"
        data-id="${escapeHtml(record.id)}"
        type="button"
      >
        Delete
      </button>

    </div>
  `;

  return card;
}


/* =========================================================
   NEW RECORD
========================================================= */

newRecordBtn.addEventListener("click", () => {
  openNewRecordModal();
});


function openNewRecordModal() {
  recordForm.reset();

  recordId.value = "";

  modalTitle.textContent = "New Medical Record";

  setDefaultEncounterDate();

  openModal();
}


/* =========================================================
   EDIT AND DELETE BUTTONS
========================================================= */

recordsList.addEventListener("click", (event) => {
  const editButton =
    event.target.closest(".edit-record-btn");

  const deleteButton =
    event.target.closest(".delete-record-btn");

  if (editButton) {
    const id = editButton.dataset.id;
    openEditRecordModal(id);
  }

  if (deleteButton) {
    const id = deleteButton.dataset.id;
    deleteRecord(id);
  }
});


function openEditRecordModal(id) {
  const record = records.find(
    (item) => item.id === id
  );

  if (!record) {
    alert("Record not found.");
    return;
  }

  modalTitle.textContent = "Edit Medical Record";

  recordId.value = record.id || "";

  patientName.value = record.patientName || "";
  rank.value = record.rank || "";
  serviceNumber.value = record.serviceNumber || "";
  unit.value = record.unit || "";
  dateOfBirth.value = record.dateOfBirth || "";
  bloodGroup.value = record.bloodGroup || "";

  encounterDate.value = record.encounterDate || "";
  medicalCategory.value =
    record.medicalCategory || "";

  presentingComplaint.value =
    record.presentingComplaint || "";

  symptoms.value = record.symptoms || "";

  medicalHistory.value =
    record.medicalHistory || "";

  allergies.value = record.allergies || "";

  currentMedications.value =
    record.currentMedications || "";

  temperature.value = record.temperature || "";
  heartRate.value = record.heartRate || "";
  bloodPressure.value = record.bloodPressure || "";

  respiratoryRate.value =
    record.respiratoryRate || "";

  oxygenSaturation.value =
    record.oxygenSaturation || "";

  painScore.value = record.painScore || "";

  clinicalAssessment.value =
    record.clinicalAssessment || "";

  clinicalNotes.value =
    record.clinicalNotes || "";

  recommendedTreatment.value =
    record.recommendedTreatment || "";

  openModal();
}


function deleteRecord(id) {
  const record = records.find(
    (item) => item.id === id
  );

  if (!record) {
    return;
  }

  const confirmed = window.confirm(
    `Delete the record for ${record.patientName}?`
  );

  if (!confirmed) {
    return;
  }

  records = records.filter(
    (item) => item.id !== id
  );

  saveRecords();
  renderRecords();
}


/* =========================================================
   SAVE RECORD
========================================================= */

recordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!isAuthenticated()) {
    alert("Your session is not authenticated.");
    showLogin();
    return;
  }

  const existingId = recordId.value.trim();

  const existingRecord = records.find(
    (item) => item.id === existingId
  );

  const now = new Date().toISOString();

  const recordData = {
    id: existingId || createId(),

    patientName: patientName.value.trim(),
    rank: rank.value.trim(),
    serviceNumber: serviceNumber.value.trim(),
    unit: unit.value.trim(),
    dateOfBirth: dateOfBirth.value,
    bloodGroup: bloodGroup.value,

    encounterDate: encounterDate.value,

    medicalCategory:
      medicalCategory.value.trim(),

    presentingComplaint:
      presentingComplaint.value.trim(),

    symptoms:
      symptoms.value.trim(),

    medicalHistory:
      medicalHistory.value.trim(),

    allergies:
      allergies.value.trim(),

    currentMedications:
      currentMedications.value.trim(),

    temperature:
      temperature.value.trim(),

    heartRate:
      heartRate.value.trim(),

    bloodPressure:
      bloodPressure.value.trim(),

    respiratoryRate:
      respiratoryRate.value.trim(),

    oxygenSaturation:
      oxygenSaturation.value.trim(),

    painScore:
      painScore.value.trim(),

    clinicalAssessment:
      clinicalAssessment.value.trim(),

    clinicalNotes:
      clinicalNotes.value.trim(),

    recommendedTreatment:
      recommendedTreatment.value.trim(),

    createdAt:
      existingRecord?.createdAt || now,

    updatedAt: now
  };


  if (!recordData.patientName) {
    alert("Please enter the patient's name.");
    patientName.focus();
    return;
  }

  if (!recordData.rank) {
    alert("Please enter the patient's rank.");
    rank.focus();
    return;
  }


  if (existingRecord) {
    records = records.map((item) => {
      return item.id === existingId
        ? recordData
        : item;
    });
  } else {
    records.push(recordData);
  }

  saveRecords();
  renderRecords();
  closeModal();
});


/* =========================================================
   TREATMENT SUPPORT DRAFT

   This intentionally does NOT generate prescriptions,
   doses or autonomous treatment orders.
========================================================= */

generateTreatmentBtn.addEventListener(
  "click",
  () => {
    const draft = generateClinicalSupportDraft();
    recommendedTreatment.value = draft;
  }
);


function generateClinicalSupportDraft() {
  const complaint =
    presentingComplaint.value.trim();

  const symptomText =
    symptoms.value.trim();

  const historyText =
    medicalHistory.value.trim();

  const allergyText =
    allergies.value.trim();

  const medicationText =
    currentMedications.value.trim();

  const assessmentText =
    clinicalAssessment.value.trim();

  const observations = [];

  if (temperature.value) {
    observations.push(
      `Temperature: ${temperature.value} °C`
    );
  }

  if (heartRate.value) {
    observations.push(
      `Heart rate: ${heartRate.value} bpm`
    );
  }

  if (bloodPressure.value) {
    observations.push(
      `Blood pressure: ${bloodPressure.value}`
    );
  }

  if (respiratoryRate.value) {
    observations.push(
      `Respiratory rate: ${respiratoryRate.value}`
    );
  }

  if (oxygenSaturation.value) {
    observations.push(
      `SpO₂: ${oxygenSaturation.value}%`
    );
  }

  if (painScore.value) {
    observations.push(
      `Pain score: ${painScore.value}/10`
    );
  }


  const urgentFlags = detectUrgentFlags();

  let output = "";

  output +=
    "CLINICAL DECISION-SUPPORT DRAFT\n";

  output +=
    "================================\n\n";

  output +=
    "This draft is not a diagnosis, prescription, or treatment order. " +
    "A qualified clinician must independently assess the patient and " +
    "follow current local policy and approved clinical guidance.\n\n";


  output += "1. PRESENTATION SUMMARY\n";
  output += "-----------------------\n";

  output +=
    `Presenting complaint: ${
      complaint || "Not recorded"
    }\n`;

  output +=
    `Symptoms: ${
      symptomText || "Not recorded"
    }\n`;

  output +=
    `Relevant history: ${
      historyText || "Not recorded"
    }\n`;

  output +=
    `Recorded allergies: ${
      allergyText || "Not recorded"
    }\n`;

  output +=
    `Current medicines: ${
      medicationText || "Not recorded"
    }\n`;

  output +=
    `Clinical assessment: ${
      assessmentText || "Not recorded"
    }\n\n`;


  output += "2. RECORDED OBSERVATIONS\n";
  output += "------------------------\n";

  if (observations.length > 0) {
    output += observations
      .map((item) => `• ${item}`)
      .join("\n");
  } else {
    output +=
      "• No observations have been entered.";
  }

  output += "\n\n";


  output += "3. PRIORITY REVIEW\n";
  output += "------------------\n";

  if (urgentFlags.length > 0) {
    output +=
      "Potential escalation indicators detected from entered data:\n";

    output += urgentFlags
      .map((item) => `• ${item}`)
      .join("\n");

    output +=
      "\n\nPrompt urgent clinician assessment and apply the appropriate emergency or escalation pathway.";
  } else {
    output +=
      "• No automatic escalation indicator was identified by this limited prototype.\n";

    output +=
      "• This does not exclude serious illness or injury.";
  }

  output += "\n\n";


  output += "4. CLINICIAN REVIEW CHECKLIST\n";
  output += "-----------------------------\n";

  output +=
    "• Confirm history, onset, duration, severity and progression.\n";

  output +=
    "• Repeat and validate abnormal observations.\n";

  output +=
    "• Perform an examination appropriate to the presentation.\n";

  output +=
    "• Review allergies and previous adverse drug reactions.\n";

  output +=
    "• Reconcile current medicines and check interactions.\n";

  output +=
    "• Consider relevant investigations based on clinical findings.\n";

  output +=
    "• Consider differential diagnoses and red-flag features.\n";

  output +=
    "• Determine whether escalation, referral, evacuation or follow-up is required.\n";

  output +=
    "• Document safety-netting advice and review timeframe.\n\n";


  output += "5. MEDICATION / PRESCRIBING REVIEW\n";
  output += "----------------------------------\n";

  output +=
    "No autonomous prescription has been generated. Before prescribing, " +
    "an authorised prescriber should verify indication, diagnosis, allergies, " +
    "contraindications, interactions, age, weight where relevant, renal/hepatic " +
    "factors, pregnancy status where relevant, current medicines, and current " +
    "approved formulary or local guidance.\n\n";


  output += "6. FINAL CLINICIAN ACTION\n";
  output += "-------------------------\n";

  output +=
    "Clinician to review this draft, amend as required, document the final " +
    "assessment and enter only authorised treatment decisions.";

  return output;
}


/* =========================================================
   LIMITED URGENT FLAG DETECTION

   This is intentionally conservative and incomplete.
========================================================= */

function detectUrgentFlags() {
  const flags = [];

  const symptomText = [
    presentingComplaint.value,
    symptoms.value,
    clinicalAssessment.value
  ]
    .join(" ")
    .toLowerCase();


  const spo2 = Number(
    oxygenSaturation.value
  );

  const temp = Number(
    temperature.value
  );

  const hr = Number(
    heartRate.value
  );

  const rr = Number(
    respiratoryRate.value
  );


  if (
    oxygenSaturation.value &&
    Number.isFinite(spo2) &&
    spo2 < 92
  ) {
    flags.push(
      "Recorded oxygen saturation is below 92%."
    );
  }


  if (
    temperature.value &&
    Number.isFinite(temp) &&
    temp >= 40
  ) {
    flags.push(
      "Recorded temperature is 40 °C or higher."
    );
  }


  if (
    heartRate.value &&
    Number.isFinite(hr) &&
    (hr < 40 || hr > 140)
  ) {
    flags.push(
      "Recorded heart rate is markedly abnormal."
    );
  }


  if (
    respiratoryRate.value &&
    Number.isFinite(rr) &&
    (rr < 8 || rr > 30)
  ) {
    flags.push(
      "Recorded respiratory rate is markedly abnormal."
    );
  }


  const urgentTerms = [
    "chest pain",
    "difficulty breathing",
    "severe bleeding",
    "unconscious",
    "loss of consciousness",
    "seizure",
    "anaphylaxis",
    "suicidal",
    "stroke",
    "severe head injury"
  ];


  urgentTerms.forEach((term) => {
    if (symptomText.includes(term)) {
      flags.push(
        `Entered text includes potential red-flag feature: "${term}".`
      );
    }
  });


  return [...new Set(flags)];
}


/* =========================================================
   MODAL
========================================================= */

function openModal() {
  recordModal.classList.remove("hidden");
  document.body.classList.add("modal-open");

  setTimeout(() => {
    patientName.focus();
  }, 100);
}


function closeModal() {
  recordModal.classList.add("hidden");
  document.body.classList.remove("modal-open");

  recordForm.reset();
  recordId.value = "";
}


closeModalBtn.addEventListener(
  "click",
  closeModal
);


cancelBtn.addEventListener(
  "click",
  closeModal
);


recordModal.addEventListener(
  "click",
  (event) => {
    const closeTarget =
      event.target.dataset.closeModal;

    if (closeTarget === "true") {
      closeModal();
    }
  }
);


document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      !recordModal.classList.contains("hidden")
    ) {
      closeModal();
    }
  }
);


/* =========================================================
   AUTHENTICATION CHECK
========================================================= */

function isAuthenticated() {
  return (
    sessionStorage.getItem(
      SESSION_STORAGE_KEY
    ) === "true"
  );
}


/* =========================================================
   UTILITIES
========================================================= */

function createId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2)
  );
}


function setDefaultEncounterDate() {
  if (!encounterDate.value) {
    encounterDate.value =
      new Date().toISOString().slice(0, 10);
  }
}


function formatDateTime(value) {
  if (!value) {
    return "Not recorded";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not recorded";
  }

  return date.toLocaleString();
}


function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
