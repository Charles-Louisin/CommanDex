'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Link from 'next/link';
import {
  LayoutDashboard,
  TableProperties,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { BiFoodMenu } from 'react-icons/bi';
import { HiOutlineCreditCard } from 'react-icons/hi2';
import { PiBowlFood } from 'react-icons/pi';
import { HiOutlineLogout } from 'react-icons/hi';
import { OnlineStatus } from '@/components/shared/OnlineStatus';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { useTranslations } from '@/hooks/useTranslations';

export default function ReceptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslations();
  const [collapsed, setCollapsed] = useState(false);
  const params = useParams();
  const locale = params?.lang as string || 'en';

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        backgroundColor="#FFFFFF"
        width="280px"
        collapsedWidth="80px"
        className="border-r border-border"
        style={{ height: '100vh' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!collapsed && (
              <h1 className="text-2xl font-bold text-primary">CommanDex</h1>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg bg-primary-50 text-primary hover:bg-primary-100 transition-colors ml-auto"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* Menu */}
          <Menu
            menuItemStyles={{
              button: {
                backgroundColor: 'transparent',
                color: '#0F766E', // Green by default for brand consistency
                '&:hover': {
                  backgroundColor: '#E6F7F6',
                  color: '#0A5D56', // Darker green on hover
                },
                '&.active': {
                  backgroundColor: '#0F766E',
                  color: '#FFFFFF',
                },
              },
            }}
          >
            <MenuItem
              icon={<LayoutDashboard size={20} />}
              component={<Link href={`/${locale}/reception/dashboard`} />}
            >
              {t('reception.sidebar.dashboard')}
            </MenuItem>
            <MenuItem
              icon={<TableProperties size={20} />}
              component={<Link href={`/${locale}/reception/tables`} />}
            >
              {t('reception.sidebar.tables')}
            </MenuItem>
            <MenuItem
              icon={<PiBowlFood size={20} />}
              component={<Link href={`/${locale}/reception/orders`} />}
            >
              {t('reception.sidebar.orders')}
            </MenuItem>
            <MenuItem
              icon={<HiOutlineCreditCard size={20} />}
              component={<Link href={`/${locale}/reception/payments`} />}
            >
              {t('reception.sidebar.payments')}
            </MenuItem>
            <SubMenu icon={<BiFoodMenu size={20} />} label={t('reception.sidebar.menuManagement')}>
              <MenuItem component={<Link href={`/${locale}/reception/menu/categories`} />}>
                {t('reception.sidebar.categories')}
              </MenuItem>
              <MenuItem component={<Link href={`/${locale}/reception/menu/products`} />}>
                {t('reception.sidebar.products')}
              </MenuItem>
            </SubMenu>
            <SubMenu icon={<Settings size={20} />} label={t('reception.sidebar.settings')}>
              <MenuItem component={<Link href={`/${locale}/reception/settings/general`} />}>
                {t('reception.sidebar.general')}
              </MenuItem>
              <MenuItem component={<Link href={`/${locale}/reception/settings/users`} />}>
                {t('reception.sidebar.users')}
              </MenuItem>
            </SubMenu>
          </Menu>

          {/* Footer */}
          <div className="mt-auto p-4 border-t border-border">
            <button
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-left text-red-500"
            >
              <HiOutlineLogout size={20} className="text-red-500" />
              {!collapsed && <span className="text-red-500 font-medium">{t('reception.sidebar.logout')}</span>}
            </button>
          </div>
        </div>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">{t('reception.portal')}</h2>
          <div className="flex items-center gap-4">
            <OnlineStatus />
            <LanguageSwitcher />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-bg-light">
          {children}
        </main>
      </div>
    </div>
  );
}

