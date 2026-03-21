/**
 * Portfolio TypeScript Types
 * Matching Backend DTOs from gametout backend
 */

// ===========================================
// ENUMS (matching Java enums)
// ===========================================

export enum JobCategory {
  // Legacy categories
  DEVELOPMENT = "DEVELOPMENT",
  DESIGN = "DESIGN",
  MARKETING = "MARKETING",
  SALES = "SALES",
  CUSTOMER_SUPPORT = "CUSTOMER_SUPPORT",
  HUMAN_RESOURCES = "HUMAN_RESOURCES",
  FINANCE = "FINANCE",
  OPERATIONS = "OPERATIONS",
  PRODUCT_MANAGEMENT = "PRODUCT_MANAGEMENT",
  PROGRAMMER = "PROGRAMMER",
  ARTIST = "ARTIST",
  DESIGNER = "DESIGNER",
  AUDIO = "AUDIO",
  PRODUCER = "PRODUCER",
  ANIMATOR = "ANIMATOR",
  COMMUNITY_MANAGER = "COMMUNITY_MANAGER",
  COMPOSER = "COMPOSER",
  LEVEL_DESIGNER = "LEVEL_DESIGNER",
  MARKETING_ENGINEER = "MARKETING_ENGINEER",
  MUSICIAN = "MUSICIAN",
  PRODUCT_MANAGER = "PRODUCT_MANAGER",
  QA_TESTER = "QA_TESTER",
  PROJECT_MANAGER = "PROJECT_MANAGER",
  WRITER = "WRITER",
  SOUND_ENGINEER = "SOUND_ENGINEER",
  TRANSLATOR = "TRANSLATOR",
  UI_UX_DESIGNER = "UI_UX_DESIGNER",
  USER_ACQUISITION_ENGINEER = "USER_ACQUISITION_ENGINEER",
  VIDEO_EDITOR = "VIDEO_EDITOR",
  VFX_ARTIST = "VFX_ARTIST",
  V0_ARTIST = "V0_ARTIST",
  MENTOR = "MENTOR",
  BIZDEV = "BIZDEV",
  OTHER = "OTHER",
  
  // Very New - Programming
  GAMEPLAY_PROGRAMMER = "GAMEPLAY_PROGRAMMER",
  ENGINE_PROGRAMMER = "ENGINE_PROGRAMMER",
  GRAPHICS_PROGRAMMER = "GRAPHICS_PROGRAMMER",
  AI_PROGRAMMER = "AI_PROGRAMMER",
  NETWORK_ENGINEER = "NETWORK_ENGINEER",
  MULTIPLAYER_ENGINEER = "MULTIPLAYER_ENGINEER",
  TOOLS_PROGRAMMER = "TOOLS_PROGRAMMER",
  BUILD_ENGINEER = "BUILD_ENGINEER",
  DEV_OPS_ENGINEER = "DEV_OPS_ENGINEER",
  PLATFORM_ENGINEER = "PLATFORM_ENGINEER",
  PHYSICS_PROGRAMMER = "PHYSICS_PROGRAMMER",
  UI_PROGRAMMER = "UI_PROGRAMMER",
  AR_VR_DEVELOPER = "AR_VR_DEVELOPER",
  MOBILE_GAME_DEVELOPER = "MOBILE_GAME_DEVELOPER",
  BACKEND_GAME_DEVELOPER = "BACKEND_GAME_DEVELOPER",
  ONLINE_SERVICES_ENGINEER = "ONLINE_SERVICES_ENGINEER",
  
  // Very New - Art
  CONCEPT_ARTIST = "CONCEPT_ARTIST",
  ENVIRONMENT_ARTIST = "ENVIRONMENT_ARTIST",
  CHARACTER_ARTIST = "CHARACTER_ARTIST",
  PROP_ARTIST = "PROP_ARTIST",
  TEXTURE_ARTIST = "TEXTURE_ARTIST",
  LIGHTING_ARTIST = "LIGHTING_ARTIST",
  TECHNICAL_ARTIST = "TECHNICAL_ARTIST",
  CHARACTER_MODELER = "CHARACTER_MODELER",
  ENVIRONMENT_MODELER = "ENVIRONMENT_MODELER",
  CINEMATIC_ARTIST = "CINEMATIC_ARTIST",
  MOTION_CAPTURE_ARTIST = "MOTION_CAPTURE_ARTIST",
  MATTE_PAINTER = "MATTE_PAINTER",
  
