package bo.edu.usb.cotapata.service;

import bo.edu.usb.cotapata.dao.RecomendacionDAO;
import bo.edu.usb.cotapata.model.Recomendacion;

import java.util.List;

public class RecomendacionService {

    private final RecomendacionDAO recomendacionDAO;

    public RecomendacionService() {
        this.recomendacionDAO = new RecomendacionDAO();
    }

    public List<Recomendacion> obtenerRecomendacionesPublicadas() {
        return recomendacionDAO.listarPublicadas();
    }

    public List<Recomendacion> obtenerTodas() {
        return recomendacionDAO.listarTodas();
    }

    public Recomendacion obtenerPorId(int id) {
        if (id <= 0) return null;
        return recomendacionDAO.findById(id);
    }

    public boolean guardarRecomendacion(Recomendacion r) {
        if (r == null) return false;
        if (r.getTituloEs() == null || r.getTituloEs().trim().isEmpty()) {
            throw new IllegalArgumentException("El título de la recomendación es obligatorio.");
        }
        if (r.getDescripcionEs() == null || r.getDescripcionEs().trim().isEmpty()) {
            throw new IllegalArgumentException("La descripción es obligatoria.");
        }

        if (r.getIdRecomendacion() > 0 && recomendacionDAO.findById(r.getIdRecomendacion()) != null) {
            return recomendacionDAO.actualizar(r);
        } else {
            return recomendacionDAO.insertar(r);
        }
    }

    public boolean cambiarEstado(int id, String nuevoEstado) {
        if (id <= 0 || nuevoEstado == null) return false;
        return recomendacionDAO.cambiarEstado(id, nuevoEstado);
    }
}
