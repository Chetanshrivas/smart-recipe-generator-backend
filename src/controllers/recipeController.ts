import { Request, Response } from 'express';
import Recipe from '../models/Recipe';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';

// get all recipes with pagination and filters
export const getRecipes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    // build filter object
    const filter: any = {};
    
    // cuisine filter
    if (req.query.cuisine) {
      filter.cuisine = req.query.cuisine;
    }
    
    // difficulty filter
    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty;
    }
    
    // dietary tags filter
    if (req.query.dietary) {
      const dietaryTags = (req.query.dietary as string).split(',');
      filter.dietaryTags = { $in: dietaryTags };
    }
    
    // max time filter
    if (req.query.maxTime) {
      filter.$expr = { $lte: [{ $add: ['$prepTime', '$cookTime'] }, parseInt(req.query.maxTime as string)] };
    }
    
    // search query
    if (req.query.search) {
      filter.$text = { $search: req.query.search as string };
    }

    // sorting
    let sort: any = {};
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'rating':
          sort = { averageRating: -1 };
          break;
        case 'time':
          sort = { totalTime: 1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        default:
          sort = { averageRating: -1 };
      }
    } else {
      sort = { averageRating: -1 };
    }

    const recipes = await Recipe.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Recipe.countDocuments(filter);

    res.json({
      success: true,
      data: recipes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipes'
    });
  }
};

// get single recipe by ID
export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipe'
    });
  }
};

// match recipes based on ingredients
export const matchRecipes = async (req: Request, res: Response) => {
  try {
    const { ingredients, dietaryPreferences, userId } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one ingredient'
      });
    }

    // mormalize ingredients (lowercase, trim)
    const normalizedIngredients = ingredients.map(ing => 
      ing.toLowerCase().trim()
    );

    // bbuild query
    const query: any = {
      ingredients: {
        $in: normalizedIngredients.map(ing => new RegExp(ing, 'i'))
      }
    };

    // add dietary preferences filter
    if (dietaryPreferences && dietaryPreferences.length > 0) {
      query.dietaryTags = { $in: dietaryPreferences };
    }

    // find matching recipes
    let recipes = await Recipe.find(query);

    // calculate match score for each recipe
    const scoredRecipes = recipes.map(recipe => {
      const recipeIngredients = recipe.ingredients.map((i: string) => i.toLowerCase());
      
      // count matching ingredients
      let matchCount = 0;
      const matchedIngredients: string[] = [];
      const missingIngredients: string[] = [];
      
      recipeIngredients.forEach(ing => {
        const isMatch = normalizedIngredients.some(userIng => 
          ing.includes(userIng) || userIng.includes(ing)
        );
        if (isMatch) {
          matchCount++;
          matchedIngredients.push(ing);
        } else {
          missingIngredients.push(ing);
        }
      });

      // calculate match percentage
      const matchPercentage = (matchCount / recipeIngredients.length) * 100;
      
      // calculate score (weighted by match percentage and rating)
      const score = (matchPercentage * 0.7) + (recipe.averageRating * 6);

      return {
        recipe: recipe.toObject(),
        score,
        matchPercentage: Math.round(matchPercentage),
        matchedIngredients,
        missingIngredients,
        matchCount,
        totalIngredients: recipeIngredients.length
      };
    });

    // sort by score (highest first)
    scoredRecipes.sort((a, b) => b.score - a.score);

    // save search history if userId provided
    if (userId) {
      await User.findOneAndUpdate(
        { userId },
        { 
          $push: { 
            searchHistory: { 
              ingredients: normalizedIngredients,
              timestamp: new Date()
            } 
          } 
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      success: true,
      data: scoredRecipes,
      totalMatches: scoredRecipes.length
    });
  } catch (error) {
    console.error('Error matching recipes:', error);
    res.status(500).json({
      success: false,
      message: 'Error matching recipes'
    });
  }
};

