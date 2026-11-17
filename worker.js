// Cloudflare Worker: keep BOT_TOKEN and CHAT_ID in Worker Secrets, NEVER in GitHub.
export default {
  async fetch(request, env) {
    const headers = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
      'Content-Type': 'application/json; charset=utf-8'
    };
    const origin = request.headers.get('Origin');
    if (!env.ALLOWED_ORIGIN || origin !== env.ALLOWED_ORIGIN) return new Response(JSON.stringify({ok:false,error:'Origin not allowed'}),{status:403,headers:{'Content-Type':'application/json'}});
    if (request.method === 'OPTIONS') return new Response(null,{status:204,headers});
    if (request.method !== 'POST') return new Response(JSON.stringify({ok:false,error:'Method not allowed'}),{status:405,headers});
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) return new Response(JSON.stringify({ok:false,error:'JSON required'}),{status:415,headers});
    if (Number(request.headers.get('Content-Length')||0)>10000) return new Response(JSON.stringify({ok:false,error:'Too large'}),{status:413,headers});
    let data;
    try { data=await request.json(); } catch { return new Response(JSON.stringify({ok:false,error:'Invalid JSON'}),{status:400,headers}); }
    if(data.website) return new Response(JSON.stringify({ok:true}),{headers}); // honeypot
    const name=String(data.name||'Anonymous').trim().slice(0,60);
    const message=String(data.message||'').trim();
    if(!message||message.length>2000) return new Response(JSON.stringify({ok:false,error:'Message must be 1–2000 characters'}),{status:400,headers});
    if(!env.BOT_TOKEN||!env.CHAT_ID) return new Response(JSON.stringify({ok:false,error:'Server not configured'}),{status:503,headers});
    const text=`📡 WIRED VILLAGE\nFrom: ${name}\n\n${message}`;
    try {
      const response=await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:env.CHAT_ID,text})});
      const result=await response.json();
      if(!response.ok||!result.ok) throw Error('Telegram rejected message');
      return new Response(JSON.stringify({ok:true}),{headers});
    } catch {return new Response(JSON.stringify({ok:false,error:'Delivery unavailable'}),{status:502,headers});}
  }
};
