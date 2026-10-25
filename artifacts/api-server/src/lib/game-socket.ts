  import { randomInt, randomUUID } from "node:crypto";
  import type { Server as HttpServer } from "node:http";
  import { Server, Socket } from "socket.io";
  import { io } from "socket.io-client";

  const QUESTIONS = [
  // --- GEOGRAFÍA FÍSICA Y RÍOS ---
  { text: "¿Cuántos kilómetros de longitud tiene el río Amazonas?", answer: 6992, note: "El río más caudaloso y largo del planeta" },
  { text: "¿Cuántos kilómetros de longitud tiene el río Nilo?", answer: 6650, note: "Históricamente considerado el más largo del mundo" },
  { text: "¿Cuántos kilómetros de longitud tiene el río Yangtsé en China?", answer: 6300, note: "El río más largo de Asia" },
  { text: "¿Cuántos kilómetros de longitud tiene el río Misisipi?", answer: 3766, note: "El gran río vertebral de Norteamérica" },
  { text: "¿Cuántos kilómetros de longitud tiene el río Danubio?", answer: 2850, note: "Nace en la Selva Negra y desemboca en el Mar Negro" },
  { text: "¿Cuántos kilómetros de longitud tiene el río Rin en Europa?", answer: 1233, note: "Cruza Suiza, Alemania y desemboca en los Países Bajos" },
  { text: "¿Cuántos kilómetros de longitud tiene el río Ebro en España?", answer: 910, note: "El río más caudaloso que discurre enteramente por España" },
  { text: "¿Cuántos kilómetros de longitud tiene el río Tajo en la península ibérica?", answer: 1007, note: "El río más largo de toda la península ibérica" },
  { text: "¿Cuántos kilómetros de longitud tiene el río Duero?", answer: 897, note: "Desemboca en Oporto (Portugal)" },
  { text: "¿Cuántos kilómetros de longitud tiene el río Guadalquivir?", answer: 657, note: "Nace en Cazorla y desemboca en Sanlúcar de Barrameda" },
  { text: "¿Cuántos kilómetros de longitud tiene el río Sena en Francia?", answer: 777, note: "Atraviesa París y desemboca en el canal de la Mancha" },
  { text: "¿Cuántos kilómetros de longitud tiene el río Támesis en Inglaterra?", answer: 346, note: "El río principal que atraviesa Londres" },
  { text: "¿Cuántos kilómetros de longitud tiene el río Volga (el más largo de Europa)?", answer: 3530, note: "Discurre íntegramente por Rusia y desemboca en el Mar Caspio" },
  { text: "¿Cuántos países atraviesa el río Danubio desde Alemania hasta el Mar Negro?", answer: 10, note: "Alemania, Austria, Eslovaquia, Hungría, Croacia, Serbia, Rumanía, Bulgaria, Moldavia y Ucrania" },
  { text: "¿Cuántos países atraviesa o bordea el río Rin en Europa?", answer: 6, note: "Suiza, Liechtenstein, Austria, Alemania, Francia y Países Bajos" },

  // --- GEOPOLÍTICA Y TERRITORIOS ---
  { text: "¿Cuántos países soberanos e independientes existen en África?", answer: 54, note: "El continente con mayor número de países del mundo" },
  { text: "¿Cuántos países independientes forman el continente asiático?", answer: 48 },
  { text: "¿Cuántos países independientes componen el continente europeo?", answer: 44 },
  { text: "¿Cuántos países independientes forman América del Sur?", answer: 12, note: "Argentina, Bolivia, Brasil, Chile, Colombia, Ecuador, Guyana, Paraguay, Perú, Surinam, Uruguay y Venezuela" },
  { text: "¿Cuántos países componen América Central continental?", answer: 7, note: "Belice, Costa Rica, El Salvador, Guatemala, Honduras, Nicaragua y Panamá" },
  { text: "¿Cuántos países miembros forman la Unión Europea?", answer: 27, note: "Tras la salida del Reino Unido en el Brexit" },
  { text: "¿Cuántos países forman parte de la Organización de las Naciones Unidas (ONU)?", answer: 193, note: "Más 2 estados observadores: la Santa Sede y Palestina" },
  { text: "¿Cuántos países miembros permanentes forman el Consejo de Seguridad de la ONU?", answer: 5, note: "EE.UU., Rusia, China, Francia y Reino Unido (con derecho a veto)" },
  { text: "¿Cuántos países no permanentes integran el Consejo de Seguridad de la ONU?", answer: 10, note: "Elegidos por la Asamblea General por periodos de dos años" },
  { text: "¿Cuántos países fundaron inicialmente la alianza de la OTAN en 1949?", answer: 12, note: "EE.UU., Reino Unido, Francia, Canadá, Italia, Bélgica, Países Bajos, Luxemburgo, Noruega, Dinamarca, Portugal e Islandia" },
  { text: "¿Cuántos países forman parte actualmente del espacio Schengen?", answer: 29, note: "25 miembros de la UE más Islandia, Liechtenstein, Noruega y Suiza" },
  { text: "¿Cuántos países de la Unión Europea tienen el Euro (€) como moneda oficial?", answer: 20, note: "El último en incorporarse fue Croacia en 2023" },
  { text: "¿Cuántos países firmaron el Tratado de Roma en 1957 fundando la CEE?", answer: 6, note: "Alemania Occidental, Francia, Italia, Bélgica, Países Bajos y Luxemburgo" },
  { text: "¿Cuántos países distintos atraviesa la línea del Ecuador en la Tierra?", answer: 13, note: "Ecuador, Colombia, Brasil, Santo Tomé y Príncipe, Gabón, Congo, RDC, Uganda, Kenia, Somalia, Maldivas, Indonesia y Kiribati" },
  { text: "¿Cuántos husos horarios diferentes tiene el territorio de Rusia?", answer: 11, note: "Desde Kaliningrado en Europa hasta Kamchatka en el Pacífico" },
  { text: "¿Cuántos países tienen frontera terrestre directa con Brasil?", answer: 10, note: "Todos los países de Sudamérica excepto Chile y Ecuador" },
  { text: "¿Cuántos países tienen frontera terrestre directa con China?", answer: 14, note: "Empatada con Rusia como el país con más fronteras del mundo" },
  { text: "¿Cuántos países tienen frontera terrestre directa con Alemania?", answer: 9, note: "Dinamarca, Polonia, Chequia, Austria, Suiza, Francia, Luxemburgo, Bélgica y Países Bajos" },
  { text: "¿Cuántos kilómetros de frontera terrestre comparten España y Portugal (La Raya)?", answer: 1214, note: "Una de las fronteras pacíficas más antiguas de Europa" },
  { text: "¿Cuántos kilómetros de frontera terrestre comparten España y Francia?", answer: 656, note: "A lo largo de la cordillera de los Pirineos" },
  { text: "¿Cuántos países del mundo no tienen salida al mar (países sin litoral)?", answer: 44, note: "Dos son doblemente aislados: Liechtenstein y Uzbekistán" },
  { text: "¿Cuántos estados componen los Estados Unidos de América?", answer: 50, note: "El último admitido fue Hawái en 1959" },
  { text: "¿Cuántos estados componen los Estados Unidos Mexicanos?", answer: 31, note: "31 estados más la Ciudad de México" },
  { text: "¿Cuántas provincias y territorios componen Canadá?", answer: 13, note: "10 provincias y 3 territorios federales" },
  { text: "¿Cuántas provincias tiene en total España?", answer: 50, note: "Repartidas en 17 comunidades autónomas" },
  { text: "¿Cuántas comunidades autónomas integran España (sin contar Ceuta y Melilla)?", answer: 17 },
  { text: "¿Cuántos municipios tiene la provincia de Madrid?", answer: 179 },
  { text: "¿Cuántos municipios tiene la provincia de Barcelona?", answer: 311 },
  { text: "¿Cuántos municipios tiene la provincia de Almería?", answer: 103 },
  { text: "¿Cuántas islas forman el archipiélago de las Maldivas?", answer: 1192, note: "Distribuidas en 26 atolones naturales" },
  { text: "¿Cuántas islas forman en total el país de Indonesia?", answer: 17508, note: "El mayor estado archipelágico del planeta" },
  { text: "¿Cuántas islas principales forman las Islas Canarias?", answer: 8, note: "Tenerife, Fuerteventura, Gran Canaria, Lanzarote, La Palma, La Gomera, El Hierro y La Graciosa" },
  { text: "¿Cuántas islas principales habitadas componen las Islas Baleares?", answer: 4, note: "Mallorca, Menorca, Ibiza y Formentera" },

  // --- MONTAÑAS, MARES Y PROFUNDIDADES ---
  { text: "¿Cuántos metros de altitud tiene el Monte Everest?", answer: 8848, note: "En la cordillera del Himalaya, frontera entre Nepal y China" },
  { text: "¿Cuántos metros de altitud tiene el K2 (segunda montaña más alta del mundo)?", answer: 8611, note: "En la cordillera del Karakórum, entre Pakistán y China" },
  { text: "¿Cuántos metros de altitud tiene el Aconcagua (pico más alto de América)?", answer: 6961, note: "Ubicado en la provincia de Mendoza, Argentina" },
  { text: "¿Cuántos metros de altitud tiene el Kilimanjaro en Tanzania?", answer: 5895, note: "La montaña aislada más alta del planeta" },
  { text: "¿Cuántos metros de altitud tiene el Mont Blanc en los Alpes?", answer: 4808, note: "El pico más alto de la Unión Europea" },
  { text: "¿Cuántos metros de altitud tiene el Teide en Tenerife?", answer: 3718, note: "El pico más alto de España" },
  { text: "¿Cuántos metros de altitud tiene el Mulhacén en Sierra Nevada?", answer: 3479, note: "El pico más alto de la península ibérica" },
  { text: "¿Cuántos metros de altitud tiene el Aneto en los Pirineos?", answer: 3404, note: "El pico más alto de los Pirineos" },
  { text: "¿Cuántos metros de altitud tiene el monte Fuji en Japón?", answer: 3776, note: "Volcán sagrado y símbolo nacional japonés" },
  { text: "¿A cuántos metros bajo el nivel del mar se encuentra la orilla del Mar Muerto?", answer: 430, note: "El punto terrestre más bajo de la superficie del planeta" },
  { text: "¿Cuántos metros de profundidad máxima tiene la Fosa de las Marianas?", answer: 10994, note: "En el abismo Challenger, el punto más hondo conocido de los océanos" },
  { text: "¿Cuántos metros de profundidad máxima tiene el Lago Baikal en Rusia?", answer: 1642, note: "El lago de agua dulce más hondo y antiguo del mundo" },
  { text: "¿Cuántos metros de profundidad máxima tiene el Mar Mediterráneo?", answer: 5267, note: "En la fosa de Calipso, cerca de las costas de Grecia" },
  { text: "¿Cuántos metros de caída libre tiene el Salto Ángel en Venezuela?", answer: 807, note: "La cascada con caída ininterrumpida más alta del planeta (979 m en total)" },
  { text: "¿Cuántos metros de caída vertical tienen las cataratas del Niágara en su mayor salto?", answer: 51, note: "En la caída canadiense conocida como 'Horseshoe Falls'" },

  // --- PREGUNTAS DE PORCENTAJES (%) ---
  { text: "¿Qué porcentaje de la superficie de la Tierra está cubierta por agua?", answer: 71, note: "El 97% de esa agua se encuentra en mares y océanos" },
  { text: "¿Qué porcentaje del volumen del aire que respiramos está compuesto por nitrógeno?", answer: 78, note: "El componente mayoritario de la atmósfera terrestre" },
  { text: "¿Qué porcentaje del volumen del aire de la atmósfera terrestre es oxígeno?", answer: 21, note: "El resto es principalmente argón (0,93%) y dióxido de carbono" },
  { text: "¿Qué porcentaje del cuerpo de una medusa común está formado por agua?", answer: 95, note: "Apenas tienen un 5% de materia sólida orgánica" },
  { text: "¿Qué porcentaje de la masa total de todo el Sistema Solar concentra solo el Sol?", answer: 99, note: "Aproximadamente el 99,86% de toda la masa del sistema" },
  { text: "¿Qué porcentaje del ADN comparte aproximadamente el ser humano con el chimpancé?", answer: 98, note: "Nuestro pariente evolutivo vivo más cercano" },
  { text: "¿Qué porcentaje aproximado del peso de un ser humano adulto es agua?", answer: 60, note: "Varía entre el 55% y el 65% según edad y masa muscular" },
  { text: "¿Qué porcentaje de toda el agua dulce del planeta está congelada en glaciares y polos?", answer: 69, note: "La gran mayoría en la Antártida y Groenlandia" },
  { text: "¿Qué porcentaje de la población mundial vive aproximadamente en el hemisferio norte?", answer: 87, note: "Debido a la gran masa continental de Eurasia y Norteamérica" },
  { text: "¿Qué porcentaje del oxígeno de la Tierra produce aproximadamente el fitoplancton marino?", answer: 50, note: "Los océanos generan al menos la mitad del oxígeno que respiramos" },
  { text: "¿Qué porcentaje de las especies marinas catalogadas albergan los arrecifes de coral?", answer: 25, note: "Pese a cubrir menos del 1% del fondo oceánico total" },
  { text: "¿Qué porcentaje del volumen de un iceberg flota sumergido bajo el agua?", answer: 90, note: "Por la diferencia de densidad entre el hielo y el agua marina" },
  { text: "¿Qué porcentaje de oro puro contiene una joya de oro de 18 quilates?", answer: 75, note: "18 partes de oro puro sobre 24 partes totales (18/24 = 75%)" },
  { text: "¿Qué porcentaje aproximado de la población mundial es zurda?", answer: 10, note: "Aproximadamente 1 de cada 10 personas en el mundo" },
  { text: "¿Qué porcentaje de la población mundial vive en el continente asiático?", answer: 60, note: "Más de 4.700 millones de personas" },

  // --- GRANDES CONSTRUCCIONES Y MONUMENTOS ---
  { text: "¿Cuántos metros de altura total mide el rascacielos Burj Khalifa en Dubái?", answer: 828, note: "El edificio más alto del mundo desde su inauguración en 2010" },
  { text: "¿Cuántas plantas habitables tiene el Empire State Building de Nueva York?", answer: 102, note: "Construido en tiempo récord: apenas 1 año y 45 días" },
  { text: "¿Cuántos metros de altura tiene la Torre Eiffel de París incluyendo su antena?", answer: 330, note: "Mide 300 metros de estructura de hierro más las antenas de transmisión" },
  { text: "¿Cuántos arcos de entrada principales tiene en cada nivel la fachada del Coliseo de Roma?", answer: 80, note: "Permitían evacuar a más de 50.000 espectadores en minutos" },
  { text: "¿Cuántos metros de altura tiene la Gran Pirámide de Guiza en la actualidad?", answer: 139, note: "Originalmente medía 146,6 metros antes de perder su revestimiento" },
  { text: "¿Cuántos metros mide la Estatua de la Libertad desde el pedestal hasta la antorcha?", answer: 93, note: "Regalo del pueblo francés a los Estados Unidos inaugurado en 1886" },
  { text: "¿Cuántos escalones tiene la escalera interior de la Torre de Pisa?", answer: 294 },
  { text: "¿Cuántas torres proyectó en total Antoni Gaudí para la Sagrada Familia?", answer: 18, note: "12 para los apóstoles, 4 para los evangelistas, una a la Virgen y la central a Jesús" },
  { text: "¿Cuántas columnas de mármol decoran el Patio de los Leones de la Alhambra de Granada?", answer: 124, note: "Construido en el siglo XIV por orden del sultán Muhammed V" },
  { text: "¿Cuántos escalones suman las 4 caras y la plataforma de la pirámide de Kukulcán?", answer: 365, note: "91 escalones por cada una de las 4 caras más la cima = 365 días del año" },
  { text: "¿Cuántas columnas se conservan en la sala de oración de la Mezquita de Córdoba?", answer: 856, note: "Famosa por su bosque de arcos dobles de herradura bicolores" },
  { text: "¿Cuántos arcos visibles forman la doble arquería monumental del Acueducto de Segovia?", answer: 167, note: "Construido sin una sola gota de mortero o cemento" },
  { text: "¿Cuántos metros de altura tiene el Arco del Triunfo de París?", answer: 50, note: "Encargado por Napoleón Bonaparte tras su victoria en Austerlitz" },
  { text: "¿Cuántos puentes cruzan actualmente el Gran Canal de Venecia?", answer: 4, note: "Rialto, Academia, Descalzos y el Puente de la Constitución de Calatrava" },
  { text: "¿Cuántas puertas de acceso tiene el recinto amurallado románico de la ciudad de Ávila?", answer: 9, note: "Junto a 87 torreones semicirculares perfectamente conservados" },
  { text: "¿Cuántos kilómetros de longitud tiene la Gran Muralla China (con todos sus tramos)?", answer: 21196, note: "Medición arqueológica oficial integral anunciada en 2012" },

  // --- HISTORIA: AÑOS EXACTOS (EN QUÉ AÑO FUE) ---
  { text: "¿En qué año se produjo la caída del Imperio Romano de Occidente?", answer: 476, note: "Deposición del emperador Rómulo Augústulo; marca el inicio de la Edad Media" },
  { text: "¿En qué año cayó la ciudad de Constantinopla en manos del Imperio Otomano?", answer: 1453, note: "Conquistada por Mehmed II; marca el final de la Edad Media" },
  { text: "¿En qué año inventó Johannes Gutenberg la imprenta de tipos móviles en Europa?", answer: 1440, note: "Revolución absoluta en la difusión del conocimiento y libros" },
  { text: "¿En qué año llegó Cristóbal Colón a tierras americanas por primera vez?", answer: 1492, note: "12 de octubre de 1492 a la isla de Guanahaní" },
  { text: "¿En qué año tuvo lugar la célebre batalla naval de Lepanto?", answer: 1571, note: "La Liga Santa venció a los otomanos; Cervantes fue herido en ella" },
  { text: "¿En qué año zarpó la expedición de Magallanes y Elcano para dar la vuelta al mundo?", answer: 1519, note: "Partieron 5 naves de Sevilla y regresó solo la nao Victoria en 1522" },
  { text: "¿En qué año se firmó la histórica Paz de Westfalia?", answer: 1648, note: "Puso fin a la Guerra de los Treinta Años y rediseñó el mapa de Europa" },
  { text: "¿En qué año se completó la construcción del mausoleo del Taj Mahal en la India?", answer: 1653, note: "Mandado construir por el emperador mogol Shah Jahan" },
  { text: "¿En qué año tuvo lugar el 'Motín del té' en el puerto de Boston?", answer: 1773, note: "Protesta de los colonos contra los impuestos británicos al té" },
  { text: "¿En qué año se firmó la Declaración de Independencia de los Estados Unidos?", answer: 1776, note: "Redactada principalmente por Thomas Jefferson el 4 de julio" },
  { text: "¿En qué año se produjo la toma de la Bastilla que dio inicio a la Revolución Francesa?", answer: 1789, note: "14 de julio de 1789 en París" },
  { text: "¿En qué año fue ejecutado en la guillotina el rey Luis XVI de Francia?", answer: 1793, note: "21 de enero de 1793 en la Plaza de la Revolución" },
  { text: "¿En qué año descubrieron las tropas francesas la célebre Piedra de Rosetta?", answer: 1799, note: "Permitió a Champollion descifrar los jeroglíficos egipcios" },
  { text: "¿En qué año fundó Napoleón Bonaparte el Banco de Francia?", answer: 1800, note: "Para sanear la economía francesa tras el periodo revolucionario" },
  { text: "¿En qué año tuvo lugar la batalla naval de Trafalgar?", answer: 1805, note: "21 de octubre de 1805 frente a Cádiz, donde murió el almirante Nelson" },
  { text: "¿En qué año se promulgó la primera Constitución liberal de España ('La Pepa') en Cádiz?", answer: 1812, note: "El 19 de marzo de 1812 (festividad de San José)" },
  { text: "¿En qué año se libró la Batalla de Waterloo que supuso la derrota final de Napoleón?", answer: 1815, note: "18 de junio de 1815 frente a británicos y prusianos" },
  { text: "¿En qué año publicó Charles Darwin su célebre obra 'El origen de las especies'?", answer: 1859, note: "Fundamento de la teoría moderna de la evolución biológica" },
  { text: "¿En qué año se inauguró la primera línea de metro del mundo en Londres?", answer: 1863, note: "Metropolitan Railway, traccionada por vapor subterráneo" },
  { text: "¿En qué año se completó el puente de Brooklyn en Nueva York?", answer: 1883, note: "Unió Manhattan y Brooklyn; una proeza de ingeniería de cables de acero" },
  { text: "¿En qué año tuvo lugar la cataclísmica erupción del volcán Krakatoa?", answer: 1883, note: "El estruendo se escuchó a casi 5.000 kilómetros de distancia" },
  { text: "¿En qué año se inauguró la Torre Eiffel en París?", answer: 1889, note: "Con motivo de la Exposición Universal de París de 1889" },
  { text: "¿En qué año se celebraron los primeros Juegos Olímpicos de la era moderna en Atenas?", answer: 1896, note: "Impulsados por el barón Pierre de Coubertin" },
  { text: "¿En qué año alcanzaron Roald Amundsen y sus hombres el Polo Sur por primera vez?", answer: 1911, note: "El 14 de diciembre de 1911, adelantándose a Robert Falcon Scott" },
  { text: "¿En qué año naufragó el transatlántico RMS Titanic tras colisionar con un iceberg?", answer: 1912, note: "Noche del 14 al 15 de abril de 1912 en el Atlántico Norte" },
  { text: "¿En qué año fue asesinado el archiduque Francisco Fernando en Sarajevo?", answer: 1914, note: "28 de junio de 1914; desencadenó la Primera Guerra Mundial" },
  { text: "¿En qué año se inauguró oficialmente el Canal de Panamá?", answer: 1914, note: "El 15 de agosto de 1914 con el paso del vapor Ancón" },
  { text: "¿En qué año triunfó la Revolución Bolchevique en Rusia bajo Lenin?", answer: 1917, note: "Revolución de Octubre de 1917" },
  { text: "¿En qué año concluyó la Primera Guerra Mundial con la firma del armisticio?", answer: 1918, note: "11 de noviembre de 1918 a las 11:00 horas" },
  { text: "¿En qué año se firmó el Tratado de Versalles?", answer: 1919, note: "Puso fin formal a la Primera Guerra Mundial" },
  { text: "¿En qué año descubrió Howard Carter la tumba intacta del faraón Tutankamón?", answer: 1922, note: "En el Valle de los Reyes, en Luxor (Egipto)" },
  { text: "¿En qué año descubrió Alexander Fleming la penicilina?", answer: 1928, note: "A partir de un cultivo contaminado por el hongo Penicillium notatum" },
  { text: "¿En qué año estalló la Guerra Civil Española tras el golpe militar?", answer: 1936, note: "17 y 18 de julio de 1936" },
  { text: "¿En qué año se abrió al tráfico el puente Golden Gate de San Francisco?", answer: 1937, note: "Uno de los puentes colgantes más icónicos del mundo" },
  { text: "¿En qué año concluyó formalmente la Segunda Guerra Mundial?", answer: 1945, note: "Rendición de Alemania en mayo y de Japón en septiembre de 1945" },
  { text: "¿En qué año lanzó Estados Unidos la primera bomba nuclear sobre Hiroshima?", answer: 1945, note: "6 de agosto de 1945 ('Little Boy')" },
  { text: "¿En qué año proclamó la ONU la Declaración Universal de los Derechos Humanos?", answer: 1948, note: "El 10 de diciembre de 1948 en París" },
  { text: "¿En qué año publicaron Watson y Crick la estructura en doble hélice del ADN?", answer: 1953, note: "Basándose en la difracción de rayos X de Rosalind Franklin" },
  { text: "¿En qué año se lanzó el satélite Sputnik 1, el primero en orbitar la Tierra?", answer: 1957, note: "4 de octubre de 1957 por la Unión Soviética" },
  { text: "¿En qué año se inauguró Brasilia como flamante capital federal de Brasil?", answer: 1960, note: "Diseñada por Lúcio Costa y Oscar Niemeyer" },
  { text: "¿En qué año se convirtió Yuri Gagarin en el primer ser humano en el espacio exterior?", answer: 1961, note: "12 de abril de 1961 a bordo de la Vostok 1" },
  { text: "¿En qué año pisó el ser humano la Luna por primera vez en la misión Apolo 11?", answer: 1969, note: "20 de julio de 1969 por Neil Armstrong y Buzz Aldrin" },
  { text: "¿En qué año se inauguró el famoso edificio de la Ópera de Sídney?", answer: 1973, note: "Diseñada por el arquitecto danés Jørn Utzon" },
  { text: "¿En qué año falleció el dictador Francisco Franco?", answer: 1975, note: "El 20 de noviembre de 1975" },
  { text: "¿En qué año se aprobó en referéndum la actual Constitución Española?", answer: 1978, note: "El 6 de diciembre de 1978 con el voto favorable de la ciudadanía" },
  { text: "¿En qué año tuvo lugar el intento fallido de golpe de Estado del 23-F en España?", answer: 1981, note: "Asalto al Congreso de los Diputados por el teniente coronel Tejero" },
  { text: "¿En qué año ocurrió el grave accidente nuclear en la central de Chernóbil?", answer: 1986, note: "26 de abril de 1986 en Ucrania (URSS)" },
  { text: "¿En qué año se produjo la histórica caída del Muro de Berlín?", answer: 1989, note: "La noche del 9 de noviembre de 1989" },
  { text: "¿En qué año se disolvió oficialmente la Unión Soviética (URSS)?", answer: 1991, note: "En diciembre de 1991 tras los Acuerdos de Belavezha" },
  { text: "¿En qué año se inauguró el Museo Guggenheim de Bilbao?", answer: 1997, note: "Diseñado por el arquitecto Frank Gehry" },
  { text: "¿En qué año se produjeron los atentados terroristas del 11-S en Estados Unidos?", answer: 2001, note: "Contra el World Trade Center de Nueva York y el Pentágono" },
    // --- REINO ANIMAL Y CURIOSIDADES SALVAJES ---
    { text: "¿Cuántos corazones bombean sangre en el cuerpo de un pulpo?", answer: 3, note: "Uno principal para los órganos y dos que oxigenan las branquias" },
    { text: "¿Cuántas patas marchadoras tienen los insectos adultos?", answer: 6, note: "Tres pares articulados en el tórax" },
    { text: "¿Cuántas patas marchadoras poseen los arácnidos?", answer: 8, note: "Cuatro pares articulados a los lados del prosoma" },
    { text: "¿Cuántas patas tienen los crustáceos decápodos (langostas, cangrejos)?", answer: 10, note: "Cinco pares de patas, incluyendo sus pinzas delanteras" },
    { text: "¿Cuántas extremidades en total (brazos más tentáculos) tiene un calamar?", answer: 10, note: "8 brazos musculosos y 2 tentáculos prensiles más largos" },
    { text: "¿Cuántas vértebras cervicales tiene el cuello de una jirafa?", answer: 7, note: "Exactamente el mismo número de vértebras que un humano o un ratón" },
    { text: "¿A cuántos kilómetros por hora puede descender en picado un halcón peregrino?", answer: 389, note: "El animal más veloz registrado sobre la faz de la Tierra" },
    { text: "¿A cuántos kilómetros por hora puede esprintar un guepardo en carrera corta?", answer: 120, note: "Acelera de 0 a 100 km/h en apenas 3 segundos" },
    { text: "¿A cuántos kilómetros por hora puede nadar el pez vela en distancias cortas?", answer: 110, note: "El pez más veloz de todos los océanos" },
    { text: "¿Cuántos días dura aproximadamente la gestación de un elefante africano?", answer: 660, note: "Unos 22 meses, el récord en mamíferos terrestres" },
    { text: "¿Cuántas toneladas métricas puede llegar a pesar una ballena azul adulta?", answer: 190, note: "El ser vivo más pesado y grande conocido en la historia del planeta" },
    { text: "¿Cuántos kilos pesa aproximadamente la lengua de una ballena azul adulta?", answer: 2700, note: "Pesa casi lo mismo que un elefante adulto entero" },
    { text: "¿Cuántas veces por segundo puede llegar a batir sus alas un colibrí?", answer: 80, note: "Su corazón puede latir a más de 1.000 pulsaciones por minuto" },
    { text: "¿Cuántas veces su propio peso puede llegar a levantar una hormiga común?", answer: 50, note: "Algunas especies pueden levantar hasta 50 veces su masa" },
    { text: "¿Cuántos ojos tienen la inmensa mayoría de las arañas?", answer: 8, note: "Dispersos en la parte frontal de su cabeza para detectar movimiento" },
    { text: "¿Cuántos dientes puede llegar a mudar un tiburón blanco a lo largo de su vida (en miles)?", answer: 30, note: "Tienen hileras de dientes que se reemplazan continuamente" },
    { text: "¿Cuántas horas al día puede llegar a dormir un koala para digerir el eucalipto?", answer: 20, note: "Pasa entre 18 y 22 horas diarias durmiendo o descansando" },
    { text: "¿Cuántos metros puede saltar de longitud un canguro rojo adulto de un solo impulso?", answer: 9, note: "Alcanzan velocidades de salto de hasta 60 km/h" },
    { text: "¿Cuántos estómagos o compartimentos gástricos tiene una vaca?", answer: 4, note: "Panza (rumen), redecilla, libro y cuajar" },
    { text: "¿Cuántas aletas externas componen la anatomía básica de un tiburón?", answer: 8, note: "Dos pectorales, dos pélvicas, dos dorsales, una anal y una caudal" },

    // --- MÁS PORCENTAJES (%) BRUTALES ---
    { text: "¿Qué porcentaje del peso de una sandía madura es agua?", answer: 92, note: "Una de las frutas con mayor concentración hídrica" },
    { text: "¿Qué porcentaje de oro puro tiene una joya de oro de 24 quilates?", answer: 100, note: "El oro de 24k es oro puro al 99,9% sin aleaciones" },
    { text: "¿Qué porcentaje del desierto del Sahara está cubierto por dunas de arena (erg)?", answer: 25, note: "El 75% restante son mesetas rocosas, grava y valles secos" },
    { text: "¿Qué porcentaje de todas las especies animales conocidas del planeta son insectos?", answer: 80, note: "Los artrópodos dominan ampliamente la biodiversidad terrestre" },
    { text: "¿Qué porcentaje de la luz solar incidente es reflejada por la nieve fresca?", answer: 90, note: "Posee un albedo altísimo que causa ceguera nival sin gafas de sol" },
    { text: "¿Qué porcentaje de los volcanes activos del mundo se concentran en el Cinturón de Fuego del Pacífico?", answer: 75, note: "Y donde se originan más del 90% de los terremotos" },
    { text: "¿Qué porcentaje de agua dulce mundial contiene únicamente el lago Baikal?", answer: 20, note: "La quinta parte de toda el agua dulce superficial no congelada del planeta" },
    { text: "¿Qué porcentaje del cerebro humano adulto está compuesto por agua?", answer: 75, note: "El tejido cerebral es extremadamente sensible a la deshidratación" },
    { text: "¿Qué porcentaje de la superficie de España continental es territorio forestal?", answer: 55, note: "España es el segundo país con más masa forestal de la Unión Europea" },

    // --- HISTORIA: DURACIONES, REINADOS Y CONFLICTOS ---
    { text: "¿Cuántos años duró la Guerra de los Cien Años entre Francia e Inglaterra?", answer: 116, note: "Desde 1337 hasta 1453 con diversas treguas intercaladas" },
    { text: "¿Cuántos años duró la Guerra de los Treinta Años en Europa central?", answer: 30, note: "Desde 1618 hasta la firma de la Paz de Westfalia en 1648" },
    { text: "¿Cuántos días duró la Guerra de los Seis Días en 1967 entre Israel y vecinos árabes?", answer: 6, note: "Del 5 al 10 de junio de 1967" },
    { text: "¿Cuántos días duró la Guerra de las Malvinas entre Argentina y el Reino Unido en 1982?", answer: 74, note: "Desde el 2 de abril hasta el 14 de junio de 1982" },
    { text: "¿Cuántos años estuvo en pie el Muro de Berlín dividiendo la ciudad (1961-1989)?", answer: 28, note: "Construido en agosto de 1961 y derribado en noviembre de 1989" },
    { text: "¿Cuántos días duró la Crisis de los Misiles de Cuba en octubre de 1962?", answer: 13, note: "El momento de mayor tensión nuclear de toda la Guerra Fría" },
    { text: "¿Cuántos años permaneció en prisión el líder sudafricano Nelson Mandela?", answer: 27, note: "Encarcelado en Robben Island y otras prisiones antes de su liberación en 1990" },
    { text: "¿Cuántos años rigió como monarca la reina Isabel II del Reino Unido?", answer: 70, note: "Desde 1952 hasta su fallecimiento en septiembre de 2022" },
    { text: "¿Cuántos años duró el reinado de Luis XIV de Francia ('El Rey Sol')?", answer: 72, note: "El reinado verificado más largo de cualquier monarca de la historia (1643-1715)" },
    { text: "¿Cuántos años duró el reinado de la reina Victoria del Reino Unido?", answer: 63, note: "Dio nombre a toda la Era Victoriana (1837-1901)" },
    { text: "¿Cuántos años de edad tenía Alejandro Magno cuando falleció en Babilonia?", answer: 32, note: "Había conquistado desde Grecia hasta las fronteras de la India" },
    { text: "¿Cuántos años tenía Juana de Arco cuando murió ejecutada en la hoguera en 1431?", answer: 19, note: "Heroína nacional francesa en la Guerra de los Cien Años" },
    { text: "¿Cuántos presidentes de Estados Unidos han sido asesinados durante su mandato?", answer: 4, note: "Abraham Lincoln, James A. Garfield, William McKinley y John F. Kennedy" },
    { text: "¿Cuántas repúblicas formaban la Unión Soviética al momento de disolverse?", answer: 15, note: "Rusia, Ucrania, Bielorrusia, Kazajistán, Uzbekistán, Georgia, etc." },
    { text: "¿Cuántos marineros regresaron en la nao Victoria capitaneada por Elcano en 1522?", answer: 18, note: "De los más de 240 hombres que zarparon tres años antes con Magallanes" },
    { text: "¿Cuántos barcos componían la expedición inicial de Fernando de Magallanes en 1519?", answer: 5, note: "Trinidad, San Antonio, Concepción, Victoria y Santiago" },
    { text: "¿Cuántas esposas oficiales tuvo el rey Enrique VIII de Inglaterra?", answer: 6, note: "Catalina de Aragón, Ana Bolena, Juana Seymour, Ana de Cléveris, Catalina Howard y Catalina Parr" },
    { text: "¿Cuántos soldados espartanos resistieron junto a Leónidas en las Termópilas?", answer: 300, note: "Hicieron frente al gigantesco ejército persa de Jerjes I" },
    { text: "¿Cuántas puñaladas recibió Julio César según relató el historiador Suetonio?", answer: 23, note: "Asesinado en el Senado durante los Idus de Marzo del año 44 a.C." },

    // --- CIENCIA, CUERPO HUMANO Y ESPACIO ---
    { text: "¿Cuántos huesos forman el esqueleto de un cuerpo humano adulto?", answer: 206, note: "Al nacer tenemos unos 270 huesos que se van fusionando con el crecimiento" },
    { text: "¿Cuántos dientes componen la dentición completa de un adulto con muelas del juicio?", answer: 32, note: "8 incisivos, 4 caninos, 8 premolares y 12 molares" },
    { text: "¿Cuántos cromosomas contiene una célula somática normal en el ser humano?", answer: 46, note: "Distribuidos en 23 parejas heredadas de padre y madre" },
    { text: "¿Cuántas costillas componen la caja torácica humana en total?", answer: 24, note: "12 pares de costillas (verdaderas, falsas y flotantes)" },
    { text: "¿Cuántos huesos componen la estructura anatómica de una sola mano humana?", answer: 27, note: "8 carpianos, 5 metacarpianos y 14 falanges" },
    { text: "¿Cuántos huesos forman la estructura ósea de un solo pie humano?", answer: 26, note: "7 tarsianos, 5 metatarsianos y 14 falanges" },
    { text: "¿Cuántas vértebras forman la columna vertebral de un adulto (con sacro y cóccix fusionados)?", answer: 26, note: "7 cervicales, 12 dorsales, 5 lumbares, el sacro y el cóccix" },
    { text: "¿Cuántas cavidades internas (aurículas y ventrículos) tiene el corazón de los mamíferos?", answer: 4, note: "Dos aurículas y dos ventrículos independientes" },
    { text: "¿Cuántas lunas o satélites naturales confirmados orbitan el planeta Júpiter?", answer: 95, note: "Entre ellas las 4 grandes lunas galileanas: Ío, Europa, Ganímedes y Calisto" },
    { text: "¿Cuántas lunas o satélites naturales confirmados tiene el planeta Saturno?", answer: 146, note: "El planeta del Sistema Solar con mayor número de satélites conocidos" },
    { text: "¿Cuántas lunas orbitan alrededor del planeta Marte?", answer: 2, note: "Fobos y Deimos, dos pequeñas lunas con forma irregular" },
    { text: "¿Cuántos minutos tarda aproximadamente la luz del Sol en llegar a la Tierra?", answer: 8, note: "Exactamente unos 8 minutos y 20 segundos a 300.000 km/s" },
    { text: "¿Cuántos miles de kilómetros de distancia media separan el centro de la Tierra de la Luna?", answer: 384, note: "Cabrian todos los planetas del Sistema Solar en esa distancia" },
    { text: "¿Cuántos elementos químicos componen formalmente la tabla periódica oficial?", answer: 118, note: "Desde el Hidrógeno (1) hasta el Oganesón (118)" },
    { text: "¿Cuántos astronautas en total han caminado sobre la superficie de la Luna en la historia?", answer: 12, note: "Repartidos en las 6 misiones Apolo que alunizaron entre 1969 y 1972" },

    // --- FÚTBOL Y CLUBES HISTÓRICOS ---
    { text: "¿Cuántos goles oficiales anotó Leo Messi en el año natural 2012 (récord mundial)?", answer: 91, note: "Superó la mítica marca de 85 goles de Gerd Müller de 1972" },
    { text: "¿Cuántos Balones de Oro ha ganado Lionel Messi a lo largo de su carrera?", answer: 8, note: "Récord histórico absoluto (2009, 2010, 2011, 2012, 2015, 2019, 2021, 2023)" },
    { text: "¿Cuántas Botas de Oro europeas ha ganado Lionel Messi?", answer: 6, note: "Máximo ganador histórico del trofeo de goleadores de liga" },
    { text: "¿Cuántos goles oficiales anotó Cristiano Ronaldo en la UEFA Champions League?", answer: 140, note: "Máximo goleador histórico del torneo europeo" },
    { text: "¿Cuántos Balones de Oro ha ganado Cristiano Ronaldo en su carrera?", answer: 5, note: "Ganados en 2008, 2013, 2014, 2016 y 2017" },
    { text: "¿Cuántos títulos oficiales conquistó Franck Ribéry durante su etapa en el Bayern de Múnich?", answer: 24, note: "Incluyendo 9 Bundesligas y la Champions League de 2013" },
    { text: "¿Cuántas Copas del Mundo masculinas de fútbol ha ganado la selección de Brasil?", answer: 5, note: "Suecia 1958, Chile 1962, México 1970, EE.UU. 1994 y Corea-Japón 2002" },
    { text: "¿En qué año se fundó el Sevilla Fútbol Club según sus estatutos oficiales?", answer: 1890, note: "Fundado el 25 de enero de 1890" },
    { text: "¿En qué año se fundó el Athletic Club de Bilbao?", answer: 1898, note: "Uno de los tres clubes que nunca ha bajado a Segunda División" },
    { text: "¿En qué año se fundó el Fútbol Club Barcelona?", answer: 1899, note: "Fundado por el suizo Hans Gamper el 29 de noviembre de 1899" },
    { text: "¿En qué año se fundó el Real Madrid Club de Fútbol?", answer: 1902, note: "Fundado oficialmente el 6 de marzo de 1902 por los hermanos Palacios" },
    { text: "¿En qué año se fundó el Club Atlético de Madrid?", answer: 1903, note: "Fundado por estudiantes vascos como sucursal del Athletic de Bilbao" },
    { text: "¿En qué año se fundó el Real Betis Balompié?", answer: 1907, note: "Inicialmente constituido como Sevilla Balompié" },
    { text: "¿En qué año se fundó el Recreativo de Huelva, decano del fútbol español?", answer: 1889, note: "El club de fútbol más antiguo con existencia ininterrumpida de España" },
    { text: "¿En qué año se fundó el Liverpool Football Club?", answer: 1892, note: "Tras una disputa por el arrendamiento del estadio de Anfield" },
    { text: "¿En qué año se fundó la Juventus de Turín en Italia?", answer: 1897, note: "Fundada por estudiantes del instituto Massimo d'Azeglio" },
    { text: "¿En qué año se fundó el Manchester United (originalmente Newton Heath)?", answer: 1878, note: "Fundado por los trabajadores del ferrocarril de Lancashire y Yorkshire" },

    // --- POLIDEPORTIVO Y RÉCORDS ---
    { text: "¿Cuántos títulos de Roland Garros ha ganado Rafael Nadal en su carrera?", answer: 14, note: "Un récord sin precedentes sobre tierra batida en la historia del tenis" },
    { text: "¿Cuántos torneos de Grand Slam individuales en total ha ganado Rafael Nadal?", answer: 22, note: "14 Roland Garros, 4 US Open, 2 Wimbledon y 2 Open de Australia" },
    { text: "¿Cuántos torneos 'Majors' de golf profesional ganó Jack Nicklaus (récord histórico)?", answer: 18, note: "Por delante de los 15 Majors de Tiger Woods" },
    { text: "¿Cuántos hoyos componen un recorrido reglamentario de golf estándar?", answer: 18 },
    { text: "¿Cuántos puntos anotó Wilt Chamberlain en un solo partido de la NBA en 1962?", answer: 100, note: "Récord imbatido con los Philadelphia Warriors contra los Knicks" },
    { text: "¿Cuántos puntos anotó Kobe Bryant contra los Raptors en enero de 2006?", answer: 81, note: "La segunda mayor anotación individual en la historia de la NBA" },
    { text: "¿Cuántos anillos de campeón de la NBA ganó Bill Russell como jugador?", answer: 11, note: "Todos ellos con la mítica dinastía de los Boston Celtics" },
    { text: "¿Cuántos anillos de la NBA ganó Michael Jordan con los Chicago Bulls?", answer: 6, note: "Dos 'three-peats': 1991-93 y 1996-98" },
    { text: "¿Cuántos kilómetros de distancia tiene una maratón oficial (número entero)?", answer: 42, note: "La distancia exacta reglamentaria es 42,195 km" },
    { text: "¿Cuántos minutos reglamentarios dura un partido oficial de rugby?", answer: 80, note: "Dividido en dos tiempos de 40 minutos cada uno" },

    // --- CUENTAS MATEMÁTICAS EQUILIBRADAS ---
    { text: "¿Cuánto es exactamente 17 multiplicado por 19?", answer: 323 },
    { text: "¿Cuánto es exactamente 14 multiplicado por 18?", answer: 252 },
    { text: "¿Cuánto es 2 elevado a la potencia de 10 (2¹⁰)?", answer: 1024, note: "Base del sistema binario y de 1 Kilobyte en informática" },
    { text: "¿Cuánto es 7 elevado al cubo (7 x 7 x 7)?", answer: 343 },
    { text: "¿Cuánto es 25 elevado al cuadrado (25 x 25)?", answer: 625 },
    { text: "¿Cuánto es 35 multiplicado por 12?", answer: 420 },
    { text: "¿Cuánto es 16 multiplicado por 16?", answer: 256 },
    { text: "¿Cuánto es 1000 dividido entre 8?", answer: 125 },
    { text: "¿Cuánto es el factorial de 5 (5 x 4 x 3 x 2 x 1)?", answer: 120 },
    { text: "¿Cuánto suman todos los números enteros del 1 al 20 inclusive?", answer: 210, note: "Fórmula de Gauss: (20 x 21) / 2 = 210" },

    // --- CULTURA, MÚSICA Y CURIOSIDADES ---
    { text: "¿Cuántas sinfonías completas compuso Ludwig van Beethoven?", answer: 9, note: "La 9ª incluye la célebre Oda a la Alegría de Friedrich Schiller" },
    { text: "¿Cuántas sinfonías numeradas compuso Wolfgang Amadeus Mozart?", answer: 41, note: "La última de ellas es la célebre Sinfonía Júpiter" },
    { text: "¿Cuántas sinfonías compuso Joseph Haydn ('el padre de la sinfonía')?", answer: 104 },
    { text: "¿Cuántas teclas en total tiene un piano acústico estándar (blancas y negras)?", answer: 88, note: "52 teclas blancas y 36 teclas negras" },
    { text: "¿Cuántos segundos exactos componen una hora de tiempo?", answer: 3600, note: "60 segundos por minuto x 60 minutos" },
    { text: "¿Cuántas casillas cuadradas en total componen un tablero de ajedrez?", answer: 64, note: "8 filas por 8 columnas (32 blancas y 32 negras)" },
    { text: "¿Cuántas estrellas doradas aparecen en círculo en la bandera de la Unión Europea?", answer: 12, note: "El 12 simboliza perfección, unidad y plenitud, no el número de países" },
    { text: "¿Cuántas cartas componen una baraja francesa de póker (sin comodines)?", answer: 52, note: "13 cartas por cada uno de los 4 palos (picas, corazones, tréboles y diamantes)" },
    { text: "¿Cuántos episodios en total tiene la aclamada serie 'Los Soprano'?", answer: 86, note: "Emitida durante 6 temporadas en HBO" },
    // --- VIDEOJUEGOS Y CULTURA GAMING ---
    { text: "¿En qué año se lanzó el legendario juego 'Super Mario Bros.' para la NES?", answer: 1985, note: "Creado por Shigeru Miyamoto para Nintendo" },
    { text: "¿En qué año se lanzó la primera consola PlayStation de Sony en Japón?", answer: 1994, note: "Llegó a Europa y Norteamérica al año siguiente, en 1995" },
    { text: "¿En qué año se lanzó el primer videojuego de Pokémon (Rojo y Verde)?", answer: 1996, note: "Desarrollado por Game Freak para la mítica Game Boy" },
    { text: "¿En qué año se creó el histórico juego 'Tetris' por Alekséi Pázhitnov?", answer: 1984, note: "Programado originalmente en un ordenador soviético Elektronika 60" },
    { text: "¿En qué año se lanzó la consola Nintendo 64 al mercado?", answer: 1996, note: "Pionera en entornos gráficos 3D con Super Mario 64" },
    { text: "¿En qué año se lanzó la primera consola Xbox por parte de Microsoft?", answer: 2001, note: "Acompañada por el lanzamiento de Halo: Combat Evolved" },
    { text: "¿En qué año se lanzó la versión completa (1.0) de Minecraft?", answer: 2011, note: "El videojuego más vendido de la historia con más de 300 millones de copias" },
    { text: "¿En qué año salió a la venta 'Grand Theft Auto V' (GTA V) originalmente?", answer: 2013, note: "Generó más de 1.000 millones de dólares en sus primeros tres días" },
    { text: "¿En qué año se lanzó la consola portátil Game Boy de Nintendo?", answer: 1989, note: "Ideada por Gunpei Yokoi, vendió casi 120 millones de unidades" },
    { text: "¿En qué año se lanzó el histórico juego 'World of Warcraft'?", answer: 2004, note: "El MMORPG que redefinió el género de fantasía online" },
    { text: "¿Cuántos Pokémon componían la primera generación de la región de Kanto?", answer: 151, note: "Desde Bulbasaur (número 001) hasta Mew (número 151)" },
    { text: "¿Cuántos personajes luchadores elegibles tenía el mítico 'Street Fighter II' (1991)?", answer: 8, note: "Ryu, Ken, Chun-Li, Guile, Blanka, Dhalsim, E. Honda y Zangief" },
    { text: "¿Cuántas estrellas secretas de poder hay que conseguir en Super Mario 64?", answer: 120, note: "Al conseguirlas se desbloquea el cañón del patio para visitar a Yoshi" },
    { text: "¿Cuántos botones tiene el mando original de la primera consola PlayStation (incluyendo cruceta y Start/Select)?", answer: 14, note: "Cruceta (4), 4 frontales, 4 superiores (L1, L2, R1, R2), Start y Select" },
    { text: "¿Cuántos millones de copias vendió la consola PlayStation 2 (la más vendida de la historia)?", answer: 155, note: "Se fabricó desde el año 2000 hasta principios de 2013" },

    // --- CINE, SERIES Y ENTRETENIMIENTO ---
    { text: "¿Cuántos premios Oscar ganó la película 'Titanic' de James Cameron en 1998?", answer: 11, note: "Récord histórico compartido con Ben-Hur y El Retorno del Rey" },
    { text: "¿Cuántos premios Oscar ganó 'El Señor de los Anillos: El Retorno del Rey' en 2004?", answer: 11, note: "Ganó las 11 candidaturas a las que estaba nominada (pleno total)" },
    { text: "¿Cuántos premios Oscar ganó la película 'Ben-Hur' de 1959?", answer: 11, note: "Fue la primera cinta de la historia en alcanzar dicha cifra de estatuillas" },
    { text: "¿En qué año se estrenó la primera película de 'Star Wars' (Una nueva esperanza)?", answer: 1977, note: "Escrita y dirigida por George Lucas" },
    { text: "¿En qué año se estrenó en cines la película 'Parque Jurásico' (Jurassic Park)?", answer: 1993, note: "Dirigida por Steven Spielberg, marcó un antes y un después en efectos CGI" },
    { text: "¿En qué año se estrenó la película de culto 'Pulp Fiction' de Quentin Tarantino?", answer: 1994, note: "Ganó la prestigiosa Palma de Oro del Festival de Cannes" },
    { text: "¿En qué año se estrenó la obra maestra 'El Padrino' de Francis Ford Coppola?", answer: 1972, note: "Protagonizada por Marlon Brando y Al Pacino" },
    { text: "¿En qué año se estrenó la primera película de animación digital 'Toy Story'?", answer: 1995, note: "El primer largometraje íntegramente animado por ordenador de Pixar" },
    { text: "¿En qué año se estrenó en cines 'Matrix' de las hermanas Wachowski?", answer: 1999, note: "Famosa por popularizar el efecto de cámara lenta 'bullet time'" },
    { text: "¿En qué año se estrenó la película 'Gladiator' protagonizada por Russell Crowe?", answer: 2000, note: "Ganó 5 premios Oscar incluyendo Mejor Película" },
    { text: "¿Cuántas películas oficiales componen la saga cinematográfica principal de Harry Potter?", answer: 8, note: "Adaptación de los 7 libros (las Reliquias de la Muerte se dividió en 2)" },
    { text: "¿Cuántas temporadas completas tuvo la aclamada serie 'Breaking Bad'?", answer: 5, note: "Protagonizada por Bryan Cranston como Walter White" },
    { text: "¿Cuántos episodios en total componen la serie 'Breaking Bad'?", answer: 62, note: "El samario (Sm) es el elemento 62 de la tabla periódica, usado contra el cáncer" },
    { text: "¿Cuántos episodios en total tiene la serie 'Juego de Tronos' (Game of Thrones)?", answer: 73, note: "Emitidos a lo largo de 8 temporadas en HBO" },
    { text: "¿Cuántas temporadas completas tuvo la mítica serie de comedia 'Friends'?", answer: 10, note: "Con un total de 236 episodios entre 1994 y 2004" },
    { text: "¿Cuántos minutos dura la versión en cines de 'La Comunidad del Anillo'?", answer: 178, note: "Casi 3 horas de metraje de pura fantasía épica" },

    // --- HISTORIA DE ESPAÑA Y CULTURA ---
    { text: "¿En qué año concluyó la Reconquista con la toma de Granada por los Reyes Católicos?", answer: 1492, note: "El 2 de enero de 1492 tras la entrega de llaves por Boabdil" },
    { text: "¿En qué año contrajeron matrimonio Isabel I de Castilla y Fernando II de Aragón?", answer: 1469, note: "Celebrado de forma secreta en el Palacio de los Vivero de Valladolid" },
    { text: "¿En qué año se libró la decisiva batalla de las Navas de Tolosa en Jaén?", answer: 1212, note: "Gran victoria militar de los reinos cristianos sobre el califato almohade" },
    { text: "¿En qué año se publicó la primera parte de 'Don Quijote de la Mancha'?", answer: 1605, note: "Impresa en Madrid en el taller de Juan de la Cuesta" },
    { text: "¿En qué año se publicó la segunda parte del Quijote por Cervantes?", answer: 1615, note: "Exactamente un año antes de la muerte de Miguel de Cervantes" },
    { text: "¿En qué año comenzó la conquista musulmana de la península ibérica tras la batalla de Guadalete?", answer: 711, note: "Tropas al mando de Táriq ibn Ziyad desembarcaron en Gibraltar" },
    { text: "¿Cuántos años duró la presencia musulmana en al-Ándalus (desde 711 hasta 1492)?", answer: 781, note: "Casi ocho siglos de historia compartida y florecimiento cultural" },
    { text: "¿En qué año se fundó la Real Academia Española (RAE)?", answer: 1713, note: "Bajo el lema: 'Limpia, fija y da esplendor'" },
    { text: "¿En qué año se inauguró formalmente el Museo del Prado en Madrid?", answer: 1819, note: "Bajo el reinado de Fernando VII por iniciativa de la reina María Isabel de Braganza" },
    { text: "¿En qué año nació el genial pintor Pablo Picasso en Málaga?", answer: 1881, note: "Pintó el histórico mural 'Guernica' en 1937" },
    { text: "¿En qué año nació el pintor surrealista Salvador Dalí en Figueres?", answer: 1904, note: "Famoso por sus relojes blandos y su estilo iconoclasta" },
    { text: "¿En qué año ingresó España oficialmente en la Comunidad Económica Europea (actual UE)?", answer: 1986, note: "El 1 de enero de 1986 de forma conjunta con Portugal" },
    { text: "¿En qué año entraron en circulación física los billetes y monedas de Euro en España?", answer: 2002, note: "El 1 de enero de 2002 sustituyendo a la peseta" },
    { text: "¿Cuántas pesetas equivalían oficialmente a 1 Euro en el tipo de cambio oficial?", answer: 166, note: "La cifra exacta fijada por ley era 166,386 pesetas" },
    { text: "¿En qué año se celebraron los míticos Juegos Olímpicos de Barcelona?", answer: 1992, note: "Coincidiendo con la Exposición Universal de Sevilla (Expo 92)" },
    { text: "¿En qué año conquistó la selección española masculina de fútbol su primer Mundial en Sudáfrica?", answer: 2010, note: "Con el legendario gol de Andrés Iniesta en el minuto 116 de la prórroga" },
    { text: "¿En qué año ganó España su primera Eurocopa de fútbol frente a la URSS?", answer: 1964, note: "Con el recordado gol de Marcelino en el estadio Santiago Bernabéu" },
    { text: "¿Cuántas Eurocopas masculinas absolutas de fútbol ha conquistado España?", answer: 4, note: "1964, 2008, 2012 y 2024 (el país con más trofeos del continente)" },

    // --- REINO ANIMAL, NATURALEZA Y MUNDO SALVAJE ---
    { text: "¿Cuántos ojos tiene en total una abeja obrera común?", answer: 5, note: "Dos ojos compuestos grandes a los lados y tres ocelos simples en la frente" },
    { text: "¿Cuántos corazones o arcos aórticos bombean la sangre en una lombriz de tierra?", answer: 5, note: "Tienen cinco pares de arcos aórticos que funcionan como corazones" },
    { text: "¿A cuántos metros de distancia puede olfatear un oso polar a una presa bajo el hielo?", answer: 1000, note: "Poseen uno de los olfatos más agudos de todos los carnívoros terrestres" },
    { text: "¿Cuántos meses consecutivos puede llegar a hibernar un oso pardo en invierno?", answer: 7, note: "Su temperatura corporal desciende y el corazón late a unas 10 ppm" },
    { text: "¿Cuántas especies diferentes de pingüinos existen actualmente en el planeta?", answer: 18, note: "Desde el diminuto pingüino azul hasta el imponente pingüino emperador" },
    { text: "¿A cuántos kilómetros por hora puede llegar a nadar un pez espada?", answer: 97, note: "Su espada y piel especial reducen la resistencia al agua en un 90%" },
    { text: "¿Cuántos kilómetros de distancia puede llegar a recorrer en su migración un charrán ártico (en miles)?", answer: 70, note: "Vuela de polo a polo cada año, la migración más larga del reino animal" },
    { text: "¿Cuántos kilómetros puede volar planeando una fragata marina sin tocar tierra?", answer: 4000, note: "Capaz de mantenerse en vuelo continuo durmiendo en pequeños intervalos" },
    { text: "¿Cuántas horas al día dedican los leones salvajes a dormir o descansar?", answer: 20, note: "Pasan hasta el 80% del día ahorrando energía para las cacerías nocturnas" },
    { text: "¿Cuántas vértebras lumbares tiene la columna vertebral de un perro doméstico?", answer: 7, note: "Permiten la gran flexibilidad de movimiento y carrera de los cánidos" },

    // --- MÁS PORCENTAJES (%) CURIOSOS Y CIENTÍFICOS ---
    { text: "¿Qué porcentaje del peso corporal de un ser humano representa la piel?", answer: 16, note: "Es el órgano más extenso y pesado de nuestro cuerpo" },
      { text: "¿Qué porcentaje de la energía y glucosa que consume el cuerpo gasta únicamente el cerebro?", answer: 20, note: "Representa solo el 2% de la masa corporal pero consume la quinta parte" },
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
interface Room {
  code: string;
  hostPlayerId: string;
  players: Player[];
  phase: Phase;
  question: (typeof QUESTIONS)[number] | null;
  currentBid: number;
  isTriplazo: boolean;
  bidsHistory: Array<{ playerName: string; bid: number; isTriplazo?: boolean }>;
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
      bidsHistory: (room as any).bidsHistory ?? [],
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
      questionNote: room.phase === "RESULTS" ? room.question?.note ?? null : null,
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

  const isExactMatch = room.currentBid === room.question.answer;
  const success = room.isTriplazo ? isExactMatch : room.currentBid <= room.question.answer;
  room.latestOutcome = success ? "SUCCESS" : "CRASH";

  room.latestResults = room.players.map((player) => {
    const isCaptain = player.id === room.captainId;
    const decision = isCaptain ? "STAY" : (room.decisions[player.id] ?? "LEAVE");
    let pointsEarned: number;

    if (success) {
      if (room.isTriplazo) {
        // Triplazo acertado clavado
        pointsEarned = isCaptain ? 8 : (decision === "STAY" ? 4 : -1);
      } else if (isExactMatch) {
        // Apuesta normal clavada exacta
        pointsEarned = isCaptain ? 6 : (decision === "STAY" ? 3 : -1);
      } else {
        // No se estrella
        pointsEarned = isCaptain ? 5 : (decision === "STAY" ? 2 : -1);
      }
    } else {
      // El coche se estrella
      if (room.isTriplazo) {
        pointsEarned = isCaptain ? -5 : (decision === "STAY" ? -3 : 2);
      } else {
        pointsEarned = isCaptain ? -3 : (decision === "STAY" ? -2 : 2);
      }
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
function pickUniqueQuestion(room: any) {
  if (!room.usedQuestionIndices) room.usedQuestionIndices = [];
  if (room.usedQuestionIndices.length >= QUESTIONS.length) room.usedQuestionIndices = [];
  const available = QUESTIONS.map((_, i) => i).filter(i => !room.usedQuestionIndices.includes(i));
  const chosen = available[randomInt(available.length)];
  room.usedQuestionIndices.push(chosen);
  return QUESTIONS[chosen];
}
function startRound(room: Room, starterId: string) {
  const connectedPlayers = room.players.filter((player) => player.connected);
  if (connectedPlayers.length < 2) return false;

  const starter = room.players.find((player) => player.id === starterId && player.connected)
    ?? connectedPlayers[0];
  const question = pickUniqueQuestion(room);
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
(room as any).bidsHistory = [];
  for (const player of room.players) {
    player.hasActed = false;
    player.folded = false; // Nadie empieza plantado: todos pueden jugar
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
          bidsHistory: [],
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

        // Guardamos la puja en el historial para mostrarla en pantalla
        if (!(room as any).bidsHistory) {
          (room as any).bidsHistory = [];
        }
        (room as any).bidsHistory.push({
          playerName: player.name,
          bid: bet,
          isTriplazo: isTriplazo
        });

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

      // Si ya hemos jugado 20 rondas, volvemos a la sala de espera y reseteamos todo a cero
      const currentRoundNum = (room as any).roundNumber ?? (room as any).round ?? (room as any).game?.roundNumber ?? (room as any).game?.round ?? 1;
      if (currentRoundNum >= 20) {
        room.phase = "LOBBY";
        (room as any).roundNumber = 0;
        if ((room as any).round) (room as any).round = 0;
        if ((room as any).game) {
          (room as any).game.roundNumber = 0;
          (room as any).game.round = 0;
        }

        // Reseteamos los puntos de todos los jugadores
        for (const p of room.players) {
          (p as any).score = 0;
          (p as any).points = 0;
          (p as any).totalScore = 0;
        }
        if ((room as any).scores) (room as any).scores = {};
        if ((room as any).game?.scores) (room as any).game.scores = {};

        // Emitimos la sala actualizada a todos los jugadores para que vuelvan al Lobby
        emitRoomState(room);
        reply(ack, { success: true, room: roomSnapshot(room) });
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
