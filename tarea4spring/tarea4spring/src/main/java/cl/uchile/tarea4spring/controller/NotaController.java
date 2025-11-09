package cl.uchile.tarea4spring.controller;

import cl.uchile.tarea4spring.model.Aviso;
import cl.uchile.tarea4spring.model.Nota;
import cl.uchile.tarea4spring.repository.AvisoRepository;
import cl.uchile.tarea4spring.repository.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {"http://localhost:5000", "http://127.0.0.1:5000"})
@RestController
@RequestMapping("/notas")
public class NotaController {

    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private AvisoRepository avisoRepository;

    // Agrega una nota (evaluación) a un aviso.
    @PostMapping("/add")
    public String addNota(@RequestParam Integer avisoId, @RequestParam int valor) {
        if (valor < 1 || valor > 7) {
            return "La nota debe estar entre 1 y 7";
        }

        Aviso aviso = avisoRepository.findById(avisoId).orElse(null);
        if (aviso == null) {
            return "Aviso no encontrado";
        }

        Nota n = new Nota();
        n.setNota(valor);
        n.setAviso(aviso);
        notaRepository.save(n);

        return "Nota agregada correctamente";
    }

    // Obtiene el promedio de notas de un aviso.
    @GetMapping("/promedio")
    public Map<String, Object> getPromedio(@RequestParam Integer avisoId) {
        Aviso aviso = avisoRepository.findById(avisoId).orElse(null);
        if (aviso == null) {
            return Map.of("promedio", null);
        }

        List<Nota> notas = notaRepository.findByAviso(aviso);
        Double promedio = notas.stream()
                .mapToInt(Nota::getNota)
                .average()
                .orElse(Double.NaN);

        return Map.of("promedio", promedio.isNaN() ? null : promedio);
    }
}
