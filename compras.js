// ===== Carrito =====
class CarritoCevicheria {
    constructor() {
        this.carrito = [];
        this.cuponAplicado = null;
        this.cuponesValidos = {
            'DELICIA10': { descuento: 10, descripcion: '10% de descuento' },
            'CEVICHERIA15': { descuento: 15, descripcion: '15% de descuento' },
            'BIENVENIDO20': { descuento: 20, descripcion: '20% de descuento en tu primera compra' },
            'CEVICHE5': { descuento: 5, descripcion: '5% de descuento en ceviches' }
        };
        this.init();
    }

    init() {
        console.log('🛒 Carrito de Cevicheria - Inicializado');
        this.cargarCarrito();
        this.initBotonesAgregar();
        this.initModalProducto();
        this.initCuponDescuento();
        this.initBotonesAccion();
        this.initFiltrosCategorias();
        this.renderizarCarrito();
        this.actualizarUI();
    }

    // ===== Cargar carrito desde localStorage =====
    cargarCarrito() {
        try {
            const data = localStorage.getItem('carritoCevicheria');
            if (data) this.carrito = JSON.parse(data);
        } catch(e) { console.error('Error cargando carrito', e); }
    }

    guardarCarrito() {
        try {
            localStorage.setItem('carritoCevicheria', JSON.stringify(this.carrito));
        } catch(e){ console.error('Error guardando carrito', e); }
    }

    // ===== Botones "Añadir al carrito" =====
    initBotonesAgregar() {
        document.addEventListener('click', (e) => {
            if(e.target.classList.contains('btn-agregar') && !e.target.disabled){
                const card = e.target.closest('.product-card');
                if(card) this.agregarProductoCard(card, e.target);
            }

            if(e.target.id === 'modalBtnAgregar'){
                const btn = e.target;
                const dataId = btn.getAttribute('data-id');
                const dataNombre = btn.getAttribute('data-title');
                const dataPrecio = parseFloat(btn.getAttribute('data-price').replace('S/ ', '').replace(',', '')) || 0;
                
                this.agregarAlCarrito(dataId, dataNombre, dataPrecio, 1);
            }
        });
    }

    agregarProductoCard(card, boton){
        const id = card.getAttribute('data-id') || card.querySelector('h3, h5').textContent;
        const nombre = card.querySelector('h3, h5')?.textContent || 'Producto';
        const precioTexto = card.querySelector('.precio')?.textContent || card.querySelector('.fw-bold')?.textContent || '0';
        const precio = parseFloat(precioTexto.replace('S/ ', '').replace(',', '')) || 0;
        const stockElem = card.querySelector('.stock-value');
        const stock = stockElem ? parseInt(stockElem.textContent) : 1;

        if(stock <= 0){
            this.mostrarNotificacion('Producto agotado', 'error');
            return;
        }

        this.agregarAlCarrito(id, nombre, precio, 1);
        this.animarBotonAgregado(boton);
    }

    animarBotonAgregado(boton){
        const original = boton.textContent;
        boton.textContent = '✓ Agregado';
        boton.classList.add('agregado');
        setTimeout(() => { boton.textContent = original; boton.classList.remove('agregado'); }, 2000);
    }

    agregarAlCarrito(id, nombre, precio, cantidad){
        const itemExistente = this.carrito.find(i => i.id === id);
        if(itemExistente) itemExistente.cantidad += cantidad;
        else this.carrito.push({id, nombre, precio, cantidad});
        this.guardarCarrito();
        this.actualizarUI();
        this.mostrarNotificacion(`${nombre} agregado al carrito`, 'success');
    }

    // ===== Modal dinámico =====
    initModalProducto(){
        const modal = document.getElementById('modalProducto');
        if(!modal) return;

        modal.addEventListener('show.bs.modal', (e)=>{
            const boton = e.relatedTarget;
            if(!boton) return;

            const title = boton.getAttribute('data-title');
            const price = boton.getAttribute('data-price');
            const img = boton.getAttribute('data-img');
            const desc = boton.getAttribute('data-desc'); 
            const stock = boton.closest('.product-card')?.querySelector('.stock-value')?.textContent || 1;

            modal.querySelector('#modalTitle').textContent = title;
            modal.querySelector('#modalPrice').textContent = price;
            modal.querySelector('#modalImg').src = img;
            modal.querySelector('#modalDesc').textContent = desc;
            const modalBtn = modal.querySelector('#modalBtnAgregar');
            modalBtn.setAttribute('data-id', boton.closest('.product-card')?.getAttribute('data-id') || title);
            modalBtn.setAttribute('data-title', title);
            modalBtn.setAttribute('data-price', price);
            modalBtn.setAttribute('data-stock', stock);
        });
    }

