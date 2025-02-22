document.addEventListener("DOMContentLoaded", () => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const juegos = document.querySelectorAll(".agregar-carrito");
    const listaCarrito = document.getElementById("lista-carrito");
    const totalSpan = document.getElementById("total");
    const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
    const guardarCarritoBtn = document.getElementById("guardar-carrito");
    const comprarBtn = document.getElementById("comprar");

    // Agregar productos al carrito
    juegos.forEach(juego => {
        juego.addEventListener("click", () => {
            const id = juego.dataset.id;
            const nombre = juego.dataset.nombre;
            const precio = parseFloat(juego.dataset.precio);

            const productoExistente = carrito.find(item => item.id === id);

            if (productoExistente) {
                productoExistente.cantidad++;
            } else {
                carrito.push({ id, nombre, precio, cantidad: 1 });
            }

            actualizarCarrito();
        });
    });

    // Actualizar carrito
    function actualizarCarrito() {
        listaCarrito.innerHTML = "";
        let total = 0;

        if (carrito.length === 0) {
            listaCarrito.innerHTML = `<li class="list-group-item text-center text-muted">Tu carrito está vacío 🛒</li>`;
        } else {
            carrito.forEach(producto => {
                const item = document.createElement("li");
                item.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
                item.innerHTML = `
                    ${producto.nombre} - $${producto.precio} 
                    <span>
                        <button class="btn btn-sm btn-outline-secondary disminuir" data-id="${producto.id}">➖</button>
                        ${producto.cantidad}
                        <button class="btn btn-sm btn-outline-secondary aumentar" data-id="${producto.id}">➕</button>
                        <button class="btn btn-sm btn-outline-danger eliminar" data-id="${producto.id}">❌</button>
                    </span>
                `;
                listaCarrito.appendChild(item);

                total += producto.precio * producto.cantidad;
            });
        }

        if (total > 100) {
            total *= 0.9; // Descuento del 10%
        }

        totalSpan.textContent = total.toFixed(2);
        localStorage.setItem("carrito", JSON.stringify(carrito));

        agregarEventosBotones();
    }

    // Agregar eventos a botones dinámicos
    function agregarEventosBotones() {
        document.querySelectorAll(".aumentar").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                carrito.find(item => item.id === id).cantidad++;
                actualizarCarrito();
            });
        });

        document.querySelectorAll(".disminuir").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                const producto = carrito.find(item => item.id === id);
                if (producto.cantidad > 1) {
                    producto.cantidad--;
                } else {
                    carrito = carrito.filter(item => item.id !== id);
                }
                actualizarCarrito();
            });
        });

        document.querySelectorAll(".eliminar").forEach(btn => {
            btn.addEventListener("click", (e) => {
                carrito = carrito.filter(item => item.id !== e.target.dataset.id);
                actualizarCarrito();
            });
        });
    }

    // Guardar carrito
    guardarCarritoBtn.addEventListener("click", () => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
        alert("Carrito guardado correctamente.");
    });

    // Vaciar carrito
    vaciarCarritoBtn.addEventListener("click", () => {
        carrito = [];
        actualizarCarrito();
    });

    // Comprar (redirige a formulario)
    comprarBtn.addEventListener("click", () => {
        localStorage.setItem("totalCompra", totalSpan.textContent);
        window.location.href = "form.html";
    });

    // Cargar carrito guardado
    actualizarCarrito();
});

// Mostrar total en carrito
//document.addEventListener("DOMContentLoaded", () => {
 //   const totalCompra = localStorage.getItem("totalCompra");
  //  if (totalCompra) {
        //document.getElementById("totalMostrar").textContent = `$${totalCompra}`;
   // }
//});

document.addEventListener("DOMContentLoaded", () => {
    // Obtener el total guardado en localStorage
    let totalCompra = parseFloat(localStorage.getItem("totalCompra")) || 0;

    // Elementos del DOM
    const totalMostrar = document.getElementById("totalMostrar");
    const cantidadInput = document.querySelector("input[type='number']");

    // Mostrar el total inicial
    totalMostrar.textContent = `$${totalCompra.toFixed(2)}`;

    // Evento para actualizar el total cuando cambie la cantidad
    cantidadInput.addEventListener("input", () => {
        let cantidad = parseInt(cantidadInput.value) || 1; // Asegurar que sea un número válido
        let nuevoTotal = totalCompra * cantidad;
        totalMostrar.textContent = `$${nuevoTotal.toFixed(2)}`;
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const totalMostrar = document.getElementById("totalMostrar");
    const cantidadInput = document.getElementById("cantidad");
    const nombreJuego = document.getElementById("nombreJuego");

    // Obtener el juego seleccionado desde localStorage
    const juegoSeleccionado = JSON.parse(localStorage.getItem("juegoSeleccionado"));

    if (juegoSeleccionado) {
        // Mostrar el nombre del juego en el formulario
        nombreJuego.textContent = juegoSeleccionado.nombre;

        // Calcular y mostrar el total inicial
        actualizarTotal(juegoSeleccionado.precio, cantidadInput.value);

        // Evento para actualizar el total cuando cambie la cantidad
        cantidadInput.addEventListener("input", () => {
            actualizarTotal(juegoSeleccionado.precio, cantidadInput.value);
        });
    }

    function actualizarTotal(precioUnitario, cantidad) {
        let total = precioUnitario * (parseInt(cantidad) || 1); // Asegurar que cantidad sea número válido
        totalMostrar.textContent = `$${total.toFixed(2)}`;
    }
});

