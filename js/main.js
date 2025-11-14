// Cargar componentes dinámicamente
document.addEventListener('DOMContentLoaded', function() {
    // Array de componentes a cargar
    const components = [
        { id: 'header', file: 'components/header.html' },
        { id: 'hero', file: 'components/hero.html' },
        { id: 'features', file: 'components/features.html' },
        { id: 'how-it-works', file: 'components/how-it-works.html' },
        { id: 'services', file: 'components/services.html' },
        { id: 'cta', file: 'components/cta.html' },
        { id: 'footer', file: 'components/footer.html' }
    ];

    // Contador para componentes cargados
    let loadedComponents = 0;

    // Cargar cada componente
    components.forEach(component => {
        fetch(component.file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById(component.id).innerHTML = data;
                loadedComponents++;
                
                // Si todos los componentes están cargados, inicializar animaciones
                if (loadedComponents === components.length) {
                    initializeAnimations();
                    initializeNavigation();
                }
            })
            .catch(error => {
                console.error(`Error cargando ${component.file}:`, error);
                document.getElementById(component.id).innerHTML = `
                    <div class="container" style="text-align: center; padding: 2rem; color: #666;">
                        <p>Error cargando el componente. Por favor, recarga la página.</p>
                        <button onclick="location.reload()" class="btn" style="margin-top: 1rem;">Recargar Página</button>
                    </div>
                `;
            });
    });

    // Función para inicializar animaciones
    function initializeAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in');
        
        const fadeInOnScroll = function() {
            fadeElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };
        
        // Inicializar elementos visibles al cargar
        fadeInOnScroll();
        
        // Verificar al hacer scroll
        window.addEventListener('scroll', fadeInOnScroll);
    }

    // Función para inicializar navegación suave
    function initializeNavigation() {
        // Navegación suave para enlaces internos
        document.addEventListener('click', function(e) {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Actualizar URL sin recargar
                    history.pushState(null, null, targetId);
                }
            }
        });

        // Manejar el botón de newsletter
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('.newsletter-input').value;
                alert(`¡Gracias por suscribirte con: ${email}! Te mantendremos informado.`);
                this.reset();
            });
        }
    }
});

// Función global para recargar
window.reloadPage = function() {
    location.reload();
};