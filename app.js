"use strict";

if (window.location.search) window.history.replaceState({}, document.title, window.location.pathname);

const VALID_USERNAME = "RAMCMedical";
const VALID_PASSWORD = "RAMCMedical01";
const RECORDS_STORAGE_KEY = "ramcMedicalRecords";
const SESSION_STORAGE_KEY = "ramcMedicalLoggedIn";
const APPOINTMENTS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT5CrXy-JFTbEFqA9ArJJ3SoW2Di_PK-4cH9Cx1VxFJW9uY1LA_rwMoIRT__DDYOMezlc8DpI86fkTf/pub?output=csv";

const $ = (id) => document.getElementById(id);
const loginPage = $("loginPage"), appPage = $("appPage"), loginForm = $("loginForm");
const usernameInput = $("username"), passwordInput = $("password"), loginError = $("loginError"), loggedInUser = $("loggedInUser"), logoutBtn = $("logoutBtn");
const searchInput = $("searchInput"), newRecordBtn = $("newRecordBtn"), recordsList = $("recordsList"), emptyState = $("emptyState"), totalRecords = $("totalRecords"), displayedRecords = $("displayedRecords");
const appointmentsPageBtn = $("appointmentsPageBtn"), appointmentCount = $("appointmentCount"), appointmentsPage = $("appointmentsPage"), appointmentsList = $("appointmentsList");
const recordModal = $("recordModal"), modalTitle = $("modalTitle"), closeModalBtn = $("closeModalBtn"), cancelBtn = $("cancelBtn"), recordForm = $("recordForm");
const recordId = $("recordId"), patientName = $("patientName"), rank = $("rank"), serviceNumber = $("serviceNumber"), unit = $("unit"), dateOfBirth = $("dateOfBirth"), bloodGroup = $("bloodGroup");
const encounterDate = $("encounterDate"), medicalCategory = $("medicalCategory"), presentingComplaint = $("presentingComplaint"), symptoms = $("symptoms"), medicalHistory = $("medicalHistory"), allergies = $("allergies"), currentMedications = $("currentMedications");
const temperature = $("temperature"), heartRate = $("heartRate"), bloodPressure = $("bloodPressure"), respiratoryRate = $("respiratoryRate"), oxygenSaturation = $("oxygenSaturation"), painScore = $("painScore");
const clinicalAssessment = $("clinicalAssessment"), clinicalNotes = $("clinicalNotes"), recommendedTreatment = $("recommendedTreatment"), generateTreatmentBtn = $("generateTreatmentBtn");

let records = loadRecords();

document.addEventListener("DOMContentLoaded", () => {
  sessionStorage.getItem(SESSION_STORAGE_KEY) === "true" ? showApplication() : showLogin();
  setDefaultEncounterDate();
  renderRecords();
  loadAppointments();
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (usernameInput.value.trim() === VALID_USERNAME && passwordInput.value === VALID_PASSWORD) {
    sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
    loginError.textContent = "";
    passwordInput.value = "";
    window.history.replaceState({}, document.title, window.location.pathname);
    showApplication();
    renderRecords();
    loadAppointments();
  } else {
    loginError.textContent = "Invalid username or password.";
    passwordInput.value = "";
    passwordInput.focus();
  }
});

function showLogin(){ loginPage.classList.remove("hidden"); appPage.classList.add("hidden"); }
function showApplication(){ loginPage.classList.add("hidden"); appPage.classList.remove("hidden"); loggedInUser.textContent = VALID_USERNAME; }
logoutBtn.addEventListener("click", () => { sessionStorage.removeItem(SESSION_STORAGE_KEY); closeModal(); showLogin(); });

function loadRecords(){ try { return JSON.parse(localStorage.getItem(RECORDS_STORAGE_KEY)) || []; } catch { return []; } }
function saveRecords(){ localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records)); }

