package bo.edu.usb.cotapata.model;

import org.json.JSONObject;
import java.sql.Timestamp;

public class MetricaInteraccion {
    private long idInteraccion;
    private String tipoConsulta;
    private int idRecurso;
    private String nombreRecurso;
    private String idioma;
    private Timestamp fechaHora;

    public MetricaInteraccion() {}

    public MetricaInteraccion(String tipoConsulta, int idRecurso, String nombreRecurso, String idioma) {
        this.tipoConsulta = tipoConsulta;
        this.idRecurso = idRecurso;
        this.nombreRecurso = nombreRecurso;
        this.idioma = idioma;
    }

    public JSONObject toJson() {
        JSONObject obj = new JSONObject();
        obj.put("id", idInteraccion);
        obj.put("tipoConsulta", tipoConsulta);
        obj.put("idRecurso", idRecurso);
        obj.put("nombreRecurso", nombreRecurso);
        obj.put("idioma", idioma);
        obj.put("fechaHora", fechaHora != null ? fechaHora.toString() : "");
        return obj;
    }

    // Getters y Setters
    public long getIdInteraccion() { return idInteraccion; }
    public void setIdInteraccion(long idInteraccion) { this.idInteraccion = idInteraccion; }

    public String getTipoConsulta() { return tipoConsulta; }
    public void setTipoConsulta(String tipoConsulta) { this.tipoConsulta = tipoConsulta; }

    public int getIdRecurso() { return idRecurso; }
    public void setIdRecurso(int idRecurso) { this.idRecurso = idRecurso; }

    public String getNombreRecurso() { return nombreRecurso; }
    public void setNombreRecurso(String nombreRecurso) { this.nombreRecurso = nombreRecurso; }

    public String getIdioma() { return idioma; }
    public void setIdioma(String idioma) { this.idioma = idioma; }

    public Timestamp getFechaHora() { return fechaHora; }
    public void setFechaHora(Timestamp fechaHora) { this.fechaHora = fechaHora; }
}
