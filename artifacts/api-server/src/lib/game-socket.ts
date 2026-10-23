import { randomInt, randomUUID } from "node:crypto";
import type { Server as HttpServer } from "node:http";
import { Server, Socket } from "socket.io";

const PREGUNTAS = [
// ==========================================
// BLOQUE 1: GEOGRAFÍA, MARES Y PAÍSES
// ==========================================
{ texto: "¿Cuántos kilómetros de longitud tiene el río Amazonas?", valor: 6992 },
{ texto: "¿Cuántos kilómetros de longitud tiene el río Nilo?", valor: 6650 },
{ texto: "¿Cuántos kilómetros de longitud tiene el río Yangtsé en China?", valor: 6300 },
{ texto: "¿Cuántos kilómetros de longitud tiene el río Misisipi?", valor: 3766 },
{ texto: "¿Cuántos kilómetros de longitud tiene el río Danubio?", valor: 2850 },
{ texto: "¿Cuántos kilómetros de longitud tiene el río Rin en Europa?", valor: 1233 },
{ texto: "¿Cuántos kilómetros de longitud tiene el río Ebro en España?", valor: 910 },
{ texto: "¿Cuántos kilómetros de longitud tiene el río Tajo en la península ibérica?", valor: 1007 },
{ texto: "¿Cuántos kilómetros de longitud tiene el río Duero?", valor: 897 },
{ texto: "¿Cuántos kilómetros de longitud tiene el río Guadalquivir?", valor: 657 },
{ texto: "¿Cuántos kilómetros de longitud tiene el río Sena en Francia?", valor: 777 },
{ texto: "¿Cuántos kilómetros de longitud tiene el río Támesis en Inglaterra?", valor: 346 },
{ texto: "¿Cuántos kilómetros de longitud tiene el río Volga (el más largo de Europa)?", valor: 3530 },
{ texto: "¿Cuántos países soberanos e independientes existen en el continente africano?", valor: 54 },
{ texto: "¿Cuántos países independientes forman el continente asiático?", valor: 48 },
{ texto: "¿Cuántos países independientes componen el continente europeo?", valor: 44 },
{ texto: "¿Cuántos países independientes forman América del Sur?", valor: 12 },
{ texto: "¿Cuántos países componen América Central (sin contar México ni el Caribe)?", valor: 7 },
{ texto: "¿Cuántos países miembros forman la Unión Europea?", valor: 27 },
{ texto: "¿Cuántos países forman parte de la Organización de las Naciones Unidas (ONU)?", valor: 193 },
{ texto: "¿Cuántos países distintos atraviesan la línea del Ecuador en la Tierra?", valor: 13 },
{ texto: "¿Cuántos husos horarios diferentes tiene el territorio de Rusia?", valor: 11 },
{ texto: "¿Cuántos husos horarios oficiales tiene Estados Unidos continental (sin Hawái ni Alaska)?", valor: 4 },
{ texto: "¿Cuántos países tienen frontera terrestre directa con Brasil?", valor: 10 },
{ texto: "¿Cuántos países tienen frontera terrestre directa con China?", valor: 14 },
{ texto: "¿Cuántos países tienen frontera terrestre directa con Alemania?", valor: 9 },
{ texto: "¿Cuántos kilómetros de frontera terrestre comparten Estados Unidos y Canadá?", valor: 8891 },
{ texto: "¿Cuántos kilómetros de frontera terrestre comparten España y Portugal (La Raya)?", valor: 1214 },
{ texto: "¿Cuántos kilómetros de frontera terrestre comparten España y Francia?", valor: 656 },
{ texto: "¿Cuántos kilómetros mide la frontera terrestre entre México y Estados Unidos?", valor: 3145 },
{ texto: "¿Cuántos kilómetros de costa tiene aproximadamente Noruega (contando sus fiordos)?", valor: 25148 },
{ texto: "¿Cuántos kilómetros de costa marítima tiene en total España?", valor: 7880 },
{ texto: "¿Cuántos kilómetros de costa tiene Italia?", valor: 7600 },
{ texto: "¿Cuántas islas con más de 100 km² de superficie tiene Grecia?", valor: 16 },
{ texto: "¿Cuántas islas forman en total el archipiélago de Filipinas?", valor: 7641 },
{ texto: "¿Cuántas islas forman en total el país de Indonesia?", valor: 17508 },
{ texto: "¿Cuántas islas mayores e islotes componen Japón?", valor: 14125 },
{ texto: "¿Cuántas islas principales forman las Islas Canarias?", valor: 8 },
{ texto: "¿Cuántas islas principales habitadas componen las Islas Baleares?", valor: 4 },
{ texto: "¿A cuántos metros bajo el nivel del mar se encuentra la orilla del Mar Muerto?", valor: 430 },
{ texto: "¿Cuántos metros de profundidad máxima tiene la Fosa de las Marianas?", valor: 10994 },
{ texto: "¿Cuántos metros de profundidad máxima tiene el Lago Baikal en Rusia?", valor: 1642 },
{ texto: "¿Cuántos metros de profundidad máxima tiene el Mar Mediterráneo?", valor: 5267 },
{ texto: "¿Cuántos metros de profundidad media tiene el Océano Atlántico?", valor: 3646 },
{ texto: "¿Cuántos metros de altitud tiene el Monte Everest?", valor: 8848 },
{ texto: "¿Cuántos metros de altitud tiene el K2 (la segunda montaña más alta del mundo)?", valor: 8611 },
{ texto: "¿Cuántos metros de altitud tiene el Aconcagua (el pico más alto de América)?", valor: 6961 },
{ texto: "¿Cuántos metros de altitud tiene el Kilimanjaro en Tanzania?", valor: 5895 },
{ texto: "¿Cuántos metros de altitud tiene el Mont Blanc en los Alpes?", valor: 4808 },
{ texto: "¿Cuántos metros de altitud tiene el Teide en Tenerife?", valor: 3718 },
{ texto: "¿Cuántos metros de altitud tiene el Mulhacén en Sierra Nevada (Granada)?", valor: 3479 },
{ texto: "¿Cuántos metros de altitud tiene el Aneto en los Pirineos?", valor: 3404 },
{ texto: "¿Cuántos metros de altitud tiene el pico Chullo, el más alto de Almería?", valor: 2611 },
{ texto: "¿Cuántos metros de altitud tiene el monte Fuji en Japón?", valor: 3776 },
{ texto: "¿Cuántos metros de altitud tiene el volcán Etna en Sicilia?", valor: 3357 },
{ texto: "¿Cuántos metros de altitud tiene el monte Vesubio en Italia?", valor: 1281 },
{ texto: "¿Cuántos volcanes activos existen actualmente en todo el mundo aproximadamente?", valor: 1350 },
{ texto: "¿Cuántos volcanes activos o potencialmente activos tiene Japón?", valor: 111 },
{ texto: "¿Cuántos kilómetros cuadrados de superficie tiene el Desierto del Sahara (en miles)?", valor: 9200 },
{ texto: "¿Cuántos kilómetros de longitud tiene el Canal de Suez en Egipto?", valor: 193 },
{ texto: "¿Cuántos kilómetros de longitud tiene el Canal de Panamá?", valor: 82 },
{ texto: "¿Cuántos kilómetros mide el Estrecho de Gibraltar en su tramo más estrecho?", valor: 14 },
{ texto: "¿Cuántos kilómetros de longitud tiene el Estrecho de Magallanes en Chile?", valor: 570 },
{ texto: "¿Cuántos países del mundo no tienen salida al mar (países sin litoral)?", valor: 44 },
{ texto: "¿Cuántos países del mundo tienen territorio en más de un continente (transcontinentales)?", valor: 18 },
{ texto: "¿Cuántos kilómetros cuadrados tiene el país más pequeño del mundo (Ciudad del Vaticano)?", valor: 1 },
{ texto: "¿Cuántos kilómetros cuadrados de superficie tiene el Principado de Mónaco?", valor: 2 },
{ texto: "¿Cuántos kilómetros cuadrados de superficie tiene Andorra?", valor: 468 },
{ texto: "¿Cuántos estados componen los Estados Unidos de América?", valor: 50 },
{ texto: "¿Cuántos estados componen los Estados Unidos Mexicanos?", valor: 31 },
{ texto: "¿Cuántas provincias y territorios componen Canadá?", valor: 13 },
{ texto: "¿Cuántos departamentos forman el territorio de Francia continental?", valor: 96 },
{ texto: "¿Cuántas provincias tiene en total España?", valor: 50 },
{ texto: "¿Cuántos municipios tiene la provincia de Almería?", valor: 103 },
{ texto: "¿Cuántos municipios tiene la provincia de Madrid?", valor: 179 },
{ texto: "¿Cuántos municipios tiene la provincia de Barcelona?", valor: 311 },
{ texto: "¿Cuántos municipios componen toda España en total (en miles)?", valor: 8131 },
{ texto: "¿Cuántos kilómetros de longitud tiene la Gran Barrera de Coral en Australia?", valor: 2300 },
{ texto: "¿Cuántos lagos se estima que tiene Finlandia (el país de los mil lagos) (en miles)?", valor: 188 },
{ texto: "¿Cuántas islas forman el archipiélago de las Maldivas?", valor: 1192 },
{ texto: "¿Cuántas playas oficiales tiene catalogadas la provincia de Valencia?", valor: 74 },
{ texto: "¿Cuántas playas y calas vírgenes tiene aprox. el Cabo de Gata en Almería?", valor: 60 },
{ texto: "¿A cuántos metros sobre el nivel del mar está la ciudad de La Paz (Bolivia)?", valor: 3640 },
{ texto: "¿A cuántos metros sobre el nivel del mar se encuentra Madrid capital?", valor: 657 },
{ texto: "¿A cuántos metros de altitud está la ciudad de Quito (Ecuador)?", valor: 2850 },
{ texto: "¿Cuántos kilómetros cuadrados de superficie tiene el Lago Superior (en miles)?", valor: 82 },
{ texto: "¿Cuántos países atraviesa el río Danubio desde Alemania hasta el Mar Negro?", valor: 10 },
{ texto: "¿Cuántos países atraviesa el río Rin en Europa?", valor: 6 },
{ texto: "¿Cuántos kilómetros mide de norte a sur el continente africano?", valor: 8000 },
{ texto: "¿Cuántos kilómetros mide de este a oeste el continente asiático?", valor: 9700 },
{ texto: "¿Cuántos millones de habitantes tiene el país más poblado del mundo (India)?", valor: 1428 },
{ texto: "¿Cuántos millones de habitantes tiene Estados Unidos aproximadamente?", valor: 335 },
{ texto: "¿Cuántos millones de habitantes tiene la República Democrática del Congo?", valor: 102 },
{ texto: "¿Cuántos millones de habitantes tiene Tokio (su área metropolitana completa)?", valor: 37 },
{ texto: "¿Cuántos millones de habitantes tiene España oficialmente?", valor: 48 },
{ texto: "¿Cuántos millones de habitantes tiene la isla de Gran Bretaña?", valor: 67 },
{ texto: "¿Cuántos kilómetros en línea recta separan Madrid de Moscú (Rusia)?", valor: 3440 },
{ texto: "¿Cuántos kilómetros en línea recta separan Madrid de Buenos Aires (Argentina)?", valor: 10040 },
{ texto: "¿Cuántos kilómetros en línea recta separan Madrid de Pekín (China)?", valor: 9230 },
{ texto: "¿Cuántos kilómetros de longitud tiene la cordillera de los Andes en Sudamérica?", valor: 7240 },
  { texto: "¿Cuántos metros de altura total mide el rascacielos Burj Khalifa en Dubái?", valor: 828 },
  { texto: "¿Cuántas plantas habitables tiene el Empire State Building de Nueva York?", valor: 102 },
  { texto: "¿Cuántos metros de altura tiene la Torre Eiffel de París incluyendo su antena actual?", valor: 330 },
  { texto: "¿Cuántos metros mide la estatua del Cristo Redentor de Río de Janeiro (con pedestal)?", valor: 38 },
  { texto: "¿Cuántos kilómetros de longitud tiene el túnel ferroviario de base de San Gotardo en Suiza?", valor: 57 },
  { texto: "¿Cuántas estaciones activas tiene el sistema de metro de la ciudad de Nueva York?", valor: 472 },
  { texto: "¿Hace cuántos años se inauguró oficialmente la Ópera de Sídney en Australia?", valor: 51 },
  { texto: "¿Cuántos arcos de entrada principales tiene la fachada perimetral en cada nivel del Coliseo de Roma?", valor: 80 },
  { texto: "¿Cuántos metros de altura tiene la Gran Pirámide de Guiza en la actualidad?", valor: 139 },
  { texto: "¿Cuántos metros de caída libre tiene el Salto Ángel en Venezuela, la cascada más alta del mundo?", valor: 807 },
  { texto: "¿Cuántos distritos municipales componen la ciudad de París (arrondissements)?", valor: 20 },
  { texto: "¿Cuántos kilómetros de longitud mide el Canal de Suez en Egipto?", valor: 193 },
  { texto: "¿Hace cuántos años se inauguró oficialmente el Canal de Panamá?", valor: 110 },
  { texto: "¿Cuántos metros de altura sobre el suelo tiene el mirador principal del London Eye?", valor: 135 },
  { texto: "¿Cuántos metros mide de alto la Estatua de la Libertad desde la base del pedestal hasta la antorcha?", valor: 93 },
  { texto: "¿Cuántos pilares o columnas sostienen la gran sala hipóstila del Templo de Karnak en Egipto?", valor: 134 },
  { texto: "¿Cuántos escalones tiene la escalera interior de la Torre de Pisa?", valor: 294 },
  { texto: "¿Cuántas estaciones de metro tiene actualmente la red de Metro de París?", valor: 308 },
  { texto: "¿Cuántos metros de altura tiene la Torre de Shanghái, el edificio más alto de China?", valor: 632 },
  { texto: "¿Hace cuántos años se completó la construcción del puente de Brooklyn en Nueva York?", valor: 141 },
  { texto: "¿Cuántos kilómetros mide aproximadamente el Gran Puente de Danyang-Kunshan en China?", valor: 165 },
  { texto: "¿Cuántas columnas de mármol decoran el famoso Patio de los Leones de la Alhambra?", valor: 124 },
  { texto: "¿Cuántas torres proyectó en total Antoni Gaudí para la basílica de la Sagrada Familia?", valor: 18 },
  { texto: "¿Cuántos metros de altura tiene la Torre de Collserola en Barcelona?", valor: 288 },
  { texto: "¿Cuántas estaciones tiene la línea circular histórica (Koltsevaya) del Metro de Moscú?", valor: 12 },
  { texto: "¿Hace cuántos años se inauguró la Torre Eiffel con motivo de la Exposición Universal de París?", valor: 135 },
  { texto: "¿Cuántos metros de altura mide el Obelisco de Buenos Aires?", valor: 67 },
  { texto: "¿Cuántas esclusas dobles tiene el recorrido original del Canal de Panamá?", valor: 6 },
  { texto: "¿Cuántos metros de profundidad bajo tierra alcanza la estación Arsenalna del metro de Kiev?", valor: 105 },
  { texto: "¿Hace cuántos años se completó la construcción del mausoleo del Taj Mahal en la India?", valor: 371 },
  { texto: "¿Cuántos metros de diámetro interior tiene la cúpula del Panteón de Agripa en Roma?", valor: 43 },
  { texto: "¿Cuántos metros de altura tiene el rascacielos One World Trade Center de Nueva York?", valor: 541 },
  { texto: "¿Cuántos distritos municipales componen administrativamente la ciudad de Madrid?", valor: 21 },
  { texto: "¿Cuántos distritos municipales tiene la ciudad de Barcelona?", valor: 10 },
  { texto: "¿Cuántos kilómetros de longitud tiene el tramo submarino del Eurotúnel bajo el Canal de la Mancha?", valor: 38 },
  { texto: "¿Cuántos metros mide el vano central suspendido del puente Akashi Kaikyo en Japón?", valor: 1991 },
  { texto: "¿Cuántos metros de altura tiene la Torre Cepsa en el complejo Cuatro Torres de Madrid?", valor: 248 },
  { texto: "¿Cuántos kilómetros de longitud cubría la muralla romana de Adriano en Gran Bretaña?", valor: 117 },
  { texto: "¿Hace cuántos años se produjo la caída histórica del Muro de Berlín?", valor: 35 },
  { texto: "¿Cuántos metros de altura tiene el Monumento a Washington en Estados Unidos?", valor: 169 },
  { texto: "¿Cuántos metros de ancho aproximado tiene la Avenida 9 de Julio de Buenos Aires en su punto mayor?", valor: 140 },
  { texto: "¿Cuántos escalones hay que subir para llegar a la cima de la cúpula de San Pedro en el Vaticano?", valor: 551 },
  { texto: "¿Hace cuántos años se inauguró oficialmente Brasilia como capital de Brasil?", valor: 64 },
  { texto: "¿Cuántas puertas reales monumentales daban acceso al recinto de la cerca de Felipe IV en Madrid?", valor: 5 },
  { texto: "¿Cuántas ramas o frondas residenciales tiene la isla artificial Palm Jumeirah en Dubái?", valor: 16 },
  { texto: "¿Cuántos metros de altura tiene la Torre Elizabeth (que alberga el Big Ben) en Londres?", valor: 96 },
  { texto: "¿Cuántas hectáreas de superficie ocupa el Parque de El Retiro en Madrid?", valor: 125 },
  { texto: "¿Cuántos metros de altura tiene la Torre CN de Toronto?", valor: 553 },
  { texto: "¿Hace cuántos años se inició la construcción del Coliseo de Roma bajo el mandato de Vespasiano?", valor: 1952 },
  { texto: "¿Cuántos metros de diámetro tiene la Plaza de la Concordia de París?", valor: 240 },
  { texto: "¿Cuántas columnas dóricas componen la fachada frontal principal del Partenón de Atenas?", valor: 8 },
  { texto: "¿Cuántas columnas perimetrales exteriores tiene en total el Partenón de Atenas?", valor: 46 },
  { texto: "¿Cuántos metros de longitud total tiene el Viaducto de Millau en Francia?", valor: 2460 },
  { texto: "¿Cuántos metros de altura alcanza el pilar más alto del Viaducto de Millau?", valor: 343 },
  { texto: "¿Cuántas estaciones componen la red activa del Metro de Londres?", valor: 272 },
  { texto: "¿Cuántos kilómetros recorre la ruta principal del ferrocarril Transiberiano entre Moscú y Vladivostok?", valor: 9289 },
  { texto: "¿Hace cuántos años se inauguró la primera línea subterránea de metro del mundo en Londres?", valor: 161 },
  { texto: "¿Cuántas plantas sobre rasante tiene el rascacielos Taipei 101 en Taiwán?", valor: 101 },
  { texto: "¿Cuántos metros de altura tienen las Torres Petronas en Kuala Lumpur?", valor: 452 },
  { texto: "¿Cuántas ventanas y balcones tiene la fachada del Palacio Real de Versalles?", valor: 2153 },
  { texto: "¿Cuántos kilómetros mide el trazado completo del Acueducto de Segovia desde su captación?", valor: 16 },
  { texto: "¿Cuántos arcos visibles forman la doble arquería monumental del Acueducto de Segovia?", valor: 167 },
  { texto: "¿Cuántas plantas tiene el rascacielos Gran Torre Santiago (Costanera Center) en Chile?", valor: 62 },
  { texto: "¿Cuántos metros de altura alcanza la Giralda de Sevilla con el Giraldillo incluido?", valor: 104 },
  { texto: "¿Hace cuántos años comenzaron las obras de construcción de la catedral de Notre Dame de París?", valor: 861 },
  { texto: "¿Cuántas columnas de mármol, jaspe y granito se conservan en la Mezquita de Córdoba?", valor: 856 },
  { texto: "¿Cuántos metros de altura tiene el Arco del Triunfo de París?", valor: 50 },
  { texto: "¿Cuántos metros mide la estatua de ¡La Madre Patria Llama! en Volgogrado?", valor: 85 },
  { texto: "¿Hace cuántos años se inauguró el Museo Guggenheim de Bilbao?", valor: 27 },
  { texto: "¿Cuántas plataformas o terrazas superpuestas componen el templo de Borobudur en Indonesia?", valor: 9 },
  { texto: "¿Cuántos metros de longitud tiene la presa hidroeléctrica de las Tres Gargantas en China?", valor: 2335 },
  { texto: "¿Cuántos metros de altura sobre el lecho del río tiene la presa de las Tres Gargantas?", valor: 185 },
  { texto: "¿Cuántos metros de altura tiene la Pirámide del Sol en Teotihuacán?", valor: 65 },
  { texto: "¿Cuántos escalones suman en total las cuatro caras más la plataforma superior de la pirámide de Kukulcán?", valor: 365 },
  { texto: "¿Cuántos puentes peatonales cruzan el Gran Canal de Venecia?", valor: 4 },
  { texto: "¿Cuántos metros de anchura máxima tiene la elipse de la Plaza de San Pedro en el Vaticano?", valor: 240 },
  { texto: "¿Cuántas hectáreas ocupa Central Park en Manhattan?", valor: 341 },
  { texto: "¿Hace cuántos años se consagró formalmente la Basílica de San Pedro en Roma?", valor: 398 },
  { texto: "¿Cuántos metros de altura tiene la Torre Latinoamericana de Ciudad de México?", valor: 181 },
  { texto: "¿Cuántos kilómetros de longitud tiene el túnel submarino Seikan en Japón?", valor: 54 },
  { texto: "¿Cuántas torres y torreones componen la silueta del Castillo de Neuschwanstein en Baviera?", valor: 14 },
  { texto: "¿Cuántos metros de altura sobre el suelo alcanza el Palacio del Parlamento de Bucarest?", valor: 84 },
  { texto: "¿Cuántas habitaciones y salas tiene en su interior el Palacio del Parlamento de Bucarest?", valor: 1100 },
  { texto: "¿Hace cuántos años se abrió al tráfico el puente Golden Gate de San Francisco?", valor: 87 },
  { texto: "¿Cuántos metros de altura tienen las torres del puente Golden Gate sobre el nivel del mar?", valor: 227 },
  { texto: "¿Cuántas estaciones en servicio tiene la red de Metro de Santiago de Chile?", valor: 136 },
  { texto: "¿Cuántos metros de longitud total tiene el puente Vasco da Gama en Lisboa?", valor: 17180 },
  { texto: "¿Cuántas plantas habitables tiene el rascacielos The Shard en Londres?", valor: 72 },
  { texto: "¿Cuántos metros de altura mide The Shard en Londres?", valor: 310 },
  { texto: "¿Cuántas fuentes principales ornamentan el parque del Palacio de Peterhof en San Petersburgo?", valor: 176 },
  { texto: "¿Hace cuántos años comenzaron las obras de excavación del Canal de Suez?", valor: 165 },
  { texto: "¿Cuántos kilómetros de vías operativas tiene la red de metro de Shanghái?", valor: 831 },
  { texto: "¿Cuántos metros de longitud tiene la pasarela colgante peatonal Sky Bridge 721 en Chequia?", valor: 721 },
  { texto: "¿Cuántas plantas tiene el rascacielos helicoidal Turning Torso de Malmö?", valor: 54 },
  { texto: "¿Cuántos metros de altura tiene la Columna de la Independencia en Ciudad de México?", valor: 45 },
  { texto: "¿Hace cuántos años se fundó la antigua ciudad lacustre de México-Tenochtitlan?", valor: 699 },
  { texto: "¿Cuántas líneas de tren subterráneo integran la red combinada del Metro de Tokio?", valor: 13 },
  { texto: "¿Cuántos metros de caída vertical tiene el Puente Nuevo sobre la garganta del Tajo en Ronda?", valor: 98 },
  { texto: "¿Cuántas puertas de acceso tiene el recinto amurallado románico de la ciudad de Ávila?", valor: 9 },
  { texto: "¿Cuántos torreones semicirculares salpican las murallas medievales de Ávila?", valor: 87 },
{ texto: "¿Cuántos días dura aproximadamente el periodo de gestación de un elefante africano?", valor: 660 },
{ texto: "¿Cuántos corazones tiene un pulpo?", valor: 3 },
{ texto: "¿A cuántos kilómetros por hora puede llegar a correr un guepardo en carrera corta?", valor: 120 },
{ texto: "¿Cuántas vértebras cervicales tiene el cuello de una jirafa?", valor: 7 },
{ texto: "¿A cuántos kilómetros por hora puede descender en picado un halcón peregrino?", valor: 389 },
{ texto: "¿Cuántos huesos forman el esqueleto de un cuerpo humano adulto?", valor: 206 },
{ texto: "¿Cuántos dientes componen la dentición completa y definitiva de un ser humano adulto?", valor: 32 },
{ texto: "¿Cuántos cromosomas contiene una célula somática normal en el ser humano?", valor: 46 },
{ texto: "¿Cuántas costillas componen la caja torácica del ser humano en total?", valor: 24 },
{ texto: "¿Cuántos dientes de leche forman la dentición primaria o infantil de un ser humano?", valor: 20 },
{ texto: "¿Cuántos huesos componen la estructura anatómica de una sola mano humana?", valor: 27 },
{ texto: "¿Cuántos huesos forman la estructura ósea de un solo pie humano?", valor: 26 },
{ texto: "¿Qué porcentaje del cuerpo de una medusa común está formado por agua?", valor: 95 },
{ texto: "¿Cuántos metros de altura sobre el nivel del mar tiene la cima del monte Everest?", valor: 8849 },
{ texto: "¿Cuántos metros de altura tiene el K2, la segunda montaña más alta del planeta?", valor: 8611 },
{ texto: "¿Cuántos metros de altitud tiene la cumbre del cerro Aconcagua en Argentina?", valor: 6961 },
{ texto: "¿Cuántos metros de altura oficial tiene el Mont Blanc en los Alpes?", valor: 4808 },
{ texto: "¿Cuántos metros de altitud sobre el nivel del mar alcanza el pico del Teide en Tenerife?", valor: 3718 },
{ texto: "¿Cuántos metros de profundidad máxima alcanza el abismo Challenger en la fosa de las Marianas?", valor: 10994 },
{ texto: "¿Cuántos metros de profundidad máxima tiene el lago Baikal en Rusia, el más hondo del mundo?", valor: 1642 },
{ texto: "¿A cuántos metros bajo el nivel del mar se encuentra la superficie de las aguas del mar Muerto?", valor: 430 },
{ texto: "¿Cuántos metros de anchura total alcanzan los saltos de las cataratas del Iguazú?", valor: 2700 },
{ texto: "¿Cuántos metros de caída vertical tienen en su punto más alto las cataratas del Niágara?", valor: 51 },
{ texto: "¿Cuántos estados miembros soberanos forman oficialmente la Organización de las Naciones Unidas?", valor: 193 },
{ texto: "¿Por cuántos países del mundo pasa la línea ecuatorial terrestre?", valor: 13 },
{ texto: "¿Con cuántos países soberanos comparte frontera terrestre la República Popular China?", valor: 14 },
{ texto: "¿Cuántos países independientes integran el subcontinente de América del Sur?", valor: 12 },
{ texto: "¿Cuántos estados federales componen los Estados Unidos de América?", valor: 50 },
{ texto: "¿Cuántas provincias componen la división territorial del Reino de España?", valor: 50 },
{ texto: "¿Cuántas comunidades autónomas integran España (sin contar las dos ciudades autónomas)?", valor: 17 },
{ texto: "¿Cuántas lunas o satélites naturales confirmados orbitan el planeta Júpiter?", valor: 95 },
{ texto: "¿Cuántas lunas o satélites naturales confirmados tiene el planeta Saturno?", valor: 146 },
{ texto: "¿Cuántas lunas orbitan alrededor del planeta Marte?", valor: 2 },
{ texto: "¿Cuántas lunas confirmadas orbitan el planeta Urano?", valor: 28 },
{ texto: "¿Cuántas lunas confirmadas orbitan el planeta Neptuno?", valor: 16 },
{ texto: "¿Cuántos días dura el periodo de gestación promedio de una perra doméstica?", valor: 63 },
{ texto: "¿Cuántos días suele durar el periodo de gestación de una yegua?", valor: 340 },
{ texto: "¿Cuántos días dura habitualmente la gestación de una coneja doméstica?", valor: 31 },
{ texto: "¿Cuántos días de incubación requiere habitualmente un huevo de gallina para eclosionar?", valor: 21 },
{ texto: "¿Cuántos días de incubación necesita de media el huevo de un avestruz?", valor: 42 },
{ texto: "¿Cuántos ojos tiene la gran mayoría de especies de arañas del mundo?", valor: 8 },
{ texto: "¿Cuántas patas marchadoras tiene el cuerpo de un insecto adulto?", valor: 6 },
{ texto: "¿Cuántas patas tienen los animales pertenecientes al orden de los arácnidos?", valor: 8 },
{ texto: "¿Cuántas patas marchadoras poseen los crustáceos decápodos (como el cangrejo o la langosta)?", valor: 10 },
{ texto: "¿Cuántas extremidades en total (brazos más tentáculos) tiene un calamar común?", valor: 10 },
{ texto: "¿Cuántas aletas en total posee la anatomía externa de un tiburón blanco?", valor: 8 },
{ texto: "¿Cuántos años de vida cumplió en 2024 la tortuga gigante Jonathan, animal terrestre vivo más longevo?", valor: 192 },
{ texto: "¿Cuántos gramos de peso tiene como máximo un colibrí zunzuncito de Cuba (el ave más pequeña)?", valor: 2 },
{ texto: "¿Cuántos centímetros de envergadura alar máxima puede alcanzar un cóndor andino?", valor: 320 },
{ texto: "¿Cuántos centímetros de envergadura alar puede alcanzar el albatros viajero?", valor: 350 },
{ texto: "¿Cuántos metros de longitud máxima puede alcanzar el pez más grande del mundo, el tiburón ballena?", valor: 19 },
{ texto: "¿Cuántos metros de longitud máxima puede medir una hembra de calamar gigante?", valor: 13 },
{ texto: "¿A cuántas pulsaciones por minuto puede latir el corazón de un colibrí en pleno vuelo?", valor: 1200 },
{ texto: "¿Cuántas pulsaciones por minuto puede llegar a bajar el corazón de una ballena azul en inmersión?", valor: 2 },
{ texto: "¿Cuántas cavidades o compartimentos componen el aparato digestivo estomacal de una vaca?", valor: 4 },
{ texto: "¿Cuántas cavidades internas (aurículas y ventrículos) tiene el corazón de las aves y mamíferos?", valor: 4 },
{ texto: "¿Cuántas cavidades tiene el corazón de un pez?", valor: 2 },
{ texto: "¿Cuántas cavidades tiene el corazón de la gran mayoría de los reptiles?", valor: 3 },
{ texto: "¿Cuántas toneladas métricas de peso puede llegar a alcanzar una ballena azul adulta?", valor: 190 },
{ texto: "¿Hace cuántos millones de años impactó el asteroide que provocó la extinción de los dinosaurios?", valor: 66 },
{ texto: "¿Hace cuántos años pisó el ser humano la Luna por primera vez durante la misión Apolo 11?", valor: 55 },
{ texto: "¿Hace cuántos años alcanzó la expedición de Roald Amundsen el Polo Sur por primera vez?", valor: 113 },
{ texto: "¿Hace cuántos años zarpó la expedición de Magallanes y Elcano para dar la primera vuelta al mundo?", valor: 505 },
{ texto: "¿Hace cuántos años publicó Charles Darwin su célebre obra 'El origen de las especies'?", valor: 165 },
{ texto: "¿Hace cuántos años publicaron Watson y Crick el modelo de la estructura en doble hélice del ADN?", valor: 71 },
{ texto: "¿Hace cuántos años comenzó a aplicarse la penicilina a pacientes humanos como antibiótico?", valor: 82 },
{ texto: "¿Hace cuántos años tuvo lugar la cataclísmica erupción del volcán Krakatoa?", valor: 141 },
{ texto: "¿Hace cuántos años descubrió Howard Carter la tumba del faraón Tutankamón en Egipto?", valor: 102 },
{ texto: "¿Cuántos minutos tarda aproximadamente la luz del Sol en recorrer la distancia hasta la Tierra?", valor: 8 },
{ texto: "¿Cuántos segundos tarda la luz reflejada por la Luna en llegar a nuestro planeta?", valor: 1 },
{ texto: "¿Cuántos miles de kilómetros de distancia media separan el centro de la Tierra del de la Luna?", valor: 384 },
{ texto: "¿Cuántos kilómetros mide aproximadamente el diámetro ecuatorial del planeta Tierra?", valor: 12742 },
{ texto: "¿Cuántos kilómetros mide el diámetro ecuatorial de la Luna?", valor: 3474 },
{ texto: "¿Cuántos grados Celsius bajo cero marcó el récord histórico de temperatura fría en la Antártida?", valor: 89 },
{ texto: "¿Cuántos metros de caída total tiene la cascada del Salto del Tugela en Sudáfrica?", valor: 948 },
{ texto: "¿Cuántos grados puede llegar a rotar el cuello un búho común hacia cada lado?", valor: 270 },
{ texto: "¿A cuántos metros de profundidad puede sumergirse en el océano un pingüino emperador?", valor: 565 },
{ texto: "¿A cuántos kilómetros por hora puede desplazarse bajo el agua el pez vela?", valor: 110 },
{ texto: "¿Cuántos cuernos queratínicos tiene sobre su hocico un rinoceronte blanco africano?", valor: 2 },
{ texto: "¿Cuántas jorobas tiene el camello bactriano de Asia central?", valor: 2 },
{ texto: "¿Cuántas jorobas de reserva grasa posee un dromedario?", valor: 1 },
{ texto: "¿Cuántos dedos funcionales tiene cada pata de un avestruz?", valor: 2 },
{ texto: "¿Cuántas garras retráctiles tiene un gato doméstico sumando solo sus dos patas delanteras?", valor: 10 },
{ texto: "¿Cuántos metros de profundidad máxima tiene el mar Mediterráneo en la fosa de Calipso?", valor: 5267 },
{ texto: "¿Cuántos metros de profundidad máxima alcanza el Lago Superior en América del Norte?", valor: 406 },
{ texto: "¿Cuántos kilómetros de longitud tiene el cauce del río Danubio en Europa?", valor: 2850 },
{ texto: "¿Cuántos kilómetros de longitud mide el cauce fluvial del río Rin?", valor: 1233 },
{ texto: "¿Cuántos países independientes forman el continente africano?", valor: 54 },
{ texto: "¿Cuántos estados miembros soberanos forman en la actualidad la Unión Europea?", valor: 27 },
{ texto: "¿Qué porcentaje del volumen del aire que respiramos está compuesto por oxígeno?", valor: 21 },
{ texto: "¿Qué porcentaje del volumen del aire de la atmósfera terrestre está compuesto por nitrógeno?", valor: 78 },
{ texto: "¿Cuántos metros de altura mide la secuoya 'Hyperion', considerada el árbol más alto del mundo?", valor: 116 },
{ texto: "¿Cuántos años de antigüedad estimada tiene el pino 'Matusalén' en California?", valor: 4850 },
{ texto: "¿Cuántos elementos químicos componen formalmente la tabla periódica actual?", valor: 118 },
{ texto: "¿Cuántos kilómetros de espesor medio tiene la corteza continental de la Tierra?", valor: 35 },
{ texto: "¿Cuántos años suele tardar el planeta Saturno en completar una sola órbita alrededor del Sol?", valor: 29 },
{ texto: "¿Cuántos años tarda el planeta Urano en dar una vuelta completa al Sol?", valor: 84 },
{ texto: "¿Cuántos años tarda el lejano planeta Neptuno en completar una sola órbita solar?", valor: 165 },
{ texto: "¿Cuántos huesos forman la columna vertebral típica de un ser humano adulto (al fusionarse el sacro y cóccix)?", valor: 26 },
{ texto: "¿Cuántos años duró en total el conflicto conocido como la Guerra de los Cien Años entre Francia e Inglaterra?", valor: 116 },
{ texto: "¿Cuántos años duró la Guerra de los Treinta Años en Europa central?", valor: 30 },
{ texto: "¿Cuántos días duró la Guerra de los Seis Días en 1967 entre Israel y la coalición árabe?", valor: 6 },
{ texto: "¿Cuántos barcos componían la expedición inicial de Fernando de Magallanes en 1519?", valor: 5 },
{ texto: "¿Cuántos marineros regresaron en la nao Victoria capitaneada por Elcano completando la primera vuelta al mundo?", valor: 18 },
{ texto: "¿Cuántos botes salvavidas llevaba a bordo el transatlántico RMS Titanic en su viaje inaugural?", valor: 20 },
{ texto: "¿Hace cuántos años tuvo lugar el trágico naufragio del RMS Titanic tras chocar con un iceberg?", valor: 112 },
{ texto: "¿Cuántas esposas oficiales tuvo el rey Enrique VIII de Inglaterra a lo largo de su vida?", valor: 6 },
{ texto: "¿Cuántas tesis teológicas clavó según la tradición Martín Lutero en la iglesia de Wittenberg en 1517?", valor: 95 },
{ texto: "¿Cuántos delegados firmaron la Declaración de Independencia de los Estados Unidos en 1776?", valor: 56 },
{ texto: "¿Cuántas colonias norteamericanas originales se rebelaron contra la corona británica en 1776?", valor: 13 },
{ texto: "¿Hace cuántos años tuvo lugar la toma de la Bastilla que dio inicio a la Revolución Francesa?", valor: 235 },
{ texto: "¿Cuántos años de edad tenía Alejandro Magno en el momento de su muerte en Babilonia?", valor: 32 },
{ texto: "¿Cuántos presidentes de los Estados Unidos han sido asesinados durante el ejercicio de su mandato?", valor: 4 },
{ texto: "¿Hace cuántos años se firmó el armisticio que puso fin a la Primera Guerra Mundial?", valor: 106 },
{ texto: "¿Hace cuántos años concluyó formalmente la Segunda Guerra Mundial?", valor: 79 },
{ texto: "¿Hace cuántos años cayó la ciudad imperial de Constantinopla en manos del Imperio Otomano?", valor: 571 },
{ texto: "¿Hace cuántos años llegó Cristóbal Colón a la isla de Guanahani en su primer viaje a América?", valor: 532 },
{ texto: "¿Cuántas embarcaciones formaban la flotilla de Cristóbal Colón al zarpar del puerto de Palos en 1492?", valor: 3 },
{ texto: "¿Cuántas legiones romanas completas fueron aniquiladas en la batalla del bosque de Teutoburgo?", valor: 3 },
{ texto: "¿Hace cuántos años fue asesinado el archiduque Francisco Fernando en Sarajevo, detonante de la Gran Guerra?", valor: 110 },
{ texto: "¿Cuántos caballos tiraban habitualmente de una cuadriga en las carreras del Circo Máximo de Roma?", valor: 4 },
{ texto: "¿Cuántas colinas históricas conformaban el corazón geográfico de la antigua Roma?", valor: 7 },
{ texto: "¿Cuántos reyes gobernaron Roma durante el periodo monárquico previo a la República?", valor: 7 },
{ texto: "¿Cuántas Guerras Púnicas se libraron entre la República romana y Cartago?", valor: 3 },
{ texto: "¿Cuántos emperadores rigieron Roma durante la dinastía Julio-Claudia (desde Augusto hasta Nerón)?", valor: 5 },
{ texto: "¿Cuántos gobernantes se disputaron el trono de Roma durante el convulso 'Año de los cuatro emperadores' (69 d.C.)?", valor: 4 },
{ texto: "¿Cuántos barcos integraban la Gran Armada española enviada contra Inglaterra en 1588?", valor: 130 },
{ texto: "¿Hace cuántos años se firmó el Tratado de Versalles en el Salón de los Espejos?", valor: 105 },
{ texto: "¿Hace cuántos años estalló la Guerra Civil Española tras el golpe militar de 1936?", valor: 88 },
{ texto: "¿Hace cuántos años se aprobó en referéndum la actual Constitución Española de 1978?", valor: 46 },
{ texto: "¿Cuántos artículos principales integran el texto original de la Constitución de los Estados Unidos?", valor: 7 },
{ texto: "¿Cuántas enmiendas componen la célebre Carta de Derechos ('Bill of Rights') de Estados Unidos?", valor: 10 },
{ texto: "¿Cuántas enmiendas han sido ratificadas en total a la Constitución de los Estados Unidos?", valor: 27 },
{ texto: "¿Hace cuántos años triunfó la Revolución Bolchevique en Rusia bajo el liderazgo de Lenin?", valor: 107 },
{ texto: "¿Cuántas repúblicas socialistas formaban oficialmente la Unión Soviética en el momento de su disolución?", valor: 15 },
{ texto: "¿Cuántos países firmaron el Tratado de Roma en 1957 para crear la Comunidad Económica Europea?", valor: 6 },
{ texto: "¿Cuántos estados miembros fundaron inicialmente la alianza militar de la OTAN en 1949?", valor: 12 },
{ texto: "¿Cuántos países ocupan un asiento permanente en el Consejo de Seguridad de la ONU?", valor: 5 },
{ texto: "¿Cuántos miembros no permanentes integran periódicamente el Consejo de Seguridad de la ONU?", valor: 10 },
{ texto: "¿Hace cuántos años se lanzó al espacio el satélite Sputnik 1, iniciando la carrera espacial?", valor: 67 },
{ texto: "¿Hace cuántos años se convirtió Yuri Gagarin en el primer ser humano en viajar al espacio exterior?", valor: 63 },
{ texto: "¿Cuántos minutos duró el vuelo espacial orbital pionero de Yuri Gagarin a bordo de la Vostok 1?", valor: 108 },
{ texto: "¿Cuántos astronautas formaban la tripulación de la histórica misión Apolo 11 en 1969?", valor: 3 },
{ texto: "¿Cuántos astronautas en total han caminado sobre la superficie de la Luna en la historia?", valor: 12 },
{ texto: "¿Cuántas misiones tripuladas del programa Apolo lograron alunizar en la Luna?", valor: 6 },
{ texto: "¿Hace cuántos años ocurrió el desastre nuclear de la central de Chernóbil en Ucrania?", valor: 38 },
{ texto: "¿Cuántos años estuvo en pie el Muro de Berlín dividiendo la ciudad alemana?", valor: 28 },
{ texto: "¿Cuántos días de máxima tensión duró la Crisis de los Misiles de Cuba en octubre de 1962?", valor: 13 },
{ texto: "¿Cuántos días duró la Guerra de las Malvinas entre Argentina y el Reino Unido en 1982?", valor: 74 },
{ texto: "¿Hace cuántos años se produjeron los atentados del 11 de septiembre contra las Torres Gemelas y el Pentágono?", valor: 23 },
{ texto: "¿Cuántos aviones comerciales secuestraron los terroristas en los atentados del 11-S de 2001?", valor: 4 },
{ texto: "¿Cuántos años de régimen legal de segregación racial ('apartheid') rigieron en Sudáfrica (1948-1994)?", valor: 46 },
{ texto: "¿Cuántos años ininterrumpidos permaneció en prisión el activista y líder sudafricano Nelson Mandela?", valor: 27 },
{ texto: "¿Hace cuántos años falleció el dictador Francisco Franco, marcando el inicio de la Transición española?", valor: 49 },
{ texto: "¿Hace cuántos años tuvo lugar el intento de golpe de Estado militar del 23-F en España?", valor: 43 },
{ texto: "¿Cuántos días duró la experiencia revolucionaria de la Comuna de París en 1871?", valor: 72 },
{ texto: "¿Cuántos soldados espartanos resistieron junto al rey Leónidas en el paso de las Termópilas?", valor: 300 },
{ texto: "¿Cuántos años rigió como monarca la reina Victoria del Reino Unido durante su longevo mandato?", valor: 63 },
{ texto: "¿Cuántos años duró el histórico reinado de Isabel II del Reino Unido hasta su fallecimiento en 2022?", valor: 70 },
{ texto: "¿Cuántos años duró el reinado de Luis XIV de Francia, el reinado más largo documentado de la historia?", valor: 72 },
{ texto: "¿Cuántos años tenía Luis XIV de Francia cuando fue coronado oficialmente monarca?", valor: 4 },
{ texto: "¿Cuántos años rigió los destinos de China la célebre dinastía Ming (1368-1644)?", valor: 276 },
{ texto: "¿Cuántos años duró la construcción de la Catedral gótica de Colonia desde su inicio hasta su culminación en 1880?", valor: 632 },
{ texto: "¿Hace cuántos años descubrieron los soldados de Napoleón la clave lingüística de la Piedra de Rosetta?", valor: 225 },
{ texto: "¿Cuántas escrituras distintas (jeroglífico, demótico y griego) están inscritas en la Piedra de Rosetta?", valor: 3 },
{ texto: "¿Cuántas líneas por página tiene la célebre primera edición impresa de la Biblia de Gutenberg?", valor: 42 },
{ texto: "¿Cuántos miembros conformaban cada uno de los dos triunviratos de la República romana tardía?", valor: 3 },
{ texto: "¿Cuántas Guerras Carlistas se libraron en España a lo largo del siglo XIX?", valor: 3 },
{ texto: "¿Hace cuántos años se firmó la histórica Paz de Westfalia que rediseñó el mapa político europeo?", valor: 376 },
{ texto: "¿Hace cuántos años proclamó la Asamblea General de la ONU la Declaración Universal de los Derechos Humanos?", valor: 76 },
{ texto: "¿Cuántos artículos componen la Declaración Universal de los Derechos Humanos aprobada en 1948?", valor: 30 },
{ texto: "¿Cuántos días de travesía oceánica empleó Colón desde las Islas Canarias hasta avistar tierra en América en 1492?", valor: 36 },
{ texto: "¿Cuántos viajes de exploración realizó en total Cristóbal Colón al continente americano?", valor: 4 },
{ texto: "¿Hace cuántos años tuvo lugar el 'Motín del té' de Boston contra los impuestos coloniales británicos?", valor: 251 },
{ texto: "¿Cuántas cajas de té de la Compañía de las Indias Orientales fueron arrojadas al agua en el Motín de Boston?", valor: 342 },
{ texto: "¿Hace cuántos años arrojó el ejército estadounidense la primera bomba atómica sobre Hiroshima?", valor: 79 },
{ texto: "¿Cuántos días transcurrieron entre el lanzamiento de la bomba nuclear de Hiroshima y la de Nagasaki?", valor: 3 },
{ texto: "¿Cuántos miembros integraban el Comité de Salvación Pública jacobino liderado por Robespierre?", valor: 12 },
{ texto: "¿Hace cuántos años fue ejecutado en la guillotina el rey Luis XVI durante la Revolución Francesa?", valor: 231 },
{ texto: "¿Cuántos días exactos duró el regreso triunfal de Napoleón conocido como el Periodo de los Cien Días?", valor: 111 },
{ texto: "¿Hace cuántos años se libró la definitiva Batalla de Waterloo que supuso la derrota final de Napoleón?", valor: 209 },
{ texto: "¿Hace cuántos años tuvo lugar el combate naval de Trafalgar en las costas andaluzas?", valor: 219 },
{ texto: "¿Cuántos navíos de línea sumaban la flota combinada franco-española en la Batalla de Trafalgar?", valor: 33 },
{ texto: "¿Cuántos barcos de línea mandaba el almirante Nelson en la escuadra británica durante Trafalgar?", valor: 27 },
{ texto: "¿Hace cuántos años se promulgó la primera Constitución liberal de España ('La Pepa') en Cádiz?", valor: 212 },
{ texto: "¿Cuántos títulos componen el cuerpo de la Constitución Española de 1978 (incluyendo el Título Preliminar)?", valor: 11 },
{ texto: "¿Cuántos artículos componen en total el texto de la Constitución Española de 1978?", valor: 169 },
{ texto: "¿Hace cuántos años fue asesinado el dictador Julio César en el senado de Roma durante los Idus de Marzo?", valor: 2068 },
{ texto: "¿Cuántas puñaladas recibió Julio César según relató el historiador romano Suetonio?", valor: 23 },
{ texto: "¿Cuántos días duró el heroico e implacable asedio militar de Leningrado en la Segunda Guerra Mundial?", valor: 872 },
{ texto: "¿Hace cuántos años se disolvió oficialmente la Unión Soviética mediante la firma del Tratado de Belavezha?", valor: 33 },
{ texto: "¿Cuántos días duró la crisis diplomática de los rehenes estadounidenses en la embajada de Teherán?", valor: 444 },
{ texto: "¿Cuántos senadores componían el senado romano reformado por el dictador Lucio Cornelio Sila?", valor: 600 },
{ texto: "¿Hace cuántos años fundó Napoleón Bonaparte el Banco de Francia?", valor: 224 },
{ texto: "¿Cuántos días resistieron los rebeldes tejanos el asedio mexicano en la célebre misión de El Álamo?", valor: 13 },
{ texto: "¿Cuántos días duró el mandato del papa Juan Pablo I antes de su repentino fallecimiento en 1978?", valor: 33 },
{ texto: "¿Cuántos años tenía Juana de Arco cuando murió en la hoguera de Ruan en 1431?", valor: 19 },
{ texto: "¿Cuántas personas integraban el primer grupo de colonos puritanos del Mayflower en 1620?", valor: 102 },
];
type Phase = "LOBBY" | "BETTING" | "DECISION" | "RESULTS";
type Decision = "STAY" | "LEAVE";

