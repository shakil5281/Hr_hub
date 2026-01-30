"use client"

import { IconUserCircle, IconMail, IconPhone, IconMapPin, IconBuilding } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
    return (
        <div className="container mx-auto max-w-4xl py-6 space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Profile Card */}
                <Card className="w-full md:w-1/3">
                    <CardHeader className="text-center">
                        <div className="mx-auto relative">
                            <Avatar className="h-24 w-24 mb-4 border-4 border-background shadow-xl">
                                <AvatarImage src="/avatars/shadcn.jpg" alt="User" />
                                <AvatarFallback className="text-2xl">SA</AvatarFallback>
                            </Avatar>
                            <Badge className="absolute bottom-4 right-0" variant="default">Active</Badge>
                        </div>
                        <CardTitle className="text-2xl">Shakil Ahmed</CardTitle>
                        <CardDescription>System Administrator</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <IconMail className="h-4 w-4" />
                            <span>admin@hrhub.com</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <IconPhone className="h-4 w-4" />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <IconMapPin className="h-4 w-4" />
                            <span>New York, USA</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <IconBuilding className="h-4 w-4" />
                            <span>IT Department</span>
                        </div>
                        <Separator />
                        <div className="text-xs text-muted-foreground">
                            Member since: Jan 2024
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Details */}
                <Card className="w-full md:w-2/3">
                    <CardHeader>
                        <CardTitle>Edit Profile</CardTitle>
                        <CardDescription>Update your personal information and preferences.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" defaultValue="Shakil" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" defaultValue="Ahmed" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue="admin@hrhub.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Input id="bio" defaultValue="Senior System Administrator managing HR Hub." />
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button>Save Changes</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
