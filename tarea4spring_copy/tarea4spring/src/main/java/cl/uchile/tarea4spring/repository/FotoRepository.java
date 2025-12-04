package cl.uchile.tarea4spring.repository;


import cl.uchile.tarea4spring.model.Foto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;


public interface FotoRepository extends JpaRepository<Foto, Long> {
    @Query("SELECT f FROM Foto f WHERE f.eliminada = 0 ORDER BY f.id DESC")
    List<Foto> findAllOrderByIdDesc();
}