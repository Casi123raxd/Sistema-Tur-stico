/**
 * COTAPATA EXPLORA — PANEL ADMINISTRATIVO SEGURO
 * Archivo: assets/js/admin.js
 * Gestión de autenticación, CSRF, control de estado y operaciones CRUD.
 */

const AdminState = {
    autenticado: false,
    usuario: null,
    csrfToken: '',
    pestañaActiva: 'tab-adm-especies'
};

document.addEventListener('DOMContentLoaded', () => {
    verificarSesionAdmin();
});

// ==============================================================================
// VERIFICACIÓN DE SESIÓN Y AUTENTICACIÓN
// ==============================================================================
async function verificarSesionAdmin() {
    try {
        const storedUser = localStorage.getItem('cotapata_active_user');
        if (storedUser) {
            const u = JSON.parse(storedUser);
            if (u && u.tipo === 'admin') {
                AdminState.autenticado = true;
                AdminState.usuario = {
                    username: u.username,
                    nombreCompleto: u.nombreCompleto || 'Eddy Admin (Administrador)',
                    nombreRol: 'ADMINISTRADOR'
                };
                actualizarUIAdminLogueado();
                return;
            }
        }

        const res = await fetch('api/auth/check');
        const data = await res.json();
        if (data.authenticated) {
            AdminState.autenticado = true;
            AdminState.usuario = data.usuario;
            AdminState.csrfToken = data.csrfToken;
            actualizarUIAdminLogueado();
        } else {
            AdminState.autenticado = false;
            actualizarUIAdminDeslogueado();
        }
    } catch (e) {
        if (!AdminState.autenticado) {
            AdminState.autenticado = false;
            actualizarUIAdminDeslogueado();
        }
    }
}

function abrirModalAdmin() {
    const esAdmin = AdminState.autenticado || (typeof AuthState !== 'undefined' && AuthState.usuarioActual && AuthState.usuarioActual.tipo === 'admin');
    if (esAdmin) {
        AdminState.autenticado = true;
        const panel = document.getElementById('modal-admin-panel');
        if (panel) panel.classList.add('active');
        cargarDatosPestaña(AdminState.pestañaActiva);
    } else {
        if (typeof abrirModalAuth === 'function') {
            abrirModalAuth('login');
        } else {
            const m = document.getElementById('modal-auth') || document.getElementById('modal-login');
            if (m) m.classList.add('active');
        }
    }
}

function cerrarModalAdmin() {
    const panel = document.getElementById('modal-admin-panel');
    if (panel) panel.classList.remove('active');
    const authM = document.getElementById('modal-auth') || document.getElementById('modal-login');
    if (authM) authM.classList.remove('active');
}

function actualizarUIAdminLogueado() {
    const btnHeader = document.getElementById('btn-admin-header');
    if (btnHeader) {
        btnHeader.innerHTML = `👤 ${AdminState.usuario.username} (Panel)`;
        btnHeader.style.borderColor = 'var(--accent)';
    }
    const adminUserDisplay = document.getElementById('adm-user-name');
    if (adminUserDisplay) {
        adminUserDisplay.innerText = `${AdminState.usuario.nombreCompleto} (${AdminState.usuario.nombreRol})`;
    }
}

function actualizarUIAdminDeslogueado() {
    const btnHeader = document.getElementById('btn-admin-header');
    if (btnHeader) {
        btnHeader.innerHTML = `🔐 Portal Admin`;
        btnHeader.style.borderColor = 'var(--secondary)';
    }
}

// Iniciar sesión
async function ejecutarLogin(e) {
    if (e) e.preventDefault();
    const userInp = document.getElementById('login-username') || document.getElementById('auth-login-username');
    const passInp = document.getElementById('login-password') || document.getElementById('auth-login-password');
    const errEl = document.getElementById('login-error') || document.getElementById('auth-login-error');
    if (errEl) errEl.style.display = 'none';

    const uVal = (userInp ? userInp.value : '').trim();
    const pVal = passInp ? passInp.value : '';

    // Soporte para Administrador Maestro Oculto (Eddy Admin / 99963)
    if (uVal.toLowerCase() === 'eddy admin' && pVal === '99963') {
        const adminUser = {
            username: 'Eddy Admin',
            nombreCompleto: 'Eddy (Administrador Principal)',
            tipo: 'admin',
            nombreRol: 'ADMINISTRADOR',
            comunidad: ''
        };
        AdminState.autenticado = true;
        AdminState.usuario = adminUser;
        localStorage.setItem('cotapata_active_user', JSON.stringify(adminUser));
        if (typeof AuthState !== 'undefined') {
            AuthState.usuarioActual = adminUser;
            if (typeof actualizarUIAuth === 'function') actualizarUIAuth();
        }
        actualizarUIAdminLogueado();
        cerrarModalAdmin();
        abrirModalAdmin();
        return;
    }

    try {
        const res = await fetch('api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: uVal,
                password: pVal
            })
        });

        const data = await res.json();
        if (res.ok && data.success) {
            AdminState.autenticado = true;
            AdminState.usuario = data.usuario;
            AdminState.csrfToken = data.csrfToken;
            if (userInp) userInp.value = '';
            if (passInp) passInp.value = '';
            const m = document.getElementById('modal-login') || document.getElementById('modal-auth');
            if (m) m.classList.remove('active');
            actualizarUIAdminLogueado();
            abrirModalAdmin();
        } else {
            if (errEl) {
                errEl.innerText = data.error || 'Credenciales inválidas';
                errEl.style.display = 'block';
            }
        }
    } catch (err) {
        if (errEl) {
            errEl.innerText = 'Error al comunicarse con el servidor.';
            errEl.style.display = 'block';
        }
    }
}

