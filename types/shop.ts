export interface Shop {
  id: string;
  name: string;
  icon: string;
  color?: string; // Hex color for the icon
  isFavorite?: boolean;
  language?: string; // Language this shop belongs to
  isCustom?: boolean; // Whether this is a user-added shop
  isOriginal?: boolean; // Whether this is an original/default shop
  userId?: string; // Link shop to user
  createdAt?: string;
  updatedAt?: string;
  // Store multilingual data
  multilingualData?: {
    [languageCode: string]: {
      name: string;
      icon: string;
      color: string;
    };
  };
}