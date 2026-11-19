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
        confirmButton: "btn-solid btn-styled theme-secondary",
    },
    buttonsStyling: false
});

var btnSave = document.getElementById("btnSave");
var btnEdit = document.getElementById("btnEdit");
var productos = [];
var categorias = [];
var dtProductos = null;
var dtCategorias = null;


const idiomaES = {
    search: "Buscar:",
    lengthMenu: "Mostrar _MENU_ registros",
    info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
    infoEmpty: "Mostrando 0 registros",
    infoFiltered: "(filtrado de _MAX_ en total)",
    zeroRecords: "No se encontraron resultados",
    emptyTable: "No hay datos disponibles",
    paginate: {
        first: "Primero",
        last: "Ultimo",
        next: "Siguiente",
        previous: "Anterior"
    }
};

const crearDataTable = (selector, columnasSinOrden) => {
    const dt = $(selector).DataTable({
        autoWidth: false,
        orderCellsTop: true,   // el orden se activa con la primera fila del encabezado
        order: [],             // respeta el orden en que se guardaron
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50],
        columnDefs: [{ targets: columnasSinOrden, orderable: false, searchable: false }],
        language: idiomaES
    });

    // Un filtro por columna (segunda fila del encabezado)
    $(selector + " thead tr.filtros input").on("input", function () {
        const columna = $(this).parent().index();
        dt.column(columna).search(this.value).draw();
    });

    return dt;
};

const iniciarTablas = () => {
    dtProductos = crearDataTable("#tablaProductos", [4, 5]);
    dtCategorias = crearDataTable("#tablaCategorias", [1, 2]);

    // La tabla de Categoria se inicia oculta: se reajusta al abrir su pestaña
    document.getElementById("list-messages-list").addEventListener("click", () => {
        setTimeout(() => dtCategorias.columns.adjust(), 150);
    });
    document.getElementById("list-profile-list").addEventListener("click", () => {
        setTimeout(() => dtProductos.columns.adjust(), 150);
    });
};

// Reemplaza las filas de un DataTable sin perder filtros ni página
const llenarDataTable = (dt, htmlFilas) => {
    dt.clear();
    if (htmlFilas) {
        dt.rows.add($(htmlFilas).filter("tr"));
    }
    dt.draw(false);
};

// Posiciones (índices del arreglo original) de las filas visibles tras filtrar
const posicionesFiltradas = (dt) =>
    dt.rows({ search: "applied" }).nodes().toArray().map(n => parseInt(n.dataset.pos));

