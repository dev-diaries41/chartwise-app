export type Theme = {
    background: string;
    secondary: string;
    primary: string;
    border: string;
}
interface Themes {
    light: Theme
    dark:Theme
}


export const themes: Themes = {
    dark: {
        background: "gray-900",
        secondary: "gray-800",
        primary: "#047857",
        border: "gray-700"
    },
    light: {
        background: "gray-100",
        secondary: "gray-200",
        primary: "#047857",
        border: "gray-500"
    },
}