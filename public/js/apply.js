/**
 * ApplicationForm - Clase para gestionar el formulario de aplicación
 * Maneja validación, navegación entre pasos, carga de archivos y envío del formulario
 */
class ApplicationForm {
    constructor(selector = '.application-form', options = {}) {
        // Configuración por defecto
        this.config = {
            autosave: true,
            autosaveKey: 'missStar_application_data',
            validationDelay: 500,
            maxFileSize: 5 * 1024 * 1024, // 5MB para imágenes
            maxVideoSize: 50 * 1024 * 1024, // 50MB para videos
            allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
            allowedVideoTypes: ['video/mp4', 'video/webm'],
            messages: {
                required: 'Este campo es obligatorio',
                invalid: 'Por favor, ingresa un valor válido',
                invalidEmail: 'Por favor, ingresa un correo electrónico válido',
                invalidPhone: 'Por favor, ingresa un número de teléfono válido',
                invalidDate: 'Por favor, ingresa una fecha válida',
                tooLarge: 'El archivo es demasiado grande',
                wrongFormat: 'Formato de archivo no admitido',
                success: 'Tu aplicación ha sido enviada correctamente',
                error: 'Hubo un problema al enviar tu aplicación'
            },
            ...options
        };

        // Estado del formulario
        this.state = {
            currentStep: 1,
            totalSteps: 0,
            isSubmitting: false,
            formData: new FormData(),
            validationTimeouts: {},
            fieldErrors: new Map(),
            uploadedFiles: new Map(),
            uploadProgress: new Map()
        };

        // Elementos DOM
        this.form = document.querySelector(selector);
        if (!this.form) {
            console.error('No se encontró el formulario con el selector:', selector);
            return;
        }

        this.steps = this.form.querySelectorAll('.form-step');
        this.state.totalSteps = this.steps.length;
        
        this.progressBar = this.form.querySelector('.progress-fill');
        this.stepIndicators = this.form.querySelectorAll('.step-indicator');
        
        this.prevButton = this.form.querySelector('.btn-prev');
        this.nextButton = this.form.querySelector('.btn-next');
        this.submitButton = this.form.querySelector('.btn-submit');
        
        // Inicializar
        this.init();
    }

    /**
     * Inicializa el formulario y sus eventos
     */
    init() {
        this.setupFormUI();
        this.setupEventListeners();
        
        // Restaurar progreso guardado si está habilitado
        if (this.config.autosave) {
            this.restoreProgress();
        }
        
        console.log('ApplicationForm iniciado con éxito');
    }

    /**
     * Configura la interfaz inicial del formulario
     */
    setupFormUI() {
        // Configurar los botones iniciales
        this.updateNavigationButtons();
        
        // Marcar campos obligatorios
        this.form.querySelectorAll('[required]').forEach(field => {
            const label = field.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                if (!label.innerHTML.includes('*')) {
                    label.innerHTML += ' *';
                }
            }
        });
        
        // Inicializar áreas de carga de archivos
        this.form.querySelectorAll('.file-drop-area').forEach(dropArea => {
            const preview = dropArea.querySelector('.file-preview');
            const input = dropArea.querySelector('input[type="file"]');
            
            if (preview && input) {
                // Limpiar previsualizaciones
                preview.innerHTML = '';
                
                // Restablecer input
                const newInput = input.cloneNode(true);
                input.parentNode.replaceChild(newInput, input);
            }
        });
        
