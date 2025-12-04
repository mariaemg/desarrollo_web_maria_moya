package cl.uchile.tarea4spring.repository;


import cl.uchile.tarea4spring.model.LogEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;


public interface LogRepository extends JpaRepository<LogEntry, Long> {
    @Query("SELECT l FROM LogEntry l ORDER BY l.fecha DESC")
    List<LogEntry> findAllOrderByFechaDesc();
}