// ================= PRODUCTOS =================

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
    const filtro = document.getElementById("filtroCategoria").value;
    var tabla = "";
    productos.map((producto) => {
        if (filtro == "" || producto.categoria == filtro) {
            const img = producto.imagen
                ? `<img src="${producto.imagen}" alt="${producto.nombre}" style="width:60px;height:60px;object-fit:cover;">`
                : "Sin imagen";
            tabla += `<tr class="text-center" data-pos="${posicion}">
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
    llenarDataTable(dtProductos, tabla.trim());
};

document.getElementById("filtroCategoria").onchange = () => {
    cargarProductos();
};

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

// ================= CATEGORIAS =================

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
    const filtro = document.getElementById("filtroCategoria");
    const filtroActual = filtro.value;
    filtro.innerHTML = '<option value="">Todas las categorias</option>' +
        categorias.map(c => `<option value="${c.categoria}">${c.categoria}</option>`).join("");
    filtro.value = filtroActual;
};

const cargarCategorias = () => {
    let posiciones = 0;
    categorias = JSON.parse(localStorage.getItem("categorias")) || [];
    var tablas = "";
    categorias.map((cat) => {
        const img = cat.imagen
            ? `<img src="${cat.imagen}" alt="${cat.categoria}" style="width:60px;height:60px;object-fit:cover;">`
            : "Sin imagen";
        tablas += `<tr class="text-center" data-pos="${posiciones}">
                    <td><b>${cat.categoria.toUpperCase()}</b></td>
                    <td>${img}</td>
                    <td>
                        <button class="btn-solid theme-danger" onclick="eliminarCategorias(${posiciones})"><i class="bi bi-trash"></i></button>
                        <button class="btn-solid theme-warning" data-bs-toggle="dialog" data-bs-target="#editCategoria" onclick="editarCategorias(${posiciones})"><i class="bi bi-pen"></i></button>
                    </td>
                </tr>`;
        posiciones++;
    });
    llenarDataTable(dtCategorias, tablas.trim());
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

// ================= EXPORTAR EXCEL / PDF =================
// Exportan lo que se ve en la tabla: respetan los filtros por columna.

const exportarExcel = (filas, nombreHoja, archivo) => {
    if (filas.length === 0) {
        alert("No hay datos para exportar");
        return;
    }
    const hoja = XLSX.utils.json_to_sheet(filas);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, nombreHoja);
    XLSX.writeFile(libro, archivo);
};

const exportarPDF = (titulo, columnas, filas, imagenes) => {
    if (filas.length === 0) {
        alert("No hay datos para exportar");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(titulo, 14, 15);

    const colImagen = columnas.length - 1; // la imagen es la última columna

    doc.autoTable({
        startY: 22,
        head: [columnas],
        body: filas,
        styles: { halign: "center", valign: "middle", minCellHeight: 20 },
        headStyles: { fillColor: [13, 110, 253] },
        didDrawCell: (data) => {
            if (data.section === "body" && data.column.index === colImagen) {
                const img = imagenes[data.row.index];
                if (img) {
                    try {
                        const formato = img.substring(img.indexOf("/") + 1, img.indexOf(";")).toUpperCase();
                        doc.addImage(img, formato === "JPG" ? "JPEG" : formato,
                            data.cell.x + 2, data.cell.y + 2, 16, 16);
                    } catch (e) {
                        console.warn("No se pudo agregar la imagen al PDF", e);
                    }
                }
            }
        }
    });

    window.open(doc.output("bloburl"), "_blank");
};

// ---------- Productos ----------
const productosFiltrados = () => posicionesFiltradas(dtProductos).map(i => productos[i]);

document.getElementById("btnExcelProductos").onclick = () => {
    const filas = productosFiltrados().map(p => ({
        Producto: p.nombre.toUpperCase(),
        Precio: parseFloat(p.precio),
        Cantidad: parseInt(p.cantidad),
        Categoria: p.categoria
    }));
    exportarExcel(filas, "Productos", "productos.xlsx");
};

document.getElementById("btnPdfProductos").onclick = () => {
    const lista = productosFiltrados();
    const filas = lista.map(p => [
        p.nombre.toUpperCase(),
        parseFloat(p.precio).toFixed(2),
        parseInt(p.cantidad),
        p.categoria,
        ""
    ]);
    const imagenes = lista.map(p => p.imagen);
    exportarPDF("Productos", ["Producto", "Precio", "Cantidad", "Categoria", "Imagen"], filas, imagenes);
};

// ---------- Categorías ----------
const categoriasFiltradas = () => posicionesFiltradas(dtCategorias).map(i => categorias[i]);

document.getElementById("btnExcelCategorias").onclick = () => {
    const filas = categoriasFiltradas().map(c => ({ Categoria: c.categoria.toUpperCase() }));
    exportarExcel(filas, "Categorias", "categorias.xlsx");
};

document.getElementById("btnPdfCategorias").onclick = () => {
    const lista = categoriasFiltradas();
    const filas = lista.map(c => [c.categoria.toUpperCase(), ""]);
    const imagenes = lista.map(c => c.imagen);
    exportarPDF("Categorias", ["Categoria", "Imagen"], filas, imagenes);
};

// ---------- Inicio (siempre al final) ----------
iniciarTablas();
cargarCategorias();
cargarProductos();