import React, { useState } from 'react';
import './App.css';
import backgroundImage from './assets/background.jpeg';
import image1 from './assets/1.jpeg';
import image2 from './assets/2.jpeg';
import image3 from './assets/3.jpeg';
import image4 from './assets/4.jpeg';
import logoImage from './assets/logo.jpeg';
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
  
  // Estados para o sistema de rastreamento
  const [showTracking, setShowTracking] = useState(false);
  const [trackingDocument, setTrackingDocument] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  
  // Estados para o sistema de login de funcionários
  const [showEmployeeLogin, setShowEmployeeLogin] = useState(false);
  const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState(false);
  const [employeeUsername, setEmployeeUsername] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [showEmployeePanel, setShowEmployeePanel] = useState(false);
  
  // Estados para gerenciamento de entregas (funcionários)
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      document: '12345678900',
      customerName: 'João Silva',
      product: 'Carga Geral - 500kg',
      origin: 'Manaus/AM',
      destination: 'São Paulo/SP',
      status: 'Em Trânsito',
      currentLocation: 'Goiânia/GO',
      estimatedDelivery: '15/02/2026',
      lastUpdate: '10/02/2026 14:30'
    },
    {
      id: 2,
      document: '98765432100',
      customerName: 'Maria Santos',
      product: 'Commodities - 2 toneladas',
      origin: 'Manaus/AM',
      destination: 'Boa Vista/RR',
      status: 'Entregue',
      currentLocation: 'Boa Vista/RR',
      estimatedDelivery: '08/02/2026',
      lastUpdate: '08/02/2026 16:45'
    },
    {
      id: 3,
      document: '12345678000190',
      customerName: 'Empresa ABC Ltda',
      product: 'Equipamentos - 1.5 toneladas',
      origin: 'São Luís/MA',
      destination: 'Cuiabá/MT',
      status: 'Aguardando Coleta',
      currentLocation: 'São Luís/MA',
      estimatedDelivery: '18/02/2026',
      lastUpdate: '10/02/2026 09:15'
    }
  ]);
  
  const [newDelivery, setNewDelivery] = useState({
    document: '',
    customerName: '',
    product: '',
    origin: '',
    destination: '',
    status: 'Aguardando Coleta',
    currentLocation: '',
    estimatedDelivery: ''
  });
  
  const [editingDelivery, setEditingDelivery] = useState(null);

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
      'nav-tracking': 'Rastrear Entrega',
      'nav-employee': 'Área do Funcionário',
      'nav-coverage': 'Localidade',
      'nav-about': 'Sobre',
      'nav-contact': 'Contato',
      'hero-title': 'Transporte, Logística & Exportação',
      'hero-subtitle': 'Soluções Completas Em Transporte RodoFluvial, Armazenagem E Operações De Exportação Para Sua Empresa',
      'btn-services': 'Nossos Serviços',
      'tracking-title': 'Rastrear Minha Entrega',
      'tracking-subtitle': 'Digite seu CPF ou CNPJ para acompanhar sua entrega',
      'tracking-placeholder': 'Digite seu CPF ou CNPJ',
      'tracking-button': 'Buscar Entrega',
      'tracking-not-found': 'Nenhuma entrega encontrada para este documento.',
      'employee-login-title': 'Login de Funcionário',
      'employee-username': 'Usuário',
      'employee-password': 'Senha',
      'employee-login-button': 'Entrar',
      'employee-logout-button': 'Sair',
      'employee-panel-title': 'Painel de Gerenciamento de Entregas',
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
      'nav-tracking': 'Track Delivery',
      'nav-employee': 'Employee Area',
      'nav-coverage': 'Locations',
      'nav-about': 'About',
      'nav-contact': 'Contact',
      'hero-title': 'Transport, Logistics & Export',
      'hero-subtitle': 'Complete Solutions In River-Road Transport, Warehousing And Export Operations For Your Company',
      'btn-services': 'Our Services',
      'tracking-title': 'Track My Delivery',
      'tracking-subtitle': 'Enter your CPF or CNPJ to track your delivery',
      'tracking-placeholder': 'Enter your CPF or CNPJ',
      'tracking-button': 'Search Delivery',
      'tracking-not-found': 'No delivery found for this document.',
      'employee-login-title': 'Employee Login',
      'employee-username': 'Username',
      'employee-password': 'Password',
      'employee-login-button': 'Login',
      'employee-logout-button': 'Logout',
      'employee-panel-title': 'Delivery Management Panel',
      'services-title': 'Our Specialties',
      'services-subtitle': 'We offer complete and integrated solutions to meet all your company\'s logistics needs'
    },
    es: {
      'nav-home': 'Inicio',
      'nav-services': 'Servicios',
      'nav-tracking': 'Rastrear Entrega',
      'nav-employee': 'Área del Empleado',
      'nav-coverage': 'Localidades',
      'nav-about': 'Sobre',
      'nav-contact': 'Contacto',
      'hero-title': 'Transporte, Logística y Exportación',
      'hero-subtitle': 'Soluciones Completas En Transporte RodoFluvial, Almacenamiento Y Operaciones De Exportación Para Su Empresa',
      'btn-services': 'Nuestros Servicios',
      'tracking-title': 'Rastrear Mi Entrega',
      'tracking-subtitle': 'Ingrese su CPF o CNPJ para rastrear su entrega',
      'tracking-placeholder': 'Ingrese su CPF o CNPJ',
      'tracking-button': 'Buscar Entrega',
      'tracking-not-found': 'No se encontró ninguna entrega para este documento.',
      'employee-login-title': 'Inicio de Sesión de Empleado',
      'employee-username': 'Usuario',
      'employee-password': 'Contraseña',
      'employee-login-button': 'Entrar',
      'employee-logout-button': 'Salir',
      'employee-panel-title': 'Panel de Gestión de Entregas',
      'services-title': 'Nuestras Especialidades',
      'services-subtitle': 'Ofrecemos soluciones completas e integradas para atender todas las necesidades logísticas de su empresa'
    }
  };

  const t = (key) => translations[currentLang][key] || key;

  // Função de rastreamento
  const handleTracking = (e) => {
    e.preventDefault();
    const cleanDocument = trackingDocument.replace(/\D/g, '');
    const found = deliveries.find(d => d.document === cleanDocument);
    setTrackingResult(found || 'not-found');
  };

  // Função de login de funcionário
  const handleEmployeeLogin = (e) => {
    e.preventDefault();
    // Credenciais simples (em produção, usar autenticação real)
    if (employeeUsername === 'admin' && employeePassword === 'jf2026') {
      setIsEmployeeLoggedIn(true);
      setShowEmployeeLogin(false);
      setShowEmployeePanel(true);
      setEmployeeUsername('');
      setEmployeePassword('');
    } else {
      alert('Usuário ou senha incorretos!');
    }
  };

  // Função para adicionar nova entrega
  const handleAddDelivery = (e) => {
    e.preventDefault();
    const newId = deliveries.length > 0 ? Math.max(...deliveries.map(d => d.id)) + 1 : 1;
    const now = new Date().toLocaleString('pt-BR');
    setDeliveries([...deliveries, {
      ...newDelivery,
      id: newId,
      lastUpdate: now
    }]);
    setNewDelivery({
      document: '',
      customerName: '',
      product: '',
      origin: '',
      destination: '',
      status: 'Aguardando Coleta',
      currentLocation: '',
      estimatedDelivery: ''
    });
  };

  // Função para atualizar entrega
  const handleUpdateDelivery = (id) => {
    const now = new Date().toLocaleString('pt-BR');
    setDeliveries(deliveries.map(d => 
      d.id === id ? { ...editingDelivery, lastUpdate: now } : d
    ));
    setEditingDelivery(null);
  };

  // Função para deletar entrega
  const handleDeleteDelivery = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta entrega?')) {
      setDeliveries(deliveries.filter(d => d.id !== id));
    }
  };

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
      }
    };

    setChatResponse(responses[currentLang][option]);
  };

  const resetChat = () => {
    setChatResponse(null);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Entregue': return '#22c55e';
      case 'Em Trânsito': return '#3b82f6';
      case 'Aguardando Coleta': return '#f59e0b';
      default: return '#6b7280';
    }
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
            <li>
              <a 
                href="https://wa.me/5592992091329?text=Olá!%20Gostaria%20de%20conhecer%20os%20serviços%20da%20JF%20Organização%20Trading%20e%20possivelmente%20fechar%20um%20orçamento.%20Podem%20me%20passar%20mais%20informações?" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                {t('nav-services')}
              </a>
            </li>
            <li>
              <a onClick={() => {
                setShowTracking(true);
                setShowEmployeePanel(false);
                setMenuOpen(false);
              }}>
                {t('nav-tracking')}
              </a>
            </li>
            <li>
              <a onClick={() => {
                if (!isEmployeeLoggedIn) {
                  setShowEmployeeLogin(true);
                  setShowTracking(false);
                } else {
                  setShowEmployeePanel(true);
                  setShowTracking(false);
                }
                setMenuOpen(false);
              }}>
                {t('nav-employee')}
              </a>
            </li>
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

      {/* Modal de Rastreamento */}
      {showTracking && (
        <div className="modal-overlay" onClick={() => {
          setShowTracking(false);
          setTrackingResult(null);
          setTrackingDocument('');
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => {
              setShowTracking(false);
              setTrackingResult(null);
              setTrackingDocument('');
            }}>×</button>
            
            <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
              {t('tracking-title')}
            </h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              {t('tracking-subtitle')}
            </p>

            <form onSubmit={handleTracking} style={{ marginBottom: '2rem' }}>
              <input
                type="text"
                value={trackingDocument}
                onChange={(e) => setTrackingDocument(e.target.value)}
                placeholder={t('tracking-placeholder')}
                className="tracking-input"
                required
              />
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                🔍 {t('tracking-button')}
              </button>
            </form>

            {trackingResult === 'not-found' && (
              <div className="alert alert-warning">
                ⚠️ {t('tracking-not-found')}
              </div>
            )}

            {trackingResult && trackingResult !== 'not-found' && (
              <div className="tracking-result">
                <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px', marginBottom: '1rem' }}>
                  <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
                    📦 {trackingResult.customerName}
                  </h3>
                  <div style={{ display: 'grid', gap: '0.8rem' }}>
                    <p><strong>Produto:</strong> {trackingResult.product}</p>
                    <p><strong>Origem:</strong> {trackingResult.origin}</p>
                    <p><strong>Destino:</strong> {trackingResult.destination}</p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span style={{ 
                        color: getStatusColor(trackingResult.status),
                        fontWeight: 'bold'
                      }}>
                        {trackingResult.status}
                      </span>
                    </p>
                    <p><strong>Localização Atual:</strong> {trackingResult.currentLocation}</p>
                    <p><strong>Previsão de Entrega:</strong> {trackingResult.estimatedDelivery}</p>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                      <em>Última atualização: {trackingResult.lastUpdate}</em>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Login de Funcionário */}
      {showEmployeeLogin && !isEmployeeLoggedIn && (
        <div className="modal-overlay" onClick={() => setShowEmployeeLogin(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <button className="modal-close" onClick={() => setShowEmployeeLogin(false)}>×</button>
            
            <h2 style={{ color: 'var(--primary)', marginBottom: '2rem', textAlign: 'center' }}>
              🔐 {t('employee-login-title')}
            </h2>

            <form onSubmit={handleEmployeeLogin}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  {t('employee-username')}
                </label>
                <input
                  type="text"
                  value={employeeUsername}
                  onChange={(e) => setEmployeeUsername(e.target.value)}
                  className="tracking-input"
                  required
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  {t('employee-password')}
                </label>
                <input
                  type="password"
                  value={employeePassword}
                  onChange={(e) => setEmployeePassword(e.target.value)}
                  className="tracking-input"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {t('employee-login-button')}
              </button>
            </form>
            
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666', textAlign: 'center' }}>
              Credenciais de teste: admin / jf2026
            </p>
          </div>
        </div>
      )}

      {/* Painel de Gerenciamento de Funcionário */}
      {showEmployeePanel && isEmployeeLoggedIn && (
        <div className="modal-overlay">
          <div className="modal-content employee-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ color: 'var(--primary)', margin: 0 }}>
                📊 {t('employee-panel-title')}
              </h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowEmployeePanel(false)}
                >
                  Minimizar
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setIsEmployeeLoggedIn(false);
                    setShowEmployeePanel(false);
                  }}
                >
                  {t('employee-logout-button')}
                </button>
              </div>
            </div>

            {/* Formulário de Nova Entrega */}
            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>➕ Adicionar Nova Entrega</h3>
              <form onSubmit={handleAddDelivery}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  <input
                    type="text"
                    placeholder="CPF/CNPJ (apenas números)"
                    value={newDelivery.document}
                    onChange={(e) => setNewDelivery({...newDelivery, document: e.target.value})}
                    className="tracking-input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Nome do Cliente"
                    value={newDelivery.customerName}
                    onChange={(e) => setNewDelivery({...newDelivery, customerName: e.target.value})}
                    className="tracking-input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Produto"
                    value={newDelivery.product}
                    onChange={(e) => setNewDelivery({...newDelivery, product: e.target.value})}
                    className="tracking-input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Origem"
                    value={newDelivery.origin}
                    onChange={(e) => setNewDelivery({...newDelivery, origin: e.target.value})}
                    className="tracking-input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Destino"
                    value={newDelivery.destination}
                    onChange={(e) => setNewDelivery({...newDelivery, destination: e.target.value})}
                    className="tracking-input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Localização Atual"
                    value={newDelivery.currentLocation}
                    onChange={(e) => setNewDelivery({...newDelivery, currentLocation: e.target.value})}
                    className="tracking-input"
                    required
                  />
                  <select
                    value={newDelivery.status}
                    onChange={(e) => setNewDelivery({...newDelivery, status: e.target.value})}
                    className="tracking-input"
                    required
                  >
                    <option value="Aguardando Coleta">Aguardando Coleta</option>
                    <option value="Em Trânsito">Em Trânsito</option>
                    <option value="Entregue">Entregue</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Previsão Entrega (DD/MM/AAAA)"
                    value={newDelivery.estimatedDelivery}
                    onChange={(e) => setNewDelivery({...newDelivery, estimatedDelivery: e.target.value})}
                    className="tracking-input"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  ✅ Adicionar Entrega
                </button>
              </form>
            </div>

            {/* Lista de Entregas */}
            <div>
              <h3 style={{ marginBottom: '1rem' }}>📋 Entregas Cadastradas ({deliveries.length})</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {deliveries.map(delivery => (
                  <div key={delivery.id} style={{ 
                    background: 'white', 
                    padding: '1.5rem', 
                    borderRadius: '10px',
                    border: '2px solid #e5e7eb'
                  }}>
                    {editingDelivery?.id === delivery.id ? (
                      // Modo de Edição
                      <div>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>✏️ Editando Entrega #{delivery.id}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                          <input
                            type="text"
                            value={editingDelivery.document}
                            onChange={(e) => setEditingDelivery({...editingDelivery, document: e.target.value})}
                            className="tracking-input"
                            placeholder="CPF/CNPJ"
                          />
                          <input
                            type="text"
                            value={editingDelivery.customerName}
                            onChange={(e) => setEditingDelivery({...editingDelivery, customerName: e.target.value})}
                            className="tracking-input"
                            placeholder="Nome do Cliente"
                          />
                          <input
                            type="text"
                            value={editingDelivery.product}
                            onChange={(e) => setEditingDelivery({...editingDelivery, product: e.target.value})}
                            className="tracking-input"
                            placeholder="Produto"
                          />
                          <input
                            type="text"
                            value={editingDelivery.currentLocation}
                            onChange={(e) => setEditingDelivery({...editingDelivery, currentLocation: e.target.value})}
                            className="tracking-input"
                            placeholder="Localização Atual"
                          />
                          <select
                            value={editingDelivery.status}
                            onChange={(e) => setEditingDelivery({...editingDelivery, status: e.target.value})}
                            className="tracking-input"
                          >
                            <option value="Aguardando Coleta">Aguardando Coleta</option>
                            <option value="Em Trânsito">Em Trânsito</option>
                            <option value="Entregue">Entregue</option>
                          </select>
                          <input
                            type="text"
                            value={editingDelivery.estimatedDelivery}
                            onChange={(e) => setEditingDelivery({...editingDelivery, estimatedDelivery: e.target.value})}
                            className="tracking-input"
                            placeholder="Previsão Entrega"
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                          <button 
                            className="btn btn-primary"
                            onClick={() => handleUpdateDelivery(delivery.id)}
                          >
                            💾 Salvar
                          </button>
                          <button 
                            className="btn btn-secondary"
                            onClick={() => setEditingDelivery(null)}
                          >
                            ❌ Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Modo de Visualização
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                          <div>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
                              {delivery.customerName}
                            </h4>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>
                              CPF/CNPJ: {delivery.document}
                            </p>
                          </div>
                          <span style={{
                            padding: '0.3rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            color: 'white',
                            background: getStatusColor(delivery.status)
                          }}>
                            {delivery.status}
                          </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem', marginBottom: '1rem' }}>
                          <p><strong>Produto:</strong> {delivery.product}</p>
                          <p><strong>Origem:</strong> {delivery.origin}</p>
                          <p><strong>Destino:</strong> {delivery.destination}</p>
                          <p><strong>Localização:</strong> {delivery.currentLocation}</p>
                          <p><strong>Previsão:</strong> {delivery.estimatedDelivery}</p>
                          <p style={{ fontSize: '0.85rem', color: '#666' }}>
                            <em>Atualizado: {delivery.lastUpdate}</em>
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn btn-primary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            onClick={() => setEditingDelivery(delivery)}
                          >
                            ✏️ Editar
                          </button>
                          <button 
                            className="btn"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: '#ef4444', color: 'white' }}
                            onClick={() => handleDeleteDelivery(delivery.id)}
                          >
                            🗑️ Excluir
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <section 
        className="hero"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.7), rgba(0, 102, 204, 0.7)), url(${image2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <h1>{t('hero-title')}</h1>
        <p>{t('hero-subtitle')}</p>
        <div className="cta-buttons">
          <a 
            href="https://wa.me/5592992091329?text=Olá!%20Gostaria%20de%20conhecer%20os%20serviços%20da%20JF%20Organização%20Trading%20e%20possivelmente%20fechar%20um%20orçamento.%20Podem%20me%20passar%20mais%20informações?" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            {t('btn-services')}
          </a>
        </div>
      </section>

      <section className="services" id="servicos">
        <div className="container">
          <h2 className="section-title">{t('services-title')}</h2>
          <p className="section-subtitle">{t('services-subtitle')}</p>
          
          <div className="services-grid">
            <div className="service-card" style={{
              backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.85), rgba(0, 102, 204, 0.85)), url(${image1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="service-card-content">
                <h3 style={{ color: 'white' }}>{t('service1-title')}</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('service1-desc')}</p>
                <ul className="service-features">
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{t('service1-feature1')}</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{t('service1-feature2')}</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{t('service1-feature3')}</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{t('service1-feature4')}</li>
                </ul>
              </div>
            </div>

            <div className="service-card" style={{
              backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.85), rgba(0, 102, 204, 0.85)), url(${image4})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="service-card-content">
                <h3 style={{ color: 'white' }}>{t('service2-title')}</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('service2-desc')}</p>
                <ul className="service-features">
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{t('service2-feature1')}</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{t('service2-feature2')}</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{t('service2-feature3')}</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{t('service2-feature4')}</li>
                </ul>
              </div>
            </div>

            <div className="service-card" style={{
              backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.85), rgba(0, 102, 204, 0.85)), url(${image3})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="service-card-content">
                <h3 style={{ color: 'white' }}>{t('service3-title')}</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('service3-desc')}</p>
                <ul className="service-features">
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{t('service3-feature1')}</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{t('service3-feature2')}</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{t('service3-feature3')}</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{t('service3-feature4')}</li>
                </ul>
              </div>
            </div>

            <div className="service-card" style={{
              backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.85), rgba(0, 102, 204, 0.85)), url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="service-card-content">
                <h3 style={{ color: 'white' }}>{t('service4-title')}</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('service4-desc')}</p>
                <ul className="service-features">
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{t('service4-feature1')}</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{t('service4-feature2')}</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{t('service4-feature3')}</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{t('service4-feature4')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      <footer style={{
        backgroundImage: `linear-gradient(rgba(26, 26, 26, 0.95), rgba(26, 26, 26, 0.95)), url(${logoImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="footer-content">
          <div className="footer-section">
            <h3>JF Organização Trading</h3>
            <p>{t('footer-desc')}</p>
          </div>
          <div className="footer-section">
            <h3>{t('footer-services-title')}</h3>
            <ul>
              <li>
                <a 
                  href="https://wa.me/5592992091329?text=Olá!%20Gostaria%20de%20conhecer%20os%20serviços%20da%20JF%20Organização%20Trading%20e%20possivelmente%20fechar%20um%20orçamento.%20Podem%20me%20passar%20mais%20informações?" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {t('footer-service1')}
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/5592992091329?text=Olá!%20Gostaria%20de%20conhecer%20os%20serviços%20da%20JF%20Organização%20Trading%20e%20possivelmente%20fechar%20um%20orçamento.%20Podem%20me%20passar%20mais%20informações?" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {t('footer-service2')}
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/5592992091329?text=Olá!%20Gostaria%20de%20conhecer%20os%20serviços%20da%20JF%20Organização%20Trading%20e%20possivelmente%20fechar%20um%20orçamento.%20Podem%20me%20passar%20mais%20informações?" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {t('footer-service3')}
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/5592992091329?text=Olá!%20Gostaria%20de%20conhecer%20os%20serviços%20da%20JF%20Organização%20Trading%20e%20possivelmente%20fechar%20um%20orçamento.%20Podem%20me%20passar%20mais%20informações?" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {t('footer-service4')}
                </a>
              </li>
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