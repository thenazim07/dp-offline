export interface IMargins {
    type: string;
    left: number;
    right: number;
    top: number;
    bottom: number;
    unit: string;
}
export interface IPageSetUpData {
    page_type: string;
    page_size: string;
    height: number;
    width: number;
    unit: string;
    margins: IMargins;
}

export interface IStyle {
    value: string;
    unit: string;
}

export interface IPatientSectionColumn {
    item: string;
    styles: {
        width: IStyle;
        'padding-left': IStyle;
        'padding-right': IStyle;
        'padding-top': IStyle;
        'padding-bottom': IStyle;

        'border-left-width': IStyle;
        'border-right-width': IStyle;
        'border-top-width': IStyle;
        'border-bottom-width': IStyle;

        'margin-left': IStyle;
        'margin-right': IStyle;
        'margin-top': IStyle;
        'margin-bottom': IStyle;
        // as many styles required
    };
    label: {
        text: string;
        printable: boolean;
        styles: {
            'font-size': IStyle;
            'font-weight': IStyle;
            'padding-left': IStyle;
            'padding-right': IStyle;
            'padding-top': IStyle;
            'padding-bottom': IStyle;

            'border-left-width': IStyle;
            'border-right-width': IStyle;
            'border-top-width': IStyle;
            'border-bottom-width': IStyle;

            'margin-left': IStyle;
            'margin-right': IStyle;
            'margin-top': IStyle;
            'margin-bottom': IStyle;
            // as many styles required
        };
    };
    value: {
        styles: {
            'font-size': IStyle;
            'font-weight': IStyle;
            'padding-left': IStyle;
            'padding-right': IStyle;
            'padding-top': IStyle;
            'padding-bottom': IStyle;

            'border-left-width': IStyle;
            'border-right-width': IStyle;
            'border-top-width': IStyle;
            'border-bottom-width': IStyle;

            'margin-left': IStyle;
            'margin-right': IStyle;
            'margin-top': IStyle;
            'margin-bottom': IStyle;
            // as many styles required
        };
    };
}

export interface IPatientSectionRow {
    styles: {
        'margin-left': IStyle;
        'margin-right': IStyle;
        'margin-top': IStyle;
        'margin-bottom': IStyle;

        'border-left-width': IStyle;
        'border-right-width': IStyle;
        'border-top-width': IStyle;
        'border-bottom-width': IStyle;

        'padding-left': IStyle;
        'padding-right': IStyle;
        'padding-top': IStyle;
        'padding-bottom': IStyle;
    };
    columns: IPatientSectionColumn[];
}

export interface IPatientSection {
    rootStylesExtras: { unit: string };
    rootStyles: {
        width: IStyle;

        'margin-left': IStyle;
        'margin-right': IStyle;
        'margin-top': IStyle;
        'margin-bottom': IStyle;

        'border-left-width': IStyle;
        'border-right-width': IStyle;
        'border-top-width': IStyle;
        'border-bottom-width': IStyle;

        'padding-left': IStyle;
        'padding-right': IStyle;
        'padding-top': IStyle;
        'padding-bottom': IStyle;
    };
    rows: IPatientSectionRow[];
}

export interface IBodySectionItemDetail {
    list: {
        styles: {
            'padding-top': IStyle;
            'padding-left': IStyle;
            'padding-right': IStyle;
            'padding-bottom': IStyle;
        };
    };
    label: {
        text?: string;
        printable: boolean;
    };
    styles: {
        height: IStyle;
        'padding-top': IStyle;
        'padding-left': IStyle;
        'padding-right': IStyle;
        'padding-bottom': IStyle;
    };
}

export interface IBodyItems {
    diagnosis?: IBodySectionItemDetail;
    indication?: IBodySectionItemDetail;
    past_history?: IBodySectionItemDetail;
    investigation?: IBodySectionItemDetail;
    on_examination?: IBodySectionItemDetail;
    drug?: IBodySectionItemDetail;
    advise?: IBodySectionItemDetail;
    follow_up?: IBodySectionItemDetail;
    signature?: IBodySectionItemDetail;
}

export interface IPrescriptionBodySection {
    body: {
        extras: {
            unit: string;
        };
        columns: {
            column0: {
                items: IBodyItems;
            };
            column1: {
                items: IBodyItems;
            };
        };
    };
    left_section_width: number;
    right_section_width: number;
    divider_line: boolean;
    bottom_line: boolean;
}
