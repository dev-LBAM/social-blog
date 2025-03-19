
import mongoose from "mongoose";

// Modelo com expiração automática
const verificationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 10 * 60 * 1000) }, // Expira em 10 min
});

verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

interface IVerifyEmail extends Document 
{
    email: string
    code: string
}

const VerifyEmail = mongoose.models.VerifyEmail || mongoose.model<IVerifyEmail>('VerifyEmail', verificationSchema)
  
export default VerifyEmail