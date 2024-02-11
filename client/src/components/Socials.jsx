import SocialLink from './SocialLink';
import TwitterIcon from './TwitterIcon';
import InstagramIcon from './InstagramIcon';
import GitHubIcon from './GitHubIcon';
import LinkedInIcon from './LinkedInIcon';
import MailIcon from './MailIcon';

function SocialLinks({ links }) {
  return (
    <div className="lg:pl-20">
      <ul role="list">
        {links.map((link, index) => (
          <SocialLink
            key={index}
            href={link.href}
            icon={link.icon}
            className={index === 0 ? '' : 'mt-4'}
          >
            {link.text}
          </SocialLink>
        ))}
      </ul>
    </div>
  );
}

function MyComponent() {
  const socialLinks = [
    {
      href: '#',
      icon: TwitterIcon,
      text: 'Follow on Twitter',
    },
    {
      href: '#',
      icon: InstagramIcon,
      text: 'Follow on Instagram',
    },
    {
      href: '#',
      icon: GitHubIcon,
      text: 'Follow on GitHub',
    },
    {
      href: '#',
      icon: LinkedInIcon,
      text: 'Follow on LinkedIn',
    },
    {
      href: 'mailto:spencer@planetaria.tech',
      icon: MailIcon,
      text: 'spencer@planetaria.tech',
    },
  ];

  return <SocialLinks links={socialLinks} />;
}
