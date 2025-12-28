import { Command, first } from "ckeditor5";

export default class FileManagerImgCommand extends Command {
  imageExtensions = ["jpeg", "jpg", "png", "gif", "bmp", "svg", "webp"];

  constructor(editor) {
    super(editor);

    this.stopListening(this.editor.model.document, "change");

    this.listenTo(this.editor.model.document, "change", () => this.refresh(), {
      priority: "low",
    });
  }

  refresh() {
    const imageCommand = this.editor.commands.get("insertImage");
    this.isEnabled = !!imageCommand && imageCommand.isEnabled;
  }

  isImage(filepath) {
    let i = filepath.lastIndexOf(".");
    if (i > -1 && i < filepath.length - 1) {
      let ext = filepath.substr(i + 1).toLowerCase();
      return this.imageExtensions.indexOf(ext) != -1;
    }
    return false;
  }

  execute() {
    const selection = this.editor.model.document.selection;
    const el =
      selection.getSelectedElement() || first(selection.getSelectedBlocks());

    let currentUrl = null;
    let elImg = null;
    if (!!el && (el.name === "imageBlock" || el.name === "imageInline")) {
      elImg = el;
      currentUrl = elImg.getAttribute("src");
    }

    window.app.openFileManager("image", true).then((url) => {
      this.editor.model.change((writer) => {
        const imageCommand = this.editor.commands.get("insertImage");
        if (!imageCommand.isEnabled) {
          return;
        }
        if (url) {
          this.editor.execute("insertImage", { source: url });
        }
      });
    });
  }
}
