import{A as f}from"./aos-QBqVCxaf.js";/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=(e,t,a=[])=>{const i=document.createElementNS("http://www.w3.org/2000/svg",e);return Object.keys(t).forEach(o=>{i.setAttribute(o,String(t[o]))}),a.length&&a.forEach(o=>{const s=h(...o);i.appendChild(s)}),i};var x=([e,t,a])=>h(e,t,a);/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=e=>Array.from(e.attributes).reduce((t,a)=>(t[a.name]=a.value,t),{}),b=e=>typeof e=="string"?e:!e||!e.class?"":e.class&&typeof e.class=="string"?e.class.split(" "):e.class&&Array.isArray(e.class)?e.class:"",k=e=>e.flatMap(b).map(a=>a.trim()).filter(Boolean).filter((a,i,o)=>o.indexOf(a)===i).join(" "),C=e=>e.replace(/(\w)(\w*)(_|-|\s*)/g,(t,a,i)=>a.toUpperCase()+i.toLowerCase()),p=(e,{nameAttr:t,icons:a,attrs:i})=>{var u;const o=e.getAttribute(t);if(o==null)return;const s=C(o),r=a[s];if(!r)return console.warn(`${e.outerHTML} icon name was not found in the provided icons object.`);const c=w(e),[m,g,y]=r,l={...g,"data-lucide":o,...i,...c},d=k(["lucide",`lucide-${o}`,c,i]);d&&Object.assign(l,{class:d});const v=x([m,l,y]);return(u=e.parentNode)==null?void 0:u.replaceChild(v,e)};/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=["svg",n,[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"2"}],["circle",{cx:"12",cy:"12",r:"2"}],["path",{d:"M6 12h.01M18 12h.01"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=["svg",n,[["path",{d:"M3 3v18h18"}],["path",{d:"M18 17V9"}],["path",{d:"M13 17V5"}],["path",{d:"M8 17v-3"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=["svg",n,[["rect",{width:"20",height:"14",x:"2",y:"7",rx:"2",ry:"2"}],["path",{d:"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=["svg",n,[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",ry:"2"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=["svg",n,[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"m9 12 2 2 4-4"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=["svg",n,[["polyline",{points:"16 18 22 12 16 6"}],["polyline",{points:"8 6 2 12 8 18"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=["svg",n,[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=["svg",n,[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"}],["path",{d:"M2 12h20"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=["svg",n,[["path",{d:"M22 10v6M2 10l10-5 10 5-10 5z"}],["path",{d:"M6 12v5c3 3 9 3 12 0v-5"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=["svg",n,[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2"}],["circle",{cx:"9",cy:"9",r:"2"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=["svg",n,[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=["svg",n,[["path",{d:"m12 19 7-7 3 3-7 7-3-3z"}],["path",{d:"m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"}],["path",{d:"m2 2 7.586 7.586"}],["circle",{cx:"11",cy:"11",r:"2"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=["svg",n,[["circle",{cx:"18",cy:"5",r:"3"}],["circle",{cx:"6",cy:"12",r:"3"}],["circle",{cx:"18",cy:"19",r:"3"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=["svg",n,[["path",{d:"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"}],["path",{d:"M3 6h18"}],["path",{d:"M16 10a4 4 0 0 1-8 0"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=["svg",n,[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2"}],["path",{d:"M12 18h.01"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=["svg",n,[["path",{d:"m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"}],["path",{d:"M5 3v4"}],["path",{d:"M19 17v4"}],["path",{d:"M3 5h4"}],["path",{d:"M17 19h4"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=["svg",n,[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17"}],["polyline",{points:"16 7 22 7 22 13"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=["svg",n,[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}],["circle",{cx:"9",cy:"7",r:"4"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=["svg",n,[["path",{d:"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"}],["path",{d:"M7 2v20"}],["path",{d:"M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=["svg",n,[["polygon",{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2"}]]];/**
 * @license lucide v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=({icons:e={},nameAttr:t="data-lucide",attrs:a={}}={})=>{if(!Object.values(e).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof document>"u")throw new Error("`createIcons()` only works in a browser environment.");const i=document.querySelectorAll(`[${t}]`);if(Array.from(i).forEach(o=>p(o,{nameAttr:t,icons:e,attrs:a})),t==="data-lucide"){const o=document.querySelectorAll("[icon-name]");o.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(o).forEach(s=>p(s,{nameAttr:"icon-name",icons:e,attrs:a})))}};f.init({duration:800,once:!0,offset:100,easing:"ease-out-cubic"});const q=[{name:"Creative Tools",icon:"Sparkles",desc:"Kreasi konten visual & media dengan AI."},{name:"Business Operations",icon:"Briefcase",desc:"Sistem manajemen operasional harian."},{name:"Finance",icon:"Banknote",desc:"Pengelolaan keuangan dan pembayaran."},{name:"Commerce",icon:"ShoppingBag",desc:"Solusi jualan online & offline."},{name:"Education",icon:"GraduationCap",desc:"Platform edukasi & knowledge base."}],R=[{name:"FlowPict",category:"Creative Tools",desc:"Ubah foto biasa menjadi foto profesional hanya dengan 1 klik.",icon:"Image",link:"/products/flowpict"},{name:"FlowQueue",category:"Business Operations",desc:"Sistem antrian digital pintar untuk klinik, restoran, dan pelayanan publik.",icon:"Users",link:"/products/flowqueue"},{name:"FlowBook",category:"Business Operations",desc:"Platform booking & reservasi online otomatis untuk jasa dan penyewaan.",icon:"Calendar",link:"/products/flowbook"},{name:"FlowTrain",category:"Education",desc:"Learning Management System (LMS) modern untuk pelatihan karyawan & kursus online.",icon:"GraduationCap",link:"/products/flowtrain"},{name:"FlowMenu",category:"Commerce",desc:"Buku menu digital via QR Code dengan integrasi pemesanan langsung.",icon:"Utensils",link:"/products/flowmenu"},{name:"FlowPay",category:"Finance",desc:"Solusi invoicing dan payment gateway terintegrasi untuk bisnis.",icon:"CreditCard",link:"/products/flowpay"},{name:"FlowContent",category:"Creative Tools",desc:"Content planner & scheduler terpusat untuk semua media sosial Anda.",icon:"Share2",link:"/products/flowcontent"},{name:"FlowStore",category:"Commerce",desc:"Buat toko online profesional sendiri dalam hitungan menit.",icon:"ShoppingBag",link:"/products/flowstore"}],K=["Website Company Profile","Web App Internal System","Mobile App (Android / iOS)","Custom Dashboard","Custom Automation"],Q=[{title:"Pilih Produk atau Solusi",desc:"Jelajahi katalog produk kami atau konsultasikan kebutuhan custom Anda."},{title:"Gunakan atau Coba Produk",desc:"Mulai dengan versi gratis atau demo untuk merasakan manfaatnya."},{title:"Upgrade Sesuai Kebutuhan",desc:"Scale up layanan seiring pertumbuhan bisnis Anda."},{title:"Tumbuh Bersama FlowStack",desc:"Nikmati ekosistem terintegrasi yang mendukung kesuksesan jangka panjang."}];function W(){const e=document.getElementById("category-grid");e&&(e.innerHTML=q.map((t,a)=>`
    <div class="glass-card flex flex-col items-start h-full" data-aos="fade-up" data-aos-delay="${a*100}">
      <div class="icon-box">
        <i data-lucide="${t.icon}"></i>
      </div>
      <h3 class="card-title text-xl font-bold mb-3">${t.name}</h3>
      <p class="text-muted text-sm leading-relaxed">${t.desc}</p>
    </div>
  `).join(""))}function J(){const e=document.getElementById("featured-products");e&&(e.innerHTML=R.map((t,a)=>`
    <div class="glass-card hover:border-primary/30 group" data-aos="fade-up" data-aos-delay="${a*100}">
      <span class="badge-pill mb-6">${t.category}</span>
      <div class="flex items-start gap-4 mb-6">
        <div class="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
           <i data-lucide="${t.icon}" width="32" height="32"></i>
        </div>
        <div>
          <h3 class="font-bold text-2xl mb-1 group-hover:text-primary transition-colors">${t.name}</h3>
          <p class="text-xs text-muted font-mono">SAAS PRODUCT</p>
        </div>
      </div>
      <p class="text-muted mb-8 text-sm line-clamp-3">${t.desc}</p>
      
      <a href="${t.link}" class="w-full btn btn-outline justify-center hover:bg-primary hover:text-white hover:border-primary">
        Lihat Detail
      </a>
    </div>
  `).join(""))}function _(){const e=document.getElementById("service-list");e&&(e.innerHTML=K.map(t=>`
    <li class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50 transition-colors">
      <div class="text-secondary bg-pink-100 rounded-full p-1">
        <i data-lucide="CheckCircle2" width="16" height="16"></i>
      </div>
      <span class="font-semibold text-gray-700">${t}</span>
    </li>
  `).join(""))}function X(){const e=document.getElementById("how-it-works");e&&(e.innerHTML=Q.map((t,a)=>`
    <div class="relative z-10" data-aos="fade-up" data-aos-delay="${a*100}">
      <div class="w-16 h-16 mx-auto bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg flex items-center justify-center text-primary font-bold text-2xl border border-purple-100 mb-6 relative">
         ${a+1}
         <div class="absolute -z-10 bg-primary blur-xl opacity-20 inset-0"></div>
      </div>
      <h3 class="font-bold text-lg mb-2">${t.title}</h3>
      <p class="text-muted text-sm px-4">${t.desc}</p>
    </div>
  `).join(""))}document.addEventListener("DOMContentLoaded",()=>{W(),J(),_(),X(),Z({icons:{TrendingUp:V,Image:P,Users:z,LayoutDashboard:I,Smartphone:U,Code:j,BarChart3:S,Globe:$,Zap:G,Briefcase:A,PenTool:F,CheckCircle2:L,Sparkles:H,Banknote:M,ShoppingBag:O,GraduationCap:T,Calendar:B,Utensils:D,CreditCard:E,Share2:N}})});
