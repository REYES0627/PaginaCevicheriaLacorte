// contacto.js - Validación y Animaciones para Formulario de Contacto

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const contactForm = document.getElementById('contactForm');
    const formControls = contactForm.querySelectorAll('.form-control, .form-select');
    const submitBtn = contactForm.querySelector('.btn-enviar');
    
    // Agregar los SVG de Bootstrap al documento
    addBootstrapIcons();
    
    // Inicializar animaciones
    initFormAnimations();
    
    // Validación en tiempo real
    formControls.forEach(control => {
        control.addEventListener('blur', validateField);
        control.addEventListener('input', clearFieldError);
    });
    
    // Validación al enviar el formulario
    contactForm.addEventListener('submit', handleFormSubmit);
});

// Función para agregar los SVG de Bootstrap
function addBootstrapIcons() {
    const svgContainer = document.createElement('div');
    svgContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
            <symbol id="check-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </symbol>
            <symbol id="info-fill" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            </symbol>
            <symbol id="exclamation-triangle-fill" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </symbol>
        </svg>
    `;
    document.body.appendChild(svgContainer);
}

// Inicializar animaciones del formulario
function initFormAnimations() {
    const formGroups = document.querySelectorAll('.form-group');
    
    // Animación de entrada escalonada
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            group.style.transition = 'all 0.6s ease';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, 200 * index);
    });
    
    // Efecto de onda en labels al hacer focus
    const labels = document.querySelectorAll('.form-label');
    labels.forEach(label => {
        label.addEventListener('click', () => {
            label.style.transform = 'scale(1.05)';
            setTimeout(() => {
                label.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

// Validar campo individual
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(e);
    
    let isValid = true;
    let errorMessage = '';
    
    switch(fieldName) {
        case 'nombre':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'El nombre debe tener al menos 2 caracteres';
            }
            break;
            
        case 'telefono':
            const phoneRegex = /^[0-9+\-\s()]{9,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Ingresa un número de teléfono válido';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Ingresa un email válido';
            }
            break;
            
        case 'asunto':
            if (value === '') {
                isValid = false;
                errorMessage = 'Por favor selecciona un asunto';
            }
            break;
            
        case 'mensaje':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'El mensaje debe tener al menos 10 caracteres';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
        animateFieldError(field);
    } else {
        showFieldSuccess(field);
    }
    
    return isValid;
}

// Mostrar error en campo
function showFieldError(field, message) {
    field.classList.add('is-invalid');
    
    // Crear o actualizar mensaje de error
    let errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        field.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Mostrar éxito en campo
function showFieldSuccess(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Limpiar error del campo
function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('is-invalid');
    
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Animación para error de campo
function animateFieldError(field) {
    field.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        field.style.animation = '';
    }, 500);
}

// Manejar envío del formulario
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    let isValid = true;
    
    // Validar todos los campos
    const fields = form.querySelectorAll('.form-control, .form-select');
    fields.forEach(field => {
        const event = new Event('blur');
        field.dispatchEvent(event);
        
        if (field.classList.contains('is-invalid')) {
            isValid = false;
        }
    });
    
    if (isValid) {
        // Animación de envío
        animateFormSubmission(form);
        
        // Simular envío (en un caso real, aquí iría la petición AJAX)
        setTimeout(() => {
            showSuccessAlert();
            form.reset();
            resetFormStyles(form);
        }, 2000);
    } else {
        showErrorAlert('Por favor corrige los errores en el formulario');
        animateFormError(form);
    }
}

// Animación durante el envío
function animateFormSubmission(form) {
    const submitBtn = form.querySelector('.btn-enviar');
    const originalText = submitBtn.innerHTML;
    
    // Deshabilitar botón y cambiar texto
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
    
    // Efecto de carga en el formulario
    form.style.opacity = '0.7';
    form.style.transition = 'opacity 0.3s ease';
    
    // Efecto de burbujas ascendentes
    createBubblesEffect(form);
}

// Resetear estilos del formulario
function resetFormStyles(form) {
    const submitBtn = form.querySelector('.btn-enviar');
    const fields = form.querySelectorAll('.form-control, .form-select');
    
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Enviar Mensaje';
    form.style.opacity = '1';
    
    fields.forEach(field => {
        field.classList.remove('is-valid');
    });
}

// Efecto de burbujas durante el envío
function createBubblesEffect(container) {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const bubble = document.createElement('div');
            bubble.style.cssText = `
                position: absolute;
                width: ${Math.random() * 20 + 10}px;
                height: ${Math.random() * 20 + 10}px;
                background: rgba(32, 178, 170, 0.6);
                border-radius: 50%;
                pointer-events: none;
                left: ${Math.random() * 100}%;
                bottom: 0;
                animation: bubbleRise 2s ease-in forwards;
            `;
            
            container.style.position = 'relative';
            container.appendChild(bubble);
            
            setTimeout(() => {
                if (bubble.parentNode) {
                    bubble.parentNode.removeChild(bubble);
                }
            }, 2000);
        }, i * 200);
    }
}

// Mostrar alerta de éxito
function showSuccessAlert() {
    const alertHTML = `
        <div class="alert alert-success alert-dismissible fade show custom-alert" role="alert">
            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
                <use xlink:href="#check-circle-fill"/>
            </svg>
            <strong>¡Mensaje enviado!</strong> Tu mensaje ha sido enviado correctamente. Te contactaremos pronto.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    showAlert(alertHTML, 'success');
}

// Mostrar alerta de error
function showErrorAlert(message) {
    const alertHTML = `
        <div class="alert alert-danger alert-dismissible fade show custom-alert" role="alert">
            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:">
                <use xlink:href="#exclamation-triangle-fill"/>
            </svg>
            <strong>Error:</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    showAlert(alertHTML, 'error');
}

// Mostrar alerta en la página
function showAlert(html, type) {
    // Remover alertas anteriores
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Crear nueva alerta
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = html;
    
    // Posicionar la alerta
    const mainContent = document.querySelector('.main-contacto .container');
    mainContent.insertBefore(alertDiv, mainContent.firstChild);
    
    // Animación de entrada
    setTimeout(() => {
        alertDiv.querySelector('.alert').classList.add('show');
    }, 100);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            const bsAlert = new bootstrap.Alert(alertDiv.querySelector('.alert'));
            bsAlert.close();
        }
    }, 5000);
}

// Animación de error en el formulario completo
function animateFormError(form) {
    form.style.animation = 'formErrorShake 0.5s ease-in-out';
    setTimeout(() => {
        form.style.animation = '';
    }, 500);
}

// Agregar estilos CSS para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes formErrorShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    @keyframes bubbleRise {
        0% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
        }
        100% {
            transform: translateY(-100px) scale(0.3);
            opacity: 0;
        }
    }
    
    .is-valid {
        border-color: #198754 !important;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right calc(0.375em + 0.1875rem) center;
        background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    }
    
    .custom-alert {
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        border: none;
        border-radius: 15px;
    }
    
    .form-group {
        position: relative;
    }
    
    .invalid-feedback {
        display: none;
        color: #dc3545;
        font-size: 0.875em;
        margin-top: 0.25rem;
    }
    
    .is-invalid {
        border-color: #dc3545 !important;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath d='m5.8 3.6.4.4.4-.4'/%3e%3cpath d='M6 7v1'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right calc(0.375em + 0.1875rem) center;
        background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    }
`;
document.head.appendChild(style);