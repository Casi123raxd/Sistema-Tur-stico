package bo.edu.usb.cotapata.controller;

import bo.edu.usb.cotapata.model.Usuario;
import bo.edu.usb.cotapata.service.AuthService;
import bo.edu.usb.cotapata.util.CsrfUtil;
import bo.edu.usb.cotapata.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.json.JSONObject;

import java.io.IOException;

@WebServlet("/api/auth/*")
public class AuthServlet extends HttpServlet {

    private AuthService authService;

    @Override
    public void init() throws ServletException {
        this.authService = new AuthService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String pathInfo = request.getPathInfo();

        if ("/check".equals(pathInfo) || "/status".equals(pathInfo)) {
            HttpSession session = request.getSession(false);
            Usuario usuario = (session != null) ? (Usuario) session.getAttribute("usuario") : null;

            JSONObject res = new JSONObject();
            if (usuario != null) {
                res.put("authenticated", true);
                res.put("usuario", usuario.toSafeJson());
                res.put("csrfToken", CsrfUtil.getOrCreateToken(session));
            } else {
                res.put("authenticated", false);
            }
            JsonUtil.sendJsonResponse(response, res);
        } else if ("/csrf".equals(pathInfo)) {
            HttpSession session = request.getSession(true);
            String token = CsrfUtil.getOrCreateToken(session);
            JSONObject res = new JSONObject();
            res.put("csrfToken", token);
            JsonUtil.sendJsonResponse(response, res);
        } else {
            JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_NOT_FOUND, "Ruta de autenticación GET no encontrada.");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String pathInfo = request.getPathInfo();

        if ("/login".equals(pathInfo)) {
            try {
                JSONObject body = JsonUtil.parseRequestBody(request);
                String username = body.optString("username", "").trim();
                String password = body.optString("password", "").trim();

                if (username.isEmpty() || password.isEmpty()) {
                    JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, "Debe ingresar usuario y contraseña.");
                    return;
                }

                Usuario usuario = authService.login(username, password);
                if (usuario != null) {
                    // Invalida sesión anterior si existía para prevenir session fixation
                    HttpSession oldSession = request.getSession(false);
                    if (oldSession != null) {
                        oldSession.invalidate();
                    }

                    HttpSession newSession = request.getSession(true);
                    newSession.setAttribute("usuario", usuario);
                    newSession.setMaxInactiveInterval(30 * 60); // 30 minutos de inactividad

                    String csrfToken = CsrfUtil.getOrCreateToken(newSession);

                    JSONObject res = new JSONObject();
                    res.put("success", true);
                    res.put("message", "Inicio de sesión exitoso.");
                    res.put("usuario", usuario.toSafeJson());
                    res.put("csrfToken", csrfToken);
                    JsonUtil.sendJsonResponse(response, res);
                } else {
                    JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Credenciales incorrectas o usuario inactivo.");
                }
            } catch (Exception e) {
                JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error procesando autenticación.");
            }
        } else if ("/logout".equals(pathInfo)) {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            JsonUtil.sendSuccessResponse(response, "Sesión cerrada correctamente.");
        } else {
            JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_NOT_FOUND, "Ruta de autenticación POST no encontrada.");
        }
    }
}
