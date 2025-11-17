package cl.uchile.tarea4spring.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "comuna")
public class Comuna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;

    // Relación uno a muchos con Aviso
    @OneToMany(mappedBy = "comuna", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Aviso> avisos;

    public Comuna() {}

    public Comuna(String nombre) {
        this.nombre = nombre;
    }

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    @Override
    public String toString() {
        return "Comuna{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                '}';
    }
}

