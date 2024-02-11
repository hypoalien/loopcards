import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../utility/axios";
import clsx from "clsx";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { useIsAuthenticated, useAuthHeader } from "react-auth-kit";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./Loader";

import {
  PhoneIcon,
  TwitterIcon,
  InstagramIcon,
  GitHubIcon,
  LinkedInIcon,
  FacebookIcon,
  YoutubeIcon,
  TikTokIcon,
  SnapchatIcon,
  TwitchIcon,
  RedditIcon,
  WhatsappIcon,
  DribbleIcon,
  SlackIcon,
  PinterestIcon,
  DiscordIcon,
  MessangerIcon,
  SoundcloudIcon,
  SpotifyIcon,
  VenmoIcon,
  CashAppIcon,
  OnlyFansIcon,
  OutlookIcon,
  LinktreeIcon,
} from "../components/SocialIcons";
import { defaultBannerUrl, defaultProfilePicUrl } from "../utility/misc";
import AutoLogout from "../components/AutoLogout";

function getIcon(platform) {
  switch (platform) {
    case "Phone":
      return PhoneIcon;
    case "Twitter":
      return TwitterIcon;
    case "Instagram":
      return InstagramIcon;
    case "GitHub":
      return GitHubIcon;
    case "LinkedIn":
      return LinkedInIcon;
    case "Facebook":
      return FacebookIcon;
    case "Youtube":
      return YoutubeIcon;
    case "TikTok":
      return TikTokIcon;
    case "Snapchat":
      return SnapchatIcon;
    case "Twitch":
      return TwitchIcon;
    case "Reddit":
      return RedditIcon;
    case "Whatsapp":
      return WhatsappIcon;
    case "Dribble":
      return DribbleIcon;
    case "Slack":
      return SlackIcon;
    case "Pinterest":
      return PinterestIcon;
    case "Discord":
      return DiscordIcon;
    case "Messanger":
      return MessangerIcon;
    case "Soundcloud":
      return SoundcloudIcon;
    case "Spotify":
      return SpotifyIcon;
    case "Venmo":
      return VenmoIcon;
    case "CashApp":
      return CashAppIcon;
    case "OnlyFans":
      return OnlyFansIcon;
    case "Outlook":
      return OutlookIcon;
    case "Linktree":
      return LinktreeIcon;
    default:
      return null;
  }
}
// Format phone number to XXX-XXX-XXXX format
function formatPhoneNumber(phoneNumberString) {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return match[1] + "-" + match[2] + "-" + match[3];
  }
  return null;
}
function ArrowDownIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.75 8.75 8 12.25m0 0 3.25-3.5M8 12.25v-8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SocialLink({ className, href, children, icon: Icon }) {
  console.log("href print ", href);
  return (
    <li className={clsx(className, "flex")}>
      <Link
        to={href}
        className="group flex text-sm font-medium  transition  text-zinc-200 hover:text-teal-500">
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  );
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  );
}

export default function Homepage(props) {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loader, setLoader] = useState(false);
  const AuthAxios = useAuthHeader();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  AutoLogout();
  useEffect(() => {
    async function fetchProfile() {
      console.log(AuthAxios());
      if (props.cardId) {
        console.log("inside props", props.cardId);
        setProfile(props.cardId);
      } else {
        if (isAuthenticated()) {
          const token = AuthAxios();
          try {
            const response = await axios.post(
              "/users/getUserProfilePrivate",
              null,
              {
                headers: {
                  authorization: token,
                },
              },
            );
            if (
              !response.data.firstname ||
              !response.data.lastname ||
              !response.data.company ||
              !response.data.title
            ) {
              navigate("/edit");
            }
            setProfile(response.data);
          } catch (error) {
            // handle error
            console.error(error);
          }
        } else {
          const { cardId } = location.state ? location.state : "";
          console.log("Homepage", cardId);
          try {
            const response = await axios.post("/users/getUserProfilePublic", {
              cardID: cardId,
            });
            setProfile(response.data);
          } catch (error) {
            // handle error
            console.error(error);
          }
        }
      }
    }

    fetchProfile();
  }, []);

  const handleDownload = async () => {
    setLoader(true);
    console.log("button clicked");
    try {
      console.log({ cardID: profile.cardID });
      const response = await axios.post("/users/downloadUserContact", {
        // responseType: 'blob',
        cardID: profile.cardID,
      });
      const blob = new Blob([response.data], { type: "text/vcard" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "contacts.vcf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setLoader(false);
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };
  console.log("StoreLgTOken", token);
  if (!profile) {
    return <Loader />;
  }

  return (
    <>
      <Helmet>
        <title>
          {" "}
          About - {profile.firstname} {profile.lastname}
        </title>
        <meta
          name="description"
          content="I’m Spencer Sharp. I live in New York City, where I design the future."
        />
      </Helmet>
      <Container className="mt-4 sm:mt-4">
        <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-3">
          <div className="relative h-48 sm:h-56 lg:h-64">
            <img
              src={profile.bannerUrl ? profile.bannerUrl : defaultBannerUrl}
              alt=""
              sizes="(min-width: 1024px) 100vw, 100vw"
              className="absolute inset-0 object-cover w-full h-full rounded-2xl   bg-zinc-800"
            />
            <div className="absolute bottom-0 left-0 right-0 flex justify-start p-3 ">
              <div className="relative">
                <img
                  src={
                    profile.profileUrl
                      ? profile.profileUrl
                      : defaultProfilePicUrl
                  }
                  alt=""
                  className="w-28 h-28 rounded-full border-4 object-cover inset-0 border-zinc-400 shadow-lg"
                />
              </div>
            </div>
          </div>
          <div className="lg:order-first lg:row-span-2">
            <h1 className="text-4xl font-bold tracking-tight  text-zinc-100 sm:text-5xl">
              {`${profile.firstname} ${profile.lastname}`}
            </h1>
            <div className="mt-3 space-y-7 text-base  text-zinc-400">
              <p>{`${profile.title} at ${profile.company}`}</p>
            </div>
          </div>

          <div>
            <Button
              onClick={handleDownload}
              variant="secondary"
              className="group mt-3 w-full  text-teal-500">
              Download Contact
              <ArrowDownIcon className="h-4 w-4 stroke-zinc-400 transition  group-hover:stroke-zinc-50 group-active:stroke-zinc-50" />
            </Button>
          </div>

          <div className="lg:pl-20">
            <ul role="list">
              {profile.socialLinks.map((link, index) => {
                const Icon = getIcon(link.platform);
                if (!Icon) return null; // skip unsupported platforms
                return (
                  <SocialLink
                    key={index}
                    href={link.url}
                    icon={Icon}
                    className={index > 0 ? "mt-4" : ""}>
                    Follow on {link.platform}
                  </SocialLink>
                );
              })}

              <SocialLink
                href={`mailto:${profile.emailPublic}`}
                icon={MailIcon}
                className="mt-4">
                {profile.emailPublic}
              </SocialLink>
              <SocialLink
                href={`tel:${formatPhoneNumber(profile.phone)}`}
                icon={getIcon("Phone")}
                className="mt-4">
                {formatPhoneNumber(profile.phone)}
              </SocialLink>
            </ul>
          </div>
          <div className="mt-3 space-y-7 text-base  text-zinc-400">
            <p>{profile.about}</p>
          </div>
        </div>
      </Container>
    </>
  );
}
