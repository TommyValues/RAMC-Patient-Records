<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>RAMC Patient Record System</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main id="loginPage" class="login-page">
    <section class="login-card" aria-labelledby="loginTitle">
      <div class="logo-row">
        <div class="logo-box">RAMC<br><span>Logo</span></div>
        <div>
          <h1 id="loginTitle">Royal Army Medical Corps</h1>
          <p>Secure Patient Record System</p>
        </div>
        <div class="logo-box">Household<br><span>Cavalry</span></div>
      </div>

      <form id="loginForm" class="login-form">
        <label for="username">Username</label>
        <input id="username" name="username" type="text" autocomplete="username" required />

        <label for="password">Password</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required />

        <p id="loginError" class="error" role="alert"></p>
        <button type="submit">Log in</button>
      </form>
    </section>
  </main>

  <main id="appPage" class="app hidden" aria-live="polite">
    <header class="app-header">
      <div class="brand">
        <div class="logo-box small">RAMC</div>
        <div>
          <h1>RAMC Patient Records</h1>
          <p>Confidential clinical administration system</p>
        </div>
      </div>
      <div class="header-actions">
        <div class="logo-box small">HCav</div>
        <button id="logoutBtn" class="secondary">Log out</button>
      </div>
    </header>

    <section class="toolbar">
      <input id="searchInput" type="search" placeholder="Search by name, service number, rank, diagnosis, unit..." />
      <button id="newRecordBtn">New record</button>
      <button id="exportBtn" class="secondary">Export JSON</button>
      <label class="import-label secondary" for="importFile">Import JSON</label>
      <input id="importFile" type="file" accept="application/json" hidden />
    </section>

    <section class="layout">
      <aside class="records-panel">
        <h2>Patient Records</h2>
        <div id="recordList" class="record-list"></div>
      </aside>

      <section class="editor-panel">
        <form id="recordForm" class="record-form">
          <div class="form-header">
            <h2 id="formTitle">Add Patient Record</h2>
            <span id="savedStatus" class="status">Not saved</span>
          </div>

          <div class="grid">
            <label>Name<input id="name" required /></label>
            <label>Rank<input id="rank" placeholder="e.g. Trooper, Corporal, Captain" /></label>
            <label>Service Number<input id="serviceNumber" /></label>
            <label>Unit / Squadron<input id="unit" /></label>
            <label>Date of Birth<input id="dob" type="date" /></label>
            <label>Blood Group<input id="bloodGroup" placeholder="e.g. O+" /></label>
            <label>Allergies<input id="allergies" placeholder="e.g. Penicillin, NKDA" /></label>
            <label>Current Medication<input id="currentMedication" /></label>
            <label>Emergency Contact<input id="emergencyContact" /></label>
            <label>Priority<select id="priority"><option>Routine</option><option>Urgent</option><option>Emergency</option></select></label>
          </div>

          <label>Presenting Complaint<textarea id="complaint" rows="3"></textarea></label>
          <label>Observations / Vitals<textarea id="observations" rows="3" placeholder="Temp, pulse, BP, SpO₂, respiratory rate, pain score..."></textarea></label>
          <label>Medical History<textarea id="history" rows="3"></textarea></label>
          <label>Assessment / Diagnosis<textarea id="diagnosis" rows="3"></textarea></label>
          <label>Treatment Given<textarea id="treatmentGiven" rows="3"></textarea></label>
          <label>Follow-up / Disposal<textarea id="followUp" rows="3"></textarea></label>
          <label>Clinician Notes<textarea id="notes" rows="3"></textarea></label>

          <section class="ai-box">
            <div>
              <h3>Recommended Treatment Decision Support</h3>
              <p>This produces a cautious first-aid/clinical-support draft only. It is not a diagnosis and must be reviewed by an authorised clinician before action.</p>
            </div>
            <button type="button" id="recommendBtn" class="secondary">Generate recommendation</button>
            <textarea id="recommendedTreatment" rows="7" placeholder="AI-style recommendation will appear here after record details are entered."></textarea>
          </section>

          <div class="form-actions">
            <button type="submit">Save record</button>
            <button type="button" id="deleteBtn" class="danger">Delete record</button>
            <button type="button" id="clearBtn" class="secondary">Clear form</button>
          </div>
        </form>
      </section>
    </section>
  </main>

  <script src="app.js"></script>
</body>
</html>
