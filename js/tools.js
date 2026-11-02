/* 
  Tech Simpld - Interactive Client-Side Tools Engine
  Tool 1: Docker Compose & Environment File Generator
  Tool 2: Markdown Table & Frontmatter Formatter
  Tool 3: Local Network Subnet & IP Calculator
  Tool 4: Home Server Power Consumption & Electricity Cost Calculator
  Tool 5: Proxmox LXC & VM Resource Sizing Planner
  100% Client-Side Vanilla JavaScript. Zero External Dependencies.
*/

document.addEventListener('DOMContentLoaded', () => {
  initToolTabs();
  initToast();
  initDockerGenerator();
  initMarkdownFormatter();
  initSubnetCalculator();
  initPowerCalculator();
  initProxmoxPlanner();
});

/* Common: Tab Navigation, Hub Cards & Hash Routing */
function initToolTabs() {
  const tabBtns = Array.from(document.querySelectorAll('.tool-tab-btn'));
  const navGroups = Array.from(document.querySelectorAll('.sidebar-nav-group'));
  const sections = document.querySelectorAll('.tool-section');
  const searchInput = document.getElementById('toolSearchInput');
  const emptyState = document.getElementById('sidebarEmptyState');
  const emptyQuerySpan = document.getElementById('sidebarEmptyQuery');
  const resetSearchBtn = document.getElementById('resetToolSearchBtn');
  const countMeta = document.getElementById('toolsCountMeta');

  const mobileSwitcherBtn = document.getElementById('mobileSwitcherBtn');
  const mobileActiveToolName = document.getElementById('mobileActiveToolName');
  const sidebarRail = document.getElementById('toolsSidebarRail');

  function closeMobileDrawer() {
    if (sidebarRail && mobileSwitcherBtn) {
      sidebarRail.classList.remove('mobile-open');
      mobileSwitcherBtn.setAttribute('aria-expanded', 'false');
    }
  }

  function activateTab(targetId, updateHash = true) {
    let activeTitle = '';

    tabBtns.forEach(btn => {
      const isTarget = btn.getAttribute('data-target') === targetId;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      btn.setAttribute('tabindex', isTarget ? '0' : '-1');
      if (isTarget) {
        const titleEl = btn.querySelector('.nav-item-title');
        activeTitle = titleEl ? titleEl.textContent.trim() : btn.textContent.trim();
      }
    });

    if (mobileActiveToolName && activeTitle) {
      mobileActiveToolName.textContent = activeTitle;
    }

    sections.forEach(sec => {
      const isTarget = sec.id === targetId;
      sec.classList.toggle('active', isTarget);
    });

    if (updateHash) {
      const hashName = targetId.replace('tool-', '');
      history.replaceState(null, null, `#${hashName}`);
    }

    closeMobileDrawer();
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      activateTab(targetId, true);
      if (window.innerWidth < 960) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });

    btn.addEventListener('keydown', (e) => {
      const visibleBtns = tabBtns.filter(b => !b.hidden);
      const currentIdx = visibleBtns.indexOf(btn);
      if (currentIdx === -1) return;

      let nextIdx = -1;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        nextIdx = (currentIdx + 1) % visibleBtns.length;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        nextIdx = (currentIdx - 1 + visibleBtns.length) % visibleBtns.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIdx = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIdx = visibleBtns.length - 1;
      }

      if (nextIdx !== -1 && visibleBtns[nextIdx]) {
        const nextBtn = visibleBtns[nextIdx];
        nextBtn.focus();
        activateTab(nextBtn.getAttribute('data-target'), true);
      }
    });
  });

  if (mobileSwitcherBtn && sidebarRail) {
    mobileSwitcherBtn.addEventListener('click', () => {
      const isOpen = sidebarRail.classList.toggle('mobile-open');
      mobileSwitcherBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen && searchInput) {
        searchInput.focus();
      }
    });
  }

  function filterTools(query) {
    const q = (query || '').trim().toLowerCase();
    let visibleCount = 0;

    tabBtns.forEach(btn => {
      const text = btn.textContent.toLowerCase();
      const keywords = (btn.getAttribute('data-keywords') || '').toLowerCase();
      const matches = !q || text.includes(q) || keywords.includes(q);
      btn.hidden = !matches;
      if (matches) visibleCount++;
    });

    navGroups.forEach(group => {
      const hasVisibleChild = Array.from(group.querySelectorAll('.tool-tab-btn')).some(b => !b.hidden);
      group.hidden = !hasVisibleChild;
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
      if (emptyQuerySpan) emptyQuerySpan.textContent = query.trim();
    }

    if (countMeta) {
      countMeta.textContent = q
        ? `${visibleCount} of ${tabBtns.length} Utilities`
        : `${tabBtns.length} Interactive Utilities`;
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterTools(searchInput.value);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        filterTools('');
        searchInput.blur();
      } else if (e.key === 'Enter') {
        const firstVisible = tabBtns.find(b => !b.hidden);
        if (firstVisible) {
          activateTab(firstVisible.getAttribute('data-target'), true);
        }
      }
    });
  }

  if (resetSearchBtn && searchInput) {
    resetSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterTools('');
      searchInput.focus();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && searchInput) {
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
      const isEditable = tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target && e.target.isContentEditable);
      if (!isEditable) {
        e.preventDefault();
        if (window.innerWidth < 960 && sidebarRail && !sidebarRail.classList.contains('mobile-open')) {
          sidebarRail.classList.add('mobile-open');
          if (mobileSwitcherBtn) mobileSwitcherBtn.setAttribute('aria-expanded', 'true');
        }
        searchInput.focus();
        searchInput.select();
      }
    } else if (e.key === 'Escape') {
      closeMobileDrawer();
    }
  });

  // Check URL hash on load
  const hash = window.location.hash.toLowerCase().replace('#', '');
  if (hash === 'docker' || hash === 'compose') {
    activateTab('tool-docker', false);
  } else if (hash === 'markdown' || hash === 'frontmatter' || hash === 'table') {
    activateTab('tool-markdown', false);
  } else if (hash === 'subnet' || hash === 'ip' || hash === 'calculator') {
    activateTab('tool-subnet', false);
  } else if (hash === 'power' || hash === 'electricity' || hash === 'energy' || hash === 'watts') {
    activateTab('tool-power', false);
  } else if (hash === 'proxmox' || hash === 'lxc' || hash === 'vm' || hash === 'sizer') {
    activateTab('tool-proxmox', false);
  } else {
    activateTab('tool-docker', false);
  }
}

/* Common: Toast Notifications */
let toastTimeout;
function showToast(message = 'Copied to clipboard!') {
  let toast = document.getElementById('toolsToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toolsToast';
    toast.className = 'tools-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
  if (!text) return;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => showToast(successMsg))
      .catch(() => fallbackCopy(text, successMsg));
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (err) {
    showToast('Failed to copy. Please select and copy manually.');
  }
  document.body.removeChild(textArea);
}

