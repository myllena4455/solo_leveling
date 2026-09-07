function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    if (sidebar) {
        sidebar.classList.toggle("active");
    }
    if (overlay) {
        overlay.classList.toggle("active");
    }
}

window.toggleSidebar = toggleSidebar;

function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-sistemas");
    const arrow = document.querySelector(".arrow");
    if (dropdown) {
        dropdown.classList.toggle("show");
    }
    if (arrow) {
        arrow.classList.toggle("rotate");
    }
}

window.toggleDropdown = toggleDropdown;

function showSection(sectionId) {
    const sections = document.querySelectorAll(".page-section");
    sections.forEach(section => {
        section.classList.remove("active");
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add("active");
    }

    const sidebar = document.getElementById("sidebar");
    if (sidebar && sidebar.classList.contains("active")) {
        toggleSidebar();
    }
}

window.showSection = showSection;

function toggleAccordion(headerElement) {
    if (!headerElement) {
        return;
    }

    const card = headerElement.parentElement;
    if (card) {
        card.classList.toggle('open');
    }
}

window.toggleAccordion = toggleAccordion;

function scrollPageByDirection(direction) {
    const delta = Math.round(window.innerHeight * 0.75);
    const top = direction === 'up' ? -delta : delta;

    window.scrollBy({
        top,
        behavior: 'smooth'
    });
}

window.scrollPageByDirection = scrollPageByDirection;

function copiarTexto(idElemento) {
    const campoTexto = document.getElementById(idElemento);
    if (!campoTexto) {
        return;
    }

    campoTexto.select();
    campoTexto.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(campoTexto.value);
}

window.copiarTexto = copiarTexto;

function copiarFichaBanco() {
    copiarTexto("ficha-banco-text");
}

window.copiarFichaBanco = copiarFichaBanco;

function copiarFichaCompra() {
    copiarTexto("ficha-compra-text");
}

window.copiarFichaCompra = copiarFichaCompra;

function filtrarItensLoja() {
    const input = document.getElementById('shop-search-input');
    if (!input) {
        return;
    }

    const filter = input.value.toLowerCase().trim();
    const accordionCards = Array.from(document.querySelectorAll('.accordion-card')).filter(accordion => {
        return accordion.querySelector('.shop-item-card') !== null;
    });

    accordionCards.forEach((accordion, accordionIndex) => {
        if (!accordion.dataset.originalOrder) {
            accordion.dataset.originalOrder = String(accordionIndex);
        }

        const itemCards = Array.from(accordion.querySelectorAll('.shop-item-card'));
        itemCards.forEach((card, cardIndex) => {
            if (!card.dataset.originalOrder) {
                card.dataset.originalOrder = String(cardIndex);
            }
        });
    });

    const resultMeta = [];

    accordionCards.forEach(accordion => {
        const itemCards = Array.from(accordion.querySelectorAll('.shop-item-card'));
        const grid = accordion.querySelector('.shop-grid');
        let hasMatch = false;
        let firstMatchOrder = Number.POSITIVE_INFINITY;

        itemCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const matches = filter === '' || text.includes(filter);

            card.style.display = matches ? 'flex' : 'none';

            if (matches) {
                hasMatch = true;
                const order = Number(card.dataset.originalOrder || '0');
                if (order < firstMatchOrder) {
                    firstMatchOrder = order;
                }
            }
        });

        if (grid) {
            const sortedCards = [...itemCards].sort((a, b) => {
                const aMatches = a.style.display !== 'none';
                const bMatches = b.style.display !== 'none';

                if (aMatches !== bMatches) {
                    return aMatches ? -1 : 1;
                }

                const aOrder = Number(a.dataset.originalOrder || '0');
                const bOrder = Number(b.dataset.originalOrder || '0');
                return aOrder - bOrder;
            });

            sortedCards.forEach(card => {
                grid.appendChild(card);
            });
        }

        if (filter === '') {
            accordion.classList.remove('open');
        } else if (hasMatch) {
            accordion.classList.add('open');
        } else {
            accordion.classList.remove('open');
        }

        resultMeta.push({
            accordion,
            hasMatch,
            firstMatchOrder,
            originalOrder: Number(accordion.dataset.originalOrder || '0')
        });
    });

    const sortedAccordions = [...resultMeta].sort((a, b) => {
        if (filter !== '' && a.hasMatch !== b.hasMatch) {
            return a.hasMatch ? -1 : 1;
        }

        if (filter !== '' && a.hasMatch && b.hasMatch && a.firstMatchOrder !== b.firstMatchOrder) {
            return a.firstMatchOrder - b.firstMatchOrder;
        }

        return a.originalOrder - b.originalOrder;
    });

    sortedAccordions.forEach(item => {
        const parent = item.accordion.parentElement;
        if (parent) {
            parent.appendChild(item.accordion);
        }
    });
}