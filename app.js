/* =============== 数据层 =============== */
/* 六年级女生 7 项评分表（《国家学生体质健康标准 2014 修订》）
   分数档：优秀 100/95/90，良好 85/80，及格 78..60 共 10 档，不及格 50/40/30/20/10
   五项六年级女生完整表格，BMI 另算 */
const ITEMS = [
  {code:'bmi',name:'BMI',unit:'kg/m²',weight:0.15,type:'bmi'},
  {code:'vital',name:'肺活量',unit:'ml',weight:0.15,type:'asc'},
  {code:'run50',name:'50 米跑',unit:'秒',weight:0.20,type:'desc'},
  {code:'sitfwd',name:'坐位体前屈',unit:'cm',weight:0.10,type:'asc'},
  {code:'rope',name:'一分钟跳绳',unit:'次',weight:0.10,type:'asc',bonus:{max:20,rate:2}},
  {code:'situp',name:'一分钟仰卧起坐',unit:'次',weight:0.20,type:'asc'},
  {code:'run50x8',name:'50 米×8 往返跑',unit:'分:秒',weight:0.10,type:'desc'}
];

/* 六年级女生完整评分表（每档分数对应值，asc 越大越好，desc 越小越好） */
const GIRL_G6 = {
  vital:{ // 肺活量 ml
    100:2500,95:2400,90:2300,85:2200,80:2100,
    78:2010,76:1920,74:1830,72:1740,70:1650,68:1560,66:1470,64:1380,62:1290,60:1200,
    50:1170,40:1140,30:1110,20:1080,10:1050
  },
  run50:{ // 秒
    100:8.2,95:8.3,90:8.4,85:8.7,80:9.0,
    78:9.2,76:9.4,74:9.6,72:9.8,70:10.0,68:10.2,66:10.4,64:10.6,62:10.8,60:11.0,
    50:11.2,40:11.4,30:11.6,20:11.8,10:12.0
  },
  sitfwd:{ // cm
    100:19.9,95:18.7,90:17.5,85:15.2,80:12.9,
    78:11.8,76:10.7,74:9.6,72:8.5,70:7.4,68:6.3,66:5.2,64:4.1,62:3.0,60:1.9,
    50:1.1,40:0.3,30:-0.5,20:-1.3,10:-2.1
  },
  rope:{ // 次（满分以上可加分，每多 2 次 +1 分，最多 +20）
    100:166,95:158,90:150,85:142,80:134,
    78:129,76:124,74:119,72:114,70:109,68:104,66:99,64:94,62:89,60:84,
    50:80,40:76,30:72,20:68,10:64
  },
  situp:{ // 次（根据 2014 标准六年级女生满分约 51，及格约 22）
    100:51,95:46,90:41,85:36,80:31,
    78:29,76:27,74:25,72:23,70:22,68:22,66:22,64:22,62:22,60:22,
    50:20,40:18,30:16,20:14,10:12
  },
  run50x8:{ // 秒（六年级女生满分约 97 秒 = 1'37"）
    100:97,95:99,90:101,85:103,80:105,
    78:107,76:109,74:111,72:113,70:115,68:117,66:119,64:121,62:123,60:125,
    50:127,40:129,30:131,20:133,10:135
  }
};

/* 五年级女生（对照用） */
const GIRL_G5 = {
  vital:{100:2250,95:2150,90:2050,85:1950,80:1850,
    78:1770,76:1690,74:1610,72:1530,70:1450,68:1370,66:1290,64:1210,62:1130,60:1050,
    50:1020,40:990,30:960,20:930,10:900},
  run50:{100:8.3,95:8.4,90:8.5,85:8.8,80:9.1,
    78:9.3,76:9.5,74:9.7,72:9.9,70:10.1,68:10.3,66:10.5,64:10.7,62:10.9,60:11.1,
    50:11.3,40:11.5,30:11.7,20:11.9,10:12.1},
  sitfwd:{100:19.8,95:18.5,90:17.2,85:15.1,80:13.0,
    78:11.9,76:10.8,74:9.7,72:8.6,70:7.5,68:6.4,66:5.3,64:4.2,62:3.1,60:2.0,
    50:1.3,40:0.6,30:-0.1,20:-0.8,10:-1.5},
  rope:{100:158,95:150,90:142,85:134,80:126,
    78:121,76:116,74:111,72:106,70:101,68:96,66:91,64:86,62:81,60:76,
    50:73,40:70,30:67,20:64,10:61},
  situp:{100:49,95:44,90:39,85:34,80:29,
    78:27,76:25,74:23,72:21,70:20,68:20,66:20,64:20,62:20,60:20,
    50:18,40:16,30:14,20:12,10:10},
  run50x8:{100:99,95:101,90:103,85:105,80:107,
    78:109,76:111,74:113,72:115,70:117,68:119,66:121,64:123,62:125,60:127,
    50:129,40:131,30:133,20:135,10:137}
};

