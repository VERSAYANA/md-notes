import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Editor, Viewer } from '@bytemd/react'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight-ssr'
import math from '@bytemd/plugin-math-ssr'
import breaks from '@bytemd/plugin-breaks'

interface EditNoteFormInput {
  title: string
  content: string
}

type Props = {
  title?: string
  content?: string
  isLoading?: boolean
  isSaving: boolean
  isPublic: boolean
  saveNote(title: string, content: string, isPublic: boolean): Promise<void>
}

const plugins = [gfm(), highlight(), math(), breaks()]

function EditNote({
  title = '',
  content = '',
  isPublic,
  isLoading = false,
  isSaving = false,
  saveNote,
}: Props) {
  const { register, handleSubmit } = useForm<EditNoteFormInput>()
  const [isPublicState, setIsPublicState] = useState(isPublic)
  const [contentInputValue, setContentInputValue] = useState('')

  const onSubmit: SubmitHandler<EditNoteFormInput> = (data) =>
    saveNote(data.title, data.content, isPublicState)

  useEffect(() => {
    setIsPublicState(isPublic)
  }, [isPublic])

  useEffect(() => {
    if (content.length > 0) {
      setContentInputValue(content)
    }
  }, [content])

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-2xl">Loading...</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-1 flex-col gap-4 md:gap-6"
    >
      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row">
          <input
            defaultValue={title}
            {...register('title', { required: true })}
            className="input-bordered input min-h-12 flex-1"
            placeholder="Title"
          />
          <div className="flex gap-4">
            <div className="btn-group">
              <button
                type="button"
                onClick={() => setIsPublicState(true)}
                className={`btn ${isPublicState ? 'btn-active' : ''}`}
              >
                Public
              </button>
              <button
                type="button"
                onClick={() => setIsPublicState(false)}
                className={`btn ${isPublicState ? '' : 'btn-active'}`}
              >
                Private
              </button>
            </div>
            <button
              type="submit"
              className={`btn-accent btn flex-1 ${isSaving ? 'loading' : ''}`}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="bytemd-container flex w-full flex-1 overflow-x-hidden">
        <Editor
          value={contentInputValue}
          plugins={plugins}
          onChange={(value) => {
            setContentInputValue(value)
          }}
        />
      </div>
    </form>
  )
}

export default EditNote
