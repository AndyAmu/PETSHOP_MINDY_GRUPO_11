let cards = document.querySelector(".cards");
var productos = []
var ProductosAlmacenados = [];
async function getData(){
	await fetch(`https://apipetshop.herokuapp.com/api/articulos`)
		.then(response => response.json())
		.then(json =>{
			productos = json.response;
			ProductosAlmacenados = JSON.parse(localStorage.getItem("Productos"))
			cargarProductos();
		});
        console.log(productos)
}
getData();

function mostrarProducto(articulo) {
	cards.innerHTML +=
    ` 
	<div class="card mb-4" style="width: 30rem;">
	
	<img src="${articulo.imagen}" class="card-img-top" alt="...">
	<div class="card-body text-black">
		<h5 class="card-title">${articulo.nombre}</h5>
		<p class="card-text">Stock ${articulo.stock}</p>
		<p class="card-text">$${articulo.precio}</p>
        <p class="card-text">${articulo.descripcion}</p>
        <div"><a href="detalles.html?id=${articulo._id}" class="btn btn-primary">Ver mas!!</a></div>
		<div class="carrito">
			<button onclick="añadirProducto('${articulo._id}')" class="see-more btn btn-primary">Añadir al carrito</button>
				<span>en el carrito: ${articulo.carrito}</span>
				<button onclick="quitarProducto('${articulo._id}')" class="see-more btn btn-dark">quitar del carrito</button>
				<div class="card-footer mt-2 bg-warning text-muted ${articulo.stock > 5 ? 'oculto' : ''}">
				<p class="footer-card-text">Ultimas unidades!!!</p>

			</div>
	</div>
</div>
`
}


function añadirProducto(idProducto){
	let producto = productos.find(elemento => elemento._id === idProducto);
	ProductosAlmacenados = JSON.parse(localStorage.getItem("Productos"))
	if(ProductosAlmacenados)
	{
		productoPresente = ProductosAlmacenados.find(elemento => elemento._id === idProducto);
		ProductosAlmacenados = ProductosAlmacenados.filter(elemento => elemento._id != producto._id);
		if(productoPresente){
			productoPresente.carrito++;
			ProductosAlmacenados.push(productoPresente)
		}else{
			producto.carrito++;
			ProductosAlmacenados.push(producto)
		}
	}else{	
		ProductosAlmacenados = [producto]
	}
    
    localStorage.setItem("Productos", JSON.stringify(ProductosAlmacenados))
	cargarProductos();
	mostrarCantidadProductos();
}

function quitarProducto(idProducto){
	let producto = productos.find(elemento => elemento._id === idProducto);
	ProductosAlmacenados = JSON.parse(localStorage.getItem("Productos"))
	if(ProductosAlmacenados)
	{
		productoPresente = ProductosAlmacenados.find(elemento => elemento._id === idProducto);
		ProductosAlmacenados = ProductosAlmacenados.filter(elemento => elemento._id != producto._id);
		if(productoPresente){
			if(productoPresente.carrito==0){
				ProductosAlmacenados.push(producto)
			}
			else{
				productoPresente.carrito--;
				ProductosAlmacenados.push(productoPresente)
			}
		}else{
			ProductosAlmacenados.push(producto)
		}
	}else{	
		ProductosAlmacenados = [producto]
	}
    
    localStorage.setItem("Productos", JSON.stringify(ProductosAlmacenados))
	cargarProductos();
	mostrarCantidadProductos();
}

function cargarProductos(){
	productos.map(producto =>{
		if(ProductosAlmacenados){
			productoPresente = ProductosAlmacenados.find(elemento => elemento._id == producto._id);
			if(productoPresente){
				producto.carrito = productoPresente.carrito;
			}
			else{
				producto.carrito = 0
			}
		}else{
			producto.carrito = 0
		}
	})
	cards.innerHTML = "";
	productos.forEach(articulo =>{
		if(articulo.tipo == "Juguete"){
			mostrarProducto(articulo)
		}
	})
}