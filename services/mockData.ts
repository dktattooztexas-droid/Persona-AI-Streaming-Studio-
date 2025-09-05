import { UserRole, User, Creator, Collaborator, StreamingPlatform, StreamingPlatformId } from '../types';
import { TwitchIcon, YouTubeIcon, KickIcon, TikTokIcon } from '../constants';

export const STREAMING_PLATFORMS: StreamingPlatform[] = [
  { id: StreamingPlatformId.TWITCH, name: 'Twitch', Icon: TwitchIcon, color: '#9146FF' },
  { id: StreamingPlatformId.YOUTUBE, name: 'YouTube', Icon: YouTubeIcon, color: '#FF0000' },
  { id: StreamingPlatformId.KICK, name: 'Kick', Icon: KickIcon, color: '#53FC18' },
  { id: StreamingPlatformId.TIKTOK, name: 'TikTok', Icon: TikTokIcon, color: '#00f2ea' },
];

export const getMockUser = (role: UserRole): User => {
  const baseUser = {
    id: 'user-123',
    name: 'Nova',
    avatarUrl: 'https://i.pravatar.cc/150?u=nova',
  };

  if (role === UserRole.CREATOR || role === UserRole.ADMIN) {
    return {
      ...baseUser,
      role: role,
      creatorName: 'NovaStream',
      specialty: 'Synthwave Gaming & Retro Tech',
      bio: 'Riding the vaporwave into digital sunsets. Join me for chill streams, retro game deep dives, and synth-heavy soundtracks. 🚀',
      followerCount: 125830,
    } as Creator;
  }
  
  if (role === UserRole.COLLABORATOR) {
    return {
      ...baseUser,
      name: 'Alex Chen',
      role: UserRole.COLLABORATOR,
      company: 'Synthwave Records',
      permissions: ['view_analytics', 'manage_projects'],
      avatarUrl: 'https://i.pravatar.cc/150?u=alex',
    } as Collaborator;
  }

  // Fallback, though UI should prevent this
  return {
    ...baseUser,
    role: UserRole.CREATOR,
    creatorName: 'NovaStream',
    specialty: 'Synthwave Gaming & Retro Tech',
    bio: 'Riding the vaporwave into digital sunsets. Join me for chill streams, retro game deep dives, and synth-heavy soundtracks. 🚀',
    followerCount: 125830,
  } as Creator;
};