package bo.edu.usb.cotapata.controller;

import bo.edu.usb.cotapata.model.Especie;
import bo.edu.usb.cotapata.service.EspecieService;
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

/**
 * Endpoint de compatibilidad retroactiva con la versión anterior (/api/contenidos).
 * Asegura que cualquier componente antiguo continúe funcionando perfectamente.
 */
@WebServlet("/api/contenidos")
public class ContenidoServlet extends HttpServlet {

    private EspecieService especieService;

    @Override
    public void init() throws ServletException {
        this.especieService = new EspecieService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String idiomaParam = request.getParameter("idioma");
        String lang = "2".equals(idiomaParam) ? "en" : "es";

        List<Especie> lista = especieService.obtenerEspeciesPublicadas();
        JSONArray array = new JSONArray();

        for (Especie esp : lista) {
            JSONObject item = new JSONObject();
            item.put("id", esp.getId());
            item.put("tipo", esp.getTipo() != null ? esp.getTipo() : "FAUNA");
            
            String titulo = "en".equals(lang) && esp.getNombreEn() != null ? esp.getNombreEn() : esp.getNombreEs();
            if (esp.getCientifico() != null && !esp.getCientifico().isEmpty()) {
                titulo += " - " + esp.getCientifico();
            }
            item.put("titulo", titulo);
            item.put("cientifico", esp.getCientifico() != null ? esp.getCientifico() : "");

            String texto = "en".equals(lang) && esp.getDescripcionEn() != null ? esp.getDescripcionEn() : esp.getDescripcionEs();
            String curioso = "en".equals(lang) && esp.getDatoCuriosoEn() != null ? esp.getDatoCuriosoEn() : esp.getDatoCuriosoEs();
            
            if (curioso != null && !curioso.isEmpty()) {
                texto += "<br><br><b>" + ("en".equals(lang) ? "Fun Fact:" : "Dato Curioso:") + "</b> " + curioso;
            }

            item.put("texto", texto != null ? texto : "");
            item.put("img", esp.getImagen());
            item.put("audio", esp.getAudio());
            array.put(item);
        }

        JsonUtil.sendJsonResponse(response, array);
    }
}
