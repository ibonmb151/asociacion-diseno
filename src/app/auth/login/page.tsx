import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { LoginPageContent } from "./login-page-content"

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-bg">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}
