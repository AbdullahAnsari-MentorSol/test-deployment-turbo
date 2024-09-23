import { PageBody } from '@kit/ui/page';
import { SitePageHeader } from '~/(marketing)/_components/site-page-header';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

export async function generateMetadata() {
  const { t } = await createI18nServerInstance();

  return {
    title: t('marketing:roadmap'),
  };
}

async function RoadmapPage() {
  const { t } = await createI18nServerInstance();

  return (
    <div>
      {/* Page Header */}
      <SitePageHeader
        title={t(`marketing:roadmap`)}
        subtitle={t(`marketing:roadmapDescription`)}
      />

      {/* Roadmap Content */}
      <div className="container mx-auto py-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Upcoming Features</h2>
          <p>We are constantly working to improve our platform. Below is a list of features and enhancements that are in development:</p>
          
          <ul className="list-disc ml-5 mt-4">
            <li>
              <strong>AI Voice Customization</strong> - Customize the AI-generated voices with tones and accents to fit your unique podcast style. <em>ETA: Q4 2024</em>
            </li>
            <li>
              <strong>Multi-Host Support</strong> - Allow multiple AI-generated hosts to have dynamic conversations and interactions in your podcast. <em>ETA: Q1 2025</em>
            </li>
            <li>
              <strong>Advanced Editing Tools</strong> - Easily cut, mix, and edit podcasts within the platform using a user-friendly editing suite. <em>ETA: Q2 2025</em>
            </li>
            <li>
              <strong>Integrations with Spotify & Apple Podcasts</strong> - Seamless publishing to popular platforms like Spotify, Apple Podcasts, and more. <em>ETA: Coming Soon</em>
            </li>
            <li>
              <strong>Real-time Analytics Dashboard</strong> - Track your podcast's performance, listener demographics, and engagement in real-time. <em>ETA: Q3 2025</em>
            </li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">Recently Launched</h2>
          <p>Here are the latest features that have been added to enhance your podcast creation experience:</p>
          
          <ul className="list-disc ml-5 mt-4">
            <li>
              <strong>Script Collaboration</strong> - Collaborate with co-hosts or editors in real time to develop your podcast scripts. <em>Launched: August 2024</em>
            </li>
            <li>
              <strong>Custom Podcast Intros</strong> - Create personalized podcast intros using AI, including background music and voiceovers. <em>Launched: June 2024</em>
            </li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">Future Plans</h2>
          <p>We’re exploring the following features to further enhance your podcasting experience:</p>
          
          <ul className="list-disc ml-5 mt-4">
            <li>AI-driven guest interviews and topic suggestions</li>
            <li>Monetization options through ads and sponsorships</li>
            <li>Automated transcription and translation features</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default withI18n(RoadmapPage);
