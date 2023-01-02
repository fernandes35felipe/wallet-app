import React from 'react'
import { PieChart as Chart, Pie, ResponsiveContainer, Cell } from 'recharts'
import {Container,LeftSide,Label,LabelContainer,RightSide } from './styles'

interface IPieChartProps{
    data: {
        name: string;
        value: number;
        percent: number;
        color: string;
    }[];
}

const PieChart: React.FC<IPieChartProps> = ({data}) =>{
    return (
        <Container >
            <LeftSide>
                <h2>Relação</h2>
                <LabelContainer>
                    {data.map((item) => <Label key={item.name} color={item.color}>
                        <div>{item.percent}</div>
                        <span>{item.name}</span>
                    </Label>)}   
                </LabelContainer>
            </LeftSide>

            <RightSide>
                <ResponsiveContainer>
                    <Chart>
                        <Pie data={data} labelLine={false} dataKey="percent">
                            {
                                data.map((item)=>(
                                <Cell key={item.name} fill={item.color} />
                                ))
                            }
                        </Pie>
                    </Chart>
                </ResponsiveContainer>
            </RightSide>
        </Container>
    )
}

export default PieChart