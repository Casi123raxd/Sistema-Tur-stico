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
    // ======================== ALOJAMIENTOS ========================
    // --- Chairo ---
    {
        id: 101, tipoServicio: 'alojamiento', comunidad: 'Chairo',
        nombre: 'Cabaña Familiar Río Chairo',
        descripcion: 'Acogedora cabaña de adobe y madera a orillas del río, rodeada de vegetación subtropical. Disfrute del murmullo del agua y el canto de aves tropicales al despertar. Incluye ropa de cama limpia, mosquitero y desayuno con frutas locales.',
        imagen: 'alojamiento/alojamiento1.jpeg',
        precios: '80 Bs/noche (individual) · 120 Bs/noche (doble) · 200 Bs/2 noches (doble)',
        iconoCategoria: '🏡', nombreCategoria: 'Alojamiento',
        ubicacionReferencial: 'A 150 m del puente de Chairo', horarioAtencion: 'Check-in: 14:00 – Check-out: 11:00',
        rangoPrecios: '80 – 200 Bs', idiomasAtencion: 'Español, Aymara'
    },
    {
        id: 102, tipoServicio: 'alojamiento', comunidad: 'Chairo',
        nombre: 'Hospedaje Comunitario El Valle',
        descripcion: 'Habitaciones sencillas y limpias con vista al valle subtropical de Chairo. Ideal para caminantes que llegan tras completar la ruta del Choro. Baño compartido con agua caliente por sistema solar.',
        imagen: 'alojamiento/alojamiento2.jpeg',
        precios: '60 Bs/noche (individual) · 100 Bs/noche (doble) · 250 Bs/3 noches (doble)',
        iconoCategoria: '🏡', nombreCategoria: 'Alojamiento',
        ubicacionReferencial: 'Centro de la comunidad de Chairo', horarioAtencion: 'Check-in: 13:00 – Check-out: 10:00',
        rangoPrecios: '60 – 250 Bs', idiomasAtencion: 'Español, Aymara'
    },
    {
        id: 103, tipoServicio: 'alojamiento', comunidad: 'Chairo',
        nombre: 'Posada del Caminante Chairo',
        descripcion: 'Refugio rústico con hamacas y literas para mochileros. Cocina comunitaria disponible, fogón al aire libre para compartir historias del camino. El clima cálido del valle hace agradable cada estadía.',
        imagen: 'alojamiento/alojamiento3.jpeg',
        precios: '45 Bs/noche (litera) · 70 Bs/noche (privada) · 180 Bs/3 noches (privada)',
        iconoCategoria: '🏡', nombreCategoria: 'Alojamiento',
        ubicacionReferencial: 'Final del sendero El Choro, junto al río', horarioAtencion: 'Check-in: 12:00 – Check-out: 11:00',
        rangoPrecios: '45 – 180 Bs', idiomasAtencion: 'Español, Aymara'
    },
    // --- Sandillani ---
    {
        id: 104, tipoServicio: 'alojamiento', comunidad: 'Sandillani',
        nombre: 'Albergue Bosque Nublado Sandillani',
        descripcion: 'Refugio ecológico inmerso en el bosque nublado, donde la neblina matutina abraza los jardines de orquídeas. Habitaciones con paredes de piedra y techo de paja, ideales para el descanso profundo del caminante. Incluye infusión de hierbas aromáticas al llegar.',
        imagen: 'alojamiento/alojamiento4.jpeg',
        precios: '95 Bs/noche (individual) · 150 Bs/noche (doble) · 270 Bs/2 noches (doble)',
        iconoCategoria: '🏡', nombreCategoria: 'Alojamiento',
        ubicacionReferencial: 'Tramo medio del Choro, sector Sandillani', horarioAtencion: 'Check-in: 14:00 – Check-out: 10:00',
        rangoPrecios: '95 – 270 Bs', idiomasAtencion: 'Español, Aymara'
    },
    {
        id: 105, tipoServicio: 'alojamiento', comunidad: 'Sandillani',
        nombre: 'Camping y Jardín de Orquídeas',
        descripcion: 'Zona de acampada con plataformas niveladas entre helechos gigantes y un sendero de orquídeas silvestres. Baños ecológicos, agua de vertiente cristalina y un fogón techado para noches estrelladas en la ceja de monte.',
        imagen: 'alojamiento/alojamiento5.jpeg',
        precios: '35 Bs/noche (carpa propia) · 55 Bs/noche (carpa alquiler) · 90 Bs/2 noches (carpa alquiler)',
        iconoCategoria: '🏡', nombreCategoria: 'Alojamiento',
        ubicacionReferencial: 'Ladera boscosa junto a cascada Sandillani', horarioAtencion: 'Abierto las 24 horas',
        rangoPrecios: '35 – 90 Bs', idiomasAtencion: 'Español'
    },
    {
        id: 106, tipoServicio: 'alojamiento', comunidad: 'Sandillani',
        nombre: 'Casa de Descanso La Neblina',
        descripcion: 'Habitación privada con balcón panorámico al valle nublado. Amanecer entre nubes, jardín medicinal y servicio de mate de coca y api caliente para recuperar energías. El silencio del bosque es el mejor lujo.',
        imagen: 'alojamiento/alojamiento6.jpeg',
        precios: '110 Bs/noche (individual) · 170 Bs/noche (doble) · 300 Bs/2 noches (doble)',
        iconoCategoria: '🏡', nombreCategoria: 'Alojamiento',
        ubicacionReferencial: 'Mirador alto de Sandillani', horarioAtencion: 'Check-in: 15:00 – Check-out: 10:00',
        rangoPrecios: '110 – 300 Bs', idiomasAtencion: 'Español, Aymara'
    },
    // --- Pacollo ---
    {
        id: 107, tipoServicio: 'alojamiento', comunidad: 'Pacollo',
        nombre: 'Ecolodge Cafetal Pacollo',
        descripcion: 'Cabañas rodeadas de plantaciones de café orgánico de sombra. Despierte con el aroma del café recién tostado y explore los senderos agroforestales. Cada cabaña tiene ventanas amplias hacia el cañón verde del Huarinilla.',
        imagen: 'alojamiento/alojamiento7.jpeg',
        precios: '130 Bs/noche (individual) · 200 Bs/noche (doble) · 350 Bs/2 noches (doble)',
        iconoCategoria: '🏡', nombreCategoria: 'Alojamiento',
        ubicacionReferencial: 'Finca cafetalera de Pacollo, valle de Huarinilla', horarioAtencion: 'Check-in: 14:00 – Check-out: 11:00',
        rangoPrecios: '130 – 350 Bs', idiomasAtencion: 'Español'
    },
    {
        id: 108, tipoServicio: 'alojamiento', comunidad: 'Pacollo',
        nombre: 'Hospedaje Familiar Los Cítricos',
        descripcion: 'Casa familiar con habitaciones cómodas entre huertos de naranjas y mandarinas. Desayuno casero con mermeladas artesanales. Ambiente familiar con patio amplio y vistas al verdor eterno de los Yungas.',
        imagen: 'alojamiento/alojamiento8.jpeg',
        precios: '75 Bs/noche (individual) · 120 Bs/noche (doble) · 210 Bs/2 noches (doble)',
        iconoCategoria: '🏡', nombreCategoria: 'Alojamiento',
        ubicacionReferencial: 'Sector agrícola de Pacollo', horarioAtencion: 'Check-in: 13:00 – Check-out: 10:00',
        rangoPrecios: '75 – 210 Bs', idiomasAtencion: 'Español, Aymara'
    },
    {
        id: 109, tipoServicio: 'alojamiento', comunidad: 'Pacollo',
        nombre: 'Refugio Caminante del Cañón',
        descripcion: 'Pequeño refugio en el borde del cañón con terrazas naturales para contemplar los atardeceres yungueños. Ideal para fotógrafos y naturalistas. Servicio básico con autenticidad rural incomparable.',
        imagen: 'alojamiento/alojamiento9.jpeg',
        precios: '55 Bs/noche (individual) · 90 Bs/noche (doble) · 160 Bs/2 noches (doble)',
        iconoCategoria: '🏡', nombreCategoria: 'Alojamiento',
        ubicacionReferencial: 'Mirador del cañón Huarinilla, Pacollo', horarioAtencion: 'Check-in: 12:00 – Check-out: 11:00',
        rangoPrecios: '55 – 160 Bs', idiomasAtencion: 'Español'
    },

    // ======================== LUGARES ========================
    // --- Chairo ---
    {
        id: 201, tipoServicio: 'lugar', comunidad: 'Chairo',
        nombre: 'Centro Comunitario de Chairo',
        descripcion: 'Corazón de la comunidad de Chairo, donde las familias se reúnen, los caminantes son recibidos con hospitalidad y la vida cotidiana fluye entre huertos, animales y el rumor del río cercano.',
        imagen: 'lugares/Chairo1.jpeg',
        iconoCategoria: '📍', nombreCategoria: 'Lugar',
        ubicacionReferencial: 'Centro de la comunidad de Chairo'
    },
    {
        id: 202, tipoServicio: 'lugar', comunidad: 'Chairo',
        nombre: 'Puente Histórico del Río Chairo',
        descripcion: 'Punto de encuentro donde el antiguo camino del Choro cruza el río. Las casas de adobe y los techos de calamina se mezclan con el follaje tropical. Un lugar de descanso con significado histórico profundo.',
        imagen: 'lugares/Chairo2.jpeg',
        iconoCategoria: '📍', nombreCategoria: 'Lugar',
        ubicacionReferencial: 'Ribera del río, Chairo'
    },
    {
        id: 203, tipoServicio: 'lugar', comunidad: 'Chairo',
        nombre: 'Mirador y Casas de Chairo',
        descripcion: 'Desde las terrazas de las casas de Chairo se contemplan las laderas cubiertas de vegetación subtropical, el río serpenteante y los senderos que suben hacia el bosque nublado.',
        imagen: 'lugares/Chairo3.jpeg',
        iconoCategoria: '📍', nombreCategoria: 'Lugar',
        ubicacionReferencial: 'Sector alto de Chairo'
    },
    // --- Sandillani ---
    {
        id: 204, tipoServicio: 'lugar', comunidad: 'Sandillani',
        nombre: 'Aldea de Sandillani entre Nubes',
        descripcion: 'Pequeña comunidad asentada en la ladera del bosque nublado. Las casas emergen entre la niebla matutina, rodeadas de helechos arborescentes y el canto constante de aves del bosque.',
        imagen: 'lugares/Sandillani1.jpeg',
        iconoCategoria: '📍', nombreCategoria: 'Lugar',
        ubicacionReferencial: 'Comunidad de Sandillani, ceja de monte'
    },
    {
        id: 205, tipoServicio: 'lugar', comunidad: 'Sandillani',
        nombre: 'Sendero de las Cascadas Sandillani',
        descripcion: 'Camino entre vegetación exuberante que conduce a pequeñas cascadas cristalinas. El musgo y las orquídeas adornan cada roca, creando un paisaje de cuento de hadas andino.',
        imagen: 'lugares/Sandillani2.jpeg',
        iconoCategoria: '📍', nombreCategoria: 'Lugar',
        ubicacionReferencial: 'Quebrada baja de Sandillani'
    },
    {
        id: 206, tipoServicio: 'lugar', comunidad: 'Sandillani',
        nombre: 'Vista Panorámica de Sandillani',
        descripcion: 'Desde este punto elevado se divisa el valle entero envuelto en nubes. Las casas de la comunidad se ven diminutas entre el bosque denso, un testimonio de la convivencia armónica con la naturaleza.',
        imagen: 'lugares/Sandillani3.jpeg',
        iconoCategoria: '📍', nombreCategoria: 'Lugar',
        ubicacionReferencial: 'Mirador alto Sandillani'
    },
    // --- Pacollo ---
    {
        id: 207, tipoServicio: 'lugar', comunidad: 'Pacollo',
        nombre: 'Plaza y Viviendas de Pacollo',
        descripcion: 'Centro comunitario de Pacollo rodeado de parcelas agrícolas familiares donde se cultivan café, cítricos y coca. Un lugar donde la tradición agraria se mantiene viva generación tras generación.',
        imagen: 'lugares/Pacollo1.jpeg',
        iconoCategoria: '📍', nombreCategoria: 'Lugar',
        ubicacionReferencial: 'Centro de Pacollo'
    },
    {
        id: 208, tipoServicio: 'lugar', comunidad: 'Pacollo',
        nombre: 'Cafetales y Huertos de Pacollo',
        descripcion: 'Terrazas agrícolas con cafetales de sombra, árboles frutales y huertas familiares. El paisaje verde intenso de los Yungas enmarca cada parcela con una belleza natural impresionante.',
        imagen: 'lugares/Pacollo2.jpeg',
        iconoCategoria: '📍', nombreCategoria: 'Lugar',
        ubicacionReferencial: 'Sector agrícola de Pacollo'
    },
    {
        id: 209, tipoServicio: 'lugar', comunidad: 'Pacollo',
        nombre: 'Camino Rural y Paisaje de Pacollo',
        descripcion: 'Sendero de tierra que conecta las casas de Pacollo con las parcelas y el bosque circundante. Las vistas al cañón del Huarinilla son espectaculares en cada recodo del camino.',
        imagen: 'lugares/Pacollo3.jpeg',
        iconoCategoria: '📍', nombreCategoria: 'Lugar',
        ubicacionReferencial: 'Camino rural de Pacollo'
    },

    // ======================== COMIDAS ========================
    {
        id: 301, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Api de la Aurora Tibia',
        descripcion: 'Bebida espesa y reconfortante de maíz morado, canela y clavo de olor. Servida caliente al amanecer, es el abrazo líquido perfecto para comenzar la jornada en las alturas de Cotapata.',
        imagen: 'comidas/Api.jpeg', precio: '8 Bs'
    },
    {
        id: 302, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Café del Bosque Nublado',
        descripcion: 'Café orgánico cultivado bajo la sombra de los árboles nativos de Cotapata. Tostado artesanalmente, con notas achocolatadas y aroma profundo que evoca la tierra húmeda del Yungas.',
        imagen: 'comidas/Café.jpeg', precio: '10 Bs'
    },
    {
        id: 303, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Caldo de la Brisa Quieta',
        descripcion: 'Sopa reconfortante de verduras frescas del huerto comunitario, con papa andina y hierbas aromáticas recogidas al alba. Un plato que calienta el alma del caminante cansado.',
        imagen: 'comidas/Caldo de la Brisa Quieta.jpeg', precio: '18 Bs'
    },
    {
        id: 304, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Cazuela de Tiempo Lento',
        descripcion: 'Guiso de carne cocido lentamente con especias locales, zanahoria, choclo tierno y papa runa. Un plato que lleva horas de paciencia y generaciones de sazón familiar.',
        imagen: 'comidas/Cazuela de lento.jpeg', precio: '30 Bs'
    },
    {
        id: 305, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Chicharrón Crocante del Valle',
        descripcion: 'Cerdo crocante dorado a fuego bajo, servido con mote suave y ensalada fresca. Cada bocado cruje con el sabor auténtico de la cocina yungueña de montaña.',
        imagen: 'comidas/Chicharon de cerdo.jpeg', precio: '35 Bs'
    },
    {
        id: 306, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Desayuno Yungueño Completo',
        descripcion: 'Pan artesanal, queso fresco, mermelada de frutos silvestres, huevos de campo y jugo natural de naranja del valle. Todo servido con la calidez de una familia anfitriona.',
        imagen: 'comidas/Desayuno Yungueño.jpeg', precio: '22 Bs'
    },
    {
        id: 307, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Refresco de Aguas Mansas',
        descripcion: 'Mocochinchi artesanal: durazno deshidratado al sol rehidratado con canela, clavo y un toque de azúcar morena. La bebida más refrescante para el calor subtropical.',
        imagen: 'comidas/fresco de mocochinchi.jpeg', precio: '7 Bs'
    },
    {
        id: 308, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Guiso de la Tarde Mansa',
        descripcion: 'Estofado espeso de cordero con papas nativas, arvejas frescas y comino andino. Servido en plato de barro con chuño phuti como acompañamiento tradicional.',
        imagen: 'comidas/Guiso de la mansa.jpeg', precio: '28 Bs'
    },
    {
        id: 309, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Néctar de Chicha Morada',
        descripcion: 'Refresco natural de maíz morado con limón, manzana y especias aromáticas. De color púrpura intenso y sabor dulce con un toque cítrico revitalizante.',
        imagen: 'comidas/Jugo de chicha mora.jpeg', precio: '8 Bs'
    },
    {
        id: 310, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Jugo Sol de Naranja',
        descripcion: 'Jugo recién exprimido de naranjas del valle de Huarinilla. Sin azúcar añadida, pura vitamina C natural con el dulzor perfecto de la fruta madura al sol subtropical.',
        imagen: 'comidas/Jugo de naranja.jpeg', precio: '7 Bs'
    },
    {
        id: 311, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Elixir de Papaya Tropical',
        descripcion: 'Batido cremoso de papaya fresca cosechada en las huertas familiares. Suave, dulce y naturalmente refrescante, perfecto para hidratarse después de una larga caminata.',
        imagen: 'comidas/Jugo de papaya.jpeg', precio: '9 Bs'
    },
    {
        id: 312, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Néctar de Piña Silvestre',
        descripcion: 'Jugo de piña fresca del valle con hierbabuena. Ácido y dulce en equilibrio perfecto, como el contraste entre la cumbre andina y el trópico yungueño.',
        imagen: 'comidas/Jugo de piña.jpeg', precio: '8 Bs'
    },
    {
        id: 313, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Batido de Plátano del Río Manso',
        descripcion: 'Plátano maduro de los huertos de Cotapata batido con leche fresca. Energético, cremoso y con el sabor genuino de la fruta cultivada sin químicos.',
        imagen: 'comidas/Jugo de platano.jpeg', precio: '8 Bs'
    },
    {
        id: 314, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Néctar de la Calma',
        descripcion: 'Infusión fría de frutas del bosque con miel de abeja silvestre y hierbas aromáticas locales. Una bebida que transmite la serenidad del paisaje de Cotapata en cada sorbo.',
        imagen: 'comidas/Néctar de la Calma.jpeg', precio: '10 Bs'
    },
    {
        id: 315, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Bocados del Río Manso',
        descripcion: 'Trucha fresca del río Huarinilla, asada a la parrilla con limón, ajo silvestre y romero de montaña. Servida sobre hojas de plátano con yuca dorada y ensalada local.',
        imagen: 'comidas/pescado a la parrilla.jpeg', precio: '38 Bs'
    },
    {
        id: 316, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Piquemacho de la Cumbre',
        descripcion: 'Generosa fuente de carne de res y embutido sobre papas fritas crocantes, cebolla salteada, tomate, locoto y huevo. El plato contundente para reponer energías del trekking.',
        imagen: 'comidas/Piquemacho.jpeg', precio: '40 Bs'
    },
    {
        id: 317, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Medallones del Claro de Bosque',
        descripcion: 'Pollo de campo horneado lentamente con hierbas de la ceja de monte, servido con arroz graneado y plátano maduro frito. Sabor casero con la esencia de los Yungas.',
        imagen: 'comidas/Pollo al hornio.jpeg', precio: '32 Bs'
    },
    {
        id: 318, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Pétalos de Huerto en Reposo',
        descripcion: 'Delicada ensalada de hojas verdes del huerto comunitario, flores comestibles, queso fresco desmenuzado y vinagreta de limón. Un plato ligero y visualmente encantador.',
        imagen: 'comidas/Pétalos de huerto reposo.jpeg', precio: '18 Bs'
    },
    {
        id: 319, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Estofado de la Tarde Clara',
        descripcion: 'Carne de res rellena con huevo, aceitunas y especias andinas, cocida al horno con salsa de ají colorado. Una receta transmitida de generación en generación en los Yungas.',
        imagen: 'comidas/Relleno de carne.jpeg', precio: '30 Bs'
    },
    {
        id: 320, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Rollo de Cosecha Serena',
        descripcion: 'Rollito de masa relleno de verduras salteadas y queso fundido, horneado hasta dorar. Crujiente por fuera, suave por dentro, con un dip de ají de maní casero.',
        imagen: 'comidas/Rollo de cosecha serena.jpeg', precio: '15 Bs'
    },
    {
        id: 321, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Crema de Rocío Matinal',
        descripcion: 'Salteñas jugosas rellenas de carne picada, papa, arvejas, huevo y caldo especiado. Masa dorada y dulce que guarda un interior caldoso y aromático. Tradición boliviana en cada mordisco.',
        imagen: 'comidas/Salteñas.jpeg', precio: '12 Bs'
    },
    {
        id: 322, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Sopa de Maní del Caminante',
        descripcion: 'Sopa espesa de maní molido con fideos, papa, zanahoria y carne. La receta más emblemática de Bolivia, servida humeante para reconfortar al viajero tras horas de senda.',
        imagen: 'comidas/Sopa de mani.jpeg', precio: '20 Bs'
    },
    {
        id: 323, tipoServicio: 'comida', comunidad: 'Cotapata',
        nombre: 'Pastel de la Cumbre Dormida',
        descripcion: 'Yuca fresca del valle cortada en bastones gruesos y frita hasta lograr un dorado perfecto. Crocante y suave a la vez, acompañada con salsa picante de locoto y llajwa.',
        imagen: 'comidas/Yuca frita.jpeg', precio: '12 Bs'
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
        imagen: 'Bosque nublado yungas.jpg'
    },
    {
        id: 3,
        categoria: 'Paisaje Hídrico y Balneario',
        nombre: 'Cuenca y Río Huarinilla',
        altitudMsnm: 1300,
        descripcion: 'Principal cuenca hidrográfica del parque, vital para la regulación de agua dulce de comunidades yungueñas.',
        recomendaciones: 'Prohibido arrojar residuos plásticos o jabones no biodegradables al agua.',
        imagen: 'Río huarinilla.png'
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
        imagen: 'Travesia choro.jpg'
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
        imagen: 'Senderon interpretativo sandillani.jpg'
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
        imagen: 'Bosque en Queñuas.jpg'
    }
];