  // Very New - Animation
  THREE_D_ANIMATOR = "THREE_D_ANIMATOR",
  TWO_D_ANIMATOR = "TWO_D_ANIMATOR",
  CHARACTER_ANIMATOR = "CHARACTER_ANIMATOR",
  GAMEPLAY_ANIMATOR = "GAMEPLAY_ANIMATOR",
  TECHNICAL_ANIMATOR = "TECHNICAL_ANIMATOR",
  MOTION_CAPTURE_ANIMATOR = "MOTION_CAPTURE_ANIMATOR",
  
  // Very New - Design
  GAME_DESIGNER = "GAME_DESIGNER",
  SYSTEMS_DESIGNER = "SYSTEMS_DESIGNER",
  NARRATIVE_DESIGNER = "NARRATIVE_DESIGNER",
  COMBAT_DESIGNER = "COMBAT_DESIGNER",
  ECONOMY_DESIGNER = "ECONOMY_DESIGNER",
  MONETIZATION_DESIGNER = "MONETIZATION_DESIGNER",
  PUZZLE_DESIGNER = "PUZZLE_DESIGNER",
  MULTIPLAYER_DESIGNER = "MULTIPLAYER_DESIGNER",
  
  // Very New - Audio
  AUDIO_PROGRAMMER = "AUDIO_PROGRAMMER",
  MUSIC_PRODUCER = "MUSIC_PRODUCER",
  DIALOGUE_EDITOR = "DIALOGUE_EDITOR",
  FOLEY_ARTIST = "FOLEY_ARTIST",
  
  // Very New - QA
  QA_ENGINEER = "QA_ENGINEER",
  QA_AUTOMATION_ENGINEER = "QA_AUTOMATION_ENGINEER",
  GAME_TESTER = "GAME_TESTER",
  COMPATIBILITY_TESTER = "COMPATIBILITY_TESTER",
  
  // Very New - Production
  ASSOCIATE_PRODUCER = "ASSOCIATE_PRODUCER",
  EXECUTIVE_PRODUCER = "EXECUTIVE_PRODUCER",
  RELEASE_MANAGER = "RELEASE_MANAGER",
  DEVELOPMENT_DIRECTOR = "DEVELOPMENT_DIRECTOR",
  
  // Very New - Marketing/Community
  SOCIAL_MEDIA_MANAGER = "SOCIAL_MEDIA_MANAGER",
  PUBLISHING_MANAGER = "PUBLISHING_MANAGER",
  BRAND_MANAGER = "BRAND_MANAGER",
  PR_MANAGER = "PR_MANAGER",
  
  // Very New - Operations
  LIVE_OPS_MANAGER = "LIVE_OPS_MANAGER",
  GAME_OPERATIONS_MANAGER = "GAME_OPERATIONS_MANAGER",
  EVENT_MANAGER = "EVENT_MANAGER",
  
  // Very New - Analytics
  MONETIZATION_ANALYST = "MONETIZATION_ANALYST",
  GAME_DATA_ANALYST = "GAME_DATA_ANALYST",
  DATA_SCIENTIST = "DATA_SCIENTIST",
  PLAYER_INSIGHTS_ANALYST = "PLAYER_INSIGHTS_ANALYST",
  ECONOMY_ANALYST = "ECONOMY_ANALYST",
  
  // Very New - Writing/Localization
  LOCALIZATION_SPECIALIST = "LOCALIZATION_SPECIALIST",
  TECHNICAL_WRITER = "TECHNICAL_WRITER",
  GAME_WRITER = "GAME_WRITER",
  LORE_DESIGNER = "LORE_DESIGNER",
  
