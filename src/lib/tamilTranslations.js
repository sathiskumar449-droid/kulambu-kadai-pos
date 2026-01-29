// Tamil translation dictionary for food items
// Maps English names to Tamil names

const ENGLISH_TO_TAMIL = {
  // Curries
  'sambar': 'சாம்பார்',
  'rasam': 'ரசம்',
  'vaghali': 'வாகளி',
  'puli kulambu': 'புளி குழம்பு',
  'kosambi': 'கொசம்பி',
  'avial': 'அவியல்',
  'koottu': 'கூட்டு',
  'curry': 'குழம்பு',
  'gravy': 'கிரேவி',
  'chicken curry': 'சிக்கன் குழம்பு',
  'chicken gravy': 'சிக்கன் கிரேவி',
  'fish curry': 'மீன் குழம்பு',
  'vegetable curry': 'காய்கறி குழம்பு',

  // Rice dishes
  'curd rice': 'தயிர் சாதம்',
  'lemon rice': 'எலுமிச்சை சாதம்',
  'butter rice': 'வெண்ணெய் சாதம்',
  'coconut rice': 'தேங்காய் சாதம்',
  'ghee rice': 'நெய் சாதம்',
  'biryani': 'பிரியாணி',
  'fried rice': 'வறுத்த சாதம்',
  'rice': 'சாதம்',
  'pulao': 'புலாவ்',
  'tamarind rice': 'புளிப் சாதம்',

  // Breads
  'chappati': 'சப்பாத்தி',
  'roti': 'ரொட்டி',
  'ghee puri': 'நெய் பூரி',
  'puri': 'பூரி',
  'paratha': 'பரோட்டா',
  'naan': 'நான்',
  'dosa': 'டோசை',
  'idli': 'இட்லி',
  'uttapam': 'உத்தப்பम்',

  // Proteins
  'chicken': 'சிக்கன்',
  'fish': 'மீன்',
  'mutton': 'ஆட்டு இறைச்சி',
  'beef': 'மாட்டு இறைச்சி',
  'prawn': 'இறால்',
  'shrimp': 'இறால்',
  'egg': 'முட்டை',
  'tofu': 'டோஃபு',
  'paneer': 'பனீர்',

  // Vegetables
  'potato': 'உருளைக்கிழங்கு',
  'carrot': 'கேரட்',
  'beans': 'பீன்ஸ்',
  'cabbage': 'முட்டைக்கோஸ்',
  'spinach': 'பசலை',
  'tomato': 'தக்காளி',
  'onion': 'வெங்காயம்',
  'garlic': 'பூண்டு',
  'ginger': 'இஞ்சி',
  'brinjal': 'கத்திரி',
  'gourd': 'பூசணி',
  'lady finger': 'பெண்டைக்காய்',

  // Dairy & Bases
  'curd': 'தயிர்',
  'yogurt': 'தயிர்',
  'milk': 'பால்',
  'butter': 'வெண்ணெய்',
  'ghee': 'நெய்',
  'cream': 'ஸ்ருயம்',

  // Condiments
  'pickle': 'ஆசார்',
  'chutney': 'சட்னி',
  'coconut chutney': 'தேங்காய் சட்னி',
  'mint chutney': 'புதினா சட்னி',

  // Beverages
  'coffee': 'காபி',
  'tea': 'தேநீர்',
  'juice': 'பழத்தெள்ளு',
  'lassi': 'லஸ்ஸி',
  'buttermilk': 'மோர்',
  'water': 'நீர்',

  // Desserts
  'payasam': 'பாயசம்',
  'kheer': 'பாயசம்',
  'halwa': 'ஹலுவா',
  'jaggery': 'வெல்லப்பாகு',
  'sweet': 'இனிப்பு',

  // Misc
  'combo': 'பொதிசை',
  'meal': 'சாப்பாடு',
  'thali': 'தாளி',
  'platter': 'தாளி',
  'special': 'சிறப்பு',
};

/**
 * Converts English food name to Tamil
 * If already Tamil, returns as-is
 * @param {string} text - English or Tamil text
 * @returns {string} - Tamil text
 */
export function convertToTamil(text) {
  if (!text) return '';

  const trimmedText = text.trim().toLowerCase();

  // Check if it's already Tamil (contains Tamil Unicode characters)
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return text; // Already Tamil, return as-is
  }

  // Check dictionary for exact matches
  if (ENGLISH_TO_TAMIL[trimmedText]) {
    return ENGLISH_TO_TAMIL[trimmedText];
  }

  // Check for multi-word matches (longest first to match "chicken gravy" before "chicken")
  const words = trimmedText.split(/\s+/);
  for (let i = words.length; i > 0; i--) {
    const phrase = words.slice(0, i).join(' ');
    if (ENGLISH_TO_TAMIL[phrase]) {
      const remaining = words.slice(i);
      const translation = ENGLISH_TO_TAMIL[phrase];
      if (remaining.length > 0) {
        const remainingTranslation = remaining
          .map(word => ENGLISH_TO_TAMIL[word] || word)
          .join(' ');
        return `${translation} ${remainingTranslation}`.trim();
      }
      return translation;
    }
  }

  // If no match found, return original text
  return text;
}

/**
 * Check if text is Tamil
 * @param {string} text
 * @returns {boolean}
 */
export function isTamil(text) {
  if (!text) return false;
  return /[\u0B80-\u0BFF]/.test(text);
}

/**
 * Search for items with Tanglish support
 * Matches both Tamil and English variations
 * @param {string} searchQuery - Search term (English or Tamil)
 * @param {string} itemName - Item name to search in
 * @returns {boolean} - True if item matches search
 */
export function searchWithTanglish(searchQuery, itemName) {
  if (!searchQuery || !itemName) return false;

  const query = searchQuery.trim().toLowerCase();
  const item = itemName.toLowerCase();

  // Direct match
  if (item.includes(query)) return true;

  // Check if query is English - convert to Tamil and check
  if (!isTamil(query)) {
    const tamilVersion = convertToTamil(query);
    if (tamilVersion !== query && item.includes(tamilVersion.toLowerCase())) {
      return true;
    }
  }

  // Check if any dictionary word matches
  for (const [english, tamil] of Object.entries(ENGLISH_TO_TAMIL)) {
    if ((query.includes(english) || query === english) && item.includes(tamil.toLowerCase())) {
      return true;
    }
  }

  return false;
}

export default {
  convertToTamil,
  isTamil,
  searchWithTanglish,
  ENGLISH_TO_TAMIL,
};
