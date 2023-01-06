import { SubmitHandler, useForm } from 'react-hook-form'

interface EditNoteFormInput {
  title: string
  content: string
}

type Props = {
  title?: string
  content?: string
}

function EditNote({ title = '', content = '' }: Props) {
  const { register, handleSubmit } = useForm<EditNoteFormInput>()
  const onSubmit: SubmitHandler<EditNoteFormInput> = (data) => console.log(data)

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
          <input type={'submit'} className="btn" value={'Save'} />
        </div>
      </div>
      <div className="flex flex-1">
        <textarea
          defaultValue={content}
          {...register('content')}
          className="textarea flex-1"
        />
      </div>
    </form>
  )
}

export default EditNote
