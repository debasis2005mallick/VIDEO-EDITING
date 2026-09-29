export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

export interface SamplePodcast {
  id: string;
  title: string;
  host: string;
  duration: number; // in seconds
  thumbnail: string;
  videoUrl: string;
  category: string;
  transcript: string;
  words: WordTimestamp[];
}

export const SAMPLE_PODCASTS: SamplePodcast[] = [
  {
    id: 'huberman-dopamine',
    title: 'The Neuroscience of Peak Motivation & Dopamine Loops',
    host: 'Dr. Andrew Huberman & Dr. Anna Lembke',
    duration: 360, // 6 min sample representing a 3h podcast
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'Neuroscience & Health',
    transcript: `[00:05] Here is the fundamental paradox of dopamine that almost nobody understands. 
[00:12] When you experience a massive spike in dopamine—whether from social media, a huge victory, or a stimulant—your baseline dopamine does not simply return to where it was. 
[00:24] It actually drops BELOW the previous baseline. 
[00:28] This is what neuroscientists call the dopamine deficit state.
[00:34] If you immediately chase another spike to get back up, you deepen that deficit trench. 
[00:42] The secret that top performers know is that you must attach dopamine to the EFFORT and the FRICTION, not the final reward. 
[00:54] When you celebrate the grueling process itself, your baseline stays elevated for months.
[01:10] Most people burn out because they live in a permanent dopamine trough while thinking they just need more motivation.
[01:25] In reality, motivation is purely a biochemical ratio between your current state and your expected friction.
[01:40] If you reset your baseline with a 24-hour sensory fast, the simplest task feels exciting again.`,
    words: [
      { word: "Here", start: 5.0, end: 5.3 },
      { word: "is", start: 5.4, end: 5.6 },
      { word: "the", start: 5.7, end: 5.9 },
      { word: "fundamental", start: 6.0, end: 6.7 },
      { word: "paradox", start: 6.8, end: 7.4 },
      { word: "of", start: 7.5, end: 7.7 },
      { word: "dopamine", start: 7.8, end: 8.5 },
      { word: "that", start: 8.6, end: 8.8 },
      { word: "almost", start: 8.9, end: 9.3 },
      { word: "nobody", start: 9.4, end: 9.9 },
      { word: "understands.", start: 10.0, end: 11.2 },
      { word: "When", start: 12.0, end: 12.3 },
      { word: "you", start: 12.4, end: 12.6 },
      { word: "experience", start: 12.7, end: 13.4 },
      { word: "a", start: 13.5, end: 13.6 },
      { word: "massive", start: 13.7, end: 14.2 },
      { word: "spike", start: 14.3, end: 14.8 },
      { word: "in", start: 14.9, end: 15.1 },
      { word: "dopamine,", start: 15.2, end: 15.9 },
      { word: "your", start: 16.0, end: 16.2 },
      { word: "baseline", start: 16.3, end: 17.0 },
      { word: "does", start: 17.1, end: 17.4 },
      { word: "not", start: 17.5, end: 17.8 },
      { word: "return", start: 17.9, end: 18.4 },
      { word: "to", start: 18.5, end: 18.7 },
      { word: "where", start: 18.8, end: 19.1 },
      { word: "it", start: 19.2, end: 19.4 },
      { word: "was.", start: 19.5, end: 20.0 },
      { word: "It", start: 24.0, end: 24.3 },
      { word: "actually", start: 24.4, end: 24.9 },
      { word: "drops", start: 25.0, end: 25.5 },
      { word: "BELOW", start: 25.6, end: 26.2 },
      { word: "the", start: 26.3, end: 26.5 },
      { word: "previous", start: 26.6, end: 27.2 },
      { word: "baseline.", start: 27.3, end: 28.0 },
      { word: "The", start: 42.0, end: 42.3 },
      { word: "secret", start: 42.4, end: 42.9 },
      { word: "that", start: 43.0, end: 43.2 },
      { word: "top", start: 43.3, end: 43.6 },
      { word: "performers", start: 43.7, end: 44.4 },
      { word: "know", start: 44.5, end: 44.9 },
      { word: "is", start: 45.0, end: 45.2 },
      { word: "that", start: 45.3, end: 45.5 },
      { word: "you", start: 45.6, end: 45.8 },
      { word: "must", start: 45.9, end: 46.2 },
      { word: "attach", start: 46.3, end: 46.8 },
      { word: "dopamine", start: 46.9, end: 47.6 },
      { word: "to", start: 47.7, end: 47.9 },
      { word: "the", start: 48.0, end: 48.2 },
      { word: "EFFORT", start: 48.3, end: 49.0 },
      { word: "and", start: 49.1, end: 49.3 },
      { word: "the", start: 49.4, end: 49.6 },
      { word: "FRICTION,", start: 49.7, end: 50.6 },
      { word: "not", start: 50.7, end: 51.0 },
      { word: "the", start: 51.1, end: 51.3 },
      { word: "reward.", start: 51.4, end: 52.2 }
    ]
  },
  {
    id: 'tech-founders',
    title: 'How 3 People Built a $50M Software Company with Zero Funding',
    host: 'Jason Fried & Pieter Levels',
    duration: 420,
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    category: 'Business & Startups',
    transcript: `[00:10] Every venture capitalist told us we were crazy for not hiring 50 engineers.
[00:18] But here is the brutal truth about software in 2026: 
[00:24] Software development is no longer about writing thousands of lines of boilerplate code.
[00:32] It is about velocity of iteration and ruthless simplicity.
[00:40] With modern AI agent tooling and automated pipelines, a team of three engineers can ship features faster than a bloated team of 200 people.
[00:55] Complexity is the silent killer of tech startups.
[01:05] If your product requires a 20-page manual to understand, your product is broken.`,
    words: [
      { word: "Every", start: 10.0, end: 10.4 },
      { word: "venture", start: 10.5, end: 10.9 },
      { word: "capitalist", start: 11.0, end: 11.7 },
      { word: "told", start: 11.8, end: 12.1 },
      { word: "us", start: 12.2, end: 12.4 },
      { word: "we", start: 12.5, end: 12.7 },
      { word: "were", start: 12.8, end: 13.0 },
      { word: "crazy", start: 13.1, end: 13.8 },
      { word: "for", start: 13.9, end: 14.1 },
      { word: "not", start: 14.2, end: 14.5 },
      { word: "hiring", start: 14.6, end: 15.2 },
      { word: "fifty", start: 15.3, end: 15.8 },
      { word: "engineers.", start: 15.9, end: 16.8 },
      { word: "But", start: 18.0, end: 18.2 },
      { word: "here", start: 18.3, end: 18.5 },
      { word: "is", start: 18.6, end: 18.8 },
      { word: "the", start: 18.9, end: 19.1 },
      { word: "brutal", start: 19.2, end: 19.7 },
      { word: "truth", start: 19.8, end: 20.3 },
      { word: "about", start: 20.4, end: 20.7 },
      { word: "software.", start: 20.8, end: 21.6 },
      { word: "A", start: 40.0, end: 40.2 },
      { word: "team", start: 40.3, end: 40.6 },
      { word: "of", start: 40.7, end: 40.9 },
      { word: "three", start: 41.0, end: 41.5 },
      { word: "can", start: 41.6, end: 41.9 },
      { word: "now", start: 42.0, end: 42.3 },
      { word: "out-ship", start: 42.4, end: 43.1 },
      { word: "two", start: 43.2, end: 43.5 },
      { word: "hundred", start: 43.6, end: 44.2 },
      { word: "people.", start: 44.3, end: 45.0 }
    ]
  }
];
