import React, {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Checkbox } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Label } from './styles';
import api from '../../services/api';

export default function FormDialog(props: any) {

  const {openModal, setOpenModal, type, isEdit, itemId} = props
  
  const [name, setName] = useState<string>()
  const [description, setDescription] = useState<String>()
  const [value, setValue] = useState<Number>()
  const [date, setDate] = useState<String>()
  const [recurrent, setRecurrent] = useState<string>('eventual')
  const [checkRecurrent, setCheckRecurrent] = useState<boolean>(false)
  const [recurrenceTime, setRecurrenceTime] = useState<number>(1)
  const [font, setFont] = useState<String>()

async function getData(){
  const card = await api.get('/expenses/'+itemId)
  setName(card.data.name)
  setValue(card.data.value)
  setDescription(card.data.description)
  setDate(card.data.date)
  setFont(card.data.font)
  setRecurrenceTime(card.data.recurrence_time)
  card.data.recurrent == "recurrent" ? setCheckRecurrent(true) : setCheckRecurrent(false)
}

useEffect(() => {
  if(isEdit){
    getData()
  }
}, [openModal]);



  function handleCancel(){
    setOpenModal(false)
  }

  function handleChangeCheckRecurrent(check: boolean){
    setCheckRecurrent(check)
    check ? setRecurrent('recurrent') : setRecurrent('eventual')
    !check && setRecurrenceTime(1)
  }
  
  function handleAddItem(){
    type === 'entry-balance' ? api.post('/entries', {name, description, value, date, recurrent, recurrence_time: recurrenceTime, font, user_id: Number(localStorage.getItem('@minha-carteira:userId'))})
                                        .then((e)=>{alert('Entrada registrada com sucesso')
                                        setOpenModal(false)
                                      })
                                            .catch((e)=> alert(e))
    :
    api.post('/expenses', {name, description, value, date, recurrent, recurrence_time: recurrenceTime, font, user_id: Number(localStorage.getItem('@minha-carteira:userId'))})
        .then((e)=>{alert('Saída registrada com sucesso')
        setOpenModal(false)
      })
            .catch((e)=> alert(e))
  }

  function handleDeleteItem(){
    type === 'entry-balance' ? api.delete('/entries/'+itemId)
                                        .then((e)=>{alert('Entrada excluída com sucesso')
                                        setOpenModal(false)
                                      })
                                            .catch((e)=> alert(e))
    :
    api.delete('/expenses/'+itemId)
        .then((e)=>{alert('Saída excluída com sucesso')
        setOpenModal(false)
      })
            .catch((e)=> alert(e))
  }


  function handleEditItem(){
    type === 'entry-balance' ? api.put('/entries', {name, description, value, date, recurrent, recurrence_time: recurrenceTime, font, user_id: Number(localStorage.getItem('@minha-carteira:userId'))})
                                        .then((e)=>{alert('Entrada registrada com sucesso')         
                                        setOpenModal(false)
                                      })
                                            .catch((e)=> alert(e))
    :
    api.put('/expenses/'+itemId, {name, description, value, date, recurrent, recurrence_time: recurrenceTime, font, user_id: Number(localStorage.getItem('@minha-carteira:userId'))})
        .then((e)=>{alert('Saída registrada com sucesso')
         setOpenModal(false)
        })
            .catch((e)=> alert(e))
  }
  
  return (
    <div>
      <Dialog open={openModal}>
      {type === 'entry-balance' ?  <DialogTitle>Entrada</DialogTitle> 
      : 
      <DialogTitle>Gasto</DialogTitle>}
        <DialogContent>
        {type === 'entry-balance' ? <DialogContentText>
            Cadastro de nova entrada
          </DialogContentText> 
          : 
          <DialogContentText>
            Cadastro de novo gasto
          </DialogContentText>}
          <Label>Nome</Label>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e)=>setName(e.target.value)}
            value={name}
            required
          />
          <Label>Descrição</Label>
          <TextField
            autoFocus
            margin="dense"
            id="description"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e)=>setDescription(e.target.value)}
            value={description}
          />
          <Label>Valor</Label>
          <TextField
            autoFocus
            margin="dense"
            id="value"
            type="number"
            fullWidth
            variant="standard"
            onChange={(e)=>setValue(Number(e.target.value))}
            value={value}
            required
          />
          <Label>Data</Label>
          <TextField
            autoFocus
            margin="dense"
            id="date"
            type="date"
            fullWidth
            variant="standard"
            onChange={(e)=>setDate(e.target.value)}
            value={date}
            required
          />
          <FormControlLabel 
            control={<Checkbox checked={checkRecurrent} onChange={()=>handleChangeCheckRecurrent(!checkRecurrent)}/>} 
            label="Item recorrente" 
          />
          {checkRecurrent && <TextField
            autoFocus
            margin="dense"
            id="recurrenceTime"
            label="Tempo de recorrência"
            type="number"
            fullWidth
            variant="standard"
            onChange={(e)=>setRecurrenceTime(Number(e.target.value))}
            value={recurrenceTime}
          />}
          <TextField
            autoFocus
            margin="dense"
            id="font"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e)=>setFont(e.target.value)}
            value={font}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancelar</Button>
          {isEdit ? <><Button onClick={handleDeleteItem}>Excluir</Button><Button onClick={handleEditItem}>Salvar</Button></>: <Button onClick={handleAddItem}>Adicionar</Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
}