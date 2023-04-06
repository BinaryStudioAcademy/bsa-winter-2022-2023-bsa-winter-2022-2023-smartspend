const AppRoute = {
    ROOT: '/',
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    USER: '/user',
    DASHBOARD: '/dashboard',
    BUDGETS: '/budgets',
    WALLETS: '/wallets',
    UI: '/ui',
    WALLET_DETAILS: '/wallet/:id',
    CATEGORIES: '/categories',
    BUDGETS_DETAILS: '/budgets/:id',
    NOT_FOUND: '*',
    WALLET: '/wallet',
} as const;

export { AppRoute };
