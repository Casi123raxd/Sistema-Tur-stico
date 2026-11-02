# Especificación de Requisitos del Sistema
## Sistema Integrado de Información Turística Comunitaria de Cotapata (COTAPATA EXPLORA)
**Asignatura:** Análisis y Diseño de Sistemas

---

## 1. Identificación de Actores del Sistema

| Actor | Tipo | Descripción y Rol en el Sistema |
|---|---|---|
| **Visitante / Turista** | Usuario Final (Público) | Persona que accede a la plataforma para consultar información sobre biodiversidad, servicios comunitarios, atractivos, rutas y recomendaciones de visita responsable. No requiere registro ni autenticación para navegar. |
| **Comunario / Emprendedor Local** | Beneficiario Directo | Miembro de las comunidades del área protegida (Chairo, Sandillani, Pacollo, etc.) que ofrece servicios de hospedaje, guiado, alimentación o artesanías. Participa voluntariamente otorgando consentimiento para la difusión de su oferta. |
| **Administrador del Sistema** | Usuario Privilegiado | Encargado institucional o comunitario autorizado para gestionar los contenidos, verificar autorizaciones comunitarias, moderar estados de publicación (Borrador, Pendiente, Validado, Retirado) y monitorear métricas anónimas. |

---

## 2. Requisitos Funcionales (RF)

- **RF01 - Catálogo Unificado de Biodiversidad:** El sistema debe presentar el inventario de las 40 especies autóctonas (20 de fauna y 20 de flora), detallando nombre común, nombre científico, descripción, dato curioso y fotografía de alta calidad.
- **RF02 - Reproducción Sonora de Fauna:** El sistema debe permitir la reproducción interactiva de grabaciones sonoras reales para aquellas especies de fauna que posean registro de audio (.mp3), con controles de reproducción y pausa.
- **RF03 - Síntesis de Voz Guiada (TTS):** El sistema debe proveer una narración sonora de las descripciones textuales mediante la Web Speech API en español o inglés, según el idioma activo.
- **RF04 - Soporte Bilingüe Dinámico:** El sistema debe alternar instantáneamente la interfaz y los textos de contenido entre español e inglés sin requerir recarga completa del navegador.
- **RF05 - Búsqueda y Filtrado en Tiempo Real:** El sistema debe posibilitar la búsqueda de especies por nombre común o científico y el filtrado por categorías (Todos, Fauna, Flora, Mamíferos, Aves, Roedores).
- **RF06 - Módulo de Servicios Turísticos Comunitarios:** El sistema debe exhibir las fichas informativas de los servicios prestados por comunarios (alojamiento, gastronomía, guiado, ecoturismo), indicando comunidad, horario, tarifas referenciales e idiomas de atención.
- **RF07 - Filtrado de Servicios por Localidad y Categoría:** El sistema debe permitir filtrar los emprendimientos comunitarios según su ubicación (Chairo, Sandillani, Pacollo) y su tipo de servicio.
- **RF08 - Catálogo de Atractivos Turísticos y Culturales:** El sistema debe publicar los puntos de interés del parque, acompañados de categoría, altitud (msnm), recomendaciones de visita e imágenes representativas.
- **RF09 - Información Técnica de Rutas y Senderos:** El sistema debe detallar las rutas de trekking (ej. Camino del Choro), indicando distancia en kilómetros, duración estimada, grado de dificultad física y recomendaciones obligatorias de seguridad.
- **RF10 - Cartografía Interactiva Leaflet:** El sistema debe desplegar un mapa interactivo georreferenciado con mosaicos locales offline (zoom 12 a 15) y marcadores clasificados para atractivos, comunidades y puestos de control.
- **RF11 - Código del Viajero y Compromisos Ambientales:** El sistema debe presentar las 6 normas de visita responsable y ofrecer un panel interactivo de compromisos personales con persistencia local en el dispositivo del visitante.
- **RF12 - Autenticación Administrativa Segura:** El sistema debe restringir el acceso al panel de gestión mediante credenciales de usuario verificadas contra hashes criptográficos PBKDF2WithHmacSHA256 y sesiones de servidor.
- **RF13 - Control de Ciclo de Vida del Contenido (CRUD):** El administrador debe poder crear, editar, validar y retirar lógicamente cualquier ficha de especie, servicio, atractivo o ruta. El contenido retirado debe dejar de mostrarse de inmediato al público.
- **RF14 - Trazabilidad de Consentimiento y Autorizaciones:** Cada contenido publicado debe estar formalmente vinculado a un registro de autorización comunitaria o del SERNAP en la base de datos.
- **RF15 - Métricas de Uso Agregadas y Anónimas:** El sistema debe registrar las consultas de los visitantes de forma anónima, calculando totales por categoría y recursos más consultados, sin capturar datos personales invasivos (carnet o teléfono).

---

## 3. Requisitos No Funcionales (RNF)

- **RNF01 - Responsividad Absoluta (Mobile-First):** La interfaz debe adaptarse de manera fluida a dispositivos móviles (smartphones), tabletas, laptops y monitores de alta resolución mediante una única aplicación web.
- **RNF02 - Rendimiento y Ligereza:** La aplicación no debe incluir partículas pesadas ni animaciones continuas que sobrecalienten la batería o degraden el rendimiento en conexiones lentas de montaña.
- **RNF03 - Arquitectura en Capas y Pureza JDBC:** El backend debe implementar el patrón MVC con JDBC puro sin ORM, garantizando bajo consumo de memoria y compatibilidad universal con servlets Jakarta 5.0.
- **RNF04 - Seguridad y Mitigación de Vulnerabilidades:** Se debe impedir inyección SQL (mediante `PreparedStatement`), cross-site scripting (XSS) y falsificación de peticiones en sitios cruzados (mediante tokens CSRF por sesión).
- **RNF05 - Parametrización para la Nube:** La cadena de conexión, usuario y contraseña de MySQL deben leerse desde variables de entorno del sistema (`DB_URL`, `DB_USER`, `DB_PASSWORD`), permitiendo su despliegue inmediato en Render, Railway, Aiven o Clever Cloud.
- **RNF06 - Disponibilidad sin Conexión Total (Graceful Degradation):** Si el servidor de base de datos entra en mantenimiento, la interfaz web debe mostrar datos de respaldo locales en lugar de fallar abruptamente.
- **RNF07 - Conformidad Ética de Privacidad:** Cumplir el principio de minimización de datos. No se almacenan carnets de identidad ni números de teléfono de visitantes en formularios de consulta pública.
- **RNF08 - Monitoreo de Salud:** Proveer el endpoint `/api/health` para verificaciones automáticas de disponibilidad y estado de conexión por parte del orquestador en la nube.