  // Very New - Other
  ESPORTS_MANAGER = "ESPORTS_MANAGER",
  PLAYTEST_COORDINATOR = "PLAYTEST_COORDINATOR",
  ACCESSIBILITY_DESIGNER = "ACCESSIBILITY_DESIGNER",
  USER_RESEARCHER = "USER_RESEARCHER",
}

export enum JobProfileStatus {
  OPEN = "OPEN",
  FREELANCE = "FREELANCE",
  DEPLOYED = "DEPLOYED",
}

export enum GameEngine {
  UNITY = "UNITY",
  UNREAL = "UNREAL",
  GODOT = "GODOT",
  OTHER = "OTHER",
}

// ===========================================
// CATEGORY MAPPING (Frontend Display ↔ Backend)
// ===========================================

/** Map frontend display names to backend enum values */
export const CATEGORY_TO_BACKEND: Record<string, JobCategory> = {
  // Legacy
  "Programmer": JobCategory.PROGRAMMER,
  "Developer": JobCategory.PROGRAMMER,
  "Software Engineer": JobCategory.PROGRAMMER,
  "Artist": JobCategory.ARTIST,
  "2D Artist": JobCategory.ARTIST,
  "3D Artist": JobCategory.V0_ARTIST, 
  "VFX Artist": JobCategory.VFX_ARTIST,
  "Designer": JobCategory.DESIGNER,
  "Level Designer": JobCategory.LEVEL_DESIGNER,
  "UI/UX Designer": JobCategory.UI_UX_DESIGNER,
  "Audio": JobCategory.AUDIO,
  "Sound Engineer": JobCategory.SOUND_ENGINEER,
  "Composer": JobCategory.COMPOSER,
  "Musician": JobCategory.MUSICIAN,
  "Producer": JobCategory.PRODUCER,
  "Project Manager": JobCategory.PROJECT_MANAGER,
  "Product Manager": JobCategory.PRODUCT_MANAGER,
  "Community Manager": JobCategory.COMMUNITY_MANAGER,
  "Marketing": JobCategory.MARKETING_ENGINEER,
  "Marketing Engineer": JobCategory.MARKETING_ENGINEER,
  "BizDev": JobCategory.BIZDEV,
  "QA Tester": JobCategory.QA_TESTER,
  "Writer": JobCategory.WRITER,
  "Translator": JobCategory.TRANSLATOR,
  "Video Editor": JobCategory.VIDEO_EDITOR,
  "Animator": JobCategory.ANIMATOR,
  "Mentor": JobCategory.MENTOR,
  "User Acquisition Engineer": JobCategory.USER_ACQUISITION_ENGINEER,
  "Other": JobCategory.OTHER,
  
  // Very New - Programming
  "Gameplay Programmer": JobCategory.GAMEPLAY_PROGRAMMER,
  "Engine Programmer": JobCategory.ENGINE_PROGRAMMER,
  "Graphics Programmer": JobCategory.GRAPHICS_PROGRAMMER,
  "AI Programmer": JobCategory.AI_PROGRAMMER,
  "Network Engineer": JobCategory.NETWORK_ENGINEER,
  "Multiplayer Engineer": JobCategory.MULTIPLAYER_ENGINEER,
  "Tools Programmer": JobCategory.TOOLS_PROGRAMMER,
  "Build Engineer": JobCategory.BUILD_ENGINEER,
  "DevOps Engineer": JobCategory.DEV_OPS_ENGINEER,
  "Platform Engineer": JobCategory.PLATFORM_ENGINEER,
  "Physics Programmer": JobCategory.PHYSICS_PROGRAMMER,
  "UI Programmer": JobCategory.UI_PROGRAMMER,
  "AR/VR Developer": JobCategory.AR_VR_DEVELOPER,
  "Mobile Game Developer": JobCategory.MOBILE_GAME_DEVELOPER,
  "Backend Game Developer": JobCategory.BACKEND_GAME_DEVELOPER,
  "Online Services Engineer": JobCategory.ONLINE_SERVICES_ENGINEER,
  
  // Very New - Art
  "Concept Artist": JobCategory.CONCEPT_ARTIST,
  "Environment Artist": JobCategory.ENVIRONMENT_ARTIST,
  "Character Artist": JobCategory.CHARACTER_ARTIST,
  "Prop Artist": JobCategory.PROP_ARTIST,
  "Texture Artist": JobCategory.TEXTURE_ARTIST,
  "Lighting Artist": JobCategory.LIGHTING_ARTIST,
  "Technical Artist": JobCategory.TECHNICAL_ARTIST,
  "Character Modeler": JobCategory.CHARACTER_MODELER,
  "Environment Modeler": JobCategory.ENVIRONMENT_MODELER,
  "Cinematic Artist": JobCategory.CINEMATIC_ARTIST,
  "Motion Capture Artist": JobCategory.MOTION_CAPTURE_ARTIST,
  "Matte Painter": JobCategory.MATTE_PAINTER,
  
  // Very New - Animation
  "3D Animator": JobCategory.THREE_D_ANIMATOR,
  "2D Animator": JobCategory.TWO_D_ANIMATOR,
  "Character Animator": JobCategory.CHARACTER_ANIMATOR,
  "Gameplay Animator": JobCategory.GAMEPLAY_ANIMATOR,
  "Technical Animator": JobCategory.TECHNICAL_ANIMATOR,
  "Motion Capture Animator": JobCategory.MOTION_CAPTURE_ANIMATOR,
  
  // Very New - Design
  "Game Designer": JobCategory.GAME_DESIGNER,
  "Systems Designer": JobCategory.SYSTEMS_DESIGNER,
  "Narrative Designer": JobCategory.NARRATIVE_DESIGNER,
  "Combat Designer": JobCategory.COMBAT_DESIGNER,
  "Economy Designer": JobCategory.ECONOMY_DESIGNER,
  "Monetization Designer": JobCategory.MONETIZATION_DESIGNER,
  "Puzzle Designer": JobCategory.PUZZLE_DESIGNER,
  "Multiplayer Designer": JobCategory.MULTIPLAYER_DESIGNER,
  
  // Very New - Audio
  "Audio Programmer": JobCategory.AUDIO_PROGRAMMER,
  "Music Producer": JobCategory.MUSIC_PRODUCER,
  "Dialogue Editor": JobCategory.DIALOGUE_EDITOR,
  "Foley Artist": JobCategory.FOLEY_ARTIST,
  
  // Very New - QA
  "QA Engineer": JobCategory.QA_ENGINEER,
  "QA Automation Engineer": JobCategory.QA_AUTOMATION_ENGINEER,
  "Game Tester": JobCategory.GAME_TESTER,
  "Compatibility Tester": JobCategory.COMPATIBILITY_TESTER,
  
  // Very New - Production
  "Associate Producer": JobCategory.ASSOCIATE_PRODUCER,
  "Executive Producer": JobCategory.EXECUTIVE_PRODUCER,
  "Release Manager": JobCategory.RELEASE_MANAGER,
  "Development Director": JobCategory.DEVELOPMENT_DIRECTOR,
  
  // Very New - Marketing/Community
  "Social Media Manager": JobCategory.SOCIAL_MEDIA_MANAGER,
  "Publishing Manager": JobCategory.PUBLISHING_MANAGER,
  "Brand Manager": JobCategory.BRAND_MANAGER,
  "PR Manager": JobCategory.PR_MANAGER,
  
  // Very New - Operations
  "Live Ops Manager": JobCategory.LIVE_OPS_MANAGER,
  "Game Operations Manager": JobCategory.GAME_OPERATIONS_MANAGER,
  "Event Manager": JobCategory.EVENT_MANAGER,
  
  // Very New - Analytics
  "Monetization Analyst": JobCategory.MONETIZATION_ANALYST,
  "Game Data Analyst": JobCategory.GAME_DATA_ANALYST,
  "Data Scientist": JobCategory.DATA_SCIENTIST,
  "Player Insights Analyst": JobCategory.PLAYER_INSIGHTS_ANALYST,
  "Economy Analyst": JobCategory.ECONOMY_ANALYST,
  
  // Very New - Writing/Localization
  "Localization Specialist": JobCategory.LOCALIZATION_SPECIALIST,
  "Technical Writer": JobCategory.TECHNICAL_WRITER,
  "Game Writer": JobCategory.GAME_WRITER,
  "Lore Designer": JobCategory.LORE_DESIGNER,
  
  // Very New - Other
  "Esports Manager": JobCategory.ESPORTS_MANAGER,
  "Playtest Coordinator": JobCategory.PLAYTEST_COORDINATOR,
  "Accessibility Designer": JobCategory.ACCESSIBILITY_DESIGNER,
  "User Researcher": JobCategory.USER_RESEARCHER,
};

