const domainRoleMap = [
  { pattern: /^admin\.edu$/i, role: 'admin' },
  { pattern: /^staff\.edu$/i, role: 'staff' },
  { pattern: /^student\.school\.edu$/i, role: 'student' },
  { pattern: /^.*@gmail\.com$/i, role: 'student' },
];

function assignRoleByEmail(email) {
  if (!email || typeof email !== 'string') {
    return 'student'; // fallback
  }

  // Extract domain from email
  const domainMatch = email.match(/@([\w.-]+)$/);
  const domain = domainMatch ? domainMatch[1] : null;

  // Default role
  let role = 'student';

  for (const rule of domainRoleMap) {
    if (rule.pattern.test(email) || (domain && rule.pattern.test(domain))) {
      role = rule.role;
      break;
    }
  }

  return role;
}

module.exports = {
  assignRoleByEmail,
};
