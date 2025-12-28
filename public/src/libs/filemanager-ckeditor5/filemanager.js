import { ButtonView, Plugin } from "ckeditor5";

import FileManagerFileCommand from "./filemanagerfilecommand";
import FileManagerImgCommand from "./filemanagerimgcommand";
import browseFilesIcon from "@ckeditor/ckeditor5-core/theme/icons/browse-files.svg";
import imgIcon from "@ckeditor/ckeditor5-core/theme/icons/image.svg";

export default class FileManager extends Plugin {
  init() {
    // Add the commands
    this.editor.commands.add(
      "filemanagerfile",
      new FileManagerFileCommand(this.editor)
    );
    this.editor.commands.add(
      "filemanagerimg",
      new FileManagerImgCommand(this.editor)
    );

    // Add UI button
    const componentFactory = this.editor.ui.componentFactory;
    const t = this.editor.t;

    componentFactory.add("filemanagerfile", (locale) => {
      const command = this.editor.commands.get("filemanagerfile");

      const button = new ButtonView(locale);

      button.set({
        label: t("Upload from computer"),
        icon: browseFilesIcon,
        tooltip: true,
      });

      button.bind("isEnabled").to(command);

      button.on("execute", () => {
        this.editor.execute("filemanagerfile");
        this.editor.editing.view.focus();
      });

      return button;
    });

    componentFactory.add("filemanagerimg", (locale) => {
      const command = this.editor.commands.get("filemanagerimg");

      const button = new ButtonView(locale);

      button.set({
        label: t("Insert image"),
        icon: imgIcon,
        tooltip: true,
      });

      button.bind("isEnabled").to(command);

      button.on("execute", () => {
        this.editor.execute("filemanagerimg");
        this.editor.editing.view.focus();
      });

      return button;
    });
  }
}