/** Map backend enum to frontend display names */
export const BACKEND_TO_CATEGORY: Record<JobCategory, string> = {
  // Legacy
  [JobCategory.DEVELOPMENT]: "Developer",
  [JobCategory.DESIGN]: "Designer",
  [JobCategory.MARKETING]: "Marketing",
  [JobCategory.SALES]: "Sales",
  [JobCategory.CUSTOMER_SUPPORT]: "Customer Support",
  [JobCategory.HUMAN_RESOURCES]: "HR",
  [JobCategory.FINANCE]: "Finance",
  [JobCategory.OPERATIONS]: "Operations",
  [JobCategory.PRODUCT_MANAGEMENT]: "Product Manager",
  [JobCategory.PROGRAMMER]: "Programmer",
  [JobCategory.ARTIST]: "Artist",
  [JobCategory.DESIGNER]: "Designer",
  [JobCategory.AUDIO]: "Audio",
  [JobCategory.PRODUCER]: "Producer",
  [JobCategory.ANIMATOR]: "Animator",
  [JobCategory.COMMUNITY_MANAGER]: "Community Manager",
  [JobCategory.COMPOSER]: "Composer",
  [JobCategory.LEVEL_DESIGNER]: "Level Designer",
  [JobCategory.MARKETING_ENGINEER]: "Marketing Engineer",
  [JobCategory.MUSICIAN]: "Musician",
  [JobCategory.PRODUCT_MANAGER]: "Product Manager",
  [JobCategory.QA_TESTER]: "QA Tester",
  [JobCategory.PROJECT_MANAGER]: "Project Manager",
  [JobCategory.WRITER]: "Writer",
  [JobCategory.SOUND_ENGINEER]: "Sound Engineer",
  [JobCategory.TRANSLATOR]: "Translator",
  [JobCategory.UI_UX_DESIGNER]: "UI/UX Designer",
  [JobCategory.USER_ACQUISITION_ENGINEER]: "User Acquisition Engineer",
  [JobCategory.VIDEO_EDITOR]: "Video Editor",
  [JobCategory.VFX_ARTIST]: "VFX Artist",
  [JobCategory.V0_ARTIST]: "3D Artist",
  [JobCategory.MENTOR]: "Mentor",
  [JobCategory.BIZDEV]: "BizDev",
  [JobCategory.OTHER]: "Other",
  
  // Very New - Programming
  [JobCategory.GAMEPLAY_PROGRAMMER]: "Gameplay Programmer",
  [JobCategory.ENGINE_PROGRAMMER]: "Engine Programmer",
  [JobCategory.GRAPHICS_PROGRAMMER]: "Graphics Programmer",
  [JobCategory.AI_PROGRAMMER]: "AI Programmer",
  [JobCategory.NETWORK_ENGINEER]: "Network Engineer",
  [JobCategory.MULTIPLAYER_ENGINEER]: "Multiplayer Engineer",
  [JobCategory.TOOLS_PROGRAMMER]: "Tools Programmer",
  [JobCategory.BUILD_ENGINEER]: "Build Engineer",
  [JobCategory.DEV_OPS_ENGINEER]: "DevOps Engineer",
  [JobCategory.PLATFORM_ENGINEER]: "Platform Engineer",
  [JobCategory.PHYSICS_PROGRAMMER]: "Physics Programmer",
  [JobCategory.UI_PROGRAMMER]: "UI Programmer",
  [JobCategory.AR_VR_DEVELOPER]: "AR/VR Developer",
  [JobCategory.MOBILE_GAME_DEVELOPER]: "Mobile Game Developer",
  [JobCategory.BACKEND_GAME_DEVELOPER]: "Backend Game Developer",
  [JobCategory.ONLINE_SERVICES_ENGINEER]: "Online Services Engineer",
  
  // Very New - Art
  [JobCategory.CONCEPT_ARTIST]: "Concept Artist",
  [JobCategory.ENVIRONMENT_ARTIST]: "Environment Artist",
  [JobCategory.CHARACTER_ARTIST]: "Character Artist",
  [JobCategory.PROP_ARTIST]: "Prop Artist",
  [JobCategory.TEXTURE_ARTIST]: "Texture Artist",
  [JobCategory.LIGHTING_ARTIST]: "Lighting Artist",
  [JobCategory.TECHNICAL_ARTIST]: "Technical Artist",
  [JobCategory.CHARACTER_MODELER]: "Character Modeler",
  [JobCategory.ENVIRONMENT_MODELER]: "Environment Modeler",
  [JobCategory.CINEMATIC_ARTIST]: "Cinematic Artist",
  [JobCategory.MOTION_CAPTURE_ARTIST]: "Motion Capture Artist",
  [JobCategory.MATTE_PAINTER]: "Matte Painter",
  
  // Very New - Animation
  [JobCategory.THREE_D_ANIMATOR]: "3D Animator",
  [JobCategory.TWO_D_ANIMATOR]: "2D Animator",
  [JobCategory.CHARACTER_ANIMATOR]: "Character Animator",
  [JobCategory.GAMEPLAY_ANIMATOR]: "Gameplay Animator",
  [JobCategory.TECHNICAL_ANIMATOR]: "Technical Animator",
  [JobCategory.MOTION_CAPTURE_ANIMATOR]: "Motion Capture Animator",
  
  // Very New - Design
  [JobCategory.GAME_DESIGNER]: "Game Designer",
  [JobCategory.SYSTEMS_DESIGNER]: "Systems Designer",
  [JobCategory.NARRATIVE_DESIGNER]: "Narrative Designer",
  [JobCategory.COMBAT_DESIGNER]: "Combat Designer",
  [JobCategory.ECONOMY_DESIGNER]: "Economy Designer",
  [JobCategory.MONETIZATION_DESIGNER]: "Monetization Designer",
  [JobCategory.PUZZLE_DESIGNER]: "Puzzle Designer",
  [JobCategory.MULTIPLAYER_DESIGNER]: "Multiplayer Designer",
  
  // Very New - Audio
  [JobCategory.AUDIO_PROGRAMMER]: "Audio Programmer",
  [JobCategory.MUSIC_PRODUCER]: "Music Producer",
  [JobCategory.DIALOGUE_EDITOR]: "Dialogue Editor",
  [JobCategory.FOLEY_ARTIST]: "Foley Artist",
  
  // Very New - QA
  [JobCategory.QA_ENGINEER]: "QA Engineer",
  [JobCategory.QA_AUTOMATION_ENGINEER]: "QA Automation Engineer",
  [JobCategory.GAME_TESTER]: "Game Tester",
  [JobCategory.COMPATIBILITY_TESTER]: "Compatibility Tester",
  
  // Very New - Production
  [JobCategory.ASSOCIATE_PRODUCER]: "Associate Producer",
  [JobCategory.EXECUTIVE_PRODUCER]: "Executive Producer",
  [JobCategory.RELEASE_MANAGER]: "Release Manager",
  [JobCategory.DEVELOPMENT_DIRECTOR]: "Development Director",
  
  // Very New - Marketing/Community
  [JobCategory.SOCIAL_MEDIA_MANAGER]: "Social Media Manager",
  [JobCategory.PUBLISHING_MANAGER]: "Publishing Manager",
  [JobCategory.BRAND_MANAGER]: "Brand Manager",
  [JobCategory.PR_MANAGER]: "PR Manager",
  
  // Very New - Operations
  [JobCategory.LIVE_OPS_MANAGER]: "Live Ops Manager",
  [JobCategory.GAME_OPERATIONS_MANAGER]: "Game Operations Manager",
  [JobCategory.EVENT_MANAGER]: "Event Manager",
  
  // Very New - Analytics
  [JobCategory.MONETIZATION_ANALYST]: "Monetization Analyst",
  [JobCategory.GAME_DATA_ANALYST]: "Game Data Analyst",
  [JobCategory.DATA_SCIENTIST]: "Data Scientist",
  [JobCategory.PLAYER_INSIGHTS_ANALYST]: "Player Insights Analyst",
  [JobCategory.ECONOMY_ANALYST]: "Economy Analyst",
  
  // Very New - Writing/Localization
  [JobCategory.LOCALIZATION_SPECIALIST]: "Localization Specialist",
  [JobCategory.TECHNICAL_WRITER]: "Technical Writer",
  [JobCategory.GAME_WRITER]: "Game Writer",
  [JobCategory.LORE_DESIGNER]: "Lore Designer",
  
  // Very New - Other
  [JobCategory.ESPORTS_MANAGER]: "Esports Manager",
  [JobCategory.PLAYTEST_COORDINATOR]: "Playtest Coordinator",
  [JobCategory.ACCESSIBILITY_DESIGNER]: "Accessibility Designer",
  [JobCategory.USER_RESEARCHER]: "User Researcher",
};

