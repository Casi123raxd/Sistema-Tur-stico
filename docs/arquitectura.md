# Documento de Arquitectura de Software
## Sistema Integrado de Información Turística Comunitaria de Cotapata (COTAPATA EXPLORA)

---

## 1. Visión General de la Arquitectura

El sistema está diseñado bajo el patrón arquitectónico **Modelo-Vista-Controlador (MVC)** desacoplado, combinando una interfaz web rica responsiva (Single Page Application - SPA) con un backend robusto basado en **Java (Jakarta Servlets 5.0)** y persistencia relacional con **JDBC Puro sobre MySQL 8.0+**.

```mermaid
flowchart TD
    subgraph Cliente ["Capa de Presentación (Frontend SPA)"]
        UI["Interfaz Web Unificada (HTML5 / CSS3 / Vanilla JS)"]
        Leaflet["Motor Cartográfico Leaflet 1.9.4"]
        AudioEng["Motor de Audio (HTML5 Audio + Web Speech API)"]
    end

    subgraph Filtros ["Capa de Seguridad e Interceptores"]
        EncFilter["EncodingFilter (UTF-8)"]
        AuthFilter["AuthFilter (Sesión + CSRF Token)"]
    end

    subgraph Controladores ["Capa de Controladores (Jakarta Servlets)"]
        PublicServlet["PublicApiServlet (/api/publico/*)"]
        AuthServlet["AuthServlet (/api/auth/*)"]
        AdminServlet["AdminApiServlet (/api/admin/*)"]
        HealthServlet["HealthServlet (/api/health)"]
        LegacyServlet["ContenidoServlet (/api/contenidos)"]
    end

    subgraph Servicios ["Capa de Servicios y Reglas de Negocio"]
        AuthService["AuthService (PBKDF2 + Roles)"]
        EspecieService["EspecieService"]
        ServicioService["ServicioTuristicoService"]
        AtractivoService["AtractivoService"]
        RutaService["RutaService"]
        RecService["RecomendacionService"]
        MetricaService["MetricaService"]
    end

    subgraph Persistencia ["Capa de Acceso a Datos (DAO / JDBC Puro)"]
        DatabaseConfig["DatabaseConfig (Variables de Entorno DB_URL, DB_USER, DB_PASSWORD)"]
        UsuarioDAO["UsuarioDAO"]
        EspecieDAO["EspecieDAO"]
        ServicioDAO["ServicioDAO"]
        AtractivoDAO["AtractivoDAO"]
        RutaDAO["RutaDAO"]
        RecDAO["RecomendacionDAO"]
        AutorizacionDAO["AutorizacionDAO"]
        MetricaDAO["MetricaDAO"]
    end

    subgraph BaseDatos ["Capa de Datos"]
        MySQL[("MySQL 8.0 Relacional Normalizada en 3FN")]
    end

    UI -->|Peticiones HTTP REST| EncFilter
    EncFilter --> PublicServlet
    EncFilter --> AuthServlet
    EncFilter --> HealthServlet
    EncFilter --> LegacyServlet
    EncFilter --> AuthFilter
    AuthFilter --> AdminServlet

    PublicServlet --> EspecieService
    PublicServlet --> ServicioService
    PublicServlet --> AtractivoService
    PublicServlet --> RutaService
    PublicServlet --> RecService
    PublicServlet --> MetricaService

    AdminServlet --> EspecieService
    AdminServlet --> ServicioService
    AdminServlet --> AtractivoService
    AdminServlet --> RutaService
    AdminServlet --> RecService
    AdminServlet --> MetricaService

    AuthServlet --> AuthService

    AuthService --> UsuarioDAO
    EspecieService --> EspecieDAO
    ServicioService --> ServicioDAO
    AtractivoService --> AtractivoDAO
    RutaService --> RutaDAO
    RecService --> RecDAO
    MetricaService --> MetricaDAO

    UsuarioDAO --> DatabaseConfig
    EspecieDAO --> DatabaseConfig
    ServicioDAO --> DatabaseConfig
    AtractivoDAO --> DatabaseConfig
    RutaDAO --> DatabaseConfig
    RecDAO --> DatabaseConfig
    AutorizacionDAO --> DatabaseConfig
    MetricaDAO --> DatabaseConfig

    DatabaseConfig -->|Conexión JDBC Segura| MySQL
```

---

## 2. Principios de Diseño Arquitectónico

1. **Separación de Responsabilidades (SoC):** Cada capa posee una función exclusiva. Los servlets procesan la petición HTTP y envían JSON; los servicios validan reglas de negocio; los DAOs manejan SQL preparado; y la configuración gestiona conexiones.
2. **Cero ORM (JDBC Puro Estricto):** Todas las operaciones a la base de datos se efectúan mediante `PreparedStatement` y `ResultSet` dentro de bloques `try-with-resources`, garantizando un consumo mínimo de memoria RAM y máximo rendimiento en contenedores cloud.
3. **Seguridad Integral:**
   - **Contraseñas:** Derivación criptográfica mediante `PBKDF2WithHmacSHA256` con sal de 16 bytes y 65,536 iteraciones.
   - **CSRF:** Tokens criptográficos aleatorios vinculados a la sesión del servidor para operaciones mutantes (`POST`, `PUT`, `DELETE`).
   - **Inyección SQL:** Imposibilitada por el uso exclusivo de parámetros enlazados (`?`) en consultas preparadas.
   - **XSS:** Datos serializados mediante la librería estándar `org.json` y saneados antes de su renderizado.
4. **Resiliencia y Compatibilidad Retroactiva:** El endpoint `/api/contenidos` se conserva plenamente operativo para garantizar que cualquier componente cliente preexistente continúe funcionando sin interrupciones.

---

## 3. Estructura de Paquetes Java

- `bo.edu.usb.cotapata.config`: Configuración de base de datos y variables de entorno.
- `bo.edu.usb.cotapata.controller`: Servlets HTTP REST.
- `bo.edu.usb.cotapata.dao`: Clases de acceso a datos con JDBC puro.
- `bo.edu.usb.cotapata.filter`: Filtros de codificación de caracteres y autenticación.
- `bo.edu.usb.cotapata.model`: Clases entidad POJO con métodos de serialización JSON.
- `bo.edu.usb.cotapata.service`: Capa de lógica de negocio y validaciones.
- `bo.edu.usb.cotapata.util`: Criptografía PBKDF2, manejo seguro de JSON y tokens CSRF.
