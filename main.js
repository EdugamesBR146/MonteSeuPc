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
            "Armazenamento",
            "Cooler",
            "Processador",
            "Fonte",
            "Gabinete",
            "Placa de Vídeo",
            "Placa Mãe",
            "Resfriamento",
            "Memórias RAM",
            "Controle",
            "Monitor",
            "Mouse",
            "Teclado",
            "Volante",
        ];

        let MainDiv = document.createElement("DIV");
        MainDiv.style.height = "100%";
        MainDiv.style.width = "100%";
        MainDiv.style.display = "flex";
        MainDiv.style.alignItems = "flex-start";
        MainDiv.style.justifyContent = "flex-start";
        MainDiv.style.paddingTop = "75px";
        MainDiv.style.position = "absolute";
        MainDiv.style.left = "0";
        MainDiv.classList.add("Parts");
        MainDiv.style.zIndex = "0";

        let Table = document.createElement("DIV");
        Table.classList.add("table");

        let TableHeader = document.createElement("DIV");
        TableHeader.classList.add("table-header");

        let HeaderTipo = document.createElement("DIV");
        HeaderTipo.classList.add("header__item");
        HeaderTipo.innerHTML = '<a id="tipo" class="filter__link" href="#">Tipo</a>';

        let HeaderAdicionado = document.createElement("DIV");
        HeaderAdicionado.classList.add("header__item");
        HeaderAdicionado.innerHTML = '<a id="adicionado" class="filter__link" href="#">Adicionado</a>';

        TableHeader.appendChild(HeaderTipo);
        TableHeader.appendChild(HeaderAdicionado);
        Table.appendChild(TableHeader);

        let TableContent = document.createElement("DIV");
        TableContent.classList.add("table-content");

        Tipos.forEach(tipo => {
            let row = document.createElement("DIV");
            row.classList.add("table-row");

            let tipoCell = document.createElement("DIV");
            tipoCell.classList.add("table-data");
            tipoCell.textContent = tipo;
            row.appendChild(tipoCell);

            let adicionadoCell = document.createElement("DIV");
            adicionadoCell.classList.add("table-data");
            
            let button = document.createElement("BUTTON");
            adicionadoCell.appendChild(button);

            row.appendChild(adicionadoCell);

            TableContent.appendChild(row);
        });

        Table.appendChild(TableContent);
        MainDiv.appendChild(Table);
        document.body.appendChild(MainDiv);

        const properties = ['tipo', 'adicionado'];

        $.each(properties, function (i, val) {
            let orderClass = '';

            $("#" + val).click(function (e) {
                e.preventDefault();
                $('.filter__link.filter__link--active').not(this).removeClass('filter__link--active');
                $(this).toggleClass('filter__link--active');
                $('.filter__link').removeClass('asc desc');

                if (orderClass == 'desc' || orderClass == '') {
                    $(this).addClass('asc');
                    orderClass = 'asc';
                } else {
                    $(this).addClass('desc');
                    orderClass = 'desc';
                }

                const parent = $(this).closest('.header__item');
                const index = $(".header__item").index(parent);
                const table = $('.table-content');
                const rows = table.find('.table-row').get();
                const isSelected = $(this).hasClass('filter__link--active');

                rows.sort(function (a, b) {
                    const x = $(a).find('.table-data').eq(index).text();
                    const y = $(b).find('.table-data').eq(index).text();

                    if (isSelected) {
                        return x.localeCompare(y);
                    } else {
                        return y.localeCompare(x);
                    }
                });

                $.each(rows, function (index, row) {
                    table.append(row);
                });

                return false;
            });
        });
    }
}

loadParts();

window.onload = DropDown;
