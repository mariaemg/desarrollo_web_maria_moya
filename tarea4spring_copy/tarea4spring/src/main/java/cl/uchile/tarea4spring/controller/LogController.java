package cl.uchile.tarea4spring.controller;


import cl.uchile.tarea4spring.model.LogEntry;
import cl.uchile.tarea4spring.repository.LogRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


import java.util.List;


@Controller
@RequestMapping("/mensajes-log")
public class LogController {

    private final LogRepository logRepository;
    public LogController(LogRepository logRepository) {
        this.logRepository = logRepository;
    }


    @GetMapping
    public String mostrarLogs(Model model) {
        List<LogEntry> logs = logRepository.findAllOrderByFechaDesc();
        model.addAttribute("logs", logs);
        return "mensajes-log";
    }
}