interface Player {
  id: string;
  name: string;
  socketId: string;
  connected: boolean;
  hasActed: boolean;
  folded: boolean;
}

interface RoundScore {
  playerId: string;
  name: string;
  isCaptain: boolean;
  decision: Decision;
  pointsEarned: number;
  scoreTotal: number;
}
const QUESTIONS = PREGUNTAS.map(p => ({ text: p.texto, answer: p.valor }));
interface Room {
  code: string;
  hostPlayerId: string;
  players: Player[];
  phase: Phase;
  question: (typeof QUESTIONS)[number] | null;
  currentBid: number;
  isTriplazo: boolean;
  captainId: string | null;
  turnPlayerId: string | null;
  roundStarterId: string | null;
  roundNumber: number;
  scores: Record<string, number>;
  decisions: Record<string, Decision>;
  latestResults: RoundScore[] | null;
  latestOutcome: "SUCCESS" | "CRASH" | null;
}

interface AckResult {
  success: boolean;
  message?: string;
  playerId?: string;
  room?: ReturnType<typeof roomSnapshot>;
}

type Ack = (result: AckResult) => void;

const rooms = new Map<string, Room>();
let gameIo: Server | undefined;
const codeAlphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function createRoomCode(): string {
  let code = "";
  do {
    let suffix = "";
    for (let index = 0; index < 4; index += 1) {
      suffix += codeAlphabet[randomInt(codeAlphabet.length)];
    }
    code = `TOLAS${suffix}`;
  } while (rooms.has(code));
  return code;
}

