// ====== Datos base de los sistemas ======
const SYSTEMS = [
  {id:'atmosfera',nombre:'Atmósfera',color:'#4FC3F7',imagen:'assets/atmosfera.jpg',pdf:'assets/atmosfera.pdf',chips:['Troposfera','Estratosfera','Mesosfera','Termosfera','Exosfera'],subsistemas:[{titulo:'Troposfera',texto:'Capa más baja, donde ocurre el clima y se concentra el vapor de agua.'},{titulo:'Estratosfera',texto:'Contiene la capa de ozono, filtra radiación UV.'},{titulo:'Mesosfera',texto:'Quema la mayoría de meteoros; temperaturas muy bajas.'},{titulo:'Termosfera',texto:'Alta energía solar; auroras y órbitas de satélites bajos.'},{titulo:'Exosfera',texto:'Transición al espacio; gases muy dispersos.'}]},
  {id:'hidrosfera',nombre:'Hidrosfera',color:'#29B6F6',imagen:'assets/hidrosfera.jpg',pdf:'assets/hidrosfera.pdf',chips:['Océanos','Aguas continentales','Aguas subterráneas','Criosfera','Vapor de agua'],subsistemas:[{titulo:'Océanos',texto:'Regulan clima y almacenan calor; grandes reservorios de carbono.'},{titulo:'Aguas continentales',texto:'Ríos, lagos y humedales: ciclo del agua y hábitats cruciales.'},{titulo:'Aguas subterráneas',texto:'Acuíferos que abastecen consumo y riego; vulnerables a contaminación.'},{titulo:'Criosfera',texto:'Hielo y glaciares; reflejan radiación (albedo) y regulan nivel del mar.'},{titulo:'Vapor de agua',texto:'Gas de efecto invernadero clave; motor del clima y precipitación.'}]},
  {id:'geosfera',nombre:'Geosfera',color:'#FFCA28',imagen:'assets/geosfera.jpg',pdf:'assets/geosfera.pdf',chips:['Corteza','Manto','Núcleo','Tectónica de placas','Relieve'],subsistemas:[{titulo:'Corteza',texto:'Capa sólida superficial; continental y oceánica.'},{titulo:'Manto',texto:'Rocoso y convectivo; impulsa el movimiento de placas.'},{titulo:'Núcleo',texto:'Externo líquido e interno sólido; genera campo magnético.'},{titulo:'Tectónica de placas',texto:'Sismicidad, vulcanismo y formación de montañas.'},{titulo:'Relieve',texto:'Modelado por procesos internos y externos (erosión, sedimentación).'}]},
  {id:'biosfera',nombre:'Biosfera',color:'#66BB6A',imagen:'assets/biosfera.jpg',pdf:'assets/biosfera.pdf',chips:['Ecosistemas','Biomas','Biodiversidad','Ciclos biogeoquímicos'],subsistemas:[{titulo:'Ecosistemas',texto:'Interacciones entre seres vivos y ambiente físico.'},{titulo:'Biomas',texto:'Grandes regiones con clima y comunidades típicas (bosque, desierto, tundra).'},{titulo:'Biodiversidad',texto:'Variedad genética, de especies y ecosistemas; base de resiliencia.'},{titulo:'Ciclos biogeoquímicos',texto:'Ciclos del carbono, nitrógeno, fósforo; conectan todos los sistemas.'}]}
];

// ====== Utils ======
const qs = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => [...el.querySelectorAll(s)];

// ====== Modal ======
const modalEl = qs('#systemModal');
const modalBody = qs('#modalBody');
const modalCloseBtn = qs('.modal-close');
qs('.modal-content').addEventListener('click', (e) => e.stopPropagation());

// ====== Carga de actividades desde JSON ======
const activitiesCache = new Map();
async function loadActivities(systemId){
  if(activitiesCache.has(systemId)) return activitiesCache.get(systemId);
  const url = `assets/actividades/${systemId}.json`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if(!res.ok) throw new Error(res.statusText || 'Error de red');
    const data = await res.json();
    if(!Array.isArray(data)) throw new Error('El JSON debe ser un array');
    activitiesCache.set(systemId, data);
    return data;
  } catch(err){
    console.error('Error cargando actividades', systemId, err);
    return [];
  }
}

