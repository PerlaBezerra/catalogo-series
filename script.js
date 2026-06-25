const catalogo = document.getElementById("catalogo");
const busca = document.getElementById("busca");
const filtroGenero = document.getElementById("filtroGenero");
const loading = document.getElementById("loading");

const modal = document.getElementById("modal");
const modalTitulo = document.getElementById("modalTitulo");
const modalConteudo = document.getElementById("modalConteudo");
const fecharModal = document.getElementById("fecharModal");

let series = [];

fetch("https://api.tvmaze.com/shows")
    .then(response => response.json())
    .then(data => {

        series = data.slice(0, 50);

        loading.classList.add("hidden");

        exibirSeries(series);
    })
    .catch(error => {

        console.error(error);

        loading.innerHTML = "Erro ao carregar catálogo.";
    });

function exibirSeries(lista) {

    catalogo.innerHTML = "";

    if (lista.length === 0) {
        catalogo.innerHTML = `
            <div class="col-span-full text-center text-gray-500 text-xl">
                Nenhuma série encontrada.
            </div>
        `;
        return;
    }

    lista.forEach(serie => {

        catalogo.innerHTML += `
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 hover:shadow-2xl transition duration-300">

                <img
                    src="${serie.image?.medium || ''}"
                    alt="${serie.name}"
                    class="w-full h-80 object-cover">

                <div class="p-4">

                    <h2 class="text-xl font-bold">
                        ${serie.name}
                    </h2>

                    <p class="text-gray-600 mt-2">
                        ⭐ ${serie.rating.average || "Sem avaliação"}
                    </p>

                    <p class="text-gray-600">
                        🎭 ${serie.genres[0] || "Não informado"}
                    </p>

                    <button
                        onclick="abrirModal(${serie.id})"
                        class="mt-4 w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">

                        Ver detalhes

                    </button>

                </div>

            </div>
        `;
    });
}

function abrirModal(id) {

    const serie = series.find(s => s.id === id);

    modalTitulo.textContent = serie.name;

    modalConteudo.innerHTML = `
        <img
            src="${serie.image?.original || ''}"
            alt="${serie.name}"
            class="w-full max-h-96 object-cover rounded mb-4">

        <p><strong>Idioma:</strong> ${serie.language}</p>

        <p><strong>Status:</strong> ${serie.status}</p>

        <p><strong>Estreia:</strong> ${serie.premiered}</p>

        <p><strong>Nota:</strong> ${serie.rating.average || "Sem avaliação"}</p>

        <div class="mt-4">
            ${serie.summary || "Resumo indisponível"}
        </div>
    `;

    modal.classList.remove("hidden");
}

fecharModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

busca.addEventListener("input", filtrar);
filtroGenero.addEventListener("change", filtrar);

function filtrar() {

    const texto = busca.value.toLowerCase();
    const genero = filtroGenero.value;

    const resultado = series.filter(serie => {

        const nomeOk =
            serie.name.toLowerCase().includes(texto);

        const generoOk =
            genero === "Todos" ||
            serie.genres.includes(genero);

        return nomeOk && generoOk;
    });

    exibirSeries(resultado);
}