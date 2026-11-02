package bo.edu.usb.cotapata.util;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.security.SecureRandom;
import java.util.Base64;

/**
 * Utilidad de protección contra ataques CSRF (Cross-Site Request Forgery)
 * vinculada a la sesión HTTP del usuario administrativo.
 */
public class CsrfUtil {

    public static final String CSRF_SESSION_ATTR = "CSRF_TOKEN";
    public static final String CSRF_HEADER_NAME = "X-CSRF-Token";
    private static final SecureRandom RANDOM = new SecureRandom();

    /**
     * Obtiene el token CSRF actual de la sesión o genera uno nuevo si no existe.
     */
    public static String getOrCreateToken(HttpSession session) {
        String token = (String) session.getAttribute(CSRF_SESSION_ATTR);
        if (token == null || token.isEmpty()) {
            byte[] bytes = new byte[24];
            RANDOM.nextBytes(bytes);
            token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
            session.setAttribute(CSRF_SESSION_ATTR, token);
        }
        return token;
    }

    /**
     * Valida si el token enviado en la cabecera coincide con el token de la sesión activa.
     */
    public static boolean validateToken(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return false;
        }

        String sessionToken = (String) session.getAttribute(CSRF_SESSION_ATTR);
        if (sessionToken == null) {
            return false;
        }

        String requestToken = request.getHeader(CSRF_HEADER_NAME);
        if (requestToken == null || requestToken.trim().isEmpty()) {
            requestToken = request.getParameter("csrf_token");
        }

        return sessionToken.equals(requestToken);
    }
}
