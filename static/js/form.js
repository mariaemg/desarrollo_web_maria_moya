// Obtenemos por medio del dom todo lo necesario para procesar el form
const regionSelect = document.getElementById("region");
const comunaSelect = document.getElementById("comuna");
const btnAgregarFoto = document.getElementById("btnAgregarFoto");
const fechaEntrega = document.getElementById("fechaEntrega");
const form = document.getElementById("formAdopcion");
const contactosDiv = document.getElementById("contactarPor");
const checkboxes = contactosDiv.querySelectorAll("input[type='checkbox']");
let errorGlobalContactos = contactosDiv.querySelector(".error-msg");

// Funciones para mostrar/limpiar errores
function mostrarError(campo, mensaje) {
    let error = campo.parentNode.querySelector(".error-msg");
    if (!error || error.previousElementSibling !== campo) {
        campo.classList.add("error");
        const span = document.createElement("span");
        span.className = "error-msg";
        span.textContent = mensaje;
        campo.insertAdjacentElement("afterend", span);
    } else {
        error.textContent = mensaje;
    }
}

function limpiarError(campo) {
    campo.classList.remove("error");
    let next = campo.nextElementSibling;
    while(next && next.classList.contains("error-msg")) {
        next.remove();
        next = campo.nextElementSibling;
    }
}

// Manejo de región y comuna
function llenarComunas(regionId) {
    comunaSelect.innerHTML = "<option value=''>Seleccione comuna</option>";
    const region = region_comuna.regiones.find(r => r.numero == regionId);
    if (region) {
        region.comunas.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = c.nombre;
            if (datos.comuna && datos.comuna == c.id) {
                opt.selected = true;
            }
            comunaSelect.appendChild(opt);
        });
    }
}

region_comuna.regiones.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r.numero;
    opt.textContent = r.nombre;
    if (datos.region && datos.region == r.numero) {
        opt.selected = true;
        llenarComunas(r.numero);
    }
    regionSelect.appendChild(opt);
});

regionSelect.addEventListener("change", function() {
    llenarComunas(this.value);
});

// Fecha
const ahora = new Date();
const inputEntrega = document.getElementById("fechaEntrega");
if (inputEntrega) {
    function formatDate(date) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    }
    const fechaIngreso = document.createElement("input");
    fechaIngreso.type = "hidden";
    fechaIngreso.name = "fechaIngreso";
    fechaIngreso.value = formatDate(ahora);
    form.appendChild(fechaIngreso);

    const entrega = new Date(ahora);
    entrega.setHours(entrega.getHours() + 3);
    inputEntrega.value = formatDate(entrega);
}

// Contacto múltiple
checkboxes.forEach(chk => {
    const inputID = chk.parentNode.nextElementSibling;
    if (chk.checked) inputID.style.display = "block";
    chk.addEventListener("change", () => {
        inputID.style.display = chk.checked ? "block" : "none";
        actualizarErrorContactos(); // Actualiza error global al cambiar
    });
});

// Limitar máximo 5 contactos
function actualizarErrorContactos() {
    const seleccionados = contactosDiv.querySelectorAll("input[type='checkbox']:checked");
    if(seleccionados.length > 5) {
        if (!errorGlobalContactos) {
            errorGlobalContactos = document.createElement("span");
            errorGlobalContactos.className = "error-msg";
            contactosDiv.appendChild(errorGlobalContactos);
        }
        errorGlobalContactos.style.display = "block";
        errorGlobalContactos.textContent = "Solo puedes seleccionar un máximo de 5 opciones.";
        return false;
    } else {
        if (errorGlobalContactos) {
            errorGlobalContactos.style.display = "none";
            errorGlobalContactos.textContent = "";
        }
        return true;
    }
}

// Fotos
btnAgregarFoto.addEventListener("click", function() {
    const fotosDiv = document.querySelector(".fotos");
    const inputs = fotosDiv.querySelectorAll("input[type='file']");
    if (inputs.length < 5) {
        const nuevoInput = document.createElement("input");
        nuevoInput.type = "file";
        nuevoInput.name = "fotos";
        nuevoInput.accept = "image/*";
        fotosDiv.insertBefore(nuevoInput, btnAgregarFoto);
    } else {
        mostrarError(fotosDiv, "Se permiten máximo 5 fotos.");
    }
});

function esImagen(file) {
    return (file && file.type && file.type.startsWith("image/"));
}

