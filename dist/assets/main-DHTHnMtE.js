import{A as $}from"./aos-QBqVCxaf.js";/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=(e,t,a=[])=>{const s=document.createElementNS("http://www.w3.org/2000/svg",e);return Object.keys(t).forEach(n=>{s.setAttribute(n,String(t[n]))}),a.length&&a.forEach(n=>{const c=y(...n);s.appendChild(c)}),s};var K=([e,t,a])=>y(e,t,a);/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=e=>Array.from(e.attributes).reduce((t,a)=>(t[a.name]=a.value,t),{}),F=e=>typeof e=="string"?e:!e||!e.class?"":e.class&&typeof e.class=="string"?e.class.split(" "):e.class&&Array.isArray(e.class)?e.class:"",I=e=>e.flatMap(F).map(a=>a.trim()).filter(Boolean).filter((a,s,n)=>n.indexOf(a)===s).join(" "),T=e=>e.replace(/(\w)(\w*)(_|-|\s*)/g,(t,a,s)=>a.toUpperCase()+s.toLowerCase()),p=(e,{nameAttr:t,icons:a,attrs:s})=>{var g;const n=e.getAttribute(t);if(n==null)return;const c=T(n),l=a[c];if(!l)return console.warn(`${e.outerHTML} icon name was not found in the provided icons object.`);const d=P(e),[L,A,B]=l,u={...A,"data-lucide":n,...s,...d},m=I(["lucide",`lucide-${n}`,d,s]);m&&Object.assign(u,{class:m});const j=K([L,u,B]);return(g=e.parentNode)==null?void 0:g.replaceChild(j,e)};/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=["svg",o,[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"2"}],["circle",{cx:"12",cy:"12",r:"2"}],["path",{d:"M6 12h.01M18 12h.01"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=["svg",o,[["path",{d:"M3 3v18h18"}],["path",{d:"M18 17V9"}],["path",{d:"M13 17V5"}],["path",{d:"M8 17v-3"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=["svg",o,[["rect",{width:"20",height:"14",x:"2",y:"7",rx:"2",ry:"2"}],["path",{d:"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=["svg",o,[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",ry:"2"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=["svg",o,[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"m9 12 2 2 4-4"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=["svg",o,[["polyline",{points:"16 18 22 12 16 6"}],["polyline",{points:"8 6 2 12 8 18"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=["svg",o,[["rect",{x:"2",y:"6",width:"20",height:"8",rx:"1"}],["path",{d:"M17 14v7"}],["path",{d:"M7 14v7"}],["path",{d:"M17 3v3"}],["path",{d:"M7 3v3"}],["path",{d:"M10 14 2.3 6.3"}],["path",{d:"m14 6 7.7 7.7"}],["path",{d:"m8 6 8 8"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=["svg",o,[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=["svg",o,[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"}],["path",{d:"M2 12h20"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=["svg",o,[["path",{d:"M22 10v6M2 10l10-5 10 5-10 5z"}],["path",{d:"M6 12v5c3 3 9 3 12 0v-5"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=["svg",o,[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2"}],["circle",{cx:"9",cy:"9",r:"2"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=["svg",o,[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=["svg",o,[["path",{d:"m12 19 7-7 3 3-7 7-3-3z"}],["path",{d:"m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"}],["path",{d:"m2 2 7.586 7.586"}],["circle",{cx:"11",cy:"11",r:"2"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=["svg",o,[["circle",{cx:"18",cy:"5",r:"3"}],["circle",{cx:"6",cy:"12",r:"3"}],["circle",{cx:"18",cy:"19",r:"3"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=["svg",o,[["path",{d:"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"}],["path",{d:"M3 6h18"}],["path",{d:"M16 10a4 4 0 0 1-8 0"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=["svg",o,[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2"}],["path",{d:"M12 18h.01"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=["svg",o,[["path",{d:"m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"}],["path",{d:"M5 3v4"}],["path",{d:"M19 17v4"}],["path",{d:"M3 5h4"}],["path",{d:"M17 19h4"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=["svg",o,[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17"}],["polyline",{points:"16 7 22 7 22 13"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=["svg",o,[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}],["circle",{cx:"9",cy:"7",r:"4"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=["svg",o,[["path",{d:"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"}],["path",{d:"M7 2v20"}],["path",{d:"M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=["svg",o,[["polygon",{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=({icons:e={},nameAttr:t="data-lucide",attrs:a={}}={})=>{if(!Object.values(e).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof document>"u")throw new Error("`createIcons()` only works in a browser environment.");const s=document.querySelectorAll(`[${t}]`);if(Array.from(s).forEach(n=>p(n,{nameAttr:t,icons:e,attrs:a})),t==="data-lucide"){const n=document.querySelectorAll("[icon-name]");n.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(n).forEach(c=>p(c,{nameAttr:"icon-name",icons:e,attrs:a})))}},i={en:{nav_home:"Home",nav_products:"Products",nav_services:"Services",nav_pricing:"Pricing",nav_contact:"Contact",hero_badge:"New Version 2.0 Live",hero_title_prefix:"Grow your business with",hero_title_highlight:"Digital Ecosystem",hero_subtitle:"#Empowering Your Business. FlowStack is the all-in-one SaaS hub designed to streamline operations, automate workflows, and replace expensive manual work.",hero_cta_primary:"Get Started Free",hero_cta_secondary:"View Demo",hero_feature_1:"No credit card required",hero_feature_2:"14-day free trial",showcase_title:"Made with FlowStack",showcase_subtitle:"Empowering creators and businesses worldwide.",products_badge:"Our Ecosystem",products_title:"Core Products for Every Need",products_subtitle:"Scalable solutions designed to work together seamlessly.",product_flowpict_desc:"Replace a professional designer with 1 click. Turn simple photos into commercial masterpieces.",product_coming_soon:"Coming Soon",product_coming_soon_desc:"We are building more exciting tools for you.",testimonials_title:"Don't take our word for it",testimonials_subtitle:"Hear from thousands of businesses growing with FlowStack.",footer_privacy:"Privacy Policy",footer_terms:"Terms of Service"},id:{nav_home:"Beranda",nav_products:"Produk",nav_services:"Layanan",nav_pricing:"Harga",nav_contact:"Kontak",hero_badge:"Versi Baru 2.0 Live",hero_title_prefix:"Kembangkan bisnis dengan",hero_title_highlight:"Ekosistem Digital",hero_subtitle:"#Empowering Your Business. FlowStack adalah hub SaaS all-in-one untuk merapikan operasional, otomasi workflow, dan menggantikan pekerjaan manual yang mahal.",hero_cta_primary:"Coba Gratis",hero_cta_secondary:"Lihat Demo",hero_feature_1:"Tanpa kartu kredit",hero_feature_2:"14 hari masa percoban",showcase_title:"Dibuat dengan FlowStack",showcase_subtitle:"Memberdayakan kreator dan bisnis di seluruh dunia.",products_badge:"Ekosistem Kami",products_title:"Produk Inti untuk Segala Kebutuhan",products_subtitle:"Solusi scalable yang dirancang untuk bekerja bersama secara mulus.",product_flowpict_desc:"Gantikan desainer profesional dengan 1 klik. Ubah foto biasa jadi karya komersial.",product_coming_soon:"Segera Hadir",product_coming_soon_desc:"Kami sedang membangun alat-alat baru yang lebih seru.",testimonials_title:"Kata Mereka",testimonials_subtitle:"Dengar langsung dari ribuan bisnis yang tumbuh bersama FlowStack.",footer_privacy:"Kebijakan Privasi",footer_terms:"Syarat & Ketentuan"}};$.init({duration:800,once:!0,offset:100,easing:"ease-out-cubic"});let r=localStorage.getItem("flowstack_lang")||"id";const Y=[{name:"Creative Tools",icon:"Sparkles",desc:"Kreasi konten visual & media dengan AI."},{name:"Business Operations",icon:"Briefcase",desc:"Sistem manajemen operasional harian."},{name:"Finance",icon:"Banknote",desc:"Pengelolaan keuangan dan pembayaran."},{name:"Commerce",icon:"ShoppingBag",desc:"Solusi jualan online & offline."},{name:"Education",icon:"GraduationCap",desc:"Platform edukasi & knowledge base."}],J=[{name:"FlowPict",category:"Creative Tools",descKey:"product_flowpict_desc",icon:"Image",link:"/products/flowpict",styleClass:"bg-purple-100 text-purple-600"},{name:"FlowQueue",category:"Business Operations",descKey:null,desc:"Smart queue management system for service businesses.",icon:"Users",link:"/products/flowqueue",styleClass:"bg-pink-100 text-pink-600"},{name:"FlowBook",category:"Business Operations",descKey:null,desc:"Effortless appointment booking and scheduling.",icon:"Calendar",link:"/products/flowbook",styleClass:"bg-blue-100 text-blue-600"},{name:"FlowTrain",category:"Education",descKey:null,desc:"LMS Platform for corporate training and education.",icon:"GraduationCap",link:"/products/flowtrain",styleClass:"bg-orange-100 text-orange-600"},{name:"FlowMenu",category:"Commerce",descKey:null,desc:"Digital F&B solution for modern restaurants.",icon:"Utensils",link:"/products/flowmenu",styleClass:"bg-green-100 text-green-600"},{name:"FlowPay",category:"Finance",descKey:null,desc:"Integrated finance manager and payment gateway.",icon:"CreditCard",link:"/products/flowpay",styleClass:"bg-indigo-100 text-indigo-600"},{name:"FlowContent",category:"Creative Tools",descKey:null,desc:"Content planner & scheduler terpusat untuk semua media sosial Anda.",icon:"Share2",link:"/products/flowcontent",styleClass:"bg-red-100 text-red-600"},{name:"FlowStore",category:"Commerce",descKey:null,desc:"Complete E-commerce solution for online selling.",icon:"ShoppingBag",link:"/products/flowstore",styleClass:"bg-teal-100 text-teal-600"},{name:"More Tools",category:"Future",descKey:"product_coming_soon_desc",icon:"Construction",link:"#",isComingSoon:!0,styleClass:"bg-gray-100 text-gray-400"}],Q=["Website Company Profile","Web App Internal System","Mobile App (Android / iOS)","Custom Dashboard","Custom Automation"],X=[{title:"Pilih Produk atau Solusi",desc:"Jelajahi katalog produk kami atau konsultasikan kebutuhan custom Anda."},{title:"Gunakan atau Coba Produk",desc:"Mulai dengan versi gratis atau demo untuk merasakan manfaatnya."},{title:"Upgrade Sesuai Kebutuhan",desc:"Scale up layanan seiring pertumbuhan bisnis Anda."},{title:"Tumbuh Bersama FlowStack",desc:"Nikmati ekosistem terintegrasi yang mendukung kesuksesan jangka panjang."}];function h(e){r=e,localStorage.setItem("flowstack_lang",e),document.querySelectorAll("[data-i18n]").forEach(s=>{const n=s.getAttribute("data-i18n");i[e]&&i[e][n]&&(s.textContent=i[e][n])});const a=document.getElementById("lang-label");a&&(a.textContent=e.toUpperCase()),E()}function ee(){const e=document.getElementById("category-grid");e&&(e.innerHTML=Y.map((t,a)=>`
    <div class="glass-card flex flex-col items-start h-full" data-aos="fade-up" data-aos-delay="${a*100}">
      <div class="icon-box">
        <i data-lucide="${t.icon}"></i>
      </div>
      <h3 class="card-title text-xl font-bold mb-3">${t.name}</h3>
      <p class="text-muted text-sm leading-relaxed">${t.desc}</p>
    </div>
  `).join(""))}function E(){const e=document.getElementById("products-grid");e&&(e.innerHTML=J.map((t,a)=>{let s=t.desc;t.descKey&&i[r][t.descKey]?s=i[r][t.descKey]:t.isComingSoon&&(s=i[r].product_coming_soon_desc);const n=t.isComingSoon?i[r].product_coming_soon:t.name;return t.isComingSoon?`
        <div class="glass-card p-6 rounded-2xl border-dashed border-2 border-gray-300 flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 transition-opacity" data-aos="fade-up" data-aos-delay="${a*100}">
            <div class="size-14 rounded-xl ${t.styleClass} flex items-center justify-center mb-5">
                <i data-lucide="${t.icon}" width="32" height="32"></i>
            </div>
            <h3 class="font-heading text-xl font-bold text-gray-400 mb-2">${n}</h3>
            <p class="text-sm text-gray-400 mb-4">${s}</p>
        </div>
        `:`
    <a href="${t.link}"
        class="group glass-card p-6 rounded-2xl hover:shadow-glass-hover transition-all duration-300 transform hover:-translate-y-2 cursor-pointer bg-white block" data-aos="fade-up" data-aos-delay="${a*100}">
        <div
        class="size-14 rounded-xl ${t.styleClass} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
        <i data-lucide="${t.icon}" width="32" height="32"></i>
        </div>
        <h3 class="font-heading text-xl font-bold text-[#131118] mb-2">${n}</h3>
        <p class="text-sm text-gray-500 mb-4">${s}</p>
        <div class="flex items-center text-primary text-sm font-bold">
        <span>Learn more</span>
        <span
            class="material-symbols-outlined text-[16px] ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">arrow_forward</span>
        </div>
    </a>
  `}).join(""),M({icons:{Image:x,Users:C,Calendar:f,GraduationCap:w,Utensils:S,CreditCard:v,Share2:k,ShoppingBag:_,Construction:b},nameAttr:"data-lucide",attrs:{width:"32",height:"32"}}))}function te(){const e=document.getElementById("service-list");e&&(e.innerHTML=Q.map(t=>`
    <li class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50 transition-colors">
      <div class="text-secondary bg-pink-100 rounded-full p-1">
        <i data-lucide="CheckCircle2" width="16" height="16"></i>
      </div>
      <span class="font-semibold text-gray-700">${t}</span>
    </li>
  `).join(""))}function ae(){const e=document.getElementById("how-it-works");e&&(e.innerHTML=X.map((t,a)=>`
    <div class="relative z-10" data-aos="fade-up" data-aos-delay="${a*100}">
      <div class="w-16 h-16 mx-auto bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg flex items-center justify-center text-primary font-bold text-2xl border border-purple-100 mb-6 relative">
         ${a+1}
         <div class="absolute -z-10 bg-primary blur-xl opacity-20 inset-0"></div>
      </div>
      <h3 class="font-bold text-lg mb-2">${t.title}</h3>
      <p class="text-muted text-sm px-4">${t.desc}</p>
    </div>
  `).join(""))}document.addEventListener("DOMContentLoaded",()=>{ee(),E(),te(),ae(),h(r);const e=document.getElementById("lang-toggle");e&&e.addEventListener("click",()=>{h(r==="en"?"id":"en")}),M({icons:{TrendingUp:W,Image:x,Users:C,LayoutDashboard:V,Smartphone:q,Code:G,BarChart3:D,Globe:U,Zap:R,Briefcase:O,PenTool:z,CheckCircle2:H,Sparkles:Z,Banknote:N,ShoppingBag:_,GraduationCap:w,Calendar:f,Utensils:S,CreditCard:v,Share2:k,Construction:b}})});
