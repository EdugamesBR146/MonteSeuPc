const Buttons = document.querySelectorAll('.Sidebar button');

const SideBar = document.getElementById("SideBar");

let Active = false;
let Mobile = false;

function ReturnDesiredElement(father, type) {
    for (let i = 0; i < father.children.length; i++) {
        if (father.children[i].tagName === type) {
            return father.children[i];
        }
    }
}

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');

        if (contentType.includes('application/json')) {
            return await response.json();
        } else if (contentType.includes('text/csv') || contentType.includes('text/plain')) {
            return await response.text();
        } else {
            throw new Error('Unsupported content type: ' + contentType);
        }
    } catch (error) {
        console.error(`Failed to fetch data from ${url}: ${error}`);
    }
}

async function loadParts() {
    const PARTS = {
        AMDCPUS: await fetchData('https://raw.githubusercontent.com/zymos/cpu-db/master/cpu-db.AMD.csv'),
        GPUS: await fetchData('https://raw.githubusercontent.com/voidful/gpu-info-api/gpu-data/gpu.json'),
        INTELCPUS: await fetchData('https://raw.githubusercontent.com/divinity76/intel-cpu-database/master/databases/intel_cpu_database.json'),
        MOBOS: await fetchData('https://raw.githubusercontent.com/JaJabinko/data/master/motherboard.json'),
    };

    console.log(PARTS);
}

function populateHeader(data) {
    console.log(data);
}

async function DropDown() {
    const TopBar = document.getElementById("TopBar");

    TopBar.style.width = "100%";
    TopBar.style.height = "75px";

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        Mobile = true;
    } else {
        Mobile = false;
    }

    setTimeout(() => {
        if (Mobile == true) {
            TopBar.style.justifyContent = "center";
        }

        for (let i = 0; i < TopBar.children.length; i++) {
            if (TopBar.children[i].tagName == "BUTTON") {
                document.getElementById("ArrowImage").style.opacity = 1;
            } else {
                TopBar.children[i].style.opacity = 1;
            }
        }
    }, 300);
}

function NavOpen() {
    document.getElementById("Arrow").style.transform = Active ? `rotate(0deg)` : `rotate(180deg)`;

    switch (Mobile) {
        case true:
            SideBar.style.width = Active ? "0px" : "100%";
            break;
        case false:
            SideBar.style.width = Active ? "0px" : "320px";
            break;
    }

    Active = !Active;
}

function OnMouseEnter(button) {
    let Span = ReturnDesiredElement(button, "SPAN");

    if (Span) {
        button.style.borderColor = "white";
        Span.classList.add("Active");
        Span.style.color = "white";
    }
}

function OnMouseLeave(button) {
    let Span = ReturnDesiredElement(button, "SPAN");

    if (Span) {
        button.style.borderColor = "grey";
        Span.classList.remove("Active");
        Span.style.color = "grey";
    }
}

function Home() {
    Active = false;

    document.getElementById("Arrow").style.transform = `rotate(0deg)`;
    SideBar.style.width = "0px";
    document.body.style.backgroundImage = "url('https://1drv.ms/i/s!AvASYBEBVN4YhDeYsTGhHgbzpYHK?embed=1&width=1792&height=1024')";
    document.body.style.overflowY = "hidden";

    if (document.getElementsByClassName("Parts").length > 0) {
        for (i = 0; i < document.getElementsByClassName("Parts").length; i++) {
            document.body.removeChild(document.getElementsByClassName("Parts")[i]);
        }
    }
}