// Validación del formulario
form.addEventListener("submit", function(e) {
    e.preventDefault();
    let valido = true;

    // Campos de texto
    const camposTexto = [
        { campo: document.getElementById("nombre"), min: 3, max: 200, requerido: true },
        { campo: document.getElementById("email"), max: 100, requerido: true },
        { campo: document.getElementById("sector"), max: 100, requerido: false },
        { campo: document.getElementById("celular"), requerido: false },
        { campo: document.getElementById("descripcion"), max: 500, requerido: false }
    ];
    camposTexto.forEach(obj => {
        const campo = obj.campo;
        const val = campo.value.trim();
        limpiarError(campo);
        if(obj.requerido && !val){
            mostrarError(campo, "Este campo no puede estar vacío.");
            valido = false;
        } else {
            if(val.length < (obj.min||0)){
                mostrarError(campo, `Mínimo ${obj.min} caracteres.`);
                valido = false;
            }
            if(val.length > (obj.max||Infinity)){
                mostrarError(campo, `Máximo ${obj.max} caracteres.`);
                valido = false;
            }
            if(campo.type === "email" && val){
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if(!re.test(val)){
                    mostrarError(campo, "Email inválido.");
                    valido = false;
                }
            }
            if(campo.id==="celular" && val){
                const re = /^\+\d{1,3}\.\d{8,12}$/;
                if(!re.test(val)){
                    mostrarError(campo, "Formato: +NNN.NNNNNNNN");
                    valido = false;
                }
            }
        }
    });

    // Validar contactos visibles y máximo 5
    if(!actualizarErrorContactos()){
        valido = false;
    }
    checkboxes.forEach(chk => {
        const inputID = chk.parentNode.nextElementSibling;
        limpiarError(inputID);
        if (chk.checked) {
            const val = inputID.value.trim();
            if (!val) {
                mostrarError(inputID, "Este campo no puede estar vacío.");
                valido = false;
            } else if (val.length < 4) {
                mostrarError(inputID, "Mínimo 4 caracteres.");
                valido = false;
            } else if (val.length > 50) {
                mostrarError(inputID, "Máximo 50 caracteres.");
                valido = false;
            }
        }
    });

    // Selects requeridos
    const selects = [
        { campo: regionSelect, mensaje: "Debe seleccionar región." },
        { campo: comunaSelect, mensaje: "Debe seleccionar comuna." },
        { campo: document.getElementById("tipo"), mensaje: "Debe seleccionar tipo." },
        { campo: document.getElementById("unidadEdad"), mensaje: "Debe seleccionar unidad de edad." }
    ];
    selects.forEach(obj => {
        limpiarError(obj.campo);
        if(!obj.campo.value){
            mostrarError(obj.campo, obj.mensaje);
            valido = false;
        }
    });

    // Cantidad y edad
    const cantidad = document.getElementById("cantidad");
    const edad = document.getElementById("edad");
    [cantidad, edad].forEach(num => {
        limpiarError(num);
        const val = num.value.trim();

    if (!val) {
        mostrarError(num, "Debe ser al menos 1");
        valido = false;
    } else if (!/^\d+$/.test(val)) {  // solo dígitos, no acepta puntos ni negativos
        mostrarError(num, "Debe ser un número entero positivo");
        valido = false;
    } else if (parseInt(val) < 1) {
        mostrarError(num, "Debe ser al menos 1");
        valido = false;
    }

    });

    // Fecha entrega
    limpiarError(fechaEntrega);
    if(!fechaEntrega.value){
        mostrarError(fechaEntrega,"La fecha es obligatoria.");
        valido = false;
    } else {
        const regexFechaHora = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        if(!regexFechaHora.test(fechaEntrega.value)){
            mostrarError(fechaEntrega,"Formato inválido (YYYY-MM-DDTHH:mm).");
            valido = false;
        } else {
            const fecha = new Date(fechaEntrega.value);
            if(fecha < ahora){
                mostrarError(fechaEntrega,"La fecha debe ser mayor o igual a la predefinida.");
                valido = false;
            }
        }
    }

    // Fotos
    const fotosDiv = document.querySelector(".fotos");
    const fotos = Array.from(fotosDiv.querySelectorAll("input[name='fotos']"))
                       .filter(f => f.value.trim() !== "");
    limpiarError(fotosDiv);
    if(fotos.length<1 || fotos.length>5){
        mostrarError(fotosDiv,"Debe subir entre 1 y 5 fotos.");
        valido = false;
    } else {
        fotos.forEach(input => {
            if (input.files && input.files.length > 0) {
                const file = input.files[0];
                if (!esImagen(file)) {
                    mostrarError(fotosDiv, "Todos los archivos deben ser imágenes (jpg, png, gif, webp, bmp, heic).");
                    valido = false;
                }
            }
        });
    }

    // Si no es válido, no continuar
    if(!valido) return;

    // Confirmación
    form.style.display = "none";
    document.getElementById("confirmacion").style.display = "block";
});

// Confirmación final
document.getElementById("siConfirmo").addEventListener("click", function(){
    const mensajeEspera = document.createElement("div");
    mensajeEspera.id = "mensajeEspera";
    mensajeEspera.className = "mensaje-final";
    mensajeEspera.textContent = "🕒 Espere, se está añadiendo el aviso...";
    document.body.appendChild(mensajeEspera);
    form.submit();
});

document.getElementById("noConfirmo").addEventListener("click", function(){
    document.getElementById("confirmacion").style.display = "none";
    form.style.display = "block";
});
