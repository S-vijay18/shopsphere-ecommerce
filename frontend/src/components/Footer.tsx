import React from 'react';
import { Link } from 'react-router-dom';
import { Store, HelpCircle, Gift, Award, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-[#172337] text-white pt-10 pb-6 text-xs mt-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-10 border-b border-gray-700">
          
          {/* Col 1: About */}
          <div>
            <h3 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">About</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/about" className="hover:underline">Contact Us</Link></li>
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
              <li><a href="#careers" className="hover:underline">Careers</a></li>
              <li><a href="#stories" className="hover:underline">ShopSphere Stories</a></li>
              <li><a href="#press" className="hover:underline">Press Releases</a></li>
              <li><a href="#corporate" className="hover:underline">Corporate Information</a></li>
            </ul>
          </div>

          {/* Col 2: Group Companies */}
          <div>
            <h3 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">Group Companies</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#myntra" className="hover:underline">Myntra</a></li>
              <li><a href="#cleartrip" className="hover:underline">Cleartrip</a></li>
              <li><a href="#shopsy" className="hover:underline">Shopsy</a></li>
            </ul>
          </div>

          {/* Col 3: Help */}
          <div>
            <h3 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">Help</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#payments" className="hover:underline">Payments</a></li>
              <li><a href="#shipping" className="hover:underline">Shipping & Delivery</a></li>
              <li><a href="#cancellation" className="hover:underline">Cancellation & Returns</a></li>
              <li><a href="#faq" className="hover:underline">FAQ</a></li>
              <li><a href="#infringement" className="hover:underline">Report Infringement</a></li>
            </ul>
          </div>

          {/* Col 4: Consumer Policy */}
          <div>
            <h3 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">Consumer Policy</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#policy" className="hover:underline">Cancellation & Returns</a></li>
              <li><a href="#terms" className="hover:underline">Terms of Use</a></li>
              <li><a href="#security" className="hover:underline">Security</a></li>
              <li><a href="#privacy" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#sitemap" className="hover:underline">Sitemap</a></li>
              <li><a href="#grievance" className="hover:underline">Grievance Redressal</a></li>
            </ul>
          </div>

          {/* Col 5: Mail Us (with vertical divider) */}
          <div className="md:border-l md:border-gray-700 md:pl-6 text-gray-300">
            <h3 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">Mail Us:</h3>
            <p className="leading-relaxed text-[11px]">
              ShopSphere Internet Private Limited,<br />
              Buildings Alyssa, Begonia & Clove,<br />
              Embassy Tech Village, Outer Ring Road,<br />
              Bengaluru, 560103, Karnataka, India
            </p>
          </div>

          {/* Col 6: Registered Address */}
          <div className="text-gray-300">
            <h3 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">Registered Office:</h3>
            <p className="leading-relaxed text-[11px]">
              ShopSphere Internet Private Limited,<br />
              Outer Ring Road, Devarabeesanahalli,<br />
              Bengaluru, 560103, Karnataka, India<br />
              CIN: U51109KA2012PTC066107<br />
              Telephone: 044-45614700
            </p>
          </div>
        </div>

        {/* Bottom Bar with Assured Badges & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 font-medium text-gray-300">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Store className="w-4 h-4" />
              <span>Become a Seller</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <Award className="w-4 h-4" />
              <span>Advertise</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <Gift className="w-4 h-4" />
              <span>Gift Cards</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <HelpCircle className="w-4 h-4" />
              <span>Help Center</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-center text-[11px]">
            <span>© 2026 ShopSphere.com. All rights reserved.</span>
          </div>

          {/* Payment Methods Badges */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 font-bold">VISA</span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 font-bold">MasterCard</span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 font-bold">RuPay</span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 font-bold">UPI</span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 font-bold">Cash on Delivery</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

