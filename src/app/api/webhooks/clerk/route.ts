import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createUserFromClerk, deleteUserFromClerk } from '@/server/db/userQueries'

export async function POST(req: Request) {
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error("Error: Missing CLERK_WEBHOOK_SECRET env variable");
    return new Response("Error: Missing webhook secret", {
      status: 500,
    });
  }

  const wh = new Webhook(webhookSecret);
  
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", {
      status: 400,
    });
  }

  const eventType = evt.type;
  console.log(`Webhook received: ${eventType}`);
  
  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const userData = {
        clerkUserId: evt.data.id,
        email: evt.data.email_addresses?.[0]?.email_address || '',
        name: `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim() || evt.data.username || null,
      };
      
      console.log(`Processing user data for ${userData.clerkUserId}:`, userData);
      
      await createUserFromClerk(userData);
      console.log(`User ${userData.clerkUserId} successfully processed`);
    }
    
    if (eventType === 'user.deleted') {
      const clerkUserId = evt.data.id as string;
      console.log(`Processing user deletion for ${clerkUserId}`);
      
      await deleteUserFromClerk(clerkUserId);
      console.log(`User ${clerkUserId} successfully deleted`);
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error processing webhook' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 