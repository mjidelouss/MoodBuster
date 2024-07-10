import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MediaCard from "../MediaCard/MediaCard";

const API_KEY = "86cdb246bc2dfde7b16fa94055f4d2f5";
const GOOGLE_BOOKS_API_BASE_URL = "https://www.googleapis.com/books/v1/volumes";
const TASTY_API_KEY = "feea7bfaebmsh0b74d1a758c7e50p13a982jsne95dd58f8ff5";

interface Media {
  id: string | number;
  title?: string;
  name?: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  overview?: string;
  genres?: { id: number; name: string }[] | string[];
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  created_by?: { name: string }[];
  credits?: {
    cast: { name: string }[];
    crew: { job: string; name: string }[];
  };
  authors?: string[];
  publishedDate?: string;
  description?: string;
  categories?: string[];
  averageRating?: number;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  infoLink?: string;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  total_time_minutes?: number;
  num_servings?: number;
  tags?: string[];
  ingredients?: string;
  instructions?: string;
  artists?: string;
  album?: string;
  releaseDate?: string;
  preview_url?: string;
  duration_ms?: number;
  popularity?: number;
  explicit?: boolean;
  track_number?: number;
  disc_number?: number;
  external_urls?: { spotify: string };
  platforms?: string[];
  rating?: number;
  developer?: string;
  publisher?: string;
  gameMode?: string;
  coverUrl?: string;
}

interface MediaSuggestionProps {
  mediaType: string;
  mood: string;
  onReturnToMediaSelection: () => void;
  onReturnToMoodSelection: () => void;
}

interface MoodMapping {
  keywords: number[];
  genres: number[];
}

const moodToGameKeywords: { [key: string]: string[] } = {
  "Cozy and Comforting": ["casual", "simulation", "farming"],
  "Adventure Craving": ["action-adventure", "open-world", "exploration"],
  "Heartwarming and Uplifting": ["life simulation", "story-rich", "indie"],
  "Intellectually Stimulating": ["puzzle", "strategy", "educational"],
  "Nostalgic and Sentimental": ["retro", "classic", "remake"],
  "Laugh Out Loud": ["comedy", "party", "mini-games"],
  "Edge of Your Seat": ["action", "shooter", "battle royale"],
  "Mysteriously Intrigued": ["mystery", "detective", "hidden object"],
  "Feel-Good Escape": ["relaxing", "atmospheric", "sandbox"],
  "Romantic and Dreamy": ["visual novel", "dating sim", "romance"],
  "Epic and Grandiose": ["rpg", "mmorpg", "epic"],
  "Deep and Reflective": ["narrative", "philosophical", "art game"],
  "Playful and Fun": ["platformer", "arcade", "family"],
  "Thrill Seeker": ["horror", "survival", "roguelike"],
  "Inspirational and Motivating": ["sports", "fitness", "management"],
  "Relaxed and Chill": ["walking simulator", "idle", "zen"],
  "Imaginative and Fantastical": ["fantasy", "sci-fi", "creative"],
  "Somber and Thought-Provoking": ["drama", "psychological", "choice matter"],
  "Lighthearted and Breezy": ["cute", "colorful", "casual"],
  "Mind-Bending and Twisty": ["puzzle-platformer", "experimental", "surreal"],
};

