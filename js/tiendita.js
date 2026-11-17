
// Convierte un archivo (input type="file") a base64. Si no hay archivo devuelve ""
const archivoABase64 = (archivo) => new Promise((resolve, reject) => {
    if (!archivo) { resolve(""); return; }
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result);
    lector.onerror = reject;
    lector.readAsDataURL(archivo);
});

const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: "btn-solid theme-success mx-5",
        cancelButton: "btn-solid theme-danger"
    },
    buttonsStyling: false
});

const negro = Swal.mixin({
    customClass: {
        confirmButton: "btn-solid btn-styled theme-sencondary",
    },
    buttonsStyling: false
});

var btnSave = document.getElementById("btnSave");
var btnEdit = document.getElementById("btnEdit");
var productos = [];
var categorias = [];

btnSave.onclick = async () => {
    const txtNombre = document.getElementById("nombre");
    const txtPrecio = document.getElementById("precio");
    const txtCantidad = document.getElementById("cantidad");
    const txtCategoria = document.getElementById("categoria");
    const ImgImagen = document.getElementById("imagen");
    if (txtNombre.value == "" || txtPrecio.value == "" || txtCantidad.value == "" || txtCategoria.value == "") {
        alert("ERROR: CAMPOS VACIOS");
        return;
    }
    const imagen64 = await archivoABase64(ImgImagen.files[0]);
    const producto = {
        nombre: txtNombre.value,
        precio: txtPrecio.value,
        cantidad: txtCantidad.value,
        categoria: txtCategoria.value,
        imagen: imagen64
    };

    productos.push(producto);
    localStorage.setItem("productos", JSON.stringify(productos));
    cargarProductos();
    document.getElementById("addProducto").close();
    txtNombre.value = "";
    txtPrecio.value = "";
    txtCantidad.value = "";
    txtCategoria.value = "";
    ImgImagen.value = "";
};

btnEdit.onclick = async () => {
    const txtNombre = document.getElementById("nombree");
    const txtPrecio = document.getElementById("precioe");
    const txtCantidad = document.getElementById("cantidade");
    const txtCategoria = document.getElementById("categoriae");
    const ImgImagen = document.getElementById("imagene");
    const posicion = document.getElementById("posicion");
    if (txtNombre.value == "" || txtPrecio.value == "" || txtCantidad.value == "" || txtCategoria.value == "") {
        alert("ERROR: CAMPOS VACIOS");
        return;
    }
    productos[posicion.value].nombre = txtNombre.value;
    productos[posicion.value].precio = txtPrecio.value;
    productos[posicion.value].cantidad = txtCantidad.value;
    productos[posicion.value].categoria = txtCategoria.value;
    if (ImgImagen.files[0]) {
        productos[posicion.value].imagen = await archivoABase64(ImgImagen.files[0]);
    }
    localStorage.setItem("productos", JSON.stringify(productos));
    cargarProductos();
    ImgImagen.value = "";
    document.getElementById("editProducto").close();
};

const cargarProductos = () => {
    let posicion = 0;
    productos = JSON.parse(localStorage.getItem("productos")) || [];
    const tbody = document.getElementById("productos");
    const flitro=document.getElementById("filtroCategoria").value;
    var tabla = "";
    productos.map((producto) => {
        if(flitro==""|| producto.categoria==flitro){
            const img = producto.imagen
                ? `<img src="${producto.imagen}" alt="${producto.nombre}" style="width:60px;height:60px;object-fit:cover;">`
                : "Sin imagen";
            tabla += `<tr class="text-center">
                    <td><b>${producto.nombre.toUpperCase()}</b></td>
                    <td><b>${parseFloat(producto.precio).toFixed(2)}</b></td>
                    <td><b>${parseInt(producto.cantidad)}</b></td>
                    <td><b>${producto.categoria}</b></td>
                    <td>${img}</td>
                    <td>
                        <button class="btn-solid theme-danger" onclick="eliminarProducto(${posicion})"><i class="bi bi-trash"></i></button>
                        <button class="btn-solid theme-warning" data-bs-toggle="dialog" data-bs-target="#editProducto" onclick="editarProducto(${posicion})"><i class="bi bi-pen"></i></button>
                    </td>
            </tr>`;
        }
        
        posicion++;
    });
    tbody.innerHTML = tabla;
};
document.getElementById("filtroCategoria").onchange=()=>{
    cargarProductos();
}

const eliminarProducto = (posicion) => {
    swalWithBootstrapButtons.fire({
        title: "Eliminar Registro",
        text: "Estas seguro de eliminar este registro?",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            productos.splice(posicion, 1);
            localStorage.setItem("productos", JSON.stringify(productos));
            cargarProductos();
            negro.fire({ title: "EXITO", text: "Se elimino correctamente", icon: "success" });
        }
    });
};

const editarProducto = (posicion) => {
    const producto = productos[posicion];
    document.getElementById("nombree").value = producto.nombre;
    document.getElementById("precioe").value = producto.precio;
    document.getElementById("cantidade").value = producto.cantidad;
    document.getElementById("categoriae").value = producto.categoria;
    document.getElementById("imagene").value = "";
    document.getElementById("posicion").value = posicion;
};

