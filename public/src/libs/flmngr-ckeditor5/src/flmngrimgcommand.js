import { Command, first } from 'ckeditor5';


export default class FlmngrImgCommand extends Command {

    static flmngr;

    imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'svg', 'webp'];

    constructor(editor) {
        super(editor);

        // Remove default document listener to lower its priority.
        this.stopListening(this.editor.model.document, 'change');

        // Lower this command listener priority to be sure that refresh() will be called after link & image refresh.
        this.listenTo(this.editor.model.document, 'change', () => this.refresh(), { priority: 'low' });
    }

    refresh() {
        const imageCommand = this.editor.commands.get('insertImage');
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

    // Call Flmngr ("Browse" action)
    execute() {
        if (!FlmngrImgCommand.flmngr) {
            console.log("File manager is not loaded yet");
            return;
        }

        const selection = this.editor.model.document.selection;
        const el = selection.getSelectedElement() || first(selection.getSelectedBlocks());

        let currentUrl = null;
        let elImg = null;
        if (!!el && (el.name === 'imageBlock' || el.name === 'imageInline')) {
            elImg = el;
            currentUrl = elImg.getAttribute("src");
        }

        FlmngrImgCommand.flmngr.pickFiles({
            acceptExtensions: this.imageExtensions,
            isMultiple: false,
            list: currentUrl ? [currentUrl] : null,
            onFinish: (files) => {
                const urls = files.map(f => f.url);
                let urlsImages = urls
                    .filter(url => this.isImage(url))
                    .map(url => FlmngrImgCommand.flmngr.getNoCacheUrl(url));

                if (urlsImages.length) {
                    this.editor.model.change(writer => {
                        const imageCommand = this.editor.commands.get('insertImage');
                        // Check if inserting an image is actually possible - it might be possible to only insert a link.
                        if (!imageCommand.isEnabled) {
                            alert('Inserting image failed', true, 'Could not insert image at the current position.', true);
                            return;
                        }
                        this.editor.execute('insertImage', { source: [urlsImages[0]] });
                    });
                }
            }
        });
    }
}
