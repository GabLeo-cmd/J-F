import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Reexecuta scripts inline após render
    document.querySelectorAll("script").forEach((script) => {
      if (!script.src) {
        const s = document.createElement("script");
        s.text = script.innerHTML;
        script.parentNode.replaceChild(s, script);
      }
    });
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
<header>
  <nav>
    <div class="logo" onclick="showPage('home')">
      JF <span>Organização Trading</span>
    </div>

    <ul class="nav-links">
      <li><a id="nav-home" class="active" onclick="showPage('home')" data-translate="nav-home">Início</a></li>
      <li><a id="nav-services" onclick="showPage('services')" data-translate="nav-services">Serviços</a></li>
      <li><a onclick="showPage('home'); setTimeout(()=>scrollToSection('sobre'),100)" data-translate="nav-about">Sobre</a></li>
      <li><a onclick="showPage('home'); setTimeout(()=>scrollToSection('commodities'),100)" data-translate="nav-commodities">Commodities</a></li>
      <li><a onclick="showPage('home'); setTimeout(()=>scrollToSection('contato'),100)" data-translate="nav-contact">Contato</a></li>
    </ul>

    <div class="language-selector">
      <button id="lang-pt" class="active" onclick="changeLanguage('pt')">🇧🇷 PT</button>
      <button id="lang-en" onclick="changeLanguage('en')">🇺🇸 EN</button>
      <button id="lang-es" onclick="changeLanguage('es')">🇪🇸 ES</button>
    </div>
  </nav>
</header>

<!-- HOME -->
<div id="home-page" class="page active">

  <section class="hero">
    <h1 data-translate="hero-title">Transporte, Logística & Exportação</h1>
    <p data-translate="hero-subtitle">
      Soluções Completas Em Transporte RodoFluvial, Armazenagem E Operações De Exportação
    </p>

    <div class="cta-buttons">
      <a class="btn btn-primary" onclick="scrollToSection('contato')" data-translate="btn-quote">
        Solicite um Orçamento
      </a>
      <a class="btn btn-secondary" onclick="showPage('services')" data-translate="btn-services">
        Nossos Serviços
      </a>
    </div>
  </section>

  <section class="about" id="sobre">
    <h2 data-translate="about-title">Sobre a JF Organização Trading</h2>
    <p data-translate="about-text-1">
      Atuamos há mais de 15 anos no mercado de logística e exportação com excelência operacional.
    </p>
    <p data-translate="about-text-2">
      Somos especialistas em transporte rodofluvial e comércio exterior de commodities.
    </p>
  </section>

  <section class="commodities" id="commodities">
    <h2 data-translate="commodities-title">Commodities que Operamos</h2>
    <p data-translate="commodities-text">
      Grãos, proteínas, café, açúcar, madeira e minérios.
    </p>
  </section>

  <section class="contact" id="contato">
    <h2 data-translate="contact-title">Entre em Contato</h2>
    <p data-translate="contact-text">
      Fale conosco via WhatsApp e receba atendimento personalizado.
    </p>
  </section>

</div>

<!-- SERVICES PAGE -->
<div id="services-page" class="page">
  <section class="page-header">
    <h1 data-translate="services-page-title">Nossas Especialidades</h1>
    <p data-translate="services-page-subtitle">
      Soluções completas em logística, armazenagem e exportação
    </p>
  </section>
</div>

<footer>
  <p data-translate="footer-text">
    © 2026 JF Organização Trading. Todos os direitos reservados.
  </p>
</footer>

<script>
/* ================= TRANSLATIONS ================= */

const translations = {
  pt: {
    "nav-home": "Início",
    "nav-services": "Serviços",
    "nav-about": "Sobre",
    "nav-commodities": "Commodities",
    "nav-contact": "Contato",

    "hero-title": "Transporte, Logística & Exportação",
    "hero-subtitle": "Soluções Completas Em Transporte RodoFluvial, Armazenagem E Operações De Exportação",

    "btn-quote": "Solicite um Orçamento",
    "btn-services": "Nossos Serviços",

    "about-title": "Sobre a JF Organização Trading",
    "about-text-1": "Atuamos há mais de 15 anos no mercado de logística e exportação com excelência operacional.",
    "about-text-2": "Somos especialistas em transporte rodofluvial e comércio exterior de commodities.",

    "commodities-title": "Commodities que Operamos",
    "commodities-text": "Grãos, proteínas, café, açúcar, madeira e minérios.",

    "contact-title": "Entre em Contato",
    "contact-text": "Fale conosco via WhatsApp e receba atendimento personalizado.",

    "services-page-title": "Nossas Especialidades",
    "services-page-subtitle": "Soluções completas em logística, armazenagem e exportação",

    "footer-text": "© 2026 JF Organização Trading. Todos os direitos reservados."
  },

  en: {
    "nav-home": "Home",
    "nav-services": "Services",
    "nav-about": "About",
    "nav-commodities": "Commodities",
    "nav-contact": "Contact",

    "hero-title": "Transport, Logistics & Export",
    "hero-subtitle": "Complete Solutions in River-Road Transport, Warehousing and Export Operations",

    "btn-quote": "Request a Quote",
    "btn-services": "Our Services",

    "about-title": "About JF Organização Trading",
    "about-text-1": "We have over 15 years of experience in logistics and export operations.",
    "about-text-2": "We specialize in river-road transport and international trade of commodities.",

    "commodities-title": "Commodities We Operate",
    "commodities-text": "Grains, proteins, coffee, sugar, timber and minerals.",

    "contact-title": "Contact Us",
    "contact-text": "Talk to us via WhatsApp and receive personalized service.",

    "services-page-title": "Our Specialties",
    "services-page-subtitle": "Complete solutions in logistics, warehousing and export",

    "footer-text": "© 2026 JF Organização Trading. All rights reserved."
  },

  es: {
    "nav-home": "Inicio",
    "nav-services": "Servicios",
    "nav-about": "Sobre",
    "nav-commodities": "Commodities",
    "nav-contact": "Contacto",

    "hero-title": "Transporte, Logística y Exportación",
    "hero-subtitle": "Soluciones Completas en Transporte RodoFluvial, Almacenamiento y Exportación",

    "btn-quote": "Solicitar Presupuesto",
    "btn-services": "Nuestros Servicios",

    "about-title": "Sobre JF Organización Trading",
    "about-text-1": "Más de 15 años de experiencia en logística y exportación.",
    "about-text-2": "Especialistas en transporte fluvial y comercio exterior de commodities.",

    "commodities-title": "Commodities que Operamos",
    "commodities-text": "Granos, proteínas, café, azúcar, madera y minerales.",

    "contact-title": "Contáctanos",
    "contact-text": "Habla con nosotros por WhatsApp y recibe atención personalizada.",

    "services-page-title": "Nuestras Especialidades",
    "services-page-subtitle": "Soluciones completas en logística, almacenamiento y exportación",

    "footer-text": "© 2026 JF Organización Trading. Todos los derechos reservados."
  }
};

let currentLang = "pt";

function changeLanguage(lang) {
  currentLang = lang;

  document.querySelectorAll(".language-selector button")
    .forEach(btn => btn.classList.remove("active"));

  document.getElementById("lang-" + lang).classList.add("active");

  document.querySelectorAll("[data-translate]").forEach(el => {
    const key = el.dataset.translate;
    if (translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(page + "-page").classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
</script>
        `,
      }}
    />
  );
}

export default App;
