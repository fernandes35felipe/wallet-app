import React from 'react'
import { urlToHttpOptions } from 'url';
import {Container, } from './styles'

interface ISelectInputProps{
    options: {
        value?: string | number;
        label?: string | number;
        name?: string | number;
        tagname?: string | number;
    }[],
    onChange(event: React.ChangeEvent<HTMLSelectElement>): void | undefined
    defaultValue?: string|number
}

const SelectInput: React.FC<ISelectInputProps> = ({options, onChange, defaultValue}) =>{

    return (
        <Container>
           <select onChange={onChange} defaultValue={defaultValue}>
            {
                options.map(option => (
                <option value={option.tagname ? option.tagname : option.value} key={option.value}>
                    {option.tagname ? option.tagname : option.label}
                </option>
                ))   
            }
                
           </select>
        </Container>
    )
}

export default SelectInput