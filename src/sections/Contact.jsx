import React, { useState, useCallback, memo } from 'react';
import { motion } from 'motion/react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ type: '', message: '' });

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      setFormStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setIsSubmitting(true);

    // Simulate async submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
      setFormData({ name: '', email: '', message: '' });
    }, 600);
  };

  const contactLinks = [
    { label: 'Email', value: 'biswa@example.com', href: 'mailto:biswa@example.com' },
    { label: 'LinkedIn', value: 'linkedin.com/in/biswakalyan', href: 'https://linkedin.com/in/biswa' },
    { label: 'GitHub', value: 'github.com/biswakalyan', href: 'https://github.com/biswa' },
  ];

  return (
    <section id="contact" className="minimal-theme warm-dark c-space section-spacing relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <p className="font-crimson section-label text-xs uppercase tracking-[0.2em] text-white/50 mb-2">Contact</p>
        <h2 className="font-crimson text-3xl md:text-5xl font-semibold mb-4 text-white">Get In Touch</h2>
        <p className="font-oxygen subtext max-w-2xl mb-16 text-white/70 font-light">
          Have a project in mind, an internship opportunity, or want to collaborate? I'd love to hear from you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              {contactLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <p className="font-oxygen text-xs uppercase tracking-wider text-white/50 mb-1">{link.label}</p>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-oxygen text-base md:text-lg font-medium text-white group-hover:text-[color:var(--color-gold-light)] transition-colors duration-200"
                  >
                    {link.value}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
            noValidate
          >
            {formStatus.message && (
              <div
                aria-live="polite"
                className={`p-4 rounded-xs text-xs font-mono border ${
                  formStatus.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                }`}
              >
                {formStatus.message}
              </div>
            )}

            <div>
              <label htmlFor="contact-name" className="field-label font-oxygen text-white/70 text-xs uppercase tracking-wider">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="field-input field-input-focus font-oxygen text-white border-white/20 placeholder-white/30"
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="field-label font-oxygen text-white/70 text-xs uppercase tracking-wider">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="field-input field-input-focus font-oxygen text-white border-white/20 placeholder-white/30"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="field-label font-oxygen text-white/70 text-xs uppercase tracking-wider">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                rows="4"
                className="field-input field-input-focus font-oxygen text-white border-white/20 placeholder-white/30 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="font-montserrat px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] bg-white text-[#2a2520] rounded-full hover:bg-[color:var(--color-gold-light)] hover:text-black transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </motion.form>
        </div>
      </motion.div>
    </section>
  );
};

export default memo(Contact);
