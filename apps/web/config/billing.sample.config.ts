/**
 * This is a sample billing configuration file. You should copy this file to `billing.config.ts` and then replace
 * the configuration with your own billing provider and products.
 */
import { BillingProviderSchema, createBillingSchema } from '@kit/billing';

// The billing provider to use. This should be set in the environment variables
// and should match the provider in the database. We also add it here so we can validate
// your configuration against the selected provider at build time.
const provider = BillingProviderSchema.parse(
  process.env.NEXT_PUBLIC_BILLING_PROVIDER,
);

export default createBillingSchema({
  // also update config.billing_provider in the DB to match the selected
  provider,
  // products configuration
  products: [
    {
      id: 'free',
      name: 'Free',
      description: 'Free Plan',
      currency: 'usd',
      tier:"Free",
      credit:"5 minutes",
      plans: [
        {
          name: 'Free Monthly',
          id: 'price_1PzhAWJglZdczVxbd00Rhoiv',
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1PzhAWJglZdczVxbd00Rhoiv',
              name: 'Free Monthly',
              cost: 0.00,
              type: 'flat' as const,
            },
          ],
        },
        {
          name: 'Free Yearly',
          id: 'price_1Q3bouJglZdczVxbmZSnl7hN',
          paymentType: 'recurring',
          interval: 'year',
          lineItems: [
            {
              id: 'price_1Q3bouJglZdczVxbmZSnl7hN', // Updated to make unique
              name: 'Free Monthly',
              cost: 0.00,
              type: 'flat' as const,
            },
          ],
        },
      ],
      features: ["Up to 5 minutes of podcasts per month","GPT 4o mini","SD Quality","1 Voice","1 Podcast Personality","Perfect fro basic entry level podcasts"],
    },
    {
      id: 'starter-subscription',
      name: 'Starter',
      description: 'The perfect plan to get started',
      currency: 'USD',
      badge: `Value`,
      tier:"Starter",
      credit:"60 minutes",
      plans: [
        {
          name: 'Starter Monthly',
          id: 'price_1Q3bqiJglZdczVxbEYFjr5d8',
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1Q3bqiJglZdczVxbEYFjr5d8',
              name: 'Starter Monthly',
              cost: 19.00,
              type: 'flat' as const,
            },
          ],
        },
        {
          name: 'Starter Yearly',
          id: 'price_1Q18MkIViLzP3Qt92iXEwszf',
          paymentType: 'recurring',
          interval: 'year',
          lineItems: [
            {
              id: 'price_1Q18MkIViLzP3Qt92iXEwszf',
              name: 'Base',
              cost: 205.00,
              type: 'flat' as const,
            },
          ],
        },
      ],
      features: ["Up to 60 minutes of podcasts per month","GPT 4o (Future LLM’s coming soon)","HD Quality","6 Voices (More voices coming soon)","2 Podcast Personalities/Hosts/Guests","Ideal for short weekly or bi-weekly podcasts"],
    },
    {
      id: 'pro-subscription',
      name: 'Pro',
      badge: `Popular`,
      highlighted: true,
      description: 'The perfect plan for professionals',
      currency: 'USD',
      tier:"Pro",
      credit:"160 minutes",
      plans: [
        {
          name: 'Pro Monthly',
          id: 'price_1Q3bqiJglZdczVxbEYFjr5d8',
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1Q3bqiJglZdczVxbEYFjr5d8',
              name: 'Base',
              cost: 49.00,
              type: 'flat',
            },
          ],
        },
        {
          name: 'Pro Yearly',
          id: 'price_1Q18OWIViLzP3Qt9gQZpNp1p',
          paymentType: 'recurring',
          interval: 'year',
          lineItems: [
            {
              id: 'price_1Q18OWIViLzP3Qt9gQZpNp1p', // This is already unique
              name: 'Base',
              cost: 525.00,
              type: 'flat',
            },
          ],
        },
      ],
      features: [
        "Up to 160 minutes of podcasts per month",
        "GPT 4o (Future LLM’s coming soon)",
        "HD Quality",
        "6 Voices (More voices coming soon)",
        "2 Podcast Personalities/Hosts/Guests",
        "Great for short daily or longer weekly podcasts"
      ],
    },
    {
      id: 'enterprise-subscription',
      name: 'Enterprise',
      description: 'The perfect plan for enterprises',
      currency: 'USD',
      tier:"EnterPrise",
      credit:"0 minutes",
      plans: [
        {
          name: 'Enterprise Monthly',
          id: 'price_1PuqyBJglZdczVxbfvPOMhqI',
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1PuqyBJglZdczVxbfvPOMhqI', // Updated to make unique
              name: 'Base',
              cost: 0.00,
              type: 'flat',
            },
          ],
        },
        {
          name: 'Enterprise Yearly',
          id: 'enterprise-yearly',
          paymentType: 'recurring',
          interval: 'year',
          lineItems: [
            {
              id: 'price_enterprise_yearly', // This is already unique
              name: 'Base',
              cost: 0.00,
              type: 'flat',
            },
          ],
        },
      ],
      features:[
        "Custom podcast minutes (recurring usage)",
        "GPT 4o (Future LLM’s coming soon)",
        "HD Quality",
        "Custom voice options (More voices coming soon)",
        "Custom number of Podcast Personalities/Hosts/Guests",
        "Tailored for podcast networks and agencies"
      ]
    },
  ],
});

