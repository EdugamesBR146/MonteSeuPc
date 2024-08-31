const Buttons = document.querySelectorAll('.Sidebar button');

const PARTS = {
    AMDCPUS: 'https://raw.githubusercontent.com/zymos/cpu-db/master/cpu-db.AMD.csv',
    GPUS: 'https://raw.githubusercontent.com/voidful/gpu-info-api/gpu-data/gpu.json',
    INTELCPUS: 'https://raw.githubusercontent.com/divinity76/intel-cpu-database/master/databases/intel_cpu_database.json',
    MOBOS: 'https://raw.githubusercontent.com/JaJabinko/data/master/motherboard.json'
};

let Active = false;

function ReturnDesiredElement(father, type) {
    for (i = 0; i < father.children.length; i++) {
        if (father.children[i].tagName == type) {
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
        } else {
            return await response.text();
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
        AMDCPUS : fetchData(PARTS[1]),
        GPUS : fetchData(PARTS[2]),
        INTELCPUS : fetchData(PARTS[3]),
        MOBOS : fetchData(PARTS[4]),
    }

    const TopBar = document.getElementById("TopBar");

    TopBar.style.width = "100%";
    TopBar.style.height = "75px";

    setTimeout(async () => {
        for (let i = 0; i < TopBar.children.length; i++) {
            TopBar.children[i].style["pointer-events"] = "none";
            
            if (TopBar.children[i].tagName === "BUTTON") {
                document.getElementById("ArrowImage").style.opacity = 1;
            } else {
                TopBar.children[i].style.opacity = 1;
            }
        }
    }, 1000);
}

function NavOpen() {
    let SideBar = document.getElementById("SideBar");
   
    switch(Active) {
        case true:
            SideBar.style.width = "0px";
            break;
        case false:
            SideBar.style.width = "320px";
            break;
    }

    Active = !Active
}

function OnMouseEnter(button) {
    let Span = ReturnDesiredElement(button, "SPAN")

    if (Span) {
        button.style["border-color"] = "white";
        Span.classList.add("Active");
        Span.style.color = "white";
    }
}

function OnMouseLeave(button) {
    let Span = ReturnDesiredElement(button, "SPAN")

    if (Span) {
        button.style["border-color"] = "grey";
        Span.classList.remove("Active");
        Span.style.color = "grey";
    }
}

window.onload = DropDown;
