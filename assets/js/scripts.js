/* ── Preloader ───────────────────────── */
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader').classList.add('hide'), 900);
});

/* ── Dark mode ──────────────────────── */
const body = document.body;
const darkToggle = document.getElementById('darkToggle');
const darkIcon = document.getElementById('darkIcon');

function applyDark(on) {
    body.classList.toggle('dark', on);
    darkIcon.className = on ? 'bi bi-sun' : 'bi bi-moon';
}
applyDark(localStorage.getItem('dark') === '1');
darkToggle.addEventListener('click', () => {
    const on = !body.classList.contains('dark');
    applyDark(on);
    localStorage.setItem('dark', on ? '1' : '0');
});

/* ── Hamburger ──────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navActions = document.getElementById('navActions');
hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    navLinks.classList.toggle('open', open);
    navActions.classList.toggle('open', open);
});

/* ── Back to top ────────────────────── */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
    backTop.classList.toggle('show', window.scrollY > 320);
});
backTop.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Modal Login ────────────────────── */
const loginModal = document.getElementById('loginModal');
document.getElementById('loginBtn').addEventListener('click', () => loginModal.classList.add('open'));
document.getElementById('modalClose').addEventListener('click', () => loginModal.classList.remove('open'));
document.getElementById('goRegister').addEventListener('click', () => {
    loginModal.classList.remove('open');
    document.getElementById('registro').scrollIntoView({ behavior: 'smooth' });
});
loginModal.addEventListener('click', e => { if (e.target === loginModal) loginModal.classList.remove('open'); });

/* ── Toast ──────────────────────────── */
function showToast(msg, type = 'info') {
    const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill' };
    const colors = { success: '#22c55e', error: '#f43f5e', info: '#7c3aed' };
    const t = document.createElement('div');
    t.className = `ps-toast ${type}`;
    t.innerHTML = `<i class="bi ${icons[type] || icons.info}" style="color:${colors[type] || colors.info};font-size:1.1rem;"></i><span class="toast-msg">${msg}</span>`;
    document.getElementById('toastContainer').appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(30px)'; t.style.transition = '.3s'; setTimeout(() => t.remove(), 350); }, 3500);
}

/* ── Cart ───────────────────────────── */
let cartCount = 3;
const cartBadge = document.getElementById('cartCount');
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        cartCount++;
        cartBadge.textContent = cartCount;
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check"></i> Añadido';
        btn.disabled = true;
        showToast('Producto añadido al carrito', 'success');
        setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 2000);
    });
});

/* ── Carousel ───────────────────────── */
let carIdx = 0;
const track = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('#carDots span');

