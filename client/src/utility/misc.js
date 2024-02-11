export const platforms = [
  "Twitter",
  "Instagram",
  "GitHub",
  "LinkedIn",
  "Facebook",
  "Youtube",
  "TikTok",
  "Snapchat",
  "Twitch",
  "Reddit",
  "Whatsapp",
  "Dribble",
  "Slack",
  "Pinterest",
  "Discord",
  "Messanger",
  "Soundcloud",
  "Spotify",
  "Venmo",
  "CashApp",
  "OnlyFans",
  "Outlook",
  "Linktree",
];
export const linkFormat = {
  twitter: {
    platform: "Twitter",
    url: "https://twitter.com/{{username}}",
  },
  instagram: {
    platform: "Instagram",
    url: "https://www.instagram.com/{{username}}",
  },
  facebook: {
    platform: "Facebook",
    url: "https://www.facebook.com/{{username}}",
  },
  github: {
    platform: "GitHub",
    url: "https://github.com/{{username}}",
  },
  linkedin: {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/{{username}}",
  },
  youtube: {
    platform: "YouTube",
    url: "https://www.youtube.com/user/{{username}}",
  },
  tiktok: {
    platform: "TikTok",
    url: "https://www.tiktok.com/@{{username}}",
  },
  snapchat: {
    platform: "Snapchat",
    url: "https://www.snapchat.com/add/{{username}}",
  },
  twitch: {
    platform: "Twitch",
    url: "https://www.twitch.tv/{{username}}",
  },
  reddit: {
    platform: "Reddit",
    url: "https://www.reddit.com/user/{{username}}",
  },
  whatsapp: {
    platform: "WhatsApp",
    url: "https://wa.me/{{username}}",
  },
  dribbble: {
    platform: "Dribbble",
    url: "https://dribbble.com/{{username}}",
  },
  slack: {
    platform: "Slack",
    url: "https://{{username}}.slack.com/",
  },
  pinterest: {
    platform: "Pinterest",
    url: "https://www.pinterest.com/{{username}}",
  },
  discord: {
    platform: "Discord",
    url: "https://discordapp.com/users/{{username}}",
  },
  messenger: {
    platform: "Messenger",
    url: "https://m.me/{{username}}",
  },
  soundcloud: {
    platform: "SoundCloud",
    url: "https://soundcloud.com/{{username}}",
  },
  spotify: {
    platform: "Spotify",
    url: "https://open.spotify.com/user/{{username}}",
  },
  venmo: {
    platform: "Venmo",
    url: "https://venmo.com/{{username}}",
  },
  cashapp: {
    platform: "Cash App",
    url: "https://cash.app/${{username}}",
  },
  onlyfans: {
    platform: "OnlyFans",
    url: "https://onlyfans.com/{{username}}",
  },
  outlook: {
    platform: "Outlook",
    url: "https://outlook.live.com/owa/?path=/mail/inbox",
  },
  linktree: {
    platform: "Linktree",
    url: "https://linktr.ee/{{username}}",
  },
};
export function capitalizeWords(str) {
  let words = str.split(" ");
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }
  console.log(words.join(""));
  return words.join(" ");
}

// Format phone number to XXX-XXX-XXXX format
export function formatPhoneNumber(phoneNumberString) {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return match[1] + "-" + match[2] + "-" + match[3];
  }
  return null;
}

// Reformat phone number to XXXXXXXXXX format
export function reformatPhoneNumber(phoneNumberString) {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  return cleaned;
}

export const defaultProfilePicUrl =
  "https://fractalcards-dev.s3.amazonaws.com/profiles/profileplaceHolder.jpg";
export const defaultBannerUrl =
  "https://fractalcards-dev.s3.amazonaws.com/banner/bannerPlaceHolder.jpg";
