
import type { Application } from '@/api/types/opportunity.types';

// Safe accessor functions for profile data
export const getClubName = (application: Application) => {
  if (!application?.runclub_profile) return 'Unnamed Run Club';
  return application.runclub_profile.club_name || 'Unnamed Run Club';
};

export const getLocation = (application: Application) => {
  if (!application?.runclub_profile) return 'Unknown';
  return application.runclub_profile.location || 'Unknown';
};

export const getMemberCount = (application: Application) => {
  if (!application?.runclub_profile) return '0';
  return application.runclub_profile.member_count?.toString() || '0';
};

export const getDescription = (application: Application) => {
  if (!application?.runclub_profile) return 'No description available';
  return application.runclub_profile.description || 'No description available';
};

export const getWebsite = (application: Application) => {
  if (!application?.runclub_profile) return '';
  return application.runclub_profile.website || '';
};

export const getSocialMedia = (application: Application) => {
  if (!application?.runclub_profile || !application.runclub_profile.social_media) {
    return { instagram: '', followers: 0 };
  }
  
  const social = application.runclub_profile.social_media;
  return {
    instagram: social.instagram?.handle || '',
    followers: social.instagram?.followers || 0
  };
};

export const truncateDescription = (description: string, maxLength = 100) => {
  if (!description || description.length <= maxLength) return description;
  return `${description.substring(0, maxLength)}...`;
};

export const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};
