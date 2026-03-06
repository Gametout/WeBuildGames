import { motion } from "framer-motion";
import { Twitter, Instagram, Youtube, Linkedin, Send } from "lucide-react";
import { useState } from "react";

const socialLinks = [
  // { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const footerLinks = {
  platform: [/*"Featured", "Documentary", "Reviews",*/ "Portfolios", "Studios", "DIscord", "LinkedIn"],
  company: ["About Us", "FAQs"],
  community: ["Discord", "Whatsapp", "Youtube", "Linkedin"],
};

export const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-[1.7rem] mb-4">
              WE<span className="text-gradient-gold">BUILD</span>GAME
              {/* <span className="text-[0.5em] align-super font-bold text-white/90"> ™</span> */}
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              The Professional hub connecting game developers and studios worldwide.
            </p>

            {/* Newsletter */}
            {/* <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div> */}
          </div>

          {/* Links */}
          <div>
            {/* <h4 className="font-display text-lg mb-4">Platform</h4> */}
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {/* <h4 className="font-display text-lg mb-4">Company</h4> */}
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* <div>
            <h4 className="font-display text-lg mb-4">Community</h4>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GameTout. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.1, y: -2 }}
                className="p-2 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
