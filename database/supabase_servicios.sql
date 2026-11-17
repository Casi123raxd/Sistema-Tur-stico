-- ==============================================================================
-- COTAPATA EXPLORA — TABLA DE SERVICIOS COMUNITARIOS Y POLÍTICAS RLS EN SUPABASE
-- Archivo: database/supabase_servicios.sql
-- Permite INSERT, SELECT, UPDATE y DELETE para publicación y consulta comunitaria
-- ==============================================================================

-- 1. Crear tabla de servicios comunitarios si no existe
CREATE TABLE IF NOT EXISTS public.servicios (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    titulo VARCHAR(255),
    categoria VARCHAR(50) NOT NULL DEFAULT 'alojamiento',
    tipo_servicio VARCHAR(50) DEFAULT 'alojamiento',
    descripcion TEXT NOT NULL,
    precio VARCHAR(100) NOT NULL,
    precios VARCHAR(100),
    comunidad VARCHAR(100) NOT NULL,
    imagen TEXT,
    vendedor_id VARCHAR(100),
    vendedor_rol VARCHAR(100) DEFAULT 'Residente del lugar',
    autor VARCHAR(100),
    ubicacion_referencial VARCHAR(255),
    horario_atencion VARCHAR(100),
    icono_categoria VARCHAR(20),
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asegurar compatibilidad de columnas en caso de que la tabla ya exista previamente
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='servicios' AND column_name='titulo') THEN
        ALTER TABLE public.servicios ADD COLUMN titulo VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='servicios' AND column_name='categoria') THEN
        ALTER TABLE public.servicios ADD COLUMN categoria VARCHAR(50) DEFAULT 'alojamiento';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='servicios' AND column_name='tipo_servicio') THEN
        ALTER TABLE public.servicios ADD COLUMN tipo_servicio VARCHAR(50) DEFAULT 'alojamiento';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='servicios' AND column_name='precios') THEN
        ALTER TABLE public.servicios ADD COLUMN precios VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='servicios' AND column_name='vendedor_id') THEN
        ALTER TABLE public.servicios ADD COLUMN vendedor_id VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='servicios' AND column_name='vendedor_rol') THEN
        ALTER TABLE public.servicios ADD COLUMN vendedor_rol VARCHAR(100) DEFAULT 'Residente del lugar';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='servicios' AND column_name='autor') THEN
        ALTER TABLE public.servicios ADD COLUMN autor VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='servicios' AND column_name='ubicacion_referencial') THEN
        ALTER TABLE public.servicios ADD COLUMN ubicacion_referencial VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='servicios' AND column_name='horario_atencion') THEN
        ALTER TABLE public.servicios ADD COLUMN horario_atencion VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='servicios' AND column_name='icono_categoria') THEN
        ALTER TABLE public.servicios ADD COLUMN icono_categoria VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='servicios' AND column_name='fecha_registro') THEN
        ALTER TABLE public.servicios ADD COLUMN fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;

-- 3. Limpieza de políticas previas para evitar duplicados
DROP POLICY IF EXISTS "Permitir lectura publica de servicios" ON public.servicios;
DROP POLICY IF EXISTS "Permitir insercion de servicios" ON public.servicios;
DROP POLICY IF EXISTS "Permitir actualizacion de servicios" ON public.servicios;
DROP POLICY IF EXISTS "Permitir eliminacion de servicios" ON public.servicios;

-- 4. Definición de Políticas RLS
-- Permitir lectura pública a cualquier visitante o usuario
CREATE POLICY "Permitir lectura publica de servicios"
    ON public.servicios FOR SELECT
    TO anon, authenticated, service_role
    USING (true);

-- Permitir a los residentes insertar nuevos servicios
CREATE POLICY "Permitir insercion de servicios"
    ON public.servicios FOR INSERT
    TO anon, authenticated, service_role
    WITH CHECK (true);

-- Permitir actualizar servicios
CREATE POLICY "Permitir actualizacion de servicios"
    ON public.servicios FOR UPDATE
    TO anon, authenticated, service_role
    USING (true)
    WITH CHECK (true);

-- Permitir eliminar servicios
CREATE POLICY "Permitir eliminacion de servicios"
    ON public.servicios FOR DELETE
    TO anon, authenticated, service_role
    USING (true);

-- 5. Otorgar privilegios a los roles de Supabase
GRANT ALL ON TABLE public.servicios TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.servicios TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
