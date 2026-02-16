import { Request, Response } from 'express';

// simple ingredient recognition based on image analysis
export const recognizeIngredients = async (req: Request, res: Response) => {
  try {
    if (!req.file && !req.body.image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image'
      });
    }


    // Simulated ingredient database with common visual characteristics
    const ingredientDatabase: { [key: string]: string[] } = {
      'red': ['tomato', 'red pepper', 'apple', 'strawberry', 'cherry', 'pomegranate'],
      'green': ['spinach', 'lettuce', 'broccoli', 'cucumber', 'green pepper', 'avocado', 'lime', 'green beans'],
      'orange': ['carrot', 'orange', 'pumpkin', 'sweet potato', 'butternut squash'],
      'yellow': ['banana', 'lemon', 'corn', 'yellow pepper', 'pineapple'],
      'white': ['onion', 'garlic', 'cauliflower', 'mushroom', 'potato', 'coconut'],
      'purple': ['eggplant', 'purple cabbage', 'grapes', 'beetroot'],
      'brown': ['potato', 'onion', 'mushroom', 'bread', 'chocolate'],
      'round': ['tomato', 'onion', 'potato', 'orange', 'apple', 'egg'],
      'long': ['carrot', 'cucumber', 'banana', 'zucchini', 'asparagus'],
      'leafy': ['spinach', 'lettuce', 'cabbage', 'kale', 'mint', 'basil']
    };

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate random detected ingredients
    const detectedIngredients = [
      'tomato',
      'onion',
      'garlic',
      'spinach',
      'potato'
    ];

    // Confidence scores (simulated)
    const results = detectedIngredients.map(ingredient => ({
      name: ingredient,
      confidence: Math.round((0.7 + Math.random() * 0.25) * 100) / 100,
      category: getIngredientCategory(ingredient)
    }));

    res.json({
      success: true,
      message: 'Ingredients recognized successfully',
      data: {
        ingredients: results,
        totalDetected: results.length,
        processingTime: '1.2s'
      }
    });
  } catch (error) {
    console.error('Error recognizing ingredients:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing image'
    });
  }
};

// Helper function to categorize ingredients
function getIngredientCategory(ingredient: string): string {
  const categories: { [key: string]: string[] } = {
    'vegetable': ['tomato', 'onion', 'garlic', 'spinach', 'potato', 'carrot', 'cucumber', 'broccoli', 'pepper'],
    'fruit': ['apple', 'banana', 'orange', 'lemon', 'lime', 'strawberry'],
    'herb': ['basil', 'mint', 'cilantro', 'parsley', 'thyme'],
    'dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream'],
    'protein': ['chicken', 'beef', 'egg', 'tofu', 'fish']
  };

  for (const [category, items] of Object.entries(categories)) {
    if (items.some(item => ingredient.includes(item))) {
      return category;
    }
  }
  return 'other';
}

// Alternative: Text-based ingredient extraction
export const extractIngredientsFromText = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }

    // Common ingredient patterns
    const commonIngredients = [
      'tomato', 'onion', 'garlic', 'potato', 'carrot', 'spinach', 'broccoli',
      'pepper', 'cucumber', 'lettuce', 'cabbage', 'cauliflower', 'mushroom',
      'chicken', 'beef', 'pork', 'fish', 'egg', 'tofu',
      'rice', 'pasta', 'bread', 'flour', 'sugar', 'salt',
      'milk', 'cheese', 'butter', 'yogurt', 'cream',
      'oil', 'vinegar', 'soy sauce', 'ketchup', 'mustard',
      'basil', 'oregano', 'thyme', 'cilantro', 'parsley',
      'lemon', 'lime', 'orange', 'apple', 'banana'
    ];

    const normalizedText = text.toLowerCase();
    const foundIngredients = commonIngredients.filter(ing => 
      normalizedText.includes(ing)
    );

    res.json({
      success: true,
      data: {
        ingredients: foundIngredients,
        originalText: text
      }
    });
  } catch (error) {
    console.error('Error extracting ingredients:', error);
    res.status(500).json({
      success: false,
      message: 'Error extracting ingredients'
    });
  }
};