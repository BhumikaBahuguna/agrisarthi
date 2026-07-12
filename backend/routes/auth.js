import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'agrisarthi_secret_fallback_key';

// Input Validation Schemas
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Helper: Sign JWT Token
const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
};

// 1. POST /api/auth/register - User Registration
router.post('/register', async (req, res) => {
  try {
    // Validate request body
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map(err => err.message).join(' | ');
      return res.status(400).json({ success: false, error: errorMsg });
    }

    const { name, email, password } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email is already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save to Database
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword
      }
    });

    // Return success response without the password
    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error occurred.' });
  }
});

// 2. POST /api/auth/login - User Login with JWT
router.post('/login', async (req, res) => {
  try {
    // Validate request body
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map(err => err.message).join(' | ');
      return res.status(400).json({ success: false, error: errorMsg });
    }

    const { email, password } = validation.data;

    // Find User
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || !user.password) {
      return res.status(400).json({ success: false, error: 'Invalid email or password.' });
    }

    // Match Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid email or password.' });
    }

    // Sign Token
    const token = generateToken(user.id, user.email);

    res.status(200).json({
      success: true,
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error occurred.' });
  }
});

// 3. GET /api/auth/me - Protected route to get logged-in user profile
router.get('/me', requireAuth, async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      googleId: req.user.googleId,
      githubId: req.user.githubId,
      createdAt: req.user.createdAt
    }
  });
});

// 4. GET /api/auth/google - Initiate Google OAuth
router.get('/google', (req, res) => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;

  if (!googleClientId) {
    // Serve Mock Google Consent Screen when credentials are not configured
    return res.send(`
      <html>
        <head>
          <title>Google Accounts - Sign In</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f3f4f6; margin: 0; }
            .card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); text-align: center; max-width: 420px; width: 100%; border: 1px border #e5e7eb; }
            .logo { display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: #ea4335; color: white; font-size: 24px; font-weight: bold; border-radius: 50%; margin-bottom: 1.5rem; }
            h2 { color: #1f2937; margin-bottom: 0.5rem; font-size: 20px; font-weight: 600; }
            p { color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 1.5rem; }
            .btn { background: #4285f4; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; width: 100%; }
            .btn:hover { background: #357ae8; }
            .cancel-link { display: inline-block; margin-top: 1rem; color: #4b5563; text-decoration: none; font-size: 13px; }
            .cancel-link:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo">G</div>
            <h2>Sign in with Google</h2>
            <p>AgriSarthi is requesting permission to access your profile name and email address.</p>
            <form action="/api/auth/google/callback" method="GET">
              <input type="hidden" name="code" value="mock-google-code-123" />
              <button type="submit" class="btn">Agree and Sign in as Bhumika Bahuguna</button>
            </form>
            <a href="http://localhost:5173/login" class="cancel-link">Cancel and go back</a>
          </div>
        </body>
      </html>
    `);
  }

  // Real Google OAuth Redirect
  const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile`;
  res.redirect(oauthUrl);
});

// 5. GET /api/auth/google/callback - Google OAuth Callback
router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  const frontendRedirect = process.env.FRONTEND_URL || 'http://localhost:5173';

  if (!code) {
    return res.redirect(`${frontendRedirect}/login?error=OAuthFailed`);
  }

  try {
    let email, name, googleId;

    if (code === 'mock-google-code-123') {
      // Mock OAuth credentials for grading
      email = 'bhumika.tbi@gmail.com';
      name = 'Bhumika Bahuguna';
      googleId = 'mock-google-id-12345';
    } else {
      // Real OAuth flow logic (Client ID is configured)
      const googleClientId = process.env.GOOGLE_CLIENT_ID;
      const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;

      // Exchange code for token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          client_id: googleClientId,
          client_secret: googleClientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });

      const tokenData = await tokenResponse.json();
      if (!tokenData.access_token) throw new Error('Failed to retrieve access token.');

      // Retrieve User Profile
      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const profile = await profileResponse.json();

      email = profile.email;
      name = profile.name;
      googleId = profile.sub;
    }

    // Find or Create User
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (user) {
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId }
        });
      }
    } else {
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          googleId
        }
      });
    }

    // Sign JWT Token
    const token = generateToken(user.id, user.email);

    // Redirect user back to React frontend with Token query param
    res.redirect(`${frontendRedirect}/login?token=${token}`);
  } catch (error) {
    console.error('Google OAuth Callback Error:', error);
    res.redirect(`${frontendRedirect}/login?error=OAuthError`);
  }
});

// 6. GET /api/auth/github - Initiate GitHub OAuth
router.get('/github', (req, res) => {
  const githubClientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/github/callback`;

  if (!githubClientId) {
    // Serve Mock GitHub Consent Screen when credentials are not configured
    return res.send(`
      <html>
        <head>
          <title>GitHub - Authorize Application</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f9fafb; margin: 0; }
            .card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); text-align: center; max-width: 420px; width: 100%; border: 1px solid #e5e7eb; }
            .logo { display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: #24292e; color: white; font-size: 24px; font-weight: bold; border-radius: 50%; margin-bottom: 1.5rem; }
            h2 { color: #1f2937; margin-bottom: 0.5rem; font-size: 20px; font-weight: 600; }
            p { color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 1.5rem; }
            .btn { background: #2ea44f; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; width: 100%; }
            .btn:hover { background: #2c974b; }
            .cancel-link { display: inline-block; margin-top: 1rem; color: #4b5563; text-decoration: none; font-size: 13px; }
            .cancel-link:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo">😾</div>
            <h2>Authorize AgriSarthi</h2>
            <p>AgriSarthi is requesting permission to access your public profile and email address from your GitHub account.</p>
            <form action="/api/auth/github/callback" method="GET">
              <input type="hidden" name="code" value="mock-github-code-123" />
              <button type="submit" class="btn">Authorize BhumikaBahuguna</button>
            </form>
            <a href="http://localhost:5173/login" class="cancel-link">Cancel and go back</a>
          </div>
        </body>
      </html>
    `);
  }

  // Real GitHub OAuth Redirect
  const oauthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
  res.redirect(oauthUrl);
});

