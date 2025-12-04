import { GoogleGenAI } from "@google/genai";
import { JobFormData } from "../types";

// Helper to construct the system prompt based on user requirements
const constructPrompt = (data: JobFormData): string => {
  const { jobTitle, location, isRelocationApplicable, rawNotes } = data;

  const relocationString = isRelocationApplicable ? "YES" : "NO";

  return `
You are an expert Talent Acquisition Partner at Shapr3D.

**YOUR TONE OF VOICE:**
* **Visionary & Ambitious:** Use language like "Disrupting," "Category-defining," "Uncapped potential."
* **Direct & Professional:** No emojis. No corporate fluff. Speak to the candidate like a peer.
* **Value-Driven:** Don't just list requirements; explain *why* they matter.

**YOUR FORMATTING RULES (CRITICAL):**
1.  **"Why this role?":** MUST use **Bold Headers** for impact (e.g., \`* **Shape the future:** Description\`).
2.  **"Benefits":** MUST use the **Bold Header – Narrative** format provided below (No emojis).
3.  **Layout:** Do not clump text. Keep sections distinct. Use a double line break (\\n\\n) before every main bold section header.

I will provide you with raw notes. Re-write them into the structure below.

### THE RULES:

1.  **"Why this role?" (The Pitch):**
    * **Customize the Headers:** Change the bold headers to match the role (e.g., "**Shape the future of CAD**" or "**Be the first in the US**").
    * **Be Specific:** Explain the specific impact.

2.  **"Benefits" (SELECT ONE LOCATION BLOCK):**
    * *Select the correct block based on my input location. Do not mix them.*
    * *Always include the "Global Baseline" bullets first, then append the specific location bullets.*

    * **Global Baseline (Include in ALL locations):**
        * **Massive market, untapped potential –** Shapr3D is disrupting a $70B+ CAD market. We’re not just iterating — we’re reimagining how millions of professionals design and build physical products.
        * **Ownership in a category-defining company –** You won’t just be along for the ride — you’ll own a part of it. With equity options, your success is directly tied to the company you help scale.
        * **A place to grow –** Work alongside the industry’s best with a $500/year personal development budget and a culture where bold thinking and continuous learning are the norm.
        * **Marathon, not a sprint –** We’re building for the long haul. We offer paid sabbaticals (3 weeks after 3 years, 5 weeks after 5 years) so you can fully recharge.

    * **If Budapest:**
        * **Premium health support –** We believe high performance requires being at 100%. We provide CIG private healthcare, 100% sick leave payment, and 3 extra days off when you just need to rest.
        * **Inspiring environment –** Work from our panoramic downtown office, with commuting support and doggy day-care support (because pets are family too).
        * *(Only include if I say "Relocation: YES"):* **Seamless relocation –** We want the best talent globally. We provide a full package (Flights, Visa, Housing, Bonus) to get you to Budapest smoothly.

    * **If Denver:**
        * **Comprehensive wellness –** We cover your bases with Medical, Dental, and Vision, plus Life and Disability insurance.
        * **Work-life balance –** We respect your life outside of work with 22 days PTO, 13 sick days, and 6 weeks parental leave.
        * **Invest in your future –** We help you plan ahead with 401(k) matching (100% up to 4%).
        * **Downtown access –** Parking is on us in our building’s garage.
        * *(Only include if I say "Relocation: YES"):* **Relocation support –** We offer assistance to help you make the move to Denver for this role.

    * **If Remote:**
        * **Remote-first setup –** We provide the hardware and software you need to do your best work, wherever you are.
        * **Global standards –** Through Remote.com, we ensure you receive comparable health and wellbeing benefits to our hub locations.
        * **Connection –** Remote doesn't mean alone. We host regular virtual team events and fly you to HQ to connect with the wider team.

### THE TEMPLATE STRUCTURE (Maintain this layout):

# ${jobTitle}

At Shapr3D, we’re transforming how industries design and innovate. From automotive and aerospace to consumer tech and industrial design, our platform powers some of the boldest ideas across industries that shape 16% of the global GDP.

Our multi-platform product has earned the Apple Design Award and is regularly featured in Apple Keynotes. With Series B backing and a rapidly growing user base, we’re scaling fast - and this is your chance to be part of the journey.

[INSTRUCTION: If the input notes contain a quote from a Hiring Manager, include it here. If NO quote is provided in the notes, DELETE this section entirely. Do not leave a placeholder.]

\\n\\n
**Why this role?**
* **[Impact Header 1]:** [Specific impact statement. E.g. "Shape the future of CAD"]
* **[Impact Header 2]:** [Specific project/goal details. E.g. "Drive innovation at scale"]
* **[Impact Header 3]:** [Closing hook. E.g. "Join at a pivotal moment"]

\\n\\n
**What you’ll do**
* [Action-oriented bullet point 1]
* [Action-oriented bullet point 2]
* [Action-oriented bullet point 3]
* [Action-oriented bullet point 4]

\\n\\n
**What you’ll bring**
* [Skill/Experience bullet point 1]
* [Skill/Experience bullet point 2]
* [Skill/Experience bullet point 3]
* [Skill/Experience bullet point 4]

\\n\\n
**A sneak peek into our stack...**
*(Include ONLY if technical. Keep as a list)*
* **Core CAD Engine:** C++20
* **iPadOS/macOS:** Swift
* **Windows:** C# and XAML (UWP)
* **Rendering Engine:** Metal APIs on Apple devices, DirectX11 on Windows
*(Modify above stack if role is Web/Data/Backend)*

\\n\\n
**Why you’ll love working here**
[Insert the correct Benefits Block from the RULES section above. Combine Global Baseline + Location Specifics]

\\n\\n
**About Shapr3D**
We don’t just innovate - we redefine the status quo in 3D design. With a multi-platform product reshaping CAD, we’re on a mission to empower every creator, engineer, and designer around the globe. By joining us, you’ll contribute to a top-tier product that’s not only award-winning but also deeply loved by its users - from solo inventors to Fortune 500 teams.

***

### INPUT DATA:
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