/** Map backend status to frontend display */
export const STATUS_DISPLAY: Record<JobProfileStatus, string> = {
  [JobProfileStatus.OPEN]: "Open for Work",
  [JobProfileStatus.FREELANCE]: "Freelance",
  [JobProfileStatus.DEPLOYED]: "Deployed",
};

/** Map frontend display to backend status */
export const DISPLAY_TO_STATUS: Record<string, JobProfileStatus> = {
  "Open for Work": JobProfileStatus.OPEN,
  "Freelance": JobProfileStatus.FREELANCE,
  "Deployed": JobProfileStatus.DEPLOYED,
};

// ===========================================
// DTOs (matching Java DTOs)
// ===========================================

/**
 * Skill data for portfolio
 * Matches: SkillDTO.java
 */
export interface SkillDTO {
  name: string;
  score: number; // 0-100
}

/**
 * Social link data
 * Matches: SocialLinkDTO.java
 */
export interface SocialLinkDTO {
  platform: string;
  url: string;
}

/**
 * Lightweight portfolio data for card/list views
 * Matches: PortfolioCardDTO.java
 */
export interface PortfolioCard {
  id: number;
  name: string;
  profilePhotoUrl: string | null;
  shortDescription: string | null;
  location: string | null;
  experienceYears: number | null;
  isPremium: boolean;
  jobStatus: JobProfileStatus;
  skills: SkillDTO[];
}

