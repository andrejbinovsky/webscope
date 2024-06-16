import { cn } from '@/lib/utils'

interface SpinnerProps {
  className?: string
  isFullScreen?: boolean
  size?: number
  width?: number
}

const Spinner = ({ className = '', size = 40, width = 4, isFullScreen = false }: SpinnerProps) => {
  return (
    <div
      className={cn(
        isFullScreen && 'fixed inset-0 z-[9999] h-screen w-full bg-red-600 backdrop-blur',
        'flex h-screen flex-col items-center justify-center space-y-4',
        className
      )}
    >
      <div
        style={{
          height: `${size}px`,
          width: `${size}px`,
          borderWidth: `${width}px`
        }}
        className={cn(
          'border-lime inline-block animate-spin rounded-full border-slate-800 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
        )}
        role='status'
      ></div>
    </div>
  )
}

export default Spinner
