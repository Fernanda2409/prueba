document.addEventListener("DOMContentLoaded", () => {
    cargarPropiedades(); // Cargar propiedades al iniciar
});
// Este script obtiene el año actual y lo inserta en el lugar indicado.
document.getElementById("year").textContent = new Date().getFullYear();

function cargarPropiedades() {
    // Obtener todas las propiedades sin filtros
    fetch('/obtenerPropiedades')
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar las propiedades");
            return response.json();
        })
        .then(data => {
            mostrarPropiedades(data);
        })
        .catch(error => {
            console.error("Error al cargar propiedades:", error);
        });
}

function mostrarPropiedades(propiedades = []) {
    const catalogo = document.getElementById("catalogoPropiedades");
    catalogo.innerHTML = ''; // Limpiar el catálogo

    if (propiedades.length === 0) {
        catalogo.innerHTML = '<p>No se encontraron propiedades.</p>';
        return;
    }

    propiedades.forEach(propiedad => {
        // Asignar valores con un fallback a "No disponible" si los campos están vacíos
        const colonia = propiedad.colonia || 'No disponible';
        const tipo_propiedad = propiedad.tipo_propiedad || 'No disponible';
        const precio = propiedad.precio || 'No disponible';
        const metros_cuadrados = propiedad.metros_cuadrados || 'No disponible';
        const habitaciones = propiedad.habitaciones || 'No disponible';
        const banios = propiedad.banos || 'No disponible';
        const tipo = propiedad.estado_propiedad || 'No disponible';
        // Usar la URL de la imagen proporcionada por el backend
        const imagenUrl = propiedad.url_imagen || '/uploads/default.jpg';
        console.log('Imagen URL:', imagenUrl);  // Verifica si la URL es la correcta

        const propiedadDiv = document.createElement("div");
        propiedadDiv.className = "propiedad";
        propiedadDiv.innerHTML = `
            <img src="${imagenUrl}" alt="Propiedad" class="propiedad-img">
            <div class="propiedad-info">
                <h3>${tipo_propiedad} en ${tipo} en ${colonia}</h3>
                <p><strong>Metros cuadrados: </strong>${metros_cuadrados}</p>
                <p><strong>Habitaciones: </strong> ${habitaciones} <strong>Baños: </strong> ${banios}</p>
                <p><strong>Precio:</strong> $${precio}</p>
                <button onclick="verDetalles(${propiedad.id_propiedad})">Ver detalles</button>
            </div>
        `;
        catalogo.appendChild(propiedadDiv);
    });
}


function verDetalles(id) {
    window.location.href = `detalles.html?id=${id}`;
}