        // Actualizar la barra de progreso
        this.updateProgressBar();
    }

    /**
     * Configura los escuchadores de eventos para el formulario
     */
    setupEventListeners() {
        // Botones de navegación
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.goToPrevStep());
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.goToNextStep());
        }
        
        // Envío del formulario
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Validación en tiempo real
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', (e) => this.validateField(e.target));
            field.addEventListener('blur', (e) => this.validateField(e.target, true));
        });
        
        // Manejo de archivos
        this.form.querySelectorAll('input[type="file"]').forEach(fileInput => {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
            
            const dropArea = fileInput.closest('.file-drop-area');
            if (dropArea) {
                // Eventos de arrastrar y soltar
                dropArea.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    dropArea.classList.add('drag-over');
                });
                
                dropArea.addEventListener('dragleave', () => {
                    dropArea.classList.remove('drag-over');
                });
                
                dropArea.addEventListener('drop', (e) => {
                    e.preventDefault();
                    dropArea.classList.remove('drag-over');
                    
                    if (e.dataTransfer.files.length) {
                        fileInput.files = e.dataTransfer.files;
                        const event = new Event('change', { bubbles: true });
                        fileInput.dispatchEvent(event);
                    }
                });
                
                // Clic en el área también abre el selector de archivos
                dropArea.addEventListener('click', (e) => {
                    if (e.target !== fileInput) {
                        fileInput.click();
                    }
                });
            }
        });
        
        // Eventos para indicadores de pasos
        this.stepIndicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                const targetStep = parseInt(indicator.dataset.step);
                
                // Solo permitir saltar a pasos completados o el siguiente
                if (targetStep < this.state.currentStep || 
                    (targetStep === this.state.currentStep + 1 && this.validateStep(this.state.currentStep))) {
                    this.goToStep(targetStep);
                }
            });
        });
        
        // Autoguardado durante cambios
        if (this.config.autosave) {
            this.form.addEventListener('input', this.debounce(() => this.saveProgress(), 1000));
        }
    }

    /**
     * Gestiona la carga de archivos y muestra vistas previas
     */
    handleFileUpload(event) {
        const fileInput = event.target;
        const file = fileInput.files[0];
        
        if (!file) return;
        
        const fieldName = fileInput.name;
        const dropArea = fileInput.closest('.file-drop-area');
        const preview = dropArea ? dropArea.querySelector('.file-preview') : null;
        const fileType = fileInput.dataset.fileType || 'image';
        
        // Validar tipo de archivo
        const allowedTypes = fileType === 'image' 
            ? this.config.allowedImageTypes 
            : this.config.allowedVideoTypes;
            
        if (!allowedTypes.includes(file.type)) {
            this.showFieldError(fileInput, this.config.messages.wrongFormat);
            fileInput.value = '';
            return;
        }
        
        // Validar tamaño de archivo
        const maxSize = fileType === 'image' 
            ? this.config.maxFileSize 
            : this.config.maxVideoSize;
            
        if (file.size > maxSize) {
            this.showFieldError(fileInput, this.config.messages.tooLarge);
            fileInput.value = '';
            return;
        }
        
        // Guardar referencia al archivo
        this.state.uploadedFiles.set(fieldName, file);
        
        // Mostrar vista previa
        if (preview) {
            preview.innerHTML = '';
            
            if (fileType === 'image') {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.onload = () => URL.revokeObjectURL(img.src);
                preview.appendChild(img);
            } else if (fileType === 'video') {
                const video = document.createElement('video');
                video.src = URL.createObjectURL(file);
                video.controls = true;
                video.muted = true;
                video.onloadedmetadata = () => URL.revokeObjectURL(video.src);
                preview.appendChild(video);
            }
        }
        
        // Limpiar errores previos
        this.clearFieldError(fileInput);
    }

    /**
     * Valida un campo individual
     */
    validateField(field, showError = false) {
        const fieldName = field.name;
        
        // Limpiar timeout previo para este campo
        if (this.state.validationTimeouts[fieldName]) {
            clearTimeout(this.state.validationTimeouts[fieldName]);
        }
        
        // Configurar nuevo timeout para validación
        this.state.validationTimeouts[fieldName] = setTimeout(() => {
            let isValid = field.checkValidity();
            let errorMessage = '';
            
            // Para campos requeridos
            if (field.required && !field.value.trim()) {
                isValid = false;
                errorMessage = this.config.messages.required;
            } 
            // Validaciones específicas por tipo
            else if (field.type === 'email' && field.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailPattern.test(field.value);
                if (!isValid) errorMessage = this.config.messages.invalidEmail;
            }
            else if (field.type === 'tel' && field.value) {
                const phonePattern = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
                isValid = phonePattern.test(field.value);
                if (!isValid) errorMessage = this.config.messages.invalidPhone;
            }
            
            // Gestionar errores
            if (!isValid && (showError || field.dataset.showError)) {
                this.showFieldError(field, errorMessage || this.config.messages.invalid);
            } else if (isValid) {
                this.clearFieldError(field);
            }
            
            // Almacenar estado de validación
            if (isValid) {
                this.state.fieldErrors.delete(fieldName);
            } else {
                this.state.fieldErrors.set(fieldName, errorMessage || this.config.messages.invalid);
            }
            
            // Marcar campo como validado
            field.dataset.showError = 'true';
            
            return isValid;
        }, this.config.validationDelay);
    }

    /**
     * Valida todos los campos en el paso actual
     */
    validateStep(stepNumber) {
        const step = this.steps[stepNumber - 1];
        if (!step) return true;
        
        let isValid = true;
        const fields = step.querySelectorAll('input, select, textarea');
        
        // Validar cada campo en este paso
        fields.forEach(field => {
            // Realizar validación inmediata
            const fieldValid = this.validateField(field, true);
            if (!fieldValid) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    /**
     * Muestra un mensaje de error para un campo
     */
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        
        // Crear y mostrar mensaje de error
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        // Insertar después del campo o su contenedor
        const fieldContainer = field.closest('.form-group') || field.parentNode;
        fieldContainer.appendChild(errorElement);
    }

    /**
     * Limpia los mensajes de error para un campo
     */
    clearFieldError(field) {
        field.classList.remove('error');
        
        // Eliminar mensaje de error si existe
        const fieldContainer = field.closest('.form-group') || field.parentNode;
        const errorElement = fieldContainer.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Navega al paso anterior
     */
    goToPrevStep() {
        if (this.state.currentStep > 1) {
            this.goToStep(this.state.currentStep - 1);
        }
    }

    /**
     * Navega al siguiente paso
     */
    goToNextStep() {
        if (this.state.currentStep < this.state.totalSteps) {
            // Validar el paso actual antes de avanzar
            if (this.validateStep(this.state.currentStep)) {
                this.goToStep(this.state.currentStep + 1);
            } else {
                // Hacer scroll al primer campo con error
                const firstErrorField = this.steps[this.state.currentStep - 1].querySelector('.error');
                if (firstErrorField) {
                    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    }

    /**
     * Navega a un paso específico
     */
    goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > this.state.totalSteps) return;
        
        // Ocultar todos los pasos
        this.steps.forEach((step, index) => {
            step.style.display = 'none';
            
            // Actualizar indicadores de pasos
            if (this.stepIndicators[index]) {
                this.stepIndicators[index].classList.remove('active', 'completed');
                
                if (index + 1 < stepNumber) {
                    this.stepIndicators[index].classList.add('completed');
                } else if (index + 1 === stepNumber) {
                    this.stepIndicators[index].classList.add('active');
                }
            }
        });
        
        // Mostrar el paso actual
        this.steps[stepNumber - 1].style.display = 'block';
        
        // Actualizar estado
        this.state.currentStep = stepNumber;
        
        // Actualizar navegación y progreso
        this.updateNavigationButtons();
        this.updateProgressBar();
        
        // Hacer scroll al inicio del formulario
        this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Actualiza los botones de navegación según el paso actual
     */
    updateNavigationButtons() {
        if (this.prevButton) {
            this.prevButton.style.display = this.state.currentStep > 1 ? 'block' : 'none';
        }
        
        if (this.nextButton) {
            this.nextButton.style.display = this.state.currentStep < this.state.totalSteps ? 'block' : 'none';
        }
        
        if (this.submitButton) {
            this.submitButton.style.display = this.state.currentStep === this.state.totalSteps ? 'block' : 'none';
        }
    }

    /**
     * Actualiza la barra de progreso
     */
    updateProgressBar() {
        if (this.progressBar) {
            const progressPercentage = (this.state.currentStep / this.state.totalSteps) * 100;
            this.progressBar.style.width = `${progressPercentage}%`;
        }
    }

    /**
     * Guarda el progreso del formulario en localStorage
     */
    saveProgress() {
        if (!this.config.autosave) return;
        
        const formData = {};
        
        // Recopilar valores de los campos
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            if (field.type === 'file' || field.type === 'checkbox' || field.type === 'radio') return;
            formData[field.name] = field.value;
        });
        
        // Recopilar checkboxes
        this.form.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            formData[checkbox.name] = checkbox.checked;
        });
        
        // Guardar el paso actual
        formData._currentStep = this.state.currentStep;
        
        // Guardar en localStorage
        try {
            localStorage.setItem(this.config.autosaveKey, JSON.stringify(formData));
            console.log('Progreso del formulario guardado');
        } catch (error) {
            console.error('Error al guardar el progreso:', error);
        }
    }

    /**
     * Restaura el progreso guardado previamente
     */
    restoreProgress() {
        if (!this.config.autosave) return;
        
        try {
            const savedData = localStorage.getItem(this.config.autosaveKey);
            if (!savedData) return;
            
            const formData = JSON.parse(savedData);
            
            // Restaurar valores de campos
            Object.entries(formData).forEach(([name, value]) => {
                if (name === '_currentStep') return;
                
                const field = this.form.querySelector(`[name="${name}"]`);
                if (!field) return;
                
                if (field.type === 'checkbox') {
                    field.checked = value;
                } else {
                    field.value = value;
                }
            });
            
            // Restaurar paso
            const savedStep = formData._currentStep || 1;
            this.goToStep(savedStep);
            
            console.log('Progreso del formulario restaurado');
        } catch (error) {
            console.error('Error al restaurar el progreso:', error);
        }
    }

    /**
     * Limpia el progreso guardado
     */
    clearSavedProgress() {
        if (this.config.autosave) {
            localStorage.removeItem(this.config.autosaveKey);
            console.log('Progreso guardado eliminado');
        }
    }

    /**
     * Maneja el envío del formulario
     */
    async handleSubmit(event) {
        event.preventDefault();
        
        // Evitar envíos múltiples
        if (this.state.isSubmitting) return;
        
        // Validar el último paso
        if (!this.validateStep(this.state.totalSteps)) {
            // Hacer scroll al primer campo con error
            const firstErrorField = this.steps[this.state.totalSteps - 1].querySelector('.error');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Preparar para enviar
        this.state.isSubmitting = true;
        this.submitButton.disabled = true;
        this.submitButton.innerHTML = '<span>Enviando...</span>';
        
        try {
            // Recopilar datos del formulario
            const formData = new FormData(this.form);
            
            // Agregar archivos cargados
            this.state.uploadedFiles.forEach((file, fieldName) => {
                formData.set(fieldName, file);
            });
            
            // Aquí iría el código para enviar los datos al servidor
            // Por ejemplo, usando fetch:
            /*
            const response = await fetch('/api/applications', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Error en el servidor');
            }
            
            const result = await response.json();
            */
            
            // Simulamos una respuesta exitosa para demostración
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mostrar mensaje de éxito
            this.showSubmissionResult(true, this.config.messages.success);
            
            // Limpiar progreso guardado
            this.clearSavedProgress();
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            
            // Mostrar mensaje de error
            this.showSubmissionResult(false, this.config.messages.error);
            
        } finally {
            // Restaurar estado del botón
            this.state.isSubmitting = false;
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = '<span>Enviar Solicitud</span>';
        }
    }

    /**
     * Muestra el resultado del envío del formulario
     */
    showSubmissionResult(success, message) {
        // Ocultar formulario
        this.steps.forEach(step => {
            step.style.display = 'none';
        });
        
        // Ocultar navegación
        if (this.prevButton) this.prevButton.style.display = 'none';
        if (this.nextButton) this.nextButton.style.display = 'none';
        if (this.submitButton) this.submitButton.style.display = 'none';
        
        // Crear elemento de resultado
        const resultElement = document.createElement('div');
        resultElement.className = success ? 'submission-success' : 'submission-error';
        
        // Contenido del resultado
        resultElement.innerHTML = `
            <div class="result-icon ${success ? 'success' : 'error'}"></div>
            <h3>${success ? '¡Solicitud Enviada!' : 'Error al Enviar'}</h3>
            <p>${message}</p>
            ${success ? '<p>Nos pondremos en contacto contigo pronto.</p>' : '<p>Por favor intenta nuevamente más tarde.</p>'}
            <a href="index.html" class="btn-future"><span>Volver al Inicio</span></a>
        `;
        
        // Agregar al formulario
        this.form.appendChild(resultElement);
        
        // Hacer scroll hacia el resultado
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Utilidad: Crea una versión con debounce de una función
     */
    debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }
}

// Inicializar el formulario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Detectar el idioma para mensajes apropiados
    const lang = document.documentElement.lang || 'en';
    
    // Mensajes según idioma
    const messages = {
        en: {
            required: 'This field is required',
            invalid: 'Please enter a valid value',
            invalidEmail: 'Please enter a valid email address',
            invalidPhone: 'Please enter a valid phone number',
            invalidDate: 'Please enter a valid date',
            tooLarge: 'File is too large',
            wrongFormat: 'File format not supported',
            success: 'Your application has been submitted successfully',
            error: 'There was a problem submitting your application'
        },
        es: {
            required: 'Este campo es obligatorio',
            invalid: 'Por favor, ingresa un valor válido',
            invalidEmail: 'Por favor, ingresa un correo electrónico válido',
            invalidPhone: 'Por favor, ingresa un número de teléfono válido',
            invalidDate: 'Por favor, ingresa una fecha válida',
            tooLarge: 'El archivo es demasiado grande',
            wrongFormat: 'Formato de archivo no admitido',
            success: 'Tu aplicación ha sido enviada correctamente',
            error: 'Hubo un problema al enviar tu aplicación'
        },
        pt: {
            required: 'Este campo é obrigatório',
            invalid: 'Por favor, digite um valor válido',
            invalidEmail: 'Por favor, digite um endereço de e-mail válido',
            invalidPhone: 'Por favor, digite um número de telefone válido',
            invalidDate: 'Por favor, digite uma data válida',
            tooLarge: 'O arquivo é muito grande',
            wrongFormat: 'Formato de arquivo não suportado',
            success: 'Sua inscrição foi enviada com sucesso',
            error: 'Houve um problema ao enviar sua inscrição'
        }
    };
    
    // Inicializar formulario con mensajes del idioma correspondiente
    const form = new ApplicationForm('.application-form', {
        messages: messages[lang] || messages.en
    });
    
    // Exponer al ámbito global para pruebas si es necesario
    window.applicationForm = form;
}); 