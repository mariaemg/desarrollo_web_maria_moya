package cl.uchile.tarea4spring.model;

import jakarta.persistence.*;

@Entity
@Table(name = "foto")
public class Foto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ruta_archivo")
    private String url;

    @Column(name = "nombre_archivo")
    private String nombreArchivo;

    // Relación con Aviso
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "aviso_id", nullable = false)
    private Aviso aviso;

    @Column(name = "eliminada", nullable = false)
    private Integer eliminada = 0;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Aviso getAviso() {
        return aviso;
    }

    public void setAviso(Aviso aviso) {
        this.aviso = aviso;
    }

    public Integer getEliminada() {
        return eliminada;
    }

    public void setEliminada(Integer eliminada) {
        this.eliminada = eliminada;
    }

    public String getNombreArchivo() {
        return nombreArchivo;
    }

    public void setNombreArchivo(String nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
    }
}
