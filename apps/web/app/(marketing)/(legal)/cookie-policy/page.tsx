import { SitePageHeader } from '~/(marketing)/_components/site-page-header';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

export async function generateMetadata() {
  const { t } = await createI18nServerInstance();

  return {
    title: t('marketing:cookiePolicy'),
  };
}

async function CookiePolicyPage() {
  const { t } = await createI18nServerInstance();

  return (
    <div>
      <SitePageHeader
        title={t(`marketing:cookiePolicy`)}
        subtitle={t(`marketing:cookiePolicyDescription`)}
      />

      <div className={'container mx-auto py-8'}>
        <div>[Your Company Name] ("we", "us", or "our") uses cookies and similar tracking technologies on our website and services (the "Service") to enhance your user experience, understand how the Service is being used, and personalize your interactions with our platform. This Cookie Policy explains what cookies are, how we use them, and your choices regarding cookies.

1. What Are Cookies?

Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website. They allow the website to recognize your device and store information about your preferences or past actions.

2. Types of Cookies We Use

We use the following types of cookies on our Service:

2.1. Essential Cookies
These cookies are necessary for the functioning of our Service and cannot be disabled in our systems. They are usually set in response to your actions, such as logging in or filling out forms.

Purpose: Enable core functionality such as user authentication, access to secure areas, and other essential features.
Examples: Authentication cookies, security cookies.
2.2. Analytics and Performance Cookies
These cookies help us understand how users interact with our Service by collecting information such as the pages you visit and any issues encountered. This helps us improve the performance and functionality of our Service.

Purpose: Measure traffic, track errors, and understand how users interact with the Service.
Examples: Google Analytics, internal analytics tools.
2.3. Functional Cookies
These cookies allow us to remember your choices (such as your language preference) and provide a more personalized experience.

Purpose: Store user preferences and settings to enhance the user experience.
Examples: Language or region preference, remembering login credentials.
2.4. Targeting and Advertising Cookies
These cookies are used to deliver personalized advertisements based on your interests, both within our Service and across other websites. They also help limit how many times you see an ad and measure the effectiveness of advertising campaigns.

Purpose: Display personalized ads and analyze campaign performance.
Examples: Google Ads, Facebook Pixel.
3. How We Use Cookies

We use cookies to:

Provide and maintain our Service.
Enable secure user authentication.
Analyze usage patterns to improve the functionality and performance of our Service.
Personalize content and remember user preferences.
Serve relevant ads and measure the effectiveness of our advertising efforts.
4. Third-Party Cookies

We also allow third parties, such as analytics providers and advertising partners, to place cookies on your device when you use our Service. These third-party cookies are used for analyzing performance and delivering personalized advertisements.

Some of the third-party services we use that may place cookies on your device include:

Google Analytics: For tracking and reporting website traffic and user behavior.
Facebook Pixel: For measuring the effectiveness of Facebook ads and delivering targeted ads.
Google Ads: For delivering targeted ads based on your activity across our site and the web.
These third-party cookies are governed by the privacy policies of their respective providers, not by this Cookie Policy.

5. Your Cookie Choices

You have the right to control the use of cookies on our Service. You can manage your cookie preferences in the following ways:

5.1. Browser Settings
Most web browsers allow you to manage cookie settings, including blocking or deleting cookies. The method to do so will vary by browser:

For Google Chrome: Go to "Settings"  "Privacy and Security"  "Cookies and Other Site Data"
For Firefox: Go to "Preferences"  "Privacy & Security"  "Cookies and Site Data"
For Safari: Go to "Preferences"  "Privacy"  "Manage Website Data"
Please note that disabling essential cookies may impact the functionality of the Service.

5.2. Opt-Out Tools
Some third-party services, such as Google Analytics and Google Ads, offer opt-out mechanisms to prevent data collection:

Google Analytics Opt-Out Browser Add-on: https://tools.google.com/dlpage/gaoptout
Google Ads Settings: https://adssettings.google.com/
5.3. Cookie Banners
When you first visit our Service, you will see a cookie consent banner that allows you to accept or decline the use of non-essential cookies. You can change your preferences at any time by accessing the "Cookie Preferences" link on our website.

6. Data Collected Through Cookies

The data collected through cookies may include:

IP address
Browser type
Device information
Pages visited
Time spent on the Service
Referring URLs
This data helps us improve the Service and tailor content to your preferences.

7. Updates to This Cookie Policy

We may update this Cookie Policy from time to time to reflect changes in our practices or legal obligations. When we make significant changes, we will notify you through a notice on our website or by email. Please review this Cookie Policy periodically to stay informed about how we use cookies.</div>
      </div>
    </div>
  );
}

export default withI18n(CookiePolicyPage);