const DATASET_RECOMENDACIONES_DEFAULT = [
    {
        id: 1,
        icono: '🗑️',
        titulo: 'Principio Zero Basura (No Deje Rastro)',
        descripcion: 'Todo residuo que traigas contigo debe retornar a la ciudad de La Paz. En las sendas y cañones de Cotapata no existe servicio de recojo de basura.',
        consejoPractico: 'Lleva bolsas herméticas reutilizables para separar y cargar tus residuos orgánicos e inorgánicos hasta un punto urbano de acopio.'
    },
    {
        id: 2,
        icono: '🧥',
        titulo: 'Equipamiento para Cambio Climático y Altitud',
        descripcion: 'El recorrido transita desde el frío gélido de la cordillera andina (4,800 msnm) hasta el calor húmedo y la lluvia subtropical de Yungas (1,300 msnm).',
        consejoPractico: 'Vístete en capas: primera capa térmica respirable, polar intermedio, impermeable cortaviento y ropa ligera transpirable para el descenso.'
    },
    {
        id: 3,
        icono: '💧',
        titulo: 'Hidratación y Alimentación en Ruta',
        descripcion: 'El esfuerzo físico continuado provoca deshidratación acelerada. Aunque existen cursos de agua de montaña, es vital beber agua segura.',
        consejoPractico: 'Carga mínimo 2 litros de agua por día, pastillas potabilizadoras o filtro portátil, frutos secos, barritas de cereal y electrolitos.'
    },
    {
        id: 4,
        icono: '🌧️',
        titulo: 'Seguridad en Época de Lluvias',
        descripcion: 'Entre diciembre y marzo las lluvias pueden intensificarse rápidamente, haciendo resbaladizas las calzadas de piedra incaicas e incrementando caudales de ríos.',
        consejoPractico: 'Utiliza botas de caña media con suela de tracción antideslizante, bastones de trekking regulables y consulta el reporte de SERNAP antes de partir.'
    },
    {
        id: 5,
        icono: '📋',
        titulo: 'Registro en Puestos de Guardaparques',
        descripcion: 'Registrarse formalmente en el puesto SERNAP de La Cumbre o Unduavi es mandatorio para garantizar la protección del área y la seguridad del visitante.',
        consejoPractico: 'Porta documento de identidad, cancela el canon oficial de ingreso al parque y conserva el comprobante hasta el puesto de control de salida en Chairo.'
    },
    {
        id: 6,
        icono: '📸',
        titulo: 'Fotografía Ética y Respeto Local',
        descripcion: 'Chairo, Sandillani y Pacollo son comunidades vivas con normas y costumbres tradicionales. La empatía y el respeto fundamentan el turismo comunitario.',
        consejoPractico: 'Pide autorización cordial antes de fotografiar a comunarios, viviendas o huertos familiares; valora y adquiere productos directamente de las familias.'
    },
    {
        id: 7,
        icono: '🐾',
        titulo: 'Protección a la Fauna Silvestre',
        descripcion: 'Cotapata alberga especies amenazadas como el Oso Jucumari, el Tunki y felinos nativos. Jamás intentes alimentarlos ni alteres su hábitat.',
        consejoPractico: 'Mantén una distancia prudente, guarda los alimentos herméticamente en campamento y camina en silencio para disfrutar de sus sonidos naturales.'
    },
    {
        id: 8,
        icono: '🔥',
        titulo: 'Prohibición Absoluta de Fogatas',
        descripcion: 'Hacer fuego está terminantemente prohibido en pastizales, bosques y senderos debido al grave riesgo de incendios forestales incontrolables.',
        consejoPractico: 'Utiliza exclusivamente cocinillas portátiles a gas en áreas de acampada delimitadas y autorizadas por las comunidades locales.'
    },
    {
        id: 9,
        icono: '🥾',
        titulo: 'Permanecer en los Senderos Marcados',
        descripcion: 'Caminar fuera de sendero compacta el suelo fértil, deteriora especies botánicas pioneras y expone al caminante a caídas en pendientes pronunciadas.',
        consejoPractico: 'Sigue la calzada prehispánica oficial; ante niebla densa, mantente en grupo y evita atajos no verificados por guardaparques.'
    },
    {
        id: 10,
        icono: '🍃',
        titulo: 'Prevención del Mal de Altura (Sorojchi)',
        descripcion: 'El inicio en La Cumbre supera los 4,700 msnm, lo que exige una debida aclimatación previa del organismo al aire enrarecido.',
        consejoPractico: 'Pasa al menos 24 a 48 horas en La Paz antes del trekking, evita comidas pesadas previas y consume infusiones tibias de coca y muña.'
    }
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
        heroTitle: 'Descubre la Riqueza Natural y Comunitaria de Cotapata',
        heroSubtitle: 'Plataforma comunitaria de información sobre biodiversidad, senderos ancestrales, servicios locales y conservación ambiental.',
        btnExplorar: 'Explorar Biodiversidad',
        btnServicios: 'Servicios Comunitarios',
        btnMapa: 'Ver Mapa Interactivo',
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
        servNotice: 'Información validada voluntariamente por comunarios de Chairo, Sandillani y Pacollo. Sin intermediarios comerciales.',
        atrTitulo: 'Atractivos Turísticos y Culturales',
        atrSub: 'Puntos de interés natural, cascadas, miradores y vestigios del Camino del Choro.',
        rutasTitulo: 'Rutas y Senderos de Cotapata',
        rutasSub: 'Información técnica verificada: distancias, desniveles, dificultades y recomendaciones de seguridad.',
        mapaTitulo: 'Geolocalización y Cartografía de Cotapata',
        mapaSub: 'Mosaicos cartográficos del Parque Nacional Cotapata con atractivos, comunidades y senderos.',
        recTitulo: 'Recomendaciones para una Visita Responsable',
        recSub: 'Código ético de conservación para proteger los ecosistemas andinos y respetar a las comunidades.',
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
        heroTitle: 'Discover the Natural & Community Heritage of Cotapata',
        heroSubtitle: 'A community-driven digital platform for biodiversity exploration, ancestral trails, local services, and environmental stewardship.',
        btnExplorar: 'Explore Biodiversity',
        btnServicios: 'Community Services',
        btnMapa: 'View Interactive Map',
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
        servNotice: 'Information verified with informed consent from Chairo, Sandillani, and Pacollo communities. No commercial markups.',
        atrTitulo: 'Natural & Cultural Attractions',
        atrSub: 'Scenic viewpoints, cloud forests, mountain rivers, and ancestral paved roads.',
        rutasTitulo: 'Hiking Routes & Trails',
        rutasSub: 'Verified technical trail data: distances, elevation shifts, difficulty ratings, and safety measures.',
        mapaTitulo: 'Cotapata Interactive Map & Cartography',
        mapaSub: 'High-resolution park map showing key points of interest, communities, and trails.',
        recTitulo: 'Responsible Visitor Guidelines',
        recSub: 'An ethical conservation code to safeguard fragile Andean cloud forests and respect local residents.',
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

    // Auto-cargador del mapa para que nunca aparezca en blanco al hacer scroll
    setupMapAutoLoader();
    setTimeout(iniciarMapaSiEsNecesario, 350);

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
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileNav.classList.toggle('open');
            mobileToggle.innerHTML = isOpen ? '✕' : '☰';
            mobileToggle.setAttribute('aria-label', isOpen ? 'Cerrar Menú' : 'Abrir Menú');
        });
    }

    // Cerrar al hacer click fuera del menú móvil
    document.addEventListener('click', (e) => {
        if (mobileNav && mobileNav.classList.contains('open')) {
            if (!mobileNav.contains(e.target) && e.target !== mobileToggle) {
                cerrarMenuMovil();
            }
        }
    });

    // ScrollSpy automático con IntersectionObserver para sincronizar el enlace activo al hacer scroll
    setupScrollSpy();
}

