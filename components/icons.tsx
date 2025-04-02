import {
    Loader2,
    LucideProps,
    Moon,
    SunMedium,
    Twitter,
    ThumbsUp,
    MessageSquare,
    LayoutGrid,
    LayoutDashboard,
    Sparkles,
    LogOut,
    LogIn,
    UserPlus,
    ArrowRight,
    ArrowLeft,
    Lock,
    Inbox,
    type Icon as LucideIcon,
    Sun,
    Laptop,
    Settings,
    User,
    Github,
    Google,
    X,
    Plus,
    Menu,
    ThumbsDown,
    Mail,
    ChevronLeft,
    ChevronRight,
  } from "lucide-react"
  
  export type Icon = typeof LucideIcon
  
  export const Icons = {
    sun: Sun,
    moon: Moon,
    laptop: Laptop,
    logout: LogOut,
    settings: Settings,
    user: User,
    github: Github,
    spinner: Loader2,
    x: X,
    plus: Plus,
    thumbsUp: ThumbsUp,
    thumbsDown: ThumbsDown,
    inbox: Inbox,
    twitter: Twitter,
    mail: Mail,
    layoutGrid: LayoutGrid,
    layoutDashboard: LayoutDashboard,
    sparkles: Sparkles,
    logIn: LogIn,
    userPlus: UserPlus,
    arrowRight: ArrowRight,
    arrowLeft: ArrowLeft,
    lock: Lock,
    message: MessageSquare,
    google: ({ ...props }: LucideProps) => (
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="google"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 488 512"
        {...props}
      >
        <path
          fill="currentColor"
          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
        ></path>
      </svg>
    ),
    menu: Menu,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
  } 