export interface StoreIcon {
  name: string;
  icon: string;
  label: string;
}

export interface IconColor {
  name: string;
  color: string;
  label: string;
}

// Base icons that are common across all languages - only generic icons, no store names
const baseStoreIcons: StoreIcon[] = [
  // Shopping & Retail
  { name: "shopping-cart", icon: "ShoppingCart", label: "Shopping Cart" },
  { name: "shopping-bag", icon: "ShoppingBag", label: "Shopping Bag" },
  { name: "shopping-basket", icon: "ShoppingBasket", label: "Basket" },
  { name: "store", icon: "Store", label: "Store" },
  { name: "building", icon: "Building", label: "Building" },
  { name: "building-2", icon: "Building2", label: "Mall" },
  { name: "package", icon: "Package", label: "Package" },
  { name: "receipt", icon: "Receipt", label: "Receipt" },
  
  // Home & Living
  { name: "home", icon: "Home", label: "Home" },
  { name: "sofa", icon: "Sofa", label: "Furniture" },
  { name: "bed", icon: "Bed", label: "Bedroom" },
  { name: "lamp", icon: "Lamp", label: "Lighting" },
  { name: "lightbulb", icon: "Lightbulb", label: "Light" },
  
  // Food & Dining
  { name: "coffee", icon: "Coffee", label: "Coffee" },
  { name: "utensils", icon: "Utensils", label: "Restaurant" },
  { name: "pizza", icon: "Pizza", label: "Pizza" },
  { name: "wine", icon: "Wine", label: "Alcohol" },
  { name: "cake", icon: "Cake", label: "Desserts" },
  { name: "ice-cream", icon: "IceCream", label: "Ice Cream" },
  { name: "cookie", icon: "Cookie", label: "Cookies" },
  { name: "donut", icon: "Donut", label: "Donuts" },
  { name: "croissant", icon: "Croissant", label: "Bakery" },
  { name: "sandwich", icon: "Sandwich", label: "Sandwich" },
  { name: "salad", icon: "Salad", label: "Salad" },
  { name: "soup", icon: "Soup", label: "Soup" },
  { name: "popcorn", icon: "Popcorn", label: "Snacks" },
  { name: "candy", icon: "Candy", label: "Candy" },
  
  // Fruits & Vegetables
  { name: "apple", icon: "Apple", label: "Fruits" },
  { name: "carrot", icon: "Carrot", label: "Vegetables" },
  { name: "banana", icon: "Banana", label: "Banana" },
  { name: "grape", icon: "Grape", label: "Grapes" },
  { name: "cherry", icon: "Cherry", label: "Cherries" },
  { name: "bean", icon: "Bean", label: "Beans" },
  { name: "wheat", icon: "Wheat", label: "Grains" },
  
  // Meat & Dairy
  { name: "beef", icon: "Beef", label: "Meat" },
  { name: "fish", icon: "Fish", label: "Fish" },
  { name: "egg", icon: "Egg", label: "Eggs" },
  { name: "milk", icon: "Milk", label: "Dairy" },
  
  // Transportation
  { name: "car", icon: "Car", label: "Car" },
  { name: "fuel", icon: "Fuel", label: "Gas Station" },
  { name: "plane", icon: "Plane", label: "Travel" },
  { name: "bike", icon: "Bike", label: "Bike" },
  { name: "bus", icon: "Bus", label: "Bus" },
  { name: "train", icon: "Train", label: "Train" },
  { name: "truck", icon: "Truck", label: "Truck" },
  
  // Health & Beauty
  { name: "pill", icon: "Pill", label: "Pharmacy" },
  { name: "heart", icon: "Heart", label: "Health" },
  { name: "scissors", icon: "Scissors", label: "Salon" },
  { name: "stethoscope", icon: "Stethoscope", label: "Medical" },
  
  // Fashion & Clothing
  { name: "shirt", icon: "Shirt", label: "Clothing" },
  { name: "gem", icon: "Gem", label: "Jewelry" },
  { name: "glasses", icon: "Glasses", label: "Eyewear" },
  { name: "watch", icon: "Watch", label: "Watch" },
  { name: "crown", icon: "Crown", label: "Luxury" },
  
  // Electronics & Technology
  { name: "laptop", icon: "Laptop", label: "Electronics" },
  { name: "smartphone", icon: "Smartphone", label: "Mobile" },
  { name: "camera", icon: "Camera", label: "Photo" },
  { name: "tablet", icon: "Tablet", label: "Tablet" },
  { name: "monitor", icon: "Monitor", label: "Monitor" },
  { name: "headphones", icon: "Headphones", label: "Audio" },
  { name: "wifi", icon: "Wifi", label: "Internet" },
  { name: "battery", icon: "Battery", label: "Battery" },
  { name: "cable", icon: "Cable", label: "Cables" },
  
  // Entertainment & Leisure
  { name: "music", icon: "Music", label: "Music" },
  { name: "film", icon: "Film", label: "Movies" },
  { name: "book", icon: "Book", label: "Books" },
  { name: "trophy", icon: "Trophy", label: "Sports" },
  { name: "gamepad", icon: "Gamepad2", label: "Gaming" },
  { name: "dumbbell", icon: "Dumbbell", label: "Fitness" },
  
  // Tools & Hardware
  { name: "wrench", icon: "Wrench", label: "Hardware" },
  { name: "hammer", icon: "Hammer", label: "Tools" },
  
  // Garden & Nature
  { name: "flower", icon: "Flower", label: "Garden" },
  { name: "tree-pine", icon: "TreePine", label: "Plants" },
  { name: "tree-deciduous", icon: "TreeDeciduous", label: "Trees" },
  { name: "leaf", icon: "Leaf", label: "Nature" },
  
  // Weather
  { name: "sun", icon: "Sun", label: "Sun" },
  { name: "moon", icon: "Moon", label: "Moon" },
  { name: "cloud", icon: "Cloud", label: "Weather" },
  { name: "umbrella", icon: "Umbrella", label: "Rain" },
  { name: "snowflake", icon: "Snowflake", label: "Snow" },
  
  // Business & Office
  { name: "briefcase", icon: "Briefcase", label: "Business" },
  { name: "calculator", icon: "Calculator", label: "Finance" },
  { name: "pen-tool", icon: "PenTool", label: "Writing" },
  { name: "file-text", icon: "FileText", label: "Documents" },
  { name: "folder", icon: "Folder", label: "Files" },
  
  // Money & Finance
  { name: "banknote", icon: "Banknote", label: "Cash" },
  { name: "credit-card", icon: "CreditCard", label: "Card" },
  { name: "coins", icon: "Coins", label: "Coins" },
  { name: "wallet", icon: "Wallet", label: "Wallet" },
  
  // Services & Others
  { name: "gift", icon: "Gift", label: "Gifts" },
  { name: "key", icon: "Key", label: "Services" },
  { name: "star", icon: "Star", label: "Premium" },
  { name: "target", icon: "Target", label: "Target" },
  { name: "hotel", icon: "Hotel", label: "Hotel" },
  { name: "shield", icon: "Shield", label: "Security" },
  { name: "zap", icon: "Zap", label: "Energy" },
  { name: "droplet", icon: "Droplet", label: "Water" },
  { name: "flame", icon: "Flame", label: "Fire" },
  { name: "bell", icon: "Bell", label: "Notifications" },
  { name: "mail", icon: "Mail", label: "Mail" },
  { name: "phone", icon: "Phone", label: "Phone" },
  { name: "map-pin", icon: "MapPin", label: "Location" },
  { name: "clock", icon: "Clock", label: "Time" },
  { name: "calendar", icon: "Calendar", label: "Calendar" },
  { name: "compass", icon: "Compass", label: "Navigation" },
  { name: "flag", icon: "Flag", label: "Flag" },
  { name: "bookmark", icon: "Bookmark", label: "Bookmark" },
  { name: "tag", icon: "Tag", label: "Tag" },
  { name: "link", icon: "Link", label: "Link" },
  { name: "search", icon: "Search", label: "Search" },
  { name: "settings", icon: "Settings", label: "Settings" },
  { name: "user", icon: "User", label: "User" },
  { name: "users", icon: "Users", label: "Users" },
  { name: "graduation-cap", icon: "GraduationCap", label: "Education" },
  { name: "palette", icon: "Palette", label: "Art" },
  { name: "paintbrush", icon: "Paintbrush2", label: "Paint" },
  { name: "aperture", icon: "Aperture", label: "Camera" },
  { name: "beaker", icon: "Beaker", label: "Science" },
  { name: "badge", icon: "Badge", label: "Badge" },
  { name: "locate", icon: "Locate", label: "GPS" },
  { name: "check", icon: "Check", label: "Check" },
  { name: "grid", icon: "Grid", label: "Grid" },
  
  // Animals & Pets
  { name: "cat", icon: "Cat", label: "Cat" },
  { name: "dog", icon: "Dog", label: "Dog" },
  { name: "bird", icon: "Bird", label: "Bird" },
  { name: "rabbit", icon: "Rabbit", label: "Rabbit" },
  { name: "bone", icon: "Bone", label: "Pet Food" },
];

