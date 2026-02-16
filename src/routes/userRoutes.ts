import express from 'express';
import {
  getUserProfile,
  addToFavorites,
  removeFromFavorites,
  updateDietaryPreferences,
  checkFavorite
} from '../controllers/userController';

const router = express.Router();

//Commnets isliye hai taki app log ache se samaj sakke

// GET /api/users/:userId - Get user profile
router.get('/:userId', getUserProfile);

// POST /api/users/:userId/favorites - Add to favorites
router.post('/:userId/favorites', addToFavorites);

// DELETE /api/users/:userId/favorites/:recipeId - Remove from favorites
router.delete('/:userId/favorites/:recipeId', removeFromFavorites);

// GET /api/users/:userId/favorites/:recipeId - Check if favorite
router.get('/:userId/favorites/:recipeId', checkFavorite);

// PUT /api/users/:userId/preferences - Update dietary preferences
router.put('/:userId/preferences', updateDietaryPreferences);

export default router;