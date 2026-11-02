package bo.edu.usb.cotapata.service;

import bo.edu.usb.cotapata.dao.EspecieDAO;
import bo.edu.usb.cotapata.model.Especie;

import java.util.List;

public class EspecieService {

    private final EspecieDAO especieDAO;

    public EspecieService() {
        this.especieDAO = new EspecieDAO();
    }

    public List<Especie> obtenerEspeciesPublicadas() {
        return especieDAO.listarPublicadas();
    }

    public List<Especie> obtenerTodasLasEspecies() {
        return especieDAO.listarTodas();
    }

    public Especie obtenerPorId(int id) {
        if (id <= 0) return null;
        return especieDAO.findById(id);
    }

    public boolean guardarEspecie(Especie especie) {
        if (especie == null) return false;
        if (especie.getNombreEs() == null || especie.getNombreEs().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre en español de la especie es obligatorio.");
        }
        if (especie.getCientifico() == null || especie.getCientifico().trim().isEmpty()) {
            especie.setCientifico("Especie registrada");
        }
        if (especie.getTipo() == null || (!especie.getTipo().equalsIgnoreCase("FAUNA") && !especie.getTipo().equalsIgnoreCase("FLORA"))) {
            especie.setTipo("FAUNA");
        }

        if (especie.getId() > 0 && especieDAO.findById(especie.getId()) != null) {
            return especieDAO.actualizar(especie);
        } else {
            return especieDAO.insertar(especie);
        }
    }

    public boolean cambiarEstado(int id, String nuevoEstado) {
        if (id <= 0 || nuevoEstado == null) return false;
        return especieDAO.cambiarEstado(id, nuevoEstado);
    }

    public boolean retirarEspecie(int id) {
        return especieDAO.eliminarLogico(id);
    }
}
