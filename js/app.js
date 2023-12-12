let cliente = {
    mesa: "",
    hora: "",
    pedido: []
}

const categorias = {
    1: "Comidas",
    2: "Bebidas", 
    3: "Postres"
}

const btnGuardarCliente = document.querySelector("#guardar-cliente");
btnGuardarCliente.addEventListener("click", guardarCliente);

function guardarCliente() {
    const mesa = document.querySelector("#mesa").value;
    const hora = document.querySelector("#hora").value;

    //Revisa si hay campos vacios
    const camposVacios = [mesa, hora].some(campo => campo === ""); //Guardamos todos los valores en un array e iteramos, si es un campo vacío entonces hacemos la validación


    if(camposVacios){
        //Verificar si ya existe una alerta 

        //Si esto no existiera saliera como Null
        const existeAlerta = document.querySelector(".invalid-feedback");

        //Si existe alerta es null entonces aparece el mensaje
        if(!existeAlerta) {
            const alerta = document.createElement("DIV");
        alerta.classList.add("invalid-feedback","d-block","text-center");
        alerta.textContent = "Todos los campos son obligatorios";
        const modalBody = document.querySelector(".modal-body form");
        modalBody.appendChild(alerta);

        //Eliminar alerta
        setTimeout(() => {
            alerta.remove();
        }, 1500);
    }
    return; 
}
    //Llenamos nuestro objeto de cliente si se pasan las validaciones
    cliente = {...cliente, mesa, hora};
    //Para usar asignación dinámica le tendríamos que agregar un eventListener a las variables
    // console.log(cliente);   

    //Una vez que se agregan los datos al obj quitamos el modal

    const modalFormulario = document.querySelector("#formulario");  //Obtenenmos el formulario donde va el modal
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario); //Le pasamos la instancia del formulario que se esta mostrando 
    modalBootstrap.hide(); //Cerramos el modal

    //Mostrar las secciones
    mostrarSecciones();

    //Obtener platos de la API
    obtenerPlatos();

    function mostrarSecciones() {
        const seccionesOcultas = document.querySelectorAll(".d-none"); //Le ponemos querySelectorAll porque requiere varios elementos
        //Nos regresa un elemento similar a un arreglo
        seccionesOcultas.forEach(seccion => {
            seccion.classList.remove("d-none");
        });
    }

    function obtenerPlatos() {
        const url = "http://localhost:3000/platillos";
        fetch(url)
            .then((result) => {
                return result.json();
            }).then((result) => {
                mostrarPlatos(result);
            });
    }
}