function cleanPlayerName(value: unknown): string {
  if (typeof value !== "string") return "Pasajero";
  return value.trim().slice(0, 24) || "Pasajero";
}

function roomSnapshot(room: Room) {
  const captain = room.players.find((player) => player.id === room.captainId);
  const currentTurn = room.players.find((player) => player.id === room.turnPlayerId);

  return {
    code: room.code,
    hostPlayerId: room.hostPlayerId,
    phase: room.phase,
    players: room.players.map((player) => ({
      id: player.id,
      name: player.name,
      connected: player.connected,
      isHost: player.id === room.hostPlayerId,
      hasActed: player.hasActed,
      folded: player.folded,
    })),
    game: {
      question: room.question?.text ?? "",
      currentBid: room.currentBid,
      isTriplazo: room.isTriplazo,
      captainId: room.captainId,
      captainName: captain?.name ?? "",
      turnPlayerId: room.turnPlayerId,
      turnPlayerName: currentTurn?.name ?? "",
      roundNumber: room.roundNumber,
      scores: { ...room.scores },
      submittedPlayerIds: Object.keys(room.decisions),
      results: room.latestResults,
      outcome: room.latestOutcome,
      // The answer is deliberately sent only after the round is resolved.
      actualValue: room.phase === "RESULTS" ? room.question?.answer ?? null : null,
    },
  };
}

