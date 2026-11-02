package bo.edu.usb.cotapata.config;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Gestor de conexión JDBC avanzado para PostgreSQL (Supabase) y MySQL.
 * Diseñado para la nube (Supabase Transaction Pooler en puerto 6543 o sesión directa 5432,
 * Render, Railway, Neon) y entornos locales mediante variables de entorno o archivo .env.
 * 
 * Admite de forma nativa la cadena de conexión URI estándar de Supabase/PostgreSQL:
 * postgresql://usuario:password@host:6543/postgres?sslmode=require
 */
public class DatabaseConfig {

    private static final Logger LOGGER = Logger.getLogger(DatabaseConfig.class.getName());

    // Configuración de respaldo por defecto para desarrollo local / demostración
    private static final String DEFAULT_PG_URI = 
        "postgresql://postgres:postgres@localhost:5432/cotapata_db";
    private static final String DEFAULT_USER = "postgres";
    private static final String DEFAULT_PASS = "";

    static {
        // 1. Inicializar Driver PostgreSQL (Principal para Supabase)
        try {
            Class.forName("org.postgresql.Driver");
            LOGGER.info("✓ Driver JDBC de PostgreSQL (Supabase) inicializado exitosamente.");
        } catch (ClassNotFoundException e) {
            LOGGER.log(Level.WARNING, "Driver org.postgresql.Driver no encontrado en classpath principal.", e);
        }

        // 2. Inicializar Driver MySQL como fallback de compatibilidad heredada
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            LOGGER.fine("Driver JDBC de MySQL inicializado como respaldo secundario.");
        } catch (ClassNotFoundException ignored) {
            // No es crítico en entorno Supabase
        }
    }

    /**
     * Estructura interna para empaquetar los parámetros resueltos de la conexión JDBC.
     */
    public static class ResolvedConnection {
        public final String jdbcUrl;
        public final String user;
        public final String password;

        public ResolvedConnection(String jdbcUrl, String user, String password) {
            this.jdbcUrl = jdbcUrl;
            this.user = user;
            this.password = password;
        }

        public String getSanitizedUrl() {
            if (jdbcUrl == null) return "null";
            return jdbcUrl.replaceAll(":[^/@:]+@", ":****@");
        }
    }

    /**
     * Resuelve y normaliza la URL JDBC y credenciales a partir de variables de entorno:
     * - DB_URL o DATABASE_URL con formato URI (postgresql://usuario:password@host:6543/postgres)
     * - DB_URL con formato JDBC directo (jdbc:postgresql://host:6543/postgres)
     * - Variables individuales (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)
     */
    public static ResolvedConnection resolveConnectionInfo() {
        String envDbUrl = System.getenv("DB_URL");
        if (envDbUrl == null || envDbUrl.trim().isEmpty()) {
            envDbUrl = System.getenv("DATABASE_URL");
        }

        String envUser = System.getenv("DB_USER");
        String envPassword = System.getenv("DB_PASSWORD");

        // Si no se proporcionó ninguna URL, usar valor por defecto
        if (envDbUrl == null || envDbUrl.trim().isEmpty()) {
            envDbUrl = DEFAULT_PG_URI;
        }

        envDbUrl = envDbUrl.trim();

        // CASO A: URI de PostgreSQL estándar (postgresql:// o postgres://) como en Supabase
        if (envDbUrl.startsWith("postgresql://") || envDbUrl.startsWith("postgres://")) {
            try {
                // Reemplazamos temporalmente el esquema para análisis con java.net.URI
                String dummySchemeUrl = envDbUrl.replaceFirst("^(postgresql|postgres)://", "http://");
                URI uri = new URI(dummySchemeUrl);

                String host = uri.getHost();
                int port = uri.getPort() != -1 ? uri.getPort() : 5432;
                String path = uri.getPath();
                String dbName = (path != null && path.length() > 1) ? path.substring(1) : "postgres";

                String resolvedUser = envUser;
                String resolvedPassword = envPassword;

                if (uri.getUserInfo() != null && !uri.getUserInfo().isEmpty()) {
                    String[] creds = uri.getUserInfo().split(":", 2);
                    resolvedUser = URLDecoder.decode(creds[0], StandardCharsets.UTF_8);
                    if (creds.length > 1) {
                        resolvedPassword = URLDecoder.decode(creds[1], StandardCharsets.UTF_8);
                    }
                }

                if (resolvedUser == null || resolvedUser.isEmpty()) {
                    resolvedUser = DEFAULT_USER;
                }
                if (resolvedPassword == null) {
                    resolvedPassword = DEFAULT_PASS;
                }

                // Armar URL JDBC PostgreSQL nativa
                StringBuilder jdbcBuilder = new StringBuilder();
                jdbcBuilder.append("jdbc:postgresql://").append(host).append(":").append(port).append("/").append(dbName);

                String query = uri.getQuery();
                if (query != null && !query.isEmpty()) {
                    jdbcBuilder.append("?").append(query);
                } else {
                    // Supabase y conexiones en la nube requieren SSL
                    jdbcBuilder.append("?sslmode=require");
                }

                return new ResolvedConnection(jdbcBuilder.toString(), resolvedUser, resolvedPassword);
            } catch (Exception e) {
                LOGGER.log(Level.WARNING, "Error al parsear URI de PostgreSQL (" + envDbUrl + "): " + e.getMessage());
            }
        }

        // CASO B: Ya es una cadena JDBC directa (jdbc:postgresql:... o jdbc:mysql:...)
        if (envDbUrl.startsWith("jdbc:")) {
            return new ResolvedConnection(envDbUrl, 
                (envUser != null && !envUser.isEmpty()) ? envUser : DEFAULT_USER, 
                envPassword != null ? envPassword : DEFAULT_PASS);
        }

        // CASO C: Host simple o fallback
        String fallbackUrl = "jdbc:postgresql://" + envDbUrl + "/postgres?sslmode=require";
        return new ResolvedConnection(fallbackUrl, 
            (envUser != null && !envUser.isEmpty()) ? envUser : DEFAULT_USER, 
            envPassword != null ? envPassword : DEFAULT_PASS);
    }

    /**
     * Obtiene una conexión activa a la base de datos (PostgreSQL / Supabase).
     *
     * @return Connection activa y configurada
     * @throws SQLException Si ocurre un error de autenticación, red o parámetros
     */
    public static Connection getConnection() throws SQLException {
        ResolvedConnection resolved = resolveConnectionInfo();

        Properties props = new Properties();
        if (resolved.user != null && !resolved.user.isEmpty()) {
            props.setProperty("user", resolved.user);
        }
        if (resolved.password != null) {
            props.setProperty("password", resolved.password);
        }

        // Asegurar codificación UTF-8
        props.setProperty("characterEncoding", "UTF-8");

        try {
            Connection conn = DriverManager.getConnection(resolved.jdbcUrl, props);
            return conn;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Fallo al conectar con la base de datos en [" + resolved.getSanitizedUrl() + "]: " + e.getMessage());
            throw e;
        }
    }

    /**
     * Verifica de manera rápida y segura si la conexión a la base de datos está disponible.
     *
     * @return true si la conexión se establece con éxito, false en caso contrario.
     */
    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (Exception e) {
            return false;
        }
    }
}
