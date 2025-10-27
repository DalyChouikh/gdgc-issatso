export const EMAIL_TEMPLATES = {
  application_received: {
    name: "Application Received",
    subject: "We received your application",
    template: `
      <h1>Thank you for applying!</h1>
      <p>We have received your application and will review it shortly.</p>
      <p>You will be notified of the next steps via email.</p>
    `,
  },
  shortlisted: {
    name: "Shortlisted",
    subject: "Congratulations! You've been shortlisted",
    template: `
      <h1>Great news!</h1>
      <p>We are pleased to inform you that you have been shortlisted for the next round.</p>
      <p>We will contact you soon with interview details.</p>
    `,
  },
  interview_scheduled: {
    name: "Interview Scheduled",
    subject: "Your interview has been scheduled",
    template: `
      <h1>Interview Scheduled</h1>
      <p>Your interview has been scheduled. Please check your email for details.</p>
      <p>If you have any questions, please contact us.</p>
    `,
  },
  rejected: {
    name: "Application Status",
    subject: "Application Status Update",
    template: `
      <h1>Application Status</h1>
      <p>Thank you for your interest. Unfortunately, we will not be moving forward with your application at this time.</p>
      <p>We appreciate your time and wish you the best of luck.</p>
    `,
  },
  accepted: {
    name: "Accepted",
    subject: "Welcome to our team!",
    template: `
      <h1>Congratulations!</h1>
      <p>We are excited to welcome you to our team!</p>
      <p>Please check your email for onboarding details.</p>
    `,
  },
}

export function getTemplateByKey(key: keyof typeof EMAIL_TEMPLATES) {
  return EMAIL_TEMPLATES[key]
}

export function getAllTemplates() {
  return Object.entries(EMAIL_TEMPLATES).map(([key, value]) => ({
    key,
    ...value,
  }))
}
