import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import backgroundImage from './assets/background.jpeg';
import image1 from './assets/1.jpeg';
import image2 from './assets/2.jpeg';
import image3 from './assets/3.jpeg';
import image4 from './assets/4.jpeg';
import image5 from './assets/5.jpeg';
import logoImage from './assets/logo.jpeg';
import linkedinIcon from './assets/linkedin.webp';
import instagramIcon from './assets/instagram.webp';
import facebookIcon from './assets/facebook.webp';
import whatsappIcon from './assets/whatsapp.webp';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// rss2json.com converte RSS em JSON — sem CORS, funciona em produção e local
const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url=';

const RSS_FEEDS = [
  { url: 'https://www.cnt.org.br/rss/noticias',                           label: '🚛 Transporte',        cor: '#003366' },
  { url: 'https://www.canalrural.com.br/feed/',                           label: '🌾 Agro & Exportação', cor: '#2e7d32' },
  { url: 'https://www.comexdobrasil.com/rss/',                            label: '📦 Comércio Exterior', cor: '#1565c0' },
  { url: 'https://g1.globo.com/rss/g1/amazonas/',                         label: '🛣️ BR-319 & AM',       cor: '#bf6900' },
  { url: 'https://portal.inmet.gov.br/feed',                              label: '🌊 Clima & Rios',      cor: '#0277bd' },
  { url: 'https://www.gov.br/receitafederal/pt-br/assuntos/noticias/rss', label: '🛃 Fronteiras',        cor: '#6a1b9a' },
];

