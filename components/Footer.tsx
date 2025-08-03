import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-background text-foreground rounded-lg shadow-sm">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link href="/" className="text-2xl md:text-3xl font-bold tracking-wide" style={{ fontFamily: "RockSalt" }}>
                        Curious <span className="text-blue-500">Life.</span>
                    </Link>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        <li>
                            <Link href="/" className="hover:underline me-4 md:me-6">Home</Link>
                        </li>
                        <li>
                            <Link href="/bloglist" className="hover:underline me-4 md:me-6">Blogs</Link>
                        </li>
                        <li>
                            <Link href="/saved" className="hover:underline me-4 md:me-6">Saved</Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:underline">Contact</Link>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    © 2023 <Link href="/" className="hover:underline">Kirubel</Link>. All Rights Reserved.
                </span>
            </div>
        </footer>
    )
}
