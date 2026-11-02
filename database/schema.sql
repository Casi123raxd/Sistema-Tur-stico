-- ==============================================================================
-- SISTEMA INTEGRADO DE INFORMACIÓN TURÍSTICA COMUNITARIA DE COTAPATA
-- Archivo: database/schema.sql
-- Base de Datos: PostgreSQL 14+ / Supabase
-- Codificación: UTF-8
-- Compatibilidad: 100% Nativo para Supabase SQL Editor
-- ==============================================================================

-- 0. ELIMINACIÓN DE TABLAS PREVIAS EN ORDEN DE DEPENDENCIAS (CASCADE)
DROP TABLE IF EXISTS interaccion CASCADE;
DROP TABLE IF EXISTS recomendacion_idioma CASCADE;
DROP TABLE IF EXISTS recomendacion CASCADE;
DROP TABLE IF EXISTS ruta_idioma CASCADE;
DROP TABLE IF EXISTS ruta CASCADE;
DROP TABLE IF EXISTS atractivo_idioma CASCADE;
DROP TABLE IF EXISTS atractivo CASCADE;
DROP TABLE IF EXISTS servicio CASCADE;
DROP TABLE IF EXISTS comunario CASCADE;
DROP TABLE IF EXISTS categoria_servicio CASCADE;
DROP TABLE IF EXISTS especie_detalle CASCADE;
DROP TABLE IF EXISTS contenido_idioma CASCADE;
DROP TABLE IF EXISTS contenido CASCADE;
DROP TABLE IF EXISTS autorizacion CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS rol CASCADE;
DROP TABLE IF EXISTS idioma CASCADE;

-- ==============================================================================
-- 1. TABLA: idioma
-- ==============================================================================
CREATE TABLE idioma (
    id_idioma SERIAL PRIMARY KEY,
    codigo VARCHAR(5) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL
);

INSERT INTO idioma (id_idioma, codigo, nombre) VALUES
(1, 'es', 'Español'),
(2, 'en', 'English');

-- ==============================================================================
-- 2. TABLA: rol
-- ==============================================================================
CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

INSERT INTO rol (id_rol, nombre, descripcion) VALUES
(1, 'ADMINISTRADOR', 'Control total administrativo, validación de contenidos y autorizaciones'),
(2, 'GESTOR_COMUNITARIO', 'Gestión de servicios y atractivos locales de su comunidad');

-- ==============================================================================
-- 3. TABLA: usuario
-- ==============================================================================
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(120) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON UPDATE CASCADE
);

-- Usuario Inicial Demostrativo:
-- Usuario: admin
-- Contraseña plana: Cotapata2026!
-- Algoritmo: PBKDF2WithHmacSHA256 con 65536 iteraciones
INSERT INTO usuario (id_usuario, nombre_completo, correo, username, password_hash, id_rol, estado) VALUES
(1, 'Administrador del Sistema Cotapata', 'admin@cotapata.gob.bo', 'admin', 'PBKDF2$65536$0zw6Ic+ceGiFcXj3jkro6Q==$92WrgMRS6ybrHYme/uDRNFCbzadHCrRJl/IT9xGa4Sc=', 1, 'ACTIVO');

-- ==============================================================================
-- 4. TABLA: autorizacion (Consentimiento Informado y Ética Salesiana)
-- ==============================================================================
CREATE TABLE autorizacion (
    id_autorizacion SERIAL PRIMARY KEY,
    codigo_autorizacion VARCHAR(50) NOT NULL UNIQUE,
    tipo_entidad VARCHAR(50) NOT NULL,
    otorgado_por VARCHAR(120) NOT NULL,
    comunidad VARCHAR(100) NOT NULL,
    observaciones TEXT,
    fecha_autorizacion DATE NOT NULL,
    vigente BOOLEAN DEFAULT TRUE
);

INSERT INTO autorizacion (id_autorizacion, codigo_autorizacion, tipo_entidad, otorgado_por, comunidad, observaciones, fecha_autorizacion, vigente) VALUES
(1, 'AUT-SERNAP-2026-001', 'BIODIVERSIDAD', 'Dirección SERNAP PN-ANMI Cotapata', 'Parque Nacional Cotapata', 'Autorización de difusión educativa para las 40 especies nativas inventariadas', '2026-01-15', TRUE),
(2, 'AUT-CHAIRO-2026-002', 'SERVICIO_COMUNITARIO', 'Sub Central 2 de Julio Chairo', 'Chairo', 'Consentimiento informado para difusión de servicios de guiado y alimentación', '2026-02-10', TRUE),
(3, 'AUT-SANDILLANI-2026-003', 'SERVICIO_COMUNITARIO', 'Asociación Comunitaria Sandillani', 'Sandillani', 'Consentimiento voluntario para visibilidad de posadas y descanso en el Camino del Choro', '2026-02-12', TRUE),
(4, 'AUT-RUTAS-2026-004', 'RUTAS_ATRACTIVOS', 'Cuerpo de Guardaparques SERNAP', 'Unduavi - Chairo', 'Validación técnica y recomendaciones de seguridad de la ruta Choro', '2026-03-01', TRUE);

-- ==============================================================================
-- 5. TABLA: contenido (Entidad Base Normalizada)
-- ==============================================================================
CREATE TABLE contenido (
    id_contenido SERIAL PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('FAUNA', 'FLORA', 'ATRACTIVO', 'SERVICIO', 'GENERAL')),
    estado_validacion VARCHAR(20) DEFAULT 'Validado' CHECK (estado_validacion IN ('Borrador', 'Pendiente', 'Validado', 'Retirado')),
    id_autorizacion INT DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contenido_aut FOREIGN KEY (id_autorizacion) REFERENCES autorizacion(id_autorizacion) ON UPDATE CASCADE
);

CREATE INDEX idx_tipo_estado ON contenido (tipo, estado_validacion);

-- Función y disparador para actualización automática de fecha_actualizacion
CREATE OR REPLACE FUNCTION actualizar_fecha_contenido()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_contenido
BEFORE UPDATE ON contenido
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_contenido();

-- ==============================================================================
-- 6. TABLA: contenido_idioma (Textos Traducidos Bilingües)
-- ==============================================================================
CREATE TABLE contenido_idioma (
    id_contenido_idioma SERIAL PRIMARY KEY,
    id_contenido INT NOT NULL,
    id_idioma INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    texto TEXT,
    dato_curioso TEXT,
    CONSTRAINT uk_contenido_idioma UNIQUE (id_contenido, id_idioma),
    CONSTRAINT fk_ci_contenido FOREIGN KEY (id_contenido) REFERENCES contenido(id_contenido) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ci_idioma FOREIGN KEY (id_idioma) REFERENCES idioma(id_idioma) ON UPDATE CASCADE
);

-- ==============================================================================
-- 7. TABLA: especie_detalle (Metadatos Científicos, Hábitat, Dieta y Multimedia)
-- ==============================================================================
CREATE TABLE especie_detalle (
    id_especie SERIAL PRIMARY KEY,
    id_contenido INT NOT NULL UNIQUE,
    tipo_especie VARCHAR(20) NOT NULL CHECK (tipo_especie IN ('FAUNA', 'FLORA')),
    nombre_cientifico VARCHAR(150) NOT NULL,
    categoria_fauna VARCHAR(30) DEFAULT 'no_aplica' CHECK (categoria_fauna IN ('mamifero', 'ave', 'roedor', 'reptil', 'anfibio', 'no_aplica')),
    archivo_imagen VARCHAR(150) NOT NULL,
    archivo_audio VARCHAR(150) NULL,
    es_endemica BOOLEAN DEFAULT FALSE,
    estado_conservacion VARCHAR(50) DEFAULT 'Preocupación Menor (LC)',
    habitat_cotapata VARCHAR(255) NULL,
    dieta VARCHAR(255) NULL,
    CONSTRAINT fk_ed_contenido FOREIGN KEY (id_contenido) REFERENCES contenido(id_contenido) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ==============================================================================
-- 8. TABLA: categoria_servicio
-- ==============================================================================
CREATE TABLE categoria_servicio (
    id_categoria SERIAL PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre_es VARCHAR(100) NOT NULL,
    nombre_en VARCHAR(100) NOT NULL,
    icono VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255)
);

INSERT INTO categoria_servicio (id_categoria, codigo, nombre_es, nombre_en, icono, descripcion) VALUES
(1, 'alojamiento', 'Alojamiento Comunitario', 'Community Lodging', '🏡', 'Cabañas, albergues y zonas de campamento gestionadas por comunidades'),
(2, 'alimentacion', 'Alimentación y Gastronomía Local', 'Local Food & Dining', '🍲', 'Platos tradicionales y comedores comunitarios con insumos locales'),
(3, 'guiado', 'Guías Locales Comunitarios', 'Local Community Guides', '🥾', 'Orientación y acompañamiento por senderos ancestrales y naturaleza'),
(4, 'experiencias', 'Experiencias Culturales y Ecoturismo', 'Cultural & Eco-Experiences', '🌿', 'Molienda tradicional, café de altura, artesanías y ecoturismo'),
(5, 'transporte', 'Transporte Autorizado', 'Authorized Transport', '🚐', 'Servicio de traslado coordinado con comunidades locales');

-- ==============================================================================
-- 9. TABLA: comunario (Prestadores Locales Éticos)
-- ==============================================================================
CREATE TABLE comunario (
    id_comunario SERIAL PRIMARY KEY,
    nombre_referencial VARCHAR(100) NOT NULL,
    comunidad VARCHAR(100) NOT NULL,
    contacto_autorizado VARCHAR(80),
    autoriza_difusion BOOLEAN DEFAULT TRUE,
    fecha_consentimiento DATE NOT NULL
);

