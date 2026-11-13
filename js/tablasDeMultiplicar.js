document.addEventListener("DOMContentLoaded", () => {
    var Numero = document.querySelector('#numero');
    var btnReset = document.querySelector('#reset');
    var res = document.querySelector('#res');
    const contenedorTablas = res.innerHTML;
    
    const tablas = () => {
        res.innerHTML="<img src='./img/spinner-icon-0.gif' width='200px' height='200px'>";
        setTimeout(() => {
            res.innerHTML = contenedorTablas;
            let n = parseInt(Numero.value) || 0;
            document.querySelector('#vn').innerHTML = n;
                    
            for (let i = 1; i <= 10; i++) {
                let tables = n + " x " + i + " = " + (n * i);
                document.querySelector('#tabla' + i).textContent = tables;
            }
        }, 500);
    
    }

    const reset = () => {
        Numero.value = 1;
        tablas();
    }
            
    Numero.addEventListener("input", tablas, false);
    btnReset.addEventListener('click', reset);
    tablas();
});