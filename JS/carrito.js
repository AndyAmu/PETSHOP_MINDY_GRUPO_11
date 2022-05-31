let ProductosAlmacenados = JSON.parse(localStorage.getItem("Productos"))
let tablaProductos = document.getElementById("tabla-productos");
let tablaFooter = document.getElementById("tabla-footer");
let precioTotal = 0

const f = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits:2
});

ProductosAlmacenados.forEach(producto => {
	precioTotal += producto.precio * producto.carrito;
	tablaProductos.innerHTML += `<tr>
									<th scope="row">${producto.nombre}</th>
									<td>${producto.tipo}</td>
									<td>${f.format(producto.precio)}</td>
									<td>${producto.carrito}</td>
								</tr>`
})
tablaFooter.innerHTML = `<tr>
			<th scope="row" colspan="2">El precio total es </th>
			<td>${f.format(precioTotal)}</td>
			<td><button onclick="realizarCompra()" type="button" class="btn btn-success">Comprar</button></td>
</tr>`
function realizarCompra(){
	swal("Compra realizada con exito", "Muchas gracias por confiar en nuestros productos", "success");
	localStorage.clear();
}