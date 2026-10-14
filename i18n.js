/**
 * AZ-900 Multi-Language (i18n) & Bilingual Terminology Engine
 * Supports:
 *   - 'zh': 繁體中文 (Traditional Chinese)
 *   - 'bi': 中英雙語對照 (Bilingual Chinese + English)
 *   - 'en': English
 */
(function () {
  const STORAGE_KEY = 'az900_lang';

  // Official Microsoft Learn AZ-900 Bilingual Terminology Dictionary
  const AZ900_GLOSSARY = [
    { cat: "雲端概念 Cloud Concepts", zh: "共同責任模型 / 責任共擔模型", en: "Shared Responsibility Model", desc: "雲端商負責實體安全與底層硬體；客戶永遠負責資料、端點與身分識別。" },
    { cat: "雲端概念 Cloud Concepts", zh: "資本支出", en: "Capital Expenditure (CapEx)", desc: "前期一次性購買實體伺服器與機房設備的固定投資。" },
    { cat: "雲端概念 Cloud Concepts", zh: "營運支出", en: "Operational Expenditure (OpEx)", desc: "依實際使用量隨用隨付 (Pay-as-you-go) 的雲端經常性支出。" },
    { cat: "雲端概念 Cloud Concepts", zh: "隨用隨付 / 消耗型計費模型", en: "Consumption-based Model", desc: "僅為實際使用的運算與儲存資源付費，無預付費用。" },
    { cat: "雲端概念 Cloud Concepts", zh: "高可用性", en: "High Availability (HA)", desc: "確保系統在面臨單一組件故障時仍能持續正常運作、最小化停機時間。" },
    { cat: "雲端概念 Cloud Concepts", zh: "延展性 / 可擴縮性", en: "Scalability", desc: "垂直擴充 (Scale Up 升級規格) 與水平擴充 (Scale Out 增加實例數量)。" },
    { cat: "雲端概念 Cloud Concepts", zh: "彈性", en: "Elasticity", desc: "根據即時流量負載自動放大 (Scale out) 與自動縮小 (Scale in) 資源。" },
    { cat: "雲端概念 Cloud Concepts", zh: "敏捷性", en: "Agility", desc: "能在數分鐘內快速部署與配置雲端資源，縮短產品上市時間。" },
    { cat: "雲端概念 Cloud Concepts", zh: "災難復原", en: "Disaster Recovery (DR)", desc: "在區域級重大災難發生後，從異地備援恢復系統與資料的能力。" },
    { cat: "雲端概念 Cloud Concepts", zh: "基礎結構即服務", en: "Infrastructure as a Service (IaaS)", desc: "如 Azure VM，使用者需管理客體 OS 與應用程式，具備最高控制權。" },
    { cat: "雲端概念 Cloud Concepts", zh: "平台即服務", en: "Platform as a Service (PaaS)", desc: "如 App Service、Azure SQL，微軟管理 OS，使用者只需專注於程式碼與資料。" },
    { cat: "雲端概念 Cloud Concepts", zh: "軟體即服務", en: "Software as a Service (SaaS)", desc: "如 Microsoft 365，完整託管的終端軟體服務。" },

    { cat: "核心架構 Architecture", zh: "地理位置 / 地理邊界", en: "Geography", desc: "定義資料主權 (Data Residency) 與合規性邊界，預設資料不跨出該地理區。" },
    { cat: "核心架構 Architecture", zh: "區域", en: "Azure Region", desc: "由一個或多個透過低延遲網路互連的資料中心所組成的區域。" },
    { cat: "核心架構 Architecture", zh: "可用性區域", en: "Availability Zones (AZ)", desc: "同一 Region 內具備獨立電力、冷卻與網路的實體隔離資料中心（並非每個 Region 都有）。" },
    { cat: "核心架構 Architecture", zh: "區域配對", en: "Region Pairs", desc: "同一 Geography 內兩兩配對的區域，提供循序維護更新與跨區儲存複寫（不自動包辦全系統 DR）。" },
    { cat: "核心架構 Architecture", zh: "主權雲", en: "Sovereign Clouds", desc: "實體隔離的專屬雲端：Azure Government (美國政府雲) 與 Azure China (世紀互聯 21Vianet)。" },
    { cat: "核心架構 Architecture", zh: "服務水準協定", en: "Service Level Agreement (SLA)", desc: "微軟對服務正常運作時間的財務承諾（單機 Premium SSD 99.9%、可用性設定組 99.95%、跨 AZ 符合條件 99.99%）。" },

    { cat: "身分與租戶 Identity & Tenant", zh: "租用戶 / 租戶", en: "Microsoft Entra Tenant", desc: "Microsoft Entra ID 的專屬信任目錄實例，預設網域為 *.onmicrosoft.com，具唯一 Tenant ID。" },
    { cat: "身分與租戶 Identity & Tenant", zh: "訂用帳戶", en: "Subscription", desc: "Azure 的計費與資源存取邊界。1 個 Tenant 可有多個 Subscriptions，但 1 個 Subscription 只能信任 1 個 Tenant。" },
    { cat: "身分與租戶 Identity & Tenant", zh: "管理群組", en: "Management Groups", desc: "位於 Subscription 之上的治理層級，可跨多個訂用帳戶統一套用原則與 RBAC。" },
    { cat: "身分與租戶 Identity & Tenant", zh: "資源群組", en: "Resource Group (RG)", desc: "存放相關 Azure 資源的邏輯容器，共用相同的生命週期。" },
    { cat: "身分與租戶 Identity & Tenant", zh: "外部來賓協作", en: "Microsoft Entra External ID (B2B Guest)", desc: "邀請外部使用者 (#EXT#) 進入 Tenant，由原機構驗證身分、目標 Tenant 控制 RBAC 授權。" },
    { cat: "身分與租戶 Identity & Tenant", zh: "條件式存取", en: "Conditional Access", desc: "在第一因素驗證後觸發的零信任原則引擎，依位置、裝置與風險動態要求 MFA 或阻擋存取。" },
    { cat: "身分與租戶 Identity & Tenant", zh: "角色型存取控制", en: "Role-Based Access Control (RBAC)", desc: "管理誰對 Azure 資源有何權限（內建角色：Owner 所有權人、Contributor 參與者、Reader 讀取者）。" },

    { cat: "運算與網路 Compute & Network", zh: "虛擬機器擴展集", en: "Virtual Machine Scale Sets (VMSS)", desc: "自動水平擴縮 (Autoscale) 一組相同配置的負載平衡 VM。" },
    { cat: "運算與網路 Compute & Network", zh: "可用性設定組", en: "Availability Set", desc: "同一資料中心內跨容錯網域 (Fault Domain) 與更新網域 (Update Domain) 分散 VM（SLA 99.95%）。" },
    { cat: "運算與網路 Compute & Network", zh: "無伺服器函數運算", en: "Azure Functions", desc: "事件驅動 (Event-driven) 的無伺服器程式碼執行服務，依執行次數與時間計費。" },
    { cat: "運算與網路 Compute & Network", zh: "容器執行個體", en: "Azure Container Instances (ACI)", desc: "最快、最簡單執行單一容器的無伺服器方案，免管理 VM 與叢集。" },
    { cat: "運算與網路 Compute & Network", zh: "虛擬網路對等互連", en: "VNet Peering", desc: "透過微軟私有骨幹網路低延遲連接兩個 VNet。" },
    { cat: "運算與網路 Compute & Network", zh: "網路安全群組", en: "Network Security Group (NSG)", desc: "第 4 層 (IP/Port/協定) 流量過濾防火牆，規則優先順序 100~4096 數字愈小愈優先。" },
    { cat: "運算與網路 Compute & Network", zh: "應用程式閘道", en: "Azure Application Gateway", desc: "第 7 層 (HTTP/HTTPS) 負載平衡器，支援 URL 路徑路由、SSL 卸載與 WAF 防火牆。" },
    { cat: "運算與網路 Compute & Network", zh: "專用私有連線", en: "Azure ExpressRoute", desc: "不經由公共網際網路的地端到 Azure 專用私有光纖連線，高頻寬、低延遲。" },

    { cat: "儲存體與治理 Storage & Governance", zh: "本地備援儲存體", en: "Locally Redundant Storage (LRS)", desc: "在主要區域單一資料中心內同步儲存 3 份複本（11 個 9 耐用性）。" },
    { cat: "儲存體與治理 Storage & Governance", zh: "區域備援儲存體", en: "Zone-Redundant Storage (ZRS)", desc: "在主要區域跨 3 個可用性區域 (AZ) 同步複寫（12 個 9 耐用性）。" },
    { cat: "儲存體與治理 Storage & Governance", zh: "讀取存取異地備援儲存體", en: "Read-Access Geo-Redundant Storage (RA-GRS)", desc: "主區域採 LRS，並異步複製至次要配對區域（LRS），且次要區域隨時開放唯讀存取。" },
    { cat: "儲存體與治理 Storage & Governance", zh: "讀取存取異地區域備援儲存體", en: "Read-Access Geo-Zone-Redundant Storage (RA-GZRS)", desc: "主區域採跨 3 個 AZ 的 ZRS，並異步複製至次要區域且隨時開放唯讀存取（16 個 9 耐用性）。" },
    { cat: "儲存體與治理 Storage & Governance", zh: "資源鎖定", en: "Resource Locks", desc: "防止資源遭意外刪除或修改：CanNotDelete (不可刪除) 與 ReadOnly (唯讀)。" },
    { cat: "儲存體與治理 Storage & Governance", zh: "Azure 原則", en: "Azure Policy", desc: "大規模評估與強制執行企業合規性規則（例如限制允許部署的 Region 或 VM SKU）。" },
    { cat: "儲存體與治理 Storage & Governance", zh: "Azure 混合式權益", en: "Azure Hybrid Benefit (AHB)", desc: "將地端具備 Software Assurance 的 Windows Server / SQL Server 授權帶上雲端以大幅節省授權費。" }
  ];

  // English Day Titles for All-Days Grid and Daily Page Headers
  const DAY_TITLES_EN = {
    "day2.html": { badge: "DAY 2", name: "Infrastructure", full: "Azure Core Infrastructure: Regions, AZs, Region Pairs & SLA" },
    "day3.html": { badge: "DAY 3", name: "Sovereign Clouds", full: "Sovereign Clouds (Azure Gov & China) & Compliance" },
    "day4.html": { badge: "DAY 4", name: "Mgmt Tools", full: "Management Tools: Portal, CLI, PowerShell, Cloud Shell & Arc" },
    "day5.html": { badge: "DAY 5", name: "ARM & Bicep", full: "Infrastructure as Code (IaC): ARM Templates & Bicep" },
    "day6.html": { badge: "DAY 6", name: "Advisor & Health", full: "Azure Advisor & Azure Service Health" },
    "day7.html": { badge: "DAY 7", name: "Review 1", full: "Milestone Review 1: Cloud Concepts & Core Architecture" },
    "day8.html": { badge: "DAY 8", name: "VM & VMSS", full: "Compute: Virtual Machines (VM) & Scale Sets (VMSS)" },
    "day9.html": { badge: "DAY 9", name: "App Service", full: "PaaS & Serverless: App Service & Azure Functions" },
    "day10.html": { badge: "DAY 10", name: "ACI & AKS", full: "Containers: Azure Container Instances (ACI) & AKS" },
    "day11.html": { badge: "DAY 11", name: "VNet & Subnet", full: "Networking: Virtual Network (VNet), Subnets & Peering" },
    "day12.html": { badge: "DAY 12", name: "NSG & ASG", full: "Network Security: NSG & Application Security Groups (ASG)" },
    "day13.html": { badge: "DAY 13", name: "ExpressRoute", full: "Hybrid Connectivity: VPN Gateway vs. ExpressRoute" },
    "day14.html": { badge: "DAY 14", name: "Load Balancer", full: "Traffic Distribution: Load Balancer vs. Application Gateway" },
    "day15.html": { badge: "DAY 15", name: "Blob Storage", full: "Object Storage: Azure Blob Storage & Access Tiers" },
    "day16.html": { badge: "DAY 16", name: "Azure Files", full: "Shared Files & Disks: Azure Files & Managed Disks" },
    "day17.html": { badge: "DAY 17", name: "Storage Explorer", full: "Data Migration: Storage Explorer, AzCopy & Data Box" },
    "day18.html": { badge: "DAY 18", name: "SQL Database", full: "Relational DBs: Azure SQL Database & Managed Instance" },
    "day19.html": { badge: "DAY 19", name: "Cosmos DB", full: "Global NoSQL: Azure Cosmos DB" },
    "day20.html": { badge: "DAY 20", name: "Synapse", full: "Analytics: Azure Synapse Analytics & Databricks" },
    "day21.html": { badge: "DAY 21", name: "Review 2", full: "Milestone Review 2: Compute, Networking, Storage & DB" },
    "day22.html": { badge: "DAY 22", name: "Entra & Tenant", full: "Identity: Microsoft Entra ID, Tenant Login & Conditional Access" },
    "day23.html": { badge: "DAY 23", name: "RBAC", full: "Access Management: Azure RBAC & Resource Hierarchy" },
    "day24.html": { badge: "DAY 24", name: "Zero Trust", full: "Security: Zero Trust & Microsoft Defender for Cloud" },
    "day25.html": { badge: "DAY 25", name: "Key Vault", full: "Secrets & SIEM: Azure Key Vault & Microsoft Sentinel" },
    "day26.html": { badge: "DAY 26", name: "Azure Policy", full: "Governance: Azure Policy, Resource Locks & Tags" },
    "day27.html": { badge: "DAY 27", name: "Cost Mgmt", full: "Cost Management, Pricing Calculator & TCO" },
    "day28.html": { badge: "DAY 28", name: "Exam Formats", full: "Exam Strategy: Mastering Special AZ-900 Question Types" },
    "day29.html": { badge: "DAY 29", name: "Mock Exam 1", full: "Full Mock Exam 1 (50 Questions)" },
    "day30.html": { badge: "DAY 30", name: "Final Boss 2", full: "Final Boss Mock Exam 2 (50 Questions)" },
    "scenario.html": { badge: "SCENARIO", name: "50 Scenarios", full: "AZ-900 Scenario Practice Quiz (50 Questions)" }
  };

  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'zh' || saved === 'bi' || saved === 'en') return saved;
    return 'bi'; // Default to Bilingual (中英雙語) so users get the best of both worlds!
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-TW';
    updateLangButtons(lang);
    applyPageTranslation(lang);
    if (typeof window.onAz900LangChange === 'function') {
      window.onAz900LangChange(lang);
    }
  }

  function injectLangToolbar() {
    if (document.getElementById('az900-i18n-bar')) return;

    const style = document.createElement('style');
    style.textContent = `
      .az900-i18n-bar {
        width: 100%;
        max-width: 900px;
        margin: 0 auto 14px;
        padding: 8px 14px;
        background: #ffffff;
        border: 1px solid #d2d0ce;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        font-family: 'Segoe UI', system-ui, sans-serif;
      }
      .az900-i18n-left {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.82rem;
        color: #605e5c;
        font-weight: 600;
      }
      .az900-i18n-group {
        display: inline-flex;
        border: 1px solid #0078d4;
        border-radius: 6px;
        overflow: hidden;
      }
      .az900-lang-btn {
        border: none;
        background: #ffffff;
        color: #0078d4;
        padding: 5px 11px;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
        border-right: 1px solid #d0e8f8;
      }
      .az900-lang-btn:last-child {
        border-right: none;
      }
      .az900-lang-btn:hover {
        background: #eef6fc;
      }
      .az900-lang-btn.active {
        background: #0078d4;
        color: #ffffff;
      }
      .az900-dict-btn {
        border: 1px solid #005a9e;
        background: #eef6fc;
        color: #005a9e;
        padding: 5px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s;
      }
      .az900-dict-btn:hover {
        background: #d0e8f8;
      }
      /* Glossary Modal */
      .az900-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.45);
        z-index: 9999;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }
      .az900-modal-backdrop.open {
        display: flex;
      }
      .az900-modal {
        background: #fff;
        border-radius: 10px;
        max-width: 820px;
        width: 100%;
        max-height: 85vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 12px 32px rgba(0,0,0,0.22);
        overflow: hidden;
      }
      .az900-modal-header {
        padding: 16px 20px;
        background: #0078d4;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .az900-modal-header h3 {
        font-size: 1.05rem;
        margin: 0;
      }
      .az900-modal-close {
        background: transparent;
        border: none;
        color: #fff;
        font-size: 1.3rem;
        cursor: pointer;
        line-height: 1;
      }
      .az900-modal-search {
        padding: 12px 20px;
        border-bottom: 1px solid #e1dfdd;
        background: #faf9f8;
      }
      .az900-modal-search input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #c8c6c4;
        border-radius: 6px;
        font-size: 0.9rem;
      }
      .az900-modal-body {
        padding: 16px 20px;
        overflow-y: auto;
      }
      .az900-term-item {
        padding: 10px 12px;
        border-bottom: 1px solid #edebe9;
        font-size: 0.86rem;
      }
      .az900-term-item:last-child {
        border-bottom: none;
      }
      .az900-term-head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 4px;
      }
      .az900-term-zh {
        font-weight: 700;
        color: #005a9e;
        font-size: 0.92rem;
      }
      .az900-term-en {
        font-weight: 700;
        color: #0078d4;
        background: #eef6fc;
        padding: 1px 7px;
        border-radius: 4px;
        font-size: 0.82rem;
      }
      .az900-term-cat {
        font-size: 0.72rem;
        color: #605e5c;
        background: #f3f2f1;
        padding: 1px 6px;
        border-radius: 4px;
      }
      .az900-term-desc {
        color: #323130;
        line-height: 1.5;
      }
      .bi-sub {
        display: block;
        font-size: 0.86em;
        color: #005a9e;
        margin-top: 3px;
        font-weight: 400;
      }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = 'az900-i18n-bar';
    bar.className = 'az900-i18n-bar';
    bar.innerHTML = `
      <div class="az900-i18n-left">
        <span>🌐 語言模式 / Language：</span>
        <div class="az900-i18n-group">
          <button type="button" class="az900-lang-btn" data-lang="zh">繁體中文</button>
          <button type="button" class="az900-lang-btn" data-lang="bi">中英雙語 (Bilingual)</button>
          <button type="button" class="az900-lang-btn" data-lang="en">English</button>
        </div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <button type="button" class="az900-dict-btn" id="az900OpenDictBtn">📘 AZ-900 中英術語對照表</button>
      </div>
    `;

    // Insert at top of body or right before header
    const header = document.querySelector('header');
    if (header && header.parentNode) {
      header.parentNode.insertBefore(bar, header);
    } else {
      document.body.prepend(bar);
    }

    bar.querySelectorAll('.az900-lang-btn').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
    });

    // Inject Glossary Modal
    const modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'az900DictModal';
    modalBackdrop.className = 'az900-modal-backdrop';
    modalBackdrop.innerHTML = `
      <div class="az900-modal" role="dialog" aria-modal="true">
        <div class="az900-modal-header">
          <h3>📘 Microsoft Azure AZ-900 官方中英術語對照辭典</h3>
          <button type="button" class="az900-modal-close" id="az900CloseDictBtn">&times;</button>
        </div>
        <div class="az900-modal-search">
          <input type="text" id="az900DictSearch" placeholder="搜尋中文或英文術語 (例如：Tenant, 租戶, ZRS, SLA, RBAC, ExpressRoute)..." />
        </div>
        <div class="az900-modal-body" id="az900DictList"></div>
      </div>
    `;
    document.body.appendChild(modalBackdrop);

    function renderGlossary(filterText) {
      const listEl = document.getElementById('az900DictList');
      const q = (filterText || '').trim().toLowerCase();
      const filtered = AZ900_GLOSSARY.filter(item =>
        !q ||
        item.zh.toLowerCase().includes(q) ||
        item.en.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.cat.toLowerCase().includes(q)
      );
      if (filtered.length === 0) {
        listEl.innerHTML = `<div style="padding:20px;text-align:center;color:#605e5c;">找不到符合「${filterText}」的術語 / No matching terms found.</div>`;
        return;
      }
      listEl.innerHTML = filtered.map(item => `
        <div class="az900-term-item">
          <div class="az900-term-head">
            <div>
              <span class="az900-term-zh">${item.zh}</span>
              <span class="az900-term-en">${item.en}</span>
            </div>
            <span class="az900-term-cat">${item.cat}</span>
          </div>
          <div class="az900-term-desc">${item.desc}</div>
        </div>
      `).join('');
    }

    document.getElementById('az900OpenDictBtn').addEventListener('click', () => {
      renderGlossary('');
      document.getElementById('az900DictSearch').value = '';
      modalBackdrop.classList.add('open');
      setTimeout(() => document.getElementById('az900DictSearch').focus(), 50);
    });
    document.getElementById('az900CloseDictBtn').addEventListener('click', () => {
      modalBackdrop.classList.remove('open');
    });
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
    });
    document.getElementById('az900DictSearch').addEventListener('input', (e) => {
      renderGlossary(e.target.value);
    });
  }

  function updateLangButtons(lang) {
    document.querySelectorAll('.az900-lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    const dictBtn = document.getElementById('az900OpenDictBtn');
    if (dictBtn) {
      dictBtn.textContent = lang === 'en'
        ? '📘 AZ-900 Bilingual Glossary'
        : (lang === 'bi' ? '📘 AZ-900 中英術語辭典 (Glossary)' : '📘 AZ-900 中英術語對照表');
    }
  }

  // Automatic bilingual term enrichment for Chinese quiz pages when in 'bi' or 'en' mode
  const TERM_PAIRS = [
    ["可用性區域", "Availability Zones"],
    ["可用性設定組", "Availability Set"],
    ["區域配對", "Region Pairs"],
    ["虛擬機器擴展集", "Virtual Machine Scale Sets"],
    ["條件式存取", "Conditional Access"],
    ["角色型存取控制", "RBAC"],
    ["管理群組", "Management Groups"],
    ["訂用帳戶", "Subscription"],
    ["資源群組", "Resource Group"],
    ["租用戶", "Tenant"],
    ["多重要素驗證", "MFA"],
    ["單一登入", "Single Sign-On (SSO)"],
    ["零信任", "Zero Trust"],
    ["共同責任模型", "Shared Responsibility Model"],
    ["資源鎖定", "Resource Locks"],
    ["混合式權益", "Azure Hybrid Benefit"]
  ];

  function enrichBilingualText(text, lang) {
    if (!text || lang === 'zh') return text;
    let out = text;
    TERM_PAIRS.forEach(([zh, en]) => {
      if (out.includes(zh) && !out.toLowerCase().includes(en.toLowerCase())) {
        out = out.replace(zh, `${zh} (${en})`);
      }
    });
    return out;
  }

  function applyPageTranslation(lang) {
    // 1. Update Skip / Next buttons if present
    const skipBtn = document.getElementById('skipBtn');
    if (skipBtn) {
      skipBtn.textContent = lang === 'en' ? 'Skip' : (lang === 'bi' ? '略過 (Skip)' : '略過');
    }
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      nextBtn.textContent = lang === 'en' ? 'Next →' : (lang === 'bi' ? '下一題 (Next) →' : '下一題 →');
    }

    // 2. Update Scenario box label if present
    const sceneLabel = document.querySelector('.scene-label');
    if (sceneLabel) {
      sceneLabel.textContent = lang === 'en' ? 'SCENARIO' : (lang === 'bi' ? '情境 (Scenario)' : '情境');
    }

    // 3. Update Progress & Score text on non-index daily pages
    const progressText = document.getElementById('progressText');
    if (progressText && window.location.pathname.indexOf('index.html') === -1 && window.location.pathname !== '/') {
      const m = progressText.textContent.match(/(\d+)\s*\/\s*(\d+)/) || progressText.textContent.match(/(\d+)\s+of\s+(\d+)/i);
      if (m) {
        const cur = m[1], tot = m[2];
        progressText.textContent = lang === 'en'
          ? `Question ${cur} of ${tot}`
          : (lang === 'bi' ? `題目 ${cur} / ${tot} (Q${cur} of ${tot})` : `題目 ${cur} / ${tot}`);
      } else if (progressText.textContent.includes('完成') || progressText.textContent.includes('Complete')) {
        progressText.textContent = lang === 'en' ? 'Complete' : (lang === 'bi' ? '全部完成 (Complete)' : '全部完成');
      }
    }

    const scoreText = document.getElementById('scoreText');
    if (scoreText && window.location.pathname.indexOf('index.html') === -1 && window.location.pathname !== '/') {
      const m = scoreText.textContent.match(/(\d+)/);
      if (m) {
        const sc = m[1];
        scoreText.textContent = lang === 'en' ? `Score: ${sc}` : (lang === 'bi' ? `得分 (Score)：${sc}` : `得分：${sc}`);
      }
    }

    // 4. Question Type badge translation
    const qtypeBadge = document.getElementById('qtypeBadge');
    if (qtypeBadge && qtypeBadge.textContent) {
      const raw = qtypeBadge.getAttribute('data-raw-type') || qtypeBadge.textContent.trim();
      qtypeBadge.setAttribute('data-raw-type', raw);
      const map = {
        "單選題": { zh: "單選題", bi: "單選題 (Multiple Choice)", en: "Multiple Choice" },
        "是非題": { zh: "是非題", bi: "是非題 (Yes / No)", en: "Yes / No" },
        "情境題": { zh: "情境題", bi: "情境題 (Scenario)", en: "Scenario" },
        "多選題": { zh: "多選題", bi: "多選題 (Multiple Response)", en: "Multiple Response" },
        "Multiple Choice": { zh: "單選題", bi: "單選題 (Multiple Choice)", en: "Multiple Choice" },
        "Hot Area Drop-down": { zh: "熱區下拉題", bi: "熱區下拉題 (Hot Area Drop-down)", en: "Hot Area Drop-down" },
        "Repeated Scenario": { zh: "連續情境題", bi: "連續情境題 (Repeated Scenario)", en: "Repeated Scenario" },
        "Best Answer": { zh: "最佳答案題", bi: "最佳答案題 (Best Answer)", en: "Best Answer" },
        "Drag & Drop": { zh: "拖放配對題", bi: "拖放配對題 (Drag & Drop)", en: "Drag & Drop" },
        "Case Study": { zh: "案例研究題", bi: "案例研究題 (Case Study)", en: "Case Study" },
        "Multiple Response": { zh: "複選題", bi: "複選題 (Multiple Response)", en: "Multiple Response" },
        "Hot Area Graphic/UI": { zh: "介面熱區題", bi: "介面熱區題 (Hot Area UI)", en: "Hot Area Graphic/UI" }
      };
      if (map[raw]) {
        qtypeBadge.textContent = map[raw][lang] || raw;
      }
    }

    // 5. Enrich question text on daily pages when in bi/en mode
    const qTextEl = document.getElementById('questionText');
    if (qTextEl && window.location.pathname.indexOf('index.html') === -1 && window.location.pathname !== '/') {
      const rawQ = qTextEl.getAttribute('data-raw-q') || qTextEl.textContent;
      qTextEl.setAttribute('data-raw-q', rawQ);
      qTextEl.textContent = enrichBilingualText(rawQ, lang);
    }
  }

  function hookDailyQuizFunctions() {
    // Hook renderQuestion and selectAnswer on daily quiz pages so dynamic renders stay localized
    if (window.location.pathname.indexOf('index.html') !== -1 || window.location.pathname === '/') return;

    const origRender = window.renderQuestion;
    if (typeof origRender === 'function') {
      window.renderQuestion = function () {
        origRender.apply(this, arguments);
        const qTextEl = document.getElementById('questionText');
        if (qTextEl) qTextEl.removeAttribute('data-raw-q');
        const qtypeBadge = document.getElementById('qtypeBadge');
        if (qtypeBadge) qtypeBadge.removeAttribute('data-raw-type');
        applyPageTranslation(getLang());
      };
    }

    const origSelect = window.selectAnswer;
    if (typeof origSelect === 'function') {
      window.selectAnswer = function (idx) {
        origSelect.apply(this, arguments);
        const lang = getLang();
        const exp = document.getElementById('explanation');
        if (exp && exp.innerHTML) {
          if (lang === 'en') {
            exp.innerHTML = exp.innerHTML
              .replace('✓ 答對了！', '✓ Correct!')
              .replace('✗ 答錯了', '✗ Incorrect');
          } else if (lang === 'bi') {
            exp.innerHTML = exp.innerHTML
              .replace('✓ 答對了！', '✓ 答對了！ (Correct!)')
              .replace('✗ 答錯了', '✗ 答錯了 (Incorrect)');
          }
        }
        applyPageTranslation(lang);
      };
    }
  }

  window.AZ900_I18N = {
    getLang,
    setLang,
    DAY_TITLES_EN,
    AZ900_GLOSSARY
  };

  function init() {
    injectLangToolbar();
    const lang = getLang();
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-TW';
    updateLangButtons(lang);
    hookDailyQuizFunctions();
    applyPageTranslation(lang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