function downloadFile(filename, content, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function initToast() {
  // Container already primed
}

/* Tool 1: Docker Compose & Environment File Generator */
const DOCKER_APPS_CATALOG = [
  {
    id: 'gotify',
    name: 'Gotify',
    category: 'Push Notifications',
    image: 'gotify/server:latest',
    defaultPort: '8088',
    containerPort: '80',
    restart: 'unless-stopped',
    volumes: [
      { host: './gotify/data', container: '/app/data' }
    ],
    ports: ['8088:80'],
    env: {
      'GOTIFY_DEFAULTUSER_NAME': 'admin',
      'GOTIFY_DEFAULTUSER_PASS': '${GOTIFY_PASSWORD:-ChangeThisPass!}'
    }
  },
  {
    id: 'uptime_kuma',
    name: 'Uptime Kuma',
    category: 'Server Monitoring',
    image: 'louislam/uptime-kuma:1',
    defaultPort: '3001',
    containerPort: '3001',
    restart: 'always',
    volumes: [
      { host: './uptime-kuma/data', container: '/app/data' }
    ],
    ports: ['3001:3001'],
    env: {}
  },
  {
    id: 'adguard',
    name: 'AdGuard Home',
    category: 'DNS & Ad-Blocking',
    image: 'adguard/adguardhome:latest',
    defaultPort: '3000',
    containerPort: '3000',
    dnsPort: '53',
    restart: 'unless-stopped',
    volumes: [
      { host: './adguard/work', container: '/opt/adguardhome/work' },
      { host: './adguard/conf', container: '/opt/adguardhome/conf' }
    ],
    ports: ['3000:3000/tcp', '53:53/tcp', '53:53/udp', '80:80/tcp'],
    env: {}
  },
  {
    id: 'pihole',
    name: 'Pi-hole',
    category: 'DNS & Ad-Blocking',
    image: 'pihole/pihole:latest',
    defaultPort: '8080',
    containerPort: '80',
    dnsPort: '53',
    restart: 'unless-stopped',
    volumes: [
      { host: './pihole/etc-pihole', container: '/etc/pihole' },
      { host: './pihole/etc-dnsmasq.d', container: '/etc/dnsmasq.d' }
    ],
    ports: ['8080:80/tcp', '53:53/tcp', '53:53/udp'],
    env: {
      'TZ': '${TZ}',
      'WEBPASSWORD': '${PIHOLE_PASSWORD:-ChangeThisAdminPass!}',
      'FTLCONF_LOCAL_IPV4': '${SERVER_IP:-192.168.1.50}'
    }
  },
  {
    id: 'obsidian',
    name: 'Obsidian (Web Browser)',
    category: 'PKM & Notes',
    image: 'lscr.io/linuxserver/obsidian:latest',
    defaultPort: '3000',
    containerPort: '3000',
    restart: 'unless-stopped',
    volumes: [
      { host: './obsidian/config', container: '/config' },
      { host: './obsidian/vaults', container: '/vaults' }
    ],
    ports: ['3000:3000', '3001:3001'],
    env: {
      'PUID': '${PUID}',
      'PGID': '${PGID}',
      'TZ': '${TZ}',
      'CUSTOM_USER': 'admin',
      'PASSWORD': '${OBSIDIAN_PASSWORD:-ChangeThisPassword!}'
    }
  },
  {
    id: 'cloudflared',
    name: 'Cloudflare Tunnel',
    category: 'Zero Trust & Remote Access',
    image: 'cloudflare/cloudflared:latest',
    defaultPort: 'Outbound',
    containerPort: '',
    restart: 'unless-stopped',
    command: 'tunnel --no-autoupdate run --token ${CLOUDFLARE_TUNNEL_TOKEN:-PasteYourTunnelTokenHere}',
    volumes: [],
    ports: [],
    env: {}
  },
  {
    id: 'nextcloud',
    name: 'Nextcloud AIO / Server',
    category: 'Cloud Storage & Backup',
    image: 'nextcloud:apache',
    defaultPort: '8080',
    containerPort: '80',
    restart: 'unless-stopped',
    volumes: [
      { host: './nextcloud/html', container: '/var/www/html' },
      { host: './nextcloud/data', container: '/var/www/html/data' }
    ],
    ports: ['8080:80'],
    env: {
      'MYSQL_DATABASE': 'nextcloud',
      'MYSQL_USER': 'nextcloud',
      'MYSQL_PASSWORD': '${NEXTCLOUD_DB_PASSWORD:-SecretDatabasePass!}',
      'MYSQL_HOST': 'db'
    }
  },
  {
    id: 'couchdb',
    name: 'CouchDB (Obsidian LiveSync)',
    category: 'Database & Vault Sync',
    image: 'couchdb:3.3.3',
    defaultPort: '5984',
    containerPort: '5984',
    restart: 'unless-stopped',
    volumes: [
      { host: './couchdb/data', container: '/opt/couchdb/data' },
      { host: './couchdb/local.ini', container: '/opt/couchdb/etc/local.d/local.ini' }
    ],
    ports: ['5984:5984'],
    env: {
      'COUCHDB_USER': 'admin',
      'COUCHDB_PASSWORD': '${COUCHDB_PASSWORD:-SecretCouchDbPass!}'
    }
  }
];

let customServicesList = [];

function initDockerGenerator() {
  const appGrid = document.getElementById('dockerAppsGrid');
  const serviceSettingsContainer = document.getElementById('dockerServiceSettings');
  const composeCodePre = document.getElementById('dockerComposeCode');
  const envCodePre = document.getElementById('dockerEnvCode');
  const addCustomServiceBtn = document.getElementById('addCustomServiceBtn');
  
  if (!appGrid || !composeCodePre) return;

  // Render App Selection Grid
  appGrid.innerHTML = DOCKER_APPS_CATALOG.map(app => `
    <div class="app-card" data-app-id="${app.id}">
      <input type="checkbox" id="chk_${app.id}" data-app-id="${app.id}" aria-label="Select ${app.name}">
      <div class="app-card-info">
        <span class="app-card-name">${app.name}</span>
        <span class="app-card-category">${app.category}</span>
        <span class="app-card-ports">${app.ports.length > 0 ? 'Port ' + app.ports[0] : 'Outbound Tunnel'}</span>
      </div>
    </div>
  `).join('');

  // Default selection: AdGuard & Uptime Kuma for a realistic starter homelab
  const defaultSelected = ['adguard', 'uptime_kuma'];
  defaultSelected.forEach(id => {
    const chk = document.getElementById(`chk_${id}`);
    if (chk) {
      chk.checked = true;
      chk.closest('.app-card').classList.add('selected');
    }
  });

  // App Selection Listeners
  appGrid.querySelectorAll('.app-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const checkbox = card.querySelector('input[type="checkbox"]');
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      card.classList.toggle('selected', checkbox.checked);
      renderServiceSettings();
      generateDockerOutput();
    });
  });

  // Global Config Inputs Listeners
  const globalInputs = ['dockerProjectName', 'dockerBaseDir', 'dockerTimezone', 'dockerPuid', 'dockerPgid', 'dockerRestartPolicy', 'dockerNetworkName'];
  globalInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', generateDockerOutput);
      el.addEventListener('change', generateDockerOutput);
    }
  });

  // Custom Service Adder
  if (addCustomServiceBtn) {
    addCustomServiceBtn.addEventListener('click', () => {
      const customId = `custom_${Date.now()}`;
      customServicesList.push({
        id: customId,
        name: 'Custom Service',
        image: 'nginx:alpine',
        ports: '8085:80',
        volume: './custom/data:/data'
      });
      renderServiceSettings();
      generateDockerOutput();
    });
  }

  // Code Tab Switchers (compose.yml vs .env)
  const codeTabBtns = document.querySelectorAll('.code-tab-btn[data-code-view]');
  codeTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      codeTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.getAttribute('data-code-view');
      if (view === 'compose') {
        composeCodePre.style.display = 'block';
        envCodePre.style.display = 'none';
      } else {
        composeCodePre.style.display = 'none';
        envCodePre.style.display = 'block';
      }
    });
  });

  // Copy & Download Actions
  document.getElementById('copyComposeBtn')?.addEventListener('click', () => {
    copyToClipboard(composeCodePre.textContent, 'docker-compose.yml copied to clipboard!');
  });

  document.getElementById('downloadComposeBtn')?.addEventListener('click', () => {
    downloadFile('docker-compose.yml', composeCodePre.textContent, 'application/x-yaml');
    showToast('docker-compose.yml downloaded!');
  });

  document.getElementById('copyEnvBtn')?.addEventListener('click', () => {
    copyToClipboard(envCodePre.textContent, '.env template copied to clipboard!');
  });

  document.getElementById('downloadEnvBtn')?.addEventListener('click', () => {
    downloadFile('.env', envCodePre.textContent, 'text/plain');
    showToast('.env file downloaded!');
  });

  // Initial renders
  renderServiceSettings();
  generateDockerOutput();

  function getSelectedApps() {
    const selected = [];
    appGrid.querySelectorAll('input[type="checkbox"]:checked').forEach(chk => {
      const appId = chk.getAttribute('data-app-id');
      const appData = DOCKER_APPS_CATALOG.find(a => a.id === appId);
      if (appData) selected.push(appData);
    });
    return selected;
  }

  function renderServiceSettings() {
    if (!serviceSettingsContainer) return;
    const selectedApps = getSelectedApps();

    if (selectedApps.length === 0 && customServicesList.length === 0) {
      serviceSettingsContainer.innerHTML = `
        <div style="text-align: center; padding: 1.5rem; color: var(--tools-text-muted); font-size: 0.9rem;">
          No apps selected. Choose one or more apps from the grid above to configure ports and storage mounts.
        </div>
      `;
      return;
    }

    let html = '';

    // Standard selected apps
    selectedApps.forEach(app => {
      html += `
        <div class="service-config-item open" id="cfg_${app.id}">
          <div class="service-config-header" onclick="this.parentElement.classList.toggle('open')">
            <span>${app.name} (${app.image})</span>
            <span style="font-size: 0.8rem; color: var(--tools-text-muted);">Toggle ▾</span>
          </div>
          <div class="service-config-body">
            <div class="config-row">
              <div class="form-group">
                <label class="form-label" for="port_${app.id}">Port Mappings (Host:Container)</label>
                <input type="text" class="form-input service-port-input" id="port_${app.id}" data-app-id="${app.id}" value="${app.ports.join(', ')}" placeholder="${app.ports.length === 0 ? 'None (Outbound connection only)' : 'e.g. 8080:80'}">
                <span class="form-hint">${app.ports.length === 0 ? 'Outbound connector: no open inbound ports required.' : 'Comma separated, e.g. 8080:80, 53:53/udp'}</span>
              </div>
              <div class="form-group">
                <label class="form-label" for="vol_${app.id}">Volume Storage Mounts</label>
                <input type="text" class="form-input service-vol-input" id="vol_${app.id}" data-app-id="${app.id}" value="${app.volumes.map(v => `${v.host}:${v.container}`).join(', ')}" placeholder="${app.volumes.length === 0 ? 'None required' : 'Host path : Container path'}">
                <span class="form-hint">${app.volumes.length === 0 ? 'Stateless connector: no local storage mounts required.' : 'Host path : Container path'}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    // Custom services
    customServicesList.forEach((cService, index) => {
      html += `
        <div class="service-config-item open" id="cfg_${cService.id}">
          <div class="service-config-header" onclick="this.parentElement.classList.toggle('open')">
            <span>${cService.name || 'Custom Service'}</span>
            <button type="button" class="tool-btn tool-btn-ghost tool-btn-sm" style="color:#ef4444;" onclick="removeCustomService('${cService.id}')">Remove ✕</button>
          </div>
          <div class="service-config-body">
            <div class="config-row">
              <div class="form-group">
                <label class="form-label">Service Name</label>
                <input type="text" class="form-input" value="${cService.name}" oninput="updateCustomService('${cService.id}', 'name', this.value)">
              </div>
              <div class="form-group">
                <label class="form-label">Docker Image</label>
                <input type="text" class="form-input" value="${cService.image}" oninput="updateCustomService('${cService.id}', 'image', this.value)">
              </div>
              <div class="form-group">
                <label class="form-label">Port Mapping</label>
                <input type="text" class="form-input" value="${cService.ports}" oninput="updateCustomService('${cService.id}', 'ports', this.value)">
              </div>
              <div class="form-group">
                <label class="form-label">Volume Mount</label>
                <input type="text" class="form-input" value="${cService.volume}" oninput="updateCustomService('${cService.id}', 'volume', this.value)">
              </div>
            </div>
          </div>
        </div>
      `;
    });

    serviceSettingsContainer.innerHTML = html;

    // Listeners for dynamic inputs
    serviceSettingsContainer.querySelectorAll('.service-port-input, .service-vol-input').forEach(input => {
      input.addEventListener('input', generateDockerOutput);
    });
  }

  window.removeCustomService = function(id) {
    customServicesList = customServicesList.filter(s => s.id !== id);
    renderServiceSettings();
    generateDockerOutput();
  };

  window.updateCustomService = function(id, key, val) {
    const s = customServicesList.find(s => s.id === id);
    if (s) {
      s[key] = val;
      generateDockerOutput();
    }
  };

  function generateDockerOutput() {
    const projectName = (document.getElementById('dockerProjectName')?.value || 'homelab').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const baseDir = (document.getElementById('dockerBaseDir')?.value || './data').trim();
    const tz = (document.getElementById('dockerTimezone')?.value || 'America/New_York').trim();
    const puid = (document.getElementById('dockerPuid')?.value || '1000').trim();
    const pgid = (document.getElementById('dockerPgid')?.value || '1000').trim();
    const restartPolicy = document.getElementById('dockerRestartPolicy')?.value || 'unless-stopped';
    const networkName = (document.getElementById('dockerNetworkName')?.value || 'homelab_net').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');

    const selectedApps = getSelectedApps();

    let yamlLines = [
      `# ==============================================================================`,
      `# Tech Simpld - Production Docker Compose Template`,
      `# Project: ${projectName} | Generated: Client-Side via techsimpld.com/tools.html`,
      `# ==============================================================================`,
      `services:`
    ];

    let envVars = new Map();
    envVars.set('PROJECT_NAME', projectName);
    envVars.set('DATA_DIR', baseDir);
    envVars.set('TZ', tz);
    envVars.set('PUID', puid);
    envVars.set('PGID', pgid);

    // Build standard apps
    selectedApps.forEach(app => {
      const portInput = document.getElementById(`port_${app.id}`);
      const volInput = document.getElementById(`vol_${app.id}`);

      const ports = portInput ? portInput.value.split(',').map(p => p.trim()).filter(Boolean) : app.ports;
      const vols = volInput ? volInput.value.split(',').map(v => v.trim()).filter(Boolean) : app.volumes.map(v => `${v.host}:${v.container}`);

      yamlLines.push(`  ${app.id}:`);
      yamlLines.push(`    container_name: ${projectName}_${app.id}`);
      yamlLines.push(`    image: ${app.image}`);
      yamlLines.push(`    restart: ${restartPolicy}`);

      if (app.command) {
        yamlLines.push(`    command: ${app.command}`);
        if (app.command.includes('${')) {
          const match = app.command.match(/\$\{([A-Z0-9_]+)(?::-([^}]+))?\}/);
          if (match) {
            const varName = match[1];
            const defaultVal = match[2] || '';
            if (!envVars.has(varName)) {
              envVars.set(varName, defaultVal);
            }
          }
        }
      }

      if (ports.length > 0) {
        yamlLines.push(`    ports:`);
        ports.forEach(p => {
          yamlLines.push(`      - "${p}"`);
        });
      }

      // Volumes with base dir replacement
      if (vols.length > 0) {
        yamlLines.push(`    volumes:`);
        vols.forEach(v => {
          let formattedVol = v;
          if (v.startsWith('./')) {
            formattedVol = `\${DATA_DIR}/${app.id}/${v.replace('./' + app.id + '/', '').replace('./', '')}:${v.split(':')[1]}`;
          }
          yamlLines.push(`      - ${formattedVol}`);
        });
      }

      // Environment variables
      const envKeys = Object.keys(app.env);
      if (envKeys.length > 0) {
        yamlLines.push(`    environment:`);
        envKeys.forEach(k => {
          const val = app.env[k];
          yamlLines.push(`      - ${k}=${val}`);
          // Extract default env variables for .env file
          if (val.includes('${')) {
            const match = val.match(/\$\{([A-Z0-9_]+)(?::-([^}]+))?\}/);
            if (match) {
              const varName = match[1];
              const defaultVal = match[2] || '';
              if (!envVars.has(varName)) {
                envVars.set(varName, defaultVal);
              }
            }
          }
        });
      }

      yamlLines.push(`    networks:`);
      yamlLines.push(`      - ${networkName}`);
      yamlLines.push(``);
    });

    // Build custom services
    customServicesList.forEach(c => {
      const sName = (c.name || 'custom_service').toLowerCase().replace(/[^a-z0-9_-]/g, '_');
      yamlLines.push(`  ${sName}:`);
      yamlLines.push(`    container_name: ${projectName}_${sName}`);
      yamlLines.push(`    image: ${c.image || 'nginx:alpine'}`);
      yamlLines.push(`    restart: ${restartPolicy}`);
      if (c.ports) {
        yamlLines.push(`    ports:`);
        c.ports.split(',').forEach(p => {
          if (p.trim()) yamlLines.push(`      - "${p.trim()}"`);
        });
      }
      if (c.volume) {
        yamlLines.push(`    volumes:`);
        c.volume.split(',').forEach(v => {
          if (v.trim()) yamlLines.push(`      - ${v.trim()}`);
        });
      }
      yamlLines.push(`    networks:`);
      yamlLines.push(`      - ${networkName}`);
      yamlLines.push(``);
    });

    // Networks definition
    yamlLines.push(`networks:`);
    yamlLines.push(`  ${networkName}:`);
    yamlLines.push(`    name: ${networkName}`);
    yamlLines.push(`    driver: bridge`);

    // Render compose YAML
    composeCodePre.textContent = yamlLines.join('\n');

    // Build .env content
    let envLines = [
      `# ==============================================================================`,
      `# Tech Simpld - Environment Variables Template (.env)`,
      `# Put this in the same folder as your docker-compose.yml`,
      `# ==============================================================================`,
      ``
    ];

    envVars.forEach((val, key) => {
      envLines.push(`${key}=${val}`);
    });

    envCodePre.textContent = envLines.join('\n');
  }
}

