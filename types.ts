import { IconType } from 'react-icons';

export enum UserRole {
  CREATOR = 'creator',
  COLLABORATOR = 'collaborator',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
}

export interface Creator extends User {
  creatorName: string;
  specialty: string;
  bio: string;
  followerCount: number;
}

export interface Collaborator extends User {
  company: string;
  permissions: string[];
}

export enum BackgroundMode {
    PAPARAZZI = 'Paparazzi',
    MATRIX = 'Matrix',
}

export interface BackgroundSettings {
    mode: BackgroundMode;
    intensity: number;
}

export enum StreamingPlatformId {
  TWITCH = 'twitch',
  YOUTUBE = 'youtube',
  KICK = 'kick',
  TIKTOK = 'tiktok',
}

export interface StreamingPlatform {
  id: StreamingPlatformId;
  name: string;
  Icon: IconType;
  color: string;
}

export interface ConnectedAccount {
  id: string;
  platformId: StreamingPlatformId;
  username: string;
  connectedAt: string;
}

export enum AITool {
  CHAT = 'Chat',
  PROMPT_ENHANCER = 'Prompt Enhancer',
  IMAGE_EDITOR = 'Image Editor',
  VIDEO_GENERATION = 'Video Generation',
  PHOTO_TO_VIDEO = 'Photo to Video',
}

export enum Author {
    USER,
    AI,
}

export interface Message {
    id: string;
    author: Author;
    content: React.ReactNode;
    imageUrl?: string;
}

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

export interface BrandKit {
  colors: BrandColors;
  logos: string[]; // URLs to logo images
  fonts: {
    heading: string;
    body: string;
  };
  slogan: string;
}

export interface AudienceData {
  ageRange: Record<string, number>;
  gender: Record<string, number>;
  geography: Record<string, number>;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  url: string;
  genre: string;
}
