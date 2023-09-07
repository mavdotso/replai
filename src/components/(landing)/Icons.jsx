import { Rabbit, Sparkles, Lightbulb } from 'lucide-react';

export default function Icons() {
    return (
        <section className="container max-w-7xl flex mx-auto gap-24 py-48 items-center justify-between">
            <div className="max-w-md space-y-6">
                <Rabbit />
                <h4 className="text-xl font-bold">Fast</h4>
                <p className="text-gray-600">Unlock substantial time savings every week by efficiently managing and expanding your professional network</p>
            </div>
            <div className="max-w-md space-y-6">
                <Sparkles />
                <h4 className="text-xl font-bold">Effective</h4>
                <p className="text-gray-600">Enhance your online presence and expand your reach by engaging with audiences with diverse backgrounds with just a simple click</p>
            </div>
            <div className="max-w-md space-y-6">
                <Lightbulb />
                <h4 className="text-xl font-bold">Creative</h4>
                <p className="text-gray-600">Never find yourself at a loss for words or run out of fresh and engaging ideas about what to say, regardless of the context</p>
            </div>
        </section>
    );
}
