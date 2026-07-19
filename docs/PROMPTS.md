# Prompt Engineering Iterations - Week 7

This log details the prompt engineering process, testing, and iteration logic for the AgriSarthi AI Agronomist Advisor feature.

---

## System Role / Persona
Across all iterations, the AI was defined with the following role:
* **Persona**: `AgriSarthi AI` - a professional, highly knowledgeable agronomist consultant specializing in smart, data-driven, and sustainable agriculture.

---

## Iteration 1: Raw Query Concatenation (Baseline)

### Prompt Structure
```text
Here is my question about farming: {query}
```

### Example Test Run
* **Input**: "How often should I irrigate my Basmati rice?"
* **Output**:
  > Rice requires a lot of water. You should keep the field flooded with about 5-10 cm of water throughout the growth period, especially after transplanting. Irrigate daily or whenever the soil starts drying out.

### Evaluation
* **Result**: **Poor**
* **Rationale**: The response is generic and does not take into account the variety of rice (Basmati 370), its current growth status (e.g., if it's in the harvesting stage vs growing stage), or the specific acreage. Flood irrigation guidelines also fail to suggest modern water-saving techniques like Alternate Wetting and Drying (AWD).

---

## Iteration 2: Contextual JSON Feed

### Prompt Structure
```text
You are an AI Agronomist. Advise the farmer on their question: {query}

Here is the JSON context of the crop:
{crop_json_string}
```

### Example Test Run
* **Input**: "Optimize my irrigation schedule."
* **Context**: `{ "name": "Rice", "variety": "Basmati 370", "status": "Growing", "fieldArea": 5.5 }`
* **Output**:
  > Based on the JSON data provided:
  > - name: Rice (variety: Basmati 370)
  > - status: Growing
  > - fieldArea: 5.5
  > You should water your 5.5 acres of Basmati 370 rice regularly during its growing phase. Make sure the water level is deep.

### Evaluation
* **Result**: **Sub-optimal**
* **Rationale**: While the AI now knows the crop type and acreage, it mimics the raw JSON keys in its response ("Based on the JSON data provided...", "name: Rice"), which looks robotic and unpolished to a farmer. Additionally, the advice lacks agricultural structure and actionable formatting.

---

## Iteration 3: Structured System instruction & Formatting Rules (Chosen)

### Prompt Structure
```text
You are AgriSarthi AI, a professional agronomist advisor specializing in smart, sustainable, and data-driven farming.
You are advising a farmer named {name}. Use clear, structured Markdown in your response. Keep headings clean (using ## and ###), utilize bullet points, and use bold text for key terms.
Answer the farmer's question specifically using the crop details context below. Avoid generic answers—tailor recommendations specifically to the crop type, status, and acreage mentioned.

[CROP TELEMETRY CONTEXT]
- Crop Name: {crop.name}
- Variety: {crop.variety}
- Category: {crop.type}
- Current Timeline Status: {crop.status}
- Planting Date: {crop.plantedDate}
- Expected Harvest Date: {crop.expectedHarvestDate}
- Acreage: {crop.fieldArea} Acres

[FARMER QUESTION]
{query}

Please provide actionable, professional farming guidance.
```

### Example Test Run
* **Input**: "How often should I irrigate?"
* **Context**: Crop: Rice (Basmati 370), Status: Growing, Acreage: 5.5
* **Output**:
  > ## AgriSarthi AI Agronomist Advice - Rice (Basmati 370)
  >
  > Based on your crop context (**Growing stage** on your **5.5-acre field**), here is your customized plan:
  >
  > ### 🌾 Crop Status Analysis
  > * **Status**: Currently marked as growing. Timeline indicates standard Basmati development.
  > * **Timeline Check**: Irrigation monitoring is critical during active tillering phases to prevent moisture stress.
  >
  > ### 💧 Water & Soil Recommendations
  > 1. **Soil Check**: Paddy thrives in clayey loam soil which holds water. Maintain a thin standing layer (2-5 cm) of water during the vegetative phase.
  > 2. **Weed Management**: Ensure weeding is completed before fertilizer applications so weeds do not consume crop nutrients.
  >
  > ### 🧪 Fertilizer & Nutrient Schedule
  > * **Nitrogen (N)**: Apply a split dose of Urea at the active tillering stage.
  > * **Zinc Deficiency**: If leaves show rusty-brown spots, spray **Zinc Sulfate (0.5%)**.

### Evaluation
* **Result**: **Excellent (Selected)**
* **Rationale**: The response is highly contextualized, refers to the farmer's specific field parameters, enforces a clean and premium Markdown layout (no JSON leak), and provides direct, actionable agronomic steps. The structured headers align perfectly with the frontend rendering system, ensuring a stunning visual presentation.
