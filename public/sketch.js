
function preload() {
    //randomSeed(789)
    const head = document.getElementsByTagName('HEAD')[0]; 
    fonts = ["Titillium Web","Rubik Mono One","Sniglet","Frijole","Fascinate"]
    fonts.forEach(family => {
        var link = document.createElement('link');
        link.rel = 'stylesheet'; 
        link.type = 'text/css';
        link.href = `https://fonts.googleapis.com/css2?family=${family}`; 
        head.appendChild(link); 
    })

    bgimage = parseInt(random(1,10))
    img = loadImage(`http://localhost:3000/images/${bgimage}.png`);
}

function setup() {
    colorMode(HSB, PI, 100, 100, 1)
    margins = .9
    createCanvas(windowHeight*Math.SQRT1_2*margins, windowHeight*margins, SVG);
    background(255);

    button = createButton('Save as SVG');
    button.position(width + 50, 50);
    button.mousePressed(save);
    noLoop()
}

function draw() {
    background(img);
    fgh = random(PI);
    bgh = (fgh - QUARTER_PI) % PI
    hmargin = 10
    fontsize = 
    fill(bgh, 10, 80, .6)
    stroke(bgh, 50, 100, .8)
    rect(0, 100, width,200)
    
    fill(fgh, 80, 50 , .9)
    stroke(fgh, 100, 70, 1)
    textSize(random(40,80));
    textFont(random(fonts));
    text("Helper Wanted!", hmargin,100, width - 2*hmargin)
}

function windowResized() {
    resizeCanvas(windowHeight*Math.SQRT1_2*margins, windowHeight);
}