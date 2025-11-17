package cl.uchile.tarea4spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TemplateController {

    @GetMapping("/evaluar")
    public String mostrarEvaluacion() {
        return "evaluaciones";  // busca evaluar.html en templates/
    }
}
