import os
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 15)
        self.set_text_color(20, 83, 45) # Deep leaf green
        self.cell(0, 10, 'AgriSarthi CRUD Verification (Week 5)', border=False, align='C')
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
    # Page 1: Create
    # ----------------------------------------------------
    pdf.add_page()
    pdf.set_font("helvetica", "B", 12)
    pdf.set_text_color(21, 128, 61)
    pdf.cell(0, 8, "Intern ID: BhumikaBahuguna | Week 5")
    pdf.ln(8)
    
    pdf.set_font("helvetica", "B", 10.5)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 7, "1. Create Operation")
    pdf.ln(7)
    
    pdf.set_font("helvetica", size=8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 4.2, "Description: The user filled out the 'Add New Crop Cycle' form and successfully saved a new crop to the PostgreSQL database.")
    pdf.ln(3)
    
    screenshot1 = os.path.join(base_dir, "..", "crud1_create.png")
    if os.path.exists(screenshot1):
        pdf.image(screenshot1, x=10, y=50, w=190, h=142.5)
    else:
        pdf.set_text_color(220, 38, 38)
        pdf.cell(0, 10, "[Missing: Please place crud1_create.png in the project root folder]")

    # ----------------------------------------------------
    # Page 2: Read
    # ----------------------------------------------------
    pdf.add_page()
    pdf.set_font("helvetica", "B", 10.5)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 7, "2. Read Operation")
    pdf.ln(7)
    
    pdf.set_font("helvetica", size=8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 4.2, "Description: The dashboard is rendering a list of records retrieved dynamically from the Prisma database using a GET API call.")
    pdf.ln(3)
    
    screenshot2 = os.path.join(base_dir, "..", "crud2_read.png")
    if os.path.exists(screenshot2):
        pdf.image(screenshot2, x=10, y=35, w=190, h=142.5)
    else:
        pdf.set_text_color(220, 38, 38)
        pdf.cell(0, 10, "[Missing: Please place crud2_read.png in the project root folder]")

    # ----------------------------------------------------
    # Page 3: Update
    # ----------------------------------------------------
    pdf.add_page()
    pdf.set_font("helvetica", "B", 10.5)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 7, "3. Update Operation")
    pdf.ln(7)
    
    pdf.set_font("helvetica", size=8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 4.2, "Description: The user edited an existing crop record (e.g., changed status or acreage) and the updated record is displayed on the dashboard, confirming the PUT API execution.")
    pdf.ln(3)
    
    screenshot3 = os.path.join(base_dir, "..", "crud3_update.png")
    if os.path.exists(screenshot3):
        pdf.image(screenshot3, x=10, y=35, w=190, h=142.5)
    else:
        pdf.set_text_color(220, 38, 38)
        pdf.cell(0, 10, "[Missing: Please place crud3_update.png in the project root folder]")

    # ----------------------------------------------------
    # Page 4: Delete
    # ----------------------------------------------------
    pdf.add_page()
    pdf.set_font("helvetica", "B", 10.5)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 7, "4. Delete Operation")
    pdf.ln(7)
    
    pdf.set_font("helvetica", size=8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 4.2, "Description: The user confirmed the deletion of a crop cycle. The dashboard verifies its removal from the PostgreSQL database via a DELETE API call.")
    pdf.ln(3)
    
    screenshot4 = os.path.join(base_dir, "..", "crud4_delete.png")
    if os.path.exists(screenshot4):
        pdf.image(screenshot4, x=10, y=35, w=190, h=142.5)
    else:
        pdf.set_text_color(220, 38, 38)
        pdf.cell(0, 10, "[Missing: Please place crud4_delete.png in the project root folder]")

    # Export PDF
    output_pdf = os.path.join(base_dir, "..", "W5_CRUDVerification_BhumikaBahuguna.pdf")
    pdf.output(output_pdf)
    print(f"SUCCESS: CRUD Verification PDF successfully compiled to: {output_pdf}")

if __name__ == "__main__":
    build_pdf()