async function parseRSS(feedUrl) {
  const resp = await fetch(RSS2JSON + encodeURIComponent(feedUrl), {
    signal: AbortSignal.timeout(10000),
  });
  const data = await resp.json();
  if (!data.items || data.status === 'error') return [];
  return data.items.slice(0, 5).map(item => ({
    titulo: item.title  || '',
    link:   item.link   || '#',
  })).filter(item => item.titulo);
}

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatResponse, setChatResponse] = useState(null);

  // ── Carrossel de notícias ──
  const [noticias, setNoticias]       = useState([]);
  const [carrosselIdx, setCarrosselIdx] = useState(0);
  const carrosselRef = useRef(null);

  useEffect(() => {
    async function carregarNoticias() {
      let todas = [];
      for (const feed of RSS_FEEDS) {
        try {
          const itens = await parseRSS(feed.url);
          itens.forEach(item => todas.push({ ...item, label: feed.label, cor: feed.cor }));
        } catch (e) {
          console.warn('Erro no feed:', feed.url);
        }
      }
      // embaralha para misturar as fontes
      todas.sort(() => Math.random() - 0.5);
      setNoticias(todas);
    }
    carregarNoticias();
    const reload = setInterval(carregarNoticias, 15 * 60 * 1000);
    return () => clearInterval(reload);
  }, []);

  useEffect(() => {
    if (noticias.length === 0) return;
    const timer = setInterval(() => {
      setCarrosselIdx(idx => (idx + 1) % noticias.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [noticias]);

  // Localização das filiais
  const locations = [
    { name: 'Matriz - Manaus', coords: [-3.1190, -60.0217], type: 'matriz', state: 'Amazonas' },
    { name: 'Filial - Pacaraima / Santa Elena VNZ', coords: [4.4862, -61.1358], type: 'filial', state: 'Roraima' },
    { name: 'Filial - Codó', coords: [-4.4868, -43.8986], type: 'filial', state: 'Maranhão' },
    { name: 'Filial - Campo Novo', coords: [-13.6556, -57.9021], type: 'filial', state: 'Mato Grosso' },
    { name: 'Filial - Goiânia', coords: [-16.6869, -49.2648], type: 'filial', state: 'Goiás' }
  ];

  // WhatsApp numbers e messages por serviço
  const serviceWhatsApp = {
    service1: { number: '5592992091329', msg: 'Olá! Tenho interesse no serviço de *Transporte RodoFluvial* da JF Organização Trading. Podem me passar mais informações?' },
    service2: { number: '559291910173',  msg: 'Olá! Tenho interesse no serviço de *Distribuição de Cargas* da JF Organização Trading. Podem me passar mais informações?' },
    service3: { number: '559294667456',  msg: 'Olá! Tenho interesse no serviço de *Armazenagem & Logística* da JF Organização Trading. Podem me passar mais informações?' },
    service4: { number: '5592992091329', msg: 'Olá! Tenho interesse no serviço de *Exportação & Comércio Exterior* da JF Organização Trading. Podem me passar mais informações?' },
    service5: { number: '5592992091329', msg: 'Olá! Tenho interesse no serviço de *Transporte Internacional* da JF Organização Trading. Podem me passar mais informações?' },
  };

  const waLink = (service) =>
    `https://wa.me/${serviceWhatsApp[service].number}?text=${encodeURIComponent(serviceWhatsApp[service].msg)}`;

  const scrollToServices = () => {
    const section = document.getElementById('servicos');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMenuOpen(false);
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
    };

    setChatResponse(responses[option]);
  };

  const resetChat = () => {
    setChatResponse(null);
  };

  return (
    <div className="App">
      <header>
        <nav>
          <div className="logo" onClick={scrollToTop}>
            <img src={logoImage} alt="JF Organização Trading" className="logo-img" />
            JF Organização Trading
          </div>
          <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <li><a onClick={scrollToTop} className="active">Início</a></li>
            <li><a onClick={scrollToServices}>Serviços</a></li>
            <li><a onClick={() => scrollToSection('abrangencia')}>Onde estamos</a></li>
            <li><a onClick={() => scrollToSection('sobre')}>Sobre</a></li>
            <li><a onClick={() => scrollToSection('contato')}>Contato</a></li>
          </ul>
          <div className="social-icons">
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-link" title="LinkedIn">
              <img src={linkedinIcon} alt="LinkedIn" />
            </a>
            <a href="https://www.instagram.com/jforganizacao?igsh=MTh2cDk0Z2kzcmlzbg==" target="_blank" rel="noopener noreferrer" className="social-icon-link" title="Instagram">
              <img src={instagramIcon} alt="Instagram" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-link" title="Facebook">
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a href="https://wa.me/5592992091329" target="_blank" rel="noopener noreferrer" className="social-icon-link" title="WhatsApp">
              <img src={whatsappIcon} alt="WhatsApp" />
            </a>
          </div>
        </nav>
      </header>

      <section
        className="hero"
        style={{
          backgroundImage: `url(${image2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <h1>Transporte, Logística & Exportação</h1>
        <p>Soluções Completas Em Transporte RodoFluvial, Armazenagem E Operações De Exportação Para Sua Empresa</p>
      </section>

      {/* ── Banner de Notícias ── */}
      {noticias.length > 0 && (
        <div className="noticias-banner">
          <span className="noticias-banner-tag">📰 Notícias</span>
          <div className="noticias-banner-track" ref={carrosselRef}>
            <a
              href={noticias[carrosselIdx].link}
              target="_blank"
              rel="noopener noreferrer"
              className="noticias-banner-item"
              key={carrosselIdx}
            >
              <span className="noticias-banner-badge" style={{ background: noticias[carrosselIdx].cor }}>
                {noticias[carrosselIdx].label}
              </span>
              <span className="noticias-banner-titulo">{noticias[carrosselIdx].titulo}</span>
              <span className="noticias-banner-seta">→</span>
            </a>
          </div>
          <div className="noticias-banner-dots">
            {noticias.map((_, i) => (
              <button
                key={i}
                className={`noticias-dot ${i === carrosselIdx ? 'ativo' : ''}`}
                onClick={() => setCarrosselIdx(i)}
                aria-label={`Notícia ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      <section className="services" id="servicos">
        <div className="container">
          <h2 className="section-title">Nossas Especialidades</h2>
          <p className="section-subtitle">Oferecemos soluções completas e integradas para atender todas as necessidades logísticas da sua empresa</p>

          <div className="services-grid">
            <div className="service-card" style={{
              backgroundImage: `linear-gradient(rgba(0, 20, 60, 0.30), rgba(0, 70, 150, 0.30)), url(${image1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="service-card-content">
                <h3 style={{ color: 'white' }}>Transporte RodoFluvial</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Combinamos o melhor do transporte rodoviário e fluvial para oferecer soluções logísticas completas e econômicas, especialmente na região amazônica.</p>
                <ul className="service-features">
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Integração rodoviária e fluvial</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Rotas otimizadas pela Amazônia</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Rastreamento em tempo real</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Capacidade para grandes volumes</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Logística multimodal</li>
                </ul>
                <a href={waLink('service1')} target="_blank" rel="noopener noreferrer" className="service-whatsapp-btn">
                  💬 Falar com especialista
                </a>
              </div>
            </div>

            <div className="service-card" style={{
              backgroundImage: `linear-gradient(rgba(0, 20, 60, 0.30), rgba(0, 70, 150, 0.30)), url(${image4})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="service-card-content">
                <h3 style={{ color: 'white' }}>Distribuição de Cargas</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Gerenciamento completo da distribuição de suas mercadorias com eficiência, segurança e pontualidade em todo território nacional.</p>
                <ul className="service-features">
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Cargas seguradas</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Frota moderna e diversificada</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Pessoal habilitado</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Entrega pontual garantida</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Logística multimodal</li>
                </ul>
                <a href={waLink('service2')} target="_blank" rel="noopener noreferrer" className="service-whatsapp-btn">
                  💬 Falar com especialista
                </a>
              </div>
            </div>

            <div className="service-card" style={{
              backgroundImage: `linear-gradient(rgba(0, 20, 60, 0.30), rgba(0, 70, 150, 0.30)), url(${image3})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="service-card-content">
                <h3 style={{ color: 'white' }}>Armazenagem & Logística</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Centros de distribuição estratégicos com tecnologia de ponta e segurança 24 horas para seus produtos.</p>
                <ul className="service-features">
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Operação Multiflexível</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Gestão de estoque</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Segurança e monitoramento integrado</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Serviço Crossdocking</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Logística multimodal</li>
                </ul>
                <a href={waLink('service3')} target="_blank" rel="noopener noreferrer" className="service-whatsapp-btn">
                  💬 Falar com especialista
                </a>
              </div>
            </div>

            <div className="service-card" style={{
              backgroundImage: `linear-gradient(rgba(0, 20, 60, 0.30), rgba(0, 70, 150, 0.30)), url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="service-card-content">
                <h3 style={{ color: 'white' }}>Exportação & Comércio Exterior</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Assessoria completa em comércio internacional, cuidando de toda documentação e processos para levar seus produtos ao mundo.</p>
                <ul className="service-features">
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Despachante aduaneiro eficiente</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Gestão de documentação completa</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Parceiros em diversos países</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Consultoria em comércio exterior</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Logística multimodal</li>
                </ul>
                <a href={waLink('service4')} target="_blank" rel="noopener noreferrer" className="service-whatsapp-btn">
                  💬 Falar com especialista
                </a>
              </div>
            </div>

            <div className="service-card" style={{
              backgroundImage: `linear-gradient(rgba(0, 20, 60, 0.30), rgba(0, 70, 150, 0.30)), url(${image5})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="service-card-content">
                <h3 style={{ color: 'white' }}>Transporte Internacional</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Oferecemos uma solução completa de frete internacional: coleta, despacho de exportação, transporte marítimo e rodoviário, além de seguro integrado. Você foca no seu negócio, nós cuidamos de toda a logística e das formalidades legais.</p>
                <ul className="service-features">
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Brasil → Venezuela</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Brasil → Guiana</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Venezuela → Brasil</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Guiana → Brasil</li>
                  <li style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Logística multimodal</li>
                </ul>
                <a href={waLink('service5')} target="_blank" rel="noopener noreferrer" className="service-whatsapp-btn">
                  💬 Falar com especialista
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="coverage-section" id="abrangencia">
        <div className="container">
          <h2 className="section-title">Onde Estamos</h2>
          <p className="section-subtitle">Posicionamento estratégico em pontos-chave do território brasileiro para atender melhor você</p>

          <div className="coverage-content">
            <div className="coverage-info-enhanced">
              <div className="location-card-enhanced matriz-enhanced">
                <h3>Matriz</h3>
                <div className="location-details">
                  <p className="city-name">Manaus</p>
                  <p className="state-name">Amazonas</p>
                  <div className="location-description">
                    <p>🎯 Centro estratégico de operações</p>
                    <p>🚢 Hub logístico da região Norte</p>
                    <p>📦 Distribuição rodofluvial</p>
                  </div>
                </div>
              </div>

              <div className="branches-grid">
                <div className="location-card-enhanced branch-enhanced">
                  <h3>Pacaraima</h3>
                  <p className="state-badge">Roraima</p>
                  <p className="branch-specialty">Fronteira Internacional Brasil - Venezuela</p>
                </div>
                <div className="location-card-enhanced branch-enhanced">
                  <h3>Codó</h3>
                  <p className="state-badge">Maranhão</p>
                  <p className="branch-specialty">Porto e exportação</p>
                </div>
                <div className="location-card-enhanced branch-enhanced">
                  <h3>Campo Novo</h3>
                  <p className="state-badge">Mato Grosso</p>
                  <p className="branch-specialty">Centro-Oeste estratégico</p>
                </div>
                <div className="location-card-enhanced branch-enhanced">
                  <h3>Goiânia</h3>
                  <p className="state-badge">Goiás</p>
                  <p className="branch-specialty">Conexão nacional</p>
                </div>
              </div>
            </div>

            <div className="map-container-enhanced">
              <MapContainer
                center={[-10.0, -52.0]}
                zoom={4}
                style={{ height: '100%', minHeight: '600px', width: '100%', borderRadius: '15px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}
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
                        <strong style={{ fontSize: '1.1rem', color: location.type === 'matriz' ? '#dc2626' : '#2563eb', display: 'block', marginBottom: '0.5rem' }}>
                          {location.type === 'matriz' ? '🏢 ' : '🏪 '}
                          {location.name}
                        </strong>
                        <p style={{ margin: '0.3rem 0', color: '#666', fontSize: '0.9rem' }}>{location.state}</p>
                        <p style={{ margin: '0.5rem 0 0 0', color: '#888', fontSize: '0.8rem', fontStyle: 'italic' }}>
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
          <h3>Precisa de um Orçamento Rápido?</h3>
          <p>Fale diretamente com nossa equipe comercial pelo WhatsApp!</p>
          <a
            href="https://wa.me/5592992091329?text=Olá,%20gostaria%20de%20solicitar%20um%20orçamento"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            <span style={{ fontSize: '1.8rem' }}>💬</span>
            <span>Falar no WhatsApp Agora</span>
          </a>
        </div>
      </section>

      <section className="about" id="sobre">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Sobre a JF Organização Trading</h2>
              <p>Com anos de experiência no mercado de logística e exportação, a JF Organização Trading se consolidou como referência em soluções integradas de transporte rodofluvial e comércio exterior de commodities.</p>
              <p>Nossa expertise combina o melhor do transporte rodoviário e fluvial, especialmente na região amazônica, com operações complexas de exportação, sempre com foco na excelência operacional e satisfação do cliente.</p>
              <p>Atuamos com compromisso, transparência e eficiência, oferecendo soluções personalizadas que impulsionam o crescimento dos nossos parceiros comerciais.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact" id="contato">
        <div className="container">
          <h2 className="section-title">Entre em Contato</h2>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="contact-form">
              <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
                Solicite seu Orçamento
              </h3>
              <p style={{ marginBottom: '2rem', color: '#555', fontSize: '1.1rem' }}>
                Entre em contato conosco e receba atendimento personalizado para suas necessidades de exportação.
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
                  <span>WhatsApp - Comercial</span>
                </a>

                <a
                  href="mailto:export@jforganizacao.com.br"
                  className="btn btn-secondary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', background: 'var(--secondary)', color: 'white' }}
                >
                  <span style={{ fontSize: '1.5rem' }}>✉️</span>
                  <span>Email - Comercial Exportação</span>
                </a>
              </div>

              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--light)', borderRadius: '10px', borderLeft: '4px solid var(--accent)' }}>
                <p style={{ color: '#555', marginBottom: '0.5rem' }}>
                  <strong>📧 Contato Comercial Exportação:</strong>
                </p>
                <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  Comercial: +55 (92) 99209-1329<br />
                  Email: export@jforganizacao.com.br
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{
        backgroundImage: `url(${logoImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="footer-content">
          <div className="footer-section">
            <h3>JF Organização Trading</h3>
            <p>Excelência em logística rodofluvial e exportação de commodities desde 2009.</p>
          </div>
          <div className="footer-section">
            <h3>Nossas Especialidades</h3>
            <ul>
              <li><a href={waLink('service1')} target="_blank" rel="noopener noreferrer">Transporte RodoFluvial</a></li>
              <li><a href={waLink('service2')} target="_blank" rel="noopener noreferrer">Distribuição de Cargas</a></li>
              <li><a href={waLink('service3')} target="_blank" rel="noopener noreferrer">Armazenagem & Logística</a></li>
              <li><a href={waLink('service4')} target="_blank" rel="noopener noreferrer">Exportação & Comércio</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Empresa</h3>
            <ul>
              <li><a onClick={() => scrollToSection('sobre')}>Sobre Nós</a></li>
              <li><a onClick={() => scrollToSection('contato')}>Contato</a></li>
              <li><a>Trabalhe Conosco</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Conecte-se</h3>
            <div className="footer-social-icons">
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="LinkedIn">
                <img src={linkedinIcon} alt="LinkedIn" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="Facebook">
                <img src={facebookIcon} alt="Facebook" />
              </a>
              <a href="https://www.instagram.com/jforganizacao?igsh=MTh2cDk0Z2kzcmlzbg==" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="Instagram">
                <img src={instagramIcon} alt="Instagram" />
              </a>
              <a href="https://wa.me/5592992091329" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="WhatsApp Business">
                <img src={whatsappIcon} alt="WhatsApp" />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 JF Organização Trading. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Chat Widget */}
      <div id="chat-widget">
        {!chatOpen ? (
          <button id="chat-button" onClick={() => setChatOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Precisa de Ajuda?</span>
          </button>
        ) : (
          <div id="chat-box">
            <div style={{ background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '10px 10px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Como podemos ajudar?</h3>
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
                  <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Selecione uma opção abaixo:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <button onClick={() => selectOption('services')} className="chat-option"><span style={{ fontSize: '1.3rem', marginRight: '0.5rem' }}>📦</span><span>Conhecer nossos serviços</span></button>
                    <button onClick={() => selectOption('quote')} className="chat-option"><span style={{ fontSize: '1.3rem', marginRight: '0.5rem' }}>💰</span><span>Solicitar orçamento</span></button>
                    <button onClick={() => selectOption('export')} className="chat-option"><span style={{ fontSize: '1.3rem', marginRight: '0.5rem' }}>🌍</span><span>Informações sobre exportação</span></button>
                    <button onClick={() => selectOption('other')} className="chat-option"><span style={{ fontSize: '1.3rem', marginRight: '0.5rem' }}>❓</span><span>Outras dúvidas</span></button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.2rem' }}>{chatResponse.title}</h4>
                  <p style={{ marginBottom: '2rem', color: '#555', lineHeight: '1.6' }}>{chatResponse.text}</p>
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
                      <span>Continuar no WhatsApp</span>
                    </a>
                    <button
                      onClick={resetChat}
                      style={{ background: 'var(--light)', color: 'var(--dark)', padding: '0.9rem', borderRadius: '10px', border: '1px solid #ddd', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s' }}
                    >
                      ← <span>Voltar</span>
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