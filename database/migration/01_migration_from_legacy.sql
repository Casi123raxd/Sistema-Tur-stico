-- ==============================================================================
-- COTAPATA EXPLORA — SCRIPT DE MIGRACIÓN DESDE ESQUEMA ANTERIOR
-- Archivo: database/migration/01_migration_from_legacy.sql
-- ==============================================================================

-- 1. ANÁLISIS DE TABLAS ANTERIORES:
--    - 'contenido': Se conserva su estructura básica (id_contenido, tipo, estado_validacion)
--      y se añade id_autorizacion y campos de auditoría temporal.
--    - 'contenido_idioma': Se conserva la clave foránea id_contenido, id_idioma y texto.
--      Se añade soporte para dato_curioso estructurado.
--    - 'visitante' (id_visitante, nombre, carnet, celular, token_anonimo):
--      TRANSFORMACIÓN ÉTICA: Por principios de privacidad, minimización de datos
--      (Directivas SERNAP y Justificación Salesiana del proyecto), se elimina la recolección
--      injustificada de carnets de identidad y números de celular de turistas en consulta.
--      Se migran únicamente los conteos agregados a la nueva tabla 'interaccion'.

-- PASO PREVIO OBLIGATORIO: Respaldo antes de ejecutar en base existente
-- mysqldump -u root -p cotapata_db > cotapata_backup_anterior.sql

-- 2. TRANSICIÓN SELECTIVA (En caso de tener datos previos en cotapata_db):

-- Crear tabla de autorizaciones si no existe
CREATE TABLE IF NOT EXISTS autorizacion (
    id_autorizacion INT AUTO_INCREMENT PRIMARY KEY,
    codigo_autorizacion VARCHAR(50) NOT NULL UNIQUE,
    tipo_entidad VARCHAR(50) NOT NULL,
    otorgado_por VARCHAR(120) NOT NULL,
    comunidad VARCHAR(100) NOT NULL,
    observaciones TEXT,
    fecha_autorizacion DATE NOT NULL,
    vigente BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO autorizacion (id_autorizacion, codigo_autorizacion, tipo_entidad, otorgado_por, comunidad, observaciones, fecha_autorizacion, vigente)
VALUES (1, 'AUT-SERNAP-2026-001', 'BIODIVERSIDAD', 'Dirección SERNAP Cotapata', 'Cotapata', 'Autorización de difusión educativa', '2026-01-15', TRUE);

-- Ajustar columnas en 'contenido' si faltan
ALTER TABLE contenido 
ADD COLUMN IF NOT EXISTS id_autorizacion INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Ajustar columnas en 'contenido_idioma' si faltan
ALTER TABLE contenido_idioma
ADD COLUMN IF NOT EXISTS dato_curioso TEXT;

-- Crear tabla de especies detalladas
CREATE TABLE IF NOT EXISTS especie_detalle (
    id_especie INT AUTO_INCREMENT PRIMARY KEY,
    id_contenido INT NOT NULL UNIQUE,
    tipo_especie ENUM('FAUNA', 'FLORA') NOT NULL,
    nombre_cientifico VARCHAR(150) NOT NULL,
    categoria_fauna ENUM('mamifero', 'ave', 'roedor', 'reptil', 'anfibio', 'no_aplica') DEFAULT 'no_aplica',
    archivo_imagen VARCHAR(150) NOT NULL,
    archivo_audio VARCHAR(150) NULL,
    es_endemica BOOLEAN DEFAULT FALSE,
    estado_conservacion VARCHAR(50) DEFAULT 'Preocupación Menor (LC)',
    CONSTRAINT fk_mig_ed_contenido FOREIGN KEY (id_contenido) REFERENCES contenido(id_contenido) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migrar métricas históricas anónimas desde visitante si existiera la tabla
-- (Contando solo cantidad de sesiones sin transferir carnets ni celulares)
CREATE TABLE IF NOT EXISTS interaccion (
    id_interaccion BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo_consulta VARCHAR(50) NOT NULL,
    id_recurso INT NOT NULL,
    nombre_recurso VARCHAR(150),
    idioma VARCHAR(5) DEFAULT 'es',
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Fin de migración controlada
