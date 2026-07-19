import os
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 15)
        self.set_text_color(20, 83, 45) # Deep leaf green
        self.cell(0, 10, 'AgriSarthi AI Advisor Integration (Week 7)', border=False, align='C')
        self.ln(10)
        self.set_fill_color(34, 197, 94) # Leaf green line
        self.rect(10, 20, 190, 1, 'F')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', align='C')

def build_pdf():
    pdf = PDF()
    pdf.alias_nb_pages()

    # Base folder (Assuming this script is run from backend/)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # ----------------------------------------------------
    # Page 1: Input Screen
    # ----------------------------------------------------
    pdf.add_page()
    pdf.set_font("helvetica", "B", 12)
    pdf.set_text_color(21, 128, 61)
    pdf.cell(0, 8, "Intern ID: BhumikaBahuguna | Week 7")
    pdf.ln(8)
    
    pdf.set_font("helvetica", "B", 10.5)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 7, "1. User Input Screen")
    pdf.ln(7)
    
    pdf.set_font("helvetica", size=8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 4.2, "Description: The AI Agronomist Advisor screen allows authenticated farmers to select one of their registered crops to use as active context. The user inputs their prompt (e.g. asking about nitrogen management) in the inquiry box.")
    pdf.ln(3)
    
    screenshot1 = os.path.join(base_dir, "..", "w7_1_input.png")
    if os.path.exists(screenshot1):
        pdf.image(screenshot1, x=10, y=50, w=190, h=142.5)
    else:
        pdf.set_text_color(220, 38, 38)
        pdf.cell(0, 10, "[Missing: w7_1_input.png]")

    # ----------------------------------------------------
    # Page 2: Loading State
    # ----------------------------------------------------
    pdf.add_page()
    pdf.set_font("helvetica", "B", 10.5)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 7, "2. AI Loading State (Pending Request)")
    pdf.ln(7)
    
    pdf.set_font("helvetica", size=8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 4.2, "Description: While the frontend awaits the JSON response from the backend AI service, a custom loader and pulse skeleton state are rendered to provide dynamic feedback to the user.")
    pdf.ln(3)
    
    screenshot2 = os.path.join(base_dir, "..", "w7_2_loading.png")
    if os.path.exists(screenshot2):
        pdf.image(screenshot2, x=10, y=35, w=190, h=142.5)
    else:
        pdf.set_text_color(220, 38, 38)
        pdf.cell(0, 10, "[Missing: w7_2_loading.png]")

    # ----------------------------------------------------
    # Page 3: Output State and Network Telemetry
    # ----------------------------------------------------
    pdf.add_page()
    pdf.set_font("helvetica", "B", 10.5)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 7, "3. Final AI Output & API Network Log")
    pdf.ln(7)
    
    pdf.set_font("helvetica", size=8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 4.2, "Description: The backend processes the Google Gemini API advice response, formatting the outputs dynamically. The telemetry panel below displays the successful HTTP POST /api/ai/advise request returning 200 OK.")
    pdf.ln(3)
    
    screenshot3 = os.path.join(base_dir, "..", "w7_3_output.png")
    if os.path.exists(screenshot3):
        pdf.image(screenshot3, x=10, y=35, w=190, h=142.5)
    else:
        pdf.set_text_color(220, 38, 38)
        pdf.cell(0, 10, "[Missing: w7_3_output.png]")

    # Export PDF
    output_pdf = os.path.join(base_dir, "..", "W7_AIFeatureDemo_BhumikaBahuguna.pdf")
    pdf.output(output_pdf)
    print(f"SUCCESS: AI verification PDF successfully compiled to: {output_pdf}")

if __name__ == "__main__":
    build_pdf()
