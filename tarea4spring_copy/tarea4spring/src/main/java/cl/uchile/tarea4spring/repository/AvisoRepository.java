package cl.uchile.tarea4spring.repository;

import cl.uchile.tarea4spring.model.Aviso;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

public interface AvisoRepository extends CrudRepository<Aviso, Integer> {

}
