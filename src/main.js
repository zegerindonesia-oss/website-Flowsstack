import './style.css';
import {
  createIcons,
  TrendingUp,
  Image,
  Users,
  LayoutDashboard,
  Smartphone,
  Code,
  BarChart3,
  Globe,
  Zap,
  Briefcase,
  PenTool,
  CheckCircle2,
  Sparkles,
  Banknote,
  ShoppingBag,
  GraduationCap,
  Calendar,
  Utensils,
  CreditCard,
  Share2,
  Construction,
  MessageCircle
} from 'lucide';
import AOS from 'aos';
import { translations } from './translations.js';

// Initialize Animations
AOS.init({
  duration: 800,
  once: true,
  offset: 100,
  easing: 'ease-out-cubic'
});

// State
let currentLang = localStorage.getItem('flowstack_lang') || 'id';

// Data
const categories = [
  { name: 'Creative Tools', icon: 'Sparkles', desc: 'Kreasi konten visual & media dengan AI.' },
  { name: 'Business Operations', icon: 'Briefcase', desc: 'Sistem manajemen operasional harian.' },
  { name: 'Finance', icon: 'Banknote', desc: 'Pengelolaan keuangan dan pembayaran.' },
  { name: 'Commerce', icon: 'ShoppingBag', desc: 'Solusi jualan online & offline.' },
  { name: 'Education', icon: 'GraduationCap', desc: 'Platform edukasi & knowledge base.' }
];

const products = [
  {
    name: 'FlowPict',
    category: 'Creative Tools',
    descKey: 'product_flowpict_desc',
    icon: 'Image',
    link: '/products/flowpict',
    styleClass: 'bg-purple-100 text-purple-600'
  },
  {
    name: 'FlowQueue',
    category: 'Business Operations',
    descKey: null,
    desc: 'Smart queue management system for service businesses.',
    icon: 'Users',
    link: '/products/flowqueue',
    styleClass: 'bg-pink-100 text-pink-600'
  },
  {
    name: 'FlowAssist',
    category: 'Business Operations',
    descKey: null,
    desc: 'Asisten WhatsApp AI 24 Jam untuk otomatisasi CS.',
    icon: 'MessageCircle',
    link: '/products/flowassist',
    styleClass: 'bg-green-100 text-green-600'
  },

  {
    name: 'FlowBook',
    category: 'Business Operations',
    descKey: null,
    desc: 'Effortless appointment booking and scheduling.',
    icon: 'Calendar',
    link: '/products/flowbook',
    styleClass: 'bg-blue-100 text-blue-600'
  },
  {
    name: 'FlowTrain',
    category: 'Education',
    descKey: null,
    desc: 'LMS Platform for corporate training and education.',
    icon: 'GraduationCap',
    link: '/products/flowtrain',
    styleClass: 'bg-orange-100 text-orange-600'
  },
  {
    name: 'FlowMenu',
    category: 'Commerce',
    descKey: null,
    desc: 'Digital F&B solution for modern restaurants.',
    icon: 'Utensils',
    link: '/products/flowmenu',
    styleClass: 'bg-green-100 text-green-600'
  },
  {
    name: 'FlowPay',
    category: 'Finance',
    descKey: null,
    desc: 'Integrated finance manager and payment gateway.',
    icon: 'CreditCard',
    link: '/products/flowpay',
    styleClass: 'bg-indigo-100 text-indigo-600'
  },
  {
    name: 'FlowContent',
    category: 'Creative Tools',
    descKey: null,
    desc: 'Content planner & scheduler terpusat untuk semua media sosial Anda.',
    icon: 'Share2',
    link: '/products/flowcontent',
    styleClass: 'bg-red-100 text-red-600'
  },
  {
    name: 'FlowStore',
    category: 'Commerce',
    descKey: null,
    desc: 'Complete E-commerce solution for online selling.',
    icon: 'ShoppingBag',
    link: '/products/flowstore',
    styleClass: 'bg-teal-100 text-teal-600'
  },
  {
    name: 'More Tools',
    category: 'Future',
    descKey: 'product_coming_soon_desc',
    icon: 'Construction',
    link: '#',
    isComingSoon: true,
    styleClass: 'bg-gray-100 text-gray-400'
  }
];

const serviceList = [
  'Website Company Profile',
  'Web App Internal System',
  'Mobile App (Android / iOS)',
  'Custom Dashboard',
  'Custom Automation'
];

const steps = [
  { title: 'Pilih Produk atau Solusi', desc: 'Jelajahi katalog produk kami atau konsultasikan kebutuhan custom Anda.' },
  { title: 'Gunakan atau Coba Produk', desc: 'Mulai dengan versi gratis atau demo untuk merasakan manfaatnya.' },
  { title: 'Upgrade Sesuai Kebutuhan', desc: 'Scale up layanan seiring pertumbuhan bisnis Anda.' },
  { title: 'Tumbuh Bersama FlowStack', desc: 'Nikmati ekosistem terintegrasi yang mendukung kesuksesan jangka panjang.' }
];

