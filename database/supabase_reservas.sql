-- ==============================================================================
-- COTAPATA EXPLORA — TABLA DE RESERVAS Y DISPONIBILIDAD EN SUPABASE
-- Archivo: database/supabase_reservas.sql
-- Gestiona reservas de visitantes, bloqueos manuales y disponibilidad de alojamientos
-- ==============================================================================

-- 1. Crear tabla de reservas y bloqueos si no existe
CREATE TABLE IF NOT EXISTS public.reservas (
    id BIGSERIAL PRIMARY KEY,
    servicio_id VARCHAR(100) NOT NULL,
    servicio_titulo VARCHAR(255),
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_contacto VARCHAR(255) NOT NULL,
    cantidad_personas INT DEFAULT 1,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    metodo_pago VARCHAR(100) NOT NULL,
    monto_total VARCHAR(100),
    tipo_registro VARCHAR(50) DEFAULT 'reserva',
    estado VARCHAR(50) DEFAULT 'confirmada',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Asegurar columna estado_disponibilidad en public.servicios
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'servicios' 
          AND column_name = 'estado_disponibilidad'
    ) THEN
        ALTER TABLE public.servicios ADD COLUMN estado_disponibilidad VARCHAR(50) DEFAULT 'Disponible';
    END IF;
END $$;

-- 3. Habilitar Row Level Security (RLS) en public.reservas
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- 4. Limpieza de políticas previas para evitar duplicados
DROP POLICY IF EXISTS "Permitir lectura publica de reservas" ON public.reservas;
DROP POLICY IF EXISTS "Permitir insercion de reservas" ON public.reservas;
DROP POLICY IF EXISTS "Permitir actualizacion de reservas" ON public.reservas;
DROP POLICY IF EXISTS "Permitir eliminacion de reservas" ON public.reservas;

-- 5. Definición de Políticas RLS para reservas
CREATE POLICY "Permitir lectura publica de reservas"
    ON public.reservas FOR SELECT
    TO anon, authenticated, service_role
    USING (true);

CREATE POLICY "Permitir insercion de reservas"
    ON public.reservas FOR INSERT
    TO anon, authenticated, service_role
    WITH CHECK (true);

CREATE POLICY "Permitir actualizacion de reservas"
    ON public.reservas FOR UPDATE
    TO anon, authenticated, service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir eliminacion de reservas"
    ON public.reservas FOR DELETE
    TO anon, authenticated, service_role
    USING (true);