function setupScrollSpy() {
    if (!('IntersectionObserver' in window)) return;

    const sections = document.querySelectorAll('.hero-section, .section-block');
    const navLinks = document.querySelectorAll('.nav-link[data-section], .mobile-nav-link[data-section]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let id = entry.target.id;
                if (!id && entry.target.classList.contains('hero-section')) {
                    id = 'inicio';
                } else if (id && id.startsWith('sec-')) {
                    id = id.replace('sec-', '');
                }

                if (id === 'mapa') {
                    iniciarMapaSiEsNecesario();
                    if (AppState.mapaInstancia) {
                        setTimeout(() => AppState.mapaInstancia.invalidateSize(), 50);
                        setTimeout(() => AppState.mapaInstancia.invalidateSize(), 250);
                    }
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

function setupMapAutoLoader() {
    const mapSec = document.getElementById('sec-mapa') || document.getElementById('leaflet-map');
    if (!mapSec) return;

    if ('IntersectionObserver' in window) {
        const mapObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    iniciarMapaSiEsNecesario();
                    if (AppState.mapaInstancia) {
                        AppState.mapaInstancia.invalidateSize();
                        setTimeout(() => {
                            if (AppState.mapaInstancia) AppState.mapaInstancia.invalidateSize();
                        }, 200);
                    }
                }
            });
        }, {
            root: null,
            rootMargin: '350px 0px 350px 0px',
            threshold: 0
        });

        mapObserver.observe(mapSec);
    }

    // Listener pasivo de scroll para garantizar carga inmediata si el usuario baja la página
    window.addEventListener('scroll', () => {
        const rect = mapSec.getBoundingClientRect();
        if (rect.top <= window.innerHeight + 350 && rect.bottom >= -200) {
            iniciarMapaSiEsNecesario();
            if (AppState.mapaInstancia) {
                AppState.mapaInstancia.invalidateSize();
            }
        }
    }, { passive: true });
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

    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
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
    const mobileToggle = document.getElementById('mobile-toggle');
    if (mobileNav) mobileNav.classList.remove('open');
    if (mobileToggle) {
        mobileToggle.innerHTML = '☰';
        mobileToggle.setAttribute('aria-label', 'Abrir Menú');
    }
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
        const [resEsp] = await Promise.all([
            fetch(`api/publico/especies?lang=${AppState.idioma}`).catch(() => null)
        ]);

        if (resEsp && resEsp.ok) {
            const serverEspecies = await resEsp.json();
            if (Array.isArray(serverEspecies) && serverEspecies.length > 0) {
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
// CONTROL DE AUDIO MINIMALISTA (PLAY / PAUSE + TIEMPO TRANSCURRIDO / DURACIÓN)
// ==============================================================================
let audioActivoGlobal = null;
let intervalAudioGlobal = null;

function formatAudioTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function toggleAudioAnimal(espId, btnEl, evt) {
    if (evt) evt.stopPropagation();
    const audio = document.getElementById(`audio-elem-${espId}`);
    if (!audio) return;

    const iconSpan = btnEl.querySelector('.audio-btn-icon');
    const curTimeEl = document.getElementById(`time-cur-${espId}`);
    const durTimeEl = document.getElementById(`time-dur-${espId}`);

    // Si ya está reproduciéndose este audio, pausar
    if (!audio.paused) {
        audio.pause();
        btnEl.classList.remove('playing');
        if (iconSpan) iconSpan.innerText = '▶';
        if (intervalAudioGlobal) clearInterval(intervalAudioGlobal);
        return;
    }

    // Detener cualquier otro audio que esté sonando
    detenerAudios();

    // Actualizar duración si ya está disponible
    if (audio.duration && !isNaN(audio.duration)) {
        if (durTimeEl) durTimeEl.innerText = formatAudioTime(audio.duration);
    } else {
        audio.addEventListener('loadedmetadata', () => {
            if (durTimeEl) durTimeEl.innerText = formatAudioTime(audio.duration);
        }, { once: true });
    }

    audio.play().then(() => {
        btnEl.classList.add('playing');
        if (iconSpan) iconSpan.innerText = '⏸';
        audioActivoGlobal = audio;

        if (intervalAudioGlobal) clearInterval(intervalAudioGlobal);
        intervalAudioGlobal = setInterval(() => {
            if (curTimeEl) curTimeEl.innerText = formatAudioTime(audio.currentTime);
            if (durTimeEl && audio.duration && !isNaN(audio.duration)) {
                durTimeEl.innerText = formatAudioTime(audio.duration);
            }
        }, 200);

        audio.onended = () => {
            btnEl.classList.remove('playing');
            if (iconSpan) iconSpan.innerText = '▶';
            if (curTimeEl) curTimeEl.innerText = '0:00';
            if (intervalAudioGlobal) clearInterval(intervalAudioGlobal);
        };

        audio.onpause = () => {
            btnEl.classList.remove('playing');
            if (iconSpan) iconSpan.innerText = '▶';
            if (intervalAudioGlobal) clearInterval(intervalAudioGlobal);
        };
    }).catch(err => {
        console.warn('Error al reproducir audio animal:', err);
    });
}

function detenerAudios() {
    if (intervalAudioGlobal) {
        clearInterval(intervalAudioGlobal);
        intervalAudioGlobal = null;
    }
    document.querySelectorAll('audio').forEach(a => {
        if (!a.paused) a.pause();
    });
    document.querySelectorAll('.audio-play-btn').forEach(b => {
        b.classList.remove('playing');
        const icon = b.querySelector('.audio-btn-icon');
        if (icon) icon.innerText = '▶';
    });
    if (AppState.audioActual) {
        AppState.audioActual.pause();
        AppState.audioActual = null;
    }
    const nativePlayer = document.getElementById('modal-native-player');
    if (nativePlayer) nativePlayer.pause();
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

// ==============================================================================
// SECCIÓN 2: BIODIVERSIDAD (REPRODUCTOR MINIMALISTA PLAY/PAUSE + INDICADOR DE TIEMPO)
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

        // Control de Audio Limpio y Minimalista (Play/Pause + Indicador de Tiempo/Duración)
        let audioPlayerHtml = '';
        if (esFauna && esp.audio && esp.tieneAudio !== false) {
            const audioSrc = `assets/audio/${encodeURIComponent(esp.audio)}`;
            audioPlayerHtml = `
                <div class="card-audio-minimal" onclick="event.stopPropagation()">
                    <button class="audio-play-btn" type="button" aria-label="Reproducir canto de ${nombreComun}" onclick="toggleAudioAnimal(${esp.id}, this, event)">
                        <span class="audio-btn-icon">▶</span>
                    </button>
                    <div class="audio-timer-wrap">
                        <span class="audio-time-current" id="time-cur-${esp.id}">0:00</span>
                        <span class="audio-time-divider">/</span>
                        <span class="audio-time-total" id="time-dur-${esp.id}">0:15</span>
                    </div>
                    <audio id="audio-elem-${esp.id}" preload="metadata">
                        <source src="${audioSrc}" type="audio/mpeg">
                        <source src="assets/audio/${esp.audio}" type="audio/mpeg">
                        <source src="imagenes y audios/${encodeURIComponent(esp.audio)}" type="audio/mpeg">
                    </audio>
                </div>
            `;
        }

        // Ficha técnica estructurada de Hábitat y Dieta
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
                    <button class="btn-card-more" onclick="manejarClickCard(this.closest('.card-item'), () => abrirModalEspeciePorId(${esp.id})); event.stopPropagation();">
                        ${isEn ? 'Full species file' : 'Ver Ficha Completa'} →
                    </button>
                </div>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (e.target.closest('.card-audio-minimal')) return;
            manejarClickCard(card, () => abrirModalEspecie(esp));
        });
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
// GESTOR DE CLICS DINÁMICOS CON ZOOM TÁCTIL Y APERTURA DE MODAL
// ==============================================================================
function manejarClickCard(cardEl, callback) {
    if (cardEl) {
        cardEl.classList.add('card-click-zoom');
        setTimeout(() => {
            cardEl.classList.remove('card-click-zoom');
            if (typeof callback === 'function') callback();
        }, 130);
    } else {
        if (typeof callback === 'function') callback();
    }
}

// ==============================================================================
// MODAL DE DETALLE DE ESPECIE Y TARJETAS INTERACTIVAS
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
            specsBox.innerHTML = `
                <div style="background:#f4f8f5; border-left:3.5px solid var(--secondary); padding:0.6rem 0.8rem; border-radius:0 8px 8px 0; display:flex; flex-direction:column; gap:0.4rem; color:#223628;">
                    <div id="modal-habitat-row">🏞️ <strong>${isEn ? 'Habitat:' : 'Hábitat:'}</strong> ${habitat || (isEn ? 'Not specified' : 'No especificado')}</div>
                    <div id="modal-dieta-row">🍃 <strong>${isEn ? 'Diet:' : 'Dieta:'}</strong> ${dieta || (isEn ? 'Not specified' : 'No especificado')}</div>
                    <div id="modal-conservacion-row">🛡️ <strong>${isEn ? 'Conservation:' : 'Conservación:'}</strong> ${esp.estadoConservacion || 'Preocupación Menor (LC)'}</div>
                </div>
            `;
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
            if (nativePlayer) {
                nativePlayer.style.display = 'block';
                nativePlayer.src = `assets/audio/${encodeURIComponent(esp.audio)}`;
            }
        } else {
            audioBox.style.display = 'none';
        }
    }

    if (modal) {
        modal.classList.remove('active');
        void modal.offsetWidth; // reset animaciones CSS
        modal.classList.add('active');
    }

    registrarMetrica('FAUNA', esp.id, nombreComun);
}

