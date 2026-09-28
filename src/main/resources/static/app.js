async function preguntar() {
    const campoPregunta = document.getElementById("pregunta");
    const respuesta = document.getElementById("respuesta");
    const boton = document.getElementById("btnPreguntar");

    const pregunta = campoPregunta.value.trim();

    if (!pregunta) {
        respuesta.innerText = "Debe ingresar una pregunta.";
        return;
    }

    respuesta.innerHTML = '<span class="cargando">Consultando documentos...</span>';
    boton.disabled = true;

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pregunta: pregunta })
        });

        if (!response.ok) {
            throw new Error("Error HTTP: " + response.status);
        }

        const data = await response.json();
        respuesta.innerText = data.respuesta;

        cargarHistorial();
    }
    catch (error) {
        console.error(error);
        respuesta.innerText = "No fue posible obtener una respuesta.";
    }
    finally {
        boton.disabled = false;
    }
}

function usarPregunta(texto) {
    document.getElementById("pregunta").value = texto;
}

async function cargarHistorial() {
    const cuerpo = document.getElementById("cuerpoHistorial");

    try {
        const response = await fetch("/api/consultas");
        if (!response.ok) {
            throw new Error("Error HTTP: " + response.status);
        }

        const consultas = await response.json();
        cuerpo.innerHTML = "";

        consultas
            .slice()
            .reverse()
            .forEach(c => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${c.id}</td>
                    <td>${c.pregunta}</td>
                    <td>${c.respuesta}</td>
                    <td>${c.fecha ?? ""}</td>
                `;
                cuerpo.appendChild(fila);
            });
    }
    catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", cargarHistorial);
