import React, {useMemo, useState, useEffect} from 'react'
import { Container, Content, Filters } from './styles'
import ContentHeader from '../../Components/ContentHeader'
import SelectInput from '../../Components/SelectInput'
import HistoryFinanceCard from '../../Components/HistoryFinanceCard'
import gains from '../../repositories/gains'
import expenses from '../../repositories/expenses'
import formatCurrency from '../../Components/utils/formatCurrency'
import formatDate from '../../Components/utils/formatDate'
import listOfMonths from '../../Components/utils/months'

interface IRouteParams {
    match: {
        params:{
            type: string;
        }
    }
}

interface IData{
    id: string;
    description: string;
    amountFormatted: string;
    frequency: string;
    dateFormatted: string;
    tagColor: string;
}

const List: React.FC<IRouteParams> = ({match}) =>{

     const [data, setData] = useState<IData[]>([])
     const [monthSelected, setMonthSelected] = useState<string>(String(new Date().getMonth()+1))
     const [yearSelected, setYearSelected] = useState<string>(String(new Date().getFullYear()))
     const [selectedFrequency, setSelectedFrequency] = useState(['recorrente', 'eventual'])
    
    const {type} = match.params
    
    const listData = useMemo(() =>{
        return type === 'entry-balance' ? gains : expenses
    }, [type])

    const title = useMemo(() =>{
        return type === 'entry-balance' ? {title: 'Entradas', lineColor: '#04ff00'} : {title: 'Saídas', lineColor: '#E44C4E'}
    }, [type])

    useEffect(() =>{
        const filteredData = listData.filter(item=>{
            const date = new Date(item.date)
            const month = String(date.getMonth()+1)
            const year = String(date.getFullYear())
            return month === monthSelected && year === yearSelected && selectedFrequency.includes(item.frequency);
        })
            
        const formattedData = filteredData.map(item =>{
            return {
                id: String(Math.random()*data.length),
                description: item.description,
                amountFormatted: formatCurrency(Number(item.amount)),
                frequency: item.frequency,
                dateFormatted: formatDate(item.date),
                tagColor: item.frequency === 'eventual' ? '#4E41F0' : '#00ccff',
            }   
        })
        setData(formattedData)
    }, [monthSelected, yearSelected, data.length, selectedFrequency])

    const months = useMemo(() => {
        return listOfMonths.map((month, index) => {
            return{
                value: index+1,
                label: month
            }
        })
    },[])

    const years = useMemo(() => {
        let uniqueYears:number[] = []

        listData.forEach(item =>{
            const date = new Date(item.date)
            const year = date.getFullYear()

            if(!uniqueYears.includes(year)){
                uniqueYears.push(year)
            }
        })

        return uniqueYears.map(year => {
            return {value: year, label: year}

        })
    },[])

    const handleFrequecy = (frequency: string) =>{
        const index = selectedFrequency.indexOf(frequency)
        if(index > -1){
            setSelectedFrequency(prev => prev.filter(fruit => fruit !== frequency ))
        }
        else{
            setSelectedFrequency(prev => [...prev, frequency])
        }
    }

    return (
        <Container>
            <ContentHeader title={title.title} lineColor={title.lineColor}>
                <SelectInput options={months} onChange={(e) => setMonthSelected(e.target.value)} defaultValue={monthSelected}/>
                <SelectInput options={years} onChange={(e) => setYearSelected(e.target.value)} defaultValue={yearSelected}/>    
            </ ContentHeader>

            <Filters>
                <button 
                type='button'
                className='tag-filter tag-filter-recurrent'
                onClick={() => handleFrequecy('recorrente')}
                >
                    Recorrentes
                </button>
                <button 
                type='button'
                className='tag-filter tag-filter-eventual'
                onClick={() => handleFrequecy('eventual')}
                >
                    Eventuais
                </button>
            </Filters>

            <Content>
                {data.map(item => {
                    return <HistoryFinanceCard  tagColor={item.tagColor} title={item.description} subtitle={item.dateFormatted} amount={item.amountFormatted} />
                })}
            </Content>
        </Container>
    )
}

export default List