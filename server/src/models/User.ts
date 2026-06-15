import mongoose, { Document, Schema } from 'mongoose';

export interface HealthProfile {
  diabetes?: boolean;
  highBloodPressure?: boolean;
  heartDisease?: boolean;
  allergies?: string[];
  obesity?: boolean;
  lactoseIntolerance?: boolean;
  kidneyDisease?: boolean;
  highCholesterol?: boolean;
  glutenIntolerance?: boolean;
  otherRestrictions?: string;
}

export interface IUser extends Document {
  email: string;
  password?: string; // hashed password, optional for Google OAuth users
  googleId?: string;
  name: string;
  healthProfile: HealthProfile;
  createdAt: Date;
}

const HealthProfileSchema = new Schema<HealthProfile>({
  diabetes: { type: Boolean, default: false },
  highBloodPressure: { type: Boolean, default: false },
  heartDisease: { type: Boolean, default: false },
  allergies: [{ type: String }],
  obesity: { type: Boolean, default: false },
  lactoseIntolerance: { type: Boolean, default: false },
  kidneyDisease: { type: Boolean, default: false },
  highCholesterol: { type: Boolean, default: false },
  glutenIntolerance: { type: Boolean, default: false },
  otherRestrictions: { type: String },
});

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  name: { type: String, required: true },
  healthProfile: { type: HealthProfileSchema, default: {} },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
