"use client";

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { UploadCloud, Copy, Check, Loader2, WandSparkles, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAiCaption } from '@/app/actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';

type AiResult = {
  caption: string;
  hashtags: string[];
};

export function CaptionGenerator() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<'caption' | 'hashtags' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const uploadPlaceholder = PlaceHolderImages.find(p => p.id === 'upload-area');

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAiResult(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleGenerateClick = async () => {
    if (!imageDataUri) {
      toast({
        title: 'Error',
        description: 'Please upload an image first.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAiResult(null);
    
    try {
      const result = await getAiCaption(imageDataUri);
      setAiResult(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Generation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'caption' | 'hashtags') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      toast({ title: 'Copied to clipboard!', style: { background: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))', border: 'hsl(var(--accent))' } });
      setTimeout(() => setCopied(null), 2000);
    }, () => {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy text to clipboard.',
        variant: 'destructive',
      });
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-xl rounded-2xl overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="p-6 md:p-8 bg-card flex flex-col justify-between">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
            />
            {imagePreview ? (
              <div className="w-full aspect-square relative rounded-xl overflow-hidden group shadow-md">
                <Image
                  src={imagePreview}
                  alt="Marketing photo preview"
                  fill
                  className="object-cover"
                />
                <div 
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handleUploadClick}
                >
                  <div className="text-center text-white">
                    <UploadCloud className="w-10 h-10 mx-auto" />
                    <p className="mt-2 font-semibold">Change Photo</p>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="w-full aspect-square rounded-xl flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden group bg-secondary"
                onClick={handleUploadClick}
              >
                {uploadPlaceholder ? (
                  <Image
                    src={uploadPlaceholder.imageUrl}
                    alt={uploadPlaceholder.description}
                    fill
                    className="object-cover w-full h-full opacity-50 group-hover:opacity-60 transition-opacity"
                    data-ai-hint={uploadPlaceholder.imageHint}
                    priority
                  />
                ) : <Skeleton className="w-full h-full" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent flex flex-col items-center justify-center p-6 text-white text-center">
                    <div className="relative z-10 p-4 rounded-full bg-black/20 backdrop-blur-sm">
                        <UploadCloud className="w-10 h-10" />
                    </div>
                    <p className="font-bold text-lg mt-4">Upload a Photo</p>
                    <p className="text-sm opacity-80">Click here to begin</p>
                </div>
              </div>
            )}
          </div>
           <Button
            onClick={handleGenerateClick}
            disabled={isLoading || !imagePreview}
            className="w-full mt-6 text-lg py-6"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
               <>
                <WandSparkles className="mr-2 h-5 w-5" />
                Generate Caption & Hashtags
              </>
            )}
          </Button>
        </div>

        <div className="p-6 md:p-8 flex flex-col bg-secondary/30">
           <h2 className="text-2xl font-bold font-headline flex items-center mb-4">
                <WandSparkles className="mr-3 h-6 w-6 text-accent"/>
                AI Generated Content
           </h2>
           <Separator className="mb-6"/>
           <div className="flex-grow space-y-6">
              {isLoading ? (
                <div className="space-y-6 animate-pulse">
                    <div>
                        <Skeleton className="h-6 w-1/3 mb-3" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                     <div>
                        <Skeleton className="h-6 w-1/4 mb-3" />
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-8 w-20 rounded-full" />
                            <Skeleton className="h-8 w-24 rounded-full" />
                            <Skeleton className="h-8 w-16 rounded-full" />
                            <Skeleton className="h-8 w-28 rounded-full" />
                        </div>
                    </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-destructive-foreground bg-destructive/90 p-6 rounded-xl text-center">
                        <p className="font-bold">Oops! Something went wrong.</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                </div>
              ) : aiResult ? (
                 <>
                    <div className="space-y-2">
                        <Label htmlFor="caption" className="text-lg font-semibold flex items-center">Caption</Label>
                        <div className="relative">
                            <Textarea
                                id="caption"
                                value={aiResult.caption}
                                onChange={(e) => setAiResult({ ...aiResult, caption: e.target.value })}
                                className="min-h-[150px] text-base bg-card"
                                readOnly={isLoading}
                            />
                             <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-muted-foreground hover:text-primary"
                                onClick={() => copyToClipboard(aiResult.caption, 'caption')}
                             >
                                {copied === 'caption' ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                             </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-lg font-semibold flex items-center">
                          <Hash className="w-5 h-5 mr-2" />
                          Hashtags
                        </Label>
                        <div className="relative p-4 border rounded-xl bg-card">
                           <div className="flex flex-wrap gap-2">
                            {aiResult.hashtags.map((tag, i) => (
                                <Badge key={i} variant="secondary" className="text-base py-1 px-3 cursor-pointer hover:bg-primary/20">{tag}</Badge>
                            ))}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-muted-foreground hover:text-primary"
                                onClick={() => copyToClipboard(aiResult.hashtags.join(' '), 'hashtags')}
                            >
                               {copied === 'hashtags' ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                 </>
              ) : (
                <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full rounded-xl bg-background/50 border-2 border-dashed p-8">
                    <p className="text-lg font-medium">Your generated content will appear here.</p>
                    <p className="mt-1">Upload an image and click "Generate" to start!</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </Card>
  );
}
