// Tamil translation dictionary for food items
// Maps English names to Tamil names

const ENGLISH_TO_TAMIL = {
  // Curries
  'sambar': 'சாம்பார்',
  'rasam': 'ரசம்',
  'vaghali': 'வாகளி',
  'puli kulambu': 'புளி குழம்பு',
  'mor kulambu': 'மோர் குழம்பு',
  'kosambi': 'கொசம்பி',
  'avial': 'அவியல்',
  'koottu': 'கூட்டு',
  'poriyal': 'பொரியல்',
  'curry': 'குழம்பு',
  'gravy': 'கிரேவி',
  'chicken curry': 'சிக்கன் குழம்பு',
  'chicken gravy': 'சிக்கன் கீரேவி',
  'fish curry': 'மீன் குழம்பு',
  'vegetable curry': 'காய்கறி குழம்பு',
  
  // Extra curries
  'extra kulambu': 'எக்ஸ்ட்ரா குழம்பு',
  'extra rasam': 'எக்ஸ்ட்ரா ரசம்',
  'extra avial': 'எக்ஸ்ட்ரா அவியல்',
  'extra koottu': 'எக்ஸ்ட்ரா கூட்டு',
  
  // Side dishes
  'kadaisal': 'கடைசல்',
  'thuvayal': 'துவயல்',
  'inji puli': 'இஞ்சி புளி',
  'ginger puli': 'இஞ்சி புளி',
  'cauliflower chilli': 'காலிப்பளவர் சில்லி',
  'mushroom chilli': 'காளான் சில்லி',
  'mushroom gravy': 'காளான் கீரேவி',
  'paneer butter masala': 'பன்னீர் பட்டர் மசாலா',

  // Rice dishes
  'curd rice': 'தயிர் சாதம்',
  'lemon rice': 'எலுமிச்சை சாதம்',
  'butter rice': 'வெண்ணெய் சாதம்',
  'coconut rice': 'தேங்காய் சாதம்',
  'ghee rice': 'நெய் சாதம்',
  'biryani': 'பிரியாணி',
  'chicken biryani': 'சிக்கன் பிரியாணி',
  'mushroom biryani': 'காளான் பிரியாணி',
  'fried rice': 'வறுத்த சாதம்',
  'rice': 'சாதம்',
  'pulao': 'புலாவ்',
  'tamarind rice': 'புளிப் சாதம்',
  'alavu saappadu': 'அளவு சாப்பாடு',
  'meals': 'சாப்பாடு',

  // Breads
  'chappati': 'சப்பாத்தி',
  'roti': 'ரொட்டி',
  'ghee puri': 'நெய் பூரி',
  'puri': 'பூரி',
  'paratha': 'பரோட்டா',
  'naan': 'நான்',
  'dosa': 'டோசை',
  'idli': 'இட்லி',
  'idiyappam': 'இடியாப்பம்',
  'pongal': 'பொங்கல்',
  'santhakai': 'சந்தகை',
  'kozhukattai': 'கொழுக்கட்டை',
  'paniyaram': 'பணியாரம்',
  'uttapam': 'உத்தப்பம்',
  // Breakfast items
  'tiffin sambar': 'டிபன் சாம்பார்',
  'veg kuruma': 'வெஜ் குருமா',
  'chenna masala': 'சென்னா மசாலா',
  'tomato thokku': 'தக்காளி தொக்கு',
  'chutney 20': 'சட்னி 20',
  'chutney 25': 'சட்னி 25',
  // Sweet dishes
  'kesari': 'கேசரி',
  'payasam': 'பாயாசம்',
  'badusha': 'பாதுஷா',
  // Proteins
  'chicken': 'சிக்கன்',
  'fish': 'மீன்',
  'mutton': 'மாட்டு இறைச்சி',
  'beef': 'மாட்டு இறைச்சி',
  'prawn': 'இறால்',
  'shrimp': 'இறால்',
  'egg': 'முட்டை',
  'tofu': 'டோஃபு',
  'paneer': 'பனீர்',
  
  // Non-veg items
  'egg curry': 'முட்டை குழம்பு',
  'egg gravy': 'முட்டை கீரேவி',
  'chicken curry': 'சிக்கன் குழம்பு',
  'chicken gravy': 'சிக்கன் கீரேவி',

  'nattu kozhi kulambu': 'நாட்டுக்கோழி குழம்பு',
  'nattu kozhi gravy': 'நாட்டுக்கோழி கீரேவி',
  'nattu kozhi soup': 'நாட்டுக்கோழி கூப்',
  'mutton curry': 'மட்டன் குழம்பு',
  'mutton gravy': 'மட்டன் கீரேவி',
  'kudal gravy': 'குடல் கீரேவி',
  'kudal fry': 'குடல் பிரை',
  
  // Fish items
  'mathi fish curry': 'மத்தி மீன் குழம்பு',
  'katla fish curry': 'கட்லா மீன் குழம்பு',
  'parai fish curry': 'பாரை மீன் குழம்பு',
  'mandai fish curry': 'மண்டை மீன் குழம்பு',
  'karuvaatu kulambu': 'கருவாட்டு குழம்பு',
  'karuvaatu thokku': 'கருவாட்டு தொக்கு',
  'mathi fry': 'மத்தி பிரை',
  'parai fry': 'பாரை பிரை',
  'fish chilli': 'மீன் சில்லி',
  
  // Crab
  'crab curry': 'நண்டு குழம்பு',
  'crab gravy': 'நண்டு கிரேவி',
  'nandu curry': 'நண்டு குழம்பு',
  'nandu gravy': 'நண்டு கிரேவி',
  
  // Special chicken
  'chicken chettinad gravy': 'சிக்கன் செட்டிநாடு கிரேவி',
  'chicken chettinad fry': 'சிக்கன் செட்டிநாடு பிரை',
  'pepper chicken fry': 'பெப்பர் சிக்கன் பிரை',
  'pepper chicken gravy': 'பெப்பர் சிக்கன் கிரேவி',
  'boneless chilli': 'போன்லெஸ் சில்லி',
  'bone chilli chicken': 'போன் சில்லி சிக்கன்',
  
  // Duck
  'duck fry': 'வாத்து பிரை',
  'duck gravy': 'வாத்து கிரேவி',
  'vaathu fry': 'வாத்து பிரை',
  'vaathu gravy': 'வாத்து கிரேவி',
  
  // Combo meals
  'non-veg mini combo': 'அசைவ மினி காம்போ',
  'fish mini combo': 'மீன் மினி காம்போ',
  'asaiva mini combo': 'அசைவ மினி காம்போ',
  'meen mini combo': 'மீன் மினி காம்போ',

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
 * Matches both Tamil and English variations with partial/fuzzy matching
 * Examples:
 *   "chi" matches "chicken"
 *   "vaa" matches "vagai", items with "vaa" in name
 *   "sam" matches "sambar"
 * @param {string} searchQuery - Search term (English or Tamil) - partial allowed
 * @param {string} itemName - Item name to search in
 * @returns {boolean} - True if item matches search
 */
export function searchWithTanglish(searchQuery, itemName) {
  if (!searchQuery || !itemName) return false;

  const query = searchQuery.trim().toLowerCase();
  const item = itemName.toLowerCase();

  // 1. Direct partial match (case-insensitive substring)
  if (item.includes(query)) return true;

  // 2. If query is English/Tanglish - try to match against dictionary keys
  if (!isTamil(query)) {
    // Check all English keys in dictionary for partial matches
    for (const [english, tamil] of Object.entries(ENGLISH_TO_TAMIL)) {
      // Partial match: if query is the start of an English word
      if (english.includes(query) || english.startsWith(query)) {
        if (item.includes(tamil.toLowerCase())) {
          return true;
        }
      }
    }

    // Convert partial English to Tamil and check
    const tamilVersion = convertToTamil(query);
    if (tamilVersion !== query && item.includes(tamilVersion.toLowerCase())) {
      return true;
    }
  }

  // 3. For Tamil queries, check if any Tamil word in dictionary starts with it
  if (isTamil(query)) {
    for (const [english, tamil] of Object.entries(ENGLISH_TO_TAMIL)) {
      if (tamil.toLowerCase().includes(query)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Converts Tamil food name to English
 * If already English, returns as-is
 * @param {string} text - Tamil or English text
 * @returns {string} - English text
 */
export function convertToEnglish(text) {
  if (!text) return '';

  const trimmedText = text.trim();

  // Check if it's already English (no Tamil Unicode characters)
  if (!/[\u0B80-\u0BFF]/.test(text)) {
    return text; // Already English, return as-is
  }

  // Create reverse lookup (Tamil to English)
  const TAMIL_TO_ENGLISH = Object.entries(ENGLISH_TO_TAMIL).reduce((acc, [english, tamil]) => {
    acc[tamil] = english;
    return acc;
  }, {});

  // Check for exact match
  if (TAMIL_TO_ENGLISH[trimmedText]) {
    return TAMIL_TO_ENGLISH[trimmedText];
  }

  // If no match found, return original text
  return text;
}

export default {
  convertToTamil,
  convertToEnglish,
  isTamil,
  searchWithTanglish,
  ENGLISH_TO_TAMIL,
};