// Comprehensive color palette organized by color families (color wheel order)
const baseIconColors: IconColor[] = [
  // Reds (0-30 degrees)
  { name: "red", color: "#FF0000", label: "Red" },
  { name: "crimson", color: "#DC143C", label: "Crimson" },
  { name: "fire-red", color: "#FF2500", label: "Fire Red" },
  { name: "dark-red", color: "#8B0000", label: "Dark Red" },
  { name: "maroon", color: "#800000", label: "Maroon" },
  { name: "burgundy", color: "#800020", label: "Burgundy" },
  { name: "wine", color: "#722F37", label: "Wine" },
  { name: "cherry", color: "#DE3163", label: "Cherry" },
  
  // Red-Oranges (30-45 degrees)
  { name: "orange-red", color: "#FF4500", label: "Orange Red" },
  { name: "red-orange", color: "#FF5349", label: "Red Orange" },
  { name: "vermillion", color: "#E34234", label: "Vermillion" },
  { name: "coral", color: "#FF7F50", label: "Coral" },
  { name: "salmon", color: "#FA8072", label: "Salmon" },
  { name: "tomato", color: "#FF6347", label: "Tomato" },
  { name: "light-coral", color: "#F08080", label: "Light Coral" },
  { name: "dark-salmon", color: "#E9967A", label: "Dark Salmon" },
  
  // Oranges (45-60 degrees)
  { name: "orange", color: "#FF8C00", label: "Orange" },
  { name: "dark-orange", color: "#FF6600", label: "Dark Orange" },
  { name: "burnt-orange", color: "#CC5500", label: "Burnt Orange" },
  { name: "tangerine", color: "#FF8243", label: "Tangerine" },
  { name: "peach", color: "#FFCBA4", label: "Peach" },
  { name: "apricot", color: "#FBCEB1", label: "Apricot" },
  { name: "papaya", color: "#FFEFD5", label: "Papaya" },
  { name: "sandy-brown", color: "#F4A460", label: "Sandy Brown" },
  
  // Yellow-Oranges (60-75 degrees)
  { name: "gold", color: "#FFD700", label: "Gold" },
  { name: "amber", color: "#FFBF00", label: "Amber" },
  { name: "goldenrod", color: "#DAA520", label: "Goldenrod" },
  { name: "dark-goldenrod", color: "#B8860B", label: "Dark Goldenrod" },
  { name: "orange-yellow", color: "#FFCC00", label: "Orange Yellow" },
  { name: "saffron", color: "#F4C430", label: "Saffron" },
  { name: "mustard", color: "#FFDB58", label: "Mustard" },
  { name: "honey", color: "#FFC30B", label: "Honey" },
  
  // Yellows (75-90 degrees)
  { name: "yellow", color: "#FFFF00", label: "Yellow" },
  { name: "lemon", color: "#FFF700", label: "Lemon" },
  { name: "bright-yellow", color: "#FFFF33", label: "Bright Yellow" },
  { name: "canary", color: "#FFFF99", label: "Canary" },
  { name: "light-yellow", color: "#FFFFE0", label: "Light Yellow" },
  { name: "cream", color: "#FFFDD0", label: "Cream" },
  { name: "ivory", color: "#FFFFF0", label: "Ivory" },
  { name: "beige", color: "#F5F5DC", label: "Beige" },
  
  // Yellow-Greens (90-120 degrees)
  { name: "lime", color: "#32CD32", label: "Lime" },
  { name: "chartreuse", color: "#7FFF00", label: "Chartreuse" },
  { name: "lawn-green", color: "#7CFC00", label: "Lawn Green" },
  { name: "yellow-green", color: "#9ACD32", label: "Yellow Green" },
  { name: "olive", color: "#808000", label: "Olive" },
  { name: "olive-drab", color: "#6B8E23", label: "Olive Drab" },
  { name: "dark-olive", color: "#556B2F", label: "Dark Olive" },
  { name: "spring-green", color: "#00FF7F", label: "Spring Green" },
  
  // Greens (120-150 degrees)
  { name: "green", color: "#008000", label: "Green" },
  { name: "forest-green", color: "#228B22", label: "Forest Green" },
  { name: "dark-green", color: "#006400", label: "Dark Green" },
  { name: "emerald", color: "#50C878", label: "Emerald" },
  { name: "mint", color: "#98FB98", label: "Mint" },
  { name: "light-green", color: "#90EE90", label: "Light Green" },
  { name: "pale-green", color: "#98FB98", label: "Pale Green" },
  { name: "sea-green", color: "#2E8B57", label: "Sea Green" },
  
  // Blue-Greens/Teals (150-180 degrees)
  { name: "teal", color: "#008080", label: "Teal" },
  { name: "dark-teal", color: "#004D4D", label: "Dark Teal" },
  { name: "medium-sea-green", color: "#3CB371", label: "Medium Sea Green" },
  { name: "light-sea-green", color: "#20B2AA", label: "Light Sea Green" },
  { name: "dark-sea-green", color: "#8FBC8F", label: "Dark Sea Green" },
  { name: "aquamarine", color: "#7FFFD4", label: "Aquamarine" },
  { name: "medium-aquamarine", color: "#66CDAA", label: "Medium Aquamarine" },
  { name: "turquoise", color: "#40E0D0", label: "Turquoise" },
  
  // Cyans (180-210 degrees)
  { name: "cyan", color: "#00FFFF", label: "Cyan" },
  { name: "aqua", color: "#00CED1", label: "Aqua" },
  { name: "dark-turquoise", color: "#00CED1", label: "Dark Turquoise" },
  { name: "medium-turquoise", color: "#48D1CC", label: "Medium Turquoise" },
  { name: "pale-turquoise", color: "#AFEEEE", label: "Pale Turquoise" },
  { name: "light-cyan", color: "#E0FFFF", label: "Light Cyan" },
  { name: "powder-blue", color: "#B0E0E6", label: "Powder Blue" },
  { name: "cadet-blue", color: "#5F9EA0", label: "Cadet Blue" },
  
  // Light Blues (210-240 degrees)
  { name: "light-blue", color: "#ADD8E6", label: "Light Blue" },
  { name: "sky-blue", color: "#87CEEB", label: "Sky Blue" },
  { name: "light-sky-blue", color: "#87CEFA", label: "Light Sky Blue" },
  { name: "deep-sky-blue", color: "#00BFFF", label: "Deep Sky Blue" },
  { name: "dodger-blue", color: "#1E90FF", label: "Dodger Blue" },
  { name: "cornflower", color: "#6495ED", label: "Cornflower" },
  { name: "steel-blue", color: "#4682B4", label: "Steel Blue" },
  { name: "light-steel-blue", color: "#B0C4DE", label: "Light Steel Blue" },
  
  // Blues (240-270 degrees)
  { name: "blue", color: "#0000FF", label: "Blue" },
  { name: "medium-blue", color: "#0000CD", label: "Medium Blue" },
  { name: "dark-blue", color: "#00008B", label: "Dark Blue" },
  { name: "navy", color: "#000080", label: "Navy" },
  { name: "midnight-blue", color: "#191970", label: "Midnight Blue" },
  { name: "royal-blue", color: "#4169E1", label: "Royal Blue" },
  { name: "blue-violet", color: "#8A2BE2", label: "Blue Violet" },
  { name: "slate-blue", color: "#6A5ACD", label: "Slate Blue" },
  
  // Purples (270-300 degrees)
  { name: "purple", color: "#800080", label: "Purple" },
  { name: "dark-violet", color: "#9400D3", label: "Dark Violet" },
  { name: "dark-orchid", color: "#9932CC", label: "Dark Orchid" },
  { name: "medium-orchid", color: "#BA55D3", label: "Medium Orchid" },
  { name: "violet", color: "#8A2BE2", label: "Violet" },
  { name: "medium-purple", color: "#9370DB", label: "Medium Purple" },
  { name: "dark-slate-blue", color: "#483D8B", label: "Dark Slate Blue" },
  { name: "medium-slate-blue", color: "#7B68EE", label: "Medium Slate Blue" },
  
  // Magentas/Pinks (300-330 degrees)
  { name: "magenta", color: "#FF00FF", label: "Magenta" },
  { name: "fuchsia", color: "#FF00FF", label: "Fuchsia" },
  { name: "deep-magenta", color: "#CC0099", label: "Deep Magenta" },
  { name: "dark-magenta", color: "#8B008B", label: "Dark Magenta" },
  { name: "orchid", color: "#DA70D6", label: "Orchid" },
  { name: "plum", color: "#DDA0DD", label: "Plum" },
  { name: "thistle", color: "#D8BFD8", label: "Thistle" },
  { name: "lavender", color: "#E6E6FA", label: "Lavender" },
  
  // Pinks (330-360 degrees)
  { name: "pink", color: "#FF69B4", label: "Pink" },
  { name: "hot-pink", color: "#FF1493", label: "Hot Pink" },
  { name: "deep-pink", color: "#FF20B2", label: "Deep Pink" },
  { name: "medium-violet-red", color: "#C71585", label: "Medium Violet Red" },
  { name: "pale-violet-red", color: "#DB7093", label: "Pale Violet Red" },
  { name: "light-pink", color: "#FFB6C1", label: "Light Pink" },
  { name: "misty-rose", color: "#FFE4E1", label: "Misty Rose" },
  { name: "rose", color: "#FF007F", label: "Rose" },
  
  // Neutrals & Grays
  { name: "black", color: "#000000", label: "Black" },
  { name: "dark-gray", color: "#2F2F2F", label: "Dark Gray" },
  { name: "dim-gray", color: "#696969", label: "Dim Gray" },
  { name: "gray", color: "#808080", label: "Gray" },
  { name: "dark-slate-gray", color: "#2F4F4F", label: "Dark Slate Gray" },
  { name: "slate-gray", color: "#708090", label: "Slate Gray" },
  { name: "light-slate-gray", color: "#778899", label: "Light Slate Gray" },
  { name: "light-gray", color: "#D3D3D3", label: "Light Gray" },
  { name: "silver", color: "#C0C0C0", label: "Silver" },
  { name: "gainsboro", color: "#DCDCDC", label: "Gainsboro" },
  { name: "white-smoke", color: "#F5F5F5", label: "White Smoke" },
  { name: "white", color: "#FFFFFF", label: "White" },
  
  // Browns & Earth Tones
  { name: "brown", color: "#A52A2A", label: "Brown" },
  { name: "saddle-brown", color: "#8B4513", label: "Saddle Brown" },
  { name: "sienna", color: "#A0522D", label: "Sienna" },
  { name: "chocolate", color: "#D2691E", label: "Chocolate" },
  { name: "peru", color: "#CD853F", label: "Peru" },
  { name: "tan", color: "#D2B48C", label: "Tan" },
  { name: "wheat", color: "#F5DEB3", label: "Wheat" },
  { name: "burlywood", color: "#DEB887", label: "Burlywood" },
];

