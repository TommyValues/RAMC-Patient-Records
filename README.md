# RAMC Patient Record System Prototype

This is a front-end prototype with a small Node/Express server so it can run on Render, Railway, Replit, or locally.

## Login

- Username: `RAMCMedical`
- Password: `RAMCMedical01`

The login page is the first screen. Records are hidden until the user logs in.

## Run locally

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

## Deploy on Render

Use these settings:

- Build Command: `npm install`
- Start Command: `npm start`
- Root Directory: leave blank if uploading this whole folder/repo

This version includes `src/server.js`, which fixes the error:

```text
Cannot find module '/opt/render/project/src/server.js'
```

## Data storage

Records are saved in the browser's localStorage for prototype/demo use. This is not suitable for real medical records.

For a real clinical deployment, replace localStorage with a secure server database, encrypted storage, audit logging, role-based access control, NHS/MoD information-governance review, and qualified clinician oversight.

## Logos

The page contains professional RAMC and Household Cavalry logo placeholders. Replace the placeholders with authorised official image files only.

## AI treatment support

The recommended treatment section is decision support only. It drafts clinical considerations from the entered record and explicitly requires qualified clinician review. It does not provide autonomous prescriptions.
