// Obtenemos por medio del dom todo lo necesario para procesar el form
const regionSelect = document.getElementById("region");
const comunaSelect = document.getElementById("comuna");
const btnAgregarFoto = document.getElementById("btnAgregarFoto");
const fechaEntrega = document.getElementById("fechaEntrega");
const form = document.getElementById("formAdopcion");
const contactoPor = document.getElementById("contactarPor");
const contactoID = document.getElementById("contactoID");

// Funciones para mostrar/limpiar errores
function mostrarError(campo, mensaje) {
    // Revisar si ya existe un span de error justo después del campo
    let error = campo.parentNode.querySelector(".error-msg");
    if (!error || error.previousElementSibling !== campo) {
        campo.classList.add("error");
        const span = document.createElement("span");
        span.className = "error-msg";
        span.textContent = mensaje;
        campo.insertAdjacentElement("afterend", span);
    } else {
        // Si ya existe, solo actualizamos el mensaje
        error.textContent = mensaje;
    }
}

function limpiarError(campo) {
    campo.classList.remove("error");
    // Busca todos los spans que estén inmediatamente después de este campo
    let next = campo.nextElementSibling;
    while(next && next.classList.contains("error-msg")) {
        next.remove();
        next = campo.nextElementSibling;
    }
}

// Manejo de la selección de región y comuna
region_comuna.regiones.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r.numero;
    opt.textContent = r.nombre;
    regionSelect.appendChild(opt);
});

regionSelect.addEventListener("change", function() {
    comunaSelect.innerHTML = "<option value=''>Seleccione comuna</option>";
    const selectedRegion = region_comuna.regiones.find(r => r.numero == this.value);
    if (selectedRegion) {
        selectedRegion.comunas.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = c.nombre;
            comunaSelect.appendChild(opt);
        });
    }
});

// Prellenar la fecha con el formato solicitado
const ahora = new Date();
ahora.setHours(ahora.getHours() + 3);
fechaEntrega.value = ahora.toISOString().slice(0,16);

// Contacto
contactoPor.addEventListener("change", () => {
    contactoID.style.display = contactoPor.value ? "block" : "none";
});

// Manejo de fotos
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

// Función para validar tipo imagen
function esImagen(file) {
    return (file && file.type && file.type.startsWith("image/"));
}

// Validación del formulario 
form.addEventListener("submit", function(e) {
    e.preventDefault(); //para utilizar nuestra validación (no se manda automáticamente)
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
            // Email regex
            if(campo.type === "email" && val){
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if(!re.test(val)){
                    mostrarError(campo, "Email inválido.");
                    valido = false;
                }
            }
            // Celular regex
            if(campo.id==="celular" && val){
                const re = /^\+\d{1,3}\.\d{8,12}$/;
                if(!re.test(val)){
                    mostrarError(campo, "Formato: +NNN.NNNNNNNN");
                    valido = false;
                }
            }
        }
    });
    
    // Validación Contacto
    limpiarError(contactoID);
    if(contactoPor.value !== "") { // Solo validar si se selecciona un contacto real
        const val = contactoID.value.trim();
        if(!val){
            mostrarError(contactoID, "Este campo no puede estar vacío.");
            valido = false;
        } else if(val.length < 4){
            mostrarError(contactoID, "Mínimo 4 caracteres.");
            valido = false;
        } else if(val.length > 50){
            mostrarError(contactoID, "Máximo 50 caracteres.");
            valido = false;
        }
    }

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
        if(!num.value || num.value<1){
            mostrarError(num,"Debe ser al menos 1");
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
        // validar que cada archivo sea imagen
        let errorImagen = false;
        fotos.forEach(input => {
            if (input.files && input.files.length > 0) {
                const file = input.files[0];
                if (!esImagen(file)) {
                    errorImagen = true;
                }
            }
        });
        if (errorImagen) {
            mostrarError(fotosDiv, "Todos los archivos deben ser imágenes (jpg, png, gif, webp, bmp, heic).");
            valido = false;
        }
    }

    if(!valido) return; // caso formulario inválido

    // Mostrar confirmación
    form.style.display = "none";
    document.getElementById("confirmacion").style.display = "block";
});

// Confirmar o cancelar
document.getElementById("siConfirmo").addEventListener("click", function(){
    document.getElementById("confirmacion").style.display = "none";
    document.getElementById("mensajeFinal").style.display = "block";
});
document.getElementById("noConfirmo").addEventListener("click", function(){
    document.getElementById("confirmacion").style.display = "none";
    form.style.display = "block";
});
