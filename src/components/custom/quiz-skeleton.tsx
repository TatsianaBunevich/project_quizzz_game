import { Skeleton } from '@/components/ui/skeleton'

const QuizSkeleton = () => {
  return (
    <>
      <main className="container flex h-full flex-col justify-between">
        <div className="flex min-h-full flex-col">
          <div className="mb-2 flex">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="relative grid min-h-[calc(100vh-72px*2-40px*2-0.5rem*2)] items-start rounded-2xl border-0 bg-accent shadow-sm [filter:url(#gooey)] before:absolute before:-top-12 before:end-0 before:start-12 before:-z-10 before:h-16 before:border-inherit before:bg-inherit after:absolute after:-bottom-12 after:end-12 after:-z-10 after:h-16 after:w-[calc(100%-3rem)] after:border-inherit after:bg-inherit">
            <div className="p-6">
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
            <div className="grid auto-rows-fr gap-4 p-6 pt-0 sm:grid-cols-2 sm:pt-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full rounded-full" />
              ))}
            </div>
          </div>
          <Skeleton className="mt-2 h-10 w-10 self-end rounded-full" />
        </div>
      </main>
      <footer className="container flex justify-center gap-4 py-4 [&>*]:w-full md:[&>*]:w-1/5">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full rounded-full" />
        ))}
      </footer>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        className="absolute hidden"
      >
        <defs>
          <filter id="gooey">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
        1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0
        0 0 0 20 -10"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>
    </>
  )
}

export default QuizSkeleton
