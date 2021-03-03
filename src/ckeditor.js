/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";

import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import UploadAdapter from "@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter";
import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import CKFinder from "@ckeditor/ckeditor5-ckfinder/src/ckfinder";
import EasyImage from "@ckeditor/ckeditor5-easy-image/src/easyimage";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";
import Indent from "@ckeditor/ckeditor5-indent/src/indent";
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Link from "@ckeditor/ckeditor5-link/src/link";
import List from "@ckeditor/ckeditor5-list/src/list";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";
import Table from "@ckeditor/ckeditor5-table/src/table";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";
import TextTransformation from "@ckeditor/ckeditor5-typing/src/texttransformation";
import Font from '@ckeditor/ckeditor5-font/src/font';
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
// import Widget from "@ckeditor/ckeditor5-widget/src/widget";
import Command from "@ckeditor/ckeditor5-core/src/command";
import {
	addListToDropdown,
	createDropdown,
} from "@ckeditor/ckeditor5-ui/src/dropdown/utils";
import Collection from "@ckeditor/ckeditor5-utils/src/collection";
import Model from "@ckeditor/ckeditor5-ui/src/model";

export class InsertDropdownCommand extends Command {
	execute({ value }) {
		const editor = this.editor;

		editor.model.change((writer) => {
			writer.insertText(
				value,
				editor.model.document.selection.getFirstPosition()
			);
		});
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const isAllowed = model.schema.checkChild(
			selection.focus.parent,
			"insertDropdown"
		);
		this.isEnabled = true;
	}
}

export class InsertDropdown extends Plugin {
	init() {
		const { editor } = this;
		editor.commands.add(
			"insertDropdown",
			new InsertDropdownCommand(this.editor)
		);
		editor.config.define("insertDropdownConfig", {
			label: "Pesron",
			values: ["John Doe", "Jack Does"],
		});

		const label = editor.config.get("insertDropdownConfig.label");
		const names = editor.config.get("insertDropdownConfig.values");

		editor.ui.componentFactory.add("insertDropdown", (locale) => {
			const dropdownView = createDropdown(locale);
			const collection = new Collection();
			for (const name of names) {
				collection.add({
					type: "button",
					model: new Model({
						commandParam: name,
						label: name,
						withText: true,
					}),
				});
			}
			addListToDropdown(dropdownView, collection);
			dropdownView.buttonView.set({
				label: label,
				tooltip: true,
				withText: true,
			});

			this.listenTo(dropdownView, "execute", (evt) => {
				editor.execute("insertDropdown", { value: evt.source.commandParam });
				editor.editing.view.focus();
			});

			return dropdownView;
		});
	}
}

export default class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	Essentials,
	Underline,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	BlockQuote,
	CKFinder,
	EasyImage,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	Font,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	TextTransformation,
	InsertDropdown,
];

// Editor configuration.
ClassicEditor.defaultConfig = {
	toolbar: [
		"bold",
		"italic",
		"link",
		"bulletedList",
		"numberedList",
		"insertDropdown",
	],
	link: {
		addTargetToExternalLinks: true,
	}
};
