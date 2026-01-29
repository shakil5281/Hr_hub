"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconBrandGoogle, IconLock, IconMail, IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    console.log("Login data:", data)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    toast.success("Welcome back! Redirecting...")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access your HR dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 gap-4">
            <Button
              variant="outline"
              className="w-full bg-background hover:bg-muted/50 transition-all duration-200"
              disabled={isLoading}
            >
              <IconBrandGoogle className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <IconMail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className={cn("pl-10", errors.email && "border-destructive")}
                  {...register("email")}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="text-sm font-medium text-primary hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <IconLock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className={cn("pl-10", errors.password && "border-destructive")}
                  {...register("password")}
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <IconLoader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Log in"
              )}
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="#" className="font-semibold text-primary hover:underline underline-offset-4">
              Contact HR
            </Link>
          </div>
        </CardContent>
      </Card>
      <p className="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </Link>.
      </p>
    </div>
  )
}
