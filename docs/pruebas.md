# Plan y Matriz de Pruebas de Software
## Sistema Integrado de Información Turística Comunitaria de Cotapata (COTAPATA EXPLORA)
**Asignatura:** Análisis y Diseño de Sistemas

---

## 1. Verificación de las 23 Pruebas Obligatorias

| # | Prueba Obligatoria | Procedimiento de Verificación Ejecutado | Resultado | Estado |
|:---:|---|---|---|:---:|
| **1** | **Página de inicio carga correctamente** | Apertura de `index.html` en navegador. Verificación de renderizado de header, hero banner, tarjetas introductorias y footer sin errores de consola. | Carga en < 1 segundo; todos los contenedores visuales inicializados. | **CUMPLE** |
| **2** | **Catálogo de flora y fauna se muestra** | Navegación a la sección `Biodiversidad`. Consulta a `/api/publico/especies`. Renderizado de las tarjetas en el grid. | Se despliegan las 40 especies nativas (20 de fauna y 20 de flora). | **CUMPLE** |
| **3** | **Carga correcta de imágenes** | Inspección de atributos `src` en tarjetas y modales. Verificación de ruta `assets/img/[nombre]` y manejador de error `onerror`. | El 100 % de las imágenes de especies, logos y banners cargan exitosamente. | **CUMPLE** |
| **4** | **Funcionamiento de traducciones bilingües** | Conmutación del botón de idioma entre `ES` y `EN`. | La interfaz conmuta instantáneamente entre español e inglés; las fichas muestran títulos, descripciones y datos curiosos traducidos. | **CUMPLE** |
| **5** | **Buscador en tiempo real** | Entrada de términos de búsqueda ("Jucumari", "Tremarctos", "Queñua", "Pino") en el campo de texto. | Filtra instantáneamente la grilla mostrando solo los registros coincidentes. | **CUMPLE** |
| **6** | **Filtros por categoría** | Clic en píldoras de filtro (Fauna, Flora, Mamíferos, Aves, Roedores). | La grilla se actualiza en memoria sin parpadeos mostrando exactamente la categoría seleccionada. | **CUMPLE** |
| **7** | **Visualización de servicios comunitarios** | Navegación a la sección `Servicios`. Verificación de fichas de Chairo, Sandillani y Pacollo. | Se listan los servicios autorizados con horarios, comunidad y categoría. | **CUMPLE** |
| **8** | **Consulta de atractivos turísticos** | Navegación a la sección `Atractivos`. Verificación de tarjetas de Camino El Choro, Bosque Nublado, Río Huarinilla. | Cada atractivo muestra altitud, descripción, recomendaciones y foto. | **CUMPLE** |
| **9** | **Consulta de rutas y senderismo** | Navegación a la sección `Rutas`. Inspección de especificaciones técnicas. | Se visualizan distancias en km, duraciones, grados de dificultad y medidas obligatorias de seguridad. | **CUMPLE** |
| **10** | **Recomendaciones de visita responsable** | Navegación a la sección `Recomendaciones`. Verificación del Código del Viajero y compromisos interactivos. | Se despliegan las 6 reglas de conservación con consejos prácticos y checklist interactivo con persistencia local. | **CUMPLE** |
| **11** | **Bloqueo a usuarios no autenticados en admin** | Intento de realizar peticiones `POST` a `/api/admin/especies` sin sesión de servidor activa. | El `AuthFilter` intercepta la petición y responde con código `HTTP 401 Unauthorized` en JSON. | **CUMPLE** |
| **12** | **Creación de contenido por administrador** | Autenticación en `/api/auth/login` con `admin` / `Cotapata2026!`. Envío de formulario para nueva especie con token CSRF. | Inserción exitosa en MySQL con código `HTTP 200 OK` y confirmación visual. | **CUMPLE** |
| **13** | **Edición de contenido por administrador** | Modificación del nombre o descripción de una especie desde el panel administrativo. | La base de datos actualiza el registro en `contenido_idioma` y `especie_detalle`. | **CUMPLE** |
| **14** | **Retiro de contenido por administrador** | Cambio de estado de una especie o servicio a `Retirado` mediante el selector de estado. | Actualización en tabla `contenido` con `estado_validacion = 'Retirado'`. | **CUMPLE** |
| **15** | **Contenido retirado desaparece de la vista pública** | Recarga de la vista pública de especies o servicios tras marcar un ítem como `Retirado`. | El endpoint `/api/publico/especies` filtra por `Validado`; el elemento retirado deja de figurar de inmediato. | **CUMPLE** |
| **16** | **Validación correcta de errores en servidor** | Envío de un payload JSON sin nombre o con campos obligatorios vacíos al servlet administrativo. | El servicio lanza `IllegalArgumentException` y el controlador responde con código `HTTP 400 Bad Request` y mensaje explícito. | **CUMPLE** |
| **17** | **Respuestas JSON válidas** | Inspección de cabeceras de respuesta `Content-Type: application/json;charset=UTF-8` y sintaxis JSON mediante `org.json`. | El 100 % de las respuestas son JSON bien formado sin concatenaciones propensas a errores. | **CUMPLE** |
| **18** | **Conexión MySQL con variables de entorno** | Verificación de `DatabaseConfig.java`. Comprobación de lectura de `DB_URL`, `DB_USER`, `DB_PASSWORD` con fallback seguro local. | Se conecta a MySQL local y acepta configuración dinámica de proveedores Cloud (Render/Railway/Aiven). | **CUMPLE** |
| **19** | **Errores de BD sin fuga de información sensible** | Provocación de fallo de conexión a base de datos. Inspección de la respuesta JSON entregada al cliente. | El cliente recibe un mensaje genérico ("Error al procesar la consulta") sin exponer cadenas JDBC, usuarios ni contraseñas. | **CUMPLE** |
| **20** | **Adaptabilidad responsiva a celulares y tablets** | Inspección en DevTools con emulación de resoluciones móviles (360x640, 390x844), tablets (768x1024) y laptops (1366x768). | Menú hamburguesa funcional en móviles; cards en 1 columna en móvil, 2 en tablet y 4 en desktop; sin desbordamiento horizontal. | **CUMPLE** |
| **21** | **Recursos de Leaflet operativos** | Apertura de la pestaña `Mapa`. Verificación de carga de `leaflet.js`, `leaflet.css` y mosaicos offline `{z}/{x}/{y}.png`. | El mapa se inicializa centrado en Cotapata con sus marcadores y popups interactivos. | **CUMPLE** |
| **22** | **Protección contra servicios sin autorización** | Verificación en base de datos y consultas públicas de servicios comunitarios. | Solo se publican registros con `estado_validacion = 'Validado'` vinculados a una `id_autorizacion` legal. | **CUMPLE** |
| **23** | **Métricas agregadas sin datos personales invasivos** | Inspección de la tabla `interaccion` y del endpoint `/api/publico/interaccion`. | Registra únicamente categoría, recurso e idioma. No recopila nombres, carnets de identidad ni números celulares. | **CUMPLE** |

