<script setup lang="ts">
import { defineProps, defineComponent, defineEmits } from 'vue';
import CKEditor from '@ckeditor/ckeditor5-vue';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { FontSize, FontFamily, FontColor, FontBackgroundColor } from '@ckeditor/ckeditor5-font';
import { Bold, Italic, Underline, Strikethrough } from '@ckeditor/ckeditor5-basic-styles';
import { Link } from '@ckeditor/ckeditor5-link';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Heading } from '@ckeditor/ckeditor5-heading';
import {
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    PictureEditing,
    ImageResizeEditing,
    ImageResizeHandles,
    ImageInline,
} from '@ckeditor/ckeditor5-image';
import { Base64UploadAdapter } from '@ckeditor/ckeditor5-upload';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import {
    Table,
    TableToolbar,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
} from '@ckeditor/ckeditor5-table';

// Define props
const props = defineProps({
    isImage: {
        type: Boolean,
        default: false,
        required: false,
    },

    modelValue: {
        type: String,
        default: '',
    },
});

function generateFontSizes(): number[] {
    const fontSizes: number[] = [];

    for (let i = 8; i <= 20; i = i + 1) {
        fontSizes.push(i);
    }

    return fontSizes;
}

// Define emits
const emit = defineEmits(['update:modelValue']);

// Define updateModelValue function
const updateModelValue = (value) => {
    emit('update:modelValue', value);
};

// Define CKEditor component
const ckeditor = defineComponent(CKEditor.component);

// Define toolbar items
const toolbarItems = [
    'undo',
    'redo',
    '|',
    'fontSize',
    'fontFamily',
    'fontColor',
    'fontBackgroundColor',
    'insertImage',
    '|',
    'heading',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    '|',
    'alignment',
    'insertTable',
];

// Conditionally add imageUpload to toolbar if isImage prop is true
if (props.isImage) {
    toolbarItems.push('imageUpload');
}

// CKEditor configuration
const editorConfig = {
    placeholder: 'type the content here',
    plugins: [
        FontSize,
        FontFamily,
        FontColor,
        FontBackgroundColor,
        Bold,
        Italic,
        Underline,
        Strikethrough,
        Link,
        Paragraph,
        Essentials,
        Alignment,
        Image,
        Base64UploadAdapter,
        ImageCaption,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        PictureEditing,
        ImageResizeEditing,
        ImageResizeHandles,
        ImageInline,
        Table,
        TableToolbar,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        PasteFromOffice,
        Heading,
    ],
    toolbar: {
        items: toolbarItems,
        shouldNotGroupWhenFull: true,
    },
    image: {
        toolbar: [
            'imageTextAlternative',
            'toggleImageCaption',
            'imageStyle:inline',
            'imageStyle:block',
            'imageStyle:side',
            'imageStyle:alignLeft',
            'imageStyle:alignRight',
            'imageStyle:alignCenter',
            'imageStyle:wrapText',
            'imageStyle:breakText',
            'resizeImage',
        ],
    },
    fontSize: {
        options: generateFontSizes(),
        supportAllValues: true,
    },
    table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'],
    },
    lineHeight: {
        // specify your otions in the lineHeight config object.
        // Default values are ['default', 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2, 2.5]
        options: [
            1.2,
            1.5,
            'default',
            '14px',
            '16px',
            '18px',
            {
                title: 'Normal',
                model: '1',
            },
            {
                title: 'Huge',
                model: '36px',
            },
        ],
    },
    heading: {
        options: [
            {
                model: '0.5em',
                view: {
                    name: 'p',
                    classes: '0.5em',
                    styles: {
                        'line-height': '0.5em',
                    },
                },
                title: 'Line Height 0.5em',
                class: 'ck-heading_paragraph_0_5em',
                converterPriority: 'high',
            },
            {
                model: '0.8em',
                view: {
                    name: 'p',
                    classes: '0.8em',
                    styles: {
                        'line-height': '0.8em',
                    },
                },
                title: 'Line Height 0.8em',
                class: 'ck-heading_paragraph_0_8em',
                converterPriority: 'high',
            },
            {
                model: '1em',
                view: {
                    name: 'p',
                    classes: '1em',
                    styles: {
                        'line-height': '1em',
                    },
                },
                title: 'Line Height 1em',
                class: 'ck-heading_paragraph_1em',
                converterPriority: 'high',
            },
            {
                model: '1.2em',
                view: {
                    name: 'p',
                    classes: '1.2em',
                    styles: {
                        'line-height': '1.2em',
                    },
                },
                title: 'Line Height 1.2em',
                class: 'ck-heading_paragraph_1_2em',
                converterPriority: 'high',
            },
            {
                model: '1.5em',
                view: {
                    name: 'p',
                    classes: '1.5em',
                    styles: {
                        'line-height': '1.5em',
                    },
                },
                title: 'Line Height 1.5em',
                class: 'ck-heading_paragraph_1_5em',
                converterPriority: 'high',
            },
            {
                model: '2em',
                view: {
                    name: 'p',
                    classes: '2em',
                    styles: {
                        'line-height': '2em',
                    },
                },
                title: 'Line Height 2em',
                class: 'ck-heading_paragraph_2em',
                converterPriority: 'high',
            },
            {
                model: '100%',
                view: {
                    name: 'p',
                    classes: '100%',
                    styles: {
                        'line-height': '100%',
                    },
                },
                title: 'Line Height 100%',
                class: 'ck-heading_paragraph_100%',
                converterPriority: 'high',
            },
            { model: 'paragraph', title: 'Default', class: 'ck-heading_paragraph' },
            // { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            // { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            // { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            // { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            // { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
            // { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
        ],
    },
};
</script>

<template>
    <div>
        <ckeditor
            :editor="ClassicEditor"
            :model-value="props.modelValue"
            :config="editorConfig"
            @update:model-value="updateModelValue"
        >
        </ckeditor>
    </div>
</template>
