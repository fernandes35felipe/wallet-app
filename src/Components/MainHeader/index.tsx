import React, {useMemo,useState} from 'react'
import {Container, Profile, Welcome, UserName} from './styles'
import { useTheme } from '../../hooks/theme'

import Toggle from '../Toggle'
import emojis from '../utils/emojis'

const MainHeader: React.FC = () =>{
    const {toggleTheme, theme} = useTheme()
    
    const [darkTheme, setDarkTheme] = useState(()=>theme.title === 'dark' ? true : false)
    
    const emoji = useMemo(() =>{
        const indice = Math.floor(Math.random() * emojis.length)
        return emojis[indice]
    },[])

    const handleChangeTheme = ()=>{
        setDarkTheme(!darkTheme)
        toggleTheme()
    }

    return (
        <>
            <Container>
                <Toggle 
                    labelLeft='Light'
                    labelRight='Dark'
                    checked={darkTheme}
                    onChange={handleChangeTheme}
                />
                <Profile>
                    <Welcome>{emoji} Olá, {localStorage.getItem('@minha-carteira:name')} </Welcome>
                    <UserName></UserName>
                </Profile>
            </Container>
        </>
    )
}

export default MainHeader