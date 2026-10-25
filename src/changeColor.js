const onColorClick = document.getElementById("colorBtn")
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;   //黒がthemaかどうか
const isWhiteMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: white)').matches; //白がthemaかどうか
let nowColor
switch (true){
    case isDarkMode:
        changeToBlack()
        nowColor = "black"
        break;
    case isWhiteMode:
        changeToWhite()
        nowColor = "white"
        break;
    default:
        break;
}


onColorClick.onclick = function() {
    change()
}

function colorChange(place, color) {
    document.documentElement.style.setProperty(place, color);
}

function svgChange(color) {
    const svgDiv = document.getElementById("svg")
    switch (color) {
        case "black":
            svgDiv.innerHTML = `
            <img src="./moon.svg" alt="moon">
            `
            break;
        case "white":
            svgDiv.innerHTML = `
            <img src="/sun.svg" alt="sun">
            `
            break;
        
        default:
            break;
    };
};

function changeToWhite() {
    colorChange("--color-background", "#bed5f8");
    colorChange("--color-secondary-bg", "#86b0ed")
    svgChange("white")
}

function changeToBlack() {
    colorChange("--color-background", "#0a192f")
    colorChange("--color-secondary-bg", "#172a45")
    svgChange("black")
}

function change() {
    switch (nowColor) {
        case "black":
            nowColor = "white"
            changeToWhite()
            break;
        case "white":
            nowColor = "black"
            changeToBlack()
            break;
        
        default:
            break;
    };
};