/**
 * Full portfolio data for detail view
 * Matches: PortfolioResponseDTO.java
 */
export interface PortfolioDetail {
  id: number;
  name: string;
  shortDescription: string | null;
  location: string | null;
  experienceYears: number | null;
  jobCategory: JobCategory;
  jobStatus: JobProfileStatus;
  isPremium: boolean;
  profileSummary: string | null;
  likesCount: number;
  coverPhotoUrl: string | null;
  profilePhotoUrl: string | null;
  contactEmail: string | null;
  mobile: string | null;
  resumeUrl: string | null;
  enginePreference?: GameEngine;
  skills: SkillDTO[];
  socials: SocialLinkDTO[];
  user?: {
    id: number;
    displayName: string;
  };
}

/**
 * Request payload for creating/updating portfolio
 * Matches: PortfolioRequest.java
 */
export interface PortfolioRequest {
  name: string;
  shortDescription: string;
  location: string;
  experienceYears: number;
  jobCategory: JobCategory;
  jobStatus: JobProfileStatus;
  profileSummary: string;
  coverPhotoUrl?: string;
  profilePhotoUrl?: string;
  contactEmail: string;
  mobile?: string;
  skills: SkillDTO[];
  socials: SocialLinkDTO[];
  resumeUrl?: string;
  enginePreference?: GameEngine;
}

