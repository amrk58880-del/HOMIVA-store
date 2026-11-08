// غيّر رقم واتساب إلى رقم المتجر بصيغة دولية بدون + أو مسافات.
const STORE_WHATSAPP = "201000000000"; // مثال مصري مؤقت — استبدله برقمك الحقيقي

const products = [
  {id:1,name:"طقم حلل جرانيت",category:"أدوات المطبخ",price:899,old:1200,image:"https://images.unsplash.com/photo-1584990347449-a8a2f1c3b3b3?auto=format&fit=crop&w=700&q=80",discount:"25%"},
  {id:2,name:"طقم أطباق فاخر",category:"أدوات المطبخ",price:599,old:750,image:"https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=700&q=80",discount:"20%"},
  {id:3,name:"قلاية هوائية",category:"الأجهزة الصغيرة",price:1950,old:3000,image:"https://images.unsplash.com/photo-1648047932015-3e9f4d8f1f1c?auto=format&fit=crop&w=700&q=80",discount:"35%"},
  {id:4,name:"علب تخزين متعددة الأحجام",category:"تنظيم المنزل",price:299,old:400,image:"https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=700&q=80",discount:"25%"},
  {id:5,name:"مساحة أرضيات عملية",category:"أدوات التنظيف",price:315,old:450,image:"https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80",discount:"30%"},
  {id:6,name:"طقم فوط قطنية",category:"المفروشات",price:249,old:320,image:"https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=700&q=80",discount:"22%"},
  {id:7,name:"غلاية مياه كهربائية",category:"الأجهزة الصغيرة",price:650,old:800,image:"https://images.unsplash.com/photo-1594213114663-d94db9b1716?auto=format&fit=crop&w=700&q=80",discount:"18%"},
  {id:8,name:"منظم أدوات المطبخ",category:"تنظيم المنزل",price:180,old:230,image:"https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=700&q=80",discount:"20%"}
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
      <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=700&q=80'"></div>
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
    return `<div class="cart-row"><img src="${p.image}" alt=""><div><b>${p.name}</b><small>${money(p.price)}</small><button class="remove-btn" onclick="removeItem(${p.id})">حذف</button></div><div class="quantity"><button onclick="changeQty(${p.id},1)">+</button><b>${item.qty}</b><button onclick="changeQty(${p.id},-1)">−</button></div></div>`;
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
