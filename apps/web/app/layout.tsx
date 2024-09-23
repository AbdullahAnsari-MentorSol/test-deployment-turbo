import { cookies } from 'next/headers';

import { Toaster } from '@kit/ui/sonner';
import { cn } from '@kit/ui/utils';

import { RootProviders } from '~/components/root-providers';
import { heading, sans } from '~/lib/fonts';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { generateRootMetadata } from '~/lib/root-metdata';
import { GoogleAnalytics } from '@next/third-parties/google'
import appConfig from '~/config/app.config';

import '../styles/globals.css';
import FeedbackSurveyCTA from '~/components/feedback-survey-cta';
// import FeedbackUser from '~/components/feedback';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = await createI18nServerInstance();
  const theme = getTheme();
  const className = getClassName(theme);

  return (
    <html lang={language} className={className}>
      <body>
        <RootProviders theme={theme} lang={language}>
          {children}
        </RootProviders>
        <GoogleAnalytics gaId={appConfig.googleAnalyticsId} />
        {/* <FeedbackUser/> */}
        <FeedbackSurveyCTA/>
        <Toaster richColors={false} />
      </body>
    </html>
  );
}

function getClassName(theme?: string) {
  const dark = theme === 'dark';
  const light = !dark;

  const font = [sans.variable, heading.variable].reduce<string[]>(
    (acc, curr) => {
      if (acc.includes(curr)) return acc;

      return [...acc, curr];
    },
    [],
  );

  return cn('min-h-screen bg-background antialiased', ...font, {
    dark,
    light,
  });
}

function getTheme() {
  return cookies().get('theme')?.value;
}

export const generateMetadata = generateRootMetadata;
