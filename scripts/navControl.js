var opened = false;

function openLinks() {
    if (opened == false) {
        var x = document.getElementById("navLinks").style.transform = "translateX(0%)";
        opened = true;
    } else {
        var y = document.getElementById("navLinks").style.transform = "translateX(100%)";
        opened = false;
    }
}