// ====== Render de actividad (solo ejecución) ======
function renderActivityCard(act, idx){
  const wrap = document.createElement('div');
  wrap.className = 'activity';
  wrap.innerHTML = `<h5>${act.titulo || 'Actividad'}</h5>${act.descripcion?`<p>${act.descripcion}</p>`:''}<div class="activity-ui"></div>`;
  const ui = qs('.activity-ui', wrap);

  if (act.type === 'multiple') {
    const group = `g_${idx}_${Math.random().toString(36).slice(2)}`;
    const html = [`<div class="quiz"><p><strong>${act.pregunta||'Pregunta'}</strong></p>`];
    (act.opciones||[]).forEach((op,i)=>{
      const o = (typeof op === 'string') ? {texto: op, correcta:false} : op;
      html.push(`<label class="option"><input type="radio" name="${group}" value="${i}"><span>${o.texto}</span></label>`);
    });
    html.push(`<div class="form-actions"><button class="primary" data-check>Comprobar</button><button class="secondary" data-reset>Reiniciar</button></div><div class="feedback" aria-live="polite"></div></div>`);
    ui.innerHTML = html.join('');
    const feedback = qs('.feedback', ui);
    qs('[data-check]', ui).addEventListener('click', ()=>{
      const sel = ui.querySelector(`input[name="${group}"]:checked`);
      if(!sel){ feedback.textContent = 'Selecciona una opción'; feedback.className='feedback'; return; }
      const i = Number(sel.value);
      const opt = act.opciones[i] || {};
      const correct = (typeof opt === 'object' && opt.correcta === true);
      feedback.textContent = correct ? '✔ ¡Correcto!' : '✘ No es correcto';
      feedback.className = 'feedback ' + (correct?'ok':'err');
    });
    qs('[data-reset]', ui).addEventListener('click', ()=>{
      ui.querySelectorAll(`input[name="${group}"]`).forEach(r=> r.checked=false);
      feedback.textContent=''; feedback.className='feedback';
    });
  }
  else if (act.type === 'truefalse') {
    ui.innerHTML = `<p><strong>${act.afirmacion||'Afirmación'}</strong></p><div class="truefalse"><button data-v="true">Verdadero</button><button data-v="false">Falso</button></div><div class="form-actions"><button class="primary" data-check>Comprobar</button><button class="secondary" data-reset>Reiniciar</button></div><div class="feedback" aria-live="polite"></div>`;
    let sel = null;
    qsa('.truefalse button', ui).forEach(b=>{
      b.addEventListener('click', ()=>{
        qsa('.truefalse button', ui).forEach(x=>x.classList.remove('active'));
        b.classList.add('active'); sel = b.getAttribute('data-v')==='true';
      });
    });
    const fb = qs('.feedback', ui);
    qs('[data-check]', ui).addEventListener('click', ()=>{
      if(sel===null){ fb.textContent='Selecciona Verdadero o Falso'; fb.className='feedback'; return; }
      const correct = (act.correcta === true) === (sel === true);
      fb.textContent = correct ? '✔ ¡Correcto!' : '✘ No es correcto';
      fb.className = 'feedback ' + (correct?'ok':'err');
    });
    qs('[data-reset]', ui).addEventListener('click', ()=>{ sel=null; qsa('.truefalse button', ui).forEach(x=>x.classList.remove('active')); fb.textContent=''; fb.className='feedback'; });
  }
  else if (act.type === 'order') {
    const correctOrder = (act.pasos||[]).slice();
    const shuffled = (act.pasos||[]).slice().sort(()=>Math.random()-0.5);
    const ul = document.createElement('ul'); ul.className='order-list';
    shuffled.forEach((txt)=>{
      const li = document.createElement('li');
      li.setAttribute('draggable','true');
      li.innerHTML = `<button class="order-handle" title="Arrastrar">☰</button> <span>${txt}</span>`;
      ul.appendChild(li);
    });
    ui.appendChild(ul);
    let dragEl=null;
    ul.addEventListener('dragstart', e=>{ const li=e.target.closest('li'); if(!li) return; dragEl=li; e.dataTransfer.effectAllowed='move';});
    ul.addEventListener('dragover', e=>{ e.preventDefault(); const li=e.target.closest('li'); if(!li||li===dragEl) return; const rect = li.getBoundingClientRect(); const after = (e.clientY - rect.top) > rect.height/2; ul.insertBefore(dragEl, after? li.nextSibling : li); });
    ul.addEventListener('drop', e=>{ e.preventDefault(); dragEl=null; });
    const controls = document.createElement('div'); controls.className='order-controls';
    controls.innerHTML = `<button class="primary" data-check>Comprobar</button><button class="secondary" data-reset>Reiniciar</button><div class="feedback" aria-live="polite"></div>`;
    ui.appendChild(controls);
    const fb = qs('.feedback', controls);
    qs('[data-check]', controls).addEventListener('click', ()=>{
      const current = [...ul.querySelectorAll('li span')].map(s=>s.textContent);
      const ok = current.length===correctOrder.length && current.every((t,i)=>t===correctOrder[i]);
      fb.textContent = ok ? '✔ ¡Orden correcto!' : '✘ El orden no es correcto';
      fb.className='feedback ' + (ok?'ok':'err');
    });
    qs('[data-reset]', controls).addEventListener('click', ()=>{
      ul.innerHTML=''; shuffled.sort(()=>Math.random()-0.5).forEach(txt=>{ const li=document.createElement('li'); li.setAttribute('draggable','true'); li.innerHTML=`<button class="order-handle" title="Arrastrar">☰</button> <span>${txt}</span>`; ul.appendChild(li); }); fb.textContent=''; fb.className='feedback';
    });
  }
  return wrap;
}

