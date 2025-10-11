// Fotos y modal
const fotos = document.querySelectorAll("#fotosGrid img");
fotos.forEach(img => {
  img.addEventListener("click", () => {
    document.getElementById("fotoGrande").src = img.src;
    document.getElementById("photoModal").style.display = "flex";
  });
});

document.getElementById("cerrarFoto").addEventListener("click", () => {
  document.getElementById("photoModal").style.display = "none";
});

// Navegación
document.getElementById("btnListado").onclick = function() {
  location.href = "/list";
};
document.getElementById("btnPortada").onclick = function() {
  location.href = "/";
};

// Paginación de comentarios
let comentarios = [];
let paginaActual = 1;
const comentariosPorPagina = 5;

function renderComentarios() {
  const cont = document.getElementById("comentariosList");
  cont.innerHTML = "";

  const start = (paginaActual - 1) * comentariosPorPagina;
  const end = start + comentariosPorPagina;
  const comentariosPagina = comentarios.slice(start, end);

  if (comentarios.length === 0) {
    cont.innerHTML = "<p>Aún no se han añadido comentarios. ¡Sé el primero!</p>";
  } else {
    comentariosPagina.forEach(c => {
      const div = document.createElement("div");
      div.className = "comentario";
      div.innerHTML = `<strong>${c.nombre}</strong> (${c.fecha}):<br>${c.texto}`;
      cont.appendChild(div);
    });
  }

  // Actualizar info de página
  const totalPaginas = Math.ceil(comentarios.length / comentariosPorPagina);
  const info = document.getElementById("infoPagina");
  if (info) {
    info.textContent = `Página ${paginaActual} de ${totalPaginas || 1}`;
  }

  // Deshabilitar botones
  const btnPrev = document.getElementById("prevPagina");
  const btnNext = document.getElementById("nextPagina");
  if (btnPrev) btnPrev.disabled = paginaActual === 1;
  if (btnNext) btnNext.disabled = paginaActual === totalPaginas || totalPaginas === 0;
}

function cargarComentarios() {
  fetch(`/comentarios/${avisoId}`)
    .then(resp => resp.json())
    .then(data => {
      comentarios = data;
      paginaActual = 1;
      renderComentarios();
    })
    .catch(err => console.error("Error al cargar comentarios:", err));
}

// Botones de paginación
document.addEventListener("DOMContentLoaded", () => {
  const btnPrev = document.getElementById("prevPagina");
  const btnNext = document.getElementById("nextPagina");

  if (btnPrev && btnNext) {
    btnPrev.addEventListener("click", () => {
      if (paginaActual > 1) {
        paginaActual--;
        renderComentarios();
      }
    });

    btnNext.addEventListener("click", () => {
      const totalPaginas = Math.ceil(comentarios.length / comentariosPorPagina);
      if (paginaActual < totalPaginas) {
        paginaActual++;
        renderComentarios();
      }
    });
  }
});

// Envío de nuevo comentario
document.getElementById("formComentario").addEventListener("submit", function(e){
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const texto = document.getElementById("texto").value.trim();
  const erroresDiv = document.getElementById("comentariosErrores");
  erroresDiv.innerHTML = "";

  let valido = true;
  const errores = [];

  // Validación nombre
  if (!nombre) {
    errores.push("El nombre es obligatorio.");
    valido = false;
  } else if (nombre.length < 3) {
    errores.push("El nombre debe tener al menos 3 caracteres.");
    valido = false;
  } else if (nombre.length > 80) {
    errores.push("El nombre puede tener máximo 80 caracteres.");
    valido = false;
  }

  // Validación texto
  if (!texto) {
    errores.push("El comentario no puede estar vacío.");
    valido = false;
  } else if (texto.length < 5) {
    errores.push("El comentario debe tener al menos 5 caracteres.");
    valido = false;
  }

  if (!valido) {
    erroresDiv.innerHTML = errores.join("<br>");
    return;
  }

  // Crear fecha en formato ISO
  const fecha = new Date();
  const fechaISO = fecha.getFullYear() + "-" +
                  String(fecha.getMonth() + 1).padStart(2, '0') + "-" +
                  String(fecha.getDate()).padStart(2, '0') + "T" +
                  String(fecha.getHours()).padStart(2, '0') + ":" +
                  String(fecha.getMinutes()).padStart(2, '0');

  fetch(`/comentario/${avisoId}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ nombre, texto, fecha: fechaISO })
  })
  .then(resp => {
    if (!resp.ok) return resp.json().then(data => { throw data; });
    return resp.json();
  })
  .then(data => {
    document.getElementById("formComentario").reset();

    // Insertar comentario al inicio
    comentarios.unshift(data.comentario);
    paginaActual = 1;
    renderComentarios();
  })
  .catch(err => {
    if (err.errores) {
      erroresDiv.innerHTML = err.errores.join("<br>");
    } else {
      console.error(err);
    }
  });
});
// Cargar comentarios al inicio
cargarComentarios();
