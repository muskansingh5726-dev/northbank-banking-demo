const $ = selector => document.querySelector(selector);
const DEMO_EMAIL = 'jordan@northbank.demo';
const DEFAULT_PASSWORD = 'BankDemo123';
const DEFAULT_TRANSFER_PIN = '246810';
const money = value => '₹ ' + Number(value).toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2});
const safe = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const sampleBeneficiaries = [
  {id:'ananya',name:'Ananya Sharma',bank:'State Bank of India',account:'1092',ifsc:'SBIN0001234'},
  {id:'rohan',name:'Rohan Mehta',bank:'HDFC Bank',account:'6734',ifsc:'HDFC0001234'}
];
let beneficiaries = JSON.parse(localStorage.getItem('northbank.beneficiaries') || 'null') || sampleBeneficiaries;
let transactions = JSON.parse(localStorage.getItem('northbank.transactions') || 'null') || [{name:'Rohan Mehta',bank:'HDFC Bank',amount:2500,note:'Dinner',ref:'NB84510932',date:'09 Nov 2026',status:'Completed'}];
let balance = Number(localStorage.getItem('northbank.balance') || 84250);
let profile = JSON.parse(localStorage.getItem('northbank.profile') || 'null') || {name:'Jordan Davis',email:'jordan@northbank.demo',phone:'+91 98765 43210'};
let loginPassword = localStorage.getItem('northbank.password') || DEFAULT_PASSWORD;
let transferPin = localStorage.getItem('northbank.transferPin') || DEFAULT_TRANSFER_PIN;
let phase = 1;

function saveData(){
  localStorage.setItem('northbank.beneficiaries',JSON.stringify(beneficiaries));
  localStorage.setItem('northbank.transactions',JSON.stringify(transactions));
  localStorage.setItem('northbank.balance',String(balance));
  localStorage.setItem('northbank.profile',JSON.stringify(profile));
  localStorage.setItem('northbank.password',loginPassword);
  localStorage.setItem('northbank.transferPin',transferPin);
}
function initials(name){return name.trim().split(/\s+/).map(part=>part[0]).join('').slice(0,2).toUpperCase()}
function renderProfile(){
  const firstName=profile.name.trim().split(/\s+/)[0]||'Customer';
  $('#welcome-name').textContent=`Welcome, ${firstName}`;
  $('#profile-display-name').textContent=profile.name;
  $('#profile-name').value=profile.name;
  $('#profile-email').value=profile.email;
  $('#profile-phone').value=profile.phone;
  $('#profile-avatar').textContent=initials(profile.name);
  $('#top-avatar').textContent=initials(profile.name);
  $('#email').value=profile.email;
  $('#demo-email').textContent=profile.email;
  $('#demo-password').textContent=loginPassword;
}
function showApp(){
  $('#login-page').classList.add('hidden');
  $('#bank-app').classList.remove('hidden');
  balance=Number(localStorage.getItem('northbank.balance') || 84250);
  $('#today').textContent=new Date().toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
  $('#balance-value').textContent=money(balance);
  $('#amount').max=balance;
  renderProfile();
  renderTransactions();renderHistory();renderBeneficiaries();renderBeneficiaryOptions();
}
function authError(text){$('#auth-error').textContent=text;$('#auth-error').classList.add('show')}
$('#login-form').addEventListener('submit',event=>{
  event.preventDefault();$('#auth-error').classList.remove('show');
  if($('#email').value.trim().toLowerCase()!==profile.email.toLowerCase()||$('#password').value!==loginPassword){authError('Those demo sign-in details do not match. Check your current account details.');return}
  sessionStorage.setItem('northbank.signed-in','yes');showApp();
});
$('#logout').addEventListener('click',()=>{sessionStorage.removeItem('northbank.signed-in');$('#bank-app').classList.add('hidden');$('#login-page').classList.remove('hidden');$('#password').value='';});
renderProfile();
if(sessionStorage.getItem('northbank.signed-in')==='yes')showApp();

