"use strict";

const SESSION_STORAGE_KEY = "ramcMedicalLoggedIn";
const APPOINTMENTS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT5CrXy-JFTbEFqA9ArJJ3SoW2Di_PK-4cH9Cx1VxFJW9uY1LA_rwMoIRT__DDYOMezlc8DpI86fkTf/pub?output=csv";
const APPOINTMENT_STATUS_STORAGE_KEY = "ramcAppointmentStatuses";

const appointmentCount = document.getElementById("appointmentCount");
const totalBookings = document.getElementById("totalBookings");
const appointmentsList = document.getElementById("appointmentsList");
const bookingStatus = document.getElementById("bookingStatus");
const refreshAppointmentsBtn = document.getElementById("refreshAppointmentsBtn");
const logoutBtn = document.getElementById("logoutBtn");

if (sessionStorage.getItem(SESSION_STORAGE_KEY) !== "true") {
  window.location.replace("index.html");
}

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  window.location.replace("index.html");
});

refreshAppointmentsBtn.addEventListener("click", loadAppointments);
document.addEventListener("DOMContentLoaded", loadAppointments);

function loadSavedStatuses() {
  try {
    return JSON.parse(localStorage.getItem(APPOINTMENT_STATUS_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveStatuses(statuses) {
  localStorage.setItem(APPOINTMENT_STATUS_STORAGE_KEY, JSON.stringify(statuses));
}

function getBookingKey(row, index) {
  return btoa(unescape(encodeURIComponent(`${row[0] || ""}|${row[1] || ""}|${index}`)));
}

async function loadAppointments() {
  appointmentsList.innerHTML = "<p style='padding:20px;'>Loading appointments...</p>";
  bookingStatus.textContent = "Loading";

  try {
    const response = await fetch(APPOINTMENTS_CSV_URL + "&cacheBust=" + Date.now(), {
      cache: "no-store"
    });

    if (!response.ok) throw new Error("Could not load appointment CSV.");

    const rows = parseCSV(await response.text())
      .map((row) => row.map((cell) => String(cell || "").trim()));

    const headers = rows[0] || [];
    const bookings = rows.slice(1).filter((row) => {
      const timestamp = row[0] || "";
      const answerCells = row.slice(1).filter((cell) => cell !== "");
      return timestamp !== "" || answerCells.length >= 2;
    });

    appointmentCount.textContent = `(${bookings.length})`;
    totalBookings.textContent = bookings.length;
    bookingStatus.textContent = "Online";
    appointmentsList.innerHTML = "";

    if (bookings.length === 0) {
      appointmentsList.innerHTML =
        "<div class='empty-state'><h3>No appointments found</h3><p>No Google Form responses are currently listed.</p></div>";
      return;
    }

    const savedStatuses = loadSavedStatuses();

    bookings.forEach((row, index) => {
      const bookingKey = getBookingKey(row, index);
      const saved = savedStatuses[bookingKey] || {
        completed: false,
        status: "Pending Review",
        priority: "Routine",
        notes: ""
      };

      const card = document.createElement("article");
      card.className = "record-card";

      const nonEmptyAnswers = row.slice(1).filter((cell) => cell !== "");
      const title = nonEmptyAnswers[0] || `Appointment ${index + 1}`;
      const timestamp = row[0] || "No timestamp";

      card.innerHTML = `
        <div class="record-main">
          <div class="record-title-row">
            <div>
              <h3>${escapeHtml(title)}</h3>
              <p class="record-rank">${escapeHtml(timestamp)}</p>
            </div>
            <span class="record-status appointment-status-label">${escapeHtml(saved.completed ? "Completed" : saved.status)}</span>
          </div>

          <div class="record-meta">
            <div>
              <span>Completion</span>
              <strong>${saved.completed ? "Completed" : "Not completed"}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>${escapeHtml(saved.status)}</strong>
            </div>
            <div>
              <span>Priority</span>
              <strong>${escapeHtml(saved.priority)}</strong>
            </div>
          </div>

          <div class="appointment-controls">
            <label class="checkbox-row">
              <input class="appointment-completed-checkbox" type="checkbox" ${saved.completed ? "checked" : ""} />
              <span>Appointment Completed</span>
            </label>

            <div class="appointment-control-grid">
              <label>
                Status
                <select class="appointment-status-select">
                  <option ${saved.status === "Pending Review" ? "selected" : ""}>Pending Review</option>
                  <option ${saved.status === "Confirmed" ? "selected" : ""}>Confirmed</option>
                  <option ${saved.status === "In Progress" ? "selected" : ""}>In Progress</option>
                  <option ${saved.status === "Needs Follow-Up" ? "selected" : ""}>Needs Follow-Up</option>
                  <option ${saved.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                  <option ${saved.status === "No Show" ? "selected" : ""}>No Show</option>
                </select>
              </label>

              <label>
                Priority
                <select class="appointment-priority-select">
                  <option ${saved.priority === "Routine" ? "selected" : ""}>Routine</option>
                  <option ${saved.priority === "Priority" ? "selected" : ""}>Priority</option>
                  <option ${saved.priority === "Urgent" ? "selected" : ""}>Urgent</option>
                </select>
              </label>
            </div>

            <label>
              Admin Notes
              <textarea class="appointment-notes" rows="3" placeholder="Optional notes for this booking...">${escapeHtml(saved.notes || "")}</textarea>
            </label>
          </div>

          <div class="record-summary hidden"></div>
        </div>

        <div class="record-actions">
          <button class="btn btn-secondary open-appointment-btn" type="button">Open</button>
          <button class="btn btn-primary save-appointment-status-btn" type="button">Save Status</button>
        </div>
      `;

      const summary = card.querySelector(".record-summary");
      const label = card.querySelector(".appointment-status-label");
      const completedCheckbox = card.querySelector(".appointment-completed-checkbox");
      const statusSelect = card.querySelector(".appointment-status-select");
      const prioritySelect = card.querySelector(".appointment-priority-select");
      const notesBox = card.querySelector(".appointment-notes");

      summary.innerHTML = headers.map((header, i) => {
        const question = header || `Question ${i + 1}`;
        return `<p><strong>${escapeHtml(question)}:</strong> ${escapeHtml(row[i] || "")}</p>`;
      }).join("");

      const openButton = card.querySelector(".open-appointment-btn");
      openButton.addEventListener("click", () => {
        const opening = summary.classList.contains("hidden");
        summary.classList.toggle("hidden");
        openButton.textContent = opening ? "Close" : "Open";
      });

      function persistStatus() {
        const allStatuses = loadSavedStatuses();

        allStatuses[bookingKey] = {
          completed: completedCheckbox.checked,
          status: statusSelect.value,
          priority: prioritySelect.value,
          notes: notesBox.value.trim(),
          updatedAt: new Date().toISOString()
        };

        saveStatuses(allStatuses);

        label.textContent = completedCheckbox.checked ? "Completed" : statusSelect.value;

        card.querySelector(".record-meta").innerHTML = `
          <div>
            <span>Completion</span>
            <strong>${completedCheckbox.checked ? "Completed" : "Not completed"}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>${escapeHtml(statusSelect.value)}</strong>
          </div>
          <div>
            <span>Priority</span>
            <strong>${escapeHtml(prioritySelect.value)}</strong>
          </div>
        `;
      }

      completedCheckbox.addEventListener("change", () => {
        if (completedCheckbox.checked) {
          statusSelect.value = "Confirmed";
        }
        persistStatus();
      });

      statusSelect.addEventListener("change", persistStatus);
      prioritySelect.addEventListener("change", persistStatus);
      card.querySelector(".save-appointment-status-btn").addEventListener("click", () => {
        persistStatus();
        alert("Appointment status saved.");
      });

      appointmentsList.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    appointmentCount.textContent = "(0)";
    totalBookings.textContent = "0";
    bookingStatus.textContent = "Unavailable";
    appointmentsList.innerHTML =
      "<div class='empty-state'><h3>Could not load appointments</h3><p>Check the published Google Sheet CSV connection.</p></div>";
  }
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      value += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") i++;
      if (value || row.length) {
        row.push(value);
        rows.push(row);
        row = [];
        value = "";
      }
    } else {
      value += char;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  return rows;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
