# Guía de Despliegue en la Nube
## Sistema Integrado de Información Turística Comunitaria de Cotapata (COTAPATA EXPLORA)

---

## 1. Topología de Despliegue en la Nube

Para garantizar una arquitectura escalable, de costo cero o mínimo para fines académicos y de alta disponibilidad, se plantea el desacoplamiento de la aplicación Java y la base de datos MySQL en proveedores especializados:

```
[ Visitante / Administrador ]
             │ (HTTPS / TLS 1.3)
             ▼
[ Render / Railway / Clever Cloud ]
   └── Contenedor Java 17+ / Tomcat 10+
       ├── Frontend SPA (index.html, assets: CSS, JS, Img, Audio, Leaflet)
       └── Backend Jakarta Servlets (cotapata-explora.war)
             │ (Conexión JDBC Segura / TLS)
             ▼
[ Aiven / Clever Cloud / Railway MySQL ]
   └── Base de Datos MySQL 8.0+ (cotapata_db)
```

---

## 2. Variables de Entorno Requeridas

En el panel de configuración del proveedor (Render, Railway, Clever Cloud), se deben definir las siguientes variables de entorno:

| Variable | Descripción | Ejemplo de Configuración en Producción |
|---|---|---|
| `DB_URL` | Cadena JDBC completa hacia el servicio MySQL | `jdbc:mysql://mysql-cotapata.aivencloud.com:15432/cotapata_db?sslMode=REQUIRED&serverTimezone=America/La_Paz` |
| `DB_USER` | Usuario asignado por el proveedor de base de datos | `avnadmin` o `u_cotapata` |
| `DB_PASSWORD` | Contraseña secreta asignada por el proveedor | *(Cadena secreta proporcionada por el proveedor)* |
| `PORT` | Puerto asignado dinámicamente por la plataforma | Asignado automáticamente por Render / Railway (ej. 8080 o 10000) |
| `APP_ENV` | Indicador de entorno | `produccion` |

---

## 3. Procedimiento de Despliegue Paso a Paso

### Paso 1: Inicialización de la Base de Datos MySQL en la Nube (Aiven o Clever Cloud)
1. Crear una instancia MySQL gratuita en [Aiven.io](https://aiven.io/) o [Clever Cloud](https://www.clever-cloud.com/).
2. Obtener el Host, Puerto, Usuario y Contraseña generados.
3. Conectarse mediante un cliente MySQL (DBeaver, MySQL Workbench o consola) y ejecutar el script completo:
   ```bash
   mysql -h <HOST_NUBE> -P <PUERTO> -u <USUARIO> -p <NOMBRE_BD> < database/schema.sql
   ```
4. Verificar que se hayan creado las 14 tablas y se hayan poblado las 40 especies y el usuario `admin`.

### Paso 2: Compilación y Empaquetado del WAR
En el directorio raíz del proyecto (`cotapata-explora/`), compilar con Maven:
```bash
mvn clean package
```
Esto genera el artefacto empaquetado:
`target/cotapata-explora.war`

### Paso 3: Despliegue del Backend en Render o Railway
1. **Opción A (WAR directo en Tomcat de Render/Clever Cloud):**
   - Subir el archivo `cotapata-explora.war` como aplicación Java / Tomcat.
   - Configurar las variables `DB_URL`, `DB_USER`, `DB_PASSWORD`.
2. **Opción B (Docker / Contenedor Ligero):**
   - Incluir el `Dockerfile` estándar de Apache Tomcat:
     ```dockerfile
     FROM tomcat:10.1-jdk17-temurin-jammy
     RUN rm -rf /usr/local/tomcat/webapps/ROOT
     COPY target/cotapata-explora.war /usr/local/tomcat/webapps/ROOT.war
     EXPOSE 8080
     CMD ["catalina.sh", "run"]
     ```
   - Vincular el repositorio Git en Render o Railway; la plataforma detecta el Dockerfile y compila automáticamente.

---

## 4. Verificación Post-Despliegue y Pruebas de Salud

1. **Prueba de Liveness y Conectividad a Base de Datos:**
   Visitar en el navegador o ejecutar con `curl`:
   ```bash
   curl -i https://cotapata-explora.onrender.com/api/health
   ```
   **Respuesta esperada:**
   ```json
   {
     "status": "UP",
     "service": "Cotapata Explora API",
     "databaseConnected": true,
     "timestamp": "2026-10-28T18:00:00Z"
   }
   ```
2. **Prueba de Consulta Pública:**
   Visitar `https://cotapata-explora.onrender.com/` para comprobar la carga de la interfaz, imágenes, audios y mapa Leaflet.
3. **Prueba de Autenticación Administrativa:**
   Iniciar sesión con `admin` / `Cotapata2026!` y comprobar el guardado y cambio de estados en MySQL.