const moodToMusicKeywords: { [key: string]: string[] } = {
  "Cozy and Comforting": ["acoustic", "folk", "indie-folk"],
  "Adventure Craving": ["rock", "indie-rock", "alternative"],
  "Heartwarming and Uplifting": ["pop", "feel-good", "happy"],
  "Intellectually Stimulating": ["classical", "jazz", "instrumental"],
  "Nostalgic and Sentimental": ["oldies", "vintage", "80s", "90s"],
  "Laugh Out Loud": ["comedy", "novelty", "fun"],
  "Edge of Your Seat": ["metal", "punk", "hard-rock"],
  "Mysteriously Intrigued": ["ambient", "electronic", "trip-hop"],
  "Feel-Good Escape": ["tropical", "summer", "dance-pop"],
  "Romantic and Dreamy": ["r-n-b", "soul", "love"],
  "Epic and Grandiose": ["epic", "soundtrack", "orchestral"],
  "Deep and Reflective": ["singer-songwriter", "indie", "chill"],
  "Playful and Fun": ["party", "dance", "disco"],
  "Thrill Seeker": ["edm", "dubstep", "drum-and-bass"],
  "Inspirational and Motivating": ["power-pop", "gospel", "motivational"],
  "Relaxed and Chill": ["lofi", "chillout", "relaxative"],
  "Imaginative and Fantastical": ["psychedelic", "prog-rock", "art rock"],
  "Somber and Thought-Provoking": ["sad", "melancholy", "blues"],
  "Lighthearted and Breezy": ["bossa-nova", "reggae", "ska"],
  "Mind-Bending and Twisty": ["experimental", "avant-garde", "idm"],
};

const moodToFoodKeywords: { [key: string]: string[] } = {
  "Cozy and Comforting": [
    "comfort food",
    "soup",
    "stew",
    "casserole",
    "pot pie",
  ],
  "Adventure Craving": [
    "exotic",
    "spicy",
    "fusion",
    "international",
    "street food",
  ],
  "Heartwarming and Uplifting": [
    "homemade",
    "family recipe",
    "wholesome",
    "hearty",
  ],
  "Intellectually Stimulating": [
    "gourmet",
    "complex",
    "molecular gastronomy",
    "artisanal",
  ],
  "Nostalgic and Sentimental": [
    "retro",
    "childhood favorite",
    "classic",
    "vintage recipe",
  ],
  "Laugh Out Loud": ["fun food", "colorful", "whimsical", "party snacks"],
  "Edge of Your Seat": [
    "bold flavors",
    "extreme spicy",
    "unusual combinations",
  ],
  "Mysteriously Intrigued": [
    "secret ingredient",
    "surprising flavor",
    "hidden vegetable",
  ],
  "Feel-Good Escape": [
    "tropical",
    "vacation food",
    "beach snacks",
    "resort cuisine",
  ],
  "Romantic and Dreamy": [
    "aphrodisiac",
    "intimate dinner",
    "chocolate",
    "strawberries",
  ],
  "Epic and Grandiose": ["feast", "banquet", "luxurious", "gourmet spread"],
  "Deep and Reflective": [
    "slow food",
    "mindful eating",
    "balanced meal",
    "buddha bowl",
  ],
  "Playful and Fun": [
    "finger food",
    "interactive meal",
    "DIY food",
    "colorful dishes",
  ],
  "Thrill Seeker": ["extreme cuisine", "dare food", "unusual ingredients"],
  "Inspirational and Motivating": [
    "superfood",
    "energy boosting",
    "protein-rich",
    "clean eating",
  ],
  "Relaxed and Chill": [
    "easy recipes",
    "no-cook meals",
    "grazing platter",
    "picnic food",
  ],
  "Imaginative and Fantastical": [
    "themed food",
    "food art",
    "edible landscape",
    "fairytale inspired",
  ],
  "Somber and Thought-Provoking": [
    "comfort food",
    "soul food",
    "nostalgic dishes",
  ],
  "Lighthearted and Breezy": [
    "fresh salads",
    "light bites",
    "summer dishes",
    "refreshing meals",
  ],
  "Mind-Bending and Twisty": [
    "deconstructed dishes",
    "illusion food",
    "surprise inside",
    "color-changing",
  ],
};

