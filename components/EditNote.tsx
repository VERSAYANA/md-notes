import { useEffect, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Editor } from '@bytemd/react'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight-ssr'
import math from '@bytemd/plugin-math-ssr'
import breaks from '@bytemd/plugin-breaks'
import { formatTagString, tagsToSet } from '../utils/functions'
import { X } from 'react-feather'

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
  tags?: {
    name: string
  }[]
  saveNote(
    title: string,
    content: string,
    isPublic: boolean,
    tags: string[]
  ): Promise<void>
}

const plugins = [
  gfm(),
  highlight(),
  math({
    katexOptions: {
      output: 'mathml',
    },
  }),
  breaks(),
]

function EditNote({
  title = '',
  content = '',
  isPublic,
  isLoading = false,
  isSaving = false,
  saveNote,
  tags = [],
}: Props) {
  const { register, handleSubmit } = useForm<EditNoteFormInput>()
  const [isPublicState, setIsPublicState] = useState(isPublic)
  const [contentInputValue, setContentInputValue] = useState('')
  const [isTagInputOpen, setIsTagInputOpen] = useState(false)
  const [tagInputValue, setTagInputValue] = useState('')
  const [tagsState, setTagsState] = useState<Set<string>>(new Set([]))
  const tagInputRef = useRef<HTMLInputElement | null>(null)

  const onSubmit: SubmitHandler<EditNoteFormInput> = (data) =>
    saveNote(
      data.title,
      contentInputValue,
      isPublicState,
      Array.from(tagsState)
    )

  useEffect(() => {
    setIsPublicState(isPublic)
  }, [isPublic])

  useEffect(() => {
    if (content.length > 0) {
      setContentInputValue(content)
    }
  }, [content])

  useEffect(() => {
    if (tags.length > 0) {
      setTagsState(tagsToSet(tags))
    }
  }, [tags])

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
              className={`btn btn-accent flex-1 ${isSaving ? 'loading' : ''}`}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* <div className="flex">
        <input className="input-bordered input" placeholder="tag" />
      </div> */}

      <div className="bytemd-container flex w-full flex-1 overflow-x-hidden">
        <Editor
          value={contentInputValue}
          plugins={plugins}
          onChange={(value) => {
            setContentInputValue(value)
          }}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <div
          className={`flex ${
            isTagInputOpen ? 'w-full' : 'w-auto'
          } rounded-full bg-base-100 shadow-sm sm:w-auto`}
        >
          <input
            value={tagInputValue}
            ref={tagInputRef}
            onChange={(e) => setTagInputValue(e.target.value)}
            className={`input w-full rounded-l-full outline-none sm:w-48 ${
              !isTagInputOpen && 'hidden'
            }`}
            maxLength={40}
          />
          <button
            onClick={() => {
              if (tagInputValue) {
                if (tagsState.size < 10) {
                  setTagsState(
                    new Set([
                      ...Array.from(tagsState),
                      formatTagString(tagInputValue),
                    ])
                  )
                  setTagInputValue('')
                }
              } else {
                setIsTagInputOpen(!isTagInputOpen)
                if (isTagInputOpen) {
                  tagInputRef.current?.focus()
                }
              }
            }}
            type="button"
            className="btn btn-secondary rounded-full py-2 px-4 normal-case shadow-sm"
          >
            Add new tag
          </button>
        </div>
        {Array.from(tagsState).map((tag) => (
          <div
            className="flex items-center gap-x-2 rounded-full bg-base-100 py-2 px-3 shadow-sm"
            key={tag}
          >
            <X
              onClick={() => {
                const temp = new Set(tagsState)
                temp.delete(tag)
                setTagsState(new Set(temp))
              }}
              className="cursor-pointer"
            />
            <span>{tag}</span>
          </div>
        ))}
        {/* {Array.from(tagsState).map((tag) => (
          <div
            className="flex items-center rounded-full bg-base-100 py-2 px-3 shadow-sm"
            key={tag}
          >
            {tag}
          </div>
        ))} */}
      </div>
    </form>
  )
}

export default EditNote
