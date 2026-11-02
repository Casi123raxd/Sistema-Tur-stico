package bo.edu.usb.cotapata.filter;

import bo.edu.usb.cotapata.model.Usuario;
import bo.edu.usb.cotapata.util.CsrfUtil;
import bo.edu.usb.cotapata.util.JsonUtil;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * Filtro de seguridad obligatorio para las rutas administrativas (/api/admin/*).
 * Verifica la existencia de una sesión de servidor válida con usuario autenticado
 * y valida el token CSRF para operaciones de modificación (POST, PUT, DELETE).
 */
@WebFilter("/api/admin/*")
public class AuthFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        HttpSession session = httpRequest.getSession(false);
        Usuario usuario = (session != null) ? (Usuario) session.getAttribute("usuario") : null;

        if (usuario == null) {
            JsonUtil.sendErrorResponse(httpResponse, HttpServletResponse.SC_UNAUTHORIZED, 
                "Acceso no autorizado. Debe iniciar sesión en el panel administrativo.");
            return;
        }

        // Para peticiones que mutan estado (POST, PUT, DELETE), verificar token CSRF
        String method = httpRequest.getMethod().toUpperCase();
        if ("POST".equals(method) || "PUT".equals(method) || "DELETE".equals(method)) {
            if (!CsrfUtil.validateToken(httpRequest)) {
                JsonUtil.sendErrorResponse(httpResponse, HttpServletResponse.SC_FORBIDDEN, 
                    "Petición rechazada: Token CSRF inválido o ausente.");
                return;
            }
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {}
}