function emitRoomState(room: Room) {
  if (!gameIo) return;
  const snapshot = roomSnapshot(room);
  gameIo.to(room.code).emit("roomState", snapshot);
  // Keep the original lobby event available for any older clients.
  gameIo.to(room.code).emit("roomUpdated", snapshot);
}

function reply(ack: Ack | undefined, result: AckResult) {
  ack?.(result);
}

function playerForSocket(room: Room, socketId: string) {
  return room.players.find((player) => player.socketId === socketId && player.connected);
}

function nextConnectedIndex(room: Room, fromIndex: number): number {
  for (let offset = 1; offset <= room.players.length; offset += 1) {
    const index = (fromIndex + offset + room.players.length) % room.players.length;
    if (room.players[index]?.connected) return index;
  }
  return -1;
}

function nextActiveIndex(room: Room, fromIndex: number): number {
  for (let offset = 1; offset <= room.players.length; offset += 1) {
    const index = (fromIndex + offset + room.players.length) % room.players.length;
    const player = room.players[index];
    if (player?.connected && !player.folded) return index;
  }
  return -1;
}

function auctionShouldClose(room: Room): boolean {
  if (!room.captainId) return false;
  return room.players.every((player) =>
    player.id === room.captainId || player.folded || !player.connected
  );
}