var btnSaveC = document.getElementById("btnSaveCategoria");
var btnEditC = document.getElementById("btnEditCategoria");

btnSaveC.onclick = async () => {
    const txtCategoria = document.getElementById("Categorias");
    const ImgImagen = document.getElementById("Imagenes");
    if (txtCategoria.value.trim() == "" || !ImgImagen.files[0]) {
        alert("ERROR: CAMPOS VACIOS");
        return;
    }
    if (categorias.some(c => c.categoria.toLowerCase() === txtCategoria.value.trim().toLowerCase())) {
        alert("ERROR: ESA CATEGORIA YA EXISTE");
        return;
    }
    const imagen64 = await archivoABase64(ImgImagen.files[0]);
    categorias.push({
        categoria: txtCategoria.value.trim(),
        imagen: imagen64
    });
    localStorage.setItem("categorias", JSON.stringify(categorias));
    cargarCategorias();
    document.getElementById("addCategorias").close();
    txtCategoria.value = "";
    ImgImagen.value = "";
};

btnEditC.onclick = async () => {
    const txtCategoria = document.getElementById("Categoriase");
    const ImgImagen = document.getElementById("Imagenese");
    const posiciones = document.getElementById("posiciones");
    const nuevoNombre = txtCategoria.value.trim();
    if (nuevoNombre == "") {
        alert("ERROR: CAMPOS VACIOS");
        return;
    }
    const repetida = categorias.some((c, i) =>
        i != posiciones.value && c.categoria.toLowerCase() === nuevoNombre.toLowerCase());
    if (repetida) {
        alert("ERROR: ESA CATEGORIA YA EXISTE");
        return;
    }
    const nombreAnterior = categorias[posiciones.value].categoria;
    categorias[posiciones.value].categoria = nuevoNombre;
    if (ImgImagen.files[0]) {
        categorias[posiciones.value].imagen = await archivoABase64(ImgImagen.files[0]);
    }
    localStorage.setItem("categorias", JSON.stringify(categorias));

    if (nombreAnterior !== nuevoNombre) {
        productos.forEach(p => { if (p.categoria === nombreAnterior) p.categoria = nuevoNombre; });
        localStorage.setItem("productos", JSON.stringify(productos));
        cargarProductos();
    }
    cargarCategorias();
    ImgImagen.value = "";
    document.getElementById("editCategoria").close();
};

const llenarSelectCategorias = () => {
    const opciones = '<option value="">Selecciona una categoria</option>' +
        categorias.map(c => `<option value="${c.categoria}">${c.categoria}</option>`).join("");
    ["categoria", "categoriae"].forEach(id => {
        const select = document.getElementById(id);
        const valorActual = select.value;
        select.innerHTML = opciones;
        select.value = valorActual;
    });
    const filtro=document.getElementById("filtroCategoria");
    filtro.innerHTML= filtro.innerHTML = '<option value="">Todas las categorias</option>' + categorias.map(c => `<option value="${c.categoria}">${c.categoria}</option>`).join("");
};

const cargarCategorias = () => {
    let posiciones = 0;
    categorias = JSON.parse(localStorage.getItem("categorias")) || [];
    const tbody = document.getElementById("categoriasTotales");
    var tablas = "";
    categorias.map((cat) => {
        const img = cat.imagen
            ? `<img src="${cat.imagen}" alt="${cat.categoria}" style="width:60px;height:60px;object-fit:cover;">`
            : "Sin imagen";
        tablas += `<tr class="text-center">
                    <td><b>${cat.categoria.toUpperCase()}</b></td>
                    <td>${img}</td>
                    <td>
                        <button class="btn-solid theme-danger" onclick="eliminarCategorias(${posiciones})"><i class="bi bi-trash"></i></button>
                        <button class="btn-solid theme-warning" data-bs-toggle="dialog" data-bs-target="#editCategoria" onclick="editarCategorias(${posiciones})"><i class="bi bi-pen"></i></button>
                    </td>
                </tr>`;
        posiciones++;
    });
    tbody.innerHTML = tablas;
    llenarSelectCategorias();
};

const eliminarCategorias = (posiciones) => {
    const nombre = categorias[posiciones].categoria;
    if (productos.some(p => p.categoria === nombre)) {
        negro.fire({ title: "ERROR", text: "Hay productos usando esta categoria", icon: "error" });
        return;
    }
    swalWithBootstrapButtons.fire({
        title: "Eliminar Registro",
        text: "Estas seguro de eliminar este registro?",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            categorias.splice(posiciones, 1);
            localStorage.setItem("categorias", JSON.stringify(categorias));
            cargarCategorias();
            negro.fire({ title: "EXITO", text: "Se elimino correctamente", icon: "success" });
        }
    });
};

const editarCategorias = (posiciones) => {
    const cat = categorias[posiciones];
    document.getElementById("Categoriase").value = cat.categoria;
    document.getElementById("Imagenese").value = "";
    document.getElementById("posiciones").value = posiciones;
};
cargarCategorias();
cargarProductos();