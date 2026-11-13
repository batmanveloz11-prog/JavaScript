var btnSave=document.getElementById("btnSave");
var btnEdit=document.getElementById("btnEdit");
var productos=[];
btnSave.onclick=()=>{
    txtNombre=document.getElementById("nombre");
    txtPrecio=document.getElementById("precio");
    txtCantidad=document.getElementById("cantidad")
    if (txtNombre.value==""||txtPrecio.value=="" ||txtCantidad.value=="") {
        alert("ERROR: CAMPOS VACIOS")
    return;
    }
    const producto= {
        nombre:txtNombre.value, 
        precio:txtPrecio.value,
        cantidad:txtCantidad.value
    };

    productos.push(producto);
    console.log(producto);
    localStorage.setItem("productos",JSON.stringify(productos));
    cargarProductos();
    document.getElementById("addProducto").close();
    document.getElementById("nombre").value="";
    document.getElementById("precio").value="";
    document.getElementById("cantidad").value="";
}
btnEdit.onclick=()=>{
    txtNombre=document.getElementById("nombree");
    txtPrecio=document.getElementById("precioe");
    txtCantidad=document.getElementById("cantidade");
    posicion=document.getElementById("posicion")
    if (txtNombre.value==""||txtPrecio.value==""||txtCantidad.value=="") {
        alert("ERROR: CAMPOS VACIOS")
    return;
    }
    productos[posicion.value].nombre=txtNombre.value;
    productos[posicion.value].precio=txtPrecio.value;
    productos[posicion.value].cantidad=txtCantidad.value;
    localStorage.setItem("productos",JSON.stringify(productos));
    cargarProductos();
    document.getElementById("editProducto").close();
}
const cargarProductos=()=>{
    let posicion=0;
    productos=JSON.parse(localStorage.getItem("productos"))||[];
    tbody=document.getElementById("productos");
    var tabla="";
    productos.map((producto)=>{
        tabla+=`<tr class="text-center">
                    <td><b>${producto.nombre.toUpperCase()}</b></td>
                    <td><b>${parseFloat(producto.precio).toFixed(2)}</b></td>
                    <td><b>${parseInt(producto.cantidad)}</b></td>

                    <td>
                        <button class="btn-solid theme-danger" onclick="eliminarProducto(${posicion})"><i class="bi bi-trash"></i></button>
                        <button class="btn-solid theme-warning" data-bs-toggle="dialog" data-bs-target="#editProducto" onclick="editarProducto(${posicion})"><i class="bi bi-pen"></i></button>
                    </td>
                </tr>`;
                posicion++;
    });
    tbody.innerHTML=tabla;
}
cargarProductos();
const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: "btn-solid theme-success mx-5",
        cancelButton: "btn-solid theme-danger"
    },
    buttonsStyling: false
});

const negro = Swal.mixin({
    customClass:{
        confirmButton: "btn-solid btn-styled theme-sencondary",
    },
    buttonsStyling: false
})
const eliminarProducto=(posicion)=>{
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
            productos.splice(posicion,1);
            localStorage.setItem("productos", JSON.stringify(productos));
            cargarProductos();
            negro.fire({title: "EXITO", text: "Se elimino correctamente", icon: "success"});
        }
    });
}
const editarProducto=(posicion)=>{
    const producto=productos[posicion];
    document.getElementById("nombree").value=producto.nombre;
    document.getElementById("precioe").value=producto.precio;
    document.getElementById("cantidade").value=producto.cantidad;
    document.getElementById("posicion").value=posicion;


}