function mostrarPlatos(comidas) {
    const contenido = document.querySelector("#platillos .contenido");

    comidas.forEach(comida => {
        // console.log(comida);
        const row = document.createElement("DIV");
        row.classList.add("row", "py-3","border-top");

        const nombre = document.createElement("DIV");
        nombre.classList.add("col-md-4");
        nombre.textContent = comida.nombre;

        const precio = document.createElement("DIV");
        precio.classList.add("col-md-3", "fw-bold");
        precio.textContent = `$${comida.precio}`;

        const categoria = document.createElement("DIV");
        categoria.classList.add("col-md-3");
        categoria.textContent = categorias[comida.categoria];

        const inputCantidad = document.createElement("INPUT");
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${comida.id}`;
        inputCantidad.classList.add("form-control");

        //Función que detecta la cantidad y la comida que se agrega
        //Le asociamos un evento al input
        inputCantidad.onchange =function() {
            const cantidad = parseInt(inputCantidad.value); //Lo convertimos a number
            agregarPlatillo({...comida, cantidad}); //Le pasamos un obj, en este caso un spred operator de comida
            //Le pasamos el spred operator para que quede como un objeto junto de comida y cantidad
        }; /*Le agregamos este eventListener porque es un btn que se crea a partir de un script, no se le puede agregar un eventListener normal*/

        
        
        const agregar = document.createElement("DIV");
        agregar.classList.add("col-md-2");
        agregar.appendChild(inputCantidad);
        
        
        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);
        
        contenido.appendChild(row);
    });
}


function agregarPlatillo(producto) {

    let { pedido } = cliente; //Extraemos pedido de cliente
    
    //Revisar si la cantidad sea mayor a 0
    if(producto.cantidad > 0){

        //Comprueba si el elemento ya existe en el array
        if(pedido.some(articulo => articulo.id === producto.id)){
            //El artículo ya existe, actualizamos la cantidad
            //Usamos un map
            const pedidoActualizado = pedido.map(articulo =>{
                if(articulo.id === producto.id){ //Si el artículo y el producto tienen igual id actualizamos su cantidad.
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            }); 
            //Se asigna el nuevo arrray a cliente.pedido
            cliente.pedido = [...pedidoActualizado];
        } else {
            //El articulo no existe lo agregamos al array de pedidos
            cliente.pedido = [...pedido, producto]; //Le agregamos una copia de pedido actual y el nuevo producto.
        }

        

    } else{
        //Eliminar elementos cuanto la cantidad es 0
        const resultado = pedido.filter( articulo => articulo.id !== producto.id)
        /*articulo.id es el id que tenemos en memoria*/
        //Nos va a retornar los que sean diferentes al que estamos eliminando
        cliente.pedido = resultado;
    }

    //Limpia el HTML previo
    limpiarHTML();

    if(cliente.pedido.length){
        mostrarResumen();
    } else {
        mensajePedidoVacio();
    }

}

function mostrarResumen() {

    const contenido = document.querySelector("#resumen .contenido");
    // console.log(cliente);

    const resumen = document.createElement("DIV");
    resumen.classList.add("col-md-6", "card", "py-5", "px-3", "shadow");

    //Información mesa
    const mesa = document.createElement("P");
    mesa.textContent = "Mesa: ";
    mesa.classList.add("fw-bold");

    const mesaSpan = document.createElement("SPAN");
    mesaSpan.textContent = cliente.mesa; //No le pasamos el obj como argumento porque esta en el ambitog global el obj Cliente
    mesaSpan.classList.add("fw-normal");
    
    //Información hora
    const hora = document.createElement("P");
    hora.textContent = "Hora: ";
    hora.classList.add("fw-bold");

    const horaSpan = document.createElement("SPAN");
    horaSpan.textContent = cliente.hora; //No le pasamos el obj como argumento porque esta en el ambitog global el obj Cliente
    horaSpan.classList.add("fw-normal");

    //Agregar a los elementos padre
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //Titulo de la sección
    const heading = document.createElement("H3");
    heading.textContent = "Platos consumidos";
    heading.classList.add("my-4", "text-center");
    
    
    //Iterar el array de pedidos
    const grupo = document.createElement("UL");
    grupo.classList.add("list-group");

    //Producto pedido
    const {pedido} = cliente;
    pedido.forEach(articulo => {
        const { nombre, cantidad, precio, id } = articulo;

        const lista = document.createElement("LI");
        lista.classList.add("list-group-item");

        //Añadimos nombre
        const nombreEl = document.createElement("h4");
        nombreEl.classList.add("my-4");
        nombreEl.textContent = nombre;

        //Añadimos cantidad
        const cantidadEl = document.createElement("P");
        cantidadEl.classList.add("fw-bold");
        cantidadEl.textContent = `Cantidad: `;

        const cantidadValor = document.createElement("SPAN");
        cantidadValor.classList.add("fw-normal");
        cantidadValor.textContent = cantidad;
        
        cantidadEl.appendChild(cantidadValor);
        
        //Añadimos precio
        const precioEl = document.createElement("P");
        precioEl.classList.add("fw-bold");
        precioEl.textContent = `Cantidad: `;
        
        const precioValor = document.createElement("SPAN");
        precioValor.classList.add("fw-normal");
        precioValor.textContent = `$${precio}`;
        
        precioEl.appendChild(precioValor);

        //Añadimos subtotal
        const subtotalEl = document.createElement("P");
        subtotalEl.classList.add("fw-bold");
        subtotalEl.textContent = `Subtotal: `;
        
        const subtotalValor = document.createElement("SPAN");
        subtotalValor.classList.add("fw-normal");
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);

        subtotalEl.appendChild(subtotalValor);
        
        //Botón para eliminar
        const btnEliminar = document.createElement("BUTTON");
        btnEliminar.classList.add("btn", "btn-danger");
        btnEliminar.textContent = "Eliminar del pedido";

        //Función para eliminar del pedido
        btnEliminar.onclick = function() {
            eliminarProducto(id);
        }

        //Agregar elementos al LI
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);

        grupo.appendChild(lista);
    });

    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);

    //Agregar al contenedor
    contenido.appendChild(resumen);
}

function limpiarHTML() {
    const contenido = document.querySelector("#resumen .contenido");
    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }
}

function calcularSubtotal(precio,cantidad) {
    return `$ ${precio * cantidad}`;
}

function eliminarProducto(id) {
    const {pedido} = cliente;
    //Eliminar elementos cuanto la cantidad es 0
    const resultado = pedido.filter( articulo => articulo.id !== id)
    /*articulo.id es el id que tenemos en memoria*/
    //Nos va a retornar los que sean diferentes al que estamos eliminando
    cliente.pedido = [...resultado];

    limpiarHTML();

    if(cliente.pedido.length){
        mostrarResumen();
    } else {
        mensajePedidoVacio();
    }

    //El producto se elimino
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado); //Le pasamos el id como tal del producto que queremos eliminar
    inputEliminado.value = 0;
}

function mensajePedidoVacio() {
    const contenido = document.querySelector("#resumen .contenido");

    const texto = document.createElement("P");
    texto.classList.add("text-center");
    texto.textContent = "Añade los elemento del pedido";

    contenido.appendChild(texto);
}