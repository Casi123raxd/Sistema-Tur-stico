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
        AdminState.autenticado = false;
        actualizarUIAdminDeslogueado();
    }
}

function abrirModalAdmin() {
    if (AdminState.autenticado) {
        document.getElementById('modal-admin-panel').classList.add('active');
        cargarDatosPestaña(AdminState.pestañaActiva);
    } else {
        document.getElementById('modal-login').classList.add('active');
    }
}

function cerrarModalAdmin() {
    document.getElementById('modal-admin-panel').classList.remove('active');
    document.getElementById('modal-login').classList.remove('active');
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
    const userInp = document.getElementById('login-username');
    const passInp = document.getElementById('login-password');
    const errEl = document.getElementById('login-error');
    if (errEl) errEl.style.display = 'none';

    try {
        const res = await fetch('api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: userInp.value,
                password: passInp.value
            })
        });

        const data = await res.json();
        if (res.ok && data.success) {
            AdminState.autenticado = true;
            AdminState.usuario = data.usuario;
            AdminState.csrfToken = data.csrfToken;
            userInp.value = '';
            passInp.value = '';
            document.getElementById('modal-login').classList.remove('active');
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
    switch (tabId) {
        case 'tab-adm-especies':
            cargarAdmEspecies();
            break;
        case 'tab-adm-servicios':
            cargarAdmServicios();
            break;
        case 'tab-adm-atractivos':
            cargarAdmAtractivos();
            break;
        case 'tab-adm-rutas':
            cargarAdmRutas();
            break;
        case 'tab-adm-recomendaciones':
            cargarAdmRecomendaciones();
            break;
        case 'tab-adm-autorizaciones':
            cargarAdmAutorizaciones();
            break;
        case 'tab-adm-metricas':
            cargarAdmMetricas();
            break;
    }
}

// ==============================================================================
// 1. CRUD ADMINISTRATIVO: ESPECIES
// ==============================================================================
async function cargarAdmEspecies() {
    const tbody = document.getElementById('tbody-adm-especies');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Cargando especies...</td></tr>';

    try {
        const res = await fetch('api/admin/especies');
        const list = await res.json();
        tbody.innerHTML = '';

        list.forEach(e => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>#${e.id}</strong></td>
                <td><span class="meta-chip ${e.tipo}">${e.tipo.toUpperCase()}</span></td>
                <td>${e.nombreEs}</td>
                <td><em>${e.cientifico || ''}</em></td>
                <td>
                    <select class="form-control" style="padding:0.25rem 0.5rem; font-size:0.75rem;" 
                            onchange="cambiarEstadoEntidad('especies', ${e.id}, this.value)">
                        <option value="Validado" ${e.estadoValidacion === 'Validado' ? 'selected' : ''}>Validado</option>
                        <option value="Pendiente" ${e.estadoValidacion === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="Borrador" ${e.estadoValidacion === 'Borrador' ? 'selected' : ''}>Borrador</option>
                        <option value="Retirado" ${e.estadoValidacion === 'Retirado' ? 'selected' : ''}>Retirado</option>
                    </select>
                </td>
                <td>
                    <button class="btn-audio-ctrl" style="padding:0.25rem 0.5rem; font-size:0.72rem;" onclick="editarEspecieModal(${JSON.stringify(e).replace(/"/g, '&quot;')})">✏️ Editar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="6" style="color:var(--danger); text-align:center;">Error cargando especies.</td></tr>';
    }
}