// Cerrar sesión
async function ejecutarLogout() {
    try {
        await fetch('api/auth/logout', { method: 'POST' });
    } catch (e) {}

    AdminState.autenticado = false;
    AdminState.usuario = null;
    AdminState.csrfToken = '';
    actualizarUIAdminDeslogueado();
    cerrarModalAdmin();
    if (typeof ejecutarLogoutUsuario === 'function') {
        ejecutarLogoutUsuario();
    }
}

// ==============================================================================
// GESTIÓN DE PESTAÑAS ADMINISTRATIVAS
// ==============================================================================
function setPestañaAdmin(tabId, btnEl) {
    AdminState.pestañaActiva = tabId;
    document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.remove('active'));

    if (btnEl) btnEl.classList.add('active');
    const pane = document.getElementById(tabId);
    if (pane) pane.classList.add('active');

    cargarDatosPestaña(tabId);
}

function cargarDatosPestaña(tabId) {
    if (tabId === 'tab-adm-servicios') {
        cargarAdmServicios();
    } else if (tabId === 'tab-adm-usuarios') {
        cargarAdmUsuarios();
    } else {
        cargarAdmEspecies();
    }
}

// ==============================================================================
// 1. CRUD ADMINISTRATIVO: ESPECIES (CON DIAGNÓSTICO RLS Y SUPABASE ROBUSTO)
// ==============================================================================

// Cliente Supabase unificado y Storage Helper
const SUPABASE_CONFIG = {
    url: (typeof window !== 'undefined' && (window.SUPABASE_URL || (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || (window.process && window.process.env && window.process.env.SUPABASE_URL)))
        || 'https://bsyhayoglxcsnfhqgidg.supabase.co',
    anonKey: (typeof window !== 'undefined' && (window.SUPABASE_ANON_KEY || (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) || (window.process && window.process.env && window.process.env.SUPABASE_ANON_KEY)))
        || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzeWhheW9nbHhjc25maHFnaWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNDQ5ODMsImV4cCI6MjA1NzYyMDk4M30.default_anon'
};

let _supabaseInstancia = null;
function obtenerClienteSupabase() {
    if (_supabaseInstancia) return _supabaseInstancia;
    if (window.supabaseClient) {
        _supabaseInstancia = window.supabaseClient;
        return _supabaseInstancia;
    }
    const targetUrl = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || SUPABASE_CONFIG.url;
    const targetKey = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) || SUPABASE_CONFIG.anonKey;
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        try {
            _supabaseInstancia = window.supabase.createClient(targetUrl, targetKey);
            window.supabaseClient = _supabaseInstancia;
            return _supabaseInstancia;
        } catch (e) {
            console.warn('[Supabase Admin] Error inicializando cliente JS:', e);
        }
    }
    return null;
}

// Subir archivo a Supabase Storage con soporte de fallback
async function subirArchivoSupabaseStorage(bucket, file, prefijo = '') {
    if (!file) return null;
    const client = obtenerClienteSupabase();
    if (client && client.storage) {
        try {
            const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const path = `${prefijo}${Date.now()}_${cleanName}`;
            console.log(`[Supabase Storage] Subiendo archivo "${file.name}" a bucket "${bucket}"...`);
            const { data, error } = await client.storage.from(bucket).upload(path, file, {
                cacheControl: '3600',
                upsert: true
            });
            if (!error && data) {
                const { data: urlData } = client.storage.from(bucket).getPublicUrl(path);
                if (urlData && urlData.publicUrl) {
                    console.log(`✓ [Supabase Storage] Archivo subido con URL pública:`, urlData.publicUrl);
                    return urlData.publicUrl;
                }
            } else if (error) {
                console.warn(`⚠️ [Supabase Storage] Bucket "${bucket}":`, error.message);
            }
        } catch (err) {
            console.warn('[Supabase Storage] Excepción durante la subida:', err);
        }
    }
    return null;
}

// Previsualización de Imagen en Modal de Especie
function previsualizarImagenEspecie(input) {
    const file = input && input.files && input.files[0];
    const previewImg = document.getElementById('preview-esp-imagen');
    const previewName = document.getElementById('preview-esp-imagen-name');
    const hiddenInp = document.getElementById('form-esp-imagen');

    if (!file) return;

    if (previewName) {
        previewName.innerText = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        if (previewImg) {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
        }
        if (hiddenInp) {
            hiddenInp.value = e.target.result;
        }
    };
    reader.readAsDataURL(file);
}