function abrirModalAtractivo(a) {
    if (!a) return;
    detenerAudios();
    const modal = document.getElementById('modal-detalle');
    const imgEl = document.getElementById('modal-img');
    const titleEl = document.getElementById('modal-title');
    const cientEl = document.getElementById('modal-cientifico');
    const badgeEl = document.getElementById('modal-badge');
    const descEl = document.getElementById('modal-desc');
    const factBox = document.getElementById('modal-fact-box');
    const factText = document.getElementById('modal-fact');
    const audioBox = document.getElementById('modal-audio-box');
    const specsBox = document.getElementById('modal-specs');

    if (imgEl) {
        imgEl.src = `assets/img/${encodeURI(a.imagen)}`;
        imgEl.alt = a.nombre;
    }
    if (titleEl) titleEl.innerText = a.nombre;
    if (cientEl) cientEl.innerText = `Parque Nacional Cotapata · ${a.altitudMsnm} msnm`;
    if (badgeEl) {
        badgeEl.innerText = `🏞️ ${a.categoria.toUpperCase()}`;
        badgeEl.className = 'meta-chip flora';
    }
    if (specsBox) {
        specsBox.style.display = 'block';
        specsBox.innerHTML = `
            <div style="background:#f4f8f5; border-left:3.5px solid var(--secondary); padding:0.6rem 0.8rem; border-radius:0 8px 8px 0; font-size:0.84rem; display:flex; flex-direction:column; gap:0.4rem; color:#223628;">
                <div>⛰️ <strong>Altitud de referencia:</strong> ${a.altitudMsnm} msnm</div>
                <div>🌿 <strong>Ecosistema:</strong> Ceja de Monte y Valles Yungueños</div>
                <div>🗺️ <strong>Jurisdicción:</strong> SERNAP · Parque Nacional Cotapata</div>
            </div>
        `;
    }
    if (audioBox) audioBox.style.display = 'none';
    if (descEl) descEl.innerText = a.descripcion;
    if (factBox && factText) {
        factBox.style.display = 'block';
        factText.innerHTML = `<strong>Consejo y Recomendaciones de Visita:</strong> ${a.recomendaciones || 'Transitar exclusivamente por sendero marcado y respetar las normas del parque.'}`;
    }

    if (modal) {
        modal.classList.remove('active');
        void modal.offsetWidth;
        modal.classList.add('active');
    }
}

