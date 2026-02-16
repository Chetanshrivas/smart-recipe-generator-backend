import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  favorites: string[];
  dietaryPreferences: string[];
  searchHistory: {
    ingredients: string[];
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const SearchHistorySchema: Schema = new Schema({
  ingredients: [String],
  timestamp: { type: Date, default: Date.now }
});

const UserSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  favorites: {
    type: [String],
    default: [],
    ref: 'Recipe'
  },
  dietaryPreferences: {
    type: [String],
    default: [],
    enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb', 'High-Protein', 'Nut-Free', 'Spicy', 'Low-Calorie']
  },
  searchHistory: [SearchHistorySchema]
}, {
  timestamps: true
});

// index lgao faster result ke liye
UserSchema.index({ userId: 1 });

export default mongoose.model<IUser>('User', UserSchema);