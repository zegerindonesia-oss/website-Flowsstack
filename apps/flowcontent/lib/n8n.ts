const WEBHOOK_URL_KEY = "fc_webhook_url";

export function getWebhookUrl(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(WEBHOOK_URL_KEY) || "";
}

export function setWebhookUrl(url: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WEBHOOK_URL_KEY, url);
}

export async function triggerN8nWebhook(
  action: string,
  payload: Record<string, unknown>
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const baseUrl = getWebhookUrl();

  if (!baseUrl) {
    return {
      success: false,
      error: "n8n Webhook URL is not configured. Please set it in Settings.",
    };
  }

  try {
    const url = baseUrl.endsWith("/") ? `${baseUrl}${action}` : `${baseUrl}/${action}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload, timestamp: new Date().toISOString() }),
    });

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json().catch(() => ({}));
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`n8n webhook error [${action}]:`, message);
    return { success: false, error: message };
  }
}

export async function triggerN8nWebhookFormData(
  action: string,
  formData: FormData
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const baseUrl = getWebhookUrl();

  if (!baseUrl) {
    return {
      success: false,
      error: "n8n Webhook URL is not configured. Please set it in Settings.",
    };
  }

  try {
    const url = baseUrl.endsWith("/") ? `${baseUrl}${action}` : `${baseUrl}/${action}`;
    
    // Add default tracking fields
    formData.append('action', action);
    formData.append('timestamp', new Date().toISOString());

    const response = await fetch(url, {
      method: "POST",
      // Do NOT set Content-Type header when sending FormData.
      // Fetch will automatically set it to multipart/form-data with the correct boundary.
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json().catch(() => ({}));
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`n8n webhook error [${action}]:`, message);
    return { success: false, error: message };
  }
}

export async function fetchFromN8n(
  action: string,
  params?: Record<string, string>
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const baseUrl = getWebhookUrl();
  if (!baseUrl) {
    return { success: false, error: "n8n Webhook URL is not configured." };
  }

  try {
    const url = new URL(baseUrl.endsWith("/") ? `${baseUrl}${action}` : `${baseUrl}/${action}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}`);
    }

    const data = await response.json().catch(() => ({}));
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}
