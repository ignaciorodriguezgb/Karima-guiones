(function(){
  var saveBtn = document.getElementById("save");
  var statusEl = document.getElementById("status");
  var dirty = false;

  function setStatus(msg, kind){ statusEl.textContent = msg; statusEl.className = "status" + (kind ? " " + kind : ""); }
  function text(el){
    var t = el.innerText != null ? el.innerText : el.textContent;
    return t.replace(/ /g, " ").replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();
  }
  function collect(){
    var s = { reels: [] };
    document.querySelectorAll(".f[data-root]").forEach(function(el){ s[el.dataset.k] = text(el); });
    document.querySelectorAll(".card").forEach(function(card){
      var i = +card.dataset.i; s.reels[i] = {};
      card.querySelectorAll(".f").forEach(function(el){ s.reels[i][el.dataset.k] = text(el); });
    });
    return s;
  }
  function apply(s){
    if (!s || !Array.isArray(s.reels)) return;
    document.querySelectorAll(".f[data-root]").forEach(function(el){ if (s[el.dataset.k] != null) el.innerText = s[el.dataset.k]; });
    document.querySelectorAll(".card").forEach(function(card){
      var r = s.reels[+card.dataset.i]; if (!r) return;
      card.querySelectorAll(".f").forEach(function(el){ if (r[el.dataset.k] != null) el.innerText = r[el.dataset.k]; });
    });
  }
  function markDirty(){ if (!dirty){ dirty = true; saveBtn.classList.add("dirty"); setStatus("Cambios sin guardar"); } }
  document.addEventListener("input", function(e){ if (e.target.closest && e.target.closest(".f")) markDirty(); });
  window.addEventListener("beforeunload", function(e){ if (dirty){ e.preventDefault(); e.returnValue = ""; } });

  // Cargar la última versión guardada
  fetch("/api/guiones", { cache: "no-store" }).then(function(r){
    if (r.status === 404) { setStatus("Versión inicial"); return null; }
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }).then(function(s){ if (s){ apply(s); setStatus("Última versión cargada"); } })
    .catch(function(){ setStatus("No se pudo leer el servidor; mostrando la versión inicial"); });

  saveBtn.addEventListener("click", function(){
    if (!dirty){ setStatus("Sin cambios"); return; }
    saveBtn.disabled = true; setStatus("Guardando…");
    fetch("/api/guiones", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(collect()) })
      .then(function(r){ if (!r.ok) throw new Error(r.status); dirty = false; saveBtn.classList.remove("dirty"); setStatus("Guardado", "ok"); })
      .catch(function(){ setStatus("No se pudo guardar. Revisá que el Blob store esté conectado al proyecto."); })
      .then(function(){ saveBtn.disabled = false; });
  });
})();
