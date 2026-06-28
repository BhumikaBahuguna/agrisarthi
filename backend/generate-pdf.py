import os
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        # Title banner
        self.set_font('helvetica', 'B', 15)
        self.set_text_color(20, 83, 45) # Deep leaf green
        self.cell(0, 10, 'AgriSarthi Full-Stack Telemetry Integration (Week 4)', border=False, align='C')
        self.ln(10)
        
        # Sub-bar
        self.set_fill_color(34, 197, 94) # Leaf green line
        self.rect(10, 20, 190, 1, 'F')
        self.ln(5)

    def footer(self):
        # Position at 1.5 cm from bottom
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        # Page number
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', align='C')

def build_pdf():
    pdf = PDF()
    pdf.alias_nb_pages()
    
    # ----------------------------------------------------
    # Page 1: Dashboard Loaded (Live Backend Telemetry)
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(2)
    
    # Report Header Info Block
    pdf.set_font("helvetica", "B", 12)
    pdf.set_text_color(21, 128, 61) # leaf-700
    pdf.cell(0, 8, "Internship Technical Assignment Report")
    pdf.ln(8)
    
    pdf.set_font("helvetica", size=9.5)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(0, 5, "Intern ID: BhumikaBahuguna")
    pdf.ln(5)
    pdf.cell(0, 5, "Project Platform: AgriSarthi Smart Agriculture")
    pdf.ln(5)
    pdf.cell(0, 5, "Module: Week 4 - Backend & API Development (Express.js CORS Server)")
    pdf.ln(8)
    
    # Screenshot 1 Details
    pdf.set_font("helvetica", "B", 10.5)
    pdf.set_text_color(30, 41, 59) # Slate-800
    pdf.cell(0, 7, "Screenshot 1: Frontend Dashboard displaying live API data on load")
    pdf.ln(7)
    
    pdf.set_font("helvetica", size=8.5)
    pdf.set_text_color(71, 85, 105) # Slate-600
    caption1 = ("Description: This view displays the AgriSarthi Dashboard loaded successfully at http://localhost:5173/dashboard. "
                "The page establishes a CORS-compliant connection to the Express.js API server running on port 5000. "
                "Dynamic statistics (Active Farms, Current Crops, Weather Alerts) are calculated by the API endpoint "
                "GET /api/crops/stats and loaded into cards, while the list grid pulls in-memory crop cycles from GET /api/crops.")
    pdf.multi_cell(0, 4.2, caption1)
    pdf.ln(3)
    
    screenshot1 = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "screenshot1_dashboard.png"))
    if os.path.exists(screenshot1):
        # Fits nicely in A4 page
        pdf.image(screenshot1, x=10, y=60, w=190, h=142.5)
    else:
        pdf.set_font("helvetica", "B", 12)
        pdf.set_text_color(220, 38, 38)
        pdf.cell(0, 10, f"[Verification Warning: {os.path.basename(screenshot1)} not found yet]")
        pdf.ln(10)

    # ----------------------------------------------------
    # Page 2: Creation Form Modal
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(2)
    
    pdf.set_font("helvetica", "B", 10.5)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 7, "Screenshot 2: Crop Cycle Form Dialog with input validations")
    pdf.ln(7)
    
    pdf.set_font("helvetica", size=8.5)
    pdf.set_text_color(71, 85, 105)
    caption2 = ("Description: Demonstrating the crop creation workspace in the custom Modal overlay. "
                "The form fields (Crop Name, Variety, Category, status, field acreage, and timelines) are filled "
                "for a new crop record ('Potato', variety 'Kufri Jyoti'). Validation constraints are enforced on "
                "the client side (verifying required entries and positive acreage numbers) before transmission.")
    pdf.multi_cell(0, 4.2, caption2)
    pdf.ln(3)
    
    screenshot2 = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "screenshot2_modal.png"))
    if os.path.exists(screenshot2):
        pdf.image(screenshot2, x=10, y=45, w=190, h=142.5)
    else:
        pdf.set_font("helvetica", "B", 12)
        pdf.set_text_color(220, 38, 38)
        pdf.cell(0, 10, f"[Verification Warning: {os.path.basename(screenshot2)} not found yet]")
        pdf.ln(10)

    # ----------------------------------------------------
    # Page 3: Execution Telemetry Logs (Status 200/201 Success)
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(2)
    
    pdf.set_font("helvetica", "B", 10.5)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 7, "Screenshot 3: Updated dashboard list and successful API Telemetry Console")
    pdf.ln(7)
    
    pdf.set_font("helvetica", size=8.5)
    pdf.set_text_color(71, 85, 105)
    caption3 = ("Description: Post-submission state showing the crops list successfully refreshed and the 'Current Crops' count "
                "incremented to '07' after adding the Potato crop. At the bottom, the console highlights the REST API operations "
                "logged in real-time by the frontend interceptors: the POST request to create the cycle (HTTP 201 Created), "
                "followed by the automatically triggered GET requests to stats and crops endpoints (HTTP 200 OK) with latency "
                "measurements in milliseconds. This satisfies the network telemetry status check.")
    pdf.multi_cell(0, 4.2, caption3)
    pdf.ln(3)
    
    screenshot3 = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "screenshot3_completed.png"))
    if os.path.exists(screenshot3):
        pdf.image(screenshot3, x=10, y=45, w=190, h=142.5)
    else:
        pdf.set_font("helvetica", "B", 12)
        pdf.set_text_color(220, 38, 38)
        pdf.cell(0, 10, f"[Verification Warning: {os.path.basename(screenshot3)} not found yet]")
        pdf.ln(10)
        
    output_pdf = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "W4_FrontendBackendConnection_BhumikaBahuguna.pdf"))
    pdf.output(output_pdf)
    print(f"SUCCESS: Telemetry connection PDF successfully compiled to: {output_pdf}")

if __name__ == "__main__":
    build_pdf()
