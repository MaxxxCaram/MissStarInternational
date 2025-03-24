/**
 * Miss Star International - Apply Form JavaScript
 * Este archivo gestiona la validación y envío del formulario de aplicación
 */

class ApplyForm {
    constructor(formId = 'applyForm') {
        // Referencia al formulario
        this.form = document.getElementById(formId);
        if (!this.form) return;

        // Referencias a elementos del formulario
        this.submitBtn = this.form.querySelector('button[type="submit"]');
        this.progressBar = document.querySelector('.form-progress-bar');
        this.progressText = document.querySelector('.form-progress-text');
        this.formSections = Array.from(this.form.querySelectorAll('.form-section'));
        this.nextBtns = Array.from(this.form.querySelectorAll('.next-step'));
        this.prevBtns = Array.from(this.form.querySelectorAll('.prev-step'));
        this.currentStep = 0;
        
        // Configuración del formulario
        this.totalSteps = this.formSections.length;
        this.requiredFields = {
            // Step 1: Personal Information
            0: ['fullName', 'email', 'phone', 'birthdate', 'nationality', 'residenceCountry'],
            // Step 2: Physical Attributes
            1: ['height', 'weight', 'measurements', 'photo1', 'photo2'],
            // Step 3: Experience
            2: ['experience', 'languages', 'socialMedia'],
            // Step 4: Why Miss Star
            3: ['motivation', 'goals', 'agree-terms']
        };
        
        // Inicializar formulario
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        // Configurar navegación por pasos
        this.setupStepNavigation();
        
        // Validar en tiempo real
        this.form.addEventListener('input', (e) => {
            if (e.target.required) {
                this.validateField(e.target);
            }
        });
        
        // Configurar validación al cambiar de paso
        this.nextBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const stepIndex = parseInt(btn.dataset.step);
                if (this.validateStep(stepIndex)) {
                    this.goToStep(stepIndex + 1);
                }
            });
        });
        
        // Botones para retroceder
        this.prevBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const stepIndex = parseInt(btn.dataset.step);
                this.goToStep(stepIndex - 1);
            });
        });
        
        // Configurar envío del formulario
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateAllSteps()) {
                this.submitForm();
            }
        });
        
        // Inicializar carga de archivos
        this.setupFileUploads();
        
        // Mostrar primer paso
        this.updateProgress(0);
    }
    
    setupStepNavigation() {
        // Ocultar todas las secciones excepto la primera
        this.formSections.forEach((section, index) => {
            if (index !== 0) {
                section.style.display = 'none';
            }
        });
    }
    
    goToStep(stepIndex) {
        // Ocultar paso actual
        this.formSections[this.currentStep].style.display = 'none';
        
        // Mostrar nuevo paso
        this.formSections[stepIndex].style.display = 'block';
        
        // Actualizar paso actual
        this.currentStep = stepIndex;
        
        // Actualizar barra de progreso
        this.updateProgress(stepIndex);
        
        // Scroll al inicio del formulario
        this.form.scrollIntoView({ behavior: 'smooth' });
    }
    
    updateProgress(stepIndex) {
        const progress = (stepIndex / (this.totalSteps - 1)) * 100;
        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }
        if (this.progressText) {
            this.progressText.textContent = `Paso ${stepIndex + 1} de ${this.totalSteps}`;
        }
    }
    
    validateField(field) {
        const isValid = field.checkValidity();
        
        // Limpiar errores previos
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        
        // Agregar o quitar clase de error
        if (!isValid) {
            field.classList.add('error');
            
            // Crear mensaje de error
            const error = document.createElement('span');
            error.className = 'error-message';
            
            // Determinar mensaje de error
            if (field.validity.valueMissing) {
                error.textContent = 'Este campo es obligatorio';
            } else if (field.validity.typeMismatch) {
                if (field.type === 'email') {
                    error.textContent = 'Por favor, introduce un email válido';
                } else {
                    error.textContent = 'El formato no es válido';
                }
            } else if (field.validity.tooShort) {
                error.textContent = `Mínimo ${field.minLength} caracteres`;
            } else if (field.validity.tooLong) {
                error.textContent = `Máximo ${field.maxLength} caracteres`;
            } else if (field.validity.patternMismatch) {
                if (field.id === 'phone') {
                    error.textContent = 'Introduce un número de teléfono válido';
                } else {
                    error.textContent = 'El formato no coincide con el esperado';
                }
            }
            
            field.parentNode.appendChild(error);
            return false;
        } else {
            field.classList.remove('error');
            return true;
        }
    }
    
    validateStep(stepIndex) {
        const requiredFieldsInStep = this.requiredFields[stepIndex] || [];
        let isValid = true;
        
        requiredFieldsInStep.forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`) || 
                          this.form.querySelector(`#${fieldName}`);
            
            if (field && !this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateAllSteps() {
        let isValid = true;
        
        for (let i = 0; i < this.totalSteps; i++) {
            if (!this.validateStep(i)) {
                isValid = false;
                // Ir al primer paso con errores
                if (this.currentStep !== i) {
                    this.goToStep(i);
                    break;
                }
            }
        }
        
        return isValid;
    }
    
    setupFileUploads() {
        const fileInputs = this.form.querySelectorAll('input[type="file"]');
        
        fileInputs.forEach(input => {
            const preview = document.createElement('div');
            preview.className = 'file-preview';
            input.parentNode.appendChild(preview);
            
            input.addEventListener('change', () => {
                preview.innerHTML = '';
                
                if (input.files && input.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = (e) => {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.className = 'uploaded-image-preview';
                        preview.appendChild(img);
                        
                        const fileName = document.createElement('span');
                        fileName.className = 'file-name';
                        fileName.textContent = input.files[0].name;
                        preview.appendChild(fileName);
                    };
                    
                    reader.readAsDataURL(input.files[0]);
                }
            });
        });
    }
    
    submitForm() {
        // Mostrar loader durante el envío
        const loader = document.createElement('div');
        loader.className = 'form-loader';
        loader.innerHTML = '<div class="spinner"></div><p>Enviando solicitud...</p>';
        this.form.appendChild(loader);
        
        // Deshabilitar botón de envío
        if (this.submitBtn) {
            this.submitBtn.disabled = true;
        }
        
        // Crear FormData para enviar los datos (incluidos archivos)
        const formData = new FormData(this.form);
        
        // Enviar datos via AJAX
        fetch(this.form.action, {
            method: 'POST',
            body: formData,
            // No agregar Content-Type, ya que se configura automáticamente con FormData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en el servidor');
            }
            return response.json();
        })
        .then(data => {
            // Eliminar loader
            loader.remove();
            
            // Mostrar mensaje de éxito
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <div class="success-icon">✓</div>
                <h3>¡Solicitud enviada con éxito!</h3>
                <p>Gracias por tu aplicación. Recibirás un correo de confirmación en breve.</p>
                <p>Número de referencia: ${data.referenceNumber || 'N/A'}</p>
            `;
            
            // Limpiar formulario y mostrar mensaje
            this.form.innerHTML = '';
            this.form.appendChild(successMessage);
        })
        .catch(error => {
            console.error('Error:', error);
            
            // Eliminar loader
            loader.remove();
            
            // Mostrar mensaje de error
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message-global';
            errorMessage.innerHTML = `
                <div class="error-icon">×</div>
                <h3>Error al enviar el formulario</h3>
                <p>Ha ocurrido un problema al procesar tu solicitud. Por favor, intenta nuevamente más tarde.</p>
                <button class="retry-button">Intentar nuevamente</button>
            `;
            
            this.form.appendChild(errorMessage);
            
            // Rehabilitar botón de envío
            if (this.submitBtn) {
                this.submitBtn.disabled = false;
            }
            
            // Configurar botón de reintento
            const retryButton = errorMessage.querySelector('.retry-button');
            if (retryButton) {
                retryButton.addEventListener('click', () => {
                    errorMessage.remove();
                    this.submitForm();
                });
            }
        });
    }
}

// Inicializar cuando el documento esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const applyForm = new ApplyForm();
}); 