// ===========================================
// API Response Types (Spring Page wrapper)
// ===========================================

/**
 * Spring Boot Page response wrapper
 */
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * Paginated portfolio list response
 */
export type PortfolioListResponse = PaginatedResponse<PortfolioDetail>;

/**
 * Paginated search results
 */
export type PortfolioSearchResponse = PaginatedResponse<PortfolioCard>;

/**
 * Filter options for portfolio search
 * Supports multiple categories and statuses (OR logic within each)
 */
export interface PortfolioFilters {
  categories: string[];          // Frontend display names (will be converted to backend enums)
  statuses: JobProfileStatus[];  // Backend status enums
}

/**
 * Advanced Filter Request
 * Sent to backend for complex multi-criteria filtering
 * 
 * All fields are optional (null = don't filter by this field)
 * Multiple values within a field use OR logic
 * Multiple fields use AND logic
 */
export interface AdvancedFilterRequest {
  jobCategories: JobCategory[];
  jobStatuses: JobProfileStatus[];
  skillNames: string[];
  minExperienceYears: number | null;
  maxExperienceYears: number | null;
  enginePreferences: GameEngine[];
  location: string | null;
  page: number;
  size: number;
}

/**
 * Experience level presets for UI
 */
export const EXPERIENCE_PRESETS = [
  { label: "Any", min: null, max: null },
  { label: "0-2 years", min: 0, max: 2 },
  { label: "2-5 years", min: 2, max: 5 },
  { label: "5-10 years", min: 5, max: 10 },
  { label: "10+ years", min: 10, max: null },
];

