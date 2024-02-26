import { ModelType } from 'src/interfaces/ModelType';
import { Languages } from 'src/services/phrase';

export {};

declare global {
    /**
     * Now declare things that go in the global namespace,
     * or augment existing declarations in the global namespace.
     */

    function particlesJS(a: string, b: any): void;
    interface dataLayer {
        push: () => void;
    }
    interface Window {
        requestAnimFrame: any;
        cancelRequestAnimFrame: any;
        paypalLoadScript: any
        particlesJS: {
            load: any;
        };
    }
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.css' {
    const content: string;
    export default content;
}

declare module '*.scss' {
    const content: string;
    export default content;
}
