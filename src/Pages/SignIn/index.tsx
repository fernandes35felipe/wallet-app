import React, {useState} from 'react'
import { Container, Logo, Form, FormTitle} from './styles'
import logoImg from '../../assets/logo.svg'
import Input from '../../Components/Input'
import Button from '../../Components/Button'
import { useAuth } from '../../hooks/auth'

const SignIn: React.FC = () =>{
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const { signIn } = useAuth()

    return (
        <Container>
            <Logo>
                <img src={logoImg} alt='Minha Carteira' />
                <h2>Minha Carteira</h2>
            </Logo>

            <Form>
                <FormTitle>
                    Entrar
                </FormTitle>
                <Input required type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
                <Input required type='password' placeholder='Senha' onChange={(e) => setPassword(e.target.value)}/>
                <Button type={'submit'} onClick={(e)=> {signIn(email, password)}}>Acessar</Button>
                <a href={"/newUser"}>Novo usuário? clique aqui</a>
            </Form>
        </Container>
    )
}

export default SignIn