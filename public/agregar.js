const formAgregarPropiedad = document.getElementById("formAgregarPropiedad");

// Este script obtiene el año actual y lo inserta en el lugar indicado.
document.getElementById("year").textContent = new Date().getFullYear();


function validatePrecio(precio) {
    return precio > 0;
}

function validateMetrosCuadrados(metrosCuadrados) {
    return metrosCuadrados > 0;
}

function validateHabitaciones(habitaciones) {
    return habitaciones >= 1;
}

function validateBanos(banos) {
    return banos >= 1;
}

function validateCodigoPostal(codigoPostal) {
    return codigoPostal.length === 5 && !isNaN(codigoPostal);
}

function validateCampoObligatorio(campo, nombreCampo) {
    if (!campo || campo.trim() === '') {
        showAlert('error', `${nombreCampo} requerido`, `El campo ${nombreCampo} es obligatorio.`);
        return false;
    }
    return true;
}

function showAlert(icon, title, text) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        confirmButtonColor: '#3AB397'
    });
}

formAgregarPropiedad.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Obtener el ID del usuario autenticado desde el servidor
    let idUsuario;
    try {
        const response = await fetch("/usuario");
        if (response.ok) {
            const data = await response.json();
            idUsuario = data.userId; // Extrae el ID del usuario autenticado
        } else {
            showAlert("error", "Error de autenticación", "No se encontró una sesión activa.");
            return;
        }
    } catch (error) {
        console.error("Error al obtener el usuario autenticado:", error);
        showAlert("error", "Error de conexión", "Hubo un problema al obtener la sesión del usuario.");
        return;
    }

    const tipo = formAgregarPropiedad.querySelector('input[name="tipo"]:checked')?.value;
    const precio = formAgregarPropiedad.querySelector("#precio").value;
    const tipo_propiedad = formAgregarPropiedad.querySelector('input[name="tipo_propiedad"]:checked')?.value;
    const descripcion = formAgregarPropiedad.querySelector("#descripcion").value;
    const metrosCuadrados = formAgregarPropiedad.querySelector("#metros_cuadrados").value;
    const habitaciones = formAgregarPropiedad.querySelector("#habitaciones").value;
    const banos = formAgregarPropiedad.querySelector("#banos").value;

    // Dirección
    const calle = formAgregarPropiedad.querySelector("#calle").value;
    const numeroExterior = formAgregarPropiedad.querySelector("#numero_exterior").value;
    const numeroInterior = formAgregarPropiedad.querySelector("#numero_interior").value || '';
    const colonia = formAgregarPropiedad.querySelector("#colonia").value;
    const codigoPostal = formAgregarPropiedad.querySelector("#codigo_postal").value;
    const delegacion = formAgregarPropiedad.querySelector("#delegacion").value;

    // Validaciones
    if (!validatePrecio(precio)) {
        showAlert('error', 'Precio inválido', 'El precio debe ser mayor a 0.');
        return;
    }

    if (!validateMetrosCuadrados(metrosCuadrados)) {
        showAlert('error', 'Metros cuadrados inválidos', 'Los metros cuadrados deben ser mayores a 0.');
        return;
    }

    if (!validateHabitaciones(habitaciones)) {
        showAlert('error', 'Número de habitaciones inválido', 'Debe haber al menos 1 habitación.');
        return;
    }

    if (!validateBanos(banos)) {
        showAlert('error', 'Número de baños inválido', 'Debe haber al menos 1 baño.');
        return;
    }

    if (!validateCampoObligatorio(calle, "Calle") || 
        !validateCampoObligatorio(numeroExterior, "Número exterior") || 
        !validateCampoObligatorio(colonia, "Colonia") || 
        !validateCampoObligatorio(codigoPostal, "Código Postal") || 
        !validateCampoObligatorio(delegacion, "Delegación")) {
        return;
    }

    if (!validateCodigoPostal(codigoPostal)) {
        showAlert('error', 'Código Postal inválido', 'El código postal debe tener 5 dígitos.');
        return;
    }

    const precioNum = parseFloat(precio);
    const metrosCuadradosNum = parseFloat(metrosCuadrados);
    const habitacionesNum = parseInt(habitaciones);
    const banosNum = parseInt(banos);

    if (isNaN(precioNum) || isNaN(metrosCuadradosNum) || isNaN(habitacionesNum) || isNaN(banosNum)) {
        showAlert('error', 'Datos numéricos inválidos', 'Algunos de los valores numéricos no son válidos.');
        return;
    }



    const formData = new FormData();
    formData.append("id_usuario", idUsuario);
    formData.append("tipo", tipo);
    formData.append("tipo_propiedad", tipo_propiedad);
    formData.append("precio", precio);
    formData.append("descripcion", descripcion);
    formData.append("metros_cuadrados", metrosCuadrados);
    formData.append("habitaciones", habitaciones);
    formData.append("banos", banos);
    formData.append("calle", calle);
    formData.append("numero_exterior", numeroExterior);
    formData.append("numero_interior", numeroInterior);
    formData.append("colonia", colonia);
    formData.append("codigo_postal", codigoPostal);
    formData.append("delegacion", delegacion);

    // Agregar las imágenes
    const imagenes = document.getElementById("imagenes").files;
    for (let i = 0; i < imagenes.length; i++) {
        formData.append("imagenes[]", imagenes[i]);
    }

    // Enviar los datos al servidor
    fetch("/agregarPropiedad", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.ok) {
            showAlert('success', 'Propiedad agregada', 'La propiedad fue agregada exitosamente.');
            formAgregarPropiedad.reset();
        } else {
            showAlert('error', 'Error al agregar', 'No se pudo agregar la propiedad.');
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        showAlert('error', 'Error de conexión', 'Hubo un problema al conectar con el servidor.');
    });
});

function mostrarPropiedades(propiedades) {
    const contenedor = document.querySelector('#listaPropiedades');
    contenedor.innerHTML = ''; // Limpia el contenedor antes de llenarlo

    propiedades.forEach(propiedad => {
        const div = document.createElement('div');
        div.className = 'propiedad-detalles'; // Clase principal para las propiedades

        div.innerHTML = `
            <div class="detalle-contenedor">
                <!-- Imagen -->
                <div class="imagen-contenedor">
                    <img src="${propiedad.url_imagen || '/uploads/default.jpg'}" alt="Imagen de la propiedad" class="foto-detalle">
                </div>

                <!-- Información -->
                <div class="info-detalle">
                    <h1>${propiedad.tipo_propiedad || "Tipo no disponible"}</h1>
                    <p><strong>Precio:</strong> $${Number(propiedad.precio).toLocaleString() || "No disponible"}</p>
                    <p><strong>Descripción:</strong> ${propiedad.descripcion || "No disponible"}</p>
                    <p><strong>Metros cuadrados:</strong> ${Number(propiedad.metros_cuadrados).toLocaleString() || "No disponible"} m²</p>
                    <p><strong>Habitaciones:</strong> ${propiedad.habitaciones || "No disponible"}</p>
                    <p><strong>Baños:</strong> ${propiedad.banos || "No disponible"}</p>
                    <p><strong>Dirección:</strong> ${propiedad.calle || ""} ${propiedad.numero_exterior || ""}${propiedad.numero_interior ? `, Int. ${propiedad.numero_interior}` : ""}, ${propiedad.colonia || ""}, ${propiedad.delegacion || ""}, C.P. ${propiedad.codigo_postal || ""}</p>
                    <button onclick="verDetalles('${propiedad._id}')">Ver detalles</button>
                </div>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

