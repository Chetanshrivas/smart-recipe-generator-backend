import { Request, Response } from 'express';
import User from '../models/User';
import Recipe from '../models/Recipe';

// get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    let user = await User.findOne({ userId });
    
    if (!user) {
      // create new user if doesn't exist
      user = await User.create({ userId });
    }

    // get favorite recipes details
    const favoriteRecipes = await Recipe.find({
      _id: { $in: user.favorites }
    });

    res.json({
      success: true,
      data: {
        userId: user.userId,
        dietaryPreferences: user.dietaryPreferences,
        favorites: favoriteRecipes,
        favoritesCount: user.favorites.length,
        searchHistoryCount: user.searchHistory.length
      }
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user profile'
    });
  }
};

// add recipe to favorites
export const addToFavorites = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { recipeId } = req.body;

    if (!recipeId) {
      return res.status(400).json({
        success: false,
        message: 'Recipe ID is required'
      });
    }

    // Verify recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const user = await User.findOneAndUpdate(
      { userId },
      { 
        $addToSet: { favorites: recipeId },
        $setOnInsert: { userId }
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Recipe added to favorites',
      data: {
        favoritesCount: user.favorites.length
      }
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to favorites'
    });
  }
};

// remove recipe from favorites
export const removeFromFavorites = async (req: Request, res: Response) => {
  try {
    const { userId, recipeId } = req.params;

    const user = await User.findOneAndUpdate(
      { userId },
      { $pull: { favorites: recipeId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Recipe removed from favorites',
      data: {
        favoritesCount: user.favorites.length
      }
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from favorites'
    });
  }
};

// uppdate dietary preferences
export const updateDietaryPreferences = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { preferences } = req.body;

    if (!Array.isArray(preferences)) {
      return res.status(400).json({
        success: false,
        message: 'Preferences must be an array'
      });
    }

    const validPreferences = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb', 'High-Protein', 'Nut-Free', 'Spicy', 'Low-Calorie'];
    const filteredPreferences = preferences.filter(p => validPreferences.includes(p));

    const user = await User.findOneAndUpdate(
      { userId },
      { 
        $set: { dietaryPreferences: filteredPreferences },
        $setOnInsert: { userId }
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Dietary preferences updated',
      data: {
        dietaryPreferences: user.dietaryPreferences
      }
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences'
    });
  }
};

// check if recipe is in favorites
export const checkFavorite = async (req: Request, res: Response) => {
  try {
    const { userId, recipeId } = req.params;

    const user = await User.findOne({ userId });
    
    const isFavorite = user ? user.favorites.includes(recipeId) : false;

    res.json({
      success: true,
      data: { isFavorite }
    });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking favorite status'
    });
  }
};