package bo.edu.usb.cotapata.model;

import org.json.JSONObject;
import java.sql.Date;

public class Autorizacion {
    private int idAutorizacion;
    private String codigoAutorizacion;
    private String tipoEntidad;
    private String otorgadoPor;
    private String comunidad;
    private String observaciones;
    private Date fechaAutorizacion;
    private boolean vigente;

    public Autorizacion() {}

    public JSONObject toJson() {
        JSONObject obj = new JSONObject();
        obj.put("id", idAutorizacion);
        obj.put("codigo", codigoAutorizacion);
        obj.put("tipoEntidad", tipoEntidad);
        obj.put("otorgadoPor", otorgadoPor);
        obj.put("comunidad", comunidad);
        obj.put("observaciones", observaciones != null ? observaciones : "");
        obj.put("fechaAutorizacion", fechaAutorizacion != null ? fechaAutorizacion.toString() : "");
        obj.put("vigente", vigente);
        return obj;
    }

    // Getters y Setters
    public int getIdAutorizacion() { return idAutorizacion; }
    public void setIdAutorizacion(int idAutorizacion) { this.idAutorizacion = idAutorizacion; }

    public String getCodigoAutorizacion() { return codigoAutorizacion; }
    public void setCodigoAutorizacion(String codigoAutorizacion) { this.codigoAutorizacion = codigoAutorizacion; }

    public String getTipoEntidad() { return tipoEntidad; }
    public void setTipoEntidad(String tipoEntidad) { this.tipoEntidad = tipoEntidad; }

    public String getOtorgadoPor() { return otorgadoPor; }
    public void setOtorgadoPor(String otorgadoPor) { this.otorgadoPor = otorgadoPor; }

    public String getComunidad() { return comunidad; }
    public void setComunidad(String comunidad) { this.comunidad = comunidad; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public Date getFechaAutorizacion() { return fechaAutorizacion; }
    public void setFechaAutorizacion(Date fechaAutorizacion) { this.fechaAutorizacion = fechaAutorizacion; }

    public boolean isVigente() { return vigente; }
    public void setVigente(boolean vigente) { this.vigente = vigente; }
}
