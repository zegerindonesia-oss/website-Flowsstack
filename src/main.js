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
  Construction
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
            <h3 class="font-heading text-xl font-bold text-gray-400 mb-2">${name}</h3>
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
        <h3 class="font-heading text-xl font-bold text-[#131118] mb-2">${name}</h3>
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

// Execute
document.addEventListener('DOMContentLoaded', () => {
  // Initial Render
  updateLanguage(currentLang);

  // Event Listeners
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const newLang = currentLang === 'en' ? 'id' : 'en';
      updateLanguage(newLang);
    });
  }

  // Initialize all icons initially needed
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
      Construction
    }
  });
});
