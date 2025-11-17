// URLs de las peticiones a Springboot
const AVISOS_URL = "http://localhost:8080/avisos/completo";
const NOTAS_URL = "http://localhost:8080/notas/add";

// Función para formatear unidad de edad
function formatearUnidadEdad(unidad, cantidad) {
  if (unidad === "a") {
    return cantidad === 1 ? "año" : "años";
  } else if (unidad === "m") {
    return cantidad === 1 ? "mes" : "meses";
  }
  return unidad;
}

// Función para capitalizar la primera letra
function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function cargarAvisos(page = 0) {
  const tbody = document.querySelector("#tablaAvisos tbody");
  const paginacion = document.getElementById("paginacion");
  // Mostrar mensaje de carga
  tbody.innerHTML = `
    <tr>
      <td colspan="7" style="text-align:center; padding:15px; color:#555;">
        Cargando...
      </td>
    </tr>
  `;
  paginacion.innerHTML = ""; // limpiar paginación mientras carga
  try {
    const resp = await fetch(`${AVISOS_URL}?page=${page}&size=5`);
    const data = await resp.json();
    const avisos = data.content;
    tbody.innerHTML = "";

    if (avisos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="sin-avisos">
              <p>No hay avisos para evaluar.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    avisos.forEach(aviso => {
      const promedio = aviso.promedio != null ? aviso.promedio.toFixed(1) : "-";
      const tr = document.createElement("tr");
      const unidadEdad = formatearUnidadEdad(aviso.unidad_medida === "a" ? "a" : "m", aviso.edad);
      const tipoPlural = aviso.cantidad > 1 ? capitalizar(aviso.tipo) + "s" : capitalizar(aviso.tipo);
      
      tr.innerHTML = `
        <td>${aviso.id}</td>
        <td>${aviso.fecha_publicacion}</td>
        <td>${aviso.sector}</td>
        <td>${aviso.cantidad} ${tipoPlural} / ${aviso.edad} ${unidadEdad}</td>
        <td>${aviso.comuna}</td>
        <td>${promedio}</td>
        <td>
          <button class="btn-evaluar" onclick="evaluar(${aviso.id}, this)">Evaluar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    renderPaginacion(data.totalPages, data.page);

  } catch(e) {
    console.error("Error al cargar avisos:", e);
  }
}

// Solo actualiza promedio
async function actualizarPromedio(avisoId) {
  const filas = document.querySelectorAll("#tablaAvisos tbody tr");
  let fila = null;
  for (const i of filas) {
    const idCelda = i.children[0]; // primera columna = ID
    if (idCelda && parseInt(idCelda.textContent) === avisoId) {
      fila = i;
      break;
    } 
  }
  if (!fila) return;

  const promedioCelda = fila.children[5]; // columna del promedio

  try {
    const resp = await fetch(`http://localhost:8080/notas/promedio?avisoId=${avisoId}`);
    const data = await resp.json();
    promedioCelda.textContent = data.promedio != null
      ? data.promedio.toFixed(1)
      : "-";
  } catch (e) {
    console.error("Error al actualizar promedio:", e);
    promedioCelda.textContent = "Error";
  }
}

function evaluar(avisoId, boton) {
  const celda = boton.parentElement;
  celda.innerHTML = `
    <div style="display:flex; gap:5px; align-items:center;">
      <input type="number" id="nota-${avisoId}" min="1" max="7" placeholder="1-7">
      <button class="btn-enviar" onclick="enviarNota(${avisoId}, this)">OK</button>
    </div>
    <div id="error-${avisoId}" style="color:red; font-size:0.8em; margin-top:2px;"></div>
  `;
}

async function enviarNota(avisoId, boton) {
  const input = document.getElementById(`nota-${avisoId}`);
  const errorDiv = document.getElementById(`error-${avisoId}`);
  const valor = parseInt(input.value);

  if (isNaN(valor) || valor < 1 || valor > 7) {
    input.classList.add("invalid");
    errorDiv.textContent = "Debe ingresar un número entre 1 y 7";
    return;
  }

  input.classList.remove("invalid");
  errorDiv.textContent = "";

  const cargandoDiv = document.createElement("div");
  cargandoDiv.textContent = "Enviando...";
  cargandoDiv.style.color = "#555";
  cargandoDiv.style.fontSize = "0.85em";
  cargandoDiv.style.fontStyle = "italic";
  input.parentElement.appendChild(cargandoDiv);

  try {
    const params = new URLSearchParams();
    params.append("avisoId", avisoId);
    params.append("valor", valor);

    await fetch(`${NOTAS_URL}?${params.toString()}`, { method: "POST" });

    // Solo actualizar el promedio del aviso evaluado
    await actualizarPromedio(avisoId);

  } catch(e) {
    errorDiv.textContent = "Error al enviar la nota. Intente nuevamente.";
    console.error(e);
  } finally {
    cargandoDiv.remove();
  }
}

function renderPaginacion(totalPaginas, paginaActual) {
  const contenedor = document.getElementById("paginacion");
  contenedor.innerHTML = "";
  const windowSize = 2;

  for (let p = 0; p < totalPaginas; p++) {
    if (p === 0 || p === totalPaginas - 1 || (p >= paginaActual - windowSize && p <= paginaActual + windowSize)) {
      if (p === paginaActual) {
        contenedor.innerHTML += `<span class="active">${p + 1}</span>`;
      } else {
        contenedor.innerHTML += `<a href="#" onclick="cargarAvisos(${p})">${p + 1}</a>`;
      }
    } else if (p === 1 && paginaActual - windowSize > 1) {
      contenedor.innerHTML += `<span>...</span>`;
    } else if (p === totalPaginas - 2 && paginaActual + windowSize < totalPaginas - 2) {
      contenedor.innerHTML += `<span>...</span>`;
    }
  }
}

// Cargar avisos al iniciar
cargarAvisos();