searchInput.addEventListener("input", renderRecords);
function getFilteredRecords(){
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return records;
  return records.filter(r => [r.patientName,r.rank,r.serviceNumber,r.unit,r.presentingComplaint,r.symptoms,r.clinicalAssessment].join(" ").toLowerCase().includes(q));
}
function renderRecords(){
  const filtered = getFilteredRecords();
  recordsList.innerHTML = "";
  totalRecords.textContent = records.length;
  displayedRecords.textContent = filtered.length;
  emptyState.classList.toggle("hidden", filtered.length !== 0);
  filtered.slice().sort((a,b)=>new Date(b.updatedAt||0)-new Date(a.updatedAt||0)).forEach(record => {
    const card = document.createElement("article");
    card.className = "record-card";
    card.innerHTML = `<div class="record-main"><div class="record-title-row"><div><h3>${escapeHtml(record.patientName)}</h3><p class="record-rank">${escapeHtml(record.rank)}</p></div><span class="record-status">Active Record</span></div><div class="record-meta"><div><span>Service Number</span><strong>${escapeHtml(record.serviceNumber || "Not recorded")}</strong></div><div><span>Unit</span><strong>${escapeHtml(record.unit || "Not recorded")}</strong></div><div><span>Updated</span><strong>${escapeHtml(formatDate(record.updatedAt))}</strong></div></div><div class="record-summary"><span>Complaint</span><p>${escapeHtml(record.presentingComplaint || "No complaint recorded.")}</p></div></div><div class="record-actions"><button class="btn btn-secondary edit-record-btn" data-id="${escapeHtml(record.id)}" type="button">Edit</button><button class="btn btn-danger delete-record-btn" data-id="${escapeHtml(record.id)}" type="button">Delete</button></div>`;
    recordsList.appendChild(card);
  });
}

newRecordBtn.addEventListener("click", () => { recordForm.reset(); recordId.value = ""; modalTitle.textContent = "New Medical Record"; setDefaultEncounterDate(); openModal(); });
recordsList.addEventListener("click", e => { const edit=e.target.closest(".edit-record-btn"), del=e.target.closest(".delete-record-btn"); if(edit) openEditRecord(edit.dataset.id); if(del) deleteRecord(del.dataset.id); });
function openEditRecord(id){
  const r = records.find(x => x.id === id); if (!r) return;
  modalTitle.textContent = "Edit Medical Record";
  recordId.value = r.id; patientName.value = r.patientName || ""; rank.value = r.rank || ""; serviceNumber.value = r.serviceNumber || ""; unit.value = r.unit || ""; dateOfBirth.value = r.dateOfBirth || ""; bloodGroup.value = r.bloodGroup || "";
  encounterDate.value = r.encounterDate || ""; medicalCategory.value = r.medicalCategory || ""; presentingComplaint.value = r.presentingComplaint || ""; symptoms.value = r.symptoms || ""; medicalHistory.value = r.medicalHistory || ""; allergies.value = r.allergies || ""; currentMedications.value = r.currentMedications || "";
  temperature.value = r.temperature || ""; heartRate.value = r.heartRate || ""; bloodPressure.value = r.bloodPressure || ""; respiratoryRate.value = r.respiratoryRate || ""; oxygenSaturation.value = r.oxygenSaturation || ""; painScore.value = r.painScore || "";
  clinicalAssessment.value = r.clinicalAssessment || ""; clinicalNotes.value = r.clinicalNotes || ""; recommendedTreatment.value = r.recommendedTreatment || "";
  openModal();
}
function deleteRecord(id){ if (!confirm("Delete this record?")) return; records = records.filter(r => r.id !== id); saveRecords(); renderRecords(); }
recordForm.addEventListener("submit", event => {
  event.preventDefault();
  const existingId = recordId.value, previous = records.find(r => r.id === existingId), now = new Date().toISOString();
  const record = { id: existingId || createId(), patientName: patientName.value.trim(), rank: rank.value.trim(), serviceNumber: serviceNumber.value.trim(), unit: unit.value.trim(), dateOfBirth: dateOfBirth.value, bloodGroup: bloodGroup.value, encounterDate: encounterDate.value, medicalCategory: medicalCategory.value.trim(), presentingComplaint: presentingComplaint.value.trim(), symptoms: symptoms.value.trim(), medicalHistory: medicalHistory.value.trim(), allergies: allergies.value.trim(), currentMedications: currentMedications.value.trim(), temperature: temperature.value.trim(), heartRate: heartRate.value.trim(), bloodPressure: bloodPressure.value.trim(), respiratoryRate: respiratoryRate.value.trim(), oxygenSaturation: oxygenSaturation.value.trim(), painScore: painScore.value.trim(), clinicalAssessment: clinicalAssessment.value.trim(), clinicalNotes: clinicalNotes.value.trim(), recommendedTreatment: recommendedTreatment.value.trim(), createdAt: previous?.createdAt || now, updatedAt: now };
  if (!record.patientName || !record.rank) return alert("Please enter at least Name and Rank.");
  records = existingId ? records.map(r => r.id === existingId ? record : r) : [...records, record];
  saveRecords(); renderRecords(); closeModal();
});