const moodToDrinkKeywords: { [key: string]: string[] } = {
  "Cozy and Comforting": [
    "hot chocolate",
    "mulled wine",
    "warm cider",
    "herbal tea",
  ],
  "Adventure Craving": [
    "exotic cocktail",
    "tropical smoothie",
    "spiced beverages",
    "international drinks",
  ],
  "Heartwarming and Uplifting": [
    "golden milk",
    "fruit tea",
    "homemade lemonade",
    "chai latte",
  ],
  "Intellectually Stimulating": [
    "craft coffee",
    "complex cocktail",
    "artisanal tea",
    "nootropic drinks",
  ],
  "Nostalgic and Sentimental": [
    "old fashioned soda",
    "milkshake",
    "malted drink",
    "root beer float",
  ],
  "Laugh Out Loud": [
    "bubble tea",
    "crazy milkshake",
    "fun mocktail",
    "soda float",
  ],
  "Edge of Your Seat": [
    "energy drink",
    "strong coffee",
    "spicy tomato juice",
    "ginger shot",
  ],
  "Mysteriously Intrigued": [
    "color-changing drink",
    "smoke-infused beverage",
    "CBD drink",
    "kombucha",
  ],
  "Feel-Good Escape": [
    "pina colada",
    "tropical punch",
    "coconut water",
    "fruit smoothie",
  ],
  "Romantic and Dreamy": [
    "rose latte",
    "champagne cocktail",
    "aphrodisiac elixir",
    "berry smoothie",
  ],
  "Epic and Grandiose": [
    "elaborate cocktail",
    "premium spirits",
    "aged wine",
    "luxury coffee",
  ],
  "Deep and Reflective": [
    "matcha tea",
    "meditation tonic",
    "adaptogen latte",
    "blue lotus tea",
  ],
  "Playful and Fun": ["slushie", "milkshake", "bubble tea", "rainbow drink"],
  "Thrill Seeker": [
    "extreme caffeine",
    "strange flavor combination",
    "dare shot challenge",
  ],
  "Inspirational and Motivating": [
    "green juice",
    "protein shake",
    "pre-workout drink",
    "vitamin-infused water",
  ],
  "Relaxed and Chill": ["iced tea", "lemonade", "spritzer", "decaf latte"],
  "Imaginative and Fantastical": [
    "unicorn latte",
    "galaxy drink",
    "magic potion",
    "color-changing cocktail",
  ],
  "Somber and Thought-Provoking": [
    "black coffee",
    "dark tea",
    "bitter aperitif",
    "smoky whiskey",
  ],
  "Lighthearted and Breezy": [
    "fruit-infused water",
    "sparkling juice",
    "iced green tea",
    "cucumber cooler",
  ],
  "Mind-Bending and Twisty": [
    "molecular mixology",
    "deconstructed coffee",
    "flavor-tripping cocktail",
    "unexpected pairings",
  ],
};

const moodToBookKeywords: { [key: string]: string[] } = {
  "Cozy and Comforting": ["cozy", "comfort reads"],
  "Adventure Craving": ["adventure", "action"],
  "Heartwarming and Uplifting": ["heartwarming", "uplifting"],
  "Intellectually Stimulating": ["intellectual", "thought-provoking"],
  "Nostalgic and Sentimental": ["nostalgia", "classic"],
  "Laugh Out Loud": ["humor", "comedy"],
  "Edge of Your Seat": ["thriller", "suspense"],
  "Mysteriously Intrigued": ["mystery", "detective"],
  "Feel-Good Escape": ["feel-good", "escapism"],
  "Romantic and Dreamy": ["romance", "love story"],
  "Epic and Grandiose": ["epic", "saga"],
  "Deep and Reflective": ["philosophical", "reflective"],
  "Playful and Fun": ["playful", "fun"],
  "Thrill Seeker": ["thriller", "action"],
  "Inspirational and Motivating": ["inspirational", "self-help"],
  "Relaxed and Chill": ["relaxing", "light read"],
  "Imaginative and Fantastical": ["fantasy", "science fiction"],
  "Somber and Thought-Provoking": ["literary fiction", "drama"],
  "Lighthearted and Breezy": ["lighthearted", "feel-good"],
  "Mind-Bending and Twisty": ["psychological thriller", "twist ending"],
};

