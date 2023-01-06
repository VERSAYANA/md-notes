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
  saveNote(title: string, content: string): Promise<void>
}

function EditNote({
  title = '',
  content = '',
  isLoading = false,
  isSaving = false,
  saveNote,
}: Props) {
  const { register, handleSubmit } = useForm<EditNoteFormInput>()
  const onSubmit: SubmitHandler<EditNoteFormInput> = (data) =>
    saveNote(data.title, data.content)

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
      className="flex w-full flex-1 flex-col gap-4"
    >
      <div className="flex gap-4">
        <div className="flex flex-1">
          <input
            defaultValue={title}
            {...register('title', { required: true })}
            className="input-bordered input flex-1"
            placeholder="Title"
          />
        </div>
        <div className="flex">
          <button className={`btn ${isSaving ? 'loading' : ''}`} type="submit">
            Save
          </button>
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