function abrirModalRuta(r) {
    if (!r) return;
    detenerAudios();
    const modal = document.getElementById('modal-detalle');
    const imgEl = document.getElementById('modal-img');
    const titleEl = document.getElementById('modal-title');
    const cientEl = document.getElementById('modal-cientifico');
    const badgeEl = document.getElementById('modal-badge');
    const descEl = document.getElementById('modal-desc');
    const factBox = document.getElementById('modal-fact-box');
    const factText = document.getElementById('modal-fact');
    const audioBox = document.getElementById('modal-audio-box');
    const specsBox = document.getElementById('modal-specs');

    if (imgEl) {
        imgEl.src = `assets/img/${encodeURI(r.imagen)}`;
        imgEl.alt = r.nombre;
    }
    if (titleEl) titleEl.innerText = r.nombre;
    if (cientEl) cientEl.innerText = `Travesía de Trekking en Cotapata · Dificultad: ${r.dificultad}`;
    if (badgeEl) {
        badgeEl.innerText = `🥾 DIFICULTAD: ${r.dificultad.toUpperCase()}`;
        badgeEl.className = 'meta-chip fauna';
    }
    if (specsBox) {
        specsBox.style.display = 'block';
        specsBox.innerHTML = `
            <div style="background:#f4f8f5; border-left:3.5px solid var(--secondary); padding:0.6rem 0.8rem; border-radius:0 8px 8px 0; font-size:0.84rem; display:flex; flex-direction:column; gap:0.4rem; color:#223628;">
                <div>📏 <strong>Distancia Total:</strong> ${r.distanciaKm} km</div>
                <div>⏱️ <strong>Duración Estimada:</strong> ${r.duracionHoras}</div>
                <div>📉 <strong>Desnivel acumulado:</strong> ${r.desnivelMetros} metros de descenso</div>
            </div>
        `;
    }
    if (audioBox) audioBox.style.display = 'none';
    if (descEl) descEl.innerText = r.descripcion;
    if (factBox && factText) {
        factBox.style.display = 'block';
        factText.innerHTML = `⚠️ <strong>Normas de Seguridad y Equipamiento:</strong> ${r.recomendacionesSeguridad}`;
    }

    if (modal) {
        modal.classList.remove('active');
        void modal.offsetWidth;
        modal.classList.add('active');
    }
}

function abrirModalAlojamientoPorId(id) {
    const item = DATASET_SERVICIOS_DEFAULT.find(s => s.id === id);
    if (!item) return;
    detenerAudios();
    const modal = document.getElementById('modal-detalle');
    const imgEl = document.getElementById('modal-img');
    const titleEl = document.getElementById('modal-title');
    const cientEl = document.getElementById('modal-cientifico');
    const badgeEl = document.getElementById('modal-badge');
    const descEl = document.getElementById('modal-desc');
    const factBox = document.getElementById('modal-fact-box');
    const factText = document.getElementById('modal-fact');
    const audioBox = document.getElementById('modal-audio-box');
    const specsBox = document.getElementById('modal-specs');

    if (imgEl) {
        imgEl.src = `assets/img/${encodeURI(item.imagen)}`;
        imgEl.alt = item.nombre;
    }
    if (titleEl) titleEl.innerText = item.nombre;
    if (cientEl) cientEl.innerText = `📍 Comunidad ${item.comunidad} · ${item.ubicacionReferencial}`;
    if (badgeEl) {
        badgeEl.innerText = `🏡 ALOJAMIENTO · ${item.comunidad.toUpperCase()}`;
        badgeEl.className = 'meta-chip flora';
    }
    if (specsBox) {
        specsBox.style.display = 'block';
        specsBox.innerHTML = `
            <div style="background:#f4f8f5; border-left:3.5px solid var(--accent); padding:0.6rem 0.8rem; border-radius:0 8px 8px 0; font-size:0.84rem; display:flex; flex-direction:column; gap:0.4rem; color:#223628;">
                <div style="color:var(--primary); font-weight:700;">💳 <strong>Tarifas por fechas/noches (Bolivianos):</strong><br><span style="color:#d35400; font-size:0.95rem;">${item.precios}</span></div>
                <div>⏰ <strong>Horario de atención:</strong> ${item.horarioAtencion}</div>
                <div>🤝 <strong>Turismo Comunitario:</strong> Administrado por comunarios locales</div>
            </div>
        `;
    }
    if (audioBox) audioBox.style.display = 'none';
    if (descEl) descEl.innerText = item.descripcion;
    if (factBox && factText) {
        factBox.style.display = 'block';
        factText.innerHTML = `💡 <strong>Turismo Responsable:</strong> Hospédate en las comunidades de Cotapata para apoyar directamente la economía de las familias locales.`;
    }

    if (modal) {
        modal.classList.remove('active');
        void modal.offsetWidth;
        modal.classList.add('active');
    }
}

