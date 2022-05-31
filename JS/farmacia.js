let cards = document.querySelector(".cards");
let productos = []
let ProductosAlmacenados = [];
let filtroPrecio = document.getElementById("precios");
var inputSearch = document.getElementById("search");
let valorfiltroPrecio = "precios";
let textSearch = "";
async function getData(){
	await fetch(`https://apipetshop.herokuapp.com/api/articulos`)
		.then(response => response.json())
		.then(json =>{
			productos = json.response;
			productos = productos.filter(producto => producto.tipo == "Medicamento")
			ProductosAlmacenados = JSON.parse(localStorage.getItem("Productos"))
			cargarProductos(productos);
			getPrecios();
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
						<span class="${articulo.carrito==0 ? "oculto": ""}">en el carrito: ${articulo.carrito}</span>
						<button onclick="quitarProducto('${articulo._id}')" class="see-more btn btn-primary ${articulo.carrito==0 ? "oculto": ""}">quitar del carrito</button>
					
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
			if(productoPresente.stock!=0){
				productoPresente.carrito++;
				productoPresente.stock--;
				ProductosAlmacenados.push(productoPresente)
			}else{
				ProductosAlmacenados.push(productoPresente)
				swal("Espera un momento", "No hay mas articulos en stock", "warning");
			}
			
		}else{
			producto.carrito++;
			ProductosAlmacenados.push(producto)
		}
	}else{	
		producto.carrito++;
		ProductosAlmacenados = [producto]
	}
    
    localStorage.setItem("Productos", JSON.stringify(ProductosAlmacenados))
	cargarProductos(productos);
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
				swal("ya quitaste todos los productos")
			}
			else{
				productoPresente.carrito--;
				productoPresente.stock++;
				if(productoPresente.carrito!=0){
					ProductosAlmacenados.push(productoPresente)
				}
				
			}
		}
	}else{	
		ProductosAlmacenados = [producto]
	}
    
    localStorage.setItem("Productos", JSON.stringify(ProductosAlmacenados))
	cargarProductos(productos);
}

function cargarProductos(productos){
	productos.map(producto =>{
		if(ProductosAlmacenados){
			productoPresente = ProductosAlmacenados.find(elemento => elemento._id == producto._id);
			if(productoPresente){
				producto.carrito = productoPresente.carrito;
				producto.stock = productoPresente.stock;
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
			mostrarProducto(articulo)
	})
}
//Juguete

function getPrecios(){
	precios = productos.map(producto =>producto.precio);
	precios = precios.filter((precio,index) => precios.indexOf(precio) === index);
	filtroPrecio.innerHTML= `<option selected value="precios">Precios</option>`
	precios.forEach(precio => filtroPrecio.innerHTML += `<option value="${precio}"> Precio <= ${precio} </option>`)
}
filtroPrecio.addEventListener("change", event => {
	valorfiltroPrecio = event.target.value;
	filtrarCards();
})


inputSearch.addEventListener("keyup", (event) => {
	textSearch = event.target.value;
	filtrarCards();
});

function filtrarCards() {
	if (valorfiltroPrecio == "precios" && textSearch==""){
		cargarProductos(productos);
	}else if(valorfiltroPrecio != "precios" && textSearch==""){
		cargarProductos(productos.filter(producto => producto.precio <= valorfiltroPrecio))
	}else if(valorfiltroPrecio == "precios" && textSearch!=""){
		cargarProductos(productos.filter(producto => producto.nombre.toLowerCase().includes(textSearch.trim().toLowerCase())))
	}else{
		cargarProductos(productos.filter(producto => producto.nombre.toLowerCase().includes(textSearch.trim().toLowerCase()) && producto.precio <= valorfiltroPrecio))
	}
}
