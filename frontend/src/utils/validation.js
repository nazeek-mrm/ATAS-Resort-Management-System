/**
 * Validation utilities for ATAS Resort
 */

/**
 * Validate email address strictly.
 * Blocks non-filled, incomplete, or typo email addresses:
 * e.g. @, @g, @gm, @gma, @gmai, @gmail, @gmail., @gmail.c, @gmail.co, etc.
 * Enforces complete domains (@gmail.com, @yahoo.com, etc.).
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      title: 'Email Required',
      message: 'Please enter your email address to continue.'
    }
  }

  const trimmed = email.trim()
  if (!trimmed) {
    return {
      isValid: false,
      title: 'Email Required',
      message: 'Please enter your email address to continue.'
    }
  }

  // Must contain exactly one '@'
  const atParts = trimmed.split('@')
  if (atParts.length < 2 || !atParts[1]) {
    return {
      isValid: false,
      title: 'Incomplete Email',
      message: 'Please enter a complete email address including domain (e.g. name@gmail.com).'
    }
  }

  if (atParts.length > 2) {
    return {
      isValid: false,
      title: 'Invalid Email',
      message: 'Email address cannot contain multiple "@" symbols.'
    }
  }

  const [username, domain] = atParts
  const lowerDomain = domain.toLowerCase()

  // Username validation
  if (!username || !/^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+$/.test(username)) {
    return {
      isValid: false,
      title: 'Invalid Email',
      message: 'Email username contains invalid characters.'
    }
  }

  if (username.startsWith('.') || username.endsWith('.') || username.includes('..')) {
    return {
      isValid: false,
      title: 'Invalid Email',
      message: 'Email username cannot start, end, or contain consecutive dots.'
    }
  }

  // Domain cannot be empty or without dot
  // Handles: @, @g, @gm, @gma, @gmai, @gmail
  if (!lowerDomain.includes('.')) {
    return {
      isValid: false,
      title: 'Incomplete Email Domain',
      message: `Incomplete email! Please enter a full domain (e.g. ${lowerDomain === 'gmail' ? 'name@gmail.com' : 'name@example.com'}).`
    }
  }

  // Domain cannot end with dot
  // Handles: @gmail. or @domain.
  if (lowerDomain.endsWith('.')) {
    return {
      isValid: false,
      title: 'Incomplete Email Domain',
      message: 'Incomplete email! Domain cannot end with a dot. Please enter the full extension like .com.'
    }
  }

  // Domain cannot start with dot or have consecutive dots
  if (lowerDomain.startsWith('.') || lowerDomain.includes('..')) {
    return {
      isValid: false,
      title: 'Invalid Email Domain',
      message: 'Email domain has invalid dot placement. Please enter a valid email address.'
    }
  }

  const domainParts = lowerDomain.split('.')
  const mainDomain = domainParts[0]
  const tld = domainParts[domainParts.length - 1]

  // Top level domain must be at least 2 alphabetical characters (e.g. reject single letter like .c)
  if (tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return {
      isValid: false,
      title: 'Incomplete Email Extension',
      message: 'Incomplete email extension! Domain must end with a full valid extension like .com or .lk.'
    }
  }

  // Check all domain segments
  for (const part of domainParts) {
    if (!part || !/^[a-z0-9-]+$/.test(part) || part.startsWith('-') || part.endsWith('-')) {
      return {
        isValid: false,
        title: 'Invalid Email Domain',
        message: 'Email domain contains invalid characters or incomplete labels.'
      }
    }
  }

  // Major provider domain verification:
  // 1. GMAIL: Must be gmail.com or googlemail.com (rejects @gmail.co, @gmail.con, @gmail.c, etc.)
  if (mainDomain === 'gmail') {
    if (lowerDomain !== 'gmail.com' && lowerDomain !== 'googlemail.com') {
      return {
        isValid: false,
        title: 'Invalid Gmail Address',
        message: `Incomplete or invalid Gmail address "@${domain}"! Gmail addresses must end with "@gmail.com".`
      }
    }
  }

  // 2. YAHOO: Rejects incomplete typos like @yahoo.co, @yahoo.c, @yahoo.con
  if (mainDomain === 'yahoo') {
    if (lowerDomain === 'yahoo.co' || lowerDomain === 'yahoo.c' || lowerDomain === 'yahoo.con') {
      return {
        isValid: false,
        title: 'Incomplete Yahoo Address',
        message: `Incomplete Yahoo address "@${domain}"! Did you mean "@yahoo.com"?`
      }
    }
  }

  // 3. HOTMAIL: Rejects @hotmail.co, @hotmail.c, @hotmail.con
  if (mainDomain === 'hotmail') {
    if (lowerDomain === 'hotmail.co' || lowerDomain === 'hotmail.c' || lowerDomain === 'hotmail.con') {
      return {
        isValid: false,
        title: 'Incomplete Hotmail Address',
        message: `Incomplete Hotmail address "@${domain}"! Did you mean "@hotmail.com"?`
      }
    }
  }

  // 4. OUTLOOK: Rejects @outlook.co, @outlook.c, @outlook.con
  if (mainDomain === 'outlook') {
    if (lowerDomain === 'outlook.co' || lowerDomain === 'outlook.c' || lowerDomain === 'outlook.con') {
      return {
        isValid: false,
        title: 'Incomplete Outlook Address',
        message: `Incomplete Outlook address "@${domain}"! Did you mean "@outlook.com"?`
      }
    }
  }

  // 5. ICLOUD: Must be icloud.com
  if (mainDomain === 'icloud') {
    if (lowerDomain !== 'icloud.com') {
      return {
        isValid: false,
        title: 'Incomplete iCloud Address',
        message: `Incomplete iCloud address "@${domain}"! Did you mean "@icloud.com"?`
      }
    }
  }

  // General regex check
  const generalRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
  if (!generalRegex.test(trimmed)) {
    return {
      isValid: false,
      title: 'Invalid Email',
      message: 'Please enter a valid, complete email address (e.g. name@gmail.com).'
    }
  }

  return { isValid: true }
}

/**
 * Returns suggested email domain if a common typo is detected
 */
export function getEmailSuggestion(email) {
  if (!email || !email.includes('@')) return null
  const parts = email.trim().split('@')
  if (parts.length !== 2) return null
  const [user, domain] = parts
  const d = domain.toLowerCase()

  if (d === 'gmail.co' || d === 'gmail.c' || d === 'gmail.con' || d === 'gmail.cm' || d === 'gmai.com' || d === 'gmial.com') {
    return `${user}@gmail.com`
  }
  if (d === 'yahoo.co' || d === 'yahoo.c' || d === 'yahoo.con' || d === 'yaho.com') {
    return `${user}@yahoo.com`
  }
  if (d === 'hotmail.co' || d === 'hotmail.c' || d === 'hotmial.com') {
    return `${user}@hotmail.com`
  }
  if (d === 'outlook.co' || d === 'outlook.c') {
    return `${user}@outlook.com`
  }
  return null
}
