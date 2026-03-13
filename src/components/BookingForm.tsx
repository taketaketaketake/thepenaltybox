import { useState, type FormEvent } from 'react';

const EVENT_TYPES = [
  'Speaking Engagement',
  'Autograph Signing',
  'Corporate Event',
  'Private Appearance',
  'Other',
];

export default function BookingForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone'),
          eventType: data.get('eventType'),
          date: data.get('date'),
          venue: data.get('venue'),
          details: data.get('details'),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Something went wrong');
      }

      setStatus('success');
      form.reset();
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to submit. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-black-light border border-white/10 rounded-lg p-8 text-center">
        <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="text-2xl font-bold mb-2">Inquiry Sent!</h3>
        <p className="text-gray-400">
          Thank you for your interest. We'll get back to you as soon as possible.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-redwings hover:text-redwings-dark transition-colors"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === 'error' && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-redwings transition-colors"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-redwings transition-colors"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-redwings transition-colors"
            placeholder="(555) 555-5555"
          />
        </div>

        <div>
          <label htmlFor="eventType" className="block text-sm font-medium text-gray-400 mb-2">
            Event Type *
          </label>
          <select
            id="eventType"
            name="eventType"
            required
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redwings transition-colors"
          >
            <option value="">Select type...</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-400 mb-2">
            Preferred Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redwings transition-colors"
          />
        </div>

        <div>
          <label htmlFor="venue" className="block text-sm font-medium text-gray-400 mb-2">
            Venue / Location
          </label>
          <input
            type="text"
            id="venue"
            name="venue"
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-redwings transition-colors"
            placeholder="Venue name or city"
          />
        </div>
      </div>

      <div>
        <label htmlFor="details" className="block text-sm font-medium text-gray-400 mb-2">
          Event Details *
        </label>
        <textarea
          id="details"
          name="details"
          required
          rows={5}
          className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-redwings transition-colors resize-none"
          placeholder="Tell us about your event — expected audience, format, any special requests..."
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-redwings hover:bg-redwings-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
      >
        {status === 'submitting' ? 'Sending...' : 'Send Inquiry'}
      </button>
    </form>
  );
}
