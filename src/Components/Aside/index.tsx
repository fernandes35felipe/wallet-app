import React from 'react'
import {Container, Header, LogoImg, MenuContainer, MenuItemLink, MenuItemButton, Title} from './styles'
import {MdDashboard, MdArrowDownward, MdArrowUpward, MdExitToApp} from 'react-icons/md'
import logoImg from '../../assets/logo.svg'
import { useAuth } from '../../hooks/auth'


const Content: React.FC = () =>{
    const {signOut} = useAuth()

    return (
        <>
        <Container>
            <Header>
                <LogoImg src={logoImg} alt="Logo Minha carteira" />
                <Title>Minha carteira</Title>
            </Header>
            <MenuContainer>
                <MenuItemLink href='/dashboard'> <MdDashboard /> Dashboard </MenuItemLink>
                <MenuItemLink href='/list/entry-balance'> <MdArrowUpward />Entradas </MenuItemLink>
                <MenuItemLink href='/list/exit-balance'> <MdArrowDownward />Saídas</MenuItemLink>
                <MenuItemButton onClick={()=>{signOut()}}> <MdExitToApp />Sair</MenuItemButton>
            </MenuContainer>
        </Container>
        </>
    )
}

export default Content