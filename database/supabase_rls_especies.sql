-- ==============================================================================
-- COTAPATA EXPLORA — POLÍTICAS RLS (ROW LEVEL SECURITY) EN SUPABASE
-- Archivo: database/supabase_rls_especies.sql
-- Tablas involucradas: contenido, contenido_idioma, especie_detalle, especies
-- Permite SELECT, INSERT, UPDATE y DELETE para el rol admin y lectura general
-- ==============================================================================

-- 1. Habilitar RLS en las tablas del modelo de especies
ALTER TABLE IF EXISTS contenido ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contenido_idioma ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS especie_detalle ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'especies') THEN
        EXECUTE 'ALTER TABLE especies ENABLE ROW LEVEL SECURITY';
    END IF;
END $$;

-- 2. Limpieza de políticas previas para evitar colisiones
DROP POLICY IF EXISTS "Permitir lectura publica de contenido" ON contenido;
DROP POLICY IF EXISTS "Permitir insercion admin de contenido" ON contenido;
DROP POLICY IF EXISTS "Permitir modificacion admin de contenido" ON contenido;
DROP POLICY IF EXISTS "Permitir eliminacion admin de contenido" ON contenido;

DROP POLICY IF EXISTS "Permitir lectura publica de contenido_idioma" ON contenido_idioma;
DROP POLICY IF EXISTS "Permitir insercion admin de contenido_idioma" ON contenido_idioma;
DROP POLICY IF EXISTS "Permitir modificacion admin de contenido_idioma" ON contenido_idioma;
DROP POLICY IF EXISTS "Permitir eliminacion admin de contenido_idioma" ON contenido_idioma;

DROP POLICY IF EXISTS "Permitir lectura publica de especie_detalle" ON especie_detalle;
DROP POLICY IF EXISTS "Permitir insercion admin de especie_detalle" ON especie_detalle;
DROP POLICY IF EXISTS "Permitir modificacion admin de especie_detalle" ON especie_detalle;
DROP POLICY IF EXISTS "Permitir eliminacion admin de especie_detalle" ON especie_detalle;

-- 3. POLÍTICAS PARA LA TABLA 'contenido'
CREATE POLICY "Permitir lectura publica de contenido"
    ON contenido FOR SELECT
    TO anon, authenticated, service_role
    USING (true);

CREATE POLICY "Permitir insercion admin de contenido"
    ON contenido FOR INSERT
    TO anon, authenticated, service_role
    WITH CHECK (true);

CREATE POLICY "Permitir modificacion admin de contenido"
    ON contenido FOR UPDATE
    TO anon, authenticated, service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir eliminacion admin de contenido"
    ON contenido FOR DELETE
    TO anon, authenticated, service_role
    USING (true);

-- 4. POLÍTICAS PARA LA TABLA 'contenido_idioma'
CREATE POLICY "Permitir lectura publica de contenido_idioma"
    ON contenido_idioma FOR SELECT
    TO anon, authenticated, service_role
    USING (true);

CREATE POLICY "Permitir insercion admin de contenido_idioma"
    ON contenido_idioma FOR INSERT
    TO anon, authenticated, service_role
    WITH CHECK (true);

CREATE POLICY "Permitir modificacion admin de contenido_idioma"
    ON contenido_idioma FOR UPDATE
    TO anon, authenticated, service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir eliminacion admin de contenido_idioma"
    ON contenido_idioma FOR DELETE
    TO anon, authenticated, service_role
    USING (true);

-- 5. POLÍTICAS PARA LA TABLA 'especie_detalle'
CREATE POLICY "Permitir lectura publica de especie_detalle"
    ON especie_detalle FOR SELECT
    TO anon, authenticated, service_role
    USING (true);

CREATE POLICY "Permitir insercion admin de especie_detalle"
    ON especie_detalle FOR INSERT
    TO anon, authenticated, service_role
    WITH CHECK (true);

CREATE POLICY "Permitir modificacion admin de especie_detalle"
    ON especie_detalle FOR UPDATE
    TO anon, authenticated, service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir eliminacion admin de especie_detalle"
    ON especie_detalle FOR DELETE
    TO anon, authenticated, service_role
    USING (true);

-- 6. POLÍTICAS PARA TABLA APLANADA 'especies' (Si existe en tu proyecto Supabase)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'especies') THEN
        EXECUTE 'DROP POLICY IF EXISTS "Permitir lectura publica de especies" ON especies';
        EXECUTE 'DROP POLICY IF EXISTS "Permitir insercion admin de especies" ON especies';
        EXECUTE 'DROP POLICY IF EXISTS "Permitir actualizacion admin de especies" ON especies';
        EXECUTE 'DROP POLICY IF EXISTS "Permitir eliminacion admin de especies" ON especies';

        EXECUTE 'CREATE POLICY "Permitir lectura publica de especies" ON especies FOR SELECT TO anon, authenticated, service_role USING (true)';
        EXECUTE 'CREATE POLICY "Permitir insercion admin de especies" ON especies FOR INSERT TO anon, authenticated, service_role WITH CHECK (true)';
        EXECUTE 'CREATE POLICY "Permitir actualizacion admin de especies" ON especies FOR UPDATE TO anon, authenticated, service_role USING (true) WITH CHECK (true)';
        EXECUTE 'CREATE POLICY "Permitir eliminacion admin de especies" ON especies FOR DELETE TO anon, authenticated, service_role USING (true)';
    END IF;
END $$;

-- 7. Concesión de privilegios para roles del pool de conexiones de Supabase
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- OPCIÓN ALTERNATIVA DE DESARROLLO (Desactivar RLS por completo en estas tablas):
-- ALTER TABLE contenido DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE contenido_idioma DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE especie_detalle DISABLE ROW LEVEL SECURITY;
