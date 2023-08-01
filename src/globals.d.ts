declare global {
  interface Google {
    accounts: {
      id: {
        initialize: (input: IdConfiguration) => void;
        prompt: (momentListener?: (res: PromptMomentNotification) => void) => void;
        renderButton: (parent: HTMLElement, options: GsiButtonConfiguration) => void;
        disableAutoSelect: () => void;
        storeCredential: (credentials: Credential, callback: () => void) => void;
        cancel: () => void;
        onGoogleLibraryLoad: () => void;
        revoke: (hint: string, callback: (done: RevocationResponse) => void) => void;
      };
    };
  }

  interface Window {
    google?: Google;
  }
}

export {};
