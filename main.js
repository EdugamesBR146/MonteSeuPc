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

async function FetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro de HTTP! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');

        if (contentType.includes('application/json')) {
            return await response.json();
        } else if (contentType.includes('text/csv') || contentType.includes('text/plain')) {
            return await response.text();
        } else {
            throw new Error('Formato de content type não suportado: ' + contentType);
        }
    } catch (error) {
        console.error(`Falha de dar fetch na data vinda de: ${url}: ${error}`);
    }
}

async function LoadParts() {
    const PARTS = {
        AMDCPUS: await FetchData('https://raw.githubusercontent.com/zymos/cpu-db/master/cpu-db.AMD.csv'),
        CONTROLLERS: await FetchData('https://raw.githubusercontent.com/mdqinc/SDL_GameControllerDB/master/gamecontrollerdb.txt'),
        GAMEPADIMGS: await FetchData('https://raw.githubusercontent.com/EdugamesBR146/GamepadImages/main/gamepadimgs.json'),
        GPUS: await FetchData('https://raw.githubusercontent.com/voidful/gpu-info-api/gpu-data/gpu.json'),
        INTELCPUS: await FetchData('https://raw.githubusercontent.com/divinity76/intel-cpu-database/master/databases/intel_cpu_database.json'),
        MOBOS: await FetchData('https://raw.githubusercontent.com/JaJabinko/data/master/motherboard.json'),
    };

    const controllers = parseControllerData(PARTS.CONTROLLERS);

    console.log(controllers);
}

function parseControllerData(data) {
    const lines = data.split('\n');

    const controllerLines = lines.filter(line => line && !line.startsWith('#'));

    const controllers = controllerLines.map(line => {
        const [guid, name, ...mappings] = line.split(',');

        const controller = {
            guid,
            name,
            mappings: {}
        };

        mappings.forEach(mapping => {
            const [key, value] = mapping.split(':');
            controller.mappings[key] = value;
        });

        return controller;
    });

    return controllers;
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

    if (document.body.style.backgroundImage == null || document.body.style.backgroundImage == "") {
        document.body.style.backgroundImage = "url('https://1drv.ms/i/s!AvASYBEBVN4YhDeYsTGhHgbzpYHK?embed=1&width=1792&height=1024')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center center";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundAttachment = "fixed";
    }

    setTimeout(() => {
        if (Mobile == true) {
            TopBar.style.justifyContent = "center";
        }

        for (let i = 0; i < TopBar.children.length; i++) {
            if (TopBar.children[i].tagName == "DIV") {
                const child = TopBar.children[i];
                
                child.style.opacity = 1;

                child.style.transform = `translateY(${TopBar.getBoundingClientRect().top + 4}px)`;

                Array.from(child.children).forEach(element => {
                    element.style.opacity = 1;
                });
            } else {
                TopBar.children[i].style.opacity = 1;
            }
        }
    }, 300);
}

function NavOpen(button) {
    button.classList.toggle( "open" );

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
    if (Active == true) {
        Active = !Active;

        document.getElementById("menu-toggle-btn").classList.toggle("open");
        SideBar.style.width = "0px";
    }

    document.body.style.backgroundImage = "url('https://1drv.ms/i/s!AvASYBEBVN4YhDeYsTGhHgbzpYHK?embed=1&width=1792&height=1024')";
    document.body.style.overflowY = "hidden";

    Array.from(document.getElementsByClassName("table")).forEach(element => {
        element.remove();
    });
    
}

function CloseParts() {
    document.body.style.overflowY = 'scroll';

    Array.from(document.getElementsByClassName("table2")).forEach(element =>{
        element.remove();
    });
}