/* BMI 女生（五、六年级）——正常即满分100，低/超重80，肥胖60 */
const BMI_F = {
  5:{normal:[13.8,20.5],low:13.7,over:[20.6,22.9],obese:23.0},
  6:{normal:[14.2,20.8],low:14.1,over:[20.9,23.6],obese:23.7}
};

const STD_BY_GRADE = {5:GIRL_G5,6:GIRL_G6};

/* =============== 工具函数 =============== */
const $ = s=>document.querySelector(s);
const $$ = s=>document.querySelectorAll(s);
const fmtDate = d=>{d=new Date(d||Date.now());return d.toISOString().slice(0,10);};
const parseRunTime = v=>{
  /* 支持 "1:37" 或 97 */
  if(typeof v==='number')return v;
  if(typeof v==='string'){
    if(v.includes(':')){
      const [m,s]=v.split(':').map(Number);
      return m*60+s;
    }
    return Number(v);
  }
  return NaN;
};
const fmtRunTime = s=>{
  if(s===undefined||s===null||isNaN(s))return '—';
  const m=Math.floor(s/60), sec=s%60;
  return `${m}'${sec.toString().padStart(2,'0')}"`;
};
const showToast=(msg,ms=1800)=>{
  const t=$('#toast');t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),ms);
};

/* =============== 判级 =============== */
function scoreOf(code, value, grade=6){
  /* 返回单项分 0–100 或 null */
  const item=ITEMS.find(i=>i.code===code);
  if(!item||value===''||value==null||isNaN(value))return null;
  if(item.type==='bmi'){
    const bmi=Number(value);
    const r=BMI_F[grade];
    if(bmi>=r.normal[0]&&bmi<=r.normal[1])return 100;
    if(bmi<=r.low||(bmi>=r.over[0]&&bmi<=r.over[1]))return 80;
    if(bmi>=r.obese)return 60;
    return null;
  }
  const table=STD_BY_GRADE[grade][code];
  if(!table)return null;
  let best=null;
  if(item.type==='asc'){
    const entries=Object.entries(table).map(([k,v])=>[Number(k),v]).sort((a,b)=>b[1]-a[1]);
    for(const [s,thr] of entries){
      if(value>=thr){best=s;break;}
    }
  }else{ // desc
    const entries=Object.entries(table).map(([k,v])=>[Number(k),v]).sort((a,b)=>a[1]-b[1]);
    for(const [s,thr] of entries){
      if(value<=thr){best=s;break;}
    }
  }
  return best!=null?best:10;
}
function levelOf(score){
  if(score==null)return '—';
  if(score>=90)return {label:'优秀',cls:'lev-good',pill:'pill-good'};
  if(score>=80)return {label:'良好',cls:'lev-good',pill:'pill-good'};
  if(score>=60)return {label:'及格',cls:'lev-pass',pill:'pill-pass'};
  return {label:'不及格',cls:'lev-fail',pill:'pill-fail'};
}

/* =============== 存储 =============== */
const LS = {
  get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}},
  set(k,v){localStorage.setItem(k,JSON.stringify(v));}
};
const DEFAULTS = {
  profile:{name:'小欣',grade:5,height:150,weight:40,examDate:''},
  checkins:[],   // {date,items:[{code,value}],streak:true}
  scores:[]      // 成绩记录（每次单项或模拟）{id,date,code,value,grade,source:'practice'|'mock'|'official'}
};
let State = {
  profile: LS.get('pecei_profile', DEFAULTS.profile),
  checkins: LS.get('pecei_checkins', []),
  scores: LS.get('pecei_scores', []),
  activeGrade: LS.get('pecei_activeGrade', 6)
};
function persist(){
  LS.set('pecei_profile',State.profile);
  LS.set('pecei_checkins',State.checkins);
  LS.set('pecei_scores',State.scores);
  LS.set('pecei_activeGrade',State.activeGrade);
}

/* 默认体测日期：六年级第一学期 9 月 30 日（下一年） */
if(!State.profile.examDate){
  const y=new Date().getFullYear();
  const curG=State.profile.grade;
  const targetYear = curG<=5? y+1 : y;
  State.profile.examDate=`${targetYear}-09-30`;
  persist();
}

