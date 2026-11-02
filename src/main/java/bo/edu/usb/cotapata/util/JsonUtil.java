package bo.edu.usb.cotapata.util;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Utilidades para serialización, parsing y respuesta HTTP en formato JSON.
 * Previene vulnerabilidades de inyección y malformación de caracteres.
 */
public class JsonUtil {

    /**
     * Envía una respuesta JSON exitosa con código HTTP 200.
     */
    public static void sendJsonResponse(HttpServletResponse response, Object jsonObject) throws IOException {
        sendJsonResponse(response, HttpServletResponse.SC_OK, jsonObject);
    }

    /**
     * Envía una respuesta JSON con código de estado HTTP específico.
     */
    public static void sendJsonResponse(HttpServletResponse response, int statusCode, Object jsonObject) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(statusCode);
        PrintWriter out = response.getWriter();
        if (jsonObject != null) {
            out.print(jsonObject.toString());
        } else {
            out.print("{}");
        }
        out.flush();
    }

    /**
     * Envía una respuesta de error JSON estructurada sin filtrar información sensible del servidor.
     */
    public static void sendErrorResponse(HttpServletResponse response, int statusCode, String message) throws IOException {
        JSONObject error = new JSONObject();
        error.put("success", false);
        error.put("error", message);
        error.put("status", statusCode);
        sendJsonResponse(response, statusCode, error);
    }

    /**
     * Envía una respuesta de éxito estándar.
     */
    public static void sendSuccessResponse(HttpServletResponse response, String message) throws IOException {
        JSONObject obj = new JSONObject();
        obj.put("success", true);
        obj.put("message", message);
        sendJsonResponse(response, HttpServletResponse.SC_OK, obj);
    }

    /**
     * Lee y parsea el cuerpo de una solicitud HTTP entrante a un JSONObject.
     */
    public static JSONObject parseRequestBody(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        String body = sb.toString().trim();
        if (body.isEmpty()) {
            return new JSONObject();
        }
        return new JSONObject(body);
    }
}
