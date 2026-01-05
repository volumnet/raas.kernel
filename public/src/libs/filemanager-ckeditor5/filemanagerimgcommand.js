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
    window.app.openFileManager("image", true).then((url) => {
      if (!url) return;

      const editor = this.editor;
      const model = editor.model;
      const selection = model.document.selection;

      // Проверяем, можно ли вставить изображение в текущую позицию
      if (!editor.commands.get("imageUpload").isEnabled) {
        return;
      }

      editor.model.change((writer) => {
        // Создаём элемент изображения БЕЗ width и height
        const imageElement = writer.createElement("imageInline", {
          src: url,
          alt: "",
        });

        // Вставляем в текущую позицию
        model.insertContent(imageElement, selection);
      });
    });
  }
}
