package cl.uchile.tarea4spring.model;


import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "log")
public class LogEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "fecha")
    private LocalDateTime fecha;


    @Column(name = "mensaje", length = 1000)
    private String mensaje;


    @PrePersist
    public void prePersist() {
        if (fecha == null) fecha = LocalDateTime.now();
    }


    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public LocalDateTime getFecha() { 
        return fecha; 
    }

    public void setFecha(LocalDateTime fecha) { 
        this.fecha = fecha; 
    }

    public String getMensaje() { 
        return mensaje; 
    }

    public void setMensaje(String mensaje) { 
        this.mensaje = mensaje; 
    }
}