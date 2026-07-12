import os
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 15)
        self.set_text_color(20, 83, 45) # Deep leaf green
        self.cell(0, 10, 'AgriSarthi Authentication & Security Verification (Week 6)', border=False, align='C')
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
    # Page 1: Route Protection & Redirect
    # ----------------------------------------------------
    pdf.add_page()
    pdf.set_font("helvetica", "B", 12)
    pdf.set_text_color(21, 128, 61)
    pdf.cell(0, 8, "Intern ID: BhumikaBahuguna | Week 6")
    pdf.ln(8)
    
    pdf.set_font("helvetica", "B", 10.5)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 7, "1. Protected Route Guard (Redirect)")
    pdf.ln(7)
    
    pdf.set_font("helvetica", size=8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 4.2, "Description: Accessing the protected '/dashboard' route directly while unauthenticated results in an automatic redirect to '/login'. The frontend route guard checks the state context and intercepts the unauthorized session.")
    pdf.ln(3)
    
    screenshot1 = os.path.join(base_dir, "..", "w6_1_redirect.png")
    if os.path.exists(screenshot1):
        pdf.image(screenshot1, x=10, y=50, w=190, h=142.5)
    else:
        pdf.set_text_color(220, 38, 38)
        pdf.cell(0, 10, "[Missing: w6_1_redirect.png]")

    # ----------------------------------------------------
    # Page 2: Registration
    # ----------------------------------------------------
    pdf.add_page()
    pdf.set_font("helvetica", "B", 10.5)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 7, "2. User Registration (Password Hashing via bcrypt)")
    pdf.ln(7)
    
    pdf.set_font("helvetica", size=8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 4.2, "Description: The registration form accepts email, password, and name. Submitting this sends the data to '/api/auth/register'. The backend validates the inputs via Zod, verifies email uniqueness, hashes the password with 12 rounds of bcrypt, and persists the record to the PostgreSQL database.")
    pdf.ln(3)
    
    screenshot2 = os.path.join(base_dir, "..", "w6_2_register.png")
    if os.path.exists(screenshot2):
        pdf.image(screenshot2, x=10, y=35, w=190, h=142.5)
    else:
        pdf.set_text_color(220, 38, 38)
        pdf.cell(0, 10, "[Missing: w6_2_register.png]")

    # ----------------------------------------------------
    # Page 3: Credentials Login
    # ----------------------------------------------------
    pdf.add_page()
    pdf.set_font("helvetica", "B", 10.5)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 7, "3. Credentials Login & Dashboard Load (JWT Persistence)")
    pdf.ln(7)
    
    pdf.set_font("helvetica", size=8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 4.2, "Description: Logging in with valid credentials retrieves a signed JSON Web Token (JWT) from the backend. The token is saved securely in localStorage. The React app reads the JWT to make authenticated API requests to crops endpoints, successfully loading the dashboard.")
    pdf.ln(3)
    
    screenshot4 = os.path.join(base_dir, "..", "w6_4_dashboard_loaded.png")
    if os.path.exists(screenshot4):
        pdf.image(screenshot4, x=10, y=35, w=190, h=142.5)
    else:
        pdf.set_text_color(220, 38, 38)
        pdf.cell(0, 10, "[Missing: w6_4_dashboard_loaded.png]")

    # ----------------------------------------------------
    # Page 4: Google OAuth Consent Screen
    # ----------------------------------------------------
    pdf.add_page()
    pdf.set_font("helvetica", "B", 10.5)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 7, "4. OAuth Integration: Consent Screen")
    pdf.ln(7)
    
    pdf.set_font("helvetica", size=8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 4.2, "Description: Clicking Google Sign In redirects the user to the Google OAuth consent endpoint. If credentials are not configured in .env, the backend gracefully falls back to this sandbox mock consent screen, showing authorization scopes.")
    pdf.ln(3)
    
    screenshot5 = os.path.join(base_dir, "..", "w6_5_oauth_consent.png")
    if os.path.exists(screenshot5):
        pdf.image(screenshot5, x=10, y=35, w=190, h=142.5)
    else:
        pdf.set_text_color(220, 38, 38)
        pdf.cell(0, 10, "[Missing: w6_5_oauth_consent.png]")

    # ----------------------------------------------------
    # Page 5: Google OAuth Logged-In State
    # ----------------------------------------------------
    pdf.add_page()
    pdf.set_font("helvetica", "B", 10.5)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 7, "5. OAuth Integration: Redirection & Success State")
    pdf.ln(7)
    
    pdf.set_font("helvetica", size=8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 4.2, "Description: After authorizing, Google redirects back to the callback URL. The backend exchanges the code, reads the profile, links it in the database, generates a JWT, redirects back to the frontend, and logs the user in successfully.")
    pdf.ln(3)
    
    screenshot6 = os.path.join(base_dir, "..", "w6_6_oauth_success.png")
    if os.path.exists(screenshot6):
        pdf.image(screenshot6, x=10, y=35, w=190, h=142.5)
    else:
        pdf.set_text_color(220, 38, 38)
        pdf.cell(0, 10, "[Missing: w6_6_oauth_success.png]")

    # ----------------------------------------------------
    # Page 6: Rate Limiting
    # ----------------------------------------------------
    pdf.add_page()
    pdf.set_font("helvetica", "B", 10.5)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 7, "6. Rate Limiting Enforcement (HTTP 429 Too Many Requests)")
    pdf.ln(7)
    
    pdf.set_font("helvetica", size=8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 4.2, "Description: To prevent brute force login attempts, express-rate-limit is applied. Exceeding 5 failures within 15 minutes triggers an HTTP 429 response, displaying a clear block error message in the UI.")
    pdf.ln(3)
    
    screenshot7 = os.path.join(base_dir, "..", "w6_7_rate_limit.png")
    if os.path.exists(screenshot7):
        pdf.image(screenshot7, x=10, y=35, w=190, h=142.5)
    else:
        pdf.set_text_color(220, 38, 38)
        pdf.cell(0, 10, "[Missing: w6_7_rate_limit.png]")

    # Export PDF
    output_pdf = os.path.join(base_dir, "..", "W6_AuthFlowScreenshots_BhumikaBahuguna.pdf")
    pdf.output(output_pdf)
    print(f"SUCCESS: Week 6 Auth screenshots PDF successfully compiled to: {output_pdf}")

if __name__ == "__main__":
    build_pdf()
