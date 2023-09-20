const colorPickerBtn=document.querySelector("#color-picker");
const colorList =document.querySelector(".all-colors");
const clearAll =document.querySelector(".clear-all");
const pickedColors= JSON.parse(localStorage.getItem("picked-colors") || "[]");

//adds border to light colors
const addBorderIfNeeded = (color) => {

    //convert color from hex to rgb
    const hexToRgb = (hex)=>{
        const a = parseInt(hex.slice(1),16);
        const r = (a>>16) & 255;
        const g = (a>>8) & 255;
        const b = a & 255;
        return [r,g,b];
    }
    //calculate brightness
    const [r,g,b] = hexToRgb(color);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    //apply border if brightnes > 200
    if (brightness>200){
        return "border:2px solid #ccc";
    } else {
        return "";
    }
}

const copyColor = (e) => {
    const colorValue = e.getAttribute("data-color");
    const textElement = e.querySelector(".value");
    navigator.clipboard.writeText(colorValue);
    textElement.innerText = "Copied";
    textElement.classList.add("slide-out");

    setTimeout(() => {
        textElement.innerText = colorValue;
        textElement.classList.remove("slide-out");
    }, 1000);
}

const deleteColor = (color) => {
    const colorIndex = pickedColors.indexOf(color);
    if (colorIndex !== -1) {
        pickedColors.splice(colorIndex, 1);
        localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
        showColors();
    }
}

const createColorTemplate = (color) =>{
    const borderStlye = addBorderIfNeeded(color);
    return `
    <li class="color">
        <div class="color-info" data-color="${color}">
            <span class="rect" style="background: ${color}; ${borderStlye}"></span>
            <span class="value">${color}</span>
        </div>
        <span class="material-symbols-outlined">delete</span>
    </li>
    `;
}

const showColors = () =>{

    colorList.innerHTML = pickedColors.map((color) => createColorTemplate(color)).join("");

    colorInfoElements = document.querySelectorAll(".color-info");

    if (pickedColors.length === 0) {
        document.querySelector(".picked-colors").classList.add("hide");
    } else {
        document.querySelector(".picked-colors").classList.remove("hide");    
        
        colorInfoElements.forEach((colorInfo, index)=>{
            colorInfo.addEventListener("click", () => copyColor(colorInfo));
            const deleteButton = colorInfo.nextElementSibling;
            deleteButton.addEventListener("click", () => deleteColor(pickedColors[index]));
        });
    }
}

showColors();

const activateEyeDropper = async () =>{
    try{
        const eyeDropper = new EyeDropper();
        const { sRGBHex } = await eyeDropper.open();
        navigator.clipboard.writeText(sRGBHex);

        if (!pickedColors.includes(sRGBHex)){
            pickedColors.push(sRGBHex);
            localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
        }

        showColors();
    } catch(error){
        console.log(error)
    }
}

const clearAllColors = () =>{
    pickedColors.length=0;
    localStorage.setItem("picked-colors",JSON.stringify(pickedColors));
    document.querySelector(".picked-colors").classList.add("hide");  
}

clearAll.addEventListener("click", clearAllColors);
colorPickerBtn.addEventListener("click", activateEyeDropper);