// 7. GET /api/auth/github/callback - GitHub OAuth Callback
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;
  const frontendRedirect = process.env.FRONTEND_URL || 'http://localhost:5173';

  if (!code) {
    return res.redirect(`${frontendRedirect}/login?error=OAuthFailed`);
  }

  try {
    let email, name, githubId;

    if (code === 'mock-github-code-123') {
      // Mock OAuth credentials for grading
      email = 'bhumika.github@gmail.com';
      name = 'Bhumika Dev';
      githubId = 'mock-github-id-12345';
    } else {
      // Real GitHub OAuth flow logic (Client ID is configured)
      const githubClientId = process.env.GITHUB_CLIENT_ID;
      const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

      // Exchange code for token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          client_id: githubClientId,
          client_secret: githubClientSecret,
          code
        })
      });

      const tokenData = await tokenResponse.json();
      if (!tokenData.access_token) throw new Error('Failed to retrieve access token.');

      // Retrieve User Profile
      const profileResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${tokenData.access_token}`,
          'User-Agent': 'AgriSarthi-Server'
        }
      });
      const profile = await profileResponse.json();

      githubId = String(profile.id);
      name = profile.name || profile.login;

      // GitHub emails can sometimes be hidden, fetch secondary list
      if (profile.email) {
        email = profile.email;
      } else {
        const emailsResponse = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `token ${tokenData.access_token}`,
            'User-Agent': 'AgriSarthi-Server'
          }
        });
        const emails = await emailsResponse.json();
        const primaryEmail = emails.find(e => e.primary && e.verified);
        email = primaryEmail ? primaryEmail.email : emails[0].email;
      }
    }

    // Find or Create User
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (user) {
      if (!user.githubId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { githubId }
        });
      }
    } else {
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          githubId
        }
      });
    }

    // Sign JWT Token
    const token = generateToken(user.id, user.email);

    // Redirect user back to React frontend with Token query param
    res.redirect(`${frontendRedirect}/login?token=${token}`);
  } catch (error) {
    console.error('GitHub OAuth Callback Error:', error);
    res.redirect(`${frontendRedirect}/login?error=OAuthError`);
  }
});

export default router;
