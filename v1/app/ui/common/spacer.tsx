import React from 'react'

export default function Spacer ({space=8}:{space?: number | string}) {
    return (
      <div className={`mb-${space}`}></div>
    )
  }

