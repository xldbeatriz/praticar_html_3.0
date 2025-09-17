const htmlCode = document.getElementById("html");
const cssCode = document.getElementById("css");
const jsCode = document.getElementById("js");
const previewFrame = document.getElementById("preview");
const imageUpload = document.getElementById("imageUpload");

// Guardar imagens enviadas
let imagens = {};

// Função para atualizar o preview
function updatePreview() {
  const preview = previewFrame.contentDocument || previewFrame.contentWindow.document;

  let htmlContent = htmlCode.value;

  // Substituir caminhos por base64 (se houver imagem com nome igual)
  Object.keys(imagens).forEach(nome => {
    const regex = new RegExp(`src=["']${nome}["']`, "g");
    htmlContent = htmlContent.replace(regex, `src="${imagens[nome]}"`);
  });

  preview.open();
  preview.write(`
    ${htmlContent}
    <style>${cssCode.value}</style>
    <script>${jsCode.value}<\/script>
  `);
  preview.close();
}

// Atualiza em tempo real
[htmlCode, cssCode, jsCode].forEach(editor => {
  editor.addEventListener("input", updatePreview);
});

// Controle das abas estilo VS Code
const tabs = document.querySelectorAll(".tab");
const editors = document.querySelectorAll(".code");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    editors.forEach(e => e.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// Upload de imagem
imageUpload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    imagens[file.name] = evt.target.result; // salva em base64
    updatePreview();
  };
  reader.readAsDataURL(file);
});

// 👉 Permitir Tab para indentação nos editores
document.querySelectorAll("textarea.code").forEach(area => {
  area.addEventListener("keydown", function(e) {
    if (e.key === "Tab") {
      e.preventDefault();

      const start = this.selectionStart;
      const end = this.selectionEnd;

      // Insere um Tab real (\t)
      const indent = "\t";

      this.value =
        this.value.substring(0, start) + indent + this.value.substring(end);

      // Reposiciona o cursor depois da indentação
      this.selectionStart = this.selectionEnd = start + indent.length;
    }
  });
});

// Render inicial
updatePreview();
