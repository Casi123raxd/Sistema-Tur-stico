package bo.edu.usb.cotapata.dao;

import bo.edu.usb.cotapata.config.DatabaseConfig;
import bo.edu.usb.cotapata.model.MetricaInteraccion;
import org.json.JSONArray;
import org.json.JSONObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class MetricaDAO {

    private static final Logger LOGGER = Logger.getLogger(MetricaDAO.class.getName());

    public boolean registrar(MetricaInteraccion m) {
        String sql = "INSERT INTO interaccion (tipo_consulta, id_recurso, nombre_recurso, idioma) VALUES (?, ?, ?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, m.getTipoConsulta() != null ? m.getTipoConsulta().toUpperCase() : "GENERAL");
            stmt.setInt(2, m.getIdRecurso());
            stmt.setString(3, m.getNombreRecurso());
            stmt.setString(4, m.getIdioma() != null ? m.getIdioma() : "es");

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.WARNING, "Error al registrar métrica de interacción: " + e.getMessage());
            return false;
        }
    }

    public JSONObject obtenerEstadisticasAgregadas() {
        JSONObject stats = new JSONObject();

        // 1. Total general de consultas
        String sqlTotal = "SELECT COUNT(*) FROM interaccion";
        // 2. Consultas agrupadas por categoría
        String sqlPorCategoria = "SELECT tipo_consulta, COUNT(*) as total FROM interaccion GROUP BY tipo_consulta ORDER BY total DESC";
        // 3. Top recursos más consultados
        String sqlTopRecursos = "SELECT tipo_consulta, id_recurso, nombre_recurso, COUNT(*) as visitas FROM interaccion " +
                                "WHERE nombre_recurso IS NOT NULL AND nombre_recurso != '' " +
                                "GROUP BY tipo_consulta, id_recurso, nombre_recurso ORDER BY visitas DESC LIMIT 5";

        try (Connection conn = DatabaseConfig.getConnection()) {
            // Total
            try (PreparedStatement ps = conn.prepareStatement(sqlTotal);
                 ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    stats.put("totalConsultas", rs.getLong(1));
                } else {
                    stats.put("totalConsultas", 0);
                }
            }

            // Por categoría
            JSONArray porCat = new JSONArray();
            try (PreparedStatement ps = conn.prepareStatement(sqlPorCategoria);
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    JSONObject cat = new JSONObject();
                    cat.put("categoria", rs.getString("tipo_consulta"));
                    cat.put("total", rs.getLong("total"));
                    porCat.put(cat);
                }
            }
            stats.put("consultasPorCategoria", porCat);

            // Top recursos
            JSONArray topRecursos = new JSONArray();
            try (PreparedStatement ps = conn.prepareStatement(sqlTopRecursos);
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    JSONObject item = new JSONObject();
                    item.put("tipo", rs.getString("tipo_consulta"));
                    item.put("idRecurso", rs.getInt("id_recurso"));
                    item.put("nombre", rs.getString("nombre_recurso"));
                    item.put("visitas", rs.getInt("visitas"));
                    topRecursos.put(item);
                }
            }
            stats.put("topRecursos", topRecursos);

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error al calcular estadísticas agregadas: " + e.getMessage());
            stats.put("totalConsultas", 0);
            stats.put("consultasPorCategoria", new JSONArray());
            stats.put("topRecursos", new JSONArray());
        }

        return stats;
    }
}
