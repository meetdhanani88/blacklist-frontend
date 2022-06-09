// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconHelp };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
    id: 'sample-docs-roadmap',
    type: 'group',
    children: [
        // {
        //     id: 'sample-page',
        //     title: 'Sample Page',
        //     type: 'item',
        //     url: 'admin/sample-page',
        //     icon: icons.IconBrandChrome,
        //     breadcrumbs: false
        // },
        {
            id: 'documentation',
            title: 'Documentation',
            type: 'item',
            url: 'https://docs.google.com/document/d/1G2y70Ac2JfuhFxMQgIkbN93KQ2XrBGSImFrudPugnWE/edit',
            icon: icons.IconHelp,
            external: true,
            target: true
        }
    ]
};

export default other;
