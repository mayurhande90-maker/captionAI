import { CaptionGenerator } from "@/components/caption-generator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-headline tracking-tight text-primary">
          CaptionAI
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg sm:text-xl text-foreground/80">
          Instantly generate captivating captions and hashtags for your marketing photos.
        </p>
      </div>
      <CaptionGenerator />
    </main>
  );
}
