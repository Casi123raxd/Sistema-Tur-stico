package bo.edu.usb.cotapata.model;

import org.json.JSONObject;
import java.math.BigDecimal;

public class RutaTuristica {
    private int idRuta;
    private String nombreEs;
    private String nombreEn;
    private String descripcionEs;
    private String descripcionEn;
    private BigDecimal distanciaKm;
    private String duracionHoras;
    private String dificultad;
    private int desnivelMetros;
    private String recomendacionesSeguridadEs;
    private String recomendacionesSeguridadEn;
    private String archivoImagen;
    private String estadoValidacion;
    private int idAutorizacion;

    public RutaTuristica() {}

    public JSONObject toJson(String lang) {
        JSONObject obj = new JSONObject();
        obj.put("id", idRuta);
        
        boolean isEn = "en".equalsIgnoreCase(lang);
        obj.put("nombre", isEn && nombreEn != null && !nombreEn.isEmpty() ? nombreEn : nombreEs);
        obj.put("nombreEs", nombreEs);
        obj.put("nombreEn", nombreEn);
        
        obj.put("descripcion", isEn && descripcionEn != null && !descripcionEn.isEmpty() ? descripcionEn : descripcionEs);
        obj.put("descripcionEs", descripcionEs);
        obj.put("descripcionEn", descripcionEn);
        
        obj.put("distanciaKm", distanciaKm != null ? distanciaKm.doubleValue() : 0.0);
        obj.put("duracionHoras", duracionHoras);
        obj.put("dificultad", dificultad);
        obj.put("desnivelMetros", desnivelMetros);
        
        obj.put("recomendacionesSeguridad", isEn && recomendacionesSeguridadEn != null && !recomendacionesSeguridadEn.isEmpty() ? recomendacionesSeguridadEn : recomendacionesSeguridadEs);
        obj.put("recomendacionesSeguridadEs", recomendacionesSeguridadEs);
        obj.put("recomendacionesSeguridadEn", recomendacionesSeguridadEn);
        
        obj.put("imagen", archivoImagen != null ? archivoImagen : "cotapata_aerial.jpg");
        obj.put("estadoValidacion", estadoValidacion);
        obj.put("idAutorizacion", idAutorizacion);
        return obj;
    }

    // Getters y Setters
    public int getIdRuta() { return idRuta; }
    public void setIdRuta(int idRuta) { this.idRuta = idRuta; }

    public String getNombreEs() { return nombreEs; }
    public void setNombreEs(String nombreEs) { this.nombreEs = nombreEs; }

    public String getNombreEn() { return nombreEn; }
    public void setNombreEn(String nombreEn) { this.nombreEn = nombreEn; }

    public String getDescripcionEs() { return descripcionEs; }
    public void setDescripcionEs(String descripcionEs) { this.descripcionEs = descripcionEs; }

    public String getDescripcionEn() { return descripcionEn; }
    public void setDescripcionEn(String descripcionEn) { this.descripcionEn = descripcionEn; }

    public BigDecimal getDistanciaKm() { return distanciaKm; }
    public void setDistanciaKm(BigDecimal distanciaKm) { this.distanciaKm = distanciaKm; }

    public String getDuracionHoras() { return duracionHoras; }
    public void setDuracionHoras(String duracionHoras) { this.duracionHoras = duracionHoras; }

    public String getDificultad() { return dificultad; }
    public void setDificultad(String dificultad) { this.dificultad = dificultad; }

    public int getDesnivelMetros() { return desnivelMetros; }
    public void setDesnivelMetros(int desnivelMetros) { this.desnivelMetros = desnivelMetros; }

    public String getRecomendacionesSeguridadEs() { return recomendacionesSeguridadEs; }
    public void setRecomendacionesSeguridadEs(String recomendacionesSeguridadEs) { this.recomendacionesSeguridadEs = recomendacionesSeguridadEs; }

    public String getRecomendacionesSeguridadEn() { return recomendacionesSeguridadEn; }
    public void setRecomendacionesSeguridadEn(String recomendacionesSeguridadEn) { this.recomendacionesSeguridadEn = recomendacionesSeguridadEn; }

    public String getArchivoImagen() { return archivoImagen; }
    public void setArchivoImagen(String archivoImagen) { this.archivoImagen = archivoImagen; }

    public String getEstadoValidacion() { return estadoValidacion; }
    public void setEstadoValidacion(String estadoValidacion) { this.estadoValidacion = estadoValidacion; }

    public int getIdAutorizacion() { return idAutorizacion; }
    public void setIdAutorizacion(int idAutorizacion) { this.idAutorizacion = idAutorizacion; }
}
