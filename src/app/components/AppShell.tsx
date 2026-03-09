import { ReactNode, useState } from 'react';
import { useLocation, Link } from 'react-router';
import { 
  Home, Building2, BookOpen, FileText, 
  BarChart3, FileBarChart, Settings, Shield, 
  Users, Leaf, ChevronDown, Menu, X, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { entities } from '../services/mockBackend';

interface AppShellProps {
  children: ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  icon: typeof Home;
  permission?: string;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/entity-period', label: 'Entity & Period', icon: Building2, permission: 'entity:read' },
  { path: '/chart-of-accounts', label: 'Chart of Accounts', icon: BookOpen, permission: 'chart_of_accounts:read' },
  { path: '/journal', label: 'Journal', icon: FileText, permission: 'journal:write' },
  { path: '/ledger', label: 'Ledger', icon: BookOpen, permission: 'ledger:read' },
  { path: '/trial-balance', label: 'Trial Balance', icon: BarChart3, permission: 'balance:read' },
  { path: '/balance', label: 'Balance', icon: BarChart3, permission: 'balance:read' },
  { path: '/reports', label: 'Reports', icon: FileBarChart, permission: 'report:read' },
  { path: '/close-period', label: 'Close Period', icon: Calendar, permission: 'period:manage' },
  { path: '/configuration', label: 'Configuration', icon: Settings, permission: 'configuration:read' },
  { path: '/administration', label: 'Administration', icon: Users, permission: 'entity:manage' },
  { path: '/audit-log', label: 'Audit Log', icon: Shield, permission: 'audit_log:read' },
  { path: '/sustainability', label: 'Sustainability', icon: Leaf, permission: 'sustainability:read' }
];

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const { currentUser, selectedEntity, setSelectedEntity, hasPermission } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [entityDropdownOpen, setEntityDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const filteredNavItems = navItems.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  const getBreadcrumb = () => {
    const path = location.pathname;
    const parts = ['Home'];
    
    const navItem = navItems.find(item => path.startsWith(item.path));
    if (navItem && navItem.path !== '/dashboard') {
      parts.push(navItem.label);
    }
    
    if (path.startsWith('/ledger/') && path !== '/ledger') {
      parts.push('Entry Detail');
    }
    
    if (path.startsWith('/reverse-entry')) {
      parts.push('Reverse Entry');
    }
    
    return parts;
  };

  const breadcrumb = getBreadcrumb();

  // Role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-300';
      case 'accountant': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'auditor': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'viewer': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#f5f5f5]">
      {/* Top Bar - SIN LOGO según diseño */}
      <div className="h-12 bg-[#e8e8e8] border-b border-[#c0c0c0] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-[#d0d0d0] rounded"
            title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          {/* Entity Selector */}
          <div className="relative">
            <button
              onClick={() => setEntityDropdownOpen(!entityDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1 bg-white border border-[#c0c0c0] rounded hover:bg-[#f9f9f9]"
            >
              <Building2 size={16} />
              <span className="text-sm font-medium">{selectedEntity?.name || 'Select Entity'}</span>
              <ChevronDown size={14} />
            </button>
            {entityDropdownOpen && (
              <div className="absolute top-full mt-1 left-0 w-64 bg-white border border-[#c0c0c0] rounded shadow-lg z-50">
                {entities.map(entity => (
                  <button
                    key={entity.id}
                    onClick={() => {
                      setSelectedEntity(entity);
                      setEntityDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-[#f0f0f0] ${
                      entity.id === selectedEntity?.id ? 'bg-[#e0e0e0]' : ''
                    }`}
                  >
                    <div className="font-medium">{entity.name}</div>
                    <div className="text-xs text-[#666]">
                      {entity.jurisdiction} • {entity.currency}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1 bg-white border border-[#c0c0c0] rounded hover:bg-[#f9f9f9]"
          >
            <div className="w-6 h-6 rounded-full bg-[#808080] flex items-center justify-center text-white text-xs font-medium">
              {currentUser?.name.charAt(0)}
            </div>
            <span className="text-sm font-medium">{currentUser?.name}</span>
            <ChevronDown size={14} />
          </button>
          {userDropdownOpen && (
            <div className="absolute top-full mt-1 right-0 w-64 bg-white border border-[#c0c0c0] rounded shadow-lg z-50">
              <div className="px-3 py-2 border-b border-[#e0e0e0]">
                <div className="text-sm font-medium">{currentUser?.name}</div>
                <div className="text-xs text-[#666] mt-0.5">{currentUser?.email}</div>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded border ${getRoleBadgeColor(currentUser?.role || '')}`}>
                    {currentUser?.role.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="px-3 py-2 text-xs text-[#666]">
                <div className="font-medium mb-1">Current Permissions:</div>
                <div className="text-xs space-y-0.5">
                  {currentUser?.role === 'admin' && <div>• Full access (Admin)</div>}
                  {currentUser?.role === 'accountant' && (
                    <>
                      <div>• Journal: Write</div>
                      <div>• Ledger: Read</div>
                      <div>• Reports: Read</div>
                    </>
                  )}
                  {currentUser?.role === 'auditor' && (
                    <>
                      <div>• Ledger: Read</div>
                      <div>• Audit Log: Read</div>
                      <div>• Reports: Read</div>
                    </>
                  )}
                  {currentUser?.role === 'viewer' && (
                    <>
                      <div>• Reports: Read</div>
                      <div>• Balance: Read</div>
                    </>
                  )}
                </div>
              </div>
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-[#f0f0f0] border-t border-[#e0e0e0]">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 bg-[#e8e8e8] border-r border-[#c0c0c0] overflow-y-auto">
            <nav className="p-2">
              {filteredNavItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded mb-1 text-sm transition-colors ${
                      isActive
                        ? 'bg-[#d0d0d0] text-[#1a1a1a] font-medium'
                        : 'text-[#333] hover:bg-[#d8d8d8]'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              </nav>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Breadcrumb */}
          <div className="h-10 bg-white border-b border-[#c0c0c0] flex items-center px-4">
            <div className="flex items-center gap-2 text-sm text-[#555]">
              {breadcrumb.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <span className="text-[#999]">›</span>}
                  <span className={index === breadcrumb.length - 1 ? 'text-[#1a1a1a] font-medium' : ''}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