function NovaBuild() {
    Active = false;

    document.getElementById("Arrow").style.transform = `rotate(0deg)`;
    SideBar.style.width = "0px";
    document.body.style.backgroundImage = "url('https://1drv.ms/i/s!AvASYBEBVN4YhDjJD3VCVolFvvKL?embed=1&width=4608&height=2963')";
    document.body.style.overflowY = "scroll";
    
    if (document.getElementsByClassName("Parts").length == 0) {
        const Tipos = [
            { nome: "Armazenamento" },
            { nome: "Cooler" },
            { nome: "Fonte" },
            { nome: "Gabinete" },
            { nome: "Memórias RAM" },
            { nome: "Placa de Vídeo" },
            { nome: "Placa Mãe" },
            { nome: "Processador" },
            { nome: "Resfriamento" },
        ];
        
        const Perifericos = [
            { nome: "Controle" },
            { nome: "Monitor" },
            { nome: "Mouse" },
            { nome: "Teclado" },
            { nome: "Volante" },
        ];
        
        function createTiposTable() {
            let mainTable = document.createElement("DIV");
            mainTable.classList.add("table");
        
            let mainTableHeader1 = document.createElement("DIV");
            mainTableHeader1.classList.add("table-header");
        
            let headerPecas = document.createElement("DIV");
            headerPecas.classList.add("header__item");
            headerPecas.innerHTML = '<a id="adicionado-tipos" class="filter__link" style="pointer-events: none;">Pecas Principais</a>';
        
            mainTableHeader1.appendChild(headerPecas);
            mainTable.appendChild(mainTableHeader1);
        
            let mainTableHeader2 = document.createElement("DIV");
            mainTableHeader2.classList.add("table-header");
        
            let headerTipo = document.createElement("DIV");
            headerTipo.classList.add("header__item");
            headerTipo.innerHTML = '<a id="tipo-tipos" class="filter__link" style="pointer-events: none;">Tipo</a>';
        
            let headerPreco = document.createElement("DIV");
            headerPreco.classList.add("header__item");
            headerPreco.innerHTML = '<a id="preco-tipos" class="filter__link" style="pointer-events: none;">Preço</a>';
        
            let headerAdicionado = document.createElement("DIV");
            headerAdicionado.classList.add("header__item");
            headerAdicionado.innerHTML = '<a id="adicionado-tipos" class="filter__link" style="pointer-events: none;">Adicionado</a>';
        
            mainTableHeader2.appendChild(headerTipo);
            mainTableHeader2.appendChild(headerPreco);
            mainTableHeader2.appendChild(headerAdicionado);
            mainTable.appendChild(mainTableHeader2);
        
            let mainTableContent = document.createElement("DIV");
            mainTableContent.classList.add("table-content");
        
            Tipos.forEach(tipo => {
                let row = document.createElement("DIV");
                row.classList.add("table-row");
        
                let tipoCell = document.createElement("DIV");
                tipoCell.classList.add("table-data");
                tipoCell.textContent = tipo.nome;
                row.appendChild(tipoCell);
        
                let precoCell = document.createElement("DIV");
                precoCell.classList.add("table-data");
                precoCell.textContent = "—";
                row.appendChild(precoCell);
        
                let adicionadoCell = document.createElement("DIV");
                adicionadoCell.classList.add("table-data");
        
                const plusButton = document.createElement("DIV");
                plusButton.className = 'plusButton';
                plusButton.setAttribute('tabindex', '0');
        
                const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svgIcon.classList.add("plusIcon");
                svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                svgIcon.setAttribute('viewBox', '0 0 30 30');
        
                const gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                gElement.setAttribute('mask', 'url(#mask0_21_345)');
        
                const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                pathElement.setAttribute('d', 'M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z');
        
                gElement.appendChild(pathElement);
                svgIcon.appendChild(gElement);
        
                plusButton.appendChild(svgIcon);
                adicionadoCell.appendChild(plusButton);
        
                row.appendChild(adicionadoCell);
        
                mainTableContent.appendChild(row);
            });
        
            mainTable.appendChild(mainTableContent);
            return mainTable;
        }
        
        function createPerifericosTable() {
            let perifericosTable = document.createElement("DIV");
            perifericosTable.classList.add("table");
            perifericosTable.style.marginTop = "30px";
        
            let perifericosTableHeader1 = document.createElement("DIV");
            perifericosTableHeader1.classList.add("table-header");
        
            let headerPerifericos = document.createElement("DIV");
            headerPerifericos.classList.add("header__item");
            headerPerifericos.innerHTML = '<a id="adicionado-perifericos" class="filter__link" style="pointer-events: none;">Periféricos</a>';
        
            perifericosTableHeader1.appendChild(headerPerifericos);
            perifericosTable.appendChild(perifericosTableHeader1);
        
            let perifericosTableHeader2 = document.createElement("DIV");
            perifericosTableHeader2.classList.add("table-header");
        
            let headerTipo = document.createElement("DIV");
            headerTipo.classList.add("header__item");
            headerTipo.innerHTML = '<a id="tipo-perifericos" class="filter__link" style="pointer-events: none;">Tipo</a>';
        
            let headerPreco = document.createElement("DIV");
            headerPreco.classList.add("header__item");
            headerPreco.innerHTML = '<a id="preco-perifericos" class="filter__link" style="pointer-events: none;">Preço</a>';
        
            let headerAdicionado = document.createElement("DIV");
            headerAdicionado.classList.add("header__item");
            headerAdicionado.innerHTML = '<a id="adicionado-perifericos" class="filter__link" style="pointer-events: none;">Adicionado</a>';
        
            perifericosTableHeader2.appendChild(headerTipo);
            perifericosTableHeader2.appendChild(headerPreco);
            perifericosTableHeader2.appendChild(headerAdicionado);
            perifericosTable.appendChild(perifericosTableHeader2);
        
            let perifericosTableContent = document.createElement("DIV");
            perifericosTableContent.classList.add("table-content");
        
            Perifericos.forEach(periferico => {
                let row = document.createElement("DIV");
                row.classList.add("table-row");
        
                let tipoCell = document.createElement("DIV");
                tipoCell.classList.add("table-data");
                tipoCell.textContent = periferico.nome;
                row.appendChild(tipoCell);
        
                let precoCell = document.createElement("DIV");
                precoCell.classList.add("table-data");
                precoCell.textContent = "—";
                row.appendChild(precoCell);
        
                let adicionadoCell = document.createElement("DIV");
                adicionadoCell.classList.add("table-data");
        
                const plusButton = document.createElement("DIV");
                plusButton.className = 'plusButton';
                plusButton.setAttribute('tabindex', '0');
        
                const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svgIcon.classList.add("plusIcon");
                svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                svgIcon.setAttribute('viewBox', '0 0 30 30');
        
                const gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                gElement.setAttribute('mask', 'url(#mask0_21_345)');
        
                const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                pathElement.setAttribute('d', 'M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z');
        
                gElement.appendChild(pathElement);
                svgIcon.appendChild(gElement);
        
                plusButton.appendChild(svgIcon);
                adicionadoCell.appendChild(plusButton);
        
                row.appendChild(adicionadoCell);
        
                perifericosTableContent.appendChild(row);
            });
        
            perifericosTable.appendChild(perifericosTableContent);
            return perifericosTable;
        }
        
        function createSomaTable() {
            let somaTable = document.createElement("DIV");
            somaTable.classList.add("table");
            somaTable.style.marginTop = "30px"; 
        
            let somaTableHeader = document.createElement("DIV");
            somaTableHeader.classList.add("table-header");
        
            let headerSoma = document.createElement("DIV");
            headerSoma.classList.add("header__item");
            headerSoma.innerHTML = '<a id="soma" class="filter__link" style="pointer-events: none;">Total</a>';
        
            somaTableHeader.appendChild(headerSoma);
            somaTable.appendChild(somaTableHeader);
        
            let somaTableContent = document.createElement("DIV");
            somaTableContent.classList.add("table-content");
        
            let row = document.createElement("DIV");
            row.classList.add("table-row");
        
            let tipoCell = document.createElement("DIV");
            tipoCell.classList.add("table-data");
            tipoCell.textContent = "Total";
            row.appendChild(tipoCell);
        
            let precoCell = document.createElement("DIV");
            precoCell.classList.add("table-data");
            precoCell.textContent = "—"; 
            row.appendChild(precoCell);
        
            somaTableContent.appendChild(row);
        
            somaTable.appendChild(somaTableContent);
            return somaTable;
        }
        
        let mainTable = createTiposTable();
        let perifericosTable = createPerifericosTable();
        let somaTable = createSomaTable();
        
        document.body.appendChild(mainTable);
        document.body.appendChild(perifericosTable);
        document.body.appendChild(somaTable);
                
    }
}

loadParts();

window.onload = DropDown;
