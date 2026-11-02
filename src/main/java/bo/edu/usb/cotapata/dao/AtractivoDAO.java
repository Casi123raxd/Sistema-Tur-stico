package bo.edu.usb.cotapata.dao;

import bo.edu.usb.cotapata.config.DatabaseConfig;
import bo.edu.usb.cotapata.model.AtractivoTuristico;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class AtractivoDAO {

    private static final Logger LOGGER = Logger.getLogger(AtractivoDAO.class.getName());

    private static final String BASE_QUERY = 
        "SELECT id_atractivo, nombre_es, nombre_en, categoria, descripcion_es, descripcion_en, " +
        "latitud, longitud, altitud_msnm, recomendaciones_es, recomendaciones_en, archivo_imagen, " +
        "estado_validacion, id_autorizacion FROM atractivo ";

    public List<AtractivoTuristico> listarPublicados() {
        String sql = BASE_QUERY + "WHERE estado_validacion = 'Validado' ORDER BY id_atractivo ASC";
        return executeList(sql);
    }

    public List<AtractivoTuristico> listarTodos() {
        String sql = BASE_QUERY + "ORDER BY id_atractivo ASC";
        return executeList(sql);
    }

    public AtractivoTuristico findById(int id) {
        String sql = BASE_QUERY + "WHERE id_atractivo = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) return mapRow(rs);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error en findById atractivo: " + e.getMessage());
        }
        return null;
    }

    public boolean insertar(AtractivoTuristico a) {
        String sql = "INSERT INTO atractivo (nombre_es, nombre_en, categoria, descripcion_es, descripcion_en, " +
                     "latitud, longitud, altitud_msnm, recomendaciones_es, recomendaciones_en, archivo_imagen, " +
                     "estado_validacion, id_autorizacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, a.getNombreEs());
            stmt.setString(2, a.getNombreEn() != null ? a.getNombreEn() : a.getNombreEs());
            stmt.setString(3, a.getCategoria() != null ? a.getCategoria() : "Patrimonio Natural");
            stmt.setString(4, a.getDescripcionEs());
            stmt.setString(5, a.getDescripcionEn() != null ? a.getDescripcionEn() : a.getDescripcionEs());
            stmt.setBigDecimal(6, a.getLatitud());
            stmt.setBigDecimal(7, a.getLongitud());
            if (a.getAltitudMsnm() != null) stmt.setInt(8, a.getAltitudMsnm()); else stmt.setNull(8, java.sql.Types.INTEGER);
            stmt.setString(9, a.getRecomendacionesEs());
            stmt.setString(10, a.getRecomendacionesEn() != null ? a.getRecomendacionesEn() : a.getRecomendacionesEs());
            stmt.setString(11, a.getArchivoImagen() != null && !a.getArchivoImagen().isEmpty() ? a.getArchivoImagen() : "cotapata_aerial.jpg");
            stmt.setString(12, a.getEstadoValidacion() != null ? a.getEstadoValidacion() : "Validado");
            stmt.setInt(13, a.getIdAutorizacion() > 0 ? a.getIdAutorizacion() : 4);

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error al insertar atractivo: " + e.getMessage());
            return false;
        }
    }

    public boolean actualizar(AtractivoTuristico a) {
        String sql = "UPDATE atractivo SET nombre_es = ?, nombre_en = ?, categoria = ?, descripcion_es = ?, " +
                     "descripcion_en = ?, latitud = ?, longitud = ?, altitud_msnm = ?, recomendaciones_es = ?, " +
                     "recomendaciones_en = ?, archivo_imagen = ?, estado_validacion = ? WHERE id_atractivo = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, a.getNombreEs());
            stmt.setString(2, a.getNombreEn());
            stmt.setString(3, a.getCategoria());
            stmt.setString(4, a.getDescripcionEs());
            stmt.setString(5, a.getDescripcionEn());
            stmt.setBigDecimal(6, a.getLatitud());
            stmt.setBigDecimal(7, a.getLongitud());
            if (a.getAltitudMsnm() != null) stmt.setInt(8, a.getAltitudMsnm()); else stmt.setNull(8, java.sql.Types.INTEGER);
            stmt.setString(9, a.getRecomendacionesEs());
            stmt.setString(10, a.getRecomendacionesEn());
            stmt.setString(11, a.getArchivoImagen());
            stmt.setString(12, a.getEstadoValidacion());
            stmt.setInt(13, a.getIdAtractivo());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error al actualizar atractivo: " + e.getMessage());
            return false;
        }
    }

    public boolean cambiarEstado(int id, String estado) {
        String sql = "UPDATE atractivo SET estado_validacion = ? WHERE id_atractivo = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, estado);
            stmt.setInt(2, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error al cambiar estado atractivo: " + e.getMessage());
            return false;
        }
    }

    private List<AtractivoTuristico> executeList(String sql) {
        List<AtractivoTuristico> list = new ArrayList<>();
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) list.add(mapRow(rs));
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error al consultar atractivos: " + e.getMessage());
        }
        return list;
    }

    private AtractivoTuristico mapRow(ResultSet rs) throws SQLException {
        AtractivoTuristico a = new AtractivoTuristico();
        a.setIdAtractivo(rs.getInt("id_atractivo"));
        a.setNombreEs(rs.getString("nombre_es"));
        a.setNombreEn(rs.getString("nombre_en"));
        a.setCategoria(rs.getString("categoria"));
        a.setDescripcionEs(rs.getString("descripcion_es"));
        a.setDescripcionEn(rs.getString("descripcion_en"));
        a.setLatitud(rs.getBigDecimal("latitud"));
        a.setLongitud(rs.getBigDecimal("longitud"));
        int alt = rs.getInt("altitud_msnm");
        if (!rs.wasNull()) a.setAltitudMsnm(alt);
        a.setRecomendacionesEs(rs.getString("recomendaciones_es"));
        a.setRecomendacionesEn(rs.getString("recomendaciones_en"));
        a.setArchivoImagen(rs.getString("archivo_imagen"));
        a.setEstadoValidacion(rs.getString("estado_validacion"));
        a.setIdAutorizacion(rs.getInt("id_autorizacion"));
        return a;
    }
}