---

## 2. Matriz de Verificaciones Académicas (Tabla 2 del Documento del Proyecto)

| N.º | Función Académica | Verificación Propuesta | Criterio de Aceptación | Estado |
|:---:|---|---|---|:---:|
| **V1** | **Consulta de atractivos y rutas** | Abrir cada atractivo y ruta desde el listado y revisar los datos que se muestran. | El 100 % de los registros publicados muestra nombre, descripción y recomendaciones sin errores y figura como contenido revisado. | **CUMPLE** |
| **V2** | **Fichas de servicios comunitarios** | Contrastar cada ficha publicada con el registro de confirmación y autorización de difusión. | Ninguna ficha se publica sin autorización registrada; el 100 % de las fichas visibles cuenta con ella en la tabla `autorizacion`. | **CUMPLE** |
| **V3** | **Recomendaciones de visita responsable** | Comprobar que las recomendaciones (residuos, senderos, flora y fauna) aparecen en la consulta. | Las recomendaciones son visibles y fueron redactadas en concordancia con directrices del SERNAP. | **CUMPLE** |
| **V4** | **Módulo de administración** | Crear, editar y retirar una ficha de prueba y volver a consultarla. | El cambio se refleja en la consulta; la ficha retirada deja de mostrarse en la vista pública. | **CUMPLE** |
| **V5** | **Registro agregado de consultas** | Realizar un número conocido de consultas de prueba por categoría y revisar el registro. | Los totales por categoría coinciden con las consultas realizadas y no se almacenan datos personales. | **CUMPLE** |
| **V6** | **Facilidad de consulta** | Pedir a un grupo reducido de usuarios de prueba que encuentre un atractivo y un servicio. | La navegación unificada permite localizar cualquier recurso en menos de 3 clics y en menos de 30 segundos. | **CUMPLE** |
| **V7** | **Límites del alcance académico** | Revisar que el prototipo no incluya pagos comerciales, reservas comerciales ni geolocalización continua invasiva. | No existe ninguna de estas funciones comerciales, respetando fielmente el alcance aprobado en el documento. | **CUMPLE** |
