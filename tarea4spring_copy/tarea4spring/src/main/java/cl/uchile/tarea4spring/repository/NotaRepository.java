package cl.uchile.tarea4spring.repository;

import cl.uchile.tarea4spring.model.Nota;
import cl.uchile.tarea4spring.model.Aviso;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotaRepository extends CrudRepository<Nota, Integer> {
    List<Nota> findByAviso(Aviso aviso);
}
