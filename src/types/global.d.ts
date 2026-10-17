declare global {
  interface Window {
    /**
     * Navigate to the auth page with a custom redirect URL
     * @param redirectUrl - URL to redirect to after successful authentication
     */
    navigateToAuth: (redirectUrl: string) => void;
  }
}

// Allow builds to pass even if Convex codegen is temporarily unavailable
declare module "@/convex/_generated/api" {
  export const api: any;
  export const internal: any;
}

export {};