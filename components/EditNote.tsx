import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

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
  const onSubmit: SubmitHandler<EditNoteFormInput> = (data) =>
    saveNote(data.title, data.content, isPublicState)

  useEffect(() => {
    setIsPublicState(isPublic)
  }, [isPublic])

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
      className="flex w-full flex-1 flex-col gap-4 md:gap-8"
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
              className={`btn btn-accent flex-1 ${isSaving ? 'loading' : ''}`}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        <textarea
          defaultValue={content}
          {...register('content')}
          className="textarea flex-1 resize-none"
        />
      </div>
    </form>
  )
}

export default EditNote
