import { Session } from '@/types';
import { mockNodes } from './mockNodes';

export const mockSessions: Session[] = [
  {
    id: 'session-1',
    userId: 'user-1',
    userWallet: 'EQD...userWallet1',
    nodeId: 'node-1',
    node: mockNodes[0],
    clientPublicKey: 'ClientPubKey1==',
    clientPrivateKey: 'ClientPrivKey1==',
    serverPublicKey: mockNodes[0].publicKey,
    clientIP: '10.8.0.2',
    serverIP: mockNodes[0].ip,
    serverPort: mockNodes[0].port,
    config: `[Interface]
PrivateKey = ClientPrivKey1==
Address = 10.8.0.2/24
DNS = 1.1.1.1

[Peer]
PublicKey = ${mockNodes[0].publicKey}
Endpoint = ${mockNodes[0].ip}:${mockNodes[0].port}
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25`,
    status: 'active',
    startTime: '2024-12-20T14:00:00Z',
    duration: 3600, // 1 hour
    dataUsed: {
      upload: 52428800, // 50 MB
      download: 314572800, // 300 MB
      total: 367001600, // 350 MB
    },
    currentSpeed: {
      upload: 2.5,
      download: 15.3,
    },
    averageSpeed: 12.5,
    paymentChannelId: 'channel-1',
    totalCost: '0.05',
    deviceId: 'device-1',
    createdAt: '2024-12-20T14:00:00Z',
    updatedAt: '2024-12-20T15:00:00Z',
  },
  {
    id: 'session-2',
    userId: 'user-1',
    userWallet: 'EQD...userWallet1',
    nodeId: 'node-2',
    node: mockNodes[1],
    clientPublicKey: 'ClientPubKey2==',
    clientPrivateKey: 'ClientPrivKey2==',
    serverPublicKey: mockNodes[1].publicKey,
    clientIP: '10.8.0.3',
    serverIP: mockNodes[1].ip,
    serverPort: mockNodes[1].port,
    config: `[Interface]
PrivateKey = ClientPrivKey2==
Address = 10.8.0.3/24
DNS = 1.1.1.1

[Peer]
PublicKey = ${mockNodes[1].publicKey}
Endpoint = ${mockNodes[1].ip}:${mockNodes[1].port}
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25`,
    status: 'stopped',
    startTime: '2024-12-19T10:00:00Z',
    endTime: '2024-12-19T12:15:00Z',
    duration: 8100, // 2h 15m
    dataUsed: {
      upload: 104857600, // 100 MB
      download: 1258291200, // 1.2 GB
      total: 1363148800, // 1.3 GB
    },
    averageSpeed: 45.2,
    paymentChannelId: 'channel-2',
    totalCost: '0.0675',
    deviceId: 'device-1',
    rating: 5,
    createdAt: '2024-12-19T10:00:00Z',
    updatedAt: '2024-12-19T12:15:00Z',
  },
  {
    id: 'session-3',
    userId: 'user-1',
    userWallet: 'EQD...userWallet1',
    nodeId: 'node-3',
    node: mockNodes[2],
    clientPublicKey: 'ClientPubKey3==',
    clientPrivateKey: 'ClientPrivKey3==',
    serverPublicKey: mockNodes[2].publicKey,
    clientIP: '10.8.0.4',
    serverIP: mockNodes[2].ip,
    serverPort: mockNodes[2].port,
    config: `[Interface]
PrivateKey = ClientPrivKey3==
Address = 10.8.0.4/24
DNS = 1.1.1.1

[Peer]
PublicKey = ${mockNodes[2].publicKey}
Endpoint = ${mockNodes[2].ip}:${mockNodes[2].port}
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25`,
    status: 'stopped',
    startTime: '2024-12-18T08:30:00Z',
    endTime: '2024-12-18T11:45:00Z',
    duration: 11700, // 3h 15m
    dataUsed: {
      upload: 73400320, // 70 MB
      download: 524288000, // 500 MB
      total: 597688320, // 570 MB
    },
    averageSpeed: 38.7,
    paymentChannelId: 'channel-3',
    totalCost: '0.13',
    deviceId: 'device-1',
    rating: 4,
    createdAt: '2024-12-18T08:30:00Z',
    updatedAt: '2024-12-18T11:45:00Z',
  },
];

export const mockSessionHistory: Session[] = [
  ...mockSessions.filter(s => s.status === 'stopped'),
  {
    id: 'session-4',
    userId: 'user-1',
    userWallet: 'EQD...userWallet1',
    nodeId: 'node-1',
    node: mockNodes[0],
    clientPublicKey: 'ClientPubKey4==',
    clientPrivateKey: 'ClientPrivKey4==',
    serverPublicKey: mockNodes[0].publicKey,
    clientIP: '10.8.0.5',
    serverIP: mockNodes[0].ip,
    serverPort: mockNodes[0].port,
    config: '',
    status: 'stopped',
    startTime: '2024-12-17T15:00:00Z',
    endTime: '2024-12-17T16:30:00Z',
    duration: 5400, // 1h 30m
    dataUsed: {
      upload: 41943040, // 40 MB
      download: 209715200, // 200 MB
      total: 251658240, // 240 MB
    },
    averageSpeed: 32.1,
    totalCost: '0.075',
    deviceId: 'device-1',
    rating: 5,
    createdAt: '2024-12-17T15:00:00Z',
    updatedAt: '2024-12-17T16:30:00Z',
  },
  {
    id: 'session-5',
    userId: 'user-1',
    userWallet: 'EQD...userWallet1',
    nodeId: 'node-4',
    node: mockNodes[3],
    clientPublicKey: 'ClientPubKey5==',
    clientPrivateKey: 'ClientPrivKey5==',
    serverPublicKey: mockNodes[3].publicKey,
    clientIP: '10.8.0.6',
    serverIP: mockNodes[3].ip,
    serverPort: mockNodes[3].port,
    config: '',
    status: 'stopped',
    startTime: '2024-12-16T09:00:00Z',
    endTime: '2024-12-16T10:00:00Z',
    duration: 3600, // 1h
    dataUsed: {
      upload: 31457280, // 30 MB
      download: 157286400, // 150 MB
      total: 188743680, // 180 MB
    },
    averageSpeed: 28.5,
    totalCost: '0.06',
    deviceId: 'device-1',
    rating: 4,
    createdAt: '2024-12-16T09:00:00Z',
    updatedAt: '2024-12-16T10:00:00Z',
  },
];

export const getActiveSession = (): Session | null => {
  return mockSessions.find(s => s.status === 'active') || null;
};

export const getSessionById = (id: string): Session | undefined => {
  return [...mockSessions, ...mockSessionHistory].find(s => s.id === id);
};