    // ===== Carrito =====
    renderizarCarrito(){
        const cont = document.querySelector('.carrito-items');
        if(!cont) return;
        cont.innerHTML = '';
        if(this.carrito.length === 0){
            cont.innerHTML = `<p class="text-center text-muted">Tu carrito está vacío</p>`;
            this.actualizarTotales(0,0,0);
            return;
        }

        this.carrito.forEach(item=>{
            const subtotal = (item.precio * item.cantidad).toFixed(2);
            const div = document.createElement('div');
            div.className = 'item-carrito d-flex justify-content-between align-items-center mb-2';
            div.setAttribute('data-id', item.id);
            div.innerHTML = `
                <div>
                    <strong>${item.nombre}</strong><br>
                    S/ ${item.precio.toFixed(2)}
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary btn-disminuir">-</button>
                    <span class="mx-2">${item.cantidad}</span>
                    <button class="btn btn-sm btn-outline-secondary btn-aumentar">+</button>
                    <button class="btn btn-sm btn-outline-danger ms-2 btn-eliminar">x</button>
                </div>
                <div><strong>S/ ${subtotal}</strong></div>
            `;
            cont.appendChild(div);
        });

        this.agregarEventosControles();
        this.calcularTotales();
    }

    agregarEventosControles(){
        document.querySelectorAll('.btn-aumentar').forEach(b=>{
            b.onclick = ()=> this.modificarCantidad(b.closest('.item-carrito'), 1);
        });
        document.querySelectorAll('.btn-disminuir').forEach(b=>{
            b.onclick = ()=> this.modificarCantidad(b.closest('.item-carrito'), -1);
        });
        document.querySelectorAll('.btn-eliminar').forEach(b=>{
            b.onclick = ()=> this.eliminarItem(b.closest('.item-carrito'));
        });
    }

    modificarCantidad(itemElem, cambio){
        const id = itemElem.getAttribute('data-id');
        const item = this.carrito.find(i=>i.id===id);
        if(!item) return;
        item.cantidad += cambio;
        if(item.cantidad <1) this.eliminarItem(itemElem);
        this.guardarCarrito();
        this.actualizarUI();
    }

    eliminarItem(itemElem){
        const id = itemElem.getAttribute('data-id');
        this.carrito = this.carrito.filter(i=>i.id!==id);
        this.guardarCarrito();
        this.actualizarUI();
    }

    calcularTotales(){
        const subtotal = this.carrito.reduce((acc,i)=>acc + i.precio*i.cantidad,0);
        const descuento = this.cuponAplicado ? subtotal*(this.cuponAplicado.descuento/100) : 0;
        const total = subtotal - descuento;
        this.actualizarTotales(subtotal,descuento,total);
    }

    actualizarTotales(subtotal,descuento,total){
        document.querySelector('.subtotal-valor').textContent = `S/ ${subtotal.toFixed(2)}`;
        document.querySelector('.descuento-valor').textContent = `S/ ${descuento.toFixed(2)}`;
        document.querySelector('.total-valor').textContent = `S/ ${total.toFixed(2)}`;
    }

    actualizarUI(){
        this.renderizarCarrito();
        this.actualizarContadorCarrito();
        this.actualizarEstadoBotones();
    }

    actualizarContadorCarrito(){
        const totalItems = this.carrito.reduce((acc,i)=>acc+i.cantidad,0);
        document.querySelectorAll('.carrito-contador').forEach(c=>{
            c.textContent = totalItems;
            c.style.display = totalItems>0?'inline-block':'none';
        });
    }

    actualizarEstadoBotones(){
        document.querySelectorAll('.product-card').forEach(card=>{
            const stockElem = card.querySelector('.stock-value');
            const boton = card.querySelector('.btn-agregar');
            if(stockElem && parseInt(stockElem.textContent)<=0) boton.disabled = true;
        });
    }