generateTreatmentBtn.addEventListener("click", () => { recommendedTreatment.value = generateRoleplayTreatmentAdvice(); });
function generateRoleplayTreatmentAdvice(){
  const complaint = presentingComplaint.value.trim() || "Not recorded", symptomText = symptoms.value.trim() || "Not recorded", historyText = medicalHistory.value.trim() || "Not recorded", allergyText = allergies.value.trim() || "Not recorded", assessmentText = clinicalAssessment.value.trim() || "Not recorded";
  const lower = `${complaint} ${symptomText} ${assessmentText}`.toLowerCase();
  let a = "RAMC ROBLOX ROLEPLAY TREATMENT ADVICE\n=====================================\n\nFor Roblox roleplay use only. Not real medical advice.\n\nPATIENT SUMMARY\n---------------\n";
  a += `Complaint: ${complaint}\nSymptoms: ${symptomText}\nMedical history: ${historyText}\nAllergies: ${allergyText}\nAssessment: ${assessmentText}\n\nSUGGESTED ROLEPLAY ACTIONS\n--------------------------\n`;
  if (lower.includes("gunshot") || lower.includes("gsw") || lower.includes("bleeding")) a += "• Apply field dressing and direct pressure.\n• Check airway, breathing and circulation.\n• Prepare casualty for urgent evacuation.\n• Record blood loss and treatment given.\n";
  else if (lower.includes("fracture") || lower.includes("broken") || lower.includes("sprain")) a += "• Immobilise the injured area.\n• Apply splint for roleplay.\n• Check circulation beyond injury.\n• Send to medical post for review.\n";
  else if (lower.includes("burn")) a += "• Cool the burn area in roleplay.\n• Cover with sterile dressing.\n• Do not remove stuck clothing.\n• Escalate if severe.\n";
  else if (lower.includes("head") || lower.includes("concussion")) a += "• Check consciousness level.\n• Monitor for confusion or worsening symptoms.\n• Keep under observation.\n• Refer to senior medic.\n";
  else if (lower.includes("heat") || lower.includes("dehydration")) a += "• Move patient to shade.\n• Remove excess kit.\n• Give fictional fluids if allowed by group rules.\n• Monitor condition.\n";
  else if (lower.includes("chest pain") || lower.includes("breathing")) a += "• Sit patient upright if comfortable.\n• Keep patient calm and still.\n• Request urgent senior medical support.\n";
  else a += "• Complete primary survey: airway, breathing, circulation.\n• Record observations.\n• Treat visible injuries.\n• Keep patient comfortable.\n• Refer to medical officer if needed.\n";
  a += "\nROLEPLAY MEDICATION NOTE\n------------------------\n• Medication should only be roleplayed if your Roblox group allows it.\n• Check recorded allergies before fictional treatment.\n• Do not use real-world dosages.\n• Document any fictional treatment given.\n\nRECOMMENDED ROLEPLAY DISPOSITION\n--------------------------------\n• Minor: treat and return to duty.\n• Moderate: hold at medical post.\n• Severe: evacuate to field hospital or senior medic.\n";
  return a;
}

