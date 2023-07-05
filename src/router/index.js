import WorkManage from "@pages/WorkManage";
import MemberAdminManage from "@pages/MemberAdminManage";
import RoleAdminManage from '@pages/RoleAdminManage';
import Login from '@pages/Login';
import SettingsManage from '@pages/SettingsManage';

export const RoutePages = [
    {
        name: 'Login',
        path: '/login',
        element: Login
    },
    {
        name: 'WorkManage',
        path: '/work',
        element: WorkManage
    },
    {
        name: 'MemberAdminManage',
        path: '/memberadmin',
        element: MemberAdminManage
    },
    {
        name: 'RoleAdmin',
        path: '/roleadmin',
        element: RoleAdminManage
    }
    ,
    {
        name: 'Settings',
        path: '/settings/*',
        element: SettingsManage
    }
];