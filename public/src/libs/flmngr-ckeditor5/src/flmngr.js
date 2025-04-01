import { ButtonView } from 'ckeditor5';

import FlmngrFileCommand from "./flmngrfilecommand";
import FlmngrImgCommand from "./flmngrimgcommand";
import browseFilesIcon from '@ckeditor/ckeditor5-core/theme/icons/browse-files.svg';
import imgIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import FlmngrOriginal from "@edsdk/flmngr-ckeditor5/src/flmngr";
import * as Cookies from "@edsdk/flmngr-ckeditor5/src/cookie";


export default class Flmngr extends FlmngrOriginal {

    setFlmngr(flmngr) {
        const options = this.editor.config.get('flmngr') || this.editor.config.get('Flmngr') || {};
        options.integration = options["integration"] || "ckeditor5";
        options.integrationType = "flmngr";
        const fileManagerURL = '?p=' + (window.app.packageName || '/') + '&mode=flmngr';
        const filesURL = window.app.filemanagerUploadURL;
        let fileOptions = {
            ...options,
            urlFileManager: fileManagerURL + '&action=file', 
            urlFiles: filesURL + 'file',
        };
        let imgOptions = {
            ...options,
            urlFileManager: fileManagerURL + '&action=image', 
            urlFiles: filesURL + 'image',
        };
        let flmngrFileInstance = flmngr.create(fileOptions);
        let flmngrImgInstance = flmngr.create(imgOptions);
        FlmngrFileCommand.flmngr = flmngrFileInstance;
        FlmngrImgCommand.flmngr = flmngrImgInstance;

        let apiLegacy = flmngrFileInstance; // flmngr
        // New API exists only in Flmngr v2
        let apiNew = !!apiLegacy.getNewAPI && apiLegacy.getNewAPI();  // Flmngr but without isFlmngrReady & isImgPenReady
        this.editor["getFlmngr"] = (onFlmngrIsReady) => {
            onFlmngrIsReady(apiNew, apiLegacy); // new way to receive Flmngr
            return apiLegacy; // old way to receive Flmngr
        };
        // Call all previous listeners
        for (const l of this.listenersFlmngrIsReady)
            l(apiNew, apiLegacy);

        window.FlmngrCKEditor5 = flmngrFileInstance.getNewAPI();
    }

    init() {

        this.editor["getFlmngr"] = (onFlmngrIsReady) => {
            !!onFlmngrIsReady && this.listenersFlmngrIsReady.push(onFlmngrIsReady); // a new way to receive Flmngr
            return null; // an old way to receive Flmngr, but it is not loaded yet, 'getFlmngr' will be overridden later to return existing values
        };

        // Include Flmngr JS lib into the document if it was not added by 3rd party code
        const apiKey =  this.editor.config.get('apiKey') || this.editor.config.get('flmngr.apiKey') || this.editor.config.get('Flmngr.apiKey') || 'FLMNFLMN';
        if (window.flmngr) {
            // Already loaded by another instance or by using flmngr.js manually
            this.setFlmngr(window.flmngr);
        } else {
            // We will load it and wait
            if (!window.onFlmngrAndImgPenLoadedArray) {
                window.onFlmngrAndImgPenLoadedArray = [];
            }
            window.onFlmngrAndImgPenLoadedArray.push(() => {
                this.setFlmngr(window.flmngr);
            });

            let delay = this.editor.config.get('libLoadDelay') || this.editor.config.get('flmngr.libLoadDelay') || this.editor.config.get('Flmngr.libLoadDelay');
            if (!delay || parseInt(delay) != delay) {
                delay = 1;
            }
            setTimeout(() => {

                let host = "http" + (Cookies.get("N1ED_HTTPS") === "false" ? "" : "s") + "://" + (!!Cookies.get("N1ED_PREFIX") ? (Cookies.get("N1ED_PREFIX") + ".") : "") + "cloud.n1ed.com";
                // Flmngr.includeJS('//lab/flmngr/flmngr.js');
                // Flmngr.includeJS('//lab/flmngr/imgpen.js');
                Flmngr.includeJS(host + "/v/latest/sdk/flmngr.js?apiKey=" + apiKey);
                Flmngr.includeJS(host + "/v/latest/sdk/imgpen.js?apiKey=" + apiKey);
            }, delay);
        }

        // Add the commands
        this.editor.commands.add('flmngrfile', new FlmngrFileCommand(this.editor));
        this.editor.commands.add('flmngrimg', new FlmngrImgCommand(this.editor));

        // Add UI button
        const componentFactory = this.editor.ui.componentFactory;
        const t = this.editor.t; 

        componentFactory.add('flmngrfile', locale => {
            const command = this.editor.commands.get('flmngrfile');

            const button = new ButtonView(locale);

            button.set({
                label: t('Upload from computer'),
                icon: browseFilesIcon,
                tooltip: true
            });

            button.bind('isEnabled').to(command);

            button.on('execute', () => {
                this.editor.execute('flmngrfile');
                this.editor.editing.view.focus();
            });

            return button;
        });

        componentFactory.add('flmngrimg', locale => {
            const command = this.editor.commands.get('flmngrimg');

            const button = new ButtonView(locale);

            button.set({
                label: t('Insert image'),
                icon: imgIcon,
                tooltip: true
            });

            button.bind('isEnabled').to(command);

            button.on('execute', () => {
                this.editor.execute('flmngrimg');
                this.editor.editing.view.focus();
            });

            return button;
        });
    }
}
