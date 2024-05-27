"use server";

import { createClient } from ".";

type FileBody =
  | ArrayBuffer
  | ArrayBufferView
  | Blob
  | Buffer
  | File
  | FormData
  | NodeJS.ReadableStream
  | ReadableStream<Uint8Array>
  | URLSearchParams
  | string;

interface IUpload {
  bucket: string;
  name: string;
  file: FileBody;
  fileOptions?: {
    cacheControl?: string;
    contentType?: string;
    upsert?: boolean;
    duplex?: string;
  };
}

export async function upload({ bucket, name, file, fileOptions }: IUpload) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(name, file, fileOptions);

  if (error) {
    return error;
  }
  const {
    data: { publicUrl },
  } = supabase.storage.from("items").getPublicUrl(data.path);
  return publicUrl;
}
