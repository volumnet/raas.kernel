import { Command, findAttributeRange } from 'ckeditor5';

export default class FlmngrFileCommand extends Command {

    static flmngr;

    constructor(editor) {
        super(editor);

        // Remove default document listener to lower its priority.
        this.stopListening(this.editor.model.document, 'change');

        // Lower this command listener priority to be sure that refresh() will be called after link & image refresh.
        this.listenTo(this.editor.model.document, 'change', () => this.refresh(), { priority: 'low' });
    }

    refresh() {
        const linkCommand = this.editor.commands.get('link');
        this.isEnabled = !!linkCommand && linkCommand.isEnabled;
    }

    execute() {
        if (!FlmngrFileCommand.flmngr) {
            console.log("File manager is not loaded yet");
            return;
        }

        const selection = this.editor.model.document.selection;

        let currentUrl = null;
        let elA = null;
        const position = selection.getFirstPosition();
        if (selection.hasAttribute('linkHref')) {
            elA = findAttributeRange(position, 'linkHref', selection.getAttribute('linkHref'), this.editor.model).getItems().next().value.textNode;
            currentUrl = elA.getAttribute("linkHref");
        }

        FlmngrFileCommand.flmngr.pickFiles({
            isMultiple: false,
            list: currentUrl ? [currentUrl] : null,
            onFinish: (files) => {
                const urls = files.map(f => f.url);
                if (urls && urls[0]) {
                    const linkCommand = this.editor.commands.get('link')
                    return linkCommand.execute(urls[0], {});
                }
            }
        });
    }
}
