/**
 * Security utilities — rate limiting, sanitization, bot detection
 */

// ========================
// RATE LIMITER (per-action, localStorage-based)
// ========================
const RATE_LIMITS = {
  contact_form: { maxAttempts: 3, windowMs: 60 * 60 * 1000 },       // 3 per hour
  job_application: { maxAttempts: 5, windowMs: 24 * 60 * 60 * 1000 }, // 5 per day
  intern_application: { maxAttempts: 5, windowMs: 24 * 60 * 60 * 1000 },
  newsletter: { maxAttempts: 3, windowMs: 60 * 60 * 1000 },
  campaign_form: { maxAttempts: 5, windowMs: 60 * 60 * 1000 },
  fcm_token: { maxAttempts: 3, windowMs: 60 * 60 * 1000 },
}

export function checkRateLimit(action) {
  const config = RATE_LIMITS[action]
  if (!config) return { allowed: true }

  const key = `hiideals_rl_${action}`
  const now = Date.now()

  try {
    const stored = JSON.parse(localStorage.getItem(key) || '[]')
    // Filter to only attempts within the window
    const recent = stored.filter(t => now - t < config.windowMs)

    if (recent.length >= config.maxAttempts) {
      const resetIn = Math.ceil((recent[0] + config.windowMs - now) / 60000)
      return { allowed: false, message: `Too many attempts. Please try again in ${resetIn} minute${resetIn > 1 ? 's' : ''}.` }
    }

    // Record this attempt
    recent.push(now)
    localStorage.setItem(key, JSON.stringify(recent))
    return { allowed: true }
  } catch {
    return { allowed: true } // Fail open if localStorage unavailable
  }
}

// ========================
// INPUT SANITIZATION
// ========================
export function sanitizeInput(str) {
  if (typeof str !== 'string') return str
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

export function sanitizeFormData(data) {
  const sanitized = {}
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value)
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(v => typeof v === 'string' ? sanitizeInput(v) : v)
    } else {
      sanitized[key] = value
    }
  }
  return sanitized
}

// ========================
// EMAIL VALIDATION (strict)
// ========================
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return re.test(email.trim()) && email.length <= 254
}

// ========================
// PHONE VALIDATION
// ========================
export function isValidPhone(phone) {
  if (!phone) return true // Optional field
  const re = /^[+]?[\d\s()-]{7,15}$/
  return re.test(phone.trim())
}

// ========================
// BOT DETECTION — Honeypot + Timing
// ========================

/**
 * Creates a bot detection context. Call on form mount.
 * Returns { isBot(), honeypotProps }
 */
export function createBotDetector() {
  const mountTime = Date.now()

  return {
    // Honeypot field name (obscure, not "honeypot")
    honeypotField: 'website_url',

    // Check if submission is likely from a bot
    isBot(honeypotValue) {
      // 1. Honeypot was filled (humans don't see it)
      if (honeypotValue && honeypotValue.trim() !== '') return true

      // 2. Form submitted too fast (< 2 seconds = bot)
      const elapsed = Date.now() - mountTime
      if (elapsed < 2000) return true

      return false
    },
  }
}

// ========================
// CONTENT LENGTH LIMITS
// ========================
export const LIMITS = {
  name: 100,
  email: 254,
  phone: 20,
  subject: 100,
  message: 5000,
  coverLetter: 5000,
  experience: 100,
  college: 200,
  branch: 100,
  skills: 500,
  year: 20,
  position: 200,
}

export function enforceLimit(value, field) {
  const max = LIMITS[field]
  if (!max || typeof value !== 'string') return value
  return value.slice(0, max)
}
