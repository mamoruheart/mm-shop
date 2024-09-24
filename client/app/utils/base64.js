export const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  let bytes = [].slice.call(new Uint8Array(buffer.data.data));
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return `data:${buffer.contentType};base64,${window.btoa(binary)}`;
};
