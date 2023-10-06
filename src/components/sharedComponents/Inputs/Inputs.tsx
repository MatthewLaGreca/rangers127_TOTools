import _React, { forwardRef } from 'react'
import { TextField } from '@mui/material'

interface inputState {
    name: string,
    placeholder: string
    value: string
    onChange: (change: string) => void
}

export const InputText = forwardRef((props: inputState, ref) => {
    const { name, placeholder, value, onChange, ...otherProps } = props;

    return (
      <TextField
        variant="outlined"
        margin="normal"
        inputRef={ref}
        fullWidth
        type="text"
        id={name}
        name={name} // Set the name attribute
        placeholder={placeholder}
        value={value} // Set the value prop
        onChange={(e) => onChange(e.target.value)} // Handle onChange event
        {...otherProps} // Spread any additional props
      />
    )
})

export const InputPassword = forwardRef((props: inputState, ref) => {
    const { name, placeholder, value, onChange, ...otherProps } = props;

    return (
      <TextField
        variant="outlined"
        margin="normal"
        inputRef={ref}
        fullWidth
        type="password"
        id={name}
        name={name} // Set the name attribute
        placeholder={placeholder}
        value={value} // Set the value prop
        onChange={(e) => onChange(e.target.value)} // Handle onChange event
        {...otherProps} // Spread any additional props
      />
    )
})