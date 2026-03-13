import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, eventType, details, phone, date, venue } = body;

    if (!name || !email || !eventType || !details) {
      return new Response(
        JSON.stringify({ error: 'Name, email, event type, and details are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send email via Resend
    const resendApiKey = import.meta.env.RESEND_API_KEY;

    if (resendApiKey) {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);

      await resend.emails.send({
        from: 'Penalty Box Booking <bookings@penaltybox25.com>',
        to: ['bookings@penaltybox25.com'],
        replyTo: email,
        subject: `Booking Inquiry: ${eventType} — ${name}`,
        html: `
          <h2>New Booking Inquiry</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px; font-weight: bold;">Name</td><td style="padding: 8px;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;">${escapeHtml(email)}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Phone</td><td style="padding: 8px;">${escapeHtml(phone || 'Not provided')}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Event Type</td><td style="padding: 8px;">${escapeHtml(eventType)}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Date</td><td style="padding: 8px;">${escapeHtml(date || 'Not specified')}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Venue</td><td style="padding: 8px;">${escapeHtml(venue || 'Not specified')}</td></tr>
          </table>
          <h3>Details</h3>
          <p>${escapeHtml(details).replace(/\n/g, '<br>')}</p>
        `,
      });
    } else {
      // Log to console if no Resend key (development)
      console.log('Booking inquiry received (no RESEND_API_KEY configured):');
      console.log({ name, email, phone, eventType, date, venue, details });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Booking submission error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to process booking inquiry.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
