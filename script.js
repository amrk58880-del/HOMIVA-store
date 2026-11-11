// غيّر رقم واتساب إلى رقم المتجر بصيغة دولية بدون + أو مسافات.
const STORE_WHATSAPP = "201000000000"; // مثال مصري مؤقت — استبدله برقمك الحقيقي

// صورة بديلة تظهر لو صورة المنتج مش موجودة
const PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="700" height="500"><rect width="100%" height="100%" fill="#f1eee7"/><text x="50%" y="50%" font-size="48" font-family="Arial" fill="#193523" text-anchor="middle" dominant-baseline="middle">HOMIVA</text></svg>'
);

// صور المنتجات في فولدر images/
const products = [
  // ===== أدوات المطبخ =====
  {id:1,name:"طقم حلل جرانيت",category:"أدوات المطبخ",price:899,old:1200,image:"images/granite-cookware.jpg",discount:"25%"},
  {id:2,name:"طقم حلل ستانلس ستيل",category:"أدوات المطبخ",price:1250,old:1650,image:"images/stainless-cookware.jpg",discount:"24%"},
  {id:3,name:"طقم سكاكين مع حامل",category:"أدوات المطبخ",price:320,old:400,image:"images/knife-set.jpg",discount:"20%"},

  // ===== الأجهزة الصغيرة =====
  {id:4,name:"قلاية هوائية",category:"الأجهزة الصغيرة",price:1950,old:3000,image:"images/air-fryer.jpg",discount:"35%"},
  {id:5,name:"خلاط كهربائي",category:"الأجهزة الصغيرة",price:780,old:1000,image:"images/blender.jpg",discount:"22%"},
  {id:6,name:"مكواة بخار محمولة",category:"الأجهزة الصغيرة",price:450,old:600,image:"images/garment-steamer.jpg",discount:"25%"},
  {id:7,name:"صانعة ساندويتشات",category:"الأجهزة الصغيرة",price:590,old:750,image:"images/sandwich-maker.jpg",discount:"21%"},

  // ===== أدوات التنظيف =====
  {id:8,name:"ممسحة دوارة مع جردل",category:"أدوات التنظيف",price:520,old:700,image:"images/spin-mop.jpg",discount:"26%"},
  {id:9,name:"مجموعة بخاخات تنظيف",category:"أدوات التنظيف",price:210,old:280,image:"images/cleaning-sprays.jpg",discount:"25%"},
  {id:10,name:"سلة مهملات ستانلس بدواسة",category:"أدوات التنظيف",price:340,old:450,image:"images/trash-bin.jpg",discount:"24%"},

  // ===== تنظيم المنزل =====
  {id:11,name:"علب حفظ الطعام",category:"تنظيم المنزل",price:260,old:340,image:"images/food-containers.jpg",discount:"24%"},
  {id:12,name:"رفوف خشبية للمطبخ",category:"تنظيم المنزل",price:399,old:550,image:"images/kitchen-shelves.jpg",discount:"27%"},
  {id:13,name:"أدراج تخزين متعددة",category:"تنظيم المنزل",price:680,old:900,image:"images/storage-drawers.jpg",discount:"24%"},
  {id:14,name:"منشر ملابس قابل للطي",category:"تنظيم المنزل",price:520,old:690,image:"images/clothes-drying-rack.jpg",discount:"25%"},

  // ===== المفروشات =====
  {id:15,name:"مفرش سرير كامل",category:"المفروشات",price:850,old:1100,image:"images/bedding-set.jpg",discount:"23%"},
  {id:16,name:"مناشف قطنية",category:"المفروشات",price:249,old:320,image:"images/bath-towels.jpg",discount:"22%"},
  {id:17,name:"ستائر منزلية",category:"المفروشات",price:560,old:700,image:"images/curtains.jpg",discount:"20%"},
  {id:18,name:"وسائد ديكور",category:"المفروشات",price:480,old:620,image:"images/decorative-cushions.jpg",discount:"23%"},
  {id:19,name:"سجادة وموكيت",category:"المفروشات",price:690,old:900,image:"images/area-rug.jpg",discount:"23%"}
];

let cart = [];
let activeCategory = "الكل";
let searchTerm = "";

const productsGrid = document.getElementById("productsGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");

function money(value){return `${value.toLocaleString("en-US")} ج.م`;}