/**
 * Game engine options for UI
 */
export const ALL_GAME_ENGINES = [
  { label: "Unity", value: "UNITY" },
  { label: "Unreal", value: "UNREAL" },
  { label: "Godot", value: "GODOT" },
  { label: "Other", value: "OTHER" },
];

// ===========================================
// Frontend UI Types (derived from backend data)
// ===========================================

/**
 * Normalized developer data for UI components
 * Maps backend DTO to frontend-friendly format
 */
export interface Developer {
  id: number;
  name: string;
  role: string; // shortDescription
  location: string;
  avatar: string;
  status: string; // Display string for JobProfileStatus
  exp: string; // Formatted experience
  badges: string[]; // Derived from skills
  skills: { name: string; level: number }[];
  category: string; // Frontend category name
  isPremium: boolean;
  rate?: string; // Optional - not from backend
  linkedinUrl?: string;
}

/**
 * Transform PortfolioCard to Developer for UI
 */
export function toDevelo(card: PortfolioCard): Developer {
  return {
    id: card.id,
    name: card.name || "Unknown",
    role: card.shortDescription || "Game Developer",
    location: card.location || "India",
    avatar: card.profilePhotoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    status: STATUS_DISPLAY[card.jobStatus] || "Open for Work",
    exp: card.experienceYears ? `${card.experienceYears} Yrs` : "N/A",
    badges: card.skills?.slice(0, 2).map(s => s.name) || [],
    skills: card.skills?.map(s => ({ name: s.name, level: s.score })) || [],
    category: "Programmer", // Will be set based on context
    isPremium: card.isPremium,
    linkedinUrl: undefined,
  };
}

/**
 * Transform PortfolioDetail to Developer for UI
 */
export function detailToDeveloper(detail: PortfolioDetail): Developer {
  const linkedinUrl = detail.socials?.find(
    (s) => s.platform?.toLowerCase() === "linkedin"
  )?.url ?? undefined;
  return {
    id: detail.id,
    name: detail.name || "Unknown",
    role: detail.shortDescription || "Game Developer",
    location: detail.location || "India",
    avatar: detail.profilePhotoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    status: STATUS_DISPLAY[detail.jobStatus] || "Open for Work",
    exp: detail.experienceYears ? `${detail.experienceYears} Yrs` : "N/A",
    badges: detail.skills?.slice(0, 3).map(s => s.name) || [],
    skills: detail.skills?.map(s => ({ name: s.name, level: s.score })) || [],
    category: BACKEND_TO_CATEGORY[detail.jobCategory] || "Other",
    isPremium: detail.isPremium,
    linkedinUrl,
  };
}
