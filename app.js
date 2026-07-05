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

  let advice = `RAMC ROLEPLAY TREATMENT ADVICE\n`;
  advice += `==============================\n\n`;
  advice += `For Roblox roleplay use only. Not real medical advice.\n\n`;

  advice += `PATIENT SUMMARY\n`;
  advice += `---------------\n`;
  advice += `Complaint: ${complaint}\n`;
  advice += `Symptoms: ${symptomText}\n`;
  advice += `Medical history: ${historyText}\n`;
  advice += `Allergies: ${allergyText}\n`;
  advice += `Assessment: ${assessmentText}\n\n`;

  advice += `SUGGESTED ROLEPLAY ACTIONS\n`;
  advice += `--------------------------\n`;

  if (lowerText.includes("gunshot") || lowerText.includes("gsw") || lowerText.includes("bleeding")) {
    advice += `• Apply field dressing and direct pressure to bleeding area.\n`;
    advice += `• Check airway, breathing and circulation.\n`;
    advice += `• Elevate limb if appropriate.\n`;
    advice += `• Prepare casualty for urgent evacuation.\n`;
    advice += `• Record blood loss and treatment given.\n`;
  } else if (lowerText.includes("fracture") || lowerText.includes("broken") || lowerText.includes("sprain")) {
    advice += `• Immobilise the injured area.\n`;
    advice += `• Apply a splint if available.\n`;
    advice += `• Check circulation beyond the injury.\n`;
    advice += `• Advise rest and transport to medical post.\n`;
  } else if (lowerText.includes("burn")) {
    advice += `• Cool the burn with clean water.\n`;
    advice += `• Cover with a sterile dressing.\n`;
    advice += `• Do not remove stuck clothing.\n`;
    advice += `• Escalate if burn is severe or covers a large area.\n`;
  } else if (lowerText.includes("concussion") || lowerText.includes("head")) {
    advice += `• Check level of consciousness.\n`;
    advice += `• Monitor for confusion, vomiting or worsening headache.\n`;
    advice += `• Keep patient under observation.\n`;
    advice += `• Refer to senior medic or medical officer.\n`;
  } else if (lowerText.includes("dehydration") || lowerText.includes("heat")) {
    advice += `• Move patient to shade or cool area.\n`;
    advice += `• Encourage fluids if conscious and safe to drink.\n`;
    advice += `• Remove excess equipment.\n`;
    advice += `• Monitor temperature and condition.\n`;
  } else if (lowerText.includes("chest pain") || lowerText.includes("breathing")) {
    advice += `• Sit patient upright if comfortable.\n`;
    advice += `• Check breathing and oxygen level if available.\n`;
    advice += `• Keep patient calm and still.\n`;
    advice += `• Request urgent senior medical support.\n`;
  } else {
    advice += `• Complete primary survey: airway, breathing, circulation.\n`;
    advice += `• Record observations.\n`;
    advice += `• Treat visible injuries.\n`;
    advice += `• Keep patient comfortable and monitored.\n`;
    advice += `• Refer to medical officer if symptoms continue or worsen.\n`;
  }

  advice += `\nROLEPLAY MEDICATION NOTE\n`;
  advice += `------------------------\n`;
  advice += `• Medication may be roleplayed only if allowed by your Roblox group rules.\n`;
  advice += `• Check recorded allergies before giving any fictional medication.\n`;
  advice += `• Do not use real-world dosages.\n`;
  advice += `• Document any fictional treatment given.\n\n`;

  advice += `RECOMMENDED DISPOSITION\n`;
  advice += `-----------------------\n`;
  advice += `• Minor case: treat and return to duty when stable.\n`;
  advice += `• Moderate case: hold at medical post for observation.\n`;
  advice += `• Severe case: evacuate to field hospital or senior medic.\n\n`;

  advice += `FINAL NOTE\n`;
  advice += `----------\n`;
  advice += `This is fictional RAMC roleplay guidance for Roblox only.`;

  return advice;
}
