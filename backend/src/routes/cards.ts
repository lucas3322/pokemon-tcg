import { Router } from 'express';
import { searchCards, getCard } from '../services/pokemonApi';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { name, type, set, rarity, page = 1, pageSize = 20 } = req.query;

    const queryParts: string[] = [];
    if (name) queryParts.push(`name:*${name}*`);
    if (type) queryParts.push(`types:${type}`);
    if (set) queryParts.push(`set.id:${set}`);
    if (rarity) queryParts.push(`rarity:"${rarity}"`);

    const q = queryParts.join(' ') || undefined;

    const data = await searchCards({
      q,
      page: Number(page),
      pageSize: Number(pageSize),
    });

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await getCard(req.params.id);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
