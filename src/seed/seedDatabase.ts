import mongoose from 'mongoose';
import Recipe from '../models/Recipe';
import dotenv from 'dotenv';

dotenv.config();

const recipes = [
  // Italian Recipes
  {
    name: 'Classic Margherita Pizza',
    description: 'Traditional Italian pizza with fresh mozzarella, tomatoes, and basil on a crispy crust.',
    cuisine: 'Italian',
    ingredients: ['pizza dough', 'tomato sauce', 'fresh mozzarella', 'fresh basil', 'olive oil', 'garlic', 'salt'],
    instructions: [
      'Preheat oven to 475°F (245°C)',
      'Roll out pizza dough on a floured surface',
      'Spread tomato sauce evenly over the dough',
      'Add sliced fresh mozzarella',
      'Drizzle with olive oil and add minced garlic',
      'Bake for 12-15 minutes until crust is golden',
      'Top with fresh basil leaves and serve'
    ],
    nutrition: { calories: 280, protein: 12, carbs: 35, fat: 10, fiber: 2 },
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: 'Medium',
    dietaryTags: ['Vegetarian'],
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
    substitutions: new Map([
      ['mozzarella', ['vegan cheese', 'nutritional yeast']],
      ['pizza dough', ['cauliflower crust', 'gluten-free dough']]
    ])
  },
  {
    name: 'Creamy Carbonara Pasta',
    description: 'Rich and creamy pasta with eggs, cheese, and crispy pancetta.',
    cuisine: 'Italian',
    ingredients: ['spaghetti', 'eggs', 'parmesan cheese', 'pancetta', 'black pepper', 'garlic', 'olive oil'],
    instructions: [
      'Cook spaghetti according to package directions',
      'Fry pancetta until crispy, set aside',
      'Whisk eggs and grated parmesan in a bowl',
      'Sauté garlic in olive oil',
      'Toss hot pasta with egg mixture off heat',
      'Add pancetta and black pepper',
      'Serve immediately with extra parmesan'
    ],
    nutrition: { calories: 520, protein: 22, carbs: 58, fat: 20, fiber: 3 },
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'Medium',
    dietaryTags: ['High-Protein'],
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800'
  },
  {
    name: 'Minestrone Soup',
    description: 'Hearty Italian vegetable soup with beans and pasta.',
    cuisine: 'Italian',
    ingredients: ['tomatoes', 'kidney beans', 'pasta', 'carrots', 'celery', 'onion', 'garlic', 'vegetable broth', 'zucchini', 'spinach'],
    instructions: [
      'Sauté onion, garlic, carrots, and celery',
      'Add diced tomatoes and vegetable broth',
      'Simmer for 20 minutes',
      'Add beans and pasta, cook until tender',
      'Stir in zucchini and spinach',
      'Season with salt, pepper, and Italian herbs',
      'Serve with crusty bread'
    ],
    nutrition: { calories: 220, protein: 10, carbs: 38, fat: 3, fiber: 10 },
    prepTime: 15,
    cookTime: 35,
    servings: 6,
    difficulty: 'Easy',
    dietaryTags: ['Vegetarian', 'Vegan', 'Low-Calorie'],
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800'
  },
  // Indian Recipes
  {
    name: 'Butter Chicken (Murgh Makhani)',
    description: 'Creamy and flavorful Indian curry with tender chicken pieces.',
    cuisine: 'Indian',
    ingredients: ['chicken', 'tomatoes', 'butter', 'cream', 'yogurt', 'ginger', 'garlic', 'garam masala', 'turmeric', 'cumin', 'coriander', 'chili powder'],
    instructions: [
      'Marinate chicken in yogurt and spices for 2 hours',
      'Grill or pan-fry chicken until cooked',
      'Blend tomatoes into a smooth puree',
      'Melt butter and sauté ginger-garlic paste',
      'Add tomato puree and spices, simmer for 15 minutes',
      'Add cream and cooked chicken',
      'Simmer for 10 more minutes and serve with naan'
    ],
    nutrition: { calories: 450, protein: 32, carbs: 12, fat: 28, fiber: 3 },
    prepTime: 30,
    cookTime: 40,
    servings: 4,
    difficulty: 'Medium',
    dietaryTags: ['Gluten-Free', 'High-Protein'],
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800'
  },
  {
    name: 'Chana Masala',
    description: 'Spicy and tangy chickpea curry, a popular North Indian dish.',
    cuisine: 'Indian',
    ingredients: ['chickpeas', 'tomatoes', 'onion', 'ginger', 'garlic', 'cumin', 'coriander', 'turmeric', 'garam masala', 'amchur', 'cilantro'],
    instructions: [
      'Sauté onions until golden brown',
      'Add ginger-garlic paste and cook for 2 minutes',
      'Add spices and cook for 1 minute',
      'Add tomatoes and cook until soft',
      'Add chickpeas and water, simmer for 20 minutes',
      'Mash some chickpeas to thicken the gravy',
      'Garnish with cilantro and serve'
    ],
    nutrition: { calories: 280, protein: 12, carbs: 42, fat: 8, fiber: 12 },
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: 'Easy',
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'High-Protein'],
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800'
  },
  {
    name: 'Vegetable Biryani',
    description: 'Fragrant rice dish layered with spiced vegetables and aromatic spices.',
    cuisine: 'Indian',
    ingredients: ['basmati rice', 'mixed vegetables', 'onion', 'yogurt', 'saffron', 'biryani masala', 'mint', 'cilantro', 'ghee', 'cashews', 'raisins'],
    instructions: [
      'Soak rice for 30 minutes, then parboil',
      'Sauté onions until crispy, set aside',
      'Cook vegetables with biryani masala',
      'Layer rice and vegetable mixture in a pot',
      'Add saffron milk, mint, and cilantro',
      'Cover and cook on low heat for 25 minutes',
      'Garnish with fried onions, cashews, and raisins'
    ],
    nutrition: { calories: 380, protein: 10, carbs: 62, fat: 12, fiber: 6 },
    prepTime: 30,
    cookTime: 45,
    servings: 6,
    difficulty: 'Hard',
    dietaryTags: ['Vegetarian', 'Gluten-Free', 'Nut-Free'],
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800'
  },
  {
    name: 'Palak Paneer',
    description: 'Creamy spinach curry with fresh paneer cheese cubes.',
    cuisine: 'Indian',
    ingredients: ['spinach', 'paneer', 'onion', 'tomato', 'ginger', 'garlic', 'green chili', 'cream', 'cumin', 'garam masala'],
    instructions: [
      'Blanch spinach and blend into a smooth puree',
      'Sauté cumin, onions, ginger, and garlic',
      'Add tomatoes and cook until soft',
      'Add spinach puree and spices',
      'Add cream and simmer for 10 minutes',
      'Add paneer cubes and cook for 5 minutes',
      'Serve hot with naan or rice'
    ],
    nutrition: { calories: 320, protein: 18, carbs: 14, fat: 22, fiber: 5 },
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: 'Medium',
    dietaryTags: ['Vegetarian', 'Gluten-Free', 'High-Protein'],
    imageUrl: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800'
  },
  // Chinese Recipes
  {
    name: 'Kung Pao Chicken',
    description: 'Spicy stir-fried chicken with peanuts, vegetables, and chili peppers.',
    cuisine: 'Chinese',
    ingredients: ['chicken', 'peanuts', 'dried chili', 'scallions', 'ginger', 'garlic', 'soy sauce', 'vinegar', 'sugar', 'cornstarch', 'sesame oil'],
    instructions: [
      'Marinate chicken in soy sauce and cornstarch',
      'Mix sauce ingredients in a bowl',
      'Stir-fry chicken until golden, set aside',
      'Sauté ginger, garlic, and dried chilies',
      'Add chicken and sauce, toss quickly',
      'Add peanuts and scallions',
      'Serve immediately with steamed rice'
    ],
    nutrition: { calories: 340, protein: 28, carbs: 18, fat: 18, fiber: 3 },
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: 'Medium',
    dietaryTags: ['Spicy', 'Dairy-Free', 'High-Protein'],
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800'
  },
  {
    name: 'Vegetable Fried Rice',
    description: 'Classic Chinese fried rice with mixed vegetables and soy sauce.',
    cuisine: 'Chinese',
    ingredients: ['rice', 'eggs', 'carrots', 'peas', 'corn', 'scallions', 'soy sauce', 'sesame oil', 'garlic', 'ginger'],
    instructions: [
      'Cook rice and let it cool completely',
      'Scramble eggs in a hot wok, set aside',
      'Sauté garlic and ginger in sesame oil',
      'Add vegetables and stir-fry for 3 minutes',
      'Add rice and toss with soy sauce',
      'Mix in scrambled eggs and scallions',
      'Serve hot'
    ],
    nutrition: { calories: 280, protein: 10, carbs: 42, fat: 8, fiber: 4 },
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    dietaryTags: ['Vegetarian', 'Nut-Free'],
    imageUrl: 'https://images.unsplash.com/photo-1581184953987-5668072c8420?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnYXRhYmxlcyUyMGZyaWVkJTIwcmljZXxlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    name: 'Sweet and Sour Tofu',
    description: 'Crispy tofu cubes in tangy sweet and sour sauce with vegetables.',
    cuisine: 'Chinese',
    ingredients: ['tofu', 'bell peppers', 'pineapple', 'ketchup', 'vinegar', 'sugar', 'soy sauce', 'cornstarch', 'ginger', 'garlic'],
    instructions: [
      'Press tofu to remove excess water, cube it',
      'Coat tofu in cornstarch and fry until golden',
      'Mix sauce ingredients in a bowl',
      'Stir-fry ginger, garlic, and bell peppers',
      'Add pineapple and sauce, bring to simmer',
      'Add crispy tofu and toss to coat',
      'Serve with steamed rice'
    ],
    nutrition: { calories: 260, protein: 14, carbs: 32, fat: 10, fiber: 4 },
    prepTime: 20,
    cookTime: 20,
    servings: 4,
    difficulty: 'Medium',
    dietaryTags: ['Vegetarian', 'Vegan', 'Dairy-Free', 'Nut-Free'],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'
  },
  // Mexican Recipes
  {
    name: 'Chicken Tacos',
    description: 'Authentic Mexican tacos with marinated grilled chicken and fresh toppings.',
    cuisine: 'Mexican',
    ingredients: ['chicken', 'corn tortillas', 'lime', 'cilantro', 'onion', 'cumin', 'chili powder', 'garlic', 'avocado', 'salsa'],
    instructions: [
      'Marinate chicken in lime juice and spices',
      'Grill chicken until fully cooked, slice thinly',
      'Warm corn tortillas on a dry skillet',
      'Dice onions and chop cilantro',
      'Assemble tacos with chicken, onions, cilantro',
      'Top with avocado slices and salsa',
      'Serve with lime wedges'
    ],
    nutrition: { calories: 320, protein: 28, carbs: 28, fat: 12, fiber: 5 },
    prepTime: 20,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    dietaryTags: ['Dairy-Free', 'Nut-Free', 'High-Protein'],
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800'
  },
  {
    name: 'Vegetarian Quesadillas',
    description: 'Cheesy quesadillas filled with beans, corn, and peppers.',
    cuisine: 'Mexican',
    ingredients: ['flour tortillas', 'cheese', 'black beans', 'corn', 'bell peppers', 'onion', 'cumin', 'sour cream', 'salsa', 'guacamole'],
    instructions: [
      'Sauté onions and peppers until soft',
      'Add beans, corn, and cumin, cook for 5 minutes',
      'Heat a large skillet over medium heat',
      'Place tortilla, add cheese and filling',
      'Top with another tortilla and cook until golden',
      'Flip and cook other side',
      'Cut into wedges and serve with toppings'
    ],
    nutrition: { calories: 380, protein: 16, carbs: 42, fat: 16, fiber: 8 },
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    dietaryTags: ['Vegetarian', 'Nut-Free'],
    imageUrl: 'https://images.unsplash.com/photo-1730878423239-0fd430bbac37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8VmVnZXRhcmlhbiUyMFF1ZXNhZGlsbGFzfGVufDB8fDB8fHww'
  },
  {
    name: 'Guacamole',
    description: 'Fresh and creamy avocado dip with lime and cilantro.',
    cuisine: 'Mexican',
    ingredients: ['avocado', 'lime', 'cilantro', 'tomato', 'onion', 'jalapeño', 'garlic', 'salt', 'cumin'],
    instructions: [
      'Cut avocados in half, remove pit, scoop flesh',
      'Mash avocados in a bowl (leave some chunks)',
      'Finely dice tomato, onion, and jalapeño',
      'Chop cilantro and mince garlic',
      'Mix all ingredients together',
      'Add lime juice, salt, and cumin to taste',
      'Serve immediately with tortilla chips'
    ],
    nutrition: { calories: 150, protein: 2, carbs: 8, fat: 14, fiber: 6 },
    prepTime: 15,
    cookTime: 0,
    servings: 6,
    difficulty: 'Easy',
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Low-Carb'],
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800'
  },
  // American Recipes
  {
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheese on a toasted bun.',
    cuisine: 'American',
    ingredients: ['ground beef', 'cheese', 'burger buns', 'lettuce', 'tomato', 'onion', 'pickles', 'ketchup', 'mustard', 'salt', 'pepper'],
    instructions: [
      'Form beef into patties, season with salt and pepper',
      'Grill or pan-fry patties over high heat',
      'Flip after 4 minutes, add cheese',
      'Toast buns on the grill',
      'Assemble burgers with desired toppings',
      'Serve with fries or salad'
    ],
    nutrition: { calories: 520, protein: 32, carbs: 32, fat: 28, fiber: 3 },
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    dietaryTags: ['Nut-Free', 'High-Protein'],
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'
  },
  {
    name: 'Mac and Cheese',
    description: 'Creamy, cheesy pasta bake with a crispy breadcrumb topping.',
    cuisine: 'American',
    ingredients: ['macaroni', 'cheddar cheese', 'milk', 'butter', 'flour', 'breadcrumbs', 'parmesan', 'mustard', 'paprika'],
    instructions: [
      'Cook macaroni until al dente, drain',
      'Make roux with butter and flour',
      'Whisk in milk and cook until thickened',
      'Add cheese and stir until melted',
      'Mix in cooked macaroni',
      'Top with breadcrumbs and parmesan',
      'Bake at 375°F for 25 minutes until golden'
    ],
    nutrition: { calories: 480, protein: 20, carbs: 48, fat: 24, fiber: 2 },
    prepTime: 20,
    cookTime: 30,
    servings: 6,
    difficulty: 'Medium',
    dietaryTags: ['Vegetarian', 'Nut-Free'],
    imageUrl: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=800'
  },
  {
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with creamy Caesar dressing and croutons.',
    cuisine: 'American',
    ingredients: ['romaine lettuce', 'parmesan', 'croutons', 'egg', 'olive oil', 'lemon juice', 'anchovy', 'garlic', 'dijon mustard', 'worcestershire sauce'],
    instructions: [
      'Wash and chop romaine into bite-sized pieces',
      'Make dressing: blend egg, oil, lemon, anchovy, garlic',
      'Toss lettuce with dressing',
      'Add parmesan shavings and croutons',
      'Season with black pepper',
      'Serve immediately'
    ],
    nutrition: { calories: 280, protein: 10, carbs: 12, fat: 22, fiber: 4 },
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: 'Easy',
    dietaryTags: ['Nut-Free'],
    imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800'
  },
  // Mediterranean Recipes
  {
    name: 'Greek Salad',
    description: 'Fresh Mediterranean salad with cucumbers, tomatoes, olives, and feta.',
    cuisine: 'Mediterranean',
    ingredients: ['cucumber', 'tomato', 'red onion', 'kalamata olives', 'feta cheese', 'olive oil', 'oregano', 'lemon juice'],
    instructions: [
      'Chop cucumber and tomato into chunks',
      'Slice red onion thinly',
      'Combine vegetables in a large bowl',
      'Add olives and crumbled feta',
      'Drizzle with olive oil and lemon juice',
      'Sprinkle with dried oregano',
      'Toss gently and serve'
    ],
    nutrition: { calories: 220, protein: 8, carbs: 12, fat: 18, fiber: 4 },
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: 'Easy',
    dietaryTags: ['Vegetarian', 'Gluten-Free', 'Low-Carb'],
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800'
  },
  {
    name: 'Hummus',
    description: 'Creamy chickpea dip with tahini, lemon, and garlic.',
    cuisine: 'Mediterranean',
    ingredients: ['chickpeas', 'tahini', 'lemon juice', 'garlic', 'olive oil', 'cumin', 'paprika', 'salt'],
    instructions: [
      'Drain and rinse chickpeas',
      'Blend chickpeas with tahini and lemon juice',
      'Add garlic and cumin',
      'Stream in olive oil while blending',
      'Add water to reach desired consistency',
      'Season with salt',
      'Garnish with paprika and olive oil'
    ],
    nutrition: { calories: 180, protein: 6, carbs: 16, fat: 12, fiber: 5 },
    prepTime: 10,
    cookTime: 0,
    servings: 8,
    difficulty: 'Easy',
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
    imageUrl: 'https://images.unsplash.com/photo-1637949385162-e416fb15b2ce?w=800'
  },
  {
    name: 'Chicken Shawarma',
    description: 'Middle Eastern spiced chicken served with pita and tahini sauce.',
    cuisine: 'Mediterranean',
    ingredients: ['chicken', 'yogurt', 'lemon', 'garlic', 'cumin', 'coriander', 'paprika', 'turmeric', 'cinnamon', 'pita bread', 'tahini'],
    instructions: [
      'Mix yogurt with spices and lemon juice',
      'Marinate chicken for at least 2 hours',
      'Grill or roast chicken until cooked through',
      'Slice chicken thinly',
      'Warm pita bread',
      'Make tahini sauce with lemon and garlic',
      'Serve chicken in pita with sauce and vegetables'
    ],
    nutrition: { calories: 380, protein: 35, carbs: 28, fat: 14, fiber: 3 },
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: 'Medium',
    dietaryTags: ['Nut-Free', 'High-Protein'],
    imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800'
  },
  // Thai Recipes
  {
    name: 'Pad Thai',
    description: 'Classic Thai stir-fried noodles with shrimp, tofu, and peanuts.',
    cuisine: 'Thai',
    ingredients: ['rice noodles', 'shrimp', 'tofu', 'egg', 'bean sprouts', 'scallions', 'peanuts', 'tamarind', 'fish sauce', 'palm sugar', 'lime'],
    instructions: [
      'Soak rice noodles in warm water until soft',
      'Make sauce with tamarind, fish sauce, and sugar',
      'Stir-fry shrimp and tofu, set aside',
      'Scramble egg in the wok',
      'Add noodles and sauce, toss quickly',
      'Add shrimp, tofu, bean sprouts, and scallions',
      'Serve with crushed peanuts and lime wedges'
    ],
    nutrition: { calories: 420, protein: 22, carbs: 52, fat: 14, fiber: 4 },
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: 'Medium',
    dietaryTags: ['Dairy-Free', 'High-Protein'],
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800'
  },
  {
    name: 'Green Curry',
    description: 'Aromatic Thai curry with coconut milk, vegetables, and basil.',
    cuisine: 'Thai',
    ingredients: ['coconut milk', 'green curry paste', 'chicken', 'thai eggplant', 'bamboo shoots', 'bell peppers', 'thai basil', 'fish sauce', 'palm sugar', 'lime leaves'],
    instructions: [
      'Heat thick coconut cream in a pot',
      'Add green curry paste, fry until fragrant',
      'Add chicken, cook until sealed',
      'Pour in remaining coconut milk',
      'Add vegetables and simmer for 15 minutes',
      'Season with fish sauce and palm sugar',
      'Garnish with Thai basil and serve with rice'
    ],
    nutrition: { calories: 380, protein: 24, carbs: 14, fat: 26, fiber: 4 },
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: 'Medium',
    dietaryTags: ['Gluten-Free', 'Dairy-Free', 'High-Protein'],
    imageUrl: 'https://images.unsplash.com/photo-1626804475297-411d863b67ab?w=800'
  },
  // Japanese Recipes
  {
    name: 'Vegetable Tempura',
    description: 'Light and crispy battered vegetables, a Japanese favorite.',
    cuisine: 'Japanese',
    ingredients: ['sweet potato', 'eggplant', 'bell pepper', 'mushroom', 'green beans', 'flour', 'cornstarch', 'egg', 'ice water', 'soy sauce', 'daikon'],
    instructions: [
      'Cut vegetables into uniform pieces',
      'Make batter: mix flour, cornstarch, egg, and ice water',
      'Heat oil to 350°F',
      'Dip vegetables in batter, fry until golden',
      'Drain on paper towels',
      'Make dipping sauce with soy sauce and daikon',
      'Serve immediately while crispy'
    ],
    nutrition: { calories: 280, protein: 6, carbs: 32, fat: 14, fiber: 5 },
    prepTime: 20,
    cookTime: 20,
    servings: 4,
    difficulty: 'Medium',
    dietaryTags: ['Vegetarian', 'Dairy-Free', 'Nut-Free'],
    imageUrl: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=800'
  },
  {
    name: 'Miso Soup',
    description: 'Traditional Japanese soup with tofu, seaweed, and miso paste.',
    cuisine: 'Japanese',
    ingredients: ['dashi', 'miso paste', 'tofu', 'wakame seaweed', 'scallions', 'mushrooms'],
    instructions: [
      'Prepare dashi broth',
      'Soak wakame in water until expanded',
      'Heat dashi in a pot',
      'Add tofu cubes and mushrooms',
      'Dissolve miso paste in a ladle of hot broth',
      'Stir miso into the soup (do not boil)',
      'Add wakame and scallions, serve immediately'
    ],
    nutrition: { calories: 80, protein: 6, carbs: 8, fat: 3, fiber: 2 },
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Low-Calorie'],
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800'
  },
  // French Recipes
  {
    name: 'Ratatouille',
    description: 'Provençal vegetable stew with eggplant, zucchini, and tomatoes.',
    cuisine: 'French',
    ingredients: ['eggplant', 'zucchini', 'bell pepper', 'tomato', 'onion', 'garlic', 'herbs de provence', 'olive oil', 'basil'],
    instructions: [
      'Cut all vegetables into uniform cubes',
      'Sauté eggplant until golden, set aside',
      'Sauté zucchini and peppers, set aside',
      'Cook onions and garlic until soft',
      'Add tomatoes and herbs, simmer for 10 minutes',
      'Combine all vegetables, simmer for 20 minutes',
      'Garnish with fresh basil'
    ],
    nutrition: { calories: 160, protein: 4, carbs: 18, fat: 10, fiber: 6 },
    prepTime: 20,
    cookTime: 45,
    servings: 6,
    difficulty: 'Medium',
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Low-Calorie'],
    imageUrl: 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=800'
  },
  {
    name: 'French Omelette',
    description: 'Classic French-style omelette, soft and creamy inside.',
    cuisine: 'French',
    ingredients: ['eggs', 'butter', 'chives', 'salt', 'white pepper', 'gruyère cheese'],
    instructions: [
      'Beat eggs with salt and pepper until smooth',
      'Heat butter in a non-stick pan over medium heat',
      'Pour in eggs, stir gently with spatula',
      'When mostly set but still runny on top, stop stirring',
      'Add cheese and chives to center',
      'Fold omelette into thirds',
      'Slide onto plate, seam side down'
    ],
    nutrition: { calories: 280, protein: 18, carbs: 2, fat: 22, fiber: 0 },
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    difficulty: 'Hard',
    dietaryTags: ['Vegetarian', 'Gluten-Free', 'Low-Carb', 'Keto', 'High-Protein'],
    imageUrl: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800'
  },
  // Additional Recipes
  {
    name: 'Lentil Soup',
    description: 'Hearty and nutritious soup with lentils, vegetables, and herbs.',
    cuisine: 'Mediterranean',
    ingredients: ['lentils', 'carrots', 'celery', 'onion', 'garlic', 'vegetable broth', 'tomatoes', 'cumin', 'bay leaf', 'lemon'],
    instructions: [
      'Sauté onions, carrots, and celery',
      'Add garlic and cumin, cook for 1 minute',
      'Add lentils, broth, and tomatoes',
      'Add bay leaf and simmer for 30 minutes',
      'Season with salt and pepper',
      'Add lemon juice before serving',
      'Serve with crusty bread'
    ],
    nutrition: { calories: 240, protein: 14, carbs: 36, fat: 4, fiber: 14 },
    prepTime: 15,
    cookTime: 40,
    servings: 6,
    difficulty: 'Easy',
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'High-Protein', 'Low-Calorie'],
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800'
  },
  {
    name: 'Stuffed Bell Peppers',
    description: 'Colorful peppers filled with rice, vegetables, and cheese.',
    cuisine: 'American',
    ingredients: ['bell peppers', 'rice', 'tomato sauce', 'onion', 'garlic', 'cheese', 'herbs', 'olive oil'],
    instructions: [
      'Cut tops off peppers, remove seeds',
      'Cook rice according to package directions',
      'Sauté onions and garlic',
      'Mix rice with sautéed vegetables and tomato sauce',
      'Stuff peppers with the mixture',
      'Top with cheese',
      'Bake at 375°F for 30 minutes'
    ],
    nutrition: { calories: 280, protein: 10, carbs: 38, fat: 10, fiber: 5 },
    prepTime: 20,
    cookTime: 35,
    servings: 4,
    difficulty: 'Medium',
    dietaryTags: ['Vegetarian', 'Nut-Free'],
    imageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-recipe-generator';
    await mongoose.connect(mongoURI);
    console.log('📊 Connected to MongoDB');

    // Clear existing recipes
    await Recipe.deleteMany({});
    console.log('🗑️  Cleared existing recipes');

    // Insert new recipes
    const insertedRecipes = await Recipe.insertMany(recipes);
    console.log(`✅ Successfully seeded ${insertedRecipes.length} recipes`);

    // Log recipe counts by cuisine
    const cuisineCounts = await Recipe.aggregate([
      { $group: { _id: '$cuisine', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📈 Recipes by Cuisine:');
    cuisineCounts.forEach((c: any) => {
      console.log(`   ${c._id}: ${c.count}`);
    });

    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();