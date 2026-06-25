const screens = {
  splash:{title:'1. Inicio', img:'assets/1(5).png'},
  login:{title:'2. Iniciar sesión', img:'assets/2(6).png'},
  register:{title:'3. Crear cuenta', img:'assets/3(6).png'},
  forgot:{title:'4. Olvidaste contraseña', img:'assets/4(6).png'},
  search:{title:'5. Buscar cuidadores', img:'assets/5(7).png'},
  list:{title:'6. Lista de cuidadores', img:'assets/6(7).png'},
  caregiver:{title:'7. Perfil cuidador', img:'assets/7(7).png'},
  reserve:{title:'8. Nueva reserva', img:'assets/8(5).png'},
  pet:{title:'9. Información mascota', img:'assets/9(5).png'},
  payment:{title:'10. Método de pago', img:'assets/10(6).png'},
  card:{title:'11. Datos tarjeta', img:'assets/11(5).png'},
  paypal:{title:'12. PayPal', img:'assets/12(5).png'},
  cash:{title:'13. Pago efectivo', img:'assets/13(5).png'},
  success:{title:'14. Confirmación', img:'assets/14(6).png'},
  reservations:{title:'15. Mis reservas', img:'assets/15(5).png'},
  moments:{title:'16. Momentos', img:'assets/16(5).png'},
  unusual:{title:'17. Comportamiento inusual', img:'assets/17(5).png'},
  messages:{title:'18. Mensajes', img:'assets/20(5).png'},
  rating:{title:'19. Calificación', img:'assets/19(7).png'},
  chat:{title:'20. Chat', img:'assets/18(5).png'},
  profile:{title:'21. Perfil usuario', img:'assets/21(7).png'},
};
const navTargets = [
  ['search',5,91,15,7], ['reservations',24,91,15,7], ['moments',43,91,15,7], ['chat',62,91,15,7], ['profile',81,91,15,7]
];
let current='splash';
let selections={caregiverTab:'info', reserveTab:'confirmadas', msgTab:'todos', unusual:'Agresividad', urgency:'Alta', sex:'Macho', size:'Pequeño', sterilized:'Sí', rating:0, payment:'', date:'19', time:'9:00 AM', fav1:false, fav2:false, fav3:false, fav4:false};
const img=document.getElementById('screenImg'), hs=document.getElementById('hotspots'), layer=document.getElementById('selectionLayer'), toastEl=document.getElementById('toast'), phone=document.querySelector('.phoneFrame');
function go(id){ current=id; img.src=screens[id].img; phone.scrollTo({top:0,behavior:'auto'}); document.querySelectorAll('.screenBtn').forEach(b=>b.classList.toggle('active', b.dataset.id===id)); renderHotspots(); }
function add(x,y,w,h, action, label=''){ const b=document.createElement('button'); b.className='hotspot'; b.style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${h}%`; b.title=label; b.onclick=action; hs.appendChild(b); return b; }
function chip(x,y,w,h,cls=''){ const c=document.createElement('div'); c.className='chip '+cls; c.style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${h}%`; layer.appendChild(c); }
function overlay(x,y,w,h,cls='',html=''){ const d=document.createElement('div'); d.className=cls; d.style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${h}%`; d.innerHTML=html; layer.appendChild(d); return d; }
function fixCover(x,y,w,h){ overlay(x,y,w,h,'fixCover soft'); }
function caregiverTabs(){ const labels=[['info','Sobre mí'],['servicios','Servicios'],['reseñas','Reseñas (128)']]; const html=labels.map(([key,label])=>`<div class="tabItem ${selections.caregiverTab===key?'active':''}">${label}</div>`).join(''); overlay(4,38.15,92,5.15,'caregiverTabs',html); }
function reservationTabs(){ const labels=[['confirmadas','Confirmadas'],['pendientes','Pendientes'],['canceladas','Canceladas']]; const html=labels.map(([key,label])=>`<div class="tabItem ${selections.reserveTab===key?'active':''}">${label}</div>`).join(''); overlay(4,11.7,92,5.25,'caregiverTabs reservationTabs',html); }

function messageTabs(){
  const labels=[['todos','Todos'],['no-leidos','No leídos']];
  const html=labels.map(([key,label])=>`<div class="tabItem ${selections.msgTab===key?'active':''}">${label}${key==='no-leidos'?'<span class="tabBadge">2</span>':''}</div>`).join('');
  overlay(4,22,92,5.4,'caregiverTabs messageTabs',html);
}
function selectChoice(group,value,msg){ selections[group]=value; renderHotspots(); toast(msg||value); }
function selectedChoice(x,y,w,h,cls='',label=''){ const d=overlay(x,y,w,h,('chip choice '+cls).trim(), label?`<span>${label}</span>`:''); return d; }
function choiceOption(group,value,x,y,w,h,cls='',label=value,icon=''){ const active=selections[group]===value; const html=`${icon?`<span class="choiceIcon">${icon}</span>`:''}<span class="choiceText">${label}</span>`; overlay(x,y,w,h,('choiceOption '+cls+(active?' selected':'')).trim(),html); add(x,y,w,h,()=>selectChoice(group,value,label+' seleccionado'),label); }
function selectChoiceSilent(group,value){ selections[group]=value; renderHotspots(); }
function petOption(group,value,x,y,w,h,label=value){ const active=selections[group]===value; overlay(x,y,w,h,('choiceOption petChoice p9FixedChoice'+(active?' selected':'')).trim(),`<span class="choiceText">${label}</span>`); add(x,y,w,h,()=>selectChoiceSilent(group,value),label); }
function starButton(i,x,y){ const b=document.createElement('button'); b.className='ratingStar '+(selections.rating>=i?'filled':'empty'); b.textContent=(selections.rating>=i?'★':'☆'); b.style.cssText=`left:${x}%;top:${y}%;width:9%;height:4.8%`; b.title=i+' estrellas'; b.onclick=()=>{selections.rating=i; renderHotspots(); toast(i+'/5 estrellas')}; hs.appendChild(b); }
function toast(t){ toastEl.textContent=t; toastEl.classList.add('show'); setTimeout(()=>toastEl.classList.remove('show'),1400); }
function toggleFav(key,x,y){ selections[key]=!selections[key]; renderHotspots(); toast(selections[key]?'Agregado a favoritos':'Eliminado de favoritos'); }
function favChip(key,x,y){ if(selections[key]) overlay(x-0.8,y-0.5,8.4,5.1,'heartFix'); }
function smoothTo(percent){ const max=Math.max(0, img.clientHeight-phone.clientHeight); const y=Math.max(0, max*(percent/100)); phone.scrollTo({top:y,behavior:'smooth'}); }
function back(){ const map={login:'splash',register:'login',forgot:'login',search:'splash',list:'search',caregiver:'list',reserve:'caregiver',pet:'reserve',payment:'pet',card:'payment',paypal:'payment',cash:'payment',success:'reservations',moments:'reservations',unusual:'moments',rating:'moments',chat:'messages',messages:'search',profile:'search',reservations:'search'}; go(map[current]||'splash'); }
function bottomNav(){ navTargets.forEach(([id,x,y,w,h])=>add(x,y,w,h,()=>go(id),'Menú '+screens[id].title)); }
function renderHotspots(){ hs.innerHTML=''; layer.innerHTML='';
  // back arrow on most screens
  if(current!=='splash') add(2,4,9,7,back,'Regresar');
  if(['search','list','moments','messages','reservations','profile','rating','chat','unusual'].includes(current)) bottomNav();
  switch(current){
    case 'splash': add(10,76,80,8,()=>go('login'),'Iniciar sesión'); add(10,85,80,8,()=>go('search'),'Buscar cuidadores'); break;
    case 'login': add(12,53,76,8,()=>go('search'),'Iniciar sesión'); add(58,45,34,5,()=>go('forgot'),'Olvidaste contraseña'); add(58,81,28,5,()=>go('register'),'Regístrate'); break;
    case 'register': add(10,75,72,7,()=>go('search'),'Crear cuenta'); add(56,83,26,5,()=>go('login'),'Iniciar sesión'); break;
    case 'forgot': add(10,63,80,7,()=>toast('Instrucciones enviadas')); add(30,74,48,5,()=>go('login'),'Volver'); break;
    case 'search':
      // Pantalla 5: se elimina visualmente el icono de menú hamburguesa (☰) sin afectar la navegación.
      overlay(5.0,6.2,9.0,5.0,'hamburgerCover');
      add(10,80,80,8,()=>go('list'),'Buscar cuidadores'); break;
    case 'list': add(72,35,20,6,()=>go('caregiver'),'Ver perfil'); add(72,52,20,6,()=>go('caregiver'),'Ver perfil'); add(72,69,20,6,()=>go('caregiver'),'Ver perfil'); add(72,86,20,6,()=>go('caregiver'),'Ver perfil'); add(88,24,7,5,()=>toggleFav('fav1',88,24),'Favorito'); add(88,42,7,5,()=>toggleFav('fav2',88,42),'Favorito'); add(88,60,7,5,()=>toggleFav('fav3',88,60),'Favorito'); add(88,77,7,5,()=>toggleFav('fav4',88,77),'Favorito'); favChip('fav1',88,24); favChip('fav2',88,42); favChip('fav3',88,60); favChip('fav4',88,77); break;
    case 'caregiver':
      add(82,5,8,6,()=>toggleFav('fav1',82,5),'Favorito'); favChip('fav1',82,5);
      // Pestañas con el mismo formato visual de "Sobre mí": texto activo lila + subrayado.
      caregiverTabs();
      add(4,38.15,30.5,5.15,()=>{selections.caregiverTab='info'; renderHotspots(); smoothTo(0); toast('Sobre mí activo')},'Sobre mí');
      add(34.7,38.15,30.5,5.15,()=>{selections.caregiverTab='servicios'; renderHotspots(); smoothTo(48); toast('Servicios activo')},'Servicios');
      add(65.3,38.15,30.5,5.15,()=>{selections.caregiverTab='reseñas'; renderHotspots(); smoothTo(78); toast('Reseñas activa')},'Reseñas');
      add(52,95,46,5,()=>go('reserve'),'Reservar'); add(3,95,46,5,()=>go('chat'),'Mensaje');
      break;
    case 'reserve':
      add(5,41,9,7,()=>toast('Semana anterior')); add(84,41,9,7,()=>toast('Semana siguiente'));
      // Pantalla 8: se cubre la zona conflictiva y se dibuja una retícula limpia y alineada.
      fixCover(5.0,38.0,90.0,8.6);
      [['14',6.6],['15',19.2],['16',31.8],['17',44.4],['18',57.0],['19',69.6],['20',82.2]].forEach(([v,x])=>choiceOption('date',v,x,40.3,8.6,4.2,'dateChoice',v,''));
      fixCover(4.8,49.1,90.4,10.4);
      [['8:00 AM',5.7,50.0],['8:30 AM',23.5,50.0],['9:00 AM',41.3,50.0],['9:30 AM',59.1,50.0],['10:00 AM',76.9,50.0],['10:30 AM',5.7,55.0],['11:00 AM',23.5,55.0],['11:30 AM',41.3,55.0],['12:00 PM',59.1,55.0],['12:30 PM',76.9,55.0]].forEach(([v,x,y])=>choiceOption('time',v,x,y,16.0,3.7,'timeChoice',v,''));
      add(44,94,50,5,()=>go('pet'),'Continuar'); break;
    case 'pet':
      // Pantalla 9 corregida: selección única sin texto descriptivo ni desplazamientos.
      // Se cubren los botones originales y se redibujan con una retícula fija.
      fixCover(5.8,50.8,88.4,7.2);
      petOption('sex','Macho',7.0,52.0,41.0,5.0,'Macho');
      petOption('sex','Hembra',52.0,52.0,41.0,5.0,'Hembra');
      fixCover(5.8,60.6,88.4,8.2);
      petOption('size','Pequeño',7.0,62.0,27.2,5.8,'Pequeño');
      petOption('size','Mediano',36.4,62.0,27.2,5.8,'Mediano');
      petOption('size','Grande',65.8,62.0,27.2,5.8,'Grande');
      fixCover(5.8,71.8,88.4,8.7);
      petOption('sterilized','Sí',7.0,73.0,41.0,5.0,'Sí');
      petOption('sterilized','No',52.0,73.0,41.0,5.0,'No');
      add(4,94,92,5,()=>go('payment'),'Continuar'); break;
    case 'payment': add(4,48,92,10,()=>{selections.payment='card';go('card')},'Tarjeta'); add(4,61,92,10,()=>{selections.payment='paypal';go('paypal')},'PayPal'); add(4,74,92,10,()=>{selections.payment='cash';go('cash')},'Efectivo'); break;
    case 'card': add(6,87,88,6,()=>go('success'),'Pagar'); break;
    case 'paypal': add(10,78,80,7,()=>go('success'),'Continuar con PayPal'); break;
    case 'cash': add(7,85,86,7,()=>go('success'),'Confirmar reserva'); break;
    case 'success': add(8,84,84,7,()=>go('reservations'),'Ver mis reservas'); break;
    case 'reservations':
      // Mis reservas: misma interacción visual que la pantalla 7.
      // La pestaña activa queda en lila, las demás se deseleccionan y el subrayado cambia suavemente.
      reservationTabs();
      add(4,11.7,30.7,5.25,()=>{selections.reserveTab='confirmadas';renderHotspots();smoothTo(0);toast('Confirmadas activas')},'Confirmadas');
      add(34.7,11.7,30.6,5.25,()=>{selections.reserveTab='pendientes';renderHotspots();smoothTo(58);toast('Pendientes activas')},'Pendientes');
      add(65.3,11.7,30.7,5.25,()=>{selections.reserveTab='canceladas';renderHotspots();smoothTo(86);toast('Canceladas activas')},'Canceladas');
      add(71,36,20,4,()=>go('moments'),'Ver detalles'); add(72,53,18,4,()=>go('rating'),'Calificar'); break;
    case 'moments': add(5,83,43,6,()=>go('unusual'),'Comportamiento inusual'); add(52,83,43,6,()=>go('rating'),'Calificar servicio'); break;
    case 'unusual':
      // Pantalla 17: cuadrícula reconstruida para evitar desalineación entre botones.
      fixCover(4.4,27.2,91.2,13.8);
      choiceOption('unusual','Agresividad',5.2,28.0,42.8,5.2,'unusualChoice','Agresividad','⚠');
      choiceOption('unusual','Miedo o estrés',52.0,28.0,42.8,5.2,'unusualChoice','Miedo o estrés','🐾');
      choiceOption('unusual','Lesión o enfermedad',5.2,35.0,42.8,5.2,'unusualChoice','Lesión o enfermedad','✚');
      choiceOption('unusual','Desobediencia',52.0,35.0,42.8,5.2,'unusualChoice','Desobediencia','🐕');
      // Nivel de urgencia corregido: no se cubre ni se redibuja el botón Enviar reporte.
      // Se conserva el botón original de la imagen para evitar desfase lateral.
      // Solo se superpone la opción activa con las mismas dimensiones de los botones originales.
      choiceOption('urgency','Alta',4.7,77.05,26.6,3.15,'urgencyChoice compactUrgency','Alta','!');
      choiceOption('urgency','Media',35.1,77.05,27.4,3.15,'urgencyChoice compactUrgency','Media','!');
      choiceOption('urgency','Baja',66.5,77.05,27.4,3.15,'urgencyChoice compactUrgency','Baja','!');
      overlay(3.7,81.5,92.6,3.9,'sendReportButton','<span>✈</span><strong>Enviar mensaje</strong>');
      add(3.7,81.5,92.6,3.9,()=>go('messages'),'Enviar mensaje'); break;
    case 'rating':
      // Estrellas independientes y progresivas. No se agrega texto debajo.
      // Se cubre el texto fijo de la imagen para que solo quede la interacción visual de estrellas.
      overlay(14,25.2,72,11.5,'ratingCover');
      const xs=[19.5,32.0,44.5,57.0,69.5];
      for(let i=1;i<=5;i++) starButton(i,xs[i-1],26.9);
      add(4,84,92,6,()=>{ if(selections.rating<1){ toast('Selecciona una calificación'); } else { toast('Calificación enviada'); } });
      break;
    case 'messages':
      // Pantalla 18: barra inferior con Chat en estado inactivo (imagen 20 ajustada solo para esta pantalla).
      // Pantalla 20: pestañas Todos / No leídos con el mismo componente visual y lógica de pantalla 15.
      // Solo una pestaña queda activa; al tocar la otra, la anterior vuelve a su estado original.
      messageTabs();
      add(4,22,46,5.4,()=>{selections.msgTab='todos';renderHotspots();toast('Todos seleccionado')},'Todos');
      add(50,22,46,5.4,()=>{selections.msgTab='no-leidos';renderHotspots();toast('No leídos seleccionado')},'No leídos');
      if(selections.msgTab==='todos'){
        add(5,35,90,10,()=>go('chat'),'Conversación María Fernanda');
        add(5,48,90,10,()=>go('chat'),'Conversación Carlos López');
        add(5,61,90,10,()=>go('chat'),'Conversación Valeria Torres');
      } else {
        // Al activar No leídos se oculta la conversación ya leída (Valeria Torres)
        // y solo permanecen visibles las conversaciones con contador de mensajes.
        // Cubre completamente la conversación leída (Valeria Torres) para que no quede visible.
        // Se inicia un poco antes del renglón y termina antes de la tarjeta de ayuda.
        overlay(0,54.2,100,17.2,'messagesHideRead');
        add(5,35,90,10,()=>go('chat'),'Mensaje no leído de María Fernanda');
        add(5,48,90,10,()=>go('chat'),'Mensaje no leído de Carlos López');
      }
      break;
    case 'chat': add(4,12,92,7,()=>toast('Detalles de reserva')); add(4,86,38,5,()=>toast('Llamando al cuidador')); break;
    case 'profile': add(37,35,30,4,()=>toast('Cambiar foto')); add(9,68,82,5,()=>toast('Perfil actualizado')); add(9,74,82,5,()=>go('search')); break;
  }
}
const list=document.getElementById('screenList');
Object.entries(screens).forEach(([id,s])=>{const b=document.createElement('button'); b.className='screenBtn'; b.dataset.id=id; b.textContent=s.title; b.onclick=()=>go(id); list.appendChild(b);});
document.getElementById('startBtn').onclick=()=>go('splash');
go('splash');
