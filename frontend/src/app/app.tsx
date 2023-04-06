import { library } from '@fortawesome/fontawesome-svg-core';

import { actions as authActions } from '~/bundles/auth/store';
import {
    Header,
    RouterOutlet,
} from '~/bundles/common/components/components.js';
import { dataTabs } from '~/bundles/common/config/header-tabs.config.js';
import { AppRoute } from '~/bundles/common/enums/enums.js';
import {
    useAppDispatch,
    UseAppPwaHook,
    useAppSelector,
    useEffect,
    useLocation,
} from '~/bundles/common/hooks/hooks.js';
import { iconProvider } from '~/bundles/common/icon-provider';
import { actions as currenciesActions } from '~/bundles/currencies/store';
import { actions as userActions } from '~/bundles/users/store';
import { storage, StorageKey } from '~/framework/storage/storage';

library.add(iconProvider);

const App: React.FC = () => {
    const { pathname } = useLocation();
    const token = storage.getSync(StorageKey.TOKEN);
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const isRoot = pathname === AppRoute.ROOT;

    const Modal = UseAppPwaHook(token);

    useEffect(() => {
        if (isRoot) {
            void dispatch(userActions.loadAll());
        }
    }, [dispatch, isRoot]);

    useEffect(() => {
        if (!user && token) {
            void dispatch(authActions.loadUser());
        }
    }, [dispatch, token, user]);

    useEffect(() => {
        if (token) {
            void dispatch(currenciesActions.loadAll());
        }
    }, [dispatch, token]);

    return (
        <>
            <Header name={user?.email} dataTabs={dataTabs} />
            <RouterOutlet />
            {Modal}
        </>
    );
};

export { App };
