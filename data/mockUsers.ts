
import { AnonymousUser } from '@/types/User';

const anonymousNames = [
  'Mysterious Owl',
  'Silent Fox',
  'Hidden Wolf',
  'Secret Raven',
  'Unknown Eagle',
  'Phantom Tiger',
  'Shadow Panther',
  'Mystic Dragon',
  'Enigma Phoenix',
  'Veiled Hawk',
  'Cryptic Bear',
  'Obscure Lion',
  'Masked Leopard',
  'Covert Falcon',
  'Stealthy Jaguar',
  'Anonymous Lynx',
  'Incognito Puma',
  'Private Cheetah',
  'Nameless Cobra',
  'Faceless Viper',
];

const avatarColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
  '#E63946', '#457B9D', '#F77F00', '#06FFA5', '#8338EC',
];

export function generateMockUsers(count: number = 20): AnonymousUser[] {
  const users: AnonymousUser[] = [];
  
  for (let i = 0; i < count; i++) {
    const distance = Math.floor(Math.random() * 50) + 0.1;
    const statusOptions: ('online' | 'offline' | 'busy')[] = ['online', 'offline', 'busy'];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    users.push({
      id: `user-${i + 1}`,
      anonymousName: anonymousNames[i % anonymousNames.length],
      distance: parseFloat(distance.toFixed(1)),
      status,
      lastSeen: status === 'offline' ? new Date(Date.now() - Math.random() * 3600000) : undefined,
      isFriend: Math.random() > 0.8,
      avatar: avatarColors[i % avatarColors.length],
    });
  }
  
  return users.sort((a, b) => a.distance - b.distance);
}

export function getMockUser(userId: string): AnonymousUser | undefined {
  const users = generateMockUsers(20);
  return users.find(u => u.id === userId);
}
