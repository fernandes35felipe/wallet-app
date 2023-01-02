import styled from "styled-components";
interface IContainterProps{
color: string
}

export const Container = styled.div<IContainterProps>`
background-color: ${props => props.color};
color: ${props => props.theme.colors.white};
width: 32%;
height: 150px;
border-radius: 7px;
margin: 10px 0;
padding: 10px 20px;
position: relative;
overflow: hidden;

>img{
    position: absolute;
    height: 110%;
    top: -10px;
    right: -30px;
    opacity: .3;
}

>span{
    font-size: 14px;
    font-weight: 500;
}

>small{
    font-size: 12px;
    position: absolute;
    bottom: 10px;
}
`