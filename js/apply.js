document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('applicationForm');
    const steps = document.querySelectorAll('.form-step');
    const progress = document.getElementById('formProgress');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    let currentStep = 1;

    // Update progress bar
    const updateProgress = () => {
        const width = ((currentStep - 1) / (steps.length - 1)) * 100;
        progress.style.width = `${width}%`;
    };

    // Next step
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                steps[currentStep - 1].classList.add('hidden');
                steps[currentStep].classList.remove('hidden');
                currentStep++;
                updateProgress();
            }
        });
    });

    // Previous step
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            steps[currentStep - 1].classList.add('hidden');
            steps[currentStep - 2].classList.remove('hidden');
            currentStep--;
            updateProgress();
        });
    });

    // Form validation
    const validateStep = (step) => {
        const currentInputs = steps[step - 1].querySelectorAll('input[required]');
        let valid = true;
        currentInputs.forEach(input => {
            if (!input.value) valid = false;
        });
        return valid;
    };
}); 