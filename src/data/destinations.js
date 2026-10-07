// Primary Hero & Destination Photographs
import hero1Mountain from '../assets/images/hero_travel_mountain_1791321293656.jpg'
import hero2Beach from '../assets/images/hero_2_beach.jpg'
import hero3Palace from '../assets/images/hero_3_palace.jpg'
import hero4Europe from '../assets/images/hero_4_europe.jpg'
import hero5Greenery from '../assets/images/hero_5_greenery.jpg'
import hero6Shrine from '../assets/images/hero_6_shrine.jpg'
import hero7Lake from '../assets/images/hero_7_lake.jpg'
import hero8Sunset from '../assets/images/hero_8_sunset.jpg'

// Authentic Single High-Quality Destination Images
import goaImage from '../assets/images/dest_goa_beach_1791321310164.jpg'
import manaliImage from '../assets/images/dest_manali_mountain_1791321327088.jpg'
import jaipurImage from '../assets/images/dest_jaipur_palace_1791321340574.jpg'
import baliImage from '../assets/images/dest_bali_terrace_1791321355031.jpg'
import parisImage from '../assets/images/dest_paris_city_1791321375671.jpg'
import tokyoImage from '../assets/images/dest_tokyo_city_1791321400795.jpg'

export const heroTravelImage = hero1Mountain

// Diverse cinematic hero photographs for continuous automatic hero slideshow
export const HERO_SLIDES = [
  {
    image: hero1Mountain,
    alt: 'Majestic Himalayan snow peaks and scenic green mountain valley',
    location: 'Himalayas, India',
    vibe: 'Mountain Solitude',
  },
  {
    image: hero2Beach,
    alt: 'Pristine turquoise tropical beach with golden sands and gentle surf',
    location: 'Tropical Coastline',
    vibe: 'Ocean Serenity',
  },
  {
    image: hero3Palace,
    alt: 'Historic royal palace courtyards with majestic arches and marble reflection',
    location: 'Heritage Architecture',
    vibe: 'Royal Heritage',
  },
  {
    image: hero4Europe,
    alt: 'Historic European city along a tranquil river under golden evening light',
    location: 'Parisian Skyline',
    vibe: 'Timeless Culture',
  },
  {
    image: hero5Greenery,
    alt: 'Lush tropical rice terraces and cascading palm groves',
    location: 'Bali, Indonesia',
    vibe: 'Lush Nature',
  },
  {
    image: hero6Shrine,
    alt: 'Historic Japanese pagoda framed by spring blossoms under twilight',
    location: 'Kyoto, Japan',
    vibe: 'Ancient Shrines',
  },
  {
    image: hero7Lake,
    alt: 'Pristine alpine lake reflecting jagged peaks and forest pine wilderness',
    location: 'Alpine Lake & Peaks',
    vibe: 'Wilderness Escape',
  },
  {
    image: hero8Sunset,
    alt: 'Dramatic ocean sunset over rocky coastal cliffs and warm horizon',
    location: 'Coastal Horizons',
    vibe: 'Sunset Horizons',
  },
]

// Curated destinations with single authentic static photographs
export const POPULAR_DESTINATIONS = [
  {
    id: 'goa',
    name: 'Goa',
    location: 'India',
    descriptor: 'Beaches & coastal life',
    image: goaImage,
    alt: 'Pristine tropical beach in Goa with golden sand and coconut palms',
  },
  {
    id: 'manali',
    name: 'Manali',
    location: 'India',
    descriptor: 'Snow peaks & pine valleys',
    image: manaliImage,
    alt: 'Scenic mountain valley in Manali with pine trees and Himalayan snow peaks',
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    location: 'India',
    descriptor: 'Royal palaces & heritage',
    image: jaipurImage,
    alt: 'Historic pink sandstone royal palace architecture in Jaipur',
  },
  {
    id: 'bali',
    name: 'Bali',
    location: 'Indonesia',
    descriptor: 'Tropical terraces & temples',
    image: baliImage,
    alt: 'Lush green cascading terraced rice fields in Bali with tropical palms',
  },
  {
    id: 'paris',
    name: 'Paris',
    location: 'France',
    descriptor: 'Art, architecture & cafés',
    image: parisImage,
    alt: 'Iconic view of Eiffel Tower and historic Parisian architecture along the river',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    location: 'Japan',
    descriptor: 'Neon skylines & ancient shrines',
    image: tokyoImage,
    alt: 'Scenic view of Mount Fuji and traditional pagoda in Japan',
  },
]

export function getDestinationImage(destinationName = '') {
  if (!destinationName || typeof destinationName !== 'string') {
    return {
      image: hero1Mountain,
      alt: 'Scenic mountain landscape and travel destination',
    }
  }

  const query = destinationName.toLowerCase().trim()

  if (query.includes('goa')) {
    return {
      image: goaImage,
      alt: 'Pristine tropical beach in Goa with golden sand and coconut palms',
    }
  }
  if (query.includes('manali')) {
    return {
      image: manaliImage,
      alt: 'Scenic mountain valley in Manali with pine trees and Himalayan snow peaks',
    }
  }
  if (query.includes('jaipur')) {
    return {
      image: jaipurImage,
      alt: 'Historic pink sandstone royal palace architecture in Jaipur',
    }
  }
  if (query.includes('bali')) {
    return {
      image: baliImage,
      alt: 'Lush green cascading terraced rice fields in Bali with tropical palms',
    }
  }
  if (query.includes('paris')) {
    return {
      image: parisImage,
      alt: 'Iconic view of Eiffel Tower and historic Parisian architecture along the river',
    }
  }
  if (query.includes('tokyo')) {
    return {
      image: tokyoImage,
      alt: 'Scenic view of Mount Fuji and traditional pagoda in Japan',
    }
  }

  return {
    image: hero1Mountain,
    alt: `Scenic travel destination landscape for ${destinationName}`,
  }
}
