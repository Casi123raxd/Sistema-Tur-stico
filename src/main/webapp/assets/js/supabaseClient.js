// ==============================================================================
// COTAPATA EXPLORA — CLIENTE OFICIAL DE SUPABASE (CLOUD BAAS)
// Archivo: src/main/webapp/assets/js/supabaseClient.js
// Lee de forma segura las variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY
// o utiliza las credenciales oficiales del proyecto bsyhayoglxcsnfhqgidg.
// ==============================================================================

(function() {
    'use strict';

    // 1. Detección dinámica de variables de entorno y configuración
    const getEnvVar = function(name) {
        if (typeof window !== 'undefined') {
            if (window[name]) return window[name];
            if (window.ENV && window.ENV[name]) return window.ENV[name];
            if (window.process && window.process.env && window.process.env[name]) return window.process.env[name];
        }
        if (typeof process !== 'undefined' && process.env && process.env[name]) {
            return process.env[name];
        }
        return null;
    };

    const SUPABASE_URL = getEnvVar('SUPABASE_URL') || 'https://bsyhayoglxcsnfhqgidg.supabase.co/rest/v1/';
    const SUPABASE_ANON_KEY = getEnvVar('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzeWhheW9nbHhjc25maHFnaWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MzEyMTYsImV4cCI6MjEwOTIwNzIxNn0.T7uYK9XWsBPRsTVfU84uz8Qk-Bxx5-NQghZyJ-ipm9Y';

    window.SUPABASE_URL = SUPABASE_URL;
    window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
    window.SUPABASE_CONFIG = {
        url: SUPABASE_URL,
        anonKey: SUPABASE_ANON_KEY
    };

    let _supabaseInstanciaGlobal = null;

    /**
     * Obtiene la instancia singleton del cliente Supabase JS.
     * @returns {Object|null} Cliente Supabase o null si no se pudo inicializar.
     */
    function obtenerClienteSupabase() {
        if (_supabaseInstanciaGlobal) {
            return _supabaseInstanciaGlobal;
        }

        if (window.supabase && typeof window.supabase.createClient === 'function') {
            try {
                _supabaseInstanciaGlobal = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                window.supabaseClient = _supabaseInstanciaGlobal;
                console.log('✓ [Supabase Client] Conectado exitosamente con URL:', SUPABASE_URL);
                return _supabaseInstanciaGlobal;
            } catch (err) {
                console.error('[Supabase Client] Error al inicializar cliente createClient:', err);
            }
        } else {
            console.warn('[Supabase Client] Librería @supabase/supabase-js no detectada en window.supabase.');
        }
        return null;
    }

    // Exponer globalmente en window para que app.js y admin.js lo consuman directamente
    window.obtenerClienteSupabase = obtenerClienteSupabase;
})();
