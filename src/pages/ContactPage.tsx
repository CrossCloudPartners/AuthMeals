import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, Clock, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'general' | 'support' | 'business' | 'other';
}

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: 'What are your business hours?',
      answer: 'Our support team is available Monday through Friday, 9:00 AM to 6:00 PM EST.'
    },
    {
      question: 'How long does it take to get a response?',
      answer: 'We aim to respond to all inquiries within 24 business hours.'
    },
    {
      question: 'Do you offer phone support?',
      answer: 'Yes, phone support is available for urgent matters during business hours.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Have a question or need assistance? We're here to help! Choose the best way to reach us below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <Phone className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
          <p className="text-gray-600 mb-4">
            Call us for immediate assistance with your inquiries
          </p>
          <a
            href="tel:+1234567890"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            +1 (234) 567-890
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <Mail className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Email Support</h3>
          <p className="text-gray-600 mb-4">
            Send us an email and we'll respond within 24 hours
          </p>
          <a
            href="mailto:support@example.com"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            support@example.com
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <MapPin className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Office Location</h3>
          <p className="text-gray-600 mb-4">
            Visit our office for in-person assistance
          </p>
          <address className="text-orange-600 not-italic">
            123 Business Street<br />
            Suite 100<br />
            City, State 12345
          </address>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Inquiry Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ContactFormData['type'] })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="business">Business Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message *
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
              className="flex items-center justify-center"
            >
              <Send className="h-5 w-5 mr-2" />
              Send Message
            </Button>
          </form>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-start">
                  <MessageSquare className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-1" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 ml-7">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-orange-50 rounded-lg">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Response Time</h3>
                <p className="text-sm text-gray-600 mt-1">
                  We typically respond to all inquiries within 24 hours during business days.
                  For urgent matters, please call our support line.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Need Immediate Help?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Our support team is available via phone during business hours for urgent assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="mt-16 bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Business Hours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Customer Support</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 6:00 PM EST</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 4:00 PM EST</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Technical Support</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>8:00 AM - 8:00 PM EST</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>9:00 AM - 5:00 PM EST</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Office Hours</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 5:00 PM EST</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday - Sunday</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;