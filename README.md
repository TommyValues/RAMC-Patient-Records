# RAMC Patient Record System Prototype

This is a local browser-based prototype for a Royal Army Medical Corps patient record system.

## Login

Username: `RAMCMedical`  
Password: `RAMCMedical01`

## How to run

Open `index.html` in a modern browser.

## Features

- Login-first page; records cannot be accessed unless logged in.
- Searchable patient record list.
- Add, edit, and delete records.
- Records save locally in the browser using `localStorage`.
- Export and import records as JSON.
- Professional RAMC-style interface with placeholder RAMC and Household Cavalry logo boxes.
- Decision-support recommendation generator.

## Important safety and security notes

This is a prototype only. It should not be used for real patient records without proper server-side authentication, encryption, audit logging, access controls, backups, GDPR/data protection review, clinical governance approval, and secure hosting.

The recommendation tool is intentionally cautious. It does not diagnose or automatically prescribe medication. Any treatment plan or prescription must be reviewed and authorised by a qualified clinician.

## Replacing the logos

The page contains text placeholders for RAMC and Household Cavalry logos. Replace the `.logo-box` elements in `index.html` with image tags when you have authorised logo files, for example:

```html
<img src="ramc-logo.png" alt="Royal Army Medical Corps logo" class="crest" />
```