function fullDate(value){return value||new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
function renderTransactions(){
  const list=$('#transaction-list');
  if(!transactions.length){list.innerHTML='<div class="empty">No transfers yet. Your completed transactions will appear here.</div>';return}
  list.innerHTML=transactions.slice(0,4).map(t=>`<div class="transaction"><span class="person-icon">${safe(t.name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase())}</span><div class="transaction-copy"><strong>${safe(t.name)}</strong><span>Money transfer · ${safe(t.note||'Bank transfer')}</span></div><span class="transaction-date">${safe(t.date)}</span><span class="transaction-amount">− ${money(t.amount)}</span></div>`).join('');
}
function renderHistory(){
  const query=($('#history-search')?.value||'').trim().toLowerCase();
  const rows=transactions.filter(t=>`${t.name} ${t.ref} ${t.note||''}`.toLowerCase().includes(query));
  $('#history-rows').innerHTML=rows.length?rows.map(t=>`<tr><td>${safe(t.date)}</td><td>${safe(t.name)}<small>${safe(t.bank||'')}</small></td><td>${safe(t.ref)}</td><td>${safe(t.note||'—')}</td><td class="money-cell">− ${money(t.amount)}</td><td><span class="status-pill">${safe(t.status||'Completed')}</span></td></tr>`).join(''):'<tr><td colspan="6" class="empty-cell">No matching transactions.</td></tr>';
}
function renderBeneficiaries(){
  const list=$('#beneficiary-list');
  list.innerHTML=beneficiaries.length?beneficiaries.map(b=>`<article class="beneficiary-card"><span class="person-icon">${safe(b.name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase())}</span><div class="beneficiary-copy"><strong>${safe(b.name)}</strong><span>${safe(b.bank)} · Account ending ${safe(b.account.slice(-4))}</span><small>IFSC ${safe(b.ifsc)}</small></div><button class="remove-beneficiary" data-remove="${safe(b.id)}" type="button" aria-label="Remove ${safe(b.name)}">Remove</button></article>`).join(''):'<div class="empty">No saved beneficiaries yet.</div>';
  list.querySelectorAll('[data-remove]').forEach(button=>button.addEventListener('click',()=>{beneficiaries=beneficiaries.filter(b=>b.id!==button.dataset.remove);saveData();renderBeneficiaries();renderBeneficiaryOptions()}));
}
function renderBeneficiaryOptions(){
  const selected=$('#beneficiary').value||beneficiaries[0]?.id||'new';
  $('#beneficiary').innerHTML=beneficiaries.map(b=>`<option value="${safe(b.id)}">${safe(b.name)} · •••• ${safe(b.account.slice(-4))}</option>`).join('')+'<option value="new">＋ Add a new beneficiary</option>';
  $('#beneficiary').value=beneficiaries.some(b=>b.id===selected)?selected:(beneficiaries[0]?.id||'new');
  updateBeneficiaryPreview();
}
function updateBeneficiaryPreview(){
  const current=beneficiaries.find(b=>b.id===$('#beneficiary').value);
  const isNew=$('#beneficiary').value==='new';
  $('#new-fields').style.display=isNew?'block':'none';
  $('#beneficiary-preview').style.display=isNew?'none':'flex';
  if(current){$('#beneficiary-preview .person-icon').textContent=current.name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();$('#beneficiary-preview .preview-copy strong').textContent=current.name;$('#beneficiary-preview .preview-copy span').textContent=`${current.bank} · Account ending ${current.account.slice(-4)}`;}
}
$('#beneficiary').addEventListener('change',updateBeneficiaryPreview);
function selectedBeneficiary(){
  if($('#beneficiary').value==='new')return {id:'new',name:$('#new-name').value.trim(),bank:$('#new-bank').value.trim(),account:$('#new-account').value.trim(),ifsc:$('#new-ifsc').value.trim()};
  return beneficiaries.find(b=>b.id===$('#beneficiary').value)||{};
}
function notice(message,error=false){const node=$('#notice');node.textContent=message;node.className='notice show'+(error?' error':'')}
function isValidIfsc(code){return /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(code)}
function validateTransfer(){
  const b=selectedBeneficiary(),amount=Number($('#amount').value),note=$('#note').value.trim();
  if(!b.name)return 'Enter the beneficiary’s name.';
  if($('#beneficiary').value==='new'){
    if(!b.bank||!b.account||!b.ifsc)return 'Complete all beneficiary details before continuing.';
    if(!/^\d{8,18}$/.test(b.account))return 'Account number must contain 8 to 18 digits.';
    if(!isValidIfsc(b.ifsc))return 'Enter a valid 11-character IFSC code.';
  }
  if(!Number.isFinite(amount)||amount<1)return 'Enter an amount of at least ₹1.';
  if(!Number.isInteger(amount))return 'Enter a whole number amount for this demo.';
  if(amount>balance)return 'The amount is higher than your available balance.';
  if(note.length>40)return 'Keep your note to 40 characters or less.';
  return '';
}
function setSteps(){for(let i=1;i<=3;i++)$('#step'+i).className='step '+(i===phase?'current':i<phase?'done':'')}
function renderReview(){
  const b=selectedBeneficiary(),amount=Number($('#amount').value),note=$('#note').value.trim(),acct='•••• '+b.account.slice(-4);
  $('#review').innerHTML=`<div class="review-row"><span>From</span><strong>Everyday account · •••• 4821</strong></div><div class="review-row"><span>To</span><strong>${safe(b.name)} · ${safe(acct)}</strong></div><div class="review-row"><span>Bank</span><strong>${safe(b.bank)}</strong></div>${note?`<div class="review-row"><span>Note</span><strong>${safe(note)}</strong></div>`:''}<div class="review-row"><span>Transfer fee</span><strong>₹ 0.00</strong></div><div class="review-row total"><span>Total amount</span><strong>${money(amount)}</strong></div>`;
}
function resetTransfer(){
  phase=1;$('#details').style.display='block';$('#review').classList.remove('show');$('#otp-wrap').classList.remove('show');$('#form-title').textContent='Who are you sending money to?';$('#form-hint').textContent='Choose a saved beneficiary or add someone new.';$('#continue').style.display='flex';$('#back').style.display='';$('#continue').innerHTML='Review transfer <svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';$('#back').style.visibility='hidden';$('#notice').className='notice';$('#receipt').classList.remove('show');$('#otp').value='';$('#amount').value='';$('#note').value='';setSteps();
}
$('#continue').addEventListener('click',()=>{
  if(phase===1){const error=validateTransfer();if(error){notice(error,true);return}$('#notice').className='notice';renderReview();phase=2;$('#details').style.display='none';$('#review').classList.add('show');$('#form-title').textContent='Review your transfer';$('#form-hint').textContent='Check the details below before you confirm.';$('#continue').innerHTML='Confirm transfer <svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>';$('#back').style.visibility='visible';setSteps();return}
  if(phase===2){phase=3;$('#review').classList.remove('show');$('#otp-wrap').classList.add('show');$('#form-title').textContent='Confirm it’s you';$('#form-hint').textContent='Enter your one-time code to authorize this demo transfer.';$('#continue').innerHTML='Verify & send <svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>';setSteps();return}
  if($('#otp').value.trim()!==transferPin){notice('The passcode is incorrect. Check your security settings and try again.',true);return}
  const b=selectedBeneficiary(),amount=Number($('#amount').value),ref='NB'+Math.random().toString(10).slice(2,10),note=$('#note').value.trim();
  if(b.id==='new'){b.id='user-'+Date.now();beneficiaries.push(b)}
  balance-=amount;const date=fullDate(new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}));
  transactions.unshift({name:b.name,bank:b.bank,amount,note,ref,date,status:'Completed'});saveData();
  $('#balance-value').textContent=money(balance);$('#amount').max=balance;renderTransactions();renderHistory();renderBeneficiaries();renderBeneficiaryOptions();
  $('#otp-wrap').classList.remove('show');$('#form-title').textContent='Transfer complete';$('#form-hint').textContent='Your demo transfer has been recorded in this browser.';$('#continue').style.display='none';$('#back').style.display='none';$('#notice').className='notice show';$('#notice').textContent='Transfer successful. Reference: '+ref;
  $('#receipt').innerHTML=`<h3>Transfer receipt</h3><div class="receipt-row"><span>Status</span><strong>Completed</strong></div><div class="receipt-row"><span>Recipient</span><strong>${safe(b.name)}</strong></div><div class="receipt-row"><span>Amount</span><strong>${money(amount)}</strong></div><div class="receipt-row"><span>Reference number</span><strong>${safe(ref)}</strong></div><div class="receipt-row"><span>Date</span><strong>${safe(date)}</strong></div><button id="new-transfer" class="text-button" type="button">Make another transfer →</button>`;
  $('#receipt').classList.add('show');$('#new-transfer').addEventListener('click',resetTransfer);$('#step3').classList.add('done');$('#step3').classList.remove('current');
});
$('#back').addEventListener('click',()=>{
  if(phase===2){phase=1;$('#details').style.display='block';$('#review').classList.remove('show');$('#form-title').textContent='Who are you sending money to?';$('#form-hint').textContent='Choose a saved beneficiary or add someone new.';$('#continue').innerHTML='Review transfer <svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';$('#back').style.visibility='hidden';$('#notice').className='notice';setSteps()}
  else if(phase===3){phase=2;$('#otp-wrap').classList.remove('show');$('#review').classList.add('show');$('#form-title').textContent='Review your transfer';$('#form-hint').textContent='Check the details below before you confirm.';$('#continue').innerHTML='Confirm transfer <svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>';setSteps()}
});
$('#add-beneficiary').addEventListener('click',()=>{
  const name=$('#manager-name').value.trim(),bank=$('#manager-bank').value.trim(),account=$('#manager-account').value.trim(),ifsc=$('#manager-ifsc').value.trim().toUpperCase(),message=$('#beneficiary-error');
  message.className='notice';
  if(!name||!bank||!account||!ifsc){message.textContent='Fill in all four fields.';message.className='notice show error';return}
  if(!/^\d{8,18}$/.test(account)){message.textContent='Account number must contain 8 to 18 digits.';message.className='notice show error';return}
  if(!isValidIfsc(ifsc)){message.textContent='Enter an 11-character IFSC code, such as SBIN0001234.';message.className='notice show error';return}
  if(beneficiaries.some(b=>b.account===account&&b.bank.toLowerCase()===bank.toLowerCase())){message.textContent='That bank account is already in your beneficiary list.';message.className='notice show error';return}
  beneficiaries.push({id:'user-'+Date.now(),name,bank,account,ifsc});saveData();renderBeneficiaries();renderBeneficiaryOptions();
  ['manager-name','manager-bank','manager-account','manager-ifsc'].forEach(id=>$('#'+id).value='');message.textContent='Beneficiary added and saved in this browser.';message.className='notice show';
});
$('#save-profile').addEventListener('click',()=>{
  const name=$('#profile-name').value.trim(),phone=$('#profile-phone').value.trim(),message=$('#profile-message');
  message.className='notice';
  if(name.length<2){message.textContent='Enter your full name.';message.className='notice show error';return}
  if(!/^[+0-9 ()-]{7,20}$/.test(phone)){message.textContent='Enter a valid demo phone number.';message.className='notice show error';return}
  profile={...profile,name,phone};saveData();renderProfile();message.textContent='Profile details updated in this browser.';message.className='notice show';
});
$('#save-pin').addEventListener('click',()=>{
  const current=$('#current-pin').value.trim(),next=$('#new-pin').value.trim(),confirm=$('#confirm-pin').value.trim(),message=$('#pin-message');
  message.className='notice';
  if(current!==transferPin){message.textContent='Current PIN does not match.';message.className='notice show error';return}
  if(!/^\d{6}$/.test(next)){message.textContent='Choose a new six-digit PIN.';message.className='notice show error';return}
  if(next===transferPin){message.textContent='Choose a PIN different from your current PIN.';message.className='notice show error';return}
  if(next!==confirm){message.textContent='The new PIN entries do not match.';message.className='notice show error';return}
  transferPin=next;saveData();['current-pin','new-pin','confirm-pin'].forEach(id=>$('#'+id).value='');message.textContent='Transfer PIN updated. Use the new PIN for your next demo transfer.';message.className='notice show';
});
$('#save-password').addEventListener('click',()=>{
  const current=$('#current-password').value,next=$('#new-password').value,confirm=$('#confirm-password').value,message=$('#password-message');
  message.className='notice';
  if(current!==loginPassword){message.textContent='Current password does not match.';message.className='notice show error';return}
  if(next.length<8){message.textContent='Choose a password with at least 8 characters.';message.className='notice show error';return}
  if(next===loginPassword){message.textContent='Choose a password different from your current one.';message.className='notice show error';return}
  if(next!==confirm){message.textContent='The new password entries do not match.';message.className='notice show error';return}
  loginPassword=next;saveData();renderProfile();['current-password','new-password','confirm-password'].forEach(id=>$('#'+id).value='');message.textContent='Password updated. Use the new password the next time you sign in.';message.className='notice show';
});
$('#history-search').addEventListener('input',renderHistory);
function setView(view,targetSelector){
  const sections={dashboard:'#dashboard-view',history:'#history-view',beneficiaries:'#beneficiaries-view',profile:'#profile-view',security:'#security-view'};
  Object.entries(sections).forEach(([name,selector])=>$(selector).classList.toggle('hidden',name!==view));
  document.querySelectorAll('.nav a[data-view]').forEach(nav=>nav.classList.toggle('active',nav.dataset.view===view));
  if(view==='history')renderHistory();
  const target=targetSelector?document.querySelector(targetSelector):null;
  window.setTimeout(()=>{if(view==='dashboard'&&target)target.scrollIntoView({behavior:'smooth',block:'start'});else window.scrollTo({top:0,behavior:'smooth'})},0);
}
document.querySelectorAll('[data-view]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();setView(link.dataset.view,link.dataset.target||link.getAttribute('href'));
}));