// Language-specific shop icon mappings for auto-suggestion
const languageSpecificShopMappings: Record<string, Record<string, string>> = {
  en: {
    "Walmart": "Store",
    "Target": "Target",
    "Costco": "Building",
    "Amazon": "Package",
    "Starbucks": "Coffee",
    "McDonald's": "Utensils",
    "Best Buy": "Laptop",
    "Home Depot": "Wrench",
    "CVS": "Pill",
    "Walgreens": "Pill",
  },
  cs: {
    "Albert": "ShoppingCart",
    "Lidl": "ShoppingBag", 
    "Kaufland": "Store",
    "Tesco": "ShoppingCart",
    "Billa": "ShoppingBag",
    "Penny Market": "Store",
    "Globus": "Building",
    "COOP": "Store",
    "Rossmann": "Pill",
    "DM": "Pill",
    "IKEA": "Home",
    "Alza": "Laptop",
    "Datart": "Laptop",
    "McDonald's": "Utensils",
    "KFC": "Utensils",
    "Starbucks": "Coffee",
  },
  sk: {
    "Tesco": "ShoppingCart",
    "Kaufland": "Store",
    "Lidl": "ShoppingBag",
    "Billa": "ShoppingBag",
    "COOP Jednota": "Store",
    "Fresh": "Store",
    "Kraj": "Store",
    "Rossmann": "Pill",
    "DM": "Pill",
    "IKEA": "Home",
    "Alza": "Laptop",
    "Datart": "Laptop",
    "McDonald's": "Utensils",
    "KFC": "Utensils",
    "Starbucks": "Coffee",
  },
  de: {
    "REWE": "ShoppingCart",
    "EDEKA": "ShoppingCart",
    "Lidl": "ShoppingBag",
    "Aldi": "ShoppingBag",
    "Kaufland": "Store",
    "Real": "Building",
    "Netto": "Store",
    "Penny": "Store",
    "dm": "Pill",
    "Rossmann": "Pill",
    "Müller": "Pill",
    "MediaMarkt": "Laptop",
    "Saturn": "Laptop",
    "Conrad": "Laptop",
    "Karstadt": "Building",
    "Galeria Kaufhof": "Building",
    "H&M": "Shirt",
    "C&A": "Shirt",
    "Zara": "Shirt",
    "Bauhaus": "Wrench",
    "OBI": "Wrench",
    "Hornbach": "Wrench",
    "IKEA": "Home",
    "McDonald's": "Utensils",
    "Burger King": "Utensils",
    "KFC": "Utensils",
    "Starbucks": "Coffee",
    "Shell": "Fuel",
    "Aral": "Fuel",
    "Esso": "Fuel",
    "Decathlon": "Trophy",
    "Intersport": "Trophy",
  },
  pl: {
    "Biedronka": "ShoppingCart",
    "Żabka": "Store",
    "Carrefour": "Building",
    "Tesco": "ShoppingCart",
    "Auchan": "Building",
    "Lidl": "ShoppingBag",
    "Kaufland": "Store",
    "Netto": "Store",
    "Rossmann": "Pill",
    "Hebe": "Pill",
    "Super-Pharm": "Pill",
    "Media Markt": "Laptop",
    "RTV Euro AGD": "Laptop",
    "x-kom": "Laptop",
    "H&M": "Shirt",
    "Reserved": "Shirt",
    "C&A": "Shirt",
    "Zara": "Shirt",
    "Castorama": "Wrench",
    "Leroy Merlin": "Wrench",
    "OBI": "Wrench",
    "IKEA": "Home",
    "McDonald's": "Utensils",
    "KFC": "Utensils",
    "Burger King": "Utensils",
    "Starbucks": "Coffee",
    "Orlen": "Fuel",
    "BP": "Fuel",
    "Shell": "Fuel",
    "Decathlon": "Trophy",
    "Intersport": "Trophy",
    "Empik": "Book",
  },
};

// Export functions to get language-specific data
export function getStoreIconsForLanguage(language: string): StoreIcon[] {
  return baseStoreIcons;
}

export function getIconColorsForLanguage(language: string): IconColor[] {
  return baseIconColors;
}

export function getShopIconMappingForLanguage(language: string): Record<string, string> {
  return languageSpecificShopMappings[language] || languageSpecificShopMappings.en;
}

// Legacy exports for backward compatibility
export const storeIcons = baseStoreIcons;
export const iconColors = baseIconColors;
export const shopIconMapping = languageSpecificShopMappings.en;