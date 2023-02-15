import React, {useState} from 'react'
import EditIcon from '@mui/icons-material/Edit';
import {Container, Tag, EditButton} from './styles'
import FormDialog from '../../Components/Dialog'
interface IHisHistoryFinanceCardProps{
tagColor: string,
title: string,
subtitle: string,
amount: string,
type: string,
id: number,
}

const HistoryFinanceCard: React.FC<IHisHistoryFinanceCardProps> = ({tagColor, title, subtitle, amount, type, id}) =>{
    const [open, setOpen] = useState<boolean>(false)

    const handleClickOpen = () => {
        setOpen(true);
        return open
      };

    return (
        <Container>
            <Tag color={tagColor} />
            <div>
                <span>{title}</span>
                <small>{subtitle}</small>
            </div>
            <h3>{amount}</h3>
        <EditButton onClick={handleClickOpen}><EditIcon /></EditButton>
        {open && <FormDialog openModal={open} setOpenModal={setOpen} type={type} isEdit={true} itemId={id}/>}
        </Container>
    )
}

export default HistoryFinanceCard