INSERT INTO comunario (id_comunario, nombre_referencial, comunidad, contacto_autorizado, autoriza_difusion, fecha_consentimiento) VALUES
(1, 'Asociación de Ecoturismo Chairo', 'Chairo', 'Contacto vía Asociación Comunal', TRUE, '2026-02-10'),
(2, 'Comité de Turismo Sandillani', 'Sandillani', 'Atención directa en sendero Choro', TRUE, '2026-02-12'),
(3, 'Cooperativa Comunitaria Pacollo', 'Pacollo', 'Contacto en sede comunal', TRUE, '2026-02-15');

-- ==============================================================================
-- 10. TABLA: servicio (Servicios Turísticos Comunitarios con Consentimiento)
-- ==============================================================================
CREATE TABLE servicio (
    id_servicio SERIAL PRIMARY KEY,
    id_categoria INT NOT NULL,
    id_comunario INT NOT NULL,
    nombre_servicio VARCHAR(150) NOT NULL,
    descripcion_es TEXT NOT NULL,
    descripcion_en TEXT NOT NULL,
    comunidad VARCHAR(100) NOT NULL,
    ubicacion_referencial VARCHAR(200) NOT NULL,
    horario_atencion VARCHAR(100),
    rango_precios VARCHAR(100),
    idiomas_atencion VARCHAR(100) DEFAULT 'Español, Aymara',
    archivo_imagen VARCHAR(150) DEFAULT 'jungle_banner.jpg',
    estado_validacion VARCHAR(30) DEFAULT 'Validado' CHECK (estado_validacion IN ('Borrador', 'Pendiente', 'Validado', 'Retirado')),
    id_autorizacion INT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_serv_cat FOREIGN KEY (id_categoria) REFERENCES categoria_servicio(id_categoria) ON UPDATE CASCADE,
    CONSTRAINT fk_serv_com FOREIGN KEY (id_comunario) REFERENCES comunario(id_comunario) ON UPDATE CASCADE,
    CONSTRAINT fk_serv_aut FOREIGN KEY (id_autorizacion) REFERENCES autorizacion(id_autorizacion) ON UPDATE CASCADE
);

INSERT INTO servicio (id_servicio, id_categoria, id_comunario, nombre_servicio, descripcion_es, descripcion_en, comunidad, ubicacion_referencial, horario_atencion, rango_precios, idiomas_atencion, archivo_imagen, estado_validacion, id_autorizacion) VALUES
(1, 1, 2, 'Albergue y Camping Ecológico Sandillani', 'Hospedaje rústico y zona de acampada con agua potable de vertiente natural al finalizar el tramo montañoso del Choro.', 'Rustic lodging and tent camping zone with fresh natural spring water at the end of the highland Choro trail.', 'Sandillani', 'Hito intermedio en la senda precolombina El Choro', 'Todos los días 07:00 - 20:00', 'Precios referenciales comunitarios', 'Español, Aymara', 'tilcayo1.jpg', 'Validado', 3),
(2, 2, 1, 'Comedor Tradicional El Puente Chairo', 'Alimentación caliente y nutritiva para caminantes: sopas andinas, trucha fresca, frutas locales y mate de coca reconfortante.', 'Nutritious hot meals for hikers: Andean soups, fresh trout, local seasonal fruits, and reviving coca tea.', 'Chairo', 'Extremo final del Camino del Choro junto al río', '08:00 - 19:00', 'Precios accesibles según menú diario', 'Español, Aymara', 'tilcayo2.jpg', 'Validado', 2),
(3, 3, 1, 'Guías Comunitarios Sub Central Chairo', 'Servicio de acompañamiento e interpretación de flora, fauna y patrimonio histórico brindado por guías locales conocedores del territorio.', 'Guiding service and ecological interpretation of flora, fauna, and local heritage by native community members.', 'Chairo', 'Punto de encuentro en Chairo o inicio de senda', 'Previa coordinación comunal', 'Tarifa solidaria convenida con la comunidad', 'Español, Aymara', 'cotapata_aerial.jpg', 'Validado', 2),
(4, 4, 3, 'Ruta Agroecológica del Café y Cacao Pacollo', 'Recorrido por parcelas familiares agroforestales donde se produce café de sombra de alta calidad respetando la cobertura vegetal del parque.', 'Tour of family agroforestry plots producing shade-grown specialty coffee in harmony with park tree canopy.', 'Pacollo', 'Sector medio del valle de Huarinilla', 'Fines de semana y previa reserva comunitaria', 'Aporte voluntario comunitario', 'Español', 'jungle_banner.jpg', 'Validado', 2);

-- ==============================================================================
-- 11. TABLA: atractivo (Atractivos Turísticos Naturales y Culturales)
-- ==============================================================================
CREATE TABLE atractivo (
    id_atractivo SERIAL PRIMARY KEY,
    nombre_es VARCHAR(150) NOT NULL,
    nombre_en VARCHAR(150) NOT NULL,
    categoria VARCHAR(60) NOT NULL,
    descripcion_es TEXT NOT NULL,
    descripcion_en TEXT NOT NULL,
    latitud DECIMAL(10, 7) NULL,
    longitud DECIMAL(10, 7) NULL,
    altitud_msnm INT NULL,
    recomendaciones_es TEXT,
    recomendaciones_en TEXT,
    archivo_imagen VARCHAR(150) DEFAULT 'cotapata_aerial.jpg',
    estado_validacion VARCHAR(30) DEFAULT 'Validado' CHECK (estado_validacion IN ('Borrador', 'Pendiente', 'Validado', 'Retirado')),
    id_autorizacion INT DEFAULT 4,
    CONSTRAINT fk_atractivo_aut FOREIGN KEY (id_autorizacion) REFERENCES autorizacion(id_autorizacion) ON UPDATE CASCADE
);

INSERT INTO atractivo (id_atractivo, nombre_es, nombre_en, categoria, descripcion_es, descripcion_en, latitud, longitud, altitud_msnm, recomendaciones_es, recomendaciones_en, archivo_imagen, estado_validacion, id_autorizacion) VALUES
(1, 'Camino Precolombino El Choro', 'El Choro Pre-Columbian Trail', 'Patrimonio Cultural y Senderismo', 'Histórica calzada de piedra construida por culturas preincaicas e incas que une la cumbre andina con los exuberantes valles de Yungas.', 'Historic stone-paved trail engineered by pre-Inca and Inca cultures connecting high Andean peaks with lush Yungas valleys.', -16.2000000, -67.8500000, 4800, 'Llevar calzado de trekking firme, impermeable y bastones de apoyo para el descenso pronunciado.', 'Wear sturdy hiking boots, rain gear, and trekking poles for the steep stone descents.', 'cotapata_aerial.jpg', 'Validado', 4),
(2, 'Bosque Nublado de los Yungas', 'Yungas Cloud Forest', 'Ecosistema y Biodiversidad', 'Área de condensación permanente de nieblas donde proliferan orquídeas, helechos gigantes, bromelias y cientos de aves endémicas.', 'Permanent cloud condensation zone where tree ferns, orchids, bromeliads, and hundreds of endemic birds thrive.', -16.1850000, -67.8300000, 2400, 'No cortar plantas ni extraer orquídeas; transitar en silencio para escuchar aves.', 'Do not pick plants or extract orchids; walk quietly to observe rare bird species.', 'jungle_banner.jpg', 'Validado', 4),
(3, 'Cuenca y Río Huarinilla', 'Huarinilla River Basin', 'Paisaje Hídrico y Balneario Natural', 'Principal cuenca hidrográfica del parque, vital para la regulación de agua dulce de comunidades yungueñas.', 'Main watershed of the park, vital for freshwater provision and ecological balance in Yungas communities.', -16.1600000, -67.8000000, 1300, 'Prohibido arrojar residuos plásticos o jabones no biodegradables al agua.', 'Do not throw trash or non-biodegradable detergents into river waters.', 'cotapata_stats.jpg', 'Validado', 4),
(4, 'Santuario Natural de Tilcayos y Felinos', 'Tilcayo & Wildcat Sanctuary', 'Observación de Fauna Silvestre', 'Microcuencas protegidas y cañadas donde habita el gato margay (tilcayo) y otros felinos nocturnos.', 'Protected valleys and deep ravines serving as critical habitat for the margay cat and nocturnal wildlife.', -16.2150000, -67.8450000, 3100, 'Evitar el uso de flash en fotografía nocturna y no perturbar senderos secundarios.', 'Avoid camera flashes at night and remain strictly on designated trails.', 'tilcayo1.jpg', 'Validado', 4);

-- ==============================================================================
-- 12. TABLA: ruta (Rutas Técnicas y Senderos Verificados)
-- ==============================================================================
CREATE TABLE ruta (
    id_ruta SERIAL PRIMARY KEY,
    nombre_es VARCHAR(150) NOT NULL,
    nombre_en VARCHAR(150) NOT NULL,
    descripcion_es TEXT NOT NULL,
    descripcion_en TEXT NOT NULL,
    distancia_km DECIMAL(6, 2) NOT NULL,
    duracion_horas VARCHAR(50) NOT NULL,
    dificultad VARCHAR(20) NOT NULL CHECK (dificultad IN ('Baja', 'Media', 'Alta', 'Extrema')),
    desnivel_metros INT NOT NULL,
    recomendaciones_seguridad_es TEXT NOT NULL,
    recomendaciones_seguridad_en TEXT NOT NULL,
    archivo_imagen VARCHAR(150) DEFAULT 'cotapata_aerial.jpg',
    estado_validacion VARCHAR(30) DEFAULT 'Validado' CHECK (estado_validacion IN ('Borrador', 'Pendiente', 'Validado', 'Retirado')),
    id_autorizacion INT DEFAULT 4,
    CONSTRAINT fk_ruta_aut FOREIGN KEY (id_autorizacion) REFERENCES autorizacion(id_autorizacion) ON UPDATE CASCADE
);