function decisionsAreComplete(room: Room): boolean {
  return room.players
    .filter((player) => player.id !== room.captainId)
    .every((player) => room.decisions[player.id] !== undefined);
}

function resolveRound(room: Room) {
  if (!gameIo || !room.question || !room.captainId) return;
  room.phase = "RESULTS";
  const success = room.currentBid <= room.question.answer;
  room.latestOutcome = success ? "SUCCESS" : "CRASH";

  room.latestResults = room.players.map((player) => {
    const isCaptain = player.id === room.captainId;
    const decision = isCaptain ? "STAY" : (room.decisions[player.id] ?? "LEAVE");
    let pointsEarned: number;

    if (success) {
      pointsEarned = isCaptain
        ? (room.isTriplazo ? 5 : 3)
        : decision === "STAY"
          ? (room.isTriplazo ? 3 : 2)
          : 0;
    } else {
      pointsEarned = isCaptain
        ? (room.isTriplazo ? -4 : -2)
        : decision === "STAY"
          ? -2
          : 2;
    }

    room.scores[player.id] = (room.scores[player.id] ?? 0) + pointsEarned;
    return {
      playerId: player.id,
      name: player.name,
      isCaptain,
      decision,
      pointsEarned,
      scoreTotal: room.scores[player.id],
    };
  });

  emitRoomState(room);
}

