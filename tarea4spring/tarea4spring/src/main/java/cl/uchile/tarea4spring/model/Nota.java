package cl.uchile.tarea4spring.model;

import jakarta.persistence.*;

@Entity
@Table(name = "nota")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer nota; // coincide con la columna en la DB

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aviso_id")
    private Aviso aviso;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getNota() {
        return nota;
    }

    public void setNota(Integer nota) {
        this.nota = nota;
    }

    public Aviso getAviso() {
        return aviso;
    }

    public void setAviso(Aviso aviso) {
        this.aviso = aviso;
    }

    @Override
    public String toString() {
        return "Nota{" +
                "id=" + id +
                ", nota=" + nota +
                '}';
    }
}
