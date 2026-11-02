package bo.edu.usb.cotapata.service;

import bo.edu.usb.cotapata.dao.MetricaDAO;
import bo.edu.usb.cotapata.model.MetricaInteraccion;
import org.json.JSONObject;

public class MetricaService {

    private final MetricaDAO metricaDAO;

    public MetricaService() {
        this.metricaDAO = new MetricaDAO();
    }

    public boolean registrarConsulta(String tipo, int idRecurso, String nombreRecurso, String idioma) {
        MetricaInteraccion m = new MetricaInteraccion(tipo, idRecurso, nombreRecurso, idioma);
        return metricaDAO.registrar(m);
    }

    public JSONObject obtenerMetricasAgregadas() {
        return metricaDAO.obtenerEstadisticasAgregadas();
    }
}
