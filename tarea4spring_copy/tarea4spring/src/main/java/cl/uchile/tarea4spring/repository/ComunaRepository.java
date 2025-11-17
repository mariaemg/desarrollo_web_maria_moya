package cl.uchile.tarea4spring.repository;

import cl.uchile.tarea4spring.model.Comuna;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


public interface ComunaRepository extends CrudRepository<Comuna, Long> {

}