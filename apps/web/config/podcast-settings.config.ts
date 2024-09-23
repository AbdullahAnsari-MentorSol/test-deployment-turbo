const settings = {
    no_of_speakers:2,
    speaker1: "Speaker 1",
    speaker2: "Speaker 2",
    podcast_prompt: `Each one must debate over the other over the topic. At some point they will even cut each other off, get heated and intense or interupt or they even playfully insult  each other during the podcast, occasionally they would insult each other which the view will find funny. Throw in some popular references. If you have current events, also discuss this as well some specifics or details .So I want the dialogue transcript. The name of the podcast show is called the The Turing Test Podcast. If you have the episode number, then mention it in your intro.`,
    cta:"In the middle of the podcast, we need a call to action: Speaker 1: By the way, before we continue, just a quick shoutout to Augmented AI, the producer of the Turing Test Podcast. Augmented AI hosts a variety of cutting-edge courses in generative AI, Large Language Models, edge AI, robotics, and computer vision. You can get a free generative AI course at bit dot lee forward-slash turing test podcast or go to www dot augmented startups dot com. Right at the end of the podcast, insert the following call to action: Speaker 2: And lastly, don't forget to check out Augmented AI University to upgrade your skills and become an AI expert fast! Go to bit dot lee forward-slash turing test podcast to enroll in your free cutting-edge AI course at augmented startups dot com. See you next time! Feel free to change up these call-to-actions and make them persuasive, fun, and not exactly according to the script, so they vary from one episode to the next.",
    brand_information: "Test",
    ai_model: {
      name: "OpenAI-GPT-4o-mini",
      model: "OpenAI-GPT-4o-mini"
    },
    voice1: {
      id: "0",
      name: "Ethan",
      type: "Male"
    },
    voice2: { id: '1', name: 'James', type: 'Male' },
    style: ["fun", "controversial", "serious"],
    number_of_words: 2000,
    search_the_web: false,
    quality: "SD"
  };
  
  export default settings;