import React from 'react';
import { Shield, Lock, Eye, Database, Share2, Cookie, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="prose prose-orange max-w-none">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold mb-0">Privacy Policy</h1>
            <p className="text-sm text-gray-500">Last updated: May 4, 2025</p>
          </div>

          <p className="text-gray-600 mb-8">
            At Authentic Meals, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the platform.
          </p>

          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Database className="h-6 w-6 text-orange-500 mr-2" />
              <h2 className="text-2xl font-semibold">Information We Collect</h2>
            </div>
            <div className="pl-8">
              <h3 className="text-lg font-medium mb-2">Personal Information</h3>
              <ul className="list-disc text-gray-600 mb-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>Delivery address and billing information</li>
                <li>Payment details (processed securely through our payment providers)</li>
                <li>Profile information and preferences</li>
                <li>Order history and related transaction data</li>
              </ul>

              <h3 className="text-lg font-medium mb-2">Automatically Collected Information</h3>
              <ul className="list-disc text-gray-600">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, interactions)</li>
                <li>Location data (with your consent)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Eye className="h-6 w-6 text-orange-500 mr-2" />
              <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
            </div>
            <div className="pl-8 text-gray-600">
              <p className="mb-4">We use the collected information for the following purposes:</p>
              <ul className="list-disc mb-4">
                <li>Process and fulfill your orders</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Improve our services and user experience</li>
                <li>Send important updates and notifications</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p>
                We process your information based on legitimate business interests, contractual necessity, legal obligations, and/or your consent.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 text-orange-500 mr-2" />
              <h2 className="text-2xl font-semibold">Data Security</h2>
            </div>
            <div className="pl-8 text-gray-600">
              <p className="mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information, including:
              </p>
              <ul className="list-disc">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Strict access controls and authentication measures</li>
                <li>Employee training on data protection</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Share2 className="h-6 w-6 text-orange-500 mr-2" />
              <h2 className="text-2xl font-semibold">Information Sharing</h2>
            </div>
            <div className="pl-8 text-gray-600">
              <p className="mb-4">We may share your information with:</p>
              <ul className="list-disc mb-4">
                <li>Vendors and delivery partners (to fulfill your orders)</li>
                <li>Payment processors (to process transactions)</li>
                <li>Service providers (who assist in platform operations)</li>
                <li>Legal authorities (when required by law)</li>
              </ul>
              <p className="font-medium text-gray-700">
                We do not sell your personal information to third parties.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Cookie className="h-6 w-6 text-orange-500 mr-2" />
              <h2 className="text-2xl font-semibold">Cookies and Tracking</h2>
            </div>
            <div className="pl-8 text-gray-600">
              <p className="mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our platform. These technologies help us:
              </p>
              <ul className="list-disc mb-4">
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our platform</li>
                <li>Provide personalized content and recommendations</li>
                <li>Analyze platform performance</li>
              </ul>
              <p>
                You can control cookie preferences through your browser settings. However, disabling certain cookies may limit platform functionality.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-orange-500 mr-2" />
              <h2 className="text-2xl font-semibold">Your Rights and Choices</h2>
            </div>
            <div className="pl-8 text-gray-600">
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc mb-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to certain processing activities</li>
                <li>Withdraw consent (where applicable)</li>
                <li>Request data portability</li>
              </ul>
              <p>
                To exercise these rights or ask questions about our privacy practices, please contact our Privacy Team using the information below.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-orange-500 mr-2" />
              <h2 className="text-2xl font-semibold">Contact Us</h2>
            </div>
            <div className="pl-8 text-gray-600">
              <p className="mb-4">If you have questions about this Privacy Policy, please contact us at:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>Privacy Team</p>
                <p>Authentic Meals</p>
                <p>Email: privacy@authenticmeals.com</p>
                <p>Address: 123 Main Street, Suite 100</p>
                <p>City, State 12345</p>
              </div>
            </div>
          </section>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              This Privacy Policy was last updated on May 4, 2025. We may update this policy from time to time. Any changes will be posted on this page with a revised "last updated" date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;