async function renderActivitiesFor(systemId){
  const cont = qs('#activityList', modalBody);
  cont.innerHTML = '<p>Cargando actividades…</p>';
  const acts = await loadActivities(systemId);
  if(acts.length===0){ cont.innerHTML = '<p>No hay actividades cargadas para este sistema.</p>'; return; }
  cont.innerHTML = '';
  acts.forEach((a,i)=> cont.appendChild(renderActivityCard(a,i)) );
}

// ====== Modal principal ======
function openModalFor(systemId){
  const sys = SYSTEMS.find(s => s.id === systemId);
  if(!sys) return;
  modalEl.setAttribute('aria-hidden', 'false');

  modalBody.innerHTML = `
    <header class="modal-header">
      <img src="${sys.imagen}" alt="${sys.nombre}" />
      <div>
        <h3 id="modalTitle" class="modal-title" style="color:${sys.color}">${sys.nombre}</h3>
        <div class="chips">${sys.chips.map(c => `<span class="chip">${c}</span>`).join('')}</div>
      </div>
    </header>
    <div class="modal-tabs" role="tablist">
      <button role="tab" class="modal-tab active" aria-selected="true" data-panel="info">Información</button>
      <button role="tab" class="modal-tab" aria-selected="false" data-panel="actividades">Actividades</button>
      <a class="btn" target="_blank" rel="noopener" href="${sys.pdf}">PDF del sistema ↗</a>
    </div>

    <section id="panel-info" class="modal-panel active" role="tabpanel" aria-label="Información">
      <div class="subsystems">
        ${sys.subsistemas.map(sbs => `<article class="card"><h4>${sbs.titulo}</h4><p>${sbs.texto}</p></article>`).join('')}
      </div>
    </section>

    <section id="panel-actividades" class="modal-panel" role="tabpanel" aria-label="Actividades">
      <div id="activityList" class="activity-list" aria-live="polite"></div>
    </section>`;

  // Tabs del modal
  qsa('.modal-tab[role="tab"]', modalBody).forEach(btn => {
    const panel = btn.getAttribute('data-panel');
    btn.addEventListener('click', () => {
      qsa('.modal-tab[role="tab"]', modalBody).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      qsa('.modal-panel[role="tabpanel"]', modalBody).forEach(p => p.classList.remove('active'));
      qs(`#panel-${panel}`, modalBody).classList.add('active');
      btn.setAttribute('aria-selected','true');
      if(panel==='actividades'){ renderActivitiesFor(systemId); }
    });
  });

  // Render inicial de actividades
  renderActivitiesFor(systemId);
}

// ====== Cerrar modal ======
function closeModal(){ modalEl.setAttribute('aria-hidden','true'); qs('#modalBody').innerHTML=''; }
qs('.modal-backdrop').addEventListener('click', closeModal);
modalCloseBtn.addEventListener('click', closeModal);
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && modalEl.getAttribute('aria-hidden')==='false'){ closeModal(); }});

// ====== Hotspots del SVG ======
qsa('.hotspot').forEach(h => {
  h.addEventListener('click', () => openModalFor(h.getAttribute('data-system')));
  h.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openModalFor(h.getAttribute('data-system')); }});
});

// ====== Tabs de Material docente ======
qsa('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    qsa('.tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
    tab.classList.add('active'); tab.setAttribute('aria-selected','true');
    const id = tab.getAttribute('data-tab');
    qsa('.tab-panel').forEach(p => p.classList.remove('active'));
    qs(`#${id}`).classList.add('active');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();
