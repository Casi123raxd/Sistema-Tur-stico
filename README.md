# COTAPATA EXPLORA
### Sistema Integrado de Información Turística Comunitaria para el Parque Nacional y ANMI Cotapata

**Institución:** Universidad Salesiana de Bolivia  
**Carrera:** Ingeniería de Sistemas  
**Asignaturas Vinculadas:**
1. Análisis y Diseño de Sistemas
2. Sistemas Digitales I
3. Sacramentos y Espiritualidad (Justificación Salesiana)

**Equipo de Desarrollo:**
- Casilla Callancho Eddy
- Alba Lopez Pablo Alejandro
- Chipana Mamani Andrea Marilyn
- Huanca Chambi Ruddy Ariel
- Mujica Capquique Freddy Fernando
- Nina Villca Juan Gabriel
- Riveros Gamboa Fabiana Eliana
- Vargas Choque Boris Rodrigo
- Valle Calderon Carlos Ernesto

---

## 1. Descripción del Sistema

**Cotapata Explora** es una plataforma web unificada, responsiva y comunitaria diseñada para centralizar, organizar y difundir la información turística, cultural y biológica del **Parque Nacional y Área Natural de Manejo Integrado Cotapata (La Paz, Bolivia)**.

A diferencia de versiones anteriores divididas en prototipos dispersos para móvil y escritorio, esta versión integra una **única aplicación web (Single Page Application responsiva)** que se adapta con fluidez y elegancia estética (Filosofía Antigravity) a teléfonos inteligentes, tabletas, laptops y monitores.

### Características Principales:
- **Catálogo de 40 Especies Nativas (20 Fauna y 20 Flora):** Fichas con fotografías reales, nombres científicos, categorías, datos curiosos, narración sonora bilingüe (Web Speech API) y **audios reales (.mp3)** para especies de fauna.
- **Servicios Turísticos Comunitarios:** Fichas de albergues, gastronomía típica, guías locales y ecoturismo en Chairo, Sandillani y Pacollo, respaldadas por consentimientos comunitarios.
- **Atractivos y Rutas Técnicas:** Fichas detalladas del Camino Precolombino del Choro, Bosque Nublado de Yungas y cuenca del río Huarinilla con especificaciones de seguridad.
- **Mapa Interactivo Leaflet:** Cartografía con mosaicos offline (zoom 12 a 15) generados específicamente para el parque, con marcadores interactivos.
- **Recomendaciones y Código del Viajero:** 6 reglas de conservación y panel interactivo de compromisos personales con persistencia local.
- **Panel Administrativo Seguro:** Gestión completa (CRUD) de especies, servicios, atractivos, rutas y recomendaciones, con control de estados de publicación (`Validado`, `Pendiente`, `Borrador`, `Retirado`).
- **Seguridad Robusta:** Autenticación con algoritmo `PBKDF2WithHmacSHA256`, sesiones de servidor y protección contra falsificación de peticiones en sitios cruzados (CSRF).
- **Métricas Agregadas y Privacidad Ética:** Conteo anónimo de consultas por categoría y recursos más visitados sin recopilar carnets ni teléfonos celulares de turistas.

---

## 2. Estructura del Proyecto

