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

            <div class="bg-red-300 min-h-screen  flex items-center w-screen">
                <div class="mx-auto min-w-5xl max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8 w-screen">
                    <div class="relative isolate overflow-hidden bg-red-700 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
                        <svg
                            viewBox="0 0 1024 1024"
                            class="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
                            aria-hidden="true"
                        >
                            <circle
                                cx="512"
                                cy="512"
                                r="512"
                                fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                                fill-opacity="0.7"
                            />
                            <defs>
                                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                                    <stop stop-color="#7775D6" />
                                    <stop offset="1" stop-color="#E935C1" />
                                </radialGradient>
                            </defs>
                        </svg>
                        <div class="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                            <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                <span className="text-black">conjureCMS</span>
                                <br />
                                Manifest your blog with ease.
                            </h2>
                            <p class="mt-6 text-lg leading-8 text-gray-300">
                                you can get more famous by using this app called
                                Youtube.
                            </p>
                            <div class="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                                <Link
                                    href={route("login")}
                                    class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    Get Started
                                </Link>

                                <Link href={route("login")}>Login</Link>
                            </div>
                        </div>
                        <div class="relative mt-16 h-80 lg:mt-8">
                            <img
                                class="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                                src="https://i.redd.it/l33ka0w3f3m21.jpg"
                                alt="App screenshot"
                                width="1824"
                                height="1080"
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="flex flex-col justify-center items-center h-screen">
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
            </div> */}
        </>
    );
}
