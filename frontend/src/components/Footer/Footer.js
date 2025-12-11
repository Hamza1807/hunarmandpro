import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo';
import './Footer.css';

const Footer = () => {
  const footerLinks = {
    categories: [
      'Graphics & Design',
      'Digital Marketing',
      'Writing & Translation',
      'Video & Animation',
      'Music & Audio',
      'Programming & Tech',
      'AI Services',
      'Consulting',
      'Data',
      'Business',
      'Personal Growth & Hobbies',
      'Photography',
      'Finance',
      'End-to-End Projects',
      'Service Catalog'
    ],
    forClients: [
      'How HunarmandPro Works',
      'Customer Success Stories',
      'Quality Guide',
      'HunarmandPro Guides',
      'HunarmandPro Answers',
      'Browse Freelance By Skill'
    ],
    forFreelancers: [
      'Become a HunarmandPro Freelancer',
      'Become an Agency',
      'Freelancer Equity Program',
      'Community Hub',
      'Forum',
      'Events'
    ],
    businessSolutions: [
      'HunarmandPro Pro',
      'Project Management Service',
      'Expert Sourcing Service',
      'ClearVoice - Content Marketing',
      'AutoDS - Dropshipping Tool',
      'AI store builder',
      'HunarmandPro Logo Maker',
      'Contact Sales'
    ],
    company: [
      'About HunarmandPro',
      'Help Center',
      'Trust & Safety',
      'Social Impact',
      'Careers',
      'Terms of Service',
      'Privacy Policy',
      'Do not sell or share my personal information',
      'Partnerships',
      'Creator Network',
      'Affiliates',
      'Invite a Friend',
      'Press & News',
      'Investor Relations'
    ]
  };

  const socialIcons = [
    { name: 'TikTok', icon: 'T' },
    { name: 'Instagram', icon: 'I' },
    { name: 'LinkedIn', icon: 'L' },
    { name: 'Facebook', icon: 'F' },
    { name: 'Pinterest', icon: 'P' },
    { name: 'Twitter', icon: 'X' }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <div className="footer-column">
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-list">
              {footerLinks.categories.map((link, index) => (
                <li key={index}>
                  <Link to={`/categories/${link.toLowerCase().replace(/\s+/g, '-')}`} className="footer-link">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">For Clients</h4>
            <ul className="footer-list">
              {footerLinks.forClients.map((link, index) => (
                <li key={index}>
                  <Link to={`/${link.toLowerCase().replace(/\s+/g, '-')}`} className="footer-link">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">For Freelancers</h4>
            <ul className="footer-list">
              {footerLinks.forFreelancers.map((link, index) => (
                <li key={index}>
                  <Link to={`/${link.toLowerCase().replace(/\s+/g, '-')}`} className="footer-link">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Business Solutions</h4>
            <ul className="footer-list">
              {footerLinks.businessSolutions.map((link, index) => (
                <li key={index}>
                  <Link to={`/${link.toLowerCase().replace(/\s+/g, '-')}`} className="footer-link">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-list">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link to={`/${link.toLowerCase().replace(/\s+/g, '-')}`} className="footer-link">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <Link to="/" className="footer-logo-link">
              <Logo />
            </Link>
            <p className="footer-copyright">© HunarmandPro International Ltd. 2025</p>
          </div>
          <div className="footer-bottom-right">
            <div className="social-icons">
              {socialIcons.map((social, index) => (
                <a key={index} href="#" className="social-icon" aria-label={social.name}>
                  {social.icon}
                </a>
              ))}
            </div>
            <div className="footer-options">
              <div className="footer-option">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M8 4V8L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>English</span>
              </div>
              <div className="footer-option">
                <span>PKR</span>
              </div>
              <div className="footer-option">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M8 6C8.55228 6 9 6.44772 9 7C9 7.55228 8.55228 8 8 8C7.44772 8 7 7.55228 7 7C7 6.44772 7.44772 6 8 6Z" fill="currentColor"/>
                  <path d="M8 9V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

