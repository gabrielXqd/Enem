// Smooth scrolling para os links de navegação
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Progress bar
window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
});

// Animação dos números nas estatísticas
const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

// Observador para elementos animados
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('stat-number')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateValue(entry.target, 0, target, 2000);
            }
            entry.target.classList.add('show');
        }
    });
}, {
    threshold: 0.1
});

// Observar todos os elementos com classe animate e stat-number
document.querySelectorAll('.animate, .stat-number').forEach(element => {
    observer.observe(element);
});

// Efeito hover nos cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Toggle do botão "Saiba Mais"
const saibaMaisBtn = document.getElementById('saibaMaisBtn');
const saibaMaisContent = document.getElementById('saibaMaisContent');

if (saibaMaisBtn && saibaMaisContent) {
    saibaMaisBtn.addEventListener('click', () => {
        const isHidden = saibaMaisContent.style.display === 'none';
        saibaMaisContent.style.display = isHidden ? 'block' : 'none';
        saibaMaisBtn.innerHTML = isHidden ? 
            '<i class="fas fa-minus-circle"></i> Mostrar Menos' : 
            '<i class="fas fa-plus-circle"></i> Saiba Mais';
        
        if (isHidden) {
            saibaMaisContent.style.opacity = '0';
            setTimeout(() => {
                saibaMaisContent.style.opacity = '1';
            }, 10);
        }
    });
}

// Adicionar classe ativa ao link da navegação quando a seção estiver visível
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        const scroll = window.scrollY;
        
        if (scroll >= sectionTop && scroll < sectionTop + sectionHeight) {
            const id = section.getAttribute('id');
            navLinks.forEach(link => {
                link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--neon)' : 'var(--text-primary)';
            });
        }
    });
});

// Menu mobile
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');
let menuOverlay;

// Criar overlay
function createOverlay() {
    menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);
}

// Inicializar overlay
createOverlay();

// Toggle menu
function toggleMenu() {
    navMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    
    // Prevenir scroll quando menu estiver aberto
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

// Event listeners
menuToggle.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', toggleMenu);

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Fechar menu ao redimensionar para desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        toggleMenu();
    }
});

// Quiz
class Quiz {
    constructor(questions, numQuestions = 5) {
        this.questions = this.shuffleArray(questions);
        this.numQuestions = Math.min(numQuestions, questions.length);
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedQuestions = this.questions.slice(0, this.numQuestions);
        
        // Elements
        this.questionElement = document.getElementById('question');
        this.optionsContainer = document.getElementById('options');
        this.nextButton = document.getElementById('next-btn');
        this.restartButton = document.getElementById('restart-btn');
        this.currentQuestionSpan = document.getElementById('current-question');
        this.totalQuestionsSpan = document.getElementById('total-questions');
        this.scoreSpan = document.getElementById('score');
        this.feedbackElement = document.getElementById('feedback');
        
        // Event listeners
        this.nextButton.addEventListener('click', () => this.nextQuestion());
        this.restartButton.addEventListener('click', () => this.restartQuiz());
        
        // Initialize
        this.totalQuestionsSpan.textContent = this.numQuestions;
        this.showQuestion();
    }
    
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    showQuestion() {
        const question = this.selectedQuestions[this.currentQuestionIndex];
        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        this.questionElement.textContent = question.question;
        
        this.optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.addEventListener('click', () => this.selectOption(index));
            this.optionsContainer.appendChild(button);
        });
        
        this.nextButton.disabled = true;
        this.feedbackElement.style.display = 'none';
    }
    
    selectOption(selectedIndex) {
        const question = this.selectedQuestions[this.currentQuestionIndex];
        const options = this.optionsContainer.children;
        
        // Remove previous selections
        for (let option of options) {
            option.classList.remove('correct', 'wrong');
            option.disabled = true;
        }
        
        // Show correct/wrong
        const selectedOption = options[selectedIndex];
        const correctOption = options[question.correct];
        
        if (selectedIndex === question.correct) {
            selectedOption.classList.add('correct');
            this.score++;
            this.showFeedback(true);
        } else {
            selectedOption.classList.add('wrong');
            correctOption.classList.add('correct');
            this.showFeedback(false);
        }
        
        this.scoreSpan.textContent = this.score;
        this.nextButton.disabled = false;
        
        // Show restart button on last question
        if (this.currentQuestionIndex === this.numQuestions - 1) {
            this.nextButton.style.display = 'none';
            this.restartButton.style.display = 'block';
        }
    }
    
    showFeedback(isCorrect) {
        this.feedbackElement.style.display = 'block';
        this.feedbackElement.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'wrong');
        const feedbackIcon = this.feedbackElement.querySelector('.feedback-icon');
        const feedbackText = this.feedbackElement.querySelector('.feedback-text');
        
        feedbackIcon.innerHTML = isCorrect ? 
            '<i class="fas fa-check-circle"></i>' : 
            '<i class="fas fa-times-circle"></i>';
        
        feedbackText.textContent = isCorrect ? 
            'Correto! Muito bem!' : 
            'Incorreto. Não desanime, continue tentando!';
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.numQuestions) {
            this.showQuestion();
        }
    }
    
    restartQuiz() {
        this.questions = this.shuffleArray(questionsBank);
        this.selectedQuestions = this.questions.slice(0, this.numQuestions);
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.scoreSpan.textContent = '0';
        this.nextButton.style.display = 'block';
        this.restartButton.style.display = 'none';
        this.showQuestion();
    }
}

// Inicializar o quiz quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const quiz = new Quiz(questionsBank, 5);
});
