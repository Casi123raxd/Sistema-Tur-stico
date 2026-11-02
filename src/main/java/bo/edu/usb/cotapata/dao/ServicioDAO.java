package bo.edu.usb.cotapata.dao;

import bo.edu.usb.cotapata.config.DatabaseConfig;
import bo.edu.usb.cotapata.model.ServicioComunitario;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ServicioDAO {

    private static final Logger LOGGER = Logger.getLogger(ServicioDAO.class.getName());

    private static final String BASE_QUERY = 
        "SELECT s.id_servicio, s.id_categoria, cs.codigo AS cat_codigo, cs.nombre_es AS cat_nombre_es, " +
        "cs.nombre_en AS cat_nombre_en, cs.icono AS cat_icono, s.id_comunario, c.nombre_referencial AS comunario_nombre, " +
        "s.nombre_servicio, s.descripcion_es, s.descripcion_en, s.comunidad, s.ubicacion_referencial, " +
        "s.horario_atencion, s.rango_precios, s.idiomas_atencion, s.archivo_imagen, s.estado_validacion, s.id_autorizacion " +
        "FROM servicio s " +
        "JOIN categoria_servicio cs ON s.id_categoria = cs.id_categoria " +
        "JOIN comunario c ON s.id_comunario = c.id_comunario ";

    public List<ServicioComunitario> listarPublicados() {
        String sql = BASE_QUERY + "WHERE s.estado_validacion = 'Validado' ORDER BY s.id_servicio ASC";
        return executeList(sql);
    }

    public List<ServicioComunitario> listarTodos() {
        String sql = BASE_QUERY + "ORDER BY s.id_servicio ASC";
        return executeList(sql);
    }

    public ServicioComunitario findById(int id) {
        String sql = BASE_QUERY + "WHERE s.id_servicio = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error en findById servicio: " + e.getMessage());
        }
        return null;
    }

    public boolean insertar(ServicioComunitario s) {
        String sql = "INSERT INTO servicio (id_categoria, id_comunario, nombre_servicio, descripcion_es, " +
                     "descripcion_en, comunidad, ubicacion_referencial, horario_atencion, rango_precios, " +
                     "idiomas_atencion, archivo_imagen, estado_validacion, id_autorizacion) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, s.getIdCategoria() > 0 ? s.getIdCategoria() : 1);
            stmt.setInt(2, s.getIdComunario() > 0 ? s.getIdComunario() : 1);
            stmt.setString(3, s.getNombreServicio());
            stmt.setString(4, s.getDescripcionEs());
            stmt.setString(5, s.getDescripcionEn() != null ? s.getDescripcionEn() : s.getDescripcionEs());
            stmt.setString(6, s.getComunidad());
            stmt.setString(7, s.getUbicacionReferencial());
            stmt.setString(8, s.getHorarioAtencion());
            stmt.setString(9, s.getRangoPrecios());
            stmt.setString(10, s.getIdiomasAtencion() != null ? s.getIdiomasAtencion() : "Español, Aymara");
            stmt.setString(11, s.getArchivoImagen() != null && !s.getArchivoImagen().isEmpty() ? s.getArchivoImagen() : "jungle_banner.jpg");
            stmt.setString(12, s.getEstadoValidacion() != null ? s.getEstadoValidacion() : "Pendiente");
            stmt.setInt(13, s.getIdAutorizacion() > 0 ? s.getIdAutorizacion() : 2);

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error al insertar servicio: " + e.getMessage());
            return false;
        }
    }

    public boolean actualizar(ServicioComunitario s) {
        String sql = "UPDATE servicio SET id_categoria = ?, nombre_servicio = ?, descripcion_es = ?, " +
                     "descripcion_en = ?, comunidad = ?, ubicacion_referencial = ?, horario_atencion = ?, " +
                     "rango_precios = ?, idiomas_atencion = ?, archivo_imagen = ?, estado_validacion = ? " +
                     "WHERE id_servicio = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, s.getIdCategoria() > 0 ? s.getIdCategoria() : 1);
            stmt.setString(2, s.getNombreServicio());
            stmt.setString(3, s.getDescripcionEs());
            stmt.setString(4, s.getDescripcionEn());
            stmt.setString(5, s.getComunidad());
            stmt.setString(6, s.getUbicacionReferencial());
            stmt.setString(7, s.getHorarioAtencion());
            stmt.setString(8, s.getRangoPrecios());
            stmt.setString(9, s.getIdiomasAtencion());
            stmt.setString(10, s.getArchivoImagen());
            stmt.setString(11, s.getEstadoValidacion());
            stmt.setInt(12, s.getIdServicio());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error al actualizar servicio: " + e.getMessage());
            return false;
        }
    }

    public boolean cambiarEstado(int id, String estado) {
        String sql = "UPDATE servicio SET estado_validacion = ? WHERE id_servicio = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, estado);
            stmt.setInt(2, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error al cambiar estado de servicio: " + e.getMessage());
            return false;
        }
    }

    private List<ServicioComunitario> executeList(String sql) {
        List<ServicioComunitario> list = new ArrayList<>();
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                list.add(mapRow(rs));
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error listando servicios: " + e.getMessage());
        }
        return list;
    }

    private ServicioComunitario mapRow(ResultSet rs) throws SQLException {
        ServicioComunitario s = new ServicioComunitario();
        s.setIdServicio(rs.getInt("id_servicio"));
        s.setIdCategoria(rs.getInt("id_categoria"));
        s.setCodigoCategoria(rs.getString("cat_codigo"));
        s.setNombreCategoriaEs(rs.getString("cat_nombre_es"));
        s.setNombreCategoriaEn(rs.getString("cat_nombre_en"));
        s.setIconoCategoria(rs.getString("cat_icono"));
        s.setIdComunario(rs.getInt("id_comunario"));
        s.setNombreComunario(rs.getString("comunario_nombre"));
        s.setNombreServicio(rs.getString("nombre_servicio"));
        s.setDescripcionEs(rs.getString("descripcion_es"));
        s.setDescripcionEn(rs.getString("descripcion_en"));
        s.setComunidad(rs.getString("comunidad"));
        s.setUbicacionReferencial(rs.getString("ubicacion_referencial"));
        s.setHorarioAtencion(rs.getString("horario_atencion"));
        s.setRangoPrecios(rs.getString("rango_precios"));
        s.setIdiomasAtencion(rs.getString("idiomas_atencion"));
        s.setArchivoImagen(rs.getString("archivo_imagen"));
        s.setEstadoValidacion(rs.getString("estado_validacion"));
        s.setIdAutorizacion(rs.getInt("id_autorizacion"));
        return s;
    }
}