function enterDecisionPhase(room: Room) {
  room.phase = "DECISION";
  room.decisions = {};
  if (room.captainId) room.decisions[room.captainId] = "STAY";
  for (const player of room.players) {
    if (!player.connected && player.id !== room.captainId) {
      room.decisions[player.id] = "LEAVE";
    }
  }
  if (decisionsAreComplete(room)) {
    resolveRound(room);
    return;
  }
  emitRoomState(room);
}

function startRound(room: Room, starterId: string) {
  const connectedPlayers = room.players.filter((player) => player.connected);
  if (connectedPlayers.length < 2) return false;

  const starter = room.players.find((player) => player.id === starterId && player.connected)
    ?? connectedPlayers[0];
  const question = QUESTIONS[randomInt(QUESTIONS.length)];
  if (!starter || !question) return false;

  room.phase = "BETTING";
  room.question = question;
  room.currentBid = 0;
  room.isTriplazo = false;
  room.captainId = null;
  room.turnPlayerId = starter.id;
  room.roundStarterId = starter.id;
  room.roundNumber += 1;
  room.decisions = {};
  room.latestResults = null;
  room.latestOutcome = null;
  for (const player of room.players) {
    player.hasActed = false;
    player.folded = !player.connected;
  }
  emitRoomState(room);
  return true;
}

