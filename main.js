const Buttons = document.querySelectorAll('.Sidebar button');

const SideBar = document.getElementById("SideBar");

const PARTS = {
    AMDCPUS: 'https://raw.githubusercontent.com/zymos/cpu-db/master/cpu-db.AMD.csv',
    GPUS: 'https://raw.githubusercontent.com/voidful/gpu-info-api/gpu-data/gpu.json',
    INTELCPUS: 'https://raw.githubusercontent.com/divinity76/intel-cpu-database/master/databases/intel_cpu_database.json',
    MOBOS: 'https://raw.githubusercontent.com/JaJabinko/data/master/motherboard.json'
};

let Active = false;

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

function populateHeader(data) {
    console.log(data);
}

async function DropDown() {
    const PARTSDEF = {
        AMDCPUS: await fetchData(PARTS.AMDCPUS),
        GPUS: await fetchData(PARTS.GPUS),
        INTELCPUS: await fetchData(PARTS.INTELCPUS),
        MOBOS: await fetchData(PARTS.MOBOS),
    }

    const TopBar = document.getElementById("TopBar");

    TopBar.style.width = "100%";
    TopBar.style.height = "75px";

    setTimeout(() => {
        for (let i = 0; i < TopBar.children.length; i++) {
            if (TopBar.children[i].tagName === "BUTTON") {
                document.getElementById("ArrowImage").style.opacity = 1;
            } else {
                TopBar.children[i].style.opacity = 1;
            }
        }
    }, 1000);
}

function NavOpen() {
    document.getElementById("Arrow").style.transform = Active ? `rotate(0deg)` : `rotate(180deg)`;

    SideBar.style.width = Active ? "0px" : "320px";
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

function NovaBuild() {
    document.getElementById("Arrow").style.transform = `rotate(0deg)`;
    SideBar.style.width = "0px";
    document.body.style.backgroundImage = "url('https://1drv.ms/i/s!AvASYBEBVN4YhDjJD3VCVolFvvKL?embed=1&width=4608&height=2963')";

    Active = false;
}

window.onload = DropDown;