const moodToMappingData: { [key: string]: MoodMapping } = {
  "Cozy and Comforting": {
    keywords: [10024],
    genres: [35, 10751],
  },
  "Adventure Craving": {
    keywords: [1365],
    genres: [12, 28],
  },
  "Heartwarming and Uplifting": {
    keywords: [9713],
    genres: [18, 10751],
  },
  "Intellectually Stimulating": {
    keywords: [156205],
    genres: [99, 36],
  },
  "Nostalgic and Sentimental": {
    keywords: [6054],
    genres: [18, 10749],
  },
  "Laugh Out Loud": {
    keywords: [9675],
    genres: [35],
  },
  "Edge of Your Seat": {
    keywords: [10944],
    genres: [53, 80],
  },
  "Mysteriously Intrigued": {
    keywords: [9725],
    genres: [9648, 80],
  },
  "Feel-Good Escape": {
    keywords: [5615],
    genres: [35, 10749],
  },
  "Romantic and Dreamy": {
    keywords: [9748],
    genres: [10749],
  },
  "Epic and Grandiose": {
    keywords: [4344],
    genres: [12, 14],
  },
  "Deep and Reflective": {
    keywords: [156218],
    genres: [18],
  },
  "Playful and Fun": {
    keywords: [9663],
    genres: [35, 16],
  },
  "Thrill Seeker": {
    keywords: [10663],
    genres: [28, 53],
  },
  "Inspirational and Motivating": {
    keywords: [165194],
    genres: [18, 36],
  },
  "Relaxed and Chill": {
    keywords: [245728],
    genres: [35, 10402],
  },
  "Imaginative and Fantastical": {
    keywords: [9716],
    genres: [14, 878],
  },
  "Somber and Thought-Provoking": {
    keywords: [15096],
    genres: [18],
  },
  "Lighthearted and Breezy": {
    keywords: [246716],
    genres: [35, 10751],
  },
  "Mind-Bending and Twisty": {
    keywords: [10052],
    genres: [53, 9648],
  },
};

