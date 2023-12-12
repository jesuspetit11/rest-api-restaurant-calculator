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
    console.log(producto);
}
