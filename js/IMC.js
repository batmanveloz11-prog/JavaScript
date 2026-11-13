const iniciar = () => {
    const btnCalcular = document.getElementById("calcular");
    btnCalcular.addEventListener("click", clickBtnCalcular);

    const btnReset = document.getElementById("reset");
    btnReset.addEventListener("click", () => {
        document.getElementById("resultado").innerHTML = "";
        document.getElementById("resultadoTitulo").innerText = "";
    });
};

const clickBtnCalcular = (e) => {
    e.preventDefault(); 

    const txtPeso = document.getElementById("peso");
    const txtAltura = document.getElementById("altura");

    const peso = parseFloat(txtPeso.value);
    const altura = parseFloat(txtAltura.value);

    /*if (isNaN(peso) || isNaN(altura) || altura <= 0 || peso <= 0) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Datos inválidos',
                text: 'Por favor ingresa un peso y una altura válidos.'
            });
        } else {
            alert("Por favor ingresa un peso y una altura válidos.");
        }
        return;
    }*/

    const imc = peso / (altura * altura);
    
    let diagnostico = "";
    if (imc < 18.5) diagnostico = `<b style="color: blue;"> Bajo peso </b>`;
    else if (imc < 25) diagnostico = `<b style="color: green;"> Peso normal </b>`;
    else if (imc < 30) diagnostico = `<b style="color: orange;"> Sobrepeso </b>`;
    else diagnostico = `<b style="color: red;"> Obesidad </b>`;
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = `${imc.toFixed(2)} - ${diagnostico}`;

    resultado.animate(
        [
            { opacity: 0, transform: 'translateX(20px) scale(0.9)' },
            { opacity: 1, transform: 'translateX(0) scale(1)' }
        ],
        { duration: 500, easing: 'ease-out', fill: 'forwards' }
    );

    document.getElementById("resultado").innerHTML = `${imc.toFixed(2)} - ${diagnostico}`;

};

window.onload = iniciar;