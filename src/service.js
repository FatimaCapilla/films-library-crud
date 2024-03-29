// Este evento se activa cuando el DOM ha sido completamente cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Al cargar el DOM, se llama a la función cargarDatos para mostrar la información inicial.
    getFilms();
});

// Metodo GET R (read) del CRUD.
async function getFilms() {
    const result = await fetch("http://localhost:3000/films")
    const data = await result.json()
    return data
}

let sectionTag = document.getElementById("film-list")
async function printFilms() {
    let films = await getFilms()
    films.map(film => {
        sectionTag.innerHTML +=
        `<h3>${film.film}</h3>
        <p>${film.director}</p>
        <div class="film-button"><button onclick="deleteFilm('${film.id}')">Delete</button>
        <button onclick="updateFilm('${film.id}')">Edit</button><hr class="line"></div>`
    })
}

// Obtener y mostrar todas las películas al cargar la página
printFilms();

//Metodo DELETE D (delete) del CRUD.
async function deleteFilm(id) {
    const result = await fetch(`http://localhost:3000/films/${id}`,
    {method: "DELETE"})
    return result
}

//Método POST C (create) del CRUD con formulario
async function createFilm() {
    const formFilm = document.getElementById("films-form")
    const newFilm = {
        "film": formFilm.elements[0].value,
        "director": formFilm.elements[1].value
    };

// Validation
    if (!newFilm.film || !newFilm.director) {
        alert('Both film and director are required.');
        return;
    }
    
// New validation for director
    const regex = /^[A-Za-z\s]+$/;
    if (!regex.test(newFilm.director)) {
        alert('Director name can only contain letters.');
        return;
        }
    
    const result = await fetch(`http://localhost:3000/films`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newFilm),
    });
}

//METODO PUT U (update) del CRUD 
// La función editarUsuario permite al usuario editar la información de una película existente.
async function updateFilm(id) {
    // Se solicita al usuario ingresar la nueva información para la película.
    const newFilm = prompt('Add the new film:');
    const newDirector = prompt('Add the new director:');

    // Verificar si el usuario ha ingresado algo
    if (newFilm !== null && newDirector !== null) {
        // Se realiza una solicitud PUT a la API para actualizar la información del usuario.
        const response = await fetch(`http://localhost:3000/films/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                film: newFilm,
                director: newDirector,
            }),
        });

        // Si la solicitud es exitosa, se recargan los datos para reflejar el cambio en la tabla.
        if (response.ok) {
            printFilms();
        } else {
            // En caso de error, se muestra un mensaje en la consola.
            console.error('Error to edit film.');
        }
    } else {
        console.error('The user cancel the operation.');
    }
}
