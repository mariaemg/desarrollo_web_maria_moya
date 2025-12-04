package cl.uchile.tarea4spring.service;


import cl.uchile.tarea4spring.model.Foto;
import cl.uchile.tarea4spring.model.LogEntry;
import cl.uchile.tarea4spring.repository.FotoRepository;
import cl.uchile.tarea4spring.repository.LogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class FotoService {
    private final FotoRepository fotoRepository;
    private final LogRepository logRepository;


    public FotoService(FotoRepository fotoRepository, LogRepository logRepository) {
        this.fotoRepository = fotoRepository;
        this.logRepository = logRepository;
    }

    @Transactional
    public void marcarComoEliminada(Long fotoId, String motivo, String usuario) {
        Foto f = fotoRepository.findById(fotoId)
        .orElseThrow(() -> new IllegalArgumentException("Foto no encontrada: " + fotoId));
        f.setEliminada(1);
        fotoRepository.save(f);


        LogEntry log = new LogEntry();
        log.setMensaje(String.format("eliminado foto %d por usuario %s, motivo: %s", fotoId, usuario, motivo));
        logRepository.save(log);
    }
}