function MediaSuggestion({
  mediaType,
  mood,
  onReturnToMediaSelection,
  onReturnToMoodSelection,
}: MediaSuggestionProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      setIsLoading(true);
      setError(null);
      setMedia([]);
      setCurrentIndex(0);

      try {
        if (mediaType === "Game") {
          const games = await fetchGamesByMood(mood);
          if (games && games.length > 0) {
            setMedia(games);
          } else {
            setError("No games found for the selected mood. Please try a different mood.");
          }
        } else if (mediaType === "Podcast") {
          const podcasts = await fetchPodcastsByMood(mood);
          if (podcasts && podcasts.length > 0) {
            setMedia(podcasts);
          } else {
            setError(
              "No podcasts found for the selected mood. Please try a different mood."
            );
          }
        } else if (mediaType === "Music") {
          const musicTracks = await fetchMusicByMood(mood);
          if (musicTracks && musicTracks.length > 0) {
            setMedia(musicTracks);
          } else {
            setError(
              "No music found for the selected mood. Please try a different mood."
            );
          }
        } else if (mediaType === "Playlist") {
          const playlists = await fetchPlaylistsByMood(mood);
          if (playlists && playlists.length > 0) {
            setMedia(playlists);
          } else {
            setError(
              "No playlists found for the selected mood. Please try a different mood."
            );
          }
        } else if (mediaType === "Book") {
          const books = await fetchBooksByMood(mood);
          console.log("Fetched books:", books);
          if (books && books.length > 0) {
            setMedia(books);
          } else {
            setError(
              "No books found for the selected mood. Please try a different mood."
            );
          }
        } else if (mediaType === "Food") {
          const foods = await fetchFoodByMood(mood);
          setMedia(foods);
        } else if (mediaType === "Drink") {
          const drinks = await fetchDrinksByMood(mood);
          if (drinks && drinks.length > 0) {
            setMedia(drinks);
          } else {
            setError(
              "No drinks found for the selected mood. Please try a different mood."
            );
          }
        } else {
          const moodMapping = moodToMappingData[mood];
          if (!moodMapping) {
            throw new Error(`No mapping found for mood: ${mood}`);
          }

          const { keywords, genres } = moodMapping;
          let url = `https://api.themoviedb.org/3/discover/${
            mediaType === "Movie" ? "movie" : "tv"
          }?api_key=${API_KEY}`;

          // Start with both keywords and genres
          if (keywords.length > 0) {
            url += `&with_keywords=${keywords.join("|")}`;
          }
          if (genres.length > 0) {
            url += `&with_genres=${genres.join(",")}`;
          }

          if (mediaType === "Anime") {
            url += "&with_keywords=210024"; // Keyword ID for anime
          }

          let data = await fetchFromApi(url);

          // If no results, try with only genres
          if (data.results.length === 0 && genres.length > 0) {
            url = `https://api.themoviedb.org/3/discover/${
              mediaType === "Movie" ? "movie" : "tv"
            }?api_key=${API_KEY}&with_genres=${genres.join(",")}`;
            data = await fetchFromApi(url);
          }

          // If still no results, try with only keywords
          if (data.results.length === 0 && keywords.length > 0) {
            url = `https://api.themoviedb.org/3/discover/${
              mediaType === "Movie" ? "movie" : "tv"
            }?api_key=${API_KEY}&with_keywords=${keywords.join("|")}`;
            data = await fetchFromApi(url);
          }

          // If still no results, fetch popular titles for the media type
          if (data.results.length === 0) {
            url = `https://api.themoviedb.org/3/${
              mediaType === "Movie" ? "movie" : "tv"
            }/popular?api_key=${API_KEY}`;
            data = await fetchFromApi(url);
          }

          if (data.results && data.results.length > 0) {
            const detailedMedia = await Promise.all(
              data.results.map(async (item: Media) => {
                const detailUrl = `https://api.themoviedb.org/3/${
                  mediaType === "Movie" ? "movie" : "tv"
                }/${item.id}?api_key=${API_KEY}&append_to_response=credits`;
                const detailData = await fetchFromApi(detailUrl);
                return { ...item, ...detailData };
              })
            );
            setMedia(detailedMedia);
          } else {
            setError(
              `No ${mediaType.toLowerCase()} found for the selected mood. Please try a different mood.`
            );
          }
        }
      } catch (e) {
        console.error("Error fetching media:", e);
        setError(
          `Failed to fetch ${mediaType.toLowerCase()}. Please try again.`
        );
      } finally {
        setIsLoading(false);
      }
    };

    const fetchFromApi = async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    };

    fetchMedia();
  }, [mediaType, mood]);

  function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async function fetchGamesByMood(mood: string): Promise<Media[]> {
    const keywords = moodToGameKeywords[mood] || ["game"];
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    
    // Replace with your actual IGDB API endpoint and credentials
    const url = 'https://api.igdb.com/v4/games';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Client-ID': 'your-client-id',
        'Authorization': 'Bearer your-access-token',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: `fields name,genres.name,platforms.name,rating,first_release_date,involved_companies.company.name,game_modes.name,cover.url,summary;
             where keywords.name = "${keyword}";
             limit 20;`
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
  
    return data.map((game: any) => ({
      id: game.id,
      title: game.name,
      genres: game.genres?.map((g: any) => g.name),
      platforms: game.platforms?.map((p: any) => p.name),
      rating: game.rating,
      releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString().split('T')[0] : undefined,
      developer: game.involved_companies?.find((ic: any) => ic.developer)?.company.name,
      publisher: game.involved_companies?.find((ic: any) => ic.publisher)?.company.name,
      gameMode: game.game_modes?.map((gm: any) => gm.name).join(', '),
      coverUrl: game.cover?.url ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}` : undefined,
      description: game.summary,
    }));
  }

  async function fetchPodcastsByMood(mood: string): Promise<Media[]> {
    const keywords = moodToMusicKeywords[mood] || ["talk"];
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    const url = `https://spotify23.p.rapidapi.com/search/?type=multi&offset=0&limit=10&numberOfTopResults=5&q=${encodeURIComponent(
      keyword
    )}%20podcast`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "feea7bfaebmsh0b74d1a758c7e50p13a982jsne95dd58f8ff5",
        "x-rapidapi-host": "spotify23.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (
      !data.podcasts ||
      !data.podcasts.items ||
      data.podcasts.items.length === 0
    ) {
      throw new Error("No podcasts found for the selected mood.");
    }

    return shuffleArray(
      data.podcasts.items.map((item: any) => ({
        id: item.data.uri.split(":").pop(),
        name: item.data.name,
        publisher: typeof item.data.publisher === 'string' 
      ? item.data.publisher 
      : item.data.publisher.name,
        type: item.data.type,
        mediaType: item.data.mediaType,
        coverArt: {
          sources: item.data.coverArt.sources,
        },
        external_urls: {
          spotify: `https://open.spotify.com/show/${item.data.uri
            .split(":")
            .pop()}`,
        },
      }))
    );
  }

  async function fetchPlaylistsByMood(mood: string): Promise<Media[]> {
    const genres = moodToMusicKeywords[mood] || ["pop"];
    const genre = genres[Math.floor(Math.random() * genres.length)];
    const url = `https://spotify23.p.rapidapi.com/search/?type=multi&offset=0&limit=10&numberOfTopResults=5&q=${encodeURIComponent(
      genre
    )}%20playlist`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "feea7bfaebmsh0b74d1a758c7e50p13a982jsne95dd58f8ff5",
        "x-rapidapi-host": "spotify23.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (
      !data.playlists ||
      !data.playlists.items ||
      data.playlists.items.length === 0
    ) {
      throw new Error("No playlists found for the selected mood.");
    }

    return shuffleArray(
      data.playlists.items.map((item: any) => ({
        id: item.data.uri.split(":").pop(),
        title: item.data.name,
        description: item.data.description,
        image: item.data.images.items[0]?.sources[0]?.url,
        owner: item.data.owner.name,
        external_urls: {
          spotify: `https://open.spotify.com/playlist/${item.data.uri
            .split(":")
            .pop()}`,
        },
      }))
    );
  }

  async function fetchMusicByMood(mood: string): Promise<Media[]> {
    const genres = moodToMusicKeywords[mood] || ["pop"];
    const genre = genres[Math.floor(Math.random() * genres.length)];
    const url = `https://spotify23.p.rapidapi.com/search/?type=multi&offset=0&limit=50&numberOfTopResults=5&q=genre:${encodeURIComponent(
      genre
    )}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "feea7bfaebmsh0b74d1a758c7e50p13a982jsne95dd58f8ff5",
        "x-rapidapi-host": "spotify23.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    console.log(data);

    if (!data.tracks || !data.tracks.items || data.tracks.items.length === 0) {
      throw new Error("No tracks found for the selected mood.");
    }

    return shuffleArray(
      data.tracks.items.map((item: any) => ({
        id: item.data.id,
        title: item.data.name,
        artists: item.data.artists.items
          .map((artist: any) => artist.profile.name)
          .join(", "),
        album: item.data.albumOfTrack.name,
        releaseDate: item.data.albumOfTrack.releases?.items[0]?.date?.year,
        image: item.data.albumOfTrack.coverArt.sources[0].url,
        preview_url: item.data.previews?.audioPreview?.url,
        duration_ms: item.data.duration.totalMilliseconds,
        explicit: item.data.contentRating.label === "EXPLICIT",
        external_urls: {
          spotify: `https://open.spotify.com/track/${item.data.id}`,
        },
      }))
    );
  }

  const fetchFoodByMood = async (mood: string) => {
    const keywords = moodToFoodKeywords[mood] || [""];
    const query = keywords[Math.floor(Math.random() * keywords.length)];
    const url = `https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&q=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": TASTY_API_KEY,
        "X-RapidAPI-Host": "tasty.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.results.map((item: any) => ({
      id: item.id,
      title: item.name,
      image: item.thumbnail_url,
      description:
        item.description ||
        `A delicious dish that perfectly matches your ${mood} mood.`,
      total_time_minutes: item.total_time_minutes,
      num_servings: item.num_servings,
      tags: item.tags?.map((tag: any) => tag.name) || [],
      ingredients:
        item.sections?.[0]?.components
          ?.map((component: any) => component.raw_text)
          .join(", ") || "No ingredients available.",
      instructions:
        item.instructions
          ?.map((instruction: any) => instruction.display_text)
          .join(" ") || "No instructions available.",
    }));
  };

  const fetchDrinksByMood = async (mood: string) => {
    const drinkKeywords = moodToDrinkKeywords[mood] || [
      "cocktail",
      "smoothie",
      "beverage",
      "drink",
    ];
    const query =
      drinkKeywords[Math.floor(Math.random() * drinkKeywords.length)];
    const url = `https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&q=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": TASTY_API_KEY,
        "X-RapidAPI-Host": "tasty.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results.map((item: any) => ({
      id: item.id,
      title: item.name,
      image: item.thumbnail_url,
      description:
        item.description ||
        `A refreshing drink that complements your ${mood} mood.`,
      total_time_minutes: item.total_time_minutes,
      num_servings: item.num_servings,
      tags: item.tags?.map((tag: any) => tag.name) || [],
      ingredients:
        item.sections?.[0]?.components
          ?.map((component: any) => component.raw_text)
          .join(", ") || "No ingredients available.",
      instructions:
        item.instructions
          ?.map((instruction: any) => instruction.display_text)
          .join(" ") || "No instructions available.",
    }));
  };

  const fetchBooksByMood = async (mood: string) => {
    const keywords = moodToBookKeywords[mood] || [];
    const query = encodeURIComponent(keywords.join(" "));
    const url = `${GOOGLE_BOOKS_API_BASE_URL}?q=${query}&maxResults=40`;

    try {
      const response = await fetch(url);
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.items && data.items.length > 0) {
        return data.items.map((book: any) => ({
          id: book.id,
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors,
          publishedDate: book.volumeInfo.publishedDate,
          description: book.volumeInfo.description,
          categories: book.volumeInfo.categories,
          averageRating: book.volumeInfo.averageRating,
          imageLinks: book.volumeInfo.imageLinks,
          infoLink: book.volumeInfo.infoLink,
        }));
      } else {
        console.log("No books found in the API response");
        return [];
      }
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + media.length) % media.length
    );
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-600 dark:text-gray-400"
      >
        Loading...
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-red-600 dark:text-red-400"
      >
        {error}
      </motion.div>
    );
  }

  if (media.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-600 dark:text-gray-400"
      >
        No {mediaType.toLowerCase()} found. Try a different mood.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 font-acme">
        Suggested {mediaType.toLowerCase()} for "
        <span className="text-tahiti">{mood}</span>" mood:
      </h2>
      <AnimatePresence mode="wait">
        <motion.div
          key={media[currentIndex].id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <MediaCard media={media[currentIndex]} mediaType={mediaType} />
        </motion.div>
      </AnimatePresence>
      <motion.div
        className="flex justify-between mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={handlePrevious}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors dark:bg-gray-700 dark:hover:bg-gray-800 font-eater"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Previous
        </motion.button>
        <motion.button
          onClick={handleNext}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors dark:bg-gray-700 dark:hover:bg-gray-800 font-eater"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next
        </motion.button>
      </motion.div>
      <motion.div
        className="flex justify-center mt-6 space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={onReturnToMediaSelection}
          className="bg-transparent hover:bg-blue-600 text-blue-700 hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded font-ang"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back To Start
        </motion.button>
        <motion.button
          onClick={onReturnToMoodSelection}
          className="bg-transparent hover:bg-green-600 text-green-700 hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded font-ang"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Change Mood
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default MediaSuggestion;
