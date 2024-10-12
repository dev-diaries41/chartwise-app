import React from 'react'

interface InputErrorProps{
    state: any, 
    id: string;
    inputName: string
}

export default function InputError({state, id, inputName}: InputErrorProps) {
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
    {state?.errors?.[inputName] &&
      state.errors[inputName]?.map((error: string) => (
        <p className="mt-2 text-sm text-red-500" key={error}>
          {error}
        </p>
      ))}
  </div>
  )
}