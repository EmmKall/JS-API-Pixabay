const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const paginacionDiv = document.querySelector('#paginacion');

let totalPaginas;
let iterador;
let paginaActual = 1;

const registrosPagina = 40;

window.onload = () => {
    formulario.addEventListener('submit', validadFormulario);
}

function validadFormulario(e){
    e.preventDefault();

    const temario = document.querySelector('#termino').value;

    if( temario === '' ){
        mostrarmensaje('Ingrese el elemento a buscar', 'error');
        return;
    }

    mostrarmensaje('Consultando...');

    buscarImagenes();

}

function mostrarmensaje(mensaje, tipo = 'success'){

    const alerta = document.querySelector('.alert');
    if( alerta ) alerta.remove();

    const mensajeDiv = document.createElement('DIV');
    mensajeDiv.classList.add('alert', 'rounded', 'p-2', 'm-4', 'border-2', 'text-center');
    if( tipo === 'error' ) {
        mensajeDiv.classList.add('border-red-700', 'bg-red-200', 'text-red-700');
    } else {
        mensajeDiv.classList.add('border-green-700', 'bg-green-200', 'text-green-700');
    }
    mensajeDiv.innerHTML = `
        <p class="font-bold">Estatus: </p>
        <span class="">${mensaje}</span>
    `;

    formulario.appendChild(mensajeDiv);
    setTimeout(() => {
        mensajeDiv.remove();
    }, 3000);
}

function limpiarHTML(){
    while( resultado.firstChild ) resultado.removeChild( resultado.firstChild );

    while( paginacionDiv.firstChild) paginacionDiv.removeChild( paginacionDiv.firstChild );
}

function buscarImagenes(){

    const temario = document.querySelector('#termino').value;

    const key = '23107835-0a6cc5a60b0978cc4eff8e5fa';
    const url = `https://pixabay.com/api/?key=${key}&q=${temario}&per_person=${registrosPagina}&page=${paginaActual}`;
    
    fetch( url )
        .then( respuesta => respuesta.json() )
        .then( datos => {
            totalPaginas = calcularPaginas( datos.totalHits );
            mostrarImagenes( datos.hits )
        })
        .catch( error => console.log( error ))

}

function calcularPaginas( total ){
    return parseInt(Math.ceil( total / registrosPagina ));
}

function mostrarImagenes( imagenes ){

    limpiarHTML();

    imagenes.forEach( imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 my-2 rounded-lg">
                <div class="bg-blue-200">
                <img src="${previewURL}" class="w-full">
                <div class="p-4 text-center">
                    <p class="font-bold"> ${likes} <span class="font-light"> Me Gusta </span> </p>
                    <p class="font-bold"> ${views} <span class="font-light"> Veces vistas </span> </p>
                    <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer" class="block my-1 w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded rounded-3 my-2 p-1">Ver Imagen</a>
                </div>
                </div>
            </div>
        `;        
    });

    mostrarPaginador();

}

//generador que registra la cantidad de los elementos de acuerdo a las páginas
function *crearPaginador( ){
    for (let i =1; i <= totalPaginas; i++){
        yield i;
    }
}

function mostrarPaginador(){
    
    iterador = crearPaginador();
    while( true ){
        const { value, done } = iterador.next();
        if( done ) return;

        //Crea botón por cada value
        const boton = document.createElement('A');
        boton.href = '#';
        boton.dataset.value = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-blue-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'by-4', 'rounded');
        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
        }
        paginacionDiv.appendChild( boton );
    }

}