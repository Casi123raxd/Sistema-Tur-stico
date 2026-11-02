package bo.edu.usb.cotapata.service;

import bo.edu.usb.cotapata.dao.RutaDAO;
import bo.edu.usb.cotapata.model.RutaTuristica;

import java.util.List;

public class RutaService {

    private final RutaDAO rutaDAO;

    public RutaService() {
        this.rutaDAO = new RutaDAO();
    }

    public List<RutaTuristica> obtenerRutasPublicadas() {
        return rutaDAO.listarPublicadas();
    }

    public List<RutaTuristica> obtenerTodasLasRutas() {
        return rutaDAO.listarTodas();
    }

    public RutaTuristica obtenerPorId(int id) {
        if (id <= 0) return null;
        return rutaDAO.findById(id);
    }

    public boolean guardarRuta(RutaTuristica ruta) {
        if (ruta == null) return false;
        if (ruta.getNombreEs() == null || ruta.getNombreEs().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la ruta es obligatorio.");
        }
        if (ruta.getDescripcionEs() == null || ruta.getDescripcionEs().trim().isEmpty()) {
            throw new IllegalArgumentException("La descripción de la ruta es obligatoria.");
        }
        if (ruta.getRecomendacionesSeguridadEs() == null || ruta.getRecomendacionesSeguridadEs().trim().isEmpty()) {
            throw new IllegalArgumentException("La información de seguridad de la ruta es obligatoria.");
        }

        if (ruta.getIdRuta() > 0 && rutaDAO.findById(ruta.getIdRuta()) != null) {
            return rutaDAO.actualizar(ruta);
        } else {
            return rutaDAO.insertar(ruta);
        }
    }

    public boolean cambiarEstado(int id, String nuevoEstado) {
        if (id <= 0 || nuevoEstado == null) return false;
        return rutaDAO.cambiarEstado(id, nuevoEstado);
    }
}
