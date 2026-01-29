"use client"

import * as React from "react"
import {
    IconUser,
    IconLock,
    IconMail,
    IconDeviceFloppy,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SettingsPage() {
    const [isLoading, setIsLoading] = React.useState(false)

    async function onProfileUpdate(event: React.FormEvent) {
        event.preventDefault()
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            toast.success("Profile updated successfully")
        }, 1000)
    }

    async function onPasswordUpdate(event: React.FormEvent) {
        event.preventDefault()
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success("Password updated successfully")
        }, 1000)
    }

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-5xl mx-auto w-full">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and set e-mail preferences.
                </p>
            </div>

            <Separator />

            <Tabs defaultValue="profile" className="flex flex-col md:grid md:grid-cols-[250px_1fr] gap-6 items-start">
                <TabsList className="flex flex-col h-auto items-stretch justify-start bg-transparent p-0 gap-1 w-full">
                    <TabsTrigger
                        value="profile"
                        className="justify-start gap-2 px-3 py-2 h-9 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium"
                    >
                        <IconUser className="size-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger
                        value="password"
                        className="justify-start gap-2 px-3 py-2 h-9 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium"
                    >
                        <IconLock className="size-4" />
                        Password
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1 w-full">
                    <TabsContent value="profile" className="m-0 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                                <CardDescription>
                                    Review and update your public profile information.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <form onSubmit={onProfileUpdate} className="space-y-6">
                                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                                        <div className="flex flex-col items-center gap-4">
                                            <Avatar className="size-32 border-4 border-muted">
                                                <AvatarImage src="/avatars/shadcn.jpg" alt="@shadcn" />
                                                <AvatarFallback className="text-4xl">CN</AvatarFallback>
                                            </Avatar>
                                            <Button variant="outline" size="sm" type="button" className="w-full">Change Avatar</Button>
                                        </div>
                                        <div className="flex-1 w-full space-y-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input id="name" defaultValue="Shadcn User" placeholder="Your name" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">Email</Label>
                                                <div className="relative">
                                                    <IconMail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input id="email" type="email" defaultValue="user@example.com" className="pl-9" placeholder="Email address" />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="bio">Bio</Label>
                                                <Input id="bio" placeholder="A brief description about yourself" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end border-t pt-6">
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading && <span className="mr-2 animate-spin">⏳</span>}
                                            <IconDeviceFloppy className="mr-2 size-4" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="password" className="m-0 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>
                                    Change your password to keep your account secure.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={onPasswordUpdate} className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="current-password">Current Password</Label>
                                        <Input id="current-password" type="password" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="new-password">New Password</Label>
                                        <Input id="new-password" type="password" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="confirm-password">Confirm Password</Label>
                                        <Input id="confirm-password" type="password" />
                                    </div>
                                    <div className="flex justify-end pt-4 border-t mt-6">
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading && <span className="mr-2 animate-spin">⏳</span>}
                                            Update Password
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
