import { Router } from 'express';
import { getSets } from '../services/pokemonApi';

const router = Router();

// Sets rotating OUT in the 2026 rotation (predicted)
// Based on Pokemon TCG rotation patterns - sets ~2.5+ years old at rotation time (August 2026)
const ROTATING_OUT_2026 = ['sv1', 'sv2', 'sv3', 'sv3pt5', 'sv4', 'sv4pt5'];

// Series that are already OUT of Standard rotation (pre-SV era was rotated out in 2025)
const OUT_OF_STANDARD_SERIES = [
  'Sword & Shield',
  'Sun & Moon',
  'XY',
  'Black & White',
  'HeartGold & SoulSilver',
  'Platinum',
  'Diamond & Pearl',
  'EX',
  'Base',
  'Gym',
  'Neo',
  'e-Card',
  'Legendary Collection',
];

router.get('/', async (req, res) => {
  try {
    const { data: sets } = await getSets();

    const categorized = sets.map((set: any) => {
      let rotationStatus: 'out' | 'rotating_soon' | 'safe';

      if (OUT_OF_STANDARD_SERIES.includes(set.series)) {
        rotationStatus = 'out';
      } else if (ROTATING_OUT_2026.includes(set.id)) {
        rotationStatus = 'rotating_soon';
      } else {
        rotationStatus = 'safe';
      }

      return {
        ...set,
        rotationStatus,
      };
    });

    res.json({
      sets: categorized,
      rotationYear: 2026,
      rotationNote: 'Predicted rotation for August 2026. Sets marked as "Rotating Soon" may be removed from Standard format.',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
