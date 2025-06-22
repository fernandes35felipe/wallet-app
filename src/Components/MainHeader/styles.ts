import styled from 'styled-components';

export const Container = styled.div`
grid-area: MH; 
background-color: ${props => props.theme.colors.secondary}; 
display: flex; 
justify-content: space-between; 
align-items: center; 
padding: 0 10px; 
border-bottom: 1px solid ${props => props.theme.colors.grey}; 
`

export const Profile = styled.div`
display: flex; 
flex-direction: row; 
color: ${props => props.theme.colors.white}; 
`

export const Welcome = styled.h3`
`

export const UserName = styled.h3`
`

export const NewGroupButton = styled.button`
    background-color: ${props => props.theme.colors.info};
    color: ${props => props.theme.colors.white};
    font-size: 20px;
    font-weight: bold;
    border-radius: 5px;
    padding: 5px 10px;
    margin-left: 10px;
    cursor: pointer;
    transition: opacity .3s;

    &:hover {
        opacity: 0.8;
    }
`;