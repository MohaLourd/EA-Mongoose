import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJugador extends Document {
  name: string;
  dorsal: string;
  avatar?: string;
}

const jugadorSchema = new Schema<IJugador>({
  name: { type: String, required: true },
  dorsal: { type: String, required: true },
  avatar: { type: String, required: false },
});

// Exportación correcta en ES Modules
const JugadorModel: Model<IJugador> = mongoose.model("Jugador", jugadorSchema);
export default JugadorModel;
