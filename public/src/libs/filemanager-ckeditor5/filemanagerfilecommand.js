import { Command, findAttributeRange } from "ckeditor5";

export default class FileManagerFileCommand extends Command {
  constructor(editor) {
    super(editor);

    this.stopListening(this.editor.model.document, "change");

    this.listenTo(this.editor.model.document, "change", () => this.refresh(), {
      priority: "low",
    });
  }

  refresh() {
    const linkCommand = this.editor.commands.get("link");
    this.isEnabled = !!linkCommand && linkCommand.isEnabled;
  }

  execute() {
    const selection = this.editor.model.document.selection;

    let currentUrl = null;
    let elA = null;
    const position = selection.getFirstPosition();
    if (selection.hasAttribute("linkHref")) {
      elA = findAttributeRange(
        position,
        "linkHref",
        selection.getAttribute("linkHref"),
        this.editor.model
      )
        .getItems()
        .next().value.textNode;
      currentUrl = elA.getAttribute("linkHref");
    }

    window.app.openFileManager("file", true).then((url) => {
      if (url) {
        const linkCommand = this.editor.commands.get("link");
        return linkCommand.execute(url, {});
      }
    });
  }
}