// i18n Logic
function updateLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('flowstack_lang', lang);

  // Update Text Content
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Update Toggle Button Label
  const langLabel = document.getElementById('lang-label');
  if (langLabel) {
    langLabel.textContent = lang.toUpperCase();
  }

  // Re-render Products (to update translated descriptions)
  renderProducts();
}

// Render Functions
function renderCategories() {
  const container = document.getElementById('category-grid');
  if (!container) return;

  container.innerHTML = categories.map((cat, index) => `
    <div class="glass-card flex flex-col items-start h-full" data-aos="fade-up" data-aos-delay="${index * 100}">
      <div class="icon-box">
        <i data-lucide="${cat.icon}"></i>
      </div>
      <h3 class="card-title text-xl font-bold mb-3">${cat.name}</h3>
      <p class="text-muted text-sm leading-relaxed">${cat.desc}</p>
    </div>
  `).join('');
}

function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  container.innerHTML = products.map((product, index) => {
    // Determine description text based on lang
    let description = product.desc;
    if (product.descKey && translations[currentLang][product.descKey]) {
      description = translations[currentLang][product.descKey];
    } else if (product.isComingSoon) {
      description = translations[currentLang].product_coming_soon_desc;
    }

    const name = product.isComingSoon
      ? translations[currentLang].product_coming_soon
      : product.name;

    if (product.isComingSoon) {
      return `
        <div class="glass-card p-6 rounded-2xl border-dashed border-2 border-gray-300 flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 transition-opacity" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="size-14 rounded-xl ${product.styleClass} flex items-center justify-center mb-5">
                <i data-lucide="${product.icon}" width="32" height="32"></i>
            </div>
            <h3 class="font-heading text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-pink mb-2">${name}</h3>
            <p class="text-sm text-gray-400 mb-4">${description}</p>
        </div>
        `;
    }

    return `
    <a href="${product.link}"
        class="group glass-card p-6 rounded-2xl hover:shadow-glass-hover transition-all duration-300 transform hover:-translate-y-2 cursor-pointer bg-white block" data-aos="fade-up" data-aos-delay="${index * 100}">
        <div
        class="size-14 rounded-xl ${product.styleClass} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
        <i data-lucide="${product.icon}" width="32" height="32"></i>
        </div>
        <h3 class="font-heading text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-pink mb-2">${name}</h3>
        <p class="text-sm text-gray-500 mb-4">${description}</p>
        <div class="flex items-center text-primary text-sm font-bold">
        <span>Learn more</span>
        <span
            class="material-symbols-outlined text-[16px] ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">arrow_forward</span>
        </div>
    </a>
  `}).join('');

  createIcons({
    icons: { Image, Users, Calendar, GraduationCap, Utensils, CreditCard, Share2, ShoppingBag, Construction },
    nameAttr: 'data-lucide',
    attrs: {
      width: "32",
      height: "32"
    }
  });
}

function renderServices() {
  const container = document.getElementById('service-list');
  if (!container) return;

  container.innerHTML = serviceList.map(service => `
    <li class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50 transition-colors">
      <div class="text-secondary bg-pink-100 rounded-full p-1">
        <i data-lucide="CheckCircle2" width="16" height="16"></i>
      </div>
      <span class="font-semibold text-gray-700">${service}</span>
    </li>
  `).join('');
}

function renderSteps() {
  const container = document.getElementById('how-it-works');
  if (!container) return;

  container.innerHTML = steps.map((step, index) => `
    <div class="relative z-10" data-aos="fade-up" data-aos-delay="${index * 100}">
      <div class="w-16 h-16 mx-auto bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg flex items-center justify-center text-primary font-bold text-2xl border border-purple-100 mb-6 relative">
         ${index + 1}
         <div class="absolute -z-10 bg-primary blur-xl opacity-20 inset-0"></div>
      </div>
      <h3 class="font-bold text-lg mb-2">${step.title}</h3>
      <p class="text-muted text-sm px-4">${step.desc}</p>
    </div>
  `).join('');
}


// Execute
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderProducts();  // This handles initial createIcons inside it for products
  renderServices();
  renderSteps();
  updateLanguage(currentLang); // Defines initial language and re-renders products

  // Event Listeners
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const newLang = currentLang === 'en' ? 'id' : 'en';
      updateLanguage(newLang);
    });
  }

  // Initialize all icons (for non-product sections like categories, services)
  createIcons({
    icons: {
      TrendingUp,
      Image,
      Users,
      LayoutDashboard,
      Smartphone,
      Code,
      BarChart3,
      Globe,
      Zap,
      Briefcase,
      PenTool,
      CheckCircle2,
      Sparkles,
      Banknote,
      ShoppingBag,
      GraduationCap,
      Calendar,
      Utensils,
      CreditCard,
      Share2,
      Construction,
      MessageCircle
    }
  });
});
