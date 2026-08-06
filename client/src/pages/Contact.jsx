import React, { useState } from 'react';
import { ContactService } from '../services/api';
import { FaPhone, FaLocationDot, FaClock, FaWhatsapp, FaPaperPlane, FaCircleCheck } from 'react-icons/fa6';
import MapEmbed from '../components/MapEmbed';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
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
      const data = await ContactService.submit(formData);
      setSuccessMessage(data.message || 'Thank you! Your message has been received.');
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d11] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center space-y-4 mb-16">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
          Timergara Branch • Dir Lower
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-serif gold-gradient-text">
          Get In Touch With Us
        </h1>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          Have questions about custom wedding cakes, party catering, or placing a sweet order? We are here to help!
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Details */}
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Direct Contact
              </span>
              <h2 className="text-3xl font-bold font-serif text-white mt-1">
                Visit or Call Our Bakery
              </h2>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Located in Timergara Main Bazaar. Drop by for fresh warm pastries or call us directly.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#14141a] border border-amber-500/20">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl shrink-0">
                  <FaLocationDot />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-white">Bakery Address</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Main Bazaar, Timergara, Dir Lower, Khyber Pakhtunkhwa, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#14141a] border border-amber-500/20">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl shrink-0">
                  <FaPhone />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-white">Phone & Order Line</h4>
                  <p className="text-xs text-amber-300 font-mono mt-0.5">+92 345 9000123</p>
                  <p className="text-[10px] text-gray-500">Available 7:00 AM - 11:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#14141a] border border-amber-500/20">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl shrink-0">
                  <FaClock />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-white">Opening Hours</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Monday – Sunday: 07:00 AM – 11:00 PM</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Quick Link */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-xl flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-lg">Instant Order on WhatsApp</h4>
                <p className="text-xs text-emerald-100">Chat directly with our Timergara counter team.</p>
              </div>
              <a
                href="https://wa.me/923275001166"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-white text-emerald-800 rounded-xl text-xs font-bold uppercase tracking-wider shadow hover:bg-emerald-50 transition shrink-0"
              >
                Chat Now
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#14141a] p-8 rounded-3xl border border-amber-500/20 shadow-2xl space-y-6">
            <div>
              <h3 className="font-serif font-bold text-2xl text-amber-400">Send Us A Message</h3>
              <p className="text-xs text-gray-400 mt-1">
                Fill out the form below and our team will get back to you shortly.
              </p>
            </div>

            {successMessage && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs flex items-center gap-3">
                <FaCircleCheck className="text-lg shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Muhammad Ali"
                  className="w-full px-4 py-3 rounded-xl bg-[#181820] border border-amber-500/20 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0345 1234567"
                  className="w-full px-4 py-3 rounded-xl bg-[#181820] border border-amber-500/20 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Message / Order Inquiry *</label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you'd like to order or ask..."
                  className="w-full px-4 py-3 rounded-xl bg-[#181820] border border-amber-500/20 text-white text-xs focus:outline-none focus:border-amber-400"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <FaPaperPlane />
                <span>{submitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>

        </div>

        {/* Google Map */}
        <div className="space-y-4 pt-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Location Map
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">
              Find Us In Timergara Main Bazaar
            </h3>
          </div>
          <MapEmbed />
        </div>

      </div>
    </div>
  );
}