function abrirFormularioEspecie() {
    document.getElementById('form-esp-id').value = '0';
    document.getElementById('form-esp-tipo').value = 'FAUNA';
    document.getElementById('form-esp-nombre-es').value = '';
    document.getElementById('form-esp-nombre-en').value = '';
    document.getElementById('form-esp-cientifico').value = '';
    document.getElementById('form-esp-cat-fauna').value = 'mamifero';
    document.getElementById('form-esp-desc-es').value = '';
    document.getElementById('form-esp-desc-en').value = '';
    document.getElementById('form-esp-curioso-es').value = '';
    document.getElementById('form-esp-curioso-en').value = '';
    document.getElementById('form-esp-imagen').value = 'LOGOO.png';
    document.getElementById('form-esp-audio').value = '';
    document.getElementById('form-esp-endemica').checked = false;
    document.getElementById('modal-form-especie').classList.add('active');
}

function editarEspecieModal(esp) {
    document.getElementById('form-esp-id').value = esp.id;
    document.getElementById('form-esp-tipo').value = esp.tipo.toUpperCase();
    document.getElementById('form-esp-nombre-es').value = esp.nombreEs || '';
    document.getElementById('form-esp-nombre-en').value = esp.nombreEn || '';
    document.getElementById('form-esp-cientifico').value = esp.cientifico || '';
    document.getElementById('form-esp-cat-fauna').value = esp.categoriaFauna || 'no_aplica';
    document.getElementById('form-esp-desc-es').value = esp.descripcionEs || '';
    document.getElementById('form-esp-desc-en').value = esp.descripcionEn || '';
    document.getElementById('form-esp-curioso-es').value = esp.datoCuriosoEs || '';
    document.getElementById('form-esp-curioso-en').value = esp.datoCuriosoEn || '';
    document.getElementById('form-esp-imagen').value = esp.imagen || 'LOGOO.png';
    document.getElementById('form-esp-audio').value = esp.audio || '';
    document.getElementById('form-esp-endemica').checked = esp.esEndemica || false;
    document.getElementById('modal-form-especie').classList.add('active');
}

async function guardarEspecieAdmin(e) {
    if (e) e.preventDefault();
    const id = parseInt(document.getElementById('form-esp-id').value) || 0;
    const body = {
        id: id,
        tipo: document.getElementById('form-esp-tipo').value,
        nombreEs: document.getElementById('form-esp-nombre-es').value,
        nombreEn: document.getElementById('form-esp-nombre-en').value,
        cientifico: document.getElementById('form-esp-cientifico').value,
        categoriaFauna: document.getElementById('form-esp-cat-fauna').value,
        descripcionEs: document.getElementById('form-esp-desc-es').value,
        descripcionEn: document.getElementById('form-esp-desc-en').value,
        datoCuriosoEs: document.getElementById('form-esp-curioso-es').value,
        datoCuriosoEn: document.getElementById('form-esp-curioso-en').value,
        imagen: document.getElementById('form-esp-imagen').value,
        audio: document.getElementById('form-esp-audio').value,
        esEndemica: document.getElementById('form-esp-endemica').checked,
        estadoValidacion: 'Validado'
    };

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
            alert('¡Especie guardada correctamente en la base de datos MySQL!');
            document.getElementById('modal-form-especie').classList.remove('active');
            cargarAdmEspecies();
            cargarDatos(); // refresca datos públicos
        } else {
            alert('Error al guardar: ' + (data.error || 'Respuesta inválida'));
        }
    } catch (err) {
        alert('Error de conexión al guardar la especie.');
    }
}

