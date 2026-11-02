package bo.edu.usb.cotapata.controller;

import bo.edu.usb.cotapata.dao.AutorizacionDAO;
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
import java.math.BigDecimal;
import java.util.List;

@WebServlet("/api/admin/*")
public class AdminApiServlet extends HttpServlet {

    private EspecieService especieService;
    private ServicioTuristicoService servicioService;
    private AtractivoService atractivoService;
    private RutaService rutaService;
    private RecomendacionService recomendacionService;
    private MetricaService metricaService;
    private AutorizacionDAO autorizacionDAO;

    @Override
    public void init() throws ServletException {
        this.especieService = new EspecieService();
        this.servicioService = new ServicioTuristicoService();
        this.atractivoService = new AtractivoService();
        this.rutaService = new RutaService();
        this.recomendacionService = new RecomendacionService();
        this.metricaService = new MetricaService();
        this.autorizacionDAO = new AutorizacionDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String pathInfo = request.getPathInfo();
        if (pathInfo == null) pathInfo = "";

        try {
            switch (pathInfo) {
                case "/especies":
                    List<Especie> especies = especieService.obtenerTodasLasEspecies();
                    JSONArray arrEsp = new JSONArray();
                    for (Especie e : especies) arrEsp.put(e.toJson("es"));
                    JsonUtil.sendJsonResponse(response, arrEsp);
                    break;

                case "/servicios":
                    List<ServicioComunitario> servicios = servicioService.obtenerTodosLosServicios();
                    JSONArray arrServ = new JSONArray();
                    for (ServicioComunitario s : servicios) arrServ.put(s.toJson("es"));
                    JsonUtil.sendJsonResponse(response, arrServ);
                    break;

                case "/atractivos":
                    List<AtractivoTuristico> atractivos = atractivoService.obtenerTodosLosAtractivos();
                    JSONArray arrAtr = new JSONArray();
                    for (AtractivoTuristico a : atractivos) arrAtr.put(a.toJson("es"));
                    JsonUtil.sendJsonResponse(response, arrAtr);
                    break;

                case "/rutas":
                    List<RutaTuristica> rutas = rutaService.obtenerTodasLasRutas();
                    JSONArray arrRut = new JSONArray();
                    for (RutaTuristica r : rutas) arrRut.put(r.toJson("es"));
                    JsonUtil.sendJsonResponse(response, arrRut);
                    break;

                case "/recomendaciones":
                    List<Recomendacion> recomendaciones = recomendacionService.obtenerTodas();
                    JSONArray arrRec = new JSONArray();
                    for (Recomendacion r : recomendaciones) arrRec.put(r.toJson("es"));
                    JsonUtil.sendJsonResponse(response, arrRec);
                    break;

                case "/autorizaciones":
                    List<Autorizacion> autorizaciones = autorizacionDAO.listarTodas();
                    JSONArray arrAut = new JSONArray();
                    for (Autorizacion a : autorizaciones) arrAut.put(a.toJson());
                    JsonUtil.sendJsonResponse(response, arrAut);
                    break;

                case "/metricas":
                    JSONObject stats = metricaService.obtenerMetricasAgregadas();
                    JsonUtil.sendJsonResponse(response, stats);
                    break;

                default:
                    JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_NOT_FOUND, "Recurso administrativo GET no encontrado");
                    break;
            }
        } catch (Exception e) {
            JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error procesando consulta administrativa");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String pathInfo = request.getPathInfo();
        if (pathInfo == null) pathInfo = "";

        try {
            JSONObject body = JsonUtil.parseRequestBody(request);

            switch (pathInfo) {
                case "/especies":
                    guardarEspecie(body, response);
                    break;
                case "/especies/estado":
                    cambiarEstadoEspecie(body, response);
                    break;

                case "/servicios":
                    guardarServicio(body, response);
                    break;
                case "/servicios/estado":
                    cambiarEstadoServicio(body, response);
                    break;

                case "/atractivos":
                    guardarAtractivo(body, response);
                    break;
                case "/atractivos/estado":
                    cambiarEstadoAtractivo(body, response);
                    break;

                case "/rutas":
                    guardarRuta(body, response);
                    break;
                case "/rutas/estado":
                    cambiarEstadoRuta(body, response);
                    break;

                case "/recomendaciones":
                    guardarRecomendacion(body, response);
                    break;
                case "/recomendaciones/estado":
                    cambiarEstadoRecomendacion(body, response);
                    break;

                default:
                    JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_NOT_FOUND, "Recurso administrativo POST no encontrado");
                    break;
            }
        } catch (IllegalArgumentException e) {
            JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error al procesar la operación administrativa: " + e.getMessage());
        }
    }

    private void guardarEspecie(JSONObject body, HttpServletResponse response) throws IOException {
        Especie e = new Especie();
        e.setId(body.optInt("id", 0));
        e.setTipo(body.optString("tipo", "FAUNA"));
        e.setNombreEs(body.optString("nombreEs", ""));
        e.setNombreEn(body.optString("nombreEn", e.getNombreEs()));
        e.setCientifico(body.optString("cientifico", ""));
        e.setCategoriaFauna(body.optString("categoriaFauna", "no_aplica"));
        e.setDescripcionEs(body.optString("descripcionEs", ""));
        e.setDescripcionEn(body.optString("descripcionEn", e.getDescripcionEs()));
        e.setDatoCuriosoEs(body.optString("datoCuriosoEs", ""));
        e.setDatoCuriosoEn(body.optString("datoCuriosoEn", ""));
        e.setImagen(body.optString("imagen", "LOGOO.png"));
        e.setAudio(body.optString("audio", ""));
        e.setEsEndemica(body.optBoolean("esEndemica", false));
        e.setEstadoConservacion(body.optString("estadoConservacion", "Preocupación Menor (LC)"));
        e.setEstadoValidacion(body.optString("estadoValidacion", "Validado"));
        e.setIdAutorizacion(body.optInt("idAutorizacion", 1));

        boolean ok = especieService.guardarEspecie(e);
        if (ok) {
            JsonUtil.sendSuccessResponse(response, "Especie guardada satisfactoriamente en la base de datos.");
        } else {
            JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No se pudo guardar la especie.");
        }
    }

    private void cambiarEstadoEspecie(JSONObject body, HttpServletResponse response) throws IOException {
        int id = body.optInt("id", 0);
        String estado = body.optString("estado", "Retirado");
        boolean ok = especieService.cambiarEstado(id, estado);
        if (ok) {
            JsonUtil.sendSuccessResponse(response, "Estado de la especie actualizado a: " + estado);
        } else {
            JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, "No se pudo actualizar el estado de la especie.");
        }
    }

    private void guardarServicio(JSONObject body, HttpServletResponse response) throws IOException {
        ServicioComunitario s = new ServicioComunitario();
        s.setIdServicio(body.optInt("id", 0));
        s.setIdCategoria(body.optInt("idCategoria", 1));
        s.setIdComunario(body.optInt("idComunario", 1));
        s.setNombreServicio(body.optString("nombre", ""));
        s.setDescripcionEs(body.optString("descripcionEs", ""));
        s.setDescripcionEn(body.optString("descripcionEn", s.getDescripcionEs()));
        s.setComunidad(body.optString("comunidad", ""));
        s.setUbicacionReferencial(body.optString("ubicacionReferencial", ""));
        s.setHorarioAtencion(body.optString("horarioAtencion", "Horario referencial"));
        s.setRangoPrecios(body.optString("rangoPrecios", "Precios comunitarios"));
        s.setIdiomasAtencion(body.optString("idiomasAtencion", "Español"));
        s.setArchivoImagen(body.optString("imagen", "jungle_banner.jpg"));
        s.setEstadoValidacion(body.optString("estadoValidacion", "Validado"));
        s.setIdAutorizacion(body.optInt("idAutorizacion", 2));

        boolean ok = servicioService.guardarServicio(s);
        if (ok) {
            JsonUtil.sendSuccessResponse(response, "Servicio comunitario guardado con éxito.");
        } else {
            JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No se pudo guardar el servicio.");
        }
    }

    private void cambiarEstadoServicio(JSONObject body, HttpServletResponse response) throws IOException {
        int id = body.optInt("id", 0);
        String estado = body.optString("estado", "Retirado");
        boolean ok = servicioService.cambiarEstado(id, estado);
        if (ok) {
            JsonUtil.sendSuccessResponse(response, "Estado del servicio actualizado a: " + estado);
        } else {
            JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, "No se pudo actualizar el estado del servicio.");
        }
    }

    private void guardarAtractivo(JSONObject body, HttpServletResponse response) throws IOException {
        AtractivoTuristico a = new AtractivoTuristico();
        a.setIdAtractivo(body.optInt("id", 0));
        a.setNombreEs(body.optString("nombreEs", ""));
        a.setNombreEn(body.optString("nombreEn", a.getNombreEs()));
        a.setCategoria(body.optString("categoria", "Patrimonio Natural"));
        a.setDescripcionEs(body.optString("descripcionEs", ""));
        a.setDescripcionEn(body.optString("descripcionEn", a.getDescripcionEs()));

        if (body.has("latitud") && !body.isNull("latitud")) {
            a.setLatitud(new BigDecimal(body.getDouble("latitud")));
        }
        if (body.has("longitud") && !body.isNull("longitud")) {
            a.setLongitud(new BigDecimal(body.getDouble("longitud")));
        }
        if (body.has("altitudMsnm") && !body.isNull("altitudMsnm")) {
            a.setAltitudMsnm(body.getInt("altitudMsnm"));
        }

        a.setRecomendacionesEs(body.optString("recomendacionesEs", ""));
        a.setRecomendacionesEn(body.optString("recomendacionesEn", a.getRecomendacionesEs()));
        a.setArchivoImagen(body.optString("imagen", "cotapata_aerial.jpg"));
        a.setEstadoValidacion(body.optString("estadoValidacion", "Validado"));
        a.setIdAutorizacion(body.optInt("idAutorizacion", 4));

        boolean ok = atractivoService.guardarAtractivo(a);
        if (ok) {
            JsonUtil.sendSuccessResponse(response, "Atractivo turístico guardado correctamente.");
        } else {
            JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No se pudo guardar el atractivo.");
        }
    }

    private void cambiarEstadoAtractivo(JSONObject body, HttpServletResponse response) throws IOException {
        int id = body.optInt("id", 0);
        String estado = body.optString("estado", "Retirado");
        boolean ok = atractivoService.cambiarEstado(id, estado);
        if (ok) {
            JsonUtil.sendSuccessResponse(response, "Estado del atractivo actualizado a: " + estado);
        } else {
            JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, "No se pudo actualizar el estado del atractivo.");
        }
    }

    private void guardarRuta(JSONObject body, HttpServletResponse response) throws IOException {
        RutaTuristica r = new RutaTuristica();
        r.setIdRuta(body.optInt("id", 0));
        r.setNombreEs(body.optString("nombreEs", ""));
        r.setNombreEn(body.optString("nombreEn", r.getNombreEs()));
        r.setDescripcionEs(body.optString("descripcionEs", ""));
        r.setDescripcionEn(body.optString("descripcionEn", r.getDescripcionEs()));
        r.setDistanciaKm(new BigDecimal(body.optDouble("distanciaKm", 10.0)));
        r.setDuracionHoras(body.optString("duracionHoras", "4 horas"));
        r.setDificultad(body.optString("dificultad", "Media"));
        r.setDesnivelMetros(body.optInt("desnivelMetros", 500));
        r.setRecomendacionesSeguridadEs(body.optString("recomendacionesSeguridadEs", "Seguir las huellas oficiales"));
        r.setRecomendacionesSeguridadEn(body.optString("recomendacionesSeguridadEn", r.getRecomendacionesSeguridadEs()));
        r.setArchivoImagen(body.optString("imagen", "cotapata_aerial.jpg"));
        r.setEstadoValidacion(body.optString("estadoValidacion", "Validado"));
        r.setIdAutorizacion(body.optInt("idAutorizacion", 4));

        boolean ok = rutaService.guardarRuta(r);
        if (ok) {
            JsonUtil.sendSuccessResponse(response, "Ruta turística guardada exitosamente.");
        } else {
            JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No se pudo guardar la ruta.");
        }
    }

    private void cambiarEstadoRuta(JSONObject body, HttpServletResponse response) throws IOException {
        int id = body.optInt("id", 0);
        String estado = body.optString("estado", "Retirado");
        boolean ok = rutaService.cambiarEstado(id, estado);
        if (ok) {
            JsonUtil.sendSuccessResponse(response, "Estado de la ruta actualizado a: " + estado);
        } else {
            JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, "No se pudo actualizar el estado de la ruta.");
        }
    }

    private void guardarRecomendacion(JSONObject body, HttpServletResponse response) throws IOException {
        Recomendacion r = new Recomendacion();
        r.setIdRecomendacion(body.optInt("id", 0));
        r.setCategoria(body.optString("categoria", "General"));
        r.setIcono(body.optString("icono", "🌿"));
        r.setTituloEs(body.optString("tituloEs", ""));
        r.setTituloEn(body.optString("tituloEn", r.getTituloEs()));
        r.setDescripcionEs(body.optString("descripcionEs", ""));
        r.setDescripcionEn(body.optString("descripcionEn", r.getDescripcionEs()));
        r.setConsejoPracticoEs(body.optString("consejoPracticoEs", ""));
        r.setConsejoPracticoEn(body.optString("consejoPracticoEn", r.getConsejoPracticoEs()));
        r.setPrioridad(body.optInt("prioridad", 1));
        r.setEstadoValidacion(body.optString("estadoValidacion", "Validado"));
        r.setIdAutorizacion(body.optInt("idAutorizacion", 1));

        boolean ok = recomendacionService.guardarRecomendacion(r);
        if (ok) {
            JsonUtil.sendSuccessResponse(response, "Recomendación guardada con éxito.");
        } else {
            JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No se pudo guardar la recomendación.");
        }
    }

    private void cambiarEstadoRecomendacion(JSONObject body, HttpServletResponse response) throws IOException {
        int id = body.optInt("id", 0);
        String estado = body.optString("estado", "Retirado");
        boolean ok = recomendacionService.cambiarEstado(id, estado);
        if (ok) {
            JsonUtil.sendSuccessResponse(response, "Estado de la recomendación actualizado a: " + estado);
        } else {
            JsonUtil.sendErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, "No se pudo actualizar el estado de la recomendación.");
        }
    }
}