function abrirModalLugarPorId(id) {
    const item = DATASET_SERVICIOS_DEFAULT.find(s => s.id === id);
    if (!item) return;
    detenerAudios();
    const modal = document.getElementById('modal-detalle');
    const imgEl = document.getElementById('modal-img');
    const titleEl = document.getElementById('modal-title');
    const cientEl = document.getElementById('modal-cientifico');
    const badgeEl = document.getElementById('modal-badge');
    const descEl = document.getElementById('modal-desc');
    const factBox = document.getElementById('modal-fact-box');
    const audioBox = document.getElementById('modal-audio-box');
    const specsBox = document.getElementById('modal-specs');

    if (imgEl) {
        imgEl.src = `assets/img/${encodeURI(item.imagen)}`;
        imgEl.alt = item.nombre;
    }
    if (titleEl) titleEl.innerText = item.nombre;
    if (cientEl) cientEl.innerText = `📍 Entorno Comunitario de ${item.comunidad} · ${item.ubicacionReferencial}`;
    if (badgeEl) {
        badgeEl.innerText = `📍 LUGAR · ${item.comunidad.toUpperCase()}`;
        badgeEl.className = 'meta-chip fauna';
    }
    if (specsBox) {
        specsBox.style.display = 'block';
        specsBox.innerHTML = `
            <div style="background:#f4f8f5; border-left:3.5px solid var(--secondary); padding:0.6rem 0.8rem; border-radius:0 8px 8px 0; font-size:0.84rem; display:flex; flex-direction:column; gap:0.4rem; color:#223628;">
                <div>🏞️ <strong>Comunidad:</strong> ${item.comunidad}</div>
                <div>🧭 <strong>Ubicación:</strong> ${item.ubicacionReferencial}</div>
                <div>🌿 <strong>Paisaje:</strong> Ceja de monte, huertos tradicionales y arquitectura rural</div>
            </div>
        `;
    }
    if (audioBox) audioBox.style.display = 'none';
    if (descEl) descEl.innerText = item.descripcion;
    if (factBox) factBox.style.display = 'none';

    if (modal) {
        modal.classList.remove('active');
        void modal.offsetWidth;
        modal.classList.add('active');
    }
}

function abrirModalComidaPorId(id) {
    const item = DATASET_SERVICIOS_DEFAULT.find(s => s.id === id);
    if (!item) return;
    detenerAudios();
    const modal = document.getElementById('modal-detalle');
    const imgEl = document.getElementById('modal-img');
    const titleEl = document.getElementById('modal-title');
    const cientEl = document.getElementById('modal-cientifico');
    const badgeEl = document.getElementById('modal-badge');
    const descEl = document.getElementById('modal-desc');
    const factBox = document.getElementById('modal-fact-box');
    const factText = document.getElementById('modal-fact');
    const audioBox = document.getElementById('modal-audio-box');
    const specsBox = document.getElementById('modal-specs');

    if (imgEl) {
        imgEl.src = `assets/img/${encodeURI(item.imagen)}`;
        imgEl.alt = item.nombre;
    }
    if (titleEl) titleEl.innerText = item.nombre;
    if (cientEl) cientEl.innerText = `Gastronomía Tradicional y Sabores de Cotapata`;
    if (badgeEl) {
        badgeEl.innerText = `🍲 SABORES DE COTAPATA`;
        badgeEl.className = 'meta-chip flora';
    }
    if (specsBox) {
        specsBox.style.display = 'block';
        specsBox.innerHTML = `
            <div style="background:#fef9e7; border-left:3.5px solid #f39c12; padding:0.7rem 0.9rem; border-radius:0 8px 8px 0; font-size:0.9rem; display:flex; justify-content:space-between; align-items:center; color:#784212;">
                <div>💰 <strong>Precio de Referencia:</strong></div>
                <div style="font-size:1.15rem; font-weight:800; color:#d35400;">${item.precio}</div>
            </div>
        `;
    }
    if (audioBox) audioBox.style.display = 'none';
    if (descEl) descEl.innerText = item.descripcion;
    if (factBox && factText) {
        factBox.style.display = 'block';
        factText.innerHTML = `🍃 <em>Catálogo gastronómico informativo. Consulta disponibilidad en los comedores comunales de Chairo, Sandillani o Pacollo durante tu visita.</em>`;
    }

    if (modal) {
        modal.classList.remove('active');
        void modal.offsetWidth;
        modal.classList.add('active');
    }
}

function cerrarModal() {
    detenerAudios();
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
}

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

// ==============================================================================
// SECCIÓN 3: SERVICIOS COMUNITARIOS (REESTRUCTURACIÓN COMPLETA)
// Pestañas: Todas, Alojamientos, Lugares, Comidas, Chairo, Sandillani, Pacollo
// ==============================================================================
function setFiltroServicio(filtro, btnEl) {
    AppState.filtroServicio = filtro;
    document.querySelectorAll('#pills-servicios .filter-pill').forEach(b => b.classList.remove('active'));
    if (btnEl) {
        btnEl.classList.add('active');
    } else {
        const btn = Array.from(document.querySelectorAll('#pills-servicios .filter-pill'))
                         .find(b => b.textContent.trim().toLowerCase() === filtro.toLowerCase());
        if (btn) btn.classList.add('active');
    }
    renderizarServicios();
}

function crearCardAlojamientoHtml(item) {
    const imgEnc = encodeURI(`assets/img/${item.imagen}`);
    const imgFallback = encodeURI(`imagen alojamiento/${item.imagen.replace('alojamiento/', '')}`);
    return `
        <div class="card-item alojamiento-card" onclick="manejarClickCard(this, () => abrirModalAlojamientoPorId(${item.id}))" tabindex="0">
            <div class="card-media">
                <span class="card-badge">🏡 ${item.comunidad}</span>
                <span class="card-zoom-badge">🔍 Ver detalle</span>
                <img src="${imgEnc}" alt="${item.nombre}" loading="lazy"
                     onerror="this.onerror=null; this.src='${imgFallback}';">
            </div>
            <div class="card-content">
                <h3 class="card-title">${item.nombre}</h3>
                <p class="card-subtitle">📍 ${item.comunidad} · ${item.ubicacionReferencial}</p>
                <p class="card-text">${item.descripcion}</p>
                <div class="servicio-precios-box">
                    <span class="servicio-precios-label">💳 Tarifas de Alojamiento por fechas / noches:</span>
                    <div class="servicio-precios-val"><strong>${item.precios}</strong></div>
                </div>
                <div class="card-meta">
                    <span class="meta-chip">⏰ ${item.horarioAtencion}</span>
                    <span class="meta-chip">✓ Turismo Comunitario</span>
                </div>
            </div>
        </div>
    `;
}

function crearCardLugarHtml(item) {
    const imgEnc = encodeURI(`assets/img/${item.imagen}`);
    const imgFallback = encodeURI(`imagen lugares/${item.imagen.replace('lugares/', '')}`);
    return `
        <div class="card-item lugar-card" onclick="manejarClickCard(this, () => abrirModalLugarPorId(${item.id}))" tabindex="0">
            <div class="card-media">
                <span class="card-badge">📍 ${item.comunidad}</span>
                <span class="card-zoom-badge">🔍 Ver detalle</span>
                <img src="${imgEnc}" alt="${item.nombre}" loading="lazy"
                     onerror="this.onerror=null; this.src='${imgFallback}';">
            </div>
            <div class="card-content">
                <h3 class="card-title">${item.nombre}</h3>
                <p class="card-subtitle">📍 Entorno de ${item.comunidad} · ${item.ubicacionReferencial}</p>
                <p class="card-text">${item.descripcion}</p>
                <div class="card-meta">
                    <span class="meta-chip">🏞️ Paisaje & Comunidad</span>
                    <span class="meta-chip">Parque Cotapata</span>
                </div>
            </div>
        </div>
    `;
}

