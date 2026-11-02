package bo.edu.usb.cotapata.service;

import bo.edu.usb.cotapata.dao.AtractivoDAO;
import bo.edu.usb.cotapata.model.AtractivoTuristico;

import java.util.List;

public class AtractivoService {

    private final AtractivoDAO atractivoDAO;

    public AtractivoService() {
        this.atractivoDAO = new AtractivoDAO();
    }

    public List<AtractivoTuristico> obtenerAtractivosPublicados() {
        return atractivoDAO.listarPublicados();
    }

    public List<AtractivoTuristico> obtenerTodosLosAtractivos() {
        return atractivoDAO.listarTodos();
    }

    public AtractivoTuristico obtenerPorId(int id) {
        if (id <= 0) return null;
        return atractivoDAO.findById(id);
    }

    public boolean guardarAtractivo(AtractivoTuristico atractivo) {
        if (atractivo == null) return false;
        if (atractivo.getNombreEs() == null || atractivo.getNombreEs().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del atractivo es obligatorio.");
        }
        if (atractivo.getDescripcionEs() == null || atractivo.getDescripcionEs().trim().isEmpty()) {
            throw new IllegalArgumentException("La descripción del atractivo es obligatoria.");
        }

        if (atractivo.getIdAtractivo() > 0 && atractivoDAO.findById(atractivo.getIdAtractivo()) != null) {
            return atractivoDAO.actualizar(atractivo);
        } else {
            return atractivoDAO.insertar(atractivo);
        }
    }

    public boolean cambiarEstado(int id, String nuevoEstado) {
        if (id <= 0 || nuevoEstado == null) return false;
        return atractivoDAO.cambiarEstado(id, nuevoEstado);
    }
}
