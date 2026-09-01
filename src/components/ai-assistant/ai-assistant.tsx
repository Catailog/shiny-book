'use client';

import { useState } from 'react';

import { Sparkles } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useT } from '@/hooks/use-t';

import { AiChatPanel } from './ai-chat-panel';

export function AiAssistant() {
  const t = useT();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <SheetTrigger
              aria-label={t.ai.triggerLabel}
              className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            />
          }
        >
          <Sparkles aria-hidden="true" className="size-5" />
        </TooltipTrigger>
        <TooltipContent>{t.ai.triggerLabel}</TooltipContent>
      </Tooltip>

      <SheetContent side="right" title={t.ai.panelTitle} className="w-full gap-3 sm:max-w-md">
        <div className="space-y-1 pr-8">
          <h2 className="font-heading text-base font-semibold text-foreground">
            {t.ai.panelTitle}
          </h2>
          <p className="text-xs text-muted-foreground">{t.ai.panelDescription}</p>
        </div>
        <AiChatPanel />
      </SheetContent>
    </Sheet>
  );
}
