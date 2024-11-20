class PageTransition {
    constructor() {
        this.container = document.querySelector('.transition-container');
        this.isTransitioning = false;
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && this.isInternalLink(link) && !this.isTransitioning) {
                e.preventDefault();
                this.navigateTo(link.href);
            }
        });

        window.addEventListener('popstate', () => {
            this.navigateTo(window.location.href, false);
        });
    }

    isInternalLink(link) {
      if (link.hostname !== window.location.hostname) {
          return false;
      }
        return true;
    }
    
    async navigateTo(url, pushState = true) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.container.classList.add('transitioning', 'transitioning-up');

        await new Promise(resolve => setTimeout(resolve, 250));

        try {
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const newMain = doc.querySelector('main').innerHTML;
            
            document.querySelector('main').innerHTML = newMain;

            if (pushState) {
                window.history.pushState({}, '', url);
            }

            this.container.classList.remove('transitioning-up');
            this.container.classList.add('transitioning-down');

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.container.classList.remove('transitioning', 'transitioning-down');
                    this.isTransitioning = false;
                });
            });

        } catch (error) {
            console.error('Navigation failed:', error);
            this.isTransitioning = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PageTransition();
});
