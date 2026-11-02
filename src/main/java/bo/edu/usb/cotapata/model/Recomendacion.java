package bo.edu.usb.cotapata.model;

import org.json.JSONObject;

public class Recomendacion {
    private int idRecomendacion;
    private String categoria;
    private String icono;
    private String tituloEs;
    private String tituloEn;
    private String descripcionEs;
    private String descripcionEn;
    private String consejoPracticoEs;
    private String consejoPracticoEn;
    private int prioridad;
    private String estadoValidacion;
    private int idAutorizacion;

    public Recomendacion() {}

    public JSONObject toJson(String lang) {
        JSONObject obj = new JSONObject();
        obj.put("id", idRecomendacion);
        obj.put("categoria", categoria);
        obj.put("icono", icono != null ? icono : "🌿");
        
        boolean isEn = "en".equalsIgnoreCase(lang);
        obj.put("titulo", isEn && tituloEn != null && !tituloEn.isEmpty() ? tituloEn : tituloEs);
        obj.put("tituloEs", tituloEs);
        obj.put("tituloEn", tituloEn);
        
        obj.put("descripcion", isEn && descripcionEn != null && !descripcionEn.isEmpty() ? descripcionEn : descripcionEs);
        obj.put("descripcionEs", descripcionEs);
        obj.put("descripcionEn", descripcionEn);
        
        obj.put("consejoPractico", isEn && consejoPracticoEn != null && !consejoPracticoEn.isEmpty() ? consejoPracticoEn : consejoPracticoEs);
        obj.put("consejoPracticoEs", consejoPracticoEs);
        obj.put("consejoPracticoEn", consejoPracticoEn);
        
        obj.put("prioridad", prioridad);
        obj.put("estadoValidacion", estadoValidacion);
        obj.put("idAutorizacion", idAutorizacion);
        return obj;
    }

    // Getters y Setters
    public int getIdRecomendacion() { return idRecomendacion; }
    public void setIdRecomendacion(int idRecomendacion) { this.idRecomendacion = idRecomendacion; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getIcono() { return icono; }
    public void setIcono(String icono) { this.icono = icono; }

    public String getTituloEs() { return tituloEs; }
    public void setTituloEs(String tituloEs) { this.tituloEs = tituloEs; }

    public String getTituloEn() { return tituloEn; }
    public void setTituloEn(String tituloEn) { this.tituloEn = tituloEn; }

    public String getDescripcionEs() { return descripcionEs; }
    public void setDescripcionEs(String descripcionEs) { this.descripcionEs = descripcionEs; }

    public String getDescripcionEn() { return descripcionEn; }
    public void setDescripcionEn(String descripcionEn) { this.descripcionEn = descripcionEn; }

    public String getConsejoPracticoEs() { return consejoPracticoEs; }
    public void setConsejoPracticoEs(String consejoPracticoEs) { this.consejoPracticoEs = consejoPracticoEs; }

    public String getConsejoPracticoEn() { return consejoPracticoEn; }
    public void setConsejoPracticoEn(String consejoPracticoEn) { this.consejoPracticoEn = consejoPracticoEn; }

    public int getPrioridad() { return prioridad; }
    public void setPrioridad(int prioridad) { this.prioridad = prioridad; }

    public String getEstadoValidacion() { return estadoValidacion; }
    public void setEstadoValidacion(String estadoValidacion) { this.estadoValidacion = estadoValidacion; }

    public int getIdAutorizacion() { return idAutorizacion; }
    public void setIdAutorizacion(int idAutorizacion) { this.idAutorizacion = idAutorizacion; }
}
