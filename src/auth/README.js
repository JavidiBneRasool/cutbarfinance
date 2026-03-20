/**
 * auth/
 * ─────────────────────────────────────────────────────────────
 * PHASE 6: Login / Signup / Reset Password
 *
 * Planned screens:
 * - AuthPage.jsx         — entry point, decides login vs signup
 * - LoginScreen.jsx      — email+password OR phone OTP
 * - SignupScreen.jsx     — name + email/phone + password + referral code
 * - ResetScreen.jsx      — email reset or phone OTP reset
 * - OtpScreen.jsx        — 6-digit OTP verification
 * - BiometricScreen.jsx  — Face ID / Fingerprint (Phase 7)
 *
 * Auth flow:
 * 1. User opens app → check Firebase onAuthStateChanged
 * 2. Not logged in → show AuthPage
 * 3. Logged in → show main CUTBAR app
 * 4. First login → show onboarding (account type selection)
 *
 * Security:
 * - Phone OTP via Firebase Auth (already working in BankPage)
 * - Email/password via Firebase Auth
 * - Session stored in Firebase (auto-refresh JWT)
 * - 2FA for withdrawals > ₹10,000 (TOTP / SMS)
 * ─────────────────────────────────────────────────────────────
 */
