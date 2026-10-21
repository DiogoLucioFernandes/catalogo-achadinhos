// ===== CONFIGURE AQUI =====
const SENHA = 'troque-esta-senha'; // senha do painel
// Colunas: A nome | B categoria | C preco | D link | E imagem | F maisvendido | G ativo | H cliques

const sh = () => SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
const out = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);

// Rode UMA vez (menu Executar) para criar a coluna de cliques e autorizar o script
function preparar() {
  sh().getRange('H1').setValue('cliques');
}

function dados() {
  const s = sh(), n = s.getLastRow() - 1;
  return n > 0 ? s.getRange(2, 1, n, 8).getValues() : [];
}

function doGet(e) {
  const p = e.parameter || {};
  if (p.click) {                       // contador: ?click=<link do produto>
    const l = LockService.getScriptLock(); l.waitLock(10000);
    try {
      const v = dados(), i = v.findIndex(r => String(r[3]).trim() === p.click);
      if (i >= 0) sh().getRange(i + 2, 8).setValue((Number(v[i][7]) || 0) + 1);
    } finally { l.releaseLock(); }
    return out({ ok: true });
  }
  return out({
    produtos: dados().map(r => ({
      n: r[0], c: r[1], p: r[2], l: r[3], i: r[4],
      m: String(r[5]).toLowerCase() === 'sim' ? 1 : 0,
      a: String(r[6]).toLowerCase() === 'sim' ? 1 : 0,
      k: Number(r[7]) || 0
    }))
  });
}

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  if (d.senha !== SENHA) return out({ erro: 'Senha incorreta' });
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const s = sh();
    if (d.acao === 'add') {
      s.appendRow([d.n, d.c, '', d.l, d.i, '', 'sim', 0]);
    } else if (d.acao === 'set' || d.acao === 'del') {
      let v = dados();
      const n = v.length, alvo = new Set(d.links);
      if (d.acao === 'set') {
        v.forEach(r => {
          if (!alvo.has(r[3])) return;
          if (d.a != null) r[6] = d.a ? 'sim' : 'nao';
          if (d.m != null) r[5] = d.m ? 'sim' : '';
        });
      } else {
        v = v.filter(r => !alvo.has(r[3]));
        if (n) s.getRange(2, 1, n, 8).clearContent();
      }
      if (v.length) s.getRange(2, 1, v.length, 8).setValues(v);
    }
    return out({ ok: true });
  } finally { lock.releaseLock(); }
}
