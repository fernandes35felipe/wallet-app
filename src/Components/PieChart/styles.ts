import styled from "styled-components";

interface ILabelProps{
    color: string;
}

export const Container = styled.div`
width: 48%;
height: 260px;
margin: 10px 0;
background-color: ${props => props.theme.colors.terciary};
color:${props => props.theme.colors.white}; 
border-radius: 7px;
display: flex;
`

export const LeftSide = styled.aside`
padding: 30px 20px;

>h2{
    margin-bottom: 20px;
}
`
export const RightSide = styled.main`
display: flex;
flex: 1;
justify-content: center;
`

export const LabelContainer = styled.ul`
list-style: none;
`

export const Label = styled.li<ILabelProps>`
display: flex;
align-items: center;
margin-bottom: 7px;


>div{
    background-color: ${props => props.color};
    width: 40px;
    height: 40px;
    border-radius: 5px;
    font-size: 18px;
    line-height: 40px;
    text-align: center;
}

>span{
    margin-left: 5px;
}
`

