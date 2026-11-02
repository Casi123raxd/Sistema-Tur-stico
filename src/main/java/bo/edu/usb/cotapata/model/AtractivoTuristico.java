package bo.edu.usb.cotapata.model;

import org.json.JSONObject;
import java.math.BigDecimal;

public class AtractivoTuristico {
    private int idAtractivo;
    private String nombreEs;
    private String nombreEn;
    private String categoria;
    private String descripcionEs;
    private String descripcionEn;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private Integer altitudMsnm;
    private String recomendacionesEs;
    private String recomendacionesEn;
    private String archivoImagen;
    private String estadoValidacion;
    private int idAutorizacion;

    public AtractivoTuristico() {}

    public JSONObject toJson(String lang) {
        JSONObject obj = new JSONObject();
        obj.put("id", idAtractivo);
        
        boolean isEn = "en".equalsIgnoreCase(lang);
        obj.put("nombre", isEn && nombreEn != null && !nombreEn.isEmpty() ? nombreEn : nombreEs);
        obj.put("nombreEs", nombreEs);
        obj.put("nombreEn", nombreEn);
        obj.put("categoria", categoria);
        
        obj.put("descripcion", isEn && descripcionEn != null && !descripcionEn.isEmpty() ? descripcionEn : descripcionEs);
        obj.put("descripcionEs", descripcionEs);
        obj.put("descripcionEn", descripcionEn);
        
        if (latitud != null && longitud != null) {
            obj.put("latitud", latitud.doubleValue());
            obj.put("longitud", longitud.doubleValue());
            obj.put("tieneCoordenadas", true);
        } else {
            obj.put("tieneCoordenadas", false);
        }
        
        obj.put("altitudMsnm", altitudMsnm != null ? altitudMsnm : 0);
        obj.put("recomendaciones", isEn && recomendacionesEn != null && !recomendacionesEn.isEmpty() ? recomendacionesEn : recomendacionesEs);
        obj.put("recomendacionesEs", recomendacionesEs);
        obj.put("recomendacionesEn", recomendacionesEn);
        obj.put("imagen", archivoImagen != null ? archivoImagen : "cotapata_aerial.jpg");
        obj.put("estadoValidacion", estadoValidacion);
        obj.put("idAutorizacion", idAutorizacion);
        return obj;
    }

    // Getters y Setters
    public int getIdAtractivo() { return idAtractivo; }
    public void setIdAtractivo(int idAtractivo) { this.idAtractivo = idAtractivo; }

    public String getNombreEs() { return nombreEs; }
    public void setNombreEs(String nombreEs) { this.nombreEs = nombreEs; }

    public String getNombreEn() { return nombreEn; }
    public void setNombreEn(String nombreEn) { this.nombreEn = nombreEn; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getDescripcionEs() { return descripcionEs; }
    public void setDescripcionEs(String descripcionEs) { this.descripcionEs = descripcionEs; }

    public String getDescripcionEn() { return descripcionEn; }
    public void setDescripcionEn(String descripcionEn) { this.descripcionEn = descripcionEn; }

    public BigDecimal getLatitud() { return latitud; }
    public void setLatitud(BigDecimal latitud) { this.latitud = latitud; }

    public BigDecimal getLongitud() { return longitud; }
    public void setLongitud(BigDecimal longitud) { this.longitud = longitud; }

    public Integer getAltitudMsnm() { return altitudMsnm; }
    public void setAltitudMsnm(Integer altitudMsnm) { this.altitudMsnm = altitudMsnm; }

    public String getRecomendacionesEs() { return recomendacionesEs; }
    public void setRecomendacionesEs(String recomendacionesEs) { this.recomendacionesEs = recomendacionesEs; }

    public String getRecomendacionesEn() { return recomendacionesEn; }
    public void setRecomendacionesEn(String recomendacionesEn) { this.recomendacionesEn = recomendacionesEn; }

    public String getArchivoImagen() { return archivoImagen; }
    public void setArchivoImagen(String archivoImagen) { this.archivoImagen = archivoImagen; }

    public String getEstadoValidacion() { return estadoValidacion; }
    public void setEstadoValidacion(String estadoValidacion) { this.estadoValidacion = estadoValidacion; }

    public int getIdAutorizacion() { return idAutorizacion; }
    public void setIdAutorizacion(int idAutorizacion) { this.idAutorizacion = idAutorizacion; }
}