function setRoomHost(room: Room) {
  if (room.players.some((player) => player.id === room.hostPlayerId && player.connected)) return;
  room.hostPlayerId =
    room.players.find((player) => player.connected)?.id ?? room.players[0]?.id ?? "";
}

function removePlayer(room: Room, playerId: string) {
  const playerIndex = room.players.findIndex((player) => player.id === playerId);
  if (playerIndex < 0) return;
  const wasTurn = room.turnPlayerId === playerId;
  const previousTurnIndex = room.players.findIndex((player) => player.id === room.turnPlayerId);
  room.players.splice(playerIndex, 1);
  delete room.scores[playerId];
  delete room.decisions[playerId];
  setRoomHost(room);

  if (room.players.length === 0) {
    rooms.delete(room.code);
    return;
  }

  if (room.phase === "BETTING" && wasTurn) {
    const fromIndex = Math.min(playerIndex, room.players.length - 1);
    const nextIndex = nextConnectedIndex(room, fromIndex - 1);
    room.turnPlayerId = room.players[nextIndex]?.id ?? null;
  } else if (room.phase === "BETTING" && playerIndex < previousTurnIndex) {
    const adjustedIndex = Math.max(0, previousTurnIndex - 1);
    room.turnPlayerId = room.players[adjustedIndex]?.id ?? null;
  }

  if (room.phase === "DECISION" && decisionsAreComplete(room)) {
    resolveRound(room);
    return;
  }
  emitRoomState(room);
}

export function broadcastRoom(roomCode: string) {
  const room = rooms.get(roomCode);
  if (room) emitRoomState(room);
}

