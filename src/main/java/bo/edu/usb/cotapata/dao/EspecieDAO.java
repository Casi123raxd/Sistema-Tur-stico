package bo.edu.usb.cotapata.dao;

import bo.edu.usb.cotapata.config.DatabaseConfig;
import bo.edu.usb.cotapata.model.Especie;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class EspecieDAO {

    private static final Logger LOGGER = Logger.getLogger(EspecieDAO.class.getName());

    private static final String BASE_QUERY = 
        "SELECT c.id_contenido, c.tipo, c.estado_validacion, c.id_autorizacion, " +
        "es.titulo AS titulo_es, es.texto AS texto_es, es.dato_curioso AS curioso_es, " +
        "en.titulo AS titulo_en, en.texto AS texto_en, en.dato_curioso AS curioso_en, " +
        "ed.nombre_cientifico, ed.categoria_fauna, ed.archivo_imagen, ed.archivo_audio, " +
        "ed.es_endemica, ed.estado_conservacion, ed.habitat_cotapata, ed.dieta " +
        "FROM contenido c " +
        "LEFT JOIN contenido_idioma es ON c.id_contenido = es.id_contenido AND es.id_idioma = 1 " +
        "LEFT JOIN contenido_idioma en ON c.id_contenido = en.id_contenido AND en.id_idioma = 2 " +
        "LEFT JOIN especie_detalle ed ON c.id_contenido = ed.id_contenido ";

    public List<Especie> listarPublicadas() {
        String sql = BASE_QUERY + "WHERE c.estado_validacion = 'Validado' ORDER BY c.tipo ASC, c.id_contenido ASC";
        return executeListQuery(sql);
    }

    public List<Especie> listarTodas() {
        String sql = BASE_QUERY + "ORDER BY c.tipo ASC, c.id_contenido ASC";
        return executeListQuery(sql);
    }

    public Especie findById(int id) {
        String sql = BASE_QUERY + "WHERE c.id_contenido = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToEspecie(rs);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error en findById: " + e.getMessage());
        }
        return null;
    }

    public boolean insertar(Especie esp) {
        String sqlContenido = "INSERT INTO contenido (id_contenido, tipo, estado_validacion, id_autorizacion) VALUES (?, ?, ?, ?)";
        String sqlIdioma = "INSERT INTO contenido_idioma (id_contenido, id_idioma, titulo, texto, dato_curioso) VALUES (?, ?, ?, ?, ?)";
        String sqlDetalle = "INSERT INTO especie_detalle (id_contenido, tipo_especie, nombre_cientifico, categoria_fauna, archivo_imagen, archivo_audio, es_endemica, estado_conservacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConfig.getConnection()) {
            conn.setAutoCommit(false);
            try {
                // 1. Obtener siguiente ID si no se proporcionó
                int id = esp.getId();
                if (id <= 0) {
                    try (PreparedStatement psMax = conn.prepareStatement("SELECT COALESCE(MAX(id_contenido), 0) + 1 FROM contenido");
                         ResultSet rs = psMax.executeQuery()) {
                        if (rs.next()) id = rs.getInt(1);
                    }
                    esp.setId(id);
                }

                // 2. Insertar contenido base
                try (PreparedStatement psC = conn.prepareStatement(sqlContenido)) {
                    psC.setInt(1, esp.getId());
                    psC.setString(2, esp.getTipo() != null ? esp.getTipo().toUpperCase() : "FAUNA");
                    psC.setString(3, esp.getEstadoValidacion() != null ? esp.getEstadoValidacion() : "Validado");
                    psC.setInt(4, esp.getIdAutorizacion() > 0 ? esp.getIdAutorizacion() : 1);
                    psC.executeUpdate();
                }

                // 3. Insertar texto en español (id_idioma=1)
                try (PreparedStatement psEs = conn.prepareStatement(sqlIdioma)) {
                    psEs.setInt(1, esp.getId());
                    psEs.setInt(2, 1);
                    psEs.setString(3, esp.getNombreEs() != null ? esp.getNombreEs() : "");
                    psEs.setString(4, esp.getDescripcionEs() != null ? esp.getDescripcionEs() : "");
                    psEs.setString(5, esp.getDatoCuriosoEs() != null ? esp.getDatoCuriosoEs() : "");
                    psEs.executeUpdate();
                }

                // 4. Insertar texto en inglés (id_idioma=2)
                try (PreparedStatement psEn = conn.prepareStatement(sqlIdioma)) {
                    psEn.setInt(1, esp.getId());
                    psEn.setInt(2, 2);
                    psEn.setString(3, esp.getNombreEn() != null ? esp.getNombreEn() : (esp.getNombreEs() != null ? esp.getNombreEs() : ""));
                    psEn.setString(4, esp.getDescripcionEn() != null ? esp.getDescripcionEn() : (esp.getDescripcionEs() != null ? esp.getDescripcionEs() : ""));
                    psEn.setString(5, esp.getDatoCuriosoEn() != null ? esp.getDatoCuriosoEn() : "");
                    psEn.executeUpdate();
                }

                // 5. Insertar especie detalle
                try (PreparedStatement psD = conn.prepareStatement(sqlDetalle)) {
                    psD.setInt(1, esp.getId());
                    psD.setString(2, esp.getTipo() != null ? esp.getTipo().toUpperCase() : "FAUNA");
                    psD.setString(3, esp.getCientifico() != null ? esp.getCientifico() : "Especie");
                    psD.setString(4, esp.getCategoriaFauna() != null ? esp.getCategoriaFauna() : "no_aplica");
                    psD.setString(5, esp.getImagen() != null && !esp.getImagen().isEmpty() ? esp.getImagen() : "LOGOO.png");
                    psD.setString(6, esp.getAudio() != null && !esp.getAudio().isEmpty() ? esp.getAudio() : null);
                    psD.setBoolean(7, esp.isEsEndemica());
                    psD.setString(8, esp.getEstadoConservacion() != null ? esp.getEstadoConservacion() : "Preocupación Menor (LC)");
                    psD.executeUpdate();
                }

                conn.commit();
                return true;
            } catch (SQLException e) {
                conn.rollback();
                LOGGER.log(Level.SEVERE, "Error al insertar especie: " + e.getMessage());
                return false;
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Fallo de conexión al insertar especie: " + e.getMessage());
            return false;
        }
    }

    public boolean actualizar(Especie esp) {
        String sqlContenido = "UPDATE contenido SET tipo = ?, estado_validacion = ? WHERE id_contenido = ?";
        String sqlIdiomaEs = "UPDATE contenido_idioma SET titulo = ?, texto = ?, dato_curioso = ? WHERE id_contenido = ? AND id_idioma = 1";
        String sqlIdiomaEn = "UPDATE contenido_idioma SET titulo = ?, texto = ?, dato_curioso = ? WHERE id_contenido = ? AND id_idioma = 2";
        String sqlDetalle = "UPDATE especie_detalle SET nombre_cientifico = ?, categoria_fauna = ?, archivo_imagen = ?, archivo_audio = ?, es_endemica = ?, estado_conservacion = ? WHERE id_contenido = ?";

        try (Connection conn = DatabaseConfig.getConnection()) {
            conn.setAutoCommit(false);
            try {
                try (PreparedStatement psC = conn.prepareStatement(sqlContenido)) {
                    psC.setString(1, esp.getTipo() != null ? esp.getTipo().toUpperCase() : "FAUNA");
                    psC.setString(2, esp.getEstadoValidacion() != null ? esp.getEstadoValidacion() : "Validado");
                    psC.setInt(3, esp.getId());
                    psC.executeUpdate();
                }

                try (PreparedStatement psEs = conn.prepareStatement(sqlIdiomaEs)) {
                    psEs.setString(1, esp.getNombreEs() != null ? esp.getNombreEs() : "");
                    psEs.setString(2, esp.getDescripcionEs() != null ? esp.getDescripcionEs() : "");
                    psEs.setString(3, esp.getDatoCuriosoEs() != null ? esp.getDatoCuriosoEs() : "");
                    psEs.setInt(4, esp.getId());
                    psEs.executeUpdate();
                }

                try (PreparedStatement psEn = conn.prepareStatement(sqlIdiomaEn)) {
                    psEn.setString(1, esp.getNombreEn() != null ? esp.getNombreEn() : "");
                    psEn.setString(2, esp.getDescripcionEn() != null ? esp.getDescripcionEn() : "");
                    psEn.setString(3, esp.getDatoCuriosoEn() != null ? esp.getDatoCuriosoEn() : "");
                    psEn.setInt(4, esp.getId());
                    psEn.executeUpdate();
                }

                try (PreparedStatement psD = conn.prepareStatement(sqlDetalle)) {
                    psD.setString(1, esp.getCientifico() != null ? esp.getCientifico() : "");
                    psD.setString(2, esp.getCategoriaFauna() != null ? esp.getCategoriaFauna() : "no_aplica");
                    psD.setString(3, esp.getImagen() != null && !esp.getImagen().isEmpty() ? esp.getImagen() : "LOGOO.png");
                    psD.setString(4, esp.getAudio() != null && !esp.getAudio().isEmpty() ? esp.getAudio() : null);
                    psD.setBoolean(5, esp.isEsEndemica());
                    psD.setString(6, esp.getEstadoConservacion() != null ? esp.getEstadoConservacion() : "Preocupación Menor (LC)");
                    psD.setInt(7, esp.getId());
                    psD.executeUpdate();
                }

                conn.commit();
                return true;
            } catch (SQLException e) {
                conn.rollback();
                LOGGER.log(Level.SEVERE, "Error al actualizar especie: " + e.getMessage());
                return false;
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Fallo de conexión al actualizar especie: " + e.getMessage());
            return false;
        }
    }

    public boolean cambiarEstado(int id, String estado) {
        String sql = "UPDATE contenido SET estado_validacion = ? WHERE id_contenido = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, estado);
            stmt.setInt(2, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error en cambiarEstado: " + e.getMessage());
            return false;
        }
    }

    public boolean eliminarLogico(int id) {
        return cambiarEstado(id, "Retirado");
    }

    private List<Especie> executeListQuery(String sql) {
        List<Especie> lista = new ArrayList<>();
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                lista.add(mapResultSetToEspecie(rs));
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error ejecutando consulta de especies: " + e.getMessage());
        }
        return lista;
    }

    private Especie mapResultSetToEspecie(ResultSet rs) throws SQLException {
        Especie e = new Especie();
        e.setId(rs.getInt("id_contenido"));
        e.setTipo(rs.getString("tipo"));
        e.setEstadoValidacion(rs.getString("estado_validacion"));
        e.setIdAutorizacion(rs.getInt("id_autorizacion"));

        String rawTituloEs = rs.getString("titulo_es");
        String rawTituloEn = rs.getString("titulo_en");
        
        // Si el título viene en formato "Nombre - Cientifico", desglosarlo limpiamente
        if (rawTituloEs != null && rawTituloEs.contains(" - ")) {
            String[] parts = rawTituloEs.split(" - ", 2);
            e.setNombreEs(parts[0].trim());
        } else {
            e.setNombreEs(rawTituloEs != null ? rawTituloEs : "");
        }

        if (rawTituloEn != null && rawTituloEn.contains(" - ")) {
            String[] parts = rawTituloEn.split(" - ", 2);
            e.setNombreEn(parts[0].trim());
        } else {
            e.setNombreEn(rawTituloEn != null ? rawTituloEn : e.getNombreEs());
        }

        e.setDescripcionEs(rs.getString("texto_es"));
        e.setDescripcionEn(rs.getString("texto_en"));
        e.setDatoCuriosoEs(rs.getString("curioso_es"));
        e.setDatoCuriosoEn(rs.getString("curioso_en"));

        e.setCientifico(rs.getString("nombre_cientifico"));
        e.setCategoriaFauna(rs.getString("categoria_fauna"));
        e.setImagen(rs.getString("archivo_imagen"));
        e.setAudio(rs.getString("archivo_audio"));
        e.setEsEndemica(rs.getBoolean("es_endemica"));
        e.setEstadoConservacion(rs.getString("estado_conservacion"));

        try {
            e.setHabitat(rs.getString("habitat_cotapata"));
            e.setDieta(rs.getString("dieta"));
        } catch (SQLException ignored) {}

        return e;
    }
}