function goTo(i) {
    carIdx = (i + 3) % 3;
    track.style.transform = `translateX(-${carIdx * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle('active', j === carIdx));
}
document.getElementById('carPrev').addEventListener('click', () => goTo(carIdx - 1));
document.getElementById('carNext').addEventListener('click', () => goTo(carIdx + 1));
dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.idx)));
let carTimer = setInterval(() => goTo(carIdx + 1), 5000);
track.parentElement.addEventListener('mouseenter', () => clearInterval(carTimer));
track.parentElement.addEventListener('mouseleave', () => { carTimer = setInterval(() => goTo(carIdx + 1), 5000); });

/* ── Scroll reveal ──────────────────────────────────── */

/* ── Scroll reveal ──────────────────── */
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

/* ── Validation helpers ──────────────── */
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function val(id, cond, errId) {
    const el = document.getElementById(id);
    const err = document.getElementById(errId);
    const ok = cond(el);
    el.classList.toggle('error', !ok);
    err.classList.toggle('show', !ok);
    return ok;
}
function setLoading(btn, loading) {
    btn.disabled = loading;
    btn.innerHTML = loading
        ? '<span class="spinner"></span> Enviando...'
        : btn.dataset.orig;
}

/* ── Contact form ───────────────────── */
const contactForm = document.getElementById('contactForm');
const contactBtn = document.getElementById('contactSubmit');
contactBtn.dataset.orig = contactBtn.innerHTML;
contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const ok = [
        val('cName', el => el.value.trim().length > 1, 'cNameErr'),
        val('cEmail', el => emailRe.test(el.value), 'cEmailErr'),
        val('cSubject', el => el.value.trim().length > 1, 'cSubjectErr'),
        val('cMessage', el => el.value.trim().length > 5, 'cMessageErr'),
    ].every(Boolean);
    if (!ok) return showToast('Corrige los errores del formulario', 'error');
    setLoading(contactBtn, true);
    setTimeout(() => {
        setLoading(contactBtn, false);
        contactForm.reset();
        showToast('Mensaje enviado correctamente', 'success');
    }, 2000);
});

/* ── Register form ──────────────────── */
const registerForm = document.getElementById('registerForm');
const registerBtn = document.getElementById('registerSubmit');
registerBtn.dataset.orig = registerBtn.innerHTML;
registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const passEl = document.getElementById('rPass');
    const passCEl = document.getElementById('rPassC');
    const ok = [
        val('rFirst', el => el.value.trim().length > 0, 'rFirstErr'),
        val('rLast', el => el.value.trim().length > 0, 'rLastErr'),
        val('rEmail', el => emailRe.test(el.value), 'rEmailErr'),
        val('rPass', el => el.value.length >= 8, 'rPassErr'),
        val('rPassC', el => el.value === passEl.value, 'rPassCErr'),
        val('rAddr', el => el.value.trim().length > 0, 'rAddrErr'),
        val('rCity', el => el.value.trim().length > 0, 'rCityErr'),
        val('rZip', el => /^[0-9]{5}$/.test(el.value), 'rZipErr'),
        val('rCountry', el => el.value !== '', 'rCountryErr'),
        val('rTerms', el => el.checked, 'rTermsErr'),
    ].every(Boolean);
    if (!ok) return showToast('Corrige los errores del formulario', 'error');
    setLoading(registerBtn, true);
    setTimeout(() => {
        setLoading(registerBtn, false);
        registerForm.reset();
        showToast('¡Cuenta creada exitosamente! Bienvenido a PurpleShop', 'success');
    }, 2200);
});

/* ── Login form ─────────────────────── */
document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('loginSubmit');
    const ok = [
        val('loginEmail', el => emailRe.test(el.value), 'loginEmailErr'),
        val('loginPass', el => el.value.trim().length > 0, 'loginPassErr'),
    ].every(Boolean);
    if (!ok) return showToast('Corrige los errores', 'error');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Ingresando...';
    setTimeout(() => {
        btn.disabled = false; btn.innerHTML = orig;
        loginModal.classList.remove('open');
        showToast('Inicio de sesión exitoso', 'success');
    }, 1800);
});

/* ── Catálogo vanilla JS ─────────────────────────── */
(function () {
    var DATA = [
        { id: '001', name: 'Smartphone Pro X', cat: 'Electrónicos', price: 599.99, stock: 'En stock' },
        { id: '002', name: 'Reloj Inteligente', cat: 'Electrónicos', price: 199.99, stock: 'En stock' },
        { id: '003', name: 'Auriculares Premium', cat: 'Electrónicos', price: 149.99, stock: 'Agotado' },
        { id: '004', name: 'Zapatillas Deportivas', cat: 'Ropa', price: 89.99, stock: 'En stock' },
        { id: '005', name: 'Set de Cocina Premium', cat: 'Hogar', price: 249.99, stock: 'En stock' },
        { id: '006', name: 'Tablet Ultra HD', cat: 'Electrónicos', price: 349.99, stock: 'En stock' },
        { id: '007', name: 'Camiseta Algodón Orgánico', cat: 'Ropa', price: 29.99, stock: 'En stock' },
        { id: '008', name: 'Mochila Impermeable', cat: 'Accesorios', price: 59.99, stock: 'Agotado' },
        { id: '009', name: 'Smart TV 55" 4K', cat: 'Electrónicos', price: 699.99, stock: 'En stock' },
        { id: '010', name: 'Set de Jardinería', cat: 'Hogar', price: 79.99, stock: 'En stock' },
    ];

    var state = { q: '', cat: '', stock: '', page: 1, perPage: 10, sortCol: -1, sortDir: 1 };

    function badge(s) {
        var isDark = document.body.classList.contains('dark');
        var bg, cl;
        if (s === 'En stock') {
            bg = isDark ? 'rgba(34,197,94,.15)' : '#dcfce7';
            cl = isDark ? '#4ade80' : '#166534';
        } else {
            bg = isDark ? 'rgba(244,63,94,.15)' : '#fee2e2';
            cl = isDark ? '#fb7185' : '#991b1b';
        }
        return '<span class="badge" style="background:' + bg + ';color:' + cl + '">' + s + '</span>';
    }

    function filtered() {
        return DATA.filter(function (r) {
            var q = state.q.toLowerCase();
            var matchQ = !q || r.id.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.cat.toLowerCase().includes(q) || r.stock.toLowerCase().includes(q);
            var matchC = !state.cat || r.cat === state.cat;
            var matchS = !state.stock || r.stock === state.stock;
            return matchQ && matchC && matchS;
        });
    }

    function sorted(rows) {
        if (state.sortCol < 0) return rows;
        var cols = ['id', 'name', 'cat', 'price', 'stock'];
        var key = cols[state.sortCol];
        return rows.slice().sort(function (a, b) {
            var av = a[key], bv = b[key];
            if (typeof av === 'number') return (av - bv) * state.sortDir;
            return av.localeCompare(bv) * state.sortDir;
        });
    }

    function render() {
        var rows = sorted(filtered());
        var total = rows.length;
        var pages = Math.max(1, Math.ceil(total / state.perPage));
        if (state.page > pages) state.page = pages;
        var start = (state.page - 1) * state.perPage;
        var slice = rows.slice(start, start + state.perPage);

        var tbody = document.getElementById('catalogBody');
        tbody.innerHTML = slice.map(function (r) {
            return '<tr>'
                + '<td data-label="ID">' + r.id + '</td>'
                + '<td data-label="Producto">' + r.name + '</td>'
                + '<td data-label="Categoría">' + r.cat + '</td>'
                + '<td data-label="Precio">$' + r.price.toFixed(2) + '</td>'
                + '<td data-label="Stock">' + badge(r.stock) + '</td>'
                + '<td data-label="Acciones"><button class="tbl-btn primary">Ver</button> <button class="tbl-btn">Editar</button></td>'
                + '</tr>';
        }).join('') || '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--muted);">No se encontraron productos</td></tr>';

        var s = total === 0 ? 'Sin resultados' : 'Mostrando ' + (start + 1) + '–' + Math.min(start + state.perPage, total) + ' de ' + total + ' productos';
        document.getElementById('dtInfo').textContent = s;

        var pDiv = document.getElementById('dtPages');
        pDiv.innerHTML = '';
        function mkBtn(label, pg, active) {
            var b = document.createElement('button');
            b.className = 'page-btn' + (active ? ' active' : '');
            b.textContent = label;
            b.disabled = active;
            b.addEventListener('click', function () { state.page = pg; render(); });
            pDiv.appendChild(b);
        }
        if (pages <= 7) {
            for (var i = 1; i <= pages; i++) mkBtn(i, i, i === state.page);
        } else {
            mkBtn(1, 1, state.page === 1);
            if (state.page > 3) { var e = document.createElement('span'); e.textContent = '…'; e.style.padding = '0 6px'; e.style.color = 'var(--muted)'; pDiv.appendChild(e); }
            for (var i = Math.max(2, state.page - 1); i <= Math.min(pages - 1, state.page + 1); i++) mkBtn(i, i, i === state.page);
            if (state.page < pages - 2) { var e = document.createElement('span'); e.textContent = '…'; e.style.padding = '0 6px'; e.style.color = 'var(--muted)'; pDiv.appendChild(e); }
            mkBtn(pages, pages, state.page === pages);
        }
    }

    document.getElementById('dtSearch').addEventListener('input', function () { state.q = this.value; state.page = 1; render(); });
    document.getElementById('dtCat').addEventListener('change', function () { state.cat = this.value; state.page = 1; render(); });
    document.getElementById('dtLen').addEventListener('change', function () { state.perPage = +this.value; state.page = 1; render(); });

    document.querySelectorAll('.dt-chip').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.dt-chip').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.stock = btn.dataset.stock;
            state.page = 1;
            render();
        });
    });

    document.querySelectorAll('#catalogTable thead th[data-col]').forEach(function (th) {
        th.addEventListener('click', function () {
            var col = +this.dataset.col;
            if (state.sortCol === col) { state.sortDir *= -1; }
            else { state.sortCol = col; state.sortDir = 1; }
            document.querySelectorAll('#catalogTable thead th .sort-icon').forEach(function (s) { s.textContent = '↕'; s.style.opacity = '.5'; });
            this.querySelector('.sort-icon').textContent = state.sortDir === 1 ? '↑' : '↓';
            this.querySelector('.sort-icon').style.opacity = '1';
            render();
        });
    });

    /* Re-render badges on dark toggle */
    document.getElementById('darkToggle').addEventListener('click', function () {
        setTimeout(render, 60);
    });

    render();
}());