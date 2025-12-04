package cl.uchile.tarea4spring.controller;

import cl.uchile.tarea4spring.model.Foto;
import cl.uchile.tarea4spring.model.Aviso;
import cl.uchile.tarea4spring.model.Comuna;
import cl.uchile.tarea4spring.repository.FotoRepository;
import cl.uchile.tarea4spring.repository.AvisoRepository;
import cl.uchile.tarea4spring.repository.ComunaRepository;
import cl.uchile.tarea4spring.service.FotoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/t5-admin-fotos")
public class AdminFotoController {

    private final FotoRepository fotoRepository;
    private final AvisoRepository avisoRepository;
    private final ComunaRepository comunaRepository;
    private final FotoService fotoService;

    public AdminFotoController(FotoRepository fotoRepository,
                               AvisoRepository avisoRepository,
                               ComunaRepository comunaRepository,
                               FotoService fotoService) {
        this.fotoRepository = fotoRepository;
        this.avisoRepository = avisoRepository;
        this.comunaRepository = comunaRepository;
        this.fotoService = fotoService;
    }

    @GetMapping
    public String mostrarFotos(Model model) {
        List<Foto> fotos = fotoRepository.findAllOrderByIdDesc();
        model.addAttribute("fotos", fotos);
        return "t5-admin-fotos"; // plantilla Thymeleaf
    }

    @PostMapping("/eliminar/{id}")
    public String eliminarFoto(@PathVariable Long id, @RequestParam String motivo) {
        // Validación del motivo
        if (motivo == null || motivo.length() < 5 || motivo.length() > 200) {
            throw new IllegalArgumentException("Motivo inválido (5-200 caracteres)");
        }

        // Marcar la foto como eliminada usando el servicio
        fotoService.marcarComoEliminada(id, motivo, "cc5002"); // "cc5002" es el usuario

        return "redirect:/t5-admin-fotos";
    }
}
