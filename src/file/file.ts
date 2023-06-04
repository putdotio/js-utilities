import bytes from 'bytes';

export const toHumanFileSize = (
  fileSizeInBytes: string | number,
  options: bytes.BytesOptions = {}
) => {
  const size =
    typeof fileSizeInBytes === 'string'
      ? parseInt(fileSizeInBytes, 10)
      : fileSizeInBytes;

  return bytes(size, { unitSeparator: ' ', ...options });
};
