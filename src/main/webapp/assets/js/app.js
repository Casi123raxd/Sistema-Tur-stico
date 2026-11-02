/**
 * COTAPATA EXPLORA — SISTEMA INTEGRADO DE INFORMACIÓN TURÍSTICA COMUNITARIA
 * Archivo: assets/js/app.js
 * Aplicación Web Unificada, Responsiva y Bilingüe (Mobile-First / Desktop)
 * Universidad Salesiana de Bolivia (USB) · Carrera de Ingeniería de Sistemas
 */

// Estado global de la aplicación
const AppState = {
    idioma: 'es', // 'es' o 'en'
    seccionActual: 'inicio',
    especies: [],
    servicios: [],
    atractivos: [],
    rutas: [],
    recomendaciones: [],
    filtroEspecie: 'todos',
    busquedaEspecie: '',
    filtroServicio: 'todas',
    filtroServicioCat: 'todas',
    filtroServicioCom: 'todas',
    mapaIniciado: false,
    mapaInstancia: null,
    audioActual: null,
    especieSeleccionada: null
};

// ==============================================================================
// DATASET DE RESPALDO INTEGRADO (ACADÉMICO, EXPANSIÓN COMPLETA DE 20 FAUNA Y 20 FLORA)
// Garantiza funcionamiento 100% autónomo (offline, local o en caso de latencia de API)
// ==============================================================================
const DATASET_ESPECIES_DEFAULT = [
    // --- 20 ESPECIES DE FAUNA ---
    {
        id: 1,
        tipo: 'fauna',
        categoriaFauna: 'mamifero',
        nombreEs: 'Oso Andino / Jucumari',
        nombreEn: 'Andean Bear / Jucumari',
        cientifico: 'Tremarctos ornatus',
        habitatEs: 'Bosques de niebla y ceja de monte (1,800 - 3,400 msnm)',
        habitatEn: 'Cloud forests and high montane woodlands (1,800 - 3,400 m)',
        dietaEs: 'Omnívoro (90% vegetal: bromelias, palmitos, orquídeas, bayas y pequeños vertebrados)',
        dietaEn: 'Omnivore (90% plants: bromeliads, palm hearts, orchids, berries and small vertebrates)',
        estadoConservacion: 'Vulnerable (VU)',
        descripcionEs: 'Especie paraguas del Parque Nacional Cotapata y el único oso nativo de Sudamérica. Es vital para la dispersión de grandes semillas y la regeneración del dosel boscoso.',
        descripcionEn: 'Umbrella species of Cotapata National Park and South America’s only native bear. Vital for dispersing large seeds and regenerating high forest canopy.',
        datoCuriosoEs: 'Las manchas blanco-amarillentas alrededor de sus ojos, hocico y pecho son únicas en cada oso, funcionando como una huella dactilar humana.',
        datoCuriosoEn: 'The cream-colored facial rings and chest patches are completely unique to each bear, serving as a biological fingerprint.',
        imagen: 'oso-frontino-2-1.jpg',
        audio: 'Sonido Oso jukumari.mp3',
        tieneAudio: true,
        esEndemica: false
    },
    {
        id: 2,
        tipo: 'fauna',
        categoriaFauna: 'mamifero',
        nombreEs: 'Puma',
        nombreEn: 'Cougar / Mountain Lion',
        cientifico: 'Puma concolor',
        habitatEs: 'Gradiente altitudinal completo: valles yungueños a pedregales andinos (1,200 - 4,500 msnm)',
        habitatEn: 'Entire elevation gradient: Yungas valleys to rocky Andean screes (1,200 - 4,500 m)',
        dietaEs: 'Carnívoro estricto (venados andinos, pecaríes, jochis, roedores y camélidos)',
        dietaEn: 'Strict carnivore (Andean deer, peccaries, agoutis, mountain rodents, and camelids)',
        estadoConservacion: 'Preocupación Menor (LC)',
        descripcionEs: 'El mayor felino de la Cordillera Real. Depredador sigiloso y solitario que mantiene el equilibrio biológico de ungulados y mamíferos medianos.',
        descripcionEn: 'The largest feline in the Royal Andes. Solitary and stealthy apex predator balancing wild ungulates and medium mammals.',
        datoCuriosoEs: 'No puede rugir debido a la anatomía de su laringe no osificada; en su lugar ronronea fuertemente como un gato y emite silbidos de alta frecuencia.',
        datoCuriosoEn: 'Anatomically unable to roar, it produces high-pitched whistles, bird-like chirps, and loud cat-like purrs.',
        imagen: 'large (1).jpg',
        audio: 'Sonido Puma.mp3',
        tieneAudio: true,
        esEndemica: false
    },
    {
        id: 3,
        tipo: 'fauna',
        categoriaFauna: 'mamifero',
        nombreEs: 'Marimono / Mono Araña del Sur',
        nombreEn: 'Black-faced Spider Monkey',
        cientifico: 'Ateles chamek',
        habitatEs: 'Estrato superior y dosel de bosques húmedos montanos (1,000 - 2,000 msnm)',
        habitatEn: 'Upper canopy of humid montane cloud forests (1,000 - 2,000 m)',
        dietaEs: 'Frugívoro especialista (frutos carnosos maduros, higos silvestres, semillas y brotes)',
        dietaEn: 'Specialist frugivore (ripe fleshy fruits, wild figs, seeds, and tender leaf shoots)',
        estadoConservacion: 'En Peligro (EN)',
        descripcionEs: 'Primate acróbata del dosel arbóreo. Cumple un rol ecológico crítico como gran dispersor de semillas de árboles maderables en las laderas de Cotapata.',
        descripcionEn: 'Acrobatic canopy primate. Plays a critical role as an effective seed disperser for large timber trees across Cotapata slopes.',
        datoCuriosoEs: 'Ha perdido los pulgares evolutivamente para columpiarse más rápido con manos en forma de gancho. Su cola prensil actúa como una quinta extremidad con huellas dactilares.',
        datoCuriosoEn: 'Evolutionarily lost its thumbs for frictionless swinging through trees. Its prehensile tail functions as a sensitive fifth limb with dermal ridges.',
        imagen: 'ceb06c81-e99b-40fe-8863-b6e7bd666501.jpg',
        audio: 'Sonido Marimono.mp3',
        tieneAudio: true,
        esEndemica: false
    },
    {
        id: 4,
        tipo: 'fauna',
        categoriaFauna: 'mamifero',
        nombreEs: 'Taruca / Venado Andino',
        nombreEn: 'Taruca / North Andean Deer',
        cientifico: 'Hippocamelus antisensis',
        habitatEs: 'Puna brava, pedregales y laderas rocosas escarpadas (3,500 - 4,800 msnm)',
        habitatEn: 'High puna grasslands, boulder screes, and sheer rock cliffs (3,500 - 4,800 m)',
        dietaEs: 'Herbívoro ramoneador (gramíneas duras, líquenes, hierbas y arbustos enanos)',
        dietaEn: 'Browsing herbivore (hard tussock grasses, lichens, herbs, and dwarf mountain shrubs)',
        estadoConservacion: 'Vulnerable (VU)',
        descripcionEs: 'Cérvido andino adaptado a altitudes extremas. Vive en grupos familiares en los riscos escarpados que dominan el tramo alto del Camino del Choro.',
        descripcionEn: 'High-altitude cervid adapted to thin air. Roams in family bands along steep crags above the pre-Columbian Choro trail.',
        datoCuriosoEs: 'Sus pezuñas tienen almohadillas plantares ensanchadas y elásticas que le permiten saltar sobre rocas resbaladizas y acantilados casi verticales sin perder agarre.',
        datoCuriosoEn: 'Its hooves feature enlarged, elastic plantar cushions enabling nimble bounds across near-vertical cliffs to evade predators.',
        imagen: 'Diseno-sin-titulo-29.jpg',
        audio: 'Sonido Siervos.mp3',
        tieneAudio: true,
        esEndemica: false
    },
    {
        id: 5,
        tipo: 'fauna',
        categoriaFauna: 'mamifero',
        nombreEs: 'Chancho de Monte / Pecarí de Collar',
        nombreEn: 'Collared Peccary',
        cientifico: 'Pecari tajacu',
        habitatEs: 'Bosques montanos y premontanos húmedos de Yungas (1,100 - 2,200 msnm)',
        habitatEn: 'Humid montane and premontane Yungas forests (1,100 - 2,200 m)',
        dietaEs: 'Omnívoro forrajero (raíces, tubérculos, frutos caídos de palmeras e invertebrados)',
        dietaEn: 'Foraging omnivore (roots, tubers, fallen palm nuts, bulbs, and forest invertebrates)',
        estadoConservacion: 'Preocupación Menor (LC)',
        descripcionEs: 'Mamífero social que viaja en piaras familiares. Remueve la hojarasca y el suelo forestal, aireando la tierra y promoviendo la germinación.',
        descripcionEn: 'Social mammal roaming in tight family herds. Stirs up the forest floor, naturally aerating topsoil and aiding seed germination.',
        datoCuriosoEs: 'Poseen una glándula almizclera en el lomo; se frotan unos contra otros para compartir el mismo olor grupal y no perderse en la densa vegetación.',
        datoCuriosoEn: 'Equipped with a dorsal musk gland; herd members vigorously rub against one another to maintain a shared family scent in thick foliage.',
        imagen: 'chancho de monte 04.jpeg',
        audio: 'Sonido Cancho de monte.mp3',
        tieneAudio: true,
        esEndemica: false
    },
    {
        id: 6,
        tipo: 'fauna',
        categoriaFauna: 'roedor',
        nombreEs: 'Pacarana',
        nombreEn: 'Pacarana',
        cientifico: 'Dinomys branickii',
        habitatEs: 'Cañadas profundas y laderas umbrías del bosque nublado (1,500 - 3,000 msnm)',
        habitatEn: 'Shaded ravines and steep slopes of cloud forests (1,500 - 3,000 m)',
        dietaEs: 'Herbívoro (hojas carnosas, tallos tiernos, frutos y cortezas nativas)',
        dietaEn: 'Strict herbivore (succulent leaves, tender stems, wild fruits, and native tree bark)',
        estadoConservacion: 'Vulnerable (VU)',
        descripcionEs: 'El segundo roedor viviente más pesado del mundo (hasta 15 kg). De hábitos nocturnos y movimientos pausados, es un animal pacífico y escaso.',
        descripcionEn: 'The second largest living rodent in the world (up to 15 kg). Peaceful, slow-moving nocturnal relict animal.',
        datoCuriosoEs: 'Es el único sobreviviente de la familia Dinomyidae, una estirpe prehistórica sudamericana cuyos parientes fósiles llegaron a tener el tamaño de un rinoceronte.',
        datoCuriosoEn: 'Sole surviving member of the ancient Dinomyidae family, whose extinct prehistoric ancestors attained the size of modern cattle.',
        imagen: 'pacarana__dinomys_branickii__no_zoologico_do_parque_ambiental_chico_mendes__rio_branco__.jpg',
        audio: 'Sonido Pacarana.mp3',
        tieneAudio: true,
        esEndemica: false
    },
    {
        id: 7,
        tipo: 'fauna',
        categoriaFauna: 'roedor',
        nombreEs: 'Jochi Colorado / Agutí',
        nombreEn: 'Central American Agouti',
        cientifico: 'Dasyprocta punctata',
        habitatEs: 'Sotobosque húmedo de valles subtropicales (1,100 - 2,400 msnm)',
        habitatEn: 'Dense humid understory of subtropical valleys (1,100 - 2,400 m)',
        dietaEs: 'Granívoro y frugívoro (semillas duras, nueces leñosas, raíces y retoños)',
        dietaEn: 'Granivore and frugivore (tough seeds, thick-shelled nuts, roots, and young shoots)',
        estadoConservacion: 'Preocupación Menor (LC)',
        descripcionEs: 'Roedor diurno muy veloz y cauteloso. Es capaz de quebrar cáscaras de nueces sumamente duras gracias a sus potentes mandíbulas adaptadas.',
        descripcionEn: 'Swift, wary diurnal rodent. Cracks rock-hard wild nuts using reinforced, chisel-like incisors.',
        datoCuriosoEs: 'Entierra cientos de semillas como reserva para tiempos secos, pero olvida hasta el 40%, funcionando como el principal plantador natural de árboles del parque.',
        datoCuriosoEn: 'Buries hundreds of seeds for lean seasons but forgets up to 40%, acting as the forest’s most industrious natural tree planter.',
        imagen: '507178952_9357785367656840_7279397495556188778_n.jpg',
        audio: 'Sonido Jochi colorado.mp3',
        tieneAudio: true,
        esEndemica: false
    },
    {
        id: 8,
        tipo: 'fauna',
        categoriaFauna: 'mamifero',
        nombreEs: 'Murciélago Hematófago / Vampiro Común',
        nombreEn: 'Common Vampire Bat',
        cientifico: 'Desmodus rotundus',
        habitatEs: 'Cuevas kársticas, minas y grietas en valles templados (1,100 - 2,500 msnm)',
        habitatEn: 'Caves, abandoned mine adits, and rock crevices in temperate valleys (1,100 - 2,500 m)',
        dietaEs: 'Hematófago estricto (sangre de mamíferos)',
        dietaEn: 'Obligate hematophage (blood of medium and large mammals)',
        estadoConservacion: 'Preocupación Menor (LC)',
        descripcionEs: 'Mamífero volador altamente especializado. Se desplaza sigilosamente en el suelo mediante apoyos sobre sus pulgares alados para alimentarse sin despertar a su huésped.',
        descripcionEn: 'Specialized winged mammal capable of galloping quadrupedally on the ground to feed silently on resting livestock and wildlife.',
        datoCuriosoEs: 'Su saliva contiene una proteína llamada draculina, anticoagulante biológico investigado en medicina moderna para prevenir trombosis y accidentes cerebrovasculares.',
        datoCuriosoEn: 'Its saliva contains draculin, an ultra-potent natural anticoagulant studied worldwide to treat stroke patients.',
        imagen: 'muercielago.jpg',
        audio: 'Sonido Murcielago.mp3',
        tieneAudio: true,
        esEndemica: false
    },
    {
        id: 9,
        tipo: 'fauna',
        categoriaFauna: 'mamifero',
        nombreEs: 'Murciélago Frugívoro Mayor',
        nombreEn: 'Greater Spear-nosed Bat',
        cientifico: 'Phyllostomus hastatus',
        habitatEs: 'Estrato medio de bosques premontanos y yungas (1,100 - 2,000 msnm)',
        habitatEn: 'Mid-stratum of premontane and Yungas humid forests (1,100 - 2,000 m)',
        dietaEs: 'Omnívoro (frutos silvestres de Ficus y Piper, néctar, polen e insectos grandes)',
        dietaEn: 'Omnivore (wild figs, Piper fruits, flower nectar, pollen, and large insects)',
        estadoConservacion: 'Preocupación Menor (LC)',
        descripcionEs: 'Uno de los murciélagos neotropicales de mayor tamaño corporal (envergadura de hasta 45 cm). Es un polinizador clave de flores nocturnas.',
        descripcionEn: 'One of the largest bats in the Americas with a wingspan up to 45 cm. Essential nocturnal pollinator and forest seed disperser.',
        datoCuriosoEs: 'Las colonias familiares desarrollan dialectos vocales específicos: cada grupo emite chillidos de llamada en frecuencias y patrones únicos que reconocen en la oscuridad.',
        datoCuriosoEn: 'Family colonies develop group-specific vocal dialects, allowing members to recognize roost mates across extensive dark cave systems.',
        imagen: 'large.jpg',
        audio: 'Sonido Murcielago.mp3',
        tieneAudio: true,
        esEndemica: false
    },
    {
        id: 10,
        tipo: 'fauna',
        categoriaFauna: 'mamifero',
        nombreEs: 'Mono Tití / Tamarin',
        nombreEn: 'Tamarin Monkey',
        cientifico: 'Saguinus spp.',
        habitatEs: 'Dosel medio, enredaderas y matorrales densos de Yungas (1,000 - 1,800 msnm)',
        habitatEn: 'Mid-canopy, tangled vines, and lush riparian corridors (1,000 - 1,800 m)',
        dietaEs: 'Omnívoro (frutas carnosas, savia gomosa de árboles, néctar y arañas)',
        dietaEn: 'Omnivore (sweet fleshy fruits, tree sap, flower nectar, and spiders)',
        estadoConservacion: 'Preocupación Menor (LC)',
        descripcionEs: 'Pequeño primate muy ágil, sociable y diurno. Se desplaza en tropas familiares emitiendo suaves silbidos agudos de contacto entre el follaje.',
        descripcionEn: 'Small, agile diurnal primate traveling in close-knit troops through lianas with high-pitched contact whistles.',
        datoCuriosoEs: 'Las hembras casi siempre paren gemelos, y son los machos adultos quienes asumen el trabajo físico de cargarlos en su lomo durante todo el día.',
        datoCuriosoEn: 'Females consistently give birth to twins, with adult males carrying the infants on their backs all day long.',
        imagen: 'Portadas-Amazonas-MOno-TITI-LOW.jpg',
        audio: 'Sonido Mono Titi.mp3',
        tieneAudio: true,
        esEndemica: false
    },
    {
        id: 11,
        tipo: 'fauna',
        categoriaFauna: 'mamifero',
        nombreEs: 'Gato de Pajonal / Ocelote Andino',
        nombreEn: 'Pampas Cat / Andean Wildcat',
        cientifico: 'Leopardus colocolo / L. tigrinus',
        habitatEs: 'Pajonales de puna, estepas y cejas rocosas (2,500 - 4,200 msnm)',
        habitatEn: 'Highland puna tussocks, rocky steppes, and elfin ridges (2,500 - 4,200 m)',
        dietaEs: 'Carnívoro (cuises silvestres, ratones andinos, lagartijas y aves de suelo)',
        dietaEn: 'Carnivore (wild guinea pigs, mountain mice, lizards, and ground birds)',
        estadoConservacion: 'Casi Amenazado (NT)',
        descripcionEs: 'Pequeño felino silvestre de mirada penetrante y pelaje pajizo con rayas cobrizas. Se camufla a la perfección en los pastizales dorados de altura.',
        descripcionEn: 'Small wild cat with striped straw-colored fur providing exceptional camouflage among golden highland grasses.',
        datoCuriosoEs: 'Conocido como el "fantasma de la cordillera". Cuando se siente amenazado eriza la cresta dorsal y esponja la cola para duplicar visualmente su tamaño corporal.',
        datoCuriosoEn: 'Known as the "ghost of the Andes". When threatened it fluffs its dorsal crest and bushy tail to appear twice as large.',
        imagen: 'WhatsApp Image 2026-03-04 at 11.27.04.jpeg',
        audio: 'Sonido Gato pajonal.mp3',
        tieneAudio: true,
        esEndemica: false
    },
    {
        id: 12,
        tipo: 'fauna',
        categoriaFauna: 'mamifero',
        nombreEs: 'Zorro Andino / Culpeo',
        nombreEn: 'Andean Fox / Culpeo',
        cientifico: 'Lycalopex culpaeus',
        habitatEs: 'Páramos andinos, pastizales y matorrales montanos (2,200 - 4,500 msnm)',
        habitatEn: 'Andean paramo, alpine grasslands, and scrub slopes (2,200 - 4,500 m)',
        dietaEs: 'Carnívoro generalista y carroñero (roedores, vizcachas, frutos silvestres y carroña)',
        dietaEn: 'Generalist carnivore and scavenger (rodents, mountain vizcachas, berries, and carrion)',
        estadoConservacion: 'Preocupación Menor (LC)',
        descripcionEs: 'El cánido autóctono más representativo de los Andes bolivianos. Regula poblaciones de pequeños roedores y dispersa semillas de arbustos resistentes.',
        descripcionEn: 'The most iconic native canid of the Bolivian Andes. Regulates rodent populations and disperses hardy montane seeds.',
        datoCuriosoEs: 'Genéticamente no es un zorro verdadero (Vulpes), sino un cánido sudamericano endémico emparentado más cercanamente con lobos y chacales.',
        datoCuriosoEn: 'Genetically not a true fox, but belongs to an ancient native South American canid lineage closer to wolves.',
        imagen: 'f28cba57-f446-4556-b2ae-5c264a530a9d.jpg',
        audio: 'Sonido Zorro.mp3',
        tieneAudio: true,
        esEndemica: false
    },
    {
        id: 13,
        tipo: 'fauna',
        categoriaFauna: 'ave',
        nombreEs: 'Tunqui / Gallito de las Rocas',
        nombreEn: 'Andean Cock-of-the-Rock',
        cientifico: 'Rupicola peruvianus',
        habitatEs: 'Cañones húmedos, quebradas y roquedales del bosque de niebla (1,200 - 2,600 msnm)',
        habitatEn: 'Damp gorges, ravines, and mossy rock cliffs in cloud forest (1,200 - 2,600 m)',
        dietaEs: 'Frugívoro especialista (frutas silvestres de lauráceas, higos y pequeños insectos)',
        dietaEn: 'Specialist frugivore (wild laurel fruits, native figs, and occasional insects)',
        estadoConservacion: 'Preocupación Menor (LC)',
        descripcionEs: 'Ave emblemática de Yungas y Cotapata. Los machos presentan un plumaje naranja-escarlata deslumbrante y una cresta que recubre casi todo el pico.',
        descripcionEn: 'Emblematic bird of Cotapata cloud ravines. Males boast brilliant scarlet plumage and a disk-shaped crest.',
        datoCuriosoEs: 'Al alba, los machos se congregan en arenas comunales ("leks") donde realizan vistosas danzas acrobáticas, reverencias y chasquidos vocales para atraer hembras.',
        datoCuriosoEn: 'Males gather in traditional courtship arenas ("leks") where they perform dancing bows and snapping calls to win females.',
        imagen: 'TUNKI.jpg',
        audio: 'Sonido Tunki.mp3',
        tieneAudio: true,
        esEndemica: false
    },
    {
        id: 14,
        tipo: 'fauna',
        categoriaFauna: 'ave',
        nombreEs: 'Cóndor Andino',
        nombreEn: 'Andean Condor',
        cientifico: 'Vultur gryphus',
        habitatEs: 'Cumbres cordilleranas, riscos y cañones profundos (3,000 - 5,200 msnm)',
        habitatEn: 'Granite peaks, sheer cliffs, and deep Andean canyons (3,000 - 5,200 m)',
        dietaEs: 'Carroñero estricto (restos de ungulados silvestres y ganado de altura)',
        dietaEn: 'Strict scavenger (carcasses of wild mountain ungulates and livestock)',
        estadoConservacion: 'Vulnerable (VU)',
        descripcionEs: 'El soberano alado de la Cordillera Real. Sanea el medio ambiente al eliminar restos biológicos antes de que contaminen las cuencas de agua dulce.',
        descripcionEn: 'Winged ruler of the Andes. Cleans mountain watersheds by consuming animal remains before water sources can be contaminated.',
        datoCuriosoEs: 'Con una envergadura alar de hasta 3.3 metros, puede planear durante más de 5 horas consecutivas sin mover las alas aprovechando corrientes térmicas ascendentes.',
        datoCuriosoEn: 'With a wingspan up to 3.3 meters, it can soar for over 5 hours without flapping its wings once by riding mountain thermals.',
        imagen: '8d81c823-abdf-4c04-83fa-002611abb02f.jpg',
        audio: 'Sonido Condor.mp3',
        tieneAudio: true,
        esEndemica: false
    },
    {
        id: 15,
        tipo: 'fauna',
        categoriaFauna: 'ave',
        nombreEs: 'Guácharo / Pájaro Aceitero',
        nombreEn: 'Oilbird',
        cientifico: 'Steatornis caripensis',
        habitatEs: 'Cavernas profundas y bosques nublados contiguos (1,200 - 2,800 msnm)',
        habitatEn: 'Pitch-black caves and contiguous humid montane forests (1,200 - 2,800 m)',
        dietaEs: 'Frugívoro nocturno (frutos oleaginosos de palmeras y laureles)',
        dietaEn: 'Nocturnal frugivore (lipid-rich palm nuts and wild laurel drupes)',
        estadoConservacion: 'Preocupación Menor (LC)',
        descripcionEs: 'Ave cavernícola que duerme en colonias subterráneas durante el día y emerge en bandadas al anochecer para forrajear frutos grasosos en el bosque.',
        descripcionEn: 'Cave-dwelling bird roosting in dark caverns by day and emerging at nightfall to harvest lipid-rich fruits.',
        datoCuriosoEs: 'Es la única ave nocturna del mundo con dieta exclusivamente de frutos, y navega la oscuridad total de las cavernas mediante ecolocalización con clics sonoros.',
        datoCuriosoEn: 'The only nocturnal fruit-eating bird on Earth; navigates inside pitch-dark caves using acoustic echolocation clicks.',
        imagen: '483359_10150947721041695_493434887_n.jpg',
        audio: 'Sonido Guácharo.mp3',
        tieneAudio: true,
        esEndemica: false
    },
    {
        id: 16,
        tipo: 'fauna',
        categoriaFauna: 'ave',
        nombreEs: 'Águila Negra y Castaña',
        nombreEn: 'Black-and-Chestnut Eagle',
        cientifico: 'Spizaetus isidori',
        habitatEs: 'Dosel continuo de laderas boscosas nubladas (1,500 - 3,200 msnm)',
        habitatEn: 'Unbroken cloud forest canopy along steep slopes (1,500 - 3,200 m)',
        dietaEs: 'Depredador apical aéreo (monos, ardillas de árbol, pacaranas y pavas)',
        dietaEn: 'Apex avian predator (monkeys, tree squirrels, pacaranas, and large guans)',
        estadoConservacion: 'En Peligro (EN)',
        descripcionEs: 'Majestuosa rapaz de cresta eréctil y poderosa garra. Requiere amplias extensiones de bosque primario sin alterar para reproducirse y anidar.',
        descripcionEn: 'Majestic forest raptor with an erectile crest. Requires vast tracts of undisturbed primary cloud canopy to nest.',
        datoCuriosoEs: 'Las crías nacen con plumaje blanco resplandeciente y permanecen bajo el amparo de los padres casi un año; tardan 4 años en mudar al plumaje negro y castaño definitivo.',
        datoCuriosoEn: 'Chicks are born in snowy white down and depend on parents for nearly a year, taking 4 years to acquire their adult plumage.',
        imagen: 'aguilla negra.jpg',
        audio: 'Sonido Aguila negra y castaña.mp3',
        tieneAudio: true,
        esEndemica: false
    },
    {
        id: 17,
        tipo: 'fauna',
        categoriaFauna: 'ave',
        nombreEs: 'Pava Andina',
        nombreEn: 'Andean Guan',
        cientifico: 'Penelope montagnii',
        habitatEs: 'Estrato medio y alto del bosque nublado y ceja de monte (1,800 - 3,500 msnm)',
        habitatEn: 'Mid-to-upper strata of cloud forests and elfin woods (1,800 - 3,500 m)',
        dietaEs: 'Frugívora y folívora (bayas silvestres, brotes verdes, drupas y flores)',
        dietaEn: 'Frugivore and folivore (mountain berries, tender green shoots, drupes, and flowers)',
        estadoConservacion: 'Preocupación Menor (LC)',
        descripcionEs: 'Ave de tamaño medio que camina hábilmente por ramas horizontales buscando alimento. Es vital para la dispersión de plantas con bayas carnosas.',
        descripcionEn: 'Medium-sized gamebird walking skillfully across horizontal branches in search of wild berries.',
        datoCuriosoEs: 'Al romper el alba, en lugar de cantar, se lanza en vuelo corto batiendo rítmicamente sus alas para producir un tamborileo sonoro que resuena por los cañones.',
        datoCuriosoEn: 'At dawn, instead of singing, it dives short distances with rhythmic wing-beating that produces a loud drumming rattle.',
        imagen: '900.jpg',
        audio: 'Sonido Pava andina.mp3',
        tieneAudio: true,
        esEndemica: false
    },
    {
        id: 18,
        tipo: 'fauna',
        categoriaFauna: 'ave',
        nombreEs: 'Pava Ala de Hoz',
        nombreEn: 'Sickle-winged Guan',
        cientifico: 'Chamaepetes goudotii',
        habitatEs: 'Sotobosque denso y vegetación riparia de montaña (1,600 - 3,000 msnm)',
        habitatEn: 'Dense understory and mountain riparian thickets (1,600 - 3,000 m)',
        dietaEs: 'Frugívora (frutos de ericáceas, semillas carnosas y pequeños invertebrados)',
        dietaEn: 'Frugivore (ericaceous berries, fleshy seeds, and small insects)',
        estadoConservacion: 'Preocupación Menor (LC)',
        descripcionEs: 'Ave sigilosa de plumaje pardo-oliváceo y pico rojizo. Habita en sectores de densa neblina, consumiendo frutos que caen al suelo.',
        descripcionEn: 'Stealthy bird with olive-brown plumage and reddish bill. Inhabits dense fog zones consuming fallen fruit.',
        datoCuriosoEs: 'Sus plumas primarias más externas tienen una curvatura delgada en forma de hoz que emite un zumbido metálico al volar, sirviendo como señal acústica entre bandadas.',
        datoCuriosoEn: 'Its outer primary feathers curve into a sickle shape that produces a buzzing metallic whistle in flight, guiding flock members through fog.',
        imagen: 'sickle_winged_guan-1.jpg',
        audio: 'Sonido Pavo ala de hoz.mp3',
        tieneAudio: true,
        esEndemica: false
    },
    {
        id: 19,
        tipo: 'fauna',
        categoriaFauna: 'ave',
        nombreEs: 'Colibrí Boliviano / Rayito de Sol',
        nombreEn: 'Bolivian Sunbeam',
        cientifico: 'Aglaeactis pamela',
        habitatEs: 'Matorrales húmedos, bordes de bosque nublado y queñuales (2,800 - 3,800 msnm)',
        habitatEn: 'Humid montane scrub, cloud forest edges, and Polylepis patches (2,800 - 3,800 m)',
        dietaEs: 'Nectarívoro e insectívoro (néctar de orquídeas, salvias y mosquitos en vuelo)',
        dietaEn: 'Nectarivore and insectivore (orchid nectar, salvia blossoms, and airborne midges)',
        estadoConservacion: 'Preocupación Menor (LC)',
        descripcionEs: 'Joya biológica de Cotapata. Ave diminuta con parche dorsal azul-turquesa iridiscente que bate sus alas a velocidades increíbles para mantenerse en vuelo estacionario.',
        descripcionEn: 'Biological jewel of Cotapata. Tiny hummingbird with brilliant iridescent turquoise back patch capable of sustained hovering flight.',
        datoCuriosoEs: 'Es una especie estrictamente endémica de Bolivia: no existe en libertad en ningún otro país del planeta Tierra salvo en esta estrecha franja andina paceña.',
        datoCuriosoEn: 'Strictly endemic to Bolivia: found nowhere else in the wild on planet Earth except this narrow band in the La Paz Andes.',
        imagen: 'WhatsApp Image 2026-03-04 at 11.23.32.jpeg',
        audio: 'Sonido Colibri de sol boliviano.mp3',
        tieneAudio: true,
        esEndemica: true
    },
    {
        id: 20,
        tipo: 'fauna',
        categoriaFauna: 'ave',
        nombreEs: 'Remolinera Real',
        nombreEn: 'Royal Cinclodes',
        cientifico: 'Cinclodes aricomae',
        habitatEs: 'Bosques relictos de queñua (Polylepis pepei) en valles glaciares (3,600 - 4,400 msnm)',
        habitatEn: 'Relict Polylepis woodlands in high glacial valleys (3,600 - 4,400 m)',
        dietaEs: 'Insectívora especialista (coleópteros, larvas y arañas bajo corteza de queñua)',
        dietaEn: 'Specialist insectivore (beetles, larvae, and spiders beneath papery Polylepis bark)',
        estadoConservacion: 'Peligro Crítico (CR)',
        descripcionEs: 'Una de las aves más amenazadas del continente americano. Depende exclusivamente de los bosques de queñua maduros para sobrevivir y nidificar.',
        descripcionEn: 'One of the most threatened birds in the Americas. Depends strictly on mature Polylepis queñua woodlands to survive.',
        datoCuriosoEs: 'Se estima que sobreviven menos de 250 parejas en toda la cordillera andina; el Parque Nacional Cotapata alberga uno de sus últimos refugios de vida en Bolivia.',
        datoCuriosoEn: 'Estimated that fewer than 250 pairs survive across the Andes; Cotapata National Park protects one of its last sanctuaries in Bolivia.',
        imagen: 'WhatsApp Image 2026-03-04 at 11.26.34.jpeg',
        audio: 'Sonido Remolina real.mp3',
        tieneAudio: true,
        esEndemica: false
    },

    // --- 20 ESPECIES DE FLORA NATIVA ---
    { id: 21, tipo: 'flora', nombreEs: 'Pasto Altoandino', nombreEn: 'High Andean Grass', cientifico: 'Festuca dolichophylla', estadoConservacion: 'Preocupación Menor (LC)', habitatEs: 'Pajonales húmedos de puna (3,800 - 4,600 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'festuca-dolichophylla.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Hierba perenne que forma macollas doradas en la puna, clave contra la erosión.', datoCuriosoEs: 'Sus raíces profundas forman una red densa que filtra agua hacia manantiales.' },
    { id: 22, tipo: 'flora', nombreEs: 'Gramíneas Altoandinas', nombreEn: 'Andean Reed Grass', cientifico: 'Cinnagrostis spp.', estadoConservacion: 'Preocupación Menor (LC)', habitatEs: 'Laderas expuestas y cumbres frías (3,900 - 4,700 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'Cinnagrostisspp.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Pastos erguidos resistentes al congelamiento que cubren laderas altas.', datoCuriosoEs: 'Poseen cristales de sílice en sus hojas como escudo contra el viento y heladas.' },
    { id: 23, tipo: 'flora', nombreEs: 'Bofedal / Planta en Cojín', nombreEn: 'Cushion Wetland Plant', cientifico: 'Distichia muscoides', estadoConservacion: 'Preocupación Menor (LC)', habitatEs: 'Humedales y turberas andinas (4,000 - 4,800 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'Distichia_muscoides_2.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Planta pulvinada que forma turberas y regula el flujo hídrico en las cumbres.', datoCuriosoEs: 'Forma cojines tan densos que animales pesados pueden cruzar sin hundirse.' },
    { id: 24, tipo: 'flora', nombreEs: 'Bofedal de Hoja Tubular', nombreEn: 'Tubular Wetland Herb', cientifico: 'Plantago tubulosa', estadoConservacion: 'Preocupación Menor (LC)', habitatEs: 'Manantiales y vertientes frías (3,900 - 4,600 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'Plantago tubulosa.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Hierba adaptada a vivir con raíces anegadas en agua fría de deshielo.', datoCuriosoEs: 'Sus raíces actúan como biofiltro purificando aguas que bajan a los valles.' },
    { id: 25, tipo: 'flora', nombreEs: 'Bofedal Espinoso', nombreEn: 'Spiny Cushion Plant', cientifico: 'Oxychloe andina', estadoConservacion: 'Preocupación Menor (LC)', habitatEs: 'Bordes de lagunas glaciares (4,100 - 4,850 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'Oxychloe.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Cojín perenne rígido que coloniza suelos anegados de la alta cordillera.', datoCuriosoEs: 'Sus hojas terminan en espinas afiladas para defenderse del pastoreo de camélidos.' },
    { id: 26, tipo: 'flora', nombreEs: 'Queñua', nombreEn: 'Queñua Tree', cientifico: 'Polylepis pepei', estadoConservacion: 'En Peligro (EN)', habitatEs: 'Laderas rocosas y valles glaciares relictos (3,600 - 4,300 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'Polylepis pepei.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Árbol retorcido de alta montaña que forma bosques relictos esenciales para aves raras.', datoCuriosoEs: 'Es uno de los árboles que crece a mayor altitud en el planeta; su corteza hojosa aísla del frío.' },
    { id: 27, tipo: 'flora', nombreEs: 'Pino de Monte', nombreEn: 'Mountain Podocarp', cientifico: 'Podocarpus rusbyi', estadoConservacion: 'Vulnerable (VU)', habitatEs: 'Partes altas del bosque nublado (2,200 - 3,200 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'Podocarpusrusbyi.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Conífera nativa imponente que intercepta niebla y condensa agua dulce.', datoCuriosoEs: 'Produce semillas con arilos carnosos y dulces que alimentan a aves del dosel.' },
    { id: 28, tipo: 'flora', nombreEs: 'Pino de Monte Ingensis', nombreEn: 'Ingensis Podocarp', cientifico: 'Podocarpus ingensis', estadoConservacion: 'Vulnerable (VU)', habitatEs: 'Ceja de monte húmeda (2,400 - 3,300 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'Podocarpus ingensis.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Conífera andina rara, fundamental para estabilizar laderas escarpadas.', datoCuriosoEs: 'Su madera resinosa contiene aceites naturales resistentes a la pudrición.' },
    { id: 29, tipo: 'flora', nombreEs: 'Iotavio', nombreEn: 'Bolivian Weinmannia', cientifico: 'Weinmannia boliviensis', estadoConservacion: 'Preocupación Menor (LC)', habitatEs: 'Ceja de monte y bosque montano (2,000 - 3,000 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'Weinmanniaboliviensis.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Árbol frondoso característico del ecotono de Yungas, gran captador de niebla.', datoCuriosoEs: 'Cosecha agua de nubes: su denso follaje condensa humedad y recarga vertientes.' },
    { id: 30, tipo: 'flora', nombreEs: 'Huaycha', nombreEn: 'Huaycha Tree', cientifico: 'Weinmannia crassifolia', estadoConservacion: 'Preocupación Menor (LC)', habitatEs: 'Crestas montañosas con niebla densa (2,200 - 3,100 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'Weinmannia_pinnata_1.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Árbol robusto de hojas coriáceas que tolera vientos huracanados de cumbre.', datoCuriosoEs: 'Produce una resina vegetal pegajosa usada por aves para fijar sus nidos.' },
    { id: 31, tipo: 'flora', nombreEs: 'Nogal Silvestre', nombreEn: 'Bolivian Walnut', cientifico: 'Juglans boliviana', estadoConservacion: 'En Peligro (EN)', habitatEs: 'Valles templados y riberas protegidas (1,300 - 2,200 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'NOGAL.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Árbol de gran envergadura y madera noble presente en sectores templados del parque.', datoCuriosoEs: 'Produce nueces de cáscara pétrea que sustentan a jochis y pacaranas en invierno.' },
    { id: 32, tipo: 'flora', nombreEs: 'Yuraj Huaycha', nombreEn: 'Yuraj Huaycha', cientifico: 'Miconia theaezans', estadoConservacion: 'Preocupación Menor (LC)', habitatEs: 'Claros de bosque y matorrales montanos (1,600 - 2,800 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'Miconia theaezans.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Arbusto de llamativas hojas trilobuladas que prolifera en claros de bosque.', datoCuriosoEs: 'Presenta floraciones masivas sincronizadas que atraen a decenas de colibríes.' },
    { id: 33, tipo: 'flora', nombreEs: 'Cedro Andino', nombreEn: 'Andean Cedar', cientifico: 'Cedrela lilloi', estadoConservacion: 'En Peligro (EN)', habitatEs: 'Laderas montañosas húmedas (1,400 - 2,400 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'Cedrela_odorata_foliage.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Árbol gigante del dosel superior de los bosques nublados andinos.', datoCuriosoEs: 'Su corteza despide aceites aromáticos que repelen insectos y termitas.' },
    { id: 34, tipo: 'flora', nombreEs: 'Aliso Andino', nombreEn: 'Andean Alder', cientifico: 'Alnus acuminata', estadoConservacion: 'Preocupación Menor (LC)', habitatEs: 'Orillas de ríos y laderas con derrumbes (1,600 - 2,900 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'acuminata.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Árbol pionero de rápido crecimiento que coloniza márgenes de ríos y cárcavas.', datoCuriosoEs: 'Vive en simbiosis con bacterias que fijan nitrógeno, fertilizando el suelo naturalmente.' },
    { id: 35, tipo: 'flora', nombreEs: 'Yaruma', nombreEn: 'Yaruma', cientifico: 'Hesperomeles ferruginea', estadoConservacion: 'Preocupación Menor (LC)', habitatEs: 'Bosque enano y ceja de monte (2,600 - 3,500 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'Hesperomelesferruginea.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Árbol pequeño con envés rojizo aterciopelado que resiste intensas heladas.', datoCuriosoEs: 'Pertenece a la familia de las rosáceas, pariente silvestre de manzanos y perales.' },
    { id: 36, tipo: 'flora', nombreEs: 'Aliso Colorado', nombreEn: 'Wax Myrtle', cientifico: 'Myrica pubescens', estadoConservacion: 'Preocupación Menor (LC)', habitatEs: 'Laderas escarpadas pedregosas (2,000 - 3,200 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'Myricapubescens.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Arbusto perenne que crece en laderas pobres y pedregosas fijando el terreno.', datoCuriosoEs: 'Sus bayas están recubiertas de cera vegetal usada tradicionalmente para velas.' },
    { id: 37, tipo: 'flora', nombreEs: 'Laureles Andinos', nombreEn: 'Andean Laurel', cientifico: 'Ocotea spp.', estadoConservacion: 'Preocupación Menor (LC)', habitatEs: 'Estrato alto del bosque nublado (1,500 - 2,600 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'Ocotea.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Árboles aromáticos cuyos frutos nutren a tucanes, pavas y monos araña.', datoCuriosoEs: 'Frotar sus hojas frescas libera un penetrante perfume balsámico similar al laurel y la canela.' },
    { id: 38, tipo: 'flora', nombreEs: 'Quina / Árbol de la Quina', nombreEn: 'Quinine Tree', cientifico: 'Cinchona officinalis', estadoConservacion: 'Vulnerable (VU)', habitatEs: 'Laderas húmedas y cañadas sombrías (1,600 - 2,700 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'Cinchonaofficinalis.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Árbol medicinal histórico de los Andes, símbolo mundial de la farmacología.', datoCuriosoEs: 'De su corteza amarga se extrajo la quinina, primer remedio mundial contra la malaria.' },
    { id: 39, tipo: 'flora', nombreEs: 'Vilca / Bilka', nombreEn: 'Vilca Tree', cientifico: 'Anadenanthera colubrina', estadoConservacion: 'Preocupación Menor (LC)', habitatEs: 'Quebradas cálidas y valles bajos (1,100 - 1,800 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'Anadenantheracolubrina.jpg', audio: '', tieneAudio: false, esEndemica: false, descripcionEs: 'Árbol esbelto con hojas parecidas al helecho y vainas leñosas alargadas.', datoCuriosoEs: 'Sus semillas fueron empleadas desde tiempos precolombinos en ceremonias andinas.' },
    { id: 40, tipo: 'flora', nombreEs: 'Flor Endémica de Cotapata', nombreEn: 'Cotapata Endemic Flower', cientifico: 'Ourisia cotapatensis', estadoConservacion: 'Vulnerable (VU)', habitatEs: 'Grietas de roca húmeda en cotas altas (3,200 - 3,900 msnm)', dietaEs: 'Autótrofo fotosintético', imagen: 'Ourisiacotapatensis.jpg', audio: '', tieneAudio: false, esEndemica: true, descripcionEs: 'Hierba con flores acampanadas descubierta para la ciencia en Cotapata en 2003.', datoCuriosoEs: 'No existe en ningún otro lugar silvestre del mundo fuera del Parque Cotapata.' }
];

// Fallbacks de Servicios, Atractivos, Rutas y Recomendaciones
const DATASET_SERVICIOS_DEFAULT = [
    {
        id: 1,
        categoria: 'alojamiento',
        nombreCategoria: 'Alojamiento',
        iconoCategoria: '🏡',
        comunidad: 'Sandillani',
        nombre: 'Albergue y Camping Ecológico Sandillani',
        descripcion: 'Hospedaje rústico y zona de acampada con agua potable de vertiente natural al finalizar el tramo montañoso del Choro.',
        ubicacionReferencial: 'Hito intermedio en la senda precolombina El Choro',
        horarioAtencion: 'Todos los días 07:00 - 20:00',
        rangoPrecios: 'Precios solidarios comunitarios',
        idiomasAtencion: 'Español, Aymara',
        imagen: 'tilcayo1.jpg'
    },
    {
        id: 2,
        categoria: 'alimentacion',
        nombreCategoria: 'Alimentación',
        iconoCategoria: '🍲',
        comunidad: 'Chairo',
        nombre: 'Comedor Tradicional El Puente Chairo',
        descripcion: 'Alimentación caliente y nutritiva para caminantes: sopas andinas, trucha fresca, frutas locales y mate de coca reconfortante.',
        ubicacionReferencial: 'Extremo final del Camino del Choro junto al río',
        horarioAtencion: '08:00 - 19:00',
        rangoPrecios: 'Accesible según menú diario',
        idiomasAtencion: 'Español, Aymara',
        imagen: 'tilcayo2.jpg'
    },
    {
        id: 3,
        categoria: 'guiado',
        nombreCategoria: 'Guías Locales',
        iconoCategoria: '🥾',
        comunidad: 'Chairo',
        nombre: 'Guías Comunitarios Sub Central Chairo',
        descripcion: 'Acompañamiento e interpretación de flora, fauna y patrimonio histórico brindado por guías locales conocedores del territorio.',
        ubicacionReferencial: 'Punto de encuentro en Chairo o inicio de senda',
        horarioAtencion: 'Previa coordinación comunal',
        rangoPrecios: 'Tarifa acordada con la comunidad',
        idiomasAtencion: 'Español, Aymara',
        imagen: 'cotapata_aerial.jpg'
    },
    {
        id: 4,
        categoria: 'experiencias',
        nombreCategoria: 'Experiencias',
        iconoCategoria: '🌿',
        comunidad: 'Pacollo',
        nombre: 'Ruta Agroecológica del Café y Cacao Pacollo',
        descripcion: 'Recorrido por parcelas familiares agroforestales donde se produce café de sombra de alta calidad respetando la cobertura vegetal.',
        ubicacionReferencial: 'Sector medio del valle de Huarinilla',
        horarioAtencion: 'Fines de semana y previa reserva',
        rangoPrecios: 'Aporte voluntario comunitario',
        idiomasAtencion: 'Español',
        imagen: 'jungle_banner.jpg'
    }
];

const DATASET_ATRACTIVOS_DEFAULT = [
    {
        id: 1,
        categoria: 'Patrimonio Cultural y Senderismo',
        nombre: 'Camino Precolombino El Choro',
        altitudMsnm: 4800,
        descripcion: 'Histórica calzada de piedra construida por culturas preincaicas e incas que une la cumbre andina con los exuberantes valles de Yungas.',
        recomendaciones: 'Llevar calzado de trekking firme, impermeable y bastones de apoyo para el descenso pronunciado.',
        imagen: 'cotapata_aerial.jpg'
    },
    {
        id: 2,
        categoria: 'Ecosistema y Biodiversidad',
        nombre: 'Bosque Nublado de los Yungas',
        altitudMsnm: 2400,
        descripcion: 'Área de condensación permanente de nieblas donde proliferan orquídeas, helechos gigantes, bromelias y cientos de aves endémicas.',
        recomendaciones: 'No cortar plantas ni extraer orquídeas; transitar en silencio para escuchar aves.',
        imagen: 'jungle_banner.jpg'
    },
    {
        id: 3,
        categoria: 'Paisaje Hídrico y Balneario',
        nombre: 'Cuenca y Río Huarinilla',
        altitudMsnm: 1300,
        descripcion: 'Principal cuenca hidrográfica del parque, vital para la regulación de agua dulce de comunidades yungueñas.',
        recomendaciones: 'Prohibido arrojar residuos plásticos o jabones no biodegradables al agua.',
        imagen: 'cotapata_stats.jpg'
    },
    {
        id: 4,
        categoria: 'Observación de Fauna Silvestre',
        nombre: 'Santuario Natural de Tilcayos y Felinos',
        altitudMsnm: 3100,
        descripcion: 'Microcuencas protegidas y cañadas donde habita el gato margay (tilcayo) y otros felinos nocturnos.',
        recomendaciones: 'Evitar el uso de flash en fotografía nocturna y no perturbar senderos secundarios.',
        imagen: 'tilcayo1.jpg'
    }
];

const DATASET_RUTAS_DEFAULT = [
    {
        id: 1,
        nombre: 'Travesía Precolombina Choro: Cumbre a Chairo',
        distanciaKm: 52.0,
        duracionHoras: '3 días (24-28 horas de marcha)',
        dificultad: 'Alta',
        desnivelMetros: 3500,
        descripcion: 'Recorrido clásico de tres días que desciende desde la fría cumbre andina a 4,800 msnm hasta la cálida vegetación yungueña en Chairo a 1,300 msnm.',
        recomendacionesSeguridad: 'Es indispensable registrarse en el puesto de guardaparques SERNAP en La Cumbre, contratar guías comunitarios y portar botiquín.',
        imagen: 'cotapata_aerial.jpg'
    },
    {
        id: 2,
        nombre: 'Sendero Interpretativo Sandillani - Chairo',
        distanciaKm: 14.5,
        duracionHoras: '5 a 6 horas',
        dificultad: 'Media',
        desnivelMetros: 1100,
        descripcion: 'Tramo final del Choro ideal para senderistas que buscan una caminata de un día entre plantaciones locales, orquídeas y bosques fluviales.',
        recomendacionesSeguridad: 'Llevar repelente biodegradable para mosquitos y suficiente agua potable para el calor yungueño.',
        imagen: 'jungle_banner.jpg'
    },
    {
        id: 3,
        nombre: 'Circuito de Bosque de Queñuas y Bofedales Altos',
        distanciaKm: 8.0,
        duracionHoras: '3 a 4 horas',
        dificultad: 'Media',
        desnivelMetros: 450,
        descripcion: 'Recorrido de altura por las faldas de la Cordillera Real conociendo queñuas milenarias y humedales reguladores de agua.',
        recomendacionesSeguridad: 'Ruta de gran altitud: aclimatarse previamente para evitar sorojchi y llevar ropa térmica contra viento helado.',
        imagen: 'cotapata_stats.jpg'
    }
];

const DATASET_RECOMENDACIONES_DEFAULT = [
    { id: 1, icono: '🗑️', titulo: 'Principio Zero Basura', descripcion: 'Todo residuo que traigas contigo debe retornar a la ciudad. En Cotapata no existe servicio municipal de recojo en sendas.', consejoPractico: 'Lleva una bolsa de tela o impermeable exclusiva para tus desperdicios plásticos y orgánicos.' },
    { id: 2, icono: '🌱', titulo: 'Respeto a la Flora Nativa', descripcion: 'Está terminantemente prohibido cortar, quebrar o arrancar orquídeas, musgos, helechos o flores silvestres.', consejoPractico: 'Captura la belleza con tu cámara. Cada planta viva es alimento y refugio para polinizadores únicos.' },
    { id: 3, icono: '🐾', titulo: 'Protección a la Fauna Silvestre', descripcion: 'Observa a los animales desde una distancia segura. No los persigas, no emitas ruidos fuertes y nunca los alimentes.', consejoPractico: 'La comida humana altera la salud animal y crea dependencia peligrosa para osos y zorros.' },
    { id: 4, icono: '🔥', titulo: 'Prohibición Total de Fogatas', descripcion: 'Hacer fuego está prohibido en todo el parque. Un descuido puede desencadenar incendios que arrasan ecosistemas frágiles.', consejoPractico: 'Utiliza cocinillas portátiles de gas certificadas en zonas designadas de campamento.' },
    { id: 5, icono: '🥾', titulo: 'Permanecer en los Senderos Marcados', descripcion: 'Caminar fuera de sendero compacta el suelo, destruye nidos microscópicos y acelera la erosión por lluvias torrenciales.', consejoPractico: 'Sigue siempre las huellas oficiales de la calzada prehispánica para no desorientarte.' },
    { id: 6, icono: '📸', titulo: 'Fotografía Ética y Respetuosa', descripcion: 'No uses flash directo sobre aves o mamíferos nocturnos. Solicita permiso antes de fotografiar a comunarios y sus hogares.', consejoPractico: 'El consentimiento y el respeto a la privacidad comunitaria son el pilar del turismo responsable.' }
];

// Diccionario de textos bilingües de la interfaz
const I18N = {
    es: {
        brandSubtitle: 'Sistema Integrado de Información Turística Comunitaria',
        navInicio: 'Inicio',
        navBiodiversidad: 'Biodiversidad',
        navServicios: 'Servicios',
        navAtractivos: 'Atractivos',
        navRutas: 'Rutas',
        navMapa: 'Mapa',
        navRecomendaciones: 'Recomendaciones',
        navProyecto: 'El Proyecto',
        navAdmin: 'Administración',
        heroBadge: 'Universidad Salesiana de Bolivia · PN-ANMI Cotapata · SERNAP',
        heroTitle: 'Descubre la Riqueza Natural y Comunitaria de Cotapata',
        heroSubtitle: 'Plataforma comunitaria de información sobre biodiversidad, senderos ancestrales, servicios locales y conservación ambiental.',
        btnExplorar: 'Explorar Fauna y Flora',
        btnServicios: 'Servicios Comunitarios',
        btnMapa: 'Ver Mapa Interactivo',
        statArea: 'Área Protegida',
        statAltitud: 'Rango Altitudinal',
        statComunidades: 'Comunidades SERNAP',
        statRuta: 'Ruta Precolombina',
        bioTitulo: 'Catálogo de Biodiversidad Nativa',
        bioSub: '40 especies documentadas con registros fotográficos de alta resolución, nombres científicos, hábitat en Cotapata, dieta, estado de conservación y reproductores de audio.',
        searchPlaceholder: 'Buscar por nombre común o científico...',
        pillTodos: 'Todos',
        pillFauna: '🐾 Fauna (20 Especies)',
        pillFlora: '🌿 Flora (20 Especies)',
        pillMamiferos: 'Mamíferos',
        pillAves: 'Aves',
        pillRoedores: 'Roedores',
        servTitulo: 'Servicios Turísticos Comunitarios',
        servSub: 'Iniciativas y emprendimientos locales con autorización y consentimiento informado de las comunidades.',
        servNotice: 'Información validada voluntariamente por comunarios de Chairo, Sandillani y valles yungueños. Sin intermediarios comerciales.',
        filtroCatLabel: 'Categoría:',
        filtroComLabel: 'Comunidad:',
        atrTitulo: 'Atractivos Turísticos y Culturales',
        atrSub: 'Puntos de interés natural, cascadas, miradores y vestigios del Camino del Choro.',
        rutasTitulo: 'Rutas y Senderos de Cotapata',
        rutasSub: 'Información técnica verificada: distancias, desniveles, dificultades y recomendaciones de seguridad.',
        mapaTitulo: 'Geolocalización y Cartografía de Cotapata',
        mapaSub: 'Mosaicos cartográficos del Parque Nacional Cotapata con atractivos, comunidades y senderos.',
        recTitulo: 'Recomendaciones para una Visita Responsable',
        recSub: 'Código ético de conservación para proteger los ecosistemas andinos y respetar a las comunidades.',
        compromisosTitulo: 'Mis Compromisos Ambientales',
        compromisosSub: 'Toca cada principio para asumirlo durante tu visita a Cotapata:',
        proyTitulo: 'Acerca del Proyecto Académico y Enfoque Ético',
        proySub: 'Universidad Salesiana de Bolivia · Ingeniería de Sistemas · La Paz, 2026',
        btnEscucharAudio: '🔊 Sonido Animal',
        btnEscucharTTS: '🗣️ Narración Guiada',
        btnPausar: '⏸️ Pausar',
        btnDetalles: 'Ver Ficha Completa',
        cargando: 'Cargando información del parque...',
        sinResultados: 'No se encontraron resultados que coincidan con la búsqueda.'
    },
    en: {
        brandSubtitle: 'Integrated Community Tourism Information System',
        navInicio: 'Home',
        navBiodiversidad: 'Biodiversity',
        navServicios: 'Community Services',
        navAtractivos: 'Attractions',
        navRutas: 'Trails',
        navMapa: 'Map',
        navRecomendaciones: 'Guidelines',
        navProyecto: 'About Project',
        navAdmin: 'Admin Portal',
        heroBadge: 'Salesian University of Bolivia · Cotapata National Park · SERNAP',
        heroTitle: 'Discover the Natural & Community Heritage of Cotapata',
        heroSubtitle: 'A community-driven digital platform for biodiversity exploration, ancestral trails, local services, and environmental stewardship.',
        btnExplorar: 'Explore Wildlife & Flora',
        btnServicios: 'Community Services',
        btnMapa: 'View Interactive Map',
        statArea: 'Protected Area',
        statAltitud: 'Altitude Span',
        statComunidades: 'SERNAP Communities',
        statRuta: 'Ancestral Incan Trail',
        bioTitulo: 'Native Biodiversity Catalog',
        bioSub: '40 documented species featuring high-res photographic records, scientific taxonomy, habitat in Cotapata, diet, IUCN status, and built-in audio players.',
        searchPlaceholder: 'Search by common or scientific name...',
        pillTodos: 'All Species',
        pillFauna: '🐾 Fauna (20 Species)',
        pillFlora: '🌿 Flora (20 Species)',
        pillMamiferos: 'Mammals',
        pillAves: 'Birds',
        pillRoedores: 'Rodents',
        servTitulo: 'Community Tourism Services',
        servSub: 'Local initiatives and family ventures shared with community consent and authorization.',
        servNotice: 'Information verified with informed consent from Chairo, Sandillani, and Yungas communities. No commercial markups.',
        filtroCatLabel: 'Category:',
        filtroComLabel: 'Community:',
        atrTitulo: 'Natural & Cultural Attractions',
        atrSub: 'Scenic viewpoints, cloud forests, mountain rivers, and ancestral paved roads.',
        rutasTitulo: 'Hiking Routes & Trails',
        rutasSub: 'Verified technical trail data: distances, elevation shifts, difficulty ratings, and safety measures.',
        mapaTitulo: 'Cotapata Interactive Map & Cartography',
        mapaSub: 'High-resolution park map showing key points of interest, communities, and trails.',
        recTitulo: 'Responsible Visitor Guidelines',
        recSub: 'An ethical conservation code to safeguard fragile Andean cloud forests and respect local residents.',
        compromisosTitulo: 'My Environmental Commitments',
        compromisosSub: 'Tap each principle to adopt it during your journey through Cotapata:',
        proyTitulo: 'About the University Project & Ethical Framework',
        proySub: 'Salesian University of Bolivia · Systems Engineering · La Paz, 2026',
        btnEscucharAudio: '🔊 Animal Call',
        btnEscucharTTS: '🗣️ Spoken Guide',
        btnPausar: '⏸️ Pause',
        btnDetalles: 'View Details',
        cargando: 'Loading park data...',
        sinResultados: 'No matching entries found for your query.'
    }
};

// ==============================================================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    setupNavigation();
    setupEventListeners();

    // Inicializar de inmediato con dataset de respaldo de alta fidelidad
    AppState.especies = JSON.parse(JSON.stringify(DATASET_ESPECIES_DEFAULT));
    AppState.servicios = JSON.parse(JSON.stringify(DATASET_SERVICIOS_DEFAULT));
    AppState.atractivos = JSON.parse(JSON.stringify(DATASET_ATRACTIVOS_DEFAULT));
    AppState.rutas = JSON.parse(JSON.stringify(DATASET_RUTAS_DEFAULT));
    AppState.recomendaciones = JSON.parse(JSON.stringify(DATASET_RECOMENDACIONES_DEFAULT));

    renderizarTodo();
    actualizarTextosInterfaz();

    // Intentar conectar con la API REST (Supabase / Tomcat) de manera asíncrona
    await cargarDatos();
}

// ==============================================================================
// GESTIÓN DE NAVEGACIÓN Y VISTAS (SMOOTH SCROLLING & SCROLLSPY)
// ==============================================================================
function setupNavigation() {
    const navLinks = document.querySelectorAll('[data-section]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            navegarA(targetSection);
            cerrarMenuMovil();
        });
    });

    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
        });
    }

    // ScrollSpy automático con IntersectionObserver para sincronizar el enlace activo al hacer scroll
    setupScrollSpy();
}

function setupScrollSpy() {
    if (!('IntersectionObserver' in window)) return;

    const sections = document.querySelectorAll('.hero-section, .section-block');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let id = entry.target.id;
                if (!id && entry.target.classList.contains('hero-section')) {
                    id = 'inicio';
                } else if (id && id.startsWith('sec-')) {
                    id = id.replace('sec-', '');
                }

                navLinks.forEach(link => {
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        root: null,
        rootMargin: '-20% 0px -65% 0px',
        threshold: 0
    });

    sections.forEach(sec => observer.observe(sec));
}

function navegarA(seccionId) {
    detenerAudios();
    AppState.seccionActual = seccionId;

    if (seccionId === 'inicio') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        const targetSec = document.getElementById(`sec-${seccionId}`) || document.getElementById(seccionId);
        if (targetSec) {
            targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('data-section') === seccionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    if (seccionId === 'mapa') {
        setTimeout(iniciarMapaSiEsNecesario, 250);
    }
}

function cerrarMenuMovil() {
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) mobileNav.classList.remove('open');
}

// ==============================================================================
// CAMBIO DE IDIOMA BILINGÜE
// ==============================================================================
function cambiarIdioma(nuevoIdioma) {
    if (AppState.idioma === nuevoIdioma) return;
    detenerAudios();
    AppState.idioma = nuevoIdioma;

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === nuevoIdioma);
    });

    actualizarTextosInterfaz();
    renderizarTodo();
}

function actualizarTextosInterfaz() {
    const t = I18N[AppState.idioma];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t && t[key]) {
            el.innerHTML = t[key];
        }
    });

    const searchInput = document.getElementById('search-especies');
    if (searchInput && t) {
        searchInput.placeholder = t.searchPlaceholder;
    }
}

// ==============================================================================
// CARGA DE DATOS DE LA API REST (CON MERGE INTELIGENTE Y RESILIENCIA)
// ==============================================================================
async function cargarDatos() {
    try {
        const [resEsp, resServ, resAtr, resRut, resRec] = await Promise.all([
            fetch(`api/publico/especies?lang=${AppState.idioma}`).catch(() => null),
            fetch(`api/publico/servicios?lang=${AppState.idioma}`).catch(() => null),
            fetch(`api/publico/atractivos?lang=${AppState.idioma}`).catch(() => null),
            fetch(`api/publico/rutas?lang=${AppState.idioma}`).catch(() => null),
            fetch(`api/publico/recomendaciones?lang=${AppState.idioma}`).catch(() => null)
        ]);

        if (resEsp && resEsp.ok) {
            const serverEspecies = await resEsp.json();
            if (Array.isArray(serverEspecies) && serverEspecies.length > 0) {
                // Mergear atributos complementarios (hábitat/dieta si vienen del servidor o dataset)
                AppState.especies = serverEspecies.map(item => {
                    const fallback = DATASET_ESPECIES_DEFAULT.find(d => d.id === item.id) || {};
                    return {
                        ...fallback,
                        ...item,
                        nombreEs: item.nombreEs || fallback.nombreEs,
                        nombreEn: item.nombreEn || fallback.nombreEn,
                        habitatEs: item.habitat || fallback.habitatEs,
                        dietaEs: item.dieta || fallback.dietaEs,
                        imagen: item.imagen || fallback.imagen,
                        audio: item.audio || fallback.audio
                    };
                });
            }
        }
        if (resServ && resServ.ok) {
            const data = await resServ.json();
            if (Array.isArray(data) && data.length > 0) AppState.servicios = data;
        }
        if (resAtr && resAtr.ok) {
            const data = await resAtr.json();
            if (Array.isArray(data) && data.length > 0) AppState.atractivos = data;
        }
        if (resRut && resRut.ok) {
            const data = await resRut.json();
            if (Array.isArray(data) && data.length > 0) AppState.rutas = data;
        }
        if (resRec && resRec.ok) {
            const data = await resRec.json();
            if (Array.isArray(data) && data.length > 0) AppState.recomendaciones = data;
        }

        renderizarTodo();
    } catch (err) {
        console.info('Aviso: Operando con el catálogo de especies nativas precargado.', err);
        renderizarTodo();
    }
}

function renderizarTodo() {
    renderizarEspecies();
    renderizarServicios();
    renderizarAtractivos();
    renderizarRutas();
    renderizarRecomendaciones();
}

// ==============================================================================
// HELPERS CROMÁTICOS DE CONSERVACIÓN (UICN / LIBRO ROJO)
// ==============================================================================
function obtenerClaseConservacion(estado) {
    if (!estado) return 'badge-menor';
    const e = estado.toLowerCase();
    if (e.includes('critico') || e.includes('cr')) return 'badge-critico';
    if (e.includes('peligro') || e.includes('en')) return 'badge-peligro';
    if (e.includes('vulnerable') || e.includes('vu')) return 'badge-vulnerable';
    if (e.includes('casi') || e.includes('nt')) return 'badge-casi-amenazado';
    return 'badge-menor';
}

// ==============================================================================
// SINCRONIZACIÓN DE AUDIO GLOBAL (PAUSA AUDIOS SIMULTÁNEOS)
// ==============================================================================
function sincronizarReproduccionAudio(reproductorActivo) {
    document.querySelectorAll('audio').forEach(audioEl => {
        if (audioEl !== reproductorActivo && !audioEl.paused) {
            audioEl.pause();
        }
    });

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

// ==============================================================================
// SECCIÓN 2: BIODIVERSIDAD (CARDS INTERACTIVAS, IMÁGENES RESPONSIVAS Y AUDIOS)
// ==============================================================================
function renderizarEspecies() {
    const container = document.getElementById('grid-especies');
    const emptyState = document.getElementById('sin-especies');
    if (!container) return;

    container.innerHTML = '';

    const q = AppState.busquedaEspecie.toLowerCase().trim();
    const filtro = AppState.filtroEspecie;
    const isEn = AppState.idioma === 'en';

    const filtradas = AppState.especies.filter(item => {
        let pasaFiltro = true;
        if (filtro === 'fauna') pasaFiltro = (item.tipo === 'fauna');
        else if (filtro === 'flora') pasaFiltro = (item.tipo === 'flora');
        else if (filtro === 'mamifero' || filtro === 'ave' || filtro === 'roedor') {
            pasaFiltro = (item.categoriaFauna === filtro);
        }

        let pasaBusq = true;
        if (q) {
            const nomEs = (item.nombreEs || item.nombre || '').toLowerCase();
            const nomEn = (item.nombreEn || '').toLowerCase();
            const cient = (item.cientifico || '').toLowerCase();
            pasaBusq = nomEs.includes(q) || nomEn.includes(q) || cient.includes(q);
        }

        return pasaFiltro && pasaBusq;
    });

    if (emptyState) {
        emptyState.style.display = filtradas.length === 0 ? 'block' : 'none';
    }

    filtradas.forEach(esp => {
        const card = document.createElement('article');
        const esFauna = esp.tipo === 'fauna';
        card.className = `card-item animal-card ${esFauna ? 'card-fauna' : 'card-flora'}`;
        card.setAttribute('tabindex', '0');

        const nombreComun = isEn && esp.nombreEn ? esp.nombreEn : (esp.nombreEs || esp.nombre);
        const descripcion = isEn && esp.descripcionEn ? esp.descripcionEn : esp.descripcionEs;
        const datoCurioso = isEn && esp.datoCuriosoEn ? esp.datoCuriosoEn : esp.datoCuriosoEs;
        const habitat = isEn && esp.habitatEn ? esp.habitatEn : (esp.habitatEs || esp.habitat);
        const dieta = isEn && esp.dietaEn ? esp.dietaEn : (esp.dietaEs || esp.dieta);

        const imgPath = `assets/img/${esp.imagen}`;
        const altDescriptivo = `Fotografía de ${nombreComun} (${esp.cientifico}) en su hábitat del Parque Nacional Cotapata`;

        const badgeClass = esFauna ? 'card-badge fauna' : 'card-badge flora';
        const badgeCategory = esFauna ? (esp.categoriaFauna ? esp.categoriaFauna.toUpperCase() : 'FAUNA') : 'FLORA';
        const endemicaBadge = esp.esEndemica ? `<span class="card-badge badge-endemica">⭐ ${isEn ? 'Endemic' : 'Endémica'}</span>` : '';
        const conservacionClass = obtenerClaseConservacion(esp.estadoConservacion);

        // Reproductor de Audio In-Card Integrado
        let audioPlayerHtml = '';
        if (esFauna && esp.audio && esp.tieneAudio !== false) {
            const audioSrc = `assets/audio/${encodeURIComponent(esp.audio)}`;
            audioPlayerHtml = `
                <div class="card-audio-wrapper" onclick="event.stopPropagation()">
                    <div class="audio-control-header">
                        <span class="audio-sound-wave" aria-hidden="true">🔊</span>
                        <span>${isEn ? 'Wild Call / Audio' : 'Sonido / Canto en libertad'}</span>
                    </div>
                    <audio controls preload="none" class="styled-audio-player" onplay="sincronizarReproduccionAudio(this)">
                        <source src="${audioSrc}" type="audio/mpeg">
                        <source src="assets/audio/${esp.audio}" type="audio/mpeg">
                        ${isEn ? 'Your browser does not support audio playback.' : 'Tu navegador no soporta reproducción de audio.'}
                    </audio>
                </div>
            `;
        }

        // Ficha estructurada de Hábitat y Dieta
        let habitatDietaHtml = '';
        if (habitat || dieta) {
            habitatDietaHtml = `
                <div class="card-spec-grid">
                    ${habitat ? `
                        <div class="spec-row">
                            <span class="spec-icon" aria-hidden="true">🏞️</span>
                            <span class="spec-label"><strong>${isEn ? 'Habitat:' : 'Hábitat:'}</strong> ${habitat}</span>
                        </div>` : ''}
                    ${dieta ? `
                        <div class="spec-row">
                            <span class="spec-icon" aria-hidden="true">🍃</span>
                            <span class="spec-label"><strong>${isEn ? 'Diet:' : 'Dieta:'}</strong> ${dieta}</span>
                        </div>` : ''}
                </div>
            `;
        }

        // Bloque de Dato Curioso destacado
        let factHtml = '';
        if (datoCurioso) {
            factHtml = `
                <div class="card-curious-fact">
                    <span class="fact-icon" aria-hidden="true">💡</span>
                    <div><strong>${isEn ? 'Fun Fact:' : 'Dato Curioso:'}</strong> ${datoCurioso}</div>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="card-media">
                <span class="${badgeClass}">${badgeCategory}</span>
                ${endemicaBadge}
                <span class="card-badge badge-conservacion ${conservacionClass}">${esp.estadoConservacion || 'LC'}</span>
                <img src="${imgPath}" alt="${altDescriptivo}" loading="lazy" class="responsive-card-img"
                     onerror="this.src='assets/img/LOGOO.png'">
            </div>
            <div class="card-content">
                <div class="card-heading">
                    <h3 class="card-title">${nombreComun}</h3>
                    <span class="card-scientific"><em>${esp.cientifico || ''}</em></span>
                </div>
                <p class="card-text">${descripcion || ''}</p>
                ${habitatDietaHtml}
                ${audioPlayerHtml}
                ${factHtml}
                <div class="card-meta">
                    <span class="meta-chip status-chip ${conservacionClass}">🛡️ ${esp.estadoConservacion || 'Preocupación Menor'}</span>
                    <button class="btn-card-more" onclick="abrirModalEspeciePorId(${esp.id}); event.stopPropagation();">
                        ${isEn ? 'Full species file' : 'Ver Ficha Completa'} →
                    </button>
                </div>
            </div>
        `;

        card.addEventListener('click', () => abrirModalEspecie(esp));
        container.appendChild(card);
    });
}

function filtrarEspeciesPorTexto(texto) {
    AppState.busquedaEspecie = texto;
    renderizarEspecies();
}

function setFiltroEspecie(filtro, btnEl) {
    AppState.filtroEspecie = filtro;
    document.querySelectorAll('#pills-especies .filter-pill').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    renderizarEspecies();
}

// ==============================================================================
// MODAL DE DETALLE DE ESPECIE (AUDIO ANIMAL + SÍNTESIS DE VOZ TTS + FICHA)
// ==============================================================================
function abrirModalEspeciePorId(id) {
    const esp = AppState.especies.find(e => e.id === id);
    if (esp) abrirModalEspecie(esp);
}

function abrirModalEspecie(esp) {
    AppState.especieSeleccionada = esp;
    detenerAudios();

    const isEn = AppState.idioma === 'en';
    const nombreComun = isEn && esp.nombreEn ? esp.nombreEn : (esp.nombreEs || esp.nombre);
    const descripcion = isEn && esp.descripcionEn ? esp.descripcionEn : esp.descripcionEs;
    const datoCurioso = isEn && esp.datoCuriosoEn ? esp.datoCuriosoEn : esp.datoCuriosoEs;
    const habitat = isEn && esp.habitatEn ? esp.habitatEn : (esp.habitatEs || esp.habitat);
    const dieta = isEn && esp.dietaEn ? esp.dietaEn : (esp.dietaEs || esp.dieta);

    const modal = document.getElementById('modal-detalle');
    const imgEl = document.getElementById('modal-img');
    const titleEl = document.getElementById('modal-title');
    const cientEl = document.getElementById('modal-cientifico');
    const badgeEl = document.getElementById('modal-badge');
    const descEl = document.getElementById('modal-desc');
    const factBox = document.getElementById('modal-fact-box');
    const factText = document.getElementById('modal-fact');
    const audioBox = document.getElementById('modal-audio-box');
    const audioBtn = document.getElementById('btn-play-animal');
    const nativePlayer = document.getElementById('modal-native-player');

    // Ficha técnica
    const specsBox = document.getElementById('modal-specs');
    const habitatEl = document.getElementById('modal-habitat');
    const dietaEl = document.getElementById('modal-dieta');
    const conservacionEl = document.getElementById('modal-conservacion');

    if (imgEl) {
        imgEl.src = `assets/img/${esp.imagen}`;
        imgEl.alt = `Fotografía de ${nombreComun} (${esp.cientifico})`;
    }
    if (titleEl) titleEl.innerText = nombreComun;
    if (cientEl) cientEl.innerText = esp.cientifico || '';

    if (badgeEl) {
        badgeEl.innerText = esp.tipo === 'fauna' 
            ? `FAUNA · ${esp.categoriaFauna ? esp.categoriaFauna.toUpperCase() : 'MAMÍFERO'}` 
            : 'FLORA NATIVA';
        badgeEl.className = `meta-chip ${esp.tipo}`;
    }

    if (specsBox) {
        if (habitat || dieta || esp.estadoConservacion) {
            specsBox.style.display = 'block';
            if (habitatEl) habitatEl.innerText = habitat || (isEn ? 'Not specified' : 'No especificado');
            if (dietaEl) dietaEl.innerText = dieta || (isEn ? 'Not specified' : 'No especificado');
            if (conservacionEl) conservacionEl.innerText = esp.estadoConservacion || 'Preocupación Menor (LC)';
        } else {
            specsBox.style.display = 'none';
        }
    }

    if (descEl) descEl.innerText = descripcion || '';

    if (factBox && factText) {
        if (datoCurioso && datoCurioso.trim()) {
            factText.innerText = datoCurioso;
            factBox.style.display = 'block';
        } else {
            factBox.style.display = 'none';
        }
    }

    if (audioBox) {
        if (esp.tipo === 'fauna' && esp.audio) {
            audioBox.style.display = 'block';
            if (audioBtn) audioBtn.style.display = 'inline-flex';
            if (nativePlayer) {
                nativePlayer.style.display = 'block';
                nativePlayer.src = `assets/audio/${encodeURIComponent(esp.audio)}`;
            }
        } else {
            audioBox.style.display = 'block';
            if (audioBtn) audioBtn.style.display = 'none';
            if (nativePlayer) nativePlayer.style.display = 'none';
        }
    }

    if (modal) modal.classList.add('active');

    // Registrar métrica agregada anónima en Supabase
    registrarMetrica('FAUNA', esp.id, nombreComun);
}

function cerrarModal() {
    detenerAudios();
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
}

// Controles de audio
function reproducirAudioAnimal() {
    const esp = AppState.especieSeleccionada;
    if (!esp || !esp.audio) return;

    detenerAudios();
    const audioSrc = `assets/audio/${encodeURIComponent(esp.audio)}`;
    AppState.audioActual = new Audio(audioSrc);
    AppState.audioActual.play().catch(err => {
        console.warn('Fallo al reproducir audio animal:', err);
    });
}

function reproducirVozTTS() {
    const esp = AppState.especieSeleccionada;
    if (!esp) return;

    detenerAudios();
    if (!('speechSynthesis' in window)) {
        alert('La síntesis de voz no está soportada en este navegador.');
        return;
    }

    const isEn = AppState.idioma === 'en';
    const nombre = isEn && esp.nombreEn ? esp.nombreEn : (esp.nombreEs || esp.nombre);
    const desc = isEn && esp.descripcionEn ? esp.descripcionEn : esp.descripcionEs;
    const fact = isEn && esp.datoCuriosoEn ? esp.datoCuriosoEn : esp.datoCuriosoEs;

    const texto = `${nombre}. ${desc || ''}. ${fact || ''}`;
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = isEn ? 'en-US' : 'es-MX';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
}

function detenerAudios() {
    if (AppState.audioActual) {
        AppState.audioActual.pause();
        AppState.audioActual = null;
    }
    const nativePlayer = document.getElementById('modal-native-player');
    if (nativePlayer) {
        nativePlayer.pause();
    }
    document.querySelectorAll('audio').forEach(a => {
        if (!a.paused) a.pause();
    });
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

// ==============================================================================
// SECCIÓN 3: SERVICIOS COMUNITARIOS
// ==============================================================================
function renderizarServicios() {
    const container = document.getElementById('grid-servicios');
    if (!container) return;
    container.innerHTML = '';

    const filtro = (AppState.filtroServicio || 'todas').toLowerCase();

    const filtrados = AppState.servicios.filter(s => {
        if (filtro === 'todas') return true;
        if (filtro === 'comunidad') {
            return Boolean(s.comunidad && s.comunidad.trim().length > 0);
        }
        return s.comunidad && s.comunidad.toLowerCase() === filtro;
    });

    filtrados.forEach(s => {
        const card = document.createElement('div');
        card.className = 'card-item';
        card.innerHTML = `
            <div class="card-media">
                <span class="card-badge">${s.iconoCategoria || '🏡'} ${s.nombreCategoria || 'Servicio'}</span>
                <img src="assets/img/${s.imagen}" alt="${s.nombre}" loading="lazy" onerror="this.src='assets/img/jungle_banner.jpg'">
            </div>
            <div class="card-content">
                <h3 class="card-title">${s.nombre}</h3>
                <p class="card-subtitle">📍 ${s.comunidad} · ${s.ubicacionReferencial}</p>
                <p class="card-text">${s.descripcion}</p>
                <div class="card-meta">
                    <span class="meta-chip">⏰ ${s.horarioAtencion}</span>
                    <span class="meta-chip">💲 ${s.rangoPrecios}</span>
                </div>
                <div style="margin-top:0.6rem; font-size:0.72rem; color:var(--success); font-weight:700;">
                    ✓ Autorizado por la Comunidad · Idiomas: ${s.idiomasAtencion}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function setFiltroServicio(filtro, btnEl) {
    AppState.filtroServicio = filtro;
    document.querySelectorAll('#pills-servicios .filter-pill').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    renderizarServicios();
}

function setFiltroServicioCat(cat, btnEl) {
    AppState.filtroServicioCat = cat;
    renderizarServicios();
}

function setFiltroServicioCom(com, btnEl) {
    AppState.filtroServicio = com;
    renderizarServicios();
}

// ==============================================================================
// SECCIÓN 4: ATRACTIVOS TURÍSTICOS
// ==============================================================================
function renderizarAtractivos() {
    const container = document.getElementById('grid-atractivos');
    if (!container) return;
    container.innerHTML = '';

    AppState.atractivos.forEach(a => {
        const card = document.createElement('div');
        card.className = 'card-item';
        card.innerHTML = `
            <div class="card-media">
                <span class="card-badge">🏞️ ${a.categoria}</span>
                <img src="assets/img/${a.imagen}" alt="${a.nombre}" loading="lazy" onerror="this.src='assets/img/cotapata_aerial.jpg'">
            </div>
            <div class="card-content">
                <h3 class="card-title">${a.nombre}</h3>
                <p class="card-subtitle">Altitud: ${a.altitudMsnm} msnm</p>
                <p class="card-text">${a.descripcion}</p>
                <div class="rule-tip" style="margin-top:0.4rem; font-size:0.75rem;">
                    💡 <strong>Tip de visita:</strong> ${a.recomendaciones || 'Seguir sendero oficial'}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// ==============================================================================
// SECCIÓN 5: RUTAS Y SENDEROS
// ==============================================================================
function renderizarRutas() {
    const container = document.getElementById('grid-rutas');
    if (!container) return;
    container.innerHTML = '';

    AppState.rutas.forEach(r => {
        const card = document.createElement('div');
        card.className = 'card-item';
        card.innerHTML = `
            <div class="card-media">
                <span class="card-badge">🥾 Dificultad: ${r.dificultad}</span>
                <img src="assets/img/${r.imagen}" alt="${r.nombre}" loading="lazy" onerror="this.src='assets/img/cotapata_aerial.jpg'">
            </div>
            <div class="card-content">
                <h3 class="card-title">${r.nombre}</h3>
                <p class="card-subtitle">Distancia: ${r.distanciaKm} km · Tiempo: ${r.duracionHoras}</p>
                <p class="card-text">${r.descripcion}</p>
                <div class="card-meta">
                    <span class="meta-chip">📉 Desnivel: ${r.desnivelMetros} m</span>
                </div>
                <div class="rule-tip" style="margin-top:0.6rem; border-left-color:var(--danger); font-size:0.75rem;">
                    ⚠️ <strong>Seguridad:</strong> ${r.recomendacionesSeguridad}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// ==============================================================================
// SECCIÓN 6: MAPA INTERACTIVO LEAFLET
// ==============================================================================
function iniciarMapaSiEsNecesario() {
    if (AppState.mapaIniciado && AppState.mapaInstancia) {
        AppState.mapaInstancia.invalidateSize();
        return;
    }

    if (typeof L === 'undefined') {
        console.error('Librería Leaflet no disponible.');
        return;
    }

    const mapContainer = document.getElementById('leaflet-map');
    if (!mapContainer) return;

    const cotapataCenter = [-16.20, -67.85];
    const map = L.map('leaflet-map', {
        center: cotapataCenter,
        zoom: 13,
        minZoom: 12,
        maxZoom: 15
    });

    const offlineLayer = L.tileLayer('assets/mapa_offline/{z}/{x}/{y}.png', {
        minZoom: 12,
        maxZoom: 15,
        attribution: '© Cotapata Explora · Universidad Salesiana de Bolivia'
    });
    offlineLayer.addTo(map);

    const puntos = [
        { lat: -16.20, lng: -67.85, titulo: 'Camino Precolombino El Choro', desc: 'Calzada ancestral prehispánica de trekking' },
        { lat: -16.185, lng: -67.83, titulo: 'Bosque Nublado de los Yungas', desc: 'Ecosistema de alta biodiversidad y niebla' },
        { lat: -16.16, lng: -67.80, titulo: 'Chairo (Final de Senda)', desc: 'Comunidad anfitriona, guías y gastronomía' },
        { lat: -16.19, lng: -67.84, titulo: 'Sandillani', desc: 'Albergues y camping ecológico de altura' },
        { lat: -16.22, lng: -67.86, titulo: 'Puesto Guardaparques SERNAP', desc: 'Registro obligatorio y control de visitantes' }
    ];

    puntos.forEach(p => {
        const marker = L.marker([p.lat, p.lng]).addTo(map);
        marker.bindPopup(`
            <div style="font-family:'Poppins',sans-serif; padding:4px;">
                <b style="color:#235030;">${p.titulo}</b><br>
                <span style="font-size:0.8rem; color:#555;">${p.desc}</span>
            </div>
        `);
    });

    AppState.mapaInstancia = map;
    AppState.mapaIniciado = true;
}

// ==============================================================================
// SECCIÓN 7: RECOMENDACIONES Y COMPROMISOS AMBIENTALES
// ==============================================================================
function renderizarRecomendaciones() {
    const container = document.getElementById('grid-recomendaciones');
    if (!container) return;
    container.innerHTML = '';

    AppState.recomendaciones.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'rule-card';
        card.innerHTML = `
            <div class="rule-icon">${rec.icono || '🌱'}</div>
            <div class="rule-body">
                <h4>${rec.titulo}</h4>
                <p>${rec.descripcion}</p>
                <div class="rule-tip">
                    💡 <strong>Consejo práctico:</strong> ${rec.consejoPractico}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function iniciarCompromisos() {
    const chips = document.querySelectorAll('.commit-chip');
    if (!chips || chips.length === 0) return;
    chips.forEach(chip => {
        const id = chip.getAttribute('data-commit');
        if (localStorage.getItem(`commit_${id}`) === 'true') {
            chip.classList.add('checked');
            const checkEl = chip.querySelector('.check');
            if (checkEl) checkEl.innerText = '✓ Asumido';
        }

        chip.addEventListener('click', () => {
            chip.classList.toggle('checked');
            const isChecked = chip.classList.contains('checked');
            localStorage.setItem(`commit_${id}`, isChecked ? 'true' : 'false');
            const checkEl = chip.querySelector('.check');
            if (checkEl) checkEl.innerText = isChecked ? '✓ Asumido' : '○ Tocar para asumir';
        });
    });
}

// ==============================================================================
// REGISTRO DE INTERACCIONES AGREGADAS (ANÓNIMAS)
// ==============================================================================
function registrarMetrica(tipo, idRecurso, nombreRecurso) {
    try {
        fetch('api/publico/interaccion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipo: tipo,
                idRecurso: idRecurso,
                nombreRecurso: nombreRecurso,
                idioma: AppState.idioma
            })
        }).catch(() => {});
    } catch (e) {}
}

function setupEventListeners() {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarModal();
    });

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cerrarModal();
        });
    });
}
