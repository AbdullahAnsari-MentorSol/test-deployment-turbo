import { PageBody } from '@kit/ui/page';

import { SitePageHeader } from '~/(marketing)/_components/site-page-header';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

export async function generateMetadata() {
  const { t } = await createI18nServerInstance();

  return {
    title: t('marketing:termsOfService'),
  };
}

async function TermsOfServicePage() {
  const { t } = await createI18nServerInstance();

  return (
    <div>
      <SitePageHeader
        title={t(`marketing:termsOfService`)}
        subtitle={t(`marketing:termsOfServiceDescription`)}
      />

      <div className={'container mx-auto py-8'}>
        <div>
        Welcome to [Your Company Name]! These Terms of Service ("Terms") govern your use of our platform and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Service.

1. Overview of Service [Your Company Name] offers a subscription-based service that allows users to create podcasts through AI-generated scripts, host podcasts, and access other tools designed to facilitate podcast creation and publishing.

2. Eligibility To use our Service, you must be at least 18 years old or the legal age of majority in your jurisdiction. By creating an account, you confirm that the information you provide is accurate, and you have the legal capacity to agree to these Terms.

3. Subscription Plans Our Service is available through various subscription plans. The features available to you will depend on your selected plan.

Free Plan: Limited access to basic features of the Service.
Premium Plans: Paid plans that provide enhanced features, including more advanced podcast creation tools, increased hosting options, and additional services.
Please refer to our [Pricing Page] for a detailed list of features available for each plan.

4. Billing and Payments For paid subscriptions, you agree to provide accurate payment information and authorize us to charge the applicable fees on a recurring basis (monthly or annually, depending on your plan).

Billing Cycle: Subscriptions are billed in advance for the chosen period (monthly or yearly). Payments are non-refundable unless otherwise stated.
Payment Methods: We accept credit cards, debit cards, and other payment methods as displayed at checkout.
Failed Payments: If your payment method fails, we may suspend or terminate your access to the Service until the issue is resolved.
5. Cancellation and Refunds You may cancel your subscription at any time. If you cancel your subscription, you will retain access to the Service for the remainder of your current billing period.

Refund Policy: We do not offer refunds for unused subscription periods, except as required by law or under specific promotional terms.
6. Account Security You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately if you suspect unauthorized access to your account.

7. Use of the Service When using our Service, you agree to the following:

Compliance with Laws: You will comply with all applicable laws and regulations.
Content Ownership: You retain ownership of the content you create, but you grant us a worldwide, non-exclusive license to store, display, and distribute your content as necessary to provide the Service.
Prohibited Activities: You will not engage in any illegal, harmful, or abusive activities, including but not limited to:
Uploading or sharing content that is unlawful, defamatory, or infringing on third-party rights.
Attempting to disrupt or interfere with the Service.
8. Intellectual Property All intellectual property rights in the Service and its components, including software, designs, logos, and trademarks, are owned by [Your Company Name] or our licensors.

License to Use: Subject to these Terms, we grant you a limited, non-exclusive, non-transferable license to access and use the Service.
9. Termination We may suspend or terminate your account at our discretion if you violate these Terms or engage in conduct that we deem harmful to the Service or other users.

Effect of Termination: Upon termination, your right to use the Service will cease immediately. Any data or content stored in your account may be deleted.
10. Changes to the Service and Terms We reserve the right to modify or discontinue the Service (or any part thereof) at any time, with or without notice. Additionally, we may update these Terms from time to time. If we make material changes, we will notify you via email or through the Service.

11. Limitation of Liability To the maximum extent permitted by law, [Your Company Name] will not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses resulting from your use of the Service.

12. Disclaimer of Warranties The Service is provided "as is" and "as available." We make no warranties, express or implied, regarding the Service, including but not limited to merchantability, fitness for a particular purpose, or non-infringement.

13. Governing Law These Terms will be governed by and construed in accordance with the laws of [Insert Jurisdiction]. Any disputes arising out of or relating to these Terms or the Service will be resolved through binding arbitration in [Insert City/State].
        </div>
      </div>
    </div>
  );
}

export default withI18n(TermsOfServicePage);
