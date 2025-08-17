// 通用错误边界高阶组件
// ================= 导入区 =================
// ...existing code...

// ================= 组件实现 =================
// ...existing code...
class ErrorBoundary extends React.Component<{ fallback?: React.ReactNode; children?: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback?: React.ReactNode; children?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, info: any) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('UI组件错误:', error, info);
    }
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div style={{color:'#f00'}}>组件加载失败</div>;
    }
    return this.props.children;
  }
}

function withErrorBoundary<T>(Component: React.ComponentType<T>, fallback?: React.ReactNode) {
  return function Wrapper(props: T) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextareaBase = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
TextareaBase.displayName = "Textarea"
const Textarea = withErrorBoundary(TextareaBase);
export { Textarea }
