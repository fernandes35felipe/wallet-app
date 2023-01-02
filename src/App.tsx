import React from "react";
import GlobalStyles from "./Styles/GlobalStyles";
import { ThemeProvider } from "styled-components";

import {useTheme} from './hooks/theme'

import dark from './Styles/Themes/dark'
import light from './Styles/Themes/light'
import Routes from "./routes";

const App: React.FC = () =>{
    const {theme} = useTheme()
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
                <Routes />
        </ThemeProvider>
    )
}

export default App