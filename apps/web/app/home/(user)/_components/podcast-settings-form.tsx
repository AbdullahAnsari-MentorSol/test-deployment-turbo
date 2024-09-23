'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@kit/ui/button';
import { Checkbox } from '@kit/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { RadioGroup, RadioGroupItem } from '@kit/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { Slider } from '@kit/ui/slider';
import { Textarea } from '@kit/ui/textarea';

import settingsConfig from '~/config/podcast-settings.config';
import { PodcastSettingsSchema } from '~/home/(user)/_lib/podcast-settings.schema';

import { useCreatePodcastSettings } from '../../../../../../packages/features/accounts/src/hooks/use-podcast-settings-create';
import { usePodcastSettingsData,useRevalidatePodcastSettingsQuery } from '../../../../../../packages/features/accounts/src/hooks/use-podcastsettings-account-data';
import { useUpdatePodcastSettings } from '../../../../../../packages/features/accounts/src/hooks/usepodcastsettings-update';

export function PodcastSettingsForm(
  props: React.PropsWithChildren<{
    userId: string;
  }>,
) {
  const revalidatePodcastSettings = useRevalidatePodcastSettingsQuery();
  // Loading state management
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch podcast settings data
  const podcastSettingsData = usePodcastSettingsData(props.userId);
  const createPodcastMutation = useCreatePodcastSettings(props.userId);
  const updatePodcastMutation = useUpdatePodcastSettings(
    props.userId,
    podcastSettingsData?.data?.id || '',
  );

  // Form default values
  const aiModels = [
    { id:1, name: 'GPT4o/mini', model: 'OpenAI-GPT-4o-mini', },
    { id:2, name: 'GPT4o', model: 'OpenAI-GPT-4o' },
    { id:3, name: 'Gemini 1.5 Pro', model: 'Gemini-1.5-Pro' },
    { id:4, name: 'Gemini 1.5 Flash', model: 'Gemini-1.5-Flash' },
    { id:5, name: 'Claude', model: 'Claude' },
    { id:6, name: 'Groq Llama 3.1 70B', model: 'Groq-Llama-3.1-70B' },
  ];
  const voices = [
    { id: '0', name: 'Ethan', type: 'Male' },
    { id: '1', name: 'James', type: 'Male' },
    { id: '2', name: 'Michael', type: 'Male' },
    { id: '3', name: 'Emma', type: 'Female' },
    { id: '4', name: 'Sophia', type: 'Female' },
    { id: '5', name: 'Olivia', type: 'Female' },
  ];

  // Form initialization
  const form = useForm({
    resolver: zodResolver(PodcastSettingsSchema),
    defaultValues: {
      podcast_prompt: '',
      brand_information: '',
      ai_model: aiModels[0],
      voice1: voices[0],
      voice2: voices[1],
      style: [],
      number_of_words: 500,
      search_the_web: false,
      quality: 'SD',
      no_of_speakers: 2,
      speaker1: 'Speaker 1',
      speaker2: 'Speaker 2',
      cta: '',
    },
  });

  // Load podcast settings data when available
  useEffect(() => {
    const defaultSettings = {
      ...settingsConfig,
      style: settingsConfig.style as never,
      ai_model: aiModels[0],
      voice1: voices[0],
      voice2: voices[1],
    };
  
    if (podcastSettingsData?.data) {
      const {
        podcast_prompt,
        brand_information,
        ai_model,
        voice1,
        voice2,
        style,
        number_of_words,
        search_the_web,
        quality,
        no_of_speakers,
        speaker1,
        speaker2,
        cta,
      } = podcastSettingsData.data;
  
      form.reset({
        podcast_prompt: podcast_prompt || '',
        brand_information: brand_information || '',
        ai_model: ai_model || aiModels[0],
        voice1: voice1 || voices[0],
        voice2: voice2 || voices[1],
        style: (style as unknown as never[]) || [],
        number_of_words: number_of_words || 500,
        search_the_web: search_the_web || false,
        quality: quality || 'HD',
        no_of_speakers: no_of_speakers || 2,
        speaker1: speaker1 || 'Speaker 1',
        speaker2: speaker2 || 'Speaker 2',
        cta: cta || '',
      });
    } else {
      form.reset(defaultSettings);
    }
  
    setLoading(false); // Only set loading state once at the end
  }, [podcastSettingsData?.data]);
  
  

  const toggleStyle = (style: any) => {
    const currentStyles: never[] = form.getValues('style') || [];
    const updatedStyles = currentStyles.includes(style as unknown as never)
      ? currentStyles.filter((s: string) => s !== style)
      : [...currentStyles, style];
    if (updatedStyles?.length) {
      form.setValue('style', updatedStyles as unknown as never[], {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  // Form submit handler
  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (podcastSettingsData?.data?.id) {
      setSubmitting(true); // Set submitting state
      const data = form.getValues();
      try {
        await updatePodcastMutation.mutateAsync(data as unknown as any);
        console.log('Settings updated successfully');
      } catch (error) {
        console.error('Error updating settings:', error);
      } finally {
        setSubmitting(false); // Reset submitting state
      }
    } else {
      setSubmitting(true); // Set submitting state
      const data = form.getValues();
      try {
        await createPodcastMutation.mutateAsync(data as unknown as any);
        console.log('Settings updated successfully');
      } catch (error) {
        console.error('Error updating settings:', error);
      } finally {
        setSubmitting(false); // Reset submitting state
      }
    }
    revalidatePodcastSettings(props.userId);
  };
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
        {/* Number of Speakers (Dropdown) */}
        <Controller
          name="no_of_speakers"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Speakers</FormLabel>
              <FormControl>
                <Select
                  value={String(field.value)}
                  onValueChange={(value) => {
                    form.setValue('no_of_speakers', Number(value), {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Number of Speakers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Speaker 1 */}
        <FormField
          name="speaker1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Speaker 1</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  className="rounded-md border px-4 py-2"
                  placeholder="Enter Speaker 1 Name"
                  disabled={submitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Speaker 2 */}

        {form.getValues().no_of_speakers === 2 && (
          <FormField
            name="speaker2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Speaker 2</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="Enter Speaker 2 Name"
                    disabled={submitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Podcast Prompt */}
        <FormField
          name="podcast_prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Podcast Prompt</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Adjust the podcast output using this prompt"
                  rows={3}
                  disabled={submitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Information about Brand/Business/Influencer */}
        <FormField
          name="brand_information"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand/Business/Influencer Information</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Provide any additional information about your business"
                  rows={3}
                  disabled={submitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* CTA */}
        <FormField
          name="cta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CTA (Call to Action)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter your Call to Action"
                  rows={2}
                  disabled={submitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* AI Model Selection */}
        <Controller
          name="ai_model"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Model</FormLabel>
              <FormControl>
                <Select
                  value={JSON.stringify(field.value)}
                  onValueChange={(value) => {
                    form.setValue('ai_model', JSON.parse(value), {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>AI Model</SelectLabel>
                      {aiModels.map((model) => (
                        <SelectItem
                          key={model.model}
                          value={JSON.stringify(model)}
                        >
                          {model.name} ({model.model})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Voice 1 Selection */}
        <Controller
          name="voice1"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voice 1</FormLabel>
              <FormControl>
                <Select
                  value={JSON.stringify(field.value)}
                  onValueChange={(value) => {
                    form.setValue('voice1', JSON.parse(value), {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Voice 1" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Voice 1</SelectLabel>
                      {voices.map((voice) => (
                        <SelectItem
                          key={voice.id}
                          value={JSON.stringify(voice)}
                        >
                          {voice.type}: {voice.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Voice 2 Selection */}

        {form.getValues().no_of_speakers === 2 && (
          <Controller
            name="voice2"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voice 2</FormLabel>
                <FormControl>
                  <Select
                    value={JSON.stringify(field.value)}
                    onValueChange={(value) => {
                      form.setValue('voice2', JSON.parse(value), {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    }}
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Voice 2" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Voice 2</SelectLabel>
                        {voices.map((voice) => (
                          <SelectItem
                            key={voice.id}
                            value={JSON.stringify(voice)}
                          >
                            {voice.type}: {voice.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Style Selection */}
        <FormField
          name="style"
          render={() => (
            <FormItem>
              <FormLabel>Style</FormLabel>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  'fun',
                  'serious',
                  'controversial',
                  'inspiring',
                  'casual',
                  'motivational',
                  'thought-provoking',
                  'lighthearted',
                  'dramatic',
                  'humorous',
                ].map((style) => (
                  <button
                    key={style}
                    type="button"
                    className={`rounded-full border px-4 py-2 ${
                      form
                        .getValues('style')
                        ?.includes(style as unknown as never)
                        ? 'bg-[#A08FFF] text-white'
                        : 'bg-background shadow-lg'
                    }`}
                    onClick={() => toggleStyle(style)}
                    disabled={submitting}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </FormItem>
          )}
        />

        {/* Search the Web */}
        <Controller
          name="search_the_web"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search</FormLabel>
              <FormControl>
                <label className="flex items-start space-x-2 py-2">
                  <Checkbox
                    name={field.name}
                    defaultChecked={field.value}
                    onCheckedChange={(value) => {
                      const booleanValue =
                        typeof value === 'boolean' ? value : !!value;
                      form.setValue('search_the_web', booleanValue, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    }}
                    disabled={submitting}
                  />
                  <div className="text-xs">Search the Web</div>
                </label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Number of Words Slider */}
        <FormField
          name="number_of_words"
          render={() => (
            <FormItem>
              <FormLabel>Number of Words</FormLabel>
              <FormControl>
                <Controller
                  name="number_of_words"
                  control={form.control}
                  render={({ field }) => (
                    <>
                      <Slider
                        min={300}
                        max={2000}
                        step={10}
                        color="#A08FFF"
                        defaultValue={[field.value]}
                        onValueChange={(value) => {
                          form.setValue('number_of_words', value[0] || 0, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                        }}
                        disabled={submitting}
                      />
                      <div className="mt-2 text-sm text-gray-500">
                        Selected number of words: {field.value}
                      </div>
                    </>
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Quality (HD/SD) Radio Group */}
        <FormField
          name="quality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quality</FormLabel>
              <FormControl>
                <RadioGroup name={field.name} value={field.value}>
                  <div className="flex space-x-4">
                    {[
                      { label: 'HD', value: 'HD' },
                      { label: 'SD', value: 'SD' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        htmlFor={option.value}
                        className={`flex items-center space-x-2 rounded-md border ${
                          field.value === option.value
                            ? 'border-primary'
                            : 'border-transparent'
                        } cursor-pointer px-4 py-2`}
                      >
                        <RadioGroupItem
                          id={option.value}
                          value={option.value}
                          onClick={() => form.setValue('quality', option.value)}
                          disabled={submitting}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-fit bg-[#A08FFF] text-white hover:bg-[#7f69f9]"
          disabled={submitting}
        >
          {submitting ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </Form>
  );
}
