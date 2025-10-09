// ===== CONFIGURACIÓN DEL CARRUSEL =====
// El carrusel cambiará automáticamente cada 7 segundos (7000 milisegundos)

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el elemento del carrusel
    const carouselElement = document.querySelector('#carouselExample');
    
    if (carouselElement) {
        // Crear una instancia del carrusel de Bootstrap con configuración personalizada
        const carousel = new bootstrap.Carousel(carouselElement, {
            interval: 7000,  // 7 segundos entre cada cambio de imagen
            ride: 'carousel', // Iniciar automáticamente
            pause: 'hover',   // Pausar cuando el mouse está sobre el carrusel
            wrap: true        // Volver al inicio después de la última imagen
        });
        
        console.log('Carrusel configurado: cambio automático cada 7 segundos');
    }

    // ===== CAMBIO DE IMAGEN EN SECCIÓN NOSOTROS =====
    const imagenNosotros = document.querySelector('.imagen-nosotros');
    
    if (imagenNosotros) {
        // Puedes cambiar estas rutas por las imágenes que quieras mostrar
        const imagenOriginal = 'img/Imagenlocal3.jpg';  // Imagen por defecto
        const imagenHover = 'img/imag.jpg';       // Imagen al pasar el mouse (cámbiala por la que quieras)
        
        // Evento cuando el mouse entra en la imagen
        imagenNosotros.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.5s ease';
            this.src = imagenHover;
        });
        
        // Evento cuando el mouse sale de la imagen
        imagenNosotros.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.5s ease';
            this.src = imagenOriginal;
        });
        
        console.log('Efecto de cambio de imagen configurado en sección Nosotros');
    }
});

// ===== ANIMACIONES ADICIONALES =====

// Efecto de desvanecimiento suave en las imágenes del carrusel
const carouselItems = document.querySelectorAll('.carousel-item');
carouselItems.forEach(item => {
    item.addEventListener('transitionend', function() {
        // Puedes agregar efectos adicionales aquí si lo deseas
    });
});

// ===== FUNCIÓN PARA DETENER/INICIAR EL CARRUSEL =====
// Puedes usar estas funciones si necesitas controlar el carrusel manualmente

function pausarCarrusel() {
    const carouselElement = document.querySelector('#carouselExample');
    const carousel = bootstrap.Carousel.getInstance(carouselElement);
    if (carousel) {
        carousel.pause();
    }
}

function iniciarCarrusel() {
    const carouselElement = document.querySelector('#carouselExample');
    const carousel = bootstrap.Carousel.getInstance(carouselElement);
    if (carousel) {
        carousel.cycle();
    }
}