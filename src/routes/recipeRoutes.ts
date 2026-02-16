import express from 'express';
import {
  getRecipes,
  getRecipeById,
  matchRecipes,
  getSubstitutions,
  rateRecipe,
  getSuggestions,
  getCuisines,
  getDietaryTags
} from '../controllers/recipeController';

const router = express.Router();

//comments apki help ke liye hai 

// get /api/recipes - get all recipes with filters
router.get('/', getRecipes);

// get /api/recipes/cuisines - get all cuisines
router.get('/cuisines', getCuisines);

// get /api/recipes/dietary-tags - get all dietary tags
router.get('/dietary-tags', getDietaryTags);

// post /api/recipes/match - match recipes by ingredients
router.post('/match', matchRecipes);

// get /api/recipes/substitutions - get ingredient substitutions
router.get('/substitutions', getSubstitutions);

// get /api/recipes/suggestions/:userId - get personalized suggestions
router.get('/suggestions/:userId', getSuggestions);

// get /api/recipes/:id - get single recipe
router.get('/:id', getRecipeById);

// post /api/recipes/:id/rate - gate a recipe
router.post('/:id/rate', rateRecipe);

export default router;