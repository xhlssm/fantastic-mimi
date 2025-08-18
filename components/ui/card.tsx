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

const CardBase = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-gray-600 bg-gray-800 text-white shadow",
      className
    )}
    {...props}
  />
))
CardBase.displayName = "Card"
const Card = withErrorBoundary(CardBase);

const CardHeaderBase = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeaderBase.displayName = "CardHeader"
const CardHeader = withErrorBoundary(CardHeaderBase);

const CardTitleBase = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitleBase.displayName = "CardTitle"
const CardTitle = withErrorBoundary(CardTitleBase);

const CardDescriptionBase = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-400", className)}
    {...props}
  />
))
CardDescriptionBase.displayName = "CardDescription"
const CardDescription = withErrorBoundary(CardDescriptionBase);

const CardContentBase = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContentBase.displayName = "CardContent"
const CardContent = withErrorBoundary(CardContentBase);

const CardFooterBase = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooterBase.displayName = "CardFooter"
const CardFooter = withErrorBoundary(CardFooterBase);

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
