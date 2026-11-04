document.addEventListener("DOMContentLoaded", () => {
    var Numero = document.querySelector('#numero');
    var btnReset = document.querySelector('#reset');
    const tablas = () => {
       let n = parseInt(Numero.value) || 0;
        document.querySelector('#vn').innerHTML = n;
                
        for (let i = 1; i <= 10; i++) {
            let tables = n + " x " + i + " = " + (n * i);
            document.querySelector('#tabla' + i).textContent = tables;
        }
    }

    const reset = () => {
        Numero.value = 1;
        tablas();
    }
            
    Numero.addEventListener("input", tablas, false);
    btnReset.addEventListener('click', reset);

    tablas();
});