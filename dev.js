const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

let buildVersion = Date.now();
let isSaving = false;

fs.watch(ROOT, { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  if (filename.startsWith('.git') || filename === 'dev.js') return;
  if (isSaving) return;
  
  clearTimeout(fs.watch._timer);
  fs.watch._timer = setTimeout(() => {
    if (!isSaving) {
      buildVersion = Date.now();
      console.log(`[live-reload] File changed: ${filename}`);
    }
  }, 100);
});

function parseFrontMatter(fileContent) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: fileContent };
  }
  const data = {};
  const lines = match[1].split(/\r?\n/);
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      data[key] = val;
    }
  }
  return { data, content: match[2] };
}

function renderPage(filePath, urlPath) {
  const rawContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = parseFrontMatter(rawContent);

  const layoutName = data.layout || (urlPath.startsWith('/antechamber') ? 'antechamber' : null);
  let rendered = content;

  if (layoutName) {
    const layoutPath = path.join(ROOT, '_layouts', `${layoutName}.html`);
    if (fs.existsSync(layoutPath)) {
      let layoutHtml = fs.readFileSync(layoutPath, 'utf8');

      layoutHtml = layoutHtml.replace('{{ content }}', rendered);

      if (data.title) {
        layoutHtml = layoutHtml.replace(
          /{% if page\.title %}[\s\S]*?{% else %}[\s\S]*?{% endif %}/g,
          `${data.title} · Nadia Cañadas Giménez`
        );
        layoutHtml = layoutHtml.replace(/\{\{\s*page\.title\s*\}\}/g, data.title);
      } else {
        layoutHtml = layoutHtml.replace(
          /{% if page\.title %}[\s\S]*?{% else %}([\s\S]*?){% endif %}/g,
          '$1'
        );
      }

      if (data.mermaid) {
        layoutHtml = layoutHtml.replace(/{% if page\.mermaid %}([\s\S]*?){% endif %}/g, '$1');
      } else {
        layoutHtml = layoutHtml.replace(/{% if page\.mermaid %}[\s\S]*?{% endif %}/g, '');
      }

      layoutHtml = layoutHtml.replace(
        /{% if page\.url contains '([^']+)' %}aria-current="page"{% endif %}/g,
        (m, p) => (urlPath.includes(p) ? 'aria-current="page"' : '')
      );

      layoutHtml = layoutHtml.replace(/\{\{\s*'now'\s*\|\s*date:\s*"%Y"\s*\}\}/g, new Date().getFullYear());
      layoutHtml = layoutHtml.replace(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, '$1');

      rendered = layoutHtml;
    }
  } else {
    rendered = rendered.replace(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, '$1');
  }

  // Inject Local In-Place Editor & Fast Polling Reload (LOCAL DEV ONLY)
  const devInjectSnippet = `
  <!-- LOCAL DEV IN-PLACE TEXT EDITOR & POLLING RELOAD -->
  <style>
    #ncg-local-editor-dock {
      position: fixed;
      bottom: 24px;
      left: 24px;
      z-index: 999999;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
    }

    .ncg-editor-pill {
      background: #181614;
      border: 1px solid #d97706;
      border-radius: 999px;
      padding: 8px 16px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(217, 119, 6, 0.25);
      cursor: pointer;
      color: #fbf9f5;
      transition: all 0.2s ease;
      user-select: none;
    }

    .ncg-editor-pill:hover {
      background: #24201c;
      transform: translateY(-2px);
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(217, 119, 6, 0.35);
    }

    .ncg-editor-panel {
      display: none;
      background: #1c1a17;
      border: 1.5px solid #d97706;
      border-radius: 12px;
      padding: 16px 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(217, 119, 6, 0.2);
      color: #fbf9f5;
      flex-direction: column;
      gap: 14px;
      min-width: 380px;
      max-width: 90vw;
    }

    .ncg-editing-active [data-ncg-editable="true"] {
      cursor: text !important;
      position: relative;
      transition: outline 0.15s ease, background 0.15s ease;
    }

    .ncg-editing-active [data-ncg-editable="true"]:hover {
      outline: 1.5px dashed rgba(217, 119, 6, 0.75) !important;
      outline-offset: 4px;
      border-radius: 4px;
    }

    .ncg-editing-active [data-ncg-editable="true"]:focus {
      outline: 2px solid #d97706 !important;
      outline-offset: 4px;
      background: rgba(217, 119, 6, 0.12) !important;
      border-radius: 4px;
    }

    .ncg-editing-active [data-ncg-editable="true"].ncg-modified {
      outline: 2px solid #f59e0b !important;
      outline-offset: 4px;
      border-radius: 4px;
      background: rgba(245, 158, 11, 0.08) !important;
    }

    .ncg-editor-btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-family: inherit;
      font-size: 0.75rem;
      cursor: pointer;
      border: 1px solid transparent;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
      transition: all 0.15s ease;
    }

    .ncg-btn-save {
      background: #d97706;
      color: #ffffff;
      border-color: #f59e0b;
    }
    .ncg-btn-save:hover:not(:disabled) {
      background: #b45309;
      transform: translateY(-1px);
    }
    .ncg-btn-save:disabled {
      opacity: 0.35;
      cursor: not-allowed;
      background: #475569;
      border-color: #64748b;
    }

    .ncg-btn-close {
      background: rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
      border-color: rgba(255, 255, 255, 0.2);
    }
    .ncg-btn-close:hover {
      background: rgba(255, 255, 255, 0.18);
      color: #ffffff;
    }

    .ncg-font-opt-btn {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.72rem;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: #cbd5e1;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s ease;
    }
    .ncg-font-opt-btn:hover {
      border-color: #d97706;
      color: #ffffff;
    }
    .ncg-font-opt-btn.is-active {
      background: rgba(217, 119, 6, 0.3);
      border-color: #f59e0b;
      color: #ffffff;
      font-weight: 700;
      box-shadow: 0 0 10px rgba(217, 119, 6, 0.25);
    }

    #ncg-toast-notice {
      position: fixed;
      bottom: 90px;
      left: 24px;
      z-index: 1000000;
      background: #064e3b;
      border: 1.5px solid #10b981;
      color: #ecfdf5;
      padding: 10px 16px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.78rem;
      display: none;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    }
  </style>

  <div id="ncg-toast-notice"></div>

  <div id="ncg-local-editor-dock">
    <div id="ncg-pill-trigger" class="ncg-editor-pill" title="Modifier le texte ou la typographie de cette page (Local)">
      <span style="width: 9px; height: 9px; border-radius: 50%; background: #4ade80; display: inline-block; box-shadow: 0 0 8px #4ade80;"></span>
      <span style="font-weight: 600;">✏️ Mode Édition</span>
      <kbd style="font-size: 0.65rem; background: rgba(217,119,6,0.25); padding: 2px 6px; border-radius: 4px; color: #fbbf24;">⌘E</kbd>
    </div>

    <div id="ncg-editor-panel" class="ncg-editor-panel">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #d97706;"></span>
          <span style="font-weight: 700; color: #fbbf24;">ÉDITEUR EN DIRECT (LOCAL)</span>
        </div>
        <span id="ncg-mod-counter" style="font-size: 0.7rem; color: #94a3b8;">0 modif</span>
      </div>

      <!-- FONT QUICK SWITCHER FOR QUOTES -->
      <div>
        <div style="font-size: 0.68rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.05em;">
          Choisir la police des citations :
        </div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <button type="button" class="ncg-font-opt-btn" data-font="newsreader" title="Police de livre/presse solide et très lisible">
            📰 Newsreader (Livre)
          </button>
          <button type="button" class="ncg-font-opt-btn" data-font="jakarta" title="Moderne, ultra-net et reposant">
            ⚡ Plus Jakarta (Sans)
          </button>
          <button type="button" class="ncg-font-opt-btn" data-font="instrument" title="Police d'origine (très fine)">
            🏛️ Instrument Serif
          </button>
        </div>
      </div>

      <!-- ACTIONS -->
      <div style="display: flex; gap: 8px; justify-content: flex-end; padding-top: 4px;">
        <button type="button" id="ncg-btn-save" class="ncg-editor-btn ncg-btn-save" disabled>
          <span>💾 Sauvegarder</span>
          <kbd style="font-size: 0.65rem; background: rgba(0,0,0,0.3); padding: 1px 5px; border-radius: 3px;">⌘S</kbd>
        </button>
        <button type="button" id="ncg-btn-close" class="ncg-editor-btn ncg-btn-close">
          Fermer (Échap)
        </button>
      </div>
    </div>
  </div>

  <script>
    (function() {
      // 1. FAST NON-BLOCKING RELOAD POLLER
      let currentVersion = ${buildVersion};
      let isLocalEditing = false;

      setInterval(async function() {
        if (isLocalEditing) return;
        try {
          const r = await fetch('/__version', { cache: 'no-store' });
          if (r.ok) {
            const data = await r.json();
            if (data.v > currentVersion) {
              console.log('[Dev] New changes detected, reloading...');
              window.location.reload();
            }
          }
        } catch(e) {}
      }, 1200);

      // 2. IN-PLACE EDITOR
      const triggerPill = document.getElementById('ncg-pill-trigger');
      const panel = document.getElementById('ncg-editor-panel');
      const counterEl = document.getElementById('ncg-mod-counter');
      const saveBtn = document.getElementById('ncg-btn-save');
      const closeBtn = document.getElementById('ncg-btn-close');
      const toastEl = document.getElementById('ncg-toast-notice');

      const modifiedMap = new Map();
      let fontChangedTo = null;
      let initialFont = 'newsreader';

      const currentSerif = getComputedStyle(document.documentElement).getPropertyValue('--font-poster-serif') || '';
      if (currentSerif.includes('Plus Jakarta')) initialFont = 'jakarta';
      else if (currentSerif.includes('Instrument Serif')) initialFont = 'instrument';
      else initialFont = 'newsreader';

      function syncFontButtons(activeFont) {
        document.querySelectorAll('.ncg-font-opt-btn').forEach(btn => {
          if (btn.getAttribute('data-font') === activeFont) {
            btn.classList.add('is-active');
          } else {
            btn.classList.remove('is-active');
          }
        });
      }
      syncFontButtons(initialFont);

      function showToast(msg) {
        toastEl.textContent = msg;
        toastEl.style.display = 'block';
        setTimeout(() => { toastEl.style.display = 'none'; }, 4000);
      }

      function updateCounterAndSave() {
        const textCount = modifiedMap.size;
        const total = textCount + (fontChangedTo ? 1 : 0);

        let parts = [];
        if (fontChangedTo) parts.push('Police ' + fontChangedTo);
        if (textCount > 0) parts.push(textCount + ' texte' + (textCount > 1 ? 's' : ''));

        if (total > 0) {
          counterEl.textContent = parts.join(' + ') + ' à sauver';
          counterEl.style.color = '#f59e0b';
          saveBtn.disabled = false;
        } else {
          counterEl.textContent = '0 modif';
          counterEl.style.color = '#94a3b8';
          saveBtn.disabled = true;
        }
      }

      function enableEditMode() {
        isLocalEditing = true;
        document.body.classList.add('ncg-editing-active');
        triggerPill.style.display = 'none';
        panel.style.display = 'flex';

        const selectors = 'h1, h2, h3, h4, p, blockquote, .story-subtitle, .gazette-tagline, .gazette-notice-text, .poster-main-title';
        const candidates = document.querySelectorAll(selectors);

        candidates.forEach(el => {
          if (el.closest('#ncg-local-editor-dock') || el.closest('.antechamber-sidebar-right') || el.closest('.antechamber-mobile-header')) return;
          
          el.setAttribute('data-ncg-editable', 'true');
          el.contentEditable = 'true';
          
          if (!el.hasAttribute('data-ncg-orig')) {
            el.setAttribute('data-ncg-orig', el.innerText.trim());
          }

          const handleInput = function() {
            const orig = el.getAttribute('data-ncg-orig');
            const curr = el.innerText.trim();

            if (orig !== curr) {
              el.classList.add('ncg-modified');
              modifiedMap.set(el, { original: orig, updated: curr });
            } else {
              el.classList.remove('ncg-modified');
              modifiedMap.delete(el);
            }
            updateCounterAndSave();
          };

          el.oninput = handleInput;
          el.onkeyup = handleInput;
          el.onblur = handleInput;
        });

        updateCounterAndSave();
      }

      function disableEditMode() {
        isLocalEditing = false;
        document.body.classList.remove('ncg-editing-active');
        panel.style.display = 'none';
        triggerPill.style.display = 'inline-flex';

        document.querySelectorAll('[data-ncg-editable="true"]').forEach(el => {
          el.contentEditable = 'false';
        });
      }

      async function saveEdits() {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Sauvegarde...';

        const replacements = [];
        modifiedMap.forEach((val) => {
          replacements.push(val);
        });

        try {
          const res = await fetch('/__save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              urlPath: window.location.pathname,
              font: fontChangedTo,
              replacements: replacements
            })
          });

          const data = await res.json();
          if (data.success) {
            modifiedMap.forEach((val, el) => {
              el.setAttribute('data-ncg-orig', val.updated);
              el.classList.remove('ncg-modified');
            });
            modifiedMap.clear();

            if (fontChangedTo) {
              initialFont = fontChangedTo;
              fontChangedTo = null;
            }

            updateCounterAndSave();
            saveBtn.textContent = '💾 Sauvegarder';

            showToast('✓ ' + (data.message || 'Modifications enregistrées !'));
          } else {
            alert('Erreur lors de la sauvegarde : ' + (data.error || 'Inconnue'));
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Sauvegarder';
          }
        } catch(err) {
          alert('Erreur réseau : ' + err.message);
          saveBtn.disabled = false;
          saveBtn.textContent = '💾 Sauvegarder';
        }
      }

      triggerPill.addEventListener('click', enableEditMode);
      closeBtn.addEventListener('click', disableEditMode);
      saveBtn.addEventListener('click', saveEdits);

      // FONT SWITCHER IN REAL TIME
      const fontBtns = document.querySelectorAll('.ncg-font-opt-btn');
      fontBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          const fontChoice = this.getAttribute('data-font');
          syncFontButtons(fontChoice);

          if (fontChoice !== initialFont) {
            fontChangedTo = fontChoice;
          } else {
            fontChangedTo = null;
          }

          if (fontChoice === 'newsreader') {
            document.documentElement.style.setProperty('--font-poster-serif', "'Newsreader', Georgia, serif");
          } else if (fontChoice === 'jakarta') {
            document.documentElement.style.setProperty('--font-poster-serif', "'Plus Jakarta Sans', sans-serif");
          } else {
            document.documentElement.style.setProperty('--font-poster-serif', "'Instrument Serif', Georgia, serif");
          }

          updateCounterAndSave();
        });
      });

      // KEYBOARD SHORTCUTS (⌘E, ⌘S, Esc)
      window.addEventListener('keydown', function(e) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
          e.preventDefault();
          if (!isLocalEditing) enableEditMode();
          else disableEditMode();
        } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
          if (isLocalEditing && (modifiedMap.size > 0 || fontChangedTo)) {
            e.preventDefault();
            saveEdits();
          }
        } else if (e.key === 'Escape') {
          if (isLocalEditing) {
            disableEditMode();
          }
        }
      });
    })();
  </script>
  </body>`;

  if (rendered.includes('</body>')) {
    rendered = rendered.replace('</body>', devInjectSnippet);
  } else {
    rendered += devInjectSnippet;
  }

  return rendered;
}

