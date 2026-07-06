export const uploadService = {
  async uploadToR2(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    return `/uploads/${file.name}`;
  },

  getPublicUrl(key: string): string {
    const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
    const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;
    return `${endpoint}/${bucket}/${key}`;
  },
};