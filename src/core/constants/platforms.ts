import { META_ICON, FACEBOOK_ICON, INSTAGRAM_ICON, TIKTOK_ICON_DARK, TIKTOK_ICON_LIGHT } from '@/assets/platforms-icons';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

export interface Platform {
  id: string;
  label: string;
  icons: { light: StaticImport; dark: StaticImport };
  group: string;
}

const PLATFORMS: Platform[] = [
  // { id: 'overview', label: 'Resumen Global', icon: LayoutDashboard, group: 'general' },
  { id: 'facebook', label: 'Facebook', icons: { light: FACEBOOK_ICON, dark: FACEBOOK_ICON }, group: 'social' },
  { id: 'instagram', label: 'Instagram', icons: { light: INSTAGRAM_ICON, dark: INSTAGRAM_ICON }, group: 'social' },
  { id: 'tiktok', label: 'TikTok', icons: { light: TIKTOK_ICON_LIGHT, dark: TIKTOK_ICON_DARK }, group: 'social' },
  // { id: 'twitter', label: 'Twitter / X', icon: Twitter, group: 'social' },
  // { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, group: 'social' },
  // { id: 'youtube', label: 'YouTube', icon: Youtube, group: 'social' },
  // { id: 'gmb', label: 'Google Business', icon: MapPin, group: 'social' },
  // { id: 'web', label: 'Web / Blog', icon: Globe, group: 'web' },
  { id: 'meta_ads', label: 'Meta Ads', icons: { light: META_ICON, dark: META_ICON }, group: 'ads' },
  { id: 'tiktok_ads', label: 'TikTok Ads', icons: { light: TIKTOK_ICON_LIGHT, dark: TIKTOK_ICON_DARK }, group: 'ads' },
  // { id: 'google_ads', label: 'Google Ads', icon: MousePointerClick, group: 'ads' },
  // { id: 'tiktok_ads', label: 'TikTok Ads', icon: Megaphone, group: 'ads' },
];

export default PLATFORMS;
