import { SitePageHeader } from '~/(marketing)/_components/site-page-header';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

export async function generateMetadata() {
  const { t } = await createI18nServerInstance();

  return {
    title: t('marketing:privacyPolicy'),
  };
}

async function PrivacyPolicyPage() {
  const { t } = await createI18nServerInstance();

  return (
    <div>
      <SitePageHeader
        title={t('marketing:privacyPolicy')}
        subtitle={t('marketing:privacyPolicyDescription')}
      />

      <div className={'container mx-auto py-8'}>
        <div>[Your Company Name] ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose your personal information when you use our website and services ("Service"). By accessing or using our Service, you agree to the collection and use of your information in accordance with this policy.

1. Information We Collect

We collect various types of information to provide and improve our Service.

1.1. Information You Provide to Us

Account Information: When you create an account, we collect your name, email address, password, and any other information you provide.
Payment Information: If you purchase a subscription, we collect payment details such as your credit card number and billing address through our secure third-party payment processor.
Content: We may collect content you upload to the Service, including podcast scripts, recordings, and other media files.
1.2. Information Collected Automatically

Usage Data: We automatically collect information about your interaction with our Service, including IP address, browser type, device information, and pages visited.
Cookies: We use cookies and similar tracking technologies to enhance your user experience and collect information about how you use our Service. You can control cookie preferences through your browser settings.
1.3. Information from Third Parties We may receive information about you from third-party services, such as social media platforms or analytics providers.

2. How We Use Your Information

We use the information we collect for the following purposes:

To Provide the Service: We use your personal information to create and manage your account, process payments, and enable you to create and publish podcasts.
To Improve the Service: We analyze usage data to understand how our Service is being used, which helps us to enhance and optimize performance and functionality.
To Communicate with You: We may use your email address to send you important updates, marketing communications (with your consent), and respond to inquiries.
For Legal Compliance: We may use your information to comply with legal obligations, resolve disputes, and enforce our Terms of Service.
3. How We Share Your Information

We do not sell your personal information. However, we may share your information with:

Service Providers: We share information with third-party providers who help us operate our Service, such as payment processors, hosting providers, and analytics services. These third parties are bound by confidentiality agreements and are only permitted to use your data for the purposes we specify.
Business Transfers: If we are involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction.
Legal Requirements: We may disclose your information if required to do so by law, such as to comply with a subpoena, court order, or other legal processes, or to protect the rights and safety of [Your Company Name] and others.
4. Your Data Protection Rights

Depending on your location, you may have certain rights regarding your personal information. These rights may include:

Access: You have the right to request access to the personal information we hold about you.
Rectification: You have the right to request that we correct any inaccuracies in your personal information.
Erasure: You can request the deletion of your personal data in certain circumstances.
Data Portability: You may have the right to request that we transfer your personal data to another organization or directly to you.
Withdraw Consent: If we rely on your consent to process your personal information, you have the right to withdraw that consent at any time.
To exercise these rights, please contact us at [Your Email Address]. We will respond within the timeframes required by applicable law.

5. Data Retention

We retain your personal information only for as long as necessary to fulfill the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by law.

Account Information: We retain your account information for as long as your account is active or as needed to provide you with the Service.
Payment Information: We retain your payment information as long as necessary for processing payments, resolving disputes, or for legal compliance.
6. Security of Your Information

We take the security of your personal information seriously and implement industry-standard measures to protect it. However, no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee its absolute security.

7. Children’s Privacy

Our Service is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If we discover that a child under 18 has provided us with personal information, we will take steps to delete such information.

8. International Data Transfers

If you are accessing the Service from outside the country where our servers are located, your information may be transferred across borders. By using our Service, you consent to the transfer of your personal data to countries that may not have the same data protection laws as your jurisdiction.

9. Changes to This Privacy Policy

We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website or by email. Please review the Privacy Policy periodically for the latest information.</div>
      </div>
    </div>
  );
}

export default withI18n(PrivacyPolicyPage);
