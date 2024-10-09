import { Alert, AlertDescription, AlertTitle } from 'ui/alert'
import { TriangleAlert } from 'lucide-react'
import { Button } from 'ui/button'

interface FallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

const Fallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <main className="container flex h-full flex-col items-center justify-center gap-4">
      <Alert variant="destructive">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
      <Button variant="colorful" onClick={() => resetErrorBoundary()}>
        Try again
      </Button>
    </main>
  )
}

export default Fallback
