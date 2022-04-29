document.querySelectorAll('.liveoption').forEach(item => {
    item.addEventListener('input', function (e) {
        options[e.target.name] = e.target.value;
        if (e.target.classList.contains("form-check-input")) {
            options[e.target.name] = e.target.checked;
        }
        draw()
    })
})

document.querySelector('#svgdownload').addEventListener('click', e => {
    save(`postergen - ${Date.now()}`)
})

const makePoster = (template) => {

    let baseFontSize = parseInt(options.baseFontSize)
    let subtitleRatio = .7
    let footerRatio = parseFloat(options.footerRatio)
    let linesRatio = parseFloat(options.linesRatio)
    let skillsRatio = linesRatio*.9
    let skillSize = baseFontSize*skillsRatio
    let requirementSize = baseFontSize*.7
    let indent = 10
    let lineHeight = 1.5
    let lines = template.body.lines.map(l => { return {text: l, size: baseFontSize*linesRatio} })
    lines = lines.concat(template.body.indentedLines.map(l=> {return {text: l, size: skillSize, indent: indent}}))
    return {
        
        header: {
            title: {text: template.header.title, size: baseFontSize},
            subtitle: {text: template.header.subtitle, size: parseInt(baseFontSize*subtitleRatio)}
        },

        body: {
            title: {text: template.body.title, size: requirementSize},
            lineHeight: lineHeight,
            lines: lines
        },

        footer: {
            text: template.footer,
            size: baseFontSize*footerRatio
        }
    }
}
const head = document.getElementsByTagName('HEAD')[0]; 
const hfontselector = document.getElementById('hfontselector')
const bfontselector = document.getElementById('bfontselector')
const tplselector = document.getElementById('templateselector')

async function loadfonts() {
    a = await fetch("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBwIX97bVWr3-6AIUvGkcNnmFgirefZ6Sw")
                .then(response => response.json())
                .then(data => { return data })
    console.log(a.items.map(e => e.family))
    return a.items.map(e => e.family)
}

let options = {}
let templates = {}
async function setup() {
    //console.log(gfonts)
    options = await fetch('options.yml')
        .then(response => response.text())
        .then(data => { return jsyaml.load(data) })    

    templates = await fetch('templates.yml')
        .then(response => response.text())
        .then(data => { return jsyaml.load(data) })

    fontnames = await loadfonts()

    options.hfont = random(fontnames)
    options.bfont = random(fontnames)
    options.bgimage = parseInt(random(1,options.maxImages))
    options.offsettop = random(options.hmargin,200)
    options.fgh = random(PI)
    options.fgs = random(PI)

    displayOptions = ["fgh","fgs","bgimage","linesRatio","offsettop","baseFontSize"]
    displayOptions.forEach(e => {
        document.getElementById(e).value = options[e]
    })
    document.getElementById("bgimage").max = options.maxImages

    fontnames.forEach(family => {
        var fontoption = document.createElement("option");
        fontoption.text = family;
        fontoption.value = family;
        bfontoption = fontoption.cloneNode(true)
        fontoption.selected = options.hfont == family
        hfontselector.appendChild(fontoption)
        bfontoption.selected = options.bfont == family
        bfontselector.appendChild(bfontoption)
    })

    Object.keys(templates).forEach(t => {
        var toption = document.createElement("option");
        toption.text = t;
        toption.value = t;
        tplselector.appendChild(toption)
    })

    colorMode(HSB, PI, 100, 100, 1)
    margins = .9
    const cnv = createCanvas(windowHeight*Math.SQRT1_2*margins, windowHeight*margins, SVG);
    cnv.parent('artcanvas')
    background(255);
    noLoop()
}

loadedfonts = []
function addFont (family) {
    if (loadedfonts.includes(family)) return
    loadedfonts.push(family)
    var link = document.createElement('link');
    link.rel = 'stylesheet'; 
    link.type = 'text/css';
    link.href = `https://fonts.googleapis.com/css2?family=${family}`; 
    head.appendChild(link); 
}

function draw() {
    let bgimage = options.bgimage 

    addFont(options.hfont)
    document.querySelector('#hfontlink').href = `https://fonts.google.com/specimen/${options.hfont}`
    addFont(options.bfont)
    document.querySelector('#bfontlink').href = `https://fonts.google.com/specimen/${options.bfont}`

    loadImage(`/images/${options.template}/${bgimage}.png`, img => {
        background(img);
        poster = makePoster(templates[options.template])
        fgh = parseFloat(options.fgh);
        bgh = (fgh - parseFloat(options.fgs)) % PI
        y = parseInt(options.offsettop)
        hmargin = 10
        rectMode(CENTER)
        strokeWeight(.1)
        textFont(options.hfont);
        drawHeader(poster.header)
        textFont(options.bfont);
        drawBody(poster.body)
        drawFooter(poster.footer)
    });

}

function drawHeader(header) {
    fill(bgh, 10, 80, .6)
    stroke(bgh, 50, 100, .8)    
    const totalsize = header.title.size + header.subtitle.size + 3*hmargin
    
    rect(width/2, y + totalsize/2, width , totalsize);

    fill(fgh, 80, 50 , .9)
    stroke(fgh, 100, 70, 1)
    textSize(header.title.size);
    text(header.title.text, hmargin+ width/2, y, width - (2*hmargin))
    textSize(header.subtitle.size);
    text(header.subtitle.text, hmargin+ width/2, y+header.title.size+hmargin, width - (2*hmargin))
}

function drawBody(body) {
    const totalsize = body.title.size + body.lines.reduce((sum,a) => sum + a.size*body.lineHeight,0) + 2*hmargin + (body.lines.length*hmargin)
    
    fill(bgh, 10, 80, .9)
    stroke(bgh, 50, 100, .8)
    rect(width/2, height - totalsize/2, width, totalsize);

    fill(fgh, 80, 50 , .9)
    stroke(fgh, 100, 70, 1)
    textSize(body.title.size);
    const bodyStart = height - totalsize + hmargin
    text(body.title.text, hmargin+ width/2, bodyStart, width - (2*hmargin))
    let lineStart = bodyStart + body.title.size + 2*hmargin

    for (const line of body.lines) {
        textSize(line.size);
        indent = line.indent ? line.indent : 0
        text(line.text, hmargin + width/2, lineStart, width - (3*hmargin) - indent)
        lineStart += line.size*body.lineHeight
    }
}

function drawFooter(footer) {
    fill(fgh, 80, 50 , .9)
    stroke(fgh, 100, 70, 1)
    textSize(footer.size);
    text(footer.text, hmargin+ width/2, height - 3.5* footer.size, width - (2*hmargin))
}

function windowResized() {
    resizeCanvas(windowHeight*Math.SQRT1_2*margins, windowHeight);
}