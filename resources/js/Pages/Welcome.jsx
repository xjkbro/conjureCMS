import { Button } from "@/shadcn/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/shadcn/ui/sheet";

import { Link, Head } from "@inertiajs/react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="text-3xl font-semibold">conjure</h1>
                <div>
                    {auth.user ? (
                        <>
                            <Button variant="link" asChild>
                                <Link href={route("dashboard")}>Dashboard</Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="link" asChild>
                                <Link href={route("login")}>Login</Link>
                            </Button>
                            <Button variant="link" asChild>
                                <Link href={route("register")}>Register</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
