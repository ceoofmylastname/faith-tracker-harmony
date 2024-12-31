import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <p>907 W Adams Ave, Las Vegas, NV 89106</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <p>702-648-5905</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <p>contact@faithtemple.org</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Service Times</h3>
            <ul className="space-y-2">
              <li>Sunday School: 9:45 AM</li>
              <li>Sunday Worship: 11:00 AM</li>
              <li>Wednesday Bible Study: 7:00 PM</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Ministries
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Give
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="hover:text-accent transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p>
            © {new Date().getFullYear()} Faith Temple True Holiness International
            Ministries. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};