export function attachGameSocket(server: HttpServer) {
  gameIo = new Server(server, {
    path: "/ws/game",
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  gameIo.on("connection", (socket: Socket) => {
    socket.on(
      "createRoom",
      (payload: { playerName?: unknown }, ack?: Ack) => {
        const code = createRoomCode();
        const playerId = randomUUID();
        const playerName = cleanPlayerName(payload?.playerName);
        const room: Room = {
          code,
          hostPlayerId: playerId,
          players: [{
            id: playerId,
            name: playerName,
            socketId: socket.id,
            connected: true,
            hasActed: false,
            folded: false,
          }],
          phase: "LOBBY",
          question: null,
          currentBid: 0,
          isTriplazo: false,
          captainId: null,
          turnPlayerId: null,
          roundStarterId: playerId,
          roundNumber: 0,
          scores: { [playerId]: 0 },
          decisions: {},
          latestResults: null,
          latestOutcome: null,
        };
        rooms.set(code, room);
        socket.join(code);
        reply(ack, { success: true, playerId, room: roomSnapshot(room) });
        emitRoomState(room);
      },
    );

    socket.on(
      "joinRoom",
      (
        payload: { roomCode?: unknown; playerName?: unknown },
        ack?: Ack,
      ) => {
        const roomCode = typeof payload?.roomCode === "string"
          ? payload.roomCode.trim().toUpperCase()
          : "";
        const room = rooms.get(roomCode);
        if (!room) {
          reply(ack, { success: false, message: "No existe una sala con ese código." });
          return;
        }
        if (room.phase !== "LOBBY") {
          reply(ack, { success: false, message: "La partida ya ha empezado." });
          return;
        }
        if (room.players.length >= 8) {
          reply(ack, { success: false, message: "La sala está llena (máximo 8 jugadores)." });
          return;
        }

        const playerId = randomUUID();
        const player: Player = {
          id: playerId,
          name: cleanPlayerName(payload?.playerName),
          socketId: socket.id,
          connected: true,
          hasActed: false,
          folded: false,
        };
        room.players.push(player);
        room.scores[playerId] = 0;
        socket.join(room.code);
        reply(ack, { success: true, playerId, room: roomSnapshot(room) });
        emitRoomState(room);
      },
    );

    socket.on(
      "resumeRoom",
      (payload: { roomCode?: unknown; playerId?: unknown }, ack?: Ack) => {
        const code = typeof payload?.roomCode === "string"
          ? payload.roomCode.trim().toUpperCase()
          : "";
        const playerId = typeof payload?.playerId === "string" ? payload.playerId : "";
        const room = rooms.get(code);
        const player = room?.players.find((entry) => entry.id === playerId);
        if (!room || !player) {
          reply(ack, { success: false, message: "La sala o el pasajero ya no existen." });
          return;
        }

        player.connected = true;
        player.socketId = socket.id;
        setRoomHost(room);
        if (room.phase === "BETTING" && !room.turnPlayerId) {
          if (!room.captainId) player.folded = false;
          room.turnPlayerId = player.id;
        }
        socket.join(room.code);
        reply(ack, { success: true, playerId: player.id, room: roomSnapshot(room) });
        emitRoomState(room);
      },
    );

    socket.on("startGame", (payload: { roomCode?: unknown }, ack?: Ack) => {
      const room = typeof payload?.roomCode === "string" ? rooms.get(payload.roomCode) : undefined;
      const player = room && playerForSocket(room, socket.id);
      if (!room || !player) {
        reply(ack, { success: false, message: "No estás en esa sala." });
        return;
      }
      if (player.id !== room.hostPlayerId) {
        reply(ack, { success: false, message: "Solo el anfitrión puede empezar la partida." });
        return;
      }
      // Si ya hemos jugado 20 rondas, termina la partida y vuelve al lobby
      if (room.roundNumber >= 20) {
        room.phase = "LOBBY";
        room.roundNumber = 0;
        room.scores = {};
        for (const p of room.players) {
          room.scores[p.id] = 0;
        }
        emitRoomState(room);
        reply(ack, { success: true, room: roomSnapshot(room) });
        return;
      }
      if (!startRound(room, room.hostPlayerId)) {
        reply(ack, { success: false, message: "Hacen falta al menos 2 jugadores conectados." });
        return;
      }
      reply(ack, { success: true, room: roomSnapshot(room) });
    });

    socket.on(
      "playerBet",
      (
        payload: { roomCode?: unknown; bet?: unknown; isTriplazo?: unknown },
        ack?: Ack,
      ) => {
        const room = typeof payload?.roomCode === "string" ? rooms.get(payload.roomCode) : undefined;
        const player = room && playerForSocket(room, socket.id);
        const bet = Number(payload?.bet);
        if (!room || room.phase !== "BETTING" || !player || player.folded) {
          reply(ack, { success: false, message: "La puja ya no está abierta." });
          return;
        }
        if (player.id !== room.turnPlayerId) {
          reply(ack, { success: false, message: "Espera a que llegue tu turno." });
          return;
        }
        const isTriplazo = payload?.isTriplazo === true;
        if (isTriplazo && player.hasActed) {
          reply(ack, { success: false, message: "TRIPLAZO solo se puede hacer en tu primer turno de la ronda." });
          return;
        }
        if (!Number.isSafeInteger(bet) || bet <= room.currentBid || bet < 1) {
          reply(ack, { success: false, message: "La apuesta debe ser un número mayor que la actual." });
          return;
        }

        player.hasActed = true;
        room.currentBid = bet;
        room.captainId = player.id;
        room.isTriplazo = isTriplazo;

        if (isTriplazo) {
          enterDecisionPhase(room);
        } else if (auctionShouldClose(room)) {
          enterDecisionPhase(room);
        } else {
          const playerIndex = room.players.findIndex((entry) => entry.id === player.id);
          const nextIndex = nextActiveIndex(room, playerIndex);
          room.turnPlayerId = room.players[nextIndex]?.id ?? null;
          emitRoomState(room);
        }
        reply(ack, { success: true, room: roomSnapshot(room) });
      },
    );

    socket.on("playerStand", (payload: { roomCode?: unknown }, ack?: Ack) => {
      const room = typeof payload?.roomCode === "string" ? rooms.get(payload.roomCode) : undefined;
      const player = room && playerForSocket(room, socket.id);
      if (!room || room.phase !== "BETTING" || !player || player.folded) {
        reply(ack, { success: false, message: "Ya no puedes plantarte en esta ronda." });
        return;
      }
      if (player.id !== room.turnPlayerId) {
        reply(ack, { success: false, message: "Espera a que llegue tu turno." });
        return;
      }
      const activePlayers = room.players.filter((entry) => entry.connected && !entry.folded);
      if (!room.captainId && activePlayers.length <= 1) {
        reply(ack, { success: false, message: "Tiene que quedar alguien para hacer la primera puja." });
        return;
      }

      player.folded = true;
      player.hasActed = true;
      if (auctionShouldClose(room)) {
        enterDecisionPhase(room);
      } else {
        const playerIndex = room.players.findIndex((entry) => entry.id === player.id);
        const nextIndex = nextActiveIndex(room, playerIndex);
        room.turnPlayerId = room.players[nextIndex]?.id ?? null;
        emitRoomState(room);
      }
      reply(ack, { success: true, room: roomSnapshot(room) });
    });

    socket.on(
      "submitDecision",
      (payload: { roomCode?: unknown; decision?: unknown }, ack?: Ack) => {
        const room = typeof payload?.roomCode === "string" ? rooms.get(payload.roomCode) : undefined;
        const player = room && playerForSocket(room, socket.id);
        if (!room || room.phase !== "DECISION" || !player || player.id === room.captainId) {
          reply(ack, { success: false, message: "No puedes registrar esa decisión." });
          return;
        }
        if (payload?.decision !== "STAY" && payload?.decision !== "LEAVE") {
          reply(ack, { success: false, message: "Elige quedarte dentro o bajarte." });
          return;
        }
        if (room.decisions[player.id]) {
          reply(ack, { success: false, message: "Ya has registrado tu decisión." });
          return;
        }

        room.decisions[player.id] = payload.decision;
        if (decisionsAreComplete(room)) {
          resolveRound(room);
        } else {
          emitRoomState(room);
        }
        reply(ack, { success: true, room: roomSnapshot(room) });
      },
    );

    socket.on("nextRound", (payload: { roomCode?: unknown }, ack?: Ack) => {
      const room = typeof payload?.roomCode === "string" ? rooms.get(payload.roomCode) : undefined;
      const player = room && playerForSocket(room, socket.id);
      if (!room || room.phase !== "RESULTS" || !player) {
        reply(ack, { success: false, message: "La ronda todavía no ha terminado." });
        return;
      }
      if (player.id !== room.hostPlayerId) {
        reply(ack, { success: false, message: "Solo el anfitrión puede abrir la siguiente ronda." });
        return;
      }
      const previousStarterIndex = room.players.findIndex((entry) => entry.id === room.roundStarterId);
      const nextStarterIndex = nextConnectedIndex(room, previousStarterIndex < 0 ? -1 : previousStarterIndex);
      const nextStarterId = room.players[nextStarterIndex]?.id;
      if (!nextStarterId || !startRound(room, nextStarterId)) {
        reply(ack, { success: false, message: "Hacen falta al menos 2 jugadores conectados." });
        return;
      }
      reply(ack, { success: true, room: roomSnapshot(room) });
    });

    socket.on("leaveRoom", (payload: { roomCode?: unknown }, ack?: Ack) => {
      const room = typeof payload?.roomCode === "string" ? rooms.get(payload.roomCode) : undefined;
      const player = room && playerForSocket(room, socket.id);
      if (!room || !player) {
        reply(ack, { success: false, message: "No estás en esa sala." });
        return;
      }
      socket.leave(room.code);
      removePlayer(room, player.id);
      reply(ack, { success: true });
    });

    socket.on("disconnect", () => {
      for (const room of rooms.values()) {
        const player = room.players.find((entry) => entry.socketId === socket.id);
        if (!player) continue;
        player.connected = false;

        if (room.phase === "BETTING") {
          player.folded = true;
          player.hasActed = true;
          if (room.turnPlayerId === player.id) {
            const playerIndex = room.players.findIndex((entry) => entry.id === player.id);
            const nextIndex = nextActiveIndex(room, playerIndex);
            room.turnPlayerId = room.players[nextIndex]?.id ?? null;
          }
          setRoomHost(room);
          if (auctionShouldClose(room)) {
            enterDecisionPhase(room);
          } else {
            emitRoomState(room);
          }
          break;
        } else if (room.phase === "DECISION" && player.id !== room.captainId) {
          room.decisions[player.id] = "LEAVE";
        }

        setRoomHost(room);
        if (room.phase === "DECISION" && decisionsAreComplete(room)) resolveRound(room);
        else emitRoomState(room);
        break;
      }
    });
  });

  return gameIo;
}
