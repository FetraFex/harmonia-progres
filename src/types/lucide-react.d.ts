/* eslint-disable @typescript-eslint/no-explicit-any */
// Type declaration for lucide-react (workaround for bundler moduleResolution)
// lucide-react@1.25.0 has "typings" but no "exports" field, so bundler resolution fails.
declare module "lucide-react" {
  import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";
  type LucideIcon = ForwardRefExoticComponent<
    SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number | string; ref?: any } & RefAttributes<SVGSVGElement>
  >;

  // Activity & Status
  export const Activity: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowUpDown: LucideIcon;
  export const Award: LucideIcon;
  export const BarChart3: LucideIcon;
  export const Building: LucideIcon;
  export const Calendar: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const CircleDot: LucideIcon;
  export const Clock: LucideIcon;
  export const Database: LucideIcon;
  export const Download: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const FileSpreadsheet: LucideIcon;
  export const FileText: LucideIcon;
  export const Fish: LucideIcon;
  export const Globe: LucideIcon;
  export const GraduationCap: LucideIcon;
  export const Key: LucideIcon;
  export const Layers: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const Loader2: LucideIcon;
  export const Lock: LucideIcon;
  export const LogOut: LucideIcon;
  export const Mail: LucideIcon;
  export const MailOpen: LucideIcon;
  export const MapPin: LucideIcon;
  export const Menu: LucideIcon;
  export const Minus: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const Palette: LucideIcon;
  export const PartyPopper: LucideIcon;
  export const Phone: LucideIcon;
  export const Plus: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const Save: LucideIcon;
  export const Search: LucideIcon;
  export const Server: LucideIcon;
  export const Settings: LucideIcon;
  export const Shield: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Star: LucideIcon;
  export const Target: LucideIcon;
  export const ThumbsDown: LucideIcon;
  export const ThumbsUp: LucideIcon;
  export const Trash2: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const User: LucideIcon;
  export const UserPlus: LucideIcon;
  export const Users: LucideIcon;
  export const Wheat: LucideIcon;
  export const X: LucideIcon;
  export const XCircle: LucideIcon;
  export const Briefcase: LucideIcon;

  // Additional icons used across the project
  export const Anchor: LucideIcon;
  export const BookOpen: LucideIcon;
  export const BriefcaseBusiness: LucideIcon;
  export const Coins: LucideIcon;
  export const Copy: LucideIcon;
  export const FileCheck: LucideIcon;
  export const Filter: LucideIcon;
  export const Handshake: LucideIcon;
  export const Hash: LucideIcon;
  export const Home: LucideIcon;
  export const IdCard: LucideIcon;
  export const Lightbulb: LucideIcon;
  export const Network: LucideIcon;
  export const Pencil: LucideIcon;
  export const PenTool: LucideIcon;
  export const Send: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const Sprout: LucideIcon;
  export const Upload: LucideIcon;
  export const Wrench: LucideIcon;
}