/* Tool 2: Markdown Table & Frontmatter Formatter */
function initMarkdownFormatter() {
  const inputArea = document.getElementById('mdInputArea');
  const outputArea = document.getElementById('mdOutputArea');
  const modeSelect = document.getElementById('mdModeSelect');
  const delimiterSelect = document.getElementById('mdDelimiterSelect');
  const alignSelect = document.getElementById('mdAlignSelect');
  const firstRowHeaderChk = document.getElementById('mdFirstRowHeader');
  const padColumnsChk = document.getElementById('mdPadColumns');
  
  const statsLines = document.getElementById('mdStatsLines');
  const statsWords = document.getElementById('mdStatsWords');
  const statsChars = document.getElementById('mdStatsChars');

  if (!inputArea || !outputArea) return;

  function runFormat() {
    const raw = inputArea.value;
    const mode = modeSelect ? modeSelect.value : 'table';
    
    // Update stats
    const lines = raw ? raw.split('\n').length : 0;
    const words = raw.trim() ? raw.trim().split(/\s+/).length : 0;
    const chars = raw.length;

    if (statsLines) statsLines.textContent = `${lines} lines`;
    if (statsWords) statsWords.textContent = `${words} words`;
    if (statsChars) statsChars.textContent = `${chars} chars`;

    if (!raw.trim()) {
      outputArea.value = '';
      return;
    }

    if (mode === 'table') {
      outputArea.value = formatMarkdownTable(raw, {
        delimiter: delimiterSelect ? delimiterSelect.value : 'auto',
        align: alignSelect ? alignSelect.value : 'left',
        firstRowHeader: firstRowHeaderChk ? firstRowHeaderChk.checked : true,
        padColumns: padColumnsChk ? padColumnsChk.checked : true
      });
    } else if (mode === 'frontmatter') {
      outputArea.value = formatFrontmatter(raw);
    } else if (mode === 'obsidian') {
      outputArea.value = formatObsidianNotes(raw);
    }
  }

  // Event Listeners
  inputArea.addEventListener('input', runFormat);
  [modeSelect, delimiterSelect, alignSelect, firstRowHeaderChk, padColumnsChk].forEach(el => {
    if (el) el.addEventListener('change', runFormat);
  });

  // Action Buttons
  document.getElementById('copyMdOutputBtn')?.addEventListener('click', () => {
    copyToClipboard(outputArea.value, 'Formatted Markdown copied to clipboard!');
  });

  document.getElementById('downloadMdBtn')?.addEventListener('click', () => {
    downloadFile('formatted-note.md', outputArea.value, 'text/markdown');
    showToast('Markdown file downloaded!');
  });

  document.getElementById('clearMdBtn')?.addEventListener('click', () => {
    inputArea.value = '';
    outputArea.value = '';
    runFormat();
  });

  // Sample Data Loaders
  document.getElementById('loadSampleCsvBtn')?.addEventListener('click', () => {
    if (modeSelect) modeSelect.value = 'table';
    inputArea.value = `Server Name, IP Address, Role, RAM, Status
pve-node-01, 10.10.10.10, Proxmox Hypervisor, 64GB, Online
adguard-dns, 10.10.10.20, Local AdBlocker & DNS, 2GB, Active
truenas-core, 10.10.10.30, ZFS Storage Pool, 32GB, Healthy
kuma-monitor, 10.10.10.40, Infrastructure Watcher, 1GB, Running
npm-proxy, 10.10.10.50, Cloudflare SSL Gateway, 2GB, Secure`;
    runFormat();
  });

  document.getElementById('loadSampleFrontmatterBtn')?.addEventListener('click', () => {
    if (modeSelect) modeSelect.value = 'frontmatter';
    inputArea.value = `title: Complete Proxmox VE 8 Home Lab Architecture
tags: proxmox, homelab, virtualization, ceph
category: Tutorials
date: 2026-11-02
author: Tech Simpld
status: published
summary: Step-by-step blueprint for building a high-availability budget Proxmox cluster with shared Ceph storage.`;
    runFormat();
  });

  document.getElementById('loadSampleNotesBtn')?.addEventListener('click', () => {
    if (modeSelect) modeSelect.value = 'obsidian';
    inputArea.value = `Deploying Ceph Storage Pool
Prerequisites:
- 3 mini PCs with dual 2.5GbE NICs
- Minimum 32GB RAM per node
- Dedicated NVMe SSDs for OSD storage

Steps to perform:
1. Flash Proxmox VE 8 ISO to Ventoy USB
2. Configure static IP on vmbr0
3. Initialize corosync cluster network
4. Create OSDs across nvme0n1 drives
5. Verify quorum status with pvecm status

Note: Never use consumer QLC SSDs for Ceph WAL/DB journals due to rapid write wearout!`;
    runFormat();
  });

  // Table Formatter Algorithm
  function formatMarkdownTable(rawText, options) {
    const lines = rawText.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return '';

    // Delimiter detection
    let sep = ',';
    if (options.delimiter === 'tab' || (options.delimiter === 'auto' && lines[0].includes('\t'))) {
      sep = '\t';
    } else if (options.delimiter === 'pipe' || (options.delimiter === 'auto' && lines[0].includes('|'))) {
      sep = '|';
    } else if (options.delimiter === 'semicolon' || (options.delimiter === 'auto' && lines[0].includes(';'))) {
      sep = ';';
    } else {
      sep = ',';
    }

    // Parse rows
    const rows = lines.map(line => {
      // If line is markdown pipe formatted, strip outer pipes
      if (sep === '|' || (line.startsWith('|') && line.endsWith('|'))) {
        let clean = line;
        if (clean.startsWith('|')) clean = clean.substring(1);
        if (clean.endsWith('|')) clean = clean.substring(0, clean.length - 1);
        return clean.split('|').map(c => c.trim());
      }
      return line.split(sep).map(c => c.trim().replace(/^["']|["']$/g, ''));
    }).filter(row => {
      // Filter out divider lines like |---|---|
      const isDivider = row.every(cell => /^:?-+:?$/.test(cell));
      return !isDivider;
    });

    if (rows.length === 0) return '';

    // Determine max columns
    let maxCols = 0;
    rows.forEach(r => { if (r.length > maxCols) maxCols = r.length; });

    // Normalize rows length
    rows.forEach(r => {
      while (r.length < maxCols) r.push('');
    });

    // Calculate column widths
    const colWidths = new Array(maxCols).fill(3);
    rows.forEach(r => {
      r.forEach((cell, idx) => {
        if (cell.length > colWidths[idx]) {
          colWidths[idx] = cell.length;
        }
      });
    });

    // Alignment marker
    let alignMarker = '---';
    if (options.align === 'center') alignMarker = ':---:';
    else if (options.align === 'right') alignMarker = '---:';
    else alignMarker = ':---';

    const formattedLines = [];

    // Header row
    const headerRow = rows[0];
    const headerCells = headerRow.map((cell, idx) => {
      return options.padColumns ? cell.padEnd(colWidths[idx], ' ') : cell;
    });
    formattedLines.push(`| ${headerCells.join(' | ')} |`);

    // Divider row
    const dividerCells = colWidths.map(w => {
      if (!options.padColumns) return alignMarker;
      if (options.align === 'center') return ':' + '-'.repeat(Math.max(1, w - 2)) + ':';
      if (options.align === 'right') return '-'.repeat(Math.max(2, w - 1)) + ':';
      return ':' + '-'.repeat(Math.max(2, w - 1));
    });
    formattedLines.push(`| ${dividerCells.join(' | ')} |`);

    // Data rows
    for (let i = 1; i < rows.length; i++) {
      const dataRow = rows[i];
      const dataCells = dataRow.map((cell, idx) => {
        return options.padColumns ? cell.padEnd(colWidths[idx], ' ') : cell;
      });
      formattedLines.push(`| ${dataCells.join(' | ')} |`);
    }

    return formattedLines.join('\n');
  }

  // Frontmatter Formatter
  function formatFrontmatter(raw) {
    let lines = raw.trim().split('\n');
    let properties = new Map();
    let bodyContent = [];
    let inExistingFrontmatter = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed === '---') {
        inExistingFrontmatter = !inExistingFrontmatter;
        return;
      }
      
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0 && !line.startsWith(' ') && !line.startsWith('\t')) {
        const key = line.substring(0, colonIndex).trim();
        let val = line.substring(colonIndex + 1).trim();
        properties.set(key, val);
      } else if (!inExistingFrontmatter && trimmed) {
        bodyContent.push(line);
      }
    });

    // Fallback if no colons found: create standard Obsidian properties
    if (properties.size === 0) {
      properties.set('title', lines[0] || 'Untitled Note');
      properties.set('created', new Date().toISOString().split('T')[0]);
      properties.set('tags', '[homelab, documentation]');
      properties.set('status', 'draft');
    }

    let out = ['---'];
    properties.forEach((val, key) => {
      // Tags formatting helper
      if (key.toLowerCase() === 'tags' || key.toLowerCase() === 'aliases') {
        if (!val.startsWith('[') && !val.startsWith('-')) {
          const tagList = val.split(/[, ]+/).map(t => t.trim().replace(/^#/, '')).filter(Boolean);
          out.push(`${key}: [${tagList.join(', ')}]`);
          return;
        }
      }
      
      // Wrap strings with quotes if they contain colons or quotes
      if (val.includes(':') && !val.startsWith('"') && !val.startsWith("'") && !val.startsWith('[')) {
        val = `"${val.replace(/"/g, '\\"')}"`;
      }
      out.push(`${key}: ${val}`);
    });
    out.push('---');
    out.push('');

    if (bodyContent.length > 0) {
      out.push(bodyContent.join('\n'));
    }

    return out.join('\n');
  }

  // Obsidian Note Helper
  function formatObsidianNotes(raw) {
    const lines = raw.split('\n');
    const processed = [];

    lines.forEach(line => {
      let l = line;
      // Convert list items to checklist if they look like numbered or dash steps
      if (/^\s*[-*]\s+(.*)$/.test(l) && !l.includes('[ ]') && !l.includes('[x]')) {
        // keep as clean bullet or detect task
        if (/todo|task|check|step/i.test(l)) {
          l = l.replace(/^\s*[-*]\s+/, '- [ ] ');
        }
      }
      // Convert "Note:" or "Warning:" into Obsidian callouts
      if (/^\s*Note:\s*(.*)$/i.test(l)) {
        l = l.replace(/^\s*Note:\s*(.*)$/i, '> [!NOTE]\n> $1');
      } else if (/^\s*Warning:\s*(.*)$/i.test(l)) {
        l = l.replace(/^\s*Warning:\s*(.*)$/i, '> [!WARNING]\n> $1');
      } else if (/^\s*Tip:\s*(.*)$/i.test(l)) {
        l = l.replace(/^\s*Tip:\s*(.*)$/i, '> [!TIP]\n> $1');
      }
      processed.push(l);
    });

    return processed.join('\n').replace(/\n{3,}/g, '\n\n');
  }
}

/* Tool 3: Local Network Subnet & IP Calculator */
function initSubnetCalculator() {
  const ipInput = document.getElementById('calcIpAddress');
  const cidrSelect = document.getElementById('calcCidrPrefix');
  const vlanInput = document.getElementById('calcVlanTag');
  const calculateBtn = document.getElementById('runCalculateBtn');
  const copySubnetBtn = document.getElementById('copySubnetSummaryBtn');

  if (!ipInput || !cidrSelect) return;

  // Populate CIDR dropdown from /8 to /30
  let cidrOptions = '';
  for (let c = 8; c <= 30; c++) {
    const mask = cidrToNetmask(c);
    const hosts = Math.pow(2, 32 - c) - 2;
    const isSelected = (c === 24) ? 'selected' : '';
    cidrOptions += `<option value="${c}" ${isSelected}>/${c} (${mask}) - ${hosts.toLocaleString()} Usable Hosts</option>`;
  }
  cidrSelect.innerHTML = cidrOptions;

  // Presets
  const presets = [
    { label: '192.168.1.0/24 (Home Router)', ip: '192.168.1.1', cidr: '24', vlan: '1' },
    { label: '10.0.0.0/24 (Homelab Main)', ip: '10.0.0.1', cidr: '24', vlan: '10' },
    { label: '10.10.10.0/24 (Proxmox Nodes)', ip: '10.10.10.1', cidr: '24', vlan: '20' },
    { label: '172.16.0.0/16 (Docker Network)', ip: '172.16.0.1', cidr: '16', vlan: '' },
    { label: '192.168.10.0/24 (IoT Isolated)', ip: '192.168.10.1', cidr: '24', vlan: '30' },
    { label: '192.168.0.0/23 (Expanded 510 Hosts)', ip: '192.168.0.1', cidr: '23', vlan: '' }
  ];

  const presetsContainer = document.getElementById('subnetPresets');
  if (presetsContainer) {
    presetsContainer.innerHTML = presets.map(p => `
      <button type="button" class="preset-chip" data-ip="${p.ip}" data-cidr="${p.cidr}" data-vlan="${p.vlan}">
        ${p.label}
      </button>
    `).join('');

    presetsContainer.querySelectorAll('.preset-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        ipInput.value = btn.getAttribute('data-ip');
        cidrSelect.value = btn.getAttribute('data-cidr');
        if (vlanInput) vlanInput.value = btn.getAttribute('data-vlan');
        calculateSubnet();
      });
    });
  }

  // Calculate triggers
  ipInput.addEventListener('input', calculateSubnet);
  cidrSelect.addEventListener('change', calculateSubnet);
  if (vlanInput) vlanInput.addEventListener('input', calculateSubnet);
  if (calculateBtn) calculateBtn.addEventListener('click', calculateSubnet);

  if (copySubnetBtn) {
    copySubnetBtn.addEventListener('click', () => {
      const summary = generateSubnetTextSummary();
      copyToClipboard(summary, 'Subnet calculation summary copied!');
    });
  }

  // Initial calculation
  calculateSubnet();

  function isValidIp(ip) {
    const parts = ip.trim().split('.');
    if (parts.length !== 4) return false;
    return parts.every(part => {
      if (!/^\d+$/.test(part)) return false;
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }

  function ipToInt(ip) {
    return ip.split('.').reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
  }

  function intToIp(int) {
    return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255
    ].join('.');
  }

  function cidrToNetmaskInt(cidr) {
    return cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  }

  function cidrToNetmask(cidr) {
    return intToIp(cidrToNetmaskInt(cidr));
  }

  function intToBinaryStr(int) {
    return [
      ((int >>> 24) & 255).toString(2).padStart(8, '0'),
      ((int >>> 16) & 255).toString(2).padStart(8, '0'),
      ((int >>> 8) & 255).toString(2).padStart(8, '0'),
      (int & 255).toString(2).padStart(8, '0')
    ].join('.');
  }

  function calculateSubnet() {
    let rawIp = ipInput.value.trim();
    
    // Support user typing CIDR in IP box: e.g. 192.168.1.50/24
    if (rawIp.includes('/')) {
      const [ipPart, cidrPart] = rawIp.split('/');
      rawIp = ipPart.trim();
      const parsedCidr = parseInt(cidrPart, 10);
      if (parsedCidr >= 8 && parsedCidr <= 30) {
        cidrSelect.value = parsedCidr;
      }
    }

    if (!isValidIp(rawIp)) {
      document.getElementById('resNetworkAddr').textContent = 'Invalid IP Address';
      return;
    }

    const cidr = parseInt(cidrSelect.value, 10);
    const ipInt = ipToInt(rawIp);
    const maskInt = cidrToNetmaskInt(cidr);
    const wildcardInt = (~maskInt) >>> 0;

    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | wildcardInt) >>> 0;

    const totalAddresses = Math.pow(2, 32 - cidr);
    const usableHosts = Math.max(0, totalAddresses - 2);

    const firstUsableInt = (networkInt + 1) >>> 0;
    const lastUsableInt = (broadcastInt - 1) >>> 0;

    const netmaskStr = intToIp(maskInt);
    const wildcardStr = intToIp(wildcardInt);
    const networkStr = intToIp(networkInt);
    const broadcastStr = intToIp(broadcastInt);
    const firstUsableStr = intToIp(firstUsableInt);
    const lastUsableStr = intToIp(lastUsableInt);

    // IP Classification
    let ipScope = 'Public Internet';
    const firstOctet = (ipInt >>> 24) & 255;
    const secondOctet = (ipInt >>> 16) & 255;

    if (firstOctet === 10) {
      ipScope = 'Private (RFC 1918 Class A)';
    } else if (firstOctet === 172 && (secondOctet >= 16 && secondOctet <= 31)) {
      ipScope = 'Private (RFC 1918 Class B)';
    } else if (firstOctet === 192 && secondOctet === 168) {
      ipScope = 'Private (RFC 1918 Class C)';
    } else if (firstOctet === 127) {
      ipScope = 'Loopback Address';
    } else if (firstOctet === 169 && secondOctet === 254) {
      ipScope = 'Link-Local (APIPA)';
    }

    // Populate Results Grid
    document.getElementById('resNetworkAddr').textContent = `${networkStr} /${cidr}`;
    document.getElementById('resBroadcastAddr').textContent = broadcastStr;
    document.getElementById('resSubnetMask').textContent = netmaskStr;
    document.getElementById('resWildcardMask').textContent = wildcardStr;
    document.getElementById('resUsableRange').textContent = `${firstUsableStr} - ${lastUsableStr}`;
    document.getElementById('resUsableHosts').textContent = usableHosts.toLocaleString();
    document.getElementById('resTotalAddresses').textContent = totalAddresses.toLocaleString();
    document.getElementById('resIpScope').textContent = ipScope;

    // Binary representation
    document.getElementById('binIpAddr').textContent = intToBinaryStr(ipInt);
    document.getElementById('binNetmask').textContent = intToBinaryStr(maskInt);

    // Homelab IP Allocation Recommendations
    renderAllocationGuidance(networkInt, usableHosts, cidr);

    // Subnet Splitting Table
    renderSubnetSplitting(networkInt, cidr);
  }

  function renderAllocationGuidance(netInt, usableCount, cidr) {
    const visualizer = document.getElementById('homelabAllocVisualizer');
    if (!visualizer) return;

    if (usableCount < 14) {
      visualizer.innerHTML = `<p style="color:var(--tools-text-muted);font-size:0.85rem;">Subnet is small (/${cidr}). Allocation visualizer is optimized for standard /24 or /23 home lab segments.</p>`;
      return;
    }

    const gatewayIp = intToIp(netInt + 1);
    const staticStart = intToIp(netInt + 2);
    const staticEnd = intToIp(netInt + Math.min(49, Math.floor(usableCount * 0.2)));
    const serverStart = intToIp(netInt + Math.min(50, Math.floor(usableCount * 0.2) + 1));
    const serverEnd = intToIp(netInt + Math.min(99, Math.floor(usableCount * 0.4)));
    const dhcpStart = intToIp(netInt + Math.min(100, Math.floor(usableCount * 0.4) + 1));
    const dhcpEnd = intToIp(netInt + Math.min(249, Math.floor(usableCount * 0.95)));
    const mgmtStart = intToIp(netInt + Math.min(250, Math.floor(usableCount * 0.95) + 1));
    const mgmtEnd = intToIp(netInt + usableCount);

    visualizer.innerHTML = `
      <div class="alloc-bar-container">
        <div class="alloc-segment" style="width: 5%; background-color: #facc15;" title="Gateway: ${gatewayIp}"></div>
        <div class="alloc-segment" style="width: 18%; background-color: #38bdf8;" title="Static Network Infra: ${staticStart} - ${staticEnd}"></div>
        <div class="alloc-segment" style="width: 22%; background-color: #a855f7;" title="Servers & Docker Hosts: ${serverStart} - ${serverEnd}"></div>
        <div class="alloc-segment" style="width: 48%; background-color: #4ade80;" title="DHCP Client Pool: ${dhcpStart} - ${dhcpEnd}"></div>
        <div class="alloc-segment" style="width: 7%; background-color: #f97316;" title="Management/IPMI: ${mgmtStart} - ${mgmtEnd}"></div>
      </div>
      <div class="alloc-legend">
        <div class="legend-item"><span class="legend-dot" style="background:#facc15;"></span><strong>Router / Gateway:</strong> ${gatewayIp}</div>
        <div class="legend-item"><span class="legend-dot" style="background:#38bdf8;"></span><strong>Switches & APs:</strong> ${staticStart} - ${staticEnd}</div>
        <div class="legend-item"><span class="legend-dot" style="background:#a855f7;"></span><strong>Proxmox & Docker:</strong> ${serverStart} - ${serverEnd}</div>
        <div class="legend-item"><span class="legend-dot" style="background:#4ade80;"></span><strong>DHCP Client Pool:</strong> ${dhcpStart} - ${dhcpEnd}</div>
        <div class="legend-item"><span class="legend-dot" style="background:#f97316;"></span><strong>IPMI / BMC:</strong> ${mgmtStart} - ${mgmtEnd}</div>
      </div>
    `;
  }

  function renderSubnetSplitting(baseNetInt, baseCidr) {
    const tableContainer = document.getElementById('subnetSplittingTable');
    if (!tableContainer) return;

    if (baseCidr >= 29) {
      tableContainer.innerHTML = `<p style="color:var(--tools-text-muted);font-size:0.85rem;">Cannot subdivide further (already /${baseCidr}).</p>`;
      return;
    }

    const nextCidr = baseCidr + 1;
    const splitSize = Math.pow(2, 32 - nextCidr);
    const usableEach = Math.max(0, splitSize - 2);

    const sub1Net = baseNetInt;
    const sub1Bcast = sub1Net + splitSize - 1;
    const sub2Net = baseNetInt + splitSize;
    const sub2Bcast = sub2Net + splitSize - 1;

    tableContainer.innerHTML = `
      <div class="subnet-table-wrapper">
        <table class="subnet-table">
          <thead>
            <tr>
              <th>VLAN / Subnet</th>
              <th>Network CIDR</th>
              <th>Usable Host Range</th>
              <th>Broadcast</th>
              <th>Usable Hosts</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong style="color:var(--tools-yellow);">Subnet A</strong> (e.g. Trusted LAN)</td>
              <td>${intToIp(sub1Net)}/${nextCidr}</td>
              <td>${intToIp(sub1Net + 1)} - ${intToIp(sub1Bcast - 1)}</td>
              <td>${intToIp(sub1Bcast)}</td>
              <td>${usableEach.toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong style="color:var(--tools-accent-cyan);">Subnet B</strong> (e.g. IoT / Guests)</td>
              <td>${intToIp(sub2Net)}/${nextCidr}</td>
              <td>${intToIp(sub2Net + 1)} - ${intToIp(sub2Bcast - 1)}</td>
              <td>${intToIp(sub2Bcast)}</td>
              <td>${usableEach.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  function generateSubnetTextSummary() {
    const net = document.getElementById('resNetworkAddr')?.textContent || '';
    const bcast = document.getElementById('resBroadcastAddr')?.textContent || '';
    const mask = document.getElementById('resSubnetMask')?.textContent || '';
    const range = document.getElementById('resUsableRange')?.textContent || '';
    const hosts = document.getElementById('resUsableHosts')?.textContent || '';
    const scope = document.getElementById('resIpScope')?.textContent || '';

    return `Tech Simpld - Subnet & IP Calculation Summary
--------------------------------------------------
Network Address : ${net}
Subnet Mask     : ${mask}
Usable IP Pool  : ${range}
Broadcast Addr  : ${bcast}
Total Hosts     : ${hosts}
Network Scope   : ${scope}
Generated At    : https://techsimpld.com/tools.html
--------------------------------------------------`;
  }
}

/* Tool 4: Home Server Power & Electricity Cost Calculator */
function initPowerCalculator() {
  const idleSlider = document.getElementById('powerIdleWatts');
  const peakSlider = document.getElementById('powerPeakWatts');
  const hoursSlider = document.getElementById('powerPeakHours');
  const costInput = document.getElementById('powerCostKwh');
  const hwCostInput = document.getElementById('powerHardwareCost');

  const idleDisplay = document.getElementById('idleWattsDisplay');
  const peakDisplay = document.getElementById('peakWattsDisplay');
  const hoursDisplay = document.getElementById('peakHoursDisplay');

  const resAvgWatts = document.getElementById('resAvgWatts');
  const resDailyCost = document.getElementById('resDailyCost');
  const resDailyKwh = document.getElementById('resDailyKwh');
  const resMonthlyCost = document.getElementById('resMonthlyCost');
  const resMonthlyKwh = document.getElementById('resMonthlyKwh');
  const resAnnualCost = document.getElementById('resAnnualCost');
  const resAnnualKwh = document.getElementById('resAnnualKwh');
  const resThreeYearTco = document.getElementById('resThreeYearTco');
  const resTcoBreakdown = document.getElementById('resTcoBreakdown');
  const resPayoffAnnualSavings = document.getElementById('resPayoffAnnualSavings');
  const resPayoffMonths = document.getElementById('resPayoffMonths');

  const presetsBar = document.getElementById('powerPresetsBar');
  const copyBtn = document.getElementById('copyPowerSummaryBtn');

  if (!idleSlider || !peakSlider || !hoursSlider || !costInput) return;

  function calculatePower() {
    const idleWatts = parseFloat(idleSlider.value) || 0;
    const peakWatts = parseFloat(peakSlider.value) || 0;
    const peakHours = parseFloat(hoursSlider.value) || 0;
    const idleHours = Math.max(0, 24 - peakHours);
    const kwhRate = parseFloat(costInput.value) || 0.16;
    const hwCost = parseFloat(hwCostInput ? hwCostInput.value : 0) || 0;

    // Sliders displays
    if (idleDisplay) idleDisplay.textContent = `${idleWatts} W`;
    if (peakDisplay) peakDisplay.textContent = `${peakWatts} W`;
    if (hoursDisplay) hoursDisplay.textContent = `${peakHours} hrs`;

    // Weighted average continuous draw
    const weightedWatts = ((idleWatts * idleHours) + (peakWatts * peakHours)) / 24;
    const dailyKwh = (weightedWatts * 24) / 1000;
    const monthlyKwh = dailyKwh * 30.4167;
    const annualKwh = dailyKwh * 365;

    const dailyCost = dailyKwh * kwhRate;
    const monthlyCost = monthlyKwh * kwhRate;
    const annualCost = annualKwh * kwhRate;
    const threeYearPower = annualCost * 3;
    const threeYearTco = hwCost + threeYearPower;

    // Compare against standard 2U enterprise rack server (160W continuous avg)
    const rackAnnualKwh = (160 * 24 * 365) / 1000; // 1401.6 kWh
    const rackAnnualCost = rackAnnualKwh * kwhRate;
    const annualSavings = Math.max(0, rackAnnualCost - annualCost);
    const payoffMonths = (annualSavings > 0 && hwCost > 0)
      ? (hwCost / (annualSavings / 12)).toFixed(1)
      : '0.0';

    // Update DOM
    if (resAvgWatts) resAvgWatts.textContent = `${weightedWatts.toFixed(1)} W`;
    if (resDailyCost) resDailyCost.textContent = `$${dailyCost.toFixed(2)}`;
    if (resDailyKwh) resDailyKwh.textContent = `${dailyKwh.toFixed(2)} kWh / day`;
    if (resMonthlyCost) resMonthlyCost.textContent = `$${monthlyCost.toFixed(2)}`;
    if (resMonthlyKwh) resMonthlyKwh.textContent = `${monthlyKwh.toFixed(1)} kWh / mo`;
    if (resAnnualCost) resAnnualCost.textContent = `$${annualCost.toFixed(2)}`;
    if (resAnnualKwh) resAnnualKwh.textContent = `${annualKwh.toFixed(1)} kWh / yr`;
    if (resThreeYearTco) resThreeYearTco.textContent = `$${threeYearTco.toFixed(2)}`;
    if (resTcoBreakdown) {
      resTcoBreakdown.textContent = `Hardware: $${hwCost.toFixed(0)} | Power: $${threeYearPower.toFixed(2)}`;
    }
    if (resPayoffAnnualSavings) {
      resPayoffAnnualSavings.textContent = `$${annualSavings.toFixed(2)} / yr`;
    }
    if (resPayoffMonths) {
      resPayoffMonths.textContent = `${payoffMonths} months`;
    }
  }

  // Event Listeners
  [idleSlider, peakSlider, hoursSlider].forEach(slider => {
    slider.addEventListener('input', () => {
      // Clear preset active class on manual slide
      if (presetsBar) {
        presetsBar.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
      }
      calculatePower();
    });
  });

  [costInput, hwCostInput].forEach(inp => {
    if (inp) inp.addEventListener('input', calculatePower);
  });

  // Presets handling
  if (presetsBar) {
    presetsBar.addEventListener('click', (e) => {
      const chip = e.target.closest('.preset-chip');
      if (!chip) return;
      presetsBar.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const idle = chip.getAttribute('data-idle');
      const peak = chip.getAttribute('data-peak');
      const hours = chip.getAttribute('data-hours');
      const cost = chip.getAttribute('data-cost');

      if (idle) idleSlider.value = idle;
      if (peak) peakSlider.value = peak;
      if (hours) hoursSlider.value = hours;
      if (cost && hwCostInput) hwCostInput.value = cost;

      calculatePower();
    });
  }

  // Copy Summary
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const avg = resAvgWatts?.textContent || '';
      const daily = `${resDailyCost?.textContent} (${resDailyKwh?.textContent})`;
      const monthly = `${resMonthlyCost?.textContent} (${resMonthlyKwh?.textContent})`;
      const annual = `${resAnnualCost?.textContent} (${resAnnualKwh?.textContent})`;
      const tco = resThreeYearTco?.textContent || '';
      const savings = resPayoffAnnualSavings?.textContent || '';
      const breakeven = resPayoffMonths?.textContent || '';

      const summary = `Tech Simpld - Home Server Power & Electricity Summary
------------------------------------------------------
Average Draw (24/7) : ${avg}
Daily Electricity   : ${daily}
Monthly Electricity : ${monthly}
Annual Electricity  : ${annual}
3-Year TCO          : ${tco}
Annual Rack Savings : ${savings}
Hardware Breakeven  : ${breakeven}
Generated At        : https://techsimpld.com/tools.html#power
------------------------------------------------------`;
      copyToClipboard(summary, 'Power summary copied to clipboard!');
    });
  }

  calculatePower();
}

/* Tool 5: Proxmox LXC & VM Resource Sizing Planner */
function initProxmoxPlanner() {
  const hostCoresSelect = document.getElementById('hostCpuCores');
  const hostRamSelect = document.getElementById('hostRamGb');
  const hostDiskInput = document.getElementById('hostDiskGb');
  const workloadsGrid = document.getElementById('proxmoxWorkloadsGrid');

  // Gauges
  const ramCommittedDisplay = document.getElementById('ramCommittedDisplay');
  const ramTotalDisplay = document.getElementById('ramTotalDisplay');
  const ramPercentDisplay = document.getElementById('ramPercentDisplay');
  const ramHeadroomDisplay = document.getElementById('ramHeadroomDisplay');
  const ramMeterBar = document.getElementById('ramMeterBar');

  const vcpuStatsText = document.getElementById('vcpuStatsText');
  const vcpuStatusPill = document.getElementById('vcpuStatusPill');

  const diskStatsText = document.getElementById('diskStatsText');
  const diskMeterBar = document.getElementById('diskMeterBar');
  const diskFreeText = document.getElementById('diskFreeText');

  const proxmoxOverallStatus = document.getElementById('proxmoxOverallStatus');

  // Custom Workload Inputs
  const customName = document.getElementById('customWorkloadName');
  const customType = document.getElementById('customWorkloadType');
  const customCores = document.getElementById('customWorkloadCores');
  const customRam = document.getElementById('customWorkloadRam');
  const customDisk = document.getElementById('customWorkloadDisk');
  const addCustomBtn = document.getElementById('addCustomWorkloadBtn');

  // CLI Generator
  const cliTargetSelect = document.getElementById('cliTargetSelect');
  const proxmoxCliOutput = document.getElementById('proxmoxCliOutput');
  const copyCliBtn = document.getElementById('copyCliCommandBtn');
  const copyProxmoxSummaryBtn = document.getElementById('copyProxmoxSummaryBtn');

  if (!hostCoresSelect || !hostRamSelect || !hostDiskInput || !workloadsGrid) return;

  let workloads = [
    { id: 'adguard', name: 'AdGuard Home', type: 'lxc', cores: 1, ram: 256, disk: 4, enabled: true, template: 'debian-12-standard_12.2-1_amd64' },
    { id: 'pihole', name: 'Pi-hole DNS', type: 'lxc', cores: 1, ram: 256, disk: 4, enabled: false, template: 'debian-12-standard_12.2-1_amd64' },
    { id: 'uptime_kuma', name: 'Uptime Kuma', type: 'lxc', cores: 1, ram: 512, disk: 8, enabled: true, template: 'debian-12-standard_12.2-1_amd64' },
    { id: 'gotify', name: 'Gotify Push Server', type: 'lxc', cores: 1, ram: 256, disk: 4, enabled: true, template: 'debian-12-standard_12.2-1_amd64' },
    { id: 'nextcloud', name: 'Nextcloud AIO', type: 'lxc', cores: 2, ram: 2048, disk: 50, enabled: true, template: 'ubuntu-22.04-standard_22.04-1_amd64' },
    { id: 'couchdb', name: 'Apache CouchDB', type: 'lxc', cores: 1, ram: 512, disk: 10, enabled: true, template: 'debian-12-standard_12.2-1_amd64' },
    { id: 'obsidian_sync', name: 'Obsidian LiveSync', type: 'lxc', cores: 1, ram: 512, disk: 10, enabled: true, template: 'debian-12-standard_12.2-1_amd64' },
    { id: 'cloudflared', name: 'Cloudflare Tunnel', type: 'lxc', cores: 1, ram: 128, disk: 2, enabled: true, template: 'alpine-3.19-default_20231219_amd64' },
    { id: 'homeassistant', name: 'Home Assistant OS', type: 'vm', cores: 2, ram: 2048, disk: 32, enabled: true, template: 'haos_ova' },
    { id: 'media_server', name: 'Plex / Jellyfin Media', type: 'lxc', cores: 4, ram: 4096, disk: 60, enabled: true, template: 'ubuntu-22.04-standard_22.04-1_amd64' },
    { id: 'truenas', name: 'TrueNAS VM', type: 'vm', cores: 4, ram: 8192, disk: 100, enabled: false, template: 'truenas-scale' },
    { id: 'docker_vm', name: 'Docker / Portainer VM', type: 'vm', cores: 2, ram: 4096, disk: 40, enabled: false, template: 'debian-12-standard_12.2-1_amd64' },
    { id: 'win11', name: 'Windows 11 Lab VM', type: 'vm', cores: 4, ram: 6144, disk: 64, enabled: false, template: 'win11-iso' }
  ];

  function renderWorkloads() {
    workloadsGrid.innerHTML = '';
    workloads.forEach((w, index) => {
      const card = document.createElement('div');
      card.className = `workload-card ${w.enabled ? 'active' : ''}`;
      card.id = `workload-card-${w.id}`;

      card.innerHTML = `
        <div class="workload-header">
          <label class="workload-checkbox-label">
            <input type="checkbox" data-index="${index}" ${w.enabled ? 'checked' : ''}>
            <span>${w.name}</span>
          </label>
          <span class="workload-type-pill ${w.type}">${w.type.toUpperCase()}</span>
        </div>
        <div class="workload-specs-row">
          <div class="workload-spec-input-group">
            <label>vCPUs</label>
            <input type="number" min="1" max="32" value="${w.cores}" data-field="cores" data-index="${index}">
          </div>
          <div class="workload-spec-input-group">
            <label>RAM (MB)</label>
            <input type="number" min="64" step="128" value="${w.ram}" data-field="ram" data-index="${index}">
          </div>
          <div class="workload-spec-input-group">
            <label>Disk (GB)</label>
            <input type="number" min="1" step="5" value="${w.disk}" data-field="disk" data-index="${index}">
          </div>
        </div>
      `;

      workloadsGrid.appendChild(card);
    });

    updateCliDropdown();
    updateCalculations();
  }

  function updateCliDropdown() {
    if (!cliTargetSelect) return;
    const previousSelected = cliTargetSelect.value;
    cliTargetSelect.innerHTML = '';

    const lxcWorkloads = workloads.filter(w => w.type === 'lxc');
    lxcWorkloads.forEach(w => {
      const opt = document.createElement('option');
      opt.value = w.id;
      opt.textContent = `${w.name} (${w.cores}c / ${w.ram}MB)`;
      if (w.id === previousSelected || (!previousSelected && w.enabled)) {
        opt.selected = true;
      }
      cliTargetSelect.appendChild(opt);
    });

    renderCliCommand();
  }

  function renderCliCommand() {
    if (!proxmoxCliOutput || !cliTargetSelect) return;
    const targetId = cliTargetSelect.value;
    const target = workloads.find(w => w.id === targetId) || workloads[0];
    if (!target) return;

    const vmid = 100 + workloads.indexOf(target);
    const hostname = target.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const template = target.template || 'debian-12-standard_12.2-1_amd64';

    const cmd = `pct create ${vmid} /var/lib/vz/template/cache/${template}.tar.zst \\
  --cores ${target.cores} \\
  --memory ${target.ram} \\
  --swap 512 \\
  --rootfs local-lvm:${target.disk} \\
  --net0 name=eth0,bridge=vmbr0,ip=dhcp,firewall=1 \\
  --hostname ${hostname} \\
  --unprivileged 1 \\
  --features nesting=1 \\
  --start 1`;

    proxmoxCliOutput.textContent = cmd;
  }

  function updateCalculations() {
    const hostCores = parseInt(hostCoresSelect.value) || 8;
    const hostRamGb = parseFloat(hostRamSelect.value) || 32;
    const hostDiskGb = parseFloat(hostDiskInput.value) || 500;

    const active = workloads.filter(w => w.enabled);
    const totalVcpus = active.reduce((sum, w) => sum + w.cores, 0);
    const totalRamMb = active.reduce((sum, w) => sum + w.ram, 0);
    const totalDiskGb = active.reduce((sum, w) => sum + w.disk, 0);

    const hostRamReserveMb = 2048; // 2 GB
    const hostDiskReserveGb = 20;  // 20 GB

    const totalCommittedRamGb = (totalRamMb + hostRamReserveMb) / 1024;
    const ramPercent = Math.min(100, (totalCommittedRamGb / hostRamGb) * 100);
    const freeRamGb = Math.max(0, hostRamGb - totalCommittedRamGb);

    const vcpuRatio = totalVcpus / hostCores;

    const totalCommittedDiskGb = totalDiskGb + hostDiskReserveGb;
    const diskPercent = Math.min(100, (totalCommittedDiskGb / hostDiskGb) * 100);
    const freeDiskGb = Math.max(0, hostDiskGb - totalCommittedDiskGb);

    // Update RAM Meter
    if (ramCommittedDisplay) ramCommittedDisplay.textContent = `${totalCommittedRamGb.toFixed(1)} GB`;
    if (ramTotalDisplay) ramTotalDisplay.textContent = `${hostRamGb.toFixed(1)} GB`;
    if (ramPercentDisplay) ramPercentDisplay.textContent = `${Math.round(ramPercent)}%`;
    if (ramHeadroomDisplay) {
      ramHeadroomDisplay.textContent = `${freeRamGb.toFixed(1)} GB Free for ZFS / Host`;
      ramHeadroomDisplay.style.color = freeRamGb > 4 ? '#4ade80' : (freeRamGb > 1 ? '#f59e0b' : '#ef4444');
    }
    if (ramMeterBar) {
      ramMeterBar.style.width = `${ramPercent}%`;
      ramMeterBar.className = `meter-bar ${ramPercent > 90 ? 'danger' : (ramPercent > 75 ? 'warning' : 'safe')}`;
    }

    // Update vCPU Stats
    if (vcpuStatsText) {
      vcpuStatsText.innerHTML = `${totalVcpus} vCPUs <span style="font-size:0.85rem; font-weight:normal; color:var(--tools-text-muted);">across ${hostCores} cores</span>`;
    }
    if (vcpuStatusPill) {
      const ratioStr = `${vcpuRatio.toFixed(2)} : 1`;
      if (vcpuRatio <= 2.5) {
        vcpuStatusPill.className = 'status-pill safe';
        vcpuStatusPill.textContent = `${ratioStr} (Safe)`;
      } else if (vcpuRatio <= 3.5) {
        vcpuStatusPill.className = 'status-pill warning';
        vcpuStatusPill.textContent = `${ratioStr} (Moderate)`;
      } else {
        vcpuStatusPill.className = 'status-pill danger';
        vcpuStatusPill.textContent = `${ratioStr} (Overcommit)`;
      }
    }

    // Update Disk Stats
    if (diskStatsText) {
      diskStatsText.textContent = `${Math.round(totalCommittedDiskGb)} GB / ${hostDiskGb} GB (${Math.round(diskPercent)}%)`;
    }
    if (diskMeterBar) {
      diskMeterBar.style.width = `${diskPercent}%`;
      diskMeterBar.className = `meter-bar ${diskPercent > 90 ? 'danger' : (diskPercent > 75 ? 'warning' : 'safe')}`;
    }
    if (diskFreeText) {
      diskFreeText.textContent = `${Math.round(freeDiskGb)} GB`;
      diskFreeText.style.color = freeDiskGb > 50 ? '#4ade80' : '#ef4444';
    }

    // Overall Status
    if (proxmoxOverallStatus) {
      if (totalCommittedRamGb > hostRamGb) {
        proxmoxOverallStatus.className = 'status-pill danger';
        proxmoxOverallStatus.textContent = 'RAM Overcommitted: OOM Hazard';
      } else if (ramPercent > 85 || vcpuRatio > 3.2 || diskPercent > 85) {
        proxmoxOverallStatus.className = 'status-pill warning';
        proxmoxOverallStatus.textContent = 'High Resource Pressure';
      } else {
        proxmoxOverallStatus.className = 'status-pill safe';
        proxmoxOverallStatus.textContent = 'Healthy Allocation';
      }
    }

    renderCliCommand();
  }

  // Workload Grid Events (Delegated)
  workloadsGrid.addEventListener('change', (e) => {
    const target = e.target;
    const index = parseInt(target.getAttribute('data-index'), 10);
    if (isNaN(index) || !workloads[index]) return;

    if (target.type === 'checkbox') {
      workloads[index].enabled = target.checked;
      const card = document.getElementById(`workload-card-${workloads[index].id}`);
      if (card) card.classList.toggle('active', target.checked);
      updateCliDropdown();
    } else if (target.getAttribute('data-field')) {
      const field = target.getAttribute('data-field');
      const val = parseInt(target.value, 10) || 1;
      workloads[index][field] = val;
    }

    updateCalculations();
  });

  // Host Specs Events
  [hostCoresSelect, hostRamSelect, hostDiskInput].forEach(elem => {
    elem.addEventListener('change', updateCalculations);
    elem.addEventListener('input', updateCalculations);
  });

  // CLI Target Change
  if (cliTargetSelect) {
    cliTargetSelect.addEventListener('change', renderCliCommand);
  }

  // Add Custom Workload
  if (addCustomBtn) {
    addCustomBtn.addEventListener('click', () => {
      const name = customName?.value?.trim();
      if (!name) {
        alert('Please enter a workload name.');
        return;
      }
      const type = customType?.value || 'lxc';
      const cores = parseInt(customCores?.value, 10) || 2;
      const ram = parseInt(customRam?.value, 10) || 1024;
      const disk = parseInt(customDisk?.value, 10) || 20;
      const id = 'custom_' + Date.now();

      workloads.push({
        id,
        name,
        type,
        cores,
        ram,
        disk,
        enabled: true,
        template: 'debian-12-standard_12.2-1_amd64'
      });

      if (customName) customName.value = '';
      renderWorkloads();
      showToast(`Added ${name} to resource planner!`);
    });
  }

  // Copy CLI Button
  if (copyCliBtn) {
    copyCliBtn.addEventListener('click', () => {
      const cmd = proxmoxCliOutput?.textContent || '';
      copyToClipboard(cmd, 'Proxmox pct create command copied!');
    });
  }

  // Copy Proxmox Sizing Summary
  if (copyProxmoxSummaryBtn) {
    copyProxmoxSummaryBtn.addEventListener('click', () => {
      const hostCores = hostCoresSelect.value;
      const hostRam = hostRamSelect.value;
      const hostDisk = hostDiskInput.value;
      const ramCommitted = ramCommittedDisplay?.textContent || '';
      const ramPercent = ramPercentDisplay?.textContent || '';
      const vcpuStats = vcpuStatsText?.textContent?.replace(/\s+/g, ' ').trim() || '';
      const vcpuPill = vcpuStatusPill?.textContent || '';
      const diskStats = diskStatsText?.textContent || '';

      const activeList = workloads.filter(w => w.enabled).map(w => 
        `- ${w.name} (${w.type.toUpperCase()}): ${w.cores} vCPUs, ${w.ram}MB RAM, ${w.disk}GB Disk`
      ).join('\n');

      const summary = `Tech Simpld - Proxmox LXC & VM Sizing Summary
------------------------------------------------------
Host Specifications: ${hostCores} Cores | ${hostRam} GB RAM | ${hostDisk} GB Storage
Committed Memory   : ${ramCommitted} / ${hostRam} GB (${ramPercent})
vCPU Allocation    : ${vcpuStats} [${vcpuPill}]
Storage Allocation : ${diskStats}

Configured Workloads:
${activeList}

Generated At: https://techsimpld.com/tools.html#proxmox
------------------------------------------------------`;
      copyToClipboard(summary, 'Proxmox sizing summary copied!');
    });
  }

  renderWorkloads();
}
