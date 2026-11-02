package bo.edu.usb.cotapata.model;

import org.json.JSONObject;

public class ServicioComunitario {
    private int idServicio;
    private int idCategoria;
    private String codigoCategoria;
    private String nombreCategoriaEs;
    private String nombreCategoriaEn;
    private String iconoCategoria;
    private int idComunario;
    private String nombreComunario;
    private String nombreServicio;
    private String descripcionEs;
    private String descripcionEn;
    private String comunidad;
    private String ubicacionReferencial;
    private String horarioAtencion;
    private String rangoPrecios;
    private String idiomasAtencion;
    private String archivoImagen;
    private String estadoValidacion;
    private int idAutorizacion;

    public ServicioComunitario() {}

    public JSONObject toJson(String lang) {
        JSONObject obj = new JSONObject();
        obj.put("id", idServicio);
        obj.put("idCategoria", idCategoria);
        obj.put("categoria", codigoCategoria != null ? codigoCategoria : "servicios");
        
        boolean isEn = "en".equalsIgnoreCase(lang);
        obj.put("nombreCategoria", isEn && nombreCategoriaEn != null ? nombreCategoriaEn : nombreCategoriaEs);
        obj.put("iconoCategoria", iconoCategoria != null ? iconoCategoria : "🏡");
        obj.put("nombre", nombreServicio);
        obj.put("descripcion", isEn && descripcionEn != null && !descripcionEn.isEmpty() ? descripcionEn : descripcionEs);
        obj.put("descripcionEs", descripcionEs);
        obj.put("descripcionEn", descripcionEn);
        obj.put("comunidad", comunidad);
        obj.put("ubicacionReferencial", ubicacionReferencial);
        obj.put("horarioAtencion", horarioAtencion != null ? horarioAtencion : "Información pendiente de validación");
        obj.put("rangoPrecios", rangoPrecios != null ? rangoPrecios : "Tarifa comunitaria referencial");
        obj.put("idiomasAtencion", idiomasAtencion);
        obj.put("imagen", archivoImagen != null ? archivoImagen : "jungle_banner.jpg");
        obj.put("estadoValidacion", estadoValidacion);
        obj.put("idAutorizacion", idAutorizacion);
        return obj;
    }

    // Getters y Setters
    public int getIdServicio() { return idServicio; }
    public void setIdServicio(int idServicio) { this.idServicio = idServicio; }

    public int getIdCategoria() { return idCategoria; }
    public void setIdCategoria(int idCategoria) { this.idCategoria = idCategoria; }

    public String getCodigoCategoria() { return codigoCategoria; }
    public void setCodigoCategoria(String codigoCategoria) { this.codigoCategoria = codigoCategoria; }

    public String getNombreCategoriaEs() { return nombreCategoriaEs; }
    public void setNombreCategoriaEs(String nombreCategoriaEs) { this.nombreCategoriaEs = nombreCategoriaEs; }

    public String getNombreCategoriaEn() { return nombreCategoriaEn; }
    public void setNombreCategoriaEn(String nombreCategoriaEn) { this.nombreCategoriaEn = nombreCategoriaEn; }

    public String getIconoCategoria() { return iconoCategoria; }
    public void setIconoCategoria(String iconoCategoria) { this.iconoCategoria = iconoCategoria; }

    public int getIdComunario() { return idComunario; }
    public void setIdComunario(int idComunario) { this.idComunario = idComunario; }

    public String getNombreComunario() { return nombreComunario; }
    public void setNombreComunario(String nombreComunario) { this.nombreComunario = nombreComunario; }

    public String getNombreServicio() { return nombreServicio; }
    public void setNombreServicio(String nombreServicio) { this.nombreServicio = nombreServicio; }

    public String getDescripcionEs() { return descripcionEs; }
    public void setDescripcionEs(String descripcionEs) { this.descripcionEs = descripcionEs; }

    public String getDescripcionEn() { return descripcionEn; }
    public void setDescripcionEn(String descripcionEn) { this.descripcionEn = descripcionEn; }

    public String getComunidad() { return comunidad; }
    public void setComunidad(String comunidad) { this.comunidad = comunidad; }

    public String getUbicacionReferencial() { return ubicacionReferencial; }
    public void setUbicacionReferencial(String ubicacionReferencial) { this.ubicacionReferencial = ubicacionReferencial; }

    public String getHorarioAtencion() { return horarioAtencion; }
    public void setHorarioAtencion(String horarioAtencion) { this.horarioAtencion = horarioAtencion; }

    public String getRangoPrecios() { return rangoPrecios; }
    public void setRangoPrecios(String rangoPrecios) { this.rangoPrecios = rangoPrecios; }

    public String getIdiomasAtencion() { return idiomasAtencion; }
    public void setIdiomasAtencion(String idiomasAtencion) { this.idiomasAtencion = idiomasAtencion; }

    public String getArchivoImagen() { return archivoImagen; }
    public void setArchivoImagen(String archivoImagen) { this.archivoImagen = archivoImagen; }

    public String getEstadoValidacion() { return estadoValidacion; }
    public void setEstadoValidacion(String estadoValidacion) { this.estadoValidacion = estadoValidacion; }

    public int getIdAutorizacion() { return idAutorizacion; }
    public void setIdAutorizacion(int idAutorizacion) { this.idAutorizacion = idAutorizacion; }
}