INSERT INTO ruta (id_ruta, nombre_es, nombre_en, descripcion_es, descripcion_en, distancia_km, duracion_horas, dificultad, desnivel_metros, recomendaciones_seguridad_es, recomendaciones_seguridad_en, archivo_imagen, estado_validacion, id_autorizacion) VALUES
(1, 'Travesía Precolombina Choro: Cumbre a Chairo', 'Pre-Columbian Choro Trek: Cumbre to Chairo', 'Recorrido clásico de tres días que desciende desde la fría cumbre andina a 4,800 msnm hasta la cálida vegetación yungueña en Chairo a 1,300 msnm.', 'Three-day classic descent beginning in alpine tundra at 4,800m and concluding in subtropical Yungas warmth at 1,300m in Chairo.', 52.00, '3 días (24-28 horas de marcha)', 'Alta', 3500, 'Es indispensable registrarse en el puesto de guardaparques SERNAP en La Cumbre, contratar guías comunitarios y portar botiquín de primeros auxilios.', 'Registration with SERNAP park rangers at La Cumbre is mandatory. Hiring local guides and carrying emergency first-aid gear is required.', 'cotapata_aerial.jpg', 'Validado', 4),
(2, 'Sendero Interpretativo Sandillani - Chairo', 'Sandillani to Chairo Interpretive Trail', 'Tramo final del Choro ideal para senderistas que buscan una caminata de un día entre plantaciones locales, orquídeas y bosques fluviales.', 'Final stage of Choro suitable for single-day hikers enjoying agroforestry, orchids, and subtropical rivers.', 14.50, '5 a 6 horas', 'Media', 1100, 'Llevar repelente biodegradable para mosquitos y suficiente agua potable para el calor yungueño.', 'Bring biodegradable insect repellent and abundant drinking water for humid warm climate.', 'jungle_banner.jpg', 'Validado', 4),
(3, 'Circuito de Bosque de Queñuas y Bofedales Altos', 'Highland Polylepis & Bofedales Circuit', 'Recorrido de altura por las faldas de la Cordillera Real conociendo queñuas milenarias y humedales reguladores de agua.', 'High elevation circuit around the Royal Range exploring ancient Polylepis woodlands and spongy wetlands.', 8.00, '3 a 4 horas', 'Media', 450, 'Ruta de gran altitud: aclimatarse previamente para evitar sorojchi y llevar ropa térmica contra viento helado.', 'High altitude trail: acclimatize beforehand to prevent mountain sickness and wear windproof thermal gear.', 'cotapata_stats.jpg', 'Validado', 4);

-- ==============================================================================
-- 13. TABLA: recomendacion (Código de Visita Responsable)
-- ==============================================================================
CREATE TABLE recomendacion (
    id_recomendacion SERIAL PRIMARY KEY,
    categoria VARCHAR(60) NOT NULL,
    icono VARCHAR(30) NOT NULL,
    titulo_es VARCHAR(150) NOT NULL,
    titulo_en VARCHAR(150) NOT NULL,
    descripcion_es TEXT NOT NULL,
    descripcion_en TEXT NOT NULL,
    consejo_practico_es TEXT,
    consejo_practico_en TEXT,
    prioridad INT DEFAULT 1,
    estado_validacion VARCHAR(30) DEFAULT 'Validado' CHECK (estado_validacion IN ('Borrador', 'Pendiente', 'Validado', 'Retirado')),
    id_autorizacion INT DEFAULT 1,
    CONSTRAINT fk_rec_aut FOREIGN KEY (id_autorizacion) REFERENCES autorizacion(id_autorizacion) ON UPDATE CASCADE
);

INSERT INTO recomendacion (id_recomendacion, categoria, icono, titulo_es, titulo_en, descripcion_es, descripcion_en, consejo_practico_es, consejo_practico_en, prioridad, estado_validacion, id_autorizacion) VALUES
(1, 'Residuos', '🗑️', 'Principio Zero Basura', 'Zero Waste Principle', 'Todo residuo que traigas contigo debe retornar a la ciudad. En Cotapata no existe servicio municipal de recojo en sendas.', 'Everything you pack in must be packed out. There is no municipal waste collection along remote mountain trails.', 'Lleva una bolsa de tela o impermeable exclusiva para tus desperdicios plásticos y orgánicos.', 'Carry a dedicated sealable bag for all your plastic and organic waste until you reach town.', 1, 'Validado', 1),
(2, 'Flora', '🌱', 'Respeto a la Flora Nativa', 'Respect Native Flora', 'Está terminantemente prohibido cortar, quebrar o arrancar orquídeas, musgos, helechos o flores silvestres.', 'Cutting, picking, or uprooting orchids, mosses, tree ferns, or wildflowers is strictly forbidden by law.', 'Captura la belleza con tu cámara. Cada planta viva es alimento y refugio para polinizadores únicos.', 'Take photos instead of specimens. Every living plant sustains vital hummingbirds and insects.', 2, 'Validado', 1),
(3, 'Fauna', '🐾', 'Protección a la Fauna Silvestre', 'Wildlife Protection', 'Observa a los animales desde una distancia segura. No los persigas, no emitas ruidos fuertes y nunca los alimentes.', 'Observe wildlife from a safe distance. Do not chase them, make loud noises, or offer human food.', 'La comida humana altera la salud animal y crea dependencia peligrosa para osos y zorros.', 'Human food harms wildlife metabolism and creates dangerous foraging dependency.', 3, 'Validado', 1),
(4, 'Fuego', '🔥', 'Prohibición Total de Fogatas', 'Strict Fire Ban', 'Hacer fuego está prohibido en todo el parque. Un descuido puede desencadenar incendios que arrasan ecosistemas frágiles.', 'Open campfires are completely prohibited. Sparks can trigger destructive fires in dry season cloud forests.', 'Utiliza cocinillas portátiles de gas certificadas en zonas designadas de campamento.', 'Only use compact certified backpacking gas stoves in designated community campsites.', 4, 'Validado', 1),
(5, 'Senderos', '🥾', 'Permanecer en los Senderos Marcados', 'Stay on Designated Trails', 'Caminar fuera de sendero compacta el suelo, destruye nidos microscópicos y acelera la erosión por lluvias torrenciales.', 'Walking off-trail compresses delicate soil, destroys nests, and speeds up heavy water erosion.', 'Sigue siempre las huellas oficiales de la calzada prehispánica para no desorientarte.', 'Strictly follow established stone trail pavements to avoid dangerous drop-offs and lost routes.', 5, 'Validado', 1),
(6, 'Fotografía', '📸', 'Fotografía Ética y Respetuosa', 'Ethical Photography', 'No uses flash directo sobre aves o mamíferos nocturnos. Solicita permiso antes de fotografiar a comunarios y sus hogares.', 'Never use direct electronic flash on nocturnal fauna. Always ask permission before photographing local residents.', 'El consentimiento y el respeto a la privacidad comunitaria son el pilar del turismo responsable.', 'Community consent and personal dignity are the cornerstone of true community tourism.', 6, 'Validado', 1);

