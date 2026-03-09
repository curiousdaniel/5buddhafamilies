import type { FamilyCode } from '../types'

export interface FamilyImages {
  buddhaImage: string
  buddhaName: string
  buddhaWisdom: string
  luminousKingImage: string
  luminousKingName: string
  luminousKingSanskrit: string
}

/** Colors for glow/border effects on imagery (from iconographic tradition) */
export const FAMILY_IMAGE_COLORS: Record<FamilyCode, string> = {
  buddha: '#E8E4DC',
  vajra: '#1B3A6B',
  ratna: '#D4A017',
  padma: '#B22222',
  karma: '#2D6A4F',
}

export const familyImages: Record<FamilyCode, FamilyImages> = {
  vajra: {
    buddhaImage: '/graphics/Aksobhya_Buddha.gif',
    buddhaName: 'Akshobhya Buddha',
    buddhaWisdom: 'Mirror-Like Wisdom',
    luminousKingImage: '/graphics/Trailokya-vijaya-raja.jpg',
    luminousKingName: 'Trailokyavijaya',
    luminousKingSanskrit: 'Trailokyavijaya',
  },
  padma: {
    buddhaImage: '/graphics/Amitabha_Buddha_in_Tangka.jpg',
    buddhaName: 'Amitabha Buddha',
    buddhaWisdom: 'Discriminating Awareness Wisdom',
    luminousKingImage: '/graphics/Yamantaka_Luminous_King.jpg',
    luminousKingName: 'Yamantaka',
    luminousKingSanskrit: 'Yamantaka',
  },
  ratna: {
    buddhaImage: '/graphics/Ratnasambhava3.gif',
    buddhaName: 'Ratnasambhava Buddha',
    buddhaWisdom: 'Wisdom of Equanimity',
    luminousKingImage: '/graphics/Kundali_Luminous_King.jpg',
    luminousKingName: 'Kundali',
    luminousKingSanskrit: 'Kuṇḍali',
  },
  karma: {
    buddhaImage: '/graphics/Amoghasiddhi_Buddha.jpg',
    buddhaName: 'Amoghasiddhi Buddha',
    buddhaWisdom: 'All-Accomplishing Wisdom',
    luminousKingImage: '/graphics/Vajra-yaksa_Luminous_King.jpg',
    luminousKingName: 'Vajrayaksha',
    luminousKingSanskrit: 'Vajrayakṣa',
  },
  buddha: {
    buddhaImage: '/graphics/Saravid_Vairocana.jpg',
    buddhaName: 'Vairocana Buddha',
    buddhaWisdom: 'Dharmadhatu Wisdom',
    luminousKingImage: '/graphics/Acala_Vidya-Raja.jpg',
    luminousKingName: 'Acala',
    luminousKingSanskrit: 'Acala',
  },
}

export function getFamilyImages(code: FamilyCode): FamilyImages {
  return familyImages[code]
}
