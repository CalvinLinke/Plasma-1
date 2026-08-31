import { getMailboxUpn, graphFetch } from "@/lib/graph-auth";

export type GraphMessage = {
  id: string;
  subject: string;
  bodyHtml: string;
  receivedDateTime: string;
  isRead: boolean;
};

type GraphMessageList = {
  value?: Array<{
    id: string;
    subject?: string;
    body?: { contentType?: string; content?: string };
    receivedDateTime?: string;
    isRead?: boolean;
  }>;
};

export async function listUnreadMessages(limit = 25): Promise<GraphMessage[]> {
  const mailbox = encodeURIComponent(getMailboxUpn());
  const query = new URLSearchParams({
    $filter: "isRead eq false",
    $select: "id,subject,body,receivedDateTime,isRead",
    $orderby: "receivedDateTime desc",
    $top: String(limit),
  });

  const res = await graphFetch(`/users/${mailbox}/messages?${query.toString()}`);
  if (!res.ok) {
    throw new Error(`Graph-Messages fehlgeschlagen (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as GraphMessageList;
  return (data.value ?? []).map((message) => ({
    id: message.id,
    subject: message.subject ?? "",
    bodyHtml: message.body?.content ?? "",
    receivedDateTime: message.receivedDateTime ?? new Date().toISOString(),
    isRead: message.isRead ?? false,
  }));
}

export async function markMessageAsRead(messageId: string): Promise<void> {
  const mailbox = encodeURIComponent(getMailboxUpn());
  const res = await graphFetch(`/users/${mailbox}/messages/${messageId}`, {
    method: "PATCH",
    body: JSON.stringify({ isRead: true }),
  });

  if (!res.ok) {
    throw new Error(`Graph-markRead fehlgeschlagen (${res.status}): ${await res.text()}`);
  }
}