    // ===== Cupones =====
    initCuponDescuento(){
        document.getElementById('aplicar-cupon')?.addEventListener('click', ()=>{
            const code = document.getElementById('cupon-code')?.value.trim().toUpperCase();
            const msgElem = document.querySelector('.cupon-message');
            if(!code) { msgElem.textContent='Ingresa un cupón'; return; }
            if(this.cuponesValidos[code]){
                this.cuponAplicado = this.cuponesValidos[code];
                this.calcularTotales();
                msgElem.textContent = `Cupón aplicado: ${this.cuponAplicado.descripcion}`;
                msgElem.classList.remove('text-danger'); msgElem.classList.add('text-success');
            }else{
                this.cuponAplicado = null;
                this.calcularTotales();
                msgElem.textContent='Cupón inválido';
                msgElem.classList.remove('text-success'); msgElem.classList.add('text-danger');
            }
        });
    }
// ===== Vaciar carrito y checkout =====
initBotonesAccion(){
    // Botón vaciar carrito sigue igual
    document.querySelector('.btn-vaciar-carrito')?.addEventListener('click', ()=>{
        if(confirm('¿Deseas vaciar el carrito?')){
            this.carrito=[];
            this.cuponAplicado=null;
            this.guardarCarrito();
            this.actualizarUI();
        }
    });

    // Botón Procesar Pago
    document.querySelector('.btn-checkout')?.addEventListener('click', () => {
        // Si el usuario NO ha iniciado sesión, abrir login
        if (!window.usuarioLogueado) {
            const modalLoginEl = document.getElementById('modalLogin');
            const modalLogin = bootstrap.Modal.getOrCreateInstance(modalLoginEl);
            modalLogin.show();
            return;
        }

        // Si ya está logueado, procesar pago normalmente
        this.procesarPago();
    });
}

// ===== Nuevo método dentro de la clase =====
procesarPago() {
    if(this.carrito.length === 0){ 
        this.mostrarNotificacion('El carrito está vacío', 'error');
        return; 
    }
    const total = document.querySelector('.total-valor').textContent;
    this.mostrarNotificacion(`Gracias por tu compra. Total: ${total}`, 'success');
    this.carrito = [];
    this.cuponAplicado = null;
    this.guardarCarrito();
    this.actualizarUI();
}

    // ===== Filtros de categoría =====
    initFiltrosCategorias(){
        document.querySelectorAll('button[data-filter]').forEach(btn=>{
            btn.addEventListener('click', ()=>{
                const filter = btn.getAttribute('data-filter');
                document.querySelectorAll('.producto, .categoria-productos').forEach(el=>{
                    if(filter==='all'){
                        el.style.display='';
                    }else{
                        const cat = el.getAttribute('data-cat') || el.id;
                        el.style.display = (cat===filter || el.querySelector(`[data-cat="${filter}"]`))?'':'none';
                    }
                });
            });
        });
    }

    // ===== Notificaciones bonitas =====
    mostrarNotificacion(msg, tipo='info'){
        // Crear contenedor si no existe
        let container = document.getElementById('notificaciones-container');
        if(!container){
            container = document.createElement('div');
            container.id = 'notificaciones-container';
            container.style.position = 'fixed';
            container.style.top = '20px';
            container.style.right = '20px';
            container.style.zIndex = '9999';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '10px';
            document.body.appendChild(container);
        }

        // Crear notificación
        const notif = document.createElement('div');
        notif.textContent = msg;
        notif.style.padding = '12px 20px';
        notif.style.borderRadius = '10px';
        notif.style.color = '#fff';
        notif.style.fontWeight = 'bold';
        notif.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        notif.style.opacity = '0';
        notif.style.transition = 'opacity 0.5s, transform 0.5s';
        notif.style.transform = 'translateY(-20px)';

        if(tipo==='success') notif.style.backgroundColor = '#4CAF50';
        else if(tipo==='error') notif.style.backgroundColor = '#f44336';
        else notif.style.backgroundColor = '#2196F3';

        container.appendChild(notif);

        // Animación de entrada
        requestAnimationFrame(() => {
            notif.style.opacity = '1';
            notif.style.transform = 'translateY(0)';
        });

        // Desaparecer después de 3s
        setTimeout(()=>{
            notif.style.opacity = '0';
            notif.style.transform = 'translateY(-20px)';
            setTimeout(()=> notif.remove(), 500);
        }, 3000);
    }
}

// ===== Inicializar carrito =====
document.addEventListener('DOMContentLoaded', ()=> {
  window.carritoCevicheria = new CarritoCevicheria();
});