/* =============== App =============== */
const App = {
  init(){
    this.renderProfileForm();
    this.renderStandard();
    this.switchTab('home');
  },
  switchTab(name){
    $$('.view').forEach(v=>v.classList.remove('active'));
    $$('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===name));
    const v=$(`.view[data-view="${name}"]`);
    if(v)v.classList.add('active');
    const titles={home:'🏠 首页',standard:'📖 体测标准',checkin:'✅ 打卡',records:'📋 训练记录',profile:'👤 我的'};
    $('#pageTitle').textContent = titles[name];
    const subs={home:`你好，${State.profile.name||'小朋友'}！加油练起来～`,standard:`当前查看：${State.activeGrade==5?'五年级':'六年级'} · 女生标准`,
      checkin:`坚持打卡，连续 ${this.calcStreak()} 天`,records:`每一次进步都值得记录`,profile:'配置孩子信息和体测日期'};
    $('#pageSub').textContent = subs[name];

    if(name==='home')this.renderHome();
    if(name==='checkin')this.renderCheckin();
    if(name==='records')this.renderRecords();
    if(name==='standard')this.renderStandard();
  },

  /* ========== 首页 ========== */
  renderHome(){
    // 倒计时
    const today=new Date(); today.setHours(0,0,0,0);
    const exam=new Date(State.profile.examDate||`${today.getFullYear()+1}-09-30`);
    exam.setHours(0,0,0,0);
    const days=Math.ceil((exam-today)/86400000);
    $('#daysLeft').textContent = days>=0?days:'已过期';

    // 阶段
    let stage, tip;
    if(days<0){stage='体测已过';tip='查看成绩，继续进步';}
    else if(days>=90){stage='习惯养成期';tip='每周 4 次训练，每次 30 分钟，打好基础';}
    else if(days>=30){stage='强化提升期';tip='弱项项目重点突击，可开始每周 1 次模拟测';}
    else if(days>=7){stage='冲刺模拟期';tip='每周 2 次完整模拟测，模拟真实考试';}
    else{stage='考前调整期';tip='减量训练，保持规律作息，准备装备';}
    $('#stageName').textContent = stage;
    $('#stageTip').textContent = tip;

    // 连续打卡
    const streak=this.calcStreak();
    $('#streakDays').textContent=streak;
    const weekCount=this.weekCheckinCount();
    $('#weekCount').textContent=weekCount;

    // 最近 7 天打卡
    const row=$('#streakRow');row.innerHTML='';
    const todayD=new Date();
    for(let i=6;i>=0;i--){
      const d=new Date(todayD);d.setDate(d.getDate()-i);
      const key=fmtDate(d);
      const on=State.checkins.some(c=>c.date===key);
      const dot=document.createElement('div');
      dot.className='streak-dot'+(on?' on':'');
      dot.title=key + (on?' 已打卡':'');
      row.appendChild(dot);
    }

    // 最近一次成绩
    const latest=this.latestPerItem();
    const box=$('#latestScores');box.innerHTML='';
    const hasAny=Object.values(latest).some(v=>v);
    if(!hasAny){
      box.innerHTML='<div class="empty" style="grid-column:1/-1;">还没有成绩记录，先去「记录」页录入吧</div>';
    }else{
      ITEMS.forEach(it=>{
        const rec=latest[it.code];
        if(!rec)return;
        const s=scoreOf(it.code,rec.value,6);
        const lv=levelOf(s);
        const v=it.type==='run50x8'?fmtRunTime(rec.value):rec.value;
        const cell=document.createElement('div');
        cell.className='item-row';
        cell.style.padding='6px 0';
        cell.style.border='none';
        cell.innerHTML=`<div class="main"><div class="name" style="font-size:13px;">${it.name}</div>
          <div class="meta">${v} ${it.unit}</div></div>
          <span class="pill ${lv.pill}" style="font-size:11px;">${lv.label}</span>`;
        box.appendChild(cell);
      });
    }

    // mini 趋势图
    this.renderMiniTrend();
  },

  calcStreak(){
    const dates=[...new Set(State.checkins.map(c=>c.date))].sort((a,b)=>b.localeCompare(a));
    let streak=0;const today=fmtDate(); const yesterday=fmtDate(Date.now()-86400000);
    let check=dates[0];
    if(check!==today&&check!==yesterday)return 0;
    let cur=new Date(check);
    for(const d of dates){
      if(fmtDate(cur)===d){streak++; cur.setDate(cur.getDate()-1);}
      else break;
    }
    return streak;
  },
  weekCheckinCount(){
    const today=new Date();
    let cnt=0;
    for(let i=0;i<7;i++){
      const d=new Date(today);d.setDate(d.getDate()-i);
      const key=fmtDate(d);
      if(State.checkins.some(c=>c.date===key))cnt++;
    }
    return cnt;
  },
  latestPerItem(){
    const map={};
    State.scores.forEach(s=>{
      if(!map[s.code]||s.date>map[s.code].date)map[s.code]=s;
    });
    return map;
  },

  renderMiniTrend(){
    const data=this.trendData('rope',8);
    const chips=$('#miniTrendChips');
    const names={vital:'肺活量',run50:'50米跑',sitfwd:'坐位体前屈',rope:'跳绳',situp:'仰卧起坐',run50x8:'50×8',bmi:'BMI'};
    chips.innerHTML='';
    Object.keys(names).forEach(c=>{
      const chip=document.createElement('span');
      chip.className='chip'+(c==='rope'?' active':'');
      chip.textContent=names[c];chip.onclick=()=>this.renderMiniTrendOf(c);
      chip.dataset.code=c;
      chips.appendChild(chip);
    });
    this._miniTrendCode='rope';
    this._drawMiniTrend();
  },
  renderMiniTrendOf(code){
    this._miniTrendCode=code;
    $$('#miniTrendChips .chip').forEach(c=>c.classList.toggle('active',c.dataset.code===code));
    this._drawMiniTrend();
  },
  _drawMiniTrend(){
    const code=this._miniTrendCode;
    const data=this.trendData(code,10);
    const canvas=$('#miniTrendChart');
    if(!canvas)return;
    if(this._miniChart)this._miniChart.destroy();
    if(data.length<2)return;
    if(!window.Chart){
      canvas.style.display='none';
      const ph=document.createElement('div');
      ph.className='empty'; ph.style.padding='20px';
      ph.textContent=`趋势图需要联网加载 Chart.js（当前无网络或加载失败） · 近 ${data.length} 条记录可用`;
      canvas.parentElement.appendChild(ph);
      return;
    }
    const labels=data.map(d=>d.label);
    const values=data.map(d=>d.value);
    this._miniChart=new Chart(canvas,{
      type:'line',
      data:{labels,datasets:[{data:values,borderColor:'#0FDC78',backgroundColor:'rgba(15,220,120,.18)',
        fill:true,tension:.4,borderWidth:2,pointRadius:3,pointBackgroundColor:'#0FDC78'}]},
      options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{display:false},tooltip:{enabled:true}},
        scales:{x:{grid:{display:false},ticks:{font:{size:10},color:'#A1A1AA'}},
          y:{grid:{color:'rgba(23,23,23,.08)'},ticks:{display:false},beginAtZero:false}}
      }
    });
  },

  /* ========== 标准页 ========== */
  setGrade(g){
    State.activeGrade=g; persist();
    $$('#grade5Btn,#grade6Btn').forEach(b=>b.classList.remove('on'));
    $(g===5?'#grade5Btn':'#grade6Btn').classList.add('on');
    this.renderStandard();
    this.switchTab('standard');// 更新 sub
  },
  renderStandard(){
    const grade=State.activeGrade;
    const table=STD_BY_GRADE[grade];
    const latest=this.latestPerItem();
    const box=$('#stdList');box.innerHTML='';
    // 每个项目一张卡片，含 60-100 所有档 + 我的当前值高亮
    ITEMS.forEach(it=>{
      const card=document.createElement('div');
      card.className='card';
      card.style.marginTop='0';
      if(it.type==='bmi'){
        const r=BMI_F[grade];
        const bmiCur = State.profile.height&&State.profile.weight ?
          (State.profile.weight/((State.profile.height/100)**2)).toFixed(1):null;
        const normalCur = bmiCur>=r.normal[0]&&bmiCur<=r.normal[1];
        card.innerHTML=`<h3>${it.name} <span style="font-weight:400;font-size:13px;color:var(--text-muted);">· 权重 ${Math.round(it.weight*100)}%</span></h3>
          <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px;">
            正常 ${r.normal[0]}–${r.normal[1]} · 满分 100<br>
            低体重 ≤${r.low} 或超重 ${r.over[0]}–${r.over[1]} · 80 分<br>
            肥胖 ≥${r.obese} · 60 分
          </div>
          ${bmiCur?`<div class="pill ${normalCur?'pill-good':'pill-pass'}" style="font-size:12px;">当前 BMI ${bmiCur} kg/m² · ${normalCur?'正常':'需注意'}</div>`:
            '<div class="pill pill-accent" style="font-size:12px;">请在「我的」页填写身高体重</div>'}`;
        box.appendChild(card);
        return;
      }
      const std=table[it.code];
      if(!std)return;
      // 取关键档展示 + 全部档折叠
      const keys=[100,95,90,85,80,78,76,74,72,70,68,66,64,62,60];
      const my=latest[it.code];
      const myValue = my? (it.type==='run50x8'?fmtRunTime(my.value):my.value):null;
      const myScore = my? scoreOf(it.code,my.value,6):null;
      const myLv=myScore!=null? levelOf(myScore):null;

      // 为简化，只展示四个关键档 + 折叠详情
      const keyRow = [
        {s:100,t:'满分（优秀）'},
        {s:90,t:'优秀 ≥90'},
        {s:80,t:'良好 ≥80'},
        {s:60,t:'及格 ≥60'}
      ];
      let html=`<h3>${it.name} <span style="font-weight:400;font-size:13px;color:var(--text-muted);">· 权重 ${Math.round(it.weight*100)}%${it.bonus?' · 跳绳可额外加 1–20 分':''}</span></h3>
        ${my?`<div style="margin-bottom:8px;">
          <span class="pill ${myLv.pill}">我的：${myValue} ${it.unit} · 六年级 ${myLv.label}</span>
          ${State.activeGrade!==6? `<span class="pill pill-brand" style="margin-left:4px;">按六年级标准判定</span>`:''}
        </div>`:''}
        <table class="std-table"><thead><tr><th>档位</th><th>标准（${it.unit}）</th><th>单项分</th></tr></thead><tbody>`;
      keyRow.forEach(k=>{
        if(std[k.s]===undefined)return;
        let val=std[k.s];
        if(it.type==='run50x8')val=fmtRunTime(val);
        const isMine = myScore===k.s;
        const cls=k.s>=90?'lev-good':(k.s>=80?'lev-pass':'');
        html += `<tr class="${isMine?'me':''}"><td>${k.t}</td><td>${val}</td><td class="${cls}">${k.s}</td></tr>`;
      });
      html += '</tbody></table>';

      // 折叠：完整档位
      const moreKeys=[...new Set([95,85,78,76,74,72,70,68,66,64,62,50,40,30,20,10])].filter(k=>std[k]!==undefined);
      if(moreKeys.length){
        html += `<details><summary>📋 查看完整评分表（含不及格档）</summary><table class="std-table" style="margin-top:8px;"><thead><tr><th>单项分</th><th>标准</th></tr></thead><tbody>`;
        moreKeys.sort((a,b)=>b-a).forEach(k=>{
          let v=std[k];
          if(it.type==='run50x8')v=fmtRunTime(v);
          html+=`<tr><td>${k}</td><td>${v} ${it.unit}</td></tr>`;
        });
        html+='</tbody></table></details>';
      }

      // 提示
      if(it.code==='rope'){
        const bonus=my&&State.activeGrade===6? Math.max(0, Math.floor((my.value-std[100])/2)):0;
        if(bonus>0) html+=`<div class="pill pill-brand" style="margin-top:8px;">🎁 跳绳加分 +${Math.min(bonus,20)} 分（超过满分每多 2 次加 1 分，最多 +20）</div>`;
      }
      card.innerHTML=html;
      box.appendChild(card);
    });
  },

  /* ========== 打卡 ========== */
  renderCheckin(){
    const chips=$('#checkinChips');chips.innerHTML='';
    ITEMS.forEach(it=>{
      if(it.type==='bmi')return;// BMI 不算训练打卡
      const on=this._ciCode===it.code;
      const c=document.createElement('span');
      c.className='chip'+(on?' active':'');
      c.textContent=it.name;c.onclick=()=>{this._ciCode=it.code;this.renderCheckin();};
      chips.appendChild(c);
    });
    if(!this._ciCode)this._ciCode='rope';

    const area=$('#checkinInputArea');area.innerHTML='';
    const it=ITEMS.find(i=>i.code===this._ciCode);
    const prev = this.latestPerItem()[it.code];
    const lastValue = prev? prev.value : (it.code==='rope'? 100 : (it.code==='situp'? 20 : null));

    // 步进器
    const steps={
      rope:[1,5], situp:[1,2], run50:[0.1,1], sitfwd:[0.5,1], run50x8:[5,10]
    };
    const [step1,step2]=steps[it.code]||[1,1];

    const row=document.createElement('div');
    row.innerHTML=`<label>${it.name}（${it.unit}）</label>
      <div style="display:flex;align-items:center;gap:12px;">
        <button class="btn btn-ghost" onclick="App.adj(${step2},${it.code})">▸ ${step2}</button>
        <button class="btn btn-ghost" onclick="App.adj(${step1},${it.code})">− ${step1}</button>
        <input id="ci_input" type="number" step="${step1}" value="${lastValue||''}" style="text-align:center;font-size:18px;font-weight:600;">
        <button class="btn btn-ghost" onclick="App.adj(-${step1},${it.code})">+ ${step1}</button>
        <button class="btn btn-ghost" onclick="App.adj(-${step2},${it.code})">◂ ${step2}</button>
      </div>`;
    area.appendChild(row);

    const note=document.createElement('div');
    note.innerHTML=`<label>训练时长（分钟，可空）</label>
      <input id="ci_duration" type="number" placeholder="30">`;
    area.appendChild(note);

    // 今日已打卡次数
    const today=fmtDate();
    const tCnt=State.checkins.filter(c=>c.date===today).length;
    $('#todayCount').textContent = tCnt?`· 今日已打卡 ${tCnt} 次`:'';
  },
  adj(delta, code){
    const input=$('#ci_input');
    if(!input)return;
    let v=parseFloat(input.value)||0;
    v+=delta; if(v<0)v=0;
    input.value=Number.isInteger(v)?v:parseFloat(v.toFixed(2));
  },
  doCheckin(){
    const code=this._ciCode;
    const it=ITEMS.find(i=>i.code===code);
    let v=parseFloat($('#ci_input').value);
    if(!v||v<=0){showToast('请输入有效的训练数量');return;}
    const duration=$('#ci_duration').value;
    const today=fmtDate();

    // 新增打卡记录
    State.checkins.push({
      date:today,
      items:[{code,value:v,duration:duration?Number(duration):null}],
      createdAt:Date.now()
    });
    // 同步到成绩表（practice 来源）
    State.scores.push({
      id:'s_'+Date.now(), date:today, code, value:v, grade:6, source:'practice'
    });
    persist();

    // 激励：和最近一次比
    const prev = this.latestPerItem()[code];
    const delta = prev? v-prev.value : 0;
    const lv=levelOf(scoreOf(code,v,6));
    const box=$('#successCard');
    box.style.display='block';
    $('#successDelta').textContent = delta>0? `↑ +${delta} ${it.unit}` : (delta<0? `↓ ${delta} ${it.unit}` : '持平');
    $('#successMsg').textContent = `现在距离${lv.label}（六年级标准），${it.name}：${v} ${it.unit}`;

    showToast('🎉 打卡成功！');
    setTimeout(()=>this.renderCheckin(),600);
  },

  /* ========== 记录 ========== */
  renderRecords(){
    // 列表：按日期分组，每项显示最好成绩 + 等级
    const box=$('#recordsList');box.innerHTML='';
    if(!State.scores.length){
      box.innerHTML='<div class="empty">还没有成绩记录<br>打卡会自动生成记录 · 也可以手动「+ 记成绩」</div>';
    }else{
      // 按 code 聚合最好的 + 最近日期
      const groups={};
      State.scores.forEach(s=>{
        if(!groups[s.code]||s.date>groups[s.code].date)groups[s.code]=s;
      });
      ITEMS.forEach(it=>{
        const rec=groups[it.code];
        if(!rec)return;
        const score=scoreOf(it.code,rec.value,6);
        const lv=levelOf(score);
        const v=it.type==='run50x8'?fmtRunTime(rec.value):rec.value;
        const row=document.createElement('div');
        row.className='item-row';
        const delta = (this.latestPerItem()[it.code] && this.latestPerItem()[it.code].id!==rec.id) ? '' : '';
        row.innerHTML=`<div class="main">
          <div class="name">${it.name} <span style="font-size:12px;color:var(--text-muted);">· 权重 ${Math.round(it.weight*100)}%</span></div>
          <div class="meta">${v} ${it.unit} · ${rec.date}</div>
          <div class="levbar" style="width:180px;margin-top:6px;">
            <div class="seg-f" style="width:${(score/100)*100}%"></div>
          </div>
        </div>
        <div style="text-align:right;">
          <span class="pill ${lv.pill}">${lv.label}</span>
          <div class="meta" style="margin-top:4px;font-size:11px;">单项 ${score}/100</div>
        </div>`;
        box.appendChild(row);
      });
    }

    // 趋势图项目选择
    const chips=$('#trendChips');chips.innerHTML='';
    ITEMS.forEach(it=>{
      if(it.type==='bmi')return;
      const on=this._trendCode===it.code;
      const c=document.createElement('span');
      c.className='chip'+(on?' active':'');
      c.textContent=it.name;c.onclick=()=>{this._trendCode=it.code;this._drawTrend();};
      chips.appendChild(c);
    });
    if(!this._trendCode)this._trendCode='rope';
    this._drawTrend();

    // 模拟卡片
    const latest=this.latestPerItem();
    const hasAll7 = ITEMS.every(it=>latest[it.code]);
    if(hasAll7){
      $('#simCard').style.display='block';
      const sim=this.computeSim6();
      const lv=levelOf(sim.total);
      $('#simContent').innerHTML=`<div style="display:flex;align-items:center;gap:12px;">
        <div class="kpi">${sim.total}<small>/100</small></div>
        <span class="pill ${lv.pill}" style="font-size:14px;">${lv.label}</span>
      </div>
      <div class="levbar" style="margin-top:10px;">
        <div class="seg-f" style="width:${Math.max(0,60-sim.total)/2}%"></div>
        <div class="seg-p" style="width:${Math.max(0,80-sim.total)*0.5}%"></div>
        <div class="seg-g" style="width:${Math.min(sim.total-80,20)*2+Math.min(sim.total-90,10)*2}%"></div>
      </div>
      <div class="label" style="margin-top:6px;">六年级标准 · ${sim.hasBonus?`跳绳加分 +${sim.bonus}`:'无跳绳加分'}</div>
      <div style="margin-top:8px;font-size:13px;color:var(--text-muted);">${sim.total>=80?'🎉 目标良好（80分）达成！':'💪 距离良好还差 '+(80-sim.total)+' 分，加油！'}</div>`;
    }else{
      $('#simCard').style.display='none';
    }
  },

  computeSim6(){
    const latest=this.latestPerItem();
    let total=0;
    let hasBonus=false, bonus=0;
    ITEMS.forEach(it=>{
      const rec=latest[it.code];if(!rec)return;
      const s=scoreOf(it.code,rec.value,6);
      if(it.code==='rope'){
        // 加分：超过满分的部分 / 2 ，最多 20
        const table=STD_BY_GRADE[6].rope;
        const over=Math.max(0, rec.value-table[100]);
        bonus=Math.min(20, Math.floor(over/2));
        hasBonus=bonus>0;
      }
      total += s*it.weight;
    });
    return {total: Math.round(total*10)/10, hasBonus, bonus};
  },

  trendData(code, max){
    const recs=State.scores.filter(s=>s.code===code).sort((a,b)=>a.date.localeCompare(b.date));
    const step=ITEMS.find(i=>i.code===code);
    return recs.slice(-max).map(r=>({
      label: r.date.slice(5),
      value: step.type==='run50x8'? parseRunTime(r.value) : r.value
    }));
  },
  _drawTrend(){
    const code=this._trendCode;
    const data=this.trendData(code,15);
    const canvas=$('#trendChart');
    if(!canvas)return;
    if(this._trendChart)this._trendChart.destroy();
    const hasData=data.length>=2;
    if(!hasData){canvas.getContext('2d')?.clearRect(0,0,canvas.width,canvas.height);return;}
    if(!window.Chart){
      canvas.style.display='none';
      const ph=document.createElement('div');
      ph.className='empty'; ph.style.padding='20px';
      ph.textContent='趋势图需要联网加载 Chart.js（当前无网络或加载失败）';
      canvas.parentElement.appendChild(ph);
      return;
    }
    const scoreLine = STD_BY_GRADE[6][code];
    const item=ITEMS.find(i=>i.code===code);
    const goodLine=scoreLine?scoreLine[80]:null;
    const labels=data.map(d=>d.label);
    const values=data.map(d=>d.value);
    this._trendChart=new Chart(canvas,{
      type:'line',
      data:{labels,datasets:[{
        data:values,
        borderColor:'#0FDC78',backgroundColor:'rgba(15,220,120,.18)',
        fill:true,tension:.4,borderWidth:2,pointRadius:4,pointBackgroundColor:'#0FDC78'
      }]},
      options:{
        responsive:true,maintainAspectRatio:false,
        plugins:{legend:{display:false},tooltip:{enabled:true}},
        scales:{
          x:{grid:{display:false},ticks:{font:{size:11},color:'#A1A1AA'}},
          y:{grid:{color:'rgba(23,23,23,.08)'},ticks:{font:{size:11},color:'#52525B'}}

        }
      },
      plugins: goodLine? [{
        id:'targetLine',
        afterDraw: c=>{
          const {ctx,scales:{y}}=c;
          const pixelY=y.getPixelForValue(goodLine);
          ctx.save();
          ctx.strokeStyle='rgba(239,170,23,.6)';
          ctx.setLineDash([4,4]);
          ctx.lineWidth=1;
          ctx.beginPath();
          ctx.moveTo(y.left,pixelY);ctx.lineTo(y.right,pixelY);
          ctx.stroke();
          ctx.restore();
          ctx.save();
          ctx.fillStyle='#EFAA17';ctx.font='11px sans-serif';
          ctx.fillText(`良好线: ${goodLine} ${item.unit}`,y.right-140,pixelY-4);
          ctx.restore();
        }
      }] : []
    });
  },

  openScoreForm(){this._sim=false;this.showScoreForm();},
  openMock(){this._sim=true;this.showScoreForm();},
  showScoreForm(){
    const body=$('#scoreModalBody');body.innerHTML='';
    const isSim=this._sim;
    ITEMS.forEach(it=>{
      const row=document.createElement('div');
      const prev=this.latestPerItem()[it.code];
      let hint=it.type==='bmi'?'（自动算，保存时用我的身高体重）':'（默认填上次成绩）';
      if(isSim)hint='（模拟测：建议填写真实测试成绩）';
      if(it.code==='run50x8')hint='（单位：秒，可填 97 或 1:37）';
      if(it.type==='bmi'){
        row.innerHTML=`<label>${it.name}</label>
          <div class="pill pill-accent">保存时自动从身高体重计算 BMI 值</div>`;
      }else{
        row.innerHTML=`<label>${it.name}（${it.unit}）${hint}</label>
          <input data-code="${it.code}" type="${it.code==='run50x8'?'text':'number'}" step="any"
            placeholder="${prev?'上次 '+prev.value:''}" value="${prev?prev.value:''}">`;
      }
      body.appendChild(row);
    });
    // 日期
    const dRow=document.createElement('div');
    dRow.innerHTML=`<label>日期</label><input id="score_date" type="date" value="${fmtDate()}">`;
    body.appendChild(dRow);
    // 来源
    const sRow=document.createElement('div');
    sRow.innerHTML=`<label>成绩来源</label>
      <select id="score_source">
        <option value="practice">日常训练</option>
        <option value="mock">模拟测试</option>
        <option value="official">学校统测</option>
      </select>`;
    body.appendChild(sRow);

    $('#scoreModalTitle').textContent = isSim? '🧮 录入模拟测（7 项）':'➕ 录入单项成绩';
    $('#scoreModal').style.display='flex';
  },
  closeModal(id){$('#'+id).style.display='none';},
  saveScore(){
    const inputs=$('#scoreModalBody input[data-code]');
    const date=$('#score_date').value;
    const source=$('#score_source').value;
    let saved=0;
    inputs.forEach(inp=>{
      const code=inp.dataset.code;
      const v=inp.value;
      const it=ITEMS.find(i=>i.code===code);
      if(it.type==='bmi'){
        const h=State.profile.height,w=State.profile.weight;
        if(h&&w){
          const bmi=(w/((h/100)**2)).toFixed(1);
          State.scores.push({id:'s_'+Date.now()+'_b',date,code:'bmi',value:Number(bmi),grade:6,source});
          saved++;
        }
      }else{
        if(!v||v==='')return;
        let num=v;
        if(code==='run50x8')num=parseRunTime(v); else num=Number(v);
        if(isNaN(num))return;
        State.scores.push({id:'s_'+Date.now()+'_'+code+Math.random(),date,code,value:num,grade:6,source});
        saved++;
      }
    });
    persist();
    this.closeModal('scoreModal');
    showToast(`已保存 ${saved} 项`);
    this.renderRecords();
  },

  /* ========== 我的 ========== */
  renderProfileForm(){
    $('#pfName').value=State.profile.name||'';
    $('#pfGrade').value=State.profile.grade||5;
    $('#pfHeight').value=State.profile.height||'';
    $('#pfWeight').value=State.profile.weight||'';
    $('#pfExamDate').value=State.profile.examDate||'';
    this.updateBMI();
  },
  updateBMI(){
    const h=Number($('#pfHeight').value),w=Number($('#pfWeight').value);
    const box=$('#bmiBox');box.innerHTML='';
    if(h&&w){
      const bmi=(w/((h/100)**2)).toFixed(1);
      const grade=State.activeGrade;
      const r=BMI_F[grade];
      const normal=bmi>=r.normal[0]&&bmi<=r.normal[1];
      box.innerHTML=`<div class="pill pill-accent">当前 BMI ${bmi} kg/m²</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:6px;">
          按 ${grade} 年级标准：${normal?'正常（满分 100）':'需要关注（80 分）'}
        </div>`;
    }else{
      box.innerHTML='<div class="pill pill-accent">填写身高体重后自动计算 BMI</div>';
    }
  },
  saveProfile(){
    State.profile.name=$('#pfName').value||'小朋友';
    State.profile.grade=Number($('#pfGrade').value)||5;
    State.profile.height=Number($('#pfHeight').value)||null;
    State.profile.weight=Number($('#pfWeight').value)||null;
    persist();showToast('💾 已保存');
  },
  saveExamDate(){
    State.profile.examDate=$('#pfExamDate').value;
    persist();showToast('💾 体测日期已更新');
  },
  exportCSV(){
    let csv='项目,日期,成绩,单位,六年级单项分,等级,来源\n';
    State.scores.sort((a,b)=>b.date.localeCompare(a.date)).forEach(s=>{
      const it=ITEMS.find(i=>i.code===s.code);
      if(!it)return;
      const sc=scoreOf(s.code,s.value,6);
      const lv=levelOf(sc);
      const v=it.type==='run50x8'?fmtRunTime(s.value):s.value;
      csv += `${it.name},${s.date},${v},${it.unit},${sc},${lv.label||''},${s.source}\n`;
    });
    const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=`pecei-scores-${fmtDate()}.csv`;
    a.click();showToast('已下载');
  },
  clearData(){
    if(!confirm('确定清空所有数据吗？此操作不可撤销。'))return;
    localStorage.removeItem('pecei_scores');
    localStorage.removeItem('pecei_checkins');
    State.scores=[];State.checkins=[];
    persist();showToast('已清空');
    this.switchTab('records');
  }
};

/* ==================== 启动 ==================== */
/* 挂到 window，eval 也能访问 */
window.App = App;
document.addEventListener('DOMContentLoaded',()=>{
  try {
    console.log('[pecei] DOMContentLoaded fired');
    $('#pfHeight')&&$('#pfHeight').addEventListener('input',()=>App.updateBMI());
    $('#pfWeight')&&$('#pfWeight').addEventListener('input',()=>App.updateBMI());
    App.init();
    console.log('[pecei] init done');
  } catch(e) {
    console.error('[pecei] init FAILED:', e.message, e.stack);
    showToast('⚠️ 初始化失败：'+e.message);
  }
});
