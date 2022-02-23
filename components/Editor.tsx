import {Slate,withReact,Editable } from 'slate-react'
import { createEditor } from 'slate'
import { useState } from 'react'
import TextEditor from './TextEditor'

export default function Editor() {
  return (
  <div className='editor'>
    <div className='Ed-01'>
      <h1>
        John Doe Interview
      </h1>
    </div>
    <TextEditor />
    </div>
  )
}
