import React from 'react';

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        
        <div className="prose prose-orange max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Authentic Meals. These Terms and Conditions govern your use of our website and services. 
              By accessing or using Authentic Meals, you agree to be bound by these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>"Platform" refers to the Authentic Meals website and services</li>
              <li>"User" refers to any person who accesses or uses the Platform</li>
              <li>"Vendor" refers to home cooks who offer meals through the Platform</li>
              <li>"Consumer" refers to users who purchase meals through the Platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="mb-4">
              To use certain features of the Platform, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Vendor Responsibilities</h2>
            <p className="mb-4">
              Vendors on our platform agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Comply with all applicable food safety regulations</li>
              <li>Maintain accurate menu listings and pricing</li>
              <li>Prepare and handle food in accordance with health standards</li>
              <li>Fulfill orders as described and in a timely manner</li>
              <li>Maintain appropriate insurance coverage</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Consumer Rights and Responsibilities</h2>
            <p className="mb-4">
              Consumers using our platform agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide accurate delivery information</li>
              <li>Pay for orders in full at the time of purchase</li>
              <li>Comply with vendor pickup/delivery requirements</li>
              <li>Provide honest and fair reviews</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
            <p className="mb-4">
              All payments are processed securely through our platform. We accept major credit cards and other payment methods as specified. Vendors receive payment according to our payment schedule, less applicable platform fees.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cancellations and Refunds</h2>
            <p className="mb-4">
              Our cancellation and refund policy aims to be fair to both vendors and consumers. Specific terms vary based on timing and circumstances. Please refer to our detailed policy for more information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Privacy and Data Protection</h2>
            <p className="mb-4">
              We take your privacy seriously. Our collection and use of personal data is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Intellectual Property</h2>
            <p className="mb-4">
              All content on the Platform, including text, graphics, logos, and software, is the property of Authentic Meals or its licensors and is protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p className="mb-4">
              Authentic Meals serves as a platform connecting vendors and consumers. While we strive to maintain high standards, we are not liable for the actions of users or the quality of meals provided by vendors.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the Platform. Continued use of the Platform constitutes acceptance of modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms and Conditions, please contact us at:
            </p>
            <p className="mb-4">
              Email: legal@authenticmeals.com<br />
              Address: 123 Main Street, Suite 100<br />
              City, State 12345
            </p>
          </section>

          <div className="text-sm text-gray-600 mt-8">
            Last updated: May 4, 2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;