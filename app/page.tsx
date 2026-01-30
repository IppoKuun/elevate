export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            {/* Navigation */}
            <nav className="flex justify-between items-center px-8 py-4 border-b border-slate-700">
                <h1 className="text-2xl font-bold">Ultimate IA SaaS</h1>
                <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg">
                    Get Started
                </button>
            </nav>

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center px-8 py-24 text-center">
                <h2 className="text-5xl font-bold mb-6">
                    AI-Powered Solutions for Your Business
                </h2>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl">
                    Leverage cutting-edge artificial intelligence to transform your workflow and boost productivity.
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-semibold mb-8">
                    Start Free Trial
                </button>
            </section>

            {/* Features Section */}
            <section className="px-8 py-16 bg-slate-800/50">
                <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="p-6 bg-slate-700 rounded-lg">
                        <h4 className="text-xl font-semibold mb-2">Fast & Reliable</h4>
                        <p className="text-slate-300">Lightning-quick responses powered by advanced AI models.</p>
                    </div>
                    <div className="p-6 bg-slate-700 rounded-lg">
                        <h4 className="text-xl font-semibold mb-2">Secure</h4>
                        <p className="text-slate-300">Your data is encrypted and protected with enterprise-grade security.</p>
                    </div>
                    <div className="p-6 bg-slate-700 rounded-lg">
                        <h4 className="text-xl font-semibold mb-2">Scalable</h4>
                        <p className="text-slate-300">Grows with your business without any limitations.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-700 py-8 px-8 text-center text-slate-400">
                <p>&copy; 2024 Ultimate IA SaaS. All rights reserved.</p>
            </footer>
        </div>
    );
}