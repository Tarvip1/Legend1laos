import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>กำลังเชื่อมต่อเซิร์ฟเวอร์...</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          :root {
            --bg1:#0b0b0b; --bg2:#1a1a1a; --acc:#00e6ac; --soft:#ffffff22; --text:#eaeaea; --sub:#bdbdbd;
          }
          * { box-sizing: border-box; }
          html,body { height: 100%; margin:0; }
          body {
            color: var(--text);
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
            background: radial-gradient(1200px 800px at 10% 10%, #121212, transparent),
                        radial-gradient(1000px 700px at 90% 90%, #111, transparent),
                        linear-gradient(135deg, var(--bg1), var(--bg2));
            display: grid; place-items: center; padding: 24px;
          }
          .card { width: min(560px, 92vw); background: #101010aa; backdrop-filter: blur(6px);
            border: 1px solid #2a2a2a; border-radius: 20px; padding: 28px 24px; text-align: center;
            box-shadow: 0 10px 30px #00000055, inset 0 1px 0 #ffffff0f; }
          .ring { width: 110px; height: 110px; margin: 0 auto 16px; border-radius: 50%;
            border: 12px solid var(--soft); border-top-color: var(--acc);
            animation: spin 0.9s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
          h1 { font-size: 22px; margin: 6px 0 4px; letter-spacing: .3px; }
          p  { margin: 0; color: var(--sub); font-size: 14px; }
          .bar { margin: 18px auto 12px; width: 100%; height: 8px; border-radius: 999px; background: #2a2a2a; overflow: hidden; }
          .bar > i { display:block; height:100%; width:30%; background: linear-gradient(90deg, #ffffff22, var(--acc));
            filter: saturate(140%); border-radius: 999px; animation: progress 1.8s ease-in-out infinite; }
          @keyframes progress { 0%{ margin-left: -30%; } 50%{ margin-left: 50%; } 100%{ margin-left: 120%; } }
          .list { text-align:left; margin-top:10px; font-size:13px; color:#cfcfcf; }
          .list b { color: var(--acc); font-weight:600; }
          .actions { display:flex; gap:10px; justify-content:center; margin-top:16px; }
          .btn { appearance:none; border:1px solid #2d2d2d; color:#fff; background:#161616; padding:10px 14px; border-radius:10px; cursor:pointer;
            transition:.2s ease; font-size:14px; }
          .btn:hover { transform: translateY(-1px); border-color:#3a3a3a; }
          .muted { color:#a8a8a8; font-size:12px; margin-top:8px; }
        `}</style>
      </Head>
      <div className="card">
        <div className="ring" aria-hidden="true"></div>
        <h1>กำลังตรวจสอบเซิร์ฟเวอร์…</h1>
        <p>ถ้าลิงก์แรกเข้าไม่ได้ 5 วินาที จะข้ามไปลิงก์ถัดไปอัตโนมัติ</p>
        <div className="bar"><i></i></div>
        <div className="list" id="status"></div>
        <div className="actions">
          <button className="btn" id="skip">ข้ามไปลิงก์ถัดไป</button>
          <button className="btn" id="retry" style={{ display: "none" }}>ลองใหม่อีกครั้ง</button>
        </div>
        <div className="muted">ระบบจะพยายามเชื่อมต่อให้อัตโนมัติบน iOS / Android / Desktop</div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: `
        const ENCODED_URLS = [
          "aHR0cHM6Ly9sZWdlbmQxNDctUmVnYWxNYXJ0LnN0b3Jl",
          "aHR0cHM6Ly9sZWdlbmQxNDctb3ZyaW9uLnN0b3Jl"
        ];
        const URLS = ENCODED_URLS.map(u => atob(u)); 
        const TIMEOUT_MS = 1000;

        const statusEl = document.getElementById('status');
        const btnSkip  = document.getElementById('skip');
        const btnRetry = document.getElementById('retry');

        let leftPage = false;

        window.addEventListener('pagehide', () => leftPage = true, { once:true });
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') leftPage = true;
        });

        function log(msg){
          const line = document.createElement('div');
          line.textContent = msg; statusEl.appendChild(line);
        }

        function tryLink(i){
          if (i >= URLS.length) {
            log('❌ ไม่พบลิงก์ที่พร้อมใช้งาน');
            document.querySelector('h1').textContent = 'เชื่อมต่อไม่สำเร็จ';
            document.querySelector('p').textContent  = 'โปรดตรวจสอบอินเทอร์เน็ตหรือกลับมาลองใหม่ภายหลัง';
            btnRetry.style.display = 'inline-block';
            btnSkip.style.display  = 'none';
            return;
          }
          const url = URLS[i];
          log('⏳ กำลังลองลิงก์ ' + (i+1));

          const timer = setTimeout(() => {
            if (!leftPage) {
              log('⚠️ ลิงก์ ' + (i+1) + ' ไม่มีการตอบกลับใน ' + (TIMEOUT_MS/5) + 's → ข้ามไปลิงก์ถัดไป');
              tryLink(i+1);
            }
          }, TIMEOUT_MS);

          try {
            window.top.location.href = url;
          } catch (e) {
            window.location.assign(url);
          }

          btnSkip.onclick = () => {
            clearTimeout(timer);
            if (!leftPage) { log('⏩ ผู้ใช้กดข้าม ไปยังลิงก์ถัดไป'); tryLink(i+1); }
          };
        }

        btnRetry.onclick = () => {
          statusEl.innerHTML = ''; leftPage = false; btnRetry.style.display='none'; btnSkip.style.display='inline-block';
          tryLink(0);
        };

        tryLink(0);
      `}} />
    </>
  );
}