// get substitution suggestions
export const getSubstitutions = async (req: Request, res: Response) => {
  try {
    const { ingredient, recipeId } = req.query;
    
    if (!ingredient) {
      return res.status(400).json({
        success: false,
        message: 'Ingredient is required'
      });
    }

    // common substitution database
    const commonSubstitutions: { [key: string]: string[] } = {
      'butter': ['coconut oil', 'olive oil', 'ghee', 'margarine'],
      'egg': ['flax egg', 'applesauce', 'mashed banana', 'yogurt'],
      'milk': ['almond milk', 'soy milk', 'oat milk', 'coconut milk'],
      'flour': ['almond flour', 'coconut flour', 'oat flour', 'rice flour'],
      'sugar': ['honey', 'maple syrup', 'stevia', 'coconut sugar'],
      'yogurt': ['coconut yogurt', 'sour cream', 'buttermilk'],
      'cream': ['coconut cream', 'cashew cream', 'evaporated milk'],
      'cheese': ['nutritional yeast', 'vegan cheese', 'tofu'],
      'chicken': ['tofu', 'tempeh', 'seitan', 'chickpeas'],
      'beef': ['mushrooms', 'lentils', 'beyond meat', 'tempeh'],
      'soy sauce': ['coconut aminos', 'tamari', 'liquid aminos'],
      'rice': ['quinoa', 'cauliflower rice', 'barley', 'couscous'],
      'pasta': ['zucchini noodles', 'spaghetti squash', 'rice noodles'],
      'bread': ['lettuce wrap', 'rice cakes', 'corn tortillas'],
      'oil': ['applesauce', 'mashed banana', 'greek yogurt'],
      'mayonnaise': ['greek yogurt', 'avocado', 'hummus'],
      'sour cream': ['greek yogurt', 'coconut cream', 'cashew cream'],
      'buttermilk': ['milk + lemon juice', 'yogurt + water', 'kefir'],
      'breadcrumbs': ['oats', 'crushed crackers', 'almond flour'],
      'cornstarch': ['arrowroot powder', 'tapioca starch', 'flour'],
      'baking powder': ['baking soda + cream of tartar'],
      'vanilla extract': ['vanilla bean', 'maple syrup', 'honey'],
      'lemon juice': ['lime juice', 'vinegar', 'cream of tartar'],
      'wine': ['broth', 'grape juice', 'vinegar + water'],
      'heavy cream': ['coconut cream', 'milk + butter', 'evaporated milk']
    };

    let substitutions: string[] = [];

    // check recipe-specific substitutions first
    if (recipeId) {
      const recipe = await Recipe.findById(recipeId);
      if (recipe && recipe.substitutions) {
        const recipeSubs = recipe.substitutions.get(ingredient as string);
        if (recipeSubs) {
          substitutions = [...recipeSubs];
        }
      }
    }

    // Add common substitutions
    const normalizedIng = (ingredient as string).toLowerCase();
    for (const [key, value] of Object.entries(commonSubstitutions)) {
      if (normalizedIng.includes(key) || key.includes(normalizedIng)) {
        substitutions = [...new Set([...substitutions, ...value])];
      }
    }

    res.json({
      success: true,
      data: {
        ingredient,
        substitutions: substitutions.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Error getting substitutions:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting substitutions'
    });
  }
};

// rate a recipe
export const rateRecipe = async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.params;
    const { userId, rating, review } = req.body;

    if (!userId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Valid userId and rating (1-5) are required'
      });
    }

    const recipe = await Recipe.findById(recipeId);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // check if user already rated
    const existingRatingIndex = recipe.ratings.findIndex(
      r => r.userId === userId
    );

    if (existingRatingIndex >= 0) {
      // update existing rating
      recipe.ratings[existingRatingIndex].rating = rating;
      if (review) recipe.ratings[existingRatingIndex].review = review;
      recipe.ratings[existingRatingIndex].date = new Date();
    } else {
      // add new rating
      recipe.ratings.push({
        userId,
        rating,
        review: review || '',
        date: new Date()
      });
    }

    // update average rating
    recipe.updateAverageRating();
    await recipe.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      data: {
        averageRating: recipe.averageRating,
        totalRatings: recipe.totalRatings
      }
    });
  } catch (error) {
    console.error('Error rating recipe:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting rating'
    });
  }
};

// get recipe suggestions based on user history
export const getSuggestions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });
    
    if (!user || user.searchHistory.length === 0) {
      // return popular recipes if no history
      const popularRecipes = await Recipe.find()
        .sort({ averageRating: -1 })
        .limit(6);
      
      return res.json({
        success: true,
        data: popularRecipes,
        message: 'Popular recipes (no user history found)'
      });
    }

    // get ingredients from recent searches
    const recentIngredients = user.searchHistory
      .slice(-5)
      .flatMap(h => h.ingredients);

    // get unique ingredients
    const uniqueIngredients = [...new Set(recentIngredients)];

    // find recipes matching these ingredients
    const suggestions = await Recipe.find({
      ingredients: {
        $in: uniqueIngredients.map(ing => new RegExp(ing, 'i'))
      },
      _id: { $nin: user.favorites }
    })
    .sort({ averageRating: -1 })
    .limit(6);

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting suggestions'
    });
  }
};

// get all cuisines
export const getCuisines = async (req: Request, res: Response) => {
  try {
    const cuisines = await Recipe.distinct('cuisine');
    res.json({
      success: true,
      data: cuisines.sort()
    });
  } catch (error) {
    console.error('Error getting cuisines:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting cuisines'
    });
  }
};

// get all dietary tags
export const getDietaryTags = async (req: Request, res: Response) => {
  try {
    const tags = await Recipe.distinct('dietaryTags');
    res.json({
      success: true,
      data: tags.sort()
    });
  } catch (error) {
    console.error('Error getting dietary tags:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting dietary tags'
    });
  }
};