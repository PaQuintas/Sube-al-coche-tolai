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
    { text: "¿Cuántos años duró la presencia musulmana en al-Ándalus ?", answer: 781, note: "Casi ocho siglos de historia compartida y florecimiento cultural" },
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
    // --- PORCENTAJES (%) FASCINANTES: CIENCIA, CUERPO Y ALIMENTOS ---
    { text: "¿Qué porcentaje del peso de un pepino es simplemente agua?", answer: 96, note: "El vegetal sólido con mayor porcentaje de agua que existe" },
    { text: "¿Qué porcentaje del peso de un tomate maduro es agua?", answer: 94, note: "Prácticamente toda su pulpa es líquido con nutrientes" },
    { text: "¿Qué porcentaje del peso de una manzana común está compuesto por agua?", answer: 85, note: "Además de contener un 25% de aire, por eso flotan en el agua" },
    { text: "¿Qué porcentaje de las calorías de la leche materna humana provienen de las grasas?", answer: 50, note: "Fundamental para el desarrollo cerebral y energético del recién nacido" },
    { text: "¿Qué porcentaje del peso de un hueso humano vivo está compuesto por agua?", answer: 31, note: "Aunque parecen secos, casi un tercio de su masa es agua" },
    { text: "¿Qué porcentaje del peso de un músculo humano es agua?", answer: 75, note: "Por eso una ligera deshidratación reduce drásticamente la fuerza física" },
    { text: "¿Qué porcentaje del polvo doméstico común de una casa está formado por piel muerta humana?", answer: 70, note: "Desprendemos unas 30.000 a 40.000 células muertas de piel por minuto" },
    { text: "¿Qué porcentaje de las personas en el mundo tiene los ojos marrones?", answer: 79, note: "El color de iris más común y dominante de toda la humanidad" },
    { text: "¿Qué porcentaje de la población mundial tiene los ojos de color azul?", answer: 8, note: "Surgió por una mutación genética única hace entre 6.000 y 10.000 años" },
    { text: "¿Qué porcentaje de la población mundial tiene los ojos verdes (el color más raro común)?", answer: 2, note: "Apenas el 2% de los seres humanos del planeta poseen ojos verdes" },
    { text: "¿Qué porcentaje de la población mundial es pelirroja natural?", answer: 2, note: "Causado por mutaciones en el gen receptor MC1R" },
    { text: "¿Qué porcentaje del ADN humano es idéntico entre dos personas cualesquiera en el mundo?", answer: 99, note: "Aproximadamente el 99,9%; solo un 0,1% nos hace genéticamente únicos" },
    { text: "¿Qué porcentaje del ADN de un ser humano es idéntico al de un plátano?", answer: 50, note: "Compartimos la mitad de genes basales necesarios para la replicación celular" },

    // --- PORCENTAJES (%) DE LA TIERRA, OCÉANOS Y UNIVERSO ---
    { text: "¿Qué porcentaje de toda el agua de la Tierra es agua salada marina?", answer: 97, note: "Solo el 3% restante es agua dulce superficial, subterránea o glaciar" },
    { text: "¿Qué porcentaje de los fondos marinos de la Tierra sigue sin ser explorado por el ser humano?", answer: 80, note: "Conocemos mejor la superficie de Marte o la Luna que el fondo oceánico" },
    { text: "¿Qué porcentaje de toda la masa del Universo está compuesta por Hidrógeno y Helio?", answer: 98, note: "Los dos elementos más ligeros y abundantes nacidos en el Big Bang" },
    { text: "¿Qué porcentaje de la atmósfera del planeta Marte está compuesto por dióxido de carbono (CO2)?", answer: 95, note: "Haciendo imposible que los humanos respiremos allí de forma natural" },
    { text: "¿Qué porcentaje de la selva del Amazonas se encuentra dentro de las fronteras de Brasil?", answer: 60, note: "El resto se reparte entre Perú, Colombia, Venezuela, Bolivia y otros" },
    { text: "¿Qué porcentaje de los incendios forestales en el mundo son provocados por la mano humana?", answer: 90, note: "Por negligencias, colillas, barbacoas o fuegos intencionados" },
    { text: "¿Qué porcentaje de la electricidad generada en Francia proviene de la energía nuclear?", answer: 70, note: "Francia es el país con mayor dependencia y producción nuclear civil de Europa" },
    { text: "¿Qué porcentaje del territorio de Noruega está cubierto por montañas o rocas?", answer: 70, note: "Lo que explica su orografía de fiordos y poca superficie agrícola" },
    { text: "¿Qué porcentaje del territorio de Japón está cubierto por frondosos bosques?", answer: 67, note: "Uno de los países más industrializados con mayor porcentaje boscoso" },

    // --- PORCENTAJES (%) DE SOCIEDAD, VIDA COTIDIANA Y PSICOLOGÍA ---
    { text: "¿Qué porcentaje de las compras en comercios en Suecia se realizan sin dinero en efectivo?", answer: 95, note: "Uno de los países del mundo más cercanos a la erradicación del papel moneda" },
    { text: "¿Qué porcentaje de las personas experimenta la sensación de 'déjà vu' al menos una vez en su vida?", answer: 65, note: "Sensación cerebral momentánea de haber vivido ya una situación presente" },
    { text: "¿Qué porcentaje de la comunicación cara a cara humana es no verbal (gestos, tono y postura)?", answer: 93, note: "Según el clásico modelo de comunicación del psicólogo Albert Mehrabian" },
    { text: "¿Qué porcentaje del sueño nocturno pasamos aproximadamente en fase REM (fase de los sueños)?", answer: 25, note: "Alrededor de 90 a 120 minutos en una noche completa de 8 horas" },
    { text: "¿Qué porcentaje de la sal que consumimos a diario procede de alimentos ya procesados?", answer: 75, note: "La gran mayoría viene oculta en panes, embutidos y salsas industriales" },
    { text: "¿Qué porcentaje del tráfico total de Internet mundial corresponde al consumo de vídeo en streaming?", answer: 65, note: "Liderado masivamente por YouTube, Netflix, TikTok e Instagram" },

    // --- PREGUNTAS AL MÁS PURO ESTILO 'PAREN LA NAVE' ---
    { text: "¿Cuántos litros de sangre tiene aproximadamente el cuerpo de un adulto de 70 kg?", answer: 5, note: "Equivale a cerca del 7% al 8% de nuestro peso corporal total" },
    { text: "¿Cuántos kilómetros por hora de velocidad punta alcanzó el récord mundial de los 100 metros de Usain Bolt?", answer: 44, note: "Registró un pico máximo exacto de 44,72 km/h en el Mundial de Berlín 2009" },
    { text: "¿Cuántos años duró la construcción de la Torre Eiffel de París?", answer: 2, note: "Apenas 2 años, 2 meses y 5 días; un prodigio de rapidez para la época" },
    { text: "¿Cuántos años tardó en construirse la Gran Pirámide de Guiza según las estimaciones históricas?", answer: 20, note: "Construida durante el reinado del faraón Keops hacia el 2550 a.C." },
    { text: "¿Cuántos metros de longitud tiene una piscina olímpica oficial de competición?", answer: 50, note: "Con una profundidad mínima reglamentaria de 2 metros" },
    { text: "¿Cuántos metros mide la longitud reglamentaria de una pista de bolos (bowling)?", answer: 18, note: "Exactamente 18,29 metros desde la línea de falta hasta el primer bolo" },
    { text: "¿Cuántos kilómetros de altura sobre el suelo marca la Línea de Kármán (frontera oficial del espacio)?", answer: 100, note: "El límite reconocido internacionalmente donde termina la atmósfera y empieza el espacio" },
    { text: "¿A cuántos grados Celsius bajo cero se encuentra el Cero Absoluto físico (0 Kelvin)?", answer: 273, note: "Exactamente -273,15 °C; la temperatura a la que se detiene todo movimiento térmico" },
    { text: "¿Cuántas piezas de ajedrez tiene cada jugador al inicio de la partida?", answer: 16, note: "8 peones, 2 torres, 2 caballos, 2 alfiles, 1 dama y 1 rey" },
    { text: "¿Cuántos dados se utilizan reglamentariamente en el juego de mesa clásico del Risk?", answer: 5, note: "3 dados rojos para el atacante y 2 dados azules para el defensor" },
    { text: "¿Cuántas casillas componen el tablero tradicional de juego del Monopoly?", answer: 40, note: "28 propiedades, 4 casillas de esquina y 8 casillas de eventos/impuestos" },
    { text: "¿Cuántos cuadros pintó Vincent van Gogh aproximadamente a lo largo de su vida?", answer: 900, note: "Además de más de 1.100 dibujos y bocetos en apenas una década" },
    { text: "¿Cuántos cuadros consiguió vender Vincent van Gogh en vida?", answer: 1, note: "'El viñedo rojo', vendido en Bruselas por 400 francos meses antes de su muerte" },
    { text: "¿Cuántos días dura una vuelta completa de la Luna sobre sí misma y alrededor de la Tierra?", answer: 27, note: "Por rotación sincrónica siempre muestra la misma cara visible hacia la Tierra" },
    { text: "¿Cuántos años terrestres tarda el planeta Saturno en dar una vuelta completa al Sol?", answer: 29, note: "Casi tres décadas de nuestro tiempo por cada año saturniano" },
    { text: "¿Cuántos años terrestres tarda el planeta Neptuno en dar una sola órbita al Sol?", answer: 165, note: "Completó su primera órbita documentada desde su descubrimiento en 2011" },
    { text: "¿Cuántas cuerdas tiene un violín clásico tradicional?", answer: 4, note: "Afinadas en quintas: Sol, Re, La y Mi" },
    { text: "¿Cuántos hoyos de digitación tiene una flauta dulce soprano convencional?", answer: 8, note: "Siete orificios frontales y uno posterior para el pulgar" },
    { text: "¿Cuántas cartas tiene una baraja española tradicional sin ochos ni nueves?", answer: 40, note: "4 palos de 10 cartas cada uno (del 1 al 7, más Sota, Caballo y Rey)" },
    { text: "¿Cuántas cartas tiene la baraja española ampliada (con ochos y nueves)?", answer: 48, note: "12 cartas por cada uno de los cuatro palos" },
    { text: "¿Cuántos kilómetros mide el Maratón de Boston (distancia oficial redondeada)?", answer: 42, note: "El maratón anual más antiguo del mundo, celebrado desde 1897" },
    { text: "¿Cuántos miembros componen formalmente el Congreso de los Diputados de España?", answer: 350, note: "Elegidos por sufragio universal mediante sistema proporcional D'Hondt" },
    // --- MEGATANDA: MÁS PORCENTAJES (%) BRUTALES ---
    { text: "¿Qué porcentaje de las especies vivas que han habitado la Tierra a lo largo de su historia se han extinguido ya?", answer: 99, note: "Más del 99% de todas las formas de vida del planeta ya no existen hoy" },
    { text: "¿Qué porcentaje de la masa de nuestro cuerpo está compuesto por solo 6 elementos químicos?", answer: 99, note: "Oxígeno, carbono, hidrógeno, nitrógeno, calcio y fósforo forman casi todo nuestro ser" },
    { text: "¿Qué porcentaje del peso del cuerpo humano representa aproximadamente el esqueleto óseo?", answer: 15, note: "En un adulto de 70 kg, los huesos pesan alrededor de 10 a 11 kilos" },
    { text: "¿Qué porcentaje del peso de la sangre humana es plasma sanguíneo?", answer: 55, note: "El 45% restante son células (glóbulos rojos, blancos y plaquetas)" },
    { text: "¿Qué porcentaje de las calorías que quemamos a diario corresponden al metabolismo basal en reposo?", answer: 70, note: "Gastamos la mayor parte de energía simplemente respirando y manteniendo las células vivas" },
    { text: "¿Qué porcentaje de las personas en el mundo tienen sangre del grupo sanguíneo Rh positivo?", answer: 85, note: "Solo el 15% de la población mundial tiene factor Rh negativo" },
    { text: "¿Qué porcentaje de la población mundial adulta es intolerante a la lactosa en algún grado?", answer: 68, note: "La capacidad de digerir leche en la edad adulta es una mutación mayoritaria solo en Europa" },
    { text: "¿Qué porcentaje de la superficie de la Luna está iluminada por el Sol en cualquier instante?", answer: 50, note: "Siempre la mitad exacta, aunque desde la Tierra veamos distintas fases según el ángulo" },
    { text: "¿Qué porcentaje de la atmósfera del planeta Venus está compuesto por dióxido de carbono?", answer: 96, note: "Provoca un efecto invernadero desbocado con temperaturas superficiales de 465 °C" },
    { text: "¿Qué porcentaje de los seres vivos conocidos en el planeta Tierra habitan en los océanos?", answer: 80, note: "La gran mayoría de la biodiversidad planetaria está bajo la superficie marina" },
    { text: "¿Qué porcentaje de la superficie de Islandia está cubierta por glaciares?", answer: 11, note: "Entre ellos el Vatnajökull, el mayor glaciar de Europa por volumen de hielo" },
    { text: "¿Qué porcentaje de la superficie de Groenlandia está cubierta por una gruesa capa de hielo?", answer: 80, note: "Si se derritiera entera, el nivel de los mares del mundo subiría más de 7 metros" },
    { text: "¿Qué porcentaje de la energía eléctrica consumida en Noruega se produce mediante energía hidroeléctrica?", answer: 90, note: "Aprovechan sus montañas, ríos y saltos de agua naturales para generar energía limpia" },
    { text: "¿Qué porcentaje de los diamantes naturales del mundo se destinan a usos industriales y no a joyería?", answer: 80, note: "Utilizados en brocas, sierras y pulidoras por su extrema dureza" },
    { text: "¿Qué porcentaje del tráfico marítimo comercial mundial pasa a través del Estrecho de Malaca?", answer: 25, note: "El paso clave que conecta los océanos Índico y Pacífico entre Malasia e Indonesia" },
    { text: "¿Qué porcentaje del peso de una patata común recién cosechada es agua?", answer: 80, note: "El 20% restante es materia seca, principalmente almidón" },
    { text: "¿Qué porcentaje del peso de una lechuga es simplemente agua?", answer: 95, note: "Junto con el pepino, es de los alimentos con menor densidad calórica" },
    { text: "¿Qué porcentaje del peso de una fresa madura es agua?", answer: 91, note: "Una fruta ligera compuesta casi en su totalidad por agua y fructosa" },
    { text: "¿Qué porcentaje de los billetes de euro en circulación en las ciudades suelen contener trazas de cocaína?", answer: 90, note: "Se transfieren por el roce mecánico dentro de los cajeros automáticos" },
    { text: "¿Qué porcentaje de la población activa de España trabaja aproximadamente en el sector servicios?", answer: 75, note: "Turismo, hostelería, comercio y sanidad dominan el empleo español" },
    { text: "¿Qué porcentaje de los terremotos del planeta se registran a lo largo del Cinturón de Fuego del Pacífico?", answer: 90, note: "La zona con mayor fricción y subducción tectónica del mundo" },
    { text: "¿Qué porcentaje de la madera de un árbol talado es carbono puro extraído del aire?", answer: 50, note: "Por eso los bosques son fundamentales sumideros de dióxido de carbono" },
    { text: "¿Qué porcentaje de los bebés nacen exactamente en la fecha probable de parto estimada por el médico?", answer: 5, note: "Apenas 1 de cada 20 partos se produce en el día exacto de la cuenta" },
    { text: "¿Qué porcentaje de la población mundial vive a menos de 100 kilómetros de la costa?", answer: 40, note: "Las zonas litorales concentran la mayor densidad demográfica y económica" },
    { text: "¿Qué porcentaje de la superficie de la Unión Europea está cubierta por bosques?", answer: 39, note: "Alrededor de 160 millones de hectáreas de arbolado" },

    // --- ANATOMÍA, SALUD Y CUERPO HUMANO ---
    { text: "¿Cuántos litros de aire inhala y exhala aproximadamente un adulto en reposo en un minuto?", answer: 6, note: "Unas 12 a 15 respiraciones de medio litro por minuto" },
    { text: "¿Cuántos millones de glóbulos rojos produce la médula ósea humana cada segundo?", answer: 2, note: "Unos 2 millones de eritrocitos generados sin pausa cada segundo" },
    { text: "¿Cuántos músculos componen en total el cuerpo de un ser humano?", answer: 650, note: "Aproximadamente 650 músculos esqueléticos voluntarios catalogados" },
    { text: "¿Cuántos músculos faciales intervienen aproximadamente al sonreír de manera natural?", answer: 12, note: "Principalmente el cigomático mayor y el orbicular de los ojos" },
    { text: "¿Cuántos centímetros crece el cabello humano de media a lo largo de un año?", answer: 15, note: "Alrededor de 1,25 centímetros por mes en condiciones normales" },
    { text: "¿Cuántos litros de saliva produce una persona adulta de media cada día?", answer: 1, note: "Entre 1 y 1,5 litros diarios, vitales para digerir y proteger el esmalte" },
    { text: "¿Cuántos latidos por minuto tiene de media el corazón de un recién nacido sano?", answer: 140, note: "Mucho más rápido que el de un adulto, variando entre 120 y 160 ppm" },
    { text: "¿Cuántos grupos sanguíneos básicos existen en el sistema clásico ABO?", answer: 4, note: "Grupo A, Grupo B, Grupo AB y Grupo O" },
    { text: "¿Cuántos huesos forman el cráneo humano completo (incluyendo los huesos faciales)?", answer: 22, note: "8 huesos craneales protectores del cerebro y 14 huesos de la cara" },
    { text: "¿Cuántos centímetros mide de media el intestino delgado de una persona adulta?", answer: 600, note: "Mide unos 6 metros de longitud enrollado en la cavidad abdominal" },
    { text: "¿Cuántos centímetros de longitud mide el intestino grueso (colon) en un adulto?", answer: 150, note: "Aproximadamente un metro y medio de recorrido" },
    { text: "¿Cuántos gramos pesa aproximadamente el corazón de un adulto sano?", answer: 300, note: "Aproximadamente el tamaño del puño cerrado de esa misma persona" },
    { text: "¿Cuántos gramos pesa de media el cerebro de un ser humano adulto?", answer: 1400, note: "Supone apenas el 2% del peso del cuerpo humano" },

    // --- GEOGRAFÍA URBANA Y PLANETA TIERRA ---
    { text: "¿Cuántos países del mundo tienen frontera territorial directa con Francia?", answer: 8, note: "Bélgica, Luxemburgo, Alemania, Suiza, Italia, Mónaco, España y Andorra (sin contar Guayana)" },
    { text: "¿Cuántos países del mundo tienen frontera territorial directa con Italia?", answer: 6, note: "Francia, Suiza, Austria, Eslovenia, San Marino y Ciudad del Vaticano" },
    { text: "¿Cuántos kilómetros de anchura mínima tiene el Estrecho de Gibraltar entre España y Marruecos?", answer: 14, note: "Exactamente 14,4 km separan Europa de África en su punto más estrecho" },
    { text: "¿Cuántos kilómetros de longitud tiene el Canal de Suez en Egipto?", answer: 193, note: "Conecta el Mar Mediterráneo directamente con el Mar Rojo" },
    { text: "¿Cuántos kilómetros de longitud tiene el Canal de Panamá entre el Atlántico y el Pacífico?", answer: 82, note: "A través de un ingenioso sistema escalonado de esclusas" },
    { text: "¿Cuántos metros de caída de agua tienen las Cataratas de Iguazú en su salto mayor (Garganta del Diablo)?", answer: 82, note: "Ubicadas en la frontera natural entre Argentina y Brasil" },
    { text: "¿Cuántos metros sobre el nivel del mar se encuentra la ciudad de La Paz (Bolivia)?", answer: 3640, note: "La sede de gobierno a mayor altitud de todo el planeta" },
    { text: "¿Cuántos metros de profundidad tiene el cráter del volcán Vesubio en Italia?", answer: 305, note: "El famoso volcán cuya erupción sepultó Pompeya y Herculano en el año 79 d.C." },
    { text: "¿Cuántos países independientes componen el continente de Oceanía?", answer: 14, note: "Australia, Nueva Zelanda, Fiyi, Papúa Nueva Guinea, Samoa y otros estados insulares" },
    { text: "¿Cuántas colinas históricas dieron origen a la fundación de la antigua Roma?", answer: 7, note: "Aventino, Celio, Capitolio, Esquilino, Palatino, Quirinal y Viminal" },
    { text: "¿Cuántos municipios componen el Principado de Asturias (concejos)?", answer: 78, note: "El concejo es la unidad administrativa básica asturiana" },
    { text: "¿Cuántas provincias componen la comunidad autónoma de Castilla y León?", answer: 9, note: "Ávila, Burgos, León, Palencia, Salamanca, Segovia, Soria, Valladolid y Zamora" },
    { text: "¿Cuántas provincias componen la comunidad autónoma de Andalucía?", answer: 8, note: "Almería, Cádiz, Córdoba, Granada, Huelva, Jaén, Málaga y Sevilla" },

    // --- AÑOS HISTÓRICOS Y GRANDES MOMENTOS ---
    { text: "¿En qué año se fundó la ciudad de Roma según la tradición mítica de Rómulo y Remo (a.C.)?", answer: 753, note: "Fundada el 21 de abril del 753 a.C." },
    { text: "¿En qué año fue asesinado el dictador Julio César en el Senado de Roma (a.C.)?", answer: 44, note: "Durante los famosos Idus de Marzo del año 44 a.C." },
    { text: "¿En qué año se produjo la erupción del volcán Vesubio que sepultó Pompeya?", answer: 79, note: "El 24 de agosto del 79 d.C. bajo el mandato del emperador Tito" },
    { text: "¿En qué año promulgó el emperador Constantino el Edicto de Milán legalizando el cristianismo?", answer: 313, note: "Permitió la libertad de culto en todo el Imperio Romano" },
    { text: "¿En qué año se firmó la Carta Magna en Inglaterra limitando el poder del rey Juan Sin Tierra?", answer: 1215, note: "Pilar fundamental del constitucionalismo y los derechos civiles modernos" },
    { text: "¿En qué año llegó el navegante portugués Vasco da Gama a la India por mar?", answer: 1498, note: "Abrió la ruta marítima europea hacia las especias rodeando África" },
    { text: "¿En qué año clavó Martín Lutero sus 95 tesis iniciando la Reforma Protestante?", answer: 1517, note: "En la puerta de la iglesia del palacio de Wittenberg" },
    { text: "¿En qué año fue derrotada la 'Armada Invencible' española frente a las costas británicas?", answer: 1588, note: "Mandada por Felipe II contra la Inglaterra de Isabel I" },
    { text: "¿En qué año se fundó la Universidad de Harvard en Massachusetts?", answer: 1636, note: "La institución de educación superior más antigua de los Estados Unidos" },
    { text: "¿En qué año publicó Isaac Newton su obra maestra 'Philosophiae Naturalis Principia Mathematica'?", answer: 1687, note: "Donde formuló las leyes del movimiento y la gravitación universal" },
    { text: "¿En qué año comenzó la Guerra de Secesión estadounidense?", answer: 1861, note: "Enfrentó a los estados del Norte (Unión) contra el Sur confederado" },
    { text: "¿En qué año terminó la Guerra de Secesión de los Estados Unidos?", answer: 1865, note: "Rendición del general Robert E. Lee en Appomattox Court House" },
    { text: "¿En qué año patentó Thomas Edison la primera bombilla incandescente comercialmente viable?", answer: 1879, note: "Utilizó un filamento de hilo de algodón carbonizado" },
    { text: "¿En qué año se inauguró el monumento de la Estatua de la Libertad en Nueva York?", answer: 1886, note: "El 28 de octubre de 1886 por el presidente Grover Cleveland" },
    { text: "¿En qué año realizaron los hermanos Wright el primer vuelo a motor controlado de la historia?", answer: 1903, note: "El 17 de diciembre de 1903 en Kitty Hawk, Carolina del Norte" },
    { text: "¿En qué año ganó Marie Curie su primer Premio Nobel (en Física)?", answer: 1903, note: "En 1911 ganó el segundo en Química, siendo la primera persona con dos Nobel" },
    { text: "¿En qué año fundó Henry Ford su famosa empresa automovilística Ford Motor Company?", answer: 1903, note: "Pionera en la producción en masa con la cadena de montaje del Model T" },
    { text: "¿En qué año cayó la monarquía en Rusia con la abdicación del zar Nicolás II?", answer: 1917, note: "En la Revolución de Febrero de 1917" },
    { text: "¿En qué año se fundó la Organización de las Naciones Unidas (ONU) tras la Segunda Guerra Mundial?", answer: 1945, note: "El 24 de octubre de 1945 con la firma de la Carta de San Francisco" },
    { text: "¿En qué año se inauguró el monumento del Cristo Redentor sobre el cerro del Corcovado en Río de Janeiro?", answer: 1931, note: "Inaugurado el 12 de octubre de 1931" },
    { text: "¿En qué año se aprobó el sufragio femenino en España durante la Segunda República?", answer: 1931, note: "Defendido con brillantez parlamentaria por Clara Campoamor" },
    { text: "¿En qué año comenzó la construcción del Muro de Berlín?", answer: 1961, note: "La noche del 12 al 13 de agosto de 1961 por la RDA" },
    { text: "¿En qué año se produjo el asesinato del presidente John F. Kennedy en Dallas?", answer: 1963, note: "El 22 de noviembre de 1963 en la Plaza Dealey" },
    { text: "¿En qué año se celebró el legendario festival musical de Woodstock?", answer: 1969, note: "En agosto de 1969, con más de 400.000 asistentes" },
    { text: "¿En qué año se lanzó el telescopio espacial Hubble al espacio?", answer: 1990, note: "A bordo del transbordador espacial Discovery de la NASA" },

    // --- CULTURA POP, CINE, MÚSICA Y VIDEOJUEGOS ---
    { text: "¿Cuántas nominaciones a los premios Oscar consiguió la película 'Titanic' de James Cameron?", answer: 14, note: "Récord histórico de nominaciones compartido con Eva al desnudo y La La Land" },
    { text: "¿Cuántas películas forman la saga cinematográfica de 'El Padrino' dirigida por Francis Ford Coppola?", answer: 3, note: "Estrenadas en los años 1972, 1974 y 1990" },
    { text: "¿Cuántos premios Oscar ganó Walt Disney a lo largo de su trayectoria profesional (récord absoluto)?", answer: 26, note: "De un asombroso total de 59 nominaciones en su carrera" },
    { text: "¿En qué año se estrenó la película animada 'El Rey León' de Disney?", answer: 1994, note: "Una de las películas de animación más taquilleras de todos los tiempos" },
    { text: "¿En qué año se estrenó en cines la primera película de James Bond ('Agente 007 contra el Dr. No')?", answer: 1962, note: "Protagonizada por el mítico Sean Connery" },
    { text: "¿Cuántos actores han encarnado oficialmente a James Bond en la franquicia de Eon Productions?", answer: 6, note: "Sean Connery, George Lazenby, Roger Moore, Timothy Dalton, Pierce Brosnan y Daniel Craig" },
    { text: "¿Cuántos álbumes de estudio oficiales en solitario lanzó el cantante Michael Jackson?", answer: 10, note: "Desde 'Got to Be There' (1972) hasta 'Invincible' (2001)" },
    { text: "¿En qué año se lanzó el legendario álbum 'Thriller' de Michael Jackson?", answer: 1982, note: "El disco musical más vendido de toda la historia de la música" },
    { text: "¿En qué año se lanzó el revolucionario disco 'The Dark Side of the Moon' de Pink Floyd?", answer: 1973, note: "Permaneció más de 900 semanas en la lista Billboard de ventas" },
    { text: "¿Cuántos miembros componían la mítica banda británica The Beatles?", answer: 4, note: "John Lennon, Paul McCartney, George Harrison y Ringo Starr" },
    { text: "¿En qué año se disolvió oficialmente la banda The Beatles?", answer: 1970, note: "Tras el lanzamiento de su último álbum de estudio, 'Let It Be'" },
    { text: "¿En qué año se lanzó a la venta la primera muñeca Barbie en Nueva York?", answer: 1959, note: "Creada por Ruth Handler para la compañía Mattel" },
    { text: "¿En qué año se estrenó en televisión el primer episodio de 'Los Simpson' como serie independiente?", answer: 1989, note: "Especial navideño emitido el 17 de diciembre de 1989" },
    { text: "¿Cuántas temporadas completas se emitieron de la serie de fantasía 'Juego de Tronos'?", answer: 8, note: "Emitida por HBO entre los años 2011 y 2019" },
    { text: "¿En qué año salió a la venta la consola GameCube de Nintendo con su icónico diseño de asa?", answer: 2001, note: "Utilizaba mini-DVDs de 1,5 GB de capacidad" },
    { text: "¿En qué año se lanzó la plataforma de vídeos YouTube antes de ser comprada por Google?", answer: 2005, note: "Fundada por Chad Hurley, Steve Chen y Jawed Karim" },
    { text: "¿En qué año se lanzó la red social Twitter (hoy X) con su límite original de 140 caracteres?", answer: 2006, note: "El primer tuit de Jack Dorsey fue: 'just setting up my twttr'" },
    { text: "¿En qué año se lanzó la red social Instagram por Kevin Systrom y Mike Krieger?", answer: 2010, note: "Inicialmente lanzada de forma exclusiva para dispositivos iOS" },

    // --- DEPORTES Y CURIOSIDADES COMPETITIVAS ---
    { text: "¿Cuántos jugadores por equipo están simultáneamente en el campo en un partido de balonmano?", answer: 7, note: "6 jugadores de pista y 1 portero por equipo" },
    { text: "¿Cuántos jugadores por equipo están en el terreno de juego en un partido de béisbol defensivo?", answer: 9, note: "Lanzador, receptor y siete jugadores de campo" },
    { text: "¿Cuántos jugadores forman el quinteto inicial en la pista de baloncesto?", answer: 5, note: "Base, escolta, alero, ala-pívot y pívot" },
    { text: "¿Cuántos puntos vale anotar un 'try' o ensayo en un partido reglamentario de rugby?", answer: 5, note: "Más 2 puntos extra si se convierte la posterior patada a palos" },
    { text: "¿Cuántos metros de altura tiene la canasta de baloncesto respecto al suelo según la FIBA y la NBA?", answer: 305, note: "Exactamente 3,05 metros (10 pies de altura reglamentarios)" },
    { text: "¿Cuántos segundos tiene de límite una posesión de ataque reglamentaria en la NBA y la FIBA?", answer: 24, note: "Si el balón no toca el aro antes de 24 segundos, pasa al rival" },
    { text: "¿Cuántos campeonatos del mundo de Fórmula 1 conquistó el piloto alemán Michael Schumacher?", answer: 7, note: "Récord histórico compartido con el británico Lewis Hamilton" },
    { text: "¿Cuántos campeonatos del mundo de Fórmula 1 ganó el brasileño Ayrton Senna?", answer: 3, note: "Campeón con McLaren en 1988, 1990 y 1991" },
    { text: "¿Cuántos títulos de Liga de Primera División española (LaLiga) ha conquistado el Real Madrid en su historia?", answer: 36, note: "El club con más títulos de liga en la historia del fútbol español" },
    { text: "¿Cuántos títulos de Copa del Rey de fútbol ha conquistado el Fútbol Club Barcelona?", answer: 31, note: "El 'Rey de Copas' del fútbol español" },
    { text: "¿Cuántas medallas olímpicas de oro en total ganó el nadador Michael Phelps (récord olímpico absoluto)?", answer: 23, note: "De un botín total inalcanzable de 28 medallas olímpicas" },
    { text: "¿Cuántas medallas de oro olímpicas conquistó el velocista Usain Bolt en su trayectoria?", answer: 8, note: "Doblete 100m y 200m en Pekín 2008, Londres 2012 y Río 2016" },
    // --- MÁS PORCENTAJES (%) ASOMBROSOS: MUNDO, CONSUMO Y CIENCIA ---
    { text: "¿Qué porcentaje de las especies animales del planeta viven en la selva tropical?", answer: 50, note: "Pese a que las selvas ocupan apenas el 6% de la superficie de la Tierra" },
    { text: "¿Qué porcentaje del peso corporal de un ser humano representa la sangre?", answer: 8, note: "Aproximadamente 1 doceavo del peso total de una persona" },
    { text: "¿Qué porcentaje de los gatos domésticos responden con euforia a la hierba gatera (catnip)?", answer: 70, note: "Es una respuesta genética hereditaria mediada por la nepetalactona" },
    { text: "¿Qué porcentaje de los ataques cardíacos ocurren en las primeras horas de la mañana?", answer: 40, note: "Debido al pico matutino de cortisol y presión arterial al despertar" },
    { text: "¿Qué porcentaje de la sal marina producida en el mundo se destina a consumo humano directo?", answer: 10, note: "El 90% restante se usa para deshielo de carreteras y procesos químicos industriales" },
    { text: "¿Qué porcentaje del café producido en el mundo corresponde a la variedad Arábica?", answer: 60, note: "El 40% restante es de la variedad Robusta, más amarga y con más cafeína" },
    { text: "¿Qué porcentaje del plástico producido en la historia del mundo ha sido reciclado efectivamente?", answer: 9, note: "La gran mayoría termina en vertederos, incinerado o en los océanos" },
    { text: "¿Qué porcentaje de los arrecifes de coral del mundo se encuentran en peligro o amenazados?", answer: 75, note: "Debido al aumento de temperatura del agua marina y la acidificación" },
    { text: "¿Qué porcentaje de la producción mundial de aceite de oliva procede de España?", answer: 45, note: "España es el líder absoluto indiscutible de la producción mundial oleícola" },
    { text: "¿Qué porcentaje de los vuelos comerciales mundiales despegan o aterrizan con retraso de media?", answer: 20, note: "Aproximadamente 1 de cada 5 vuelos regulares en el mundo" },
    { text: "¿Qué porcentaje de los usuarios de teléfonos inteligentes mira su móvil en los primeros 15 minutos tras despertarse?", answer: 80, note: "Uno de los hábitos tecnológicos más extendidos de la era moderna" },
    { text: "¿Qué porcentaje de las especies de peces catalogadas son de agua dulce?", answer: 40, note: "A pesar de que los ríos y lagos representan menos del 1% del agua del planeta" },
    { text: "¿Qué porcentaje del territorio de los Países Bajos se encuentra por debajo del nivel del mar?", answer: 26, note: "Protegidos por una colosal red histórica de diques y pólderes" },
    { text: "¿Qué porcentaje de la atmósfera de la Tierra es vapor de agua en promedio?", answer: 1, note: "Oscila entre el 0,1% en los polos fríos y el 4% en los trópicos húmedos" },
    { text: "¿Qué porcentaje del calor acumulado por el calentamiento global ha sido absorbido por los océanos?", answer: 90, note: "Los mares actúan como el mayor amortiguador térmico de la Tierra" },
    { text: "¿Qué porcentaje de los diamantes en bruto del mundo se tallan en la ciudad de Surat (India)?", answer: 90, note: "Surat procesa 9 de cada 10 diamantes comerciales de todo el planeta" },
    { text: "¿Qué porcentaje de la superficie total de Australia está considerada como desértica o semidesértica?", answer: 70, note: "El gigantesco territorio interior despoblado conocido como Outback" },
    { text: "¿Qué porcentaje de la población de Canadá vive a menos de 100 kilómetros de la frontera con EE.UU.?", answer: 70, note: "La inmensa mayoría de canadienses habitan en una estrecha franja sur templada" },
    { text: "¿Qué porcentaje de las búsquedas en Google en todo el mundo se realizan a través de teléfonos móviles?", answer: 63, note: "Superando ampliamente desde 2016 a los ordenadores de sobremesa" },
    { text: "¿Qué porcentaje de la masa del cuerpo humano es nitrógeno?", answer: 3, note: "Componente esencial de todas nuestras proteínas y ácidos nucleicos" },
    { text: "¿Qué porcentaje de las recetas médicas en la medicina tradicional antigua usaban miel de abejas?", answer: 80, note: "Por sus potentes propiedades antibacterianas y conservantes naturales" },
    { text: "¿Qué porcentaje de la leche fresca de vaca es agua?", answer: 87, note: "El 13% restante son sólidos: grasa, lactosa, proteínas y minerales" },
    { text: "¿Qué porcentaje de la cerveza común estándar es agua pura?", answer: 90, note: "El tipo y mineralización del agua define en gran medida el estilo cervecero" },
    { text: "¿Qué porcentaje del vino embotellado estándar suele ser agua?", answer: 85, note: "El 15% restante está compuesto por alcohol etílico, azúcares y taninos" },
    { text: "¿Qué porcentaje de la superficie del continente africano está ocupado por el desierto del Sahara?", answer: 30, note: "Cubre cerca de 9 millones de kilómetros cuadrados en el norte del continente" },

    // --- REINO ANIMAL, NATURALEZA Y MARAVILLAS ---
    { text: "¿Cuántos años puede llegar a vivir una tortuga gigante de las Galápagos en libertad?", answer: 150, note: "Algunos ejemplares en cautividad han superado los 175 años de vida" },
    { text: "¿Cuántos metros de longitud puede alcanzar un calamar gigante hembra adulto?", answer: 13, note: "Sus ojos pueden ser del tamaño de un plato de comida (unos 27 cm)" },
    { text: "¿Cuántos metros puede llegar a medir la envergadura de alas de un cóndor de los Andes?", answer: 3, note: "Una de las aves voladoras terrestres más colosales del planeta" },
    { text: "¿Cuántos metros mide la envergadura de alas del albatros viajero (el mayor del mundo)?", answer: 3, note: "Puede alcanzar hasta 3,5 metros de punta a punta de sus alas" },
    { text: "¿Cuántos dedos tiene en total un gato doméstico normal contando las 4 patas?", answer: 18, note: "5 dedos en cada pata delantera y 4 dedos en cada pata trasera" },
    { text: "¿Cuántos dientes tiene un caracol común en su rádula bucal (en miles)?", answer: 14, note: "Tienen unas 14.000 diminutas estructuras dentadas microscópicas para raspar" },
    { text: "¿Cuántas patas tiene un ciempiés común de la clase quilópodos como promedio?", answer: 30, note: "Varían según la especie entre 30 y 350 patas, pero siempre un número impar de pares" },
    { text: "¿Cuántos litros de agua puede llegar a beber un camello sediento en apenas 10 minutos?", answer: 100, note: "Capaz de rehidratarse a una velocidad asombrosa sin que exploten sus glóbulos rojos" },
    { text: "¿Cuántos kilos de carne puede llegar a comer un león macho adulto en una sola sentada?", answer: 35, note: "Tras una gran cacería puede pasar varios días descansando y digiriendo" },
    { text: "¿Cuántos kilos de bambú necesita ingerir un oso panda gigante cada día para nutrirse?", answer: 30, note: "Debido a su digestión poco eficiente, pasa hasta 14 horas comiendo al día" },
    { text: "¿Cuántas cámaras tiene el estómago de un camello o un dromedario?", answer: 3, note: "A diferencia de las vacas que tienen 4, los camélidos poseen 3 cámaras" },
    { text: "¿Cuántas especies de abejas catalogadas existen aproximadamente en el mundo (en miles)?", answer: 20, note: "La gran mayoría son abejas solitarias que no viven en colmenas" },
    { text: "¿Cuántos kilómetros de distancia puede llegar a recorrer en vuelo continuo una langosta del desierto al día?", answer: 150, note: "Forman plagas voraces que devoran miles de toneladas de vegetación" },
    { text: "¿Cuántos días puede sobrevivir una cucaracha común sin cabeza antes de morir de sed?", answer: 9, note: "Respiran por espiráculos en su cuerpo; mueren al no poder beber agua" },
    { text: "¿Cuántos corazones tiene una lombriz intestinal o una sanguijuela?", answer: 0, note: "Carecen de corazón verdadero; mueven sus fluidos por contracción de vasos laterales" },

    // --- CIENCIA, FÍSICA, QUÍMICA Y ESPACIO ---
    { text: "¿Cuántos kilómetros por segundo recorre la luz en el vacío (en miles redondeado)?", answer: 300, note: "Exactamente 299.792 km/s; la velocidad límite del Universo" },
    { text: "¿A cuántos grados Celsius hierve el agua pura al nivel del mar?", answer: 100, note: "A mayor altitud y menor presión hierve a menos temperatura" },
    { text: "¿A cuántos grados Celsius se congela el agua dulce pura al nivel del mar?", answer: 0, note: "Punto de solidificación bajo una atmósfera estándar de presión" },
    { text: "¿Cuántos minutos tarda la Estación Espacial Internacional (ISS) en dar una vuelta completa a la Tierra?", answer: 90, note: "Viaja a unos 27.600 km/h, viviendo 16 amaneceres y atardeceres al día" },
    { text: "¿Cuántos planetas enanos oficiales reconoce actualmente la Unión Astronómica Internacional en el Sistema Solar?", answer: 5, note: "Plutón, Ceres, Eris, Makemake y Haumea" },
    { text: "¿Cuántos anillos principales tiene el planeta Saturno (denominados de la A a la G)?", answer: 7, note: "Compuestos por miles de millones de partículas de hielo y roca" },
    { text: "¿Cuántos millones de kilómetros separan de media a la Tierra del Sol (1 Unidad Astronómica)?", answer: 150, note: "Aproximadamente 149,6 millones de kilómetros" },
    { text: "¿Cuántos satélites galileanos principales descubrió Galileo Galilei orbitando Júpiter en 1610?", answer: 4, note: "Ío, Europa, Ganímedes y Calisto; demostraron que no todo orbita la Tierra" },
    { text: "¿Cuántos protones tiene en su núcleo atómico un átomo de oro (número atómico)?", answer: 79, note: "El elemento 79 de la tabla periódica (Au)" },
    { text: "¿Cuántos protones tiene en su núcleo atómico el átomo de carbono (base de la vida orgánica)?", answer: 6, note: "Elemento capaz de formar largas cadenas y anillos orgánicos estables" },
    { text: "¿Cuántos protones tiene el elemento químico Uranio (número atómico)?", answer: 92, note: "El elemento químico natural más pesado y básico de la fisión nuclear" },
    { text: "¿Cuántos metros de altura tiene la torre de lanzamiento del cohete Saturno V que fue a la Luna?", answer: 110, note: "Más alto que la Estatua de la Libertad de Nueva York" },

    // --- GEOGRAFÍA MUNDIAL Y CIUDADES ---
    { text: "¿Cuántos países integran el Reino Unido de Gran Bretaña e Irlanda del Norte?", answer: 4, note: "Inglaterra, Escocia, Gales e Irlanda del Norte" },
    { text: "¿Cuántos estados componen la República Federal de Alemania (Länder)?", answer: 16, note: "Entre ellos tres ciudades-estado: Berlín, Hamburgo y Bremen" },
    { text: "¿Cuántos cantones componen la Confederación Suiza?", answer: 26, note: "20 cantones completos y 6 semicantones históricos" },
    { text: "¿Cuántas regiones autónomas componen el territorio de la República Italiana?", answer: 20, note: "Cinco de ellas con estatuto especial de autonomía" },
    { text: "¿Cuántos distritos municipales componen la ciudad de Madrid?", answer: 21, note: "Centro, Chamberí, Salamanca, Retiro, Vallecas, Latina, etc." },
    { text: "¿Cuántos distritos municipales componen la ciudad de Barcelona?", answer: 10, note: "Ciutat Vella, Eixample, Gràcia, Sarrià-Sant Gervasi, etc." },
    { text: "¿Cuántos municipios tiene la isla de Mallorca?", answer: 53, note: "Palma es la capital y municipio más poblado" },
    { text: "¿Cuántos puentes históricos cruzan el río Sena dentro de los límites de París?", answer: 37, note: "El más antiguo en pie es el célebre Pont Neuf (Puente Nuevo) de 1607" },
    { text: "¿Cuántos volcanes activos o potencialmente activos se encuentran en territorio de Islandia?", answer: 32, note: "Ubicada justo sobre la dorsal mesoatlántica de separación de placas" },
    { text: "¿Cuántas líneas principales componen la red del Metro de Madrid (sin ramal ni metro ligero)?", answer: 12, note: "Una de las redes de metro subterráneo más extensas del mundo" },
    { text: "¿Cuántas estrellas rojas aparecen en la bandera oficial de la Comunidad de Madrid?", answer: 7, note: "Representan las siete estrellas de la constelación de la Osa Mayor" },

    // --- CULTURA, LITERATURA, CINE Y SERIES ---
    { text: "¿Cuántos libros componen la saga original de novelas de 'Harry Potter' escritas por J.K. Rowling?", answer: 7, note: "Desde 'La piedra filosofal' (1997) hasta 'Las reliquias de la muerte' (2007)" },
    { text: "¿Cuántos capítulos tiene la célebre novela 'Alicia en el país de las maravillas' de Lewis Carroll?", answer: 12, note: "Publicada en 1865 con ilustraciones clásicas de John Tenniel" },
    { text: "¿Cuántos cuentos componen 'Las mil y una noches' según el título clásico de la obra?", answer: 1001, note: "Relatados noche tras noche por Sherezade al sultán Shahriar" },
    { text: "¿Cuántas películas de James Bond protagonizó el actor Pierce Brosnan?", answer: 4, note: "GoldenEye, El mañana nunca muere, El mundo nunca es suficiente y Muere otro día" },
    { text: "¿Cuántas películas de James Bond protagonizó el actor Daniel Craig?", answer: 5, note: "Casino Royale, Quantum of Solace, Skyfall, Spectre y No Time to Die" },
    { text: "¿Cuántas películas de James Bond protagonizó el actor Sean Connery (oficiales de Eon)?", answer: 6, note: "Desde Dr. No (1962) hasta Diamantes para la eternidad (1971)" },
    { text: "¿Cuántas películas oficiales componen la trilogía original de 'Star Wars' (Episodios IV, V y VI)?", answer: 3, note: "Estrenadas en cines en 1977, 1980 y 1983" },
    { text: "¿Cuántos premios Oscar ganó la película 'La La Land' de Damien Chazelle?", answer: 6, note: "Tras el famoso error de sobre con Moonlight a Mejor Película" },
    { text: "¿Cuántos minutos dura la versión cinematográfica original de 'Pulp Fiction'?", answer: 154, note: "Dos horas y media de diálogos memorables y estructura no lineal" },
    { text: "¿Cuántos episodios componen la célebre serie española 'Aquí no hay quien viva'?", answer: 90, note: "Emitidos a lo largo de 5 temporadas en Antena 3 entre 2003 y 2006" },
    { text: "¿Cuántas temporadas duró la histórica serie de animación 'Futurama' en su primera etapa televisiva?", answer: 5, note: "Creada por Matt Groening y David X. Cohen para Fox" },
    { text: "¿Cuántos personajes componían la tripulación del Halcón Milenario al salir de Tatooine en Star Wars IV?", answer: 4, note: "Han Solo, Chewbacca, Luke Skywalker y Obi-Wan Kenobi (más los 2 droides)" },

    // --- DEPORTES, OLIMPIADAS Y RÉCORDS ---
    { text: "¿Cuántos minutos dura reglamentariamente una prórroga de partido de fútbol dividida en dos partes?", answer: 30, note: "Dos tiempos adicionales de 15 minutos cada uno" },
    { text: "¿Cuántos penaltis lanza inicialmente cada equipo en una tanda de desempate en fútbol?", answer: 5, note: "Si persiste el empate, se pasa a muerte súbita tiro a tiro" },
    { text: "¿Cuántos puntos suma el equipo vencedor de un partido en la fase regular de la Champions League moderna?", answer: 3, note: "1 punto por empate y 0 puntos por derrota" },
    { text: "¿Cuántos metros mide la longitud reglamentaria de una portería de fútbol profesional de poste a poste?", answer: 7, note: "Exactamente 7,32 metros (8 yardas) por 2,44 metros de altura" },
    { text: "¿Cuántos kilómetros recorren los ciclistas en una Gran Vuelta como el Tour de Francia (en miles redondeado)?", answer: 3, note: "Alrededor de 3.400 a 3.500 km repartidos en 21 etapas" },
    { text: "¿Cuántas etapas componen habitualmente una de las tres Grandes Vueltas ciclistas (Tour, Giro o Vuelta)?", answer: 21, note: "Con dos días de descanso intercalados para el pelotón" },
    { text: "¿Cuántos torneos de Grand Slam individuales ganó el tenista suizo Roger Federer?", answer: 20, note: "8 Wimbledon, 6 Open de Australia, 5 US Open y 1 Roland Garros" },
    { text: "¿Cuántos torneos de Grand Slam individuales ha conquistado el serbio Novak Djokovic?", answer: 24, note: "El tenista masculino con mayor palmarés de Grand Slam de la era abierta" },
    { text: "¿Cuántos jugadores están en el campo por equipo en un partido de voleibol de pista?", answer: 6, note: "Tres delanteros y tres zagueros en rotación obligatoria" },
    { text: "¿Cuántos sets necesita ganar un equipo para llevarse un partido de voleibol al mejor de 5?", answer: 3, note: "Se juegan al primero que gane 3 sets de 25 puntos (quinto set a 15)" },
    { text: "¿Cuántos puntos se necesitan para ganar un set reglamentario en tenis de mesa (ping-pong)?", answer: 11, note: "Con diferencia mínima de dos puntos respecto al oponente" },
    { text: "¿Cuántos strikes consecutivos se necesitan para lograr una partida perfecta de 300 puntos en los bolos?", answer: 12, note: "10 cuadros logrando pleno más los dos tiros extra del último cuadro" },

    // --- GASTRONOMÍA, ALIMENTACIÓN Y CONSUMO ---
    { text: "¿Cuántos gramos de cafeína contiene aproximadamente una taza de café espresso estándar (en mg)?", answer: 65, note: "Oscila entre 60 y 80 miligramos según el tueste y la molienda" },
    { text: "¿Cuántos grados alcohólicos suele tener un vodka o ginebra estándar embotellado?", answer: 40, note: "El clásico 40% de volumen alcohólico fijado por tradición internacional" },
    { text: "¿Cuántos días suele durar el proceso de curación mínima de un jamón ibérico de bellota (en cientos)?", answer: 36, note: "Unos 36 meses (3 años completos) para alcanzar la denominación de bellota" },
    { text: "¿Cuántas calorías tiene aproximadamente 1 gramo de grasa pura?", answer: 9, note: "Frente a las 4 calorías por gramo que aportan los hidratos y proteínas" },
    { text: "¿Cuántos gramos de azúcar contiene aproximadamente una lata estándar de refresco de cola (330 ml)?", answer: 35, note: "Equivalente a casi 9 terrones de azúcar refinado" },
    { text: "¿Cuántas uvas se comen tradicionalmente en España al sonar las doce campanadas de Nochevieja?", answer: 12, note: "Costumbre popularizada en 1909 por los viticultores alicantinos" },
    { text: "¿Cuántos huevos suele poner una gallina ponedora industrial al año en promedio?", answer: 300, note: "Casi un huevo por día gracias a la selección genética y nutricional" },
    { text: "¿Cuántos meses puede tardar en madurar un queso Parmigiano Reggiano clásico de máxima calidad?", answer: 24, note: "Dos años enteros de maduración lenta en bodegas controladas" },

    // --- CURIOSIDADES COTIDIANAS Y DATOS SORPRENDENTES ---
    { text: "¿Cuántos peldaños tiene la emblemática Torre del Oro de Sevilla hasta su terraza superior?", answer: 92, note: "Torre albarrana almohade del siglo XIII que vigilaba el Guadalquivir" },
    { text: "¿Cuántos metros de longitud mide la plaza de San Pedro en el Vaticano en su eje mayor?", answer: 320, note: "Diseñada magistralmente por Gian Lorenzo Bernini en el siglo XVII" },
    { text: "¿Cuántas columnas monumentales componen la columnata de Bernini en la Plaza de San Pedro?", answer: 284, note: "Dispuetas en cuatro filas de majestuoso orden dórico" },
    { text: "¿Cuántas estatuas de santos coronan la columnata de la Plaza de San Pedro en Roma?", answer: 140, note: "Esculpidas por discípulos de Bernini en travertino" },
    { text: "¿Cuántos caracteres como máximo permitía publicar la red social Twitter (X) en sus inicios?", answer: 140, note: "Basado en el límite técnico de los mensajes SMS de telefonía móvil" },
    { text: "¿Cuántas horas tiene exactamente un año bisiesto completo de 366 días?", answer: 8784, note: "366 días multiplicado por 24 horas" },
    { text: "¿Cuántos kilómetros por hora de velocidad punta puede alcanzar un tren de alta velocidad AVE comercial?", answer: 300, note: "Velocidad estándar de crucero en las líneas españolas" },
    { text: "¿Cuántos pisos en total tiene la famosa Torre de Hércules en La Coruña (faro romano)?", answer: 3, note: "El único faro romano en el mundo que sigue en funcionamiento activo" },
    // --- MEGATANDA 3: PORCENTAJES (%) IMPACTANTES ---
    { text: "¿Qué porcentaje del oxígeno que produce la fotosíntesis en la Tierra procede de los bosques y selvas terrestres?", answer: 50, note: "El otro 50% lo generan las algas microscópicas y el fitoplancton marino" },
    { text: "¿Qué porcentaje de las especies de plantas conocidas tienen flores (angiospermas)?", answer: 90, note: "El grupo vegetal más dominante y diverso del planeta" },
    { text: "¿Qué porcentaje de los seres humanos nacen con al menos un diente ya erupcionado (dientes natales)?", answer: 1, note: "Ocurre en apenas 1 de cada 2.000 a 3.000 nacimientos" },
    { text: "¿Qué porcentaje de los pájaros del mundo pertenecen al orden de los paseriformes (pájaros cantores)?", answer: 60, note: "Más de la mitad de las aves del planeta son de este orden" },
    { text: "¿Qué porcentaje de la masa del Sol está compuesta por gas hidrógeno?", answer: 74, note: "El 24% restante es helio y un 2% de elementos más pesados" },
    { text: "¿Qué porcentaje del volumen del aire expirado por los pulmones humanos sigue siendo oxígeno?", answer: 16, note: "Inhalamos un 21% de oxígeno y exhalamos un 16%; por eso funciona el boca a boca" },
    { text: "¿Qué porcentaje del peso del cerebro humano es grasa pura?", answer: 60, note: "El cerebro es el órgano con mayor concentración de lípidos del cuerpo" },
    { text: "¿Qué porcentaje de los residuos domésticos en un hogar estándar corresponden a restos orgánicos?", answer: 40, note: "Casi la mitad de la basura diaria son restos de comida y cáscaras" },
    { text: "¿Qué porcentaje de la producción mundial de plátanos procede de países de América Latina y el Caribe?", answer: 70, note: "Ecuador es el mayor exportador mundial de plátano" },
    { text: "¿Qué porcentaje de la superficie de la Península Antártica está libre de hielo de forma permanente?", answer: 2, note: "El 98% del continente blanco permanece bajo una colosal capa de hielo" },
    { text: "¿Qué porcentaje de la electricidad producida en España en 2023 provino de fuentes renovables?", answer: 50, note: "Un hito histórico liderado por la energía eólica y la solar fotovoltaica" },
    { text: "¿Qué porcentaje del cuerpo de un recién nacido es agua?", answer: 75, note: "Mucho mayor que en un adulto (60%), descendiendo durante el primer año de vida" },
    { text: "¿Qué porcentaje de los niños en el mundo nacen siendo gemelos o mellizos naturales?", answer: 3, note: "Aproximadamente 3 de cada 100 nacimientos naturales en el mundo" },
    { text: "¿Qué porcentaje de la población mundial vive en países en vías de desarrollo?", answer: 85, note: "La inmensa mayoría de los habitantes del planeta" },
    { text: "¿Qué porcentaje del café mundial se consume durante el desayuno?", answer: 65, note: "La primera comida del día concentra casi dos tercios del consumo" },
    { text: "¿Qué porcentaje de la lana comercial del mundo proviene de ovejas de raza merina?", answer: 50, note: "Originaria históricamente de España y extendida a nivel global" },
    { text: "¿Qué porcentaje de los vehículos nuevos vendidos en Noruega son actualmente 100% eléctricos?", answer: 80, note: "El país líder mundial indiscutible en adopción de movilidad eléctrica" },
    { text: "¿Qué porcentaje de la superficie de Suiza está dominada por los Alpes?", answer: 60, note: "Configurando su paisaje alpino y sus deportes de nieve" },
    { text: "¿Qué porcentaje de la salmuera del Mar Muerto es sal mineralizada?", answer: 34, note: "Casi 10 veces más salado que el agua del océano abierto, impidiendo el hundimiento" },
    { text: "¿Qué porcentaje de los vuelos comerciales tienen azafatos o auxiliares masculinos?", answer: 25, note: "Aproximadamente uno de cada cuatro miembros de tripulación de cabina" },
    { text: "¿Qué porcentaje de la energía que gasta un teléfono inteligente se debe a la pantalla encendida?", answer: 50, note: "El panel táctil iluminado es el componente que más batería drena" },
    { text: "¿Qué porcentaje de las calorías del aguacate provienen de sus grasas cardiosaludables?", answer: 77, note: "Rico en ácido oleico monoinsaturado muy similar al aceite de oliva" },
    { text: "¿Qué porcentaje de los teléfonos móviles desechados en el mundo acaban en la basura sin reciclar?", answer: 80, note: "Un grave desafío ecológico de basura electrónica moderna" },
    { text: "¿Qué porcentaje de la población española reside en municipios costeros?", answer: 40, note: "Gran concentración urbana y turística en el litoral mediterráneo y atlántico" },
    { text: "¿Qué porcentaje de la luz de una bombilla incandescente tradicional antigua se perdía en forma de calor?", answer: 90, note: "Solo un 10% se transformaba en luz visible real; el LED resolvió esto" },

    // --- TECNOLOGÍA, INTERNET Y REDES ---
    { text: "¿En qué año se envió el primer mensaje de correo electrónico (email) de la historia por Ray Tomlinson?", answer: 1971, note: "Él mismo introdujo el uso del símbolo arroba (@) para separar usuario y servidor" },
    { text: "¿En qué año se lanzó públicamente la enciclopedia libre Wikipedia por Jimmy Wales y Larry Sanger?", answer: 2001, note: "El 15 de enero de 2001 en idioma inglés" },
    { text: "¿En qué año se fundó la red social Facebook por Mark Zuckerberg en Harvard?", answer: 2004, note: "Originalmente bautizada como TheFacebook y restringida a estudiantes universitarios" },
    { text: "¿En qué año se lanzó el primer sistema operativo Android para teléfonos inteligentes?", answer: 2008, note: "A bordo del mítico teléfono HTC Dream" },
    { text: "¿En qué año compró Amazon la plataforma de streaming de videojuegos Twitch?", answer: 2014, note: "Adquirida por 970 millones de dólares en efectivo" },
    { text: "¿En qué año se lanzó el servicio de mensajería instantánea WhatsApp?", answer: 2009, note: "Creado por los ex-empleados de Yahoo Jan Koum y Brian Acton" },
    { text: "¿En qué año compró Facebook (Meta) la aplicación WhatsApp?", answer: 2014, note: "Por una cifra histórica de 19.000 millones de dólares" },
    { text: "¿En qué año se lanzó el primer reproductor iPod por Steve Jobs y Apple?", answer: 2001, note: "Bajo el lema publicitario: '1.000 canciones en tu bolsillo'" },
    { text: "¿En qué año se fundó la plataforma de música en streaming Spotify en Suecia?", answer: 2006, note: "Fundada por Daniel Ek y Martin Lorentzon" },
    { text: "¿En qué año se creó la primera página web de la historia por Tim Berners-Lee en el CERN?", answer: 1991, note: "Explicaba el concepto y funcionamiento de la World Wide Web (WWW)" },
    { text: "¿En qué año se presentó el primer ordenador personal Macintosh de Apple con ratón?", answer: 1984, note: "Acompañado por el legendario anuncio de televisión dirigido por Ridley Scott" },
    { text: "¿En qué año se lanzó la red social profesional LinkedIn?", answer: 2003, note: "Fundada por Reid Hoffman y adquirida posteriormente por Microsoft" },

    // --- TRANSPORTE, VELOCIDAD Y MÁQUINAS ---
    { text: "¿Cuántos kilómetros por hora de velocidad punta alcanzaba en vuelo el avión supersónico Concorde?", answer: 2179, note: "Más del doble de la velocidad del sonido (Mach 2,04)" },
    { text: "¿Cuántos asientos de pasajeros tenía en cabina un avión Concorde comercial estándar?", answer: 100, note: "Crucero de súper lujo que unía París/Londres y Nueva York en 3 horas y media" },
    { text: "¿Cuántos kilómetros por hora alcanza el tren de levitación magnética (Maglev) de Shanghái?", answer: 431, note: "El tren comercial en servicio regular más rápido del planeta" },
    { text: "¿Cuántos metros de eslora (longitud) medía el transatlántico RMS Titanic?", answer: 269, note: "El barco de pasajeros más grande del mundo en el momento de su botadura" },
    { text: "¿Cuántos botes salvavidas llevaba a bordo el Titanic en su viaje inaugural?", answer: 20, note: "Totalmente insuficientes para las más de 2.200 personas que viajaban a bordo" },
    { text: "¿Cuántas ruedas tiene el tren de aterrizaje de un avión gigante Boeing 747 'Jumbo'?", answer: 18, note: "Dos en la pata de morro delantera y 16 en los cuatro carros principales" },
    { text: "¿Cuántas ruedas tiene el avión de pasajeros más grande del mundo, el Airbus A380?", answer: 22, note: "Para repartir sus más de 560 toneladas de peso máximo al despegue" },
    { text: "¿Cuántos caballos de fuerza (CV) de potencia tenía el legendario superdeportivo Bugatti Veyron?", answer: 1001, note: "El primer coche de serie comercial en superar los 1.000 CV y los 400 km/h" },
    { text: "¿Cuántos metros de longitud tiene un portaviones nuclear de la clase Nimitz estadounidense?", answer: 333, note: "Una base militar flotante con más de 5.000 tripulantes a bordo" },
    { text: "¿Cuántas hélices principales de propulsión movían al transatlántico Titanic?", answer: 3, note: "Dos hélices laterales de tres palas y una central de cuatro palas" },

    // --- CINE, TELEVISIÓN Y DIVERSIÓN ---
    { text: "¿Cuántas películas cinematográficas oficiales ha dirigido Quentin Tarantino según su propio cómputo?", answer: 9, note: "Considera Kill Bill Vol. 1 y 2 como una sola obra cinematográfica completa" },
    { text: "¿Cuántos minutos dura la versión cinematográfica original de la película 'Titanic' (1997)?", answer: 194, note: "3 horas y 14 minutos de metraje romántico y trágico" },
    { text: "¿En qué año se estrenó en cines la primera película de animación de 'Shrek' de DreamWorks?", answer: 2001, note: "Ganó el primer premio Oscar de la historia a la Mejor Película de Animación" },
    { text: "¿En qué año se estrenó la película de animación 'Buscando a Nemo' de Pixar?", answer: 2003, note: "Se convirtió en la película en DVD más vendida de todos los tiempos" },
    { text: "¿Cuántos premios Oscar ganó la película clásica 'Lo que el viento se llevó' en 1940?", answer: 8, note: "Más dos premios honoríficos adicionales de la Academia de Hollywood" },
    { text: "¿Cuántas películas componen la saga cinematográfica de 'Rocky' protagonizadas por Sylvester Stallone?", answer: 6, note: "Sin contar las posteriores entregas derivadas de la trilogía 'Creed'" },
    { text: "¿En qué año se estrenó la comedia navideña 'Solo en casa' (Home Alone) con Macaulay Culkin?", answer: 1990, note: "Se mantuvo en el número 1 de la taquilla estadounidense durante 12 semanas" },
    { text: "¿Cuántos años tenía Macaulay Culkin cuando rodó la primera película de 'Solo en casa'?", answer: 10, note: "Nacido en agosto de 1980 y catapultado a la fama mundial infantil" },
    { text: "¿Cuántas temporadas se emitieron de la mítica serie española 'Cuéntame cómo pasó'?", answer: 23, note: "Emitida en TVE desde 2001 hasta finales de 2023 con más de 400 capítulos" },
    { text: "¿Cuántos años estuvo en emisión ininterrumpida el concurso televisivo 'Saber y Ganar' con Jordi Hurtado (en 2024)?", answer: 27, note: "En emisión continua diaria en La 2 de TVE desde febrero de 1997" },
    { text: "¿En qué año se emitió la primera edición del reality televisivo 'Gran Hermano' en España?", answer: 2000, note: "Ganada por Ismael Beiro y presentada por Mercedes Milá" },
    { text: "¿Cuántas pruebas o lingotes de oro componían el premio final del mítico concurso 'Grand Prix del Verano'?", answer: 0, note: "El premio eran trofeos y aportaciones económicas para el ayuntamiento del pueblo ganador" },

    // --- HISTORIA DE ESPAÑA Y SUCESOS ---
    { text: "¿En qué año comenzó la Guerra de la Independencia española contra las tropas francesas de Napoleón?", answer: 1808, note: "Iniciada tras el heroico levantamiento popular del 2 de mayo en Madrid" },
    { text: "¿En qué año concluyó la Guerra de la Independencia española con la expulsión de las tropas francesas?", answer: 1814, note: "Con el retorno al trono del rey Fernando VII" },
    { text: "¿En qué año perdió España sus últimas colonias de ultramar (Cuba, Puerto Rico y Filipinas)?", answer: 1898, note: "El traumático 'Desastre del 98' que marcó a toda una generación de intelectuales" },
    { text: "¿En qué año se proclamó la Segunda República Española tras la marcha del rey Alfonso XIII?", answer: 1931, note: "El 14 de abril de 1931 tras las elecciones municipales" },
    { text: "¿En qué año concluyó la Guerra Civil Española con el último parte militar de Franco?", answer: 1939, note: "El 1 de abril de 1939: 'La guerra ha terminado'" },
    { text: "¿En qué año se celebraron las primeras elecciones democráticas en España tras el franquismo?", answer: 1977, note: "El 15 de junio de 1977, con la victoria de la UCD de Adolfo Suárez" },
    { text: "¿En qué año ingresó España oficialmente como miembro de la OTAN?", answer: 1982, note: "Bajo la presidencia de Leopoldo Calvo-Sotelo" },
    { text: "¿En qué año se celebró el referéndum sobre la permanencia de España en la OTAN?", answer: 1986, note: "El 12 de marzo de 1986 con victoria del 'Sí' promovido por Felipe González" },
    { text: "¿En qué año se inauguró el primer tren de Alta Velocidad (AVE) en España entre Madrid y Sevilla?", answer: 1992, note: "Con motivo de la celebración de la Exposición Universal de Sevilla de 1992" },
    { text: "¿En qué año abdicó el rey Juan Carlos I en favor de su hijo Felipe VI?", answer: 2014, note: "En junio de 2014, poniendo fin a 39 años de reinado" },
    { text: "¿Cuántas provincias componen la comunidad autónoma de Castilla-La Mancha?", answer: 5, note: "Albacete, Ciudad Real, Cuenca, Guadalajara y Toledo" },
    { text: "¿Cuántas provincias integran la comunidad autónoma de Aragón?", answer: 3, note: "Huesca, Teruel y Zaragoza" },
    { text: "¿Cuántas provincias forman la comunidad autónoma de Extremadura?", answer: 2, note: "Badajoz y Cáceres" },

    // --- DEPORTES Y HAZAÑAS ---
    { text: "¿Cuántos jugadores están en el campo de juego por cada equipo en un partido de waterpolo?", answer: 7, note: "6 jugadores de campo y 1 portero en el agua" },
    { text: "¿Cuántos metros de longitud mide una pista oficial de pádel por parejas?", answer: 20, note: "20 metros de largo por 10 metros de ancho, delimitada por paredes o cristales" },
    { text: "¿Cuántos minutos dura reglamentariamente un combate de judo profesional masculino y femenino?", answer: 4, note: "4 minutos de tiempo real (Golden Score si hay empate)" },
    { text: "¿Cuántos rounds o asaltos de 5 minutos componen una pelea por el título mundial de la UFC?", answer: 5, note: "Las peleas que no son por título o estelares duran 3 asaltos" },
    { text: "¿Cuántos títulos de campeona del mundo femenina de bádminton ha ganado la española Carolina Marín?", answer: 3, note: "Conquistados en 2014, 2015 y 2018 (más un oro olímpico en Río 2016)" },
    { text: "¿Cuántos mundiales de motociclismo en categoría reina de MotoGP ha ganado Marc Márquez?", answer: 6, note: "Más un título en 125cc y otro en Moto2 (8 títulos mundiales en total)" },
    { text: "¿Cuántos mundiales de MotoGP en categoría reina ganó el italiano Valentino Rossi?", answer: 7, note: "Más uno de 125cc y otro de 250cc (9 títulos mundiales en total)" },
    { text: "¿Cuántos campeonatos del mundo de Fórmula 1 conquistó el asturiano Fernando Alonso?", answer: 2, note: "Bicampeón del mundo con Renault en 2005 y 2006" },
    { text: "¿Cuántos hoyos componen un torneo tradicional de golf profesional sumando las 4 jornadas?", answer: 72, note: "4 vueltas completas de 18 hoyos cada una" },
    { text: "¿Cuántas yardas mide el campo reglamentario de fútbol americano de la NFL entre líneas de anotación?", answer: 100, note: "Más dos zonas de anotación (end zones) de 10 yardas cada una (120 yardas totales)" },

    // --- CURIOSIDADES DEL MUNDO Y SOCIEDAD ---
    { text: "¿Cuántos pisos en total tiene la famosa Torre de Pisa en Italia?", answer: 8, note: "Incluyendo el campanario superior con sus siete campanas históricas" },
    { text: "¿Cuántas campanas tiene el campanario en la cima de la Torre de Pisa?", answer: 7, note: "Una por cada nota musical de la escala diatónica" },
    { text: "¿Cuántos estados de Australia son formalmente estados federados (sin contar los territorios)?", answer: 6, note: "Nueva Gales del Sur, Victoria, Queensland, Australia Meridional, Australia Occidental y Tasmania" },
    { text: "¿Cuántos metros mide la estatua de la 'Venus de Milo' expuesta en el Museo del Louvre?", answer: 2, note: "Mide exactamente 2,02 metros de altura esculpida en mármol de Paros" },
    { text: "¿Cuántos millones de habitantes tiene aproximadamente la población total de España (redondeado)?", answer: 48, note: "Alcanzó el récord demográfico de más de 48,5 millones de personas empadronadas" },
    { text: "¿Cuántos años dura el mandato oficial del presidente de la República Francesa (quinquenio)?", answer: 5, note: "Reducido de 7 a 5 años tras la reforma constitucional del año 2000" },
    { text: "¿Cuántos jueces componen formalmente el Tribunal Supremo de los Estados Unidos?", answer: 9, note: "Un juez presidente (Chief Justice) y ocho jueces asociados vitalicios" },
    { text: "¿Cuántos países miembros componen la zona euro o Eurozona actualmente?", answer: 20, note: "El último país en abandonar su moneda propia y adoptar el euro fue Croacia en 2023" },
    { text: "¿Cuántos números componen la combinación ganadora principal en el sorteo de La Primitiva en España?", answer: 6, note: "Se eligen 6 números del 1 al 49 más el complementario y el reintegro" },
    { text: "¿Cuántas estrellas se eligen en una apuesta clásica del sorteo europeo de Euromillones?", answer: 2, note: "5 números principales del 1 al 50 más 2 estrellas del 1 al 12" },
    { text: "¿Cuántas casillas tiene un cartón tradicional de bingo español?", answer: 27, note: "3 filas por 9 columnas con 15 números y 12 casillas en blanco" },
    { text: "¿Cuántos números en total están en el bombo de un sorteo clásico de bingo tradicional?", answer: 90, note: "Bolas numeradas del 1 al 90 extraídas sucesivamente" },
    { text: "¿Cuántas caras planas tiene un icosaedro regular geométrico?", answer: 20, note: "Poliedro regular compuesto por 20 triángulos equiláteros idénticos" },
    { text: "¿Cuántas caras planas tiene un dodecaedro regular geométrico?", answer: 12, note: "Poliedro regular formado por 12 pentágonos regulares iguales" },
    // --- MEGATANDA 4: MÁS PORCENTAJES (%) CURIOSOS Y COTIDIANOS ---
    { text: "¿Qué porcentaje de las personas en el mundo tienen hoyuelo en la barbilla?", answer: 10, note: "Un rasgo genético dominante pero presente en apenas 1 de cada 10 personas" },
    { text: "¿Qué porcentaje de la población mundial tiene la capacidad de enrollar la lengua en forma de 'U'?", answer: 70, note: "Habilidad muscular influida tanto por genética como por práctica" },
    { text: "¿Qué porcentaje de los seres humanos tienen miopía en algún grado en los países desarrollados?", answer: 40, note: "Cifra en aumento acelerado debido al uso intensivo de pantallas y visión cercana" },
    { text: "¿Qué porcentaje de los sueños que tenemos se olvidan en los primeros 5 minutos tras despertar?", answer: 50, note: "Y a los 10 minutos se ha desvanecido más del 90% del recuerdo del sueño" },
    { text: "¿Qué porcentaje de la producción mundial de chocolate se consume en el continente europeo?", answer: 50, note: "Europa concentra la mitad del consumo global de productos de cacao" },
    { text: "¿Qué porcentaje de los peces del océano profundo (zona abisal) producen su propia luz (bioluminiscencia)?", answer: 75, note: "La usan para cazar, comunicarse o camuflarse en la oscuridad total" },
    { text: "¿Qué porcentaje del peso corporal de una medusa corresponde a materia sólida orgánica?", answer: 5, note: "El 95% restante es simplemente agua de mar estructurada" },
    { text: "¿Qué porcentaje de la superficie de la Luna podemos llegar a ver desde la Tierra debido a la libración?", answer: 59, note: "La libración orbital permite atisbar un 9% extra de su cara oculta" },
    { text: "¿Qué porcentaje del agua de riego agrícola mundial se pierde por evaporación o filtraciones ineficientes?", answer: 60, note: "De ahí la vital importancia de modernizar los sistemas hacia el goteo" },
    { text: "¿Qué porcentaje de los tornados registrados en el planeta se producen en los Estados Unidos?", answer: 75, note: "Especialmente concentrados en la región conocida como 'Tornado Alley'" },
    { text: "¿Qué porcentaje del territorio de Singapur está cubierto por parques y vegetación urbana?", answer: 47, note: "Conocida internacionalmente como la 'Ciudad Jardín' por su diseño ecológico" },
    { text: "¿Qué porcentaje de las especies de aves del planeta son estrictamente monógamas de por vida?", answer: 90, note: "Mucho más frecuente en aves que en mamíferos para cuidar juntos la nidada" },
    { text: "¿Qué porcentaje de los mamíferos son monógamos con una sola pareja a lo largo de su vida?", answer: 5, note: "Apenas el 3% al 5% de los mamíferos practican la monogamia estricta" },
    { text: "¿Qué porcentaje de los árboles talados en el mundo se destinan a la fabricación de papel y cartón?", answer: 40, note: "El resto se emplea principalmente en construcción, muebles y combustible" },
    { text: "¿Qué porcentaje del peso de una nube cumulonimbo de tormenta es agua pura suspendida?", answer: 99, note: "Millones de diminutas gotas de agua y cristales de hielo flotando en corrientes de aire" },
    { text: "¿Qué porcentaje de los usuarios de teléfonos móviles tienen el modo silencio activado habitualmente?", answer: 70, note: "Una tendencia social disparada especialmente entre las generaciones más jóvenes" },
    { text: "¿Qué porcentaje de los coches nuevos que circulan en el mundo son de color blanco, negro o gris?", answer: 80, note: "Los colores neutros dominan aplastantemente el mercado del automóvil" },
    { text: "¿Qué porcentaje del plástico de los océanos procede de aparejos y redes de pesca abandonadas?", answer: 20, note: "Las llamadas 'redes fantasma' son una grave amenaza para la fauna marina" },
    { text: "¿Qué porcentaje de la masa de un diamante es carbono elemental puro?", answer: 100, note: "Cristalizado en una estructura cúbica de extrema dureza bajo inmensa presión" },
    { text: "¿Qué porcentaje de los adultos reconocen que cantan en la ducha con frecuencia?", answer: 65, note: "La acústica de los azulejos y el vapor favorecen la relajación vocal" },
    { text: "¿Qué porcentaje de los incendios en viviendas se originan en la cocina?", answer: 50, note: "Sartenes al fuego, descuidos en hornos y campanas extractoras con grasa acumulada" },
    { text: "¿Qué porcentaje de la electricidad en Brasil se genera mediante centrales hidroeléctricas?", answer: 65, note: "Liderada por la descomunal presa de Itaipú en el río Paraná" },
    { text: "¿Qué porcentaje del territorio de Mónaco está urbanizado al 100%?", answer: 100, note: "El segundo país más pequeño del mundo es una urbe costera densa y compacta" },
    { text: "¿Qué porcentaje de los adultos revisan el correo electrónico del trabajo estando de vacaciones?", answer: 60, note: "Uno de los mayores obstáculos para la desconexión digital real" },
    { text: "¿Qué porcentaje de las personas experimentan el fenómeno de 'piel de gallina' al escuchar música emotiva?", answer: 50, note: "Causado por una súbita liberación de dopamina en el sistema de recompensa cerebral" },

    // --- CIENCIA, FÍSICA Y ESPACIO ---
    { text: "¿Cuántos minutos tarda una señal de radio en viajar de la Tierra al planeta Marte de media?", answer: 14, note: "Varía entre 4 y 24 minutos según la posición orbital de ambos planetas" },
    { text: "¿Cuántos kilómetros por hora de velocidad debe superar un cohete para escapar de la gravedad terrestre (en miles)?", answer: 40, note: "La velocidad de escape de la Tierra es de unos 11,2 km/s (40.320 km/h)" },
    { text: "¿Cuántos planetas del Sistema Solar poseen anillos alrededor (Saturno, Júpiter, Urano y Neptuno)?", answer: 4, note: "Los cuatro gigantes gaseosos poseen sistemas de anillos, aunque los de Saturno son los más visibles" },
    { text: "¿Cuántos años terrestres tarda el planeta Urano en completar una sola vuelta al Sol?", answer: 84, note: "Gira además sobre su eje prácticamente 'tumbado' respecto a su órbita" },
    { text: "¿Cuántos días terrestres dura un solo día solar en el planeta Mercurio?", answer: 176, note: "Mercurio rota muy lentamente sobre sí mismo debido a la proximidad al Sol" },
    { text: "¿Cuántas lunas o satélites naturales confirmados orbitan el planeta Urano?", answer: 28, note: "Bautizadas con nombres de personajes de obras de Shakespeare y Alexander Pope" },
    { text: "¿Cuántos grados Celsius de temperatura aproximada alcanza la superficie visible del Sol (fotosfera en miles)?", answer: 5500, note: "El núcleo solar, sin embargo, supera los 15 millones de grados" },
    { text: "¿Cuántos kilómetros de diámetro tiene aproximadamente la Luna de la Tierra?", answer: 3474, note: "Aproximadamente una cuarta parte del diámetro de nuestro planeta" },
    { text: "¿Cuántos kilómetros de diámetro tiene el planeta Tierra en el ecuador (en miles redondeado)?", answer: 12, note: "Exactamente 12.742 kilómetros de diámetro ecuatorial" },
    { text: "¿Cuántos minutos tarda la Luna en completar un eclipse solar total en su fase de oscuridad máxima?", answer: 7, note: "La totalidad máxima teórica no supera los 7 minutos y medio en un punto fijo" },

    // --- ANATOMÍA Y EL CUERPO HUMANO ---
    { text: "¿Cuántos pares de nervios craneales conectan directamente el cerebro con la cabeza y el cuello?", answer: 12, note: "Incluyen el nervio óptico, olfativo, facial, vago y trigémino" },
    { text: "¿Cuántos pares de nervios espinales salen de la médula espinal a lo largo del cuerpo humano?", answer: 31, note: "8 cervicales, 12 torácicos, 5 lumbares, 5 sacros y 1 coccígeo" },
    { text: "¿Cuántos milímetros mide de largo el hueso más pequeño del cuerpo humano (el estribo del oído)?", answer: 3, note: "Mide unos 2,8 a 3 milímetros ubicado en el oído medio" },
    { text: "¿Cuántos litros de aire caben en los pulmones de un adulto sano en su capacidad pulmonar total?", answer: 6, note: "Varía entre 4,5 y 6 litros según altura y complexión física" },
    { text: "¿Cuántos kilómetros de vasos sanguíneos (venas, arterias y capilares) tiene un ser humano adulto (en miles)?", answer: 100, note: "Suficientes para dar más de dos vueltas completas a la Tierra por el ecuador" },
    { text: "¿Cuántos parpadeos realiza de media un ser humano en un solo minuto en conversación normal?", answer: 15, note: "Baja a menos de 5 por minuto cuando miramos fijamente una pantalla" },
    { text: "¿Cuántos mililitros de sangre bombea el ventrículo cardíaco en cada latido individual en reposo?", answer: 70, note: "Lo que suma unos 5 litros de sangre bombeados por minuto en reposo" },
    { text: "¿Cuántos grados de temperatura media estándar tiene el cuerpo humano de una persona sana?", answer: 37, note: "Habitualmente entre 36,5 °C y 37,2 °C según la hora del día" },

    // --- MARAVILLAS DEL MUNDO, MONUMENTOS Y CIUDADES ---
    { text: "¿Cuántos metros de altura tiene la estatua de la Libertad de Nueva York solo desde los pies a la antorcha?", answer: 46, note: "Con el gigantesco pedestal de piedra alcanza los 93 metros totales" },
    { text: "¿Cuántas ventanas tiene la corona de la Estatua de la Libertad en Nueva York?", answer: 25, note: "Simbolizan las gemas preciosas encontradas en la Tierra y los rayos del cielo" },
    { text: "¿Cuántas puntas tiene la corona de la Estatua de la Libertad de Nueva York?", answer: 7, note: "Representan los siete mares y los siete continentes del planeta" },
    { text: "¿Cuántos metros de altura tiene el obelisco del Monumento a Washington en la capital de EE.UU.?", answer: 169, note: "Fue la estructura más alta del mundo hasta la inauguración de la Torre Eiffel" },
    { text: "¿Cuántos leones esculpidos en bronce custodian la base de la Columna de Nelson en Trafalgar Square (Londres)?", answer: 4, note: "Esculpidos por Sir Edwin Landseer con bronce de cañones franceses fundidos" },
    { text: "¿Cuántos metros de altura mide la Columna de Nelson en la plaza de Trafalgar en Londres?", answer: 52, note: "Monumento conmemorativo de la gran victoria naval británica de 1805" },
    { text: "¿Cuántos peldaños tiene la famosa Escalinata de la Plaza de España en Roma?", answer: 135, note: "Inaugurada por el papa Benedicto XIII con motivo del Jubileo de 1725" },
    { text: "¿Cuántos arcos triunfales de entrada tiene la Puerta de Brandeburgo en Berlín?", answer: 5, note: "El paso central estaba reservado exclusivamente para la realeza prusiana" },
    { text: "¿Cuántos caballos tiran de la cuadriga que corona la Puerta de Brandeburgo de Berlín?", answer: 4, note: "Guiados por la diosa alada de la Victoria" },
    { text: "¿Cuántas fuentes monumentales decoran el eje del Paseo del Prado de Madrid?", answer: 3, note: "Cibeles, Neptuno y Apolo (las tres diseñadas por Ventura Rodríguez)" },

    // --- CINE, MÚSICA Y CULTURA POP ---
    { text: "¿Cuántas películas cinematográficas oficiales de la saga 'Misión Imposible' protagonizó Tom Cruise (hasta 2024)?", answer: 7, note: "Iniciada en 1996 y dirigida la primera por Brian De Palma" },
    { text: "¿En qué año se estrenó la mítica película 'Alien, el octavo pasajero' de Ridley Scott?", answer: 1979, note: "Con el memorable lema: 'En el espacio nadie puede oír tus gritos'" },
    { text: "¿En qué año se estrenó 'Blade Runner', la influyente obra maestra de ciencia ficción de Ridley Scott?", answer: 1982, note: "Ambientada curiosamente en un distópico año 2019 en Los Ángeles" },
    { text: "¿En qué año se estrenó la película 'Casablanca' protagonizada por Humphrey Bogart e Ingrid Bergman?", answer: 1942, note: "Ganó tres premios Oscar incluyendo Mejor Película y Mejor Director" },
    { text: "¿En qué año se estrenó 'Psicosis', la famosa película de suspense dirigida por Alfred Hitchcock?", answer: 1960, note: "Con la icónica escena del asesinato bajo la ducha con música de Bernard Herrmann" },
    { text: "¿Cuántas películas del director Alfred Hitchcock fueron premiadas con el Oscar a Mejor Película?", answer: 1, note: "Únicamente 'Rebeca' (1940); Hitchcock nunca ganó el Oscar a Mejor Director" },
    { text: "¿Cuántos premios Oscar honoríficos o competitivos ganó el actor Charles Chaplin en su vida?", answer: 3, note: "Dos estatuillas honoríficas y un Oscar a Mejor Banda Sonora por 'Candilejas'" },
    { text: "¿Cuántas teclas blancas tiene un teclado de piano clásico estándar?", answer: 52, note: "Junto a las 36 teclas negras completan las 88 teclas del instrumento" },
    { text: "¿Cuántas cuerdas tiene una guitarra española o acústica estándar de seis órdenes?", answer: 6, note: "Afinadas habitualmente en Mi, La, Re, Sol, Si y Mi" },
    { text: "¿Cuántas cuerdas tiene un bajo eléctrico clásico convencional?", answer: 4, note: "Afinadas en cuartas una octava más grave que las 4 cuerdas bajas de la guitarra" },
    { text: "¿Cuántos trastes suele tener el mástil de una guitarra clásica de concierto?", answer: 19, note: "Delimitados por las barritas metálicas incrustadas en el diapasón" },

    // --- HISTORIA UNIVERSAL Y CIVILIZACIONES ---
    { text: "¿En qué año fundó Alejandro Magno la histórica ciudad de Alejandría en Egipto (a.C.)?", answer: 331, note: "Sede de la legendaria biblioteca y del imponente Faro de Alejandría" },
    { text: "¿En qué año falleció el emperador Carlomagno, primer monarca del Imperio Carolingio?", answer: 814, note: "Sepultado en la catedral de su capital palatina en Aquisgrán" },
    { text: "¿En qué año firmaron los Reyes Católicos y Portugal el histórico Tratado de Tordesillas?", answer: 1494, note: "Repartió las zonas de navegación y conquista del Nuevo Mundo por un meridiano" },
    { text: "¿En qué año fue guillotinada la reina María Antonieta durante la Revolución Francesa?", answer: 1793, note: "Nueve meses después de la ejecución de su esposo el rey Luis XVI" },
    { text: "¿En qué año se coronó Napoleón Bonaparte a sí mismo como Emperador de los Franceses en Notre Dame?", answer: 1804, note: "El 2 de diciembre de 1804 en presencia del papa Pío VII" },
    { text: "¿En qué año se abolió oficialmente la esclavitud en todos los Estados Unidos con la Decimotercera Enmienda?", answer: 1865, note: "Tras el triunfo de la Unión en la Guerra de Secesión" },
    { text: "¿En qué año se inauguró el primer ferrocarril público de pasajeros de la historia (Stockton-Darlington)?", answer: 1825, note: "Diseñado por George Stephenson con su locomotora Locomotion n.º 1" },
    { text: "¿En qué año comenzó a operar la primera línea de ferrocarril en la península ibérica (Barcelona-Mataró)?", answer: 1848, note: "El 28 de octubre de 1848, recorriendo 28 kilómetros de trazado" },
    { text: "¿En qué año se celebró el célebre Congreso de Viena que reorganizó las fronteras de Europa?", answer: 1815, note: "Tras la caída definitiva de Napoleón Bonaparte" },
    { text: "¿En qué año fue proclamada la Unificación del Reino de Italia bajo el rey Víctor Manuel II?", answer: 1861, note: "Fruto del movimiento político del Risorgimento liderado por Cavour y Garibaldi" },
    { text: "¿En qué año se proclamó el Imperio Alemán (II Reich) en la Galería de los Espejos de Versalles?", answer: 1871, note: "Tras la aplastante victoria prusiana en la Guerra Franco-Prusiana" },
    { text: "¿En qué año fue fundado el Comité Olímpico Internacional (COI) en París?", answer: 1894, note: "Por iniciativa del noble francés Pierre de Fredy, barón de Coubertin" },

    // --- DEPORTES Y OLIMPIADAS ---
    { text: "¿Cuántos títulos de Liga de Primera División española tiene en sus vitrinas el Athletic Club de Bilbao?", answer: 8, note: "Uno de los clubes históricos fundadores de la competición" },
    { text: "¿Cuántos títulos de Liga española ha ganado el Atlético de Madrid en su historia?", answer: 11, note: "El tercer club más laureado en la historia del campeonato español" },
    { text: "¿Cuántos jugadores de campo componen un equipo de béisbol durante su turno a la defensiva?", answer: 9, note: "Pitcher, catcher, 4 jugadores de cuadro interior y 3 jardineros exteriores" },
    { text: "¿Cuántas bases en total debe pisar un bateador para anotar una carrera completa en béisbol?", answer: 4, note: "Primera base, segunda base, tercera base y el plato de home" },
    { text: "¿Cuántas entradas (innings) completas dura un partido profesional oficial de las Grandes Ligas de Béisbol (MLB)?", answer: 9, note: "Cada equipo batea y defiende una vez por cada entrada" },
    { text: "¿Cuántos metros de longitud reglamentaria tiene un campo de fútbol profesional estándar para partidos FIFA?", answer: 105, note: "Medida habitual de 105 metros de longitud por 68 metros de anchura" },
    { text: "¿Cuántos metros de anchura tiene la portería en el deporte del balonmano?", answer: 3, note: "3 metros de ancho por 2 metros de altura interior" },
    { text: "¿Cuántos metros mide la distancia de lanzamiento de un penalti reglamentario en balonmano (en metros)?", answer: 7, note: "El tiro de castigo de 7 metros frente al guardameta rival" },
    { text: "¿Cuántos puntos de penalti se castiga con tiro libre directo en fútbol (distancia en metros redondeada)?", answer: 11, note: "Exactamente 11 metros (12 yardas) desde la línea de meta" },
    { text: "¿Cuántos kilómetros de distancia tiene un triatlón de distancia olímpica en la prueba ciclista?", answer: 40, note: "1,5 km a nado, 40 km en bicicleta y 10 km de carrera a pie" },

    // --- CURIOSIDADES DEL REINO ANIMAL ---
    { text: "¿Cuántas patas articuladas tiene un escorpión común?", answer: 8, note: "Al ser arácnidos tienen 8 patas marchadoras, además de sus dos pinzas delanteras (pedipalpos)" },
    { text: "¿Cuántas alas funcionales tienen las moscas comunes y los mosquitos (orden dípteros)?", answer: 2, note: "Solo un par de alas funcionales; el segundo par se redujo a balancines estabilizadores" },
    { text: "¿Cuántos dientes tiene un perro doméstico adulto en su dentición definitiva completa?", answer: 42, note: "10 dientes más que una persona adulta" },
    { text: "¿Cuántos dientes tiene un gato doméstico adulto con su dentadura completa?", answer: 30, note: "12 incisivos, 4 colmillos o caninos, 10 premolares y 4 molares" },
    { text: "¿Cuántas bolsas o marsupios tienen las hembras de canguro para criar a sus retoños?", answer: 1, note: "En su interior la cría mama y completa su desarrollo tras nacer con el tamaño de una judía" },
    { text: "¿Cuántos kilos puede llegar a pesar el corazón de una jirafa macho adulta?", answer: 11, note: "Necesita una fuerza descomunal para bombear sangre a más de dos metros de altura hasta el cerebro" },
    { text: "¿Cuántos párpados protectores tiene cada ojo de un camello para protegerse de las tormentas de arena?", answer: 3, note: "El tercer párpado es una membrana translúcida que limpia el ojo sin perder visión" },
    { text: "¿Cuántos metros bajo el agua puede llegar a sumergirse un pingüino emperador en sus inmersiones de caza?", answer: 500, note: "Pueden aguantar la respiración durante más de 20 minutos seguidos en aguas gélidas" },
    { text: "¿Cuántos años puede llegar a vivir un elefante africano en su hábitat salvaje natural?", answer: 70, note: "Una longevidad comparable a la de las comunidades humanas tradicionales" },
    { text: "¿Cuántos metros de longitud puede alcanzar la lengua de un oso hormiguero gigante?", answer: 60, note: "Llega a medir hasta 60 centímetros de largo, cubierta de saliva extremadamente pegajosa" },
    // --- MEGATANDA 5: PORCENTAJES (%) DE NATURALEZA, SOCIEDAD Y SALUD ---
    { text: "¿Qué porcentaje del peso de una medusa común se reduce si se seca completamente al sol?", answer: 95, note: "Prácticamente se desvanece al evaporarse toda su masa acuosa" },
    { text: "¿Qué porcentaje de las especies de tiburones conocidas ponen huevos (ovíparos)?", answer: 30, note: "El 70% restante son vivíparos u ovovivíparos y dan a luz a crías vivas" },
    { text: "¿Qué porcentaje del genoma de un gato doméstico coincide con el de un tigre de Bengala?", answer: 96, note: "Comparten casi intacta su estructura genética cazadora y carnívora" },
    { text: "¿Qué porcentaje de las calorías que consume un koala proceden exclusivamente de hojas de eucalipto?", answer: 100, note: "Dieta hiperespecializada y tóxica para casi cualquier otro mamífero" },
    { text: "¿Qué porcentaje de la superficie de Groenlandia es roca libre de hielo en sus costas?", answer: 20, note: "La totalidad de sus poblaciones e islas habitadas se apiñan en ese 20%" },
    { text: "¿Qué porcentaje de la electricidad producida en Islandia proviene de fuentes geotérmicas y volcánicas?", answer: 30, note: "El otro 70% proviene de energía hidroeléctrica, logrando un 100% renovable" },
    { text: "¿Qué porcentaje del comercio mundial en volumen se transporta a través de buques marítimos?", answer: 80, note: "El transporte por mar es la auténtica columna vertebral del comercio global" },
    { text: "¿Qué porcentaje de la población mundial vive en ciudades (zonas urbanas) en la actualidad?", answer: 56, note: "Se prevé que alcance el 70% hacia el año 2050 según la ONU" },
    { text: "¿Qué porcentaje del café producido en Colombia se exporta a otros países del mundo?", answer: 90, note: "Famoso internacionalmente por sus granos de café arábica suave de alta montaña" },
    { text: "¿Qué porcentaje de las personas son incapaces de oler el aroma que produce comer espárragos en la orina?", answer: 60, note: "La capacidad de metabolizar y percibir ese aroma es una variación genética" },
    { text: "¿Qué porcentaje de los ataques de pánico alcanzan su intensidad máxima en menos de 10 minutos?", answer: 100, note: "Se desatan con extrema rapidez antes de remitir gradualmente" },
    { text: "¿Qué porcentaje de las fracturas óseas en personas mayores de 65 años se deben a caídas?", answer: 90, note: "La principal causa médica de fractura de cadera y fémur en la tercera edad" },
    { text: "¿Qué porcentaje del peso corporal de un caracol puede perder por deshidratación antes de morir?", answer: 50, note: "Pueden resistir pérdidas hídricas que serían letales para cualquier mamífero" },
    { text: "¿Qué porcentaje de los hogares de España tienen al menos una mascota como animal de compañía?", answer: 45, note: "Casi la mitad de las familias españolas conviven con perros, gatos u otros animales" },
    { text: "¿Qué porcentaje del aceite de girasol refinado está compuesto por grasas insaturadas cardiosaludables?", answer: 88, note: "Rico en ácido linoleico y vitamina E natural" },
    { text: "¿Qué porcentaje de las calorías del arroz blanco cocido provienen de los hidratos de carbono?", answer: 90, note: "Un alimento energético básico para más de la mitad de la humanidad" },
    { text: "¿Qué porcentaje de las personas en el mundo tienen sangre del grupo sanguíneo O (positivo o negativo)?", answer: 45, note: "El grupo sanguíneo más común y extendido de todo el planeta" },
    { text: "¿Qué porcentaje de los diamantes utilizados en joyería se consideran diamantes de color (fancy)?", answer: 2, note: "Azules, rosas, amarillos o negros; son extraordinariamente escasos y cotizados" },
    { text: "¿Qué porcentaje de la salmuera del Mar Báltico es salinidad (uno de los mares menos salados del mundo)?", answer: 1, note: "Apenas tiene un 1% de salinidad por el enorme aporte de ríos y deshielos" },
    { text: "¿Qué porcentaje de la madera de balsa es aire en su estructura celular interna?", answer: 90, note: "Por eso es la madera comercial más ligera y flotante del planeta" },
    { text: "¿Qué porcentaje de la producción de corcho mundial se concentra en la península ibérica (España y Portugal)?", answer: 80, note: "Los alcornocales ibéricos producen 8 de cada 10 tapones de corcho del planeta" },
    { text: "¿Qué porcentaje de los diamantes del mundo se extraen mediante minería en el continente africano?", answer: 50, note: "Con Botsuana, Angola, Sudáfrica y RDC a la cabeza de la extracción" },
    { text: "¿Qué porcentaje de la masa de una manzana flotante es aire atrapado entre sus células?", answer: 25, note: "Esa cuarta parte de aire es la que hace que floten tan fácilmente en el agua" },
    { text: "¿Qué porcentaje de las aves no pueden volar debido a adaptaciones anatómicas (pingüinos, avestruces)?", answer: 1, note: "Apenas unas 60 especies de aves de las más de 10.000 existentes son no voladoras" },
    { text: "¿Qué porcentaje de las llamadas de emergencia al 112 en Europa se realizan desde teléfonos móviles?", answer: 75, note: "Tres de cada cuatro avisos de auxilio se gestionan ya desde terminales móviles" },

    // --- INVENTOS, PATENTES Y OBJETOS COTIDIANOS ---
    { text: "¿En qué año se patentó la cremallera moderna para prendas de vestir por Gideon Sundbäck?", answer: 1917, note: "Revolucionó para siempre la confección de ropa, botas y maletas" },
    { text: "¿En qué año se inventó el bolígrafo de bola comercial por los hermanos húngaros Bíró?", answer: 1938, note: "Patentado como 'esferográfica' para evitar los borrones de la pluma estilográfica" },
    { text: "¿En qué año se fundó la empresa sueca de muebles y decoración IKEA por Ingvar Kamprad?", answer: 1943, note: "Comenzó vendiendo cerillas, bolígrafos y carteras por catálogo" },
    { text: "¿En qué año se inventó el horno microondas doméstico por accidente por Percy Spencer?", answer: 1945, note: "Descubierto al derretirse una chocolatina en su bolsillo junto a un magnetrón de radar" },
    { text: "¿En qué año se inventó el cubo de Rubik por el arquitecto húngaro Ernő Rubik?", answer: 1974, note: "Creado como una herramienta didáctica para explicar la geometría tridimensional" },
    { text: "¿En qué año se comercializó el primer reproductor de casetes portátil Walkman de Sony?", answer: 1979, note: "El mítico modelo TPS-L2 de color azul y plata que cambió el consumo musical" },
    { text: "¿En qué año se inventó la dinamita por el químico e industrial sueco Alfred Nobel?", answer: 1867, note: "Mezclando nitroglicerina inestable con tierra de diatomeas absorbente" },
    { text: "¿En qué año se patentó el primer teléfono electromagnético por Alexander Graham Bell?", answer: 1876, note: "Tras una legendaria disputa legal de patentes con Elisha Gray" },
    { text: "¿En qué año se introdujo el código de barras impreso en un producto comercial por primera vez?", answer: 1974, note: "Escaneado en un paquete de chicles de frutas Wrigley's en un supermercado de Ohio" },
    { text: "¿En qué año se inauguró el primer restaurante de comida rápida McDonald's en formato franquicia moderna?", answer: 1955, note: "Impulsado por el empresario Ray Kroc en Des Plaines, Illinois" },

    // --- HISTORIA MODERNA Y GRANDES MOMENTOS ---
    { text: "¿En qué año fue botado el barco de guerra HMS Dreadnought británico que revolucionó las flotas mundiales?", answer: 1906, note: "Hizo obsoletos a todos los acorazados anteriores en una sola botadura" },
    { text: "¿En qué año se proclamó la Declaración de los Derechos de la Mujer por Olympe de Gouges en Francia?", answer: 1791, note: "Reclamando la igualdad jurídica y política respecto a la del varón" },
    { text: "¿En qué año estalló la Guerra de los Bóeres en el sur de África entre británicos y colonos holandeses?", answer: 1899, note: "Conflicto que se extendió hasta 1902 por el control de minas de oro y diamantes" },
    { text: "¿En qué año tuvo lugar la trágica Masacre de Katyn en Polonia durante la Segunda Guerra Mundial?", answer: 1940, note: "Ejecución de miles de oficiales polacos por la policía secreta soviética" },
    { text: "¿En qué año se fundó el estado moderno de Israel tras la resolución de partición de la ONU?", answer: 1948, note: "Proclamado por David Ben-Gurión el 14 de mayo de 1948" },
    { text: "¿En qué año se fundó el Estado del Vaticano como territorio independiente con los Pactos de Letrán?", answer: 1929, note: "Firmados entre la Santa Sede y el Reino de Italia bajo Benito Mussolini" },
    { text: "¿En qué año concluyó formalmente la Guerra de Corea con la firma del armisticio de Panmunjom?", answer: 1953, note: "Selló la división permanente de la península en torno al paralelo 38" },
    { text: "¿En qué año cayó la ciudad de Saigón poniendo fin a la Guerra de Vietnam?", answer: 1975, note: "El 30 de abril de 1975 con la evacuación precipitada de las tropas estadounidenses" },
    { text: "¿En qué año se produjo la tragedia del transbordador espacial Challenger al despegar?", answer: 1986, note: "El 28 de enero de 1986, apenas 73 segundos después del lanzamiento" },
    { text: "¿En qué año se desintegró en su reentrada a la atmósfera el transbordador espacial Columbia?", answer: 2003, note: "El 1 de febrero de 2003 falleciendo sus 7 tripulantes" },
    { text: "¿En qué año se inauguró el colosal Eurotúnel submarino bajo el Canal de la Mancha?", answer: 1994, note: "Unió por ferrocarril Francia y el Reino Unido en 50 kilómetros de túnel" },
    { text: "¿En qué año se celebró la histórica conferencia climática del Protocolo de Kioto?", answer: 1997, note: "El primer gran tratado internacional vinculante para reducir emisiones de CO2" },

    // --- AUTOMOVILISMO, MOTOR Y MARCAS ---
    { text: "¿En qué año se fundó la mítica marca automovilística italiana Ferrari por Enzo Ferrari?", answer: 1939, note: "Inicialmente denominada Auto Avio Costruzioni en Módena" },
    { text: "¿En qué año se fundó la compañía alemana de automóviles Porsche por Ferdinand Porsche?", answer: 1931, note: "Famosa por su mítico modelo deportivo 911 con motor trasero" },
    { text: "¿En qué año se fundó la marca automovilística española SEAT en la Zona Franca de Barcelona?", answer: 1950, note: "Sociedad Española de Automóviles de Turismo, impulsada por el INI" },
    { text: "¿En qué año se lanzó al mercado el legendario utilitario SEAT 600 en España?", answer: 1957, note: "El vehículo que motorizó a la clase media española en la década de los 60" },
    { text: "¿Cuántos cilindros en línea tiene el motor de un coche deportivo de competición de Fórmula 1 moderno?", answer: 6, note: "Motores V6 turboalimentados híbridos de 1,6 litros de cilindrada" },
    { text: "¿Cuántas ruedas motrices transmiten fuerza al suelo en un vehículo con tracción total 4x4 clásica?", answer: 4, note: "Capaz de traccionar simultáneamente con ambos ejes delantero y trasero" },
    { text: "¿Cuántos caballos de fuerza (CV) desarrollaba aproximadamente el SEAT 600 en su primer modelo?", answer: 18, note: "18 a 21 CV de potencia con una velocidad máxima de unos 95 km/h" },
    { text: "¿Cuántos cambios de marcha o velocidades tiene la caja de cambios de un Fórmula 1 moderno?", answer: 8, note: "Ocho marchas hacia adelante y una marcha atrás obligatoria por reglamento" },
    { text: "¿Cuántas horas consecutivas de pilotaje dura la mítica carrera de resistencia de las 24 Horas de Le Mans?", answer: 24, note: "Disputada anualmente en el Circuito de la Sarthe en Francia desde 1923" },
    { text: "¿Cuántos títulos mundiales de rallyes (WRC) conquistó el piloto español Carlos Sainz?", answer: 2, note: "Campeón del mundo con Toyota en los años 1990 y 1992" },
    { text: "¿Cuántas victorias en el Rally Dakar ha conseguido Carlos Sainz 'El Matador' en coches (hasta 2024)?", answer: 4, note: "Ganadas con cuatro marcas distintas: Volkswagen, Peugeot, Mini y Audi" },

    // --- MÚSICA, INSTRUMENTOS Y RITMO ---
    { text: "¿Cuántas cuerdas tiene un ukelele hawaiano tradicional?", answer: 4, note: "Afinadas popularmente como Sol, Do, Mi y La" },
    { text: "¿Cuántas cuerdas dobles tiene un laúd renacentista o barroco común (órdenes)?", answer: 6, note: "Con cuerdas agrupadas por pares para enriquecer la resonancia acústica" },
    { text: "¿Cuántas notas musicales componen una escala pentatónica tradicional?", answer: 5, note: "Base armónica fundamental del blues, el rock clásico y músicas tradicionales" },
    { text: "¿Cuántos semitonos exactos componen un intervalo musical de octava completa?", answer: 12, note: "Los doce tonos que componen el sistema cromático occidental temperado" },
    { text: "¿Cuántos minutos dura aproximadamente la célebre composición 'Bolero' de Maurice Ravel?", answer: 15, note: "Un crescendo orquestal hipnótico e ininterrumpido sobre un mismo tema" },
    { text: "¿Cuántos integrantes formaban la legendaria banda británica Queen liderada por Freddie Mercury?", answer: 4, note: "Freddie Mercury, Brian May, Roger Taylor y John Deacon" },
    { text: "¿Cuántos integrantes componían el grupo sueco ABBA?", answer: 4, note: "Agnetha Fältskog, Björn Ulvaeus, Benny Andersson y Anni-Frid Lyngstad" },
    { text: "¿En qué año ganó el grupo ABBA el festival de Eurovisión con su tema 'Waterloo'?", answer: 1974, note: "Celebrado en Brighton, Reino Unido, catapultándolos al estrellato planetario" },
    { text: "¿En qué año ganó la cantante española Massiel el Festival de Eurovisión con 'La, la, la'?", answer: 1968, note: "La primera victoria histórica de España en el festival europeo de la canción" },
    { text: "¿En qué año ganó Salomé el Festival de Eurovisión para España con 'Vivo cantando'?", answer: 1969, note: "En un insólito e histórico cuádruple empate en Madrid" },

    // --- GASTRONOMÍA, COCINA Y VINOS ---
    { text: "¿Cuántos meses mínimos de crianza en barrica de roble exige un vino tinto español para ser 'Crianza'?", answer: 6, note: "Con un envejecimiento total mínimo de dos años antes de su venta" },
    { text: "¿Cuántos meses mínimos de envejecimiento total exige un vino tinto español para ser 'Gran Reserva'?", answer: 60, note: "Cinco años en total, con al menos 18 meses de permanencia en barrica" },
    { text: "¿Cuántos grados alcohólicos suele tener un licor tradicional de anís seco?", answer: 45, note: "Uno de los aguardientes anisados más fuertes de consumo tradicional" },
    { text: "¿Cuántos gramos de sal por litro suele tener aproximadamente el agua de mar en los océanos?", answer: 35, note: "Unos 35 gramos de sales minerales por cada kilogramo de agua marina" },
    { text: "¿Cuántas calorías aporta al organismo la combustión de 1 gramo de alcohol puro?", answer: 7, note: "Calorías vacías que aportan casi el doble de energía que los carbohidratos" },
    { text: "¿Cuántos dientes de ajo contiene una cabeza de ajo común promedio?", answer: 10, note: "Suele variar entre 8 y 14 dientes protegidos por la piel exterior" },
    { text: "¿Cuántas semanas dura la fermentación del grano de cebada para obtener cerveza tradicional?", answer: 2, note: "Entre una y tres semanas según sea fermentación alta (Ale) o baja (Lager)" },
    { text: "¿Cuántos granos de uva se necesitan aproximadamente para elaborar una botella de vino de 750 ml?", answer: 600, note: "Alrededor de un kilo y cuarto de uvas frescas por botella de caldo" },

    // --- CURIOSIDADES DEL REINO ANIMAL ---
    { text: "¿Cuántos años puede llegar a vivir una carpa dorada común (koi) bien cuidada en estanque?", answer: 40, note: "Algunos ejemplares legendarios en Japón han alcanzado edades de récord" },
    { text: "¿Cuántos dientes afilados tiene en su boca una piraña roja carnívora común?", answer: 28, note: "Dispuetos en una sola hilera interconectada como una sierra biológica" },
    { text: "¿Cuántos metros puede llegar a saltar en vertical una pulga común gracias a la resilina?", answer: 18, note: "Hasta 18 centímetros en vertical (más de 100 veces su propia altura corporal)" },
    { text: "¿Cuántas patas articuladas tiene un camarón o una gamba?", answer: 10, note: "Crustáceos decápodos con cinco pares de patas torácicas" },
    { text: "¿Cuántas mudas de piel completa realiza una serpiente joven a lo largo de un año?", answer: 4, note: "A medida que crecen renuevan por completo su capa epidérmica externa" },
    { text: "¿Cuántos minutos seguidos puede sumergirse una foca de Weddell bajo el hielo antártico?", answer: 80, note: "Gracias a su altísima concentración de mioglobina en el tejido muscular" },
    { text: "¿Cuántos kilos de pescado puede devorar un oso grizzly al día durante la remontada de los salmones?", answer: 40, note: "Almacenando reservas de grasa vitales antes del largo invierno" },
    { text: "¿Cuántas crías suele tener una gata doméstica en una sola camada promedio?", answer: 4, note: "Habitualmente entre 3 y 5 gatitos nacidos ciegos y sordos" },
    { text: "¿Cuántas rayas negras tiene una cebra común (en cientos aproximado)?", answer: 80, note: "Cada individuo posee un patrón de bandas único como una huella dactilar" },
    { text: "¿Cuántas ventosas en total puede llegar a tener un pulpo gigante del Pacífico en sus ocho tentáculos?", answer: 2000, note: "Unas 250 ventosas individuales hiperreceptivas por cada brazo" },

    // --- GEOGRAFÍA POLÍTICA Y CAPITALES ---
    { text: "¿Cuántos países del mundo tienen la libra esterlina como moneda oficial nacional?", answer: 1, note: "Únicamente el Reino Unido (además de dependencias y territorios de ultramar)" },
    { text: "¿Cuántos estados componen la República Federativa de Brasil?", answer: 26, note: "26 estados federados más el Distrito Federal de Brasilia" },
    { text: "¿Cuántas provincias componen la República Argentina?", answer: 23, note: "23 provincias más la Ciudad Autónoma de Buenos Aires (CABA)" },
    { text: "¿Cuántas regiones componen la República de Chile?", answer: 16, note: "Organizadas de norte a sur desde Arica y Parinacota hasta Magallanes" },
    { text: "¿Cuántos departamentos componen administrativamente la República de Colombia?", answer: 32, note: "32 departamentos más el Distrito Capital de Bogotá" },
    { text: "¿Cuántas islas con estatus de municipio componen la Comunidad Autónoma de las Islas Baleares?", answer: 4, note: "Mallorca, Menorca, Ibiza y Formentera" },
    { text: "¿Cuántos kilómetros de litoral costero bañado por el mar tiene el territorio español (en miles)?", answer: 8, note: "Cerca de 8.000 kilómetros de costas entre península e islas" },
    { text: "¿Cuántas millas náuticas equivalen a la zona económica exclusiva (ZEE) marina de un país costero?", answer: 200, note: "Límite fijado por la Convención de la ONU sobre el Derecho del Mar" },
    { text: "¿Cuántos kilómetros recorre la línea de ferrocarril del Transiberiano de Moscú a Vladivostok (en miles)?", answer: 9, note: "Exactamente 9.289 kilómetros de trazado, la ruta en tren más larga del mundo" },
    { text: "¿Cuántos días se tarda en recorrer la ruta completa del ferrocarril Transiberiano sin detenerse?", answer: 7, note: "Una semana entera de viaje a través de dos continentes y ocho husos horarios" },
    // --- MEGATANDA 6: MÁS PORCENTAJES (%) BRUTALES ---
    { text: "¿Qué porcentaje de las especies de árboles de la selva amazónica no se encuentran en ningún otro lugar del mundo?", answer: 50, note: "La mitad exacta de su flora arbórea es estrictamente endémica de esa cuenca" },
    { text: "¿Qué porcentaje de las erupciones volcánicas del planeta se producen bajo la superficie del mar?", answer: 80, note: "La inmensa mayoría de la actividad volcánica de la Tierra ocurre en las dorsales oceánicas" },
    { text: "¿Qué porcentaje del peso de una medusa común se debe a su contenido en agua?", answer: 95, note: "Apenas un 5% de materia orgánica sólida las separa de disolverse en el océano" },
    { text: "¿Qué porcentaje de la producción mundial de café se cultiva en el continente americano?", answer: 60, note: "Liderado indiscutiblemente por Brasil y Colombia" },
    { text: "¿Qué porcentaje del territorio de Japón está cubierto por colinas y montañas escarpadas?", answer: 73, note: "Lo que obliga a concentrar a su enorme población en valles y llanuras costeras" },
    { text: "¿Qué porcentaje de la energía consumida por un teléfono móvil se gasta en buscar cobertura en zonas de mala señal?", answer: 50, note: "La antena incrementa su potencia al máximo para enlazar con repetidores lejanos" },
    { text: "¿Qué porcentaje de las personas adultas duermen habitualmente de lado (postura fetal o semifetal)?", answer: 60, note: "La postura para dormir más extendida y recomendada para la columna vertebral" },
    { text: "¿Qué porcentaje del oxígeno presente en la atmósfera de la Tierra fue liberado por organismos fotosintéticos?", answer: 100, note: "Prácticamente todo el oxígeno libre del planeta es de origen biológico" },
    { text: "¿Qué porcentaje de la masa de un copo de nieve recién caído es aire atrapado?", answer: 90, note: "Por esa inmensa cantidad de aire atrapado actúa como un excelente aislante térmico" },
    { text: "¿Qué porcentaje de los ataques de tiburón a surfistas se atribuyen a confundirlos con focas o tortugas desde abajo?", answer: 80, note: "Su silueta a contraluz desde el fondo marino es casi idéntica a la de un león marino" },
    { text: "¿Qué porcentaje de la electricidad producida en Dinamarca procede de la energía eólica?", answer: 55, note: "El país con mayor porcentaje de integración eólica en su red eléctrica del mundo" },
    { text: "¿Qué porcentaje de las especies de plantas medicinales catalogadas proceden de selvas tropicales húmedas?", answer: 70, note: "Consideradas el mayor laboratorio farmacéutico natural de la biosfera" },
    { text: "¿Qué porcentaje del plástico producido en el mundo se utiliza para fabricar envases de un solo uso?", answer: 40, note: "El mayor foco de acumulación rápida de residuos en vertederos y playas" },
    { text: "¿Qué porcentaje de las compras en supermercados se deciden en el propio punto de venta de forma imprevista?", answer: 70, note: "El clásico consumo impulsivo condicionado por la colocación en estanterías" },
    { text: "¿Qué porcentaje del territorio de Austria está ocupado por la cordillera de los Alpes?", answer: 62, note: "Uno de los países alpinos con mayor densidad de pistas de esquí y glaciares" },
    { text: "¿Qué porcentaje de la población activa de los países occidentales trabaja en empleos sedentarios de oficina?", answer: 80, note: "Un factor clave en las políticas de salud pública para fomentar el ejercicio físico" },
    { text: "¿Qué porcentaje de las personas experimentan tinnitus o zumbidos en los oídos tras un concierto ruidoso?", answer: 85, note: "Aviso de fatiga acústica temporal en las células ciliadas de la cóclea" },
    { text: "¿Qué porcentaje de las calorías que ingerimos se gastan en la propia digestión y asimilación de alimentos?", answer: 10, note: "El efecto termogénico de los alimentos; las proteínas son las que más gasto exigen" },
    { text: "¿Qué porcentaje de la superficie de Finlandia está cubierta por bosques y lagos combinados?", answer: 80, note: "El país con mayor porcentaje forestal de toda la Unión Europea" },
    { text: "¿Qué porcentaje de los adultos reconocen que miran la pantalla del móvil mientras miran la televisión?", answer: 85, note: "El fenómeno globalmente extendido de la 'segunda pantalla'" },
    { text: "¿Qué porcentaje del comercio minorista mundial se realiza actualmente a través de plataformas de comercio electrónico?", answer: 20, note: "Cifra en continuo crecimiento pero donde el comercio físico aún retiene el 80%" },
    { text: "¿Qué porcentaje de la masa del universo observable está formada por materia oscura?", answer: 27, note: "No emite ni refleja luz; la materia ordinaria apenas representa un 5%" },
    { text: "¿Qué porcentaje de la salinidad media tiene el océano Atlántico frente a otros mares abiertos?", answer: 3, note: "Alrededor del 3,5% de sal en peso, ligeramente más salado que el Pacífico" },
    { text: "¿Qué porcentaje de las patentes farmacéuticas aprobadas caducan a los 20 años pasando a ser medicamentos genéricos?", answer: 100, note: "El periodo estándar internacional fijado por los acuerdos de propiedad intelectual" },
    { text: "¿Qué porcentaje de las personas sienten mareo por movimiento (cinetosis) al viajar en coche leyendo?", answer: 50, note: "Conflicto sensorial entre lo que ven los ojos inmóviles y lo que siente el oído interno" },

    // --- ANATOMÍA Y CURIOSIDADES DEL CUERPO ---
    { text: "¿Cuántos litros de sangre filtran los riñones de un adulto cada día en condiciones normales?", answer: 180, note: "Generando aproximadamente un litro y medio de orina desechada al día" },
    { text: "¿Cuántos kilómetros de longitud alcanzaría el ADN de una sola célula humana si se desenrollara por completo (en metros)?", answer: 2, note: "Dos metros enteros de información genética compactados microscópicamente" },
    { text: "¿Cuántos miligramos de hierro contiene de media el cuerpo de un ser humano adulto (en miles)?", answer: 4, note: "Unos 4 gramos de hierro en total, la mayor parte en la hemoglobina" },
    { text: "¿Cuántos años vive de media un glóbulo rojo en el torrente sanguíneo antes de ser reciclado en el bazo?", answer: 120, note: "Dura unos 120 días (4 meses) recorriendo miles de veces el cuerpo" },
    { text: "¿Cuántos kilómetros por hora puede alcanzar un estornudo humano al salir de la nariz?", answer: 160, note: "Expulsando hasta 40.000 microgotas de saliva y secreciones defensivas" },
    { text: "¿Cuántas papilas gustativas tiene de media la lengua de una persona adulta (en miles)?", answer: 10, note: "Se regeneran continuamente cada 10 a 14 días" },
    { text: "¿Cuántos latidos realiza de media el corazón humano a lo largo de un solo día (en miles)?", answer: 100, note: "Más de 100.000 latidos diarios manteniendo en marcha la circulación" },
    { text: "¿Cuántos parpadeos realiza un ser humano de media a lo largo de un año entero (en millones)?", answer: 5, note: "Más de 5 millones de parpadeos para mantener lubricada la córnea" },
    { text: "¿Cuántos gramos de piel muerta desprende el cuerpo humano de media cada año?", answer: 4000, note: "Alrededor de 4 kilos de células epidérmicas renovadas anualmente" },
    { text: "¿Cuántos pares de costillas 'flotantes' (que no se unen al esternón) tiene el esqueleto humano?", answer: 2, note: "Los dos pares inferiores (costillas 11 y 12)" },

    // --- CIENCIA, FÍSICA Y ESPACIO ---
    { text: "¿Cuántos planetas del Sistema Solar giran sobre su eje en sentido horario (retrógrado)?", answer: 2, note: "Venus y Urano son las dos únicas excepciones del Sistema Solar" },
    { text: "¿Cuántos días terrestres tarda la nave espacial Apolo en llegar a la Luna desde la Tierra?", answer: 3, note: "Aproximadamente 72 horas de navegación espacial translunar" },
    { text: "¿Cuántos minutos tarda una sonda de la NASA en entrar y posarse en la atmósfera de Marte ('siete minutos de terror')?", answer: 7, note: "Fase crítica y totalmente autónoma por el retardo en las comunicaciones" },
    { text: "¿Cuántos satélites o lunas naturales orbitan alrededor del planeta Mercurio?", answer: 0, note: "Junto con Venus, los dos únicos planetas del Sistema Solar sin lunas" },
    { text: "¿Cuántos satélites naturales o lunas orbitan alrededor del planeta Venus?", answer: 0, note: "Su cercanía al Sol y su dinámica orbital impidieron retener satélites estables" },
    { text: "¿Cuántas constelaciones oficiales reconoce la Unión Astronómica Internacional en la esfera celeste?", answer: 88, note: "Delimitadas con precisión milimétrica en el año 1922" },
    { text: "¿Cuántos estados de la materia clásicos y fundamentales se enseñan habitualmente (sólido, líquido, gas, plasma)?", answer: 4, note: "El plasma es el más abundante en el Universo visible (estrellas)" },
    { text: "¿Cuántos electrones tiene en su capa de valencia exterior un átomo de gas noble (helio aparte)?", answer: 8, note: "La conocida como regla del octeto que les confiere estabilidad casi perfecta" },
    { text: "¿Cuántos metros por segundo de aceleración constante ejerce la gravedad en la Tierra al caer (redondeado)?", answer: 10, note: "Exactamente 9,8 m/s² al nivel del mar" },
    { text: "¿Cuántos minutos dura el período orbital de un satélite en órbita geoestacionaria alrededor de la Tierra (en horas)?", answer: 24, note: "Gira a la misma velocidad que la Tierra, manteniéndose fijo sobre el mismo punto" },

    // --- HISTORIA UNIVERSAL Y MOMENTOS CLAVE ---
    { text: "¿En qué año se firmó el armisticio de Compiègne en un vagón de tren que puso fin a la Primera Guerra Mundial?", answer: 1918, note: "El 11 de noviembre de 1918 a las 11 de la mañana" },
    { text: "¿En qué año firmó Alemania su rendición incondicional en Berlín concluyendo la Segunda Guerra Mundial en Europa?", answer: 1945, note: "El 8 de mayo de 1945, celebrado como el Día de la Victoria en Europa" },
    { text: "¿En qué año se lanzó la bomba nuclear 'Fat Man' sobre la ciudad japonesa de Nagasaki?", answer: 1945, note: "El 9 de agosto de 1945, tres días después de la de Hiroshima" },
    { text: "¿En qué año se levantó la Cruz Roja Internacional tras la iniciativa del suizo Henry Dunant?", answer: 1863, note: "Inspirada por el horror vivido en la batalla de Solferino" },
    { text: "¿En qué año se otorgó el primer Premio Nobel de la Paz de la historia?", answer: 1901, note: "Concedido a Henry Dunant (Cruz Roja) y Frédéric Passy" },
    { text: "¿En qué año se descubrieron las célebres pinturas rupestres de la cueva de Altamira en Cantabria?", answer: 1879, note: "Por el naturalista Marcelino Sanz de Sautuola y su hija María" },
    { text: "¿En qué año descubrió Hiram Bingham las ruinas incas de Machu Picchu en Perú?", answer: 1911, note: "Dando a conocer al mundo la mítica ciudadela sagrada de los Andes" },
    { text: "¿En qué año se produjo el trágico hundimiento del acorazado estadounidense USS Maine en La Habana?", answer: 1898, note: "Detonante de la guerra entre España y Estados Unidos por Cuba" },
    { text: "¿En qué año proclamó Martín Lutero King su legendario discurso 'I Have a Dream' en Washington?", answer: 1963, note: "El 28 de agosto de 1963 ante más de 250.000 personas en el Monumento a Lincoln" },
    { text: "¿En qué año fue asesinado el líder de los derechos civiles Martin Luther King en Memphis?", answer: 1968, note: "El 4 de abril de 1968 en el balcón del motel Lorraine" },
    { text: "¿En qué año fue asesinado Mahatma Gandhi en Nueva Delhi?", answer: 1948, note: "El 30 de enero de 1948 por un extremista hindú" },
    { text: "¿En qué año se retiraron las últimas tropas soviéticas de Afganistán?", answer: 1989, note: "Poniendo fin a una década de desgaste militar para la URSS" },

    // --- CINE, TELEVISIÓN Y CULTURA POP ---
    { text: "¿En qué año se estrenó en cines la icónica comedia 'Regreso al Futuro' de Robert Zemeckis?", answer: 1985, note: "Protagonizada por Michael J. Fox como Marty McFly y Christopher Lloyd como Doc" },
    { text: "¿En qué año viajan al futuro Marty McFly y Doc en 'Regreso al Futuro II'?", answer: 2015, note: "El mítico 21 de octubre de 2015 con patinetes voladores y zapatillas autoajustables" },
    { text: "¿Cuántas películas componen la trilogía original de 'Regreso al Futuro'?", answer: 3, note: "Estrenadas en 1985, 1989 y 1990 respectivamente" },
    { text: "¿En qué año se estrenó la película bélica 'Salvar al soldado Ryan' de Steven Spielberg?", answer: 1998, note: "Famosa por su sobrecogedora recreación del desembarco de Normandía" },
    { text: "¿En qué año se estrenó 'Forrest Gump', galardonada con 6 premios Oscar?", answer: 1994, note: "Protagonizada por Tom Hanks: 'La vida es como una caja de bombones'" },
    { text: "¿Cuántos premios Oscar como Mejor Actor Principal ha ganado Tom Hanks en su carrera?", answer: 2, note: "Consecutivos por 'Philadelphia' (1993) y 'Forrest Gump' (1994)" },
    { text: "¿Cuántos premios Oscar como Mejor Actriz Principal ganó la legendaria Katharine Hepburn (récord absoluto)?", answer: 4, note: "De un total de 12 nominaciones a lo largo de su brillante carrera" },
    { text: "¿Cuántos premios Oscar al Mejor Director ganó John Ford (récord histórico de la categoría)?", answer: 4, note: "Por El delator, Las uvas de la ira, ¡Qué verde era mi valle! y El hombre tranquilo" },
    { text: "¿En qué año se emitió el episodio final de la telecomedia estadounidense 'Friends'?", answer: 2004, note: "Visto por más de 52 millones de espectadores en directo en EE.UU." },
    { text: "¿Cuántas temporadas duró en emisión la mítica serie de suspense 'Expediente X' (The X-Files)?", answer: 11, note: "Protagonizada por David Duchovny (Mulder) y Gillian Anderson (Scully)" },
    { text: "¿Cuántas cartas componen el mazo de cartas de un juego tradicional de UNO?", answer: 108, note: "Tarjetas de 4 colores, cartas especiales de acción y comodines" },
    { text: "¿Cuántas fichas cuadradas de dominó componen un juego clásico de doble seis?", answer: 28, note: "Desde el doble blanco (0-0) hasta el doble seis (6-6)" },

    // --- DEPORTES, FÚTBOL Y RÉCORDS ---
    { text: "¿Cuántos minutos dura reglamentariamente un partido de waterpolo profesional dividido en 4 cuartos?", answer: 32, note: "Cuatro periodos de 8 minutos de juego efectivo cada uno" },
    { text: "¿Cuántos segundos dura la posesión máxima de ataque en un partido reglamentario de waterpolo?", answer: 30, note: "Si el equipo no lanza a portería en medio minuto, pierde la bola" },
    { text: "¿Cuántos jugadores están en el agua por cada equipo en una prueba de natación por relevos 4x100?", answer: 4, note: "Cada nadador completa 100 metros de la prueba" },
    { text: "¿Cuántos carriles de competición tiene una piscina olímpica estándar homologada para finales?", answer: 8, note: "Las piscinas modernas tienen 10 calles para evitar olas de rebote en las 8 activas" },
    { text: "¿Cuántos metros de longitud tiene una pista de atletismo estándar en su calle interior (calle 1)?", answer: 400, note: "Distancia reglamentaria para la prueba de 400 metros lisos" },
    { text: "¿Cuántas vallas debe superar un atleta en la prueba de los 110 metros vallas masculinos?", answer: 10, note: "Colocadas a una altura reglamentaria de 1,067 metros" },
    { text: "¿Cuántas vallas se colocan a lo largo del recorrido en la prueba de 400 metros vallas?", answer: 10, note: "Repartidas a lo largo de la vuelta entera a la pista" },
    { text: "¿Cuántos saltos sobre foso con agua hay que realizar en los 3.000 metros obstáculos de atletismo?", answer: 7, note: "Siete saltos de ría con agua más 28 obstáculos secos" },
    { text: "¿Cuántos títulos de Liga de Primera División española tiene el Valencia Club de Fútbol?", answer: 6, note: "El quinto club con más campeonatos de liga en España" },
    { text: "¿Cuántos títulos de Copa de la UEFA / Europa League ha conquistado el Sevilla Fútbol Club (récord del torneo)?", answer: 7, note: "Campeón en 2006, 2007, 2014, 2015, 2016, 2020 y 2023" },
    { text: "¿Cuántas Copas de Europa / Champions League ha ganado el Real Madrid de fútbol (hasta 2024)?", answer: 15, note: "El club más laureado del continente con amplia diferencia" },
    { text: "¿Cuántas Copas de Europa / Champions League masculinas ha conquistado el AC Milan italiano?", answer: 7, note: "El segundo club europeo con mayor palmarés continental" },

    // --- GEOGRAFÍA DEL MUNDO Y MONUMENTOS ---
    { text: "¿Cuántos metros de altura tiene la cúpula de la Basílica de San Pedro en Roma hasta la cruz?", answer: 136, note: "Diseñada magistralmente por Miguel Ángel Buonarroti" },
    { text: "¿Cuántos metros de longitud mide el puente Golden Gate de San Francisco de extremo a extremo?", answer: 2737, note: "Con una distancia entre sus dos grandes torres de 1.280 metros" },
    { text: "¿Cuántos metros de altura sobre el agua tienen las torres del puente Golden Gate?", answer: 227, note: "Pintadas con su característico tono naranja internacional antioxidante" },
    { text: "¿Cuántos puentes peatonales o de tráfico cruzan el Gran Cañón del Colorado en su parque nacional?", answer: 0, note: "Ningún puente cruza el cañón dentro del parque; hay que rodearlo cientos de kilómetros" },
    { text: "¿Cuántas provincias componen la comunidad autónoma de Galicia?", answer: 4, note: "A Coruña, Lugo, Ourense y Pontevedra" },
    { text: "¿Cuántas provincias componen la comunidad autónoma del País Vasco?", answer: 3, note: "Álava, Guipúzcoa y Vizcaya" },
    { text: "¿Cuántas provincias componen la Comunidad Valenciana?", answer: 3, note: "Alicante, Castellón y Valencia" },
    { text: "¿Cuántos kilómetros de longitud tiene el río Rin en su paso por el centro de Europa (redondeado)?", answer: 1233, note: "Nace en los Alpes suizos y desemboca en el Mar del Norte holandés" },
    { text: "¿Cuántos kilómetros cuadrados de superficie tiene el país más pequeño del mundo (Ciudad del Vaticano, número entero)?", answer: 0, note: "Tiene una superficie de apenas 0,44 km² (menos de medio kilómetro cuadrado)" },
    { text: "¿Cuántos kilómetros cuadrados tiene el Principado de Mónaco (segundo país más pequeño)?", answer: 2, note: "Apenas 2 kilómetros cuadrados de superficie frente al Mediterráneo" },

    // --- CURIOSIDADES COTIDIANAS Y DATOS DIVERTIDOS ---
    { text: "¿Cuántos agujeros tiene una bola de bowling profesional para introducir los dedos?", answer: 3, note: "Para el pulgar, el dedo corazón y el dedo anular" },
    { text: "¿Cuántos bolos de madera se colocan al final de la pista en una partida de bowling?", answer: 10, note: "Organizados en un triángulo equilátero perfecto de 4 filas" },
    { text: "¿Cuántas cuerdas de tensión componen el cuadrilátero reglamentario en un ring de boxeo profesional?", answer: 4, note: "Forradas de acolchado protector para seguridad de los púgiles" },
    { text: "¿Cuántas casillas tiene cada una de las 4 casas de salida en el tablero tradicional del parchís?", answer: 4, note: "Para las 4 fichas de cada jugador al inicio de la partida" },
    { text: "¿Cuántas casillas en total recorre una ficha de parchís desde su salida hasta la meta final?", answer: 68, note: "60 casillas del circuito general más 8 casillas del pasillo final" },
    { text: "¿Cuántas letras tiene el alfabeto tradicional en español según la RAE (incluyendo la Ñ)?", answer: 27, note: "La 'ch' y la 'll' dejaron de considerarse letras independientes en 2010" },
    { text: "¿Cuántas letras componen el alfabeto inglés internacional estándar?", answer: 26, note: "El alfabeto latino básico sin la virgulilla de la Ñ ni tildes" },
    { text: "¿Cuántas teclas de función (F1, F2...) tiene la fila superior de un teclado de ordenador estándar?", answer: 12, note: "Desde F1 hasta F12 en los teclados compatibles IBM PC" },
    { text: "¿Cuántas cuerdas tiene un contrabajo clásico de orquesta sinfónica?", answer: 4, note: "Afinadas en cuartas: Mi, La, Re y Sol" },
    { text: "¿Cuántos meses de gestación dura el embarazo de una perra doméstica en promedio?", answer: 2, note: "Unos 63 días de gestación (aproximadamente dos meses)" },
    // --- MEGATANDA 7: PORCENTAJES (%) DE VIDA, TECNOLOGÍA Y ALIMENTOS ---
    { text: "¿Qué porcentaje del peso de una sandía común es pura agua?", answer: 92, note: "Casi toda su pulpa refrescante es líquido dulce con licopeno" },
    { text: "¿Qué porcentaje del peso de un champiñón común cultivado es agua?", answer: 90, note: "Por eso reducen su volumen drásticamente al saltearlos en la sartén" },
    { text: "¿Qué porcentaje del peso de una zanahoria fresca es agua?", answer: 88, note: "Pese a su textura dura y crujiente, casi el 90% es contenido acuoso" },
    { text: "¿Qué porcentaje de las personas en el mundo son diestras?", answer: 90, note: "El 10% restante son zurdas o ambidiestras" },
    { text: "¿Qué porcentaje de la producción mundial de chocolate procede de granos de cacao de Costa de Marfil y Ghana?", answer: 60, note: "África Occidental domina la mayor parte de la cosecha mundial de cacao" },
    { text: "¿Qué porcentaje de las especies animales del planeta son invertebrados (no tienen columna vertebral)?", answer: 97, note: "Insectos, moluscos, arácnidos y crustáceos componen casi todo el reino animal" },
    { text: "¿Qué porcentaje de los seres humanos tienen el corazón en el lado izquierdo del pecho?", answer: 99, note: "Menos del 0,01% nacen con 'situs inversus', teniendo los órganos en espejo" },
    { text: "¿Qué porcentaje de la energía solar que llega a la atmósfera de la Tierra es absorbida por la superficie?", answer: 50, note: "El resto es reflejado por las nubes, el hielo o dispersado por el aire" },
    { text: "¿Qué porcentaje del peso de un grano de café tostado se pierde durante el proceso de tueste por evaporación?", answer: 18, note: "Pierde humedad pero gana volumen y cientos de compuestos aromáticos" },
    { text: "¿Qué porcentaje de las baterías de plomo-ácido de los coches convencionales se reciclan con éxito?", answer: 99, note: "El producto de consumo con la mayor tasa de reciclaje de todo el planeta" },
    { text: "¿Qué porcentaje de la superficie de la Unión Europea está dedicada a la agricultura y ganadería?", answer: 40, note: "Casi 160 millones de hectáreas de suelo agrario productivo" },
    { text: "¿Qué porcentaje de las personas experimentan la sensación de caída al quedarse dormidas (espasmo mioclónico)?", answer: 70, note: "Una sacudida muscular involuntaria benigna al entrar en el sueño" },
    { text: "¿Qué porcentaje de las emisiones globales de gases de efecto invernadero provienen del sector del transporte?", answer: 15, note: "Coches, camiones, barcos y aviones combinados" },
    { text: "¿Qué porcentaje de los teléfonos inteligentes del mundo funcionan con el sistema operativo Android?", answer: 70, note: "El 30% restante corresponde casi en su totalidad al sistema iOS de Apple" },
    { text: "¿Qué porcentaje de la corteza terrestre está compuesta por silicio y oxígeno combinados?", answer: 75, note: "Los dos elementos químicos más abundantes en las rocas y minerales terrestres" },
    { text: "¿Qué porcentaje de los incendios domésticos se apagan con éxito antes de que lleguen los bomberos?", answer: 80, note: "Gracias a la rápida intervención vecinal con extintores o mantas ignífugas" },
    { text: "¿Qué porcentaje de la población adulta de España declara saber nadar con soltura?", answer: 85, note: "Favorecido por el turismo de costa y la gran presencia de piscinas públicas" },
    { text: "¿Qué porcentaje de los libros que se leen en el mundo se siguen leyendo en papel impreso frente al digital?", answer: 75, note: "El formato físico sigue superando ampliamente a los lectores de libros electrónicos" },
    { text: "¿Qué porcentaje de la superficie de Islandia no tiene árboles de forma natural?", answer: 98, note: "La tala histórica vikinga y el viento ártico redujeron sus bosques a un 2%" },
    { text: "¿Qué porcentaje de los barcos de mercancías del mundo navegan bajo banderas de conveniencia (Panamá, Liberia...)?", answer: 70, note: "Utilizadas por navieras para reducir impuestos y cargas laborales" },
    { text: "¿Qué porcentaje del calor del cuerpo humano se disipa por la cabeza si no está cubierta en el frío?", answer: 10, note: "El viejo mito del 50% fue desmentido; la pérdida es proporcional a la superficie expuesta" },
    { text: "¿Qué porcentaje de los diamantes industriales son en la actualidad diamantes sintéticos creados en laboratorio?", answer: 95, note: "Mucho más baratos de fabricar con presiones y temperaturas extremas" },
    { text: "¿Qué porcentaje de la producción eléctrica de Suiza procede de energía hidroeléctrica?", answer: 60, note: "Aprovechando sus cientos de presas y embalses en valles alpinos" },
    { text: "¿Qué porcentaje de los casos de resfriado común están causados por rinovirus?", answer: 50, note: "La principal familia de virus causante del goteo nasal y estornudos" },
    { text: "¿Qué porcentaje de los internautas del mundo utilizan aplicaciones de mensajería instantánea a diario?", answer: 90, note: "WhatsApp, WeChat, Telegram y Messenger son los líderes globales" },

    // --- VIDEOJUEGOS Y CULTURA GAMER ---
    { text: "¿En qué año se lanzó el histórico juego 'Pac-Man' en las salas recreativas japonesas?", answer: 1980, note: "Creado por Toru Iwatani para Namco e inspirado en una pizza a la que le faltaba una porción" },
    { text: "¿En qué año se lanzó el videojuego original 'The Legend of Zelda' para la NES?", answer: 1986, note: "El primer cartucho doméstico que incluía una pila interna para guardar partidas" },
    { text: "¿En qué año salió al mercado el juego 'Doom', padre de los shooters modernos en primera persona?", answer: 1993, note: "Desarrollado por John Carmack y John Romero en id Software" },
    { text: "¿En qué año se lanzó el primer juego de la saga 'Grand Theft Auto' (GTA) con vista cenital?", answer: 1997, note: "Creado por DMA Design (posteriormente Rockstar Games) para PC y PlayStation" },
    { text: "¿En qué año se lanzó la plataforma digital de videojuegos Steam por Valve?", answer: 2003, note: "Inicialmente creada para actualizar de forma automática Counter-Strike" },
    { text: "¿En qué año se lanzó el juego para móviles 'Angry Birds' por la compañía finlandesa Rovio?", answer: 2009, note: "Descargado miles de millones de veces en todo el mundo" },
    { text: "¿En qué año se lanzó el fenómeno mundial del videojuego 'Fortnite: Battle Royale'?", answer: 2017, note: "Desarrollado por Epic Games, congregando a cientos de millones de jugadores" },
    { text: "¿Cuántos fantasmas persiguen a Pac-Man en el laberinto del videojuego clásico?", answer: 4, note: "Blinky (rojo), Pinky (rosa), Inky (azul) y Clyde (naranja)" },
    { text: "¿Cuántos mundos numerados componen el juego original 'Super Mario Bros.' de NES?", answer: 8, note: "Cada mundo consta de 4 niveles, sumando un total de 32 fases" },
    { text: "¿Cuántos corazones de vida iniciales tiene Link al comenzar la aventura en la saga Zelda?", answer: 3, note: "Ampliable recogiendo contenedores de corazón tras vencer a los jefes" },
    { text: "¿Cuántos bloques de formas diferentes (tetrominós) componen el juego del Tetris?", answer: 7, note: "Denominados I, J, L, O, S, T y Z, formados cada uno por 4 cuadrados" },
    { text: "¿Cuántas piezas de cuadrado componen cada una de las figuras del Tetris?", answer: 4, note: "De ahí su nombre, derivado del prefijo griego 'tetra-' (cuatro)" },

    // --- CINE, MÚSICA Y ENTRETENIMIENTO ---
    { text: "¿En qué año se estrenó la película musical de dibujos animados 'Fantasía' de Walt Disney?", answer: 1940, note: "Una obra pionera en sonido estereofónico con música clásica orquestal" },
    { text: "¿En qué año se estrenó en cines 'La naranja mecánica' de Stanley Kubrick?", answer: 1971, note: "Basada en la novela homónima de Anthony Burgess" },
    { text: "¿En qué año se estrenó la obra maestra de ciencia ficción '2001: Una odisea del espacio' de Kubrick?", answer: 1968, note: "Con el legendario ordenador inteligente HAL 9000" },
    { text: "¿En qué año se estrenó en cines la primera película de 'Terminator' dirigida por James Cameron?", answer: 1984, note: "Protagonizada por Arnold Schwarzenegger como el ciborg T-800" },
    { text: "¿En qué año se estrenó la aclamada secuela 'Terminator 2: El juicio final'?", answer: 1991, note: "Revolucionó los efectos digitales en el cine con el T-1000 de metal líquido" },
    { text: "¿En qué año falleció el cantante Freddie Mercury, líder de Queen?", answer: 1991, note: "El 24 de noviembre de 1991 en su casa de Londres" },
    { text: "¿En qué año falleció el rey del rock Elvis Presley en su mansión de Graceland?", answer: 1977, note: "El 16 de agosto de 1977 en Memphis, Tennessee" },
    { text: "¿En qué año se celebró el multitudinario concierto benéfico 'Live Aid' simultáneo en Londres y Filadelfia?", answer: 1985, note: "Organizado por Bob Geldof para recaudar fondos contra la hambruna en Etiopía" },
    { text: "¿Cuántos miembros componían la mítica banda británica The Rolling Stones en su formación clásica?", answer: 5, note: "Mick Jagger, Keith Richards, Charlie Watts, Bill Wyman y Brian Jones" },
    { text: "¿Cuántas películas cinematográficas oficiales componen la saga de 'Indiana Jones' protagonizadas por Harrison Ford?", answer: 5, note: "Estrenadas entre 1981 (En busca del arca perdida) y 2023 (El dial del destino)" },
    { text: "¿Cuántos premios Oscar ganó la comedia musical 'West Side Story' de 1961?", answer: 10, note: "El récord absoluto para una película de género musical" },
    { text: "¿Cuántos episodios componen la célebre serie policiaca española 'El comisario'?", answer: 191, note: "Protagonizada por Tito Valverde entre 1999 y 2009 en Telecinco" },

    // --- HISTORIA MODERNA Y GRANDES HITOS ---
    { text: "¿En qué año inventó Samuel Morse el telégrafo eléctrico y su código de puntos y rayas?", answer: 1837, note: "El primer mensaje público transmitido fue: 'What hath God wrought'" },
    { text: "¿En qué año se transmitió el primer mensaje telegráfico transatlántico por cable submarino?", answer: 1858, note: "Conectó por primera vez por cable Europa y Norteamérica" },
    { text: "¿En qué año se coronó la reina Isabel II en la Abadía de Westminster?", answer: 1953, note: "La primera coronación británica retransmitida en directo por televisión" },
    { text: "¿En qué año tuvo lugar la Revolución de los Claveles que devolvió la democracia a Portugal?", answer: 1974, note: "El 25 de abril de 1974 al compás de la canción 'Grândola, Vila Morena'" },
    { text: "¿En qué año se proclamó la Declaración Balfour británica sobre Palestina?", answer: 1917, note: "Apoyando el establecimiento en Palestina de un hogar nacional para el pueblo judío" },
    { text: "¿En qué año abdicó el rey Eduardo VIII de Inglaterra para casarse con Wallis Simpson?", answer: 1936, note: "Poco antes de la coronación de su hermano, Jorge VI" },
    { text: "¿En qué año se inauguró el Golden Gate de San Francisco con un desfile multitudinario de peatones?", answer: 1937, note: "El 27 de mayo de 1937 antes de abrirse al tráfico de vehículos" },
    { text: "¿En qué año se hundió el acorazado alemán Bismarck en el Atlántico Norte durante la Segunda Guerra Mundial?", answer: 1941, note: "Perseguido y destruido por la Royal Navy británica tras el hundimiento del HMS Hood" },
    { text: "¿En qué año se celebró el desembarco aliado de Normandía (Día D) en las costas francesas?", answer: 1944, note: "El 6 de junio de 1944 en la Operación Overlord" },
    { text: "¿En qué año se celebró la histórica Conferencia de Yalta con Churchill, Roosevelt y Stalin?", answer: 1945, note: "En febrero de 1945 para diseñar el orden mundial de la posguerra" },

    // --- DEPORTES Y RÉCORDS ---
    { text: "¿Cuántos jugadores están en el campo por equipo en un partido reglamentario de béisbol infantil o sóftbol?", answer: 9, note: "Exactamente igual que en el béisbol para adultos" },
    { text: "¿Cuántos puntos suma el equipo que anota una canasta desde más allá del arco perimetral en baloncesto?", answer: 3, note: "El lanzamiento de tres puntos introducido por la NBA en 1979" },
    { text: "¿Cuántos puntos suma una canasta encestada desde la línea de tiro libre personal en baloncesto?", answer: 1, note: "Lanzamiento directo sin oposición tras una falta de tiro o técnica" },
    { text: "¿Cuántos puntos suma un equipo por una canasta normal conseguida en juego dentro del arco de triple?", answer: 2, note: "La anotación básica del baloncesto de campo" },
    { text: "¿Cuántos jugadores de campo componen un equipo de críquet durante su turno de bateo o defensa?", answer: 11, note: "Once jugadores por bando igual que en el fútbol" },
    { text: "¿Cuántos jueces componen la mesa de puntuación en un combate de boxeo profesional para decidir el ganador?", answer: 3, note: "Cada juez evalúa asalto por asalto con el sistema de 10 puntos obligatorios" },
    { text: "¿Cuántos títulos de Liga de Primera División española tiene en sus vitrinas la Real Sociedad de San Sebastián?", answer: 2, note: "Conquistados de forma consecutiva en las temporadas 1980-81 y 1981-82" },
    { text: "¿Cuántos títulos de Liga de Primera División española tiene el Real Club Deportivo de La Coruña?", answer: 1, note: "El inolvidable 'Superdépor' campeón de Liga en la temporada 1999-2000" },
    { text: "¿Cuántos títulos de Liga de Primera División española tiene el Real Betis Balompié?", answer: 1, note: "Conquistado en la temporada 1934-35" },
    { text: "¿Cuántas Champions League masculinas ha conquistado el Bayern de Múnich alemán?", answer: 6, note: "Uno de los tres clubes europeos con seis o más títulos continentales" },
    { text: "¿Cuántas Champions League masculinas ha ganado el Liverpool Football Club?", answer: 6, note: "El club inglés más laureado en la máxima competición europea" },
    { text: "¿Cuántos minutos de descanso se conceden reglamentariamente entre las dos partes de un partido de fútbol?", answer: 15, note: "Tiempo reglamentario para el descanso en vestuarios según la IFAB" },

    // --- GEOGRAFÍA POLÍTICA Y CIUDADES DEL MUNDO ---
    { text: "¿Cuántos países soberanos independientes componen la península escandinava geográfica (Noruega y Suecia)?", answer: 2, note: "Finlandia y Dinamarca se consideran nórdicos o culturales, pero no de la península física" },
    { text: "¿Cuántas naciones componen la isla de Gran Bretaña física?", answer: 3, note: "Inglaterra, Escocia y Gales (Irlanda del Norte está en la isla vecina)" },
    { text: "¿Cuántos puentes históricos cruzan el río Arno dentro de la ciudad de Florencia?", answer: 10, note: "El más antiguo y famoso es el célebre Ponte Vecchio con sus joyerías" },
    { text: "¿Cuántos puentes peatonales cruzan el estrecho río Támesis en el centro de Londres?", answer: 3, note: "El Puente del Milenio, Golden Jubilee Bridges y Hungerford Bridge" },
    { text: "¿Cuántas comunidades autónomas de España tienen costa con el Mar Cantábrico?", answer: 4, note: "Galicia, Principado de Asturias, Cantabria y País Vasco" },
    { text: "¿Cuántas provincias componen la comunidad autónoma de Castilla y León con salida al mar?", answer: 0, note: "Es una comunidad autónoma completamente interior sin salida marítima" },
    { text: "¿Cuántos kilómetros de longitud tiene el río Sena desde su nacimiento en Borgoña hasta el Canal de la Mancha?", answer: 777, note: "Un número capicúa fácil de recordar para el río de París" },
    { text: "¿Cuántos municipios tiene la isla canaria de Tenerife?", answer: 31, note: "Repartidos entre la zona metropolitana, el norte y el sur de la isla" },
    { text: "¿Cuántos municipios tiene la isla canaria de Gran Canaria?", answer: 21, note: "Las Palmas de Gran Canaria es el municipio más poblado" },
    { text: "¿Cuántos cantones componen el territorio nacional de Luxemburgo?", answer: 12, note: "Divididos a su vez en más de un centenar de comunas" },

    // --- CURIOSIDADES CIENTÍFICAS Y SALUD ---
    { text: "¿Cuántas semanas dura un embarazo humano estándar a término completo en promedio?", answer: 40, note: "Contadas desde el primer día de la última menstruación (280 días)" },
    { text: "¿Cuántos gramos pesa una manzana de tamaño mediano estándar de frutería?", answer: 180, note: "Aporta unas 95 calorías saludables y 4 gramos de fibra" },
    { text: "¿Cuántas calorías aporta aproximadamente una cucharada sopera de aceite de oliva virgen extra?", answer: 120, note: "Grasa pura saludable con un alto contenido energético concentrado" },
    { text: "¿Cuántos gramos de alcohol puro contiene una cerveza estándar de 330 ml al 5% de graduación?", answer: 13, note: "Equivalente a algo más de una Unidad de Bebida Estándar (UBE)" },
    { text: "¿Cuántas horas tarda aproximadamente el estómago humano en vaciar una comida sólida mixta común?", answer: 4, note: "Pasa después al intestino delgado para continuar la absorción" },
    { text: "¿Cuántos grados bajo cero se requieren para que el mercurio líquido se solidifique como metal?", answer: 39, note: "Exactamente -38,8 °C; por eso no se usan termómetros de mercurio en el Ártico extremo" },
    { text: "¿Cuántos elementos químicos de la tabla periódica existen en estado líquido a temperatura ambiente (mercurio y bromo)?", answer: 2, note: "Solo el mercurio (metal) y el bromo (no metal) son líquidos a 20 °C" },
    { text: "¿Cuántos huesos componen el esqueleto de una serpiente común (entre vértebras y costillas en cientos)?", answer: 400, note: "Poseen entre 200 y 400 vértebras con costillas articuladas que les dan extrema agilidad" },
    { text: "¿Cuántas veces puede masticar una vaca cada bocado de hierba durante el proceso de rumia?", answer: 50, note: "Mastican miles de veces al día para facilitar la fermentación celulósica" },
    { text: "¿Cuántos minutos puede contener la respiración una nutria marina mientras bucea buscando erizos?", answer: 5, note: "Adaptación pulmonar marina para alimentarse en los bosques de algas kelp" },
    // --- MEGATANDA 8: PORCENTAJES (%) CIENTÍFICOS Y DE SOCIEDAD ---
    { text: "¿Qué porcentaje del peso de un plátano maduro pelado es simplemente agua?", answer: 75, note: "El 25% restante está compuesto por azúcares naturales, almidón y fibra" },
    { text: "¿Qué porcentaje de las calorías del cacao puro desgrasado provienen de las grasas?", answer: 20, note: "El chocolate comercial suma manteca de cacao y azúcares hasta triplicar ese porcentaje" },
    { text: "¿Qué porcentaje del territorio de los Estados Unidos está cubierto por bosques y arbolado?", answer: 33, note: "Aproximadamente un tercio de su inmensa masa continental" },
    { text: "¿Qué porcentaje de la producción mundial de café se procesa con el método de lavado húmedo?", answer: 50, note: "Método que potencia la acidez y aromas florales de los cafés de especialidad" },
    { text: "¿Qué porcentaje de las parejas casadas en España optan por el régimen económico de bienes gananciales?", answer: 85, note: "El régimen legal común por defecto en la mayor parte del territorio nacional" },
    { text: "¿Qué porcentaje de los vuelos comerciales mundiales son vuelos domésticos dentro del mismo país?", answer: 60, note: "Liderados masivamente por los gigantescos mercados interiores de EE.UU. y China" },
    { text: "¿Qué porcentaje de la madera utilizada en la construcción en Japón es madera de cedro y ciprés autóctono?", answer: 70, note: "Material tradicional por su gran resistencia a la humedad y a los terremotos" },
    { text: "¿Qué porcentaje de los bebés reconocen la voz de su madre nada más nacer?", answer: 100, note: "Llevan oyéndola amortiguada a través del líquido amniótico durante todo el embarazo" },
    { text: "¿Qué porcentaje de la masa del planeta Marte respecto a la masa de la Tierra representa aproximadamente?", answer: 11, note: "Marte es un planeta bastante pequeño, con apenas una décima parte de la masa terrestre" },
    { text: "¿Qué porcentaje de la atmósfera del planeta Tierra es gas Argón?", answer: 1, note: "El 0,93% del aire es argón, el tercer gas más abundante tras el nitrógeno y el oxígeno" },
    { text: "¿Qué porcentaje del calor solar reflejado por la Tierra es retenido por el efecto invernadero natural?", answer: 80, note: "Sin este efecto invernadero natural la temperatura media planetaria sería de -18 °C" },
    { text: "¿Qué porcentaje de los seres humanos adultos en el mundo no necesitan gafas ni lentillas graduadas?", answer: 40, note: "Cerca del 60% de la población mundial adulta precisa corrección óptica" },
    { text: "¿Qué porcentaje de las llamadas de spam telefónico en el mundo son contestadas por los usuarios?", answer: 20, note: "La gran mayoría son rechazadas o filtradas automáticamente por los smartphones" },
    { text: "¿Qué porcentaje de las monedas de euro fabricadas se pierden o quedan olvidadas en huchas y cajones?", answer: 25, note: "Especialmente las piezas de menor valor facial como las de 1 y 2 céntimos" },
    { text: "¿Qué porcentaje de la superficie de la cuenca mediterránea original conserva su vegetación autóctona virgen?", answer: 5, note: "Uno de los ecosistemas más alterados por milenios de agricultura y urbanización" },
    { text: "¿Qué porcentaje de las emisiones de carbono mundiales son absorbidas de forma natural por la biosfera?", answer: 50, note: "Repartidas a partes iguales entre los bosques terrestres y los océanos" },
    { text: "¿Qué porcentaje de los hogares españoles tienen lavavajillas eléctrico en su cocina?", answer: 60, note: "Un electrodoméstico que ahorra hasta un 80% de agua frente al lavado manual a mano" },
    { text: "¿Qué porcentaje de las especies de hongos catalogadas son setas comestibles para el ser humano?", answer: 5, note: "La inmensa mayoría de especies fúngicas son microscópicas o no aptas para el consumo" },
    { text: "¿Qué porcentaje del peso de un huevo de gallina estándar corresponde a la cáscara exterior?", answer: 10, note: "Compuesta casi íntegramente por carbonato de calcio rígido y poroso" },
    { text: "¿Qué porcentaje de las personas con alergias alimentarias son alérgicas al cacahuete o frutos secos?", answer: 30, note: "Una de las alergias alimentarias más graves y con mayor riesgo anafiláctico" },
    { text: "¿Qué porcentaje de los diamantes negros naturales deben su color a inclusiones de grafito?", answer: 100, note: "También conocidos como 'carbonados', formados bajo condiciones geológicas únicas" },
    { text: "¿Qué porcentaje de la electricidad producida en Alemania en 2023 provino de energías renovables?", answer: 52, note: "Superando por primera vez en su historia la barrera del 50% de generación limpia" },
    { text: "¿Qué porcentaje de la superficie de Nueva Zelanda está declarada parque nacional o reserva natural protegida?", answer: 30, note: "Uno de los países con mayor porcentaje de territorio salvaje bajo protección estatal" },
    { text: "¿Qué porcentaje de las personas que sufren sonambulismo son niños?", answer: 80, note: "Mucho más frecuente en la infancia, tendiendo a desaparecer con la maduración neurológica" },
    { text: "¿Qué porcentaje de los barcos pesqueros del mundo operan en aguas asiáticas?", answer: 75, note: "Asia concentra tres cuartas partes de la flota pesquera mundial activa" },

    // --- CIENCIA, UNIVERSO Y ASTRONOMÍA ---
    { text: "¿Cuántos planetas del Sistema Solar tienen un tamaño mayor que la Tierra?", answer: 4, note: "Júpiter, Saturno, Urano y Neptuno (los cuatro gigantes gaseosos y helados)" },
    { text: "¿Cuántos planetas del Sistema Solar tienen un tamaño menor que la Tierra?", answer: 3, note: "Mercurio, Marte y Venus" },
    { text: "¿Cuántos días terrestres tarda el planeta Mercurio en dar una vuelta completa al Sol (su año)?", answer: 88, note: "El planeta más veloz del Sistema Solar con una órbita de apenas 3 meses terrestres" },
    { text: "¿Cuántos días terrestres tarda el planeta Venus en completar una vuelta al Sol?", answer: 225, note: "Un año en Venus equivale a unos 7 meses y medio de la Tierra" },
    { text: "¿Cuántos kilómetros por hora de velocidad orbital lleva la Tierra alrededor del Sol (en miles)?", answer: 107, note: "Viajamos por el espacio a la friolera de 107.280 km/h sin notarlo" },
    { text: "¿Cuántos minutos tarda en completarse un viaje en montaña rusa estándar de un parque de atracciones?", answer: 2, note: "La gran mayoría de recorridos de adrenalina duran entre 90 y 140 segundos" },
    { text: "¿Cuántos espejos hexagonales de berilio bañados en oro componen el espejo primario del telescopio James Webb?", answer: 18, note: "Forman una superficie reflectante de 6,5 metros de diámetro" },
    { text: "¿Cuántas lunas principales de gran tamaño tiene el planeta Urano?", answer: 5, note: "Miranda, Ariel, Umbriel, Titania y Oberón" },
    { text: "¿Cuántas lunas o satélites naturales confirmados orbitan alrededor de Neptuno?", answer: 16, note: "La mayor y más famosa de ellas es Tritón, que posee géiseres de nitrógeno líquido" },
    { text: "¿Cuántos metros por segundo es la velocidad del sonido en el aire a 20 °C (redondeado)?", answer: 343, note: "Aproximadamente 1.235 kilómetros por hora (Mach 1)" },

    // --- HISTORIA MODERNA Y GRANDES HITOS ---
    { text: "¿En qué año se firmó el Tratado de Utrecht que puso fin a la Guerra de Sucesión Española?", answer: 1713, note: "Supuso la llegada de la dinastía Borbón y la cesión de Gibraltar y Menorca" },
    { text: "¿En qué año recuperó España definitivamente la isla de Menorca de manos británicas con la Paz de Amiens?", answer: 1802, note: "Reintegrando la isla balear a la soberanía de la corona española" },
    { text: "¿En qué año se fundó la Guardia Civil en España por el duque de Ahumada?", answer: 1844, note: "Bajo el reinado de Isabel II como cuerpo de seguridad pública rural" },
    { text: "¿En qué año se inauguró el primer alumbrado público por gas en las calles de Madrid?", answer: 1832, note: "Sustituyendo a los tradicionales faroles de aceite de la época" },
    { text: "¿En qué año se inauguró la primera central telefónica urbana en España (en Madrid)?", answer: 1884, note: "Permitiendo las primeras comunicaciones de voz a distancia entre abonados" },
    { text: "¿En qué año se hundió el transatlántico británico RMS Lusitania tras ser torpedeado por un submarino alemán?", answer: 1915, note: "Suceso que precipitó la entrada de Estados Unidos en la Primera Guerra Mundial" },
    { text: "¿En qué año se celebró el célebre 'Tratado de Brest-Litovsk' donde Rusia abandonó la Gran Guerra?", answer: 1918, note: "Firmado por el recién creado gobierno bolchevique con los imperios centrales" },
    { text: "¿En qué año se creó la Sociedad de Naciones tras la Primera Guerra Mundial?", answer: 1919, note: "Precursora de la actual Organización de las Naciones Unidas" },
    { text: "¿En qué año fue asesinado el político y revolucionario León Trotski en México por Ramón Mercader?", answer: 1940, note: "Atacado con un piolet en su residencia de Coyoacán por orden de Stalin" },
    { text: "¿En qué año se fundó el servicio secreto israelí Mosad?", answer: 1949, note: "Instituto de Inteligencia y Operaciones Especiales de Israel" },
    { text: "¿En qué año capturó el Mosad al criminal nazi Adolf Eichmann en Buenos Aires?", answer: 1960, note: "Operación Garibaldi que culminó con su juicio y condena en Jerusalén" },
    { text: "¿En qué año se aprobó en referéndum la Ley para la Reforma Política en España que abrió la Transición?", answer: 1976, note: "El 15 de diciembre de 1976 bajo el impulso de Adolfo Suárez y Torcuato Fernández-Miranda" },

    // --- CINE, SERIES Y TELEVISIÓN ---
    { text: "¿Cuántos premios Oscar ganó la obra maestra bélica 'Apocalypse Now' de Francis Ford Coppola?", answer: 2, note: "Ganó a Mejor Fotografía y Mejor Sonido, además de la Palma de Oro en Cannes" },
    { text: "¿En qué año se estrenó 'Tiburón' (Jaws) de Steven Spielberg, inventando el concepto de taquillazo veraniego?", answer: 1975, note: "Basada en la novela de Peter Benchley con música inolvidable de John Williams" },
    { text: "¿En qué año se estrenó en cines la primera película de la saga 'Misión Imposible' de Tom Cruise?", answer: 1996, note: "Con la mítica escena de la infiltración colgado de un cable en la sala blanca de la CIA" },
    { text: "¿En qué año se estrenó la película española 'Tesis' dirigida por Alejandro Amenábar?", answer: 1996, note: "Arrasó en los premios Goya ganando Mejor Película y Mejor Director Novel" },
    { text: "¿En qué año se estrenó 'Abre los ojos' de Alejandro Amenábar (adaptada luego en Hollywood como Vanilla Sky)?", answer: 1997, note: "Protagonizada por Eduardo Noriega, Penélope Cruz y Najwa Nimri" },
    { text: "¿En qué año ganó la película española 'Mar adentro' de Amenábar el premio Oscar a Mejor Película Extranjera?", answer: 2005, note: "Protagonizada por Javier Bardem interpretando a Ramón Sampedro" },
    { text: "¿En qué año ganó Javier Bardem el premio Oscar a Mejor Actor de Reparto por 'No es país para viejos'?", answer: 2008, note: "El primer actor español en la historia en conquistar una estatuilla de la Academia" },
    { text: "¿En qué año ganó Penélope Cruz el premio Oscar a Mejor Actriz de Reparto por 'Vicky Cristina Barcelona'?", answer: 2009, note: "La primera actriz española de la historia en ganar un premio Oscar" },
    { text: "¿Cuántos premios Goya ganó la película 'Mar adentro' de Alejandro Amenábar (récord histórico de los premios)?", answer: 14, note: "De un total de 15 nominaciones a las que optaba" },
    { text: "¿Cuántas nominaciones a los premios Goya consiguió la comedia 'Mujeres al borde de un ataque de nervios'?", answer: 16, note: "La consagración cinematográfica internacional de Pedro Almodóvar en 1988" },
    { text: "¿Cuántos premios Oscar en total ha ganado el director Pedro Almodóvar en su carrera?", answer: 2, note: "Mejor Película Extranjera por 'Todo sobre mi madre' y Mejor Guion Original por 'Hable con ella'" },
    { text: "¿Cuántos minutos dura el mediometraje animado 'El muñeco de nieve' (The Snowman) clásico de Navidad?", answer: 26, note: "Un clásico navideño británico mudo basado en el libro de Raymond Briggs" },

    // --- DEPORTES, FÚTBOL Y HAZAÑAS ---
    { text: "¿Cuántos títulos de Liga de Primera División española tiene el Sevilla Fútbol Club?", answer: 1, note: "Conquistado en la histórica temporada 1945-46" },
    { text: "¿Cuántos títulos de Liga de Primera División española ha conquistado el Real Zaragoza en su historia?", answer: 0, note: "Pese a no tener ligas, posee 6 Copas del Rey y 1 Recopa de Europa (con el gol de Nayim)" },
    { text: "¿Cuántas Copas del Rey de fútbol tiene en sus vitrinas el Real Zaragoza?", answer: 6, note: "Uno de los clubes con más tradición copera del fútbol español" },
    { text: "¿Cuántos penaltis paró el portero rumano Helmuth Duckadam en la final de la Copa de Europa de 1986 contra el Barça?", answer: 4, note: "Paró los 4 penaltis consecutivos de la tanda en Sevilla, récord absoluto del torneo" },
    { text: "¿Cuántos minutos dura reglamentariamente un partido de fútbol americano de la NFL dividido en 4 cuartos?", answer: 60, note: "Cuatro cuartos de 15 minutos de tiempo cronometrado" },
    { text: "¿Cuántos segundos dura el descanso entre cuartos (primero y tercero) en un partido reglamentario de la NFL?", answer: 120, note: "Dos minutos de pausa de cambio de campo" },
    { text: "¿Cuántos minutos dura el espectáculo musical del descanso (Halftime Show) de la Super Bowl habitualmente?", answer: 13, note: "Uno de los eventos televisivos más vistos del planeta con una producción exprés de 13 minutos" },
    { text: "¿Cuántas ediciones de la Super Bowl ha ganado el legendario quarterback Tom Brady (récord de la NFL)?", answer: 7, note: "6 con los New England Patriots y 1 con los Tampa Bay Buccaneers" },
    { text: "¿Cuántos títulos de campeona de Grand Slam individual en tenis conquistó la estadounidense Serena Williams?", answer: 23, note: "El récord absoluto de la era abierta profesional femenina" },
    { text: "¿Cuántos Grand Slam individuales masculinos conquistó el tenista estadounidense Pete Sampras?", answer: 14, note: "Récord histórico masculino hasta la eclosión del 'Big Three' (Federer, Nadal y Djokovic)" },
    { text: "¿Cuántos torneos del Grand Slam de Wimbledon individual masculino ganó el suizo Roger Federer?", answer: 8, note: "El rey indiscutible sobre la hierba sagrada de Londres" },
    { text: "¿Cuántos torneos del Grand Slam de Wimbledon individual masculino ganó el estadounidense Pete Sampras?", answer: 7, note: "Dominador absoluto de la hierba en la década de los años 90" },

    // --- GEOGRAFÍA URBANA Y PLANETA ---
    { text: "¿Cuántos kilómetros de longitud tiene el río Amazonas (redondeado a cientos)?", answer: 7000, note: "Aproximadamente 6.992 km desde los Andes peruanos hasta el Atlántico" },
    { text: "¿Cuántos países del mundo tienen frontera territorial directa con España?", answer: 5, note: "Francia, Portugal, Andorra, Reino Unido (Gibraltar) y Marruecos (Ceuta y Melilla)" },
    { text: "¿Cuántas provincias componen la comunidad autónoma de Canarias?", answer: 2, note: "Santa Cruz de Tenerife y Las Palmas" },
    { text: "¿Cuántas provincias componen la comunidad autónoma de Castilla y León?", answer: 9, note: "La comunidad autónoma con mayor número de provincias de España" },
    { text: "¿Cuántas provincias costeras tiene la comunidad autónoma de Andalucía?", answer: 5, note: "Almería, Granada, Málaga, Cádiz y Huelva (Sevilla, Córdoba y Jaén son interiores)" },
    { text: "¿Cuántos estados componen los Estados Unidos de México (sin contar la capital CDMX)?", answer: 31, note: "31 estados libres y soberanos más la Ciudad de México" },
    { text: "¿Cuántos departamentos componen el territorio metropolitano de Francia europea continental?", answer: 96, note: "Más 5 departamentos de ultramar (Guadalupe, Martinica, Guayana, Reunión y Mayotte)" },
    { text: "¿Cuántas regiones componen la geografía administrativa de Portugal continental?", answer: 5, note: "Norte, Centro, Área Metropolitana de Lisboa, Alentejo y Algarve" },
    { text: "¿Cuántas islas habitadas componen el archipiélago atlántico de las Azores portuguesas?", answer: 9, note: "São Miguel es la mayor y más poblada del archipiélago" },
    { text: "¿Cuántas islas principales componen el archipiélago portugués de Madeira?", answer: 2, note: "La isla principal de Madeira y la isla vecina de Porto Santo" },

    // --- ANATOMÍA, FISIOLOGÍA Y SALUD ---
    { text: "¿Cuántos litros de orina expulsa de media un ser humano adulto sano al día en condiciones normales?", answer: 1, note: "Oscila habitualmente entre 1 y 2 litros según la ingesta de líquidos" },
    { text: "¿Cuántos pares de costillas 'verdaderas' (que se articulan directamente con el esternón) tiene el ser humano?", answer: 7, note: "Los siete primeros pares superiores de costillas" },
    { text: "¿Cuántos pares de costillas 'falsas' (que se unen al cartílago de la costilla superior) tenemos?", answer: 3, note: "Los pares 8, 9 y 10 de la caja torácica" },
    { text: "¿Cuántas falanges óseas componen en total el dedo pulgar de la mano humana?", answer: 2, note: "A diferencia de los otros cuatro dedos que poseen tres falanges (proximal, media y distal)" },
    { text: "¿Cuántas falanges óseas tiene cada uno de los dedos índice, corazón, anular y meñique de la mano?", answer: 3, note: "Falange proximal, media y distal en cada uno de ellos" },
    { text: "¿Cuántas cuerdas vocales verdaderas tenemos los seres humanos en la laringe para modular la voz?", answer: 2, note: "Dos pliegues vocales musculares que vibran al paso del aire espirado" },
    { text: "¿Cuántos lóbulos tiene el pulmón derecho humano en su estructura anatómica?", answer: 3, note: "Lóbulo superior, medio e inferior (más grande que el izquierdo)" },
    { text: "¿Cuántos lóbulos anatómicos tiene el pulmón izquierdo para dejar espacio al corazón?", answer: 2, note: "Solo lóbulo superior e inferior para alojar la silueta cardíaca" },
    { text: "¿Cuántas válvulas cardíacas principales controlan el flujo unidireccional de la sangre en el corazón?", answer: 4, note: "Mitral, tricúspide, aórtica y pulmonar" },
    { text: "¿Cuántas capas principales componen la estructura de la piel humana (epidermis, dermis, hipodermis)?", answer: 3, note: "La epidermis protectora externa, la dermis vascular y la hipodermis grasa" },
    // --- MEGATANDA 9: PORCENTAJES (%) EXTRAORDINARIOS ---
    { text: "¿Qué porcentaje de las especies de peces marinos viven en aguas costeras a menos de 200 metros de profundidad?", answer: 80, note: "La gran mayoría de la vida marina depende de la luz solar en la plataforma continental" },
    { text: "¿Qué porcentaje del peso corporal de un elefante adulto corresponde a sus orejas?", answer: 2, note: "Aunque parezca poco, son enormes radiadores térmicos para disipar calor en la sabana" },
    { text: "¿Qué porcentaje de los diamantes de colores naturales del mundo son de color rosa?", answer: 1, note: "Menos del 0,1% de los diamantes extraídos, de ahí sus astronómicos precios en subastas" },
    { text: "¿Qué porcentaje de los vuelos comerciales en el mundo tienen turbulencias leves durante el trayecto?", answer: 90, note: "Un fenómeno meteorológico absolutamente común, seguro y rutinario en la aviación" },
    { text: "¿Qué porcentaje de la sal utilizada en la industria química mundial se destina a fabricar cloro y sosa cáustica?", answer: 60, note: "La salmuera industrial es la base de cientos de polímeros plásticos y desinfectantes" },
    { text: "¿Qué porcentaje de los accidentes de tráfico en carretera están relacionados con distracciones al volante?", answer: 30, note: "El uso del teléfono móvil al conducir es hoy la principal causa de despiste mortal" },
    { text: "¿Qué porcentaje de las calorías del azúcar blanco de mesa provienen de los carbohidratos simples?", answer: 100, note: "Sacarosa pura sin vitaminas, minerales ni fibra: pura energía rápida" },
    { text: "¿Qué porcentaje del territorio de los Países Bajos se utiliza para la producción agropecuaria?", answer: 54, note: "Son uno de los mayores exportadores agrícolas del planeta pese a su reducido tamaño" },
    { text: "¿Qué porcentaje de las emisiones de metano globales se originan en la fermentación entérica del ganado?", answer: 30, note: "El proceso digestivo de los rumiantes genera una parte notable de este gas de efecto invernadero" },
    { text: "¿Qué porcentaje de la población española vive en viviendas de tipo piso o apartamento en bloque?", answer: 65, note: "España es el país de Europa occidental con mayor porcentaje de vida en pisos verticales" },
    { text: "¿Qué porcentaje de los niños en el mundo aprenden más de un idioma antes de cumplir los 10 años?", answer: 50, note: "Más de la mitad de la población infantil del planeta es bilingüe o multilingüe natural" },
    { text: "¿Qué porcentaje de la producción mundial de trigo se destina a la elaboración de pan y harinas de consumo humano?", answer: 65, note: "El tercio restante se emplea para alimentación animal y usos industriales" },
    { text: "¿Qué porcentaje de la masa del planeta Mercurio está compuesto por su gigantesco núcleo metálico de hierro?", answer: 70, note: "Proporcionalmente es el planeta con el núcleo de hierro más denso del Sistema Solar" },
    { text: "¿Qué porcentaje de las parejas en los países occidentales se conocen actualmente a través de aplicaciones o Internet?", answer: 40, note: "Las apps de citas y redes han superado a los amigos comunes y el trabajo como vía de encuentro" },
    { text: "¿Qué porcentaje de la energía consumida en un hogar medio se destina únicamente a la calefacción y climatización?", answer: 50, note: "El mantenimiento térmico de la vivienda representa la mitad exacta de la factura energética" },
    { text: "¿Qué porcentaje de las especies de pulpos habitan en el fondo del mar (bentónicas)?", answer: 90, note: "Cazan y se camuflan arrastrándose por el lecho marino y grietas rocosas" },
    { text: "¿Qué porcentaje de los seres humanos tienen la línea de inserción del pelo de la frente en forma de 'pico de viuda'?", answer: 33, note: "Un tercio de la población presenta esta característica genética hereditaria" },
    { text: "¿Qué porcentaje del peso de una aceituna fresca madura es aceite vegetal puro?", answer: 20, note: "Varía entre el 15% y el 25% según la variedad (picual, arbequina, hojiblanca)" },
    { text: "¿Qué porcentaje de las búsquedas en Internet las realizan usuarios desde navegadores basados en Chromium?", answer: 75, note: "Chrome, Edge, Brave y Opera comparten el mismo motor de código base" },
    { text: "¿Qué porcentaje de los diamantes del mundo se encuentran a más de 150 kilómetros de profundidad en el manto?", answer: 99, note: "Solo salen a la superficie impulsados por erupciones volcánicas profundas de kimberlita" },
    { text: "¿Qué porcentaje de la luz solar visible atraviesa los primeros 100 metros de la superficie del océano?", answer: 1, note: "A partir de 200 metros reina la oscuridad biológica absoluta (zona afótica)" },
    { text: "¿Qué porcentaje de la masa de una piña tropical fresca es agua?", answer: 86, note: "Rica en agua, azúcares y la enzima digestiva bromelina" },
    { text: "¿Qué porcentaje de los adultos reconocen que no terminan de leer los libros que empiezan?", answer: 40, note: "Casi 4 de cada 10 lectores abandonan las obras si no les enganchan en los primeros capítulos" },
    { text: "¿Qué porcentaje de la producción de corcho de España procede de los alcornocales de Andalucía y Extremadura?", answer: 80, note: "Los parques naturales de Los Alcornocales y Sierra de San Pedro lideran la saca de corcho" },
    { text: "¿Qué porcentaje de los ordenadores de sobremesa en el mundo tienen instalado el sistema operativo Windows?", answer: 70, note: "Microsoft retiene la amplísima mayoría del mercado de equipos personales de escritorio" },

    // --- REINO ANIMAL Y NATURALEZA SALVAJE ---
    { text: "¿Cuántos kilómetros por hora de velocidad puede alcanzar una avestruz en carrera continuada sostenida?", answer: 70, note: "El ave más rápida y pesada sobre la tierra, capaz de dar zancadas de 5 metros" },
    { text: "¿Cuántos años puede llegar a vivir un loro guacamayo en cautividad con cuidados óptimos?", answer: 60, note: "Algunas aves de esta familia han superado los 80 años de vida" },
    { text: "¿Cuántos corazones bombean sangre en el cuerpo de una lombriz de tierra común?", answer: 5, note: "Poseen cinco pares de arcos aórticos que se contraen rítmicamente" },
    { text: "¿Cuántas cámaras tiene el corazón de un reptil como la lagartija o la serpiente?", answer: 3, note: "Dos aurículas y un solo ventrículo con tabique parcial (los cocodrilos tienen 4)" },
    { text: "¿Cuántos metros de envergadura de alas puede tener el murciélago más grande del mundo (zorro volador)?", answer: 2, note: "Un murciélago frugívoro gigante de las selvas del sudeste asiático" },
    { text: "¿Cuántos colmillos visibles tienen los elefantes africanos tanto machos como hembras?", answer: 2, note: "Son en realidad incisivos superiores alargados que crecen durante toda su vida" },
    { text: "¿Cuántos kilos de hojas de bambú puede comer un panda gigante en una jornada?", answer: 12, note: "Necesitan comer entre 12 y 38 kilos de bambú al día para obtener suficientes nutrientes" },
    { text: "¿Cuántos metros de profundidad puede sumergirse un cachalote gigante cazando calamares (en cientos)?", answer: 20, note: "Hasta 2.000 metros de profundidad aguantando más de una hora la respiración" },
    { text: "¿Cuántas patas articuladas tiene un cangrejo ermitaño adulto?", answer: 10, note: "Crustáceo decápodo que utiliza conchas de caracol vacías para proteger su abdomen blando" },
    { text: "¿Cuántos días suele durar el periodo de gestación de una coneja doméstica antes de parir?", answer: 30, note: "Apenas un mes de gestación, lo que explica su altísima tasa reproductiva" },

    // --- CIENCIA, INVENTOS Y TECNOLOGÍA ---
    { text: "¿En qué año se inventó la televisión electrónica moderna por Philo Farnsworth?", answer: 1927, note: "Transmitió por primera vez la imagen en movimiento de una simple línea recta" },
    { text: "¿En qué año se emitió la primera retransmisión televisiva pública de alta definición por la BBC en Londres?", answer: 1936, note: "Desde los estudios de Alexandra Palace utilizando 405 líneas de resolución" },
    { text: "¿En qué año se patentó la primera guitarra eléctrica de cuerpo macizo moderna (Fender Broadcaster/Telecaster)?", answer: 1950, note: "Diseñada por Leo Fender, cambió la historia de la música popular para siempre" },
    { text: "¿En qué año se inventó el primer ratón o 'mouse' de ordenador por Douglas Engelbart?", answer: 1964, note: "Una tosca caja de madera tallada con dos ruedecillas metálicas en su interior" },
    { text: "¿En qué año se fundó la compañía tecnológica Apple por Steve Jobs y Steve Wozniak?", answer: 1976, note: "En el mítico garaje de la familia Jobs en Los Altos, California" },
    { text: "¿En qué año se lanzó el primer ordenador doméstico Commodore 64?", answer: 1982, note: "El modelo de ordenador personal individual más vendido de la historia de la informática" },
    { text: "¿En qué año se lanzó al mercado el primer reproductor doméstico de discos compactos (CD) por Sony?", answer: 1982, note: "El mítico modelo CDP-101 puesto a la venta en Japón" },
    { text: "¿En qué año se inauguró el Gran Colisionador de Hadrones (LHC) en el CERN de Ginebra?", answer: 2008, note: "El acelerador de partículas más gigantesco y complejo jamás construido por el ser humano" },
    { text: "¿En qué año se descubrió el Bosón de Higgs en los experimentos del LHC del CERN?", answer: 2012, note: "La conocida popularmente como 'partícula de Dios' que otorga masa a la materia" },
    { text: "¿En qué año despegó el primer vuelo comercial del avión supersónico Concorde con pasajeros?", answer: 1976, note: "Rutas simultáneas Londres-Baréin y París-Río de Janeiro" },

    // --- HISTORIA MODERNA Y GRANDES HITOS ---
    { text: "¿En qué año se celebró la histórica batalla naval de Pearl Harbor en Hawái?", answer: 1941, note: "El 7 de diciembre de 1941: 'Una fecha que vivirá en la infamia'" },
    { text: "¿En qué año se fundó la República Popular China bajo el liderazgo de Mao Zedong?", answer: 1949, note: "Proclamada en la Plaza de Tiananmén de Pekín el 1 de octubre de 1949" },
    { text: "¿En qué año triunfó la Revolución Cubana con la entrada de Fidel Castro en La Habana?", answer: 1959, note: "El 1 de enero de 1959 tras la huida del dictador Fulgencio Batista" },
    { text: "¿En qué año se creó la alianza militar del Pacto de Varsovia en la Europa del Este?", answer: 1955, note: "Tratado de amistad y colaboración militar en respuesta a la entrada de Alemania en la OTAN" },
    { text: "¿En qué año concluyó formalmente el régimen racista del Apartheid en Sudáfrica con elecciones democráticas?", answer: 1994, note: "Con la histórica victoria electoral de Nelson Mandela a la presidencia" },
    { text: "¿En qué año se produjo la trágica muerte de la princesa Diana de Gales en París?", answer: 1997, note: "El 31 de agosto de 1997 en un accidente de tráfico en el túnel del puente del Alma" },
    { text: "¿En qué año se inauguró formalmente el edificio del Pentágono en Washington?", answer: 1943, note: "La sede del Departamento de Defensa de EE.UU. con su característica planta pentagonal" },
    { text: "¿En qué año fue botado el buque escuela Juan Sebastián de Elcano de la Armada Española?", answer: 1927, note: "Construido en los astilleros Echevarrieta y Larrinaga de Cádiz" },
    { text: "¿En qué año se firmó el Tratado de Maastricht que dio nacimiento formal a la Unión Europea?", answer: 1992, note: "El 7 de febrero de 1992 fijando los criterios para la moneda única europea" },
    { text: "¿En qué año se produjo la trágica toma de rehenes en el teatro Dubrovka de Moscú?", answer: 2002, note: "Secuestro masivo por terroristas chechenos durante el musical Nord-Ost" },

    // --- CINE, TELEVISIÓN Y CULTURA POP ---
    { text: "¿Cuántos premios Oscar ganó la comedia dramática 'Forrest Gump' en la gala de 1995?", answer: 6, note: "Incluyendo Mejor Película, Mejor Director y Mejor Actor para Tom Hanks" },
    { text: "¿En qué año se estrenó la película animada 'Aladdín' de los estudios Disney?", answer: 1992, note: "Inolvidable por la deslumbrante voz y comicidad de Robin Williams como el Genio" },
    { text: "¿En qué año se estrenó en cines la primera película de animación 'Monstruos, S.A.' de Pixar?", answer: 2001, note: "Con Mike Wazowski y James P. Sullivan asustando para generar energía" },
    { text: "¿En qué año se estrenó 'Los Increíbles', la aclamada película de superhéroes de Pixar?", answer: 2004, note: "Dirigida por Brad Bird y ganadora de dos premios Oscar" },
    { text: "¿Cuántas películas componen la saga de terror cinematográfica original de 'Alien' con Sigourney Weaver?", answer: 4, note: "Alien (1979), Aliens (1986), Alien 3 (1992) y Alien Resurrección (1997)" },
    { text: "¿Cuántas películas de Indiana Jones fueron dirigidas personalmente por Steven Spielberg?", answer: 4, note: "Las cuatro primeras; la quinta entrega fue dirigida por James Mangold" },
    { text: "¿Cuántos episodios componen la mítica serie británica de comedia 'Fawlty Towers' con John Cleese?", answer: 12, note: "Dos temporadas de solo 6 capítulos cada una consideradas cumbre de la comedia" },
    { text: "¿Cuántos episodios rodó el cómico Rowan Atkinson en la serie original de televisión de 'Mr. Bean'?", answer: 15, note: "Apenas 15 capítulos bastaron para convertir el personaje en un icono global" },
    { text: "¿En qué año se estrenó la telenovela colombiana 'Yo soy Betty, la fea'?", answer: 1999, note: "Reconocida por el Libro Guinness como la telenovela más exitosa de la historia de la televisión" },
    { text: "¿Cuántas temporadas duró la célebre serie de acción policíaca 'Los hombres de Paco' en su etapa clásica?", answer: 9, note: "Emitida por Antena 3 con Paco Tous, Pepón Nieto y Hugo Silva" },

    // --- DEPORTES Y COMPETICIONES MUNDIALES ---
    { text: "¿Cuántos minutos dura reglamentariamente un partido de hockey sobre hierba dividido en 4 cuartos?", answer: 60, note: "Cuatro cuartos de 15 minutos cronometrados cada uno" },
    { text: "¿Cuántos jugadores componen el equipo sobre el césped en un partido de hockey hierba?", answer: 11, note: "Diez jugadores de campo y un portero equipado con protecciones" },
    { text: "¿Cuántos jugadores están sobre la pista de hielo por cada equipo en un partido de hockey hielo (NHL)?", answer: 6, note: "Cinco patinadores de campo y un portero sobre la pista helada" },
    { text: "¿Cuántos periodos de 20 minutos componen un partido reglamentario de hockey sobre hielo?", answer: 3, note: "Tres tiempos de 20 minutos netos de juego con descansos intercalados" },
    { text: "¿Cuántos puntos de ventaja se necesitan en el desempate de un 'tie-break' reglamentario de tenis?", answer: 2, note: "Se juega al primero que llegue a 7 puntos con ventaja mínima de 2" },
    { text: "¿Cuántos juegos hay que ganar como mínimo para adjudicarse un set normal en tenis?", answer: 6, note: "Con ventaja de dos juegos o ganando el tie-break al llegar al 6-6" },
    { text: "¿Cuántos títulos de Liga de Primera División española tiene el Real Club Celta de Vigo?", answer: 0, note: "El club gallego ha sido finalista de Copa en varias ocasiones pero sin título de Liga" },
    { text: "¿Cuántos títulos de Copa de Europa / Champions League masculina ha ganado el Inter de Milán?", answer: 3, note: "Bicampeón en 1964 y 1965 con Helenio Herrera, y en 2010 con José Mourinho" },
    { text: "¿Cuántas Champions League masculinas ha ganado el Chelsea Football Club inglés?", answer: 2, note: "Conquistadas en Múnich 2012 y en Oporto 2021" },
    { text: "¿Cuántas Champions League masculinas ha conquistado la Juventus de Turín en su historia?", answer: 2, note: "Ganadas en 1985 y 1996, habiendo perdido además siete finales continentales" },
    { text: "¿Cuántos kilómetros de longitud mide el trazado del circuito de velocidad de Fórmula 1 de Spa-Francorchamps en Bélgica?", answer: 7, note: "El circuito más largo del calendario de F1 con 7,004 km de curvas míticas como Eau Rouge" },
    { text: "¿Cuántos kilómetros de longitud tiene el circuito urbano de Fórmula 1 de Mónaco en Montecarlo?", answer: 3, note: "El más corto y estrecho del mundial con 3,337 km de recorrido" },

    // --- GEOGRAFÍA POLÍTICA Y CAPITALES ---
    { text: "¿Cuántos estados federales componen los Estados Unidos de América continentales (sin Alaska ni Hawái)?", answer: 48, note: "Los 48 estados contiguos que componen el bloque continental principal" },
    { text: "¿Cuántas provincias autónomas componen el territorio insular de las Islas Filipinas?", answer: 82, note: "Un archipiélago compuesto por más de 7.000 islas e islotes en el sudeste asiático" },
    { text: "¿Cuántos departamentos componen el territorio nacional de la República Oriental del Uruguay?", answer: 19, note: "Montevideo es la capital y el departamento más poblado" },
    { text: "¿Cuántas provincias componen la República del Ecuador en América del Sur?", answer: 24, note: "Incluyendo la provincia insular de Galápagos en el océano Pacífico" },
    { text: "¿Cuántos estados componen la República de la India en su división federal territorial?", answer: 28, note: "Más ocho territorios de la unión administrados por el gobierno central" },
    { text: "¿Cuántas provincias componen la comunidad autónoma de Castilla-La Mancha?", answer: 5, note: "Toledo, Ciudad Real, Albacete, Cuenca y Guadalajara" },
    { text: "¿Cuántas islas con cabildo insular propio componen el archipiélago de las Islas Canarias?", answer: 7, note: "La Graciosa se considera la octava isla habitada pero depende administrativamente de Lanzarote" },
    { text: "¿Cuántos municipios componen la provincia de Sevilla en Andalucía?", answer: 106, note: "La provincia más poblada del sur peninsular" },
    { text: "¿Cuántos puentes históricos cruzan el río Moldava dentro de la ciudad de Praga?", answer: 18, note: "El más icónico y monumental es el legendario Puente de Carlos de 1357" },
    { text: "¿Cuántas estatuas barrocas decoran los pretiles del histórico Puente de Carlos en Praga?", answer: 30, note: "Treinta esculturas monumentales de santos colocadas en dos hileras frente a frente" },

    // --- ANATOMÍA, CULTURA Y COTIDIANIDAD ---
    { text: "¿Cuántas teclas negras tiene un teclado de piano acústico estándar de 88 notas?", answer: 36, note: "Distribuidas en patrones alternados de grupos de 2 y 3 teclas" },
    { text: "¿Cuántos naipes componen un juego de cartas de Tarot tradicional completo?", answer: 78, note: "22 arcanos mayores y 56 arcanos menores organizados en 4 palos" },
    { text: "¿Cuántos arcanos mayores componen la baraja clásica de Tarot?", answer: 22, note: "Desde El Loco (0) hasta El Mundo (XXI)" },
    { text: "¿Cuántos colores tiene la bandera oficial de la República de Sudáfrica adoptada en 1994?", answer: 6, note: "Negro, amarillo, verde, blanco, rojo y azul en diseño de 'Y' horizontal" },
    { text: "¿Cuántas franjas horizontales componen la bandera oficial del Reino de España?", answer: 3, note: "Dos franjas rojas y una amarilla central de doble anchura" },
    { text: "¿Cuántas franjas horizontales componen la bandera oficial de Alemania (negro, rojo y oro)?", answer: 3, note: "Tres franjas de idéntica anchura horizontal" },
    { text: "¿Cuántas franjas verticales componen la bandera tricolor oficial de la República Francesa?", answer: 3, note: "Azul, blanco y rojo en orden desde el asta" },
    { text: "¿Cuántas estrellas blancas componen la constelación de la Cruz del Sur en la bandera de Australia?", answer: 5, note: "Más la gran estrella de la Mancomunidad de 7 puntas bajo la Union Jack" },
    { text: "¿Cuántas estrellas rojas con borde blanco tiene la bandera oficial de Nueva Zelanda?", answer: 4, note: "Representan las cuatro estrellas principales de la Cruz del Sur" },
    { text: "¿Cuántas puntas tiene la estrella de David presente en la bandera del estado de Israel?", answer: 6, note: "Hexagrama formado por dos triángulos equiláteros entrelazados" },
    // --- MEGATANDA 10: PORCENTAJES (%) CURIOSOS, NATURALEZA Y CUERPO ---
    { text: "¿Qué porcentaje del peso corporal de un recién nacido humano es agua?", answer: 75, note: "Desciende gradualmente hasta el 60% al alcanzar la edad adulta" },
    { text: "¿Qué porcentaje de las calorías del aceite de oliva proceden del ácido oleico (grasa monoinsaturada)?", answer: 75, note: "El pilar fundamental de los beneficios cardiosaludables de la dieta mediterránea" },
    { text: "¿Qué porcentaje de la producción mundial de café se consume en los países importadores no productores?", answer: 70, note: "Europa y Norteamérica encabezan el consumo de los granos cultivados en el trópico" },
    { text: "¿Qué porcentaje de las personas en el mundo tienen pelo liso de forma natural?", answer: 45, note: "El resto presenta variaciones de pelo ondulado, rizado o crespo afro" },
    { text: "¿Qué porcentaje de los seres humanos tienen miopía en países del este de Asia como Corea del Sur o Singapur?", answer: 85, note: "Cifras récord mundiales asociadas a la intensiva escolarización y vida en interiores" },
    { text: "¿Qué porcentaje del plástico producido en el mundo se utiliza en el sector de la construcción?", answer: 20, note: "Tuberías de PVC, aislamientos y perfiles de ventanas con larga vida útil" },
    { text: "¿Qué porcentaje de las especies de serpientes conocidas son venenosas?", answer: 20, note: "Apenas 1 de cada 5; y solo una pequeña fracción supone peligro mortal para humanos" },
    { text: "¿Qué porcentaje de las aves del mundo migran regularmente en alguna estación del año?", answer: 40, note: "Desplazándose miles de kilómetros para escapar del invierno y anidar" },
    { text: "¿Qué porcentaje de la superficie de Noruega continental está cubierta por bosques y selva boreal?", answer: 38, note: "Dominada por abetos, pinos silvestres y abedules en los valles" },
    { text: "¿Qué porcentaje de la masa del planeta Júpiter está compuesta por hidrógeno gaseoso?", answer: 90, note: "Prácticamente toda su atmósfera es hidrógeno con un 10% de helio" },
    { text: "¿Qué porcentaje de los diamantes en bruto descubiertos son aptos para ser tallados como gemas de joyería?", answer: 20, note: "El 80% restante presenta impurezas o fisuras y se destina a uso industrial" },
    { text: "¿Qué porcentaje del territorio de Suiza se considera terreno improductivo (roca, glaciares, ríos)?", answer: 25, note: "Una cuarta parte de su suelo no admite agricultura ni bosque debido a la alta montaña" },
    { text: "¿Qué porcentaje de las compras con tarjeta bancaria en España se realizan ya mediante tecnología 'contactless'?", answer: 95, note: "El pago acercando la tarjeta o el móvil domina casi la totalidad del comercio físico" },
    { text: "¿Qué porcentaje de los internautas en el mundo ven vídeos en YouTube al menos una vez al mes?", answer: 80, note: "La plataforma de vídeo más utilizada del planeta junto a los buscadores" },
    { text: "¿Qué porcentaje del peso de un champiñón común se evapora durante un salteado intenso en cocina?", answer: 50, note: "Pierden la mitad de su volumen en minutos al expulsar su agua celular" },
    { text: "¿Qué porcentaje de la masa de una patata frita de bolsa comercial corresponde a aceites absorbidos?", answer: 35, note: "Más de un tercio del peso de una bolsa de patatas fritas es grasa pura añadida" },
    { text: "¿Qué porcentaje de las personas experimentan el fenómeno de la 'ilusión del teléfono fantasma' (creer que vibra el móvil)?", answer: 80, note: "Hipersensibilidad neurológica del cerebro acostumbrado a responder a estímulos táctiles" },
    { text: "¿Qué porcentaje del peso de una ostra marina viva corresponde a su concha de carbonato cálcico?", answer: 80, note: "Cuatro quintas partes de su peso son pura coraza mineral protectora" },
    { text: "¿Qué porcentaje de los árboles de un bosque tropical lluvioso son polinizados por animales (insectos, murciélagos)?", answer: 90, note: "La falta de viento en el dosel selvático hace indispensable la polinización biológica" },
    { text: "¿Qué porcentaje de la población activa de los países nórdicos trabaja con contratos a tiempo completo?", answer: 75, note: "Con un mercado laboral muy flexible y equilibrado con la vida familiar" },
    { text: "¿Qué porcentaje de los usuarios de teléfonos inteligentes tienen más de 30 aplicaciones instaladas?", answer: 70, note: "Aunque en la rutina diaria apenas utilizan entre 8 y 10 de ellas de forma habitual" },
    { text: "¿Qué porcentaje de las especies de mamíferos terrestres conocidas son murciélagos (quirópteros)?", answer: 20, note: "Uno de cada cinco mamíferos del planeta es capaz de volar" },
    { text: "¿Qué porcentaje de las especies de mamíferos del mundo son roedores (ratones, ardillas, capibaras)?", answer: 40, note: "El orden de mamíferos más numeroso y diverso de la Tierra" },
    { text: "¿Qué porcentaje de la producción mundial de corcho natural se destina a tapones para botellas de vino?", answer: 70, note: "El sector vinícola es el motor económico vital que mantiene los alcornocales vivos" },
    { text: "¿Qué porcentaje del peso corporal de un oso polar macho adulto puede ser grasa corporal antes del invierno?", answer: 50, note: "Una descomunal capa de hasta 10 cm de grasa que lo aísla de las aguas árticas congeladas" },

    // --- ANATOMÍA Y EL CUERPO HUMANO ---
    { text: "¿Cuántos litros de lágrimas produce una persona de media al año para lubricar sus ojos?", answer: 60, note: "Lágrimas basales continuas producidas sin necesidad de llorar de emoción" },
    { text: "¿Cuántos kilómetros por hora de velocidad alcanza el aire al toser fuertemente (en decenas)?", answer: 80, note: "Una tos enérgica puede expulsar partículas a más de 80 km/h para despejar la laringe" },
    { text: "¿Cuántos milímetros de espesor tiene la piel más fina del cuerpo humano (en los párpados)?", answer: 0, note: "Apenas 0,5 milímetros de espesor (menos de 1 milímetro)" },
    { text: "¿Cuántos milímetros de grosor alcanza la piel más gruesa del cuerpo humano (en las plantas de los pies)?", answer: 4, note: "Hasta 4 milímetros de epidermis queratinizada para resistir la fricción del peso" },
    { text: "¿Cuántos huesos forman la cintura escapular humana en cada hombro (clavícula y escápula)?", answer: 2, note: "Uniendo los brazos directamente al tronco del esqueleto axil" },
    { text: "¿Cuántas capas celulares componen la córnea del ojo humano?", answer: 5, note: "Epitelio, membrana de Bowman, estroma, membrana de Descemet y endotelio" },
    { text: "¿Cuántos mililitros de capacidad media tiene la vejiga urinaria de un adulto antes de sentir ganas imperiosas de orinar?", answer: 400, note: "Puede distenderse hasta los 800 ml en casos excepcionales de retención" },
    { text: "¿Cuántos músculos componen cada una de las orejas humanas para orientar el pabellón auricular?", answer: 3, note: "Músculos auriculares vestigiales que solo algunas personas logran mover voluntariamente" },
    { text: "¿Cuántos días tarda la piel humana en renovar por completo su capa epidérmica externa?", answer: 28, note: "Aproximadamente un ciclo celular mensual de descamación y regeneración" },
    { text: "¿Cuántas articulaciones móviles o semimóviles tiene el esqueleto humano en total (en cientos)?", answer: 300, note: "Más de 300 articulaciones que permiten la amplia gama de movimientos humanos" },

    // --- CIENCIA, ESPACIO Y FÍSICA ---
    { text: "¿Cuántos anillos principales claramente diferenciados orbitan el planeta Urano?", answer: 13, note: "Anillos estrechos y muy oscuros descubiertos en 1977" },
    { text: "¿Cuántas lunas naturales orbitan el planeta enano Plutón?", answer: 5, note: "Caronte (la mayor), Nix, Hidra, Cerbero y Estigia" },
    { text: "¿Cuántos años terrestres tarda el planeta enano Plutón en dar una sola vuelta al Sol?", answer: 248, note: "Descubierto en 1930, aún no ha completado una sola órbita desde su descubrimiento" },
    { text: "¿Cuántos kilómetros de espesor medio tiene la corteza continental de la Tierra?", answer: 35, note: "Mucho más gruesa que la corteza oceánica, que apenas tiene unos 7 km de espesor" },
    { text: "¿Cuántos millones de años duró aproximadamente la era de los dinosaurios (Mesozoico)?", answer: 180, note: "Desde hace 245 millones de años hasta su extinción hace 66 millones de años" },
    { text: "¿Cuántos millones de años hace que se extinguió el último dinosaurio no aviano?", answer: 66, note: "Tras el impacto del asteroide en la península de Yucatán (cráter de Chicxulub)" },
    { text: "¿Cuántos kilómetros por hora de viento puede registrar un huracán o tifón de categoría 5 máxima (en cientos)?", answer: 250, note: "Superan los 250 km/h de rachas sostenidas con un inmenso poder devastador" },
    { text: "¿Cuántos grados Celsius de temperatura puede alcanzar el canal de aire ionizado de un rayo (en miles)?", answer: 30000, note: "Cinco veces más caliente que la propia superficie visible del Sol" },
    { text: "¿Cuántos segundos tarda la luz de un relámpago en recorrer un kilómetro de distancia en el aire?", answer: 0, note: "La luz viaja a 300.000 km/s (instantánea); el sonido del trueno tarda 3 segundos por km" },
    { text: "¿Cuántos segundos tarda el sonido de un trueno en recorrer 1 kilómetro en la atmósfera?", answer: 3, note: "Regla clásica: cuenta los segundos entre relámpago y trueno y divide entre 3 para saber los km" },

    // --- HISTORIA MODERNA Y GRANDES HITOS ---
    { text: "¿En qué año se firmó el Tratado de Guadalupe Hidalgo donde México cedió más de la mitad de su territorio a EE.UU.?", answer: 1848, note: "Supuso la anexión estadounidense de California, Nevada, Utah, Arizona y Nuevo México" },
    { text: "¿En qué año se fundó la Cruz Roja Española en Madrid bajo los auspicios de la Orden de San Juan?", answer: 1864, note: "Uno de los cuerpos humanitarios más veteranos y activos del país" },
    { text: "¿En qué año se produjo el primer vuelo sin escalas en solitario cruzando el Atlántico por Charles Lindbergh?", answer: 1927, note: "A bordo del monoplano 'Spirit of St. Louis' desde Nueva York hasta París" },
    { text: "¿En qué año cruzó Amelia Earhart el Atlántico en solitario convirtiéndose en la primera mujer en lograrlo?", answer: 1932, note: "Aterrizando en un prado cerca de Derry, Irlanda del Norte" },
    { text: "¿En qué año se proclamó la Declaración Schuman que puso las bases de la moderna Unión Europea?", answer: 1950, note: "El 9 de mayo de 1950, fecha celebrada hoy como el Día de Europa" },
    { text: "¿En qué año se firmó el armisticio que puso fin a la sangrienta Guerra de Argelia?", answer: 1962, note: "Los Acuerdos de Évian que reconocieron la plena independencia de Argelia frente a Francia" },
    { text: "¿En qué año tuvo lugar la Revolución Islámica en Irán con el regreso del ayatolá Jomeini?", answer: 1979, note: "Derrocamiento definitivo del sah Mohammad Reza Pahlaví" },
    { text: "¿En qué año comenzó la guerra entre Irán e Irak que se prolongó durante casi una década?", answer: 1980, note: "Conflicto que se extendió hasta 1988 con más de un millón de bajas" },
    { text: "¿En qué año se celebró la histórica Conferencia de Paz de Madrid para Oriente Medio?", answer: 1991, note: "Histórico encuentro directo entre israelíes, palestinos y estados árabes" },
    { text: "¿En qué año se firmaron los Acuerdos de Paz de Oslo entre Simón Peres y Yasser Arafat en Washington?", answer: 1993, note: "Sellados con el histórico apretón de manos ante el presidente Bill Clinton" },

    // --- CINE, MÚSICA Y CULTURA POP ---
    { text: "¿En qué año se estrenó la película animada 'Bambi' de Walt Disney?", answer: 1942, note: "Una de las películas más emotivas e influyentes de la era dorada de Disney" },
    { text: "¿En qué año se estrenó 'La Cenicienta' de los estudios Disney?", answer: 1950, note: "El éxito que salvó económicamente a los estudios de animación tras la Segunda Guerra Mundial" },
    { text: "¿En qué año se estrenó la película musical 'Cantando bajo la lluvia' de Gene Kelly?", answer: 1952, note: "Considerada por la crítica como el mejor musical de la historia del cine" },
    { text: "¿En qué año se estrenó en cines la primera película de la trilogía 'Mad Max' con Mel Gibson?", answer: 1979, note: "Cinta de acción australiana de bajo presupuesto que creó un subgénero postapocalíptico" },
    { text: "¿En qué año se estrenó 'Alien: El regreso' (Aliens) dirigida por James Cameron?", answer: 1986, note: "Convirtió el clásico de terror espacial en una obra maestra del cine de acción militar" },
    { text: "¿En qué año se estrenó la película bélica 'La chaqueta metálica' (Full Metal Jacket) de Stanley Kubrick?", answer: 1987, note: "Con el implacable sargento instructor Hartman interpretado por R. Lee Ermey" },
    { text: "¿En qué año se estrenó la obra maestra mafiosa 'Uno de los nuestros' (Goodfellas) de Martin Scorsese?", answer: 1990, note: "Protagonizada por Ray Liotta, Robert De Niro y Joe Pesci" },
    { text: "¿En qué año se estrenó la película 'Cadena perpetua' (The Shawshank Redemption)?", answer: 1994, note: "Elegida habitualmente por los usuarios de IMDb como la mejor película de la historia" },
    { text: "¿Cuántos premios Oscar ganó la película 'Cadena perpetua' en 1995?", answer: 0, note: "Pese a sus 7 nominaciones, no ganó ninguna estatuilla frente al vendaval de Forrest Gump" },
    { text: "¿Cuántas películas componen la saga cinematográfica de animación de 'Shrek' en su línea principal?", answer: 4, note: "Shrek (2001), Shrek 2 (2004), Shrek Tercero (2007) y Shrek, felices para siempre (2010)" },
    { text: "¿Cuántos episodios componen la célebre serie española 'Médico de familia' con Emilio Aragón?", answer: 119, note: "Emitidos entre 1995 y 1999, marcando audiencias históricas en Telecinco" },
    { text: "¿Cuántas temporadas duró la serie de suspense 'Los misterios de Laura' en TVE?", answer: 3, note: "Protagonizada por María Pujalte y adaptada con éxito en EE.UU. por la cadena NBC" },

    // --- DEPORTES Y COMPETICIONES MUNDIALES ---
    { text: "¿Cuántos kilómetros por hora de velocidad media superan los ciclistas en una contrarreloj del Tour de Francia?", answer: 50, note: "A bordo de bicicletas aerodinámicas con ruedas lenticulares" },
    { text: "¿Cuántos días de descanso reglamentarios tienen los ciclistas durante las tres semanas del Tour de Francia?", answer: 2, note: "Dos lunes de pausa y recuperación para masajes y traslados de hotel" },
    { text: "¿Cuántos maillots de líder individuales reparte el Tour de Francia (amarillo, verde, puntos y blanco)?", answer: 4, note: "General, regularidad por puntos, montaña y mejor joven menor de 25 años" },
    { text: "¿Cuántos segundos como máximo tiene un jugador de pádel o tenis para sacar tras finalizar el punto anterior?", answer: 25, note: "Controlado por el reloj de saque en pista para evitar pérdidas de tiempo" },
    { text: "¿Cuántos botes puede dar la pelota en el suelo antes de ser golpeada en un partido reglamentario de pádel o tenis?", answer: 1, note: "Si la bola bota dos veces en el suelo, se pierde el punto automáticamente" },
    { text: "¿Cuántas faltas personales suponen la expulsión definitiva de un jugador en un partido oficial de la NBA?", answer: 6, note: "En el baloncesto FIBA internacional la expulsión se produce a la 5ª falta personal" },
    { text: "¿Cuántas faltas personales suponen la eliminación de un jugador en el baloncesto europeo FIBA?", answer: 5, note: "Una falta menos que en la NBA debido a que los cuartos duran 10 minutos en vez de 12" },
    { text: "¿Cuántos minutos dura cada cuarto en un partido reglamentario de la NBA?", answer: 12, note: "Cuatro cuartos de 12 minutos completando 48 minutos de partido (frente a los 40 min de FIBA)" },
    { text: "¿Cuántos minutos dura cada cuarto en el baloncesto europeo e internacional de la FIBA?", answer: 10, note: "Cuatro cuartos de 10 minutos sumando 40 minutos de juego reglamentario" },
    { text: "¿Cuántos jugadores están en el agua por cada equipo en una competición de natación artística por equipos?", answer: 8, note: "Ocho nadadoras ejecutando coreografías sincronizadas con música subacuática" },

    // --- GEOGRAFÍA POLÍTICA Y MUNDO ---
    { text: "¿Cuántos países independientes componen formalmente el archipiélago de las Antillas Mayores en el Caribe?", answer: 4, note: "Cuba, República Dominicana, Haití y Jamaica (Puerto Rico es territorio estadounidense)" },
    { text: "¿Cuántos países soberanos tienen frontera territorial directa con la República de Sudáfrica?", answer: 6, note: "Namibia, Botsuana, Zimbabue, Mozambique, Suazilandia (Esuatini) y Lesoto (enclave interior)" },
    { text: "¿Cuántos países del mundo están completamente rodeados por el territorio de un solo país (enclaves)?", answer: 3, note: "Ciudad del Vaticano y San Marino (dentro de Italia) y Lesoto (dentro de Sudáfrica)" },
    { text: "¿Cuántos departamentos componen el territorio de la República de Bolivia?", answer: 9, note: "La Paz, Cochabamba, Santa Cruz, Oruro, Potosí, Chuquisaca, Tarija, Beni y Pando" },
    { text: "¿Cuántas provincias componen la República del Perú?", answer: 196, note: "Repartidas a lo largo de sus 25 regiones o departamentos administrativos" },
    { text: "¿Cuántos estados federales componen la República Bolivariana de Venezuela?", answer: 23, note: "23 estados más el Distrito Capital y las dependencias federales marítimas" },
    { text: "¿Cuántas provincias componen la comunidad autónoma de Castilla y León?", answer: 9, note: "La comunidad autónoma más extensa de España por superficie" },
    { text: "¿Cuántos kilómetros de longitud tiene la cordillera de los Pirineos entre el Cantábrico y el Mediterráneo (en cientos)?", answer: 4, note: "Aproximadamente 430 kilómetros de frontera natural entre España y Francia" },
    { text: "¿Cuántos picos de más de 3.000 metros de altitud (tresmiles) existen en la cordillera de los Pirineos?", answer: 212, note: "129 cumbres principales y 83 secundarias catalogadas oficialmente" },
    { text: "¿Cuántos picos de más de 3.000 metros de altitud tiene la cordillera de Sierra Nevada en Granada?", answer: 15, note: "Encabezados por el Mulhacén (3.479 m) y la Veleta (3.396 m)" },

    // --- CURIOSIDADES COTIDIANAS Y DATOS ASOMBROSOS ---
    { text: "¿Cuántos lados rectos tiene una señal de tráfico reglamentaria de STOP?", answer: 8, note: "Diseño octogonal rojo universal para ser reconocida incluso cubierta de nieve" },
    { text: "¿Cuántos lados tiene una señal de tráfico de ceda el paso tradicional?", answer: 3, note: "Triángulo equilátero invertido con borde rojo y fondo blanco o amarillo" },
    { text: "¿Cuántos puntos de costura o puntadas unen el cuero de una pelota oficial de béisbol de las Grandes Ligas?", answer: 108, note: "Cosidas a mano con hilo rojo de algodón encerado de doble lazada" },
    { text: "¿Cuántos gajos o paneles de cuero componen un balón clásico de fútbol blanco y negro (hexágonos y pentágonos)?", answer: 32, note: "20 hexágonos blancos y 12 pentágonos negros (diseño Telstar del icosaedro truncado)" },
    { text: "¿Cuántos pentágonos negros componen el clásico balón de fútbol de 32 paneles?", answer: 12, note: "Rodeados cada uno por cinco hexágonos blancos" },
    { text: "¿Cuántos hexágonos blancos componen el clásico balón de fútbol tradicional?", answer: 20, note: "Diseño geométrico que logra la esfera más estable y rodante" },
    { text: "¿Cuántos agujeros tiene un ladrillo perforado estándar utilizado en la construcción de tabiques?", answer: 6, note: "También llamado 'ladrillo panal' o tosco de seis huecos" },
    { text: "¿Cuántos lados tiene una tuerca hexagonal común?", answer: 6, note: "El estándar universal de la tornillería mecánica por su facilidad de apriete" },
    { text: "¿Cuántos colores componen la paleta básica del círculo cromático primario (rojo, amarillo y azul)?", answer: 3, note: "Los tres colores pigmento primarios a partir de los cuales se mezclan los secundarios" },
    { text: "¿Cuántos colores componen el arcoíris en la descripción clásica popularizada por Isaac Newton?", answer: 7, note: "Rojo, naranja, amarillo, verde, azul, añil y violeta" },
    // --- MEGATANDA 11: PORCENTAJES (%) DE BIOLOGÍA, PLANETA Y SOCIEDAD ---
    { text: "¿Qué porcentaje de las especies de anfibios conocidas están en peligro de extinción en el mundo?", answer: 41, note: "El grupo de vertebrados más amenazado por el cambio climático y el hongo quítrido" },
    { text: "¿Qué porcentaje del peso corporal de una hormiga corresponde a su exoesqueleto de quitina?", answer: 10, note: "Una armadura ligera y ultra resistente que le permite cargar pesos descomunales" },
    { text: "¿Qué porcentaje del peso de un melón maduro es agua?", answer: 90, note: "Una de las frutas más hidratantes y dulces de la temporada veraniega" },
    { text: "¿Qué porcentaje de la producción mundial de vino se elabora a partir de uvas tintas?", answer: 60, note: "El 40% restante corresponde a vinos blancos, rosados y espumosos" },
    { text: "¿Qué porcentaje del territorio de Canadá permanece prácticamente deshabitado o virgen de asentamientos humanos?", answer: 80, note: "Inmensos bosques boreales y tundra ártica con bajísima densidad de población" },
    { text: "¿Qué porcentaje de la energía que produce una vela encendida se emite en forma de calor y no de luz?", answer: 99, note: "Menos del 1% de su energía se transforma en radiación luminosa visible" },
    { text: "¿Qué porcentaje de los seres humanos tienen el lóbulo de la oreja pegado a la mandíbula sin descolgar?", answer: 25, note: "Un rasgo genético recesivo presente en uno de cada cuatro individuos" },
    { text: "¿Qué porcentaje de las parejas que se divorcian en España lo hacen de mutuo acuerdo ante juzgado o notario?", answer: 80, note: "La vía amistosa y rápida representa cuatro de cada cinco disoluciones matrimoniales" },
    { text: "¿Qué porcentaje del peso de una naranja dulce es agua en su pulpa?", answer: 87, note: "Rica en vitamina C, azúcares naturales y ácido cítrico" },
    { text: "¿Qué porcentaje de las reservas mundiales de litio conocidas se concentran en el 'Triángulo del Litio' sudamericano?", answer: 60, note: "Ubicado en los salares andinos de Bolivia, Argentina y Chile" },
    { text: "¿Qué porcentaje de las bacterias presentes en el cuerpo humano habitan en el tracto digestivo (microbiota)?", answer: 95, note: "Trillones de microorganismos esenciales para la inmunidad y digestión" },
    { text: "¿Qué porcentaje del peso de un tomate seco concentrado sigue siendo humedad?", answer: 15, note: "Pierde el 85% de su masa al sol, concentrando intensamente sus azúcares y sabor" },
    { text: "¿Qué porcentaje de los ataques cardíacos se presentan sin el clásico dolor agudo en el pecho en mujeres?", answer: 40, note: "Suelen manifestarse con fatiga extrema, mareos, náuseas y dificultad respiratoria" },
    { text: "¿Qué porcentaje de la superficie de la cuenca amazónica está cubierta por ríos y zonas inundables estacionales?", answer: 15, note: "Un ecosistema acuático descomunal que se expande miles de kilómetros cada año" },
    { text: "¿Qué porcentaje de la producción mundial de azafrán procede de los campos de cultivo de Irán?", answer: 90, note: "El mayor productor global del llamado 'oro rojo' gastronómico" },
    { text: "¿Qué porcentaje del peso de un diamante se pierde de media durante el proceso de tallado y pulido de la gema?", answer: 50, note: "La mitad de la piedra original en bruto se desecha para maximizar su brillo" },
    { text: "¿Qué porcentaje de los vuelos comerciales mundiales son operados por aviones bimotores de pasillo único (tipo A320 o B737)?", answer: 70, note: "Los caballos de batalla de las rutas de corto y medio radio en todo el mundo" },
    { text: "¿Qué porcentaje de la madera producida en Suecia se extrae de bosques gestionados de forma sostenible certificada?", answer: 100, note: "Por ley plantan más árboles de los que talan anualmente desde hace décadas" },
    { text: "¿Qué porcentaje de los adultos padecen bruxismo (apretar o rechinar los dientes involuntariamente de noche)?", answer: 20, note: "Afecta a una de cada cinco personas, muy vinculado al estrés crónico" },
    { text: "¿Qué porcentaje de los niños diagnosticados con asma infantil mejoran notablemente al llegar a la adolescencia?", answer: 50, note: "La mitad de los casos remiten o desaparecen con el desarrollo pulmonar maduro" },
    { text: "¿Qué porcentaje de la salmuera del Mar Rojo es sal (uno de los mares abiertos más cálidos y salinos)?", answer: 4, note: "Alrededor de 40 gramos de sal por litro debido a la intensa evaporación solar" },
    { text: "¿Qué porcentaje de la superficie de Groenlandia está habitada de forma permanente?", answer: 1, note: "Apenas una estrecha franja rocosa litoral libre de hielos milenarios" },
    { text: "¿Qué porcentaje de los hogares en Estados Unidos tienen al menos una televisión conectada a Internet?", answer: 88, note: "El auge definitivo de las Smart TVs y dispositivos de reproducción en streaming" },
    { text: "¿Qué porcentaje de las calorías consumidas a nivel mundial proceden únicamente de tres cereales: trigo, arroz y maíz?", answer: 50, note: "Los tres pilares básicos absolutos de la seguridad alimentaria de la humanidad" },
    { text: "¿Qué porcentaje del peso de una bellota fresca madura de encina es agua?", answer: 40, note: "El 60% restante son hidratos de carbono, aceites saludables y taninos" },

    // --- REINO ANIMAL Y FAUNA ASOMBROSA ---
    { text: "¿Cuántos dientes tiene un cocodrilo del Nilo adulto en su poderosa mandíbula?", answer: 66, note: "Puede llegar a renovar cada uno de sus dientes hasta 50 veces a lo largo de su vida" },
    { text: "¿Cuántos dientes afilados puede llegar a mudar un cocodrilo a lo largo de toda su vida (en miles)?", answer: 3, note: "Más de 3.000 dientes de repuesto que nacen bajo los que se van desgastando" },
    { text: "¿Cuántos ojos tiene un caballito de mar en su cabeza articulada?", answer: 2, note: "Pueden mover cada ojo de forma totalmente independiente como los camaleones" },
    { text: "¿Cuántos estómagos verdaderos tiene un caballito de mar para digerir el alimento?", answer: 0, note: "Carecen de estómago; la comida pasa directamente de la boca a los intestinos" },
    { text: "¿Cuántos metros de longitud puede alcanzar una anaconda verde gigante hembra?", answer: 7, note: "Una de las serpientes más pesadas y corpulentas de todos los ríos del planeta" },
    { text: "¿Cuántos kilos de peso puede llegar a superar una anaconda verde gigante adulta?", answer: 200, note: "Capaz de estrangular y devorar caimanes, ciervos y capibaras enteros" },
    { text: "¿Cuántas cámaras tiene el corazón de un cocodrilo adulto?", answer: 4, note: "El único grupo de reptiles que posee cuatro cavidades cardíacas completas" },
    { text: "¿Cuántos días puede aguantar un escorpión bajo el agua sin ahogarse?", answer: 2, note: "Ralentizan su metabolismo drásticamente para sobrevivir a riadas e inundaciones" },
    { text: "¿Cuántas patas tiene un ácaro microscópico de la sarna o del polvo en su fase adulta?", answer: 8, note: "Al ser arácnidos microscópicos cuentan con cuatro pares de patas articuladas" },
    { text: "¿Cuántos metros de profundidad puede sumergirse una ballena jorobada en sus inmersiones?", answer: 300, note: "Aguantando la respiración bajo el mar durante más de 30 minutos continuos" },

    // --- CIENCIA, FÍSICA Y ESPACIO ---
    { text: "¿Cuántos minutos tarda la sonda espacial New Horizons en enviar una señal a la Tierra desde el cinturón de Kuiper (en horas)?", answer: 6, note: "Más de seis horas luz para recorrer los miles de millones de kilómetros de distancia" },
    { text: "¿Cuántos astronautas viajaron a bordo de cada una de las misiones lunares Apolo de la NASA?", answer: 3, note: "Dos descendían en el módulo lunar y uno permanecía en órbita en el módulo de mando" },
    { text: "¿Cuántos motores principales de despegue propulsaban la primera etapa del cohete Saturno V (motores F-1)?", answer: 5, note: "Los cinco colosales motores F-1 generaban un empuje equivalente a 160 millones de CV" },
    { text: "¿Cuántos kilómetros de altura sobre la superficie de la Tierra orbita la Estación Espacial Internacional (ISS en cientos)?", answer: 4, note: "Aproximadamente 400 kilómetros de altitud en órbita terrestre baja" },
    { text: "¿Cuántos paneles solares gigantes componen la estructura de generación eléctrica de la ISS?", answer: 8, note: "Ocho alas solares articuladas que siguen continuamente la posición del Sol" },
    { text: "¿Cuántos astronautas pueden residir de forma simultánea y cómoda en la Estación Espacial Internacional de forma estándar?", answer: 7, note: "Pudiendo ampliarse temporalmente a más de diez durante los relevos de tripulación" },
    { text: "¿Cuántos estados de la materia exóticos se han creado en laboratorios de física cuántica (como el Condensado Bose-Einstein)?", answer: 1, note: "El condensado de Bose-Einstein alcanzado a temperaturas próximas al cero absoluto" },
    { text: "¿Cuántos protones tiene un átomo de plomo en su núcleo atómico (número atómico)?", answer: 82, note: "Elemento químico pesado no radiactivo con símbolo químico Pb" },
    { text: "¿Cuántos protones tiene el elemento químico platino en su núcleo atómico?", answer: 78, note: "Metal noble precioso y extremadamente resistente a la corrosión química" },
    { text: "¿Cuántos protones tiene el elemento plata en su núcleo atómico?", answer: 47, note: "El mejor conductor térmico y eléctrico de todos los elementos metálicos conocidos" },

    // --- HISTORIA MODERNA Y GRANDES HITOS ---
    { text: "¿En qué año se firmó el Tratado de Versalles que puso fin formalmente a la Primera Guerra Mundial?", answer: 1919, note: "El 28 de junio de 1919 en la emblemática Galería de los Espejos del palacio francés" },
    { text: "¿En qué año fue asesinado el presidente estadounidense Abraham Lincoln en el teatro Ford de Washington?", answer: 1865, note: "El 14 de abril de 1865 por el actor confederado John Wilkes Booth" },
    { text: "¿En qué año se fundó el cuerpo de la Policía Nacional española como Policía General del Reino?", answer: 1824, note: "Bajo la real cédula del rey Fernando VII el 8 de enero de 1824" },
    { text: "¿En qué año se abolió definitivamente el tribunal de la Inquisición en España?", answer: 1834, note: "Decretada por la reina regente María Cristina de Borbón" },
    { text: "¿En qué año tuvo lugar la célebre expedición de Stanley en busca del doctor Livingstone en África?", answer: 1871, note: "Con su mítica frase al encontrarlo: '¿El doctor Livingstone, supongo?'" },
    { text: "¿En qué año se inauguró el primer tramo de metro subterráneo de la historia en la ciudad de Madrid?", answer: 1919, note: "El 17 de octubre de 1919 por el rey Alfonso XIII entre Sol y Cuatro Caminos" },
    { text: "¿En qué año se inauguró la primera línea de metro de Barcelona (Gran Metro)?", answer: 1924, note: "El 30 de diciembre de 1924 entre Lesseps y plaza de Catalunya" },
    { text: "¿En qué año tuvo lugar el trágico incendio del dirigible alemán Hindenburg en Nueva Jersey?", answer: 1937, note: "El 6 de mayo de 1937 marcando el fin definitivo de la era de los dirigibles de pasajeros" },
    { text: "¿En qué año concluyó la batalla de Stalingrado con la rendición del VI Ejército alemán del mariscal Paulus?", answer: 1943, note: "El 2 de febrero de 1943, el gran punto de inflexión bélico de la Segunda Guerra Mundial" },
    { text: "¿En qué año se fundó la agencia espacial estadounidense NASA por el presidente Eisenhower?", answer: 1958, note: "En plena carrera espacial tras el lanzamiento soviético del Sputnik 1" },

    // --- CINE, SERIES Y TELEVISIÓN ---
    { text: "¿Cuántos premios Oscar ganó la película 'El Padrino' (1972) en la 45ª edición de los premios?", answer: 3, note: "Mejor Película, Mejor Actor (Marlon Brando) y Mejor Guion Adaptado" },
    { text: "¿Cuántos premios Oscar ganó 'El Padrino Parte II' (1974)?", answer: 6, note: "La primera secuela en la historia en alzarse con el Oscar a Mejor Película" },
    { text: "¿Cuántas películas cinematográficas oficiales ha dirigido James Cameron a lo largo de su carrera (hasta Avatar 2)?", answer: 8, note: "Terminator, Aliens, Abyss, Terminator 2, Mentiras arriesgadas, Titanic, Avatar y Avatar 2" },
    { text: "¿En qué año se estrenó la película fantástica 'Eduardo Manostijeras' de Tim Burton?", answer: 1990, note: "Protagonizada por Johnny Depp y Winona Ryder" },
    { text: "¿En qué año se estrenó la comedia 'La máscara' con Jim Carrey y Cameron Diaz?", answer: 1994, note: "Uno de los papeles más icónicos del histriónico actor canadiense" },
    { text: "¿En qué año se estrenó la comedia de espionaje 'Austin Powers: Misterioso agente internacional'?", answer: 1997, note: "Creada y protagonizada por el cómico Mike Myers" },
    { text: "¿En qué año se estrenó la película musical animada 'La Bella y la Bestia' de Disney?", answer: 1991, note: "La primera película animada de la historia nominada al Oscar a Mejor Película" },
    { text: "¿En qué año se estrenó la película de suspense y acción 'Speed' (Máxima potencia) con Keanu Reeves y Sandra Bullock?", answer: 1994, note: "Un autobús de pasajeros que no puede bajar de 50 mph sin explotar" },
    { text: "¿Cuántas temporadas completas duró la aclamada serie de comedia 'The Office' (versión estadounidense)?", answer: 9, note: "Protagonizada magistralmente por Steve Carell como Michael Scott" },
    { text: "¿Cuántos episodios componen la versión estadounidense de la serie 'The Office'?", answer: 201, note: "Emitidos por la cadena NBC entre 2005 y 2013" },
    { text: "¿Cuántos episodios tiene en total la serie española de comedia 'Siete Vidas'?", answer: 204, note: "La pionera de las sitcoms con público en directo en la televisión española" },
    { text: "¿Cuántas temporadas se emitieron de la serie juvenil española 'Física o Química'?", answer: 7, note: "Emitidas en Antena 3 con enorme repercusión entre 2008 y 2011" },

    // --- DEPORTES, OLIMPIADAS Y HAZAÑAS ---
    { text: "¿Cuántas millas náuticas recorren los veleros en la mítica regata oceánica Sydney-Hobart en Australia (en cientos)?", answer: 6, note: "Aproximadamente 630 millas náuticas a través del tempestuoso estrecho de Bass" },
    { text: "¿Cuántos días dura habitualmente la regata de la Vendée Globe dando la vuelta al mundo en solitario sin escalas?", answer: 80, note: "El récord lo ostenta Armel Le Cléac'h con 74 días de navegación oceánica extrema" },
    { text: "¿Cuántos tripulantes viajan a bordo de un velero en la regata oceánica Vendée Globe?", answer: 1, note: "Es una regata estrictamente en solitario, sin escalas y sin asistencia técnica exterior" },
    { text: "¿Cuántas millas náuticas mide la vuelta al mundo navegada en la regata Vendée Globe (en miles)?", answer: 24, note: "Más de 24.000 millas náuticas (unos 45.000 kilómetros de recorrido)" },
    { text: "¿Cuántos títulos de Liga de Primera División española tiene el Real Sporting de Gijón?", answer: 0, note: "Fue subcampeón de Liga en la histórica temporada 1978-79 con Quini" },
    { text: "¿Cuántos Pichichis de Primera División española ganó el legendario delantero Enrique Castro 'Quini'?", answer: 5, note: "3 con el Sporting de Gijón y 2 con el Fútbol Club Barcelona" },
    { text: "¿Cuántos trofeos Pichichi como máximo goleador de LaLiga ganó Alfredo Di Stéfano?", answer: 5, note: "Uno de los delanteros más dominantes de la historia con el Real Madrid" },
    { text: "¿Cuántos trofeos Pichichi conquistó el delantero mexicano Hugo Sánchez en la liga española?", answer: 5, note: "1 con el Atlético de Madrid y 4 consecutivos con el Real Madrid" },
    { text: "¿Cuántos trofeos Pichichi ganó el delantero Telmo Zarra con el Athletic Club de Bilbao?", answer: 6, note: "Récord histórico imbatido durante décadas hasta la llegada de Leo Messi" },
    { text: "¿Cuántos trofeos Pichichi como máximo goleador de LaLiga ha ganado Leo Messi (récord absoluto)?", answer: 8, note: "Superó los 6 galardones de Zarra con el Fútbol Club Barcelona" },
    { text: "¿Cuántos minutos dura reglamentariamente un partido de squash profesional estándar?", answer: 40, note: "Oscila entre 30 y 60 minutos de agotador esfuerzo cardiovascular continuo" },
    { text: "¿Cuántos puntos se necesitan para ganar un juego reglamentario en squash moderno?", answer: 11, note: "Con una ventaja mínima de dos puntos respecto al oponente" },

    // --- GEOGRAFÍA POLÍTICA Y MUNDO ---
    { text: "¿Cuántos países independientes componen el continente de América (Norte, Centro, Caribe y Sur)?", answer: 35, note: "Desde Canadá en el norte hasta Chile y Argentina en el extremo sur" },
    { text: "¿Cuántos países independientes componen la región del Caribe insular?", answer: 13, note: "Estados soberanos como Cuba, Jamaica, Bahamas, Barbados, etc." },
    { text: "¿Cuántas provincias componen la República de Panamá en Centroamérica?", answer: 10, note: "Más cuatro comarcas indígenas con estatus de provincia" },
    { text: "¿Cuántos departamentos componen el territorio nacional de la República de Guatemala?", answer: 22, note: "La nación más poblada del istmo centroamericano" },
    { text: "¿Cuántos departamentos componen administrativamente la República de Honduras?", answer: 18, note: "Conocida como la 'Tierra de los pinares'" },
    { text: "¿Cuántos departamentos componen administrativamente la República de Nicaragua?", answer: 15, note: "Más dos regiones autónomas en la costa caribeña" },
    { text: "¿Cuántas provincias componen la República de Costa Rica?", answer: 7, note: "San José, Alajuela, Cartago, Heredia, Guanacaste, Puntarenas y Limón" },
    { text: "¿Cuántos estados federales componen la República de Austria (Bundesländer)?", answer: 9, note: "Entre ellos la capital federal de Viena como ciudad-estado" },
    { text: "¿Cuántas regiones componen administrativamente el Reino de Bélgica?", answer: 3, note: "Flandes (neerlandófona), Valonia (francófona) y la Región de Bruselas-Capital" },
    { text: "¿Cuántas provincias componen administrativamente los Países Bajos (Holanda)?", answer: 12, note: "Holanda Septentrional y Meridional son solo dos de sus doce provincias" },

    // --- CURIOSIDADES, GASTRONOMÍA Y OBJETOS ---
    { text: "¿Cuántos clavos metálicos de fijación aproximados tiene una herradura clásica de caballo en cada casco?", answer: 6, note: "Entre 6 y 8 clavos colocados cuidadosamente en la pared córnea insensible" },
    { text: "¿Cuántos radios de alambre cruzados suele tener la rueda de una bicicleta de paseo estándar?", answer: 36, note: "Diseño clásico de 36 radios que garantiza máxima resistencia a la carga" },
    { text: "¿Cuántos dientes tiene un tenedor de mesa tradicional para carne o plato principal?", answer: 4, note: "El tenedor clásico de cuatro púas estandarizado en el siglo XVIII" },
    { text: "¿Cuántos dientes suele tener un tenedor especial para marisco u ostras?", answer: 3, note: "Diseñado con tres púas cortas y una pala curvada para desprender el molusco" },
    { text: "¿Cuántos dientes tiene un tenedor tradicional de postre o tarta?", answer: 3, note: "Con la púa lateral más ancha y biselada para cortar bizcochos" },
    { text: "¿Cuántas patas tiene una silla de montar clásica de equitación?", answer: 0, note: "Las sillas de montar no tienen patas; se ajustan sobre el lomo del caballo con una cincha" },
    { text: "¿Cuántas cuerdas de tripa o nailon componen el cordaje de una raqueta de tenis profesional (en decenas)?", answer: 30, note: "Aproximadamente 34 a 38 cuerdas cruzadas entre verticales y horizontales" },
    { text: "¿Cuántas caras planas exteriores tiene un prisma triangular regular geométrico?", answer: 5, note: "Dos bases triangulares y tres caras laterales rectangulares" },
    { text: "¿Cuántas aristas rectas tiene una caja o paralelepípedo rectangular tradicional?", answer: 12, note: "Cuatro en la base inferior, cuatro en la superior y cuatro verticales" },
    { text: "¿Cuántos vértices o esquinas tiene un cubo geométrico regular perfecto?", answer: 8, note: "Ocho esquinas donde confluyen tres aristas en ángulo recto" },
    // --- MEGATANDA 12: FOLKLORE ESPAÑOL, FIESTAS Y TRADICIONES POPULARES ---
    { text: "¿Cuántos metros de longitud tiene el recorrido oficial del encierro de toros de San Fermín en Pamplona?", answer: 875, note: "Desde los corrales de Santo Domingo hasta la entrada al ruedo de la plaza de toros" },
    { text: "¿Cuántos minutos suele durar de media un encierro limpio de San Fermín en Pamplona?", answer: 2, note: "Habitualmente entre 2 minutos y 15 segundos y 2 minutos y medio" },
    { text: "¿Cuántos días dura la celebración de las fiestas de San Fermín en Pamplona (del 6 al 14 de julio)?", answer: 9, note: "Iniciadas con el tradicional Chupinazo el día 6 y cerradas con el 'Pobre de mí' el 14" },
    { text: "¿Cuántas toneladas de tomates se lanzan aproximadamente en la fiesta de 'La Tomatina' de Buñol (Valencia)?", answer: 150, note: "Más de 150.000 kilos de tomates maduros repartidos en seis camiones" },
    { text: "¿Cuántos días dura oficialmente la Feria de Abril de Sevilla?", answer: 7, note: "Desde el 'Alumbrao' de la portada hasta los fuegos artificiales del domingo de cierre" },
    { text: "¿Cuántas casetas se instalan aproximadamente en el Real de la Feria de Abril de Sevilla (en miles)?", answer: 1, note: "Más de 1.050 casetas alineadas en las calles del barrio de Los Remedios" },
    { text: "¿Cuántos costaleros suelen llevar sobre sus hombros un paso grande de palio en la Semana Santa de Sevilla?", answer: 35, note: "Oscila entre 30 y 45 costaleros según el tamaño y peso de las andas" },
    { text: "¿Cuántos 'palos' o estilos básicos del flamenco tradicional existen catalogados (en decenas)?", answer: 50, note: "Soleares, alegrías, bulerías, fandangos, seguiriyas, sevillanas, tangos..." },
    { text: "¿Cuántas coplas componen el baile tradicional de unas Sevillanas completas?", answer: 4, note: "Primera, segunda, tercera y cuarta copla, con sus correspondientes careos y vueltas" },
    { text: "¿Cuántos tiempos o pulsos tiene el compás rítmico tradicional de la bulería flamenca?", answer: 12, note: "El mítico compás de doce tiempos con acentuación en el 3, 6, 8, 10 y 12" },
    { text: "¿Cuántas cuerdas dobles tiene una bandurria tradicional española?", answer: 12, note: "Seis órdenes de cuerdas metálicas dobles tocadas con púa" },
    { text: "¿Cuántas cuerdas dobles tiene un laúd español de música tradicional y tuna?", answer: 12, note: "Afinado una octava más grave que la bandurria para acompañar rondallas" },
    { text: "¿Cuántas castañuelas componen un juego tradicional de toque flamenco o folclórico?", answer: 2, note: "La 'hembra' (aguda en mano derecha) y el 'macho' (grave en mano izquierda)" },
    { text: "¿Cuántos orificios de digitación tiene la flauta de tres agujeros del tamborilero tradicional andaluz o charro?", answer: 3, note: "Dos frontales y uno posterior tocada con una sola mano mientras la otra toca el tamboril" },
    { text: "¿Cuántos 'castellers' pueden llegar a componer la base o 'pinya' de un 'castell' humano en Cataluña (en cientos)?", answer: 3, note: "Entre 200 y 400 personas en la base soportando el peso de los pisos superiores" },
    { text: "¿Cuántos pisos de altura llega a alcanzar un 'castell' de máxima categoría (castells de 10)?", answer: 10, note: "Una colosal proeza humana y de equilibrio declarada Patrimonio de la Humanidad" },
    { text: "¿Cuántos días dura la fiesta de las Fallas de Valencia en su semana grande (del 15 al 19 de marzo)?", answer: 5, note: "Desde la tradicional 'Plantà' hasta la mágica 'Cremà' de la noche de San José" },
    { text: "¿Cuántos monumentos falleros (entre grandes e infantiles) se plantan en la ciudad de Valencia (en cientos)?", answer: 7, note: "Cerca de 750 fallas levantadas por toda la ciudad" },
    { text: "¿Cuántos cañones de pólvora o masclets detona una 'Mascletà' típica en la Plaza del Ayuntamiento de Valencia (en kilos)?", answer: 120, note: "Alrededor de 120 a 150 kilos de materia pirotécnica detonados en apenas 6 minutos" },
    { text: "¿Cuántos kilómetros recorre la romería del Rocío a pie o a caballo desde Almonte hasta la aldea?", answer: 15, note: "La distancia directa desde el pueblo de Almonte hasta el santuario de la Blanca Paloma" },
    { text: "¿Cuántos metros mide aproximadamente el pañuelo rojo tradicional de cuello en las fiestas de San Fermín?", answer: 1, note: "Un metro de tela triangular roja atada con nudo simple" },
    { text: "¿Cuántas campanas tiene la torre de la Giralda de Sevilla en su cuerpo de campanas?", answer: 24, note: "Es la catedral con mayor número de campanas de toda España" },
    { text: "¿Cuántos siglos estuvo en pie la antigua ermita del Rocío antes de ser reconstruida en su santuario actual?", answer: 4, note: "Originaria del siglo XIII bajo Alfonso X el Sabio y reformada tras el terremoto de Lisboa" },
    { text: "¿Cuántos metros de altura tiene la famosa estatua del 'Gigantón' o 'Tirurí' en las comparsas tradicionales?", answer: 4, note: "Los gigantes de cartón piedra portados sobre los hombros por los portadores" },
    { text: "¿Cuántas copas de rebujito suele dar una botella estándar de manzanilla con refresco de lima (en docenas)?", answer: 1, note: "Aproximadamente 10 a 12 vasos bien provistos de hielo y hierbabuena" },

    // --- PORCENTAJES (%) BRUTALES: CIENCIA, SOCIEDAD Y SALUD ---
    { text: "¿Qué porcentaje del peso de una sandía se reduce si se exprime únicamente su zumo líquido?", answer: 92, note: "Casi toda la fruta es agua filtrada naturalmente con vitaminas" },
    { text: "¿Qué porcentaje de las parejas españolas que conviven juntas no han contraído matrimonio?", answer: 20, note: "Uno de cada cinco hogares en pareja en España opta por la unión de hecho" },
    { text: "¿Qué porcentaje del peso de un copo de nieve recién posado en el suelo es simplemente aire?", answer: 90, note: "Esa enorme bolsa de aire atrapado es lo que lo convierte en un magnífico aislante térmico" },
    { text: "¿Qué porcentaje de la producción mundial de aceitunas de mesa se cosecha en los países del Mediterráneo?", answer: 95, note: "Liderada ampliamente por los olivares de España, Grecia, Turquía e Italia" },
    { text: "¿Qué porcentaje de los incendios domésticos con víctimas mortales se producen durante la noche?", answer: 70, note: "El humo denso asfixia a los moradores mientras están en fase de sueño profundo" },
    { text: "¿Qué porcentaje de los días del año son soleados en la ciudad de Málaga (Costa del Sol)?", answer: 80, note: "Disfruta de más de 300 días de sol al año, de ahí su reclamo turístico mundial" },
    { text: "¿Qué porcentaje del peso de un grano de maíz seco es almidón?", answer: 70, note: "La gran fuente de energía hidrocarbonada para piensos y alimentación humana" },
    { text: "¿Qué porcentaje de la población mundial reside en el hemisferio sur de la Tierra?", answer: 13, note: "Apenas un 13%, ya que la inmensa mayoría de las masas de tierra emergidas están al norte" },
    { text: "¿Qué porcentaje de los diamantes utilizados en el mundo provienen de minas a cielo abierto?", answer: 70, note: "Gigantescos cráteres artificiales como la mina de Kimberley o la de Mirny" },
    { text: "¿Qué porcentaje del café servido en bares y cafeterías en España es café con leche?", answer: 70, note: "El clásico desayuno español preferido frente al café solo o cortado" },
    { text: "¿Qué porcentaje de los adultos reconocen que guardan cargadores de cables antiguos que ya no usan?", answer: 85, note: "El clásico cajón doméstico de cables y adaptadores tecnológicos obsoletos" },
    { text: "¿Qué porcentaje de los perros domésticos duermen dentro de la casa en los países occidentales?", answer: 80, note: "Cuatro de cada cinco perros conviven plenamente en el interior del hogar familiar" },
    { text: "¿Qué porcentaje de las calorías de la cerveza sin alcohol proceden de los hidratos de carbono residuales?", answer: 95, note: "Al no tener alcohol, prácticamente todas sus calorías son azúcares de la malta" },
    { text: "¿Qué porcentaje del territorio de la Comunidad de Madrid está ocupado por espacios naturales protegidos?", answer: 40, note: "Encabezado por el Parque Nacional de la Sierra de Guadarrama" },
    { text: "¿Qué porcentaje de la sal marina de consumo humano contiene microplásticos a nivel mundial?", answer: 90, note: "Reflejo de la dispersión de microfibras plásticas en todos los mares del planeta" },
    { text: "¿Qué porcentaje de los vuelos comerciales cancelados se deben a causas meteorológicas adversas?", answer: 75, note: "Nieblas densas, tormentas con rayos, nieve o vientos cruzados extremos" },
    { text: "¿Qué porcentaje del peso de un mejillón cocido con concha corresponde al molusco comestible?", answer: 25, note: "Tres cuartas partes del peso que compramos en la pescadería son las valvas de roca" },
    { text: "¿Qué porcentaje de las compras de Lotería de Navidad en España se realizan en verano durante las vacaciones?", answer: 15, note: "El clásico décimo que se compra de recuerdo en el pueblo o la playa de veraneo" },
    { text: "¿Qué porcentaje de las personas con daltonismo son hombres?", answer: 95, note: "Al ser un gen recesivo ligado al cromosoma X, afecta muchísimo más a varones" },
    { text: "¿Qué porcentaje de la masa de un iceberg emerge visible sobre la superficie del agua?", answer: 10, note: "El célebre 'principio del iceberg': el 90% del bloque de hielo queda oculto bajo el mar" },

    // --- HISTORIA MODERNA Y GRANDES MOMENTOS ---
    { text: "¿En qué año se fundó la Fábrica Nacional de Moneda y Timbre (FNMT) de España en su sede actual?", answer: 1893, note: "Nacida de la fusión de la Casa de la Moneda y la Fábrica del Sello" },
    { text: "¿En qué año se inauguró el monumento de la Sagrada Familia de Gaudí en su primera piedra?", answer: 1882, note: "El 19 de marzo de 1882 bajo el proyecto inicial del arquitecto Francisco de Paula del Villar" },
    { text: "¿En qué año tomó las riendas Antoni Gaudí de las obras de la Sagrada Familia?", answer: 1883, note: "Rediseñando por completo el templo hacia su emblemático estilo modernista" },
    { text: "¿En qué año falleció el genial arquitecto Antoni Gaudí tras ser atropellado por un tranvía en Barcelona?", answer: 1926, note: "El 10 de junio de 1926 a los 73 años de edad" },
    { text: "¿En qué año se inauguró el famoso Parque Güell de Barcelona como parque público?", answer: 1926, note: "Proyectado originalmente como una urbanización residencial de lujo para la burguesía" },
    { text: "¿En qué año se proclamó la Carta de las Naciones Unidas en San Francisco?", answer: 1945, note: "Firmada el 26 de junio de 1945 por representantes de 50 naciones aliadas" },
    { text: "¿En qué año se produjo la trágica crisis de los rehenes en los Juegos Olímpicos de Múnich?", answer: 1972, note: "Asalto del grupo terrorista palestino Septiembre Negro contra el equipo olímpico israelí" },
    { text: "¿En qué año se inauguró el Museo del Louvre en París como museo público nacional?", answer: 1793, note: "Durante la Revolución Francesa, abriendo las colecciones de la corona al pueblo" },
    { text: "¿En qué año fue robado el cuadro de 'La Gioconda' (Mona Lisa) del Museo del Louvre por Vincenzo Peruggia?", answer: 1911, note: "Recuperada dos años más tarde en Florencia tras una búsqueda policial mundial" },
    { text: "¿En qué año se inauguró el actual Estadio Santiago Bernabéu del Real Madrid (originalmente Nuevo Chamartín)?", answer: 1947, note: "El 14 de diciembre de 1947 frente al club portugués Os Belenenses" },

    // --- CINE, TELEVISIÓN Y CULTURA POP ---
    { text: "¿Cuántos premios Goya ganó la película de terror 'Los otros' de Alejandro Amenábar en 2002?", answer: 8, note: "Protagonizada por Nicole Kidman y rodada en inglés íntegramente" },
    { text: "¿En qué año se estrenó la película fantástica 'El laberinto del fauno' de Guillermo del Toro?", answer: 2006, note: "Ganadora de 3 premios Oscar y 7 premios Goya" },
    { text: "¿En qué año se estrenó la taquillera comedia española 'Ocho apellidos vascos'?", answer: 2014, note: "La película más vista y taquillera de la historia del cine español con más de 9 millones de espectadores" },
    { text: "¿En qué año se estrenó 'Torrente, el brazo tonto de la ley' dirigida y protagonizada por Santiago Segura?", answer: 1998, note: "Fenómeno absoluto de taquilla que dio pie a la saga cómica más longeva de España" },
    { text: "¿Cuántas películas cinematográficas oficiales componen la saga de 'Torrente' (hasta 2024)?", answer: 5, note: "Torrente 1, 2 (Misión en Marbella), 3 (El protector), 4 (Lethal Crisis) y 5 (Operación Eurovegas)" },
    { text: "¿Cuántos premios Goya ganó el actor y cómico Santiago Segura por la primera película de 'Torrente'?", answer: 2, note: "Mejor Director Novel y Mejor Actor de Reparto para Tony Leblanc" },
    { text: "¿Cuántos premios Oscar ganó la película 'Gladiator' de Ridley Scott en la gala del año 2001?", answer: 5, note: "Incluyendo Mejor Película y Mejor Actor para Russell Crowe" },
    { text: "¿En qué año se estrenó la película bélica 'Braveheart' dirigida y protagonizada por Mel Gibson?", answer: 1995, note: "Ganó 5 premios Oscar incluyendo Mejor Película y Mejor Director" },
    { text: "¿Cuántos minutos dura la versión cinematográfica original de la película 'Braveheart'?", answer: 178, note: "Casi tres horas completas de épica medieval escocesa" },
    { text: "¿Cuántas temporadas duró en emisión la mítica serie española de acción 'Águila Roja'?", answer: 9, note: "Protagonizada por David Janer entre 2009 y 2016 en Televisión Española" },

    // --- DEPORTES Y HAZAÑAS ---
    { text: "¿Cuántas medallas olímpicas de oro ganó el atleta español Fermín Cacho en los 1.500 metros lisos?", answer: 1, note: "El inolvidable triunfo en el estadio de Montjuïc durante Barcelona 92" },
    { text: "¿Cuántas medallas olímpicas de oro en salto con pértiga ganó el legendario saltador ucraniano Sergey Bubka?", answer: 1, note: "Oro olímpico en Seúl 1988, además de batir 35 veces el récord mundial" },
    { text: "¿Cuántos metros de altura superó el saltador sueco Armand Duplantis para batir el récord mundial de pértiga (redondeado)?", answer: 6, note: "Superó los 6,25 metros de altura en los Juegos Olímpicos de París 2024" },
    { text: "¿Cuántos metros de longitud mide la cuerda de salto en una pista de atletismo en el salto de longitud reglamentario (en metros)?", answer: 9, note: "El foso de arena mide 9 metros de largo por casi 3 de ancho" },
    { text: "¿Cuántos metros superó el atleta estadounidense Bob Beamon con su 'salto del siglo' en México 1968?", answer: 8, note: "Saltó 8,90 metros pulverizando el récord mundial por 55 centímetros" },
    { text: "¿Cuántos títulos de Liga de Primera División española tiene en sus vitrinas el Real Club Deportivo Espanyol?", answer: 0, note: "Pese a no haber ganado la Liga, el club perico posee 4 títulos de Copa del Rey" },
    { text: "¿Cuántas Copas del Rey de fútbol ha conquistado el RCD Espanyol en su historia centenaria?", answer: 4, note: "Conquistadas en 1929, 1940, 2000 y 2006" },
    { text: "¿Cuántos campeonatos del mundo de ajedrez indiscutidos ganó el ruso Garry Kasparov?", answer: 6, note: "El campeón mundial más joven de la historia y dominador durante dos décadas" },
    { text: "¿Cuántos peones tiene cada jugador en el tablero de ajedrez al comenzar la partida?", answer: 8, note: "Formando la primera línea defensiva en la segunda fila" },
    { text: "¿Cuántos caballos tiene cada jugador en el tablero de ajedrez al inicio?", answer: 2, note: "Las únicas piezas capaces de saltar por encima de otras piezas en forma de 'L'" },

    // --- GEOGRAFÍA POLÍTICA Y CIUDADES ---
    { text: "¿Cuántos estados federales componen la República Federativa de Nigeria en África?", answer: 36, note: "El país más poblado de todo el continente africano" },
    { text: "¿Cuántas provincias componen la República de Sudáfrica tras la reforma democrática de 1994?", answer: 9, note: "Gauteng, Cabo Occidental, KwaZulu-Natal, etc." },
    { text: "¿Cuántos distritos componen administrativamente el Gran Londres (Boroughs)?", answer: 32, note: "Más la histórica City of London como corporación autónoma independiente" },
    { text: "¿Cuántos distritos municipales componen la ciudad de Valencia?", answer: 19, note: "Ciutat Vella, Eixample, Extramurs, El Pla del Real, etc." },
    { text: "¿Cuántos distritos componen el municipio de Sevilla?", answer: 11, note: "Casco Antiguo, Triana, Macarena, Nervión, Los Remedios, etc." },
    { text: "¿Cuántas provincias componen la comunidad autónoma de Castilla y León?", answer: 9, note: "La comunidad con más provincias de toda España" },
    { text: "¿Cuántos municipios tiene la provincia de Valladolid?", answer: 225, note: "Una de las provincias con mayor densidad de pequeños municipios rurales" },
    { text: "¿Cuántos municipios componen la provincia de Burgos?", answer: 371, note: "La provincia con mayor número de municipios independientes de toda España" },
    { text: "¿Cuántos puentes históricos cruzan el río Duero dentro del término municipal de Zamora?", answer: 5, note: "Encabezados por el emblemático Puente de Piedra de origen medieval" },
    { text: "¿Cuántos puentes cruzan el río Tajo a su paso por el casco histórico monumental de Toledo?", answer: 2, note: "El Puente de Alcántara (de origen romano) y el Puente de San Martín (medieval)" },

    // --- CURIOSIDADES COTIDIANAS Y DATOS DIVERTIDOS ---
    { text: "¿Cuántos dientes tiene una rueda dentada de una cadena de bicicleta estándar en su plato grande común?", answer: 50, note: "Oscila entre 50 y 53 dientes en platos para bicicletas de carretera" },
    { text: "¿Cuántos dientes suele tener el piñón más pequeño de la rueda trasera de una bicicleta deportiva moderna?", answer: 11, note: "El engranaje que proporciona el desarrollo más largo y veloz" },
    { text: "¿Cuántas cuerdas tiene un charango andino tradicional de madera?", answer: 10, note: "Cinco pares de cuerdas dobles tradicionalmente fabricado con caparazón de armadillo" },
    { text: "¿Cuántas cuerdas dobles tiene un timple canario tradicional?", answer: 5, note: "El instrumento de cuerda pulsada más representativo de las Islas Canarias" },
    { text: "¿Cuántos palos tiene una baraja de cartas tradicional?", answer: 4, note: "Tanto en la baraja española (Oros, Copas, Espadas, Bastos) como en la de póker" },
    { text: "¿Cuántos reyes hay en una baraja de cartas completa de cualquier tipo?", answer: 4, note: "Un rey por cada uno de los cuatro palos" },
    { text: "¿Cuántos caballos (figuras) hay en una baraja española tradicional de 40 cartas?", answer: 4, note: "La figura intermedia entre la sota y el rey" },
    { text: "¿Cuántas sotas hay en una baraja española de cartas?", answer: 4, note: "Asociada al número 10 en el cómputo de la baraja española" },
    { text: "¿Cuántas cartas boca arriba forman la pirámide de juego en el clásico solitario 'TriPeaks' de ordenador?", answer: 28, note: "Tres pirámides entrelazadas de naipes para ir despejando la mesa" },
    { text: "¿Cuántos lados tiene un hexágono regular en el diseño de las celdillas de los panales de miel de abeja?", answer: 6, note: "La forma geométrica que aprovecha el máximo espacio con el mínimo gasto de cera" },
    // --- MEGATANDA 13: FOLKLORE ESPAÑOL, FIESTAS Y COSTUMBRES ---
    { text: "¿Cuántos componentes tiene como máximo una comparsa oficial en el Concurso del Carnaval de Cádiz (COAC)?", answer: 15, note: "Quince componentes sobre las tablas del Gran Teatro Falla acompañados de guitarras y bombo" },
    { text: "¿Cuántos componentes tiene como máximo una chirigota oficial en el Carnaval de Cádiz?", answer: 12, note: "Doce miembros en escena desplegando humor, crítica y pasodobles" },
    { text: "¿Cuántos componentes puede tener un coro en el Carnaval de Cádiz sobre las tablas del Falla (hasta un máximo)?", answer: 45, note: "Hasta 35 cantantes más 10 músicos en la orquesta de pulso y púa" },
    { text: "¿Cuántos componentes componen un cuarteto tradicional en el Carnaval de Cádiz?", answer: 5, note: "Entre 3 y 5 componentes que basan su repertorio en parodias y cuplés" },
    { text: "¿Cuántos días dura oficialmente el Concurso Oficial de Agrupaciones del Carnaval de Cádiz (COAC en semanas)?", answer: 1, note: "Dura aproximadamente un mes entero de fases eliminatorias hasta la Gran Final" },
    { text: "¿Cuántos kilos de flores componen aproximadamente el manto de la Virgen del Pilar en Zaragoza en su Ofrenda?", answer: 7000, note: "Miles de toneladas de claveles depositados por cientos de miles de oferentes el 12 de octubre" },
    { text: "¿Cuántas horas ininterrumpidas suele durar la Ofrenda de Flores a la Virgen del Pilar de Zaragoza?", answer: 16, note: "Desde primera hora de la mañana hasta bien entrada la noche desfilando trajes regionales" },
    { text: "¿Cuántos días duran las tradicionales Fiestas de Moros y Cristianos de Alcoy en Alicante?", answer: 3, note: "El Día de las Entradas, el Día de San Jorge y el Día del Alardo con sus trabucadas" },
    { text: "¿Cuántos kilos de pólvora negra se disparan aproximadamente en las trabucadas de Moros y Cristianos de Alcoy (en miles)?", answer: 3, note: "Más de 3.000 kilos de pólvora quemados en los arcabuces por las calles" },
    { text: "¿Cuántos 'culines' o 'cules' de sidra tradicional se suelen sacar de una botella estándar asturiana de 70cl?", answer: 6, note: "Aproximadamente 6 culines escanciados desde lo alto para oxigenar la bebida" },
    { text: "¿A cuántos centímetros de altura sobre el vaso suele colocarse la botella al escanciar la sidra asturiana?", answer: 50, note: "Medio metro de caída libre para que la sidra 'rompa' contra el borde del vaso ancho" },
    { text: "¿Cuántas horas antes de la 'Madrugá' de Sevilla empiezan a congregarse los devotos ante la Esperanza Macarena?", answer: 12, note: "Colas multitudinarias que aguardan toda la tarde del Jueves Santo para verla salir" },
    { text: "¿Cuántos pasos saca la Hermandad del Gran Poder en su estación de penitencia en Sevilla?", answer: 2, note: "El Señor de Sevilla con la cruz al hombro y el paso de palio de la Virgen del Mayor Dolor" },
    { text: "¿Cuántas velas o candelabros de cera componen la candelería frontal de un paso de palio andaluz (en decenas)?", answer: 80, note: "Entre 70 y 90 cirios encendidos que iluminan el rostro de la Virgen en la noche" },
    { text: "¿Cuántos kilómetros tiene el Camino Francés tradicional a Santiago de Compostela desde Roncesvalles (en cientos)?", answer: 8, note: "Aproximadamente 780 kilómetros divididos habitualmente en unas 30 etapas a pie" },
    { text: "¿Cuántos kilómetros mínimos a pie exige la Oficina del Peregrino para otorgar la 'Compostela'?", answer: 100, note: "Distancia mínima a pie (normalmente saliendo desde Sarria) o 200 km en bicicleta" },
    { text: "¿Cuántos kilómetros mínimos en bicicleta se exigen para recibir la Compostela oficial de peregrino?", answer: 200, note: "Los bicigrinos deben sellar su credencial el doble de distancia que los caminantes" },
    { text: "¿Cuántos kilos de peso tiene el célebre 'Botafumeiro' de la Catedral de Santiago de Compostela?", answer: 53, note: "El gigantesco incensario de latón bañado en plata accionado por ocho 'tiraboleiros'" },
    { text: "¿A cuántos kilómetros por hora de velocidad puede llegar a balancearse el Botafumeiro en la nave de la catedral?", answer: 68, note: "Alcanza casi 70 km/h rozando las bóvedas góticas del crucero" },
    { text: "¿Cuántos hombres o 'tiraboleiros' se necesitan para tirar de las cuerdas y mover el Botafumeiro de Santiago?", answer: 8, note: "Ocho hombres coordinados tirando rítmicamente de los cabos de cáñamo" },
    { text: "¿En qué noche de junio se celebran las tradicionales hogueras de San Juan en las playas de España?", answer: 23, note: "La mágica noche del 23 al 24 de junio para celebrar el solsticio de verano" },
    { text: "¿Cuántas veces manda la tradición popular saltar sobre la hoguera de San Juan para purificarse?", answer: 7, note: "Siete o nueve saltos según la tradición local andaluza, gallega o alicantina" },
    { text: "¿Cuántos pimientos de Padrón suelen picar de media en una ración tradicional de unos 20 pimientos?", answer: 2, note: "'Os pementos de Padrón, uns pican e outros non': apenas dos o tres por ración" },
    { text: "¿Cuántas patas enteras tiene un pulpo servido al estilo 'á feira' o a la gallega sobre plato de madera?", answer: 8, note: "Cortadas a tijera en rodajas, sazonadas con sal gorda, pimentón y aceite de oliva" },
    { text: "¿Cuántos días dura la feria gastronómica del marisco de O Grove en Pontevedra?", answer: 10, note: "Diez días en octubre degustando centollas, nécoras, percebes y mejillones" },

    // --- PORCENTAJES (%) IMPACTANTES: PLANETA, CIENCIA Y CONSUMO ---
    { text: "¿Qué porcentaje del peso corporal de un pulpo es agua marina en sus tejidos?", answer: 85, note: "Carecen de esqueleto rígido interno o externo, siendo puro músculo hídrico" },
    { text: "¿Qué porcentaje de las parejas españolas conviven juntas antes de dar el paso de casarse?", answer: 85, note: "La inmensa mayoría opta por la cohabitación previa como paso natural" },
    { text: "¿Qué porcentaje de los diamantes en bruto de Sudáfrica proceden de chimeneas volcánicas de kimberlita?", answer: 90, note: "Las antiguas chimeneas magmáticas que transportaron los diamantes desde el manto" },
    { text: "¿Qué porcentaje del aceite consumido en los hogares españoles es aceite de oliva (virgen o suave)?", answer: 65, note: "Frente al 35% de aceite de girasol empleado sobre todo para frituras intensas" },
    { text: "¿Qué porcentaje de la superficie de Groenlandia está compuesta por glaciares que llegan directamente al mar?", answer: 50, note: "Desprendiendo icebergs que flotan hacia el Atlántico Norte" },
    { text: "¿Qué porcentaje de las calorías del plátano maduro proceden de sus azúcares naturales (fructosa y glucosa)?", answer: 90, note: "El almidón inicial de la fruta verde se convierte casi en su totalidad en azúcares al madurar" },
    { text: "¿Qué porcentaje de los hogares españoles tienen al menos un televisor encendido a la hora de comer?", answer: 70, note: "La televisión en el salón sigue siendo el acompañante diario del almuerzo familiar" },
    { text: "¿Qué porcentaje del territorio de Japón está despoblado de forma permanente por la abrupta orografía?", answer: 60, note: "Montañas escarpadas y volcanes que impiden el asentamiento humano regular" },
    { text: "¿Qué porcentaje de las aves carroñeras de Europa (buitres leonados, negros y alimoches) viven en España?", answer: 90, note: "España es el auténtico santuario y reservorio continental de buitres salvajes" },
    { text: "¿Qué porcentaje de los ataques al corazón se registran en los meses fríos de invierno frente al verano?", answer: 60, note: "El frío estrecha los vasos sanguíneos y eleva la presión arterial sistólica" },
    { text: "¿Qué porcentaje de las personas recuerdan con total nitidez qué hacían el día de los atentados del 11-S de 2001?", answer: 95, note: "Uno de los recuerdos 'flashbulb' más universales y grabados de la historia moderna" },
    { text: "¿Qué porcentaje del volumen de un trozo de pan de hogaza con buena miga es aire retenido en alveolos?", answer: 70, note: "El dióxido de carbono generado por la masa madre y levaduras crea esa esponjosidad" },
    { text: "¿Qué porcentaje de los árboles de hoja caduca pierden todas sus hojas antes de la llegada del invierno?", answer: 100, note: "Mecanismo biológico de supervivencia para evitar congelarse o deshidratarse" },
    { text: "¿Qué porcentaje de la energía producida por una central nuclear comercial se desperdicia en forma de calor residual?", answer: 65, note: "Expulsado a través de las grandes torres de refrigeración o a los ríos adyacentes" },
    { text: "¿Qué porcentaje de los residuos que flotan en las playas de todo el mundo están compuestos por plástico?", answer: 85, note: "Botellas, tapones, bolsas, pajitas y redes de pesca degradadas" },
    { text: "¿Qué porcentaje de la población activa española tiene estudios universitarios o de formación superior?", answer: 45, note: "Casi la mitad de la fuerza laboral cuenta con titulación técnica o universitaria" },
    { text: "¿Qué porcentaje de los internautas españoles usan Bizum como método preferido de pago entre particulares?", answer: 80, note: "La aplicación bancaria española se convirtió en un estándar social absoluto" },
    { text: "¿Qué porcentaje de las personas con fobia a las arañas (aracnofobia) son mujeres?", answer: 70, note: "Mucho más frecuente estadísticamente en el género femenino" },
    { text: "¿Qué porcentaje de la biomasa total de todos los mamíferos terrestres del planeta son humanos y ganado?", answer: 96, note: "Los mamíferos salvajes apenas representan un ínfimo 4% de la masa viva del planeta" },
    { text: "¿Qué porcentaje del peso de una aceituna de mesa ya curada en salmuera es agua?", answer: 70, note: "El proceso de salmuera conserva su humedad natural rebajando su amargor" },

    // --- HISTORIA, CIENCIA Y ESPACIO ---
    { text: "¿En qué año se fundó el cuerpo de Bomberos del Ayuntamiento de Madrid?", answer: 1577, note: "Bajo el mandato de Felipe II como cuerpo de carpinteros y albañiles contra el fuego" },
    { text: "¿En qué año se inauguró el colosal Palacio Real de Madrid por el rey Carlos III?", answer: 1764, note: "Construido en piedra y ladrillo sobre el solar del antiguo Alcázar quemado en 1734" },
    { text: "¿En qué año se produjo el pavoroso incendio del Real Alcázar de Madrid en Nochebuena?", answer: 1734, note: "Destruyó cientos de obras maestras pictóricas de Velázquez, Tiziano y Rubens" },
    { text: "¿En qué año se inauguró el primer alumbrado eléctrico en una vía pública de España (en Barcelona)?", answer: 1881, note: "En la Rambla de Barcelona, asombrando a los viandantes con lámparas de arco" },
    { text: "¿En qué año se celebró el histórico 'Juicio de Núremberg' contra los máximos jerarcas nazis?", answer: 1945, note: "Iniciado el 20 de noviembre de 1945 por el Tribunal Militar Internacional" },
    { text: "¿En qué año se proclamó la actual Constitución de la República Francesa (Quinta República)?", answer: 1958, note: "Impulsada por el general Charles de Gaulle con un fuerte poder presidencial" },
    { text: "¿En qué año ingresó España oficialmente en la Organización de las Naciones Unidas (ONU)?", answer: 1955, note: "El 14 de diciembre de 1955, rompiendo el aislamiento internacional de posguerra" },
    { text: "¿En qué año se firmó el Tratado de No Proliferación Nuclear (TNP)?", answer: 1968, note: "Para evitar la propagación de armas atómicas y fomentar la energía nuclear pacífica" },
    { text: "¿En qué año aterrizó en Marte la histórica sonda 'Viking 1' de la NASA enviando las primeras fotos en color?", answer: 1976, note: "El 20 de julio de 1976 en la llanura de Chryse Planitia" },
    { text: "¿En qué año se lanzó al espacio el transbordador espacial 'Enterprise', el primero construido?", answer: 1977, note: "Bautizado así por la nave de Star Trek tras una masiva campaña de cartas a la NASA" },

    // --- CINE, TELEVISIÓN Y CULTURA POP ---
    { text: "¿En qué año se estrenó en cines la icónica comedia española 'Atraco a las tres' de José María Forqué?", answer: 1962, note: "Protagonizada por José Luis López Vázquez y Gracita Morales: 'Fernando Galindo, un admirador, un amigo, un siervo'" },
    { text: "¿En qué año se estrenó 'El verdugo', la aclamada obra maestra del cine español dirigida por Luis García Berlanga?", answer: 1963, note: "Genial sátira con Nino Manfredi y José Isbert galardonada en el Festival de Venecia" },
    { text: "¿En qué año se estrenó la película cómica 'Bienvenido, Mister Marshall' de Berlanga?", answer: 1953, note: "Con Pepe Isbert asomado al balcón: 'Como alcalde vuestro que soy, os debo una explicación'" },
    { text: "¿En qué año se estrenó 'La gran familia' con el entrañable abuelo buscando a Chencho en la Plaza Mayor de Madrid?", answer: 1962, note: "Un clásico navideño ineludible de la televisión española de varias generaciones" },
    { text: "¿Cuántos hijos componían la prole de la película 'La gran familia' (1962)?", answer: 15, note: "Quince hijos criados con ingenio y humor por Alberto Closas y Amparo Soler Leal" },
    { text: "¿Cuántos premios Goya ganó la película 'La isla mínima' de Alberto Rodríguez en 2015?", answer: 10, note: "De un total de 17 nominaciones, rodada en los arrozales de las marismas del Guadalquivir" },
    { text: "¿En qué año se estrenó la película musical 'Grease' protagonizada por John Travolta y Olivia Newton-John?", answer: 1978, note: "La película musical más taquillera de todos los tiempos en su momento" },
    { text: "¿En qué año se estrenó en cines la primera película de la saga de terror 'Pesadilla en Elm Street' de Wes Craven?", answer: 1984, note: "Presentando al siniestro Freddy Krueger con su guante de cuchillas" },
    { text: "¿En qué año debutó el actor Johnny Depp en el cine (precisamente en 'Pesadilla en Elm Street')?", answer: 1984, note: "Interpretando a Glen Lantz, el novio de la protagonista que muere devorado por su cama" },
    { text: "¿Cuántas películas cinematográficas oficiales componen la saga de 'Pesadilla en Elm Street' en su línea original?", answer: 7, note: "Estrenadas entre 1984 y 1994, antes del crossover con Jason en 2003" },

    // --- DEPORTES Y RÉCORDS ---
    { text: "¿Cuántos títulos de Liga de Primera División española tiene en sus vitrinas la Unión Deportiva Las Palmas?", answer: 0, note: "Subcampeón de Liga en 1968-69 y finalista de la Copa del Rey en 1978" },
    { text: "¿Cuántos títulos de Copa del Rey de fútbol ha conquistado el Real Club Deportivo Mallorca?", answer: 1, note: "Conquistada en Elche en 2003 con dos goles del camerunés Samuel Eto'o" },
    { text: "¿Cuántas Copas del Rey de fútbol ha conquistado el Real Valladolid?", answer: 0, note: "Finalista de Copa en dos ocasiones (1950 y 1989), aunque ganó una Copa de la Liga en 1984" },
    { text: "¿Cuántos títulos de Liga de Campeones (Champions League) ha ganado el Manchester City (hasta 2024)?", answer: 1, note: "Conquistada en Estambul en 2023 con gol del centrocampista español Rodri Hernández" },
    { text: "¿Cuántos puntos sumaba un gol en la mítica tanda de penaltis estilo MLS estadounidense en los años 90?", answer: 1, note: "Los jugadores salían desde 35 yardas y tenían 5 segundos para batir al portero mano a mano" },
    { text: "¿Cuántos segundos tenían los futbolistas para rematar en los penaltis 'shootout' de la MLS en los 90?", answer: 5, note: "El árbitro cronometraba 5 segundos exactos desde la línea de salida" },
    { text: "¿Cuántos oros olímpicos individuales en tenis masculino ha ganado el serbio Novak Djokovic?", answer: 1, note: "Conquistado en los Juegos Olímpicos de París 2024 completando el 'Golden Slam' de su carrera" },
    { text: "¿Cuántos oros olímpicos individuales en tenis masculino tiene el tenista español Rafael Nadal?", answer: 1, note: "Conquistado en Pekín 2008 (además de otro oro olímpico en dobles en Río 2016)" },
    { text: "¿Cuántos kilómetros de distancia tiene un combate de marcha atlética olímpica masculina en su prueba tradicional larga?", answer: 50, note: "Los extenuantes 50 kilómetros marcha que se disputaron durante casi un siglo" },
    { text: "¿Cuántas tarjetas rojas directas se necesitan para que un árbitro de fútbol suspenda el partido por falta de jugadores?", answer: 5, note: "Un equipo no puede continuar jugando sobre el césped con menos de 7 futbolistas" },

    // --- GEOGRAFÍA POLÍTICA Y CIUDADES ---
    { text: "¿Cuántos estados componen los Estados Unidos continentales que no tienen frontera con ningún país extranjero?", answer: 38, note: "Doce estados hacen frontera terrestre con Canadá o México" },
    { text: "¿Cuántas provincias componen la República de Cuba?", answer: 15, note: "Más el Municipio Especial de la Isla de la Juventud" },
    { text: "¿Cuántas provincias componen la República Dominicana en el Caribe?", answer: 31, note: "Más el Distrito Nacional de la capital de Santo Domingo" },
    { text: "¿Cuántos departamentos componen la República de Haití?", answer: 10, note: "Ocupa el tercio occidental de la isla caribeña de La Española" },
    { text: "¿Cuántos cantones componen la división administrativa de la República de Costa Rica?", answer: 84, note: "Subdivisiones territoriales de sus siete provincias históricas" },
    { text: "¿Cuántos municipios tiene la provincia de Zaragoza en Aragón?", answer: 293, note: "La provincia central y más poblada del valle medio del Ebro" },
    { text: "¿Cuántos municipios componen la provincia de Huesca en los Pirineos aragoneses?", answer: 202, note: "Alberga cumbres míticas como el Aneto y el Parque Nacional de Ordesa" },
    { text: "¿Cuántos municipios tiene la provincia de Teruel en Aragón?", answer: 236, note: "Famosa por su arquitectura mudéjar y los Amantes de Teruel" },
    { text: "¿Cuántos puentes históricos cruzan el río Guadalquivir dentro del término municipal de Córdoba?", answer: 4, note: "Encabezados por el bimilenario Puente Romano frente a la Mezquita" },
    { text: "¿Cuántos ojos o arcos tiene el histórico Puente Romano de Córdoba sobre el Guadalquivir?", answer: 16, note: "Construido en el siglo I a.C. y modificado en época islámica y renacentista" },

    // --- CURIOSIDADES POPULARES Y DEL DÍA A DÍA ---
    { text: "¿Cuántas vueltas hay que darle a una llave tradicional en una cerradura de alta seguridad para echar los cerrojos completos?", answer: 2, note: "La clásica 'doble vuelta' que proyecta los bulones al marco de la puerta" },
    { text: "¿Cuántos clavos tiene de media una herradura clásica colocada en la pezuña de un buey de tiro?", answer: 8, note: "Al tener la pezuña hendida en dos mitades, llevan dos herraduras separadas por pata" },
    { text: "¿Cuántas cuerdas dobles tiene un timple canario tradicional de 5 cuerdas?", answer: 0, note: "El timple clásico canario tiene cinco cuerdas individuales simples (no dobles)" },
    { text: "¿Cuántos radios tiene la emblemática 'Rueda de la Fortuna' de un parque de atracciones clásico estándar?", answer: 16, note: "Estructura radial de acero que reparte la carga de las góndolas colgantes" },
    { text: "¿Cuántos dientes tiene un rastrillo agrícola de jardín metálico común promedio?", answer: 14, note: "Suele oscilar entre 12 y 16 púas para barrer hojas y nivelar arena" },
    { text: "¿Cuántos agujeros de entrada y salida suele tener una regadera tradicional de jardinería en su alcachofa?", answer: 60, note: "Aproximadamente medio centenar de orificios finos para regar en lluvia suave" },
    { text: "¿Cuántos paneles de cristal componen la gigantesca Pirámide del Museo del Louvre de París (en cientos)?", answer: 6, note: "Exactamente 673 rombos y triángulos de vidrio diseñados por Ieoh Ming Pei" },
    { text: "¿Cuántas caras triangulares componen el diseño de una pirámide de base cuadrada?", answer: 4, note: "Cuatro caras laterales triangulares que convergen en la cúspide superior" },
    { text: "¿Cuántos escalones tiene una escalera de mano de tijera doméstica estándar de tres peldaños (incluyendo plataforma)?", answer: 3, note: "Dos peldaños inferiores más la meseta superior de apoyo" },
    { text: "¿Cuántos botones de control suele tener un ratón de ordenador de oficina clásico (izquierdo, derecho y rueda)?", answer: 3, note: "Clic primario, clic secundario y el clic pulsable de la rueda central de scroll" },
    // --- MEGATANDA 14: FOLKLORE ESPAÑOL, TRADICIONES Y FIESTAS POPULARES ---
    { text: "¿Cuántas horas ininterrumpidas dura la gran Tamborrada de San Sebastián el 20 de enero?", answer: 24, note: "Desde la medianoche con la izada de la bandera en la plaza de la Constitución hasta la arriada 24 horas después" },
    { text: "¿Cuántas compañías o cuadrillas de tambores participan aproximadamente en la Tamborrada donostiarra (en cientos)?", answer: 1, note: "Más de 150 compañías con miles de tambores y barriles por las calles" },
    { text: "¿Cuántos litros de vino tinto se lanzan aproximadamente en la célebre 'Batalla del Vino' de Haro (La Rioja en miles)?", answer: 40, note: "Más de 40.000 litros de vino en botas, sulfatadoras y cubos en los riscos de Bilibio" },
    { text: "¿Cuántos centímetros de altura tienen los zancos de madera en la tradicional 'Danza de los Zancos' de Anguiano (La Rioja)?", answer: 50, note: "Ocho jóvenes lanzándose girando sobre zancos de 50 cm por una empinada cuesta empedrada" },
    { text: "¿Cuántos jóvenes danzantes bajan girando sobre zancos en la cuesta de Anguiano?", answer: 8, note: "Vestidos con amplias faldas amarillas que hacen efecto campana al girar" },
    { text: "¿Cuántos actos o jornadas componen la representación del medieval 'Misteri d'Elx' en Alicante?", answer: 2, note: "La Vespra (14 de agosto) y la Festa (15 de agosto) en la Basílica de Santa María" },
    { text: "¿En qué siglo se originó la representación del Misteri d'Elx, declarada Obra Maestra del Patrimonio Oral?", answer: 15, note: "Drama sacro-lírico cantado íntegramente en valenciano antiguo y latín" },
    { text: "¿Cuántos días dura la tradicional Feria del Caballo de Jerez de la Frontera (Cádiz)?", answer: 7, note: "Una semana de paseo de caballos, casetas abiertas a todo el mundo y vino fino" },
    { text: "¿Cuántos años de antigüedad tiene la Romería de la Virgen de la Cabeza en Andújar (Jaén, en siglos)?", answer: 8, note: "Considerada la romería más antigua documentada de toda España (siglo XIII)" },
    { text: "¿Cuántos días dura el Festival de Teatro Clásico de Almagro en Ciudad Real (en semanas)?", answer: 3, note: "Casi un mes entero de representaciones en su corral de comedias original del siglo XVII" },
    { text: "¿Cuántos metros cuadrados tiene aproximadamente el corral de comedias de Almagro?", answer: 300, note: "El único espacio escénico del Siglo de Oro conservado intacto en el mundo" },
    { text: "¿Cuántos cañones o trabucos disparan las salvas de pólvora en las fiestas de la Encamisada de Torrejoncillo (Cáceres)?", answer: 100, note: "Cientos de jinetes cubiertos con sábanas blancas vitoreando a la Virgen" },
    { text: "¿Cuántas horas dura la tradicional bajada de las fallas de fuego en el solsticio de verano de los Pirineos?", answer: 3, note: "Jóvenes descendiendo la montaña portando antorchas monumentales encendidas" },
    { text: "¿Cuántas horas tarda habitualmente el recorrido de la procesión de 'El Abuelo' en la Semana Santa de Jaén?", answer: 13, note: "Nuestro Padre Jesús Nazareno recorre la ciudad desde la madrugada hasta la tarde del Viernes Santo" },
    { text: "¿Cuántos nazarenos pueden llegar a acompañar a la cofradía del Silencio en la Madrugá de Sevilla (en miles)?", answer: 1, note: "Más de 1.200 hermanos vestidos con túnicas de ruan negro y esparto en riguroso voto de silencio" },
    { text: "¿Cuántos siglos lleva celebrándose el Corpus Christi de Toledo de forma continuada?", answer: 7, note: "Documentado desde el siglo XIV, con las calles cubiertas de toldos, tomillo y romero" },
    { text: "¿Cuántos kilos de plata y oro componen la monumental Custodia de Arfe de Toledo?", answer: 200, note: "Una joya renacentista labrada por Enrique de Arfe que procesiona una vez al año" },
    { text: "¿Cuántas calles se engalanan artesanalmente en las populares Fiestas de Gràcia de Barcelona (en decenas)?", answer: 20, note: "Más de una veintena de calles transformadas en escenarios temáticos por los vecinos" },
    { text: "¿Cuántos días dura la feria de albacete, declarada de Interés Turístico Internacional?", answer: 10, note: "Del 7 al 17 de septiembre alrededor de su singular recinto ferial circular 'La Sartén'" },
    { text: "¿Cuántas puertas de acceso tiene el histórico recinto ferial circular de Albacete?", answer: 7, note: "Conocido popularmente como 'La Sartén' o 'Los Redondeles'" },
    { text: "¿Cuántas jornadas completas dura el festival de música tradicional Ortigueira en Galicia?", answer: 4, note: "El mayor referente de música celta y folk de la península ibérica" },
    { text: "¿Cuántos músicos de gaita suelen desfilar juntos en una banda de gaitas tradicional gallega o asturiana?", answer: 20, note: "Acompañados por redoblantes, bombos y panderetas tradicionales" },
    { text: "¿Cuántos agujeros melódicos tiene el puntero de una gaita gallega tradicional?", answer: 8, note: "Siete frontales y uno posterior para la digitación de la melodía" },
    { text: "¿Cuántos tubos de sonido en total (puntero más roncones) componen una gaita gallega con roncón y ronqueta?", answer: 3, note: "El puntero melódico, el gran roncón grave y la ronqueta intermedia sobre el hombro" },
    { text: "¿Cuántas hojas de laurel se echan habitualmente al agua de cocer el pulpo o los mariscos en Galicia?", answer: 2, note: "Una o dos hojas para perfumar el hervor sin enmascarar el sabor marino" },

    // --- PORCENTAJES (%) CURIOSOS: SOCIEDAD, TIERRA Y CONSUMO ---
    { text: "¿Qué porcentaje del peso corporal de un camello adulto son reservas de grasa en su joroba?", answer: 20, note: "Su joroba almacena hasta 35 kilos de grasa pura que metaboliza en agua y energía" },
    { text: "¿Qué porcentaje de las especies de árboles de Europa son coníferas (pinos, abetos, alerces)?", answer: 30, note: "El 70% restante son especies de hoja caduca como hayas, robles y abedules" },
    { text: "¿Qué porcentaje de la salinidad tiene el agua de lluvia recién caída de una nube?", answer: 0, note: "El vapor de agua condensado es agua dulce prácticamente pura con cero salinidad" },
    { text: "¿Qué porcentaje de las parejas que juegan a juegos de mesa declaran haber discutido durante una partida?", answer: 60, note: "El Monopoly y los juegos de negociación son los mayores detonantes de piques caseros" },
    { text: "¿Qué porcentaje de la madera de un barco antiguo de madera se trataba con brea para impermeabilizarlo?", answer: 100, note: "El calafateado con estopa y brea caliente era vital para evitar vías de agua" },
    { text: "¿Qué porcentaje de los vuelos comerciales tienen al menos un piloto con más de 40 años?", answer: 80, note: "Por los rigurosos años de vuelo acumulados requeridos para ascender a comandante" },
    { text: "¿Qué porcentaje de la carne de cerdo ibérico curada en jamón es ácido oleico (grasa saludable)?", answer: 55, note: "Debido a la dieta de bellotas en la dehesa, a menudo llamado 'olivo con patas'" },
    { text: "¿Qué porcentaje de las especies de corales duros marinos dependen de algas microscópicas (zooxantelas)?", answer: 90, note: "Viven en simbiosis perfecta: las algas les proporcionan nutrientes y colores vivos" },
    { text: "¿Qué porcentaje de la producción de energía eólica en España se concentra en las horas nocturnas con viento?", answer: 55, note: "Las rachas de viento nocturnas son un pilar clave del suministro eléctrico peninsular" },
    { text: "¿Qué porcentaje de las personas adultas duermen con la almohada entre las piernas cuando descansan de lado?", answer: 35, note: "Postura ortopédicamente ideal para aliviar la tensión en la zona lumbar y cadera" },
    { text: "¿Qué porcentaje de los ataques de tos seca en invierno se deben a aire excesivamente reseco por la calefacción?", answer: 40, note: "De ahí la utilidad médica de colocar recipientes de agua o humidificadores" },
    { text: "¿Qué porcentaje de la sal marina recolectada en las salinas de Santa Pola y Cádiz se exporta a otros países?", answer: 70, note: "España es uno de los mayores exportadores de sal marina de alta pureza del mundo" },
    { text: "¿Qué porcentaje del café consumido en los bares de España es café torrefacto o mezcla?", answer: 50, note: "El café tostado con azúcar, una peculiaridad histórica aún muy arraigada" },
    { text: "¿Qué porcentaje de los accidentes de cocina con cortes se producen al pelar patatas o picar cebolla?", answer: 45, note: "Cuchillos poco afilados que resbalan son la principal causa en urgencias" },
    { text: "¿Qué porcentaje de los coches matriculados en España son de transmisión manual tradicional?", answer: 65, note: "Aunque el cambio automático crece rápidamente impulsado por los modelos híbridos" },
    { text: "¿Qué porcentaje de las especies de arañas catalogadas en el mundo construyen telas de araña circulares clásicas?", answer: 30, note: "La mayoría cazan al acecho, bajo tierra o con redes en embudo" },
    { text: "¿Qué porcentaje de los incendios forestales en la cuenca mediterránea se apagan en las primeras dos horas?", answer: 70, note: "Gracias a los rápidos operativos de helicópteros e hidroaviones de extinción" },
    { text: "¿Qué porcentaje de la superficie de la isla de Menorca está declarada Reserva de la Biosfera por la UNESCO?", answer: 100, note: "Toda la isla al completo goza de esta máxima distinción de protección natural" },
    { text: "¿Qué porcentaje de los seres humanos tienen el sentido del olfato menos agudo por la mañana nada más despertar?", answer: 80, note: "El sistema sensorial olfativo necesita unos minutos de hidratación y vigilia activa" },
    { text: "¿Qué porcentaje de los jóvenes españoles usan habitualmente auriculares inalámbricos para escuchar música?", answer: 90, note: "El estándar tecnológico dominante frente a los auriculares de cable tradicionales" },

    // --- HISTORIA MODERNA Y GRANDES MOMENTOS ---
    { text: "¿En qué año se fundó la histórica fábrica de tabacos de Sevilla (hoy sede de la Universidad)?", answer: 1728, note: "El edificio industrial más colosal de toda la Europa del siglo XVIII" },
    { text: "¿En qué año se abolió definitivamente la pena de muerte en España para tiempos de paz?", answer: 1978, note: "Consagrado en el artículo 15 de la Constitución Española de 1978" },
    { text: "¿En qué año se abolió la pena de muerte en España para el código penal militar en tiempos de guerra?", answer: 1995, note: "Erradicada por completo de cualquier texto legal del ordenamiento español" },
    { text: "¿En qué año se inauguró el primer Museo Guggenheim de la historia en Nueva York diseñado por Frank Lloyd Wright?", answer: 1959, note: "Con su célebre rampa helicoidal continua de color blanco" },
    { text: "¿En qué año se inauguró el Centro Nacional de Arte Reina Sofía de Madrid con la llegada del Guernica?", answer: 1992, note: "Albergando de forma permanente el inmortal lienzo de Pablo Picasso" },
    { text: "¿En qué año regresó el lienzo del 'Guernica' de Picasso a España desde el MoMA de Nueva York?", answer: 1981, note: "Cumpliendo el deseo expreso de Picasso de volver cuando España fuera una democracia" },
    { text: "¿En qué año se firmó el Tratado Antártico que congeló las reclamaciones territoriales y vetó el uso militar?", answer: 1959, note: "Declarando la Antártida como continente consagrado exclusivamente a la ciencia y la paz" },
    { text: "¿En qué año se fundó el parque temático Disneyland original en Anaheim (California)?", answer: 1955, note: "El único parque temático diseñado y supervisado personalmente por Walt Disney" },
    { text: "¿En qué año se inauguró el parque temático PortAventura en la provincia de Tarragona?", answer: 1995, note: "El primer gran parque temático de atracciones de destino internacional en España" },
    { text: "¿En qué año se inauguró el parque de atracciones Warner Bros en San Martín de la Vega (Madrid)?", answer: 2002, note: "Inspirado en el mundo de los Looney Tunes y los superhéroes de DC Comics" },

    // --- CINE, TELEVISIÓN Y CULTURA POP ---
    { text: "¿En qué año se estrenó la película española 'Amanece, que no es poco' de José Luis Cuerda?", answer: 1989, note: "La cumbre del humor absurdo y surrealista patrio: '¡Calabaza, yo te llevo en el corazón!'" },
    { text: "¿En qué año se estrenó la película 'El milagro de P. Tinto' de Javier Fesser?", answer: 1998, note: "Una comedia inclasificable y de culto del cine español con obleas y marcianos" },
    { text: "¿Cuántos premios Goya ganó la película de culto 'El día de la bestia' de Álex de la Iglesia en 1996?", answer: 6, note: "Incluyendo Mejor Director para Álex de la Iglesia y Mejor Actor Revelación para Santiago Segura" },
    { text: "¿En qué año se estrenó 'La comunidad' de Álex de la Iglesia con Carmen Maura en un ático de Madrid?", answer: 2000, note: "Carmen Maura ganó el Goya y la Concha de Plata en el Festival de San Sebastián" },
    { text: "¿Cuántos premios Goya ganó la película 'La comunidad' (2000)?", answer: 3, note: "Mejor Actriz Protagonista, Mejor Actor de Reparto (Emilio Gutiérrez Caba) y Mejores Efectos" },
    { text: "¿En qué año se estrenó en cines la película 'Los lunes al sol' protagonizada por Javier Bardem y Luis Tosar?", answer: 2002, note: "Arrasó con 5 premios Goya retratando el desempleo en los astilleros gallegos" },
    { text: "¿En qué año se estrenó 'Celda 211' con Luis Tosar interpretando al inolvidable presidiario 'Malamadre'?", answer: 2009, note: "Ganadora de 8 premios Goya, incluyendo Mejor Película, Mejor Director y Mejor Actor" },
    { text: "¿Cuántos premios Goya ganó la película carcelaria 'Celda 211' en la gala de 2010?", answer: 8, note: "Uno de los thrillers de mayor impacto crítico y comercial de las últimas décadas" },
    { text: "¿Cuántos premios Oscar ganó la película 'No es país para viejos' de los hermanos Coen?", answer: 4, note: "Mejor Película, Mejor Director, Mejor Guion Adaptado y Mejor Actor de Reparto (Javier Bardem)" },
    { text: "¿Cuántas temporadas se emitieron de la exitosa comedia televisiva 'Aída' en Telecinco?", answer: 10, note: "Con un récord histórico de 237 episodios protagonizados por Carmen Machi y Paco León" },

    // --- DEPORTES Y CURIOSIDADES COMPETITIVAS ---
    { text: "¿Cuántas medallas de oro olímpicas en total ha ganado la delegación española en piragüismo (hasta 2024)?", answer: 5, note: "El piragüismo es el segundo deporte con más oros olímpicos en la historia olímpica de España" },
    { text: "¿Cuántas medallas olímpicas en total tiene en su palmarés el piragüista gallego David Cal?", answer: 5, note: "Un oro y cuatro platas logrados entre Atenas 2004, Pekín 2008 y Londres 2012" },
    { text: "¿Cuántas medallas olímpicas tiene en su palmarés el piragüista balear Saúl Craviotto?", answer: 6, note: "El deportista español con mayor número de medallas olímpicas de toda la historia" },
    { text: "¿Cuántos títulos de Liga de Primera División española tiene el Real Sporting de Gijón?", answer: 0, note: "Rozó el título liguero en la temporada 1978-79 pero quedó subcampeón" },
    { text: "¿Cuántas Copas del Rey de fútbol ha conquistado el Real Club Deportivo de La Coruña?", answer: 2, note: "Conquistadas en 1995 frente al Valencia y en 2002 frente al Real Madrid ('Centenariazo')" },
    { text: "¿Cuántos minutos de añadido se jugaron en el célebre partido suspendido por lluvia de la Copa del Rey de 1995 entre Deportivo y Valencia?", answer: 11, note: "Se reanudó días después para jugar solo 11 minutos; Alfredo marcó de cabeza nada más reanudar" },
    { text: "¿Cuántos títulos de Liga de Primera División de fútbol femenino ha ganado el Fútbol Club Barcelona (hasta 2024)?", answer: 9, note: "El club más dominante del fútbol femenino español y continental" },
    { text: "¿Cuántas Ligas de Campeones Femeninas de la UEFA (Champions femenina) ha conquistado el FC Barcelona (hasta 2024)?", answer: 3, note: "Conquistadas en 2021, 2023 y 2024" },
    { text: "¿Cuántos Balones de Oro femeninos ha ganado la futbolista española Alexia Putellas?", answer: 2, note: "Ganadora consecutiva en los años 2021 y 2022" },
    { text: "¿Cuántos Balones de Oro femeninos ha ganado la centrocampista española Aitana Bonmatí (hasta 2024)?", answer: 2, note: "Ganadora consecutiva en los años 2023 y 2024 tras ganar Mundial y Champions" },

    // --- GEOGRAFÍA POLÍTICA Y CAPITALES ---
    { text: "¿Cuántas provincias componen la República de Panamá en el istmo centroamericano?", answer: 10, note: "Bocas del Toro, Chiriquí, Coclé, Colón, Darién, Herrera, Los Santos, Panamá, Veraguas y Panamá Oeste" },
    { text: "¿Cuántos departamentos componen el territorio nacional de la República del Paraguay?", answer: 17, note: "Más el Distrito Capital de la ciudad de Asunción" },
    { text: "¿Cuántas provincias componen la región histórica del Alentejo en el sur de Portugal?", answer: 4, note: "Portalegre, Évora, Beja y el litoral de Setúbal sur" },
    { text: "¿Cuántos municipios componen la provincia de Pontevedra en Galicia?", answer: 61, note: "Repartidos entre las Rías Baixas, Vigo y la capital pontevedresa" },
    { text: "¿Cuántos municipios componen la provincia de Ourense en Galicia?", answer: 92, note: "La única provincia gallega sin costa marítima directa" },
    { text: "¿Cuántos municipios componen la provincia de Lugo en Galicia?", answer: 67, note: "La provincia más extensa en superficie de la comunidad gallega" },
    { text: "¿Cuántos municipios componen la provincia de A Coruña?", answer: 93, note: "La provincia más poblada del noroeste peninsular" },
    { text: "¿Cuántos puentes históricos cruzan el río Miño entre las ciudades hermanas de Tui (España) y Valença do Minho (Portugal)?", answer: 2, note: "El histórico Puente Internacional de hierro de Eiffel y el nuevo viaducto de autopista" },
    { text: "¿Cuántos kilómetros de muralla romana intacta rodean el casco histórico de la ciudad de Lugo?", answer: 2, note: "Exactamente 2.117 metros de muralla bimilenaria Patrimonio de la Humanidad" },
    { text: "¿Cuántas puertas de acceso tiene la muralla romana de Lugo (cinco romanas y cinco modernas)?", answer: 10, note: "La única muralla romana del mundo que conserva su circuito perimetral completo" },

    // --- CURIOSIDADES DEL DÍA A DÍA Y ESTIMACIÓN ---
    { text: "¿Cuántas cerillas suele contener una cajetilla de fósforos estándar de bolsillo?", answer: 40, note: "Suele oscilar entre 35 y 45 cerillas de madera con cabeza de fósforo" },
    { text: "¿Cuántos dientes tiene un peine clásico de bolsillo estándar (en decenas)?", answer: 4, note: "Aproximadamente 40 a 50 púas divididas en zona ancha y fina" },
    { text: "¿Cuántas teclas numéricas componen el teclado numérico lateral de un teclado de ordenador (del 0 al 9)?", answer: 10, note: "Diez cifras numéricas acompañadas del intro, suma, resta, producto y división" },
    { text: "¿Cuántos clips metálicos para papel suele contener una cajita estándar de papelería (en cientos)?", answer: 1, note: "El clásico envase comercial de 100 clips galvanizados n.º 2" },
    { text: "¿Cuántos rollos de cinta adhesiva contiene un dispensador de sobremesa comercial estándar?", answer: 1, note: "Cargado habitualmente con una bobina de celofán de 33 metros de longitud" },
    { text: "¿Cuántas grapas suele admitir de una sola carga una grapadora de oficina estándar?", answer: 100, note: "Una tira completa de grapas de tamaño estándar 24/6 o 26/6" },
    { text: "¿Cuántas patas tiene una banqueta de ordeño tradicional de madera de vaquería?", answer: 3, note: "Diseño clásico de tres patas o trípode para asentarse firme en suelos irregulares" },
    { text: "¿Cuántos radios de apoyo tiene la base rodante con ruedas de una silla ergonómica de oficina moderna?", answer: 5, note: "La base en estrella de 5 patas es obligatoria por norma técnica europea antivuelco" },
    { text: "¿Cuántos cubos pequeños componen en total el mecanismo exterior de un cubo de Rubik clásico 3x3?", answer: 26, note: "26 piezas cúbicas visibles montadas sobre una cruceta interna de 6 ejes" },
    { text: "¿Cuántos centros fijos tiene un cubo de Rubik clásico de 3x3x3?", answer: 6, note: "Uno en cada cara fijando los 6 colores tradicionales del rompecabezas" },
    // --- MEGATANDA 15: FOLKLORE ESPAÑOL, FIESTAS Y COSTUMBRES ---
    { text: "¿Cuántos días dura la 'Aste Nagusia' o Semana Grande de Bilbao en agosto?", answer: 9, note: "Nueve días de fiesta ininterrumpida iniciados tras el txupinazo y la aparición de Marijaia en el teatro Arriaga" },
    { text: "¿En qué noche de la Semana Grande de Bilbao se quema la figura de Marijaia en la ría poniendo fin a las fiestas?", answer: 9, note: "El último domingo de fiestas, tras navegar por la ría ante miles de bilbaínos" },
    { text: "¿Cuántos días dura la tradicional 'Rapa das Bestas' de Sabucedo en Pontevedra?", answer: 3, note: "Tres días de bajada de caballos salvajes del monte y lucha cuerpo a cuerpo en el curro sin cuerdas" },
    { text: "¿Cuántos 'aloitadores' inmovilizan a cada caballo salvaje a cuerpo limpio en el curro de Sabucedo?", answer: 3, note: "Dos al cuello y cabeza y uno a la grupa para cortarles las crines y desparasitarlos" },
    { text: "¿Cuántas clases tradicionales de rosquillas se comen en la pradera de San Isidro en Madrid?", answer: 4, note: "Las 'tontas' (sin baño), las 'listas' (con limón y azúcar), las de Santa Clara (merengue) y las francesas (almendra)" },
    { text: "¿En qué día de mayo se celebra la festividad de San Isidro Labrador, patrón de Madrid?", answer: 15, note: "El 15 de mayo con romería tradicional en la pradera, chulapos y organillo" },
    { text: "¿Cuántos claveles rojos o blancos llevan tradicionalmente las chulapas madrileñas prendidos en el pelo?", answer: 2, note: "Dos claveles rojos si están casadas o dos blancos si son solteras según la tradición castiza" },
    { text: "¿Cuántos días dura el célebre Festival de los Patios de Córdoba en el mes de mayo (en semanas)?", answer: 2, note: "Dos semanas donde los vecinos abren sus patios floridos en concurso público festivo" },
    { text: "¿Cuántas macetas pueden llegar a decorar las paredes encaladas de un patio grande de concurso en Córdoba (en cientos)?", answer: 5, note: "Entre 400 y 600 macetas de gitanillas y geranios regadas diariamente con caña y lata" },
    { text: "¿Cuántos barcos moros participan en el tradicional desembarco naval de Moros y Cristianos en Villajoyosa (Alicante)?", answer: 30, note: "Más de 30 embarcaciones desembarcando al alba en la playa bajo una lluvia de fuegos de artificio" },
    { text: "¿Cuántos días dura la Feria del Queso de Trujillo en Cáceres en la Plaza Mayor?", answer: 4, note: "Cuatro días a principios de mayo congregando a cientos de queserías artesanas de toda España y Europa" },
    { text: "¿Cuántas horas dura la bajada de las balsas tradicionales en el 'Descenso de la Nabata' en el río Cinca en Huesca?", answer: 2, note: "Rememorando el antiguo oficio de transportar madera flotante por los ríos pirenaicos" },
    { text: "¿Cuántas horas tarda la procesión de las Turbas en la madrugada del Viernes Santo de Cuenca?", answer: 6, note: "Miles de tambores y clarines desafinados abriendo paso a Jesús Nazareno en un estruendo sobrecogedor" },
    { text: "¿Cuántos días dura el Carnaval de Santa Cruz de Tenerife en su semana de fiesta en la calle?", answer: 10, note: "Uno de los carnavales más afamados y multitudinarios del planeta, hermanado con Río de Janeiro" },
    { text: "¿Cuántos kilos puede llegar a pesar la estructura con plumas del traje de la Reina del Carnaval de Tenerife (en decenas)?", answer: 20, note: "Llegan a superar los 200 kilos de peso sobre una plataforma con ruedas guiada por la aspirante" },
    { text: "¿Cuántas comparsas y murgas infantiles y adultas participan en el Carnaval de Las Palmas de Gran Canaria (en decenas)?", answer: 4, note: "Más de 40 agrupaciones compitiendo en el parque de Santa Catalina" },
    { text: "¿Cuántos días dura la famosa fiesta de 'La Bajada de la Virgen de las Nieves' en La Palma (cada 5 años)?", answer: 30, note: "Un mes de celebraciones lustrales con la célebre Danza de los Enanos" },
    { text: "¿Cuántos hombres bailan la legendaria Danza de los Enanos en las fiestas lustrales de La Palma?", answer: 24, note: "Se transforman dentro de una caseta pasando de hombres solemnes a enanos saltarines" },
    { text: "¿Cuántos días dura la Feria de la Manzanilla en Sanlúcar de Barrameda (Cádiz)?", answer: 6, note: "Seis días en el paseo de la Calzada degustando langostinos y manzanilla frente al Coto de Doñana" },
    { text: "¿Cuántos siglos lleva celebrándose la histórica carrera de caballos en la playa de Sanlúcar de Barrameda?", answer: 2, note: "Celebradas ininterrumpidamente desde agosto de 1845 al caer la bajamar" },
    { text: "¿Cuántos días dura el ciclo de carreras de caballos en la playa de Sanlúcar cada verano?", answer: 6, note: "Dos ciclos de tres jornadas cada uno coincidiendo con las mareas vivas de agosto" },
    { text: "¿Cuántas toneladas de sidra se escancian en la Fiesta de la Sidra Natural de Gijón en su récord mundial (en miles de litros)?", answer: 10, note: "Miles de personas escanciando simultáneamente un culín en la playa de Poniente" },
    { text: "¿Cuántos días dura la tradicional Feria de San Lucas en Jaén, la última gran feria del año en Andalucía?", answer: 10, note: "Diez días a mediados de octubre despidiendo la temporada de ferias andaluzas" },
    { text: "¿Cuántas casetas se instalan en el recinto de la Feria del Caballo en el parque González Hontoria de Jerez (en cientos)?", answer: 2, note: "Más de 200 casetas con acceso libre para cualquier visitante" },
    { text: "¿Cuántos días dura el festival de Alburquerque (Cáceres) conocido como 'Festival Medieval Villa de Alburquerque'?", answer: 4, note: "El pueblo entero se traslada al siglo XIV a los pies del imponente castillo de Luna" },

    // --- PORCENTAJES (%) BRUTALES: CIENCIA, SOCIEDAD Y SALUD ---
    { text: "¿Qué porcentaje del peso de un melocotón fresco maduro es agua?", answer: 88, note: "Rico en carotenos, agua y azúcares saludables de verano" },
    { text: "¿Qué porcentaje de las especies de peces óseos del mundo son de agua salada marina?", answer: 60, note: "El 40% restante habita en ríos, lagos y aguas continentales" },
    { text: "¿Qué porcentaje de la producción mundial de cítricos se destina a consumo en fresco (sin exprimir)?", answer: 70, note: "El 30% restante se transforma industrialmente en zumos y concentrados" },
    { text: "¿Qué porcentaje de las parejas casadas en España celebran su boda mediante ceremonia civil?", answer: 80, note: "Las bodas civiles han superado masivamente a las ceremonias religiosas en la última década" },
    { text: "¿Qué porcentaje de los diamantes producidos en el mundo proceden de depósitos aluviales en ríos?", answer: 10, note: "El 90% se extrae directamente de minas en roca volcánica primaria" },
    { text: "¿Qué porcentaje de la madera utilizada en muebles modernos de bricolaje es aglomerado o tablero DM?", answer: 75, note: "Frente a la madera maciza tradicional, por su ligereza, coste y estabilidad dimensional" },
    { text: "¿Qué porcentaje de los vehículos de extinción de bomberos en España son autobombas?", answer: 70, note: "El camión básico equipado con depósito de agua, mangueras y bombas de presión" },
    { text: "¿Qué porcentaje de los ataques al corazón en jóvenes menores de 35 años se asocian al consumo de tabaco o drogas?", answer: 80, note: "El factor desencadenante más crítico en infartos agudos en edades tempranas" },
    { text: "¿Qué porcentaje de la superficie de la cuenca mediterránea ibérica sufre riesgo de desertificación moderado o alto?", answer: 70, note: "Uno de los mayores retos ecológicos y de gestión hídrica para el sur de Europa" },
    { text: "¿Qué porcentaje de los árboles de hoja perenne renuevan sus hojas o acículas a lo largo del año?", answer: 100, note: "Aunque siempre se ven verdes, renuevan gradualmente su follaje cada dos o tres años" },
    { text: "¿Qué porcentaje del calor generado por el cuerpo humano se pierde si nos sumergimos en agua fría a 15 °C?", answer: 90, note: "El agua conduce el calor 25 veces más rápido que el aire, acelerando la hipotermia" },
    { text: "¿Qué porcentaje de los españoles declaran que su tapa favorita en los bares es la tortilla de patatas?", answer: 60, note: "El emblema indiscutible del tapeo patrio junto al jamón ibérico y las croquetas" },
    { text: "¿Qué porcentaje de los adultos reconocen que prefieren la tortilla de patatas 'con cebolla' en España?", answer: 73, note: "La eterna disputa gastronómica nacional se decanta mayoritariamente del lado concebollista" },
    { text: "¿Qué porcentaje de las reservas mundiales de petróleo se encuentran en países miembros de la OPEP?", answer: 80, note: "El cartel petrolero retiene cuatro de cada cinco barriles del crudo mundial conocido" },
    { text: "¿Qué porcentaje de la biomasa viva de la Tierra está compuesta por plantas?", answer: 80, note: "Los árboles y vegetación terrestre superan por goleada en masa a todos los animales juntos" },
    { text: "¿Qué porcentaje de las calorías del jamón ibérico curado provienen de sus proteínas?", answer: 40, note: "El resto son grasas saludables ricas en ácido oleico y salazón" },
    { text: "¿Qué porcentaje de los usuarios de teléfono móvil leen los mensajes de WhatsApp en menos de 5 minutos?", answer: 85, note: "La tasa de apertura más veloz y alta de cualquier medio de comunicación moderno" },
    { text: "¿Qué porcentaje de la sal utilizada en las carreteras de Europa en invierno es sal marina o de roca?", answer: 98, note: "Cloruro sódico de bajo coste que baja el punto de congelación del asfalto" },
    { text: "¿Qué porcentaje de las especies de aves acuáticas buceadoras tienen los pies palmeados con membrana?", answer: 100, note: "Pato, ganso, pelícano y cormorán comparten esta adaptación hidrodinámica" },
    { text: "¿Qué porcentaje de la electricidad producida en España en invierno se consume en calefacción y bombas de calor?", answer: 35, note: "Un tercio de la demanda eléctrica invernal se destina al confort térmico de los hogares" },

    // --- HISTORIA, CIENCIA Y ESPACIO ---
    { text: "¿En qué año se fundó la histórica Real Fábrica de Cristales de La Granja en Segovia?", answer: 1727, note: "Bajo el reinado de Felipe V para abastecer de lámparas y espejos a los palacios reales" },
    { text: "¿En qué año se inauguró el primer Museo de Cera de Madrid?", answer: 1972, note: "En el paseo de Recoletos, con más de 450 figuras de cera de personajes históricos y famosos" },
    { text: "¿En qué año se inauguró el teleférico de Madrid que une el Paseo del Pintor Rosales con la Casa de Campo?", answer: 1969, note: "Recorre dos kilómetros y medio a 40 metros de altura sobre el río Manzanares" },
    { text: "¿En qué año fue botado el primer submarino torpedero eléctrico con propulsión moderna inventado por Isaac Peral?", answer: 1888, note: "El 8 de septiembre de 1888 en los astilleros de San Fernando en Cádiz" },
    { text: "¿En qué año patentó el ingeniero español Leonardo Torres Quevedo el 'Telekino' (primer mando a distancia por radio)?", answer: 1903, note: "Pionero absoluto mundial del radiocontrol y la automática" },
    { text: "¿En qué año inventó el español Juan de la Cierva el 'Autogiro', precursor del moderno helicóptero?", answer: 1923, note: "Realizó su primer vuelo exitoso en el aeródromo de Getafe" },
    { text: "¿En qué año inventó el médico e ingeniero militar español Emilio Herrera el primer traje espacial presurizado?", answer: 1935, note: "La escafandra estratonáutica que sirvió de modelo básico para los trajes de la NASA" },
    { text: "¿En qué año se firmó el Tratado Antártico en Washington?", answer: 1959, note: "Garantizó la investigación científica libre y pacífica en el continente blanco" },
    { text: "¿En qué año se descubrieron los restos fósiles del 'Homo antecessor' en el yacimiento de Atapuerca (Burgos)?", answer: 1994, note: "Definiendo una nueva especie humana de casi un millón de años de antigüedad en Europa" },
    { text: "¿En qué año fue declarado el yacimiento arqueológico de Atapuerca Patrimonio de la Humanidad por la UNESCO?", answer: 2000, note: "Uno de los santuarios mundiales más importantes de la evolución humana" },

    // --- CINE, TELEVISIÓN Y CULTURA POP ---
    { text: "¿En qué año se estrenó en cines la icónica comedia española 'El astronauta' protagonizada por Tony Leblanc?", answer: 1970, note: "Unos simpáticos pícaros construyendo una base espacial casera en Carabanchel" },
    { text: "¿En qué año se estrenó la película fantástica 'Dentro del laberinto' (Labyrinth) con David Bowie?", answer: 1986, note: "Dirigida por Jim Henson con marionetas mágicas y música de Bowie" },
    { text: "¿En qué año se estrenó 'La historia interminable' de Wolfgang Petersen basada en el libro de Michael Ende?", answer: 1984, note: "Con Atreyu y el dragón blanco de la suerte Fújur surcando el reino de Fantasía" },
    { text: "¿En qué año se estrenó la comedia de aventuras 'Los Goonies' producida por Steven Spielberg?", answer: 1985, note: "Un grupo de chavales buscando el tesoro del pirata Willy el Tuerto" },
    { text: "¿En qué año se estrenó en cines la primera película de 'Cazafantasmas' (Ghostbusters) de Ivan Reitman?", answer: 1984, note: "Con Bill Murray, Dan Aykroyd y el muñeco gigante de malvavisco Marshmallow" },
    { text: "¿En qué año se estrenó la comedia 'Beetlejuice' (Bitelchús) de Tim Burton?", answer: 1988, note: "Protagonizada por Michael Keaton como el alocado 'bioexorcista' de ultratumba" },
    { text: "¿Cuántas veces hay que pronunciar su nombre en la película para que aparezca Beetlejuice?", answer: 3, note: "Decir '¡Bitelchús, Bitelchús, Bitelchús!' para invocarlo al instante" },
    { text: "¿Cuántos premios Goya ganó la comedia dramática 'Campeones' de Javier Fesser en 2019?", answer: 3, note: "Mejor Película, Mejor Actor Revelación (Jesús Vidal) y Mejor Canción Original" },
    { text: "¿En qué año se estrenó 'Campeones' de Javier Fesser, el gran fenómeno de taquilla del cine español?", answer: 2018, note: "Conmovió a más de 3 millones de espectadores en las salas de cine" },
    { text: "¿Cuántas temporadas duró la histórica serie cómica de sketches 'Camera Café' en el access prime time de Telecinco?", answer: 5, note: "Más de 500 episodios frente a la máquina de café entre 2005 y 2009" },

    // --- DEPORTES Y CURIOSIDADES COMPETITIVAS ---
    { text: "¿Cuántos campeonatos del mundo de trial en moto ha conquistado el catalán Toni Bou (hasta 2024)?", answer: 36, note: "18 títulos al aire libre y 18 títulos indoor; el deportista más laureado de la historia del motor" },
    { text: "¿Cuántos mundiales de patinaje artístico sobre hielo masculino ganó el madrileño Javier Fernández?", answer: 2, note: "Campeón del mundo en 2015 y 2016, además de siete oros europeos consecutivos" },
    { text: "¿Cuántos títulos de campeón de Europa consecutivos de patinaje artístico ganó Javier Fernández?", answer: 7, note: "Dominó el continente sin rival entre 2013 y 2019 de forma ininterrumpida" },
    { text: "¿Cuántas medallas de oro olímpicas tiene en su palmarés la piragüista Maialen Chourraut en eslalon?", answer: 1, note: "Oro en Río 2016, además de plata en Tokio 2020 y bronce en Londres 2012" },
    { text: "¿Cuántos títulos de Liga de Primera División española tiene el Levante Unión Deportiva?", answer: 0, note: "Aunque en 2023 la RFEF le reconoció oficialmente la Copa de la España Libre ganada en 1937" },
    { text: "¿Cuántos títulos de Copa del Rey de fútbol tiene el Elche Club de Fútbol?", answer: 0, note: "Fue finalista en 1969 perdiendo 1-0 frente al Athletic Club en el Santiago Bernabéu" },
    { text: "¿Cuántos títulos de Copa del Rey de fútbol ha conquistado el Club Atlético Osasuna?", answer: 0, note: "Finalista de Copa en dos ocasiones históricas (2005 frente al Betis y 2023 frente al Real Madrid)" },
    { text: "¿Cuántos títulos de campeón del mundo de rallies en categoría de copiloto tiene el español Luis Moya?", answer: 2, note: "Bicampeón del mundo junto a Carlos Sainz en 1990 y 1992: '¡Trata de arrancarlo, Carlos!'" },
    { text: "¿Cuántos segundos antes del final del tramo se produjo la célebre avería del Toyota de Carlos Sainz en el Rally de Gran Bretaña de 1998?", answer: 300, note: "Se paró el coche a apenas 500 metros de la meta final cuando eran campeones virtuales" },
    { text: "¿Cuántos metros faltaban para la meta en la mítica frase '¡Trata de arrancarlo por Dios!' de Luis Moya?", answer: 500, note: "Uno de los momentos más dramáticos y recordados de la historia del deporte español" },

    // --- GEOGRAFÍA POLÍTICA Y CIUDADES ---
    { text: "¿Cuántos estados federales componen la República de Austria?", answer: 9, note: "Burgenland, Carintia, Baja Austria, Alta Austria, Salzburgo, Estiria, Tirol, Vorarlberg y Viena" },
    { text: "¿Cuántos departamentos componen la República de El Salvador en Centroamérica?", answer: 14, note: "El país con mayor densidad demográfica del continente americano" },
    { text: "¿Cuántos municipios componen la provincia de Guadalajara en Castilla-La Mancha?", answer: 288, note: "Una provincia con gran cantidad de pequeñas localidades en la comarca de la Alcarria" },
    { text: "¿Cuántos municipios componen la provincia de Cuenca?", answer: 238, note: "Célebre por sus Casas Colgadas y la Ciudad Encantada" },
    { text: "¿Cuántos municipios componen la provincia de Albacete?", answer: 87, note: "Repartidos por la llanura manchega y la sierra del Segura" },
    { text: "¿Cuántos municipios componen la provincia de Ciudad Real?", answer: 102, note: "Alberga el Parque Nacional de las Tablas de Daimiel y Cabañeros" },
    { text: "¿Cuántos municipios componen la provincia de Toledo?", answer: 204, note: "La provincia imperial ribereña del río Tajo" },
    { text: "¿Cuántas puertas monumentales se conservan en la muralla medieval de Toledo?", answer: 8, note: "Encabezadas por la emblemática Puerta de Bisagra con el escudo imperial de Carlos V" },
    { text: "¿Cuántos kilómetros de longitud tiene el río Jarama en la Comunidad de Madrid?", answer: 190, note: "Nace en Peña Cebollera y desemboca en el Tajo a la altura de Aranjuez" },
    { text: "¿Cuántos ríos principales vierten sus aguas directamente al río Guadalquivir en Andalucía (en decenas)?", answer: 8, note: "Genil, Guadiana Menor, Guadalimar, Jándula, Guadiamar, etc." },

    // --- CURIOSIDADES POPULARES Y DEL HOGAR ---
    { text: "¿Cuántas patas suele tener un somier de cama de matrimonio de 135 o 150 cm?", answer: 5, note: "Cuatro en las esquinas y una pata de refuerzo central para evitar que se hunda el centro" },
    { text: "¿Cuántos litros de capacidad tiene una bombona de butano naranja doméstica estándar en España (en kilos de gas)?", answer: 12, note: "Contiene exactamente 12,5 kilos de gas licuado en su interior" },
    { text: "¿Cuántos kilos pesa vacía una bombona de butano tradicional de hierro naranja?", answer: 13, note: "Pesa unos 13 kg vacía, sumando 26 kg con la carga completa de gas" },
    { text: "¿Cuántas aspas suele tener un ventilador de techo doméstico estándar?", answer: 4, note: "Suele oscilar entre 3 y 5 aspas para lograr un flujo de aire silencioso y continuo" },
    { text: "¿Cuántos peldaños tiene una escalera de piscina olímpica desmontable de acceso lateral estándar?", answer: 4, note: "Cuatro peldaños de acero inoxidable con superficie antideslizante" },
    { text: "¿Cuántos orificios suele tener una percha de ropa con muescas para colgar tirantes?", answer: 2, note: "Una muesca a cada lado para sujetar vestidos y tirantes sin que resbalen" },
    { text: "¿Cuántos bolsillos exteriores suele tener un pantalón vaquero clásico de cinco bolsillos?", answer: 5, note: "Dos traseros, dos delanteros y el diminuto 'bolsillo relojero' de la derecha" },
    { text: "¿Para qué objeto se inventó originalmente el diminuto bolsillo delantero del pantalón vaquero?", answer: 0, note: "Para guardar el reloj de bolsillo de cadena de los mineros y vaqueros" },
    { text: "¿Cuántos remaches metálicos de cobre suele llevar un pantalón vaquero Levi's clásico (en decenas)?", answer: 1, note: "Aproximadamente seis remaches en los puntos de tensión de los bolsillos delanteros" },
    { text: "¿Cuántas vueltas completas hay que darle al tambor de una lavadora doméstica para lavar una colada (en cientos)?", answer: 6, note: "Gira entre 500 y 800 veces a baja velocidad durante el lavado antes del centrifugado" },
    // --- MEGATANDA 16: FOLKLORE ESPAÑOL, FIESTAS Y COSTUMBRES POPULARES ---
    { text: "¿Cuántos kilos de polvos de talco se lanzan aproximadamente en la fiesta de 'Los Indianos' en Santa Cruz de La Palma (en miles)?", answer: 5, note: "Más de 5.000 kilos de talco perfumado cubriendo de blanco impoluto las calles el lunes de Carnaval" },
    { text: "¿De qué color viste obligatoriamente todo el mundo en la fiesta tradicional de 'Los Indianos' de La Palma?", answer: 1, note: "Blanco riguroso con guayaberas, trajes de lino blanco y sombreros panamá rememorando a los retornados de Cuba" },
    { text: "¿Cuántos días dura la Feria de Agosto de Málaga entre el Centro histórico y el Real de Cortijo de Torres?", answer: 8, note: "Ocho días de fiesta diurna de tapeo en el centro y marcha nocturna en el recinto ferial" },
    { text: "¿Cuántas comparsas de Moros y Cristianos desfilan en las multitudinarias fiestas de Villena (Alicante)?", answer: 14, note: "Siete comparsas en el bando moro y siete en el bando cristiano con más de 10.000 festeros" },
    { text: "¿Cuántos días duran las tradicionales Fiestas de Moros y Cristianos de Villena (del 4 al 9 de septiembre)?", answer: 5, note: "Cinco días en honor a Nuestra Señora de las Virtudes con espectaculares desfiles de boatos" },
    { text: "¿Cuántos millones de flores naturales (claveles amarillos y naranjas) se lanzan en la Batalla de Flores de Valencia?", answer: 1, note: "Más de un millón de flores arrojadas desde carrozas en el Paseo de la Alameda cerrando la Gran Fira de julio" },
    { text: "¿Con qué objeto tradicional de mimbre se defienden del impacto de las flores las falleras en la Batalla de Flores?", answer: 1, note: "Con una raqueta artesanal de tenis de mimbre para repeler los claveles en vuelo" },
    { text: "¿Cuántos días dura la Fiesta de la Vendimia de San Mateo en Logroño (La Rioja)?", answer: 7, note: "Una semana de celebraciones con el tradicional pisado de la uva en la plaza del Espolón" },
    { text: "¿Cuántos niños de diferentes comarcas de La Rioja vierten cestos de uva para el primer mosto de San Mateo en Logroño?", answer: 2, note: "Dos niños ataviados con trajes tradicionales acompañados por los vendimiadores mayores" },
    { text: "¿Cuántos pellejos de vino viejos se queman como teas en la procesión nocturna del 'Vítor' de Mayorga (Valladolid)?", answer: 300, note: "Centenares de pellejos de pez ardiendo alzado en varas iluminando la noche en honor a Santo Toribio" },
    { text: "¿Cuántas horas dura la impresionante procesión de fuego del Vítor de Mayorga recorriendo el pueblo?", answer: 5, note: "Desde las diez de la noche hasta la madrugada entre nubes de humo aromático y hogueras" },
    { text: "¿Cuántos días dura la Fiesta del Orujo en Potes (Cantabria) en pleno valle de Liébana?", answer: 3, note: "Degustación de aguardientes destilados en alquitaras de cobre al aire libre en noviembre" },
    { text: "¿Cuántos kilos de carne de cordero lechal se asan en una jornada grande de fiesta en un asador de Aranda de Duero (en cientos)?", answer: 2, note: "Centenares de cuartos traseros y delanteros asados lentamente en horno de leña de adobe" },
    { text: "¿Cuántas hogueras monumentales de madera y cartón se plantan en las 'Fogueres de Sant Joan' de Alicante (en cientos)?", answer: 1, note: "Cerca de 90 hogueras adultas y 90 infantiles repartidas por los distritos alicantinos" },
    { text: "¿Cuántos días dura la Fiesta de las Hogueras de San Juan en Alicante (del 20 al 24 de junio)?", answer: 5, note: "Cinco días culminados con la palmera pirotécnica blanca disparada desde el monte Benacantil" },
    { text: "¿Cuántos cohetes componen la monumental 'Palmera de San Juan' lanzada desde el castillo de Santa Bárbara en Alicante (en cientos)?", answer: 10, note: "Más de 1.000 cohetes de luz blanca detonados simultáneamente dando inicio a la 'Cremà'" },
    { text: "¿Cuántos litros de agua lanzan los bomberos en la tradicional 'Banyà' al público tras la quema de las hogueras de Alicante (en miles)?", answer: 10, note: "Miles de litros de agua dulce refrescando a los miles de asistentes bajo el calor del fuego" },
    { text: "¿Cuántos días dura la histórica Romería de San Benito Abad en San Cristóbal de La Laguna (Tenerife)?", answer: 1, note: "El segundo domingo de julio con la mayor concentración de carretas y parrandas canarias" },
    { text: "¿Cuántas carretas tradicionales tiradas por bueyes participan en la Romería de San Benito en La Laguna (en decenas)?", answer: 5, note: "Más de medio centenar de carretas repartiendo gofio amasado, papas arrugadas y vino del país" },
    { text: "¿Cuántos tipos de 'mojos' canarios tradicionales se sirven típicamente en los guachinches y mesas isleñas?", answer: 2, note: "El mojo verde (cilantro o perejil) y el mojo picón o rojo (pimienta picona y pimentón)" },
    { text: "¿Cuántas cucharadas de gofio de maíz o trigo se echan habitualmente a un tazón de leche en el desayuno canario?", answer: 3, note: "Tres o cuatro cucharadas bien colmadas para formar una papilla densa y muy energética" },
    { text: "¿Cuántos días dura la tradicional 'Festa da Arribada' en Baiona (Pontevedra) rememorando la llegada de la carabela Pinta?", answer: 3, note: "Primer fin de semana de marzo celebrando la llegada de Martín Alonso Pinzón con la noticia de América" },
    { text: "¿Cuántos días dura la Feria del Bonito de Burela en Lugo en pleno verano cantábrico?", answer: 2, note: "Degustación de toneladas de bonito del norte asado a la parrilla, cocido y en empanada" },
    { text: "¿Cuántas toneladas de bonito del norte se consumen en la fiesta gastronómica de Burela?", answer: 4, note: "Alrededor de 4.000 kilos de lomos de atún blanco fresco recién desembarcado de la lonja" },
    { text: "¿Cuántos platos o cuencos de barro de gazpacho andaluz se pueden preparar con un kilo de tomates maduros?", answer: 4, note: "Entre 4 y 5 raciones emulsionadas con aceite de oliva virgen extra, pepino, pimiento y ajo" },

    // --- PORCENTAJES (%) IMPACTANTES: PLANETA, ALIMENTOS Y SALUD ---
    { text: "¿Qué porcentaje del peso de una uva fresca madura se pierde al deshidratarla para convertirla en pasa?", answer: 75, note: "Pierde tres cuartas partes de su peso en agua, concentrando intensamente sus azúcares" },
    { text: "¿Qué porcentaje de las especies de peces marinos del mundo viven asociadas a arrecifes de coral?", answer: 25, note: "Una cuarta parte de la biodiversidad marina total depende directamente de los corales" },
    { text: "¿Qué porcentaje del aceite consumido en el mundo corresponde al aceite de palma?", answer: 35, note: "El aceite vegetal más producido a nivel global por su altísimo rendimiento por hectárea" },
    { text: "¿Qué porcentaje de la madera producida en el mundo se utiliza directamente como leña para cocinar o calentarse?", answer: 50, note: "La mitad de la madera talada en el planeta sigue quemándose como combustible primario" },
    { text: "¿Qué porcentaje de los hogares españoles cuentan con al menos un teléfono móvil inteligente?", answer: 98, note: "La tasa de penetración de smartphones en España es una de las más altas del planeta" },
    { text: "¿Qué porcentaje de los seres humanos nacen con ojos de color azul en los países escandinavos?", answer: 80, note: "Una de las mayores concentraciones genéticas de iris claros de toda la Tierra" },
    { text: "¿Qué porcentaje del volumen del pan de molde industrial comercial corresponde a aire esponjoso?", answer: 65, note: "Su extrema esponjosidad se debe a la retención de gas en una masa muy hidratada" },
    { text: "¿Qué porcentaje de los diamantes en bruto encontrados en el mundo no tienen ninguna impureza visible al ojo?", answer: 5, note: "Casi todas las piedras naturales presentan diminutas inclusiones o 'piqués' minerales" },
    { text: "¿Qué porcentaje de la superficie de Escocia está cubierta por turberas y brezales?", answer: 25, note: "Un cuarto del territorio escocés son suelos ricos en turba que otorgan aroma al whisky" },
    { text: "¿Qué porcentaje de las calorías del jamón serrano curado estándar proceden de las proteínas?", answer: 50, note: "Un alimento con altísima densidad proteica de gran valor biológico" },
    { text: "¿Qué porcentaje de los españoles declaran que prefieren salir de cañas antes que de copas nocturnas?", answer: 70, note: "El 'tardeo' y el aperitivo diurno han ganado un terreno inmenso a la noche tradicional" },
    { text: "¿Qué porcentaje de los pacientes con gripe estacional desarrollan fiebre alta por encima de 38 °C?", answer: 85, note: "La fiebre súbita y el dolor muscular generalizado distinguen la gripe del catarro" },
    { text: "¿Qué porcentaje de los árboles talados en la cuenca del Amazonas se talan para crear pastos de ganado?", answer: 70, note: "La expansión ganadera extensiva es la principal causa de deforestación amazónica" },
    { text: "¿Qué porcentaje de los granos de maíz de una mazorca comercial son aptos para hacer palomitas?", answer: 0, note: "Solo una variedad específica (Zea mays everta) estalla por la presión de su corteza dura" },
    { text: "¿Qué porcentaje de agua contiene un grano de maíz de palomitas en su interior para estallar?", answer: 14, note: "El agua interna se convierte en vapor a presión y hace explotar el almidón hacia afuera" },
    { text: "¿Qué porcentaje de las personas adultas en los países occidentales beben café al menos una vez al día?", answer: 75, note: "Tres de cada cuatro adultos consumen café de forma cotidiana" },
    { text: "¿Qué porcentaje de los vuelos comerciales mundiales transportan mercancías y paquetería en sus bodegas?", answer: 80, note: "Además del equipaje de pasajeros, las bodegas mueven la mitad de la carga aérea global" },
    { text: "¿Qué porcentaje de la electricidad producida en Portugal procede de fuentes de energía renovable?", answer: 60, note: "Liderada por sus parques eólicos, presas hidroeléctricas y plantas solares" },
    { text: "¿Qué porcentaje de los incendios domésticos con sartén al fuego empeoran al echarles agua?", answer: 100, note: "¡Nunca se debe echar agua al aceite hirviendo! Provoca una bola de fuego explosiva" },
    { text: "¿Qué porcentaje de las personas experimentan sonambulismo al menos una vez en su infancia?", answer: 15, note: "Alrededor de uno de cada siete niños camina o habla dormido ocasionalmente" },

    // --- HISTORIA, CIENCIA Y ESPACIO ---
    { text: "¿En qué año se fundó el cuerpo de la Guardia Urbana de Barcelona?", answer: 1843, note: "El cuerpo de policía municipal más antiguo de la capital catalana" },
    { text: "¿En qué año se fundó la Policía Municipal de Madrid con su primer reglamento orgánico?", answer: 1838, note: "Conocidos históricamente como los 'guardias de la porra' o 'capas negras'" },
    { text: "¿En qué año se celebró la histórica Exposición Universal de Barcelona en el parque de la Ciutadella?", answer: 1888, note: "Dejó como legado monumental el Arco de Triunfo de Barcelona como entrada" },
    { text: "¿En qué año se inauguró el funicular del Tibidabo en Barcelona?", answer: 1901, note: "El primer transporte mecánico por cable de pasajeros instalado en España" },
    { text: "¿En qué año se inauguró el parque de atracciones del Monte Igueldo en San Sebastián?", answer: 1912, note: "Con su mítica 'Montaña Suiza' de madera sobre los acantilados del Cantábrico" },
    { text: "¿En qué año se inauguró el primer tramo de autopista de peaje de España (la autopista del Maresme C-32)?", answer: 1969, note: "Unió Montgat y Mataró para aliviar el tráfico de la costa catalana" },
    { text: "¿En qué año se inauguró el túnel de Guadarrama que perforó la sierra entre Madrid y Segovia?", answer: 1963, note: "Evitando el peligroso paso invernal por el puerto de Los Leones" },
    { text: "¿En qué año se produjo el primer alunizaje con un vehículo lunar todoterreno tripulado (Apolo 15)?", answer: 1971, note: "David Scott y James Irwin condujeron por primera vez un coche sobre la superficie de la Luna" },
    { text: "¿Cuántos kilómetros recorrieron en total los astronautas con el Rover lunar en la misión Apolo 15?", answer: 28, note: "Explorando la espectacular garganta lunar de Hadley Rille" },
    { text: "¿En qué año despegó la última misión tripulada de la NASA a la Luna (Apolo 17)?", answer: 1972, note: "Con Eugene Cernan y Harrison Schmitt; la última vez que el ser humano pisó la Luna" },

    // --- CINE, TELEVISIÓN Y CULTURA POP ---
    { text: "¿En qué año se estrenó la película española 'La lengua de las mariposas' de José Luis Cuerda?", answer: 1999, note: "Emotivo drama con Fernando Fernán Gómez como entrañable maestro republicano" },
    { text: "¿En qué año se estrenó 'Solas' de Benito Zambrano, la gran revelación del cine andaluz?", answer: 1999, note: "Ganó 5 premios Goya retratando la soledad urbana y el amor de una madre" },
    { text: "¿Cuántos premios Goya ganó la película 'El laberinto del fauno' de Guillermo del Toro en 2007?", answer: 7, note: "Arrasó en las categorías técnicas, guion original y actriz revelación para Ivana Baquero" },
    { text: "¿Cuántos premios Oscar ganó la película 'El laberinto del fauno' en la ceremonia de Hollywood?", answer: 3, note: "Mejor Fotografía, Mejor Dirección de Arte y Mejor Maquillaje" },
    { text: "¿En qué año se estrenó la comedia 'Airbag' dirigida por Juanma Bajo Ulloa?", answer: 1997, note: "Película de culto absoluta: '¡El concepto es el concepto!' con Manuel Manquiña y Karra Elejalde" },
    { text: "¿Cuántos días de viaje desenfrenado viven los protagonistas en la película 'Airbag' tras perder el anillo de boda?", answer: 3, note: "Una alocada 'road movie' persiguiendo el anillo de compromiso por puticlubs y casinos del norte" },
    { text: "¿En qué año se estrenó en cines la película de acción 'Máximo riesgo' (Cliffhanger) de Sylvester Stallone?", answer: 1993, note: "Espectacular escalada en los Dolomitas con el récord de la acrobacia aérea más cara del cine" },
    { text: "¿En qué año se estrenó la comedia de policías 'Arma letal' (Lethal Weapon) con Mel Gibson y Danny Glover?", answer: 1987, note: "Dirigida por Richard Donner, definió para siempre el género de las 'buddy movies'" },
    { text: "¿Cuántas películas cinematográficas oficiales componen la saga completa de 'Arma letal'?", answer: 4, note: "Estrenadas entre 1987 y 1998 dirigidas todas ellas por Richard Donner" },
    { text: "¿Cuántas temporadas duró en emisión la mítica serie juvenil 'Compañeros' en Antena 3?", answer: 9, note: "Más de 120 episodios con Quimi y Valle en el colegio Azcona entre 1998 y 2002" },

    // --- DEPORTES Y HAZAÑAS ---
    { text: "¿Cuántos campeonatos del mundo de motociclismo en la categoría de 500cc / MotoGP ganó el estadounidense Mick Doohan?", answer: 5, note: "Cinco títulos mundiales consecutivos con Repsol Honda entre 1994 y 1998" },
    { text: "¿Cuántos campeonatos del mundo de motociclismo en categoría de 500cc ganó el mítico Wayne Rainey?", answer: 3, note: "Tricampeón consecutivo con Yamaha entre 1990 y 1992" },
    { text: "¿Cuántos mundiales de 500cc conquistó el piloto español Álex Crivillé?", answer: 1, note: "En 1999 se convirtió en el primer español en ganar el mundial en la categoría reina del motociclismo" },
    { text: "¿Cuántos mundiales de motociclismo en total ganó el legendario piloto español Jorge Martínez 'Aspar'?", answer: 4, note: "Tres títulos en 80cc y uno en 125cc" },
    { text: "¿Cuántos mundiales de motociclismo en total ganó el piloto mallorquín Jorge Lorenzo?", answer: 5, note: "Dos títulos en 250cc y tres campeonatos de MotoGP (2010, 2012 y 2015)" },
    { text: "¿Cuántos mundiales de motociclismo en total ganó el piloto barcelonés Dani Pedrosa?", answer: 3, note: "Uno en 125cc y dos consecutivos en 250cc con el equipo Honda" },
    { text: "¿Cuántos títulos de Liga de Primera División española tiene el Getafe Club de Fútbol?", answer: 0, note: "Finalista de la Copa del Rey en dos ocasiones consecutivas (2007 y 2008)" },
    { text: "¿Cuántos títulos de Copa del Rey de fútbol tiene en sus vitrinas el Rayo Vallecano?", answer: 0, note: "Alcanzó las semifinales de Copa en dos ocasiones históricas (1982 y 2022)" },
    { text: "¿Cuántos títulos de Copa del Rey tiene el Girona Fútbol Club?", answer: 0, note: "El club gerundense ha disputado cuartos de final de Copa como su mejor registro histórico" },
    { text: "¿Cuántos títulos de Copa de Europa / Champions League masculina ha conquistado el Oporto (FC Porto)?", answer: 2, note: "Ganadas en 1987 con Artur Jorge y en 2004 con José Mourinho" },

    // --- GEOGRAFÍA POLÍTICA Y CIUDADES ---
    { text: "¿Cuántas regiones autónomas componen administrativamente la República del Perú?", answer: 25, note: "Más la provincia constitucional de Callao y la provincia de Lima" },
    { text: "¿Cuántas provincias componen la República de Chile de norte a sur?", answer: 56, note: "Repartidas a lo largo de sus 16 regiones administrativas" },
    { text: "¿Cuántos departamentos componen el territorio nacional de la República de Guatemala?", answer: 22, note: "Desde Petén en la selva norte hasta la costa del Pacífico" },
    { text: "¿Cuántos municipios componen la provincia de Soria en Castilla y León?", answer: 183, note: "La provincia con menor densidad de población de toda España (unos 9 hab/km²)" },
    { text: "¿Cuántos municipios componen la provincia de Segovia?", answer: 209, note: "Famosa por su acueducto romano, su alcázar y el cochinillo asado" },
    { text: "¿Cuántos municipios componen la provincia de Ávila?", answer: 248, note: "Custodiada por la sierra de Gredos y sus murallas medievales" },
    { text: "¿Cuántos municipios componen la provincia de Salamanca?", answer: 362, note: "La segunda provincia con mayor número de municipios de España tras Burgos" },
    { text: "¿Cuántos municipios componen la provincia de Palencia?", answer: 191, note: "Cuna del románico palentino y del Canal de Castilla" },
    { text: "¿Cuántos municipios componen la provincia de León?", answer: 211, note: "La provincia más extensa del noroeste peninsular" },
    { text: "¿Cuántos municipios componen la provincia de Zamora?", answer: 216, note: "La ciudad con mayor concentración de iglesias románicas urbanas de Europa" },

    // --- CURIOSIDADES COTIDIANAS Y DATOS DIVERTIDOS ---
    { text: "¿Cuántos centímetros mide la longitud de un palillo de dientes de madera estándar?", answer: 6, note: "Mide exactamente unos 6,5 centímetros torneado en madera de abedul" },
    { text: "¿Cuántos dientes tiene una cremallera metálica de pantalón vaquero estándar (en decenas)?", answer: 8, note: "Aproximadamente 70 a 90 dientes metálicos que encajan al deslizar el cursor" },
    { text: "¿Cuántos agujeros de sujeción tiene un botón clásico de camisa masculina estándar?", answer: 4, note: "Cuatro perforaciones cosidas en cruz o en paralelo para máxima resistencia al tirón" },
    { text: "¿Cuántos botones suele tener la manga de una chaqueta de traje de vestir elegante clásica?", answer: 4, note: "Cuatro botones decorativos o practicables en el puño de la bocamanga" },
    { text: "¿Cuántos botones suele llevar abrochados una camisa de vestir de manga larga masculina estándar?", answer: 7, note: "Uno en el cuello y seis a lo largo de la tapeta frontal" },
    { text: "¿Cuántas cuchillas tiene un cabezal de afeitado de maquinilla manual desechable moderna de gama alta?", answer: 5, note: "Cinco hojas de corte escalonadas para un apurado progresivo sin tirones" },
    { text: "¿Cuántos minutos tarda en hervir un huevo duro tradicional en agua hirviendo para que la yema quede cuajada?", answer: 10, note: "Exactamente 10 minutos desde que el agua rompe a hervir con fuerza" },
    { text: "¿Cuántos minutos tarda en cocerse un huevo 'pasado por agua' con la clara cuajada y yema líquida?", answer: 3, note: "Tres a cuatro minutos exactos de inmersión en agua hirviendo" },
    { text: "¿Cuántos minutos de cocción necesita un huevo 'mollet' para que la clara quede firme y la yema semilíquida?", answer: 6, note: "Seis minutos justos y enfriado rápido en agua con hielo para pelarlo" },
    { text: "¿Cuántos gramos de pasta seca (macarrones o espaguetis) se calculan tradicionalmente por ración individual?", answer: 100, note: "El estándar culinario universal de 80 a 100 gramos por comensal" },
    // --- MEGATANDA 17: FOLKLORE ESPAÑOL, FIESTAS Y TRADICIONES POPULARES ---
    { text: "¿Cuántos kilos de tomates se lanzan al Cipotegato en la plaza del Ayuntamiento de Tarazona (Zaragoza, en miles)?", answer: 10, note: "Más de 10.000 kilos de tomates maduros arrojados el 27 de agosto mientras cruza la multitud encapuchado" },
    { text: "¿En qué día de agosto sale el Cipotegato en Tarazona dando inicio a las fiestas generales de San Atilano?", answer: 27, note: "El 27 de agosto a las doce en punto del mediodía tras sonar las campanadas" },
    { text: "¿Cuántos días dura el tradicional 'Entroido' o carnaval ancestral de Laza y Verín en Ourense (en semanas)?", answer: 1, note: "Más de una semana con los Peliqueiros, Cigarrones, la batalla de harina y la bajada de la Morena" },
    { text: "¿Cuántos cencerros o 'chocas' lleva atados a la cintura un Peliqueiro o Cigarrón en el Entroido gallego?", answer: 6, note: "Seis cencerros grandes de bronce que tintinean al unísono al correr y saltar por las calles" },
    { text: "¿Cuántos kilos puede llegar a pesar la pesada careta de madera tallada con mitra de un Peliqueiro de Laza?", answer: 3, note: "Labrada en madera de abedul o pino con pieles de animal y plumas en la parte posterior" },
    { text: "¿Cuántos millones de flores naturales (dalias y claveles) engalanan las carrozas en la 'Batalla de Flores' de Laredo (Cantabria)?", answer: 1, note: "Más de un millón y medio de pétalos clavados uno a uno con alfileres la noche previa" },
    { text: "¿Cuántas horas ininterrumpidas dura la 'Noche Mágica' de clavado de flores en Laredo antes del desfile?", answer: 12, note: "Pueblo y peñas trabajando sin dormir toda la madrugada para que la flor no se marchite" },
    { text: "¿Cuántos días dura la Fiesta de la Reconquista de Vigo rememorando la expulsión de las tropas de Napoleón?", answer: 3, note: "Último fin de semana de marzo recreando el asalto popular a la puerta de Gamboa de 1809" },
    { text: "¿En qué año expulsaron los vecinos de Vigo a las tropas napoleónicas convirtiéndose en la primera villa de Europa en lograrlo?", answer: 1809, note: "El 28 de marzo de 1809, hazaña por la que la corona le otorgó el título de ciudad 'Fiel, Leal y Valerosa'" },
    { text: "¿Cuántas parejas de gigantes desfilan tradicionalmente en las comparsas municipales de Pamplona o Barcelona?", answer: 4, note: "Cuatro parejas representando a los cuatro continentes conocidos antiguamente (Europa, Asia, África y América)" },
    { text: "¿Cuántos cabezudos suelen acompañar a los gigantes en las comparsas tradicionales de fiestas populares?", answer: 6, note: "Personajes satíricos persiguiendo a los niños armados con vejigas de cerdo infladas o vergas" },
    { text: "¿Cuántos días dura la tradicional Feria de San Agustín de Linares (Jaén) a finales de agosto?", answer: 6, note: "Famosa en el mundo taurino por ser la plaza donde Manolete recibió su fatal cornada en 1947" },
    { text: "¿En qué año recibió Manolete la cornada mortal del toro 'Islero' de Miura en la plaza de Linares?", answer: 1947, note: "El 28 de agosto de 1947, una tragedia que conmocionó a toda la sociedad española" },
    { text: "¿Cuántos años tenía Manolete cuando falleció en el hospital de Linares tras la cornada de Islero?", answer: 30, note: "Manuel Rodríguez 'Manolete' tenía solo 30 años en la cima de su gloria" },
    { text: "¿Cuántos días dura la Fiesta de la Aceituna en Martos (Jaén), cuna mundial del olivar, a primeros de diciembre?", answer: 3, note: "Celebrando el inicio oficial de la campaña de recolección de aceituna picual con el reparto de hoyo aceitunero" },
    { text: "¿Cuántos litros de aceite de oliva virgen extra se reparten en el tradicional 'Hoyo' aceitunero de Martos (en cientos)?", answer: 1, note: "Pan con aceite, bacalao y aceitunas repartido a miles de asistentes en el auditorio municipal" },
    { text: "¿Cuántos días dura el festival de música y cultura 'Pirineos Sur' sobre el escenario flotante de Lanuza (Huesca, en semanas)?", answer: 3, note: "Tres fines de semana de conciertos multiculturales sobre las aguas del embalse de Lanuza" },
    { text: "¿Cuántas barricas de roble suelen componer una 'andana' o escala tradicional en una solera de vino de Jerez?", answer: 3, note: "Tres o cuatro niveles: el suelo (solera), primera criadera y segunda criadera" },
    { text: "¿Cuántos años de vejez media garantiza un vino de Jerez calificado como VOS (Vinum Optimum Signatum)?", answer: 20, note: "Al menos 20 años certificados por el Consejo Regulador mediante cata y carbono 14" },
    { text: "¿Cuántos años de vejez media mínima garantiza un vino de Jerez calificado como VORS (Vinum Optimum Rarum Signatum)?", answer: 30, note: "Al menos 30 años de crianza ininterrumpida en el sistema de criaderas y soleras" },
    { text: "¿Cuántas horas tarda habitualmente el recorrido procesional de la Virgen de las Angustias, patrona de Granada?", answer: 4, note: "Último domingo de septiembre con una multitudinaria lluvia de flores a su paso" },
    { text: "¿Cuántas toneladas de flores componen la ofrenda a la Virgen de las Angustias en Granada (en decenas)?", answer: 2, note: "Más de 20 toneladas de flores que cubren la fachada de su basílica en la Carrera de la Virgen" },
    { text: "¿Cuántas carretas rocieras cruzan habitualmente el río Guadalquivir en la barcaza de Coria del Río cada primavera (en decenas)?", answer: 3, note: "Decenas de hermandades sevillanas cruzando el río camino de la aldea del Rocío" },
    { text: "¿Cuántos minutos dura reglamentariamente la bendición de los campos en la tradicional Romería de San Isidro en los pueblos?", answer: 15, note: "El sacerdote bendice los cuatro puntos cardinales pidiendo lluvia y buenas cosechas" },
    { text: "¿Cuántas hogueras o 'luminarias' se encienden en la fiesta de San Antón en los pueblos de España en enero (en decenas)?", answer: 10, note: "Bendición masiva de animales domésticos y de campo al calor del fuego purificador" },

    // --- PORCENTAJES (%) EXTRAORDINARIOS: SOCIEDAD, TIERRA Y CONSUMO ---
    { text: "¿Qué porcentaje del peso de un grano de café verde se pierde durante el tueste comercial?", answer: 18, note: "Evaporación de agua libre y ligada que deja el grano poroso y ligero" },
    { text: "¿Qué porcentaje de las especies de peces de río de la península ibérica son endémicas (únicas de nuestros ríos)?", answer: 70, note: "Barbos, bogas y bermejuelas que no existen en ninguna otra parte del continente europeo" },
    { text: "¿Qué porcentaje de las calorías del jamón de cebo ibérico proceden de las grasas?", answer: 50, note: "La infiltración grasa en las fibras musculares es la clave de su textura melosa" },
    { text: "¿Qué porcentaje del territorio de Portugal está cubierto por bosques y zonas forestales?", answer: 36, note: "Dominado por eucaliptos, pinos bravos y alcornocales en el sur" },
    { text: "¿Qué porcentaje de los hogares españoles tienen contratada al menos una plataforma de series en streaming?", answer: 80, note: "Netflix, Prime Video, HBO Max o Disney+ presentes en cuatro de cada cinco hogares" },
    { text: "¿Qué porcentaje de los diamantes que se compran en las joyerías de España son de talla brillante redonda?", answer: 85, note: "La talla clásica de 57 facetas que maximiza la refracción de la luz" },
    { text: "¿Qué porcentaje de los vuelos comerciales europeos sobrevuelan al menos un país extranjero en su ruta?", answer: 75, note: "Dada la cercanía de las fronteras europeas frente a las distancias de EE.UU." },
    { text: "¿Qué porcentaje de los días del año llueve en la ciudad de Santiago de Compostela de media?", answer: 40, note: "Alrededor de 140 días de lluvia anuales alimentando su célebre verdor gallego" },
    { text: "¿Qué porcentaje del peso de una alcachofa fresca recién comprada se desecha al retirar hojas duras y tallo?", answer: 60, note: "Solo el tierno corazón y la base representan el 40% comestible del vegetal" },
    { text: "¿Qué porcentaje de los adultos reconocen que no apagan nunca el teléfono móvil ni para dormir?", answer: 85, note: "La inmensa mayoría lo deja cargando en la mesilla en modo reposo o silencio" },
    { text: "¿Qué porcentaje de los accidentes de tráfico mortales en autopista se producen por salidas de vía?", answer: 35, note: "Distracciones, somnolencia o velocidad inadecuada que provocan choques con biondas" },
    { text: "¿Qué porcentaje del territorio de la península ibérica drena sus aguas hacia el océano Atlántico?", answer: 70, note: "Duero, Tajo, Guadiana, Guadalquivir y Miño vierten al Atlántico; el 30% restante al Mediterráneo" },
    { text: "¿Qué porcentaje de la sal marina consumida en España proviene de salinas tradicionales del litoral andaluz y levantino?", answer: 90, note: "Aprovechan la intensa evaporación solar y el viento de levante" },
    { text: "¿Qué porcentaje de los españoles declaran que prefieren la cerveza muy fría o helada?", answer: 90, note: "En copa helada o caña recién tirada, el estándar del verano español" },
    { text: "¿Qué porcentaje de los vuelos entre Madrid y Barcelona se realizan hoy en tren de alta velocidad AVE frente al avión?", answer: 80, note: "El tren de alta velocidad arrebató cuatro de cada cinco pasajeros al puente aéreo" },
    { text: "¿Qué porcentaje de los jóvenes españoles usan TikTok a diario para informarse o entretenerse?", answer: 65, note: "La red social de mayor crecimiento de consumo audiovisual entre menores de 30 años" },
    { text: "¿Qué porcentaje de las calorías del plátano provienen del almidón cuando la piel está verde sin madurar?", answer: 80, note: "Almidón resistente que madura convirtiéndose en fructosa y sacarosa dulce" },
    { text: "¿Qué porcentaje de los árboles de hoja caduca del hemisferio norte cambian el color de su follaje a amarillo o rojo en otoño?", answer: 100, note: "La retirada de la clorofila verde deja al descubierto los pigmentos carotenoides y antocianinas" },
    { text: "¿Qué porcentaje de la madera utilizada en las duelas de las barricas de vino español es roble americano o francés?", answer: 95, note: "Las dos maderas reinas indiscutibles de la enología mundial" },
    { text: "¿Qué porcentaje de los españoles toman café con cafeína frente al café descafeinado?", answer: 75, note: "Tres de cada cuatro consumidores buscan el estímulo estimulante matutino" },

    // --- HISTORIA, CIENCIA Y ESPACIO ---
    { text: "¿En qué año se fundó el cuerpo de los Mossos d'Esquadra en Cataluña por el capitán general marqués de Castel-Rodrigo?", answer: 1719, note: "Uno de los cuerpos policiales civiles más antiguos de toda Europa" },
    { text: "¿En qué año se fundó la policía autonómica vasca (Ertzaintza) tras la aprobación del Estatuto de Gernika?", answer: 1982, note: "Desplegada inicialmente para la seguridad ciudadana y el tráfico rural" },
    { text: "¿En qué año se inauguró el primer Museo de la Ciencia de España (CosmoCaixa) en Barcelona?", answer: 1981, note: "Pionero en la divulgación científica interactiva: 'Prohibido no tocar'" },
    { text: "¿En qué año se inauguró la Ciudad de las Artes y las Ciencias de Valencia con la apertura del Hemisfèric?", answer: 1998, note: "El colosal complejo vanguardista diseñado por Santiago Calatrava y Félix Candela" },
    { text: "¿En qué año se inauguró el Oceanogràfic de Valencia, el mayor acuario de Europa?", answer: 2003, note: "Alberga más de 45.000 seres vivos de 500 especies acuáticas diferentes" },
    { text: "¿En qué año pisó el primer astronauta de origen hispano el espacio (Arnaldo Tamayo Méndez)?", answer: 1980, note: "Cosmonauta cubano a bordo de la nave soviética Soyuz 38" },
    { text: "¿En qué año voló al espacio el primer astronauta español de la historia (Pedro Duque)?", answer: 1998, note: "A bordo del transbordador espacial Discovery de la NASA en la misión STS-95" },
    { text: "¿En qué año voló Pedro Duque por segunda vez al espacio en la misión 'Cervantes' a la Estación Espacial Internacional?", answer: 2003, note: "A bordo de la nave rusa Soyuz TMA-3 durante diez días de experimentos" },
    { text: "¿En qué año se lanzó el satélite español Hispasat 1A, el primer satélite de comunicaciones nacional?", answer: 1992, note: "Puesto en órbita por un cohete Ariane 4 desde la base de Kourou en la Guayana Francesa" },
    { text: "¿En qué año concluyó la construcción del Monasterio de San Lorenzo de El Escorial por Juan de Herrera?", answer: 1584, note: "Construido en tiempo récord de 21 años bajo el mandato del rey Felipe II" },

    // --- CINE, TELEVISIÓN Y CULTURA POP ---
    { text: "¿En qué año se estrenó en cines la película cómica española 'La gran aventura de Mortadelo y Filemón'?", answer: 2003, note: "Dirigida por Javier Fesser con Benito Pocino y Pepe Viyuela, vista por 5 millones de espectadores" },
    { text: "¿Cuántos premios Goya ganó la película 'La gran aventura de Mortadelo y Filemón' en la gala de 2004?", answer: 5, note: "Arrasó en dirección artística, efectos especiales, montaje, dirección de producción y maquillaje" },
    { text: "¿En qué año se publicó la primera historieta cómica de Mortadelo y Filemón por Francisco Ibáñez?", answer: 1958, note: "El 20 de enero de 1958 en la revista infantil 'Pulgarcito'" },
    { text: "¿Cuántos pelos tiene el personaje de cómic Mortadelo en la parte superior de su calva?", answer: 2, note: "Dos solitarios pelillos negros dibujados magistralmente por Ibáñez" },
    { text: "¿Cuántos pelos tiene el personaje de Filemón en su cabeza calva?", answer: 2, note: "Dos pelos rígidos en la parte frontal de su cabeza" },
    { text: "¿En qué año se estrenó la película española 'El bola' dirigida por Achero Mañas?", answer: 2000, note: "Ganadora de 4 premios Goya retratando el maltrato infantil y la amistad adolescente" },
    { text: "¿En qué año se estrenó la película de suspense 'La caja 507' protagonizada por Antonio Resines y José Coronado?", answer: 2002, note: "Dirigida por Enrique Urbizu, un descarnado thriller sobre corrupción en la Costa del Sol" },
    { text: "¿Cuántos premios Goya ganó el thriller policíaco 'No habrá paz para los malvados' de Enrique Urbizu en 2012?", answer: 6, note: "Incluyendo Mejor Película, Mejor Director y Mejor Actor para José Coronado (inspector Santos Trinidad)" },
    { text: "¿Cuántas temporadas duró en emisión la mítica serie carcelaria española 'Vis a vis'?", answer: 4, note: "Más el posterior spin-off 'Vis a vis: El oasis' con Najwa Nimri y Maggie Civantos" },
    { text: "¿Cuántos episodios componen la célebre serie española 'La casa de papel' sumando sus cinco partes?", answer: 41, note: "El fenómeno televisivo en habla hispana más visto de la historia de Netflix en todo el mundo" },

    // --- DEPORTES Y HAZAÑAS ---
    { text: "¿Cuántos títulos de Liga de Primera División española tiene en sus vitrinas el Real Oviedo?", answer: 0, note: "Pese a sus 38 temporadas en la élite, logró el tercer puesto liguero en tres ocasiones históricas" },
    { text: "¿Cuántos títulos de Copa del Rey de fútbol ha conquistado el Granada Club de Fútbol?", answer: 0, note: "Subcampeón de Copa en la histórica final de 1959 perdiendo ante el FC Barcelona" },
    { text: "¿Cuántos títulos de Copa del Rey tiene la Unión Deportiva Almería?", answer: 0, note: "Alcanzó las semifinales de la Copa del Rey en la temporada 2010-11" },
    { text: "¿Cuántos títulos de Copa de la UEFA / Europa League tiene el Atlético de Madrid?", answer: 3, note: "Campeón continental en 2010 (con Quique Sánchez Flores), 2012 y 2018 (con el Cholo Simeone)" },
    { text: "¿Cuántas Supercopas de Europa de la UEFA ha ganado el Atlético de Madrid (con 100% de victorias en finales)?", answer: 3, note: "Ganó las tres finales que disputó en 2010 (al Inter), 2012 (al Chelsea) y 2018 (al Real Madrid)" },
    { text: "¿Cuántos puntos de ventaja sobre el segundo clasificado logró el récord histórico de LaLiga conseguido por el FC Barcelona de Tito Vilanova (2012-13)?", answer: 15, note: "Cerró la liga con 100 puntos frente a los 85 del Real Madrid" },
    { text: "¿Cuántos puntos sumaron el Real Madrid de Mourinho (2012) y el Barça de Vilanova (2013) para fijar el récord de puntos de LaLiga?", answer: 100, note: "El récord absoluto inalcanzable de la 'Liga de los 100 puntos'" },
    { text: "¿Cuántos goles a favor anotó el Real Madrid de José Mourinho en LaLiga 2011-12 (récord histórico goleador)?", answer: 121, note: "Una media descomunal de más de 3 goles por partido a lo largo de 38 jornadas" },
    { text: "¿Cuántos campeonatos del mundo de maratón en ruta ha conquistado el legendario atleta keniata Eliud Kipchoge en Juegos Olímpicos?", answer: 2, note: "Bicampeón olímpico consecutivo en Río 2016 y Tokio 2020" },
    { text: "¿Cuántas horas tardó Eliud Kipchoge en romper por primera vez de forma no oficial la barrera de las 2 horas en maratón en Viena?", answer: 1, note: "Paró el cronómetro en 1 hora, 59 minutos y 40 segundos en el reto INEOS 1:59" },

    // --- GEOGRAFÍA POLÍTICA Y CIUDADES ---
    { text: "¿Cuántos estados federales componen los Estados Unidos Mexicanos?", answer: 31, note: "31 estados autónomos más la Ciudad de México como entidad federal capitalina" },
    { text: "¿Cuántas provincias componen la República Dominicana?", answer: 31, note: "Repartidas por toda la geografía oriental de la isla de La Española" },
    { text: "¿Cuántos municipios componen la provincia de Cuenca en Castilla-La Mancha?", answer: 238, note: "Conocida por su serranía y su monumental hoz del río Huécar" },
    { text: "¿Cuántos municipios componen la provincia de Guadalajara?", answer: 288, note: "Limita con Madrid, Segovia, Soria, Zaragoza, Teruel y Cuenca" },
    { text: "¿Cuántos municipios componen la provincia de Jaén en Andalucía?", answer: 97, note: "El mayor mar de olivos del mundo con más de 66 millones de olivos plantados" },
    { text: "¿Cuántos municipios componen la provincia de Huelva?", answer: 80, note: "Cuna del Descubrimiento de América y del Parque Nacional de Doñana" },
    { text: "¿Cuántos municipios componen la provincia de Cádiz?", answer: 45, note: "Repartidos entre la Bahía de Cádiz, la campiña de Jerez y la Sierra de Grazalema" },
    { text: "¿Cuántas puertas de acceso monumentales se conservan en la muralla medieval de Ávila?", answer: 9, note: "Destacando la monumental Puerta del Alcázar y la Puerta de San Vicente" },
    { text: "¿Cuántos torreones semicirculares almenados componen la muralla románica de Ávila?", answer: 87, note: "La muralla medieval mejor conservada de toda Europa con 2,5 km de perímetro" },
    { text: "¿Cuántos kilómetros de longitud tiene el río Ebro desde Fontibre hasta su delta en Tarragona?", answer: 910, note: "El segundo río más largo de la península ibérica y el más caudaloso enteramente español" },

    // --- CURIOSIDADES POPULARES Y DEL DÍA A DÍA ---
    { text: "¿Cuántas hojas de afeitar desechables de recambio suele incluir un paquete comercial estándar de farmacia?", answer: 5, note: "El clásico blíster dispensador de 5 o 10 hojas de acero sueco" },
    { text: "¿Cuántas ruedas motrices impulsan una carretilla elevadora de almacén (toro mecánico) estándar?", answer: 2, note: "Tracción en las ruedas delanteras y dirección en las traseras para un radio de giro mínimo" },
    { text: "¿Cuántas ruedas tiene una carretilla tradicional de albañilería u obra de jardín?", answer: 1, note: "Una sola rueda frontal neumática que permite pivotar y descargar volteando" },
    { text: "¿Cuántos mangos o varales de empuje tiene una carretilla tradicional de obra?", answer: 2, note: "Dos empuñaduras ergonómicas separadas para levantar el peso con ambos brazos" },
    { text: "¿Cuántas patas de apoyo traseras tiene una carretilla de obra para apoyarse en el suelo al descansar?", answer: 2, note: "Dos patas metálicas que junto a la rueda delantera forman un trípode de apoyo estable" },
    { text: "¿Cuántos peldaños tiene una escalera doméstica plegable estándar de aluminio para llegar al techo de una casa?", answer: 5, note: "Cuatro peldaños anchos más la plataforma superior de seguridad a 1 metro del suelo" },
    { text: "¿Cuántas piezas de cristal o lentes componen una gafa de ver o de sol convencional estándar?", answer: 2, note: "Dos lentes ópticas montadas en sus respectivos aros oculares" },
    { text: "¿Cuántas patillas o varillas articuladas sujetan una montura de gafas tras las orejas?", answer: 2, note: "La varilla izquierda y derecha unidas al frontal mediante diminutas bisagras de tornillo" },
    { text: "¿Cuántos tornillos diminutos suelen sujetar las dos bisagras de unas gafas graduadas?", answer: 2, note: "Un microtornillo en cada bisagra lateral que a menudo se afloja con el uso diario" },
    { text: "¿Cuántos agujeros de hebilla suele tener un cinturón de vestir de cuero nuevo estándar?", answer: 5, note: "Cinco perforaciones separadas por una pulgada exacta para ajustar la cintura" },
    // --- MEGATANDA 18: FOLKLORE ESPAÑOL, FIESTAS Y TRADICIONES POPULARES ---
    { text: "¿Cuántos kilos de nabos se lanzan aproximadamente al 'Jarramplas' en Piornal (Cáceres, en miles)?", answer: 20, note: "Más de 20.000 kilos de nabos arrojados en enero contra este personaje cubierto de cintas de colores y armadura" },
    { text: "¿Cuántos días dura la tradicional fiesta de 'Jarramplas' en Piornal (Cáceres, 19 y 20 de enero)?", answer: 2, note: "En honor a San Sebastián, donde el Jarramplas recorre las calles tocando su tamboril bajo una lluvia de impactos" },
    { text: "¿Cuántos bebés nacidos en el año se colocan en colchones en la calle para que 'El Colacho' salte sobre ellos en Castrillo de Murcia (Burgos)?", answer: 10, note: "El Colacho, personificación del diablo, salta con botarga amarilla sobre los bebés para librarlos del pecado original" },
    { text: "¿En qué siglo se originó la ancestral y singular fiesta de 'El Colacho' en Castrillo de Murcia (Burgos)?", answer: 17, note: "Documentada ininterrumpidamente desde 1621 organizada por la Cofradía del Santísimo Sacramento" },
    { text: "¿Cuántos kilómetros de recorrido tiene el Descenso Internacional del Sella en piragua entre Arriondas y Ribadesella?", answer: 20, note: "Exactamente 20 kilómetros de fiesta, agua, sidra y deporte por las aguas del río Sella en Asturias" },
    { text: "¿Cuántas piraguas y palistas toman la salida simultánea en el puente de Arriondas en el Descenso del Sella (en miles)?", answer: 1, note: "Más de 1.100 palistas de decenas de países tras entonar el 'Asturias, Patria Querida'" },
    { text: "¿Cuántos días duran las Fiestas de la Magdalena en Castellón de la Plana?", answer: 9, note: "Nueve días de romería a la ermita de la Magdalena y desfiles monumentales de 'Gaiatas' iluminadas" },
    { text: "¿Cuántas 'Gaiatas' o monumentos de luz desfilan en las fiestas de la Magdalena de Castellón?", answer: 19, note: "Una por cada sector de la ciudad, elaboradas con maderas, cristales y luces artísticas" },
    { text: "¿Cuántos días dura la Fiesta Mayor de 'La Mercè' en Barcelona a finales de septiembre?", answer: 5, note: "Cinco días en honor a la patrona de Barcelona con castellers, correfocs y gigantes" },
    { text: "¿Cuántos 'diables' y bestias de fuego participan en el tradicional 'Correfoc' de La Mercè de Barcelona (en decenas)?", answer: 5, note: "Más de medio centenar de collas de diablos y dragones quemando carretillas pirotécnicas" },
    { text: "¿Cuántos minutos de fuegos artificiales y música componen el célebre 'Piromusical' de La Mercè en Montjuïc?", answer: 30, note: "Media hora de espectáculo sincronizado en la Fuente Mágica de Montjuïc despidiendo la fiesta mayor" },
    { text: "¿Cuántos litros de agua se lanzan en la popular 'Batalla Naval' de las Fiestas del Carmen de Vallecas en Madrid (en miles)?", answer: 50, note: "Más de 50.000 litros de agua arrojados con cubos y mangueras bajo el lema '¡Vallekas, puerto de mar!'" },
    { text: "¿En qué año se celebró la primera Batalla Naval reivindicativa en el barrio de Vallecas en Madrid?", answer: 1981, note: "Iniciada de forma espontánea por los vecinos en pleno calor de julio y convertida en tradición anual" },
    { text: "¿Cuántos días dura la tradicional 'Fiesta de los Patios de Córdoba' en su certamen oficial (en semanas)?", answer: 2, note: "Dos semanas de concurso público municipal declarado Patrimonio Inmaterial de la Humanidad" },
    { text: "¿Cuántos arcos y bóvedas componen la monumental lonja gótica de la seda de Valencia (Patrimonio de la Humanidad)?", answer: 8, note: "Ocho esbeltas columnas helicoidales sin capiteles que parecen palmeras de piedra" },
    { text: "¿Cuántos siglos estuvo en funcionamiento el 'Tribunal de las Aguas' de la Vega de Valencia de forma ininterrumpida?", answer: 10, note: "Más de mil años reuniéndose cada jueves a las doce en la puerta de los Apóstoles de la catedral" },
    { text: "¿Cuántos síndicos o jueces componen el Tribunal de las Aguas de Valencia?", answer: 8, note: "Uno por cada una de las ocho acequias madres de la fértil vega del río Turia" },
    { text: "¿Cuántas horas tarda la romería de la 'Bajada de la Virgen de la Peña' en Fuerteventura en septiembre?", answer: 5, note: "Peregrinos de toda la isla caminando de noche por los barrancos hasta el pueblo de Vega de Río Palmas" },
    { text: "¿Cuántos días dura la fiesta de 'La Traída del Agua' en Lomo Magullo en Gran Canaria?", answer: 1, note: "Multitudinaria fiesta popular donde miles de personas se arrojan agua de las acequias con calderos" },
    { text: "¿Cuántos tamborileros y bombistas se reúnen en la monumental 'Rompida de la Hora' de Calanda (Teruel) el Viernes Santo?", answer: 4000, note: "Miles de tambores redoblando al unísono al mediodía en la plaza del pueblo de Luis Buñuel" },
    { text: "¿Cuántos pueblos componen la famosa 'Ruta del Tambor y del Bombo' del Bajo Aragón turolense?", answer: 9, note: "Albalate del Arzobispo, Alcañiz, Alcorisa, Andorra, Calanda, Híjar, La Puebla de Híjar, Samper de Calanda y Urrea de Gaén" },
    { text: "¿Cuántas coplas se cantan tradicionalmente en los 'Mayos' manchegos a las mozas la noche del 30 de abril?", answer: 12, note: "Rondallas cantando bajo las ventanas decorando de flores las rejas" },
    { text: "¿Cuántos 'danzadores' tradicionales acompañan a la Virgen del Rosario en la fiesta de la Danza de la Enramada en Huéscar (Granada)?", answer: 8, note: "Ocho jóvenes bailando una danza ancestral con palos de madera y cintas" },
    { text: "¿Cuántas carretas rocieras cruzan cada año el Parque Nacional de Doñana para llegar al Rocío (en decenas)?", answer: 10, note: "Más de 100 hermandades atravesando los pinares y dunas del coto" },
    { text: "¿Cuántos costaleros cargan en promedio el paso del Cristo de los Gitanos en la Semana Santa de Sevilla?", answer: 36, note: "Llevando el compás con su clásico paso racheado por las calles sevillanas" },

    // --- PORCENTAJES (%) BRUTALES: CIENCIA, SOCIEDAD Y SALUD ---
    { text: "¿Qué porcentaje del peso de una cereza fresca madura es agua?", answer: 82, note: "Rica en antioxidantes naturales, potasio y azúcares de absorción moderada" },
    { text: "¿Qué porcentaje de las especies de peces marinos del mundo habitan en aguas templadas y tropicales?", answer: 80, note: "La gran mayoría de la diversidad ictiológica marina evita los extremos polares gélidos" },
    { text: "¿Qué porcentaje de las calorías del maíz dulce comercial provienen de los hidratos de carbono?", answer: 85, note: "Un cereal dulce que combina almidón complejo con azúcares sencillos" },
    { text: "¿Qué porcentaje del territorio de Dinamarca se encuentra a menos de 50 metros sobre el nivel del mar?", answer: 80, note: "Uno de los países con relieve más suave y llano de toda Europa" },
    { text: "¿Qué porcentaje de los hogares españoles cuentan con acceso a conexión de fibra óptica ultrarrápida?", answer: 90, note: "España lidera el despliegue de redes de fibra óptica en toda la Unión Europea" },
    { text: "¿Qué porcentaje de los seres humanos tienen el color de ojos castaño o negro en el continente africano y asiático?", answer: 99, note: "Los tonos oscuros son la norma biológica casi unánime en ambos continentes" },
    { text: "¿Qué porcentaje de la masa de un trozo de mantequilla tradicional comercial es grasa láctea pura?", answer: 82, note: "Por normativa europea debe contener al menos un 80% al 82% de materia grasa" },
    { text: "¿Qué porcentaje de la superficie de la isla de Tenerife está ocupada por espacios naturales protegidos?", answer: 48, note: "Casi la mitad de la isla goza de especial protección medioambiental y paisajística" },
    { text: "¿Qué porcentaje de las parejas que juegan juntas a videojuegos cooperativos declaran que mejora su complicidad?", answer: 75, note: "Resolver puzles y superar niveles en equipo fortalece los lazos afectivos" },
    { text: "¿Qué porcentaje de los pacientes con resfriado común tienen congestión nasal como síntoma principal?", answer: 90, note: "La inflamación de la mucosa y el bloqueo respiratorio es la queja más habitual" },
    { text: "¿Qué porcentaje de los diamantes en bruto extraídos del fondo del mar en Namibia son de calidad gema superior?", answer: 95, note: "El oleaje marino destruye de forma natural las piedras con fracturas o impurezas" },
    { text: "¿Qué porcentaje del café molido que compramos envasado al vacío conserva su aroma intacto si no se abre?", answer: 100, note: "La atmósfera inerte o con válvula desgasificadora previene la oxidación" },
    { text: "¿Qué porcentaje de los jóvenes españoles usan bizum para pagar su parte de la cuenta en cenas de amigos?", answer: 90, note: "Ha erradicado prácticamente las monedas sueltas y el cambio en mano en los restaurantes" },
    { text: "¿Qué porcentaje de los vuelos comerciales mundiales son operados por aviones comerciales de la factoría Airbus o Boeing?", answer: 90, note: "El duopolio aeroespacial mundial que copa prácticamente todos los cielos comerciales" },
    { text: "¿Qué porcentaje del territorio de la cuenca del río Ebro se dedica a la agricultura de regadío?", answer: 30, note: "La gran huerta cerealista, frutal y vitivinícola del norte peninsular" },
    { text: "¿Qué porcentaje de las calorías del jamón cocido (dulce) de calidad extra provienen de las proteínas?", answer: 70, note: "Un fiambre magro con bajo contenido graso frente al embutido curado tradicional" },
    { text: "¿Qué porcentaje de los adultos reconocen que guardan las cajas originales de los móviles nuevos durante meses?", answer: 80, note: "El clásico hábito de guardar la caja blanca con sus plásticos por si se vende o devuelve" },
    { text: "¿Qué porcentaje de la madera utilizada en las traviesas del ferrocarril clásico era madera de roble tratada con creosota?", answer: 90, note: "Reemplazadas hoy masivamente por traviesas de hormigón armado monobloque" },
    { text: "¿Qué porcentaje de las especies de aves rapaces nocturnas (búhos, lechuzas) tienen plumaje con bordes desflecados?", answer: 100, note: "Adaptación acústica aerodinámica que les permite volar en absoluto y total silencio" },
    { text: "¿Qué porcentaje de los españoles declaran que su época del año favorita son las vacaciones de verano?", answer: 65, note: "Dos tercios de la población prefiere el sol, la playa y las fiestas de agosto" },

    // --- HISTORIA, CIENCIA Y ESPACIO ---
    { text: "¿En qué año se fundó el cuerpo de la Guardia Civil de Tráfico en las carreteras españolas?", answer: 1959, note: "Creada para velar por la seguridad vial ante la explosión del SEAT 600 y el turismo" },
    { text: "¿En qué año se inauguró el primer Museo de Arte Contemporáneo de Madrid (hoy integrado en el Reina Sofía)?", answer: 1975, note: "En la Ciudad Universitaria, trasladado posteriormente a la sede de Atocha" },
    { text: "¿En qué año se inauguró el colosal viaducto de Millau en Francia, el puente atirantado más alto del mundo?", answer: 2004, note: "Diseñado por Michel Virlogeux y Norman Foster sobre el valle del río Tarn" },
    { text: "¿Cuántos metros de altura tiene la torre más alta del viaducto de Millau en Francia (más alta que la Torre Eiffel)?", answer: 343, note: "Alcanza los 343 metros en su pilón P2, batiendo el récord mundial de altura estructural" },
    { text: "¿En qué año se inauguró el Túnel del Simplón bajo los Alpes entre Suiza e Italia?", answer: 1906, note: "Una de las grandes proezas pioneras del ferrocarril europeo de principios del siglo XX" },
    { text: "¿En qué año despegó la nave espacial tripulada soviética Vostok 1 con Yuri Gagarin?", answer: 1961, note: "El 12 de abril de 1961: '¡Poyéjali!' (¡Vámonos!) al despegar hacia la órbita" },
    { text: "¿Cuántos minutos duró el vuelo orbital histórico de Yuri Gagarin alrededor de la Tierra?", answer: 108, note: "Completó una vuelta al globo terrestre antes de eyectarse en paracaídas sobre Kazajistán" },
    { text: "¿En qué año se lanzó la estación espacial soviética 'Mir', la primera estación modular permanente de la historia?", answer: 1986, note: "Operó durante 15 años en órbita antes de su reentrada controlada en el océano Pacífico en 2001" },
    { text: "¿En qué año se acopló el módulo ruso Zarya con el módulo estadounidense Unity naciendo la Estación Espacial Internacional (ISS)?", answer: 1998, note: "En diciembre de 1998 comenzando la mayor obra de ingeniería espacial cooperativa" },
    { text: "¿En qué año concluyó la histórica vuelta al mundo en globo sin escalas de Bertrand Piccard y Brian Jones?", answer: 1999, note: "A bordo del Breitling Orbiter 3 en 19 días de navegación aerostática continua" },

    // --- CINE, TELEVISIÓN Y CULTURA POP ---
    { text: "¿En qué año se estrenó la película española 'El milagro de Candeleda' o comedia de culto 'El abuelo' de Garci?", answer: 1998, note: "Nominada al premio Oscar a la Mejor Película Extranjera con un soberbio Fernando Fernán Gómez" },
    { text: "¿En qué año ganó José Luis Garci el primer premio Oscar de la historia para una película española con 'Volver a empezar'?", answer: 1983, note: "Protagonizada por Antonio Ferrandis y Encarna Paso con el Canon de Pachelbel" },
    { text: "¿Cuántos premios Goya ganó la película de terror española '[REC]' de Jaume Balagueró y Paco Plaza en 2008?", answer: 2, note: "Mejor Montaje y Mejor Actriz Revelación para Manuela Velasco viviendo el horror en directo" },
    { text: "¿En qué año se estrenó en cines la primera película de '[REC]' con su cámara al hombro en un edificio de Barcelona?", answer: 2007, note: "Fenómeno internacional del cine de zombis y posesiones rodado en falso documental" },
    { text: "¿Cuántas películas componen la saga cinematográfica completa de '[REC]'?", answer: 4, note: "[REC] (2007), [REC] 2 (2009), [REC] 3: Génesis (2012) y [REC] 4: Apocalipsis (2014)" },
    { text: "¿En qué año se estrenó la comedia de enredo 'Días de fútbol' de David Serrano?", answer: 2003, note: "Con Ernesto Alterio, Alberto San Juan y Fernando Tejero: '¡Que me pongo de pie!'" },
    { text: "¿Cuántos premios Goya ganó el actor Fernando Tejero por su inolvidable papel en 'Días de fútbol'?", answer: 1, note: "Premio Goya al Mejor Actor Revelación en 2004" },
    { text: "¿Cuántas temporadas se emitieron de la exitosa serie de suspense y misterio 'El internado: Laguna Negra' en Antena 3?", answer: 7, note: "Emitida entre 2007 y 2010 lanzando a la fama a Ana de Armas, Blanca Suárez y Yon González" },
    { text: "¿Cuántos episodios componen la serie original de 'El internado: Laguna Negra'?", answer: 71, note: "Con una legión de seguidores adolescentes pegados a los secretos del colegio en el bosque" },
    { text: "¿Cuántos premios Oscar ganó la película 'El silencio de los corderos' (The Silence of the Lambs) en 1992?", answer: 5, note: "Ganó los cinco grandes: Película, Director, Actor (Anthony Hopkins), Actriz (Jodie Foster) y Guion" },

    // --- DEPORTES Y HAZAÑAS ---
    { text: "¿Cuántos títulos de Liga de Primera División española tiene en sus vitrinas el Real Murcia Club de Fútbol?", answer: 0, note: "Pese a sus 18 temporadas en Primera y ser el club con más títulos de Segunda División de la historia (8 títulos)" },
    { text: "¿Cuántos títulos de campeón de Segunda División de España tiene el Real Murcia (récord absoluto de la categoría)?", answer: 8, note: "El club histórico más laureado de la categoría de plata del fútbol español" },
    { text: "¿Cuántos títulos de Liga de Primera División española ha conquistado el Hércules de Alicante?", answer: 0, note: "Histórico de Primera que llegó al quinto puesto de la tabla en 1975" },
    { text: "¿Cuántas Champions League masculinas ha conquistado el Borussia Dortmund alemán en su historia?", answer: 1, note: "Conquistada en Múnich en 1997 frente a la Juventus de Turín con gol de Lars Ricken" },
    { text: "¿Cuántas Champions League masculinas ha conquistado el club holandés Feyenoord de Róterdam?", answer: 1, note: "Campeón de Europa en 1970 frente al Celtic de Glasgow en Milán" },
    { text: "¿Cuántos títulos de campeón del mundo de motocross ha ganado el piloto gallego Jorge Prado (hasta 2024)?", answer: 4, note: "Dos coronas en MX2 y dos títulos mundiales consecutivos en la categoría reina de MXGP" },
    { text: "¿Cuántos campeonatos del mundo de patinaje de velocidad en línea ha conquistado la española Sheila Herrero (récord Guinness)?", answer: 15, note: "Quince títulos mundiales de oro entre 1994 y 2002 con la selección española" },
    { text: "¿Cuántos títulos de campeón de Europa de baloncesto de selecciones (EuroBasket masculino) tiene España (hasta 2024)?", answer: 4, note: "Oros continentales conquistados en 2009, 2011, 2015 y 2022" },
    { text: "¿Cuántas medallas olímpicas de plata tiene la selección española masculina de baloncesto en su palmarés?", answer: 3, note: "Subcampeones olímpicos en Los Ángeles 1984, Pekín 2008 y Londres 2012" },
    { text: "¿Cuántos Mundiales de Baloncesto masculino (FIBA World Cup) ha conquistado la selección española?", answer: 2, note: "Campeones del mundo en Japón 2006 (ante Grecia) y en China 2019 (ante Argentina)" },

    // --- GEOGRAFÍA POLÍTICA Y CIUDADES ---
    { text: "¿Cuántas provincias componen la República de Costa Rica en Centroamérica?", answer: 7, note: "San José, Alajuela, Cartago, Heredia, Guanacaste, Puntarenas y Limón" },
    { text: "¿Cuántas regiones componen la geografía del territorio continental de Portugal?", answer: 5, note: "Norte, Centro, Área Metropolitana de Lisboa, Alentejo y Algarve" },
    { text: "¿Cuántas comarcas oficiales componen la geografía del Principado de Asturias?", answer: 8, note: "Avilés, Caudal, Eo-Navia, Gijón, Nalón, Narcea, Oriente y Oviedo" },
    { text: "¿Cuántas comarcas componen la Comunidad Autónoma de Cantabria?", answer: 10, note: "Costa Occidental, Costa Oriental, Asón-Agüera, Trasmiera, Campoo-Los Valles, Liébana, etc." },
    { text: "¿Cuántos municipios componen la Comunidad de Madrid?", answer: 179, note: "Desde la capital con más de 3 millones hasta Madarcos con apenas medio centenar de vecinos" },
    { text: "¿Cuántos municipios componen la provincia de Álava en el País Vasco?", answer: 51, note: "Repartidos en sus siete cuadrillas históricas" },
    { text: "¿Cuántos municipios componen la provincia de Guipúzcoa?", answer: 88, note: "Donostia-San Sebastián es la capital y municipio más poblado" },
    { text: "¿Cuántos municipios componen la provincia de Vizcaya?", answer: 112, note: "Con la comarca del Gran Bilbao concentrando la mayor masa urbana" },
    { text: "¿Cuántas cuadrillas tradicionales dividen administrativamente el territorio histórico de Álava?", answer: 7, note: "La Cuadrilla de Vitoria, Ayala, Gorbeialdea, Llanada Alavesa, Montaña Alavesa, Rioja Alavesa y Añana" },
    { text: "¿Cuántos kilómetros de longitud tiene el río Nalón en Asturias (el más largo del Principado)?", answer: 153, note: "Nace en el puerto de Tarna y desemboca en el Cantábrico formando la ría de Pravia" },

    // --- CURIOSIDADES POPULARES Y DEL DÍA A DÍA ---
    { text: "¿Cuántas piezas de fruta suele contener tradicionalmente un racimo de plátanos de Canarias comercial mediano (en unidades)?", answer: 15, note: "Suele oscilar entre 12 y 18 piezas agrupadas en una 'mano' de plátanos" },
    { text: "¿Cuántos agujeros suele tener un rallador de cocina metálico de cuatro caras en su cara de rallado fino (en cientos)?", answer: 1, note: "Más de 100 diminutas cuchillas de corona para rallar queso curado o nuez moscada" },
    { text: "¿Cuántas caras de corte diferentes tiene un rallador de cocina doméstico prismático tradicional?", answer: 4, note: "Rallado grueso, fino, laminador de pepino y rallador en polvo" },
    { text: "¿Cuántas aspas giratorias tiene habitualmente una batidora de mano doméstica (minipimer)?", answer: 2, note: "Dos o cuatro cuchillas de acero inoxidable rotando a miles de revoluciones por minuto" },
    { text: "¿Cuántas ruedas suele tener una maleta de viaje de cabina moderna tipo 'spinner' de cuatro apoyos?", answer: 4, note: "Cuatro ruedas dobles multidireccionales que permiten girarla 360 grados sin esfuerzo" },
    { text: "¿Cuántos compartimentos con cremallera suele tener una mochila escolar estándar moderna?", answer: 3, note: "Bolsillo principal para libros, intermedio para estuche y frontal de acceso rápido" },
    { text: "¿Cuántas anillas suele tener una libreta escolar de encuadernación en espiral clásica (en decenas)?", answer: 4, note: "Aproximadamente 40 a 50 espiras metálicas en espiral continua" },
    { text: "¿Cuántas anillas tienen las carpetas archivadoras de oficina estándar de palanca?", answer: 2, note: "Dos anillas metálicas gruesas accionadas por una palanca lateral de compresión" },
    { text: "¿Cuántos separadores de colores suele incluir un bloc de notas multiasignatura estándar?", answer: 4, note: "Cuatro a seis bandas de colores en los márgenes de las hojas para clasificar temas" },
    { text: "¿Cuántos lados tiene un lápiz de madera escolar hexagonal clásico para evitar que ruede por la mesa?", answer: 6, note: "El diseño hexagonal de seis caras patentado para un agarre ergonómico perfecto" }
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

    // Comprobamos si el capitán se ha quedado solo (nadie más se subió al coche)
    const passengersInCar = room.players.filter(
      (p) => p.id !== room.captainId && (room.decisions[p.id] ?? "LEAVE") === "STAY"
    ).length;
    const isCaptainAlone = room.players.length > 1 && passengersInCar === 0;

    room.latestResults = room.players.map((player) => {
      const isCaptain = player.id === room.captainId;
      const decision = isCaptain ? "STAY" : (room.decisions[player.id] ?? "LEAVE");
      let pointsEarned: number;

      if (success) {
        if (room.isTriplazo) {
          // Triplazo acertado clavado (subido a 10 puntos)
          pointsEarned = isCaptain ? 10 : (decision === "STAY" ? 4 : -1);
        } else if (isExactMatch) {
          // Apuesta normal clavada exacta
          pointsEarned = isCaptain ? 6 : (decision === "STAY" ? 3 : -1);
        } else {
          // No se estrella
          pointsEarned = isCaptain ? 5 : (decision === "STAY" ? 2 : -1);
        }

        // DOBLE BONUS: Si el capitán iba solo en el coche, suma +2 puntos extra
        if (isCaptain && isCaptainAlone) {
          pointsEarned += 2;
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
