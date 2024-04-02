import React, {useMemo, useState, useEffect}from 'react'
import {Container, Content} from './styles'
import ContentHeader from '../../Components/ContentHeader'
import WalletBox from '../../Components/WalletBox' 
import SelectInput from '../../Components/SelectInput'
import MessageBox from '../../Components/MessageBox'
import PieChart from '../../Components/PieChart'
// import gains from '../../repositories/gains'
// import expenses from '../../repositories/expenses'
import listOfMonths from '../../Components/utils/months'
import happyImg from '../../assets/happy.svg'
import sadImg from '../../assets/sad.svg'
import api from '../../services/api'
import moment from 'moment'

interface IRouteParams {
    match: {
        params:{
            type: string;
        }
    }
}

const Dashboard: React.FC<IRouteParams> = ({match}) =>{
    const {type} = match.params
    
    const [monthSelected, setMonthSelected] = useState(new Date().getMonth()+1)
    const [yearSelected, setYearSelected] = useState<any>(new Date().getFullYear())
    const [expenses, setExpenses] = useState<any>([])
    const [gains, setGains] = useState<any>([])

    const getExpenses = async () => {
        let expensesList = await api.get('/expenses/user/'+localStorage.getItem('@minha-carteira:userId'))
        setExpenses(expensesList.data)
  }

  const getEntries = async () => {
    let entriesList = await api.get('/entries/user/'+localStorage.getItem('@minha-carteira:userId'))
    setGains(entriesList.data)
}


    useEffect(() => {
        getExpenses()
        getEntries()
      }, []);

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


    const totalExpenses = useMemo(() => {
        let total: number = 0;

        expenses.forEach((item: any) =>{ 
            const date = moment(item.date).format('DD-MM-YYYY');
            const year = +date.substring(6)
            const month = +date.substring(3, 5)
            if(month === monthSelected && year === yearSelected){
                try{
                    total += Number(item.value)
                }catch{  
                    throw new Error('Invalid amount')
                }   
            }
        })

        return total
    }, [monthSelected, yearSelected, expenses])

    const totalGains = useMemo(() => {
        let total: number = 0;

        gains.forEach((item: any) =>{ 
            const date = moment(item.date).format('DD-MM-YYYY');
            const year = +date.substring(6)
            const month = +date.substring(3, 5)

            if(month === monthSelected && year === yearSelected){
                try{
                    total += Number(item.value)
                }catch{  
                    throw new Error('Invalid amount')
                }   
            }
        })
       
        return total
    }, [monthSelected, yearSelected, gains])

    const expensesVersusGains = useMemo(()=>{
    
        const total = totalExpenses + totalGains
        const gainsPercent = (totalGains/total)*100
        const expensesPercent = (totalExpenses/total)*100

        const data = [
                    {
                        name: 'Entradas',
                        value: totalGains,
                        percent: Number(gainsPercent.toFixed(1)),
                        color: '#E44C4E' 
                    },
                    {
                        name: 'Saidas',
                        value: totalExpenses,
                        percent: Number(expensesPercent.toFixed(1)),
                        color: '#F7931B' 
                     },
                    ]
                    
                    return data
    },[totalGains, totalExpenses])

    let saldo = totalGains-totalExpenses

    return (
        <Container>
            <ContentHeader title='Dashboard' lineColor='#F7931B'>
            <SelectInput options={months} onChange={(e) => setMonthSelected(Number(e.target.value))} defaultValue={monthSelected}/>
            <SelectInput options={years} onChange={(e) => setYearSelected(Number(e.target.value))} defaultValue={yearSelected}/>    
            </ ContentHeader>
            <Content>
                <WalletBox title="Saldo" amount={saldo}   footerLabel='Atualizado com base nas entradas e saídas' icon="dollar" color="#4e41f0"/>
                <WalletBox title="Entradas" amount={totalGains}   footerLabel='Atualizado com base nas entradas' icon="arrowUp" color="#F7931B"/>
                <WalletBox title="Saídas" amount={totalExpenses}   footerLabel='Atualizado com base nas saídas' icon="arrowDown" color="#e44c4e"/>
                <MessageBox title={saldo > 0 ? "Muito Bem!" : "Cuidado!"}
                            description={saldo > 0 ? "Seu saldo é positivo":"Seu saldo não é positivo"} 
                            footerText={saldo > 0 ?'Continue assim, e considere investir seu saldo':'Reveja seus gastos'} 
                            icon={saldo > 0 ? happyImg : sadImg}/>
                <PieChart data={expensesVersusGains}/>
            </Content>
        </Container>
    )
}

export default Dashboard