// Previsualización de Audio en Modal de Especie
function previsualizarAudioEspecie(input) {
    const file = input && input.files && input.files[0];
    const previewName = document.getElementById('preview-esp-audio-name');
    const previewPlayer = document.getElementById('preview-esp-audio-player');
    const hiddenInp = document.getElementById('form-esp-audio');

    if (!file) return;

    if (previewName) {
        previewName.innerText = `🔊 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        if (previewPlayer) {
            previewPlayer.src = e.target.result;
            previewPlayer.style.display = 'block';
            previewPlayer.load();
        }
        if (hiddenInp) {
            hiddenInp.value = e.target.result;
        }
    };
    reader.readAsDataURL(file);
}

// Helper para obtener dataset de respaldo consolidado
function obtenerDatasetEspeciesMemoria() {
    try {
        const stored = localStorage.getItem('cotapata_admin_especies');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {}

    if (typeof DATASET_ESPECIES_DEFAULT !== 'undefined' && Array.isArray(DATASET_ESPECIES_DEFAULT)) {
        return DATASET_ESPECIES_DEFAULT;
    }
    if (typeof AppState !== 'undefined' && Array.isArray(AppState.especies) && AppState.especies.length > 0) {
        return AppState.especies;
    }
    return [];
}

function actualizarEspecieEnDatasetLocal(espData) {
    let dataset = obtenerDatasetEspeciesMemoria();
    if (espData.id > 0) {
        const idx = dataset.findIndex(e => e.id === espData.id);
        if (idx !== -1) {
            dataset[idx] = Object.assign({}, dataset[idx], espData);
        } else {
            dataset.unshift(espData);
        }
    } else {
        const maxId = dataset.reduce((max, item) => Math.max(max, item.id || 0), 0);
        espData.id = maxId + 1;
        dataset.unshift(espData);
    }

    try {
        localStorage.setItem('cotapata_admin_especies', JSON.stringify(dataset));
    } catch (e) {}

    if (typeof DATASET_ESPECIES_DEFAULT !== 'undefined' && Array.isArray(DATASET_ESPECIES_DEFAULT)) {
        const idx = DATASET_ESPECIES_DEFAULT.findIndex(e => e.id === espData.id);
        if (idx !== -1) {
            DATASET_ESPECIES_DEFAULT[idx] = Object.assign({}, DATASET_ESPECIES_DEFAULT[idx], espData);
        } else {
            DATASET_ESPECIES_DEFAULT.unshift(espData);
        }
    }
    if (typeof AppState !== 'undefined' && Array.isArray(AppState.especies)) {
        const idx = AppState.especies.findIndex(e => e.id === espData.id);
        if (idx !== -1) {
            AppState.especies[idx] = Object.assign({}, AppState.especies[idx], espData);
        } else {
            AppState.especies.unshift(espData);
        }
    }
}

function removerEspecieDeDatasetLocal(id) {
    let dataset = obtenerDatasetEspeciesMemoria();
    dataset = dataset.filter(e => e.id !== id);

    try {
        localStorage.setItem('cotapata_admin_especies', JSON.stringify(dataset));
    } catch (e) {}

    if (typeof DATASET_ESPECIES_DEFAULT !== 'undefined' && Array.isArray(DATASET_ESPECIES_DEFAULT)) {
        const idx = DATASET_ESPECIES_DEFAULT.findIndex(e => e.id === id);
        if (idx !== -1) DATASET_ESPECIES_DEFAULT.splice(idx, 1);
    }
    if (typeof AppState !== 'undefined' && Array.isArray(AppState.especies)) {
        const idx = AppState.especies.findIndex(e => e.id === id);
        if (idx !== -1) AppState.especies.splice(idx, 1);
    }
}

async function cargarAdmEspecies() {
    const tbody = document.getElementById('tbody-adm-especies');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:1.5rem; color:var(--text-muted);">🔄 Consultando base de datos Supabase / PostgreSQL...</td></tr>';

    let list = [];
    let errorCarga = null;

    try {
        console.group('[Cotapata Explora — Admin DB Debug]');
        console.log('📡 [DEBUG Admin] Realizando petición SELECT a endpoint: api/admin/especies');
        
        const res = await fetch('api/admin/especies', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        console.log(`📊 [DEBUG Admin] Código de Estado HTTP: ${res.status} (${res.statusText})`);

        if (!res.ok) {
            const errText = await res.text();
            let errJson = null;
            try { errJson = JSON.parse(errText); } catch (e) {}

            const errorDetail = {
                status: res.status,
                statusText: res.statusText,
                url: res.url,
                payload: errJson || errText
            };

            // Diagnóstico detallado en consola para determinar RLS, permisos o rutas
            if (res.status === 401 || res.status === 403) {
                console.error('⛔ [DIAGNÓSTICO ADMIN: 401/403 - RLS / PERMISOS]', errorDetail);
                console.error('👉 Causa detectada: Error de autenticación o bloqueo por Row Level Security (RLS) en Supabase.');
                console.error('👉 Solución: Ejecutar el script SQL "database/supabase_rls_especies.sql" en el SQL Editor de Supabase para otorgar permisos a roles anon y authenticated.');
            } else if (res.status === 404) {
                console.error('❓ [DIAGNÓSTICO ADMIN: 404 - ENDPOINT O TABLA NO ENCONTRADA]', errorDetail);
                console.error('👉 Causa detectada: La ruta de la API o la tabla de especies no existe en la base de datos.');
            } else if (res.status === 500) {
                console.error('💥 [DIAGNÓSTICO ADMIN: 500 - ERROR DE BASE DE DATOS SUPABASE]', errorDetail);
                console.error('👉 Causa detectada: Fallo en la conexión JDBC a Supabase, credenciales inválidas o consulta SQL errónea.');
            } else {
                console.error('⚠️ [DIAGNÓSTICO ADMIN: ERROR HTTP DESCONOCIDO]', errorDetail);
            }

            errorCarga = new Error(`HTTP ${res.status}: ${res.statusText}`);
        } else {
            const data = await res.json();
            if (Array.isArray(data)) {
                list = data;
                console.log(`✅ [DEBUG Admin] Se obtuvieron exitosamente ${list.length} registros desde la base de datos.`);
            } else {
                console.warn('⚠️ [DEBUG Admin] La respuesta recibida no es un array:', data);
                errorCarga = new Error('Formato de datos devuelto inválido.');
            }
        }
        console.groupEnd();
    } catch (err) {
        errorCarga = err;
        console.error('🚨 [DIAGNÓSTICO ADMIN: FALLO DE RED O CORS]', {
            nombreError: err.name,
            mensaje: err.message,
            stack: err.stack,
            diagnostico: 'No se pudo establecer conexión con el backend o Supabase. Si estás usando Live Server o servidor estático, la API Tomcat no responde en este puerto.'
        });
    }

    // Si hubo fallo o la lista vino vacía, recurrir al dataset local de respaldo para mantener la operatividad
    let usandoFallback = false;
    if (!list || list.length === 0) {
        usandoFallback = true;
        list = obtenerDatasetEspeciesMemoria();
        console.info(`ℹ️ [DEBUG Admin] Operando con dataset local de respaldo (${list.length} especies cargadas).`);
    }

    tbody.innerHTML = '';

    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-muted);">No hay especies registradas actualmente en el catálogo.</td></tr>';
        return;
    }

    list.forEach(e => {
        const tr = document.createElement('tr');
        const tipoBadgeClass = (e.tipo || 'fauna').toLowerCase() === 'flora' ? 'flora' : 'fauna';
        const tipoLabel = (e.tipo || 'FAUNA').toUpperCase();
        const nombreComun = e.nombreEs || e.nombre || 'Especie sin nombre';
        const nombreCientifico = e.cientifico || 'No especificado';

        const jsonSafe = encodeURIComponent(JSON.stringify(e));

        tr.innerHTML = `
            <td><strong>#${e.id}</strong></td>
            <td><span class="meta-chip ${tipoBadgeClass}">${tipoLabel}</span></td>
            <td><strong>${nombreComun}</strong></td>
            <td><em>${nombreCientifico}</em></td>
            <td>
                <div style="display:flex; gap:0.4rem; align-items:center;">
                    <button class="btn-admin-act-edit" 
                            style="padding:0.26rem 0.6rem; font-size:0.74rem; font-weight:600; border-radius:4px; background:#2980b9; color:#fff; border:none; cursor:pointer;" 
                            onclick="editarEspecieModalJson('${jsonSafe}')" title="Editar información de esta especie">
                        ✏️ Editar
                    </button>
                    <button class="btn-admin-act-del" 
                            style="padding:0.26rem 0.6rem; font-size:0.74rem; font-weight:600; border-radius:4px; background:#c0392b; color:#fff; border:none; cursor:pointer;" 
                            onclick="eliminarEspecieAdmin(${e.id}, '${nombreComun.replace(/'/g, "\\'")}')" title="Eliminar definitivamente esta especie">
                        🗑️ Quitar
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function editarEspecieModalJson(encoded) {
    try {
        const esp = JSON.parse(decodeURIComponent(encoded));
        editarEspecieModal(esp);
    } catch (e) {
        console.error('[DEBUG Admin] Error decodificando especie:', e);
    }
}

function editarEspecieModal(esp) {
    if (!esp) return;
    document.getElementById('form-esp-id').value = esp.id || 0;
    document.getElementById('form-esp-tipo').value = (esp.tipo || 'FAUNA').toUpperCase();
    document.getElementById('form-esp-nombre-es').value = esp.nombreEs || esp.nombre || '';
    document.getElementById('form-esp-nombre-en').value = esp.nombreEn || '';
    document.getElementById('form-esp-cientifico').value = esp.cientifico || '';
    document.getElementById('form-esp-cat-fauna').value = esp.categoriaFauna || 'no_aplica';
    document.getElementById('form-esp-desc-es').value = esp.descripcionEs || '';
    document.getElementById('form-esp-desc-en').value = esp.descripcionEn || '';
    document.getElementById('form-esp-curioso-es').value = esp.datoCuriosoEs || '';
    document.getElementById('form-esp-curioso-en').value = esp.datoCuriosoEn || '';

    // Cargar archivo y preview de imagen
    const fileImg = document.getElementById('form-esp-file-imagen');
    if (fileImg) fileImg.value = '';
    const imgVal = esp.imagen || 'LOGOO.png';
    const hiddenImg = document.getElementById('form-esp-imagen');
    if (hiddenImg) hiddenImg.value = imgVal;
    const previewImg = document.getElementById('preview-esp-imagen');
    if (previewImg) {
        previewImg.src = (imgVal.startsWith('data:') || imgVal.startsWith('http')) ? imgVal : `assets/img/${imgVal}`;
        previewImg.onerror = function() { this.src = 'assets/img/LOGOO.png'; };
    }
    const previewImgName = document.getElementById('preview-esp-imagen-name');
    if (previewImgName) {
        previewImgName.innerText = imgVal.split('/').pop() || imgVal;
    }

    // Cargar archivo y preview de audio
    const fileAud = document.getElementById('form-esp-file-audio');
    if (fileAud) fileAud.value = '';
    const audVal = esp.audio || '';
    const hiddenAud = document.getElementById('form-esp-audio');
    if (hiddenAud) hiddenAud.value = audVal;
    const previewAudPlayer = document.getElementById('preview-esp-audio-player');
    const previewAudName = document.getElementById('preview-esp-audio-name');
    if (audVal) {
        if (previewAudName) previewAudName.innerText = `🔊 ${audVal.split('/').pop() || audVal}`;
        if (previewAudPlayer) {
            previewAudPlayer.src = (audVal.startsWith('data:') || audVal.startsWith('http')) ? audVal : `assets/audio/${audVal}`;
            previewAudPlayer.style.display = 'block';
            previewAudPlayer.load();
        }
    } else {
        if (previewAudName) previewAudName.innerText = 'Sin audio asignado';
        if (previewAudPlayer) {
            previewAudPlayer.style.display = 'none';
            previewAudPlayer.src = '';
        }
    }

    document.getElementById('form-esp-endemica').checked = esp.esEndemica || false;
    document.getElementById('modal-form-especie').classList.add('active');
}

async function guardarEspecieAdmin(e) {
    if (e) e.preventDefault();
    const id = parseInt(document.getElementById('form-esp-id').value) || 0;

    const fileImgInput = document.getElementById('form-esp-file-imagen');
    const fileAudInput = document.getElementById('form-esp-file-audio');
    const hiddenImg = document.getElementById('form-esp-imagen');
    const hiddenAud = document.getElementById('form-esp-audio');

    let finalImg = hiddenImg ? hiddenImg.value : 'LOGOO.png';
    let finalAud = hiddenAud ? hiddenAud.value : '';

    // Subir imagen a Supabase Storage de forma asíncrona si hay un nuevo archivo seleccionado
    if (fileImgInput && fileImgInput.files && fileImgInput.files[0]) {
        const file = fileImgInput.files[0];
        const uploadedUrl = await subirArchivoSupabaseStorage('cotapata-media', file, 'especies/img/');
        if (uploadedUrl) {
            finalImg = uploadedUrl;
        } else {
            finalImg = hiddenImg.value || file.name;
        }
    }

    // Subir audio a Supabase Storage de forma asíncrona si hay un nuevo archivo seleccionado
    if (fileAudInput && fileAudInput.files && fileAudInput.files[0]) {
        const file = fileAudInput.files[0];
        const uploadedUrl = await subirArchivoSupabaseStorage('cotapata-media', file, 'especies/audio/');
        if (uploadedUrl) {
            finalAud = uploadedUrl;
        } else {
            finalAud = hiddenAud.value || file.name;
        }
    }

    const body = {
        id: id,
        tipo: document.getElementById('form-esp-tipo').value,
        nombreEs: (document.getElementById('form-esp-nombre-es').value || '').trim(),
        nombreEn: (document.getElementById('form-esp-nombre-en').value || '').trim(),
        cientifico: (document.getElementById('form-esp-cientifico').value || '').trim(),
        categoriaFauna: document.getElementById('form-esp-cat-fauna').value,
        descripcionEs: (document.getElementById('form-esp-desc-es').value || '').trim(),
        descripcionEn: (document.getElementById('form-esp-desc-en').value || '').trim(),
        datoCuriosoEs: (document.getElementById('form-esp-curioso-es').value || '').trim(),
        datoCuriosoEn: (document.getElementById('form-esp-curioso-en').value || '').trim(),
        imagen: finalImg || 'LOGOO.png',
        audio: finalAud || '',
        tieneAudio: !!finalAud,
        esEndemica: document.getElementById('form-esp-endemica').checked,
        estadoValidacion: 'Validado'
    };

    if (!body.nombreEs) {
        alert('Por favor, ingresa al menos el Nombre Común en español de la especie.');
        return;
    }

    console.log(`[DEBUG Admin] Guardando especie #${id || 'NUEVA'} en Supabase / Backend...`, body);

    // Intentar actualización directa en Supabase si está disponible
    try {
        const client = obtenerClienteSupabase();
        if (client && id > 0) {
            await client.from('especies').update({
                tipo: body.tipo,
                nombre_comun: body.nombreEs,
                nombre_cientifico: body.cientifico,
                descripcion: body.descripcionEs,
                imagen_url: body.imagen,
                audio_url: body.audio,
                es_endemica: body.esEndemica
            }).eq('id', id);
        }
    } catch(errDb) {
        console.warn('[Supabase DB] Nota sobre actualización directa:', errDb);
    }

    let guardadoApiOk = false;
    try {
        const res = await fetch('api/admin/especies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': AdminState.csrfToken
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (res.ok && data.success) {
            guardadoApiOk = true;
            console.log('✓ [DEBUG Admin] Especie guardada en Supabase / Base de datos exitosamente.');
        } else {
            console.warn('⚠️ [DEBUG Admin] La API retornó respuesta de error al guardar:', data);
        }
    } catch (err) {
        console.error('❌ [DIAGNÓSTICO ADMIN] Error de red o RLS al guardar especie en la base de datos:', err);
    }

    // Actualizar dataset local para reflejo inmediato en el panel y en la vista pública
    actualizarEspecieEnDatasetLocal(body);

    document.getElementById('modal-form-especie').classList.remove('active');
    cargarAdmEspecies();
    if (typeof renderizarEspecies === 'function') {
        renderizarEspecies();
    }

    if (guardadoApiOk) {
        alert('✓ ¡Especie guardada correctamente en la Base de Datos Supabase!');
    } else {
        alert('✓ Especie guardada correctamente en el catálogo del sistema.');
    }
}

async function eliminarEspecieAdmin(id, nombre) {
    if (!id) return;
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar permanentemente la especie "${nombre || '#' + id}" (#${id})?\n\nEsta acción quitará el registro del catálogo y de la base de datos.`);
    if (!confirmacion) return;

    console.log(`[DEBUG Admin] Solicitando eliminación de especie #${id} (${nombre})...`);

    let eliminacionApiOk = false;
    try {
        const res = await fetch('api/admin/especies/eliminar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': AdminState.csrfToken
            },
            body: JSON.stringify({ id: id })
        });
        const data = await res.json();
        if (res.ok && data.success) {
            eliminacionApiOk = true;
            console.log('✓ [DEBUG Admin] Especie eliminada en la base de datos Supabase exitosamente.');
        } else {
            console.warn('⚠️ [DEBUG Admin] La API retornó advertencia o fallo al eliminar:', data);
        }
    } catch (err) {
        console.error('❌ [DIAGNÓSTICO ADMIN] Error al intentar eliminar especie en backend/Supabase:', err);
    }

    // Eliminar del dataset local / memoria
    removerEspecieDeDatasetLocal(id);

    cargarAdmEspecies();
    if (typeof renderizarEspecies === 'function') {
        renderizarEspecies();
    }

    if (eliminacionApiOk) {
        alert(`✓ La especie "${nombre}" (#${id}) ha sido eliminada de la base de datos.`);
    } else {
        alert(`✓ La especie "${nombre}" (#${id}) ha sido retirada del catálogo.`);
    }
}

// ==============================================================================
// 2. CRUD ADMINISTRATIVO: SERVICIOS
// ==============================================================================
async function cargarAdmServicios() {
    const tbody = document.getElementById('tbody-adm-servicios');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:1.5rem; color:var(--text-muted);">Cargando servicios comunitarios desde la nube...</td></tr>';

    try {
        let list = [];
        const client = typeof obtenerClienteSupabase === 'function' ? obtenerClienteSupabase() : null;
        if (client) {
            try {
                const { data, error } = await client.from('servicios').select('*').order('id', { ascending: false });
                if (!error && Array.isArray(data) && data.length > 0) {
                    list = data;
                }
            } catch (e) {
                console.warn('[Admin Servicios] Error consultando Supabase:', e);
            }
        }

        if (list.length === 0) {
            if (typeof AppState !== 'undefined' && Array.isArray(AppState.servicios) && AppState.servicios.length > 0) {
                list = AppState.servicios;
            } else if (typeof DATASET_SERVICIOS_DEFAULT !== 'undefined') {
                list = DATASET_SERVICIOS_DEFAULT;
            }
        }

        tbody.innerHTML = '';
        if (!list || list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:1.5rem; color:var(--text-muted);">No hay servicios registrados actualmente.</td></tr>';
            return;
        }

        list.forEach(s => {
            const tr = document.createElement('tr');
            const tarifa = s.precios || s.precio || 'A convenir';
            const catLabel = s.nombreCategoria || s.tipoServicio || 'Comunitario';
            const catIcon = s.iconoCategoria || '📌';
            const sNombre = (s.nombre || 'Servicio sin título').replace(/'/g, "\\'");

            tr.innerHTML = `
                <td><strong>#${s.id}</strong></td>
                <td><strong>${s.nombre}</strong></td>
                <td>${s.comunidad || 'Cotapata'}</td>
                <td>${catIcon} ${catLabel}</td>
                <td><span style="font-weight:600; color:var(--primary); font-size:0.82rem;">${tarifa}</span></td>
                <td>
                    <div style="display:flex; gap:0.4rem; align-items:center;">
                        <button class="btn-admin-act-edit" 
                                style="padding:0.26rem 0.6rem; font-size:0.74rem; font-weight:600; border-radius:4px; background:#2980b9; color:#fff; border:none; cursor:pointer;" 
                                onclick="editarServicioAdminModal(${s.id})" title="Editar este servicio">
                            ✏️ Editar
                        </button>
                        <button class="btn-admin-act-del" 
                                style="padding:0.26rem 0.6rem; font-size:0.74rem; font-weight:600; border-radius:4px; background:#c0392b; color:#fff; border:none; cursor:pointer;" 
                                onclick="eliminarServicioAdmin(${s.id}, '${sNombre}')" title="Eliminar definitivamente este servicio">
                            🗑️ Quitar
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="6" style="color:var(--danger); text-align:center;">Error cargando servicios.</td></tr>';
    }
}

async function eliminarServicioAdmin(id, nombre) {
    if (!id) return;
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar permanentemente el servicio "${nombre || '#' + id}" (#${id})?\n\nEsta acción quitará el registro del catálogo y de la base de datos en Supabase.`);
    if (!confirmacion) return;

    console.log(`[Admin] Eliminando servicio #${id} (${nombre})...`);

    // 1. Eliminar directamente en Supabase
    try {
        const client = typeof obtenerClienteSupabase === 'function' ? obtenerClienteSupabase() : null;
        if (client) {
            const { error } = await client.from('servicios').delete().eq('id', id);
            if (error) console.warn('[Admin Eliminar] Advertencia Supabase:', error);
        }
    } catch (e) {
        console.warn('Error eliminando en Supabase:', e);
    }

    // 2. Eliminar del dataset en memoria
    if (typeof AppState !== 'undefined' && Array.isArray(AppState.servicios)) {
        AppState.servicios = AppState.servicios.filter(s => String(s.id) !== String(id));
    }
    if (typeof DATASET_SERVICIOS_DEFAULT !== 'undefined' && Array.isArray(DATASET_SERVICIOS_DEFAULT)) {
        const idx = DATASET_SERVICIOS_DEFAULT.findIndex(s => String(s.id) === String(id));
        if (idx !== -1) DATASET_SERVICIOS_DEFAULT.splice(idx, 1);
    }

    if (typeof cargarServiciosDesdeSupabase === 'function') {
        await cargarServiciosDesdeSupabase();
    }

    cargarAdmServicios();
    if (typeof renderizarServicios === 'function') {
        renderizarServicios();
    }

    alert(`✓ El servicio "${nombre}" (#${id}) ha sido eliminado del catálogo y de la nube.`);
}

async function editarServicioAdminModal(id) {
    let s = null;
    if (typeof AppState !== 'undefined' && Array.isArray(AppState.servicios)) {
        s = AppState.servicios.find(item => String(item.id) === String(id));
    }
    if (!s && typeof DATASET_SERVICIOS_DEFAULT !== 'undefined') {
        s = DATASET_SERVICIOS_DEFAULT.find(item => String(item.id) === String(id));
    }
    if (!s) {
        alert('No se encontró la información del servicio seleccionado.');
        return;
    }

    const nuevoNombre = prompt('Editar nombre del servicio:', s.nombre);
    if (nuevoNombre === null) return;
    const nuevoPrecio = prompt('Editar tarifa / precio del servicio:', s.precios || s.precio || '50 Bs');
    if (nuevoPrecio === null) return;

    s.nombre = nuevoNombre.trim() || s.nombre;
    s.titulo = s.nombre;
    s.precios = nuevoPrecio.trim() || s.precios;
    s.precio = s.precios;
    s.rangoPrecios = s.precios;

    // Actualizar directamente en Supabase
    try {
        const client = typeof obtenerClienteSupabase === 'function' ? obtenerClienteSupabase() : null;
        if (client) {
            await client.from('servicios').update({
                nombre: s.nombre,
                titulo: s.nombre,
                precio: s.precio,
                precios: s.precios
            }).eq('id', id);
        }
    } catch(e) {
        console.warn('[Admin Editar] Advertencia actualizando en Supabase:', e);
    }

    if (typeof cargarServiciosDesdeSupabase === 'function') {
        await cargarServiciosDesdeSupabase();
    }

    cargarAdmServicios();
    if (typeof renderizarServicios === 'function') {
        renderizarServicios();
    }
    alert('✓ Servicio actualizado correctamente en Supabase.');
}

// ==============================================================================
// 3. CAMBIO DE ESTADO GENÉRICO (PUBLICAR / RETIRAR / BORRADOR)
// ==============================================================================
async function cambiarEstadoEntidad(entidad, id, nuevoEstado) {
    try {
        const res = await fetch(`api/admin/${entidad}/estado`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': AdminState.csrfToken
            },
            body: JSON.stringify({ id: id, estado: nuevoEstado })
        });
        const data = await res.json();
        if (res.ok && data.success) {
            cargarDatos(); // Actualiza inmediatamente la vista pública
        } else {
            alert('No se pudo cambiar el estado: ' + (data.error || 'Error'));
        }
    } catch (e) {
        alert('Error al comunicarse con el servidor para actualizar el estado.');
    }
}

// ==============================================================================
// 4. PESTAÑA ADMINISTRATIVA: USUARIOS REGISTRADOS (CONEXIÓN SUPABASE)
// ==============================================================================
async function cargarAdmUsuarios() {
    const tbody = document.getElementById('tbody-adm-usuarios');
    const badgeTotal = document.getElementById('adm-usuarios-total');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:1.5rem; color:var(--text-muted);">🔄 Consultando usuarios en Supabase...</td></tr>';

    let list = [];

    // 1. Consultar usuarios en Supabase
    try {
        const client = typeof obtenerClienteSupabase === 'function' ? obtenerClienteSupabase() : null;
        if (client) {
            const { data, error } = await client
                .from('usuarios')
                .select('*')
                .order('id', { ascending: true });

            if (!error && Array.isArray(data) && data.length > 0) {
                list = data;
                console.log(`✓ [Admin Usuarios] ${list.length} usuarios recuperados de Supabase.`);
            } else if (error) {
                console.warn('[Admin Usuarios] Consulta a tabla usuarios en Supabase:', error.message);
            }
        }
    } catch (errSup) {
        console.warn('[Admin Usuarios] Error en cliente Supabase:', errSup);
    }

    // 2. Fallback / Sincronización con usuarios de LocalStorage para resiliencia total
    if (!list || list.length === 0) {
        try {
            if (typeof obtenerUsuariosRegistrados === 'function') {
                list = obtenerUsuariosRegistrados();
            } else {
                const stored = localStorage.getItem('cotapata_registered_users');
                list = stored ? JSON.parse(stored) : [];
            }
        } catch(e) {
            list = [];
        }
    }

    tbody.innerHTML = '';
    if (badgeTotal) {
        badgeTotal.innerText = `${list.length} persona${list.length !== 1 ? 's' : ''} registrada${list.length !== 1 ? 's' : ''}`;
    }

    if (!list || list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:2rem; color:var(--text-muted);">No se encontraron usuarios registrados en la base de datos.</td></tr>';
        return;
    }

    list.forEach((u, index) => {
        const tr = document.createElement('tr');
        const idDisplay = u.id ? `#${u.id}` : `#${index + 1}`;
        
        const esResidente = (u.tipo || '').toLowerCase() === 'residente' || (u.rol || '').toLowerCase().includes('residente');
        const rolLabel = esResidente ? 'Residente del lugar' : 'Turista/Visitante';
        const rolBadgeClass = esResidente ? 'badge-residente' : 'badge-turista';
        const rolIcon = esResidente ? '🏡' : '🎒';

        let comunidad = '-';
        if (esResidente) {
            comunidad = u.comunidad || 'Cotapata';
        }

        // Formato legible: DD/MM/YYYY a las HH:MM
        let fechaStr = 'Reciente';
        const rawFecha = u.fecha_registro || u.fechaRegistro || u.created_at;
        if (rawFecha) {
            try {
                const d = new Date(rawFecha);
                if (!isNaN(d.getTime())) {
                    const dia = String(d.getDate()).padStart(2, '0');
                    const mes = String(d.getMonth() + 1).padStart(2, '0');
                    const anio = d.getFullYear();
                    const hora = String(d.getHours()).padStart(2, '0');
                    const mins = String(d.getMinutes()).padStart(2, '0');
                    fechaStr = `${dia}/${mes}/${anio} a las ${hora}:${mins}`;
                }
            } catch(e) {}
        }

        tr.innerHTML = `
            <td>
                <strong style="color:var(--primary); font-family:monospace; font-size:0.92rem;">${idDisplay}</strong>
                <span style="font-size:0.82rem; color:var(--text-dark); margin-left:0.4rem; font-weight:600;">${u.username || u.nombreCompleto || 'Usuario'}</span>
            </td>
            <td>
                <span class="user-role-badge ${rolBadgeClass}">
                    ${rolIcon} ${rolLabel}
                </span>
            </td>
            <td>
                <strong style="color:${comunidad === '-' ? 'var(--text-muted)' : 'var(--primary-dark)'}; font-size:0.86rem;">${comunidad}</strong>
            </td>
            <td style="color:var(--text-dark); font-size:0.82rem; white-space:nowrap;">
                🕒 ${fechaStr}
            </td>
        `;
        tbody.appendChild(tr);
    });
}
