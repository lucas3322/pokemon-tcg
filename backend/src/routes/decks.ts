import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*,
        (SELECT COUNT(*) FROM deck_cards WHERE deck_id = d.id)::int AS card_count,
        (SELECT COALESCE(SUM(quantity), 0) FROM deck_cards WHERE deck_id = d.id)::int AS total_cards
      FROM decks d
      WHERE d.user_id = $1
      ORDER BY d.updated_at DESC
    `, [req.userId]);
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const deckResult = await pool.query('SELECT * FROM decks WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    if (deckResult.rows.length === 0) return res.status(404).json({ error: 'Deck not found' });

    const cardsResult = await pool.query(
      'SELECT * FROM deck_cards WHERE deck_id = $1 ORDER BY card_supertype, card_name',
      [req.params.id]
    );
    res.json({ ...deckResult.rows[0], cards: cardsResult.rows });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  const { name, description = '', format = 'standard', cover_card_image = '' } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  try {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO decks (id, user_id, name, description, format, cover_card_image)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, req.userId, name, description, format, cover_card_image]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const deckResult = await pool.query('SELECT * FROM decks WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    if (deckResult.rows.length === 0) return res.status(404).json({ error: 'Deck not found' });

    const deck = deckResult.rows[0];
    const { name, description, format, cover_card_image, cards } = req.body;

    const updated = await pool.query(
      `UPDATE decks SET name=$1, description=$2, format=$3, cover_card_image=$4, updated_at=NOW()
       WHERE id=$5 AND user_id=$6 RETURNING *`,
      [name ?? deck.name, description ?? deck.description, format ?? deck.format, cover_card_image ?? deck.cover_card_image, req.params.id, req.userId]
    );

    if (cards !== undefined) {
      await pool.query('DELETE FROM deck_cards WHERE deck_id = $1', [req.params.id]);
      for (const card of cards) {
        await pool.query(
          `INSERT INTO deck_cards (deck_id, card_id, card_name, card_image, card_supertype, card_types, quantity)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (deck_id, card_id) DO UPDATE SET quantity = EXCLUDED.quantity`,
          [req.params.id, card.card_id, card.card_name, card.card_image || '', card.card_supertype || '', JSON.stringify(card.card_types || []), card.quantity]
        );
      }
    }

    const cardsResult = await pool.query('SELECT * FROM deck_cards WHERE deck_id = $1 ORDER BY card_supertype, card_name', [req.params.id]);
    res.json({ ...updated.rows[0], cards: cardsResult.rows });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query('DELETE FROM decks WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Deck not found' });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
