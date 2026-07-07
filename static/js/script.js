cnv = document.getElementById("canvas")

ctx = cnv.getContext('2d')
pixelInp = document.getElementById('pixelInp')
let background = new Image();
background.src = "http://www.samskirrow.com/background.png";
ctx.drawImage(background,0,0);  
//DRAWING FUNCTIONS 

function draw(event){
    let mx = event.offsetX
    let my = event.offsetY
    ctx.fillStyle = "white";
    brushSize = 14
    ctx.fillRect(mx,my, brushSize, brushSize);
    ctx.stroke()
}

function startDrawing(event){
    let currX = event.offsetX
    let currY = event.offsetY
    cnv.addEventListener('mousemove', draw)
}

function stopDrawing(event){
    console.log("spm")
    cnv.removeEventListener('mousemove',draw);
}

function clearWin(){
    ctx.clearRect(0,0,cnv.width,cnv.height)
    document.getElementById("prediction").innerText = ""
    document.getElementById("sub-prediction").innerText = ""
}

//-----------------------------------------------------------------------

function showResults(response){
    spanElem = document.getElementById('prediction')
    subHeading = document.getElementById('sub-prediction')
    let probMap = []
    resArr = response.resArr[0]
    for (let i = 0; i < resArr.length; i++) {
        probMap.push([String.fromCharCode(97+i), Number(resArr[i])]);
    }
    probMap.sort((a, b) => b[1] - a[1]);

    spanElem.innerText = `I think it's the letter \'${probMap[0][0]}\' (chances: ${(probMap[0][1]*100).toFixed(2)} %)`
    subHeading.innerText = `... but it could also be the letter \'${probMap[1][0]}\' (chances: ${(probMap[1][1]*100).toFixed(2)} %)`
}

function guess(){
    imgData = ctx.getImageData(0,0,280,280)
    pixelInp.value = ""
    for (let i = 0; i < imgData.data.length; i += 4) {
        pixelInp.value += `${imgData.data[i+3]},`
      }

    $.ajax({ 
        url: '/process', 
        type: 'POST', 
        contentType: 'application/json', 
        data: JSON.stringify({ 'imgData': pixelInp.value.slice(0,pixelInp.value.length-1) }), 
        // success: showResults(response),
        success: function(response) { 
            showResults(response)
        }, 
        error: function(error) { 
            console.log(error); 
        }
    });
    
} 


document.addEventListener('DOMContentLoaded', (event)=>{
    cnv.addEventListener('mousedown', startDrawing)
    cnv.addEventListener('mouseup', stopDrawing)

})
