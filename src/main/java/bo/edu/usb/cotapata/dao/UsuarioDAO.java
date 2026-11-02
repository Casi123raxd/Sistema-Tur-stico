package bo.edu.usb.cotapata.dao;

import bo.edu.usb.cotapata.config.DatabaseConfig;
import bo.edu.usb.cotapata.model.Usuario;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class UsuarioDAO {

    private static final Logger LOGGER = Logger.getLogger(UsuarioDAO.class.getName());

    public Usuario findByUsername(String username) {
        String sql = "SELECT u.id_usuario, u.nombre_completo, u.correo, u.username, u.password_hash, " +
                     "u.id_rol, r.nombre AS rol_nombre, u.estado, u.fecha_creacion " +
                     "FROM usuario u " +
                     "JOIN rol r ON u.id_rol = r.id_rol " +
                     "WHERE u.username = ? AND u.estado = 'ACTIVO'";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, username);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Usuario u = new Usuario();
                    u.setIdUsuario(rs.getInt("id_usuario"));
                    u.setNombreCompleto(rs.getString("nombre_completo"));
                    u.setCorreo(rs.getString("correo"));
                    u.setUsername(rs.getString("username"));
                    u.setPasswordHash(rs.getString("password_hash"));
                    u.setIdRol(rs.getInt("id_rol"));
                    u.setNombreRol(rs.getString("rol_nombre"));
                    u.setEstado(rs.getString("estado"));
                    u.setFechaCreacion(rs.getTimestamp("fecha_creacion"));
                    return u;
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error en findByUsername: " + e.getMessage());
        }
        return null;
    }
}
