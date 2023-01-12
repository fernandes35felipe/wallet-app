import React, {useState} from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Logo, Form, FormTitle} from './styles'
import logoImg from '../../assets/logo.svg'
import Input from '../../Components/Input'
import Button from '../../Components/Button'
import api from '../../services/api'

const NewUser: React.FC = () =>{
    const history = useHistory();
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    
    const handleNewUser = async (email: string, password: string, name: string, phone: string) =>{
        try{
            await api.post("/users", {name: name, email: email, password: password, phone:phone})

        }
        catch{
            alert('Não foi possível efetuar o cadastro. tente novamente')
        }
    }


    return (
        <Container>
            <Logo>
                <img src={logoImg} alt='Minha Carteira' />
                <h2>Minha Carteira</h2>
            </Logo>

            <Form onSubmit={(event)=> {event.preventDefault(); 
                                            handleNewUser(email, password, name, phone); 
                                            }}>
                <FormTitle>
                    Novo Usuário
                </FormTitle>
                <Input required type='text' placeholder='Nome completo' onChange={(e) => setName(e.target.value)}/>
                <Input required type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
                <Input required type='password' placeholder='Senha' onChange={(e) => setPassword(e.target.value)}/>
                <Input required type='phone' placeholder='Telefone' onChange={(e) => setPhone(e.target.value)}/>
                <Button type="submit">Cadastrar</Button>
            </Form>
        </Container>
    )
}

export default NewUser