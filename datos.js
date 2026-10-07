// datos.js - BASE DE DATOS CENTRALIZADA DE LA LIGA
const PARTIDAS_POR_JORNADA = 4;
const PUNTOS_POR_VICTORIA = 3;

// Registro de cada jornada jugada
const historialJornadas = [
    {
        jornada: 1,
        resultados: [
            { jugador: "Javier Vicente \"Icy\"", deck: "Oath", puntos: 12 },
            { jugador: "Josan Perez", deck: "Burn", puntos: 9 },
            { jugador: "Cache", deck: "Goblins", puntos: 6 },
            { jugador: "Nacho Diaz", deck: "Stiflenought", puntos: 3 },
            { jugador: "Patricio", deck: "The Rock", puntos: 3 },
            { jugador: "Carlos Berna", deck: "Elves", puntos: 3 },
            { jugador: "Juanra", deck: "Deadguy Ale", puntos: 0 },
            { jugador: "Warti", deck: "Enchantress", puntos: 0 },
            { jugador: "Antonio Meseguer", deck: "Sligh", puntos: 0 }
        ]
    },
    {
        jornada: 2,
        resultados: [
            { jugador: "Antonio Meseguer", deck: "Sligh", puntos: 10 }, // 3V 1E por ejemplo
            { jugador: "Warti", deck: "Enchantress", puntos: 7 },
            { jugador: "Carlos Berna", deck: "Elves", puntos: 6 },
            { jugador: "Efren", deck: "Reanimator", puntos: 3 },
            { jugador: "Pitu", deck: "Goblins", puntos: 3 },
            { jugador: "Javier Vicente \"Icy\"", deck: "Oath", puntos: 3 }
        ]
    }
    // Cuando juegues una nueva jornada, solo añades el bloque aquí:
    /*
    ,{
        jornada: 3,
        resultados: [
            { jugador: "Nombre", deck: "NombreDeck", puntos: 12 },
            ...
        ]
    }
    */
];

// Función utilitaria para procesar estadísticas acumuladas de Decks
function obtenerEstadisticasDecks() {
    const decksMap = {};

    historialJornadas.forEach(jornada => {
        jornada.resultados.forEach(res => {
            if (!res.deck) return;

            if (!decksMap[res.deck]) {
                decksMap[res.deck] = {
                    nombre: res.deck,
                    jugadorPrincipal: res.jugador,
                    victorias: 0,
                    derrotas: 0,
                    partidasTotales: 0,
                    puntosTotales: 0
                };
            }

            // Estimación de V/D según puntos (3 pts por victoria)
            const victorias = Math.floor(res.puntos / PUNTOS_POR_VICTORIA);
            const derrotas = PARTIDAS_POR_JORNADA - victorias;

            decksMap[res.deck].victorias += victorias;
            decksMap[res.deck].derrotas += Math.max(0, derrotas);
            decksMap[res.deck].partidasTotales += PARTIDAS_POR_JORNADA;
            decksMap[res.deck].puntosTotales += res.puntos;
            // Actualiza al último jugador registrado
            decksMap[res.deck].jugadorPrincipal = res.jugador;
        });
    });

    return Object.values(decksMap).map(d => {
        const wr = d.partidasTotales > 0 ? (d.victorias / d.partidasTotales) * 100 : 0;
        return {
            ...d,
            winrate: parseFloat(wr.toFixed(1))
        };
    }).sort((a, b) => b.winrate - a.winrate || b.victorias - a.victorias);
}