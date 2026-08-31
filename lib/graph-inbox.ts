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

/** Letzte Mails im Postfach — unabhängig vom Gelesen-Status. */
export async function listRecentMessages(limit = 50): Promise<GraphMessage[]> {
  const mailbox = encodeURIComponent(getMailboxUpn());
  const query = new URLSearchParams({
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
