import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface IRating {
  userId: string;
  rating: number;
  review?: string;
  date: Date;
}

export interface IRecipe extends Document {
  name: string;
  description: string;
  cuisine: string;
  ingredients: string[];
  instructions: string[];
  nutrition: INutrition;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dietaryTags: string[];
  imageUrl?: string;
  ratings: IRating[];
  averageRating: number;
  totalRatings: number;
  substitutions: Map<string, string[]>;

  // virtualll
  totalTime: number;

  // method
  updateAverageRating(): void;
}

/*
   Schemas(data kaisa hoga simple)
*/

const NutritionSchema = new Schema<INutrition>({
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  fiber: { type: Number, default: 0 }
});

const RatingSchema = new Schema<IRating>({
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String },
  date: { type: Date, default: Date.now }
});

const RecipeSchema = new Schema<IRecipe>(
  {
    name: {
      type: String,
      required: [true, 'Recipe name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    cuisine: {
      type: String,
      required: true,
      enum: [
        'Italian',
        'Indian',
        'Chinese',
        'Mexican',
        'American',
        'Mediterranean',
        'Thai',
        'Japanese',
        'French',
        'Other'
      ]
    },
    ingredients: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Recipe must have at least one ingredient'
      }
    },
    instructions: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Recipe must have at least one instruction'
      }
    },
    nutrition: {
      type: NutritionSchema,
      required: true
    },
    prepTime: {
      type: Number,
      required: true,
      min: 1
    },
    cookTime: {
      type: Number,
      required: true,
      min: 0
    },
    servings: {
      type: Number,
      required: true,
      min: 1
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard']
    },
    dietaryTags: {
      type: [String],
      default: [],
      enum: [
        'Vegetarian',
        'Vegan',
        'Gluten-Free',
        'Dairy-Free',
        'Keto',
        'Low-Carb',
        'High-Protein',
        'Nut-Free',
        'Spicy',
        'Low-Calorie'
      ]
    },
    imageUrl: {
      type: String,
      default: ''
    },
    ratings: {
      type: [RatingSchema],
      default: []
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    substitutions: {
      type: Map,
      of: [String],
      default: {}
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


  // Indexes

RecipeSchema.index({
  name: 'text',
  description: 'text',
  ingredients: 'text',
  cuisine: 'text'
});

RecipeSchema.index({ cuisine: 1, difficulty: 1, dietaryTags: 1 });

/*
   Virtualsss
*/

RecipeSchema.virtual('totalTime').get(function (this: IRecipe) {
  return this.prepTime + this.cookTime;
});

/*
   Methodsss
*/

RecipeSchema.methods.updateAverageRating = function (this: IRecipe): void {
  if (!this.ratings || this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
    return;
  }

  const sum = this.ratings.reduce(
    (acc: number, r: IRating) => acc + r.rating,
    0
  );

  this.averageRating =
    Math.round((sum / this.ratings.length) * 10) / 10;

  this.totalRatings = this.ratings.length;
};


const RecipeModel: Model<IRecipe> = mongoose.model<IRecipe>(
  'Recipe',
  RecipeSchema
);

export default RecipeModel;
