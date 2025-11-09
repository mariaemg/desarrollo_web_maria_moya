package cl.uchile.tarea4spring.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "aviso_adopcion")
public class Aviso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDate fecha_ingreso;
    private String sector;
    private Integer cantidad;
    private String tipo;
    private Integer edad;
    private String unidad_medida;
    
    // Relación muchos a uno con Comuna
    @ManyToOne
    @JoinColumn(name = "comuna_id")
    private Comuna comuna;

    // Relación uno a muchos con Nota
    @OneToMany(mappedBy = "aviso", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Nota> notas;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public LocalDate getFecha_ingreso() { return fecha_ingreso; }
    public void setFecha_ingreso(LocalDate fecha_ingreso) { this.fecha_ingreso = fecha_ingreso; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public Integer getEdad() { return edad; }
    public void setEdad(Integer edad) { this.edad = edad; }

    public String getUnidad_medida() { return unidad_medida; }
    public void setUnidad_medida(String unidad_medida) { this.unidad_medida = unidad_medida; }

    public Comuna getComuna() { return comuna; }
    public void setComuna(Comuna comuna) { this.comuna = comuna; }

    public List<Nota> getNotas() { return notas; }
    public void setNotas(List<Nota> notas) { this.notas = notas; }

    // Promedio de notas (transient, no se guarda en la DB)
    @Transient
    public Double getPromedioNotas() {
        if (notas == null || notas.isEmpty()) return null;
        double suma = 0;
        for (Nota n : notas) suma += n.getNota();
        return suma / notas.size();
    }

    @Override
    public String toString() {
        return "Aviso{" +
                "id=" + id +
                ", fechaPublicacion=" + fecha_ingreso +
                ", sector='" + sector + '\'' +
                ", cantidad=" + cantidad +
                ", tipo='" + tipo + '\'' +
                ", edad='" + edad + '\'' +
                ", unidad_medida='" + unidad_medida + '\'' +
                ", comuna=" + (comuna != null ? comuna.getNombre() : "null") +
                ", promedioNotas=" + getPromedioNotas() +
                '}';
    }
}
