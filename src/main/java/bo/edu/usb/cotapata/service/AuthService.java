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

        Usuario usuario = usuarioDAO.findByUsername(username.trim());
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
