package bo.edu.usb.cotapata.dao;

import bo.edu.usb.cotapata.config.DatabaseConfig;
import bo.edu.usb.cotapata.model.RutaTuristica;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class RutaDAO {

    private static final Logger LOGGER = Logger.getLogger(RutaDAO.class.getName());

    private static final String BASE_QUERY = 
        "SELECT id_ruta, nombre_es, nombre_en, descripcion_es, descripcion_en, distancia_km, " +
        "duracion_horas, dificultad, desnivel_metros, recomendaciones_seguridad_es, " +
        "recomendaciones_seguridad_en, archivo_imagen, estado_validacion, id_autorizacion FROM ruta ";

    public List<RutaTuristica> listarPublicadas() {
        String sql = BASE_QUERY + "WHERE estado_validacion = 'Validado' ORDER BY id_ruta ASC";
        return executeList(sql);
    }

    public List<RutaTuristica> listarTodas() {
        String sql = BASE_QUERY + "ORDER BY id_ruta ASC";
        return executeList(sql);
    }

    public RutaTuristica findById(int id) {
        String sql = BASE_QUERY + "WHERE id_ruta = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) return mapRow(rs);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error en findById ruta: " + e.getMessage());
        }
        return null;
    }

    public boolean insertar(RutaTuristica r) {
        String sql = "INSERT INTO ruta (nombre_es, nombre_en, descripcion_es, descripcion_en, distancia_km, " +
                     "duracion_horas, dificultad, desnivel_metros, recomendaciones_seguridad_es, " +
                     "recomendaciones_seguridad_en, archivo_imagen, estado_validacion, id_autorizacion) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, r.getNombreEs());
            stmt.setString(2, r.getNombreEn() != null ? r.getNombreEn() : r.getNombreEs());
            stmt.setString(3, r.getDescripcionEs());
            stmt.setString(4, r.getDescripcionEn() != null ? r.getDescripcionEn() : r.getDescripcionEs());
            stmt.setBigDecimal(5, r.getDistanciaKm());
            stmt.setString(6, r.getDuracionHoras());
            stmt.setString(7, r.getDificultad() != null ? r.getDificultad() : "Media");
            stmt.setInt(8, r.getDesnivelMetros());
            stmt.setString(9, r.getRecomendacionesSeguridadEs());
            stmt.setString(10, r.getRecomendacionesSeguridadEn() != null ? r.getRecomendacionesSeguridadEn() : r.getRecomendacionesSeguridadEs());
            stmt.setString(11, r.getArchivoImagen() != null && !r.getArchivoImagen().isEmpty() ? r.getArchivoImagen() : "cotapata_aerial.jpg");
            stmt.setString(12, r.getEstadoValidacion() != null ? r.getEstadoValidacion() : "Validado");
            stmt.setInt(13, r.getIdAutorizacion() > 0 ? r.getIdAutorizacion() : 4);

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error al insertar ruta: " + e.getMessage());
            return false;
        }
    }

    public boolean actualizar(RutaTuristica r) {
        String sql = "UPDATE ruta SET nombre_es = ?, nombre_en = ?, descripcion_es = ?, descripcion_en = ?, " +
                     "distancia_km = ?, duracion_horas = ?, dificultad = ?, desnivel_metros = ?, " +
                     "recomendaciones_seguridad_es = ?, recomendaciones_seguridad_en = ?, archivo_imagen = ?, " +
                     "estado_validacion = ? WHERE id_ruta = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, r.getNombreEs());
            stmt.setString(2, r.getNombreEn());
            stmt.setString(3, r.getDescripcionEs());
            stmt.setString(4, r.getDescripcionEn());
            stmt.setBigDecimal(5, r.getDistanciaKm());
            stmt.setString(6, r.getDuracionHoras());
            stmt.setString(7, r.getDificultad());
            stmt.setInt(8, r.getDesnivelMetros());
            stmt.setString(9, r.getRecomendacionesSeguridadEs());
            stmt.setString(10, r.getRecomendacionesSeguridadEn());
            stmt.setString(11, r.getArchivoImagen());
            stmt.setString(12, r.getEstadoValidacion());
            stmt.setInt(13, r.getIdRuta());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error al actualizar ruta: " + e.getMessage());
            return false;
        }
    }

    public boolean cambiarEstado(int id, String estado) {
        String sql = "UPDATE ruta SET estado_validacion = ? WHERE id_ruta = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, estado);
            stmt.setInt(2, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error al cambiar estado ruta: " + e.getMessage());
            return false;
        }
    }

    private List<RutaTuristica> executeList(String sql) {
        List<RutaTuristica> list = new ArrayList<>();
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) list.add(mapRow(rs));
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error al consultar rutas: " + e.getMessage());
        }
        return list;
    }

    private RutaTuristica mapRow(ResultSet rs) throws SQLException {
        RutaTuristica r = new RutaTuristica();
        r.setIdRuta(rs.getInt("id_ruta"));
        r.setNombreEs(rs.getString("nombre_es"));
        r.setNombreEn(rs.getString("nombre_en"));
        r.setDescripcionEs(rs.getString("descripcion_es"));
        r.setDescripcionEn(rs.getString("descripcion_en"));
        r.setDistanciaKm(rs.getBigDecimal("distancia_km"));
        r.setDuracionHoras(rs.getString("duracion_horas"));
        r.setDificultad(rs.getString("dificultad"));
        r.setDesnivelMetros(rs.getInt("desnivel_metros"));
        r.setRecomendacionesSeguridadEs(rs.getString("recomendaciones_seguridad_es"));
        r.setRecomendacionesSeguridadEn(rs.getString("recomendaciones_seguridad_en"));
        r.setArchivoImagen(rs.getString("archivo_imagen"));
        r.setEstadoValidacion(rs.getString("estado_validacion"));
        r.setIdAutorizacion(rs.getInt("id_autorizacion"));
        return r;
    }
}