function crearCardComidaHtml(item) {
    const imgEnc = encodeURI(`assets/img/${item.imagen}`);
    const imgFallback = encodeURI(`imagen comidas/${item.imagen.replace('comidas/', '')}`);
    return `
        <div class="card-item comida-card" onclick="manejarClickCard(this, () => abrirModalComidaPorId(${item.id}))" tabindex="0">
            <div class="card-media">
                <span class="card-badge">🍲 Sabores de Cotapata</span>
                <span class="card-zoom-badge">🔍 Ver detalle</span>
                <img src="${imgEnc}" alt="${item.nombre}" loading="lazy"
                     onerror="this.onerror=null; this.src='${imgFallback}';">
            </div>
            <div class="card-content">
                <h3 class="card-title">${item.nombre}</h3>
                <p class="card-text">${item.descripcion}</p>
                <div class="servicio-precio">
                    <span>Precio:</span> <strong>${item.precio}</strong>
                </div>
            </div>
        </div>
    `;
}

function renderizarServicios() {
    const container = document.getElementById('grid-servicios');
    if (!container) return;
    container.innerHTML = '';

    const filtro = (AppState.filtroServicio || 'todas').toLowerCase();

    // Obtener los subconjuntos desde DATASET_SERVICIOS_DEFAULT
    const todosAlojamientos = DATASET_SERVICIOS_DEFAULT.filter(s => s.tipoServicio === 'alojamiento');
    const todosLugares = DATASET_SERVICIOS_DEFAULT.filter(s => s.tipoServicio === 'lugar');
    const todasComidas = DATASET_SERVICIOS_DEFAULT.filter(s => s.tipoServicio === 'comida');

    // 1. FILTRO: ALOJAMIENTOS (Chairo, Sandillani y Pacollo - alojamiento1 a 9)
    if (filtro === 'alojamientos') {
        const header = document.createElement('div');
        header.style.gridColumn = '1 / -1';
        header.innerHTML = `
            <div class="servicio-section-title">
                🏡 Catálogo de Alojamientos Comunitarios en Cotapata (Chairo, Sandillani y Pacollo)
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
                Hospedajes ecológicos, cabañas familiares y zonas de camping administrados con consentimiento informado por las familias locales. Precios en Bolivianos (Bs).
            </p>
        `;
        container.appendChild(header);

        todosAlojamientos.forEach(aloj => {
            const wrap = document.createElement('div');
            wrap.innerHTML = crearCardAlojamientoHtml(aloj);
            container.appendChild(wrap.firstElementChild);
        });
        return;
    }

    // 2. FILTRO: LUGARES (Casas y paisajes de Chairo, Sandillani y Pacollo - 1 a 3 cada uno)
    if (filtro === 'lugares') {
        const header = document.createElement('div');
        header.style.gridColumn = '1 / -1';
        header.innerHTML = `
            <div class="servicio-section-title">
                📍 Galería de Casas y Paisajes Comunitarios de Cotapata
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
                Recorrido visual por la arquitectura rural tradicional, casas familiares y vistas naturales de Chairo, Sandillani y Pacollo.
            </p>
        `;
        container.appendChild(header);

        todosLugares.forEach(lug => {
            const wrap = document.createElement('div');
            wrap.innerHTML = crearCardLugarHtml(lug);
            container.appendChild(wrap.firstElementChild);
        });
        return;
    }

    // 3. FILTRO: COMIDAS (Catálogo completo de 23 imágenes - Puramente informativo sin botones)
    if (filtro === 'comidas') {
        const header = document.createElement('div');
        header.style.gridColumn = '1 / -1';
        header.innerHTML = `
            <div class="servicio-section-title">
                🍲 Catálogo Gastronómico Tradicional de Cotapata (23 Platos y Bebidas)
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
                Muestra gastronómica representativa de los Yungas y los valles de Cotapata. Catálogo de referencia informativa con precios en Bolivianos (Bs).
            </p>
        `;
        container.appendChild(header);

        todasComidas.forEach(com => {
            const wrap = document.createElement('div');
            wrap.innerHTML = crearCardComidaHtml(com);
            container.appendChild(wrap.firstElementChild);
        });
        return;
    }

    // 4. FILTRO: CHAIRO (Sección Alojamientos Chairo + Sección Lugares Chairo)
    if (filtro === 'chairo') {
        // Subsección Alojamiento en Chairo
        const secAloj = document.createElement('div');
        secAloj.style.gridColumn = '1 / -1';
        secAloj.innerHTML = `
            <div class="servicio-section-title">
                🏡 Alojamientos en Chairo (Valle Subtropical)
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
                Hospedajes cálidos y acogedores en el valle de Chairo, meta final del Camino del Choro junto al río. Tarifas expresadas en Bolivianos (Bs).
            </p>
        `;
        container.appendChild(secAloj);

        todosAlojamientos.filter(a => a.comunidad === 'Chairo').forEach(aloj => {
            const wrap = document.createElement('div');
            wrap.innerHTML = crearCardAlojamientoHtml(aloj);
            container.appendChild(wrap.firstElementChild);
        });

        // Subsección Lugares en Chairo
        const secLug = document.createElement('div');
        secLug.style.gridColumn = '1 / -1';
        secLug.innerHTML = `
            <div class="servicio-section-title" style="margin-top:2rem;">
                📍 Casas y Entorno Comunitario de Chairo
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
                Vistas de las viviendas locales, el histórico puente sobre el río y el entorno subtropical de la comunidad de Chairo.
            </p>
        `;
        container.appendChild(secLug);

        todosLugares.filter(l => l.comunidad === 'Chairo').forEach(lug => {
            const wrap = document.createElement('div');
            wrap.innerHTML = crearCardLugarHtml(lug);
            container.appendChild(wrap.firstElementChild);
        });
        return;
    }

    // 5. FILTRO: SANDILLANI (Sección Alojamientos Sandillani + Sección Lugares Sandillani)
    if (filtro === 'sandillani') {
        // Subsección Alojamiento en Sandillani
        const secAloj = document.createElement('div');
        secAloj.style.gridColumn = '1 / -1';
        secAloj.innerHTML = `
            <div class="servicio-section-title">
                🏡 Alojamientos en Sandillani (Bosque Nublado y Jardines)
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
                Albergues ecológicos y áreas de descanso rodeados de jardines de orquídeas y helechos milenarios en la ceja de monte. Precios en Bolivianos (Bs).
            </p>
        `;
        container.appendChild(secAloj);

        todosAlojamientos.filter(a => a.comunidad === 'Sandillani').forEach(aloj => {
            const wrap = document.createElement('div');
            wrap.innerHTML = crearCardAlojamientoHtml(aloj);
            container.appendChild(wrap.firstElementChild);
        });

        // Subsección Lugares en Sandillani
        const secLug = document.createElement('div');
        secLug.style.gridColumn = '1 / -1';
        secLug.innerHTML = `
            <div class="servicio-section-title" style="margin-top:2rem;">
                📍 Casas y Paisajes Locales de Sandillani
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
                La aldea entre la niebla, senderos fluviales de orquídeas y miradores panorámicos del bosque nublado andino.
            </p>
        `;
        container.appendChild(secLug);

        todosLugares.filter(l => l.comunidad === 'Sandillani').forEach(lug => {
            const wrap = document.createElement('div');
            wrap.innerHTML = crearCardLugarHtml(lug);
            container.appendChild(wrap.firstElementChild);
        });
        return;
    }

    // 6. FILTRO: PACOLLO (Sección Alojamientos Pacollo + Sección Lugares Pacollo)
    if (filtro === 'pacollo') {
        // Subsección Alojamiento en Pacollo
        const secAloj = document.createElement('div');
        secAloj.style.gridColumn = '1 / -1';
        secAloj.innerHTML = `
            <div class="servicio-section-title">
                🏡 Alojamientos en Pacollo (Valle del Café y Cañón de Huarinilla)
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
                Ecolodges y casas de estancia familiar entre plantaciones agroforestales de café de sombra y huertos de cítricos. Precios en Bolivianos (Bs).
            </p>
        `;
        container.appendChild(secAloj);

        todosAlojamientos.filter(a => a.comunidad === 'Pacollo').forEach(aloj => {
            const wrap = document.createElement('div');
            wrap.innerHTML = crearCardAlojamientoHtml(aloj);
            container.appendChild(wrap.firstElementChild);
        });

        // Subsección Lugares en Pacollo
        const secLug = document.createElement('div');
        secLug.style.gridColumn = '1 / -1';
        secLug.innerHTML = `
            <div class="servicio-section-title" style="margin-top:2rem;">
                📍 Casas y Vistas de la Comunidad de Pacollo
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
                Terrazas agrícolas familiares, cafetales tradicionales y vistas espectaculares al cañón verde del río Huarinilla.
            </p>
        `;
        container.appendChild(secLug);

        todosLugares.filter(l => l.comunidad === 'Pacollo').forEach(lug => {
            const wrap = document.createElement('div');
            wrap.innerHTML = crearCardLugarHtml(lug);
            container.appendChild(wrap.firstElementChild);
        });
        return;
    }

    // 7. FILTRO: TODAS (Muestra Alojamientos, Lugares y Comidas organizados claramente)
    const secTodasAloj = document.createElement('div');
    secTodasAloj.style.gridColumn = '1 / -1';
    secTodasAloj.innerHTML = `
        <div class="servicio-section-title">
            🏡 Alojamientos Comunitarios (Chairo, Sandillani y Pacollo)
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
            Catálogo completo de hospedajes en las tres comunidades anfitrionas con precios fijados en Bolivianos (Bs).
        </p>
    `;
    container.appendChild(secTodasAloj);

    todosAlojamientos.forEach(aloj => {
        const wrap = document.createElement('div');
        wrap.innerHTML = crearCardAlojamientoHtml(aloj);
        container.appendChild(wrap.firstElementChild);
    });

    const secTodasLug = document.createElement('div');
    secTodasLug.style.gridColumn = '1 / -1';
    secTodasLug.innerHTML = `
        <div class="servicio-section-title" style="margin-top:2.5rem;">
            📍 Casas y Paisajes Comunitarios
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
            Imágenes del entorno de vida y paisajes cotidianos de Chairo, Sandillani y Pacollo.
        </p>
    `;
    container.appendChild(secTodasLug);

    todosLugares.forEach(lug => {
        const wrap = document.createElement('div');
        wrap.innerHTML = crearCardLugarHtml(lug);
        container.appendChild(wrap.firstElementChild);
    });

    const secTodasCom = document.createElement('div');
    secTodasCom.style.gridColumn = '1 / -1';
    secTodasCom.innerHTML = `
        <div class="servicio-section-title" style="margin-top:2.5rem;">
            🍲 Catálogo Gastronómico de Cotapata
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
            Platos tradicionales y bebidas típicas de las comunidades de Cotapata con precios en Bolivianos (Bs).
        </p>
    `;
    container.appendChild(secTodasCom);

    todasComidas.forEach(com => {
        const wrap = document.createElement('div');
        wrap.innerHTML = crearCardComidaHtml(com);
        container.appendChild(wrap.firstElementChild);
    });
}

