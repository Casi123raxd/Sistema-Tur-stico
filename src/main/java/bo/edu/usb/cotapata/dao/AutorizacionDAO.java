package bo.edu.usb.cotapata.dao;

import bo.edu.usb.cotapata.config.DatabaseConfig;
import bo.edu.usb.cotapata.model.Autorizacion;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class AutorizacionDAO {

    private static final Logger LOGGER = Logger.getLogger(AutorizacionDAO.class.getName());

    public List<Autorizacion> listarTodas() {
        List<Autorizacion> list = new ArrayList<>();
        String sql = "SELECT id_autorizacion, codigo_autorizacion, tipo_entidad, otorgado_por, " +
                     "comunidad, observaciones, fecha_autorizacion, vigente FROM autorizacion ORDER BY id_autorizacion ASC";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Autorizacion a = new Autorizacion();
                a.setIdAutorizacion(rs.getInt("id_autorizacion"));
                a.setCodigoAutorizacion(rs.getString("codigo_autorizacion"));
                a.setTipoEntidad(rs.getString("tipo_entidad"));
                a.setOtorgadoPor(rs.getString("otorgado_por"));
                a.setComunidad(rs.getString("comunidad"));
                a.setObservaciones(rs.getString("observaciones"));
                a.setFechaAutorizacion(rs.getDate("fecha_autorizacion"));
                a.setVigente(rs.getBoolean("vigente"));
                list.add(a);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error al listar autorizaciones: " + e.getMessage());
        }
        return list;
    }
}
