document.addEventListener("mousemove",parallax);
function parallax(e){
    this.querySelectorAll('.layer').array.forEach(layer=> {
        const speed = layer.getAttribute("data-speed")
        
        const x = (window.innerWidth - e.pageX*speed)
        const y = (window.innerHeight - e.pageY*speed)

        layer.style.transform = "translateX(${x}px) translateY(${y}px)"
    });
}