appointmentsPageBtn.addEventListener("click", async () => { appointmentsPage.classList.remove("hidden"); await loadAppointments(); });
async function loadAppointments() {
  if (!appointmentsList || !appointmentCount) return;

  appointmentsPage.classList.remove("hidden");
  appointmentsList.innerHTML = "<p style='padding:20px;'>Loading appointments...</p>";

  try {
    const response = await fetch(APPOINTMENTS_CSV_URL + "&cacheBust=" + Date.now(), {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Could not load appointment CSV.");
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText)
      .map((row) => row.map((cell) => String(cell || "").trim()));

    if (rows.length <= 1) {
      appointmentCount.textContent = "(0)";
      appointmentsList.innerHTML =
        "<div class='empty-state'><h3>No appointments found</h3><p>No Google Form responses are currently listed.</p></div>";
      return;
    }

    const headers = rows[0];

    const bookings = rows.slice(1).filter((row) => {
      const timestamp = row[0] || "";
      const answerCells = row.slice(1).filter((cell) => cell !== "");
      return timestamp !== "" || answerCells.length >= 2;
    });

    appointmentCount.textContent = `(${bookings.length})`;
    appointmentsList.innerHTML = "";

    if (bookings.length === 0) {
      appointmentsList.innerHTML =
        "<div class='empty-state'><h3>No appointments found</h3><p>No Google Form responses are currently listed.</p></div>";
      return;
    }

    bookings.forEach((row, index) => {
      const card = document.createElement("article");
      card.className = "record-card";

      const nonEmptyAnswers = row.slice(1).filter((cell) => cell !== "");
      const title = nonEmptyAnswers[0] || `Appointment ${index + 1}`;
      const date = row[0] || "No timestamp";

      card.innerHTML = `
        <div class="record-main">
          <div class="record-title-row">
            <div>
              <h3>${escapeHtml(title)}</h3>
              <p class="record-rank">${escapeHtml(date)}</p>
            </div>
            <span class="record-status">Booking</span>
          </div>

          <div class="record-summary hidden"></div>
        </div>

        <div class="record-actions">
          <button class="btn btn-secondary open-appointment-btn" type="button">Open</button>
        </div>
      `;

      const summary = card.querySelector(".record-summary");

      summary.innerHTML = headers.map((header, i) => {
        const question = header || `Question ${i + 1}`;
        const answer = row[i] || "";
        return `<p><strong>${escapeHtml(question)}:</strong> ${escapeHtml(answer)}</p>`;
      }).join("");

      card.querySelector(".open-appointment-btn").addEventListener("click", () => {
        summary.classList.toggle("hidden");
      });

      appointmentsList.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    appointmentCount.textContent = "(0)";
    appointmentsList.innerHTML =
      "<div class='empty-state'><h3>Could not load appointments</h3><p>Check that the Google Sheet is published as CSV and that the correct response sheet was selected.</p></div>";
  }
}

function parseCSV(text){
  const rows=[]; let row=[], value="", quotes=false;
  for(let i=0;i<text.length;i++){ const c=text[i], next=text[i+1];
    if(c==='"' && quotes && next==='"'){ value+='"'; i++; } else if(c==='"') quotes=!quotes; else if(c==="," && !quotes){ row.push(value); value=""; } else if((c==="\n"||c==="\r")&&!quotes){ if(c==="\r"&&next==="\n") i++; if(value||row.length){ row.push(value); rows.push(row); row=[]; value=""; } } else value+=c;
  }
  if(value||row.length){ row.push(value); rows.push(row); }
  return rows;
}

function openModal(){ recordModal.classList.remove("hidden"); document.body.classList.add("modal-open"); }
function closeModal(){ if(!recordModal) return; recordModal.classList.add("hidden"); document.body.classList.remove("modal-open"); if(recordForm){ recordForm.reset(); recordId.value = ""; } }
closeModalBtn.addEventListener("click", closeModal); cancelBtn.addEventListener("click", closeModal);
recordModal.addEventListener("click", e => { if (e.target.dataset.closeModal === "true") closeModal(); });
function createId(){ return Date.now().toString(36) + Math.random().toString(36).slice(2); }
function setDefaultEncounterDate(){ if (encounterDate && !encounterDate.value) encounterDate.value = new Date().toISOString().slice(0,10); }
function formatDate(v){ return v ? new Date(v).toLocaleString() : "Not recorded"; }
function escapeHtml(v){ return String(v ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
