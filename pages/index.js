import { useEffect, useState } from "react";

export default function Home() {
  const [urls, setUrls] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUrls() {
      try {
        const res = await fetch("/api/urls");
        const data = await res.json();
        setUrls(data);
      } catch (err) {
        console.error("Error fetching urls:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUrls();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🚀 กำลังเชื่อมต่อเซิร์ฟเวอร์</h1>
      {loading ? (
        <p>⏳ กำลังโหลด...</p>
      ) : (
        <ul>
          {Object.entries(urls).map(([key, url]) => (
            <li key={key}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                ลิงก์ {key} → {url}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}          .list b { color: var(--acc); font-weight:600; }
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