function NovaBuild() {
    Active = false;

    document.getElementById("menu-toggle-btn").classList.toggle("open");

    SideBar.style.height = "200vh";
    SideBar.style.width = "0px";
    
    document.body.style.backgroundImage = "url('https://1drv.ms/i/s!AvASYBEBVN4YhDjJD3VCVolFvvKL?embed=1&width=4608&height=2963')";
    document.body.style.overflowY = "scroll";
    
    if (document.getElementsByClassName("table").length == 0) {
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
        
        function CriarTiposTable() {
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
        
        function CriarPerifericosTable() {
            let perifericosTable = document.createElement("DIV");
            perifericosTable.classList.add("table");
            
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
        
        function CriarSomaTable() {
            let somaTable = document.createElement("DIV");
            somaTable.classList.add("table");
            
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
        
        let mainTable = CriarTiposTable();
        let perifericosTable = CriarPerifericosTable();
        let somaTable = CriarSomaTable();

        document.body.appendChild(mainTable);
        document.body.appendChild(perifericosTable);
        document.body.appendChild(somaTable);

        Array.from(document.getElementsByClassName("plusButton")).forEach(button => {
            let Id;
            
            function findParentWithClass(element, targetClass) {
                let parentElement = element.parentElement; 
              
                while (parentElement) {
                  if (parentElement.classList && parentElement.classList.contains(targetClass)) {
                    return parentElement; 
                  }
                  parentElement = parentElement.parentElement; 
                }
              
                return null;
            }

            let TableRow = findParentWithClass(button, "table-row");

            if (TableRow) {
                Array.from(TableRow.children).forEach(tableData => {
                    if ($(tableData).text() !== "" && $(tableData).text() !== "—") {
                        Id = $(tableData).text();
                        
                        button.id = Id;
                    }                    
                });
            }

            button.onclick = function() {
                document.body.style.overflowY = "hidden";
                
                function CriarMainDiv() {
                    const newDiv = document.createElement('div');
                    newDiv.style.position = 'fixed';
                    newDiv.style.top = '0';
                    newDiv.style.left = '0';
                    newDiv.style.width = '100vw';
                    newDiv.style.height = '100vh';
                    newDiv.style.backgroundColor = 'rgba(173, 216, 230, 0.9)';
                    newDiv.style.zIndex = '0';
                    newDiv.style.display = 'flex';
                    newDiv.style.flexDirection = 'column';
                    newDiv.style.fontFamily = 'Arial, sans-serif';
                    newDiv.style.color = '#333';
                    newDiv.classList.add("table2");

                    return newDiv;
                }

                function CriarForm() {
                    const form = document.createElement('form');
                    form.className = 'form';
                    form.style.position = 'relative';
                    form.style.zIndex = '1';
                    form.style.padding = '1px';
                    form.style.marginBottom = '45px';

                    const button1 = document.createElement('button');
                    const svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg1.setAttribute('width', '17');
                    svg1.setAttribute('height', '16');
                    svg1.setAttribute('fill', 'none');
                    svg1.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    svg1.setAttribute('role', 'img');
                    svg1.setAttribute('aria-labelledby', 'search');
                    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path1.setAttribute('d', 'M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9');
                    path1.setAttribute('stroke', 'currentColor');
                    path1.setAttribute('stroke-width', '1.333');
                    path1.setAttribute('stroke-linecap', 'round');
                    path1.setAttribute('stroke-linejoin', 'round');
                    svg1.appendChild(path1);
                    button1.appendChild(svg1);
                    form.appendChild(button1);

                    const input = document.createElement('input');
                    input.className = 'input';
                    input.setAttribute('placeholder', 'Digite seu texto aqui...');
                    input.setAttribute('required', '');
                    input.setAttribute('type', 'text');
                    form.appendChild(input);

                    const button2 = document.createElement('button');
                    button2.setAttribute('type', 'button');
                    const svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg2.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    svg2.setAttribute('class', 'h-6 w-6');
                    svg2.setAttribute('fill', 'none');
                    svg2.setAttribute('viewBox', '0 0 24 24');
                    svg2.setAttribute('stroke', 'currentColor');
                    svg2.setAttribute('stroke-width', '2');
                    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path2.setAttribute('stroke-linecap', 'round');
                    path2.setAttribute('stroke-linejoin', 'round');
                    path2.setAttribute('d', 'M6 18L18 6M6 6l12 12');
                    svg2.appendChild(path2);
                    button2.appendChild(svg2);
                    form.appendChild(button2);

                    return { form, button2, input };;
                }

                function CriarItemsDiv() {
                    const itemsDiv = document.createElement('div');
                    itemsDiv.style.flex = '1';
                    itemsDiv.style.overflowY = 'scroll';
                    itemsDiv.style.backgroundColor = 'white';
                    itemsDiv.style.zIndex = '0';
                    itemsDiv.style.width = '100%';
                    itemsDiv.style.maxHeight = '80vh';
                    itemsDiv.style.maxWidth = '80vw';
                    itemsDiv.style.marginLeft = 'auto';
                    itemsDiv.style.marginRight = 'auto';
                    itemsDiv.style.display = 'flex';
                    itemsDiv.style.flexWrap = 'wrap';
                    itemsDiv.style.alignContent = 'flex-start';
                    itemsDiv.style.alignItems = 'flex-start';
                    itemsDiv.style.justifyContent = 'space-between';
                    itemsDiv.style.rowGap = '20px';
                    itemsDiv.style.columnGap = '20px';
                    
                    const svgNS = "http://www.w3.org/2000/svg";

                    return itemsDiv;
                }

                function CriarCards(itemsDiv) {
                    const itemsDivWidth = itemsDiv.clientWidth;
                    const itemsDivHeight = itemsDiv.clientHeight;

                    const itemWidth = 150; 
                    const itemHeight = 150; 
                    
                    const itemsPerRow = Math.floor(itemsDivWidth / (itemWidth + 20)); 
                    const rows = Math.floor(itemsDivHeight / (itemHeight + 20));
                    
                    const totalItems = itemsPerRow * rows;

                    for (let i = 0; i < totalItems; i++) {
                        const cardDiv = document.createElement('div');
                        cardDiv.classList.add('card');

                        const imgBox = document.createElement('div');
                        imgBox.classList.add('imgBox');

                        const img = document.createElement('img');
                        img.setAttribute('src', 'https://1drv.ms/i/s!AvASYBEBVN4YhDvnpknuuOqjFdzP?embed=1&width=256');
                        img.classList.add('product');

                        imgBox.appendChild(img);

                        cardDiv.appendChild(imgBox);

                        itemsDiv.appendChild(cardDiv);
                    }
                }

                function CriarButtonWithTextAndSpans() {
                    const closeButton = document.createElement('a');
                    closeButton.className = 'close-button';
                    closeButton.onclick = CloseParts;

                    const inDiv = document.createElement('div');
                    inDiv.className = 'in';

                    for (let i = 0; i < 2; i++) {
                        const block = document.createElement('div');
                        block.className = 'close-button-block';
                        inDiv.appendChild(block);
                    }

                    const outDiv = document.createElement('div');
                    outDiv.className = 'out';

                    for (let i = 0; i < 2; i++) {
                        const block = document.createElement('div');
                        block.className = 'close-button-block';
                        outDiv.appendChild(block);
                    }

                    closeButton.appendChild(inDiv);
                    closeButton.appendChild(outDiv);

                    return closeButton;
                }                
                
                const btn = CriarButtonWithTextAndSpans();
                const { form, button2, input } = CriarForm();
                const itemsDiv = CriarItemsDiv();
                const newDiv = CriarMainDiv();

                newDiv.appendChild(btn);
                newDiv.appendChild(form);
                newDiv.appendChild(itemsDiv);   

                document.body.appendChild(newDiv);

                CriarCards(itemsDiv);

                button2.addEventListener('click', function () {
                    input.value = '';
                });

                form.onsubmit = function (event) {
                    event.preventDefault();
                    console.log(input.value);
                };
            };            
        });
    }
}

LoadParts();

window.onload = DropDown;
