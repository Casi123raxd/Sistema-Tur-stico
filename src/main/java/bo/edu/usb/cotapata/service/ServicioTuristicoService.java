package bo.edu.usb.cotapata.service;

import bo.edu.usb.cotapata.dao.ServicioDAO;
import bo.edu.usb.cotapata.model.ServicioComunitario;

import java.util.List;

public class ServicioTuristicoService {

    private final ServicioDAO servicioDAO;

    public ServicioTuristicoService() {
        this.servicioDAO = new ServicioDAO();
    }

    public List<ServicioComunitario> obtenerServiciosPublicados() {
        return servicioDAO.listarPublicados();
    }

    public List<ServicioComunitario> obtenerTodosLosServicios() {
        return servicioDAO.listarTodos();
    }

    public ServicioComunitario obtenerPorId(int id) {
        if (id <= 0) return null;
        return servicioDAO.findById(id);
    }

    public boolean guardarServicio(ServicioComunitario servicio) {
        if (servicio == null) return false;
        if (servicio.getNombreServicio() == null || servicio.getNombreServicio().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del servicio comunitario es obligatorio.");
        }
        if (servicio.getComunidad() == null || servicio.getComunidad().trim().isEmpty()) {
            throw new IllegalArgumentException("La comunidad de origen del servicio es obligatoria.");
        }
        if (servicio.getDescripcionEs() == null || servicio.getDescripcionEs().trim().isEmpty()) {
            throw new IllegalArgumentException("La descripción en español es requerida.");
        }

        if (servicio.getIdServicio() > 0 && servicioDAO.findById(servicio.getIdServicio()) != null) {
            return servicioDAO.actualizar(servicio);
        } else {
            return servicioDAO.insertar(servicio);
        }
    }

    public boolean cambiarEstado(int id, String nuevoEstado) {
        if (id <= 0 || nuevoEstado == null) return false;
        return servicioDAO.cambiarEstado(id, nuevoEstado);
    }
}
