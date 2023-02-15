import React, {useMemo, useState, useEffect} from 'react'
import { Container, Content, Filters,ButtonContainer, AddButton } from './styles'
import ContentHeader from '../../Components/ContentHeader'
import SelectInput from '../../Components/SelectInput'
import HistoryFinanceCard from '../../Components/HistoryFinanceCard'
import formatCurrency from '../../Components/utils/formatCurrency'
import listOfMonths from '../../Components/utils/months'
import api from '../../services/api'
import moment from 'moment'
import FormDialog from '../../Components/Dialog'


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
    name: string;
}

const List: React.FC<IRouteParams> = ({match}) =>{

     const [data, setData] = useState<IData[]>([])
     const [monthSelected, setMonthSelected] = useState(new Date().getMonth()+1)
     const [yearSelected, setYearSelected] = useState<number>(+moment().format('YYYY'))
     const [selectedFrequency, setSelectedFrequency] = useState(['recurrent', 'eventual'])
     const [expenses, setExpenses] = useState<any>([])
     const [gains, setGains] = useState<any>([])
     const [open, setOpen] = React.useState(false);

    const {type} = match.params
    
    const listData = useMemo(() =>{
        return type === 'entry-balance' ? gains : expenses
    }, [type, gains, expenses])

  useEffect(() => {
    getAllData()
    console.log('teste')
  },[open])

    const getAllData = async () => {
        let expensesList = await api.get('/expenses/user/'+Number(localStorage.getItem('@minha-carteira:userId')))
        let entriesList = await api.get('/entries/user/'+localStorage.getItem('@minha-carteira:userId'))
        setGains(entriesList.data)
        setExpenses(expensesList.data)
  }

    const title = useMemo(() =>{
        return type === 'entry-balance' ? {title: 'Entradas', lineColor: '#04ff00'} : {title: 'Saídas', lineColor: '#E44C4E'}
    }, [type])

    useEffect(() =>{
        const filteredData = listData.filter((item: any)=>{
            const year = +moment(item.date).format('YYYY');
            const month = +moment(item.date).format('MM');

            return (month === monthSelected && year === yearSelected && selectedFrequency.includes(item.recurrent));
        })

        const formattedData = filteredData.map((item: any) =>{
            return {
                id: item.id,
                description: item.description,
                amountFormatted: formatCurrency(Number(item.value)),
                frequency: item.frequency,
                dateFormatted: moment(item.date).format('DD/MM/YYYY'),
                tagColor: item.recurrent === 'eventual' ? '#4E41F0' : '#00ccff',
                name: item.name
            }   
        })
        setData(formattedData)
    }, [monthSelected, yearSelected, data.length, selectedFrequency, listData])

    const months = useMemo(() => {
        return listOfMonths.map((month, index) => {
            return{
                value: index+1,
                label: month
            }
        })
    },[])

    const years = useMemo(() => {
        let uniqueYears:number[] = [];
        let thisYear = Number(moment().format('YYYY'));
        uniqueYears.push(thisYear);

        [...gains, ...expenses].forEach(item =>{
            const date = moment(item.date).format('DD-MM-YYYY');
            const year = +date.substring(6)

            if(!uniqueYears.includes(year)){
                uniqueYears.push(year)
            }
        })

        return uniqueYears.map(year => {
            return {value: year, label: year}
        })
    },[expenses, gains])

    const handleFrequecy = (frequency: string) =>{
        const index = selectedFrequency.indexOf(frequency)
        if(index > -1){
            setSelectedFrequency(prev => prev.filter(fruit => fruit !== frequency ))
        }
        else{
            setSelectedFrequency(prev => [...prev, frequency])
        }
    }

    

    const handleClickOpen = () => {
      setOpen(true);
      return open
    };
  
    const handleClose = () => {
      setOpen(false);
      return open
    };

    return (
        <Container>
            <ContentHeader title={title.title} lineColor={title.lineColor}>
                <SelectInput options={months} onChange={(e) => setMonthSelected(Number(e.target.value))} defaultValue={monthSelected}/>
                <SelectInput options={years} onChange={(e) => setYearSelected(Number(e.target.value))} defaultValue={yearSelected}/>    
            </ ContentHeader>

            <Filters>
                <button 
                type='button'
                className='tag-filter tag-filter-recurrent'
                onClick={() => handleFrequecy('recurrent')}
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
            <ButtonContainer>
                <AddButton onClick={handleClickOpen}>{'+'}</AddButton >
            </ButtonContainer>
                {data.map(item => {
                    return (<>
                        <HistoryFinanceCard  tagColor={item.tagColor} title={item.name} subtitle={item.dateFormatted} amount={item.amountFormatted} type={type} id={Number(item.id)}/>
                    </>
                    )
                })}
            </Content>
            {open && <FormDialog openModal={open} setOpenModal={setOpen} type={type} isEdit={false}/>}
        </Container>
        
    )
}


export default List