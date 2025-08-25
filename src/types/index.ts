export interface User {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface Generation {
  id: number;
  images: GeneratedImage[];
  timestamp: string;
  isLoading?: boolean;
}

export interface GeneratedImage {
  id: number;
  url: string;
}

export interface ArtStyle {
  id: string;
  label: string;
  image: string | null;
}