const server = http.createServer((req, res) => {
  let reqUrl = decodeURI(req.url.split('?')[0]);

  if (reqUrl === '/__version') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Connection': 'close'
    });
    res.end(JSON.stringify({ v: buildVersion }));
    return;
  }

  // SAVE ENDPOINT (LOCAL DEV ONLY)
  if (req.method === 'POST' && reqUrl === '/__save') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        let savedDetails = [];
        isSaving = true;

        // 1. Save font if changed
        if (payload.font) {
          const layoutPath = path.join(ROOT, '_layouts', 'antechamber.html');
          if (fs.existsSync(layoutPath)) {
            let layoutHtml = fs.readFileSync(layoutPath, 'utf8');
            let newFontStr = "'Newsreader', Georgia, serif";
            if (payload.font === 'jakarta') {
              newFontStr = "'Plus Jakarta Sans', sans-serif";
            } else if (payload.font === 'instrument') {
              newFontStr = "'Instrument Serif', Georgia, serif";
            }
            layoutHtml = layoutHtml.replace(
              /--font-poster-serif:\s*[^;]+;/g,
              `--font-poster-serif: ${newFontStr};`
            );
            fs.writeFileSync(layoutPath, layoutHtml, 'utf8');
            savedDetails.push(`Police (${payload.font})`);
          }
        }

        // 2. Save text replacements if any
        if (payload.replacements && payload.replacements.length > 0) {
          let targetFilePath = path.join(ROOT, payload.urlPath || '/');
          if (fs.existsSync(targetFilePath) && fs.statSync(targetFilePath).isDirectory()) {
            targetFilePath = path.join(targetFilePath, 'index.html');
          } else if (!fs.existsSync(targetFilePath) && fs.existsSync(targetFilePath + '.html')) {
            targetFilePath = targetFilePath + '.html';
          }

          if (fs.existsSync(targetFilePath)) {
            let fileContent = fs.readFileSync(targetFilePath, 'utf8');
            let replacedCount = 0;

            for (const item of payload.replacements) {
              if (!item.original || item.original === item.updated) continue;
              let orig = item.original.trim();
              let upd = item.updated.trim();

              if (fileContent.includes(orig)) {
                fileContent = fileContent.replace(orig, upd);
                replacedCount++;
              } else {
                const normOrig = orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
                const regex = new RegExp(normOrig);
                if (regex.test(fileContent)) {
                  fileContent = fileContent.replace(regex, upd);
                  replacedCount++;
                }
              }
            }

            fs.writeFileSync(targetFilePath, fileContent, 'utf8');
            savedDetails.push(`${replacedCount} texte(s) dans ${path.basename(targetFilePath)}`);
          }
        }

        setTimeout(() => { isSaving = false; }, 300);

        res.writeHead(200, { 'Content-Type': 'application/json', 'Connection': 'close' });
        res.end(JSON.stringify({ success: true, message: savedDetails.join(' + ') || 'Enregistré avec succès !' }));
      } catch (err) {
        isSaving = false;
        res.writeHead(500, { 'Content-Type': 'application/json', 'Connection': 'close' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Resolve file
  let filePath = path.join(ROOT, reqUrl);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  if (!fs.existsSync(filePath)) {
    const custom404 = path.join(ROOT, '404.html');
    if (fs.existsSync(custom404)) {
      try {
        const html = renderPage(custom404, reqUrl);
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Connection': 'close' });
        res.end(html);
        return;
      } catch (err) {
        // fallback
      }
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Connection': 'close' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.html') {
    try {
      const html = renderPage(filePath, reqUrl);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Connection': 'close' });
      res.end(html);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8', 'Connection': 'close' });
      res.end('Error rendering page: ' + err.message);
    }
    return;
  }

  const mime = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`\n🚀 Dev server running at http://localhost:${PORT}`);
  console.log(`👀 Watching for file changes with auto-reload...\n`);
});
