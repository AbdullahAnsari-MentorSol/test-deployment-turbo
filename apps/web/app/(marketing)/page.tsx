import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRightIcon,
  Download,
  Edit,
  Mic,
  Mic2,
  Type,
  Users,
} from 'lucide-react';
import VoiceSlider from 'node_modules/@kit/ui/src/makerkit/marketing/voices-slider';

import { PricingTable } from '@kit/billing-gateway/marketing';
import {
  CtaButton,
  FeatureCard,
  FeatureGrid,
  Hero,
  Pill,
  PodcastCard,
  SecondaryHero,
  VoiceCard,
} from '@kit/ui/marketing';
import { Trans } from '@kit/ui/trans';

import billingConfig from '~/config/billing.config';
import pathsConfig from '~/config/paths.config';
import features from '~/config/podcast-features.config';
import TuringTestPodcast from '~/config/turing-test-podcast.config';
import voices from '~/config/voices-config';
import { withI18n } from '~/lib/i18n/with-i18n';

import { CoverImage } from './_components/cover-image';

function YouTubeVideo() {
  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        className="absolute left-0 top-0 h-full w-full rounded-2xl border border-gray-200 dark:border-primary/10"
        src="https://www.youtube.com/embed/jT49p012NWA"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}

function HowItWorksSection() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="mb-12 text-center text-3xl font-bold">
        Podcast Creation Made Simple
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <Type className="h-8 w-8 text-primary" />
          </div>
          <h3
            className="mb-2 text-xl font-semibold"
            style={{ color: '#A08FFF' }}
          >
            1. Insert Your Topic
          </h3>
          <p>Simply type in your desired podcast topic.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h3
            className="mb-2 text-xl font-semibold"
            style={{ color: '#A08FFF' }}
          >
            2. Choose Your Voices
          </h3>
          <p>Select from a variety of AI voices for your podcast.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <Download className="h-8 w-8 text-primary" />
          </div>
          <h3
            className="mb-2 text-xl font-semibold"
            style={{ color: '#A08FFF' }}
          >
            3. Generate Your Podcast!
          </h3>
          <p>Your AI-generated podcast is ready to download and share.</p>
        </div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className={'mt-4 flex flex-col space-y-24 py-14'}>
      <Hero
        pill={
          <Pill label={'New'}>
            <span>6 AI voices now available</span>
          </Pill>
        }
        title={
          <>
            <span>From Topic to Podcast</span>
            <span>in minutes, using AI.</span>
          </>
        }
        subtitle={
          <span>
            Generate High-Quality Content in Record Time, with Zero Equipment or
            Experience Needed.
          </span>
        }
        cta={<MainCallToActionButton />}
      />

      <div className={'container mx-auto'}>
        <h2 className="mb-12 text-center text-3xl font-bold">
          Choose 1 or even 2 High quality natural voices for your podcast show -
          More voices coming soon
        </h2>
        <VoiceSlider>
          {voices.map(({ name, description, id,audio, image }) => (
            <VoiceCard
              key={id}
              name={name}
              description={description}
              audio={audio}
              image={
                <CoverImage src={image} title={name} preloadImage={true} />
              }
            />
          ))}
        </VoiceSlider>
      </div>
      <div className={'container mx-auto'}>
        <h2 className="mb-12 text-center text-3xl font-bold">
          Turing Test Podcast
        </h2>
        <div className="flex flex-col gap-6 lg:flex-row">
          <PodcastCard
            image={
              <CoverImage
                className="rounded-lg"
                src={TuringTestPodcast.thumbnail}
                title={TuringTestPodcast.title}
              />
            }
            title={TuringTestPodcast.title}
            subTitle={TuringTestPodcast.subtitle}
            file={TuringTestPodcast.file}
          />
          <div className="box-border lg:p-10">
            <h3 className="fw-100 mb-2 text-xl lg:text-3xl">
              The AI Revolution Podcast
            </h3>
            {TuringTestPodcast.description.map((line, index) => (
              <p
                key={index}
                className="mb-4 p-0 font-sans text-base font-normal tracking-tight lg:text-lg"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <YouTubeVideo />
      </div>

      <div className={'container mx-auto'}>
        <h2 className="mb-12 text-center text-3xl font-bold">
          Studio-Quality Podcasts, Effortlessly Created
        </h2>
        <FeatureGrid>
          {features.map(({ id, title, description,image }) => (
            <FeatureCard key={id} label={title} description={description}               
            image={
              <CoverImage src={image} title={title} preloadImage={true} />
            }/>
          ))}
          {/* <FeatureCard
            label="6 High-Quality AI Voices"
            description="Experience natural, professional sound that rivals studio recordings."
            icon={<Mic className="h-6 w-6" />}
          ></FeatureCard>
          <FeatureCard
            label="Single or Two-Host Format"
            description="Enjoy flexibility for different podcast styles, from solo shows to dynamic duos."
            icon={<Mic2 className="h-6 w-6" />}
          />
          <FeatureCard
            label="Edit Your Transcript for Polish"
            description="Take control and customize your content for a truly polished final product."
            icon={<Edit className="h-6 w-6" />}
          /> */}
        </FeatureGrid>
      </div>

      <HowItWorksSection />

      <div className={'container mx-auto'}>
        <div
          className={
            'flex flex-col items-center justify-center space-y-16 py-16'
          }
        >
          <SecondaryHero
            pill={<Pill>Get started for free.</Pill>}
            heading="Create High-Quality Podcasts in Minutes"
            subheading="Start with our free plan. No equipment, no experience needed—just studio-quality podcasts in minutes."
          />

          <div className={'w-full'}>
            <PricingTable
              config={billingConfig}
              paths={{
                signUp: pathsConfig.auth.signUp,
                return: pathsConfig.app.home,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withI18n(Home);

function MainCallToActionButton() {
  return (
    <div className={'flex space-x-4'}>
      <CtaButton>
        <Link href={'/auth/sign-up'}>
          <span className={'flex items-center space-x-0.5'}>
            <span>
              <Trans i18nKey={'common:getStarted'} />
            </span>

            <ArrowRightIcon
              className={
                'h-4 animate-in fade-in slide-in-from-left-8' +
                ' delay-1000 duration-1000 zoom-in fill-mode-both'
              }
            />
          </span>
        </Link>
      </CtaButton>

      {/* <CtaButton variant={'link'}>
        <Link href={'/contact'}>
          <Trans i18nKey={'common:contactUs'} />
        </Link>
      </CtaButton> */}
    </div>
  );
}
