console.log("main.js se cargó correctamente");

class Asociacion {
constructor(id, nombre, categoria, objetivo, donaciones) {
this.id = id;
this.nombre = nombre;
this.categoria = categoria;
this.objetivo = objetivo;
this.donaciones = donaciones;
}


recibirDonacion(monto) {
    this.donaciones += monto;
}


}

const formulario = document.querySelector("#formularioAsociacion");
const nombreInput = document.querySelector("#nombre");
const categoriaInput = document.querySelector("#categoria");
const objetivoInput = document.querySelector("#objetivo");
const donacionesInput = document.querySelector("#donaciones");
const listaAsociaciones = document.querySelector("#listaAsociaciones");
const filtroInput = document.querySelector("#filtro");
const botonVaciar = document.querySelector("#botonVaciar");
const mensaje = document.querySelector("#mensaje");
const botonTramite = document.querySelector("#botonTramite");

const CLAVE_STORAGE = "asociaciones";

let asociaciones = JSON.parse(
localStorage.getItem(CLAVE_STORAGE)
) || [];

if (asociaciones.length === 0) {
asociaciones = [
new Asociacion(
1,
"Manos Solidarias",
"Alimentación",
"Ayudar a familias en situación vulnerable",
50000
),
new Asociacion(
2,
"Huellas de Amor",
"Animales",
"Rescatar y proteger animales",
35000
),
new Asociacion(
3,
"Un Futuro Mejor",
"Educación",
"Brindar apoyo educativo a niños",
42000
)
];


guardarEnStorage();


}

function guardarEnStorage() {
localStorage.setItem(
CLAVE_STORAGE,
JSON.stringify(asociaciones)
);
}

function renderizarAsociaciones(lista = asociaciones) {
listaAsociaciones.innerHTML = "";


if (lista.length === 0) {
    listaAsociaciones.innerHTML = `
        <p>No hay asociaciones para mostrar.</p>
    `;
    return;
}

lista.forEach(asociacion => {
    const {
        id,
        nombre,
        categoria,
        objetivo,
        donaciones
    } = asociacion;

    const mensajeDonacion =
        donaciones > 0
            ? `Donaciones: $${donaciones}`
            : "Sin donaciones";

    const tarjeta = document.createElement("article");

    tarjeta.classList.add("tarjeta-asociacion");

    tarjeta.innerHTML = `
        <h3>${nombre}</h3>

        <p>
            <strong>Categoría:</strong>
            ${categoria}
        </p>

        <p>
            <strong>Objetivo:</strong>
            ${objetivo}
        </p>

        <p>
            <strong>${mensajeDonacion}</strong>
        </p>

        <input
            type="number"
            class="input-donacion"
            data-id="${id}"
            placeholder="Monto de donación"
            min="1"
        >

        <button
            class="boton-donar"
            data-id="${id}"
        >
            Donar
        </button>

        <button
            class="boton-eliminar"
            data-id="${id}"
        >
            Eliminar
        </button>
    `;

    listaAsociaciones.appendChild(tarjeta);
});
```

}

formulario.addEventListener("submit", function (evento) {
evento.preventDefault();

```
const nombre = nombreInput.value.trim();
const categoria = categoriaInput.value.trim();
const objetivo = objetivoInput.value.trim();
const donaciones = Number(donacionesInput.value);

if (!nombre || !categoria || !objetivo) {
    mostrarMensaje("Completá todos los campos.");
    return;
}

const nuevoId =
    asociaciones.length > 0
        ? Math.max(
            ...asociaciones.map(
                asociacion => asociacion.id
            )
        ) + 1
        : 1;

const nuevaAsociacion = new Asociacion(
    nuevoId,
    nombre,
    categoria,
    objetivo,
    donaciones || 0
);

asociaciones.push(nuevaAsociacion);

guardarEnStorage();

renderizarAsociaciones();

formulario.reset();

mostrarMensaje(
    "Asociación agregada correctamente."
);
```

});

listaAsociaciones.addEventListener("click", function (evento) {
const id = Number(evento.target.dataset.id);

```
if (evento.target.classList.contains("boton-eliminar")) {
    asociaciones = asociaciones.filter(
        asociacion => asociacion.id !== id
    );

    guardarEnStorage();

    renderizarAsociaciones();

    mostrarMensaje(
        "Asociación eliminada."
    );
}

if (evento.target.classList.contains("boton-donar")) {
    const inputDonacion =
        document.querySelector(
            `.input-donacion[data-id="${id}"]`
        );

    const monto = Number(
        inputDonacion.value
    );

    if (monto <= 0) {
        mostrarMensaje(
            "Ingresá un monto válido."
        );
        return;
    }

    const asociacion = asociaciones.find(
        asociacion => asociacion.id === id
    );

    if (asociacion) {
        asociacion.recibirDonacion(monto);

        guardarEnStorage();

        renderizarAsociaciones();

        mostrarMensaje(
            "Donación agregada correctamente."
        );
    }
}
```

});

filtroInput.addEventListener("input", function () {
const texto = filtroInput.value
.toLowerCase()
.trim();

```
const asociacionesFiltradas =
    asociaciones.filter(
        asociacion =>
            asociacion.categoria
                .toLowerCase()
                .includes(texto)
    );

renderizarAsociaciones(
    asociacionesFiltradas
);


botonVaciar.addEventListener("click", function () {
const confirmar = confirm(
"¿Seguro que querés eliminar todas las asociaciones?"
);


if (confirmar) {
    asociaciones = [];

    localStorage.removeItem(
        CLAVE_STORAGE
    );

    renderizarAsociaciones();

    mostrarMensaje(
        "Se eliminaron todas las asociaciones."
    );
}


});

function mostrarMensaje(texto) {
mensaje.textContent = texto;


setTimeout(function () {
    mensaje.textContent = "";
}, 3000);


}

botonTramite.addEventListener("click", function () {
mostrarMensaje(
"Podés consultar los trámites disponibles en nuestra sección de Servicios."
);
});

renderizarAsociaciones();
