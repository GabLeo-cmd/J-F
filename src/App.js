import React, { useState, useEffect } from 'react';
import './App.css';
import backgroundImage from './assets/background.jpeg';
import image1 from './assets/1.jpeg';
import image2 from './assets/2.jpeg';
import image3 from './assets/3.jpeg';
import image4 from './assets/4.jpeg';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para os ícones do Leaflet no React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícone customizado para a Matriz
const matrizIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Ícone customizado para Filiais
const filialIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function App() {
  const [currentLang, setCurrentLang] = useState('pt');
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatResponse, setChatResponse] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array de imagens para o carrossel
  const heroImages = [backgroundImage, image1, image2, image3, image4];

  // Carrossel automático - muda de imagem a cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Localização das filiais
  const locations = [
    { name: 'Matriz - Manaus', coords: [-3.1190, -60.0217], type: 'matriz', state: 'Amazonas' },
    { name: 'Filial - Boa Vista', coords: [2.8235, -60.6758], type: 'filial', state: 'Roraima' },
    { name: 'Filial - São Luís', coords: [-2.5307, -44.3068], type: 'filial', state: 'Maranhão' },
    { name: 'Filial - Cuiabá', coords: [-15.6014, -56.0979], type: 'filial', state: 'Mato Grosso' },
    { name: 'Filial - Goiânia', coords: [-16.6869, -49.2648], type: 'filial', state: 'Goiás' }
  ];

  const translations = {
    pt: {
      'nav-home': 'Início',
      'nav-services': 'Serviços',
      'nav-coverage': 'Localidade',
      'nav-about': 'Sobre',
      'nav-contact': 'Contato',
      'hero-title': 'Transporte, Logística & Exportação',
      'hero-subtitle': 'Soluções Completas Em Transporte RodoFluvial, Armazenagem E Operações De Exportação Para Sua Empresa',
      'btn-services': 'Nossos Serviços',
      'services-title': 'Nossas Especialidades',
      'services-subtitle': 'Oferecemos soluções completas e integradas para atender todas as necessidades logísticas da sua empresa',
      'coverage-title': 'Nossas Localidades',
      'coverage-subtitle': 'Posicionamento estratégico em pontos-chave do território brasileiro para atender melhor você',
      'coverage-matriz': 'Matriz',
      'coverage-filial': 'Filial',
      'location-manaus': 'Manaus',
      'location-amazonas': 'Amazonas',
      'location-desc1': 'Centro estratégico de operações',
      'location-desc2': 'Hub logístico da região Norte',
      'location-desc3': 'Distribuição rodofluvial',
      'location-boavista': 'Boa Vista',
      'location-roraima': 'Roraima',
      'branch-specialty1': 'Fronteira internacional',
      'location-saoluis': 'São Luís',
      'location-maranhao': 'Maranhão',
      'branch-specialty2': 'Porto e exportação',
      'location-cuiaba': 'Cuiabá',
      'location-matogrosso': 'Mato Grosso',
      'branch-specialty3': 'Centro-Oeste estratégico',
      'location-goiania': 'Goiânia',
      'location-goias': 'Goiás',
      'branch-specialty4': 'Conexão nacional',
      'whatsapp-cta-title': 'Precisa de um Orçamento Rápido?',
      'whatsapp-cta-subtitle': 'Fale diretamente com nossa equipe comercial pelo WhatsApp!',
      'whatsapp-btn-text': 'Falar no WhatsApp Agora',
      'badge-specialty': 'Especialidade',
      'badge-performance': 'Alta Performance',
      'badge-infrastructure': 'Infraestrutura',
      'badge-global': 'Global',
      'service1-title': 'Transporte RodoFluvial',
      'service1-desc': 'Combinamos o melhor do transporte rodoviário e fluvial para oferecer soluções logísticas completas e econômicas, especialmente na região amazônica.',
      'service1-feature1': 'Integração rodoviária e fluvial',
      'service1-feature2': 'Rotas otimizadas pela Amazônia',
      'service1-feature3': 'Rastreamento em tempo real',
      'service1-feature4': 'Capacidade para grandes volumes',
      'service2-title': 'Distribuição de Cargas',
      'service2-desc': 'Gerenciamento completo da distribuição de suas mercadorias com eficiência, segurança e pontualidade em todo território nacional.',
      'service2-feature1': 'Gestão de última milha',
      'service2-feature2': 'Frota moderna e diversificada',
      'service2-feature3': 'Entrega pontual garantida',
      'service2-feature4': 'Seguro completo de cargas',
      'service3-title': 'Armazenagem & Logística',
      'service3-desc': 'Centros de distribuição estratégicos com tecnologia de ponta, controle de temperatura e segurança 24 horas para seus produtos.',
      'service3-feature1': 'Armazéns climatizados',
      'service3-feature2': 'Sistema WMS integrado',
      'service3-feature3': 'Segurança e monitoramento 24/7',
      'service3-feature4': 'Gestão inteligente de estoque',
      'service4-title': 'Exportação & Comércio Exterior',
      'service4-desc': 'Assessoria completa em comércio internacional, cuidando de toda documentação e processos para levar seus produtos ao mundo.',
      'service4-feature1': 'Despachante aduaneiro próprio',
      'service4-feature2': 'Gestão de documentação completa',
      'service4-feature3': 'Parceiros em 50+ países',
      'service4-feature4': 'Consultoria em comércio exterior',
      'about-title': 'Sobre a JF Organização Trading',
      'about-p1': 'Com anos de experiência no mercado de logística e exportação, a JF Organização Trading se consolidou como referência em soluções integradas de transporte rodofluvial e comércio exterior de commodities.',
      'about-p2': 'Nossa expertise combina o melhor do transporte rodoviário e fluvial, especialmente na região amazônica, com operações complexas de exportação, sempre com foco na excelência operacional e satisfação do cliente.',
      'about-p3': 'Atuamos com compromisso, transparência e eficiência, oferecendo soluções personalizadas que impulsionam o crescimento dos nossos parceiros comerciais.',
      'contact-title': 'Entre em Contato',
      'contact-form-title': 'Solicite seu Orçamento',
      'contact-form-subtitle': 'Entre em contato conosco e receba atendimento personalizado para suas necessidades de exportação.',
      'whatsapp-commercial': 'WhatsApp - Comercial',
      'email-export-button': 'Email - Comercial Exportação',
      'contact-info-label': '📧 Contato Comercial Exportação:',
      'commercial-label': 'Comercial',
      'footer-desc': 'Excelência em logística rodofluvial e exportação de commodities desde 2009.',
      'footer-services-title': 'Nossas Especialidades',
      'footer-service1': 'Transporte RodoFluvial',
      'footer-service2': 'Distribuição de Cargas',
      'footer-service3': 'Armazenagem & Logística',
      'footer-service4': 'Exportação & Comércio',
      'footer-company-title': 'Empresa',
      'footer-about': 'Sobre Nós',
      'footer-contact': 'Contato',
      'footer-careers': 'Trabalhe Conosco',
      'footer-connect-title': 'Conecte-se',
      'footer-copyright': '© 2026 JF Organização Trading. Todos os direitos reservados.',
      'chat-help': 'Precisa de Ajuda?',
      'chat-title': 'Como podemos ajudar?',
      'chat-intro': 'Selecione uma opção abaixo:',
      'chat-option-services': 'Conhecer nossos serviços',
      'chat-option-quote': 'Solicitar orçamento',
      'chat-option-export': 'Informações sobre exportação',
      'chat-option-other': 'Outras dúvidas',
      'chat-whatsapp-btn': 'Continuar no WhatsApp',
      'chat-back-btn': 'Voltar'
    },
    en: {
      'nav-home': 'Home',
      'nav-services': 'Services',
      'nav-coverage': 'Locations',
      'nav-about': 'About',
      'nav-contact': 'Contact',
      'hero-title': 'Transport, Logistics & Export',
      'hero-subtitle': 'Complete Solutions In River-Road Transport, Warehousing And Export Operations For Your Company',
      'btn-services': 'Our Services',
      'services-title': 'Our Specialties',
      'services-subtitle': 'We offer complete and integrated solutions to meet all your company\'s logistics needs',
      'coverage-title': 'Our Locations',
      'coverage-subtitle': 'Strategic positioning at key points across Brazilian territory to serve you better',
      'coverage-matriz': 'Headquarters',
      'coverage-filial': 'Branch',
      'location-manaus': 'Manaus',
      'location-amazonas': 'Amazonas',
      'location-desc1': 'Strategic operations center',
      'location-desc2': 'Logistics hub of the North region',
      'location-desc3': 'River-road distribution',
      'location-boavista': 'Boa Vista',
      'location-roraima': 'Roraima',
      'branch-specialty1': 'International border',
      'location-saoluis': 'São Luís',
      'location-maranhao': 'Maranhão',
      'branch-specialty2': 'Port and export',
      'location-cuiaba': 'Cuiabá',
      'location-matogrosso': 'Mato Grosso',
      'branch-specialty3': 'Strategic Midwest',
      'location-goiania': 'Goiânia',
      'location-goias': 'Goiás',
      'branch-specialty4': 'National connection',
      'whatsapp-cta-title': 'Need a Quick Quote?',
      'whatsapp-cta-subtitle': 'Talk directly with our commercial team via WhatsApp!',
      'whatsapp-btn-text': 'Chat on WhatsApp Now',
      'badge-specialty': 'Specialty',
      'badge-performance': 'High Performance',
      'badge-infrastructure': 'Infrastructure',
      'badge-global': 'Global',
      'service1-title': 'River-Road Transport',
      'service1-desc': 'We combine the best of road and river transport to offer complete and economical logistics solutions, especially in the Amazon region.',
      'service1-feature1': 'Road and river integration',
      'service1-feature2': 'Optimized routes through the Amazon',
      'service1-feature3': 'Real-time tracking',
      'service1-feature4': 'High volume capacity',
      'service2-title': 'Cargo Distribution',
      'service2-desc': 'Complete management of your goods distribution with efficiency, safety and punctuality throughout the national territory.',
      'service2-feature1': 'Last mile management',
      'service2-feature2': 'Modern and diversified fleet',
      'service2-feature3': 'Guaranteed on-time delivery',
      'service2-feature4': 'Complete cargo insurance',
      'service3-title': 'Warehousing & Logistics',
      'service3-desc': 'Strategic distribution centers with cutting-edge technology, temperature control and 24-hour security for your products.',
      'service3-feature1': 'Climate-controlled warehouses',
      'service3-feature2': 'Integrated WMS system',
      'service3-feature3': '24/7 security and monitoring',
      'service3-feature4': 'Smart inventory management',
      'service4-title': 'Export & Foreign Trade',
      'service4-desc': 'Complete advisory in international trade, handling all documentation and processes to take your products to the world.',
      'service4-feature1': 'In-house customs broker',
      'service4-feature2': 'Complete documentation management',
      'service4-feature3': 'Partners in 50+ countries',
      'service4-feature4': 'Foreign trade consulting',
      'about-title': 'About JF Organização Trading',
      'about-p1': 'With years of experience in the logistics and export market, JF Organização Trading has established itself as a reference in integrated river-road transport solutions and commodity foreign trade.',
      'about-p2': 'Our expertise combines the best of road and river transport, especially in the Amazon region, with complex export operations, always focusing on operational excellence and customer satisfaction.',
      'about-p3': 'We operate with commitment, transparency and efficiency, offering customized solutions that drive the growth of our business partners.',
      'contact-title': 'Get In Touch',
      'contact-form-title': 'Request Your Quote',
      'contact-form-subtitle': 'Contact us and receive personalized service for your export needs.',
      'whatsapp-commercial': 'WhatsApp - Commercial',
      'email-export-button': 'Email - Export Commercial',
      'contact-info-label': '📧 Export Commercial Contact:',
      'commercial-label': 'Commercial',
      'footer-desc': 'Excellence in river-road logistics and commodity exports since 2009.',
      'footer-services-title': 'Our Specialties',
      'footer-service1': 'River-Road Transport',
      'footer-service2': 'Cargo Distribution',
      'footer-service3': 'Warehousing & Logistics',
      'footer-service4': 'Export & Trade',
      'footer-company-title': 'Company',
      'footer-about': 'About Us',
      'footer-contact': 'Contact',
      'footer-careers': 'Work With Us',
      'footer-connect-title': 'Connect',
      'footer-copyright': '© 2026 JF Organização Trading. All rights reserved.',
      'chat-help': 'Need Help?',
      'chat-title': 'How can we help?',
      'chat-intro': 'Select an option below:',
      'chat-option-services': 'Learn about our services',
      'chat-option-quote': 'Request a quote',
      'chat-option-export': 'Export information',
      'chat-option-other': 'Other questions',
      'chat-whatsapp-btn': 'Continue on WhatsApp',
      'chat-back-btn': 'Back'
    },
    es: {
      'nav-home': 'Inicio',
      'nav-services': 'Servicios',
      'nav-coverage': 'Localidades',
      'nav-about': 'Sobre',
      'nav-contact': 'Contacto',
      'hero-title': 'Transporte, Logística y Exportación',
      'hero-subtitle': 'Soluciones Completas En Transporte RodoFluvial, Almacenamiento Y Operaciones De Exportación Para Su Empresa',
      'btn-services': 'Nuestros Servicios',
      'services-title': 'Nuestras Especialidades',
      'services-subtitle': 'Ofrecemos soluciones completas e integradas para atender todas las necesidades logísticas de su empresa',
      'coverage-title': 'Nuestras Localidades',
      'coverage-subtitle': 'Posicionamiento estratégico en puntos clave del territorio brasileño para atenderle mejor',
      'coverage-matriz': 'Sede',
      'coverage-filial': 'Sucursal',
      'location-manaus': 'Manaos',
      'location-amazonas': 'Amazonas',
      'location-desc1': 'Centro estratégico de operaciones',
      'location-desc2': 'Hub logístico de la región Norte',
      'location-desc3': 'Distribución rodofluvial',
      'location-boavista': 'Boa Vista',
      'location-roraima': 'Roraima',
      'branch-specialty1': 'Frontera internacional',
      'location-saoluis': 'São Luís',
      'location-maranhao': 'Maranhão',
      'branch-specialty2': 'Puerto y exportación',
      'location-cuiaba': 'Cuiabá',
      'location-matogrosso': 'Mato Grosso',
      'branch-specialty3': 'Centro-Oeste estratégico',
      'location-goiania': 'Goiânia',
      'location-goias': 'Goiás',
      'branch-specialty4': 'Conexión nacional',
      'whatsapp-cta-title': '¿Necesita un Presupuesto Rápido?',
      'whatsapp-cta-subtitle': '¡Hable directamente con nuestro equipo comercial por WhatsApp!',
      'whatsapp-btn-text': 'Hablar por WhatsApp Ahora',
      'badge-specialty': 'Especialidad',
      'badge-performance': 'Alto Rendimiento',
      'badge-infrastructure': 'Infraestructura',
      'badge-global': 'Global',
      'service1-title': 'Transporte RodoFluvial',
      'service1-desc': 'Combinamos lo mejor del transporte por carretera y fluvial para ofrecer soluciones logísticas completas y económicas, especialmente en la región amazónica.',
      'service1-feature1': 'Integración carretera y fluvial',
      'service1-feature2': 'Rutas optimizadas por el Amazonas',
      'service1-feature3': 'Rastreo en tiempo real',
      'service1-feature4': 'Capacidad para grandes volúmenes',
      'service2-title': 'Distribución de Cargas',
      'service2-desc': 'Gestión completa de la distribución de sus mercancías con eficiencia, seguridad y puntualidad en todo el territorio nacional.',
      'service2-feature1': 'Gestión de última milla',
      'service2-feature2': 'Flota moderna y diversificada',
      'service2-feature3': 'Entrega puntual garantizada',
      'service2-feature4': 'Seguro completo de cargas',
      'service3-title': 'Almacenamiento y Logística',
      'service3-desc': 'Centros de distribución estratégicos con tecnología de punta, control de temperatura y seguridad 24 horas para sus productos.',
      'service3-feature1': 'Almacenes climatizados',
      'service3-feature2': 'Sistema WMS integrado',
      'service3-feature3': 'Seguridad y monitoreo 24/7',
      'service3-feature4': 'Gestión inteligente de inventario',
      'service4-title': 'Exportación y Comercio Exterior',
      'service4-desc': 'Asesoría completa en comercio internacional, cuidando toda la documentación y procesos para llevar sus productos al mundo.',
      'service4-feature1': 'Agente aduanal propio',
      'service4-feature2': 'Gestión de documentación completa',
      'service4-feature3': 'Socios en más de 50 países',
      'service4-feature4': 'Consultoría en comercio exterior',
      'about-title': 'Sobre JF Organização Trading',
      'about-p1': 'Con años de experiencia en el mercado de logística y exportación, JF Organização Trading se ha consolidado como referencia en soluciones integradas de transporte rodofluvial y comercio exterior de commodities.',
      'about-p2': 'Nuestra experiencia combina lo mejor del transporte por carretera y fluvial, especialmente en la región amazónica, con operaciones complejas de exportación, siempre con foco en la excelencia operacional y satisfacción del cliente.',
      'about-p3': 'Actuamos con compromiso, transparencia y eficiencia, ofreciendo soluciones personalizadas que impulsan el crecimiento de nuestros socios comerciales.',
      'contact-title': 'Póngase en Contacto',
      'contact-form-title': 'Solicite su Presupuesto',
      'contact-form-subtitle': 'Póngase en contacto con nosotros y reciba atención personalizada para sus necesidades de exportación.',
      'whatsapp-commercial': 'WhatsApp - Comercial',
      'email-export-button': 'Email - Comercial Exportación',
      'contact-info-label': '📧 Contacto Comercial Exportación:',
      'commercial-label': 'Comercial',
      'footer-desc': 'Excelencia en logística rodofluvial y exportación de commodities desde 2009.',
      'footer-services-title': 'Nuestras Especialidades',
      'footer-service1': 'Transporte RodoFluvial',
      'footer-service2': 'Distribución de Cargas',
      'footer-service3': 'Almacenamiento y Logística',
      'footer-service4': 'Exportación y Comercio',
      'footer-company-title': 'Empresa',
      'footer-about': 'Sobre Nosotros',
      'footer-contact': 'Contacto',
      'footer-careers': 'Trabaje con Nosotros',
      'footer-connect-title': 'Conéctese',
      'footer-copyright': '© 2026 JF Organização Trading. Todos los derechos reservados.',
      'chat-help': '¿Necesita Ayuda?',
      'chat-title': '¿Cómo podemos ayudarle?',
      'chat-intro': 'Seleccione una opción abajo:',
      'chat-option-services': 'Conocer nuestros servicios',
      'chat-option-quote': 'Solicitar presupuesto',
      'chat-option-export': 'Información sobre exportación',
      'chat-option-other': 'Otras dudas',
      'chat-whatsapp-btn': 'Continuar en WhatsApp',
      'chat-back-btn': 'Volver'
    }
  };

  const t = (key) => translations[currentLang][key] || key;

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuOpen(false);
  };

  const selectOption = (option) => {
    const responses = {
      pt: {
        services: {
          title: '📦 Nossos Serviços',
          text: 'Oferecemos soluções completas em Transporte RodoFluvial, Distribuição de Cargas, Armazenagem e Exportação.',
          whatsappMsg: 'Olá! Gostaria de conhecer melhor os serviços da JF Organização.'
        },
        quote: {
          title: '💰 Solicitar Orçamento',
          text: 'Vamos elaborar um orçamento personalizado para sua empresa!',
          whatsappMsg: 'Olá! Gostaria de solicitar um orçamento.'
        },
        export: {
          title: '🌍 Exportação',
          text: 'Cuidamos de todo o processo de exportação com assessoria completa em comércio internacional.',
          whatsappMsg: 'Olá! Preciso de informações sobre exportação.'
        },
        other: {
          title: '❓ Outras Dúvidas',
          text: 'Nossa equipe está pronta para esclarecer suas dúvidas!',
          whatsappMsg: 'Olá! Tenho algumas dúvidas sobre os serviços.'
        }
      },
      en: {
        services: {
          title: '📦 Our Services',
          text: 'We offer complete solutions in River-Road Transport, Cargo Distribution, Warehousing and Export.',
          whatsappMsg: 'Hello! I would like to know more about JF Organização services.'
        },
        quote: {
          title: '💰 Request a Quote',
          text: 'We will prepare a personalized quote for your company!',
          whatsappMsg: 'Hello! I would like to request a quote.'
        },
        export: {
          title: '🌍 Export',
          text: 'We handle the entire export process with complete international trade advisory.',
          whatsappMsg: 'Hello! I need information about export services.'
        },
        other: {
          title: '❓ Other Questions',
          text: 'Our team is ready to answer your questions!',
          whatsappMsg: 'Hello! I have some questions about your services.'
        }
      },
      es: {
        services: {
          title: '📦 Nuestros Servicios',
          text: 'Ofrecemos soluciones completas en Transporte RodoFluvial, Distribución de Cargas, Almacenamiento y Exportación.',
          whatsappMsg: '¡Hola! Me gustaría conocer mejor los servicios de JF Organização.'
        },
        quote: {
          title: '💰 Solicitar Presupuesto',
          text: '¡Elaboraremos un presupuesto personalizado para su empresa!',
          whatsappMsg: '¡Hola! Me gustaría solicitar un presupuesto.'
        },
        export: {
          title: '🌍 Exportación',
          text: 'Cuidamos de todo el proceso de exportación con asesoría completa en comercio internacional.',
          whatsappMsg: '¡Hola! Necesito información sobre exportación.'
        },
        other: {
          title: '❓ Otras Dudas',
          text: '¡Nuestro equipo está listo para aclarar sus dudas!',
          whatsappMsg: '¡Hola! Tengo algunas dudas sobre los servicios.'
        }
      }
    };

    setChatResponse(responses[currentLang][option]);
  };

  const resetChat = () => {
    setChatResponse(null);
  };

  return (
    <div className="App">
      <header>
        <nav>
          <div className="logo" onClick={scrollToTop}>
            JF <span>Organização Trading</span>
          </div>
          <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <li><a onClick={scrollToTop} className="active">{t('nav-home')}</a></li>
            <li><a onClick={() => scrollToSection('servicos')}>{t('nav-services')}</a></li>
            <li><a onClick={() => scrollToSection('abrangencia')}>{t('nav-coverage')}</a></li>
            <li><a onClick={() => scrollToSection('sobre')}>{t('nav-about')}</a></li>
            <li><a onClick={() => scrollToSection('contato')}>{t('nav-contact')}</a></li>
          </ul>
          <div className="language-selector">
            <button 
              onClick={() => setCurrentLang('pt')} 
              className={currentLang === 'pt' ? 'active' : ''}
            >
              🇧🇷 PT
            </button>
            <button 
              onClick={() => setCurrentLang('en')} 
              className={currentLang === 'en' ? 'active' : ''}
            >
              🇺🇸 EN
            </button>
            <button 
              onClick={() => setCurrentLang('es')} 
              className={currentLang === 'es' ? 'active' : ''}
            >
              🇪🇸 ES
            </button>
          </div>
        </nav>
      </header>

      <section 
        className="hero hero-carousel"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.7), rgba(0, 102, 204, 0.7)), url(${heroImages[currentImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <h1>{t('hero-title')}</h1>
        <p>{t('hero-subtitle')}</p>
        <div className="cta-buttons">
          <a onClick={() => scrollToSection('servicos')} className="btn btn-secondary">
            {t('btn-services')}
          </a>
        </div>
      </section>

      <section className="services" id="servicos">
        <div className="container">
          <h2 className="section-title">{t('services-title')}</h2>
          <p className="section-subtitle">{t('services-subtitle')}</p>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-badge">{t('badge-specialty')}</div>
              <div className="service-card-content">
                <h3>{t('service1-title')}</h3>
                <p>{t('service1-desc')}</p>
                <ul className="service-features">
                  <li>{t('service1-feature1')}</li>
                  <li>{t('service1-feature2')}</li>
                  <li>{t('service1-feature3')}</li>
                  <li>{t('service1-feature4')}</li>
                </ul>
              </div>
            </div>

            <div className="service-card">
              <div className="service-badge">{t('badge-performance')}</div>
              <div className="service-card-content">
                <h3>{t('service2-title')}</h3>
                <p>{t('service2-desc')}</p>
                <ul className="service-features">
                  <li>{t('service2-feature1')}</li>
                  <li>{t('service2-feature2')}</li>
                  <li>{t('service2-feature3')}</li>
                  <li>{t('service2-feature4')}</li>
                </ul>
              </div>
            </div>

            <div className="service-card">
              <div className="service-badge">{t('badge-infrastructure')}</div>
              <div className="service-card-content">
                <h3>{t('service3-title')}</h3>
                <p>{t('service3-desc')}</p>
                <ul className="service-features">
                  <li>{t('service3-feature1')}</li>
                  <li>{t('service3-feature2')}</li>
                  <li>{t('service3-feature3')}</li>
                  <li>{t('service3-feature4')}</li>
                </ul>
              </div>
            </div>

            <div className="service-card">
              <div className="service-badge">{t('badge-global')}</div>
              <div className="service-card-content">
                <h3>{t('service4-title')}</h3>
                <p>{t('service4-desc')}</p>
                <ul className="service-features">
                  <li>{t('service4-feature1')}</li>
                  <li>{t('service4-feature2')}</li>
                  <li>{t('service4-feature3')}</li>
                  <li>{t('service4-feature4')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Localidades com Mapa - ESTILIZADA */}
      <section className="coverage-section" id="abrangencia">
        <div className="container">
          <h2 className="section-title">{t('coverage-title')}</h2>
          <p className="section-subtitle">{t('coverage-subtitle')}</p>
          
          <div className="coverage-content">
            <div className="coverage-info-enhanced">
              <div className="location-card-enhanced matriz-enhanced">
                <h3>{t('coverage-matriz')}</h3>
                <div className="location-details">
                  <p className="city-name">{t('location-manaus')}</p>
                  <p className="state-name">{t('location-amazonas')}</p>
                  <div className="location-description">
                    <p>🎯 {t('location-desc1')}</p>
                    <p>🚢 {t('location-desc2')}</p>
                    <p>📦 {t('location-desc3')}</p>
                  </div>
                </div>
              </div>

              <div className="branches-grid">
                <div className="location-card-enhanced branch-enhanced">
                  <h3>{t('location-boavista')}</h3>
                  <p className="state-badge">{t('location-roraima')}</p>
                  <p className="branch-specialty">{t('branch-specialty1')}</p>
                </div>

                <div className="location-card-enhanced branch-enhanced">
                  <h3>{t('location-saoluis')}</h3>
                  <p className="state-badge">{t('location-maranhao')}</p>
                  <p className="branch-specialty">{t('branch-specialty2')}</p>
                </div>

                <div className="location-card-enhanced branch-enhanced">
                  <h3>{t('location-cuiaba')}</h3>
                  <p className="state-badge">{t('location-matogrosso')}</p>
                  <p className="branch-specialty">{t('branch-specialty3')}</p>
                </div>

                <div className="location-card-enhanced branch-enhanced">
                  <h3>{t('location-goiania')}</h3>
                  <p className="state-badge">{t('location-goias')}</p>
                  <p className="branch-specialty">{t('branch-specialty4')}</p>
                </div>
              </div>

            </div>
            
            <div className="map-container-enhanced">
              <MapContainer 
                center={[-10.0, -52.0]} 
                zoom={4} 
                style={{ height: '600px', width: '100%', borderRadius: '15px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map((location, index) => (
                  <Marker 
                    key={index} 
                    position={location.coords}
                    icon={location.type === 'matriz' ? matrizIcon : filialIcon}
                  >
                    <Popup>
                      <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                        <strong style={{ fontSize: '1.2rem', color: location.type === 'matriz' ? '#dc2626' : '#2563eb', display: 'block', marginBottom: '0.5rem' }}>
                          {location.type === 'matriz' ? '🏢 ' : '🏪 '}
                          {location.name}
                        </strong>
                        <p style={{ margin: '0.3rem 0', color: '#666', fontSize: '0.95rem' }}>{location.state}</p>
                        <p style={{ margin: '0.5rem 0 0 0', color: '#888', fontSize: '0.85rem', fontStyle: 'italic' }}>
                          {location.type === 'matriz' ? 'Centro de Operações' : 'Filial Estratégica'}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </section>

      <section className="whatsapp-cta">
        <div className="container">
          <h3>{t('whatsapp-cta-title')}</h3>
          <p>{t('whatsapp-cta-subtitle')}</p>
          <a 
            href="https://wa.me/5592992091329?text=Olá,%20gostaria%20de%20solicitar%20um%20orçamento" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            <span style={{ fontSize: '1.8rem' }}>💬</span>
            <span>{t('whatsapp-btn-text')}</span>
          </a>
        </div>
      </section>

      <section className="about" id="sobre">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>{t('about-title')}</h2>
              <p>{t('about-p1')}</p>
              <p>{t('about-p2')}</p>
              <p>{t('about-p3')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact" id="contato">
        <div className="container">
          <h2 className="section-title">{t('contact-title')}</h2>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="contact-form">
              <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
                {t('contact-form-title')}
              </h3>
              <p style={{ marginBottom: '2rem', color: '#555', fontSize: '1.1rem' }}>
                {t('contact-form-subtitle')}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a 
                  href="https://wa.me/5592992091329?text=Olá,%20gostaria%20de%20solicitar%20um%20orçamento" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary" 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none' }}
                >
                  <span style={{ fontSize: '1.5rem' }}>💬</span>
                  <span>{t('whatsapp-commercial')}</span>
                </a>
                
                <a 
                  href="mailto:ventasjforganizacao@gmail.com" 
                  className="btn btn-secondary" 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', background: 'var(--secondary)', color: 'white' }}
                >
                  <span style={{ fontSize: '1.5rem' }}>✉️</span>
                  <span>{t('email-export-button')}</span>
                </a>
              </div>
              
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--light)', borderRadius: '10px', borderLeft: '4px solid var(--accent)' }}>
                <p style={{ color: '#555', marginBottom: '0.5rem' }}>
                  <strong>{t('contact-info-label')}</strong>
                </p>
                <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {t('commercial-label')}: +55 (92) 99209-1329<br />
                  Email: ventasjforganizacao@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>JF Organização Trading</h3>
            <p>{t('footer-desc')}</p>
          </div>
          <div className="footer-section">
            <h3>{t('footer-services-title')}</h3>
            <ul>
              <li><a onClick={() => scrollToSection('servicos')}>{t('footer-service1')}</a></li>
              <li><a onClick={() => scrollToSection('servicos')}>{t('footer-service2')}</a></li>
              <li><a onClick={() => scrollToSection('servicos')}>{t('footer-service3')}</a></li>
              <li><a onClick={() => scrollToSection('servicos')}>{t('footer-service4')}</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>{t('footer-company-title')}</h3>
            <ul>
              <li><a onClick={() => scrollToSection('sobre')}>{t('footer-about')}</a></li>
              <li><a onClick={() => scrollToSection('contato')}>{t('footer-contact')}</a></li>
              <li><a>{t('footer-careers')}</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>{t('footer-connect-title')}</h3>
            <ul>
              <li><a>LinkedIn</a></li>
              <li><a>Facebook</a></li>
              <li><a>Instagram</a></li>
              <li><a>WhatsApp Business</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t('footer-copyright')}</p>
        </div>
      </footer>

      {/* Chat Widget */}
      <div id="chat-widget">
        {!chatOpen ? (
          <button id="chat-button" onClick={() => setChatOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>{t('chat-help')}</span>
          </button>
        ) : (
          <div id="chat-box">
            <div style={{ background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '10px 10px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t('chat-title')}</h3>
              <button 
                onClick={() => { setChatOpen(false); resetChat(); }}
                style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', padding: 0, width: '30px', height: '30px' }}
              >
                &times;
              </button>
            </div>
            <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
              {!chatResponse ? (
                <>
                  <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                    {t('chat-intro')}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <button onClick={() => selectOption('services')} className="chat-option">
                      <span style={{ fontSize: '1.3rem', marginRight: '0.5rem' }}>📦</span>
                      <span>{t('chat-option-services')}</span>
                    </button>
                    <button onClick={() => selectOption('quote')} className="chat-option">
                      <span style={{ fontSize: '1.3rem', marginRight: '0.5rem' }}>💰</span>
                      <span>{t('chat-option-quote')}</span>
                    </button>
                    <button onClick={() => selectOption('export')} className="chat-option">
                      <span style={{ fontSize: '1.3rem', marginRight: '0.5rem' }}>🌍</span>
                      <span>{t('chat-option-export')}</span>
                    </button>
                    <button onClick={() => selectOption('other')} className="chat-option">
                      <span style={{ fontSize: '1.3rem', marginRight: '0.5rem' }}>❓</span>
                      <span>{t('chat-option-other')}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.2rem' }}>
                    {chatResponse.title}
                  </h4>
                  <p style={{ marginBottom: '2rem', color: '#555', lineHeight: '1.6' }}>
                    {chatResponse.text}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <a 
                      href={`https://wa.me/5592992091329?text=${encodeURIComponent(chatResponse.whatsappMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ background: '#25D366', color: 'white', padding: '1rem 1.5rem', borderRadius: '10px', textDecoration: 'none', textAlign: 'center', fontWeight: '600', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.3s' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>{t('chat-whatsapp-btn')}</span>
                    </a>
                    <button 
                      onClick={resetChat}
                      style={{ background: 'var(--light)', color: 'var(--dark)', padding: '0.9rem', borderRadius: '10px', border: '1px solid #ddd', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s' }}
                    >
                      ← <span>{t('chat-back-btn')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;