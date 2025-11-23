import { WireGuardConfig } from '@/types';

export function generateWireGuardConfig(config: WireGuardConfig, clientIP?: string): string {
  return `[Interface]
PrivateKey = ${config.privateKey}
Address = ${clientIP || '10.0.0.2/32'}
${config.dns ? `DNS = ${config.dns}` : ''}
${config.mtu ? `MTU = ${config.mtu}` : ''}

[Peer]
PublicKey = ${config.publicKey}
Endpoint = ${config.endpoint}
AllowedIPs = ${config.allowedIPs}
PersistentKeepalive = 25
`;
}

export function downloadWireGuardConfig(config: string, filename: string = 'devpn.conf') {
  const blob = new Blob([config], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  // Fallback for older browsers
  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      document.body.removeChild(textarea);
      resolve();
    } catch (err) {
      document.body.removeChild(textarea);
      reject(err);
    }
  });
}
