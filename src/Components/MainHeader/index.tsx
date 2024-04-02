import React, {useEffect, useMemo,useState} from 'react'
import {Container, Profile, Welcome, UserName} from './styles'
import { useTheme } from '../../hooks/theme'
import api from '../../services/api'
import Toggle from '../Toggle'
import emojis from '../utils/emojis'
import SelectInput from '../SelectInput'

const MainHeader: React.FC = () =>{
    useEffect(() => {
        getGroups()
      }, []);

    const {toggleTheme, theme} = useTheme()
    
    const [darkTheme, setDarkTheme] = useState(()=>theme.title === 'dark' ? true : false)
    const[groups, setGroups] = useState<any>(['teste1', 'teste2'])

    const [groupSelected, setGroupSelected] = useState('Pessoal')

    const getGroups = async () => {
        let groupsList = await api.get('/groups/user/'+localStorage.getItem('@minha-carteira:userId'))
        setGroups(groupsList.data)
  }
    
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
                <SelectInput options={groups} onChange={(e) => setGroupSelected(e.target.value)} defaultValue={groupSelected}/>
                <Profile>
                    <Welcome>{emoji} Olá, {localStorage.getItem('@minha-carteira:name')} </Welcome>
                    <UserName></UserName>
                </Profile>
            </Container>
        </>
    )
}

export default MainHeader