// ==============================================================================
// 2. CRUD ADMINISTRATIVO: SERVICIOS
// ==============================================================================
async function cargarAdmServicios() {
    const tbody = document.getElementById('tbody-adm-servicios');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Cargando servicios...</td></tr>';

    try {
        const res = await fetch('api/admin/servicios');
        const list = await res.json();
        tbody.innerHTML = '';

        list.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>#${s.id}</strong></td>
                <td>${s.nombre}</td>
                <td>${s.comunidad}</td>
                <td>${s.iconoCategoria || ''} ${s.nombreCategoria || ''}</td>
                <td>
                    <select class="form-control" style="padding:0.25rem 0.5rem; font-size:0.75rem;" 
                            onchange="cambiarEstadoEntidad('servicios', ${s.id}, this.value)">
                        <option value="Validado" ${s.estadoValidacion === 'Validado' ? 'selected' : ''}>Validado</option>
                        <option value="Pendiente" ${s.estadoValidacion === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="Borrador" ${s.estadoValidacion === 'Borrador' ? 'selected' : ''}>Borrador</option>
                        <option value="Retirado" ${s.estadoValidacion === 'Retirado' ? 'selected' : ''}>Retirado</option>
                    </select>
                </td>
                <td>
                    <span style="font-size:0.75rem; color:var(--success); font-weight:700;">✓ Autorizado</span>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="6" style="color:var(--danger); text-align:center;">Error cargando servicios.</td></tr>';
    }
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
// 4. AUTORIZACIONES COMUNITARIAS Y MÉTRICAS
// ==============================================================================
async function cargarAdmAutorizaciones() {
    const tbody = document.getElementById('tbody-adm-autorizaciones');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Cargando autorizaciones...</td></tr>';

    try {
        const res = await fetch('api/admin/autorizaciones');
        const list = await res.json();
        tbody.innerHTML = '';

        list.forEach(a => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><code>${a.codigo}</code></td>
                <td><strong>${a.tipoEntidad}</strong></td>
                <td>${a.otorgadoPor}</td>
                <td>${a.comunidad}</td>
                <td>${a.fechaAutorizacion}</td>
                <td><span class="status-badge ${a.vigente ? 'Validado' : 'Retirado'}">${a.vigente ? 'Vigente' : 'Inactiva'}</span></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="6" style="color:var(--danger); text-align:center;">Error cargando autorizaciones.</td></tr>';
    }
}

async function cargarAdmMetricas() {
    const statsContainer = document.getElementById('adm-metricas-content');
    if (!statsContainer) return;
    statsContainer.innerHTML = '<p style="text-align:center;">Calculando indicadores agregados...</p>';

    try {
        const res = await fetch('api/admin/metricas');
        const data = await res.json();

        let catHtml = '';
        if (data.consultasPorCategoria && Array.isArray(data.consultasPorCategoria)) {
            data.consultasPorCategoria.forEach(c => {
                catHtml += `<li><strong>${c.categoria}:</strong> ${c.total} consultas anónimas</li>`;
            });
        }

        let topHtml = '';
        if (data.topRecursos && Array.isArray(data.topRecursos)) {
            data.topRecursos.forEach(r => {
                topHtml += `<li><strong>${r.nombre}</strong> (${r.tipo}): ${r.visitas} consultas</li>`;
            });
        }

        statsContainer.innerHTML = `
            <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:1rem;">
                <div class="card-item" style="padding:1.2rem;">
                    <h4 style="color:var(--primary); margin-bottom:0.6rem;">📊 Consultas por Categoría</h4>
                    <ul style="padding-left:1.2rem; font-size:0.85rem; line-height:1.7;">
                        ${catHtml || '<li>Sin registros aún</li>'}
                    </ul>
                </div>
                <div class="card-item" style="padding:1.2rem;">
                    <h4 style="color:var(--primary); margin-bottom:0.6rem;">⭐ Recursos Más Populares</h4>
                    <ul style="padding-left:1.2rem; font-size:0.85rem; line-height:1.7;">
                        ${topHtml || '<li>Sin registros aún</li>'}
                    </ul>
                </div>
            </div>
            <div class="rule-tip" style="margin-top:1rem; font-size:0.8rem;">
                🔒 <strong>Privacidad Ética Garantizada:</strong> El sistema no almacena nombres, números de carnet de identidad ni números de teléfono de visitantes, cumpliendo estrictamente con los lineamientos del SERNAP y la ética salesiana del proyecto.
            </div>
        `;
    } catch (err) {
        statsContainer.innerHTML = '<p style="color:var(--danger);">Error al cargar las métricas del sistema.</p>';
    }
}