function renderProducts(){
  const filtered = products.filter(p =>
    (activeCategory === "الكل" || p.category === activeCategory) &&
    (p.name.includes(searchTerm) || p.category.includes(searchTerm))
  );
  productsGrid.innerHTML = filtered.map(p => `
    <article class="product-card">
      <span class="discount">خصم ${p.discount}</span>
      <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy" style="object-position:left center" onerror="this.onerror=null;this.src=PLACEHOLDER"></div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="price-row"><span class="price">${money(p.price)}</span><span class="old-price">${money(p.old)}</span></div>
        <button class="add-btn" onclick="addToCart(${p.id})">أضف للسلة　🛒</button>
      </div>
    </article>`).join("");
  document.getElementById("resultCount").textContent = `${filtered.length} منتج`;
  document.getElementById("emptyState").hidden = filtered.length !== 0;
}

function addToCart(id){
  const found = cart.find(item => item.id === id);
  if(found) found.qty++;
  else cart.push({id,qty:1});
  renderCart();
  openCart();
}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id);
  if(!item)return;
  item.qty+=delta;
  if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  renderCart();
}
function removeItem(id){cart=cart.filter(x=>x.id!==id);renderCart();}
function renderCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0);
  const total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
  document.getElementById("cartCount").textContent=count;
  document.getElementById("cartTotal").textContent=money(total);
  if(!cart.length){cartItems.innerHTML='<p class="empty-state">السلة فارغة، ابدأ التسوق الآن 🛍️</p>';}
  else cartItems.innerHTML=cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    return `<div class="cart-row"><img src="${p.image}" alt="" onerror="this.onerror=null;this.src=PLACEHOLDER"><div><b>${p.name}</b><small>${money(p.price)}</small><button class="remove-btn" onclick="removeItem(${p.id})">حذف</button></div><div class="quantity"><button onclick="changeQty(${p.id},1)">+</button><b>${item.qty}</b><button onclick="changeQty(${p.id},-1)">−</button></div></div>`;
  }).join("");
}
function openCart(){cartDrawer.classList.add("open");overlay.classList.add("show");}
function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("show");}
document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);

document.querySelectorAll(".category-card").forEach(btn=>btn.addEventListener("click",()=>{
  activeCategory=btn.dataset.category;
  document.querySelectorAll(".category-card").forEach(x=>x.classList.toggle("selected",x===btn));
  renderProducts();
  document.getElementById("products").scrollIntoView({behavior:"smooth"});
}));
document.getElementById("searchInput").addEventListener("input",e=>{
  searchTerm=e.target.value.trim();
  activeCategory="الكل";
  document.querySelectorAll(".category-card").forEach(x=>x.classList.toggle("selected",x.dataset.category==="الكل"));
  renderProducts();
});
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("show"));
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("show")));

const checkoutModal=document.getElementById("checkoutModal");
document.getElementById("checkoutBtn").addEventListener("click",()=>{
  if(!cart.length){alert("السلة فارغة، أضف منتجًا أولًا.");return;}
  closeCart();checkoutModal.classList.add("show");
});
document.getElementById("closeModal").addEventListener("click",()=>checkoutModal.classList.remove("show"));
document.getElementById("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  if(STORE_WHATSAPP==="201000000000"){
    alert("قبل استقبال الطلبات، غيّر رقم واتساب المؤقت داخل ملف script.js إلى رقم المتجر الحقيقي.");
    return;
  }
  const data=new FormData(e.target);
  const lines=cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    return `• ${p.name} × ${item.qty} = ${money(p.price*item.qty)}`;
  }).join("\n");
  const total=cart.reduce((s,item)=>s+products.find(p=>p.id===item.id).price*item.qty,0);
  const message=`طلب جديد من متجر HOMIVA\n\n${lines}\n\nالإجمالي: ${money(total)}\n\nالاسم: ${data.get("name")}\nالموبايل: ${data.get("phone")}\nالعنوان: ${data.get("address")}\nملاحظات: ${data.get("notes")||"لا يوجد"}\n\nطريقة الدفع: عند الاستلام`;
  window.open(`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`,"_blank");
});
document.getElementById("footerWhatsapp").addEventListener("click",e=>{
  e.preventDefault();
  if(STORE_WHATSAPP==="201000000000"){alert("أضف رقم واتساب المتجر داخل ملف script.js أولًا.");return;}
  window.open(`https://wa.me/${STORE_WHATSAPP}`,"_blank");
});
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();
renderCart();
