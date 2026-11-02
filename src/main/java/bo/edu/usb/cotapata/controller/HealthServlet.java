package bo.edu.usb.cotapata.controller;

import bo.edu.usb.cotapata.config.DatabaseConfig;
import bo.edu.usb.cotapata.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.IOException;
import java.time.Instant;

/**
 * Endpoint de comprobación de salud y disponibilidad (/api/health).
 * Utilizado por orquestadores de nube (Render, Railway, Docker, Kubernetes)
 * para pruebas de vida (liveness probe) y conexión a base de datos.
 */
@WebServlet("/api/health")
public class HealthServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        boolean dbOk = DatabaseConfig.testConnection();

        JSONObject health = new JSONObject();
        health.put("status", dbOk ? "UP" : "DEGRADED");
        health.put("service", "Cotapata Explora API");
        health.put("timestamp", Instant.now().toString());
        health.put("databaseConnected", dbOk);

        int httpStatus = dbOk ? HttpServletResponse.SC_OK : HttpServletResponse.SC_SERVICE_UNAVAILABLE;
        JsonUtil.sendJsonResponse(response, httpStatus, health);
    }
}
