import { Skeleton } from '@/components/ui/skeleton'

const QuizSkeleton = () => {
  return (
    <>
      <main className="container flex h-auto flex-col justify-between">
        <div className="relative md:h-[calc(100vh-2.5rem*2-1rem*4)]">
          <div className="absolute inset-x-2 top-2">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="item-mask-top ml-8 h-14 w-[calc(100%-2rem)] bg-muted/50" />
          <div className="mb-6 flex flex-col overflow-hidden rounded-3xl rounded-se-none border-0 shadow-none md:h-[calc(100%-3.5rem-1.5rem)]">
            <div className="flex flex-col space-y-1.5 border-b bg-muted/50 p-6">
              <Skeleton className="h-6 w-full rounded-full" />
              <Skeleton className="h-6 w-3/4 rounded-full" />
            </div>
            <div className="flex-1 border-x p-6 pt-0">
              <div className="grid auto-rows-fr gap-4 pt-6 [counter-reset:els] sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-14 w-full rounded-full" />
                ))}
              </div>
            </div>
            <div className="item-mask-bottom flex items-center border-t bg-muted/50 p-6 pb-20 pt-0"></div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
      </main>
      <footer className="container flex justify-center gap-4 py-4 [&>*]:w-full md:[&>*]:w-1/5">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full rounded-full" />
        ))}
      </footer>
    </>
  )
}

export default QuizSkeleton
