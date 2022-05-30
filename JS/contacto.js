const botonSubir=document.querySelector("form");
botonSubir.addEventListener("submit",e=>alerta(e));

function alerta(e){
    e.preventDefault();

    swal("El mensaje fue enviado, ¡gracias por escribirnos!");
}

