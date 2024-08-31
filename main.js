let Active = false;

function DropDown() {
    let Title = document.getElementById("Title");
    let TopBar = document.getElementById("TopBar");

    TopBar.style.width = "100%";
    TopBar.style.height = "75px";

    setTimeout(() => {
        for (let i = 0; i < TopBar.children.length; i++){
            if (TopBar.children[i].tagName == "BUTTON") {
                let ArrowImage = document.getElementById("ArrowImage");

                ArrowImage.style.opacity = 1;
            } else {
                TopBar.children[i].style.opacity = 1;
            }
        }
    }, 1000);
}

function NavOpen() {
    switch(Active) {
        case true:
            
        case false:

    }

    Active = !Active
}

window.onload = DropDown;