// Botón vaciar carrito
const btnVaciar = document.querySelector('.btn-vaciar-carrito');
const carritoItems = document.querySelector('.carrito-items');
const subtotalValor = document.querySelector('.subtotal-valor');
const descuentoValor = document.querySelector('.descuento-valor');
const totalValor = document.querySelector('.total-valor');
const cuponMessage = document.querySelector('.cupon-message');
const cuponInput = document.getElementById('cupon-code');

btnVaciar.addEventListener('click', () => {
  carritoItems.innerHTML = '';
  subtotalValor.textContent = 'S/ 0.00';
  descuentoValor.textContent = 'S/ 0.00';
  totalValor.textContent = 'S/ 0.00';
  cuponMessage.textContent = '';
  cuponInput.value = '';
});

// Validación formulario
document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('formulario-contacto');
  if (formulario) {
    formulario.addEventListener('submit', function (e) {
      e.preventDefault();
      const nombre = document.getElementById('nombre').value.trim();
      const correo = document.getElementById('correo').value.trim();
      const mensaje = document.getElementById('mensaje').value.trim();

      if (!nombre || !correo || !mensaje) {
        alert('Por favor, complete todos los campos.');
        return;
      }
      alert(`¡Gracias por tu mensaje, ${nombre}! Me pondré en contacto pronto.`);
      formulario.reset();
    });
  }

  // Animación scroll
  const secciones = document.querySelectorAll('section');
  const mostrarSeccionesVisibles = () => {
    secciones.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top < window.innerHeight - 100) sec.classList.add('mostrar');
    });
  };
  mostrarSeccionesVisibles();
  window.addEventListener('scroll', mostrarSeccionesVisibles);
});

// Toggle estilo formulario
document.addEventListener("DOMContentLoaded", function() {
  const toggleBtn = document.getElementById("estilo-toggle");
  const form = document.getElementById("formulario-contacto");
  if (toggleBtn && form) {
    toggleBtn.addEventListener("click", function() {
      form.classList.toggle("cambiado");
    });
  }
});

// Animar secciones al hacer scroll
document.addEventListener('DOMContentLoaded', () => {
  const secciones = document.querySelectorAll('section.categoria-productos');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.2 });
  secciones.forEach(sec => observer.observe(sec));
});

// Filtro productos
document.addEventListener('DOMContentLoaded', () => {
  const botones = document.querySelectorAll('.btn-group button');
  const productos = document.querySelectorAll('.product-card');
  botones.forEach(btn => {
    btn.addEventListener('click', () => {
      const filtro = btn.getAttribute('data-filter');
      productos.forEach(prod => {
        const categoria = prod.getAttribute('data-cat');
        prod.style.display = (filtro === 'all' || categoria === filtro)?'':'none';
      });
    });
  });
});

// Partículas doradas del cursor
document.addEventListener("mousemove", e => {
  for (let i = 0; i < 3; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    const size = Math.random() * 6 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${e.clientX - size / 2}px`;
    particle.style.top = `${e.clientY - size / 2}px`;
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 40 + 20;
    const tx = Math.cos(angle) * distance + "px";
    const ty = Math.sin(angle) * distance + "px";
    particle.style.setProperty("--tx", tx);
    particle.style.setProperty("--ty", ty);
    document.body.appendChild(particle);
    setTimeout(() => { particle.remove(); }, 1200);
  }
});


// ===== Login para procesar pago =====
document.addEventListener('DOMContentLoaded', () => {
  const modalLoginEl = document.getElementById('modalLogin');
  const formLogin = document.getElementById('loginForm');
  const mensaje = document.getElementById('loginMessage');

  if (!modalLoginEl || !formLogin) return;

  const modalLogin = bootstrap.Modal.getOrCreateInstance(modalLoginEl);

  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!formLogin.checkValidity()) {
      formLogin.reportValidity();
      return;
    }

    // Marcar usuario como logueado
    window.usuarioLogueado = true;

    mensaje.textContent = "Inicio de sesión correctamente ✅";
    mensaje.classList.remove('text-danger');
    mensaje.classList.add('text-success');

    setTimeout(() => {
      modalLogin.hide();
      mensaje.textContent = "";
      formLogin.reset();

      // Ejecutar el pago automáticamente
      if (window.carritoCevicheria instanceof CarritoCevicheria) {
        window.carritoCevicheria.procesarPago();
      }

    }, 1000);
  });
});