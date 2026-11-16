-- ==============================================================================
-- COTAPATA EXPLORA — TABLA DE USUARIOS Y POLÍTICAS RLS EN SUPABASE
-- Archivo: database/supabase_usuarios.sql
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL DEFAULT 'turista', -- 'turista' | 'residente'
    rol VARCHAR(80) NOT NULL DEFAULT 'Turista/Visitante',
    comunidad VARCHAR(80) NULL, -- 'Chairo', 'Sandillani', 'Pacollo' o NULL
    nombre_completo VARCHAR(120) NULL,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asegurar que la columna fecha_registro exista si la tabla ya había sido creada previamente
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios' 
        AND column_name = 'fecha_registro'
    ) THEN
        ALTER TABLE public.usuarios ADD COLUMN fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Limpieza de políticas previas
DROP POLICY IF EXISTS "Permitir insercion de usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Permitir lectura de usuarios a administradores y publico" ON public.usuarios;

-- Permitir registrar usuarios (INSERT) a cualquier visitante o anónimo
CREATE POLICY "Permitir insercion de usuarios"
    ON public.usuarios FOR INSERT
    TO anon, authenticated, service_role
    WITH CHECK (true);

-- Permitir consultar usuarios (SELECT) para el panel administrativo
CREATE POLICY "Permitir lectura de usuarios a administradores y publico"
    ON public.usuarios FOR SELECT
    TO anon, authenticated, service_role
    USING (true);

-- Otorgar privilegios a los roles de Supabase
GRANT ALL ON TABLE public.usuarios TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.usuarios TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
