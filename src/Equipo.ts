import mongoose, { Schema, Document, Model } from "mongoose";
import { IJugador } from "./Jugador.js"; // Asegúrate de agregar `.js` al importar

export interface IEquipo extends Document {
  name: string;
  liga: string;
  jugadores: IJugador["_id"][];
}

const equipoSchema = new Schema<IEquipo>({
  name: { type: String, required: true },
  liga: { type: String, required: true },
  jugadores: [{ type: Schema.Types.ObjectId, ref: "Jugador" }],
});

// Exportación correcta en ES Modules
const EquipoModel: Model<IEquipo> = mongoose.model("Equipo", equipoSchema);
export default EquipoModel;
