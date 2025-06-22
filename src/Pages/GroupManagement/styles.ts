import styled from 'styled-components';
import Toggle from '../../Components/Toggle'; // Importar Toggle
import { Button as MuiButton } from '@mui/material'; // Para estilizar o botão do Material-UI
import { MdGroup } from 'react-icons/md'; // Exemplo de ícone, se precisar

export const Container = styled.div`
    color: ${props => props.theme.colors.white};
    padding: 25px;
    height: calc(100vh - 70px);
    overflow-y: auto;
`;

export const TitleContainer = styled.div`
    margin-bottom: 25px;

    > h1 {
        color: ${props => props.theme.colors.white};
        &::after {
            content: '';
            display: block;
            width: 70px;
            border-bottom: 10px solid ${props => props.theme.colors.info};
        }
    }
`;

export const Content = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
`;

export const GroupList = styled.div`
    flex: 1;
    min-width: 300px;
    background-color: ${props => props.theme.colors.terciary};
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

    > h2 {
        margin-bottom: 15px;
        color: ${props => props.theme.colors.info};
    }
`;

export const GroupItem = styled.div`
    background-color: ${props => props.theme.colors.secondary};
    padding: 15px;
    border-radius: 8px;
    margin-top: 10px;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: translateX(5px);
    }

    > h3 {
        margin-bottom: 5px;
        color: ${props => props.theme.colors.white};
    }
    > p {
        font-size: 14px;
        color: ${props => props.theme.colors.white};
    }
`;

export const MemberList = styled.div`
    flex: 2;
    min-width: 400px;
    background-color: ${props => props.theme.colors.terciary};
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

    > h2 {
        margin-bottom: 15px;
        color: ${props => props.theme.colors.info};
    }

    ul {
        list-style: none;
        padding: 0;
    }
`;

export const MemberItem = styled.li`
    background-color: ${props => props.theme.colors.secondary};
    padding: 10px 15px;
    border-radius: 8px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    > span {
        font-size: 16px;
        color: ${props => props.theme.colors.white};
    }
`;

export const AddMemberContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    .MuiTextField-root {
        flex: 1;
        .MuiInputBase-input {
            color: ${props => props.theme.colors.white};
        }
        .MuiInputLabel-root {
            color: ${props => props.theme.colors.white};
        }
        .MuiInput-underline:before, .MuiInput-underline:after {
            border-bottom-color: ${props => props.theme.colors.white};
        }
    }
`;

export const MemberActions = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`;

export const AdminToggle = styled(Toggle)`
    .react-switch-bg {
        background-color: ${props => props.theme.colors.grey} !important; /* Cor de fundo padrão */
    }
    .react-switch-handle {
        background-color: ${props => props.theme.colors.white} !important; /* Cor do handle */
    }
`;

export const RemoveButton = styled(MuiButton)`
    background-color: ${props => props.theme.colors.warning} !important;
    color: ${props => props.theme.colors.white} !important;

    &:hover {
        opacity: 0.8;
    }
`;