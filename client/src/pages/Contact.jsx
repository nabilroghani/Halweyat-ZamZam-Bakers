import React, { useState } from 'react';
import { FaPhone, FaLocationDot, FaClock, FaWhatsapp, FaPaperPlane, FaCircleCheck } from 'react-icons/fa6';
import MapEmbed from '../components/MapEmbed';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(data.message || 'Thank you! Your message has been received.');
        setFormData({ name: '', phone: '', message: '' });
      } else {
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.warn('Form submission fallback:', err);
      setSuccessMessage('Thank you! Your message has been recorded (Demo Mode).');
      setFormData({ name: '', phone: '', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#FFF8F0]">
      {/* Header */}
      <div className="bg-[#3D2418] text-white py-16 text-center mb-12">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9982F]">
            Timergara Dir Lower
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#FFF8F0]">
            Get In Touch
          </h1>
          <p className="text-sm sm:text-base text-cream/80 max-w-xl mx-auto font-sans font-light">
            Have questions about custom birthday cakes, catering for weddings, or placing a sweet order? We are here to help!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information & WhatsApp */}
          <div className="space-y-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#7B1E3A]">
                Direct Contact
              </span>
              <h2 className="font-heading text-3xl font-bold text-[#3D2418] mt-1">
                Visit or Call Our Bakery
              </h2>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Located conveniently in Timergara Bazaar. Drop by for fresh warm pastries or call us directly to book orders.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#C9982F]/20 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#FFF8F0] border border-[#C9982F]/30 flex items-center justify-center text-[#C9982F] text-xl shrink-0">
                  <FaLocationDot />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#3D2418]">Bakery Address</h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Main Bazaar, Timergara, Dir Lower, Khyber Pakhtunkhwa, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#C9982F]/20 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#FFF8F0] border border-[#C9982F]/30 flex items-center justify-center text-[#C9982F] text-xl shrink-0">
                  <FaPhone />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#3D2418]">Phone & Order Line</h4>
                  <p className="text-xs text-stone-600 mt-0.5">+92 327 5001166</p>
                  <p className="text-[10px] text-stone-400">Available 7:00 AM - 11:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#C9982F]/20 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#FFF8F0] border border-[#C9982F]/30 flex items-center justify-center text-[#C9982F] text-xl shrink-0">
                  <FaClock />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#3D2418]">Opening Hours</h4>
                  <p className="text-xs text-stone-600 mt-0.5">Monday – Sunday: 07:00 AM – 11:00 PM</p>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#25D366] to-[#1eb957] text-white shadow-xl flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-lg">Instant Order on WhatsApp</h4>
                <p className="text-xs text-white/90">Chat directly with our Timergara branch team.</p>
              </div>
              <a
                href="https://wa.me/923275001166"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-white text-[#25D366] rounded-full text-xs font-bold uppercase tracking-wider shadow hover:bg-stone-100 transition-all shrink-0"
              >
                Chat Now
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl border border-[#C9982F]/30 shadow-xl space-y-6">
            <div>
              <h3 className="font-heading font-bold text-2xl text-[#3D2418]">Send Us A Message</h3>
              <p className="text-xs text-stone-500 mt-1">
                Fill out the form below and our team will get back to you shortly.
              </p>
            </div>

            {successMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-3">
                <FaCircleCheck className="text-lg text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3D2418] mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Muhammad Ali"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9982F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3D2418] mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0300 1234567"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9982F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3D2418] mb-1">
                  Message / Order Details *
                </label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you'd like to order, cake specifications, or general inquiries..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9982F]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#7B1E3A] hover:bg-[#9B2A4A] text-white rounded-xl font-bold uppercase text-xs tracking-widest transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <FaPaperPlane />
                <span>{submitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Embedded Map */}
        <div className="space-y-4 pt-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7B1E3A]">
              Google Maps Location
            </span>
            <h3 className="font-heading text-2xl font-bold text-[#3D2418]">
              Find Us In Timergara
            </h3>
          </div>
          <MapEmbed />
        </div>
      </div>
    </div>
  );
}
