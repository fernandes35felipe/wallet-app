import styled from 'styled-components';


export const Container = styled.div`
grid-area: AS;
background-color: ${props => props.theme.colors.secondary};
padding-left: 20px;
border-right: 1px solid ${props => props.theme.colors.grey};
`

export const Header = styled.header`
display: flex;
align-items: center;
height: 70px;
`;

export const LogoImg = styled.img`
height: 40px;
width: 40px;
`;

export const Title = styled.h3`
color: ${props => props.theme.colors.white};
margin-left: 10px;
`;

export const MenuContainer = styled.nav`
display: flex;
margin-top: 50px;
flex-direction: column;
`;

export const MenuItemLink = styled.a`
color: ${props => props.theme.colors.white};
text-decoration: none;
transition: opacity .3s;
margin: 9px 0;
display: flex;
align-items: center;

&:hover{
    opacity: .7;
}

> svg{
    font-size: 24px;
    margin-right: 5px;
}
`;

export const MenuItemButton = styled.button`
font-size: 16px;
color: ${props => props.theme.colors.white};
border: none;
text-decoration: none;
background: none;
transition: opacity .3s;
margin: 7px 0;
display: flex;
align-items: center;

&:hover{
    opacity: .7;
}

> svg{
    font-size: 18px;
    margin-right: 5px;
}
`;