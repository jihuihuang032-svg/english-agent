export interface ListeningVideo {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration: string;
  level: 'easy' | 'medium' | 'hard';
  category: string;
}

export const listeningVideos: ListeningVideo[] = [
  {
    id: '1',
    title: '6 Minute English: Sleep',
    description: 'Why do we need sleep? Learn useful vocabulary about sleep and health.',
    youtubeId: 'Y-8qkPJQNJQ',
    duration: '6 min',
    level: 'easy',
    category: '6 Minute English',
  },
  {
    id: '2',
    title: '6 Minute English: Coffee',
    description: 'Why do we love coffee? Learn vocabulary about this popular drink.',
    youtubeId: 'WvJPPGOLfQ0',
    duration: '6 min',
    level: 'easy',
    category: '6 Minute English',
  },
  {
    id: '3',
    title: '6 Minute English: Happiness',
    description: 'What makes us happy? Learn words about emotions and well-being.',
    youtubeId: 'Y4MfQZ_dVH4',
    duration: '6 min',
    level: 'easy',
    category: '6 Minute English',
  },
  {
    id: '4',
    title: '6 Minute English: Social Media',
    description: 'How does social media affect our lives? Learn technology vocabulary.',
    youtubeId: 'JdFrAdQuXYg',
    duration: '6 min',
    level: 'easy',
    category: '6 Minute English',
  },
  {
    id: '5',
    title: '6 Minute English: Travel',
    description: 'Why do we travel? Learn travel and tourism vocabulary.',
    youtubeId: 'GyKdJ7DpMl0',
    duration: '6 min',
    level: 'easy',
    category: '6 Minute English',
  },
  {
    id: '6',
    title: '6 Minute English: Food Waste',
    description: 'How much food do we waste? Learn vocabulary about food and environment.',
    youtubeId: 'RxAJXFNxJNs',
    duration: '6 min',
    level: 'easy',
    category: '6 Minute English',
  },
  {
    id: '7',
    title: '6 Minute English: Smartphone',
    description: 'Are we addicted to smartphones? Learn technology and addiction vocabulary.',
    youtubeId: 'V7F-sbmKVkE',
    duration: '6 min',
    level: 'easy',
    category: '6 Minute English',
  },
  {
    id: '8',
    title: '6 Minute English: Music',
    description: 'Why does music make us feel good? Learn music vocabulary.',
    youtubeId: 'JhI3MjT2aQk',
    duration: '6 min',
    level: 'easy',
    category: '6 Minute English',
  },
  {
    id: '9',
    title: 'English at Work: The Interview',
    description: 'Learn how to handle a job interview in English.',
    youtubeId: 'sI7wFZxQx7k',
    duration: '5 min',
    level: 'easy',
    category: 'English at Work',
  },
  {
    id: '10',
    title: 'English at Work: First Day',
    description: 'Learn useful phrases for your first day at a new job.',
    youtubeId: 'n1mJj4Y5YkE',
    duration: '5 min',
    level: 'easy',
    category: 'English at Work',
  },
  {
    id: '11',
    title: 'The English We Speak: Chill',
    description: 'Learn the modern slang word "chill" and how to use it.',
    youtubeId: 'HtYQzQzJQzQ',
    duration: '3 min',
    level: 'easy',
    category: 'The English We Speak',
  },
  {
    id: '12',
    title: '6 Minute English: Learning Languages',
    description: 'How do we learn languages? Learn education vocabulary.',
    youtubeId: 'QzM7LxJQzJQ',
    duration: '6 min',
    level: 'easy',
    category: '6 Minute English',
  },
];

export function getRandomVideo(level: 'easy' | 'medium' | 'hard' = 'easy'): ListeningVideo {
  const filtered = listeningVideos.filter(v => v.level === level);
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

export function getVideosByCategory(category: string): ListeningVideo[] {
  return listeningVideos.filter(v => v.category === category);
}

export function getCategories(): string[] {
  return [...new Set(listeningVideos.map(v => v.category))];
}
