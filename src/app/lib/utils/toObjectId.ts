import mongoose from 'mongoose'

export default function toObjectId(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error(`ID inválido: ${id}`)
  }

  return new mongoose.Types.ObjectId(id)
}
