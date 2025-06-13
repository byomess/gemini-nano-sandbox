import {
    AlertTriangle,
    Check,
    CheckCircle,
    Chrome,
    Clock,
    Copy,
    Cpu,
    Download,
    ExternalLink,
    HardDrive,
    Info,
    Link,
    Loader2,
    Monitor,
    Package,
    Play,
    RefreshCw,
    Rocket,
    RotateCcw,
    Search,
    Settings,
    Sparkles,
    Square,
    Target,
    Terminal,
    Wifi,
    Wrench,
    XCircle
} from 'lucide-react';
import React from 'react';

// --- Ícones do Lucide React para uso fácil ---
export const IconSparkles = Sparkles;
export const IconLoader = ({ className, ...props }: React.ComponentProps<typeof Loader2>) => (
    <Loader2 className={`animate-spin ${className || ''}`} {...props} />
);
export const IconAlertTriangle = AlertTriangle;
export const IconInfo = Info;
export const IconDownload = Download;
export const IconSettings = Settings;
export const IconPlay = Play;
export const IconStop = Square;
export const IconCheckCircle = CheckCircle;
export const IconXCircle = XCircle;
export const IconClock = Clock;
export const IconRocket = Rocket;
export const IconChrome = Chrome;
export const IconSearch = Search;
export const IconPackage = Package;
export const IconWrench = Wrench;
export const IconExternalLink = ExternalLink;
export const IconCopy = Copy;
export const IconCheck = Check;
export const IconRefresh = RefreshCw;
export const IconTerminal = Terminal;
export const IconMonitor = Monitor;
export const IconHardDrive = HardDrive;
export const IconCpu = Cpu;
export const IconWifi = Wifi;
export const IconLink = Link;
export const IconTarget = Target;
export const IconRotate = RotateCcw;
export const IconX = ({ className, ...props }: React.ComponentProps<'svg'>) => (
    <XCircle className={className} {...props} />
);
