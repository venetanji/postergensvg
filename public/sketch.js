
templates = {
    printshop: {
        header: {
            title: "Printshop",
            subtitle: "Helper Wanted!"
        },
        body: {
            title: "Requirements",
            lines: [
                "Full-time Student @ PolyU School of Design",
                "Willing to learn new skills & help other students",
                "Qualified students will be selected to work during week 12-16",
                "Good time management to fulfill the following:",
                "A 4-hour intensive training session + skill test (week 3-6)",
            ],
            indentedLines: [
                " -  Basic knowledge in printing",
                " -  Basic bookbinding",
                " -  Large scale printing",
                " -  Cutting machine operation"
            ]
        }
    },

    photography: {
        header: {
            title: "Photography Studio",
            subtitle: "Helper Wanted!"
        },
        body: {
            title: "Requirements",
            lines: [
                "Full-time Student @ PolyU School of Design",
                "Willing to learn new skills & help other students",
                "Qualified students will be selected to work during week 12-16",
                "Good time management to fulfill the following:",
                "A 4-hour intensive training session + skill test (week 3-6)",
            ],
            indentedLines: [
                " -  Basic knowledge in Photography",
                " -  Lighting set up",
                " -  Black & white film processing",
                " -  Dark room facility operation"
            ]
        }
    }
}

options = {
    baseFontSize: 45,
    hmargin: 10,
    template: "printshop"
}

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
    let footerRatio = 0.18
    let linesRatio = 0.18
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
            text: "Apply Before 19 October 2022.\nFor more details please contact Digital Printshop, 8th Floor",
            size: baseFontSize*footerRatio
        }
    }
}
const head = document.getElementsByTagName('HEAD')[0]; 
const hfontselector = document.getElementById('hfontselector')
const bfontselector = document.getElementById('bfontselector')
const fontsizeselector = document.getElementById('baseFontSize')
const bgselector = document.getElementById('bgimage')
const offsetselector = document.getElementById('offsettop')
const tplselector = document.getElementById('templateselector')

async function loadfonts() {
    a = await fetch("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBwIX97bVWr3-6AIUvGkcNnmFgirefZ6Sw")
                .then(response => response.json())
                .then(data => { return data })
    console.log(a.items.map(e => e.family))
    return a.items.map(e => e.family)
}

async function setup() {
    //console.log(gfonts)
    fontnames = await loadfonts()

    options.hfont = random(fontnames)
    options.bfont = random(fontnames)
    options.bgimage = parseInt(random(1,38))
    options.offsettop = random(options.hmargin,200)
    options.fgc = random(PI)


    bgselector.value = options.bgimage   
    fontsizeselector.value = options.baseFontSize
    offsetselector.value = options.offsettop
    offsettop.value = options.offsettop

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

function addFont (family) {
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

    loadImage(`http://localhost:3000/images/${bgimage}.png`, img => {
        background(img);
        poster = makePoster(templates[options.template])
        fgh = parseFloat(options.fgc);
        bgh = (fgh - QUARTER_PI) % PI
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
    const totalsize = body.title.size + body.lines.reduce((sum,a) => sum + a.size,0) + 2*hmargin + (body.lines.length*hmargin)
    
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