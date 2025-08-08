"use server";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import * as q from "@/server/db/queries";

export async function createForumPost(input: { categoryId: number; title: string; content: string; tags?: string[]; attachments?: any[] }) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  return q.createForumPost(input);
}

export async function addForumComment(input: { postId: number; parentCommentId?: number | null; content: string }) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  return q.addForumComment(input);
}

export async function toggleLikeComment(commentId: number) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  return q.toggleLikeComment(commentId);
}

export async function reportContent(input: { targetType: "post" | "comment"; postId?: number; commentId?: number; reason: string }) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  return q.reportContent(input);
}

export async function sendDirectMessage(recipientUserId: number, content: string) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  return q.sendDirectMessage(recipientUserId, content);
}
