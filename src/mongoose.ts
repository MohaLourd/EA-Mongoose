import mongoose from "mongoose";
import EquipoModel from "./Equipo.js"; // Agregar `.js` al importar
import JugadorModel from "./Jugador.js"; // Agregar `.js` al importar

async function main() {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect("mongodb://127.0.0.1:27017/SeminarioMongoose");
    console.log("✅ Conectado a MongoDB");

    // Crear un nuevo jugador
    const jugador1 = new JugadorModel({
      name: "Cristiano Ronaldo",
      dorsal: "7",
      avatar: "https://i.imgur.com/dM7Thhn.png",
    });
    await jugador1.save();
    console.log("🎉 Jugador creado:", jugador1);

    const jugador2 = new JugadorModel({
      name: "Messi",
      dorsal: "10",
      avatar: "",
    });
    await jugador2.save();
    console.log("🎉 Jugador creado:", jugador2);

    // Crear un equipo con jugadores
    const equipo1 = new EquipoModel({
      name: "Juventus",
      liga: "Serie A",
      jugadores: [jugador1._id, jugador2._id],
    });
    await equipo1.save();
    console.log("🏆 Equipo creado:", equipo1);

    // Buscar equipo y mostrar jugadores con `populate`
    const equipoWithJugadores = await EquipoModel.findOne({
      name: "Juventus",
    }).populate("jugadores");
    console.log("📌 Equipo con jugadores:", equipoWithJugadores);

    // Agregar un nuevo jugador y actualizar el equipo
    const jugador3 = new JugadorModel({
      name: "Neymar",
      dorsal: "11",
      avatar: "https://example.com/neymar.png",
    });
    await jugador3.save();
    console.log("🎉 Jugador creado:", jugador3);

    const updatedEquipo = await EquipoModel.findByIdAndUpdate(
      equipo1._id,
      {
        name: "Real Madrid",
        liga: "LaLiga",
        $push: { jugadores: jugador3._id },
      },
      { new: true }
    );
    console.log("🔄 Equipo actualizado:", updatedEquipo);

    // Eliminar un jugador
    await JugadorModel.findByIdAndDelete(jugador1._id);
    console.log("❌ Jugador eliminado");

    // Obtener todos los jugadores
    const allJugadores = await JugadorModel.find();
    console.log("⚽ Todos los jugadores:", allJugadores);

    // Filtrar jugadores por dorsal
    const filtrarpordorsal = await JugadorModel.aggregate([
      { $match: { dorsal: "7" } },
    ]);
    console.log("🎯 Jugadores con dorsal 7:", filtrarpordorsal);

    // Buscar equipos con nombres de jugadores
    const equiposConJugadores = await EquipoModel.aggregate([
      {
        $lookup: {
          from: "jugadors", // Nombre de la colección en MongoDB (asegúrate de que sea correcto)
          localField: "jugadores",
          foreignField: "_id",
          as: "jugadoresInfo",
        },
      },
      { $project: { name: 1, liga: 1, jugadores: "$jugadoresInfo.name" } },
    ]);
    console.log("📋 Equipos con nombres de jugadores:", equiposConJugadores);

    // Contar jugadores por equipo
    const jugadoresPorEquipo = await EquipoModel.aggregate([
      { $project: { name: 1, totalJugadores: { $size: "$jugadores" } } },
    ]);
    console.log("📊 Cantidad de jugadores por equipo:", jugadoresPorEquipo);

    // Buscar equipo con más jugadores
    const equipoConMasJugadores = await EquipoModel.aggregate([
      { $project: { name: 1, totalJugadores: { $size: "$jugadores" } } },
      { $sort: { totalJugadores: -1 } },
      { $limit: 1 },
    ]);
    console.log("🏅 Equipo con más jugadores:", equipoConMasJugadores);
  } catch (error) {
    console.error("❌ Error en la base de datos:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Conexión cerrada");
  }
}

main();
