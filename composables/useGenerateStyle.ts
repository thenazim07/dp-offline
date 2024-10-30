import { ref, onMounted, onUnmounted } from 'vue';
import type { IStyle } from '~/repository/modules/PageLayoutModule/types';

export function useGenerateStyle() {
    function generateStyle(styleObject: any) {
        let style = '';
        for (const property in styleObject) {
            style += `${property}: ${styleObject[property].value}${styleObject[property].unit};`;
            // console.log(style);
        }

        return style;
    }

    return { generateStyle };
}
