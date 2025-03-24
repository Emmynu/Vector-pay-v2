import { ThemeProvider } from "next-themes";

export function Theme({ children}) {
    return ( 
        <ThemeProvider  themes={['light', 'cupcake']} >
            {children}
        </ThemeProvider>
     );
}
