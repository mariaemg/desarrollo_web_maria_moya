package cl.uchile.tarea4spring.controller;

import cl.uchile.tarea4spring.model.Aviso;
import cl.uchile.tarea4spring.repository.AvisoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

@CrossOrigin(origins = {"http://localhost:5000", "http://127.0.0.1:5000"})
@RestController
@RequestMapping("/avisos")
public class AvisoController {

    @Autowired
    private AvisoRepository avisoRepository;

    // Obtener todos los avisos
    @GetMapping("/all")
    public Iterable<Aviso> getAllAvisos() {
        return avisoRepository.findAll();
    }

    // Obtener un aviso específico por ID
    @GetMapping("/{id}")
    public Aviso getAviso(@PathVariable Integer id) {
        return avisoRepository.findById(id).orElse(null);
    }

    // Devuelve toda la info necesaria
    @GetMapping("/completo")
    public Map<String, Object> getAvisosCompleto(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size) {

        Iterable<Aviso> avisosIterable = avisoRepository.findAll();
        List<Aviso> avisos = new ArrayList<>();
        avisosIterable.forEach(avisos::add);

        int total = avisos.size();
        int from = Math.min(page * size, total);
        int to = Math.min(from + size, total);
        List<Aviso> paginaAvisos = avisos.subList(from, to);

        List<Map<String, Object>> resultado = new ArrayList<>();
        for (Aviso aviso : avisos) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", aviso.getId());
            map.put("fecha_publicacion", aviso.getFecha_ingreso());
            map.put("sector", aviso.getSector());
            map.put("cantidad", aviso.getCantidad());
            map.put("tipo", aviso.getTipo());
            map.put("edad", aviso.getEdad());
            map.put("unidad_medida", aviso.getUnidad_medida());
            map.put("comuna", aviso.getComuna() != null ? aviso.getComuna().getNombre() : "");
            map.put("promedio", aviso.getPromedioNotas() != null ? aviso.getPromedioNotas() : null);

            resultado.add(map);
        }
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("content", resultado);
        respuesta.put("totalPages", (int) Math.ceil((double) total / size));
        respuesta.put("page", page);

        return respuesta;
    }
}
