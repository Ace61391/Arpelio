'use client';
import { useState } from 'react';

const TOPICS = [
  { id: 'fingering-error', label: 'Report a fingering error' },
  { id: 'request-instrument', label: 'Request an instrument' },
  { id: 'feature-suggestion', label: 'Feature suggestion' },
  { id: 'general', label: 'General question' },
];

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const topicLabel = TOPICS.find(t => t.id === topic)?.label || 'General';
    const subject = encodeURIComponent(`[Arpelio] ${topicLabel}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nTopic: ${topicLabel}\n\n${message}`
    );
    window.location.href = `mailto:info@arpelio.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="border border-[#e5e8ed] rounded-xl p-8 bg-white text-center">
        <div className="text-3xl mb-3">✓</div>
        <h2 className="text-lg font-bold text-[#1a1d23] mb-2">Opening your email client...</h2>
        <p className="text-sm text-[#4a5060] mb-4">
          Your message has been prepared and your email client should open. Just hit send!
        </p>
        <p className="text-sm text-[#7a8294] mb-4">
          If your email client did not open, you can email us directly at{' '}
          <a href="mailto:info@arpelio.com" className="text-accent font-semibold hover:underline">info@arpelio.com</a>
        </p>
        <button onClick={() => setSent(false)}
          className="text-sm text-accent font-semibold hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#e5e8ed] rounded-xl p-8 bg-white">
      <div className="mb-5">
        <label className="text-xs font-semibold text-[#4a5060] block mb-1.5">Your name</label>
        <input type="text" required value={name} onChange={e => setName(e.target.value)}
          placeholder="Jane Smith"
          className="w-full px-4 py-2.5 rounded-lg border border-[#e5e8ed] text-sm focus:border-accent focus:outline-none" />
      </div>

      <div className="mb-5">
        <label className="text-xs font-semibold text-[#4a5060] block mb-1.5">Your email</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
          placeholder="jane@school.edu"
          className="w-full px-4 py-2.5 rounded-lg border border-[#e5e8ed] text-sm focus:border-accent focus:outline-none" />
      </div>

      <div className="mb-5">
        <label className="text-xs font-semibold text-[#4a5060] block mb-1.5">Topic</label>
        <select required value={topic} onChange={e => setTopic(e.target.value)}
          className={`w-full px-4 py-2.5 rounded-lg border border-[#e5e8ed] text-sm focus:border-accent focus:outline-none ${topic ? 'text-[#1a1d23]' : 'text-[#b0b5c0]'}`}>
          <option value="" disabled>Select a topic...</option>
          {TOPICS.map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="text-xs font-semibold text-[#4a5060] block mb-1.5">Message</label>
        <textarea required value={message} onChange={e => setMessage(e.target.value)}
          rows={5}
          placeholder="Tell us what's on your mind..."
          className="w-full px-4 py-2.5 rounded-lg border border-[#e5e8ed] text-sm focus:border-accent focus:outline-none resize-none" />
      </div>

      <button type="submit"
        className="w-full bg-accent hover:bg-accent-hover text-white rounded-lg px-6 py-3 text-sm font-bold transition-all">
        Send Message
      </button>

      <p className="text-xs text-[#b0b5c0] text-center mt-3">
        This will open your email client with the message pre-filled.
      </p>
    </form>
  );
}
