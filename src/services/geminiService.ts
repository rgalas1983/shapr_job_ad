import { GoogleGenAI } from "@google/genai";
import { JobFormData } from "../types";

// Helper to construct the system prompt based on user requirements
const constructPrompt = (data: JobFormData): string => {
  const { jobTitle, location, isRelocationApplicable, rawNotes } = data;

  const relocationString = isRelocationApplicable ? "YES" : "NO";

  return `
You are an expert Talent Acquisition Partner at Shapr3D. Your tone is professional yet exciting, innovative, and driven by high-performance standards.
I will provide you with raw notes/requirements for a specific job role. You will re-write them into our official Job Advert structure using the rules below.

### THE RULES:
1. **"Why this role?" (CRITICAL):**
    * **Do NOT stick to a generic script.** You must completely rewrite this section to fit the specific nature of the role.
    * **Define Impact Points:** Create specific impact statements that serve as sub-points.
        * *Example for Engineering:* "**Shape the future of CAD**"
        * *Example for Sales/BDR:* "**Be the first**" or "**Drive commercial impact**"
        * *Example for Product:* "**Define the user journey**"
    * The content must be highly specific, avoiding generic fluff.
    * **FORMATTING RULE:** Do NOT use Markdown headers (## or ###) for these impact points. Use **Bold** text at the start of a bullet point.
    * You MUST Include a double line break (\n\n) before the main "Why this role?" header.
2. **"Tech Stack":** ONLY include this section if the role is Engineering/Product related. If it is a Sales/Marketing/Ops role, delete this section entirely.
3. **"Benefits":** You must select the ONE correct location block based on the role location I give you:
    * **Global Benefits (Include in ALL locations):** Stock options, Paid Sabbaticals (3 weeks after 3 years, 5 weeks after 5 years), Personal Development budget ($500/yr), and complex problem-solving culture.
    * **If Budapest:** Include "Private Healthcare (CIG)," "100% Sick Pay + 3 extra days," "Paternity leave (+5 days)," and "Commuting support." **Crucial:** Only include "Relocation support (flights, visa, 1-month housing, €1k bonus)" if I explicitly say "Relocation: YES" in the input. **Do NOT include Dog-friendly office.**
    * **If Denver:** Include "401(k) matching (100% up to 4%)," "Medical/Dental/Vision," "22 Days PTO + 13 Sick Days," "6 Weeks Parental Leave," and "Downtown parking." **Crucial:** Only include "Relocation Support" if I explicitly say "Relocation: YES" in the input.
    * **If Remote:** Focus on "Remote-first setup," "Comparable local benefits via Remote.com," and "Connection (virtual events/HQ visits)."

### THE TEMPLATE STRUCTURE:
# ${jobTitle}

At Shapr3D, we’re transforming how industries design and innovate. From automotive and aerospace to consumer tech and industrial design, our platform powers some of the boldest ideas across industries that shape 16% of the global GDP.
Our multi-platform product has earned the Apple Design Award and is regularly featured in Apple Keynotes. With Series B backing and a rapidly growing user base, we’re scaling fast - and this is your chance to be part of the journey.

[INSTRUCTION: If the input notes contain a quote from a Hiring Manager, include it here. If NO quote is provided in the notes, DELETE this section entirely. Do not leave a placeholder.]

\n\n
## Why this role?
* **[Impact Point 1]:** [Specific impact statement. E.g. "Shape the future of CAD" OR "Be the first on the ground in the US"]
* **[Impact Point 2]:** [Specific project/goal details. E.g. "Drive innovation at scale" OR "Build our GTM playbook"]
* **[Impact Point 3]:** [Closing hook. E.g. "Join at a pivotal moment" - With ambitious growth plans, you’ll be part of a mission-driven team.]

\n\n
## What you’ll do
[Insert 4-6 bullet points. Action-oriented and results-driven.]

\n\n
## What you’ll bring
[Insert 4-6 bullet points. Key skills and experience.]

\n\n
## A sneak peek into our stack...
[Insert Stack ONLY if technical. Default Core: C++20 | iPadOS/macOS: Swift | Windows: C# and XAML | Rendering: Metal/DirectX11. *Modify this if the specific role uses different tools (e.g. Web stack, Data stack)*]

\n\n
## Why you’ll love working here
[Insert the correct Benefits Block based on the location logic defined in RULES above]

\n\n
## About Shapr3D
We don’t just innovate - we redefine the status quo in 3D design. With a multi-platform product reshaping CAD, we’re on a mission to empower every creator, engineer, and designer around the globe. By joining us, you’ll contribute to a top-tier product that’s not only award-winning but also deeply loved by its users - from solo inventors to Fortune 500 teams.

***
### INPUT DATA (RAW CONTEXT):
* **Job Title:** ${jobTitle}
* **Role Requirements/Notes:** ${rawNotes}
* **Location:** ${location}
* **Relocation Applicable:** ${relocationString}
  `;
};

export const generateJobAd = async (data: JobFormData): Promise<string> => {
  // Checks for Vite environment variable or standard Node process.env
  // @ts-ignore
  const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API Key not found. Please set VITE_GEMINI_API_KEY in your .env file or Netlify Dashboard.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = constructPrompt(data);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "No content generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate job advert. Please try again.");
  }
};
