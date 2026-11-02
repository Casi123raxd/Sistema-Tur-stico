package bo.edu.usb.cotapata.model;

import org.json.JSONObject;

public class Especie {
    private int id;
    private String tipo; // FAUNA, FLORA
    private String nombreEs;
    private String nombreEn;
    private String cientifico;
    private String categoriaFauna; // mamifero, ave, roedor, no_aplica
    private String descripcionEs;
    private String descripcionEn;
    private String datoCuriosoEs;
    private String datoCuriosoEn;
    private String imagen;
    private String audio;
    private boolean esEndemica;
    private String estadoConservacion;
    private String habitat;
    private String dieta;
    private String estadoValidacion; // Borrador, Pendiente, Validado, Retirado
    private int idAutorizacion;

    public Especie() {}

    public JSONObject toJson(String lang) {
        JSONObject obj = new JSONObject();
        obj.put("id", id);
        obj.put("tipo", tipo != null ? tipo.toLowerCase() : "fauna");
        
        boolean isEn = "en".equalsIgnoreCase(lang);
        obj.put("nombre", isEn && nombreEn != null && !nombreEn.isEmpty() ? nombreEn : nombreEs);
        obj.put("nombreEs", nombreEs);
        obj.put("nombreEn", nombreEn);
        obj.put("cientifico", cientifico);
        obj.put("categoriaFauna", categoriaFauna);
        
        obj.put("descripcion", isEn && descripcionEn != null && !descripcionEn.isEmpty() ? descripcionEn : descripcionEs);
        obj.put("descripcionEs", descripcionEs);
        obj.put("descripcionEn", descripcionEn);
        
        obj.put("datoCurioso", isEn && datoCuriosoEn != null && !datoCuriosoEn.isEmpty() ? datoCuriosoEn : datoCuriosoEs);
        obj.put("datoCuriosoEs", datoCuriosoEs);
        obj.put("datoCuriosoEn", datoCuriosoEn);
        
        obj.put("imagen", imagen);
        obj.put("audio", audio != null ? audio : "");
        obj.put("tieneAudio", audio != null && !audio.trim().isEmpty());
        obj.put("esEndemica", esEndemica);
        obj.put("estadoConservacion", estadoConservacion);
        obj.put("habitat", habitat != null ? habitat : "");
        obj.put("dieta", dieta != null ? dieta : "");
        obj.put("estadoValidacion", estadoValidacion);
        obj.put("idAutorizacion", idAutorizacion);
        return obj;
    }

    // Getters y Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getNombreEs() { return nombreEs; }
    public void setNombreEs(String nombreEs) { this.nombreEs = nombreEs; }

    public String getNombreEn() { return nombreEn; }
    public void setNombreEn(String nombreEn) { this.nombreEn = nombreEn; }

    public String getCientifico() { return cientifico; }
    public void setCientifico(String cientifico) { this.cientifico = cientifico; }

    public String getCategoriaFauna() { return categoriaFauna; }
    public void setCategoriaFauna(String categoriaFauna) { this.categoriaFauna = categoriaFauna; }

    public String getDescripcionEs() { return descripcionEs; }
    public void setDescripcionEs(String descripcionEs) { this.descripcionEs = descripcionEs; }

    public String getDescripcionEn() { return descripcionEn; }
    public void setDescripcionEn(String descripcionEn) { this.descripcionEn = descripcionEn; }

    public String getDatoCuriosoEs() { return datoCuriosoEs; }
    public void setDatoCuriosoEs(String datoCuriosoEs) { this.datoCuriosoEs = datoCuriosoEs; }

    public String getDatoCuriosoEn() { return datoCuriosoEn; }
    public void setDatoCuriosoEn(String datoCuriosoEn) { this.datoCuriosoEn = datoCuriosoEn; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public String getAudio() { return audio; }
    public void setAudio(String audio) { this.audio = audio; }

    public boolean isEsEndemica() { return esEndemica; }
    public void setEsEndemica(boolean esEndemica) { this.esEndemica = esEndemica; }

    public String getEstadoConservacion() { return estadoConservacion; }
    public void setEstadoConservacion(String estadoConservacion) { this.estadoConservacion = estadoConservacion; }

    public String getHabitat() { return habitat; }
    public void setHabitat(String habitat) { this.habitat = habitat; }

    public String getDieta() { return dieta; }
    public void setDieta(String dieta) { this.dieta = dieta; }

    public String getEstadoValidacion() { return estadoValidacion; }
    public void setEstadoValidacion(String estadoValidacion) { this.estadoValidacion = estadoValidacion; }

    public int getIdAutorizacion() { return idAutorizacion; }
    public void setIdAutorizacion(int idAutorizacion) { this.idAutorizacion = idAutorizacion; }
}
