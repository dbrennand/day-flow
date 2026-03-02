import ReactMarkdown from 'react-markdown'

interface TaskNotesProps {
  notes: string
}

export function TaskNotes({ notes }: TaskNotesProps) {
  return (
    <div className="prose prose-stone prose-sm max-w-none">
      <ReactMarkdown>{notes}</ReactMarkdown>
    </div>
  )
}
