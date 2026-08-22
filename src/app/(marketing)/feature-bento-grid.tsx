import Image from 'next/image';

import { BentoGrid } from '@/components/ui/bento-grid';
import { cn } from '@/lib/utils';

export const FEATURE_IMAGES = [
  '/images/eco-papers/fine-art-matte.png',
  '/images/atelier/process-3.png',
  '/images/layout-guidelines/grid-collage.png',
  '/images/shipping-policy/box.png',
];

export const FEATURE_SPAN_CLASSES = [
  'col-span-3 lg:col-span-1',
  'col-span-3 lg:col-span-2',
  'col-span-3 lg:col-span-2',
  'col-span-3 lg:col-span-1',
];

interface FeatureBentoGridItem {
  title: string;
  description: string;
}

interface FeatureBentoGridProps {
  items: readonly FeatureBentoGridItem[];
}

export function FeatureBentoGrid({ items }: FeatureBentoGridProps) {
  return (
    <BentoGrid>
      {items.map((feature, index) => (
        <div
          key={feature.title}
          className={cn(
            'group relative flex flex-col justify-end overflow-hidden rounded-lg border border-border',
            FEATURE_SPAN_CLASSES[index],
          )}
        >
          <Image
            src={FEATURE_IMAGES[index] ?? '/images/eco-papers/fine-art-matte.png'}
            alt=""
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-inverted/90 via-inverted/20 to-transparent" />
          <div className="relative flex origin-bottom-left flex-col items-start gap-2 p-6 transition-transform duration-300 group-hover:scale-105">
            <h3 className="font-heading text-lg font-semibold text-inverted-foreground">
              {feature.title}
            </h3>
            <p className="text-[13px] text-inverted-foreground/80">{feature.description}</p>
          </div>
        </div>
      ))}
    </BentoGrid>
  );
}
