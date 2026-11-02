package bo.edu.usb.cotapata.dao;

import bo.edu.usb.cotapata.config.DatabaseConfig;
import bo.edu.usb.cotapata.model.Recomendacion;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class RecomendacionDAO {

    private static final Logger LOGGER = Logger.getLogger(RecomendacionDAO.class.getName());

    private static final String BASE_QUERY = 
        "SELECT id_recomendacion, categoria, icono, titulo_es, titulo_en, descripcion_es, " +
        "descripcion_en, consejo_practico_es, consejo_practico_en, prioridad, estado_validacion, " +
        "id_autorizacion FROM recomendacion ";

    public List<Recomendacion> listarPublicadas() {
        String sql = BASE_QUERY + "WHERE estado_validacion = 'Validado' ORDER BY prioridad ASC, id_recomendacion ASC";
        return executeList(sql);
    }

    public List<Recomendacion> listarTodas() {
        String sql = BASE_QUERY + "ORDER BY prioridad ASC, id_recomendacion ASC";
        return executeList(sql);
    }

    public Recomendacion findById(int id) {
        String sql = BASE_QUERY + "WHERE id_recomendacion = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) return mapRow(rs);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error en findById recomendacion: " + e.getMessage());
        }
        return null;
    }

    public boolean insertar(Recomendacion r) {
        String sql = "INSERT INTO recomendacion (categoria, icono, titulo_es, titulo_en, descripcion_es, " +
                     "descripcion_en, consejo_practico_es, consejo_practico_en, prioridad, estado_validacion, " +
                     "id_autorizacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, r.getCategoria());
            stmt.setString(2, r.getIcono() != null ? r.getIcono() : "🌿");
            stmt.setString(3, r.getTituloEs());
            stmt.setString(4, r.getTituloEn() != null ? r.getTituloEn() : r.getTituloEs());
            stmt.setString(5, r.getDescripcionEs());
            stmt.setString(6, r.getDescripcionEn() != null ? r.getDescripcionEn() : r.getDescripcionEs());
            stmt.setString(7, r.getConsejoPracticoEs());
            stmt.setString(8, r.getConsejoPracticoEn() != null ? r.getConsejoPracticoEn() : r.getConsejoPracticoEs());
            stmt.setInt(9, r.getPrioridad() > 0 ? r.getPrioridad() : 1);
            stmt.setString(10, r.getEstadoValidacion() != null ? r.getEstadoValidacion() : "Validado");
            stmt.setInt(11, r.getIdAutorizacion() > 0 ? r.getIdAutorizacion() : 1);

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error al insertar recomendacion: " + e.getMessage());
            return false;
        }
    }

    public boolean actualizar(Recomendacion r) {
        String sql = "UPDATE recomendacion SET categoria = ?, icono = ?, titulo_es = ?, titulo_en = ?, " +
                     "descripcion_es = ?, descripcion_en = ?, consejo_practico_es = ?, consejo_practico_en = ?, " +
                     "prioridad = ?, estado_validacion = ? WHERE id_recomendacion = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, r.getCategoria());
            stmt.setString(2, r.getIcono());
            stmt.setString(3, r.getTituloEs());
            stmt.setString(4, r.getTituloEn());
            stmt.setString(5, r.getDescripcionEs());
            stmt.setString(6, r.getDescripcionEn());
            stmt.setString(7, r.getConsejoPracticoEs());
            stmt.setString(8, r.getConsejoPracticoEn());
            stmt.setInt(9, r.getPrioridad());
            stmt.setString(10, r.getEstadoValidacion());
            stmt.setInt(11, r.getIdRecomendacion());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error al actualizar recomendacion: " + e.getMessage());
            return false;
        }
    }

    public boolean cambiarEstado(int id, String estado) {
        String sql = "UPDATE recomendacion SET estado_validacion = ? WHERE id_recomendacion = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, estado);
            stmt.setInt(2, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error al cambiar estado recomendacion: " + e.getMessage());
            return false;
        }
    }

    private List<Recomendacion> executeList(String sql) {
        List<Recomendacion> list = new ArrayList<>();
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) list.add(mapRow(rs));
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error al consultar recomendaciones: " + e.getMessage());
        }
        return list;
    }

    private Recomendacion mapRow(ResultSet rs) throws SQLException {
        Recomendacion r = new Recomendacion();
        r.setIdRecomendacion(rs.getInt("id_recomendacion"));
        r.setCategoria(rs.getString("categoria"));
        r.setIcono(rs.getString("icono"));
        r.setTituloEs(rs.getString("titulo_es"));
        r.setTituloEn(rs.getString("titulo_en"));
        r.setDescripcionEs(rs.getString("descripcion_es"));
        r.setDescripcionEn(rs.getString("descripcion_en"));
        r.setConsejoPracticoEs(rs.getString("consejo_practico_es"));
        r.setConsejoPracticoEn(rs.getString("consejo_practico_en"));
        r.setPrioridad(rs.getInt("prioridad"));
        r.setEstadoValidacion(rs.getString("estado_validacion"));
        r.setIdAutorizacion(rs.getInt("id_autorizacion"));
        return r;
    }
}
