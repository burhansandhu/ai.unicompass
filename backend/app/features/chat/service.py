import httpx
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.features.chat.schemas import ChatMessageSchema

SYSTEM_INSTRUCTION_BASE = """You are the UniCompass AI Study Abroad Advisor, a knowledgeable, trusted educational counselor built specifically for Pakistani students aspiring to study abroad in the United Kingdom, Germany, France, Australia, Canada, the United States, Italy, and Europe.

Your Expertise and Pakistani Context:
1. Academic Credentials and Equivalence:
   - Understands Pakistani education system: Matric (SSC), FSc (HSSC Pre-Engineering, Pre-Medical, ICS), O/A-Levels, and 4-year Bachelor's degrees accredited by the Higher Education Commission (HEC).
   - Conversions: Understands Pakistani CGPA (scale 4.0/5.0) and how European/UK universities calculate equivalencies (UK 2:1 = ~3.0+ CGPA, 2:2 = ~2.6-2.9 CGPA; German Bavarian formula where 1.0-2.5 is passing).
2. Medium of Instruction (MOI) and English Language Waivers:
   - Knows which UK universities (e.g. Hertfordshire, Greenwich, Coventry, Chester, Anglia Ruskin) and German public universities accept an official MOI certificate issued by Pakistani universities (NUST, FAST, COMSATS, UET, Punjab University, LUMS, etc.) granting an exemption from IELTS.
   - Clarifies that the MOI letter must state: 'The medium of instruction, examinations, and research for the degree was entirely English.'
3. Financial Proof and Pakistani Rupee (PKR) Guidance:
   - Germany Blocked Account (Sperrkonto): Mandatory 11,904 EUR / year (~992 EUR/month), equivalent to approx 36-37 Lakhs PKR.
   - UK Student Visa (UKVI): Requires 28-day consecutive bank statement showing remaining tuition fee + living expenses (approx 1,023 GBP/month outside London or 1,334 GBP/month inside London for 9 months).
   - Italy DSU / Regional Grants: Up to 7,000 EUR/year + free canteen/housing based on family FBR income tax returns.
4. Document Verification and Legalization Pipeline:
   - Step 1: IBCC attestation for Matric/FSc.
   - Step 2: HEC e-portal attestation for Bachelor's/Master's degrees and transcripts (online verification + courier TCS/walk-in).
   - Step 3: MOFA (Ministry of Foreign Affairs) attestation / Apostille.
   - Germany APS Certificate: Mandatory for all Pakistani students applying to Germany via German Embassy Islamabad.
   - Visa filing: VFS Global / Gerry's in Islamabad, Lahore, Karachi, Peshawar, Mirpur.

Communication Style:
- Warm, polite, and encouraging (use 'As-salamu alaykum' or 'Assalam-o-Alaikum' when starting a conversation).
- Format your answers with clear markdown headings, bullet points, and bold highlights so it is easy to read.
- Provide direct, actionable advice tailored to Pakistani realities (e.g. FBR tax filer documents, currency buffers, early appointment booking).
- If information is missing from the student, politely ask them for their CGPA, target intake (e.g., Fall 2026), or preferred budget.
"""


async def generate_advisor_reply(
    messages: List[ChatMessageSchema],
    profile_context: Optional[Dict[str, Any]] = None,
) -> str:
    gemini_api_key = settings.GEMINI_API_KEY
    gemini_model = settings.GEMINI_MODEL or "gemini-3-flash-preview"

    # Build customized system prompt with student profile context if available
    system_text = SYSTEM_INSTRUCTION_BASE
    if profile_context:
        system_text += "\n\nStudent Registered Profile:\n"
        if profile_context.get("full_name"):
            system_text += f"- Name: {profile_context['full_name']}\n"
        if profile_context.get("cgpa"):
            system_text += f"- CGPA: {profile_context['cgpa']} / {profile_context.get('cgpa_scale', 4.0)}\n"
        if profile_context.get("degree_level"):
            system_text += f"- Degree Level: {profile_context['degree_level']}\n"
        if profile_context.get("field_of_study"):
            system_text += f"- Field of Study: {profile_context['field_of_study']}\n"
        if profile_context.get("target_intake"):
            system_text += f"- Target Intake: {profile_context['target_intake']}\n"
        if profile_context.get("target_destinations"):
            system_text += f"- Target Destinations: {profile_context['target_destinations']}\n"
        if profile_context.get("moi_eligible"):
            system_text += "- MOI Waiver Eligible: Yes\n"
        if profile_context.get("shortlisted_count") is not None:
            system_text += f"- Shortlisted Programs: {profile_context['shortlisted_count']}\n"

    # Format message history for Gemini API
    formatted_contents = []
    for msg in messages:
        role = "model" if msg.role in ["advisor", "model", "assistant"] else "user"
        clean_text = msg.text.strip()
        if clean_text:
            formatted_contents.append({
                "role": role,
                "parts": [{"text": clean_text}]
            })

    if not formatted_contents:
        return "Please ask a question about your study abroad plans, scholarships, or visa requirements."

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{gemini_model}:generateContent?key={gemini_api_key}"
    payload = {
        "system_instruction": {
            "parts": [{"text": system_text}]
        },
        "contents": formatted_contents,
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 1200,
        }
    }

    try:
        async with httpx.AsyncClient(timeout=35.0) as client:
            response = await client.post(url, json=payload)
            if response.status_code == 200:
                data = response.json()
                candidates = data.get("candidates", [])
                if candidates and "content" in candidates[0]:
                    parts = candidates[0]["content"].get("parts", [])
                    if parts and "text" in parts[0]:
                        return parts[0]["text"].strip()

            print(f"[Gemini Error] HTTP {response.status_code}: {response.text[:200]}")
    except Exception as e:
        print(f"[Gemini Exception] {e}")

    # Fallback response if API fails
    last_user_query = messages[-1].text.lower()
    if "moi" in last_user_query or "waiver" in last_user_query:
        return (
            "**Medium of Instruction (MOI) & English Waiver Rules for Pakistani Students:**\n\n"
            "- **United Kingdom:** Many UK universities accept an official MOI letter issued by your Pakistani university "
            "(NUST, FAST, COMSATS, UET, Punjab University, etc.) if your degree was conducted in English, granting direct IELTS exemption.\n"
            "- **Germany:** Most English-taught Master programs accept an MOI letter from your registrar.\n"
            "- **Requirement:** Ensure your registrar certifies that all lectures, coursework, and thesis were conducted entirely in English."
        )
    elif "block" in last_user_query or "sperrkonto" in last_user_query:
        return (
            "**Germany Blocked Account (Sperrkonto) 2026:**\n\n"
            "- Mandatory amount is **11,904 EUR/year** (992 EUR/month).\n"
            "- In Pakistani Rupees, this is approximately **36-37 Lakhs PKR** depending on bank exchange rates.\n"
            "- Providers: Expatrio, Fintiba, or Coracle."
        )
    return (
        "As-salamu alaykum! I am your UniCompass AI Study Advisor. "
        "I can assist you with Pakistani CGPA equivalencies, HEC/IBCC/MOFA degree attestation, "
        "UK/Germany MOI English waivers, and embassy visa requirements. How can I guide you today?"
    )
