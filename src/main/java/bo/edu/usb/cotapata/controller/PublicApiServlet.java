package bo.edu.usb.cotapata.controller;

import bo.edu.usb.cotapata.model.*;
import bo.edu.usb.cotapata.service.*;
import bo.edu.usb.cotapata.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/publico/*")
public class PublicApiServlet extends HttpServlet {

    private EspecieService especieService;
    private ServicioTuristicoService servicioService;
    private AtractivoService atractivoService;
    private RutaService rutaService;
    private RecomendacionService recomendacionService;
    private MetricaService metricaService;

    @Override
    public void init() throws ServletException {
        this.especieService = new EspecieService();
        this.servicioService = new ServicioTuristicoService();
        this.atractivoService = new AtractivoService();
        this.rutaService = new RutaService();
        this.recomendacionService = new RecomendacionService();
        this.metricaService = new MetricaService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String pathInfo = request.getPathInfo();
        String lang = request.getParameter("lang");
        if (lang == null || lang.trim().isEmpty()) {
            lang = "es";
        }

        if (pathInfo == null || pathInfo.equals("/")) {
            JSONObject root = new JSONObject();
            root.put("sistema", "COTAPATA EXPLORA");
            root.put("version", "1.0.0");
            root.put("endpoints", new String[]{
                "/api/publico/especies",
                "/api/publico/servicios",
                "/api/publico/atractivos",
                "/api/publico/rutas",
                "/api/publico/recomendaciones",
                "/api/publico/metricas"
            });
            JsonUtil.sendJsonResponse(response, root);
            return;
        }

        try {
            switch (pathInfo) {
                case "/especies":
                    handleEspecies(request, response, lang);
                    break;
                case "/servicios":
                    handleServicios(request, response, lang);
                    break;
                case "/atractivos":
                    handleAtractivos(request, response, lang);
                    break;
                case "/rutas":
                    handleRutas(request, response, lang);
                    break;
                case "/recomendaciones":
                    handleRecomendaciones(request, response, lang);
                    break;
                case "/metricas":
                    JSONObject stats = metricaService.obtenerMetricasAgregadas();
                    JsonUtil.sendJsonResponse(response, stats);
                    break;
                default:
                    JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_NOT_FOUND, "Recurso público no encontrado");
                    break;
            }
        } catch (Exception e) {
            JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error interno al procesar la consulta pública");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String pathInfo = request.getPathInfo();
        if ("/interaccion".equals(pathInfo)) {
            try {
                JSONObject body = JsonUtil.parseRequestBody(request);
                String tipo = body.optString("tipo", "GENERAL");
                int idRecurso = body.optInt("idRecurso", 0);
                String nombreRecurso = body.optString("nombreRecurso", "");
                String idioma = body.optString("idioma", "es");

                metricaService.registrarConsulta(tipo, idRecurso, nombreRecurso, idioma);
                JsonUtil.sendSuccessResponse(response, "Interacción registrada correctamente");
            } catch (Exception e) {
                JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, "Solicitud de métrica inválida");
            }
        } else {
            JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_NOT_FOUND, "Endpoint POST no soportado");
        }
    }

    private void handleEspecies(HttpServletRequest request, HttpServletResponse response, String lang) throws IOException {
        List<Especie> lista = especieService.obtenerEspeciesPublicadas();
        String filtroTipo = request.getParameter("tipo"); // fauna, flora
        String query = request.getParameter("q"); // busqueda

        JSONArray arr = new JSONArray();
        for (Especie e : lista) {
            if (filtroTipo != null && !filtroTipo.equalsIgnoreCase("todos") && !filtroTipo.equalsIgnoreCase(e.getTipo())) {
                continue;
            }
            if (query != null && !query.trim().isEmpty()) {
                String qLower = query.toLowerCase();
                boolean matchNom = (e.getNombreEs() != null && e.getNombreEs().toLowerCase().contains(qLower)) ||
                                   (e.getNombreEn() != null && e.getNombreEn().toLowerCase().contains(qLower));
                boolean matchCient = (e.getCientifico() != null && e.getCientifico().toLowerCase().contains(qLower));
                if (!matchNom && !matchCient) {
                    continue;
                }
            }
            arr.put(e.toJson(lang));
        }
        JsonUtil.sendJsonResponse(response, arr);
    }

    private void handleServicios(HttpServletRequest request, HttpServletResponse response, String lang) throws IOException {
        List<ServicioComunitario> lista = servicioService.obtenerServiciosPublicados();
        String cat = request.getParameter("categoria");
        String comunidad = request.getParameter("comunidad");

        JSONArray arr = new JSONArray();
        for (ServicioComunitario s : lista) {
            if (cat != null && !cat.equalsIgnoreCase("todas") && !cat.equalsIgnoreCase(s.getCodigoCategoria())) {
                continue;
            }
            if (comunidad != null && !comunidad.equalsIgnoreCase("todas") && !comunidad.equalsIgnoreCase(s.getComunidad())) {
                continue;
            }
            arr.put(s.toJson(lang));
        }
        JsonUtil.sendJsonResponse(response, arr);
    }

    private void handleAtractivos(HttpServletRequest request, HttpServletResponse response, String lang) throws IOException {
        List<AtractivoTuristico> lista = atractivoService.obtenerAtractivosPublicados();
        JSONArray arr = new JSONArray();
        for (AtractivoTuristico a : lista) {
            arr.put(a.toJson(lang));
        }
        JsonUtil.sendJsonResponse(response, arr);
    }

    private void handleRutas(HttpServletRequest request, HttpServletResponse response, String lang) throws IOException {
        List<RutaTuristica> lista = rutaService.obtenerRutasPublicadas();
        JSONArray arr = new JSONArray();
        for (RutaTuristica r : lista) {
            arr.put(r.toJson(lang));
        }
        JsonUtil.sendJsonResponse(response, arr);
    }

    private void handleRecomendaciones(HttpServletRequest request, HttpServletResponse response, String lang) throws IOException {
        List<Recomendacion> lista = recomendacionService.obtenerRecomendacionesPublicadas();
        JSONArray arr = new JSONArray();
        for (Recomendacion r : lista) {
            arr.put(r.toJson(lang));
        }
        JsonUtil.sendJsonResponse(response, arr);
    }
}
