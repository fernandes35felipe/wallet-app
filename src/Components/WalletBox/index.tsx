import React from 'react'
import {Container, } from './styles'
import dollarImg from '../../assets/dollar.svg'
import arrowUpImg from '../../assets/arrow-up.svg'
import arrowDownImg from '../../assets/arrow-down.svg'
import CountUp from 'react-countup';

interface IWalletBox{
title: string;
amount: number;
footerLabel: string;
icon: 'dollar' | 'arrowUp' | 'arrowDown';
color: string;
}

const WalletBox: React.FC<IWalletBox> = ({title, amount, footerLabel, icon, color}) =>{
const iconSelected = () => {
    switch (icon){
        case 'dollar':
            return dollarImg
        case 'arrowDown':
            return arrowDownImg
        case 'arrowUp':
            return arrowUpImg
        default:
            return undefined
    }
}
    return (
        <Container color={color}>
            <span>{title}</span>
            <h1><CountUp start={0} end={amount} duration={0.5} prefix={'R$ '} separator={'.'}decimal={','} decimals={2} /></h1>
            <small>{footerLabel}</small>
            {iconSelected && <img src={iconSelected()} alt={title} />}
        </Container>
    )
}

export default WalletBox