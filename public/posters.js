let saveSvg = (svgEl, name) => {
    svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var svgData = svgEl.outerHTML;
    var preface = '<?xml version="1.1" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

document.getElementById('svgdownload').addEventListener('click', e => {
    saveSvg(document.querySelector('#artcanvas svg'), `poster-${Date.now()}.svg`)
})


var draw = SVG().addTo('#artcanvas').size(window.innerHeight/Math.SQRT2, window.innerHeight)
var image = draw.image('images/1.png')
image.size(draw.width()*1.05, draw.height()).move(-10,0)

var text = draw.text('SVG.JS').font({ size: 36 }).move(10, 0).fill({ color: '#fff' })
