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
}
getData();

function mostrarProducto(articulo) {
	cards.innerHTML += `<div class="card mb-3 shadow" style="width: 100%;">
	<div class="row no-gutters">
		<div class="col-sm-2">
			<img class="card-img" src="${articulo.imagen}" alt="articulo">
		</div>
		<div class="col-sm-10">
			<div class="card-body">
				<h5 class="card-title">${articulo.nombre}</h5>
				<p class="card-text">${articulo.descripcion}</p>
				<p>Unidades disponibles ${articulo.stock}</p>
				<div class="d-flex justify-content-around align-items-center">
					<strong>Precio $${articulo.precio}</strong>
					<div class="carrito">
					<button onclick="añadirProducto('${articulo._id}')" class="see-more btn btn-primary">Añadir al carrito</button>
						<span>en el carrito: ${articulo.carrito}</span>
						<button onclick="quitarProducto('${articulo._id}')" class="see-more btn btn-primary">quitar del carrito</button>
					
					</div>
				</div>
			</div>
			
		</div>
	</div>
	<div class="card-footer bg-danger text-white text-muted ${articulo.stock > 5 ? 'oculto' : ''}">
		<p class="footer-card-text">Ultimas unidades!!!</p>	
	</div>
</div>`
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
		if(articulo.tipo == "Medicamento"){
			mostrarProducto(articulo)
		}
	})
}

