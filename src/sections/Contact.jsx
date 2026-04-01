import { motion } from 'motion/react';
import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus("Please fill in all fields.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      setFormStatus("Please enter a valid email address.");
      return;
    }
    setFormStatus("Message sent! (Demo only)");
    setFormData({ name: '', email: '', message: '' });
  };

  const contactLinks = [
    {
      label: 'Email',
      value: 'biswa@example.com',
      icon: '📧',
    },
    {
      label: 'LinkedIn',
      value: '/in/biswa',
      icon: '💼',
    },
    {
      label: 'GitHub',
      value: '/biswa',
      icon: '🐙',
    },
  ];

  return (
    <section className="c-space section-spacing">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}>
        <div className="mb-12">
          <motion.h2 className="text-heading">Get In Touch</motion.h2>
          <p className="subtext mt-4">
            Ready to collaborate? Let's connect and create something amazing together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}>
            <div className="space-y-6">
              {contactLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4">
                  <span className="text-3xl">{link.icon}</span>
                  <div>
                    <p className="text-neutral-400 text-sm">{link.label}</p>
                    <p className="text-white font-medium">{link.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4">
            {formStatus && (
              <div className="text-sm mb-2" style={{ color: formStatus.includes('sent') ? '#57db96' : '#ea4884' }}>
                {formStatus}
              </div>
            )}
            <div>
              <label htmlFor="name" className="field-label">
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className={`field-input field-input-focus`}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="field-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`field-input field-input-focus`}
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="field-label">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message here..."
                rows="5"
                className={`field-input field-input-focus`}
                required
              />
            </div>

            <motion.button
              type="submit"
              className="btn bg-gradient-to-r from-royal to-lavender hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}>
              Send Message
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
