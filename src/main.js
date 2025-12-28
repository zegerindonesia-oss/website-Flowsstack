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
  Share2
} from 'lucide';
import AOS from 'aos';

// Initialize Animations
AOS.init({
  duration: 800,
  once: true,
  offset: 100,
  easing: 'ease-out-cubic'
});

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
    desc: 'Ubah foto biasa menjadi foto profesional hanya dengan 1 klik.',
    icon: 'Image',
    link: '/products/flowpict'
  },
  {
    name: 'FlowQueue',
    category: 'Business Operations',
    desc: 'Sistem antrian digital pintar untuk klinik, restoran, dan pelayanan publik.',
    icon: 'Users',
    link: '/products/flowqueue'
  },
  {
    name: 'FlowBook',
    category: 'Business Operations',
    desc: 'Platform booking & reservasi online otomatis untuk jasa dan penyewaan.',
    icon: 'Calendar',
    link: '/products/flowbook'
  },
  {
    name: 'FlowTrain',
    category: 'Education',
    desc: 'Learning Management System (LMS) modern untuk pelatihan karyawan & kursus online.',
    icon: 'GraduationCap',
    link: '/products/flowtrain'
  },
  {
    name: 'FlowMenu',
    category: 'Commerce',
    desc: 'Buku menu digital via QR Code dengan integrasi pemesanan langsung.',
    icon: 'Utensils',
    link: '/products/flowmenu'
  },
  {
    name: 'FlowPay',
    category: 'Finance',
    desc: 'Solusi invoicing dan payment gateway terintegrasi untuk bisnis.',
    icon: 'CreditCard',
    link: '/products/flowpay'
  },
  {
    name: 'FlowContent',
    category: 'Creative Tools',
    desc: 'Content planner & scheduler terpusat untuk semua media sosial Anda.',
    icon: 'Share2',
    link: '/products/flowcontent'
  },
  {
    name: 'FlowStore',
    category: 'Commerce',
    desc: 'Buat toko online profesional sendiri dalam hitungan menit.',
    icon: 'ShoppingBag',
    link: '/products/flowstore'
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
  const container = document.getElementById('featured-products');
  if (!container) return;

  container.innerHTML = products.map((product, index) => `
    <div class="glass-card hover:border-primary/30 group" data-aos="fade-up" data-aos-delay="${index * 100}">
      <span class="badge-pill mb-6">${product.category}</span>
      <div class="flex items-start gap-4 mb-6">
        <div class="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
           <i data-lucide="${product.icon}" width="32" height="32"></i>
        </div>
        <div>
          <h3 class="font-bold text-2xl mb-1 group-hover:text-primary transition-colors">${product.name}</h3>
          <p class="text-xs text-muted font-mono">SAAS PRODUCT</p>
        </div>
      </div>
      <p class="text-muted mb-8 text-sm line-clamp-3">${product.desc}</p>
      
      <a href="${product.link}" class="w-full btn btn-outline justify-center hover:bg-primary hover:text-white hover:border-primary">
        Lihat Detail
      </a>
    </div>
  `).join('');
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
  renderProducts();
  renderServices();
  renderSteps();

  // Initialize Icons
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
      Share2
    }
  });
});