```
cotapata-explora/
├── pom.xml                                  # Configuración Maven (Jakarta Servlets 5.0, MySQL Connector)
├── README.md                                # Guía principal del proyecto
├── .gitignore                               # Exclusiones de Git
├── .env.example                             # Plantilla de variables de entorno seguras
├── database/
│   ├── schema.sql                           # Esquema relacional completo normalizado en 3FN
│   └── migration/
│       └── 01_migration_from_legacy.sql     # Script de migración y transición ética
├── docs/
│   ├── arquitectura.md                      # Arquitectura MVC, JDBC puro y capas del sistema
│   ├── requisitos.md                        # Requisitos funcionales (RF) y no funcionales (RNF)
│   ├── casos-de-uso.md                      # Diagramas y descripción de casos de uso
│   ├── flujos-logicos.md                    # Sistemas Digitales I: tablas de verdad y lógica booleana
│   ├── modelo-datos.md                      # Modelo Entidad-Relación y diccionario de datos
│   ├── enfoque-etico.md                     # Sacramentos y Espiritualidad: justificación salesiana
│   ├── pruebas.md                           # Matriz de las 23 pruebas y verificaciones académicas
│   └── despliegue.md                        # Guía de despliegue en nube (Render / Railway / Aiven)
└── src/
    └── main/
        ├── java/bo/edu/usb/cotapata/
        │   ├── config/                      # DatabaseConfig (JDBC y variables de entorno)
        │   ├── controller/                  # PublicApiServlet, AuthServlet, AdminApiServlet, HealthServlet
        │   ├── dao/                         # EspecieDAO, ServicioDAO, AtractivoDAO, RutaDAO, etc.
        │   ├── filter/                      # AuthFilter (seguridad y CSRF), EncodingFilter (UTF-8)
        │   ├── model/                       # Clases entidad con serialización JSON
        │   ├── service/                     # Lógica de negocio y validaciones
        │   └── util/                        # PasswordUtil (PBKDF2), JsonUtil, CsrfUtil
        └── webapp/
            ├── index.html                   # Aplicación Web Única y Responsiva
            ├── assets/
            │   ├── css/style.css            # Estilos CSS modernos Antigravity (Mobile-First)
            │   ├── js/app.js                # Lógica cliente bilingüe, Leaflet, audios y TTS
            │   ├── js/admin.js              # Controlador del panel de administración seguro
            │   ├── img/                     # Fotografías de flora, fauna, parque y logotipo
            │   ├── audio/                   # 19 archivos sonoros reales (.mp3)
            │   ├── leaflet/                 # Motor cartográfico Leaflet 1.9.4
            │   └── mapa_offline/            # Mosaicos offline de Cotapata (zoom 12-15)
            └── WEB-INF/
                ├── web.xml                  # Descriptor de despliegue Jakarta EE 5.0
                └── lib/                     # Dependencias empaquetadas (JARs)
```

---

## 3. Instalación y Ejecución Local

### Requisitos Previos:
- Java Development Kit (JDK) 17 o superior (instalado).
- Servidor MySQL 8.0+ (puede utilizarse XAMPP, WampServer o MySQL Server nativo).
- Servidor de aplicaciones Jakarta compatible (Apache Tomcat 10+).

### Paso 1: Configurar la Base de Datos MySQL
1. Iniciar el servicio de MySQL (por ejemplo, en XAMPP).
2. Crear la base de datos:
   ```sql
   CREATE DATABASE cotapata_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Ejecutar el script completo:
   ```bash
   mysql -u root cotapata_db < database/schema.sql
   ```

### Paso 2: Credenciales Iniciales de Demostración
- **Usuario:** `admin`
- **Contraseña:** `Cotapata2026!`
- **Algoritmo de Hash:** `PBKDF2WithHmacSHA256` (65,536 iteraciones con sal de 16 bytes).

### Paso 3: Compilación y Ejecución
- **Con Maven:**
  ```bash
  mvn clean package
  ```
  Copiar el archivo generado `target/cotapata-explora.war` al directorio `webapps/` de Apache Tomcat 10+.
- **Acceso en el Navegador:**
  ```
  http://localhost:8080/cotapata-explora/
  ```

---

## 4. Despliegue en la Nube

El sistema se encuentra parametrizado para la nube mediante variables de entorno:
- `DB_URL`: Cadena JDBC (ej. Aiven, Clever Cloud, Railway MySQL).
- `DB_USER`: Usuario de la base de datos en la nube.
- `DB_PASSWORD`: Contraseña de la base de datos en la nube.
- `PORT`: Puerto asignado dinámicamente.

Consulte la guía completa en [docs/despliegue.md](docs/despliegue.md).
El endpoint de comprobación de salud en la nube es: `/api/health`.

---

## 5. Limitaciones Conocidas y Alcance

- Por determinación del alcance académico aprobado y en concordancia con los principios éticos del proyecto, la plataforma **no incluye pagos electrónicos comerciales ni reservas con cobro garantizado**.
- La aplicación **no realiza geolocalización continua ni rastreo invasivo de los turistas** en respeto a su derecho a la privacidad.
- Todos los servicios comunitarios publicados cuentan con autorización y consentimiento informado previo de sus respectivos comunarios y asociaciones locales.