-- ==============================================================================
-- 14. TABLA: interaccion (Métricas Anónimas sin Recolección Injustificada)
-- ==============================================================================
CREATE TABLE interaccion (
    id_interaccion BIGSERIAL PRIMARY KEY,
    tipo_consulta VARCHAR(50) NOT NULL,
    id_recurso INT NOT NULL,
    nombre_recurso VARCHAR(150),
    idioma VARCHAR(5) DEFAULT 'es',
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tipo_fecha ON interaccion (tipo_consulta, fecha_hora);

-- ==============================================================================
-- CARGA DE CONTENIDOS BASE: 20 FAUNA Y 20 FLORA NATIVA
-- ==============================================================================

-- Registros en contenido (1 a 20 Fauna, 21 a 40 Flora)
INSERT INTO contenido (id_contenido, tipo, estado_validacion, id_autorizacion) VALUES
(1, 'FAUNA', 'Validado', 1),
(2, 'FAUNA', 'Validado', 1),
(3, 'FAUNA', 'Validado', 1),
(4, 'FAUNA', 'Validado', 1),
(5, 'FAUNA', 'Validado', 1),
(6, 'FAUNA', 'Validado', 1),
(7, 'FAUNA', 'Validado', 1),
(8, 'FAUNA', 'Validado', 1),
(9, 'FAUNA', 'Validado', 1),
(10, 'FAUNA', 'Validado', 1),
(11, 'FAUNA', 'Validado', 1),
(12, 'FAUNA', 'Validado', 1),
(13, 'FAUNA', 'Validado', 1),
(14, 'FAUNA', 'Validado', 1),
(15, 'FAUNA', 'Validado', 1),
(16, 'FAUNA', 'Validado', 1),
(17, 'FAUNA', 'Validado', 1),
(18, 'FAUNA', 'Validado', 1),
(19, 'FAUNA', 'Validado', 1),
(20, 'FAUNA', 'Validado', 1),
(21, 'FLORA', 'Validado', 1),
(22, 'FLORA', 'Validado', 1),
(23, 'FLORA', 'Validado', 1),
(24, 'FLORA', 'Validado', 1),
(25, 'FLORA', 'Validado', 1),
(26, 'FLORA', 'Validado', 1),
(27, 'FLORA', 'Validado', 1),
(28, 'FLORA', 'Validado', 1),
(29, 'FLORA', 'Validado', 1),
(30, 'FLORA', 'Validado', 1),
(31, 'FLORA', 'Validado', 1),
(32, 'FLORA', 'Validado', 1),
(33, 'FLORA', 'Validado', 1),
(34, 'FLORA', 'Validado', 1),
(35, 'FLORA', 'Validado', 1),
(36, 'FLORA', 'Validado', 1),
(37, 'FLORA', 'Validado', 1),
(38, 'FLORA', 'Validado', 1),
(39, 'FLORA', 'Validado', 1),
(40, 'FLORA', 'Validado', 1);

-- ==============================================================================
-- CONTENIDO IDIOMA: TEXTOS EN ESPAÑOL (id_idioma = 1) E INGLÉS (id_idioma = 2)
-- CON EXPANSIÓN ACADÉMICA COMPLETA DE HÁBITAT, DIETA Y CONSERVACIÓN
-- ==============================================================================

-- 1. Oso Andino / Jucumari
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(1, 1, 'Oso Andino / Jucumari - Tremarctos ornatus', 'Especie paraguas del Parque Nacional Cotapata. Habita en los bosques de niebla y ceja de monte entre 1,800 y 3,400 msnm. Cumple un rol ecológico irreemplazable como dispersor de semillas de gran calibre y regenerador del dosel boscoso.', 'Es el único oso autóctono de Sudamérica. El patrón de pelaje claro en su rostro y pecho es irrepetible en cada individuo, funcionando como una huella dactilar biológica.'),
(1, 2, 'Andean Bear / Jucumari - Tremarctos ornatus', 'Umbrella species of Cotapata National Park. Roams cloud forests and high montane woodlands between 1,800 and 3,400 m. Plays an essential ecological role as a large-seed disperser and forest canopy regenerator.', 'The only bear species native to South America. The cream-colored facial rings and chest markings are completely unique to each bear, serving as a biological fingerprint.');

-- 2. Puma
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(2, 1, 'Puma - Puma concolor', 'Superdepredador silencioso y versátil de Cotapata. Domina un gradiente altitudinal asombroso que abarca desde la selva yungueña a 1,200 msnm hasta pedregales y pajonales altoandinos a 4,500 msnm. Controla poblaciones de venados y mamíferos medianos.', 'Posee el mayor rango de distribución de cualquier mamífero terrestre silvestre del hemisferio occidental. No puede rugir porque carece de laringe especializada, pero ronronea como un gato doméstico y emite silbidos potentes.'),
(2, 2, 'Cougar / Mountain Lion - Puma concolor', 'Stealthy apex predator of Cotapata. Commands a remarkable elevation gradient spanning dense subtropical Yungas at 1,200m up to windswept Andean grasslands at 4,500m. Essential for balancing ungulate and medium mammal populations.', 'Holds the largest geographical range of any native land mammal in the Western Hemisphere. Anatomically unable to roar, it produces high-pitched whistles, hisses, and loud purrs.');

-- 3. Marimono / Mono Araña del Sur
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(3, 1, 'Marimono / Mono Araña - Ateles chamek', 'Primate acróbata del dosel superior de los bosques montanos de Cotapata (1,000 - 2,000 msnm). Se alimenta principalmente de frutos maduros, higos silvestres y semillas, permitiendo la dispersión arbórea a larga distancia.', 'Sus manos carecen anatómicamente de pulgares funcionales, una adaptación evolutiva que transforma sus extremidades en ganchos perfectos para la braquiación veloz entre las copas. Su cola prensil actúa como un quinto brazo con huellas dactilares.'),
(3, 2, 'Black-faced Spider Monkey - Ateles chamek', 'Acrobatic canopy primate inhabiting montane forests between 1,000 and 2,000m. Feeds primarily on ripe fruits, wild figs, and seeds, acting as an exceptional long-distance forest regenerator.', 'They have evolutionarily lost their thumbs, allowing their hands to function as frictionless hooks for rapid swinging. Their prehensile tail functions as a fifth limb with sensitive skin ridges.');

-- 4. Taruca / Venado Andino
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(4, 1, 'Taruca / Venado Andino - Hippocamelus antisensis', 'Cérvido robusto adaptado a las condiciones extremas de la puna y riscos altoandinos (3,500 - 4,800 msnm). Vive en pequeños grupos familiares ramoneando líquenes, pastos duros y plantas pulvinadas en laderas escarpadas.', 'Sus pezuñas cuentan con una almohadilla plantar engrosada y elástica que les permite impulsarse y aferrarse a repisas de roca vertical con la destreza de una cabra montés, evadiendo depredadores terrestres.'),
(4, 2, 'Taruca / North Andean Deer - Hippocamelus antisensis', 'Sturdy cervid specialized for extreme high-altitude rocky slopes and puna wetlands (3,500 - 4,800m). Forages in small family groups browsing lichens, tussock grasses, and cushion plants on sheer ravines.', 'Their hooves feature enlarged, elastic plantar pads enabling them to bound across slippery vertical cliffs with the agility of mountain goats to evade predators.');

-- 5. Chancho de Monte / Pecarí de Collar
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(5, 1, 'Chancho de Monte / Pecarí - Pecari tajacu', 'Mamífero social que recorre en piaras los bosques húmedos montanos y premontanos de Cotapata (1,100 - 2,200 msnm). Remueven la hojarasca del suelo en busca de raíces, bulbos, frutos caídos y pequeños invertebrados.', 'Tienen una glándula en la parte dorsal del lomo que segrega un almizcle aromático intenso; los miembros de la manada se frotan lomo con hombro constantemente para impregnarse del mismo olor comunal y no desorientarse.'),
(5, 2, 'Collared Peccary - Pecari tajacu', 'Social ungulate roaming montane rain forests in tight herds between 1,100 and 2,200m. They actively aerate forest soil while foraging for fallen palm nuts, tubers, succulents, and invertebrates.', 'Equipped with a dorsal scent gland that secretes a pungent musk; herd members rub against one another head-to-flank to maintain a shared family scent in dense vegetation.');

-- 6. Pacarana
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(6, 1, 'Pacarana - Dinomys branickii', 'Enigmático roedor nocturno y crepuscular que habita en cañadas húmedas y quebradas del bosque nublado (1,500 - 3,000 msnm). Posee cuerpo robusto, pelaje pardo oscuro con hileras de manchas blancas y largas uñas cavadoras.', 'Es el segundo roedor vivo más pesado del planeta y el único sobreviviente de la familia Dinomyidae, un linaje fósil de gigantes sudamericanos prehistóricos que llegaron a tener la masa corporal de un búfalo.'),
(6, 2, 'Pacarana - Dinomys branickii', 'Enigmatic, nocturnal rodent native to steep cloud forest valleys and damp ravines (1,500 - 3,000m). Characterized by its stocky build, dark brown coat with white stripes, and strong digging claws.', 'The second largest living rodent on Earth and the sole survivor of the prehistoric Dinomyidae family, whose ancient relatives once rivaled the size of modern cattle.');

-- 7. Jochi Colorado / Agutí
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(7, 1, 'Jochi Colorado - Dasyprocta punctata', 'Ágil roedor diurno del sotobosque yungueño (1,100 - 2,400 msnm). Con sus afilados incisivos rompe nueces leñosas de alta dureza que otros animales no pueden perforar, alimentándose de semillas y retoños.', 'Posee el hábito de enterrar semillas como despensa secreta ante épocas de escasez. Al olvidar hasta un 40% de sus entierros, se convierte en el mayor reforestador natural involuntario del bosque tropical.'),
(7, 2, 'Central American Agouti - Dasyprocta punctata', 'Agile diurnal understory rodent of Yungas subtropical valleys (1,100 - 2,400m). Possesses ultra-hard incisors capable of cracking through heavily fortified wild nuts that defeat other forest animals.', 'They bury large seeds throughout the forest as food caches. Forgetting up to 40% of their hiding spots, they inadvertently serve as the forest’s most prolific tree planters.');

-- 8. Murciélago Hematófago / Vampiro Común
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(8, 1, 'Murciélago Hematófago - Desmodus rotundus', 'Mamífero volador especializado que descansa en cavernas, minas abandonadas y huecos de árboles en zonas templadas de Yungas (1,100 - 2,500 msnm). Se alimenta exclusivamente de sangre de mamíferos.', 'Su saliva contiene una proteína anticoagulante denominada draculina, capaz de inhibir factores de coagulación sanguínea durante horas, molécula que es investigada mundialmente para tratar trombosis e infartos en humanos.'),
(8, 2, 'Common Vampire Bat - Desmodus rotundus', 'Specialized winged mammal roosting in caves, abandoned mine shafts, and hollow trees across temperate valleys (1,100 - 2,500m). Feeds exclusively on the blood of larger resting mammals.', 'Its saliva contains an extraordinary anticoagulant protein named draculin, which inhibits blood clotting for hours and is currently studied in pharmacology to treat stroke patients.');

-- 9. Murciélago Frugívoro Mayor
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(9, 1, 'Murciélago Frugívoro Mayor - Phyllostomus hastatus', 'Uno de los murciélagos neotropicales más corpulentos, con hasta 45 cm de envergadura. Habita en colonias dentro de cavernas y árboles huecos de los Yungas (1,100 - 2,000 msnm), consumiendo frutos, polen e insectos.', 'Posee un elaborado sistema de llamadas de comunicación social; los miembros de cada harén familiar emiten un chillido grupal con frecuencias exclusivas que funcionan como dialectos vocales reconocibles.'),
(9, 2, 'Greater Spear-nosed Bat - Phyllostomus hastatus', 'One of the largest bats in the Neotropics, boasting a wingspan up to 45 cm. Roosts colonially in caves and hollow trunks (1,100 - 2,000m), pollinating trees and dispersing fruits such as figs and palms.', 'Possesses a sophisticated system of social vocalizations; bats belonging to the same roost harem coordinate foraging using distinct, group-specific vocal calls that function as social dialects.');

-- 10. Mono Tití / Tamarin
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(10, 1, 'Mono Tití - Saguinus spp.', 'Pequeño primate vivaz y gregario de los valles interandinos y laderas de Cotapata (1,000 - 1,800 msnm). Se desplaza ágilmente por el dosel bajo y bejucos buscando savia gomosa, néctar, frutas e insectos.', 'Las hembras casi invariablemente dan a luz a mellizos, y son los machos adultos y hermanos juveniles quienes asumen la tarea constante de cargarlos en su lomo durante todo el día, entregándolos a la madre solo para amamantar.'),
(10, 2, 'Tamarin Monkey - Saguinus spp.', 'Lively, small arboreal primate inhabiting lower montane canopies and vine tangles (1,000 - 1,800m). Feeds opportunistically on tree exuded gums, flower nectar, sweet fruits, and spiders.', 'Females almost always give birth to twins. In an exemplary cooperative breeding system, adult males and siblings carry the infants on their backs all day, handing them over only for nursing.');

-- 11. Gato de Pajonal / Ocelote Andino
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(11, 1, 'Gato de Pajonal - Leopardus colocolo / L. tigrinus', 'Pequeño felino silvestre sumamente esquivo que habita en las estepas altoandinas, matorrales y riscos de ceja de monte (2,500 - 4,200 msnm). Depredador silencioso de cuises, ratones de campo y perdices andinas.', 'Conocido como el "fantasma de la cordillera". Su pelaje con bandas ocre-grisáceas se mimetiza a la perfección con la paja brava, y cuando se siente acorralado eriza el pelaje del lomo para duplicar su tamaño aparente.'),
(11, 2, 'Pampas Cat - Leopardus colocolo / L. tigrinus', 'Cryptic small wild cat haunting highland grasslands, scrub patches, and rocky outcrops (2,500 - 4,200m). Stalks guinea pigs, mountain rodents, and ground-nesting tinamous under cover of twilight.', 'Known as the "mountain ghost". Its striped straw-colored coat blends seamlessly into golden ichu grasses, and when cornered it fluffs its dorsal crest to double its perceived body size.');

-- 12. Zorro Andino / Culpeo
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(12, 1, 'Zorro Andino - Lycalopex culpaeus', 'El segundo cánido nativo más grande de Sudamérica. Habita en pastizales altoandinos, laderas rocosas y bordes de bosque (2,200 - 4,500 msnm). Regula poblaciones de roedores y consume frutos silvestres y carroña.', 'A pesar de su nombre común, filogenéticamente no pertenece a los zorros boreales (Vulpes), sino a una radiación evolutiva sudamericana emparentada más cercanamente con los lobos y el aguará guazú.'),
(12, 2, 'Andean Fox / Culpeo - Lycalopex culpaeus', 'The second largest native canid in South America. Roams alpine grasslands, rocky valleys, and forest edges (2,200 - 4,500m). Crucial for controlling rodent explosions and dispersing hardy mountain seeds.', 'Despite its common name, genetically it is not a true fox (genus Vulpes), but belongs to an ancient endemic South American canid lineage closer to maned wolves and jackals.');

-- 13. Tunqui / Gallito de las Rocas
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(13, 1, 'Tunqui / Gallito de las Rocas - Rupicola peruvianus', 'Ave emblemática de los cañones fluviales y quebradas húmedas del bosque nublado (1,200 - 2,600 msnm). Machos lucen un plumaje rojo-anaranjado encendido y una cresta que cubre casi la totalidad del pico.', 'Al amanecer los machos se reúnen en grupos comunales llamados "leks" en árboles seleccionados, donde ejecutan vistosas danzas, inclinaciones y chasquidos de pico para competir por la atención de las hembras.'),
(13, 2, 'Andean Cock-of-the-Rock - Rupicola peruvianus', 'Iconic bird of deep river gorges and mist-drenched cloud forest cliffs (1,200 - 2,600m). Males display vibrant scarlet-orange feathers and an extraordinary disk-shaped crest concealing their bill.', 'At dawn, males gather in traditional communal display arenas called leks, competing for visiting females through synchronized bowing dances, bill-snapping, and guttural territorial grunts.');

-- 14. Cóndor Andino
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(14, 1, 'Cóndor Andino - Vultur gryphus', 'El amo indiscutible de las corrientes térmicas andinas. Anida en farallones inaccesibles de la Cordillera Real (3,000 - 5,200 msnm) y patrulla todo el parque en busca de restos de animales para sanear el ecosistema.', 'Con una envergadura de alas que alcanza los 3.3 metros, es una de las aves no marinas voladoras más grandes del planeta. Puede volar durante más de 5 horas continuas sin batir las alas aprovechando corrientes ascendentes.'),
(14, 2, 'Andean Condor - Vultur gryphus', 'Master of the high Andean thermals. Roosts on inaccessible granite walls across the Royal Range (3,000 - 5,200m), cleaning mountain watersheds by consuming large animal carcasses.', 'With a wingspan exceeding 3.3 meters, it ranks among the largest flying birds on Earth. It can soar for over 5 hours without flapping its wings once, surfing thermal updrafts effortlessly.');

-- 15. Guácharo / Pájaro Aceitero
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(15, 1, 'Guácharo - Steatornis caripensis', 'Ave cavernícola gregaria que duerme de día en grutas profundas del parque (1,200 - 2,800 msnm) y sale en masa al anochecer a recolectar frutos grasosos de palmeras y laureles en los bosques nublados.', 'Es el único pájaro nocturno del mundo con dieta estrictamente frugívora. Dentro de la oscuridad absoluta de las cavernas navega mediante un sistema de ecolocalización biológica emitiendo chasquidos audibles.'),
(15, 2, 'Oilbird - Steatornis caripensis', 'Gregarious cave-dwelling bird roosting inside pitch-black mountain caverns (1,200 - 2,800m). Exits in huge flocks at dusk to forage for lipid-rich palm nuts and wild laurels across cloud forests.', 'The world’s only nocturnal, flying fruit-eating bird. Inside pitch-black caves, it navigates using biological echolocation, producing loud audible clicks that echo off cave walls.');

-- 16. Águila Negra y Castaña
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(16, 1, 'Águila Negra y Castaña - Spizaetus isidori', 'Majestuosa rapaz apical en peligro de extinción que surca el dosel ininterrumpido de las laderas boscosas de Cotapata (1,500 - 3,200 msnm). Depreda ardillas gigantes, monos y pavas de monte.', 'Los polluelos nacen cubiertos de un plumón blanco resplandeciente y permanecen bajo el cuidado paterno durante casi un año; tardan hasta cuatro años en desarrollar su plumaje definitivo negro y castaño.'),
(16, 2, 'Black-and-Chestnut Eagle - Spizaetus isidori', 'Endangered apex forest raptor soaring over the unbroken cloud canopy of Cotapata (1,500 - 3,200m). Hunts arboreal mammals including woolly monkeys, tree squirrels, and large guans.', 'Chicks hatch covered in snowy white down and depend on their parents for nearly a full year, taking up to 4 full years of molts to gain their regal adult black-and-chestnut plumage.');

-- 17. Pava Andina
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(17, 1, 'Pava Andina - Penelope montagnii', 'Crácido de tamaño mediano que habita los estratos medios y altos del bosque de niebla (1,800 - 3,500 msnm). Se desplaza en parejas o pequeños grupos familiares consumiendo bayas carnosas y brotes tiernos.', 'Al amanecer, en lugar de emitir un canto convencional para marcar territorio, se lanza entre ramas realizando un ruidoso "aleteo instrumental" que genera un zumbido de percusión perceptible a cientos de metros.'),
(17, 2, 'Andean Guan - Penelope montagnii', 'Medium-sized arboreal cracid foraging through mist-soaked canopy layers (1,800 - 3,500m). Travels in quiet pairs eating mountain berries, tender leaf buds, and drupes.', 'At daybreak, instead of relying on vocal melodies for territorial display, they execute a specialized wing-whirring flight display that produces a loud acoustic rattle audible across the gorge.');

-- 18. Pava Ala de Hoz
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(18, 1, 'Pava Ala de Hoz - Chamaepetes goudotii', 'Ave frugívora sigilosa que habita en el follaje denso y matorrales húmedos del bosque nublado (1,600 - 3,000 msnm). Clave para la germinación de plantas arbustivas de sotobosque.', 'Sus plumas primarias exteriores poseen una curvatura pronunciada y estrecha en forma de hoz que al volar produce un silbido metálico zumbante, actuando como señal sonora de contacto entre la niebla.'),
(18, 2, 'Sickle-winged Guan - Chamaepetes goudotii', 'Stealthy frugivorous bird inhabiting dense mid-strata cloud foliage (1,600 - 3,000m). Vital for propagating ericaceous understory shrubs and mistletoes.', 'Its modified outermost primary feathers have a narrow, sickle-like curvature that whistles sharply during flight, serving as an acoustic beacon through thick fogbanks.');

-- 19. Colibrí Boliviano / Rayito de Sol
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(19, 1, 'Colibrí Boliviano - Aglaeactis pamela', 'Gema biológica de Cotapata. Habita en matorrales de altura, queñuales y bordes de bosque nublado (2,800 - 3,800 msnm). Polinizador fundamental de bromelias, fucsias y orquídeas andinas.', 'Es una especie estrictamente endémica de Bolivia: no existe en libertad en ningún otro rincón del planeta Tierra salvo en esta estrecha franja de la cordillera andina paceña.'),
(19, 2, 'Bolivian Sunbeam - Aglaeactis pamela', 'Biological jewel of Cotapata. Inhabits high-altitude elfin woodlands, Polylepis patches, and cloud forest edges (2,800 - 3,800m). Primary pollinator for wild fuchsias and native orchids.', 'Strictly endemic to Bolivia: found nowhere else in the wild on planet Earth except in this narrow cloud band of the Cordillera Real in La Paz.');

-- 20. Remolinera Real
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(20, 1, 'Remolinera Real - Cinclodes aricomae', 'Ave paseriforme críticamente amenazada y especialista del bosque de queñua (Polylepis pepei) en valles glaciares de altura (3,600 - 4,400 msnm). Busca artrópodos bajo la corteza hojosa de los árboles.', 'Se encuentra en Peligro Crítico de Extinción (CR) a escala global. Se estima que sobreviven menos de 250 parejas reproductoras en toda la cordillera andina debido a la tala histórica de queñuales.'),
(20, 2, 'Royal Cinclodes - Cinclodes aricomae', 'Critically endangered passerine strictly dependent on ancient Polylepis woodlands in high glacial valleys (3,600 - 4,400m). Forages for invertebrates hidden under papery tree bark.', 'Classified as Critically Endangered (CR) worldwide. Fewer than 250 pairs survive across the Andes due to historical fragmentation of fragile Polylepis forests.');

-- 21 a 40: FLORA NATIVA DE COTAPATA
INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(21, 1, 'Pasto Altoandino - Festuca dolichophylla', 'Gramínea perenne cespitosa que domina el paisaje de la puna brava y los pajonales húmedos del parque. Sus densos macollas protegen el suelo contra la erosión provocada por lluvias y heladas.', 'Sus raíces profundas actúan como una esponja natural que retiene el agua de deshielo y la filtra lentamente hacia las vertientes de los valles bajos.'),
(21, 2, 'High Andean Tussock Grass - Festuca dolichophylla', 'Resilient perennial bunchgrass dominating the high puna biome. Its dense clumps shield delicate topsoil from torrential runoffs and frost heaving.', 'Its dense root system acts as a natural hydrological sponge, retaining snowmelt and gradually feeding Yungas mountain springs.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(22, 1, 'Gramíneas Altoandinas - Cinnagrostis spp.', 'Pastos erguidos característicos de las cumbres frías y laderas expuestas a vientos cortantes en Cotapata.', 'Acumulan cristales microscópicos de sílice en la epidermis de sus hojas, confiriéndoles rigidez y una coraza natural contra heladas intensas.'),
(22, 2, 'Andean Reed Grasses - Cinnagrostis spp.', 'Hardy upright grasses characterizing windswept high ridges and open slopes in Cotapata.', 'Incorporate microscopic silica phytoliths within their leaf cuticle, providing rigidity and resistance against severe freezes.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(23, 1, 'Bofedal - Distichia muscoides', 'Planta en cojín perenne fundamental para la formación de bofedales y turberas andinas en las alturas de Cotapata.', 'Crece formando tapetes tan densos y comprimidos que una persona o un camélido pesado puede caminar sobre ellos sin hundirse en el lodo subyacente.'),
(23, 2, 'Cushion Bog Plant - Distichia muscoides', 'Dominant perennial cushion plant creating highland peat bogs and water reservoirs in Cotapata.', 'Grows in hummocks so dense and firm that heavy wildlife can walk across the wetland carpet without sinking into subterranean mud.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(24, 1, 'Bofedal de Hoja Tubular - Plantago tubulosa', 'Hierba rosetófila adaptada a suelos saturados y anegados con agua helada de vertientes cordilleranas.', 'Sus raíces forman un biofiltro natural que purifica el agua de sedimentos minerales antes de descender a las cuencas potables.'),
(24, 2, 'Tubular Wetland Plantago - Plantago tubulosa', 'Rosette herb adapted to cold, water-saturated peat bog microhabitats in the high Andes.', 'Its fibrous root mass functions as an organic filter purifying glacial runoff before it feeds downstream human settlements.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(25, 1, 'Bofedal Espinoso - Oxychloe andina', 'Planta en almohadilla rígida que prolifera en las márgenes de lagunas y turberas de gran altitud.', 'Las puntas de sus diminutas hojas terminan en espinas punzantes como agujas, defensa botánica contra el pastoreo excesivo.'),
(25, 2, 'Spiny Cushion Plant - Oxychloe andina', 'Rigid cushion plant thriving on high Andean wetland borders and glacial pond shores.', 'The tips of its small leaves form sharp needle-like spines, an evolutionary defense against intensive camelid grazing.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(26, 1, 'Queñua - Polylepis pepei', 'Árbol retorcido y legendario de la alta montaña andina que crece en rodales relictos en las laderas rocosas (3,600 - 4,300 msnm).', 'Es uno de los árboles que vive a mayor altitud en todo el mundo. Su tronco está forrado por capas de corteza rojiza que se descaman como papel, aislando los tejidos del frío subcero.'),
(26, 2, 'Highland Queñua Tree - Polylepis pepei', 'Legendary gnarled tree growing in high-altitude rocky relicts between 3,600 and 4,300m.', 'One of the highest-growing woody tree species in the world. Its trunk is wrapped in papery exfoliating bark sheets that trap air as thermal insulation.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(27, 1, 'Pino de Monte - Podocarpus rusbyi', 'Conífera nativa imponente del bosque nublado de Yungas. Regula la condensación de niebla en las cuencas altas.', 'A diferencia de los pinos del norte, no produce conos leñosos sino semillas envueltas por un arilo carnoso y dulce que alimenta a aves.'),
(27, 2, 'Rusby Mountain Podocarp - Podocarpus rusbyi', 'Stately native conifer of the Yungas cloud forests, intercepting moisture from persistent cloud cover.', 'Unlike Northern Hemisphere pines, it does not produce woody cones but rather sweet fleshy arils that sustain native birds.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(28, 1, 'Pino de Monte Ingensis - Podocarpus ingensis', 'Conífera andina endémica de la ceja de monte, vital para estabilizar laderas con pendiente pronunciada.', 'Su madera resinosa contiene aceites naturales antifúngicos que la protegen de la putrefacción en ambientes con 100% de humedad.'),
(28, 2, 'Ingensis Podocarp - Podocarpus ingensis', 'Rare Andean conifer endemic to montane cloud forests, essential for anchoring steep landslide-prone slopes.', 'Its heartwood contains potent natural resin oils preventing fungal rot in constant 100% humidity environments.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(29, 1, 'Iotavio - Weinmannia boliviensis', 'Árbol frondoso de ramas extendidas y follaje verde lustroso característico de la ceja de monte y bosque nublado.', 'Actúa como un verdadero "cosechador de agua": sus hojas interceptan el vapor de niebla y canalizan gotas al sotobosque.'),
(29, 2, 'Bolivian Weinmannia / Iotavio - Weinmannia boliviensis', 'Canopy tree with lustrous foliage emblematic of the cloud forest mist belt.', 'Functions as a true cloud harvester: its dense leaf canopy condenses vapor into steady droplets recharging ground aquifers.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(30, 1, 'Huaycha - Weinmannia crassifolia', 'Árbol robusto de hojas coriáceas adaptado a vientos cordilleranos y niebla densa.', 'Exuda una savia resinosa que las abejas y aves nativas emplean para impermeabilizar sus nidos contra tormentas.'),
(30, 2, 'Huaycha - Weinmannia crassifolia', 'Resilient tree with thick leathery leaves built to withstand strong mountain gales and perpetual fog.', 'Exudes a natural resinous sap that native bees and hummingbirds utilize to waterproof their nests against rainstorms.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(31, 1, 'Nogal Silvestre - Juglans boliviana', 'Árbol de gran porte y madera noble que prospera en los valles templados de Cotapata.', 'Produce nueces silvestres de cáscara pétrea que constituyen un banco de alimento fundamental para roedores nativos como jochis y pacaranas.'),
(31, 2, 'Bolivian Walnut - Juglans boliviana', 'Stately hardwood tree thriving in fertile, temperate Yungas valleys.', 'Yields thick-shelled wild walnuts that serve as an irreplaceable winter energy source for rodents like pacaranas and agoutis.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(32, 1, 'Yuraj Huaycha - Miconia theaezans', 'Árbol mediano con hojas de tres nervaduras longitudinales muy marcadas, típico de claros y bordes de bosque.', 'Sus floraciones masivas atraen a cientos de abejas nativas sin aguijón y colibríes durante los meses primaverales.'),
(32, 2, 'Yuraj Huaycha - Miconia theaezans', 'Mid-canopy tree with prominently ribbed leaves frequent in forest clearings and margins.', 'Undergoes synchronized massive blooming events attracting hundreds of stingless native bees and hummingbirds.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(33, 1, 'Cedro Andino - Cedrela lilloi', 'Árbol maderable gigante del dosel superior de los bosques nublados andinos, protegido contra la sobreexplotación.', 'Su corteza exuda un aroma balsámico que ahuyenta termitas y larvas perforadoras de manera natural.'),
(33, 2, 'Andean Cedar - Cedrela lilloi', 'Towering canopy timber tree native to montane cloud forests, strictly guarded against overlogging.', 'Its bark contains fragrant natural oils repelling insect borers and termites.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(34, 1, 'Aliso Andino - Alnus acuminata', 'Árbol pionero de rápido crecimiento que coloniza riberas fluviales y laderas propensas a derrumbes.', 'Vive en simbiosis con actinobacterias Frankia capaces de capturar nitrógeno libre del aire y enriquecer los suelos degradados.'),
(34, 2, 'Andean Alder - Alnus acuminata', 'Fast-growing pioneer tree colonizing riparian banks and landslide recovery zones.', 'Hosts symbiotic root nodules with Frankia bacteria that fix atmospheric nitrogen, naturally fertilizing rocky mountain slopes.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(35, 1, 'Yaruma - Hesperomeles ferruginea', 'Arbusto o árbol pequeño de hojas lustrosas con vellosidades rojizas en el envés, emparentado con la familia de los manzanos silvestres.', 'Sus pequeños frutos rojizos maduran en invierno y son el alimento salvavidas de aves que no migran.'),
(35, 2, 'Yaruma - Hesperomeles ferruginea', 'Small tree with reddish velvety leaf undersides, belonging to the wild montane apple and rose family.', 'Produces small red pomes in late autumn that sustain non-migratory cloud forest birds through winter frosts.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(36, 1, 'Aliso Colorado - Myrica pubescens', 'Arbusto perenne que crece vigorosamente en laderas escarpadas y suelos pedregosos de ceja de monte.', 'Sus bayas están recubiertas por una cera vegetal espesa que tradicionalmente fue empleada por comunidades para fabricar velas.'),
(36, 2, 'Wax Myrtle - Myrica pubescens', 'Evergreen shrub thriving on steep slopes and nutrient-poor rocky screes in the cloud belt.', 'Its small berries are coated in a thick natural wax that local communities historically collected for smokeless candles.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(37, 1, 'Laureles Andinos - Ocotea spp.', 'Árboles aromáticos del dosel forestal cuyos frutos carnosos son consumidos por pavas, tucanes y murciélagos.', 'Al machacar o frotar sus hojas despiden una fragancia intensa a laurel y nuez moscada rica en aceites esenciales antisépticos.'),
(37, 2, 'Andean Laurel - Ocotea spp.', 'Aromatic forest trees whose lipid-rich fruits sustain toucans, quetzals, and frugivorous bats.', 'Crushing fresh leaves releases an intense sweet-spicy scent rich in essential antiseptic oils.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(38, 1, 'Quina / Árbol de la Quina - Cinchona officinalis', 'Árbol sagrado de la medicina andina que crece en los bosques nublados de Cotapata.', 'De su amarga corteza se aisló la quinina, primer fármaco eficaz de la historia contra la malaria humana que salvó millones de vidas.'),
(38, 2, 'Quinine Tree - Cinchona officinalis', 'Historic medicinal tree native to Andean cloud forests, symbol of natural pharmacology.', 'Its bitter bark yields natural quinine, the first medicine capable of combating human malaria, saving countless lives globally.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(39, 1, 'Vilca / Bilka - Anadenanthera colubrina', 'Árbol esbelto de vainas aplanadas que habita en las quebradas cálidas y soleadas de Cotapata.', 'Sus semillas han sido recolectadas desde hace más de mil años por pueblos originarios para ceremonias espirituales y medicina tradicional.'),
(39, 2, 'Vilca Tree - Anadenanthera colubrina', 'Graceful legume tree with fern-like foliage inhabiting warmer southern slopes of Cotapata.', 'Its dark seeds have been gathered for thousands of years by indigenous peoples for sacred ceremonial use and medicine.');

INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES
(40, 1, 'Flor Endémica de Cotapata - Ourisia cotapatensis', 'Delicada planta herbácea con llamativas flores acampanadas que crece en fisuras húmedas de roca.', 'Descubierta para la ciencia universal en 2003 dentro del propio Parque Cotapata y no existe de manera silvestre en ningún otro sitio del planeta.'),
(40, 2, 'Cotapata Endemic Flower - Ourisia cotapatensis', 'Delicate flowering herb flourishing in damp rock crevices and mossy ledges at high elevations.', 'Discovered and named by botanists in 2003 inside Cotapata National Park; wild populations exist nowhere else on planet Earth.');

-- ==============================================================================
-- ESPECIE DETALLE: METADATOS CIENTÍFICOS, HÁBITAT, DIETA, IMÁGENES Y AUDIOS
-- ==============================================================================

INSERT INTO especie_detalle (id_contenido, tipo_especie, nombre_cientifico, categoria_fauna, archivo_imagen, archivo_audio, es_endemica, estado_conservacion, habitat_cotapata, dieta) VALUES
(1, 'FAUNA', 'Tremarctos ornatus', 'mamifero', 'oso-frontino-2-1.jpg', 'Sonido Oso jukumari.mp3', FALSE, 'Vulnerable (VU)', 'Bosques nublados y ceja de monte (1,800 - 3,400 msnm)', 'Herbívoro-omnívoro (bromelias, palmas, bulbos, frutos y pequeños mamíferos)'),
(2, 'FAUNA', 'Puma concolor', 'mamifero', 'large (1).jpg', 'Sonido Puma.mp3', FALSE, 'Preocupación Menor (LC)', 'Gradiente completo: valles yungueños a pedregales andinos (1,200 - 4,500 msnm)', 'Carnívoro estricto (venados andinos, cerdos de monte, roedores y camélidos)'),
(3, 'FAUNA', 'Ateles chamek', 'mamifero', 'ceb06c81-e99b-40fe-8863-b6e7bd666501.jpg', 'Sonido Marimono.mp3', FALSE, 'En Peligro (EN)', 'Dosel superior de bosques montanos húmedos (1,000 - 2,000 msnm)', 'Frugívoro especialista (frutas maduras carnosas, higos silvestres y flores)'),
(4, 'FAUNA', 'Hippocamelus antisensis', 'mamifero', 'Diseno-sin-titulo-29.jpg', 'Sonido Siervos.mp3', FALSE, 'Vulnerable (VU)', 'Riscos escarpados y pajonales altoandinos (3,500 - 4,800 msnm)', 'Herbívoro ramoneador (líquenes, gramíneas duras y arbustos enanos)'),
(5, 'FAUNA', 'Pecari tajacu', 'mamifero', 'chancho de monte 04.jpeg', 'Sonido Cancho de monte.mp3', FALSE, 'Preocupación Menor (LC)', 'Bosques húmedos montanos y premontanos (1,100 - 2,200 msnm)', 'Omnívoro forrajero (raíces, tubérculos, frutos caídos e invertebrados)'),
(6, 'FAUNA', 'Dinomys branickii', 'roedor', 'pacarana__dinomys_branickii__no_zoologico_do_parque_ambiental_chico_mendes__rio_branco__.jpg', 'Sonido Pacarana.mp3', FALSE, 'Vulnerable (VU)', 'Cañadas umbrías y quebradas del bosque nublado (1,500 - 3,000 msnm)', 'Herbívoro (hojas carnosas, tallos tiernos, frutos y cortezas nativas)'),
(7, 'FAUNA', 'Dasyprocta punctata', 'roedor', '507178952_9357785367656840_7279397495556188778_n.jpg', 'Sonido Jochi colorado.mp3', FALSE, 'Preocupación Menor (LC)', 'Sotobosque de valles subtropicales húmedos (1,100 - 2,400 msnm)', 'Granívoro y frugívoro (semillas duras, nueces leñosas, raíces y retoños)'),
(8, 'FAUNA', 'Desmodus rotundus', 'mamifero', 'muercielago.jpg', 'Sonido Murcielago.mp3', FALSE, 'Preocupación Menor (LC)', 'Cavernas y hendiduras rocosas en valles templados (1,100 - 2,500 msnm)', 'Hematófago estricto (sangre de mamíferos medianos y grandes)'),
(9, 'FAUNA', 'Phyllostomus hastatus', 'mamifero', 'large.jpg', 'Sonido Murcielago.mp3', FALSE, 'Preocupación Menor (LC)', 'Estrato medio de bosques premontanos y yungas (1,100 - 2,000 msnm)', 'Omnívoro (frutos maduros de Ficus, néctar, polen, insectos y pequeñas aves)'),
(10, 'FAUNA', 'Saguinus spp.', 'mamifero', 'Portadas-Amazonas-MOno-TITI-LOW.jpg', 'Sonido Mono Titi.mp3', FALSE, 'Preocupación Menor (LC)', 'Dosel medio y enredaderas de bosques yungueños (1,000 - 1,800 msnm)', 'Omnívoro (frutas dulces, savia vegetal gomosa, néctar y arañas)'),
(11, 'FAUNA', 'Leopardus colocolo / L. tigrinus', 'mamifero', 'WhatsApp Image 2026-03-04 at 11.27.04.jpeg', 'Sonido Gato pajonal.mp3', FALSE, 'Casi Amenazado (NT)', 'Pajonales de puna, estepas y cejas rocosas (2,500 - 4,200 msnm)', 'Carnívoro (cuises, ratones andinos, lagartijas y huevos de aves de suelo)'),
(12, 'FAUNA', 'Lycalopex culpaeus', 'mamifero', 'f28cba57-f446-4556-b2ae-5c264a530a9d.jpg', 'Sonido Zorro.mp3', FALSE, 'Preocupación Menor (LC)', 'Pastizales de montaña, laderas y bordes de bosque (2,200 - 4,500 msnm)', 'Carnívoro generalista y carroñero (roedores, vizcachas, bayas y carroña)'),
(13, 'FAUNA', 'Rupicola peruvianus', 'ave', 'TUNKI.jpg', 'Sonido Tunki.mp3', FALSE, 'Preocupación Menor (LC)', 'Cañones fluviales y quebradas del bosque nublado (1,200 - 2,600 msnm)', 'Frugívoro especialista (bayas de monte, frutos de lauráceas e insectos)'),
(14, 'FAUNA', 'Vultur gryphus', 'ave', '8d81c823-abdf-4c04-83fa-002611abb02f.jpg', 'Sonido Condor.mp3', FALSE, 'Vulnerable (VU)', 'Farallones escarpados y cumbres cordilleranas (3,000 - 5,200 msnm)', 'Carroñero estricto (carcasas de ungulados silvestres y ganado de montaña)'),
(15, 'FAUNA', 'Steatornis caripensis', 'ave', '483359_10150947721041695_493434887_n.jpg', 'Sonido Guácharo.mp3', FALSE, 'Preocupación Menor (LC)', 'Cavernas oscuras y bosques de neblina circundantes (1,200 - 2,800 msnm)', 'Frugívoro nocturno (frutos de palmeras ricas en aceites y lauráceas)'),
(16, 'FAUNA', 'Spizaetus isidori', 'ave', 'aguilla negra.jpg', 'Sonido Aguila negra y castaña.mp3', FALSE, 'En Peligro (EN)', 'Dosel continuo de laderas nubladas vírgenes (1,500 - 3,200 msnm)', 'Depredador apical aéreo (monos, ardillas gigantes, pacaranas y pavas)'),
(17, 'FAUNA', 'Penelope montagnii', 'ave', '900.jpg', 'Sonido Pava andina.mp3', FALSE, 'Preocupación Menor (LC)', 'Estratos medios del bosque nublado y ceja de monte (1,800 - 3,500 msnm)', 'Frugívoro y folívoro (brotes verdes, hojas tiernas, drupas y bayas)'),
(18, 'FAUNA', 'Chamaepetes goudotii', 'ave', 'sickle_winged_guan-1.jpg', 'Sonido Pavo ala de hoz.mp3', FALSE, 'Preocupación Menor (LC)', 'Sotobosque húmedo y vegetación riparia de montaña (1,600 - 3,000 msnm)', 'Frugívoro (semillas carnosas de ericáceas, higos y pequeños insectos)'),
(19, 'FAUNA', 'Aglaeactis pamela', 'ave', 'WhatsApp Image 2026-03-04 at 11.23.32.jpeg', 'Sonido Colibri de sol boliviano.mp3', TRUE, 'Preocupación Menor (LC)', 'Matorrales andinos húmedos y queñuales altos (2,800 - 3,800 msnm)', 'Nectarívoro e insectívoro (néctar de orquídeas y salvia, y mosquitos en vuelo)'),
(20, 'FAUNA', 'Cinclodes aricomae', 'ave', 'WhatsApp Image 2026-03-04 at 11.26.34.jpeg', 'Sonido Remolina real.mp3', FALSE, 'Peligro Crítico (CR)', 'Bosques relictos de queñua en valles glaciares (3,600 - 4,400 msnm)', 'Insectívoro especialista (larvas, coleópteros y arañas bajo corteza de queñua)'),
(21, 'FLORA', 'Festuca dolichophylla', 'no_aplica', 'festuca-dolichophylla.jpg', NULL, FALSE, 'Preocupación Menor (LC)', 'Pajonales húmedos y bofedales de puna (3,800 - 4,600 msnm)', 'Autótrofo fotosintético (fijador de suelo)'),
(22, 'FLORA', 'Cinnagrostis spp.', 'no_aplica', 'Cinnagrostisspp.jpg', NULL, FALSE, 'Preocupación Menor (LC)', 'Laderas expuestas y cumbres frías (3,900 - 4,700 msnm)', 'Autótrofo fotosintético'),
(23, 'FLORA', 'Distichia muscoides', 'no_aplica', 'Distichia_muscoides_2.jpg', NULL, FALSE, 'Preocupación Menor (LC)', 'Humedales y turberas de altura (4,000 - 4,800 msnm)', 'Autótrofo fotosintético (regulador hídrico)'),
(24, 'FLORA', 'Plantago tubulosa', 'no_aplica', 'Plantago tubulosa.jpg', NULL, FALSE, 'Preocupación Menor (LC)', 'Manantiales y vertientes frías de bofedal (3,900 - 4,600 msnm)', 'Autótrofo fotosintético (biofiltro natural)'),
(25, 'FLORA', 'Oxychloe andina', 'no_aplica', 'Oxychloe.jpg', NULL, FALSE, 'Preocupación Menor (LC)', 'Márgenes de lagunillas glaciares (4,100 - 4,850 msnm)', 'Autótrofo fotosintético'),
(26, 'FLORA', 'Polylepis pepei', 'no_aplica', 'Polylepis pepei.jpg', NULL, FALSE, 'En Peligro (EN)', 'Laderas rocosas y valles glaciares relictos (3,600 - 4,300 msnm)', 'Autótrofo fotosintético (árbol de gran altitud)'),
(27, 'FLORA', 'Podocarpus rusbyi', 'no_aplica', 'Podocarpusrusbyi.jpg', NULL, FALSE, 'Vulnerable (VU)', 'Partes altas del bosque nublado (2,200 - 3,200 msnm)', 'Autótrofo fotosintético (conífera nativa)'),
(28, 'FLORA', 'Podocarpus ingensis', 'no_aplica', 'Podocarpus ingensis.jpg', NULL, FALSE, 'Vulnerable (VU)', 'Ceja de monte húmeda (2,400 - 3,300 msnm)', 'Autótrofo fotosintético'),
(29, 'FLORA', 'Weinmannia boliviensis', 'no_aplica', 'Weinmanniaboliviensis.jpg', NULL, FALSE, 'Preocupación Menor (LC)', 'Ceja de monte y bosque montano (2,000 - 3,000 msnm)', 'Autótrofo fotosintético (atrapaniebla)'),
(30, 'FLORA', 'Weinmannia crassifolia', 'no_aplica', 'Weinmannia_pinnata_1.jpg', NULL, FALSE, 'Preocupación Menor (LC)', 'Crestas montañosas con neblina constante (2,200 - 3,100 msnm)', 'Autótrofo fotosintético'),
(31, 'FLORA', 'Juglans boliviana', 'no_aplica', 'NOGAL.jpg', NULL, FALSE, 'En Peligro (EN)', 'Valles templados y riberas protegidas (1,300 - 2,200 msnm)', 'Autótrofo fotosintético (madera noble y nueces)'),
(32, 'FLORA', 'Miconia theaezans', 'no_aplica', 'Miconia theaezans.jpg', NULL, FALSE, 'Preocupación Menor (LC)', 'Claros de bosque y matorrales montanos (1,600 - 2,800 msnm)', 'Autótrofo fotosintético'),
(33, 'FLORA', 'Cedrela lilloi', 'no_aplica', 'Cedrela_odorata_foliage.jpg', NULL, FALSE, 'En Peligro (EN)', 'Laderas montañosas húmedas (1,400 - 2,400 msnm)', 'Autótrofo fotosintético'),
(34, 'FLORA', 'Alnus acuminata', 'no_aplica', 'acuminata.jpg', NULL, FALSE, 'Preocupación Menor (LC)', 'Orillas de ríos y zonas de derrumbes (1,600 - 2,900 msnm)', 'Autótrofo fotosintético (fijador de nitrógeno)'),
(35, 'FLORA', 'Hesperomeles ferruginea', 'no_aplica', 'Hesperomelesferruginea.jpg', NULL, FALSE, 'Preocupación Menor (LC)', 'Bosque enano y ceja de monte (2,600 - 3,500 msnm)', 'Autótrofo fotosintético'),
(36, 'FLORA', 'Myrica pubescens', 'no_aplica', 'Myricapubescens.jpg', NULL, FALSE, 'Preocupación Menor (LC)', 'Laderas escarpadas pedregosas (2,000 - 3,200 msnm)', 'Autótrofo fotosintético (cera vegetal)'),
(37, 'FLORA', 'Ocotea spp.', 'no_aplica', 'Ocotea.jpg', NULL, FALSE, 'Preocupación Menor (LC)', 'Estrato alto del bosque nublado (1,500 - 2,600 msnm)', 'Autótrofo fotosintético (laurel aromático)'),
(38, 'FLORA', 'Cinchona officinalis', 'no_aplica', 'Cinchonaofficinalis.jpg', NULL, FALSE, 'Vulnerable (VU)', 'Laderas húmedas y cañadas sombrías (1,600 - 2,700 msnm)', 'Autótrofo fotosintético (quinina medicinal)'),
(39, 'FLORA', 'Anadenanthera colubrina', 'no_aplica', 'Anadenantheracolubrina.jpg', NULL, FALSE, 'Preocupación Menor (LC)', 'Quebradas cálidas y valles bajos (1,100 - 1,800 msnm)', 'Autótrofo fotosintético'),
(40, 'FLORA', 'Ourisia cotapatensis', 'no_aplica', 'Ourisiacotapatensis.jpg', NULL, TRUE, 'Vulnerable (VU)', 'Grietas de roca húmeda en cotas altas (3,200 - 3,900 msnm)', 'Autótrofo fotosintético (endemismo estricto)');

-- ==============================================================================
-- MÉTRICAS AGREGADAS ANÓNIMAS INICIALES
-- ==============================================================================
INSERT INTO interaccion (tipo_consulta, id_recurso, nombre_recurso, idioma) VALUES
('FAUNA', 1, 'Oso Andino / Jucumari', 'es'),
('FAUNA', 1, 'Oso Andino / Jucumari', 'es'),
('FAUNA', 2, 'Puma', 'es'),
('FAUNA', 13, 'Tunqui / Gallito de las Rocas', 'es'),
('FLORA', 26, 'Queñua', 'es'),
('ATRACTIVO', 1, 'Camino Precolombino El Choro', 'es'),
('SERVICIO', 1, 'Albergue y Camping Ecológico Sandillani', 'es');

-- ==============================================================================
-- SINCRONIZACIÓN DE SECUENCIAS EN POSTGRESQL (Evita colisiones de SERIAL)
-- ==============================================================================
SELECT setval(pg_get_serial_sequence('idioma', 'id_idioma'), COALESCE(MAX(id_idioma), 1)) FROM idioma;
SELECT setval(pg_get_serial_sequence('rol', 'id_rol'), COALESCE(MAX(id_rol), 1)) FROM rol;
SELECT setval(pg_get_serial_sequence('usuario', 'id_usuario'), COALESCE(MAX(id_usuario), 1)) FROM usuario;
SELECT setval(pg_get_serial_sequence('autorizacion', 'id_autorizacion'), COALESCE(MAX(id_autorizacion), 1)) FROM autorizacion;
SELECT setval(pg_get_serial_sequence('contenido', 'id_contenido'), COALESCE(MAX(id_contenido), 1)) FROM contenido;
SELECT setval(pg_get_serial_sequence('categoria_servicio', 'id_categoria'), COALESCE(MAX(id_categoria), 1)) FROM categoria_servicio;
SELECT setval(pg_get_serial_sequence('comunario', 'id_comunario'), COALESCE(MAX(id_comunario), 1)) FROM comunario;
SELECT setval(pg_get_serial_sequence('servicio', 'id_servicio'), COALESCE(MAX(id_servicio), 1)) FROM servicio;
SELECT setval(pg_get_serial_sequence('atractivo', 'id_atractivo'), COALESCE(MAX(id_atractivo), 1)) FROM atractivo;
SELECT setval(pg_get_serial_sequence('ruta', 'id_ruta'), COALESCE(MAX(id_ruta), 1)) FROM ruta;
SELECT setval(pg_get_serial_sequence('recomendacion', 'id_recomendacion'), COALESCE(MAX(id_recomendacion), 1)) FROM recomendacion;
SELECT setval(pg_get_serial_sequence('contenido_idioma', 'id_contenido_idioma'), COALESCE(MAX(id_contenido_idioma), 1)) FROM contenido_idioma;
SELECT setval(pg_get_serial_sequence('especie_detalle', 'id_especie'), COALESCE(MAX(id_especie), 1)) FROM especie_detalle;

-- Fin de esquema PostgreSQL / Supabase
