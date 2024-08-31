const Buttons = document.querySelectorAll('.Sidebar button');

let Active = false;

function ReturnDesiredElement(father, type) {
    for (i = 0; i < father.children.length; i++) {
        if (father.children[i].tagName == type) {
            return father.children[i];
        }
    }
}

function DropDown() {
    let Title = document.getElementById("Title");
    let TopBar = document.getElementById("TopBar");

    TopBar.style.width = "100%";
    TopBar.style.height = "75px";

    setTimeout(() => {
        for (let i = 0; i < TopBar.children.length; i++){
            if (TopBar.children[i].tagName == "BUTTON") {
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