// ==============================================================================
// SECCIÓN 4: ATRACTIVOS TURÍSTICOS
// Imágenes actualizadas: cotapata_aerial.jpg (El Choro), Bosque nublado yungas.jpg y Río huarinilla.png
// ==============================================================================
function renderizarAtractivos() {
    const container = document.getElementById('grid-atractivos');
    if (!container) return;
    container.innerHTML = '';

    AppState.atractivos.forEach(a => {
        const card = document.createElement('div');
        card.className = 'card-item';
        card.setAttribute('tabindex', '0');
        const imgEnc = encodeURI(`assets/img/${a.imagen}`);
        const imgModificado = encodeURI(`assets/img/modificado/${a.imagen}`);
        const imgDirDirecto = encodeURI(`imagenes modificado/${a.imagen}`);

        card.innerHTML = `
            <div class="card-media">
                <span class="card-badge">🏞️ ${a.categoria}</span>
                <span class="card-zoom-badge">🔍 Ver detalle</span>
                <img src="${imgEnc}" alt="${a.nombre}" loading="lazy"
                     onerror="this.onerror=null; this.src='${imgModificado}'; this.onerror=function(){this.src='${imgDirDirecto}';};">
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
        card.addEventListener('click', () => {
            manejarClickCard(card, () => abrirModalAtractivo(a));
        });
        container.appendChild(card);
    });
}

// ==============================================================================
// SECCIÓN 5: RUTAS Y SENDEROS
// Imágenes actualizadas: Travesia choro.jpg, Senderon interpretativo sandillani.jpg, Bosque en Queñuas.jpg
// ==============================================================================
function renderizarRutas() {
    const container = document.getElementById('grid-rutas');
    if (!container) return;
    container.innerHTML = '';

    AppState.rutas.forEach(r => {
        const card = document.createElement('div');
        card.className = 'card-item';
        card.setAttribute('tabindex', '0');
        const imgEnc = encodeURI(`assets/img/${r.imagen}`);
        const imgModificado = encodeURI(`assets/img/modificado/${r.imagen}`);
        const imgDirDirecto = encodeURI(`imagenes modificado/${r.imagen}`);

        card.innerHTML = `
            <div class="card-media">
                <span class="card-badge">🥾 Dificultad: ${r.dificultad}</span>
                <span class="card-zoom-badge">🔍 Ver detalle</span>
                <img src="${imgEnc}" alt="${r.nombre}" loading="lazy"
                     onerror="this.onerror=null; this.src='${imgModificado}'; this.onerror=function(){this.src='${imgDirDirecto}';};">
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
        card.addEventListener('click', () => {
            manejarClickCard(card, () => abrirModalRuta(r));
        });
        container.appendChild(card);
    });
}

// ==============================================================================
// SECCIÓN 6: MAPA INTERACTIVO LEAFLET
// Marcadores identificados: Pacollo y Sandillani agregados claramente con popups
// Acceso directo a Google Maps: https://maps.app.goo.gl/guHdzTdr36GNYdas9
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

    // Control flotante de Google Maps en la esquina superior derecha del mapa
    const gmapsControl = L.control({ position: 'topright' });
    gmapsControl.onAdd = function() {
        const div = L.DomUtil.create('div', 'leaflet-gmaps-control-box');
        div.innerHTML = `
            <a href="https://maps.app.goo.gl/guHdzTdr36GNYdas9" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="leaflet-gmaps-floating-btn" 
               title="Ver en Google Maps Satélite">
                <span class="gmaps-pin-dot"></span>
                <span>Google Maps ↗</span>
            </a>
        `;
        return div;
    };
    gmapsControl.addTo(map);

    // Marcadores con puntos clave, incluyendo Pacollo y Sandillani claramente identificados
    const puntos = [
        {
            lat: -16.20,
            lng: -67.85,
            titulo: 'Camino Precolombino El Choro',
            tipo: 'atractivo',
            desc: 'Histórica calzada prehispánica incaica y preincaica de trekking.'
        },
        {
            lat: -16.185,
            lng: -67.83,
            titulo: 'Bosque Nublado de los Yungas',
            tipo: 'atractivo',
            desc: 'Ecosistema de condensación permanente con gran biodiversidad de flora y fauna nativa.'
        },
        {
            lat: -16.162,
            lng: -67.802,
            titulo: 'Chairo (Final de Senda)',
            tipo: 'comunidad',
            desc: 'Comunidad anfitriona al final de la ruta El Choro. Alojamientos, comedor y guías locales.'
        },
        {
            lat: -16.182,
            lng: -67.842,
            titulo: 'Sandillani',
            tipo: 'comunidad',
            desc: 'Comunidad anfitriona en el bosque nublado. Albergues ecológicos, zonas de camping y jardines de orquídeas.'
        },
        {
            lat: -16.172,
            lng: -67.818,
            titulo: 'Pacollo',
            tipo: 'comunidad',
            desc: 'Comunidad productora de café orgánico y cítricos. Alojamientos comunitarios y vistas al cañón de Huarinilla.'
        },
        {
            lat: -16.225,
            lng: -67.865,
            titulo: 'Puesto Guardaparques SERNAP',
            tipo: 'control',
            desc: 'Registro obligatorio de ingreso y control de visitantes del Área Protegida.'
        }
    ];

    puntos.forEach(p => {
        const marker = L.marker([p.lat, p.lng]).addTo(map);
        const colorTag = p.tipo === 'comunidad' ? '#2980b9' : (p.tipo === 'control' ? '#e74c3c' : '#27ae60');
        marker.bindPopup(`
            <div style="font-family:'Poppins',sans-serif; padding:4px; max-width:230px;">
                <div style="display:inline-block; font-size:0.68rem; font-weight:700; color:#fff; background:${colorTag}; padding:2px 8px; border-radius:10px; margin-bottom:4px;">
                    ${p.tipo === 'comunidad' ? '🏡 COMUNIDAD' : (p.tipo === 'control' ? '👮 CONTROL SERNAP' : '🏞️ ATRACTIVO')}
                </div>
                <h4 style="margin:2px 0 4px; font-size:0.95rem; color:#235030;">${p.titulo}</h4>
                <p style="margin:0 0 6px; font-size:0.8rem; color:#444; line-height:1.4;">${p.desc}</p>
                <div style="border-top:1px dashed #d5e2d8; padding-top:5px; margin-top:4px;">
                    <a href="https://maps.app.goo.gl/guHdzTdr36GNYdas9" target="_blank" rel="noopener noreferrer" style="color:#d35400; font-size:0.75rem; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
                        📍 Ver en Google Maps ↗
                    </a>
                </div>
            </div>
        `);
    });

    AppState.mapaInstancia = map;
    AppState.mapaIniciado = true;

    // Redimensionamiento progresivo para garantizar que los mosaicos carguen de inmediato al bajar en la página
    setTimeout(() => {
        if (AppState.mapaInstancia) AppState.mapaInstancia.invalidateSize();
    }, 100);
    setTimeout(() => {
        if (AppState.mapaInstancia) AppState.mapaInstancia.invalidateSize();
    }, 300);
    setTimeout(() => {
        if (AppState.mapaInstancia) AppState.mapaInstancia.invalidateSize();
    }, 700);
}

// ==============================================================================
// SECCIÓN 7: RECOMENDACIONES (AMPLIADO Y MODERNO)
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
