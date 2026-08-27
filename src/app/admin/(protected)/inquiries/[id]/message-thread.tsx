'use client';

import { useState, useTransition } from 'react';

import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { INQUIRY_MESSAGE_AUTHOR } from '@/constants/inquiry';
import type { Tables } from '@/lib/db/database.types';
import { formatDateTime } from '@/lib/format-date';
import { defaultLocale, locales } from '@/locales';

import { deleteAdminMessage, updateAdminMessage } from '../actions';

interface MessageThreadProps {
  inquiryId: string;
  messages: Tables<'inquiry_messages'>[];
  currentAdminId: string;
  adminAuthorEmails: Record<string, string>;
}

export function MessageThread({
  inquiryId,
  messages,
  currentAdminId,
  adminAuthorEmails,
}: MessageThreadProps) {
  const t = locales[defaultLocale];
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [isPending, startTransition] = useTransition();

  function startEditing(message: Tables<'inquiry_messages'>) {
    setEditingMessageId(message.id);
    setEditingContent(message.content);
  }

  function cancelEditing() {
    setEditingMessageId(null);
    setEditingContent('');
  }

  function handleSaveEdit(messageId: string) {
    startTransition(async () => {
      const result = await updateAdminMessage(messageId, inquiryId, { content: editingContent });
      if (result) {
        toast.error(t.admin.inquiries.errors[result.errorCode]);
        return;
      }
      cancelEditing();
    });
  }

  function handleDelete(messageId: string) {
    startTransition(async () => {
      const result = await deleteAdminMessage(messageId, inquiryId);
      if (result) {
        toast.error(t.admin.inquiries.errors[result.errorCode]);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => {
        const isAdminMessage = message.author_type === INQUIRY_MESSAGE_AUTHOR.ADMIN;
        const isOwnMessage = isAdminMessage && message.author_id === currentAdminId;
        const isEditing = editingMessageId === message.id;
        const adminAuthorEmail = message.author_id
          ? adminAuthorEmails[message.author_id]
          : undefined;

        return (
          <div
            key={message.id}
            className={
              isAdminMessage
                ? 'flex flex-col gap-2 rounded-lg border border-primary/30 bg-primary-soft/40 p-4'
                : 'flex flex-col gap-2 rounded-lg border border-border bg-muted p-4'
            }
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-muted-foreground">
                {isAdminMessage
                  ? (adminAuthorEmail ?? t.admin.inquiries.detail.adminAuthorLabel)
                  : t.admin.inquiries.detail.consumerAuthorLabel}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(message.created_at)}
                </span>
                {isOwnMessage && !isEditing ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(message)}
                      className="text-xs font-semibold text-foreground hover:underline"
                    >
                      {t.admin.inquiries.detail.editButton}
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <button
                            type="button"
                            className="text-xs font-semibold text-destructive hover:underline"
                          />
                        }
                      >
                        {t.admin.inquiries.detail.deleteButton}
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t.admin.inquiries.detail.deleteConfirmTitle}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t.admin.inquiries.detail.deleteConfirmDescription}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {t.admin.inquiries.detail.deleteCancelButton}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            disabled={isPending}
                            onClick={() => handleDelete(message.id)}
                          >
                            {t.admin.inquiries.detail.deleteConfirmButton}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ) : null}
              </div>
            </div>
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <textarea
                  rows={4}
                  value={editingContent}
                  onChange={(event) => setEditingContent(event.target.value)}
                  className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={cancelEditing}>
                    {t.admin.inquiries.detail.editCancelButton}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleSaveEdit(message.id)}
                  >
                    {t.admin.inquiries.detail.editSaveButton}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm [overflow-wrap:anywhere] break-words whitespace-pre-wrap text-foreground">
                {message.content}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
