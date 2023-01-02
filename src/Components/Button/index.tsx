import React, {ButtonHTMLAttributes} from "react"
import { Container } from "./styles"

type IButtontProps = ButtonHTMLAttributes<HTMLButtonElement>

const Input: React.FC<IButtontProps> = ({children,...rest}) =>(
    <Container {...rest} > {children} </Container>
)

export default Input